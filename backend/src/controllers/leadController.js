import pool from '../config/database.js';

/**
 * List leads with filtering, sorting, and pagination
 * GET /api/admin/leads
 */
export const listLeads = async (req, res) => {
  try {
    // Extract query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const search = req.query.search || null;
    const landing_page_id = req.query.landing_page_id ? parseInt(req.query.landing_page_id) : null;
    const status = req.query.status || null;
    const date_from = req.query.date_from || null;
    const date_to = req.query.date_to || null;
    const sort_by = req.query.sort_by || 'created_at';
    const sort_order = req.query.sort_order || 'desc';

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid pagination parameters',
          details: [
            { field: 'page', message: 'Page must be a positive integer' },
            { field: 'limit', message: 'Limit must be between 1 and 100' }
          ],
          statusCode: 400
        }
      });
    }

    // Extract assigned_to filter
    const assigned_to = req.query.assigned_to || null;

    // Validate sort_by
    const validSortFields = ['name', 'email', 'created_at', 'status'];
    if (!validSortFields.includes(sort_by)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid sort field',
          details: [
            { field: 'sort_by', message: `Sort field must be one of: ${validSortFields.join(', ')}` }
          ],
          statusCode: 400
        }
      });
    }

    // Validate sort_order
    if (!['asc', 'desc'].includes(sort_order)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid sort order',
          details: [
            { field: 'sort_order', message: 'Sort order must be "asc" or "desc"' }
          ],
          statusCode: 400
        }
      });
    }

    // Validate status if provided
    const validStatuses = ['new', 'contacted', 'qualified', 'in_progress', 'converted', 'closed_won', 'closed_lost', 'unqualified'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid status value',
          details: [
            { field: 'status', message: `Status must be one of: ${validStatuses.join(', ')}` }
          ],
          statusCode: 400
        }
      });
    }

    // Build WHERE clause
    const conditions = [];
    const values = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      conditions.push(`(leads.name ILIKE $${paramCount} OR leads.email ILIKE $${paramCount})`);
      values.push(`%${search}%`);
    }

    if (landing_page_id) {
      paramCount++;
      conditions.push(`leads.landing_page_id = $${paramCount}`);
      values.push(landing_page_id);
    }

    if (status) {
      paramCount++;
      conditions.push(`leads.status = $${paramCount}`);
      values.push(status);
    }

    if (date_from) {
      paramCount++;
      conditions.push(`leads.created_at >= $${paramCount}`);
      values.push(date_from);
    }

    if (date_to) {
      paramCount++;
      conditions.push(`leads.created_at <= $${paramCount}`);
      values.push(date_to);
    }

    if (assigned_to) {
      if (assigned_to === 'unassigned') {
        conditions.push(`leads.assigned_to IS NULL`);
      } else if (assigned_to === 'assigned') {
        conditions.push(`leads.assigned_to IS NOT NULL`);
      } else {
        paramCount++;
        conditions.push(`leads.assigned_to = $${paramCount}`);
        values.push(parseInt(assigned_to));
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM leads
      ${whereClause}
    `;
    const countResult = await pool.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total);

    // Calculate pagination
    const offset = (page - 1) * limit;
    const pages = Math.ceil(total / limit);
    const has_next = page < pages;
    const has_previous = page > 1;

    // Get leads data
    paramCount++;
    const limitParam = paramCount;
    paramCount++;
    const offsetParam = paramCount;

    const dataQuery = `
      SELECT
        leads.id,
        leads.landing_page_id,
        leads.name,
        leads.email,
        leads.phone,
        leads.company,
        leads.job_title,
        leads.message,
        leads.status,
        leads.source,
        leads.source_details,
        leads.referrer_url,
        leads.landing_url,
        leads.user_agent,
        leads.ip_address,
        leads.assigned_to,
        leads.assigned_at,
        leads.created_at,
        leads.updated_at,
        landing_pages.id as lp_id,
        landing_pages.title as lp_title,
        landing_pages.slug as lp_slug,
        landing_pages.published_url as lp_published_url,
        landing_pages.publish_status as lp_publish_status,
        assigned_user.id as assigned_user_id,
        assigned_user.name as assigned_user_name,
        assigned_user.email as assigned_user_email
      FROM leads
      LEFT JOIN landing_pages ON leads.landing_page_id = landing_pages.id
      LEFT JOIN users AS assigned_user ON leads.assigned_to = assigned_user.id
      ${whereClause}
      ORDER BY leads.${sort_by} ${sort_order}
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `;

    const dataResult = await pool.query(dataQuery, [...values, limit, offset]);

    // Format response data
    const data = dataResult.rows.map(row => ({
      id: row.id,
      landing_page_id: row.landing_page_id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      company: row.company,
      job_title: row.job_title,
      message: row.message,
      status: row.status,
      source: row.source,
      source_details: row.source_details,
      referrer_url: row.referrer_url,
      landing_url: row.landing_url,
      user_agent: row.user_agent,
      ip_address: row.ip_address,
      assigned_to: row.assigned_to,
      assigned_at: row.assigned_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      landing_page: row.lp_id ? {
        id: row.lp_id,
        title: row.lp_title,
        slug: row.lp_slug,
        published_url: row.lp_published_url,
        publish_status: row.lp_publish_status
      } : null,
      assigned_user: row.assigned_user_id ? {
        id: row.assigned_user_id,
        name: row.assigned_user_name,
        email: row.assigned_user_email
      } : null
    }));

    // Return response
    return res.status(200).json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages,
        has_next,
        has_previous
      },
      filters: {
        search,
        landing_page_id,
        status,
        date_from,
        date_to,
        assigned_to
      },
      sort: {
        sort_by,
        sort_order
      }
    });

  } catch (error) {
    console.error('List leads error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching leads',
        statusCode: 500
      }
    });
  }
};

/**
 * Get single lead details
 * GET /api/admin/leads/:id
 */
export const getLead = async (req, res) => {
  try {
    const leadId = parseInt(req.params.id);

    if (!leadId || isNaN(leadId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid lead ID',
          statusCode: 400
        }
      });
    }

    const query = `
      SELECT
        leads.id,
        leads.landing_page_id,
        leads.name,
        leads.email,
        leads.phone,
        leads.company,
        leads.job_title,
        leads.message,
        leads.status,
        leads.source,
        leads.source_details,
        leads.referrer_url,
        leads.landing_url,
        leads.user_agent,
        leads.ip_address,
        leads.assigned_to,
        leads.assigned_at,
        leads.created_at,
        leads.updated_at,
        landing_pages.id as lp_id,
        landing_pages.title as lp_title,
        landing_pages.slug as lp_slug,
        landing_pages.published_url as lp_published_url,
        landing_pages.publish_status as lp_publish_status,
        assigned_user.id as assigned_user_id,
        assigned_user.name as assigned_user_name,
        assigned_user.email as assigned_user_email
      FROM leads
      LEFT JOIN landing_pages ON leads.landing_page_id = landing_pages.id
      LEFT JOIN users AS assigned_user ON leads.assigned_to = assigned_user.id
      WHERE leads.id = $1
    `;

    const result = await pool.query(query, [leadId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LEAD_NOT_FOUND',
          message: 'Lead not found',
          statusCode: 404
        }
      });
    }

    const row = result.rows[0];
    const data = {
      id: row.id,
      landing_page_id: row.landing_page_id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      company: row.company,
      job_title: row.job_title,
      message: row.message,
      status: row.status,
      source: row.source,
      source_details: row.source_details,
      referrer_url: row.referrer_url,
      landing_url: row.landing_url,
      user_agent: row.user_agent,
      ip_address: row.ip_address,
      assigned_to: row.assigned_to,
      assigned_at: row.assigned_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      landing_page: row.lp_id ? {
        id: row.lp_id,
        title: row.lp_title,
        slug: row.lp_slug,
        published_url: row.lp_published_url,
        publish_status: row.lp_publish_status
      } : null,
      assigned_user: row.assigned_user_id ? {
        id: row.assigned_user_id,
        name: row.assigned_user_name,
        email: row.assigned_user_email
      } : null
    };

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Get lead error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching lead details',
        statusCode: 500
      }
    });
  }
};

/**
 * Update lead status
 * PATCH /api/admin/leads/:id
 */
export const updateLeadStatus = async (req, res) => {
  try {
    const leadId = parseInt(req.params.id);
    const { status } = req.body;

    if (!leadId || isNaN(leadId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid lead ID',
          statusCode: 400
        }
      });
    }

    // Validate status
    const validStatuses = ['new', 'contacted', 'qualified', 'in_progress', 'converted', 'closed_won', 'closed_lost', 'unqualified'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid status value',
          details: [
            { field: 'status', message: `Status must be one of: ${validStatuses.join(', ')}` }
          ],
          statusCode: 400
        }
      });
    }

    // Check if lead exists
    const checkQuery = 'SELECT id FROM leads WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [leadId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LEAD_NOT_FOUND',
          message: 'Lead not found',
          statusCode: 404
        }
      });
    }

    // Update status
    const updateQuery = `
      UPDATE leads
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, status, updated_at
    `;

    const result = await pool.query(updateQuery, [status, leadId]);
    const updatedLead = result.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        id: updatedLead.id,
        status: updatedLead.status,
        updated_at: updatedLead.updated_at
      },
      message: 'Lead status updated successfully'
    });

  } catch (error) {
    console.error('Update lead status error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while updating lead status',
        statusCode: 500
      }
    });
  }
};

/**
 * Assign lead to user
 * PATCH /api/admin/leads/:id/assign
 */
export const assignLead = async (req, res) => {
  try {
    const leadId = parseInt(req.params.id);
    const { assigned_to } = req.body;

    if (!leadId || isNaN(leadId)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid lead ID',
          statusCode: 400
        }
      });
    }

    // Check if lead exists
    const checkLeadQuery = 'SELECT id FROM leads WHERE id = $1';
    const checkLeadResult = await pool.query(checkLeadQuery, [leadId]);

    if (checkLeadResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LEAD_NOT_FOUND',
          message: 'Lead not found',
          statusCode: 404
        }
      });
    }

    // If assigned_to is null, unassign the lead
    if (assigned_to === null) {
      const updateQuery = `
        UPDATE leads
        SET assigned_to = NULL, assigned_at = NULL, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, assigned_to, assigned_at, updated_at
      `;

      const result = await pool.query(updateQuery, [leadId]);
      const updatedLead = result.rows[0];

      return res.status(200).json({
        success: true,
        data: {
          id: updatedLead.id,
          assigned_to: updatedLead.assigned_to,
          assigned_at: updatedLead.assigned_at,
          updated_at: updatedLead.updated_at,
          assigned_user: null
        },
        message: 'Lead unassigned successfully'
      });
    }

    // Validate assigned_to is a valid user
    const checkUserQuery = 'SELECT id, name, email FROM users WHERE id = $1';
    const checkUserResult = await pool.query(checkUserQuery, [assigned_to]);

    if (checkUserResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid user ID',
          details: [
            { field: 'assigned_to', message: 'User does not exist' }
          ],
          statusCode: 400
        }
      });
    }

    // Assign the lead
    const updateQuery = `
      UPDATE leads
      SET assigned_to = $1, assigned_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, assigned_to, assigned_at, updated_at
    `;

    const result = await pool.query(updateQuery, [assigned_to, leadId]);
    const updatedLead = result.rows[0];
    const assignedUser = checkUserResult.rows[0];

    return res.status(200).json({
      success: true,
      data: {
        id: updatedLead.id,
        assigned_to: updatedLead.assigned_to,
        assigned_at: updatedLead.assigned_at,
        updated_at: updatedLead.updated_at,
        assigned_user: {
          id: assignedUser.id,
          name: assignedUser.name,
          email: assignedUser.email
        }
      },
      message: 'Lead assigned successfully'
    });

  } catch (error) {
    console.error('Assign lead error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while assigning lead',
        statusCode: 500
      }
    });
  }
};

/**
 * Export leads to CSV
 * GET /api/admin/leads/export
 */
export const exportLeads = async (req, res) => {
  try {
    // Extract same filters as list (to export filtered results)
    const search = req.query.search || null;
    const landing_page_id = req.query.landing_page_id ? parseInt(req.query.landing_page_id) : null;
    const status = req.query.status && req.query.status !== 'undefined' ? req.query.status : null;
    const date_from = req.query.date_from || null;
    const date_to = req.query.date_to || null;

    // Build WHERE clause
    const conditions = [];
    const values = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      conditions.push(`(leads.name ILIKE $${paramCount} OR leads.email ILIKE $${paramCount})`);
      values.push(`%${search}%`);
    }

    if (landing_page_id) {
      paramCount++;
      conditions.push(`leads.landing_page_id = $${paramCount}`);
      values.push(landing_page_id);
    }

    if (status) {
      paramCount++;
      conditions.push(`leads.status = $${paramCount}`);
      values.push(status);
    }

    if (date_from) {
      paramCount++;
      conditions.push(`leads.created_at >= $${paramCount}`);
      values.push(date_from);
    }

    if (date_to) {
      paramCount++;
      conditions.push(`leads.created_at <= $${paramCount}`);
      values.push(date_to);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get all leads (no pagination for export)
    const query = `
      SELECT
        leads.id,
        leads.name,
        leads.email,
        leads.phone,
        leads.source,
        leads.status,
        leads.created_at,
        landing_pages.title as landing_page_title
      FROM leads
      LEFT JOIN landing_pages ON leads.landing_page_id = landing_pages.id
      ${whereClause}
      ORDER BY leads.created_at DESC
    `;

    const result = await pool.query(query, values);

    // Build CSV
    const csvRows = [];

    // Header row
    csvRows.push('ID,Name,Email,Phone,Landing Page,Source,Status,Created At');

    // Data rows
    result.rows.forEach(row => {
      const createdAt = row.created_at ? new Date(row.created_at).toISOString().replace('T', ' ').substring(0, 19) : '';

      const fields = [
        row.id || '',
        escapeCsv(row.name || ''),
        escapeCsv(row.email || ''),
        escapeCsv(row.phone || ''),
        escapeCsv(row.landing_page_title || 'Direct'),
        escapeCsv(row.source || 'landing_page'),
        escapeCsv(row.status || 'new'),
        createdAt
      ];

      csvRows.push(fields.join(','));
    });

    const csv = csvRows.join('\n');

    // Generate filename with today's date
    const today = new Date().toISOString().split('T')[0];
    const filename = `leads-export-${today}.csv`;

    // Set response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return res.status(200).send(csv);

  } catch (error) {
    console.error('Export leads error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'EXPORT_FAILED',
        message: 'Failed to generate export file',
        statusCode: 500
      }
    });
  }
};

/**
 * Helper function to escape CSV fields
 */
function escapeCsv(field) {
  if (!field) return '';

  const str = String(field);

  // If field contains comma, newline, or quotes, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}
