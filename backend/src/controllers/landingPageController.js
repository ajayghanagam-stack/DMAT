/**
 * Landing Page Controller
 * Business logic for landing page operations
 */

import LandingPageModel from '../models/landingPageModel.js';

/**
 * Create a new landing page
 * POST /api/admin/landing-pages
 */
export const createLandingPage = async (req, res) => {
  try {
    const landingPageData = {
      ...req.body,
      created_by: req.user.id
    };

    const landingPage = await LandingPageModel.create(landingPageData);

    res.status(201).json({
      success: true,
      data: landingPage,
      message: 'Landing page created successfully'
    });
  } catch (error) {
    console.error('Error creating landing page:', error);

    if (error.code === 'DUPLICATE_SLUG') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_SLUG',
          message: error.message,
          statusCode: 400
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to create landing page',
        statusCode: 500
      }
    });
  }
};

/**
 * Get all landing pages with optional filtering
 * GET /api/admin/landing-pages
 */
export const getLandingPages = async (req, res) => {
  try {
    const {
      publish_status,
      created_by,
      search,
      limit,
      offset,
      orderBy,
      orderDir
    } = req.query;

    const filters = {};
    if (publish_status) filters.publish_status = publish_status;
    if (created_by) filters.created_by = parseInt(created_by);
    if (search) filters.search = search;

    const pagination = {};
    if (limit) pagination.limit = parseInt(limit);
    if (offset) pagination.offset = parseInt(offset);
    if (orderBy) pagination.orderBy = orderBy;
    if (orderDir) pagination.orderDir = orderDir;

    const landingPages = await LandingPageModel.findAll(filters, pagination);

    res.json({
      success: true,
      data: landingPages,
      count: landingPages.length,
      filters: filters,
      pagination: pagination
    });
  } catch (error) {
    console.error('Error fetching landing pages:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch landing pages',
        statusCode: 500
      }
    });
  }
};

/**
 * Get single landing page by ID
 * GET /api/admin/landing-pages/:id
 */
export const getLandingPageById = async (req, res) => {
  try {
    const { id } = req.params;
    const landingPage = await LandingPageModel.findById(id);

    if (!landingPage) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Landing page with ID ${id} not found`,
          statusCode: 404
        }
      });
    }

    res.json({
      success: true,
      data: landingPage
    });
  } catch (error) {
    console.error('Error fetching landing page:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch landing page',
        statusCode: 500
      }
    });
  }
};

/**
 * Update landing page
 * PUT /api/admin/landing-pages/:id
 */
export const updateLandingPage = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if landing page exists
    const existing = await LandingPageModel.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Landing page with ID ${id} not found`,
          statusCode: 404
        }
      });
    }

    // Check ownership (users can only edit their own pages)
    if (existing.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to edit this landing page',
          statusCode: 403
        }
      });
    }

    const updatedLandingPage = await LandingPageModel.update(id, req.body);

    res.json({
      success: true,
      data: updatedLandingPage,
      message: 'Landing page updated successfully'
    });
  } catch (error) {
    console.error('Error updating landing page:', error);

    if (error.code === 'DUPLICATE_SLUG') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'DUPLICATE_SLUG',
          message: error.message,
          statusCode: 400
        }
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update landing page',
        statusCode: 500
      }
    });
  }
};

/**
 * Delete landing page
 * DELETE /api/admin/landing-pages/:id
 */
export const deleteLandingPage = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if landing page exists
    const existing = await LandingPageModel.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Landing page with ID ${id} not found`,
          statusCode: 404
        }
      });
    }

    // Check ownership (users can only delete their own pages)
    if (existing.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to delete this landing page',
          statusCode: 403
        }
      });
    }

    const deleted = await LandingPageModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Landing page with ID ${id} not found`,
          statusCode: 404
        }
      });
    }

    res.json({
      success: true,
      message: 'Landing page deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting landing page:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to delete landing page',
        statusCode: 500
      }
    });
  }
};

/**
 * Publish landing page
 * POST /api/admin/landing-pages/:id/publish
 */
export const publishLandingPage = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if landing page exists
    const existing = await LandingPageModel.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Landing page with ID ${id} not found`,
          statusCode: 404
        }
      });
    }

    // Check ownership
    if (existing.created_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to publish this landing page',
          statusCode: 403
        }
      });
    }

    // Generate published URL (for now, use DMAT-hosted URL)
    // In production, this would publish to WordPress or configured platform
    const publishedUrl = `${process.env.PUBLIC_URL || 'http://localhost:5001'}/pages/${existing.slug}.html`;

    const publishedPage = await LandingPageModel.publish(id, publishedUrl);

    res.json({
      success: true,
      data: publishedPage,
      message: 'Landing page published successfully'
    });
  } catch (error) {
    console.error('Error publishing landing page:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to publish landing page',
        statusCode: 500
      }
    });
  }
};

/**
 * Get landing page stats
 * GET /api/admin/landing-pages/stats
 */
export const getLandingPageStats = async (req, res) => {
  try {
    const countByStatus = await LandingPageModel.getCountByStatus(req.user.id);

    res.json({
      success: true,
      data: {
        countByStatus,
        total: Object.values(countByStatus).reduce((sum, count) => sum + count, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching landing page stats:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch stats',
        statusCode: 500
      }
    });
  }
};

/**
 * Preview landing page (generates HTML)
 * GET /api/admin/landing-pages/:id/preview
 */
export const previewLandingPage = async (req, res) => {
  try {
    const { id } = req.params;

    const landingPage = await LandingPageModel.findById(id);

    if (!landingPage) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Landing page with ID ${id} not found`,
          statusCode: 404
        }
      });
    }

    // Generate HTML for preview
    const html = generateLandingPageHTML(landingPage, true);

    // Return HTML directly
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);

  } catch (error) {
    console.error('Error previewing landing page:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to generate landing page preview',
        statusCode: 500
      }
    });
  }
};

/**
 * Generate HTML for landing page
 * @param {Object} page - Landing page data
 * @param {Boolean} isPreview - Whether this is a preview (affects form submission)
 * @returns {String} - Complete HTML document
 */
function generateLandingPageHTML(page, isPreview = false) {
  const formFields = typeof page.form_fields === 'string'
    ? JSON.parse(page.form_fields)
    : page.form_fields;

  const fields = formFields?.fields || [];

  // Generate form fields HTML
  const formFieldsHTML = fields.map(field => {
    const required = field.required ? 'required' : '';
    const placeholder = field.placeholder ? `placeholder="${field.placeholder}"` : '';

    return `
      <div class="form-field">
        <label for="${field.name}">${field.label}${field.required ? ' *' : ''}</label>
        <input
          type="${field.type}"
          id="${field.name}"
          name="${field.name}"
          ${placeholder}
          ${required}
        />
      </div>
    `;
  }).join('');

  const previewBanner = isPreview ? `
    <div style="background: #ffc107; color: #000; padding: 12px; text-align: center; font-weight: bold; position: sticky; top: 0; z-index: 1000;">
      ⚠️ PREVIEW MODE - Form submissions will not be saved
    </div>
  ` : '';

  const formAction = isPreview ? '#' : '/api/public/leads';
  const formOnSubmit = isPreview ? 'onsubmit="alert(\'Preview mode: Form submission disabled\'); return false;"' : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title || 'Landing Page'}</title>
  <meta name="description" content="${page.subheading || ''}">

  <!-- DMAT metadata -->
  <meta name="dmat-landing-page-id" content="${page.id}">
  <meta name="dmat-slug" content="${page.slug}">
  ${isPreview ? '<meta name="dmat-preview" content="true">' : ''}

  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
    }

    .dmat-landing-page {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      min-height: 100vh;
    }

    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 60px 40px;
      text-align: center;
    }

    .hero-image {
      max-width: 100%;
      height: auto;
      margin-bottom: 30px;
      border-radius: 8px;
    }

    .headline {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 20px;
      line-height: 1.2;
    }

    .subheading {
      font-size: 1.25rem;
      margin-bottom: 30px;
      opacity: 0.95;
    }

    .body-section {
      padding: 50px 40px;
    }

    .body-text {
      font-size: 1.1rem;
      line-height: 1.8;
      color: #555;
      white-space: pre-line;
      margin-bottom: 40px;
    }

    .form-section {
      background: #f9f9f9;
      padding: 50px 40px;
      border-top: 3px solid #667eea;
    }

    .form-title {
      font-size: 1.75rem;
      margin-bottom: 30px;
      text-align: center;
      color: #333;
    }

    .lead-form {
      max-width: 500px;
      margin: 0 auto;
    }

    .form-field {
      margin-bottom: 20px;
    }

    .form-field label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .form-field input {
      width: 100%;
      padding: 12px 16px;
      font-size: 1rem;
      border: 2px solid #ddd;
      border-radius: 6px;
      transition: border-color 0.3s;
    }

    .form-field input:focus {
      outline: none;
      border-color: #667eea;
    }

    .submit-button {
      width: 100%;
      padding: 16px 32px;
      font-size: 1.1rem;
      font-weight: bold;
      color: white;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      margin-top: 10px;
    }

    .submit-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .submit-button:active {
      transform: translateY(0);
    }

    .success-message {
      display: none;
      background: #4caf50;
      color: white;
      padding: 20px;
      border-radius: 6px;
      text-align: center;
      margin-top: 20px;
    }

    .error-message {
      display: none;
      background: #f44336;
      color: white;
      padding: 20px;
      border-radius: 6px;
      text-align: center;
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .headline {
        font-size: 2rem;
      }

      .hero-section,
      .body-section,
      .form-section {
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>
  ${previewBanner}

  <div class="dmat-landing-page" data-dmat-id="${page.id}">
    <!-- Hero Section -->
    <div class="hero-section">
      ${page.hero_image_url ? `<img src="${page.hero_image_url}" alt="${page.title}" class="hero-image">` : ''}
      <h1 class="headline">${page.headline || page.title}</h1>
      ${page.subheading ? `<p class="subheading">${page.subheading}</p>` : ''}
    </div>

    <!-- Body Section -->
    ${page.body_text ? `
    <div class="body-section">
      <div class="body-text">${page.body_text}</div>
    </div>
    ` : ''}

    <!-- Form Section -->
    <div class="form-section">
      <h2 class="form-title">${page.cta_text || 'Get Started'}</h2>

      <form class="lead-form" id="leadForm" action="${formAction}" method="POST" ${formOnSubmit}>
        <input type="hidden" name="landing_page_id" value="${page.id}">

        ${formFieldsHTML}

        <button type="submit" class="submit-button">
          ${page.cta_text || 'Submit'}
        </button>
      </form>

      <div id="successMessage" class="success-message">
        ✓ Thank you for your submission! We'll be in touch soon.
      </div>

      <div id="errorMessage" class="error-message">
        ⚠ There was an error submitting the form. Please try again.
      </div>
    </div>
  </div>

  ${!isPreview ? `
  <script>
    // Handle form submission
    document.getElementById('leadForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const form = e.target;
      const submitButton = form.querySelector('.submit-button');
      const successMessage = document.getElementById('successMessage');
      const errorMessage = document.getElementById('errorMessage');

      // Disable submit button
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';

      // Hide previous messages
      successMessage.style.display = 'none';
      errorMessage.style.display = 'none';

      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Capture technical metadata
      data.user_agent = navigator.userAgent;
      data.referrer_url = document.referrer || null;
      data.landing_url = window.location.href;

      try {
        const response = await fetch('/api/public/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          // Show success message
          successMessage.style.display = 'block';
          form.style.display = 'none';

          // Redirect if specified
          if (result.redirect_url) {
            setTimeout(() => {
              window.location.href = result.redirect_url;
            }, 2000);
          }
        } else {
          // Show error message
          errorMessage.textContent = result.error?.message || 'There was an error submitting the form. Please try again.';
          errorMessage.style.display = 'block';
          submitButton.disabled = false;
          submitButton.textContent = '${page.cta_text || 'Submit'}';
        }
      } catch (error) {
        // Show error message
        errorMessage.textContent = 'Network error. Please check your connection and try again.';
        errorMessage.style.display = 'block';
        submitButton.disabled = false;
        submitButton.textContent = '${page.cta_text || 'Submit'}';
      }
    });
  </script>
  ` : ''}
</body>
</html>
  `.trim();
}
