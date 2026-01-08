// SEO Dashboard Service
// Unified dashboard combining SEO keywords, GA4 analytics, and lead data
// Provides comprehensive insights for marketing automation

import pool from '../config/database.js';

/**
 * Get unified SEO dashboard data
 * Combines data from multiple sources: Search Console, GA4, Leads
 * @param {number} days - Number of days to look back (default 30)
 * @returns {Promise<Object>} Unified dashboard data
 */
export async function getSeoDashboard(days = 30) {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // Execute all queries in parallel for better performance
    const [
      keywordMetrics,
      trafficTrends,
      trafficSources,
      topKeywords,
      topPages,
      leadMetrics,
      keywordTrends
    ] = await Promise.all([
      getKeywordMetrics(startDate, endDate),
      getTrafficTrends(startDate, endDate),
      getTrafficSources(startDate, endDate),
      getTopKeywords(startDate, endDate, 10),
      getTopPages(startDate, endDate, 10),
      getLeadMetrics(startDate, endDate),
      getKeywordRankingTrends(startDate, endDate)
    ]);

    // Calculate quick stats
    const quickStats = {
      totalKeywords: keywordMetrics.totalKeywords,
      avgPosition: keywordMetrics.avgPosition,
      totalImpressions: keywordMetrics.totalImpressions,
      totalClicks: keywordMetrics.totalClicks,
      avgCTR: keywordMetrics.avgCTR,
      totalPageViews: trafficTrends.totalPageViews,
      totalSessions: trafficTrends.totalSessions,
      avgSessionDuration: trafficTrends.avgSessionDuration,
      totalLeads: leadMetrics.totalLeads,
      conversionRate: trafficTrends.totalPageViews > 0
        ? ((leadMetrics.totalLeads / trafficTrends.totalPageViews) * 100).toFixed(2)
        : '0.00'
    };

    return {
      dateRange: {
        startDate,
        endDate,
        days
      },
      quickStats,
      keywordMetrics,
      trafficTrends: trafficTrends.dailyData,
      trafficSources,
      topKeywords,
      topPages,
      leadMetrics,
      keywordTrends
    };
  } catch (error) {
    console.error('Error getting SEO dashboard:', error);
    throw error;
  }
}

/**
 * Get keyword performance metrics from Search Console
 */
async function getKeywordMetrics(startDate, endDate) {
  const result = await pool.query(
    `SELECT
      COUNT(DISTINCT keyword) as total_keywords,
      SUM(impressions) as total_impressions,
      SUM(clicks) as total_clicks,
      AVG(ctr) as avg_ctr,
      AVG(position) as avg_position
    FROM seo_keywords
    WHERE date BETWEEN $1 AND $2`,
    [startDate, endDate]
  );

  const row = result.rows[0];
  return {
    totalKeywords: parseInt(row.total_keywords || 0),
    totalImpressions: parseInt(row.total_impressions || 0),
    totalClicks: parseInt(row.total_clicks || 0),
    avgCTR: parseFloat(row.avg_ctr || 0).toFixed(2),
    avgPosition: parseFloat(row.avg_position || 0).toFixed(1)
  };
}

/**
 * Get daily traffic trends from GA4
 */
async function getTrafficTrends(startDate, endDate) {
  // Get daily aggregated data
  const dailyResult = await pool.query(
    `SELECT
      date,
      SUM(views) as daily_views,
      SUM(unique_views) as daily_unique_views,
      AVG(avg_time_on_page) as daily_avg_time
    FROM ga4_page_views
    WHERE date BETWEEN $1 AND $2
    GROUP BY date
    ORDER BY date ASC`,
    [startDate, endDate]
  );

  // Get session data
  const sessionResult = await pool.query(
    `SELECT
      SUM(session_count) as total_sessions,
      AVG(avg_session_duration) as avg_duration
    FROM ga4_sessions
    WHERE date BETWEEN $1 AND $2`,
    [startDate, endDate]
  );

  const sessionData = sessionResult.rows[0];
  const totalPageViews = dailyResult.rows.reduce((sum, row) => sum + parseInt(row.daily_views || 0), 0);

  return {
    totalPageViews,
    totalSessions: parseInt(sessionData?.total_sessions || 0),
    avgSessionDuration: parseFloat(sessionData?.avg_duration || 0).toFixed(2),
    dailyData: dailyResult.rows.map(row => ({
      date: row.date,
      pageViews: parseInt(row.daily_views || 0),
      uniqueViews: parseInt(row.daily_unique_views || 0),
      avgTime: parseFloat(row.daily_avg_time || 0).toFixed(2)
    }))
  };
}

/**
 * Get traffic sources breakdown from GA4
 */
async function getTrafficSources(startDate, endDate) {
  const result = await pool.query(
    `SELECT
      traffic_source,
      SUM(session_count) as sessions
    FROM ga4_sessions
    WHERE date BETWEEN $1 AND $2
    AND traffic_source IS NOT NULL
    GROUP BY traffic_source
    ORDER BY sessions DESC`,
    [startDate, endDate]
  );

  return result.rows.map(row => ({
    source: row.traffic_source || 'Direct',
    sessions: parseInt(row.sessions || 0)
  }));
}

/**
 * Get top performing keywords
 */
async function getTopKeywords(startDate, endDate, limit = 10) {
  const result = await pool.query(
    `SELECT
      keyword,
      SUM(impressions) as total_impressions,
      SUM(clicks) as total_clicks,
      AVG(ctr) as avg_ctr,
      AVG(position) as avg_position
    FROM seo_keywords
    WHERE date BETWEEN $1 AND $2
    GROUP BY keyword
    ORDER BY total_clicks DESC
    LIMIT $3`,
    [startDate, endDate, limit]
  );

  return result.rows.map(row => ({
    keyword: row.keyword,
    impressions: parseInt(row.total_impressions || 0),
    clicks: parseInt(row.total_clicks || 0),
    ctr: parseFloat(row.avg_ctr || 0).toFixed(2),
    position: parseFloat(row.avg_position || 0).toFixed(1)
  }));
}

/**
 * Get top performing pages
 */
async function getTopPages(startDate, endDate, limit = 10) {
  const result = await pool.query(
    `SELECT
      page_path,
      page_title,
      SUM(views) as total_views,
      SUM(unique_views) as total_unique_views,
      AVG(avg_time_on_page) as avg_time,
      AVG(exit_rate) as avg_exit_rate
    FROM ga4_page_views
    WHERE date BETWEEN $1 AND $2
    GROUP BY page_path, page_title
    ORDER BY total_views DESC
    LIMIT $3`,
    [startDate, endDate, limit]
  );

  return result.rows.map(row => ({
    pagePath: row.page_path,
    pageTitle: row.page_title || 'Untitled',
    views: parseInt(row.total_views || 0),
    uniqueViews: parseInt(row.total_unique_views || 0),
    avgTime: parseFloat(row.avg_time || 0).toFixed(2),
    exitRate: parseFloat(row.avg_exit_rate || 0).toFixed(2)
  }));
}

/**
 * Get lead metrics
 */
async function getLeadMetrics(startDate, endDate) {
  const result = await pool.query(
    `SELECT
      COUNT(*) as total_leads,
      COUNT(*) FILTER (WHERE status = 'new') as new_leads,
      COUNT(*) FILTER (WHERE status = 'contacted') as contacted_leads,
      COUNT(*) FILTER (WHERE status = 'qualified') as qualified_leads,
      COUNT(*) FILTER (WHERE status = 'converted') as converted_leads
    FROM leads
    WHERE created_at >= $1`,
    [startDate]
  );

  const row = result.rows[0];
  return {
    totalLeads: parseInt(row.total_leads || 0),
    newLeads: parseInt(row.new_leads || 0),
    contactedLeads: parseInt(row.contacted_leads || 0),
    qualifiedLeads: parseInt(row.qualified_leads || 0),
    convertedLeads: parseInt(row.converted_leads || 0)
  };
}

/**
 * Get keyword ranking trends over time (for chart)
 */
async function getKeywordRankingTrends(startDate, endDate) {
  // Get top 5 keywords by clicks
  const topKeywordsResult = await pool.query(
    `SELECT keyword
    FROM seo_keywords
    WHERE date BETWEEN $1 AND $2
    GROUP BY keyword
    ORDER BY SUM(clicks) DESC
    LIMIT 5`,
    [startDate, endDate]
  );

  const topKeywords = topKeywordsResult.rows.map(row => row.keyword);

  if (topKeywords.length === 0) {
    return [];
  }

  // Get daily positions for these keywords
  const trendsResult = await pool.query(
    `SELECT
      keyword,
      date,
      AVG(position) as avg_position
    FROM seo_keywords
    WHERE date BETWEEN $1 AND $2
    AND keyword = ANY($3)
    GROUP BY keyword, date
    ORDER BY date ASC, keyword`,
    [startDate, endDate, topKeywords]
  );

  // Group by date for chart
  const trendsByDate = {};
  trendsResult.rows.forEach(row => {
    if (!trendsByDate[row.date]) {
      trendsByDate[row.date] = { date: row.date };
    }
    trendsByDate[row.date][row.keyword] = parseFloat(row.avg_position).toFixed(1);
  });

  return Object.values(trendsByDate);
}
