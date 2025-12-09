import pool from '../config/database.js';

/**
 * List all active templates
 * GET /api/admin/templates
 */
export const listTemplates = async (req, res) => {
  try {
    const query = `
      SELECT
        id,
        name,
        description,
        thumbnail_url,
        html_structure,
        created_at
      FROM templates
      WHERE is_active = true
      ORDER BY id ASC
    `;

    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('List templates error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching templates',
        statusCode: 500
      }
    });
  }
};

/**
 * Get single template by ID
 * GET /api/admin/templates/:id
 */
export const getTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        id,
        name,
        description,
        thumbnail_url,
        html_structure,
        is_active,
        created_at
      FROM templates
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TEMPLATE_NOT_FOUND',
          message: 'Template not found',
          statusCode: 404
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Get template error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching template',
        statusCode: 500
      }
    });
  }
};
