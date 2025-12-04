/**
 * Landing Page Model
 * Database operations for landing_pages table
 */

import pool from '../config/database.js';

class LandingPageModel {
  /**
   * Create a new landing page
   * @param {Object} data - Landing page data
   * @returns {Promise<Object>} Created landing page
   */
  static async create(data) {
    const {
      title,
      slug,
      headline = null,
      subheading = null,
      body_text = null,
      cta_text = 'Submit',
      hero_image_url = null,
      form_fields = {
        fields: [
          {
            name: 'name',
            label: 'Full Name',
            type: 'text',
            required: true,
            placeholder: 'Enter your name'
          },
          {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            required: true,
            placeholder: 'your@email.com'
          },
          {
            name: 'phone',
            label: 'Phone Number',
            type: 'tel',
            required: false,
            placeholder: '+1 (555) 000-0000'
          }
        ]
      },
      created_by
    } = data;

    const query = `
      INSERT INTO landing_pages (
        title,
        slug,
        headline,
        subheading,
        body_text,
        cta_text,
        hero_image_url,
        form_fields,
        publish_status,
        created_by,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING
        id,
        title,
        slug,
        headline,
        subheading,
        body_text,
        cta_text,
        hero_image_url,
        form_fields,
        publish_status,
        published_url,
        published_at,
        created_by,
        created_at,
        updated_at
    `;

    const values = [
      title,
      slug,
      headline,
      subheading,
      body_text,
      cta_text,
      hero_image_url,
      JSON.stringify(form_fields),
      'draft', // All new pages start as draft
      created_by
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      // Check for unique constraint violation on slug
      if (error.code === '23505' && error.constraint === 'landing_pages_slug_key') {
        const err = new Error(`A landing page with slug "${slug}" already exists.`);
        err.code = 'DUPLICATE_SLUG';
        err.statusCode = 400;
        throw err;
      }
      throw error;
    }
  }

  /**
   * Find all landing pages with optional filtering
   * @param {Object} filters - Optional filters (status, created_by, etc.)
   * @param {Object} pagination - Pagination options (limit, offset)
   * @returns {Promise<Array>} List of landing pages
   */
  static async findAll(filters = {}, pagination = {}) {
    const { publish_status, created_by, search } = filters;
    const { limit = 50, offset = 0, orderBy = 'created_at', orderDir = 'DESC' } = pagination;

    let query = `
      SELECT
        id,
        title,
        slug,
        headline,
        subheading,
        body_text,
        cta_text,
        hero_image_url,
        form_fields,
        publish_status,
        published_url,
        published_at,
        created_by,
        created_at,
        updated_at
      FROM landing_pages
      WHERE 1=1
    `;

    const values = [];
    let paramIndex = 1;

    // Add filters
    if (publish_status) {
      query += ` AND publish_status = $${paramIndex}`;
      values.push(publish_status);
      paramIndex++;
    }

    if (created_by) {
      query += ` AND created_by = $${paramIndex}`;
      values.push(created_by);
      paramIndex++;
    }

    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR slug ILIKE $${paramIndex} OR headline ILIKE $${paramIndex})`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Add ordering
    const validOrderColumns = ['created_at', 'updated_at', 'title', 'publish_status'];
    const validOrderDirs = ['ASC', 'DESC'];

    const safeOrderBy = validOrderColumns.includes(orderBy) ? orderBy : 'created_at';
    const safeOrderDir = validOrderDirs.includes(orderDir.toUpperCase()) ? orderDir.toUpperCase() : 'DESC';

    query += ` ORDER BY ${safeOrderBy} ${safeOrderDir}`;

    // Add pagination
    query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  /**
   * Find landing page by ID
   * @param {number} id - Landing page ID
   * @returns {Promise<Object|null>} Landing page or null if not found
   */
  static async findById(id) {
    const query = `
      SELECT
        id,
        title,
        slug,
        headline,
        subheading,
        body_text,
        cta_text,
        hero_image_url,
        form_fields,
        publish_status,
        published_url,
        published_at,
        created_by,
        created_at,
        updated_at
      FROM landing_pages
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find landing page by slug
   * @param {string} slug - Landing page slug
   * @returns {Promise<Object|null>} Landing page or null if not found
   */
  static async findBySlug(slug) {
    const query = `
      SELECT
        id,
        title,
        slug,
        headline,
        subheading,
        body_text,
        cta_text,
        hero_image_url,
        form_fields,
        publish_status,
        published_url,
        published_at,
        created_by,
        created_at,
        updated_at
      FROM landing_pages
      WHERE slug = $1
    `;

    const result = await pool.query(query, [slug]);
    return result.rows[0] || null;
  }

  /**
   * Update landing page
   * @param {number} id - Landing page ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object|null>} Updated landing page or null if not found
   */
  static async update(id, data) {
    const {
      title,
      slug,
      headline,
      subheading,
      body_text,
      cta_text,
      hero_image_url,
      form_fields
    } = data;

    const query = `
      UPDATE landing_pages
      SET
        title = COALESCE($1, title),
        slug = COALESCE($2, slug),
        headline = COALESCE($3, headline),
        subheading = COALESCE($4, subheading),
        body_text = COALESCE($5, body_text),
        cta_text = COALESCE($6, cta_text),
        hero_image_url = COALESCE($7, hero_image_url),
        form_fields = COALESCE($8, form_fields),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING
        id,
        title,
        slug,
        headline,
        subheading,
        body_text,
        cta_text,
        hero_image_url,
        form_fields,
        publish_status,
        published_url,
        published_at,
        created_by,
        created_at,
        updated_at
    `;

    const values = [
      title,
      slug,
      headline,
      subheading,
      body_text,
      cta_text,
      hero_image_url,
      form_fields ? JSON.stringify(form_fields) : null,
      id
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0] || null;
    } catch (error) {
      // Check for unique constraint violation on slug
      if (error.code === '23505' && error.constraint === 'landing_pages_slug_key') {
        const err = new Error(`A landing page with slug "${slug}" already exists.`);
        err.code = 'DUPLICATE_SLUG';
        err.statusCode = 400;
        throw err;
      }
      throw error;
    }
  }

  /**
   * Delete landing page
   * @param {number} id - Landing page ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  static async delete(id) {
    const query = 'DELETE FROM landing_pages WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Publish landing page
   * @param {number} id - Landing page ID
   * @param {string} publishedUrl - URL where page is published
   * @returns {Promise<Object|null>} Updated landing page or null if not found
   */
  static async publish(id, publishedUrl) {
    const query = `
      UPDATE landing_pages
      SET
        publish_status = 'published',
        published_url = $1,
        published_at = COALESCE(published_at, CURRENT_TIMESTAMP),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING
        id,
        title,
        slug,
        headline,
        subheading,
        body_text,
        cta_text,
        hero_image_url,
        form_fields,
        publish_status,
        published_url,
        published_at,
        created_by,
        created_at,
        updated_at
    `;

    const result = await pool.query(query, [publishedUrl, id]);
    return result.rows[0] || null;
  }

  /**
   * Get count of landing pages by status
   * @param {number} userId - User ID (optional)
   * @returns {Promise<Object>} Count by status
   */
  static async getCountByStatus(userId = null) {
    let query = `
      SELECT
        publish_status,
        COUNT(*) as count
      FROM landing_pages
    `;

    const values = [];
    if (userId) {
      query += ' WHERE created_by = $1';
      values.push(userId);
    }

    query += ' GROUP BY publish_status';

    const result = await pool.query(query, values);

    return result.rows.reduce((acc, row) => {
      acc[row.publish_status] = parseInt(row.count);
      return acc;
    }, {});
  }
}

export default LandingPageModel;
