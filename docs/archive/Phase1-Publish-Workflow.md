# Phase 1 Publish Action Workflow

**Version:** 1.0
**Date:** 2025-12-03
**Purpose:** Technical specification of the landing page publish operation

---

## 📋 Overview

This document specifies exactly what happens when the "Publish" button is clicked in DMAT. It covers the complete workflow from validation through WordPress export to database updates.

**Two Publishing Paths:**
1. **WordPress-Enabled:** Export page to WordPress via REST API
2. **DMAT-Hosted:** Publish page on DMAT platform (fallback or standalone mode)

---

## 🔄 High-Level Publish Workflow

```
┌─────────────────────┐
│  User clicks        │
│  "Publish" button   │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────────────────────────────┐
│ 1. Validate Request & Permissions           │
│    - User authenticated?                    │
│    - User has editor/admin role?            │
│    - Landing page exists?                   │
└──────────┬──────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────┐
│ 2. Pre-Publish Validation                   │
│    - Status is 'draft'? (not already pub)   │
│    - Required fields present?               │
│    - Form has email field?                  │
└──────────┬──────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────┐
│ 3. Check Recommended Fields (warnings)      │
│    - Headline present?                      │
│    - Body text present?                     │
│    - CTA text present?                      │
│    - Hero image present?                    │
└──────────┬──────────────────────────────────┘
           │
           ↓
    ┌──────┴──────┐
    │             │
    ↓             ↓
WordPress     DMAT-Hosted
  Path           Path
    │             │
    ↓             ↓
┌─────────┐  ┌──────────┐
│ Step 4  │  │ Step 4'  │
│ Convert │  │ Generate │
│ to HTML │  │ DMAT URL │
└────┬────┘  └────┬─────┘
     │            │
     ↓            │
┌─────────┐       │
│ Step 5  │       │
│ Call WP │       │
│ API     │       │
└────┬────┘       │
     │            │
     ↓            ↓
┌─────────────────────────────────────────────┐
│ 6. Update Database                          │
│    - publish_status = 'published'           │
│    - published_url = [WordPress or DMAT]    │
│    - published_at = CURRENT_TIMESTAMP       │
│    - updated_at = CURRENT_TIMESTAMP         │
└──────────┬──────────────────────────────────┘
           │
           ↓
┌─────────────────────┐
│ 7. Return Response  │
│    - Updated page   │
│    - Success msg    │
│    - Warnings       │
└─────────────────────┘
```

---

## 📝 Step-by-Step Workflow

### Step 1: Validate Request & Permissions

**Purpose:** Ensure request is valid and user has permission

**Checks:**
1. JWT token present and valid?
2. User exists in database?
3. User role is 'admin' or 'editor'?
4. Landing page ID is valid integer?
5. Landing page exists in database?

**Database Query:**
```sql
-- Get landing page with creator info
SELECT
  lp.*,
  u.name AS created_by_name,
  u.email AS created_by_email
FROM landing_pages lp
LEFT JOIN users u ON lp.created_by = u.id
WHERE lp.id = $1;
```

**Errors:**
- 401: User not authenticated
- 403: User is viewer (insufficient permissions)
- 404: Landing page not found
- 400: Invalid landing page ID

**On Success:** Continue to Step 2

---

### Step 2: Pre-Publish Validation (Required Checks)

**Purpose:** Ensure page meets minimum requirements for publishing

**Required Validations:**

#### 2.1: Check Current Status
```javascript
if (landingPage.publish_status !== 'draft') {
  return error(400, 'ALREADY_PUBLISHED',
    'Landing page is already published. Use update endpoint to make changes.',
    {
      id: landingPage.id,
      current_status: landingPage.publish_status,
      published_at: landingPage.published_at,
      published_url: landingPage.published_url
    }
  );
}
```

#### 2.2: Check Title Present
```javascript
if (!landingPage.title || landingPage.title.trim() === '') {
  return error(400, 'VALIDATION_ERROR',
    'Landing page cannot be published. Required fields are missing.',
    [{ field: 'title', message: 'Title is required' }]
  );
}
```

#### 2.3: Check Slug Uniqueness
```sql
-- Check no other page uses this slug
SELECT id FROM landing_pages
WHERE slug = $1 AND id != $2;
```

```javascript
if (duplicateSlugExists) {
  return error(409, 'DUPLICATE_SLUG',
    'A landing page with this slug already exists',
    {
      slug: landingPage.slug,
      existing_id: duplicatePage.id
    }
  );
}
```

#### 2.4: Validate Form Fields JSON
```javascript
// Check form_fields is valid JSON
let formFields;
try {
  formFields = typeof landingPage.form_fields === 'string'
    ? JSON.parse(landingPage.form_fields)
    : landingPage.form_fields;
} catch (err) {
  return error(400, 'VALIDATION_ERROR',
    'Form fields must be valid JSON',
    [{ field: 'form_fields', message: 'Invalid JSON format' }]
  );
}

// Check has 'fields' array
if (!formFields.fields || !Array.isArray(formFields.fields)) {
  return error(400, 'VALIDATION_ERROR',
    'Form fields must contain a "fields" array',
    [{ field: 'form_fields', message: 'Missing or invalid "fields" array' }]
  );
}
```

#### 2.5: Check Email Field Exists
```javascript
const hasEmailField = formFields.fields.some(field =>
  field.type === 'email'
);

if (!hasEmailField) {
  return error(400, 'VALIDATION_ERROR',
    'Form must contain at least one email field for lead capture',
    [{ field: 'form_fields', message: 'At least one field must have type "email"' }]
  );
}
```

**All Validations Pass:** Continue to Step 3

**Any Validation Fails:** Return 400 error with details

---

### Step 3: Check Recommended Fields (Warnings)

**Purpose:** Check for fields that improve user experience (non-blocking)

**Warnings Array:**
```javascript
const warnings = [];

if (!landingPage.headline || landingPage.headline.trim() === '') {
  warnings.push('Missing recommended field: headline');
}

if (!landingPage.body_text || landingPage.body_text.trim() === '') {
  warnings.push('Missing recommended field: body_text');
}

if (!landingPage.cta_text || landingPage.cta_text.trim() === '') {
  warnings.push('Missing recommended field: cta_text (using default "Submit")');
}

if (!landingPage.hero_image_url || landingPage.hero_image_url.trim() === '') {
  warnings.push('Missing recommended field: hero_image_url');
}
```

**Note:** Warnings do NOT block publishing, they're just returned in the response

**Continue to Step 4** (WordPress path) or **Step 4'** (DMAT-hosted path)

---

## 🌐 WordPress Publishing Path

### Step 4: Convert Landing Page to WordPress Format

**Purpose:** Transform DMAT landing page data into WordPress-compatible HTML

#### 4.1: Build HTML Content

**Template Structure:**
```html
<!-- WordPress page content -->
<div class="dmat-landing-page" data-dmat-id="{landing_page_id}">

  <!-- Hero Section -->
  <section class="dmat-hero">
    {hero_image_html}
    <div class="dmat-hero-content">
      <h1 class="dmat-headline">{headline}</h1>
      <h2 class="dmat-subheading">{subheading}</h2>
    </div>
  </section>

  <!-- Body Section -->
  <section class="dmat-body">
    <div class="dmat-body-text">
      {body_text_html}
    </div>
  </section>

  <!-- Form Section -->
  <section class="dmat-form">
    <form id="dmat-lead-form-{landing_page_id}"
          class="dmat-lead-form"
          method="POST"
          action="{form_action_url}">

      <!-- Hidden field: landing page ID -->
      <input type="hidden" name="landing_page_id" value="{landing_page_id}">

      <!-- Dynamic form fields -->
      {form_fields_html}

      <!-- Submit button -->
      <button type="submit" class="dmat-cta-button">
        {cta_text}
      </button>
    </form>
  </section>

</div>
```

#### 4.2: Implementation Function

```javascript
function convertToWordPressHTML(landingPage) {
  // Hero image HTML
  const heroImageHtml = landingPage.hero_image_url
    ? `<img src="${escapeHtml(landingPage.hero_image_url)}"
            alt="${escapeHtml(landingPage.headline || landingPage.title)}"
            class="dmat-hero-image">`
    : '';

  // Headline HTML (use title as fallback)
  const headlineHtml = landingPage.headline
    ? `<h1 class="dmat-headline">${escapeHtml(landingPage.headline)}</h1>`
    : `<h1 class="dmat-headline">${escapeHtml(landingPage.title)}</h1>`;

  // Subheading HTML
  const subheadingHtml = landingPage.subheading
    ? `<h2 class="dmat-subheading">${escapeHtml(landingPage.subheading)}</h2>`
    : '';

  // Body text HTML (convert line breaks to paragraphs)
  const bodyTextHtml = landingPage.body_text
    ? formatBodyText(landingPage.body_text)
    : '';

  // Form fields HTML
  const formFieldsHtml = buildFormFieldsHTML(landingPage.form_fields, landingPage.id);

  // CTA text
  const ctaText = landingPage.cta_text || 'Submit';

  // Form action URL (DMAT lead capture endpoint)
  const formActionUrl = `${process.env.DMAT_BASE_URL}/api/public/leads`;

  // Build complete HTML
  return `
    <div class="dmat-landing-page" data-dmat-id="${landingPage.id}">
      ${heroImageHtml ? `
      <section class="dmat-hero">
        ${heroImageHtml}
        <div class="dmat-hero-content">
          ${headlineHtml}
          ${subheadingHtml}
        </div>
      </section>
      ` : `
      <section class="dmat-header">
        ${headlineHtml}
        ${subheadingHtml}
      </section>
      `}

      ${bodyTextHtml ? `
      <section class="dmat-body">
        <div class="dmat-body-text">
          ${bodyTextHtml}
        </div>
      </section>
      ` : ''}

      <section class="dmat-form">
        <form id="dmat-lead-form-${landingPage.id}"
              class="dmat-lead-form"
              method="POST"
              action="${formActionUrl}">
          <input type="hidden" name="landing_page_id" value="${landingPage.id}">
          ${formFieldsHtml}
          <button type="submit" class="dmat-cta-button">
            ${escapeHtml(ctaText)}
          </button>
        </form>
      </section>
    </div>
  `;
}
```

#### 4.3: Build Form Fields HTML

```javascript
function buildFormFieldsHTML(formFieldsJson, landingPageId) {
  const formFields = typeof formFieldsJson === 'string'
    ? JSON.parse(formFieldsJson)
    : formFieldsJson;

  return formFields.fields.map(field => {
    const fieldId = `dmat-field-${landingPageId}-${field.name}`;
    const requiredAttr = field.required ? 'required' : '';
    const requiredLabel = field.required ? '<span class="required">*</span>' : '';

    // Build input HTML based on field type
    let inputHtml;
    switch (field.type) {
      case 'textarea':
        inputHtml = `
          <textarea
            id="${fieldId}"
            name="${escapeHtml(field.name)}"
            class="dmat-form-field dmat-textarea"
            placeholder="${escapeHtml(field.placeholder || '')}"
            ${requiredAttr}
          ></textarea>
        `;
        break;

      case 'select':
        inputHtml = `
          <select
            id="${fieldId}"
            name="${escapeHtml(field.name)}"
            class="dmat-form-field dmat-select"
            ${requiredAttr}
          >
            <option value="">Select...</option>
            ${field.options ? field.options.map(opt =>
              `<option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`
            ).join('') : ''}
          </select>
        `;
        break;

      default: // text, email, tel, url, etc.
        inputHtml = `
          <input
            type="${escapeHtml(field.type)}"
            id="${fieldId}"
            name="${escapeHtml(field.name)}"
            class="dmat-form-field dmat-input"
            placeholder="${escapeHtml(field.placeholder || '')}"
            ${requiredAttr}
          />
        `;
    }

    return `
      <div class="dmat-form-group">
        <label for="${fieldId}" class="dmat-form-label">
          ${escapeHtml(field.label)}
          ${requiredLabel}
        </label>
        ${inputHtml}
      </div>
    `;
  }).join('\n');
}
```

#### 4.4: Helper Functions

```javascript
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

function formatBodyText(bodyText) {
  // Convert line breaks to paragraphs
  const paragraphs = bodyText
    .split('\n\n')
    .filter(p => p.trim() !== '')
    .map(p => `<p>${escapeHtml(p.trim())}</p>`);

  return paragraphs.join('\n');
}
```

#### 4.5: Example Output

**Input (DMAT Landing Page):**
```javascript
{
  id: 5,
  title: "Free Marketing Guide 2025",
  slug: "free-marketing-guide-2025",
  headline: "Download Your Free Digital Marketing Guide",
  subheading: "Learn the latest strategies that drive results",
  body_text: "Our comprehensive 50-page guide covers SEO, social media, content marketing, and more.\n\nDownload now and transform your marketing strategy!",
  cta_text: "Get Your Free Guide",
  hero_image_url: "https://example.com/images/hero.jpg",
  form_fields: {
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "company", label: "Company", type: "text", required: false }
    ]
  }
}
```

**Output (WordPress HTML):**
```html
<div class="dmat-landing-page" data-dmat-id="5">
  <section class="dmat-hero">
    <img src="https://example.com/images/hero.jpg"
         alt="Download Your Free Digital Marketing Guide"
         class="dmat-hero-image">
    <div class="dmat-hero-content">
      <h1 class="dmat-headline">Download Your Free Digital Marketing Guide</h1>
      <h2 class="dmat-subheading">Learn the latest strategies that drive results</h2>
    </div>
  </section>

  <section class="dmat-body">
    <div class="dmat-body-text">
      <p>Our comprehensive 50-page guide covers SEO, social media, content marketing, and more.</p>
      <p>Download now and transform your marketing strategy!</p>
    </div>
  </section>

  <section class="dmat-form">
    <form id="dmat-lead-form-5"
          class="dmat-lead-form"
          method="POST"
          action="https://dmat-api.example.com/api/public/leads">
      <input type="hidden" name="landing_page_id" value="5">

      <div class="dmat-form-group">
        <label for="dmat-field-5-name" class="dmat-form-label">
          Full Name
          <span class="required">*</span>
        </label>
        <input type="text"
               id="dmat-field-5-name"
               name="name"
               class="dmat-form-field dmat-input"
               required />
      </div>

      <div class="dmat-form-group">
        <label for="dmat-field-5-email" class="dmat-form-label">
          Email
          <span class="required">*</span>
        </label>
        <input type="email"
               id="dmat-field-5-email"
               name="email"
               class="dmat-form-field dmat-input"
               required />
      </div>

      <div class="dmat-form-group">
        <label for="dmat-field-5-company" class="dmat-form-label">
          Company
        </label>
        <input type="text"
               id="dmat-field-5-company"
               name="company"
               class="dmat-form-field dmat-input" />
      </div>

      <button type="submit" class="dmat-cta-button">
        Get Your Free Guide
      </button>
    </form>
  </section>
</div>
```

---

### Step 5: Call WordPress REST API

**Purpose:** Create page in WordPress and get published URL

#### 5.1: Prepare WordPress API Request

```javascript
async function publishToWordPress(landingPage, options = {}) {
  const wpConfig = {
    baseUrl: process.env.WORDPRESS_BASE_URL,
    username: process.env.WORDPRESS_API_USERNAME,
    applicationPassword: process.env.WORDPRESS_API_PASSWORD
  };

  // Build HTML content
  const htmlContent = convertToWordPressHTML(landingPage);

  // Prepare request payload
  const payload = {
    title: landingPage.title,
    slug: landingPage.slug,
    status: 'publish', // Publish immediately
    content: htmlContent,
    template: 'landing-page-template', // Custom WP template (if available)

    // WordPress post metadata
    meta: {
      dmat_landing_page_id: landingPage.id,
      dmat_form_endpoint: `${process.env.DMAT_BASE_URL}/api/public/leads`,
      dmat_created_at: landingPage.created_at
    },

    // Optional: WordPress category and author
    categories: options.wordpress_category_id ? [options.wordpress_category_id] : [],
    author: options.wordpress_author_id || 1
  };

  // Build Authorization header
  const authToken = Buffer.from(
    `${wpConfig.username}:${wpConfig.applicationPassword}`
  ).toString('base64');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${authToken}`
  };

  return { wpConfig, payload, headers };
}
```

#### 5.2: Make HTTP Request to WordPress

```javascript
async function callWordPressAPI(landingPage, options = {}) {
  const { wpConfig, payload, headers } = await publishToWordPress(landingPage, options);

  const wpApiUrl = `${wpConfig.baseUrl}/wp-json/wp/v2/pages`;

  try {
    const response = await fetch(wpApiUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
      timeout: 30000 // 30 second timeout
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`WordPress API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const wpResponse = await response.json();
    return wpResponse;

  } catch (error) {
    // Handle network errors, timeouts, etc.
    throw new Error(`Failed to publish to WordPress: ${error.message}`);
  }
}
```

#### 5.3: WordPress API Response

**Success Response (WordPress):**
```json
{
  "id": 847,
  "date": "2025-12-03T12:00:00",
  "date_gmt": "2025-12-03T17:00:00",
  "guid": {
    "rendered": "https://innovateelectronics.com/?page_id=847"
  },
  "modified": "2025-12-03T12:00:00",
  "modified_gmt": "2025-12-03T17:00:00",
  "slug": "free-marketing-guide-2025",
  "status": "publish",
  "type": "page",
  "link": "https://innovateelectronics.com/lp/free-marketing-guide-2025",
  "title": {
    "rendered": "Free Marketing Guide 2025"
  },
  "content": {
    "rendered": "<div class=\"dmat-landing-page\" data-dmat-id=\"5\">...</div>",
    "protected": false
  },
  "author": 2,
  "featured_media": 0,
  "parent": 0,
  "menu_order": 0,
  "template": "landing-page-template",
  "meta": {
    "dmat_landing_page_id": 5,
    "dmat_form_endpoint": "https://dmat-api.example.com/api/public/leads"
  }
}
```

#### 5.4: Extract Published URL

```javascript
function extractPublishedUrl(wpResponse) {
  // WordPress provides the full URL in the 'link' field
  return wpResponse.link;
}
```

**Example:**
```javascript
const publishedUrl = extractPublishedUrl(wpResponse);
// Result: "https://innovateelectronics.com/lp/free-marketing-guide-2025"
```

#### 5.5: Handle WordPress API Errors

```javascript
async function publishToWordPressWithErrorHandling(landingPage, options) {
  try {
    const wpResponse = await callWordPressAPI(landingPage, options);
    const publishedUrl = extractPublishedUrl(wpResponse);

    return {
      success: true,
      wordpress_post_id: wpResponse.id,
      published_url: publishedUrl,
      wordpress_response: wpResponse
    };

  } catch (error) {
    console.error('WordPress publish failed:', error);

    return {
      success: false,
      error: {
        code: 'WORDPRESS_API_ERROR',
        message: 'Failed to publish to WordPress. Please try again.',
        details: {
          wordpress_error: error.message,
          wordpress_url: `${process.env.WORDPRESS_BASE_URL}/wp-json/wp/v2/pages`
        }
      }
    };
  }
}
```

**Continue to Step 6** (Update Database)

---

## 🏠 DMAT-Hosted Publishing Path

### Step 4': Generate DMAT URL

**Purpose:** Create public URL for DMAT-hosted landing page (WordPress disabled)

#### 4'.1: URL Construction Logic

**URL Pattern:**
```
{DMAT_PUBLIC_BASE_URL}/lp/{slug}
```

**Implementation:**
```javascript
function generateDmatPublishedUrl(landingPage) {
  const baseUrl = process.env.DMAT_PUBLIC_BASE_URL || 'https://dmat-app.example.com/public';
  const slug = landingPage.slug;

  return `${baseUrl}/lp/${slug}`;
}
```

**Example:**
```javascript
const landingPage = { slug: 'free-marketing-guide-2025' };
const publishedUrl = generateDmatPublishedUrl(landingPage);
// Result: "https://dmat-app.example.com/public/lp/free-marketing-guide-2025"
```

#### 4'.2: DMAT-Hosted Page Rendering

**Note:** The actual page rendering happens via a public route that:
1. Fetches landing page data from database by slug
2. Renders using a DMAT template (React or server-side)
3. Serves the public page

**Public Route (Future Implementation):**
```javascript
// GET /public/lp/:slug
app.get('/public/lp/:slug', async (req, res) => {
  const { slug } = req.params;

  // Fetch published landing page
  const landingPage = await db.query(`
    SELECT * FROM landing_pages
    WHERE slug = $1 AND publish_status = 'published'
  `, [slug]);

  if (!landingPage) {
    return res.status(404).send('Landing page not found');
  }

  // Render page using DMAT template
  res.render('landing-page', { landingPage });
});
```

**Continue to Step 6** (Update Database)

---

## 💾 Step 6: Update Database

**Purpose:** Save published status and URL to database

### 6.1: Database Update Query

```sql
UPDATE landing_pages
SET
  publish_status = 'published',
  published_url = $2,
  published_at = COALESCE(published_at, CURRENT_TIMESTAMP), -- Set only if NULL (first publish)
  updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
```

**Parameters:**
- `$1` = landing page ID
- `$2` = published URL (WordPress or DMAT)

### 6.2: Implementation

```javascript
async function updateLandingPagePublishStatus(landingPageId, publishedUrl) {
  const query = `
    UPDATE landing_pages
    SET
      publish_status = 'published',
      published_url = $2,
      published_at = COALESCE(published_at, CURRENT_TIMESTAMP),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *;
  `;

  const result = await db.query(query, [landingPageId, publishedUrl]);
  return result.rows[0];
}
```

### 6.3: Important Notes

**`published_at` Timestamp Logic:**
- **First publish:** `published_at` is NULL → set to CURRENT_TIMESTAMP
- **Re-publish (future):** `published_at` has value → keep original timestamp

This preserves the **original publish date** even if page is unpublished and re-published later.

**`updated_at` Timestamp:**
- Always set to CURRENT_TIMESTAMP (records when publish action occurred)

---

## 📤 Step 7: Return Response

**Purpose:** Send success response with updated landing page data

### 7.1: Success Response Structure

```javascript
function buildPublishSuccessResponse(updatedLandingPage, warnings, wordpressPostId = null) {
  return {
    success: true,
    data: {
      ...updatedLandingPage,
      wordpress_post_id: wordpressPostId
    },
    message: wordpressPostId
      ? 'Landing page published successfully to WordPress'
      : 'Landing page published successfully (DMAT-hosted)',
    warnings: warnings
  };
}
```

### 7.2: Example Response (WordPress)

```json
{
  "success": true,
  "data": {
    "id": 5,
    "title": "Free Marketing Guide 2025",
    "slug": "free-marketing-guide-2025",
    "headline": "Download Your Free Digital Marketing Guide",
    "subheading": "Learn the latest strategies that drive results",
    "body_text": "Our comprehensive 50-page guide covers...",
    "cta_text": "Get Your Free Guide",
    "hero_image_url": "https://example.com/images/hero.jpg",
    "form_fields": {
      "fields": [
        { "name": "name", "label": "Full Name", "type": "text", "required": true },
        { "name": "email", "label": "Email", "type": "email", "required": true }
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

### 7.3: Example Response (DMAT-Hosted)

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
        { "name": "email", "label": "Email", "type": "email", "required": true }
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
  "warnings": [
    "Missing recommended field: headline",
    "Missing recommended field: subheading",
    "Missing recommended field: body_text",
    "Missing recommended field: hero_image_url"
  ]
}
```

---

## 🚨 Error Handling & Rollback

### WordPress API Failure

**Scenario:** WordPress API call fails (network error, timeout, WordPress down)

**Behavior:**
1. Do NOT update database (landing page remains in draft status)
2. Return 502 error to user
3. Log error for debugging
4. User can retry publish

**Implementation:**
```javascript
async function publishLandingPage(landingPageId, options) {
  // Steps 1-3: Validation (already done)

  // Step 4-5: Try WordPress publish
  if (options.wordpress_enabled !== false) {
    const wpResult = await publishToWordPressWithErrorHandling(landingPage, options);

    if (!wpResult.success) {
      // WordPress failed - do NOT update database
      return {
        success: false,
        error: wpResult.error
      };
    }

    // WordPress succeeded - update database
    const updatedPage = await updateLandingPagePublishStatus(
      landingPageId,
      wpResult.published_url
    );

    return buildPublishSuccessResponse(updatedPage, warnings, wpResult.wordpress_post_id);
  }

  // DMAT-hosted path
  const dmatUrl = generateDmatPublishedUrl(landingPage);
  const updatedPage = await updateLandingPagePublishStatus(landingPageId, dmatUrl);

  return buildPublishSuccessResponse(updatedPage, warnings, null);
}
```

**Key Principle:** Only update database AFTER successful WordPress publish (atomic operation)

### Database Update Failure

**Scenario:** WordPress publish succeeded but database update fails

**Behavior:**
1. WordPress page exists (can't easily rollback)
2. Return 500 error
3. Log error with WordPress post ID
4. Manual intervention required (update DB manually or delete WordPress page)

**Mitigation (Future):**
- Implement database transaction
- If DB update fails, call WordPress API to delete the created page
- Complex rollback logic (Phase 2 enhancement)

---

## 🔧 Configuration & Environment Variables

### Required Environment Variables

```bash
# DMAT Base URLs
DMAT_BASE_URL=https://dmat-api.example.com
DMAT_PUBLIC_BASE_URL=https://dmat-app.example.com/public

# WordPress Configuration
WORDPRESS_BASE_URL=https://innovateelectronics.com
WORDPRESS_API_USERNAME=dmat_api_user
WORDPRESS_API_PASSWORD=xxxx-xxxx-xxxx-xxxx-xxxx-xxxx

# WordPress Publishing (optional)
WORDPRESS_DEFAULT_CATEGORY_ID=5
WORDPRESS_DEFAULT_AUTHOR_ID=2
WORDPRESS_PUBLISH_ENABLED=true
```

### WordPress Setup Requirements

**WordPress Side:**
1. WordPress REST API enabled (default in WP 4.7+)
2. Application passwords enabled for authentication
3. API user account with 'publish_pages' capability
4. Optional: Custom landing page template installed

**DMAT Side:**
1. WordPress credentials configured
2. Network access to WordPress site
3. HTTPS enabled (required for application passwords)

---

## 📊 Complete Publish Function (Pseudocode)

```javascript
async function publishLandingPageOperation(req, res) {
  try {
    // Step 1: Validate request & permissions
    const user = await authenticateUser(req);
    if (!user || !['admin', 'editor'].includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const landingPageId = parseInt(req.params.id);
    const landingPage = await getLandingPageById(landingPageId);
    if (!landingPage) {
      return res.status(404).json({ error: 'Landing page not found' });
    }

    // Step 2: Pre-publish validation (required)
    if (landingPage.publish_status !== 'draft') {
      return res.status(400).json({ error: 'Already published' });
    }

    const validationErrors = validateRequiredFields(landingPage);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    // Step 3: Check recommended fields (warnings)
    const warnings = checkRecommendedFields(landingPage);

    // Step 4 & 5: Publish to WordPress OR generate DMAT URL
    let publishedUrl;
    let wordpressPostId = null;

    if (req.body.wordpress_enabled !== false) {
      // WordPress path
      const wpResult = await publishToWordPressWithErrorHandling(landingPage, req.body);

      if (!wpResult.success) {
        return res.status(502).json(wpResult.error);
      }

      publishedUrl = wpResult.published_url;
      wordpressPostId = wpResult.wordpress_post_id;
    } else {
      // DMAT-hosted path
      publishedUrl = generateDmatPublishedUrl(landingPage);
    }

    // Step 6: Update database
    const updatedPage = await updateLandingPagePublishStatus(landingPageId, publishedUrl);

    // Step 7: Return response
    return res.status(200).json(
      buildPublishSuccessResponse(updatedPage, warnings, wordpressPostId)
    );

  } catch (error) {
    console.error('Publish error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] HTML conversion (all field combinations)
- [ ] Form fields HTML generation (text, email, textarea, select)
- [ ] URL generation (WordPress and DMAT)
- [ ] Validation logic (required and recommended fields)
- [ ] Error handling (WordPress failures)

### Integration Tests
- [ ] Full publish flow (WordPress enabled)
- [ ] Full publish flow (DMAT-hosted)
- [ ] WordPress API mocking
- [ ] Database transaction rollback
- [ ] Authentication and authorization

### End-to-End Tests
- [ ] Publish minimal landing page (title + email field only)
- [ ] Publish complete landing page (all fields)
- [ ] Publish with warnings (missing recommended fields)
- [ ] WordPress publish failure (network error)
- [ ] WordPress publish failure (invalid credentials)
- [ ] Already published error
- [ ] Permission denied (viewer role)

---

## 📚 Related Documentation

- [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md) - API endpoint specifications
- [Phase1-API-Plain-English.md](./Phase1-API-Plain-English.md) - Plain English API guide
- [Phase1-LandingPage-Lifecycle.md](./Phase1-LandingPage-Lifecycle.md) - State transitions
- [Phase1-User-Flows.md](./Phase1-User-Flows.md) - End-to-end user flows

---

## 🔮 Future Enhancements (Phase 2+)

1. **Preview Mode** - Generate preview URL before publishing
2. **Scheduled Publishing** - Publish at specific date/time
3. **WordPress Template Selection** - Choose from multiple WP templates
4. **Custom CSS/JS** - Inject custom styling and scripts
5. **A/B Testing** - Publish multiple variants
6. **Rollback** - Unpublish and delete WordPress page atomically
7. **Draft Revisions** - Save multiple versions before publishing

---

**Workflow Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-03
**Maintained by:** DMAT Backend Team
