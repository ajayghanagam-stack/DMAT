import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

/**
 * List all users with role information
 * GET /api/admin/users
 */
export const listUsers = async (req, res) => {
  try {
    const query = `
      SELECT
        id,
        name,
        email,
        role,
        created_at,
        updated_at
      FROM users
      ORDER BY created_at DESC
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

/**
 * Get single user by ID
 * GET /api/admin/users/:id
 */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT
        id,
        name,
        email,
        role,
        created_at,
        updated_at
      FROM users
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          statusCode: 404
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching user',
        statusCode: 500
      }
    });
  }
};

/**
 * Create new user
 * POST /api/admin/users
 */
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, email, and password are required',
          statusCode: 400
        }
      });
    }

    // Validate role
    const validRoles = ['admin', 'editor', 'viewer'];
    const userRole = role || 'viewer';

    if (!validRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Role must be one of: admin, editor, viewer',
          statusCode: 400
        }
      });
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email format',
          statusCode: 400
        }
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Password must be at least 6 characters',
          statusCode: 400
        }
      });
    }

    // Check if email already exists
    const emailCheckQuery = 'SELECT id FROM users WHERE email = $1';
    const emailCheck = await pool.query(emailCheckQuery, [email]);

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Email already exists',
          statusCode: 409
        }
      });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const insertQuery = `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role, created_at
    `;

    const result = await pool.query(insertQuery, [name, email, password_hash, userRole]);

    return res.status(201).json({
      success: true,
      data: result.rows[0],
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while creating user',
        statusCode: 500
      }
    });
  }
};

/**
 * Update user (name, email, role)
 * PUT /api/admin/users/:id
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Validation
    if (!name && !email && !role) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'At least one field (name, email, role) is required',
          statusCode: 400
        }
      });
    }

    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          statusCode: 404
        }
      });
    }

    // Validate role if provided
    if (role) {
      const validRoles = ['admin', 'editor', 'viewer'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Role must be one of: admin, editor, viewer',
            statusCode: 400
          }
        });
      }
    }

    // Validate email if provided
    if (email) {
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid email format',
            statusCode: 400
          }
        });
      }

      // Check if email is taken by another user
      const emailCheckQuery = 'SELECT id FROM users WHERE email = $1 AND id != $2';
      const emailCheck = await pool.query(emailCheckQuery, [email, id]);

      if (emailCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'EMAIL_EXISTS',
            message: 'Email already exists',
            statusCode: 409
          }
        });
      }
    }

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 0;

    if (name) {
      paramCount++;
      updates.push(`name = $${paramCount}`);
      values.push(name);
    }

    if (email) {
      paramCount++;
      updates.push(`email = $${paramCount}`);
      values.push(email);
    }

    if (role) {
      paramCount++;
      updates.push(`role = $${paramCount}`);
      values.push(role);
    }

    paramCount++;
    values.push(id);

    const updateQuery = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, role, updated_at
    `;

    const result = await pool.query(updateQuery, values);

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while updating user',
        statusCode: 500
      }
    });
  }
};

/**
 * Delete user
 * DELETE /api/admin/users/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const userCheck = await pool.query('SELECT id, email FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          statusCode: 404
        }
      });
    }

    // Prevent deleting yourself (check against req.user from auth middleware)
    if (req.user && req.user.id === parseInt(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CANNOT_DELETE_SELF',
          message: 'You cannot delete your own account',
          statusCode: 400
        }
      });
    }

    // Delete user (foreign key constraints will handle related data)
    const deleteQuery = 'DELETE FROM users WHERE id = $1 RETURNING id, name, email';
    const result = await pool.query(deleteQuery, [id]);

    return res.status(200).json({
      success: true,
      data: result.rows[0],
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);

    // Check if error is due to foreign key constraint
    if (error.code === '23503') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_HAS_REFERENCES',
          message: 'Cannot delete user: User has associated landing pages or leads',
          statusCode: 409
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while deleting user',
        statusCode: 500
      }
    });
  }
};
