# Phase 1 Public Form Submission & Lead Capture

**Version:** 1.0
**Date:** 2025-12-03
**Purpose:** Technical specification for public lead capture API

---

## 📋 Overview

This document specifies the public-facing API endpoint that receives form submissions from published landing pages (WordPress or DMAT-hosted). When a visitor fills out and submits a landing page form, their information is sent to DMAT and stored as a lead.

**Key Characteristics:**
- **Public endpoint** - No authentication required (open to the internet)
- **Cross-origin requests** - Forms on WordPress domain post to DMAT domain
- **High traffic** - Must handle many concurrent submissions
- **Security critical** - Vulnerable to spam, bot submissions, abuse

---

## 🔄 High-Level Lead Capture Workflow

```
┌───────────────────┐
│  Visitor on       │
│  Landing Page     │
│  (WordPress or    │
│  DMAT-hosted)     │
└─────────┬─────────┘
          │
          │ Fills out form
          │ Clicks Submit
          ↓
┌─────────────────────────────────────────────┐
│ 1. Browser Form Submission                  │
│    - POST to /api/public/leads              │
│    - Content-Type: application/json         │
│    - Origin: WordPress or DMAT domain       │
└──────────┬──────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────┐
│ 2. DMAT Backend: CORS Check                 │
│    - Allow cross-origin requests            │
│    - Set CORS headers                       │
└──────────┬──────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────┐
│ 3. Rate Limiting & Spam Protection          │
│    - Check request rate (per IP)            │
│    - Basic bot detection                    │
└──────────┬──────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────┐
│ 4. Validate Request                         │
│    - landing_page_id present?               │
│    - Landing page exists & published?       │
│    - Required fields present?               │
│    - Email format valid?                    │
└──────────┬──────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────┐
│ 5. Extract & Enrich Lead Data               │
│    - Form fields (name, email, etc.)        │
│    - Source attribution (landing_page_id)   │
│    - Technical metadata (IP, user agent)    │
│    - Referrer & landing URL                 │
└──────────┬──────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────┐
│ 6. Create Lead Record                       │
│    - INSERT INTO leads table                │
│    - Store all captured data                │
│    - Set source = 'landing_page'            │
│    - Set created_at timestamp               │
└──────────┬──────────────────────────────────┘
           │
           ↓
┌─────────────────────────────────────────────┐
│ 7. Return Success Response                  │
│    - 201 Created                            │
│    - Thank you message                      │
│    - Optional: redirect URL                 │
└──────────┬──────────────────────────────────┘
           │
           ↓
┌─────────────────────┐
│ 8. Browser Action   │
│    - Show thank you │
│    - OR redirect    │
└─────────────────────┘
```

---

## 🌐 Public API Endpoint

### Endpoint Specification

**URL:** `POST /api/public/leads`

**Authentication:** None (public endpoint)

**Content-Type:** `application/json` or `application/x-www-form-urlencoded`

**CORS:** Enabled (required for cross-domain form submissions)

**Rate Limiting:** 10 submissions per minute per IP address

---

## 📝 Request Format

### Form Submission from WordPress

**HTML Form (from WordPress landing page):**
```html
<form id="dmat-lead-form-5"
      class="dmat-lead-form"
      method="POST"
      action="https://dmat-api.example.com/api/public/leads">

  <!-- Hidden field: landing page ID -->
  <input type="hidden" name="landing_page_id" value="5">

  <!-- Dynamic form fields -->
  <input type="text" name="name" required>
  <input type="email" name="email" required>
  <input type="text" name="company">
  <input type="tel" name="phone">

  <button type="submit">Get Your Free Guide</button>
</form>
```

**JavaScript Form Handler (recommended):**
```javascript
document.getElementById('dmat-lead-form-5').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Gather form data
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Add technical metadata
  data.referrer_url = document.referrer;
  data.landing_url = window.location.href;
  data.user_agent = navigator.userAgent;

  try {
    // Submit to DMAT API
    const response = await fetch('https://dmat-api.example.com/api/public/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      // Show thank you message or redirect
      window.location.href = result.redirect_url || '/thank-you';
    } else {
      // Show error message
      alert('Submission failed. Please try again.');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    alert('Network error. Please try again.');
  }
});
```

### Request Body (JSON)

```json
{
  "landing_page_id": 5,
  "name": "John Smith",
  "email": "john.smith@company.com",
  "company": "Acme Corporation",
  "phone": "+1-555-123-4567",
  "job_title": "Marketing Director",
  "message": "I'm interested in learning more about your product.",
  "referrer_url": "https://google.com/search?q=digital+marketing+guide",
  "landing_url": "https://innovateelectronics.com/lp/free-marketing-guide-2025?utm_source=google&utm_medium=cpc",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
}
```

### Required Fields

**Always Required:**
- `landing_page_id` (integer) - Which landing page this submission is from

**Dynamically Required:**
- Any fields marked as `required: true` in the landing page's `form_fields` configuration
- At minimum, the `email` field is always required (enforced at publish time)

### Optional Fields

**Standard Contact Fields:**
- `name` (string, max 255 chars)
- `email` (string, valid email format, max 255 chars)
- `phone` (string, max 50 chars)
- `company` (string, max 255 chars)
- `job_title` (string, max 255 chars)
- `message` (text, no length limit)

**Technical Metadata (auto-captured):**
- `referrer_url` (string, max 2048 chars) - Where visitor came from
- `landing_url` (string, max 2048 chars) - Full URL with UTM parameters
- `user_agent` (string, max 1000 chars) - Browser/device info
- `ip_address` (string, max 45 chars) - Visitor IP (captured by backend)

**Custom Fields:**
- Any other fields defined in the landing page's `form_fields` configuration
- Stored in database for future use

---

## 🔒 Security & Validation

### Step 2: CORS Configuration

**Purpose:** Allow form submissions from WordPress domain to DMAT domain

**Implementation:**
```javascript
// Express.js middleware
app.use('/api/public/leads', (req, res, next) => {
  // Allow requests from any origin (Phase 1 simplification)
  res.header('Access-Control-Allow-Origin', '*');

  // Allow specific headers
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  // Allow POST method
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});
```

**Production Enhancement (Phase 2):**
```javascript
// Only allow specific domains
const allowedOrigins = [
  'https://innovateelectronics.com',
  'https://dmat-app.example.com',
  process.env.WORDPRESS_BASE_URL
];

res.header('Access-Control-Allow-Origin',
  allowedOrigins.includes(req.headers.origin) ? req.headers.origin : allowedOrigins[0]
);
```

### Step 3: Rate Limiting & Spam Protection

**Purpose:** Prevent spam, bot submissions, and abuse

#### 3.1: Rate Limiting (Per IP)

```javascript
const rateLimit = require('express-rate-limit');

const leadSubmissionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many submissions. Please try again in a moment.',
      statusCode: 429
    }
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false
});

app.post('/api/public/leads', leadSubmissionLimiter, handleLeadSubmission);
```

#### 3.2: Basic Bot Detection (Phase 1)

**Honeypot Field:**
```html
<!-- Add to form (hidden from humans, visible to bots) -->
<input type="text"
       name="website"
       style="display:none"
       tabindex="-1"
       autocomplete="off">
```

**Backend Check:**
```javascript
// Reject submission if honeypot field is filled
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
```

**Time-Based Check:**
```javascript
// Form includes hidden timestamp field
const submissionTime = Date.now();
const formLoadTime = parseInt(req.body.form_load_time);
const timeDiff = submissionTime - formLoadTime;

// Reject if submitted too quickly (< 2 seconds = likely bot)
if (timeDiff < 2000) {
  return res.status(400).json({
    success: false,
    error: {
      code: 'SPAM_DETECTED',
      message: 'Invalid submission',
      statusCode: 400
    }
  });
}
```

**Future Enhancements (Phase 2+):**
- Google reCAPTCHA v3
- hCaptcha
- More sophisticated bot detection
- IP blacklist/whitelist

### Step 4: Validate Request

**Purpose:** Ensure submission has all required data and landing page is valid

#### 4.1: Check landing_page_id Present

```javascript
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
```

#### 4.2: Verify Landing Page Exists & Published

```sql
-- Fetch landing page with form fields
SELECT
  id,
  slug,
  form_fields,
  publish_status,
  published_url
FROM landing_pages
WHERE id = $1;
```

```javascript
const landingPage = await db.query(
  'SELECT * FROM landing_pages WHERE id = $1',
  [req.body.landing_page_id]
);

if (!landingPage) {
  return res.status(404).json({
    success: false,
    error: {
      code: 'LANDING_PAGE_NOT_FOUND',
      message: 'Landing page not found',
      statusCode: 404
    }
  });
}

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
```

#### 4.3: Validate Required Fields

```javascript
function validateRequiredFields(formData, landingPage) {
  const formFields = typeof landingPage.form_fields === 'string'
    ? JSON.parse(landingPage.form_fields)
    : landingPage.form_fields;

  const errors = [];

  formFields.fields.forEach(field => {
    if (field.required) {
      const value = formData[field.name];

      if (!value || value.trim() === '') {
        errors.push({
          field: field.name,
          message: `${field.label} is required`
        });
      }
    }
  });

  return errors;
}

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
```

#### 4.4: Validate Email Format

```javascript
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

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
```

#### 4.5: Sanitize Input Data

```javascript
function sanitizeString(str, maxLength) {
  if (!str) return null;

  // Trim whitespace
  let cleaned = str.trim();

  // Remove control characters
  cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, '');

  // Truncate to max length
  if (maxLength && cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }

  return cleaned;
}

const sanitizedData = {
  name: sanitizeString(req.body.name, 255),
  email: sanitizeString(req.body.email, 255),
  phone: sanitizeString(req.body.phone, 50),
  company: sanitizeString(req.body.company, 255),
  job_title: sanitizeString(req.body.job_title, 255),
  message: sanitizeString(req.body.message, 10000),
  referrer_url: sanitizeString(req.body.referrer_url, 2048),
  landing_url: sanitizeString(req.body.landing_url, 2048),
  user_agent: sanitizeString(req.body.user_agent, 1000)
};
```

---

## 💾 Step 5 & 6: Extract Data & Create Lead Record

### 5.1: Extract Technical Metadata

```javascript
function extractMetadata(req, landingPage) {
  return {
    // Source attribution
    source: 'landing_page',
    source_details: `LP: ${landingPage.slug}`,
    landing_page_id: landingPage.id,

    // Technical metadata
    ip_address: extractIpAddress(req),
    user_agent: req.body.user_agent || req.headers['user-agent'],
    referrer_url: req.body.referrer_url || req.headers['referer'],
    landing_url: req.body.landing_url || req.headers['referer']
  };
}

function extractIpAddress(req) {
  // Check for IP in various headers (for proxies/load balancers)
  return req.headers['x-forwarded-for']?.split(',')[0] ||
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress;
}
```

### 5.2: Build Lead Data Object

```javascript
function buildLeadData(formData, landingPage, req) {
  const sanitized = sanitizeFormData(formData);
  const metadata = extractMetadata(req, landingPage);

  return {
    // Contact information
    name: sanitized.name || null,
    email: sanitized.email, // Required
    phone: sanitized.phone || null,
    company: sanitized.company || null,
    job_title: sanitized.job_title || null,
    message: sanitized.message || null,

    // Source attribution
    source: metadata.source,
    source_details: metadata.source_details,
    landing_page_id: metadata.landing_page_id,

    // Technical metadata
    referrer_url: metadata.referrer_url || null,
    landing_url: metadata.landing_url || null,
    user_agent: metadata.user_agent || null,
    ip_address: metadata.ip_address || null,

    // Timestamps (set by database)
    created_at: null, // Will be set by CURRENT_TIMESTAMP
    updated_at: null  // Will be set by CURRENT_TIMESTAMP
  };
}
```

### 6.1: Insert Lead into Database

**SQL Query:**
```sql
INSERT INTO leads (
  name,
  email,
  phone,
  company,
  job_title,
  message,
  source,
  source_details,
  landing_page_id,
  referrer_url,
  landing_url,
  user_agent,
  ip_address,
  created_at,
  updated_at
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
RETURNING *;
```

**Implementation:**
```javascript
async function createLead(leadData) {
  const query = `
    INSERT INTO leads (
      name, email, phone, company, job_title, message,
      source, source_details, landing_page_id,
      referrer_url, landing_url, user_agent, ip_address,
      created_at, updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
    )
    RETURNING *;
  `;

  const values = [
    leadData.name,
    leadData.email,
    leadData.phone,
    leadData.company,
    leadData.job_title,
    leadData.message,
    leadData.source,
    leadData.source_details,
    leadData.landing_page_id,
    leadData.referrer_url,
    leadData.landing_url,
    leadData.user_agent,
    leadData.ip_address
  ];

  const result = await db.query(query, values);
  return result.rows[0];
}
```

### 6.2: Database Transaction (Recommended)

```javascript
async function createLeadWithTransaction(leadData) {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    // Insert lead
    const lead = await createLead(leadData, client);

    // Optional: Update landing page stats (future enhancement)
    // await incrementLeadCount(leadData.landing_page_id, client);

    await client.query('COMMIT');

    return lead;

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

---

## 📤 Step 7: Return Success Response

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Thank you for your submission!",
  "data": {
    "lead_id": 42,
    "email": "john.smith@company.com"
  },
  "redirect_url": null
}
```

**With Redirect:**
```json
{
  "success": true,
  "message": "Thank you for your submission!",
  "data": {
    "lead_id": 42,
    "email": "john.smith@company.com"
  },
  "redirect_url": "https://innovateelectronics.com/thank-you"
}
```

**Implementation:**
```javascript
function buildSuccessResponse(lead, landingPage) {
  return {
    success: true,
    message: 'Thank you for your submission!',
    data: {
      lead_id: lead.id,
      email: lead.email
    },
    // Optional: redirect URL (configured per landing page)
    redirect_url: landingPage.thank_you_url || null
  };
}
```

### Error Responses

**400 Bad Request - Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Required fields are missing",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "name",
        "message": "Full Name is required"
      }
    ],
    "statusCode": 400
  }
}
```

**404 Not Found - Landing Page Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "LANDING_PAGE_NOT_FOUND",
    "message": "Landing page not found",
    "statusCode": 404
  }
}
```

**429 Too Many Requests - Rate Limit:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many submissions. Please try again in a moment.",
    "statusCode": 429
  }
}
```

**500 Internal Server Error - Database Error:**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An error occurred while processing your submission. Please try again.",
    "statusCode": 500
  }
}
```

---

## 📊 Complete Lead Submission Handler

```javascript
async function handleLeadSubmission(req, res) {
  try {
    // Step 1: CORS already handled by middleware

    // Step 2: Rate limiting already handled by middleware

    // Step 3: Basic bot detection
    if (req.body.website) {
      return res.status(400).json({
        success: false,
        error: { code: 'SPAM_DETECTED', message: 'Invalid submission', statusCode: 400 }
      });
    }

    // Step 4.1: Check landing_page_id
    if (!req.body.landing_page_id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required field: landing_page_id',
          statusCode: 400
        }
      });
    }

    // Step 4.2: Fetch landing page
    const landingPage = await db.query(
      'SELECT * FROM landing_pages WHERE id = $1',
      [req.body.landing_page_id]
    );

    if (!landingPage) {
      return res.status(404).json({
        success: false,
        error: { code: 'LANDING_PAGE_NOT_FOUND', message: 'Landing page not found', statusCode: 404 }
      });
    }

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

    // Step 4.3: Validate required fields
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

    // Step 4.4: Validate email format
    if (req.body.email && !isValidEmail(req.body.email)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email format',
          statusCode: 400
        }
      });
    }

    // Step 5: Build lead data
    const leadData = buildLeadData(req.body, landingPage, req);

    // Step 6: Create lead record
    const lead = await createLeadWithTransaction(leadData);

    // Step 7: Return success response
    return res.status(201).json(
      buildSuccessResponse(lead, landingPage)
    );

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
}
```

---

## 🌐 Frontend Integration

### WordPress Form with JavaScript

**Complete Example:**
```html
<form id="dmat-lead-form-5" class="dmat-lead-form">
  <!-- Hidden fields -->
  <input type="hidden" name="landing_page_id" value="5">
  <input type="hidden" name="form_load_time" id="form-load-time">
  <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">

  <!-- Visible fields -->
  <div class="form-group">
    <label for="name">Full Name *</label>
    <input type="text" id="name" name="name" required>
  </div>

  <div class="form-group">
    <label for="email">Email *</label>
    <input type="email" id="email" name="email" required>
  </div>

  <div class="form-group">
    <label for="company">Company</label>
    <input type="text" id="company" name="company">
  </div>

  <button type="submit">Get Your Free Guide</button>
  <div id="form-message"></div>
</form>

<script>
(function() {
  // Set form load time (for bot detection)
  document.getElementById('form-load-time').value = Date.now();

  // Form submission handler
  const form = document.getElementById('dmat-lead-form-5');
  const messageEl = document.getElementById('form-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Gather form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Add technical metadata
    data.referrer_url = document.referrer;
    data.landing_url = window.location.href;
    data.user_agent = navigator.userAgent;

    try {
      const response = await fetch('https://dmat-api.example.com/api/public/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        // Success
        messageEl.className = 'success-message';
        messageEl.textContent = result.message;
        form.reset();

        // Redirect if URL provided
        if (result.redirect_url) {
          setTimeout(() => {
            window.location.href = result.redirect_url;
          }, 1500);
        }
      } else {
        // Error
        messageEl.className = 'error-message';
        messageEl.textContent = result.error.message || 'Submission failed. Please try again.';

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get Your Free Guide';
      }

    } catch (error) {
      console.error('Form submission error:', error);
      messageEl.className = 'error-message';
      messageEl.textContent = 'Network error. Please try again.';

      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.textContent = 'Get Your Free Guide';
    }
  });
})();
</script>
```

---

## 🧪 Testing Checklist

### Unit Tests
- [ ] CORS headers set correctly
- [ ] Rate limiting enforces 10 requests/minute
- [ ] Honeypot field detection works
- [ ] landing_page_id validation
- [ ] Landing page exists validation
- [ ] Landing page published status check
- [ ] Required fields validation (dynamic based on form config)
- [ ] Email format validation
- [ ] Input sanitization (max length, control chars)
- [ ] IP address extraction (various headers)
- [ ] Lead data building
- [ ] Success response formatting

### Integration Tests
- [ ] Full submission flow (valid data)
- [ ] Database transaction (lead created)
- [ ] Invalid landing_page_id (404 error)
- [ ] Unpublished landing page (400 error)
- [ ] Missing required fields (400 error)
- [ ] Invalid email format (400 error)
- [ ] Rate limit exceeded (429 error)
- [ ] Honeypot field filled (spam detected)
- [ ] Database error handling (500 error)
- [ ] CORS preflight request (OPTIONS)

### End-to-End Tests
- [ ] Submit form from WordPress (cross-domain)
- [ ] Submit form from DMAT-hosted page (same domain)
- [ ] Verify lead appears in DMAT admin
- [ ] Verify all fields captured correctly
- [ ] Verify source attribution correct
- [ ] Verify technical metadata captured
- [ ] Test redirect URL functionality
- [ ] Test with missing optional fields
- [ ] Test with maximum field lengths
- [ ] Test multiple rapid submissions (rate limit)

### Security Tests
- [ ] SQL injection attempts
- [ ] XSS attempts in form fields
- [ ] Extremely long input strings
- [ ] Special characters in all fields
- [ ] Bot submission (honeypot filled)
- [ ] Bot submission (< 2 second submit)
- [ ] Rate limit bypass attempts
- [ ] Invalid Content-Type headers
- [ ] CORS from unauthorized domain

---

## 🚨 Error Handling & Edge Cases

### Database Connection Failure
```javascript
try {
  const lead = await createLead(leadData);
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    console.error('Database connection failed:', error);
    return res.status(503).json({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Service temporarily unavailable. Please try again later.',
        statusCode: 503
      }
    });
  }
  throw error;
}
```

### Duplicate Email Submission
**Phase 1:** Allow duplicate emails (same person can submit multiple times)

**Future Enhancement (Phase 2):**
- Check for duplicate email within time window (e.g., 5 minutes)
- Update existing lead instead of creating new
- Merge form data

### Invalid JSON in form_fields
```javascript
let formFields;
try {
  formFields = typeof landingPage.form_fields === 'string'
    ? JSON.parse(landingPage.form_fields)
    : landingPage.form_fields;
} catch (error) {
  console.error('Invalid form_fields JSON:', error);
  // Fallback: allow any fields (don't block submission)
  formFields = { fields: [] };
}
```

### Missing Technical Metadata
All technical metadata fields (IP, user agent, referrer, landing URL) are optional. If not captured, store as NULL.

---

## 📈 Performance Considerations

### Database Indexing
```sql
-- Index for lead lookups by landing page
CREATE INDEX IF NOT EXISTS idx_leads_landing_page_id
ON leads(landing_page_id);

-- Index for lead lookups by email
CREATE INDEX IF NOT EXISTS idx_leads_email
ON leads(email);

-- Index for lead lookups by created date
CREATE INDEX IF NOT EXISTS idx_leads_created_at
ON leads(created_at DESC);
```

### Caching Landing Page Data
```javascript
// Cache landing page data to reduce DB queries
const landingPageCache = new Map();

async function getLandingPageCached(landingPageId) {
  const cacheKey = `lp_${landingPageId}`;

  if (landingPageCache.has(cacheKey)) {
    return landingPageCache.get(cacheKey);
  }

  const landingPage = await db.query(
    'SELECT * FROM landing_pages WHERE id = $1',
    [landingPageId]
  );

  if (landingPage) {
    // Cache for 5 minutes
    landingPageCache.set(cacheKey, landingPage);
    setTimeout(() => landingPageCache.delete(cacheKey), 5 * 60 * 1000);
  }

  return landingPage;
}
```

### Async Lead Processing (Future)
For high-traffic scenarios, consider:
- Queue-based processing (Redis, RabbitMQ)
- Immediate response to user (202 Accepted)
- Background worker processes lead creation
- Prevents blocking on database writes

---

## 🔐 Privacy & Compliance

### GDPR/CCPA Considerations

**IP Address Storage:**
- Store IP addresses for fraud detection (legitimate interest)
- Consider IP anonymization (mask last octet)
- Include in privacy policy

**User Agent Storage:**
- Used for analytics and troubleshooting
- Generally not considered personal data
- Include in privacy policy

**Data Retention:**
- Define retention policy (e.g., 2 years)
- Implement data deletion workflow
- Allow users to request deletion

**Privacy Policy Link:**
- Include on landing page form
- Require consent checkbox (optional but recommended)

```html
<div class="form-group">
  <label>
    <input type="checkbox" name="consent" required>
    I agree to the <a href="/privacy-policy" target="_blank">Privacy Policy</a>
  </label>
</div>
```

---

## 📚 Related Documentation

- [Phase1-Publish-Workflow.md](./Phase1-Publish-Workflow.md) - How forms are published
- [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md) - Admin API operations
- [Phase1-Lead-Schema.md](./Phase1-Lead-Schema.md) - Lead database fields
- [Phase1-User-Flows.md](./Phase1-User-Flows.md) - Complete user flows

---

## 🔮 Future Enhancements (Phase 2+)

1. **File Uploads** - Allow visitors to upload documents (resume, etc.)
2. **Multi-Step Forms** - Break long forms into multiple steps
3. **Conditional Fields** - Show/hide fields based on previous answers
4. **Real-Time Validation** - Validate fields as user types
5. **Progressive Profiling** - Ask different questions to returning visitors
6. **Duplicate Detection** - Merge duplicate leads automatically
7. **Email Verification** - Send confirmation email with verification link
8. **Lead Scoring** - Automatically score leads based on form data
9. **Webhooks** - Notify external systems on new leads
10. **Thank You Page Personalization** - Dynamic thank you message based on submission

---

**API Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-03
**Maintained by:** DMAT Backend Team
