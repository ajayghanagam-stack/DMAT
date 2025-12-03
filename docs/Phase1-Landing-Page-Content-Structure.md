# Phase 1 Landing Page Content Structure

**Version:** 1.0
**Date:** 2025-12-03
**Purpose:** Specification of HTML content structure for published landing pages

---

## 📋 Overview

This document specifies the exact HTML structure and content that DMAT generates when publishing a landing page. This structure is used for:

1. **Mock WordPress** (Phase 1) - Generated as static HTML files
2. **Real WordPress** (Phase 2+) - Sent as page content via REST API

**Key Principle:** The same HTML structure is used for both mock and WordPress implementations, ensuring consistent user experience and seamless migration.

---

## 🎯 Content Components

Every published landing page consists of these components:

1. **Page Metadata** - Title, description, meta tags
2. **Hero Section** - Headline, subheading, hero image, visual appeal
3. **Body Section** - Main content, paragraphs, formatted text
4. **Form Section** - Lead capture form with dynamic fields
5. **JavaScript** - Form handling, validation, submission
6. **CSS** - Styling (embedded or linked)

---

## 📊 Data Mapping: DMAT → HTML

### Source: DMAT Landing Page Record

```javascript
{
  // Database fields
  id: 5,
  title: "Free Marketing Guide 2025",
  slug: "free-marketing-guide-2025",
  headline: "Download Your Free Digital Marketing Guide",
  subheading: "Learn the latest strategies that drive results in 2025",
  body_text: "Our comprehensive 50-page guide covers SEO, social media, content marketing, and more.\n\nDownload now and transform your marketing strategy!",
  cta_text: "Get Your Free Guide",
  hero_image_url: "https://example.com/images/marketing-guide-hero.jpg",
  form_fields: {
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
  publish_status: "published",
  published_url: "https://dmat-app.example.com/pages/free-marketing-guide-2025.html",
  published_at: "2025-12-03T12:00:00Z"
}
```

### Target: HTML Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Page Metadata -->
</head>
<body>
  <div class="dmat-landing-page" data-dmat-id="5">
    <!-- Hero Section -->
    <!-- Body Section -->
    <!-- Form Section -->
  </div>
  <!-- JavaScript -->
</body>
</html>
```

---

## 📄 Component 1: Page Metadata

### HTML Head Section

```html
<head>
  <!-- Character encoding -->
  <meta charset="UTF-8">

  <!-- Viewport for responsive design -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Page title (browser tab, bookmarks, search results) -->
  <title>{{title}} | InnovateElectronics</title>

  <!-- Meta description (search results, social sharing) -->
  <meta name="description" content="{{subheading}}">

  <!-- Open Graph tags (social media sharing) -->
  <meta property="og:title" content="{{title}}">
  <meta property="og:description" content="{{subheading}}">
  <meta property="og:image" content="{{hero_image_url}}">
  <meta property="og:url" content="{{published_url}}">
  <meta property="og:type" content="website">

  <!-- Twitter Card tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{title}}">
  <meta name="twitter:description" content="{{subheading}}">
  <meta name="twitter:image" content="{{hero_image_url}}">

  <!-- Robots meta (allow indexing) -->
  <meta name="robots" content="index, follow">

  <!-- DMAT metadata (for tracking and debugging) -->
  <meta name="dmat-landing-page-id" content="{{id}}">
  <meta name="dmat-slug" content="{{slug}}">
  <meta name="dmat-published-at" content="{{published_at}}">
  <meta name="dmat-version" content="1.0">

  <!-- Styles -->
  <link rel="stylesheet" href="/assets/css/landing-page.css">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/assets/images/favicon.png">
</head>
```

### Data Mapping for Metadata

| DMAT Field | HTML Element | Usage |
|------------|--------------|-------|
| `title` | `<title>` | Browser tab, bookmarks |
| `title` | `<meta property="og:title">` | Social sharing title |
| `subheading` | `<meta name="description">` | Search result snippet |
| `subheading` | `<meta property="og:description">` | Social sharing description |
| `hero_image_url` | `<meta property="og:image">` | Social sharing image |
| `published_url` | `<meta property="og:url">` | Canonical URL |
| `id` | `<meta name="dmat-landing-page-id">` | DMAT tracking |
| `slug` | `<meta name="dmat-slug">` | DMAT tracking |
| `published_at` | `<meta name="dmat-published-at">` | DMAT tracking |

### SEO Considerations

**Title Tag Best Practices:**
- Keep under 60 characters (displayed in search results)
- Include brand name: `{{title}} | InnovateElectronics`
- Most important keywords first

**Meta Description Best Practices:**
- Keep 150-160 characters (displayed in search results)
- Use `subheading` field (designed for this purpose)
- Include call-to-action if possible

**Open Graph Best Practices:**
- Required for proper social media sharing
- Image should be 1200×630 pixels (Facebook/LinkedIn recommended)
- Test with Facebook Sharing Debugger

---

## 🎨 Component 2: Hero Section

### Purpose

The hero section is the first thing visitors see. It should:
- Grab attention immediately
- Communicate the value proposition
- Guide visitors to take action

### HTML Structure (With Hero Image)

```html
<section class="dmat-hero">
  <!-- Hero image -->
  <img src="{{hero_image_url}}"
       alt="{{headline}}"
       class="dmat-hero-image">

  <!-- Hero content overlay -->
  <div class="dmat-hero-content">
    <!-- Main headline (H1) -->
    <h1 class="dmat-headline">{{headline}}</h1>

    <!-- Supporting subheading (H2) -->
    <h2 class="dmat-subheading">{{subheading}}</h2>
  </div>
</section>
```

### HTML Structure (Without Hero Image)

```html
<section class="dmat-header">
  <!-- Main headline (H1) -->
  <h1 class="dmat-headline">{{headline}}</h1>

  <!-- Supporting subheading (H2) -->
  <h2 class="dmat-subheading">{{subheading}}</h2>
</section>
```

### Data Mapping for Hero Section

| DMAT Field | HTML Element | Required | Fallback |
|------------|--------------|----------|----------|
| `hero_image_url` | `<img>` | No | Omit image, use header layout |
| `headline` | `<h1>` | Yes | Use `title` if missing |
| `subheading` | `<h2>` | No | Omit if missing |

### Hero Section Logic

```javascript
function generateHeroSection(landingPage) {
  const hasHeroImage = landingPage.hero_image_url && landingPage.hero_image_url.trim() !== '';

  if (hasHeroImage) {
    return `
      <section class="dmat-hero">
        <img src="${escapeHtml(landingPage.hero_image_url)}"
             alt="${escapeHtml(landingPage.headline || landingPage.title)}"
             class="dmat-hero-image">
        <div class="dmat-hero-content">
          <h1 class="dmat-headline">${escapeHtml(landingPage.headline || landingPage.title)}</h1>
          ${landingPage.subheading ? `<h2 class="dmat-subheading">${escapeHtml(landingPage.subheading)}</h2>` : ''}
        </div>
      </section>
    `;
  } else {
    return `
      <section class="dmat-header">
        <h1 class="dmat-headline">${escapeHtml(landingPage.headline || landingPage.title)}</h1>
        ${landingPage.subheading ? `<h2 class="dmat-subheading">${escapeHtml(landingPage.subheading)}</h2>` : ''}
      </section>
    `;
  }
}
```

### Complete Example

**Input:**
```javascript
{
  headline: "Download Your Free Digital Marketing Guide",
  subheading: "Learn the latest strategies that drive results in 2025",
  hero_image_url: "https://example.com/images/hero.jpg"
}
```

**Output:**
```html
<section class="dmat-hero">
  <img src="https://example.com/images/hero.jpg"
       alt="Download Your Free Digital Marketing Guide"
       class="dmat-hero-image">
  <div class="dmat-hero-content">
    <h1 class="dmat-headline">Download Your Free Digital Marketing Guide</h1>
    <h2 class="dmat-subheading">Learn the latest strategies that drive results in 2025</h2>
  </div>
</section>
```

---

## 📝 Component 3: Body Section

### Purpose

The body section provides detailed information about the offer, builds trust, and convinces visitors to submit the form.

### HTML Structure

```html
<section class="dmat-body">
  <div class="dmat-body-text">
    <!-- Formatted paragraphs from body_text -->
    {{body_text_html}}
  </div>
</section>
```

### Data Mapping for Body Section

| DMAT Field | HTML Element | Required | Fallback |
|------------|--------------|----------|----------|
| `body_text` | Multiple `<p>` tags | No | Omit section if missing |

### Body Text Formatting

**Input Format:** Plain text with line breaks
```
Our comprehensive 50-page guide covers SEO, social media, content marketing, and more.

Download now and transform your marketing strategy!
```

**Output Format:** HTML paragraphs
```html
<p>Our comprehensive 50-page guide covers SEO, social media, content marketing, and more.</p>
<p>Download now and transform your marketing strategy!</p>
```

### Formatting Logic

```javascript
function formatBodyText(bodyText) {
  if (!bodyText || bodyText.trim() === '') {
    return ''; // No body section
  }

  // Split by double line breaks (paragraph separators)
  const paragraphs = bodyText
    .split('\n\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  // Convert each paragraph to HTML
  const html = paragraphs
    .map(p => `<p>${escapeHtml(p)}</p>`)
    .join('\n');

  return html;
}
```

### Advanced Formatting (Future Enhancement)

**Phase 1:** Simple paragraph conversion (above)

**Phase 2+:** Support markdown-like formatting
- `**bold**` → `<strong>bold</strong>`
- `*italic*` → `<em>italic</em>`
- `- bullet` → `<ul><li>bullet</li></ul>`
- `1. numbered` → `<ol><li>numbered</li></ol>`

### Complete Example

**Input:**
```javascript
{
  body_text: "Our comprehensive 50-page guide covers SEO, social media, content marketing, email marketing, and paid advertising.\n\nYou'll learn:\n- How to rank #1 on Google\n- Social media strategies that work\n- Content that converts\n\nDownload now and transform your marketing strategy with proven tactics used by top companies."
}
```

**Output (Phase 1):**
```html
<section class="dmat-body">
  <div class="dmat-body-text">
    <p>Our comprehensive 50-page guide covers SEO, social media, content marketing, email marketing, and paid advertising.</p>
    <p>You'll learn:
- How to rank #1 on Google
- Social media strategies that work
- Content that converts</p>
    <p>Download now and transform your marketing strategy with proven tactics used by top companies.</p>
  </div>
</section>
```

---

## 📋 Component 4: Form Section

### Purpose

The form captures lead information and submits it to DMAT's lead capture endpoint.

### HTML Structure

```html
<section class="dmat-form">
  <form id="dmat-lead-form-{{id}}"
        class="dmat-lead-form"
        data-landing-page-id="{{id}}"
        data-api-endpoint="{{DMAT_API_BASE_URL}}/api/public/leads">

    <!-- Hidden fields (security & tracking) -->
    <input type="hidden" name="landing_page_id" value="{{id}}">
    <input type="hidden" name="form_load_time" id="form-load-time">
    <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">

    <!-- Dynamic form fields (from form_fields config) -->
    {{#each form_fields.fields}}
    <div class="dmat-form-group">
      <label for="dmat-field-{{../id}}-{{name}}" class="dmat-form-label">
        {{label}}
        {{#if required}}<span class="required">*</span>{{/if}}
      </label>

      <!-- Input field (varies by type) -->
      {{> fieldInput}}
    </div>
    {{/each}}

    <!-- Submit button -->
    <button type="submit" class="dmat-cta-button">
      {{cta_text}}
    </button>

    <!-- Form message container -->
    <div id="form-message" class="dmat-form-message"></div>
  </form>
</section>
```

### Hidden Fields Explanation

**landing_page_id:**
- **Purpose:** Identifies which landing page this submission is from
- **Required:** Yes (always)
- **Value:** Landing page database ID

**form_load_time:**
- **Purpose:** Bot detection (time-based check)
- **Set by:** JavaScript on page load (`Date.now()`)
- **Usage:** Reject submissions < 2 seconds after page load

**website (Honeypot):**
- **Purpose:** Bot detection (hidden field)
- **Style:** `display:none` (hidden from humans)
- **Usage:** Reject submissions if this field has any value

### Dynamic Form Fields

Form fields are generated from the `form_fields` JSON configuration.

**Input (form_fields JSON):**
```json
{
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
    },
    {
      "name": "message",
      "label": "Message",
      "type": "textarea",
      "required": false,
      "placeholder": "Tell us about your needs..."
    }
  ]
}
```

**Output (HTML):**
```html
<!-- Text field -->
<div class="dmat-form-group">
  <label for="dmat-field-5-name" class="dmat-form-label">
    Full Name
    <span class="required">*</span>
  </label>
  <input
    type="text"
    id="dmat-field-5-name"
    name="name"
    class="dmat-form-field dmat-input"
    placeholder="Enter your name"
    required
  />
</div>

<!-- Email field -->
<div class="dmat-form-group">
  <label for="dmat-field-5-email" class="dmat-form-label">
    Work Email
    <span class="required">*</span>
  </label>
  <input
    type="email"
    id="dmat-field-5-email"
    name="email"
    class="dmat-form-field dmat-input"
    placeholder="your@company.com"
    required
  />
</div>

<!-- Text field (optional) -->
<div class="dmat-form-group">
  <label for="dmat-field-5-company" class="dmat-form-label">
    Company Name
  </label>
  <input
    type="text"
    id="dmat-field-5-company"
    name="company"
    class="dmat-form-field dmat-input"
    placeholder="Your company"
  />
</div>

<!-- Textarea field -->
<div class="dmat-form-group">
  <label for="dmat-field-5-message" class="dmat-form-label">
    Message
  </label>
  <textarea
    id="dmat-field-5-message"
    name="message"
    class="dmat-form-field dmat-textarea"
    placeholder="Tell us about your needs..."
    rows="5"
  ></textarea>
</div>
```

### Form Field Generation Logic

```javascript
function generateFormField(field, landingPageId) {
  const fieldId = `dmat-field-${landingPageId}-${field.name}`;
  const requiredAttr = field.required ? 'required' : '';
  const requiredLabel = field.required ? '<span class="required">*</span>' : '';

  // Generate input HTML based on field type
  let inputHtml;

  switch (field.type) {
    case 'textarea':
      inputHtml = `
        <textarea
          id="${fieldId}"
          name="${escapeHtml(field.name)}"
          class="dmat-form-field dmat-textarea"
          placeholder="${escapeHtml(field.placeholder || '')}"
          rows="${field.rows || 5}"
          ${requiredAttr}
        ></textarea>
      `;
      break;

    case 'select':
      const options = field.options || [];
      const optionsHtml = options.map(opt =>
        `<option value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</option>`
      ).join('');

      inputHtml = `
        <select
          id="${fieldId}"
          name="${escapeHtml(field.name)}"
          class="dmat-form-field dmat-select"
          ${requiredAttr}
        >
          <option value="">Select...</option>
          ${optionsHtml}
        </select>
      `;
      break;

    case 'checkbox':
      inputHtml = `
        <label class="dmat-checkbox-label">
          <input
            type="checkbox"
            id="${fieldId}"
            name="${escapeHtml(field.name)}"
            class="dmat-form-field dmat-checkbox"
            value="true"
            ${requiredAttr}
          />
          ${escapeHtml(field.label)}
          ${requiredLabel}
        </label>
      `;
      // Return early (checkbox label format is different)
      return `<div class="dmat-form-group">${inputHtml}</div>`;

    default: // text, email, tel, url, number, date, etc.
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

  // Standard field with label above input
  return `
    <div class="dmat-form-group">
      <label for="${fieldId}" class="dmat-form-label">
        ${escapeHtml(field.label)}
        ${requiredLabel}
      </label>
      ${inputHtml}
    </div>
  `;
}
```

### Supported Field Types

| Type | HTML Element | Use Case |
|------|--------------|----------|
| `text` | `<input type="text">` | Name, company, job title |
| `email` | `<input type="email">` | Email address (required) |
| `tel` | `<input type="tel">` | Phone number |
| `url` | `<input type="url">` | Website URL |
| `number` | `<input type="number">` | Numeric values |
| `date` | `<input type="date">` | Date selection |
| `textarea` | `<textarea>` | Long text (message, comments) |
| `select` | `<select>` | Dropdown (country, industry) |
| `checkbox` | `<input type="checkbox">` | Consent, agreements |

### Submit Button

```html
<button type="submit" class="dmat-cta-button">
  {{cta_text}}
</button>
```

**Data Mapping:**
| DMAT Field | HTML Element | Default |
|------------|--------------|---------|
| `cta_text` | Button text | "Submit" |

**Examples:**
- "Get Your Free Guide"
- "Download Now"
- "Request Demo"
- "Sign Up Free"

### Form Action URL

**Critical:** Form does NOT use HTML `action` attribute. Form submission is handled by JavaScript.

**Why:**
- Better user experience (no page reload)
- Capture technical metadata (referrer, landing URL)
- Show inline success/error messages
- Redirect to thank you page (optional)

**API Endpoint (Set in JavaScript):**
```
{DMAT_API_BASE_URL}/api/public/leads
```

**Example:**
```
https://dmat-api.example.com/api/public/leads
```

---

## 🎬 Component 5: JavaScript

### Form Initialization

```html
<script>
  // Set form load time (bot detection)
  document.getElementById('form-load-time').value = Date.now();

  // Initialize form handler
  DmatLeadForm.init({
    formId: 'dmat-lead-form-{{id}}',
    apiEndpoint: '{{DMAT_API_BASE_URL}}/api/public/leads',
    landingPageId: {{id}}
  });
</script>
```

### Form Submission Handler (External JS)

**File:** `/assets/js/lead-form.js`

```javascript
const DmatLeadForm = {
  init: function(config) {
    const form = document.getElementById(config.formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get submit button
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Disable button and show loading state
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
        // Submit to DMAT API
        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          // Success
          this.showMessage('success', result.message);
          form.reset();

          // Redirect if URL provided
          if (result.redirect_url) {
            setTimeout(() => {
              window.location.href = result.redirect_url;
            }, 1500);
          }
        } else {
          // Error
          this.showMessage('error', result.error.message);

          // Re-enable submit button
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }

      } catch (error) {
        console.error('Form submission error:', error);
        this.showMessage('error', 'Network error. Please try again.');

        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  },

  showMessage: function(type, message) {
    const messageEl = document.getElementById('form-message');
    messageEl.className = `dmat-form-message ${type}`;
    messageEl.textContent = message;
    messageEl.style.display = 'block';
  }
};
```

### Technical Metadata Capture

**Automatically captured by JavaScript:**
- `referrer_url` - Where visitor came from (`document.referrer`)
- `landing_url` - Current page URL with UTM parameters (`window.location.href`)
- `user_agent` - Browser and device info (`navigator.userAgent`)

**Example values:**
```javascript
{
  referrer_url: "https://google.com/search?q=digital+marketing+guide",
  landing_url: "https://dmat-app.example.com/pages/free-marketing-guide-2025.html?utm_source=google&utm_medium=cpc&utm_campaign=q4-2025",
  user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
}
```

---

## 🎨 Component 6: CSS Styling

### Embedded vs External CSS

**Phase 1 Recommendation:** External CSS file

**File:** `/assets/css/landing-page.css`

**Reference:**
```html
<link rel="stylesheet" href="/assets/css/landing-page.css">
```

### Key CSS Classes

**Container:**
- `.dmat-landing-page` - Main wrapper

**Hero Section:**
- `.dmat-hero` - Hero section with image
- `.dmat-hero-image` - Hero background/banner image
- `.dmat-hero-content` - Overlay content
- `.dmat-header` - Header section without image
- `.dmat-headline` - Main H1 headline
- `.dmat-subheading` - Supporting H2 subheading

**Body Section:**
- `.dmat-body` - Body section wrapper
- `.dmat-body-text` - Body content container
- `.dmat-body-text p` - Paragraphs

**Form Section:**
- `.dmat-form` - Form section wrapper
- `.dmat-lead-form` - Form element
- `.dmat-form-group` - Field group (label + input)
- `.dmat-form-label` - Field label
- `.dmat-form-field` - All input fields
- `.dmat-input` - Text/email inputs
- `.dmat-textarea` - Textarea fields
- `.dmat-select` - Select dropdowns
- `.dmat-checkbox` - Checkbox inputs
- `.dmat-cta-button` - Submit button
- `.dmat-form-message` - Success/error message
- `.required` - Required field indicator (asterisk)

### Minimal CSS Example

```css
/* Container */
.dmat-landing-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Hero Section */
.dmat-hero {
  position: relative;
  margin-bottom: 40px;
}

.dmat-hero-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.dmat-headline {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.dmat-subheading {
  font-size: 1.5rem;
  font-weight: normal;
  color: #666;
  margin-bottom: 32px;
}

/* Body Section */
.dmat-body {
  margin-bottom: 40px;
}

.dmat-body-text p {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 16px;
}

/* Form Section */
.dmat-form {
  background: #f5f5f5;
  padding: 32px;
  border-radius: 8px;
}

.dmat-form-group {
  margin-bottom: 20px;
}

.dmat-form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.required {
  color: #e53e3e;
}

.dmat-form-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.dmat-form-field:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.dmat-textarea {
  resize: vertical;
  min-height: 120px;
}

.dmat-cta-button {
  width: 100%;
  padding: 16px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.dmat-cta-button:hover {
  background: #3182ce;
}

.dmat-cta-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.dmat-form-message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 4px;
  display: none;
}

.dmat-form-message.success {
  background: #c6f6d5;
  color: #22543d;
  border: 1px solid #9ae6b4;
}

.dmat-form-message.error {
  background: #fed7d7;
  color: #742a2a;
  border: 1px solid #fc8181;
}
```

---

## 📦 Complete HTML Example

### Input (DMAT Landing Page)

```javascript
{
  id: 5,
  title: "Free Marketing Guide 2025",
  slug: "free-marketing-guide-2025",
  headline: "Download Your Free Digital Marketing Guide",
  subheading: "Learn the latest strategies that drive results in 2025",
  body_text: "Our comprehensive 50-page guide covers SEO, social media, content marketing, and more.\n\nDownload now and transform your marketing strategy!",
  cta_text: "Get Your Free Guide",
  hero_image_url: "https://example.com/images/hero.jpg",
  form_fields: {
    fields: [
      { name: "name", label: "Full Name", type: "text", required: true, placeholder: "Enter your name" },
      { name: "email", label: "Work Email", type: "email", required: true, placeholder: "your@company.com" },
      { name: "company", label: "Company Name", type: "text", required: false, placeholder: "Your company" }
    ]
  },
  published_url: "https://dmat-app.example.com/pages/free-marketing-guide-2025.html",
  published_at: "2025-12-03T12:00:00Z"
}
```

### Output (Complete HTML Document)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Free Marketing Guide 2025 | InnovateElectronics</title>
  <meta name="description" content="Learn the latest strategies that drive results in 2025">

  <!-- Open Graph -->
  <meta property="og:title" content="Free Marketing Guide 2025">
  <meta property="og:description" content="Learn the latest strategies that drive results in 2025">
  <meta property="og:image" content="https://example.com/images/hero.jpg">
  <meta property="og:url" content="https://dmat-app.example.com/pages/free-marketing-guide-2025.html">
  <meta property="og:type" content="website">

  <!-- DMAT Metadata -->
  <meta name="dmat-landing-page-id" content="5">
  <meta name="dmat-slug" content="free-marketing-guide-2025">
  <meta name="dmat-published-at" content="2025-12-03T12:00:00Z">

  <!-- Styles -->
  <link rel="stylesheet" href="/assets/css/landing-page.css">
</head>
<body>
  <div class="dmat-landing-page" data-dmat-id="5">

    <!-- Hero Section -->
    <section class="dmat-hero">
      <img src="https://example.com/images/hero.jpg"
           alt="Download Your Free Digital Marketing Guide"
           class="dmat-hero-image">
      <div class="dmat-hero-content">
        <h1 class="dmat-headline">Download Your Free Digital Marketing Guide</h1>
        <h2 class="dmat-subheading">Learn the latest strategies that drive results in 2025</h2>
      </div>
    </section>

    <!-- Body Section -->
    <section class="dmat-body">
      <div class="dmat-body-text">
        <p>Our comprehensive 50-page guide covers SEO, social media, content marketing, and more.</p>
        <p>Download now and transform your marketing strategy!</p>
      </div>
    </section>

    <!-- Form Section -->
    <section class="dmat-form">
      <form id="dmat-lead-form-5"
            class="dmat-lead-form"
            data-landing-page-id="5"
            data-api-endpoint="https://dmat-api.example.com/api/public/leads">

        <!-- Hidden fields -->
        <input type="hidden" name="landing_page_id" value="5">
        <input type="hidden" name="form_load_time" id="form-load-time">
        <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">

        <!-- Name field -->
        <div class="dmat-form-group">
          <label for="dmat-field-5-name" class="dmat-form-label">
            Full Name
            <span class="required">*</span>
          </label>
          <input
            type="text"
            id="dmat-field-5-name"
            name="name"
            class="dmat-form-field dmat-input"
            placeholder="Enter your name"
            required
          />
        </div>

        <!-- Email field -->
        <div class="dmat-form-group">
          <label for="dmat-field-5-email" class="dmat-form-label">
            Work Email
            <span class="required">*</span>
          </label>
          <input
            type="email"
            id="dmat-field-5-email"
            name="email"
            class="dmat-form-field dmat-input"
            placeholder="your@company.com"
            required
          />
        </div>

        <!-- Company field -->
        <div class="dmat-form-group">
          <label for="dmat-field-5-company" class="dmat-form-label">
            Company Name
          </label>
          <input
            type="text"
            id="dmat-field-5-company"
            name="company"
            class="dmat-form-field dmat-input"
            placeholder="Your company"
          />
        </div>

        <!-- Submit button -->
        <button type="submit" class="dmat-cta-button">
          Get Your Free Guide
        </button>

        <!-- Form message -->
        <div id="form-message" class="dmat-form-message"></div>
      </form>
    </section>

  </div>

  <!-- Scripts -->
  <script src="/assets/js/lead-form.js"></script>
  <script>
    // Initialize form
    document.getElementById('form-load-time').value = Date.now();

    DmatLeadForm.init({
      formId: 'dmat-lead-form-5',
      apiEndpoint: 'https://dmat-api.example.com/api/public/leads',
      landingPageId: 5
    });
  </script>
</body>
</html>
```

---

## 🔄 Content Generation Workflow

### Step-by-Step Process

**1. Fetch Landing Page Data**
```javascript
const landingPage = await db.query(
  'SELECT * FROM landing_pages WHERE id = $1',
  [landingPageId]
);
```

**2. Generate Each Section**
```javascript
const metadata = generateMetadata(landingPage);
const heroSection = generateHeroSection(landingPage);
const bodySection = generateBodySection(landingPage);
const formSection = generateFormSection(landingPage);
const scripts = generateScripts(landingPage);
```

**3. Combine into Complete HTML**
```javascript
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  ${metadata}
</head>
<body>
  <div class="dmat-landing-page" data-dmat-id="${landingPage.id}">
    ${heroSection}
    ${bodySection}
    ${formSection}
  </div>
  ${scripts}
</body>
</html>
`;
```

**4. Write to File (Mock) or Send to WordPress**
```javascript
// Mock implementation
await fs.writeFile(`public/pages/${landingPage.slug}.html`, html);

// OR WordPress implementation
await wordpressApi.createPage({
  title: landingPage.title,
  slug: landingPage.slug,
  content: html,
  status: 'publish'
});
```

---

## 📚 Related Documentation

- [Phase1-Publish-Workflow.md](./Phase1-Publish-Workflow.md) - Complete publish workflow
- [Phase1-WordPress-Integration-Strategy.md](./Phase1-WordPress-Integration-Strategy.md) - Mock vs WordPress
- [Phase1-Lead-Capture-API.md](./Phase1-Lead-Capture-API.md) - Form submission handling
- [Phase1-LandingPage-Schema.md](./Phase1-LandingPage-Schema.md) - Database field definitions

---

## 🔮 Future Enhancements (Phase 2+)

### Advanced Content Features

1. **Rich Text Editor** - WYSIWYG editor for body content
2. **Multiple Sections** - Add/remove/reorder sections
3. **Image Gallery** - Multiple images, not just hero
4. **Video Embedding** - YouTube, Vimeo videos
5. **Testimonials** - Dedicated testimonial section
6. **Social Proof** - Customer logos, trust badges

### Advanced Form Features

1. **Conditional Logic** - Show/hide fields based on answers
2. **Multi-Step Forms** - Break long forms into steps
3. **File Uploads** - Resume, documents
4. **Calendar Picker** - Date/time selection
5. **Address Autocomplete** - Google Places API

### Personalization

1. **Dynamic Content** - Show different content based on URL parameters
2. **A/B Testing** - Multiple versions of same page
3. **Geolocation** - Customize content by location
4. **Return Visitor** - Different message for returning visitors

---

**Document Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-03
**Maintained by:** DMAT Content & Frontend Team
