// Search Console Service
// Task 3: Google Search Console Integration
// Fetches keyword performance and indexing data from Google Search Console

import { getSearchConsoleClient } from './googleApi.js';
import pool from '../config/database.js';

/**
 * Fetch keyword performance data from Search Console
 * @param {number} userId - User ID
 * @param {string} siteUrl - Site URL from Search Console
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @param {Object} options - Additional options (dimensions, filters, limit)
 * @returns {Promise<Array>} Keyword performance data
 */
export async function fetchKeywordData(userId, siteUrl, startDate, endDate, options = {}) {
  try {
    const searchConsole = await getSearchConsoleClient(userId);

    // Build request
    const requestBody = {
      startDate,
      endDate,
      dimensions: options.dimensions || ['query', 'page'],
      rowLimit: options.limit || 1000,
      startRow: options.startRow || 0,
    };

    // Add optional filters
    if (options.filters) {
      requestBody.dimensionFilterGroups = options.filters;
    }

    // Fetch data from Search Console API
    const response = await searchConsole.searchanalytics.query({
      siteUrl,
      requestBody,
    });

    return response.data.rows || [];
  } catch (error) {
    console.error('Error fetching keyword data from Search Console:', error);
    throw new Error(`Failed to fetch keyword data: ${error.message}`);
  }
}

/**
 * Store keyword data in database
 * @param {Array} keywordData - Keyword data from Search Console
 * @param {string} date - Date for the data (YYYY-MM-DD)
 * @returns {Promise<number>} Number of rows inserted/updated
 */
export async function storeKeywordData(keywordData, date) {
  try {
    let insertedCount = 0;

    for (const row of keywordData) {
      const keyword = row.keys[0]; // First dimension is query
      const url = row.keys[1] || null; // Second dimension is page (if included)

      const query = `
        INSERT INTO seo_keywords
          (keyword, url, impressions, clicks, ctr, position, date, country, device, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
        ON CONFLICT (keyword, url, date, country, device)
        DO UPDATE SET
          impressions = EXCLUDED.impressions,
          clicks = EXCLUDED.clicks,
          ctr = EXCLUDED.ctr,
          position = EXCLUDED.position
      `;

      const values = [
        keyword,
        url,
        row.impressions || 0,
        row.clicks || 0,
        row.ctr ? (row.ctr * 100).toFixed(2) : 0, // Convert to percentage
        row.position ? row.position.toFixed(2) : null,
        date,
        null, // country (can be added as dimension)
        null, // device (can be added as dimension)
      ];

      await pool.query(query, values);
      insertedCount++;
    }

    return insertedCount;
  } catch (error) {
    console.error('Error storing keyword data:', error);
    throw new Error(`Failed to store keyword data: ${error.message}`);
  }
}

/**
 * Fetch and store keyword data for a date range
 * @param {number} userId - User ID
 * @param {string} siteUrl - Site URL from Search Console
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Object>} Summary of sync operation
 */
export async function syncKeywordData(userId, siteUrl, startDate, endDate) {
  try {
    console.log(`Syncing keyword data for ${siteUrl} from ${startDate} to ${endDate}`);

    // Fetch keyword data from Search Console
    const keywordData = await fetchKeywordData(userId, siteUrl, startDate, endDate);

    if (!keywordData || keywordData.length === 0) {
      return {
        success: true,
        rowsFetched: 0,
        rowsStored: 0,
        message: 'No keyword data available for the specified date range',
      };
    }

    // Store in database
    const rowsStored = await storeKeywordData(keywordData, endDate);

    console.log(`✓ Synced ${rowsStored} keyword records`);

    return {
      success: true,
      rowsFetched: keywordData.length,
      rowsStored,
      message: `Successfully synced ${rowsStored} keyword records`,
    };
  } catch (error) {
    console.error('Error syncing keyword data:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Fetch indexing issues from Search Console
 * @param {number} userId - User ID
 * @param {string} siteUrl - Site URL from Search Console
 * @returns {Promise<Array>} List of indexing issues
 */
export async function fetchIndexingIssues(userId, siteUrl) {
  try {
    const searchConsole = await getSearchConsoleClient(userId);

    // Note: The Index Status API is deprecated. We'll use URL Inspection API instead
    // For now, we'll return a placeholder structure
    // In production, you would call searchConsole.urlInspection.index.inspect() for specific URLs

    // This is a simplified version - real implementation would inspect multiple URLs
    console.log('Fetching indexing issues for:', siteUrl);

    // Placeholder - in real implementation, you'd inspect URLs from your sitemap
    return [];
  } catch (error) {
    console.error('Error fetching indexing issues:', error);
    throw new Error(`Failed to fetch indexing issues: ${error.message}`);
  }
}

/**
 * Store indexing issues in database
 * @param {Array} issues - Indexing issues data
 * @returns {Promise<number>} Number of rows inserted/updated
 */
export async function storeIndexingIssues(issues) {
  try {
    let insertedCount = 0;

    for (const issue of issues) {
      const query = `
        INSERT INTO seo_indexing_issues
          (url, issue_type, severity, description, detected_date, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (url, issue_type, detected_date)
        DO UPDATE SET
          severity = EXCLUDED.severity,
          description = EXCLUDED.description,
          status = CASE
            WHEN seo_indexing_issues.status = 'resolved' THEN 'resolved'
            ELSE EXCLUDED.status
          END
      `;

      const values = [
        issue.url,
        issue.issueType,
        issue.severity || 'warning',
        issue.description,
        issue.detectedDate || new Date().toISOString().split('T')[0],
        issue.status || 'open',
      ];

      await pool.query(query, values);
      insertedCount++;
    }

    return insertedCount;
  } catch (error) {
    console.error('Error storing indexing issues:', error);
    throw new Error(`Failed to store indexing issues: ${error.message}`);
  }
}

/**
 * Get keyword performance data from database
 * @param {Object} filters - Filter options (startDate, endDate, keyword, url, limit, offset)
 * @returns {Promise<Array>} Keyword performance data
 */
export async function getKeywordPerformance(filters = {}) {
  try {
    let query = `
      SELECT
        keyword,
        url,
        SUM(impressions) as total_impressions,
        SUM(clicks) as total_clicks,
        AVG(ctr) as avg_ctr,
        AVG(position) as avg_position,
        MIN(date) as first_seen,
        MAX(date) as last_seen,
        COUNT(*) as data_points
      FROM seo_keywords
      WHERE 1=1
    `;

    const values = [];
    let paramIndex = 1;

    // Add filters
    if (filters.startDate) {
      query += ` AND date >= $${paramIndex}`;
      values.push(filters.startDate);
      paramIndex++;
    }

    if (filters.endDate) {
      query += ` AND date <= $${paramIndex}`;
      values.push(filters.endDate);
      paramIndex++;
    }

    if (filters.keyword) {
      query += ` AND keyword ILIKE $${paramIndex}`;
      values.push(`%${filters.keyword}%`);
      paramIndex++;
    }

    if (filters.url) {
      query += ` AND url ILIKE $${paramIndex}`;
      values.push(`%${filters.url}%`);
      paramIndex++;
    }

    query += `
      GROUP BY keyword, url
      ORDER BY total_impressions DESC
      LIMIT ${filters.limit || 100}
      OFFSET ${filters.offset || 0}
    `;

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error getting keyword performance:', error);
    throw new Error(`Failed to get keyword performance: ${error.message}`);
  }
}

/**
 * Get keyword ranking trends
 * @param {string} keyword - Keyword to track
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<Array>} Daily ranking data
 */
export async function getKeywordTrend(keyword, days = 30) {
  try {
    const query = `
      SELECT
        date,
        AVG(position) as avg_position,
        SUM(impressions) as impressions,
        SUM(clicks) as clicks,
        AVG(ctr) as ctr
      FROM seo_keywords
      WHERE keyword = $1
        AND date >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY date
      ORDER BY date ASC
    `;

    const result = await pool.query(query, [keyword]);
    return result.rows;
  } catch (error) {
    console.error('Error getting keyword trend:', error);
    throw new Error(`Failed to get keyword trend: ${error.message}`);
  }
}

/**
 * Get top performing keywords
 * @param {number} limit - Number of top keywords to return (default: 10)
 * @param {string} sortBy - Sort by metric (impressions, clicks, ctr)
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<Array>} Top keywords
 */
export async function getTopKeywords(limit = 10, sortBy = 'clicks', days = 30) {
  try {
    const validSortFields = {
      impressions: 'total_impressions',
      clicks: 'total_clicks',
      ctr: 'avg_ctr',
    };

    const sortField = validSortFields[sortBy] || 'total_clicks';

    const query = `
      SELECT
        keyword,
        SUM(impressions) as total_impressions,
        SUM(clicks) as total_clicks,
        AVG(ctr) as avg_ctr,
        AVG(position) as avg_position
      FROM seo_keywords
      WHERE date >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY keyword
      ORDER BY ${sortField} DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  } catch (error) {
    console.error('Error getting top keywords:', error);
    throw new Error(`Failed to get top keywords: ${error.message}`);
  }
}

/**
 * Get declining keywords (ranking position increasing = worse)
 * @param {number} limit - Number of declining keywords to return
 * @param {number} days - Number of days to compare (default: 30)
 * @returns {Promise<Array>} Declining keywords
 */
export async function getDecliningKeywords(limit = 10, days = 30) {
  try {
    const query = `
      WITH recent_data AS (
        SELECT
          keyword,
          AVG(position) as recent_position
        FROM seo_keywords
        WHERE date >= CURRENT_DATE - INTERVAL '${days} days'
          AND date >= CURRENT_DATE - INTERVAL '${days / 2} days'
        GROUP BY keyword
      ),
      older_data AS (
        SELECT
          keyword,
          AVG(position) as older_position
        FROM seo_keywords
        WHERE date >= CURRENT_DATE - INTERVAL '${days} days'
          AND date < CURRENT_DATE - INTERVAL '${days / 2} days'
        GROUP BY keyword
      )
      SELECT
        recent_data.keyword,
        recent_data.recent_position,
        older_data.older_position,
        (recent_data.recent_position - older_data.older_position) as position_change
      FROM recent_data
      JOIN older_data ON recent_data.keyword = older_data.keyword
      WHERE (recent_data.recent_position - older_data.older_position) > 0
      ORDER BY position_change DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limit]);
    return result.rows;
  } catch (error) {
    console.error('Error getting declining keywords:', error);
    throw new Error(`Failed to get declining keywords: ${error.message}`);
  }
}

/**
 * Get indexing issues from database
 * @param {Object} filters - Filter options (status, severity, limit, offset)
 * @returns {Promise<Array>} Indexing issues
 */
export async function getIndexingIssues(filters = {}) {
  try {
    let query = `
      SELECT *
      FROM seo_indexing_issues
      WHERE 1=1
    `;

    const values = [];
    let paramIndex = 1;

    if (filters.status) {
      query += ` AND status = $${paramIndex}`;
      values.push(filters.status);
      paramIndex++;
    }

    if (filters.severity) {
      query += ` AND severity = $${paramIndex}`;
      values.push(filters.severity);
      paramIndex++;
    }

    query += `
      ORDER BY detected_date DESC, severity DESC
      LIMIT ${filters.limit || 100}
      OFFSET ${filters.offset || 0}
    `;

    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    console.error('Error getting indexing issues:', error);
    throw new Error(`Failed to get indexing issues: ${error.message}`);
  }
}

export default {
  fetchKeywordData,
  storeKeywordData,
  syncKeywordData,
  fetchIndexingIssues,
  storeIndexingIssues,
  getKeywordPerformance,
  getKeywordTrend,
  getTopKeywords,
  getDecliningKeywords,
  getIndexingIssues,
};
