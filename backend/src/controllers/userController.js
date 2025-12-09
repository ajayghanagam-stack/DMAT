import pool from '../config/database.js';

/**
 * List all users (for assignment dropdown)
 * GET /api/admin/users
 */
export const listUsers = async (req, res) => {
  try {
    const query = `
      SELECT
        id,
        name,
        email,
        created_at
      FROM users
      ORDER BY name ASC
    `;

    const result = await pool.query(query);

    return res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('List users error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching users',
        statusCode: 500
      }
    });
  }
};
