// Google Analytics 4 (GA4) Service
// Task 4: Google Analytics Integration
// Handles GA4 Data API interactions for metrics, properties, and reporting

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import pool from '../config/database.js';

/**
 * Get authenticated GA4 client for a user
 * @param {number} userId - User ID
 * @returns {Promise<BetaAnalyticsDataClient>}
 */
async function getGA4Client(userId) {
  try {
    // Fetch user's credentials from database
    const query = `
      SELECT access_token, refresh_token, token_expiry
      FROM google_credentials
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      throw new Error('Google account not connected. Please authenticate first.');
    }

    const credential = result.rows[0];

    // Create GA4 client with credentials object
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        type: 'authorized_user',
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: credential.refresh_token,
      },
    });

    return analyticsDataClient;
  } catch (error) {
    console.error('Error creating GA4 client:', error);
    throw new Error('Failed to authenticate with Google Analytics');
  }
}

/**
 * List all GA4 properties for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of GA4 properties
 */
export async function listGA4Properties(userId) {
  try {
    // Return properties from our database
    const result = await pool.query(
      'SELECT * FROM ga4_properties WHERE user_id = $1 AND is_active = TRUE ORDER BY created_at DESC',
      [userId]
    );

    return result.rows;
  } catch (error) {
    console.error('Error listing GA4 properties:', error);
    throw error;
  }
}

/**
 * Add a GA4 property to the database
 * @param {number} userId - User ID
 * @param {Object} propertyData - Property information
 * @returns {Promise<Object>} Created property
 */
export async function addGA4Property(userId, propertyData) {
  const { propertyId, propertyName, websiteUrl, timezone, currencyCode } = propertyData;

  try {
    const result = await pool.query(
      `INSERT INTO ga4_properties
       (user_id, property_id, property_name, website_url, timezone, currency_code)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_id, property_id)
       DO UPDATE SET
         property_name = EXCLUDED.property_name,
         website_url = EXCLUDED.website_url,
         timezone = EXCLUDED.timezone,
         currency_code = EXCLUDED.currency_code,
         is_active = TRUE,
         updated_at = NOW()
       RETURNING *`,
      [userId, propertyId, propertyName, websiteUrl, timezone, currencyCode]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error adding GA4 property:', error);
    throw error;
  }
}

/**
 * Fetch and store GA4 metrics for a property
 * @param {number} userId - User ID
 * @param {string} propertyId - GA4 Property ID (format: properties/123456789)
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Sync results
 */
export async function syncGA4Metrics(userId, propertyId, startDate, endDate) {
  try {
    const client = await getGA4Client(userId);

    // Request GA4 metrics
    const [response] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'engagedSessions' },
        { name: 'engagementRate' },
        { name: 'averageSessionDuration' },
        { name: 'screenPageViewsPerSession' },
        { name: 'bounceRate' },
        { name: 'conversions' },
        { name: 'totalRevenue' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'deviceCategory',
          stringFilter: { value: 'desktop' },
        },
      },
    });

    // Get device breakdown
    const [deviceResponse] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: 'date' }, { name: 'deviceCategory' }],
      metrics: [{ name: 'activeUsers' }],
    });

    // Process and store metrics
    let rowsStored = 0;
    const metricsMap = new Map();

    // Process main metrics
    if (response.rows) {
      for (const row of response.rows) {
        const date = row.dimensionValues[0].value;
        const metrics = {
          users: parseInt(row.metricValues[0].value) || 0,
          new_users: parseInt(row.metricValues[1].value) || 0,
          sessions: parseInt(row.metricValues[2].value) || 0,
          engaged_sessions: parseInt(row.metricValues[3].value) || 0,
          engagement_rate: parseFloat(row.metricValues[4].value) || 0,
          avg_session_duration: parseFloat(row.metricValues[5].value) || 0,
          pages_per_session: parseFloat(row.metricValues[6].value) || 0,
          bounce_rate: parseFloat(row.metricValues[7].value) || 0,
          conversions: parseInt(row.metricValues[8].value) || 0,
          total_revenue: parseFloat(row.metricValues[9].value) || 0,
          desktop_users: 0,
          mobile_users: 0,
          tablet_users: 0,
        };

        metricsMap.set(date, metrics);
      }
    }

    // Process device breakdown
    if (deviceResponse.rows) {
      for (const row of deviceResponse.rows) {
        const date = row.dimensionValues[0].value;
        const device = row.dimensionValues[1].value.toLowerCase();
        const users = parseInt(row.metricValues[0].value) || 0;

        if (metricsMap.has(date)) {
          const metrics = metricsMap.get(date);
          if (device === 'desktop') metrics.desktop_users = users;
          else if (device === 'mobile') metrics.mobile_users = users;
          else if (device === 'tablet') metrics.tablet_users = users;
        }
      }
    }

    // Store in database
    for (const [date, metrics] of metricsMap) {
      await pool.query(
        `INSERT INTO ga4_metrics
         (property_id, date, users, new_users, sessions, engaged_sessions,
          engagement_rate, avg_session_duration, pages_per_session, bounce_rate,
          conversions, total_revenue, desktop_users, mobile_users, tablet_users)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (property_id, date)
         DO UPDATE SET
           users = EXCLUDED.users,
           new_users = EXCLUDED.new_users,
           sessions = EXCLUDED.sessions,
           engaged_sessions = EXCLUDED.engaged_sessions,
           engagement_rate = EXCLUDED.engagement_rate,
           avg_session_duration = EXCLUDED.avg_session_duration,
           pages_per_session = EXCLUDED.pages_per_session,
           bounce_rate = EXCLUDED.bounce_rate,
           conversions = EXCLUDED.conversions,
           total_revenue = EXCLUDED.total_revenue,
           desktop_users = EXCLUDED.desktop_users,
           mobile_users = EXCLUDED.mobile_users,
           tablet_users = EXCLUDED.tablet_users`,
        [
          propertyId, date, metrics.users, metrics.new_users, metrics.sessions,
          metrics.engaged_sessions, metrics.engagement_rate, metrics.avg_session_duration,
          metrics.pages_per_session, metrics.bounce_rate, metrics.conversions,
          metrics.total_revenue, metrics.desktop_users, metrics.mobile_users, metrics.tablet_users
        ]
      );
      rowsStored++;
    }

    return {
      success: true,
      rowsStored,
      dateRange: { startDate, endDate },
    };
  } catch (error) {
    console.error('Error syncing GA4 metrics:', error);
    throw error;
  }
}

/**
 * Fetch and store GA4 page views
 * @param {number} userId - User ID
 * @param {string} propertyId - GA4 Property ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Sync results
 */
export async function syncGA4PageViews(userId, propertyId, startDate, endDate) {
  try {
    const client = await getGA4Client(userId);

    const [response] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'date' },
        { name: 'pagePath' },
        { name: 'pageTitle' },
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
        { name: 'entrances' },
        { name: 'exits' },
      ],
      limit: 1000,
    });

    let rowsStored = 0;

    if (response.rows) {
      for (const row of response.rows) {
        const date = row.dimensionValues[0].value;
        const pagePath = row.dimensionValues[1].value;
        const pageTitle = row.dimensionValues[2].value;
        const views = parseInt(row.metricValues[0].value) || 0;
        const uniqueViews = parseInt(row.metricValues[1].value) || 0;
        const avgTimeOnPage = parseFloat(row.metricValues[2].value) || 0;
        const entrances = parseInt(row.metricValues[3].value) || 0;
        const exits = parseInt(row.metricValues[4].value) || 0;
        const exitRate = views > 0 ? (exits / views) * 100 : 0;

        await pool.query(
          `INSERT INTO ga4_page_views
           (property_id, date, page_path, page_title, views, unique_views,
            avg_time_on_page, entrances, exits, exit_rate)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT (property_id, date, page_path)
           DO UPDATE SET
             page_title = EXCLUDED.page_title,
             views = EXCLUDED.views,
             unique_views = EXCLUDED.unique_views,
             avg_time_on_page = EXCLUDED.avg_time_on_page,
             entrances = EXCLUDED.entrances,
             exits = EXCLUDED.exits,
             exit_rate = EXCLUDED.exit_rate`,
          [propertyId, date, pagePath, pageTitle, views, uniqueViews,
           avgTimeOnPage, entrances, exits, exitRate]
        );
        rowsStored++;
      }
    }

    return {
      success: true,
      rowsStored,
      dateRange: { startDate, endDate },
    };
  } catch (error) {
    console.error('Error syncing GA4 page views:', error);
    throw error;
  }
}

/**
 * Fetch and store GA4 events
 * @param {number} userId - User ID
 * @param {string} propertyId - GA4 Property ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Sync results
 */
export async function syncGA4Events(userId, propertyId, startDate, endDate) {
  try {
    const client = await getGA4Client(userId);

    const [response] = await client.runReport({
      property: propertyId,
      dateRanges: [{ startDate, endDate }],
      dimensions: [
        { name: 'date' },
        { name: 'eventName' },
      ],
      metrics: [
        { name: 'eventCount' },
        { name: 'activeUsers' },
        { name: 'eventValue' },
        { name: 'conversions' },
      ],
      limit: 1000,
    });

    let rowsStored = 0;

    if (response.rows) {
      for (const row of response.rows) {
        const date = row.dimensionValues[0].value;
        const eventName = row.dimensionValues[1].value;
        const eventCount = parseInt(row.metricValues[0].value) || 0;
        const uniqueUsers = parseInt(row.metricValues[1].value) || 0;
        const eventValue = parseFloat(row.metricValues[2].value) || 0;
        const conversionCount = parseInt(row.metricValues[3].value) || 0;

        await pool.query(
          `INSERT INTO ga4_events
           (property_id, date, event_name, event_count, unique_users, event_value, conversion_count)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (property_id, date, event_name)
           DO UPDATE SET
             event_count = EXCLUDED.event_count,
             unique_users = EXCLUDED.unique_users,
             event_value = EXCLUDED.event_value,
             conversion_count = EXCLUDED.conversion_count`,
          [propertyId, date, eventName, eventCount, uniqueUsers, eventValue, conversionCount]
        );
        rowsStored++;
      }
    }

    return {
      success: true,
      rowsStored,
      dateRange: { startDate, endDate },
    };
  } catch (error) {
    console.error('Error syncing GA4 events:', error);
    throw error;
  }
}

/**
 * Get GA4 metrics from database
 * @param {string} propertyId - GA4 Property ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Metrics data
 */
export async function getGA4Metrics(propertyId, startDate, endDate) {
  try {
    const result = await pool.query(
      `SELECT * FROM ga4_metrics
       WHERE property_id = $1
       AND date BETWEEN $2 AND $3
       ORDER BY date DESC`,
      [propertyId, startDate, endDate]
    );

    return result.rows;
  } catch (error) {
    console.error('Error fetching GA4 metrics:', error);
    throw error;
  }
}

/**
 * Get GA4 page views from database
 * @param {string} propertyId - GA4 Property ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} Page views data
 */
export async function getGA4PageViews(propertyId, startDate, endDate, limit = 100) {
  try {
    const result = await pool.query(
      `SELECT * FROM ga4_page_views
       WHERE property_id = $1
       AND date BETWEEN $2 AND $3
       ORDER BY views DESC
       LIMIT $4`,
      [propertyId, startDate, endDate, limit]
    );

    return result.rows;
  } catch (error) {
    console.error('Error fetching GA4 page views:', error);
    throw error;
  }
}

/**
 * Get GA4 events from database
 * @param {string} propertyId - GA4 Property ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} Events data
 */
export async function getGA4Events(propertyId, startDate, endDate, limit = 100) {
  try {
    const result = await pool.query(
      `SELECT * FROM ga4_events
       WHERE property_id = $1
       AND date BETWEEN $2 AND $3
       ORDER BY event_count DESC
       LIMIT $4`,
      [propertyId, startDate, endDate, limit]
    );

    return result.rows;
  } catch (error) {
    console.error('Error fetching GA4 events:', error);
    throw error;
  }
}

/**
 * Get analytics dashboard summary
 * @param {string} propertyId - GA4 Property ID
 * @param {number} days - Number of days to look back
 * @returns {Promise<Object>} Dashboard summary
 */
export async function getAnalyticsDashboard(propertyId, days = 30) {
  try {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // Get aggregated metrics
    const metricsResult = await pool.query(
      `SELECT
         SUM(users) as total_users,
         SUM(new_users) as total_new_users,
         SUM(sessions) as total_sessions,
         AVG(engagement_rate) as avg_engagement_rate,
         AVG(avg_session_duration) as avg_session_duration,
         SUM(conversions) as total_conversions,
         SUM(total_revenue) as total_revenue,
         SUM(desktop_users) as desktop_users,
         SUM(mobile_users) as mobile_users,
         SUM(tablet_users) as tablet_users
       FROM ga4_metrics
       WHERE property_id = $1
       AND date BETWEEN $2 AND $3`,
      [propertyId, startDate, endDate]
    );

    // Get top pages
    const topPagesResult = await pool.query(
      `SELECT page_path, page_title, SUM(views) as total_views
       FROM ga4_page_views
       WHERE property_id = $1
       AND date BETWEEN $2 AND $3
       GROUP BY page_path, page_title
       ORDER BY total_views DESC
       LIMIT 10`,
      [propertyId, startDate, endDate]
    );

    // Get top events
    const topEventsResult = await pool.query(
      `SELECT event_name, SUM(event_count) as total_count
       FROM ga4_events
       WHERE property_id = $1
       AND date BETWEEN $2 AND $3
       GROUP BY event_name
       ORDER BY total_count DESC
       LIMIT 10`,
      [propertyId, startDate, endDate]
    );

    return {
      summary: metricsResult.rows[0] || {},
      topPages: topPagesResult.rows,
      topEvents: topEventsResult.rows,
      dateRange: { startDate, endDate },
    };
  } catch (error) {
    console.error('Error fetching analytics dashboard:', error);
    throw error;
  }
}
