// LinkedIn Post Controller
// Handles LinkedIn post creation and management

import * as linkedinService from '../services/linkedinService.js';

/**
 * Publish a post to LinkedIn
 * POST /api/admin/linkedin/posts
 */
export const publishPost = async (req, res) => {
  try {
    const { content, imageUrl } = req.body;

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: 'Post content is required'
      });
    }

    // Check content length (LinkedIn limit is 3000 characters)
    if (content.length > 3000) {
      return res.status(400).json({
        error: 'Post content exceeds 3000 character limit'
      });
    }

    // Get LinkedIn tokens
    const tokens = await linkedinService.getTokens(req.user.id);

    if (!tokens) {
      return res.status(401).json({
        error: 'LinkedIn account not connected',
        message: 'Please connect your LinkedIn account first'
      });
    }

    // Check if token is expired
    if (linkedinService.isTokenExpired(tokens.expires_at)) {
      return res.status(401).json({
        error: 'LinkedIn token expired',
        message: 'Please reconnect your LinkedIn account'
      });
    }

    // Publish post to LinkedIn
    const publishedPost = await linkedinService.publishPost(
      tokens.access_token,
      tokens.linkedin_user_id,
      content,
      imageUrl || null
    );

    // Generate post URL (best effort)
    const postUrl = `https://www.linkedin.com/feed/update/${publishedPost.urn}`;

    // Save post to database
    const savedPost = await linkedinService.savePost(
      req.user.id,
      publishedPost.id,
      content,
      postUrl,
      imageUrl || null,
      publishedPost.urn
    );

    res.status(201).json({
      success: true,
      message: 'Post published successfully',
      post: {
        id: savedPost.id,
        linkedinPostId: savedPost.linkedin_post_id,
        content: savedPost.post_content,
        postUrl: savedPost.post_url,
        imageUrl: savedPost.image_url,
        publishedAt: savedPost.published_at
      }
    });
  } catch (error) {
    console.error('Error publishing post:', error);
    res.status(500).json({
      error: 'Failed to publish post',
      message: error.message
    });
  }
};

/**
 * Get post history
 * GET /api/admin/linkedin/posts
 */
export const getPostHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Get posts
    const posts = await linkedinService.getPostHistory(req.user.id, limit, offset);

    // Get total count
    const totalCount = await linkedinService.getPostCount(req.user.id);

    res.json({
      posts: posts,
      pagination: {
        page: page,
        limit: limit,
        totalCount: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching post history:', error);
    res.status(500).json({
      error: 'Failed to fetch post history',
      message: error.message
    });
  }
};

/**
 * Get post statistics
 * GET /api/admin/linkedin/stats
 */
export const getPostStats = async (req, res) => {
  try {
    const totalPosts = await linkedinService.getPostCount(req.user.id);

    // Get posts from last 30 days
    const recentPosts = await linkedinService.getPostHistory(req.user.id, 1000, 0);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const postsLast30Days = recentPosts.filter(
      post => new Date(post.published_at) >= thirtyDaysAgo
    ).length;

    res.json({
      totalPosts: totalPosts,
      postsLast30Days: postsLast30Days
    });
  } catch (error) {
    console.error('Error fetching post stats:', error);
    res.status(500).json({
      error: 'Failed to fetch post statistics',
      message: error.message
    });
  }
};
