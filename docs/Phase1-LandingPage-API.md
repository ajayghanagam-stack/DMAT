# Phase 1 Landing Page Admin API

**Version:** 1.0
**Date:** 2025-12-03
**Purpose:** Define backend admin APIs for landing page management in DMAT Phase 1

---

## 📋 Overview

This document specifies the internal admin APIs used by the DMAT dashboard for managing landing pages. These are NOT public-facing APIs - they require authentication and are used only by authenticated DMAT users.

**Base URL:** `/api/admin/landing-pages`

**Authentication:** JWT Bearer Token (required for all endpoints)

**Content-Type:** `application/json`

---

## 🔐 Authentication & Authorization

### Authentication Method
All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Permission Levels

| Operation | Admin | Editor | Viewer |
|-----------|-------|--------|--------|
| Create landing page | ✅ | ✅ | ❌ |
| List landing pages | ✅ | ✅ | ✅ |
| Get single landing page | ✅ | ✅ | ✅ |
| Update landing page | ✅ | ✅ | ❌ |
| Publish landing page | ✅ | ✅ | ❌ |
| Delete landing page | ✅ | ✅ | ❌ |

### Error Response for Unauthorized Access

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required. Please provide a valid JWT token.",
    "statusCode": 401
  }
}
```

### Error Response for Insufficient Permissions

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions. This action requires admin or editor role.",
    "statusCode": 403
  }
}
```

---

## 📚 API Operations

### 1. Create Landing Page (Draft)

**Endpoint:** `POST /api/admin/landing-pages`

**Description:** Create a new landing page in draft status

**Authentication:** Required (JWT)

**Permissions:** Admin, Editor

**Request Body:**

```json
{
  "title": "Free Marketing Guide 2025",
  "slug": "free-marketing-guide-2025",
  "headline": "Download Your Free Digital Marketing Guide",
  "subheading": "Learn the latest strategies that drive results in 2025",
  "body_text": "Our comprehensive 50-page guide covers SEO, social media, content marketing, and more. Download now and transform your marketing strategy.",
  "cta_text": "Get Your Free Guide",
  "hero_image_url": "https://example.com/images/marketing-guide-hero.jpg",
  "form_fields": {
    "fields": [
      {
        "name": "name",
        "label": "Full Name",
        "type": "text",
        "required": true,
        "placeholder": "Enter your name"
      },
      {
        "name": "email",
        "label": "Work Email",
        "type": "email",
        "required": true,
        "placeholder": "your@company.com"
      },
      {
        "name": "company",
        "label": "Company Name",
        "type": "text",
        "required": false,
        "placeholder": "Your company"
      }
    ]
  }
}
```

**Required Fields:**
- `title` (string, 1-500 chars)
- `slug` (string, 1-255 chars, lowercase-with-dashes, unique)

**Optional Fields:**
- `headline` (string, max 500 chars)
- `subheading` (string, max 1000 chars)
- `body_text` (text)
- `cta_text` (string, max 100 chars, default: "Submit")
- `hero_image_url` (string, valid URL, max 2048 chars)
- `form_fields` (object, must be valid JSON, default provided if omitted)

**Validation Rules:**

1. **title**: Required, 1-500 characters
2. **slug**:
   - Required, 1-255 characters
   - Must be unique across all landing pages
   - Must match pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$` (lowercase letters, numbers, hyphens only)
   - Cannot start or end with hyphen
3. **form_fields**:
   - Must be valid JSON object with "fields" array
   - Must contain at least one field
   - At least one field must have `type: "email"` (for lead capture)
   - Each field must have: name, label, type, required

**Success Response (201 Created):**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "title": "Free Marketing Guide 2025",
    "slug": "free-marketing-guide-2025",
    "headline": "Download Your Free Digital Marketing Guide",
    "subheading": "Learn the latest strategies that drive results in 2025",
    "body_text": "Our comprehensive 50-page guide covers SEO, social media, content marketing, and more.",
    "cta_text": "Get Your Free Guide",
    "hero_image_url": "https://example.com/images/marketing-guide-hero.jpg",
    "form_fields": {
      "fields": [
        {
          "name": "name",
          "label": "Full Name",
          "type": "text",
          "required": true,
          "placeholder": "Enter your name"
        },
        {
          "name": "email",
          "label": "Work Email",
          "type": "email",
          "required": true,
          "placeholder": "your@company.com"
        },
        {
          "name": "company",
          "label": "Company Name",
          "type": "text",
          "required": false,
          "placeholder": "Your company"
        }
      ]
    },
    "publish_status": "draft",
    "published_url": null,
    "published_at": null,
    "created_by": 1,
    "created_at": "2025-12-03T10:30:00Z",
    "updated_at": "2025-12-03T10:30:00Z"
  },
  "message": "Landing page created successfully"
}
```

**Error Responses:**

**400 Bad Request - Missing Required Field:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ],
    "statusCode": 400
  }
}
```

**400 Bad Request - Invalid Slug:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "slug",
        "message": "Slug must contain only lowercase letters, numbers, and hyphens"
      }
    ],
    "statusCode": 400
  }
}
```

**409 Conflict - Duplicate Slug:**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_SLUG",
    "message": "A landing page with this slug already exists",
    "details": {
      "slug": "free-marketing-guide-2025",
      "existing_id": 3
    },
    "statusCode": 409
  }
}
```

**400 Bad Request - Invalid Form Fields:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Form fields must contain at least one email field for lead capture",
    "statusCode": 400
  }
}
```

**Database Query:**

```sql
INSERT INTO landing_pages (
  title, slug, headline, subheading, body_text,
  cta_text, hero_image_url, form_fields,
  publish_status, created_by, created_at, updated_at
) VALUES (
  $1, $2, $3, $4, $5,
  $6, $7, $8,
  'draft', $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
)
RETURNING *;
```

**Business Logic:**
1. Validate JWT token and extract user ID
2. Verify user has editor or admin role
3. Validate all required fields present
4. Validate slug format and uniqueness
5. Validate form_fields JSON structure
6. Ensure at least one email field exists in form_fields
7. Set `publish_status = 'draft'`
8. Set `created_by` to authenticated user ID
9. Set `created_at` and `updated_at` to current timestamp
10. Insert record into database
11. Return created landing page

---

### 2. List Landing Pages

**Endpoint:** `GET /api/admin/landing-pages`

**Description:** Get a paginated list of landing pages with optional filters

**Authentication:** Required (JWT)

**Permissions:** Admin, Editor, Viewer

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 20 | Items per page (max 100) |
| `status` | string | all | Filter by publish_status: `draft`, `published`, `all` |
| `created_by` | integer | - | Filter by creator user ID |
| `search` | string | - | Search in title, headline, slug |
| `sort_by` | string | created_at | Sort field: `created_at`, `updated_at`, `title`, `published_at` |
| `sort_order` | string | desc | Sort order: `asc`, `desc` |

**Example Request:**

```
GET /api/admin/landing-pages?page=1&limit=20&status=published&sort_by=published_at&sort_order=desc
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "landing_pages": [
      {
        "id": 4,
        "title": "Free Marketing Guide 2025",
        "slug": "free-marketing-guide-2025",
        "headline": "Download Your Free Digital Marketing Guide",
        "publish_status": "published",
        "published_url": "https://innovateelectronics.com/lp/free-marketing-guide-2025",
        "published_at": "2025-12-02T14:30:00Z",
        "created_by": 1,
        "created_by_name": "Admin User",
        "created_at": "2025-12-01T10:00:00Z",
        "updated_at": "2025-12-02T14:30:00Z"
      },
      {
        "id": 3,
        "title": "Contact Sales - Enterprise Demo",
        "slug": "contact-sales",
        "headline": "Request a Personalized Demo",
        "publish_status": "published",
        "published_url": "https://innovateelectronics.com/lp/contact-sales",
        "published_at": "2025-11-28T09:15:00Z",
        "created_by": 2,
        "created_by_name": "Editor User",
        "created_at": "2025-11-27T16:45:00Z",
        "updated_at": "2025-11-28T09:15:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 42,
      "items_per_page": 20,
      "has_next": true,
      "has_prev": false
    },
    "filters": {
      "status": "published",
      "created_by": null,
      "search": null
    }
  }
}
```

**Success Response - Empty Results (200 OK):**

```json
{
  "success": true,
  "data": {
    "landing_pages": [],
    "pagination": {
      "current_page": 1,
      "total_pages": 0,
      "total_items": 0,
      "items_per_page": 20,
      "has_next": false,
      "has_prev": false
    },
    "filters": {
      "status": "draft",
      "created_by": 5,
      "search": null
    }
  }
}
```

**Error Response - Invalid Page:**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Page number must be a positive integer",
    "statusCode": 400
  }
}
```

**Database Query (with filters):**

```sql
-- Count total (for pagination)
SELECT COUNT(*) AS total
FROM landing_pages lp
LEFT JOIN users u ON lp.created_by = u.id
WHERE 1=1
  AND ($1::varchar IS NULL OR lp.publish_status = $1)  -- status filter
  AND ($2::integer IS NULL OR lp.created_by = $2)      -- created_by filter
  AND (
    $3::varchar IS NULL OR
    lp.title ILIKE '%' || $3 || '%' OR
    lp.headline ILIKE '%' || $3 || '%' OR
    lp.slug ILIKE '%' || $3 || '%'
  );  -- search filter

-- Get paginated results
SELECT
  lp.id,
  lp.title,
  lp.slug,
  lp.headline,
  lp.publish_status,
  lp.published_url,
  lp.published_at,
  lp.created_by,
  u.name AS created_by_name,
  lp.created_at,
  lp.updated_at
FROM landing_pages lp
LEFT JOIN users u ON lp.created_by = u.id
WHERE 1=1
  AND ($1::varchar IS NULL OR lp.publish_status = $1)
  AND ($2::integer IS NULL OR lp.created_by = $2)
  AND (
    $3::varchar IS NULL OR
    lp.title ILIKE '%' || $3 || '%' OR
    lp.headline ILIKE '%' || $3 || '%' OR
    lp.slug ILIKE '%' || $3 || '%'
  )
ORDER BY
  CASE WHEN $4 = 'created_at' AND $5 = 'desc' THEN lp.created_at END DESC,
  CASE WHEN $4 = 'created_at' AND $5 = 'asc' THEN lp.created_at END ASC,
  CASE WHEN $4 = 'updated_at' AND $5 = 'desc' THEN lp.updated_at END DESC,
  CASE WHEN $4 = 'updated_at' AND $5 = 'asc' THEN lp.updated_at END ASC,
  CASE WHEN $4 = 'title' AND $5 = 'asc' THEN lp.title END ASC,
  CASE WHEN $4 = 'title' AND $5 = 'desc' THEN lp.title END DESC,
  CASE WHEN $4 = 'published_at' AND $5 = 'desc' THEN lp.published_at END DESC NULLS LAST,
  CASE WHEN $4 = 'published_at' AND $5 = 'asc' THEN lp.published_at END ASC NULLS LAST
LIMIT $6 OFFSET $7;
```

**Business Logic:**
1. Validate JWT token
2. Verify user has viewer, editor, or admin role
3. Parse and validate query parameters
4. Build WHERE clause based on filters
5. Count total matching records (for pagination)
6. Calculate offset: `(page - 1) * limit`
7. Execute paginated query with sorting
8. Join with users table to get creator name
9. Calculate pagination metadata
10. Return results with pagination info

---

### 3. Get Single Landing Page

**Endpoint:** `GET /api/admin/landing-pages/:id`

**Description:** Get complete details of a single landing page by ID

**Authentication:** Required (JWT)

**Permissions:** Admin, Editor, Viewer

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Landing page ID |

**Example Request:**

```
GET /api/admin/landing-pages/5
```

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "title": "Free Marketing Guide 2025",
    "slug": "free-marketing-guide-2025",
    "headline": "Download Your Free Digital Marketing Guide",
    "subheading": "Learn the latest strategies that drive results in 2025",
    "body_text": "Our comprehensive 50-page guide covers SEO, social media, content marketing, email marketing, and paid advertising. Download now and transform your marketing strategy with proven tactics used by top companies.",
    "cta_text": "Get Your Free Guide",
    "hero_image_url": "https://example.com/images/marketing-guide-hero.jpg",
    "form_fields": {
      "fields": [
        {
          "name": "name",
          "label": "Full Name",
          "type": "text",
          "required": true,
          "placeholder": "Enter your name"
        },
        {
          "name": "email",
          "label": "Work Email",
          "type": "email",
          "required": true,
          "placeholder": "your@company.com"
        },
        {
          "name": "company",
          "label": "Company Name",
          "type": "text",
          "required": false,
          "placeholder": "Your company"
        }
      ]
    },
    "publish_status": "draft",
    "published_url": null,
    "published_at": null,
    "created_by": 1,
    "created_by_name": "Admin User",
    "created_by_email": "admin@example.com",
    "created_at": "2025-12-03T10:30:00Z",
    "updated_at": "2025-12-03T10:30:00Z",
    "lead_count": 0
  }
}
```

**Success Response - Published Page (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 3,
    "title": "Contact Sales - Enterprise Demo",
    "slug": "contact-sales",
    "headline": "Request a Personalized Demo",
    "subheading": "See how our platform can transform your business",
    "body_text": "Schedule a 30-minute demo with our sales team...",
    "cta_text": "Request Demo",
    "hero_image_url": "https://example.com/images/demo-hero.jpg",
    "form_fields": {
      "fields": [
        {
          "name": "name",
          "label": "Full Name",
          "type": "text",
          "required": true
        },
        {
          "name": "email",
          "label": "Work Email",
          "type": "email",
          "required": true
        },
        {
          "name": "company",
          "label": "Company",
          "type": "text",
          "required": true
        },
        {
          "name": "phone",
          "label": "Phone",
          "type": "tel",
          "required": false
        }
      ]
    },
    "publish_status": "published",
    "published_url": "https://innovateelectronics.com/lp/contact-sales",
    "published_at": "2025-11-28T09:15:00Z",
    "created_by": 2,
    "created_by_name": "Editor User",
    "created_by_email": "editor@example.com",
    "created_at": "2025-11-27T16:45:00Z",
    "updated_at": "2025-11-28T09:15:00Z",
    "lead_count": 23
  }
}
```

**Error Response - Not Found (404):**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Landing page not found",
    "details": {
      "id": 999
    },
    "statusCode": 404
  }
}
```

**Error Response - Invalid ID (400):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid landing page ID. Must be a positive integer.",
    "statusCode": 400
  }
}
```

**Database Query:**

```sql
SELECT
  lp.*,
  u.name AS created_by_name,
  u.email AS created_by_email,
  (SELECT COUNT(*) FROM leads WHERE landing_page_id = lp.id) AS lead_count
FROM landing_pages lp
LEFT JOIN users u ON lp.created_by = u.id
WHERE lp.id = $1;
```

**Business Logic:**
1. Validate JWT token
2. Verify user has viewer, editor, or admin role
3. Validate ID is a positive integer
4. Query database for landing page by ID
5. Join with users table to get creator details
6. Count associated leads
7. Return 404 if not found
8. Return complete landing page data

---

### 4. Update Landing Page

**Endpoint:** `PUT /api/admin/landing-pages/:id`

**Description:** Update an existing landing page (partial updates supported)

**Authentication:** Required (JWT)

**Permissions:** Admin, Editor

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Landing page ID |

**Request Body (all fields optional):**

```json
{
  "title": "Updated Title - Free Marketing Guide 2025",
  "slug": "marketing-guide-2025-updated",
  "headline": "Updated Headline",
  "subheading": "Updated subheading text",
  "body_text": "Updated body content...",
  "cta_text": "Download Now",
  "hero_image_url": "https://example.com/new-hero.jpg",
  "form_fields": {
    "fields": [
      {
        "name": "name",
        "label": "Your Name",
        "type": "text",
        "required": true
      },
      {
        "name": "email",
        "label": "Email",
        "type": "email",
        "required": true
      }
    ]
  }
}
```

**Validation Rules:**

1. **At least one field must be provided** (cannot send empty body)
2. **title**: If provided, 1-500 characters
3. **slug**:
   - If provided, must be unique (excluding current page)
   - Must match pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
4. **form_fields**:
   - If provided, must be valid JSON with "fields" array
   - Must contain at least one email field
5. **Published pages**: Can be edited (changes go live immediately)

**Success Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "title": "Updated Title - Free Marketing Guide 2025",
    "slug": "marketing-guide-2025-updated",
    "headline": "Updated Headline",
    "subheading": "Updated subheading text",
    "body_text": "Updated body content...",
    "cta_text": "Download Now",
    "hero_image_url": "https://example.com/new-hero.jpg",
    "form_fields": {
      "fields": [
        {
          "name": "name",
          "label": "Your Name",
          "type": "text",
          "required": true
        },
        {
          "name": "email",
          "label": "Email",
          "type": "email",
          "required": true
        }
      ]
    },
    "publish_status": "draft",
    "published_url": null,
    "published_at": null,
    "created_by": 1,
    "created_at": "2025-12-03T10:30:00Z",
    "updated_at": "2025-12-03T11:15:00Z"
  },
  "message": "Landing page updated successfully"
}
```

**Error Response - Not Found (404):**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Landing page not found",
    "details": {
      "id": 999
    },
    "statusCode": 404
  }
}
```

**Error Response - Duplicate Slug (409):**

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_SLUG",
    "message": "A landing page with this slug already exists",
    "details": {
      "slug": "marketing-guide-2025-updated",
      "existing_id": 8
    },
    "statusCode": 409
  }
}
```

**Error Response - Empty Body (400):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "At least one field must be provided for update",
    "statusCode": 400
  }
}
```

**Database Query:**

```sql
-- Check if landing page exists
SELECT id, publish_status FROM landing_pages WHERE id = $1;

-- Check slug uniqueness (if slug is being updated)
SELECT id FROM landing_pages
WHERE slug = $2 AND id != $1;

-- Update landing page (dynamic SET clause based on provided fields)
UPDATE landing_pages
SET
  title = COALESCE($2, title),
  slug = COALESCE($3, slug),
  headline = COALESCE($4, headline),
  subheading = COALESCE($5, subheading),
  body_text = COALESCE($6, body_text),
  cta_text = COALESCE($7, cta_text),
  hero_image_url = COALESCE($8, hero_image_url),
  form_fields = COALESCE($9, form_fields),
  updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
```

**Business Logic:**
1. Validate JWT token and extract user ID
2. Verify user has editor or admin role
3. Validate ID is a positive integer
4. Check landing page exists (return 404 if not)
5. Validate at least one field provided
6. Validate field formats (if provided)
7. If slug provided, check uniqueness (excluding current page)
8. If form_fields provided, validate structure and email field
9. Build dynamic UPDATE query (only update provided fields)
10. Update `updated_at` to current timestamp
11. Return updated landing page

**Note on Published Pages:**
- Published pages CAN be edited
- Changes go live immediately (no draft/staging concept in Phase 1)
- Consider showing warning in UI: "This page is published. Changes will be live immediately."

---

### 5. Publish Landing Page

**Endpoint:** `POST /api/admin/landing-pages/:id/publish`

**Description:** Publish a draft landing page (export to WordPress + update status)

**Authentication:** Required (JWT)

**Permissions:** Admin, Editor

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Landing page ID |

**Request Body:**

```json
{
  "wordpress_enabled": true,
  "wordpress_category_id": 5,
  "wordpress_author_id": 2
}
```

**Optional Fields:**
- `wordpress_enabled` (boolean, default: true) - Whether to push to WordPress
- `wordpress_category_id` (integer) - WordPress category ID
- `wordpress_author_id` (integer) - WordPress author user ID

**Validation Rules (Pre-Publish Checks):**

1. **Page must exist** (404 if not found)
2. **Page must be in 'draft' status** (cannot re-publish already published page in Phase 1)
3. **title** must be present
4. **slug** must be unique
5. **form_fields** must be valid JSON with at least one email field
6. **Recommended** (warnings, not blockers):
   - headline should be present
   - body_text should be present
   - cta_text should be present

**Success Response (200 OK) - WordPress Enabled:**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "title": "Free Marketing Guide 2025",
    "slug": "free-marketing-guide-2025",
    "headline": "Download Your Free Digital Marketing Guide",
    "subheading": "Learn the latest strategies that drive results in 2025",
    "body_text": "Our comprehensive 50-page guide covers...",
    "cta_text": "Get Your Free Guide",
    "hero_image_url": "https://example.com/images/marketing-guide-hero.jpg",
    "form_fields": {
      "fields": [
        {
          "name": "name",
          "label": "Full Name",
          "type": "text",
          "required": true
        },
        {
          "name": "email",
          "label": "Work Email",
          "type": "email",
          "required": true
        }
      ]
    },
    "publish_status": "published",
    "published_url": "https://innovateelectronics.com/lp/free-marketing-guide-2025",
    "published_at": "2025-12-03T12:00:00Z",
    "wordpress_post_id": 847,
    "created_by": 1,
    "created_at": "2025-12-03T10:30:00Z",
    "updated_at": "2025-12-03T12:00:00Z"
  },
  "message": "Landing page published successfully to WordPress",
  "warnings": []
}
```

**Success Response - With Warnings:**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "title": "Free Marketing Guide 2025",
    "slug": "free-marketing-guide-2025",
    "headline": null,
    "subheading": null,
    "body_text": null,
    "cta_text": "Submit",
    "hero_image_url": null,
    "form_fields": {
      "fields": [
        {
          "name": "email",
          "label": "Email",
          "type": "email",
          "required": true
        }
      ]
    },
    "publish_status": "published",
    "published_url": "https://innovateelectronics.com/lp/free-marketing-guide-2025",
    "published_at": "2025-12-03T12:00:00Z",
    "wordpress_post_id": 847,
    "created_by": 1,
    "created_at": "2025-12-03T10:30:00Z",
    "updated_at": "2025-12-03T12:00:00Z"
  },
  "message": "Landing page published successfully to WordPress",
  "warnings": [
    "Missing recommended field: headline",
    "Missing recommended field: body_text",
    "Missing recommended field: hero_image_url"
  ]
}
```

**Success Response (200 OK) - WordPress Disabled (DMAT-hosted):**

```json
{
  "success": true,
  "data": {
    "id": 5,
    "title": "Free Marketing Guide 2025",
    "slug": "free-marketing-guide-2025",
    "headline": "Download Your Free Digital Marketing Guide",
    "subheading": "Learn the latest strategies that drive results in 2025",
    "body_text": "Our comprehensive 50-page guide covers...",
    "cta_text": "Get Your Free Guide",
    "hero_image_url": "https://example.com/images/marketing-guide-hero.jpg",
    "form_fields": {
      "fields": [
        {
          "name": "name",
          "label": "Full Name",
          "type": "text",
          "required": true
        },
        {
          "name": "email",
          "label": "Work Email",
          "type": "email",
          "required": true
        }
      ]
    },
    "publish_status": "published",
    "published_url": "https://dmat-app.example.com/public/lp/free-marketing-guide-2025",
    "published_at": "2025-12-03T12:00:00Z",
    "wordpress_post_id": null,
    "created_by": 1,
    "created_at": "2025-12-03T10:30:00Z",
    "updated_at": "2025-12-03T12:00:00Z"
  },
  "message": "Landing page published successfully (DMAT-hosted)",
  "warnings": []
}
```

**Error Response - Not Found (404):**

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Landing page not found",
    "details": {
      "id": 999
    },
    "statusCode": 404
  }
}
```

**Error Response - Already Published (400):**

```json
{
  "success": false,
  "error": {
    "code": "ALREADY_PUBLISHED",
    "message": "Landing page is already published. Use the update endpoint to make changes.",
    "details": {
      "id": 5,
      "current_status": "published",
      "published_at": "2025-12-03T12:00:00Z",
      "published_url": "https://innovateelectronics.com/lp/free-marketing-guide-2025"
    },
    "statusCode": 400
  }
}
```

**Error Response - Validation Failed (400):**

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Landing page cannot be published. Required fields are missing.",
    "details": [
      {
        "field": "form_fields",
        "message": "Form must contain at least one email field for lead capture"
      }
    ],
    "statusCode": 400
  }
}
```

**Error Response - WordPress API Failure (502):**

```json
{
  "success": false,
  "error": {
    "code": "WORDPRESS_API_ERROR",
    "message": "Failed to publish to WordPress. Please try again.",
    "details": {
      "wordpress_error": "Connection timeout",
      "wordpress_url": "https://innovateelectronics.com/wp-json/wp/v2/pages"
    },
    "statusCode": 502
  }
}
```

**WordPress Integration Flow:**

1. **Build WordPress Page Content:**
```json
{
  "title": "Free Marketing Guide 2025",
  "slug": "free-marketing-guide-2025",
  "status": "publish",
  "content": "[Generated HTML with headline, subheading, body_text, form, CTA]",
  "template": "landing-page-template",
  "meta": {
    "dmat_landing_page_id": 5,
    "dmat_form_fields": "[JSON-encoded form_fields]"
  }
}
```

2. **WordPress REST API Call:**
```javascript
POST https://innovateelectronics.com/wp-json/wp/v2/pages
Authorization: Basic [base64(username:application_password)]
Content-Type: application/json

{
  "title": "Free Marketing Guide 2025",
  "slug": "free-marketing-guide-2025",
  "status": "publish",
  "content": "<h1>Download Your Free Digital Marketing Guide</h1>...",
  "template": "landing-page-template",
  "categories": [5],
  "author": 2,
  "meta": {
    "dmat_landing_page_id": 5
  }
}
```

3. **WordPress Success Response:**
```json
{
  "id": 847,
  "date": "2025-12-03T12:00:00",
  "slug": "free-marketing-guide-2025",
  "status": "publish",
  "link": "https://innovateelectronics.com/lp/free-marketing-guide-2025",
  "title": {
    "rendered": "Free Marketing Guide 2025"
  }
}
```

**Database Queries:**

```sql
-- 1. Get landing page and validate
SELECT * FROM landing_pages WHERE id = $1;

-- 2. Validate publish_status is 'draft'
-- (checked in application logic)

-- 3. Validate required fields
-- (checked in application logic)

-- 4. After successful WordPress publish, update landing page
UPDATE landing_pages
SET
  publish_status = 'published',
  published_url = $2,  -- WordPress URL or DMAT URL
  published_at = COALESCE(published_at, CURRENT_TIMESTAMP),  -- Set only if NULL (first publish)
  updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
```

**Business Logic:**

1. Validate JWT token and extract user ID
2. Verify user has editor or admin role
3. Validate ID is a positive integer
4. Fetch landing page from database
5. Return 404 if not found
6. Check publish_status is 'draft' (return 400 if already published)
7. **Pre-publish validation:**
   - title must be present
   - slug must be unique
   - form_fields must be valid JSON
   - form_fields must contain at least one email field
8. **Recommended field checks (warnings only):**
   - headline, body_text, cta_text, hero_image_url
9. **If WordPress enabled:**
   - Build WordPress page content (HTML)
   - Call WordPress REST API POST /wp-json/wp/v2/pages
   - Handle API errors (return 502 if WordPress fails)
   - Extract WordPress post ID and URL from response
   - Set `published_url = WordPress URL`
10. **If WordPress disabled:**
    - Generate DMAT-hosted URL: `https://dmat-app.example.com/public/lp/{slug}`
    - Set `published_url = DMAT URL`
11. **Update database:**
    - Set `publish_status = 'published'`
    - Set `published_url` (WordPress or DMAT)
    - Set `published_at = CURRENT_TIMESTAMP` (if first publish, otherwise keep original)
    - Set `updated_at = CURRENT_TIMESTAMP`
12. Return updated landing page with warnings (if any)

**Phase 1 Simplifications:**
- No separate "unpublish" endpoint (use status update if needed)
- No scheduled publishing (Phase 2)
- No draft → publish → edit workflow (published pages can be edited directly)
- WordPress page remains if unpublished (manual WordPress deletion required)

---

### 6. Delete Landing Page (Bonus Operation)

**Endpoint:** `DELETE /api/admin/landing-pages/:id`

**Description:** Delete a landing page (soft delete or hard delete based on status)

**Authentication:** Required (JWT)

**Permissions:** Admin, Editor

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Landing page ID |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `force` | boolean | false | Force delete even if published (requires confirmation) |

**Success Response (200 OK) - Draft Deleted:**

```json
{
  "success": true,
  "message": "Landing page deleted successfully",
  "data": {
    "id": 5,
    "title": "Free Marketing Guide 2025",
    "publish_status": "draft",
    "deleted_at": "2025-12-03T13:00:00Z"
  }
}
```

**Error Response - Published Page (400):**

```json
{
  "success": false,
  "error": {
    "code": "CANNOT_DELETE_PUBLISHED",
    "message": "Cannot delete published landing page. Unpublish it first or use force=true.",
    "details": {
      "id": 3,
      "publish_status": "published",
      "published_url": "https://innovateelectronics.com/lp/contact-sales",
      "lead_count": 23
    },
    "statusCode": 400
  }
}
```

**Warning Response - Force Delete (200 OK):**

```json
{
  "success": true,
  "message": "Landing page deleted (force=true). Associated leads retained.",
  "data": {
    "id": 3,
    "title": "Contact Sales",
    "publish_status": "published",
    "deleted_at": "2025-12-03T13:00:00Z",
    "lead_count": 23
  },
  "warnings": [
    "WordPress page NOT deleted automatically. Manual deletion required.",
    "23 leads were associated with this page. They remain in the system with landing_page_id = NULL."
  ]
}
```

**Database Query:**

```sql
-- Check if landing page exists and get details
SELECT
  lp.*,
  (SELECT COUNT(*) FROM leads WHERE landing_page_id = lp.id) AS lead_count
FROM landing_pages lp
WHERE id = $1;

-- Delete landing page (hard delete)
DELETE FROM landing_pages WHERE id = $1
RETURNING id, title, publish_status;
```

**Business Logic:**
1. Validate JWT token and extract user ID
2. Verify user has editor or admin role
3. Validate ID is a positive integer
4. Fetch landing page from database
5. Return 404 if not found
6. Count associated leads
7. **If publish_status = 'published' AND force != true:**
   - Return 400 error with details
8. **If force = true OR publish_status = 'draft':**
   - Delete landing page from database
   - Leads remain with `landing_page_id = NULL` (FK ON DELETE SET NULL)
   - Return success with warnings
9. **Note:** WordPress page is NOT automatically deleted (manual action required)

---

## 📊 Common Response Patterns

### Standard Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... },
    "statusCode": 400
  }
}
```

### Response with Warnings

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "warnings": [
    "Warning message 1",
    "Warning message 2"
  ]
}
```

---

## 🔍 Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid JWT token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `DUPLICATE_SLUG` | 409 | Slug already exists |
| `ALREADY_PUBLISHED` | 400 | Page already published |
| `CANNOT_DELETE_PUBLISHED` | 400 | Cannot delete published page |
| `WORDPRESS_API_ERROR` | 502 | WordPress API failure |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected server error |

---

## 🧪 Testing Checklist

### Create Landing Page
- [ ] Create draft with all fields
- [ ] Create with minimum required fields only
- [ ] Attempt create with duplicate slug (should fail)
- [ ] Attempt create with invalid slug format (should fail)
- [ ] Attempt create without email field in form_fields (should fail)
- [ ] Attempt create as viewer (should fail - 403)
- [ ] Attempt create without authentication (should fail - 401)

### List Landing Pages
- [ ] List all landing pages (no filters)
- [ ] Filter by status: draft
- [ ] Filter by status: published
- [ ] Filter by created_by
- [ ] Search by title
- [ ] Search by headline
- [ ] Search by slug
- [ ] Sort by created_at (asc/desc)
- [ ] Sort by published_at (asc/desc)
- [ ] Paginate results (page 1, 2, 3...)
- [ ] Test with limit=5, limit=50, limit=100
- [ ] Test empty results
- [ ] Test as viewer (should succeed)

### Get Single Landing Page
- [ ] Get existing draft page
- [ ] Get existing published page
- [ ] Get non-existent page (should return 404)
- [ ] Get with invalid ID (should return 400)
- [ ] Verify lead_count is correct
- [ ] Test as viewer (should succeed)

### Update Landing Page
- [ ] Update title only
- [ ] Update multiple fields
- [ ] Update slug to unique value
- [ ] Attempt update slug to duplicate (should fail - 409)
- [ ] Update published page (should succeed)
- [ ] Update form_fields
- [ ] Attempt update with empty body (should fail)
- [ ] Attempt update non-existent page (should return 404)
- [ ] Attempt update as viewer (should fail - 403)

### Publish Landing Page
- [ ] Publish draft with all fields (WordPress enabled)
- [ ] Publish draft with minimum fields + warnings (WordPress enabled)
- [ ] Publish draft (WordPress disabled, DMAT-hosted)
- [ ] Attempt publish already published page (should fail - 400)
- [ ] Attempt publish with missing required fields (should fail - 400)
- [ ] Attempt publish with invalid form_fields (should fail - 400)
- [ ] Simulate WordPress API failure (should return 502)
- [ ] Verify published_at is set on first publish
- [ ] Verify published_at unchanged on re-publish (if implemented)
- [ ] Test as viewer (should fail - 403)

### Delete Landing Page
- [ ] Delete draft page
- [ ] Attempt delete published page without force (should fail - 400)
- [ ] Delete published page with force=true
- [ ] Delete non-existent page (should return 404)
- [ ] Verify leads remain after delete (landing_page_id = NULL)
- [ ] Test as viewer (should fail - 403)

---

## 📚 Related Documentation

- [Phase 1 Success Criteria](./Phase1-Success-Criteria.md) - Phase 1 goals and scope
- [Phase 1 Landing Page Schema](./Phase1-LandingPage-Schema.md) - Database field specifications
- [Phase 1 Landing Page Lifecycle](./Phase1-LandingPage-Lifecycle.md) - State machine and transitions
- [Phase 1 User Flows](./Phase1-User-Flows.md) - End-to-end user journeys
- [Database Schema](./Database-Schema.md) - Complete database documentation

---

## 🔮 Future Enhancements (Phase 2+)

1. **Unpublish Endpoint** - `POST /api/admin/landing-pages/:id/unpublish`
2. **Schedule Publishing** - `POST /api/admin/landing-pages/:id/schedule`
3. **Duplicate Landing Page** - `POST /api/admin/landing-pages/:id/duplicate`
4. **Bulk Operations** - `POST /api/admin/landing-pages/bulk` (delete, publish, etc.)
5. **Version History** - `GET /api/admin/landing-pages/:id/versions`
6. **Preview URL** - `GET /api/admin/landing-pages/:id/preview`
7. **Analytics** - `GET /api/admin/landing-pages/:id/analytics`
8. **A/B Testing** - `POST /api/admin/landing-pages/:id/variants`

---

**API Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-03
**Maintained by:** DMAT Backend Team
