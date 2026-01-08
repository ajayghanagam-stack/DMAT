// LinkedIn API Service
// Handles LinkedIn OAuth 2.0 and post publishing

import axios from 'axios';
import pool from '../config/database.js';

// LinkedIn OAuth 2.0 Configuration
const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';

/**
 * Generate LinkedIn OAuth authorization URL
 * @param {string} state - Random state for CSRF protection
 * @returns {string} Authorization URL
 */
export function getAuthorizationUrl(state) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
    state: state,
    scope: 'openid profile email w_member_social'
  });

  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 * @param {string} code - Authorization code from LinkedIn
 * @returns {Promise<Object>} Token response
 */
export async function exchangeCodeForToken(code) {
  try {
    const response = await axios.post(
      LINKEDIN_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    throw new Error('Failed to exchange authorization code for token');
  }
}

/**
 * Get LinkedIn user profile using OpenID Connect
 * @param {string} accessToken - LinkedIn access token
 * @returns {Promise<Object>} User profile data
 */
export async function getUserProfile(accessToken) {
  try {
    // Use OpenID Connect userinfo endpoint
    const response = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const profile = response.data;

    return {
      linkedinUserId: profile.sub, // OpenID Connect subject identifier
      linkedinUserName: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim(),
      linkedinUserEmail: profile.email || null
    };
  } catch (error) {
    console.error('Error fetching user profile:', error.response?.data || error.message);
    throw new Error('Failed to fetch LinkedIn user profile');
  }
}

/**
 * Store LinkedIn OAuth tokens in database
 * @param {number} userId - User ID
 * @param {Object} tokenData - Token data from LinkedIn
 * @param {Object} profileData - User profile data
 * @returns {Promise<void>}
 */
export async function storeTokens(userId, tokenData, profileData) {
  const { access_token, refresh_token, expires_in, scope } = tokenData;
  const expiresAt = new Date(Date.now() + expires_in * 1000);

  const query = `
    INSERT INTO linkedin_oauth_tokens
    (user_id, access_token, refresh_token, expires_at, scope, linkedin_user_id, linkedin_user_name, linkedin_user_email, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET
      access_token = EXCLUDED.access_token,
      refresh_token = EXCLUDED.refresh_token,
      expires_at = EXCLUDED.expires_at,
      scope = EXCLUDED.scope,
      linkedin_user_id = EXCLUDED.linkedin_user_id,
      linkedin_user_name = EXCLUDED.linkedin_user_name,
      linkedin_user_email = EXCLUDED.linkedin_user_email,
      updated_at = NOW()
  `;

  await pool.query(query, [
    userId,
    access_token,
    refresh_token || null,
    expiresAt,
    scope,
    profileData.linkedinUserId,
    profileData.linkedinUserName,
    profileData.linkedinUserEmail
  ]);
}

/**
 * Get LinkedIn tokens for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object|null>} Token data or null
 */
export async function getTokens(userId) {
  const query = 'SELECT * FROM linkedin_oauth_tokens WHERE user_id = $1';
  const result = await pool.query(query, [userId]);
  return result.rows[0] || null;
}

/**
 * Delete LinkedIn tokens (disconnect)
 * @param {number} userId - User ID
 * @returns {Promise<void>}
 */
export async function deleteTokens(userId) {
  const query = 'DELETE FROM linkedin_oauth_tokens WHERE user_id = $1';
  await pool.query(query, [userId]);
}

/**
 * Check if access token is expired
 * @param {Date} expiresAt - Token expiration date
 * @returns {boolean} True if expired
 */
export function isTokenExpired(expiresAt) {
  return new Date() >= new Date(expiresAt);
}

/**
 * Publish a post to LinkedIn (text only)
 * @param {string} accessToken - LinkedIn access token
 * @param {string} linkedinUserId - LinkedIn user ID (person URN)
 * @param {string} text - Post text content
 * @param {string|null} imageUrl - Optional image URL (not currently supported - requires upload to LinkedIn)
 * @returns {Promise<Object>} Published post data
 */
export async function publishPost(accessToken, linkedinUserId, text, imageUrl = null) {
  try {
    const authorUrn = `urn:li:person:${linkedinUserId}`;

    // Text-only post (LinkedIn requires images to be uploaded first, not via URL)
    const postData = {
      author: authorUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: text
          },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    // Note: Image support requires uploading to LinkedIn's CDN first
    // This is not implemented yet - external URLs are not supported by LinkedIn API
    if (imageUrl) {
      console.warn('Image URLs are not currently supported. LinkedIn requires images to be uploaded to their CDN first.');
    }

    const response = await axios.post(
      `${LINKEDIN_API_BASE}/ugcPosts`,
      postData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    return {
      id: response.data.id,
      urn: response.headers['x-restli-id'] || response.data.id
    };
  } catch (error) {
    console.error('Error publishing LinkedIn post:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to publish post to LinkedIn');
  }
}

/**
 * Save post to database
 * @param {number} userId - User ID
 * @param {string} linkedinPostId - LinkedIn post ID
 * @param {string} content - Post content
 * @param {string|null} postUrl - LinkedIn post URL
 * @param {string|null} imageUrl - Image URL
 * @param {string} linkedinUrn - LinkedIn URN
 * @returns {Promise<Object>} Saved post data
 */
export async function savePost(userId, linkedinPostId, content, postUrl, imageUrl, linkedinUrn) {
  const query = `
    INSERT INTO linkedin_posts
    (user_id, linkedin_post_id, post_content, post_url, image_url, linkedin_urn, status, published_at)
    VALUES ($1, $2, $3, $4, $5, $6, 'published', NOW())
    RETURNING *
  `;

  const result = await pool.query(query, [
    userId,
    linkedinPostId,
    content,
    postUrl,
    imageUrl,
    linkedinUrn
  ]);

  return result.rows[0];
}

/**
 * Get post history for a user
 * @param {number} userId - User ID
 * @param {number} limit - Number of posts to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Array>} Array of posts
 */
export async function getPostHistory(userId, limit = 20, offset = 0) {
  const query = `
    SELECT * FROM linkedin_posts
    WHERE user_id = $1
    ORDER BY published_at DESC
    LIMIT $2 OFFSET $3
  `;

  const result = await pool.query(query, [userId, limit, offset]);
  return result.rows;
}

/**
 * Get post count for a user
 * @param {number} userId - User ID
 * @returns {Promise<number>} Total post count
 */
export async function getPostCount(userId) {
  const query = 'SELECT COUNT(*) as count FROM linkedin_posts WHERE user_id = $1';
  const result = await pool.query(query, [userId]);
  return parseInt(result.rows[0].count);
}
