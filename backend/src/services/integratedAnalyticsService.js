// Integrated Analytics Service
// Combines Landing Page, SEO Keywords, and GA4 Analytics data
// Provides unified view of landing page performance

import pool from '../config/database.js';

/**
 * Get integrated performance data for a specific landing page
 * Combines landing page info, SEO keywords, GA4 analytics, and leads
 * @param {number} landingPageId - Landing page ID
 * @param {number} days - Number of days to look back (default 30)
 * @returns {Promise<Object>} Integrated performance data
 */
export async function getLandingPagePerformance(landingPageId, days = 30) {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // Get landing page info
    const landingPageResult = await pool.query(
      `SELECT id, title, slug, publish_status, published_url, created_at, published_at
       FROM landing_pages
       WHERE id = $1`,
      [landingPageId]
    );

    if (landingPageResult.rows.length === 0) {
      throw new Error('Landing page not found');
    }

    const landingPage = landingPageResult.rows[0];
    const pageUrl = `/public/${landingPage.slug}`;

    // Get SEO keyword performance for this landing page
    const keywordsResult = await pool.query(
      `SELECT
         keyword,
         SUM(clicks) as total_clicks,
         SUM(impressions) as total_impressions,
         AVG(ctr) as avg_ctr,
         AVG(position) as avg_position,
         COUNT(DISTINCT date) as days_tracked
       FROM seo_keywords
       WHERE url LIKE $1
       AND date BETWEEN $2 AND $3
       GROUP BY keyword
       ORDER BY total_clicks DESC
       LIMIT 10`,
      [`%${landingPage.slug}%`, startDate, endDate]
    );

    // Get GA4 page view data for this landing page
    const pageViewsResult = await pool.query(
      `SELECT
         SUM(views) as total_views,
         SUM(unique_views) as total_unique_views,
         AVG(avg_time_on_page) as avg_time_on_page,
         SUM(entrances) as total_entrances,
         SUM(exits) as total_exits,
         AVG(exit_rate) as avg_exit_rate
       FROM ga4_page_views
       WHERE page_path LIKE $1
       AND date BETWEEN $2 AND $3`,
      [`%${landingPage.slug}%`, startDate, endDate]
    );

    // Get GA4 events for this landing page (approximation - events don't have page_path)
    // We'll use the property's overall events as a proxy
    const eventsResult = await pool.query(
      `SELECT
         event_name,
         SUM(event_count) as total_count,
         SUM(conversion_count) as total_conversions
       FROM ga4_events
       WHERE date BETWEEN $1 AND $2
       GROUP BY event_name
       ORDER BY total_count DESC
       LIMIT 5`,
      [startDate, endDate]
    );

    // Get leads captured from this landing page
    const leadsResult = await pool.query(
      `SELECT
         COUNT(*) as total_leads,
         COUNT(*) FILTER (WHERE status = 'new') as new_leads,
         COUNT(*) FILTER (WHERE status = 'contacted') as contacted_leads,
         COUNT(*) FILTER (WHERE status = 'qualified') as qualified_leads,
         COUNT(*) FILTER (WHERE status = 'converted') as converted_leads
       FROM leads
       WHERE landing_page_id = $1
       AND created_at >= $2`,
      [landingPageId, startDate]
    );

    // Calculate conversion rate
    const totalViews = parseInt(pageViewsResult.rows[0]?.total_views || 0);
    const totalLeads = parseInt(leadsResult.rows[0]?.total_leads || 0);
    const conversionRate = totalViews > 0 ? (totalLeads / totalViews) * 100 : 0;

    return {
      landingPage: {
        id: landingPage.id,
        title: landingPage.title,
        slug: landingPage.slug,
        url: pageUrl,
        status: landingPage.publish_status,
        publishedUrl: landingPage.published_url,
        createdAt: landingPage.created_at,
        publishedAt: landingPage.published_at,
      },
      dateRange: {
        startDate,
        endDate,
        days,
      },
      seo: {
        topKeywords: keywordsResult.rows,
        totalClicks: keywordsResult.rows.reduce((sum, k) => sum + parseInt(k.total_clicks || 0), 0),
        totalImpressions: keywordsResult.rows.reduce((sum, k) => sum + parseInt(k.total_impressions || 0), 0),
        avgPosition: keywordsResult.rows.length > 0
          ? keywordsResult.rows.reduce((sum, k) => sum + parseFloat(k.avg_position || 0), 0) / keywordsResult.rows.length
          : 0,
      },
      analytics: {
        totalViews: totalViews,
        uniqueViews: parseInt(pageViewsResult.rows[0]?.total_unique_views || 0),
        avgTimeOnPage: parseFloat(pageViewsResult.rows[0]?.avg_time_on_page || 0),
        totalEntrances: parseInt(pageViewsResult.rows[0]?.total_entrances || 0),
        totalExits: parseInt(pageViewsResult.rows[0]?.total_exits || 0),
        exitRate: parseFloat(pageViewsResult.rows[0]?.avg_exit_rate || 0),
        topEvents: eventsResult.rows,
      },
      leads: {
        total: totalLeads,
        new: parseInt(leadsResult.rows[0]?.new_leads || 0),
        contacted: parseInt(leadsResult.rows[0]?.contacted_leads || 0),
        qualified: parseInt(leadsResult.rows[0]?.qualified_leads || 0),
        converted: parseInt(leadsResult.rows[0]?.converted_leads || 0),
      },
      performance: {
        conversionRate: conversionRate.toFixed(2),
        clicksToLeads: totalLeads > 0 && keywordsResult.rows.length > 0
          ? ((totalLeads / keywordsResult.rows.reduce((sum, k) => sum + parseInt(k.total_clicks || 0), 0)) * 100).toFixed(2)
          : 0,
      },
    };
  } catch (error) {
    console.error('Error getting integrated landing page performance:', error);
    throw error;
  }
}

/**
 * Get overview of all landing pages with basic performance metrics
 * @param {number} days - Number of days to look back
 * @returns {Promise<Array>} List of landing pages with performance data
 */
export async function getAllLandingPagesPerformance(days = 30) {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // Get all published landing pages
    const landingPagesResult = await pool.query(
      `SELECT id, title, slug, publish_status, published_at
       FROM landing_pages
       WHERE publish_status = 'published'
       ORDER BY published_at DESC`
    );

    const performanceData = [];

    for (const page of landingPagesResult.rows) {
      const pageUrl = `/public/${page.slug}`;

      // Get SEO clicks for this page
      const seoResult = await pool.query(
        `SELECT SUM(clicks) as total_clicks
         FROM seo_keywords
         WHERE url LIKE $1 AND date BETWEEN $2 AND $3`,
        [`%${page.slug}%`, startDate, endDate]
      );

      // Get analytics views for this page
      const analyticsResult = await pool.query(
        `SELECT SUM(views) as total_views
         FROM ga4_page_views
         WHERE page_path LIKE $1 AND date BETWEEN $2 AND $3`,
        [`%${page.slug}%`, startDate, endDate]
      );

      // Get leads count
      const leadsResult = await pool.query(
        `SELECT COUNT(*) as total_leads
         FROM leads
         WHERE landing_page_id = $1 AND created_at >= $2`,
        [page.id, startDate]
      );

      const totalViews = parseInt(analyticsResult.rows[0]?.total_views || 0);
      const totalLeads = parseInt(leadsResult.rows[0]?.total_leads || 0);
      const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(2) : '0.00';

      performanceData.push({
        id: page.id,
        title: page.title,
        slug: page.slug,
        url: pageUrl,
        status: page.publish_status,
        publishedAt: page.published_at,
        seoClicks: parseInt(seoResult.rows[0]?.total_clicks || 0),
        analyticsViews: totalViews,
        leads: totalLeads,
        conversionRate: conversionRate,
      });
    }

    return performanceData;
  } catch (error) {
    console.error('Error getting all landing pages performance:', error);
    throw error;
  }
}
