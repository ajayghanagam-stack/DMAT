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
