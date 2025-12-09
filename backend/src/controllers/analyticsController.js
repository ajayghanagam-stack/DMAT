import pool from '../config/database.js';

/**
 * Get analytics dashboard data
 * GET /api/admin/analytics/dashboard
 */
export const getDashboardAnalytics = async (req, res) => {
  try {
    // Get total leads count
    const totalLeadsQuery = 'SELECT COUNT(*) as total FROM leads';
    const totalLeadsResult = await pool.query(totalLeadsQuery);
    const totalLeads = parseInt(totalLeadsResult.rows[0].total);

    // Get new leads count (last 7 days)
    const newLeadsQuery = `
      SELECT COUNT(*) as total
      FROM leads
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `;
    const newLeadsResult = await pool.query(newLeadsQuery);
    const newLeads = parseInt(newLeadsResult.rows[0].total);

    // Get leads by status breakdown
    const statusBreakdownQuery = `
      SELECT status, COUNT(*) as count
      FROM leads
      GROUP BY status
      ORDER BY count DESC
    `;
    const statusBreakdownResult = await pool.query(statusBreakdownQuery);
    const statusBreakdown = statusBreakdownResult.rows.map(row => ({
      status: row.status,
      count: parseInt(row.count)
    }));

    // Get leads over time (last 30 days, grouped by day)
    const leadsOverTimeQuery = `
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count
      FROM leads
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;
    const leadsOverTimeResult = await pool.query(leadsOverTimeQuery);
    const leadsOverTime = leadsOverTimeResult.rows.map(row => ({
      date: row.date,
      count: parseInt(row.count)
    }));

    // Get top landing pages by lead count
    const topLandingPagesQuery = `
      SELECT
        lp.id,
        lp.title,
        lp.slug,
        COUNT(l.id) as lead_count
      FROM landing_pages lp
      LEFT JOIN leads l ON l.landing_page_id = lp.id
      GROUP BY lp.id, lp.title, lp.slug
      HAVING COUNT(l.id) > 0
      ORDER BY lead_count DESC
      LIMIT 5
    `;
    const topLandingPagesResult = await pool.query(topLandingPagesQuery);
    const topLandingPages = topLandingPagesResult.rows.map(row => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      leadCount: parseInt(row.lead_count)
    }));

    // Get conversion metrics
    const convertedLeadsQuery = `
      SELECT COUNT(*) as total
      FROM leads
      WHERE status IN ('converted', 'closed_won')
    `;
    const convertedLeadsResult = await pool.query(convertedLeadsQuery);
    const convertedLeads = parseInt(convertedLeadsResult.rows[0].total);
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0;

    // Get assigned vs unassigned leads
    const assignedLeadsQuery = 'SELECT COUNT(*) as total FROM leads WHERE assigned_to IS NOT NULL';
    const assignedLeadsResult = await pool.query(assignedLeadsQuery);
    const assignedLeads = parseInt(assignedLeadsResult.rows[0].total);
    const unassignedLeads = totalLeads - assignedLeads;

    return res.status(200).json({
      success: true,
      data: {
        totals: {
          totalLeads,
          newLeads,
          convertedLeads,
          conversionRate: parseFloat(conversionRate),
          assignedLeads,
          unassignedLeads
        },
        statusBreakdown,
        leadsOverTime,
        topLandingPages
      }
    });

  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching analytics data',
        statusCode: 500
      }
    });
  }
};
