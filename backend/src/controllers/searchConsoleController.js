// Search Console Controller
// Task 3: Google Search Console Integration
// Handles API requests for keyword tracking and indexing issues

import searchConsoleService from '../services/searchConsoleService.js';
import { testSearchConsoleConnection } from '../services/googleApi.js';

/**
 * Get list of Search Console sites for the authenticated user
 * GET /api/admin/seo/search-console/sites
 */
export const getSites = async (req, res) => {
  try {
    const userId = req.user.id;

    const sitesData = await testSearchConsoleConnection(userId);

    res.json({
      success: true,
      data: {
        sites: sitesData.siteEntry || [],
        message: 'Successfully retrieved Search Console sites',
      },
    });
  } catch (error) {
    console.error('Get sites error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'SITES_FETCH_FAILED',
      },
    });
  }
};

/**
 * Sync keyword data from Search Console
 * POST /api/admin/seo/search-console/sync
 */
export const syncKeywords = async (req, res) => {
  try {
    const userId = req.user.id;
    const { siteUrl, startDate, endDate } = req.body;

    // Validation
    if (!siteUrl) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'siteUrl is required',
          code: 'VALIDATION_ERROR',
        },
      });
    }

    // Default to last 30 days if dates not provided
    const end = endDate || new Date().toISOString().split('T')[0];
    const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const result = await searchConsoleService.syncKeywordData(userId, siteUrl, start, end);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: {
          message: result.error,
          code: 'SYNC_FAILED',
        },
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Sync keywords error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'SYNC_KEYWORDS_FAILED',
      },
    });
  }
};

/**
 * Get keyword performance data
 * GET /api/admin/seo/keywords
 */
export const getKeywords = async (req, res) => {
  try {
    const { startDate, endDate, keyword, url, limit, offset } = req.query;

    const filters = {
      startDate,
      endDate,
      keyword,
      url,
      limit: parseInt(limit) || 100,
      offset: parseInt(offset) || 0,
    };

    const keywords = await searchConsoleService.getKeywordPerformance(filters);

    res.json({
      success: true,
      data: {
        keywords,
        count: keywords.length,
        filters,
      },
    });
  } catch (error) {
    console.error('Get keywords error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'GET_KEYWORDS_FAILED',
      },
    });
  }
};

/**
 * Get keyword ranking trend
 * GET /api/admin/seo/keywords/:keyword/trend
 */
export const getKeywordTrend = async (req, res) => {
  try {
    const { keyword } = req.params;
    const { days } = req.query;

    const trend = await searchConsoleService.getKeywordTrend(
      keyword,
      parseInt(days) || 30
    );

    res.json({
      success: true,
      data: {
        keyword,
        trend,
        days: parseInt(days) || 30,
      },
    });
  } catch (error) {
    console.error('Get keyword trend error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'GET_TREND_FAILED',
      },
    });
  }
};

/**
 * Get top performing keywords
 * GET /api/admin/seo/keywords/top
 */
export const getTopKeywords = async (req, res) => {
  try {
    const { limit, sortBy, days } = req.query;

    const topKeywords = await searchConsoleService.getTopKeywords(
      parseInt(limit) || 10,
      sortBy || 'clicks',
      parseInt(days) || 30
    );

    res.json({
      success: true,
      data: {
        keywords: topKeywords,
        count: topKeywords.length,
        sortBy: sortBy || 'clicks',
        days: parseInt(days) || 30,
      },
    });
  } catch (error) {
    console.error('Get top keywords error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'GET_TOP_KEYWORDS_FAILED',
      },
    });
  }
};

/**
 * Get declining keywords
 * GET /api/admin/seo/keywords/declining
 */
export const getDecliningKeywords = async (req, res) => {
  try {
    const { limit, days } = req.query;

    const decliningKeywords = await searchConsoleService.getDecliningKeywords(
      parseInt(limit) || 10,
      parseInt(days) || 30
    );

    res.json({
      success: true,
      data: {
        keywords: decliningKeywords,
        count: decliningKeywords.length,
        days: parseInt(days) || 30,
      },
    });
  } catch (error) {
    console.error('Get declining keywords error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'GET_DECLINING_KEYWORDS_FAILED',
      },
    });
  }
};

/**
 * Get indexing issues
 * GET /api/admin/seo/indexing-issues
 */
export const getIndexingIssues = async (req, res) => {
  try {
    const { status, severity, limit, offset } = req.query;

    const filters = {
      status,
      severity,
      limit: parseInt(limit) || 100,
      offset: parseInt(offset) || 0,
    };

    const issues = await searchConsoleService.getIndexingIssues(filters);

    res.json({
      success: true,
      data: {
        issues,
        count: issues.length,
        filters,
      },
    });
  } catch (error) {
    console.error('Get indexing issues error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'GET_ISSUES_FAILED',
      },
    });
  }
};

/**
 * Export keywords to CSV
 * GET /api/admin/seo/keywords/export
 */
export const exportKeywords = async (req, res) => {
  try {
    const { startDate, endDate, keyword, url } = req.query;

    const filters = {
      startDate,
      endDate,
      keyword,
      url,
      limit: 10000, // Export all matching records
    };

    const keywords = await searchConsoleService.getKeywordPerformance(filters);

    // Convert to CSV
    const csvHeader = 'Keyword,URL,Impressions,Clicks,CTR,Position,First Seen,Last Seen,Data Points\n';
    const csvRows = keywords.map(k => {
      return [
        `"${k.keyword}"`,
        `"${k.url || ''}"`,
        k.total_impressions || 0,
        k.total_clicks || 0,
        k.avg_ctr ? parseFloat(k.avg_ctr).toFixed(2) : '0.00',
        k.avg_position ? parseFloat(k.avg_position).toFixed(2) : 'N/A',
        k.first_seen || '',
        k.last_seen || '',
        k.data_points || 0,
      ].join(',');
    }).join('\n');

    const csv = csvHeader + csvRows;

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="keywords-${Date.now()}.csv"`);

    res.send(csv);
  } catch (error) {
    console.error('Export keywords error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        code: 'EXPORT_FAILED',
      },
    });
  }
};

export default {
  getSites,
  syncKeywords,
  getKeywords,
  getKeywordTrend,
  getTopKeywords,
  getDecliningKeywords,
  getIndexingIssues,
  exportKeywords,
};
