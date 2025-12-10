// WordPress REST API Integration Service
// Uses built-in WordPress REST API (free, no plugins required)

import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

// WordPress configuration from environment variables
const WP_SITE_URL = process.env.WP_SITE_URL; // e.g., https://yoursite.com
const WP_USERNAME = process.env.WP_USERNAME;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD; // Application Password (not regular password)

/**
 * Check if WordPress integration is configured
 * @returns {boolean}
 */
export function isWordPressConfigured() {
  return !!(WP_SITE_URL && WP_USERNAME && WP_APP_PASSWORD);
}

/**
 * Get WordPress API endpoint
 * @param {string} path - API path
 * @returns {string} - Full API URL
 */
function getApiUrl(path) {
  const baseUrl = WP_SITE_URL.replace(/\/$/, ''); // Remove trailing slash
  return `${baseUrl}/wp-json/wp/v2${path}`;
}

/**
 * Get authentication header for WordPress REST API
 * Uses Application Password authentication (built into WordPress 5.6+)
 * @returns {Object} - Authorization header
 */
function getAuthHeader() {
  const credentials = Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64');
  return {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Test WordPress connection
 * @returns {Promise<Object>} - {success: boolean, message: string, siteInfo?: Object}
 */
export async function testWordPressConnection() {
  if (!isWordPressConfigured()) {
    return {
      success: false,
      message: 'WordPress is not configured. Please set WP_SITE_URL, WP_USERNAME, and WP_APP_PASSWORD in .env file.',
    };
  }

  try {
    // Try to fetch site info (no auth required)
    const siteInfoUrl = `${WP_SITE_URL.replace(/\/$/, '')}/wp-json`;
    const siteResponse = await fetch(siteInfoUrl);

    if (!siteResponse.ok) {
      throw new Error(`Cannot reach WordPress site: ${siteResponse.status}`);
    }

    const siteInfo = await siteResponse.json();

    // Try to authenticate and fetch current user
    const userUrl = getApiUrl('/users/me');
    const userResponse = await fetch(userUrl, {
      headers: getAuthHeader(),
    });

    if (!userResponse.ok) {
      if (userResponse.status === 401) {
        throw new Error('Authentication failed. Check WP_USERNAME and WP_APP_PASSWORD.');
      }
      throw new Error(`Authentication error: ${userResponse.status}`);
    }

    const user = await userResponse.json();

    return {
      success: true,
      message: 'WordPress connection successful',
      siteInfo: {
        name: siteInfo.name,
        description: siteInfo.description,
        url: siteInfo.url,
        username: user.username,
        userEmail: user.email,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to connect to WordPress',
    };
  }
}

/**
 * Publish landing page to WordPress as a post
 * @param {Object} landingPage - Landing page data from database
 * @returns {Promise<Object>} - {success: boolean, postId?: number, postUrl?: string, message?: string}
 */
export async function publishToWordPress(landingPage) {
  if (!isWordPressConfigured()) {
    throw new Error('WordPress is not configured');
  }

  try {
    // Build HTML content from landing page data
    const htmlContent = buildWordPressContent(landingPage);

    // Prepare post data for WordPress REST API
    const postData = {
      title: landingPage.title,
      content: htmlContent,
      status: 'publish', // 'draft' or 'publish'
      slug: landingPage.slug,
      // You can add more fields:
      // excerpt: landingPage.subheading,
      // featured_media: mediaId, // if you upload image to WordPress media library
      // categories: [categoryId],
      // tags: [tagId],
    };

    // Create post via WordPress REST API
    const response = await fetch(getApiUrl('/posts'), {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `WordPress API error: ${response.status}`);
    }

    const post = await response.json();

    return {
      success: true,
      postId: post.id,
      postUrl: post.link,
      message: 'Successfully published to WordPress',
      wordpressData: {
        id: post.id,
        title: post.title.rendered,
        url: post.link,
        status: post.status,
        date: post.date,
      },
    };
  } catch (error) {
    console.error('WordPress publish error:', error);
    throw new Error(`Failed to publish to WordPress: ${error.message}`);
  }
}

/**
 * Build HTML content for WordPress post from landing page data
 * @param {Object} landingPage - Landing page data
 * @returns {string} - HTML content
 */
function buildWordPressContent(landingPage) {
  let html = '';

  // Add hero image if exists
  if (landingPage.hero_image_url) {
    html += `<div class="hero-image" style="margin-bottom: 2rem;">
  <img src="${landingPage.hero_image_url}" alt="${landingPage.title}" style="max-width: 100%; height: auto; border-radius: 8px;" />
</div>\n\n`;
  }

  // Add headline
  if (landingPage.headline) {
    html += `<h2>${landingPage.headline}</h2>\n\n`;
  }

  // Add subheading
  if (landingPage.subheading) {
    html += `<p class="subheading" style="font-size: 1.2rem; font-weight: 500; margin-bottom: 1.5rem;">${landingPage.subheading}</p>\n\n`;
  }

  // Add body text
  if (landingPage.body_text) {
    // Convert newlines to paragraphs
    const paragraphs = landingPage.body_text.split('\n\n').filter(p => p.trim());
    paragraphs.forEach(para => {
      html += `<p>${para.trim()}</p>\n\n`;
    });
  }

  // Add contact form using WordPress Contact Form 7 shortcode (if installed)
  // Or use custom HTML form
  html += `<div class="lead-capture-form" style="background: #f7f7f7; padding: 2rem; border-radius: 8px; margin-top: 2rem;">
  <h3>Get Started</h3>
  <form class="landing-page-form" method="post" style="display: flex; flex-direction: column; gap: 1rem;">
`;

  // Add form fields
  const fields = landingPage.form_fields?.fields || [];
  fields.forEach(field => {
    html += `    <div class="form-field">
      <label for="${field.name}" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">${field.label}${field.required ? ' *' : ''}</label>
      ${field.type === 'textarea'
        ? `<textarea name="${field.name}" id="${field.name}" ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}" rows="4" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;"></textarea>`
        : `<input type="${field.type}" name="${field.name}" id="${field.name}" ${field.required ? 'required' : ''} placeholder="${field.placeholder || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;" />`
      }
    </div>
`;
  });

  html += `    <button type="submit" style="padding: 1rem 2rem; background: #0073aa; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer;">${landingPage.cta_text || 'Submit'}</button>
  </form>
</div>`;

  return html;
}

/**
 * Update existing WordPress post
 * @param {number} postId - WordPress post ID
 * @param {Object} landingPage - Updated landing page data
 * @returns {Promise<Object>}
 */
export async function updateWordPressPost(postId, landingPage) {
  if (!isWordPressConfigured()) {
    throw new Error('WordPress is not configured');
  }

  try {
    const htmlContent = buildWordPressContent(landingPage);

    const postData = {
      title: landingPage.title,
      content: htmlContent,
      slug: landingPage.slug,
    };

    const response = await fetch(getApiUrl(`/posts/${postId}`), {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `WordPress API error: ${response.status}`);
    }

    const post = await response.json();

    return {
      success: true,
      postId: post.id,
      postUrl: post.link,
      message: 'Successfully updated WordPress post',
    };
  } catch (error) {
    console.error('WordPress update error:', error);
    throw new Error(`Failed to update WordPress post: ${error.message}`);
  }
}

/**
 * Delete WordPress post
 * @param {number} postId - WordPress post ID
 * @returns {Promise<Object>}
 */
export async function deleteWordPressPost(postId) {
  if (!isWordPressConfigured()) {
    throw new Error('WordPress is not configured');
  }

  try {
    const response = await fetch(getApiUrl(`/posts/${postId}`), {
      method: 'DELETE',
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `WordPress API error: ${response.status}`);
    }

    return {
      success: true,
      message: 'Successfully deleted WordPress post',
    };
  } catch (error) {
    console.error('WordPress delete error:', error);
    throw new Error(`Failed to delete WordPress post: ${error.message}`);
  }
}
