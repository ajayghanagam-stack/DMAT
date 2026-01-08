// SEO Dashboard Controller
// Handles unified SEO dashboard API requests

import { getSeoDashboard } from '../services/seoDashboardService.js';

/**
 * @route   GET /api/admin/seo-dashboard
 * @desc    Get unified SEO dashboard data
 * @access  Private
 * @query   days (optional, default 30)
 */
export async function getSeoDashboardController(req, res) {
  try {
    const { days = 30 } = req.query;

    const dashboardData = await getSeoDashboard(parseInt(days));

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error getting SEO dashboard:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch SEO dashboard data'
    });
  }
}
