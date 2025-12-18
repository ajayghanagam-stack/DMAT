import pool from '../config/database.js';

/**
 * Get a published landing page by slug (public endpoint)
 * GET /api/public/landing-page/:slug
 * No authentication required
 */
export const getPublicLandingPage = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_SLUG',
          message: 'Landing page slug is required',
          statusCode: 400
        }
      });
    }

    // Fetch landing page
    const query = `
      SELECT *
      FROM landing_pages
      WHERE slug = $1
      AND publish_status = 'published'
    `;

    const result = await pool.query(query, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LANDING_PAGE_NOT_FOUND',
          message: 'Landing page not found or not published',
          statusCode: 404
        }
      });
    }

    const landingPage = result.rows[0];

    // Parse JSON fields
    try {
      if (landingPage.content_sections && typeof landingPage.content_sections === 'string') {
        landingPage.content_sections = JSON.parse(landingPage.content_sections);
      }
      if (landingPage.form_fields && typeof landingPage.form_fields === 'string') {
        landingPage.form_fields = JSON.parse(landingPage.form_fields);
      }
      if (landingPage.theme_settings && typeof landingPage.theme_settings === 'string') {
        landingPage.theme_settings = JSON.parse(landingPage.theme_settings);
      }
    } catch (parseError) {
      console.error('Error parsing JSON fields:', parseError);
    }

    return res.status(200).json({
      success: true,
      data: {
        landingPage
      }
    });

  } catch (error) {
    console.error('Error fetching public landing page:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while fetching the landing page',
        statusCode: 500
      }
    });
  }
};
