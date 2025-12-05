/**
 * Validation Middleware
 * Request validation for landing pages and other resources
 */

/**
 * Validate landing page creation request
 */
export const validateLandingPageCreate = (req, res, next) => {
  const { title, slug, form_fields } = req.body;
  const errors = [];

  // Required field: title
  if (!title) {
    errors.push({
      field: 'title',
      message: 'Title is required'
    });
  } else if (typeof title !== 'string' || title.trim().length === 0) {
    errors.push({
      field: 'title',
      message: 'Title must be a non-empty string'
    });
  } else if (title.length > 500) {
    errors.push({
      field: 'title',
      message: 'Title must not exceed 500 characters'
    });
  }

  // Required field: slug
  if (!slug) {
    errors.push({
      field: 'slug',
      message: 'Slug is required'
    });
  } else if (typeof slug !== 'string' || slug.trim().length === 0) {
    errors.push({
      field: 'slug',
      message: 'Slug must be a non-empty string'
    });
  } else if (slug.length > 255) {
    errors.push({
      field: 'slug',
      message: 'Slug must not exceed 255 characters'
    });
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    errors.push({
      field: 'slug',
      message: 'Slug must contain only lowercase letters, numbers, and hyphens (cannot start/end with hyphen)'
    });
  }

  // Optional field validations
  if (req.body.headline && req.body.headline.length > 500) {
    errors.push({
      field: 'headline',
      message: 'Headline must not exceed 500 characters'
    });
  }

  if (req.body.subheading && req.body.subheading.length > 1000) {
    errors.push({
      field: 'subheading',
      message: 'Subheading must not exceed 1000 characters'
    });
  }

  if (req.body.cta_text && req.body.cta_text.length > 100) {
    errors.push({
      field: 'cta_text',
      message: 'CTA text must not exceed 100 characters'
    });
  }

  if (req.body.hero_image_url && req.body.hero_image_url.length > 2048) {
    errors.push({
      field: 'hero_image_url',
      message: 'Hero image URL must not exceed 2048 characters'
    });
  }

  // Validate form_fields if provided
  if (form_fields) {
    if (typeof form_fields !== 'object' || !form_fields.fields || !Array.isArray(form_fields.fields)) {
      errors.push({
        field: 'form_fields',
        message: 'form_fields must be an object with a "fields" array'
      });
    } else {
      // Check if at least one field exists
      if (form_fields.fields.length === 0) {
        errors.push({
          field: 'form_fields',
          message: 'form_fields must contain at least one field'
        });
      }

      // Check if at least one email field exists
      const hasEmailField = form_fields.fields.some(field => field.type === 'email');
      if (!hasEmailField) {
        errors.push({
          field: 'form_fields',
          message: 'form_fields must contain at least one email field for lead capture'
        });
      }

      // Validate each field
      form_fields.fields.forEach((field, index) => {
        if (!field.name || typeof field.name !== 'string') {
          errors.push({
            field: `form_fields.fields[${index}].name`,
            message: 'Each field must have a "name" property (string)'
          });
        }
        if (!field.label || typeof field.label !== 'string') {
          errors.push({
            field: `form_fields.fields[${index}].label`,
            message: 'Each field must have a "label" property (string)'
          });
        }
        if (!field.type || typeof field.type !== 'string') {
          errors.push({
            field: `form_fields.fields[${index}].type`,
            message: 'Each field must have a "type" property (string)'
          });
        }
        if (typeof field.required !== 'boolean') {
          errors.push({
            field: `form_fields.fields[${index}].required`,
            message: 'Each field must have a "required" property (boolean)'
          });
        }
      });
    }
  }

  // If there are validation errors, return 400
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors,
        statusCode: 400
      }
    });
  }

  next();
};

/**
 * Validate landing page update request
 */
export const validateLandingPageUpdate = (req, res, next) => {
  const { title, slug, form_fields } = req.body;
  const errors = [];

  // All fields are optional for update, but validate if provided

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push({
        field: 'title',
        message: 'Title must be a non-empty string'
      });
    } else if (title.length > 500) {
      errors.push({
        field: 'title',
        message: 'Title must not exceed 500 characters'
      });
    }
  }

  if (slug !== undefined) {
    if (typeof slug !== 'string' || slug.trim().length === 0) {
      errors.push({
        field: 'slug',
        message: 'Slug must be a non-empty string'
      });
    } else if (slug.length > 255) {
      errors.push({
        field: 'slug',
        message: 'Slug must not exceed 255 characters'
      });
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      errors.push({
        field: 'slug',
        message: 'Slug must contain only lowercase letters, numbers, and hyphens (cannot start/end with hyphen)'
      });
    }
  }

  if (req.body.headline !== undefined && req.body.headline && req.body.headline.length > 500) {
    errors.push({
      field: 'headline',
      message: 'Headline must not exceed 500 characters'
    });
  }

  if (req.body.subheading !== undefined && req.body.subheading && req.body.subheading.length > 1000) {
    errors.push({
      field: 'subheading',
      message: 'Subheading must not exceed 1000 characters'
    });
  }

  if (req.body.cta_text !== undefined && req.body.cta_text && req.body.cta_text.length > 100) {
    errors.push({
      field: 'cta_text',
      message: 'CTA text must not exceed 100 characters'
    });
  }

  if (req.body.hero_image_url !== undefined && req.body.hero_image_url && req.body.hero_image_url.length > 2048) {
    errors.push({
      field: 'hero_image_url',
      message: 'Hero image URL must not exceed 2048 characters'
    });
  }

  // Validate form_fields if provided
  if (form_fields !== undefined) {
    if (typeof form_fields !== 'object' || !form_fields.fields || !Array.isArray(form_fields.fields)) {
      errors.push({
        field: 'form_fields',
        message: 'form_fields must be an object with a "fields" array'
      });
    } else if (form_fields.fields.length === 0) {
      errors.push({
        field: 'form_fields',
        message: 'form_fields must contain at least one field'
      });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: errors,
        statusCode: 400
      }
    });
  }

  next();
};

/**
 * Validate ID parameter
 */
export const validateIdParam = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id < 1) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_ID',
        message: 'Invalid ID parameter. Must be a positive integer.',
        statusCode: 400
      }
    });
  }

  req.params.id = id;
  next();
};
