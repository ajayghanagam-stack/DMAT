import pool from '../config/database.js';

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitize string input
 */
function sanitizeString(str, maxLength) {
  if (!str) return null;

  // Trim whitespace
  let cleaned = String(str).trim();

  // Remove control characters
  cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, '');

  // Truncate to max length
  if (maxLength && cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }

  return cleaned || null;
}

/**
 * Extract IP address from request (handles proxies/load balancers)
 */
function extractIpAddress(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         null;
}

/**
 * Validate required fields based on landing page form configuration
 */
function validateRequiredFields(formData, landingPage) {
  let formFields;

  try {
    formFields = typeof landingPage.form_fields === 'string'
      ? JSON.parse(landingPage.form_fields)
      : landingPage.form_fields;
  } catch (error) {
    console.error('Invalid form_fields JSON:', error);
    // Fallback: no required field validation
    formFields = { fields: [] };
  }

  const errors = [];

  if (formFields.fields && Array.isArray(formFields.fields)) {
    formFields.fields.forEach(field => {
      if (field.required) {
        const value = formData[field.name];

        if (!value || String(value).trim() === '') {
          errors.push({
            field: field.name,
            message: `${field.label || field.name} is required`
          });
        }
      }
    });
  }

  return errors;
}

/**
 * Handle public lead submission from landing page forms
 * POST /api/public/leads
 */
export const submitLead = async (req, res) => {
  try {
    // Step 1: Basic bot detection - honeypot field
    if (req.body.website) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'SPAM_DETECTED',
          message: 'Invalid submission',
          statusCode: 400
        }
      });
    }

    // Step 2: Check landing_page_id present
    if (!req.body.landing_page_id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required field: landing_page_id',
          details: [
            { field: 'landing_page_id', message: 'Landing page ID is required' }
          ],
          statusCode: 400
        }
      });
    }

    // Step 3: Fetch landing page and verify it exists & is published
    const landingPageResult = await pool.query(
      'SELECT * FROM landing_pages WHERE id = $1',
      [req.body.landing_page_id]
    );

    if (landingPageResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'LANDING_PAGE_NOT_FOUND',
          message: 'Landing page not found',
          statusCode: 404
        }
      });
    }

    const landingPage = landingPageResult.rows[0];

    if (landingPage.publish_status !== 'published') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'LANDING_PAGE_NOT_PUBLISHED',
          message: 'This landing page is not currently accepting submissions',
          statusCode: 400
        }
      });
    }

    // Step 4: Validate required fields
    const validationErrors = validateRequiredFields(req.body, landingPage);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Required fields are missing',
          details: validationErrors,
          statusCode: 400
        }
      });
    }

    // Step 5: Validate email format if provided
    if (req.body.email && !isValidEmail(req.body.email)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email format',
          details: [
            { field: 'email', message: 'Please provide a valid email address' }
          ],
          statusCode: 400
        }
      });
    }

    // Step 6: Sanitize input data
    const sanitizedData = {
      name: sanitizeString(req.body.name, 255),
      email: sanitizeString(req.body.email, 255),
      phone: sanitizeString(req.body.phone, 50),
      company: sanitizeString(req.body.company, 255),
      job_title: sanitizeString(req.body.job_title, 255),
      message: sanitizeString(req.body.message, 10000)
    };

    // Step 7: Extract technical metadata
    const metadata = {
      source: 'landing_page',
      source_details: `LP: ${landingPage.slug}`,
      landing_page_id: landingPage.id,
      ip_address: extractIpAddress(req),
      user_agent: sanitizeString(req.body.user_agent || req.headers['user-agent'], 1000),
      referrer_url: sanitizeString(req.body.referrer_url || req.headers['referer'], 2048),
      landing_url: sanitizeString(req.body.landing_url || req.headers['referer'], 2048)
    };

    // Step 8: Create lead record
    const insertQuery = `
      INSERT INTO leads (
        name, email, phone, company, job_title, message,
        source, source_details, landing_page_id,
        referrer_url, landing_url, user_agent, ip_address,
        status, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'new',
        CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
      RETURNING id, email;
    `;

    const values = [
      sanitizedData.name,
      sanitizedData.email,
      sanitizedData.phone,
      sanitizedData.company,
      sanitizedData.job_title,
      sanitizedData.message,
      metadata.source,
      metadata.source_details,
      metadata.landing_page_id,
      metadata.referrer_url,
      metadata.landing_url,
      metadata.user_agent,
      metadata.ip_address
    ];

    const result = await pool.query(insertQuery, values);
    const lead = result.rows[0];

    // Step 9: Return success response
    return res.status(201).json({
      success: true,
      message: 'Thank you for your submission!',
      data: {
        lead_id: lead.id,
        email: lead.email
      },
      redirect_url: null // Can be configured per landing page in future
    });

  } catch (error) {
    console.error('Lead submission error:', error);

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An error occurred while processing your submission. Please try again.',
        statusCode: 500
      }
    });
  }
};
