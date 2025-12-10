# Phase 1 Validation & Sanitization Rules

**Version:** 1.0
**Date:** 2025-12-03
**Purpose:** Security-focused validation and sanitization specification for lead capture

---

## 📋 Overview

This document defines the minimal validation and sanitization rules for the lead capture endpoint (`POST /api/public/leads`). These rules are critical for:

1. **Data integrity** - Ensure data is valid and usable
2. **Security** - Prevent injection attacks (XSS, SQL injection, etc.)
3. **System stability** - Prevent resource exhaustion
4. **User experience** - Provide clear feedback on invalid input

**Validation Philosophy (Phase 1):**
- **Be lenient on input** - Accept reasonable variations in format
- **Be strict on storage** - Clean and normalize before saving
- **Fail gracefully** - Provide helpful error messages
- **Security first** - Block malicious input aggressively

---

## 📊 Field Classification

### System Fields (Always Required)

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| landing_page_id | integer | ✅ Always | Identify which landing page captured this lead |

### Contact Fields (Conditionally Required)

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| email | string | ✅ Always | Primary contact method and identifier |
| name | string | ⚠️ If marked in form config | Person's name |
| phone | string | ⚠️ If marked in form config | Phone contact |
| company | string | ⚠️ If marked in form config | Company affiliation |
| job_title | string | ⚠️ If marked in form config | Professional role |
| message | text | ⚠️ If marked in form config | Free-form message |

### Technical Metadata (Always Optional)

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| referrer_url | string | ❌ Optional | Traffic source analysis |
| landing_url | string | ❌ Optional | UTM parameter tracking |
| user_agent | string | ❌ Optional | Device/browser analytics |
| ip_address | string | ❌ Optional | Fraud detection, geolocation |

### Special Fields (Validation Only)

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| website | string | ❌ Never stored | Honeypot for bot detection |
| form_load_time | integer | ❌ Never stored | Time-based bot detection |

---

## ✅ Field-by-Field Validation Rules

### 1. landing_page_id

**Data Type:** Integer (32-bit signed)

**Required:** ✅ Always

**Validation Rules:**
```javascript
// 1. Must be present
if (!landing_page_id) {
  return error('landing_page_id is required');
}

// 2. Must be a valid integer
const id = parseInt(landing_page_id, 10);
if (isNaN(id)) {
  return error('landing_page_id must be a valid integer');
}

// 3. Must be positive
if (id <= 0) {
  return error('landing_page_id must be positive');
}

// 4. Must exist in database
const landingPage = await db.query(
  'SELECT id, publish_status FROM landing_pages WHERE id = $1',
  [id]
);
if (!landingPage) {
  return error('Landing page not found', 404);
}

// 5. Must be published
if (landingPage.publish_status !== 'published') {
  return error('Landing page is not accepting submissions', 400);
}
```

**Allowed Range:** 1 to 2,147,483,647

**Sanitization:** None needed (integer type)

**Security Notes:**
- SQL injection not possible (parameterized queries)
- No user-provided value (comes from hidden form field)

---

### 2. email

**Data Type:** String (VARCHAR 255)

**Required:** ✅ Always

**Format:** Valid email address per RFC 5322 (simplified)

**Validation Rules:**
```javascript
// 1. Must be present
if (!email || email.trim() === '') {
  return error('Email is required');
}

// 2. Sanitize (trim whitespace)
const sanitized = email.trim();

// 3. Length check (after trimming)
if (sanitized.length > 255) {
  return error('Email must be 255 characters or less');
}

// 4. Format validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(sanitized)) {
  return error('Please provide a valid email address');
}

// 5. Additional format checks (optional but recommended)
// - No spaces
if (/\s/.test(sanitized)) {
  return error('Email cannot contain spaces');
}

// - No multiple @ symbols
if ((sanitized.match(/@/g) || []).length > 1) {
  return error('Email cannot contain multiple @ symbols');
}

// - Reasonable length for local and domain parts
const [local, domain] = sanitized.split('@');
if (local.length > 64) {
  return error('Email local part too long (max 64 characters before @)');
}
if (domain.length > 255) {
  return error('Email domain part too long (max 255 characters after @)');
}
```

**Length Limit:** 255 characters (after trimming)

**Sanitization Rules:**
```javascript
function sanitizeEmail(email) {
  if (!email) return null;

  // 1. Trim whitespace
  let clean = email.trim();

  // 2. Convert to lowercase (standard practice)
  clean = clean.toLowerCase();

  // 3. Remove any surrounding quotes (some forms add them)
  clean = clean.replace(/^["']|["']$/g, '');

  return clean;
}
```

**Allowed Characters:** Letters, numbers, and these symbols: `@ . - _ + `

**Examples:**

✅ **Valid:**
- `john@company.com`
- `john.smith@company.com`
- `john+tag@company.co.uk`
- `john_smith@company-name.com`
- `123@456.com`

❌ **Invalid:**
- `john` (no @ symbol)
- `john@` (no domain)
- `@company.com` (no local part)
- `john @company.com` (space in email)
- `john@@company.com` (multiple @)
- `<script>@company.com` (HTML tags)

**Security Notes:**
- Always parameterize in SQL queries (prevent SQL injection)
- Convert to lowercase for consistency
- No need for HTML escaping (stored as plain text)

---

### 3. name

**Data Type:** String (VARCHAR 255)

**Required:** ⚠️ Conditionally (based on landing page form config)

**Validation Rules:**
```javascript
// 1. Check if required (from landing page config)
const nameField = landingPage.form_fields.fields.find(f => f.name === 'name');
const isRequired = nameField && nameField.required;

if (isRequired && (!name || name.trim() === '')) {
  return error('Name is required');
}

// 2. If provided, validate length
if (name) {
  const sanitized = sanitizeName(name);

  if (sanitized.length > 255) {
    // Truncate instead of erroring (graceful)
    sanitized = sanitized.substring(0, 255);
  }
}
```

**Length Limit:** 255 characters (truncated if longer)

**Sanitization Rules:**
```javascript
function sanitizeName(name) {
  if (!name) return null;

  // 1. Trim whitespace from ends
  let clean = name.trim();

  // 2. Remove control characters (null bytes, etc.)
  clean = clean.replace(/[\x00-\x1F\x7F]/g, '');

  // 3. Collapse multiple spaces to single space
  clean = clean.replace(/\s+/g, ' ');

  // 4. Remove HTML tags (aggressive)
  clean = clean.replace(/<[^>]*>/g, '');

  // 5. Decode HTML entities (if any remain)
  clean = decodeHTMLEntities(clean);

  // 6. Remove script keywords (paranoid check)
  if (/script|javascript|onerror|onclick/i.test(clean)) {
    // Strip those keywords
    clean = clean.replace(/script|javascript|onerror|onclick/gi, '');
  }

  // 7. Truncate to max length
  if (clean.length > 255) {
    clean = clean.substring(0, 255);
  }

  return clean || null;
}
```

**Allowed Characters:**
- Letters (all Unicode)
- Numbers
- Spaces
- Common punctuation: `. , ' - `
- International characters: `é ñ ü etc.`

**Examples:**

✅ **Valid:**
- `John Smith`
- `María García`
- `O'Brien`
- `Jean-Claude Van Damme`
- `李明` (Chinese characters)
- `Björk Guðmundsdóttir`

⚠️ **Sanitized:**
- Input: `<script>alert('xss')</script>John` → Output: `John`
- Input: `John   Smith` (multiple spaces) → Output: `John Smith`
- Input: `John\x00Smith` (null byte) → Output: `JohnSmith`
- Input: `   John Smith   ` (extra spaces) → Output: `John Smith`

❌ **Blocked:**
- Input: `<img src=x onerror=alert('xss')>` → Output: Empty (all removed)

**Security Notes:**
- HTML tags completely removed (prevent XSS)
- Script keywords stripped
- Control characters removed (prevent terminal injection)
- Safe to display in HTML (after additional output escaping)

---

### 4. phone

**Data Type:** String (VARCHAR 50)

**Required:** ⚠️ Conditionally (based on landing page form config)

**Format:** Flexible (accept various formats)

**Validation Rules:**
```javascript
// 1. Check if required
const phoneField = landingPage.form_fields.fields.find(f => f.name === 'phone');
const isRequired = phoneField && phoneField.required;

if (isRequired && (!phone || phone.trim() === '')) {
  return error('Phone is required');
}

// 2. If provided, validate length
if (phone) {
  const sanitized = sanitizePhone(phone);

  if (sanitized.length > 50) {
    sanitized = sanitized.substring(0, 50);
  }

  // 3. Basic format check (optional - very lenient)
  // Must contain at least some digits
  if (!/\d/.test(sanitized)) {
    return error('Phone number must contain at least one digit');
  }
}
```

**Length Limit:** 50 characters

**Sanitization Rules:**
```javascript
function sanitizePhone(phone) {
  if (!phone) return null;

  // 1. Trim whitespace
  let clean = phone.trim();

  // 2. Remove control characters
  clean = clean.replace(/[\x00-\x1F\x7F]/g, '');

  // 3. Remove HTML tags
  clean = clean.replace(/<[^>]*>/g, '');

  // 4. Keep only: digits, spaces, hyphens, parentheses, plus, dots
  // (Accept various international formats)
  clean = clean.replace(/[^\d\s\-\(\)\+\.x]/gi, '');

  // 5. Truncate to max length
  if (clean.length > 50) {
    clean = clean.substring(0, 50);
  }

  return clean || null;
}
```

**Allowed Formats:**
- `555-123-4567` (US standard)
- `(555) 123-4567` (US with parens)
- `+1-555-123-4567` (international)
- `+44 20 7123 4567` (UK)
- `555.123.4567` (dots)
- `5551234567` (no separators)
- `555-123-4567 x123` (with extension)

**Examples:**

✅ **Valid:**
- `555-123-4567`
- `+1 (555) 123-4567`
- `+44 20 7123 4567`
- `5551234567`

⚠️ **Sanitized:**
- Input: `555-123-ABCD` → Output: `555-123-`
- Input: `<script>555-123-4567</script>` → Output: `555-123-4567`

**Security Notes:**
- Very lenient validation (accept international formats)
- HTML tags removed
- No strict format enforcement (Phase 1 simplification)

---

### 5. company

**Data Type:** String (VARCHAR 255)

**Required:** ⚠️ Conditionally (based on landing page form config)

**Validation Rules:**
```javascript
// 1. Check if required
const companyField = landingPage.form_fields.fields.find(f => f.name === 'company');
const isRequired = companyField && companyField.required;

if (isRequired && (!company || company.trim() === '')) {
  return error('Company is required');
}

// 2. If provided, sanitize and truncate
if (company) {
  const sanitized = sanitizeText(company, 255);
  // Use same sanitization as name field
}
```

**Length Limit:** 255 characters

**Sanitization Rules:** Same as `name` field

**Examples:**

✅ **Valid:**
- `Acme Corporation`
- `XYZ Inc.`
- `ABC Company, LLC`
- `Société Générale`

⚠️ **Sanitized:**
- Input: `<b>Acme Corp</b>` → Output: `Acme Corp`

---

### 6. job_title

**Data Type:** String (VARCHAR 255)

**Required:** ⚠️ Conditionally (based on landing page form config)

**Validation Rules:** Same as `company` field

**Length Limit:** 255 characters

**Sanitization Rules:** Same as `name` field

**Examples:**

✅ **Valid:**
- `Marketing Director`
- `Senior Software Engineer`
- `VP of Sales & Marketing`
- `CEO`

---

### 7. message

**Data Type:** Text (TEXT type, unlimited)

**Required:** ⚠️ Conditionally (based on landing page form config)

**Validation Rules:**
```javascript
// 1. Check if required
const messageField = landingPage.form_fields.fields.find(f => f.name === 'message');
const isRequired = messageField && messageField.required;

if (isRequired && (!message || message.trim() === '')) {
  return error('Message is required');
}

// 2. If provided, sanitize and enforce practical limit
if (message) {
  const sanitized = sanitizeMessage(message);

  // Enforce practical limit (prevent abuse)
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000);
  }
}
```

**Length Limit:** 10,000 characters (practical limit for Phase 1)

**Sanitization Rules:**
```javascript
function sanitizeMessage(message) {
  if (!message) return null;

  // 1. Trim whitespace from ends
  let clean = message.trim();

  // 2. Remove control characters EXCEPT newlines and tabs
  clean = clean.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  // 3. Remove HTML tags (aggressive)
  clean = clean.replace(/<[^>]*>/g, '');

  // 4. Decode HTML entities
  clean = decodeHTMLEntities(clean);

  // 5. Remove script keywords
  clean = clean.replace(/script|javascript|onerror|onclick/gi, '');

  // 6. Normalize line breaks (convert all to \n)
  clean = clean.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 7. Limit consecutive newlines (max 2)
  clean = clean.replace(/\n{3,}/g, '\n\n');

  // 8. Truncate to max length
  if (clean.length > 10000) {
    clean = clean.substring(0, 10000);
  }

  return clean || null;
}
```

**Allowed Content:**
- Letters, numbers, punctuation
- Line breaks (preserved)
- International characters
- Reasonable amounts of whitespace

**Not Allowed:**
- HTML tags
- Script tags
- JavaScript code
- Control characters (except newline/tab)

**Examples:**

✅ **Valid:**
```
I'm interested in learning more about your enterprise plan.

We have a team of 50 people and are looking for a solution that can scale.

Please contact me at your earliest convenience.
```

⚠️ **Sanitized:**
```
Input:
<script>alert('xss')</script>
I'm interested in your product.

Output:
I'm interested in your product.
```

**Security Notes:**
- Most dangerous field (free-form text)
- Aggressive HTML removal
- Multiple XSS prevention layers
- Line breaks preserved for readability
- Safe to display after additional output escaping

---

### 8. referrer_url

**Data Type:** String (VARCHAR 2048)

**Required:** ❌ Optional (automatically captured)

**Validation Rules:**
```javascript
// 1. Optional - skip validation if not provided
if (!referrer_url) {
  return null; // Store as NULL
}

// 2. Basic URL format check
try {
  const url = new URL(referrer_url);
  // Valid URL
} catch (err) {
  // Invalid URL - store anyway (don't block submission)
  // Just truncate if needed
}

// 3. Length check
if (referrer_url.length > 2048) {
  referrer_url = referrer_url.substring(0, 2048);
}
```

**Length Limit:** 2,048 characters

**Sanitization Rules:**
```javascript
function sanitizeUrl(url) {
  if (!url) return null;

  // 1. Trim whitespace
  let clean = url.trim();

  // 2. Remove control characters
  clean = clean.replace(/[\x00-\x1F\x7F]/g, '');

  // 3. Truncate to max length
  if (clean.length > 2048) {
    clean = clean.substring(0, 2048);
  }

  return clean || null;
}
```

**Security Notes:**
- Stored as plain text (never rendered as clickable link in Phase 1)
- If displayed in UI, must be HTML-escaped
- SQL injection prevented by parameterized queries

---

### 9. landing_url

**Data Type:** String (VARCHAR 2048)

**Required:** ❌ Optional (automatically captured)

**Validation Rules:** Same as `referrer_url`

**Length Limit:** 2,048 characters

**Sanitization Rules:** Same as `referrer_url`

**Security Notes:** Same as `referrer_url`

---

### 10. user_agent

**Data Type:** String (VARCHAR 1000)

**Required:** ❌ Optional (automatically captured)

**Validation Rules:**
```javascript
// 1. Optional - accept anything or nothing
if (!user_agent) {
  return null;
}

// 2. Truncate if too long
if (user_agent.length > 1000) {
  user_agent = user_agent.substring(0, 1000);
}
```

**Length Limit:** 1,000 characters

**Sanitization Rules:**
```javascript
function sanitizeUserAgent(userAgent) {
  if (!userAgent) return null;

  // 1. Trim whitespace
  let clean = userAgent.trim();

  // 2. Remove control characters
  clean = clean.replace(/[\x00-\x1F\x7F]/g, '');

  // 3. Truncate to max length
  if (clean.length > 1000) {
    clean = clean.substring(0, 1000);
  }

  return clean || null;
}
```

**Security Notes:**
- User agents can be spoofed (don't trust for security)
- Store as-is (useful for analytics)
- Never render without HTML escaping

---

### 11. ip_address

**Data Type:** String (VARCHAR 45) - supports IPv6

**Required:** ❌ Optional (automatically captured by backend)

**Validation Rules:**
```javascript
// 1. Extract from request headers
const ip = extractIpAddress(req);

// 2. Validate format (IPv4 or IPv6)
if (ip && !isValidIpAddress(ip)) {
  // Invalid format - store null
  return null;
}

function isValidIpAddress(ip) {
  // IPv4 pattern
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;

  // IPv6 pattern (simplified)
  const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/;

  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
}
```

**Length Limit:** 45 characters (max IPv6 length)

**Sanitization Rules:**
```javascript
function sanitizeIpAddress(ip) {
  if (!ip) return null;

  // 1. Trim whitespace
  let clean = ip.trim();

  // 2. Validate format
  if (!isValidIpAddress(clean)) {
    return null; // Invalid IP - store null
  }

  // 3. Optional: Anonymize for privacy (future enhancement)
  // IPv4: Mask last octet (e.g., 192.168.1.100 → 192.168.1.0)
  // IPv6: Mask last 80 bits

  return clean;
}
```

**Security Notes:**
- Can be spoofed via X-Forwarded-For header
- Useful for fraud detection and geolocation
- Consider GDPR/privacy regulations (anonymization option)
- Never display to end users

---

### 12. website (Honeypot)

**Data Type:** String (not stored)

**Required:** ❌ Must be empty (bot detection)

**Validation Rules:**
```javascript
// If honeypot field has any value, reject as spam
if (website && website.trim() !== '') {
  return error('Invalid submission', 400);
}
```

**Security Notes:**
- Hidden from humans via CSS (display:none)
- Visible to bots that ignore CSS
- If filled, indicates bot submission
- Generic error message (don't reveal detection mechanism)

---

### 13. form_load_time (Bot Detection)

**Data Type:** Integer (timestamp, not stored)

**Required:** ❌ Optional

**Validation Rules:**
```javascript
// If provided, check submission wasn't too fast
if (form_load_time) {
  const loadTime = parseInt(form_load_time, 10);
  const submitTime = Date.now();
  const elapsed = submitTime - loadTime;

  // Reject if submitted in less than 2 seconds
  if (elapsed < 2000) {
    return error('Invalid submission', 400);
  }
}
```

**Security Notes:**
- Can be bypassed by sophisticated bots
- Catches simple automated submissions
- 2 seconds is minimal (adjust if needed)

---

## 🛡️ Sanitization Functions

### Core Sanitization Function

```javascript
function sanitizeText(text, maxLength) {
  if (!text) return null;

  // 1. Convert to string (defensive)
  text = String(text);

  // 2. Trim whitespace from ends
  text = text.trim();

  // 3. Remove control characters (except newlines for message field)
  text = text.replace(/[\x00-\x1F\x7F]/g, '');

  // 4. Remove HTML tags
  text = stripHtmlTags(text);

  // 5. Decode HTML entities (in case any remain)
  text = decodeHTMLEntities(text);

  // 6. Remove script-related keywords (paranoid check)
  text = removeScriptKeywords(text);

  // 7. Collapse multiple spaces (optional, for name/company)
  text = text.replace(/\s+/g, ' ');

  // 8. Truncate to max length
  if (maxLength && text.length > maxLength) {
    text = text.substring(0, maxLength);
  }

  return text || null;
}
```

### HTML Tag Removal

```javascript
function stripHtmlTags(text) {
  // Remove all HTML tags: <tag>, </tag>, <tag attr="value">
  return text.replace(/<[^>]*>/g, '');
}
```

### HTML Entity Decoding

```javascript
function decodeHTMLEntities(text) {
  const entities = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/'
  };

  return text.replace(/&[^;]+;/g, entity => entities[entity] || entity);
}
```

### Script Keyword Removal

```javascript
function removeScriptKeywords(text) {
  const dangerousKeywords = [
    'script',
    'javascript',
    'onerror',
    'onclick',
    'onload',
    'onmouseover',
    'onfocus',
    'onblur'
  ];

  dangerousKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    text = text.replace(regex, '');
  });

  return text;
}
```

---

## 🔒 SQL Injection Prevention

### Use Parameterized Queries (ALWAYS)

**❌ NEVER do this (vulnerable to SQL injection):**
```javascript
// DANGEROUS - DO NOT USE
const query = `INSERT INTO leads (email, name) VALUES ('${email}', '${name}')`;
db.query(query);
```

**✅ ALWAYS do this (safe from SQL injection):**
```javascript
// SAFE - parameterized query
const query = `INSERT INTO leads (email, name) VALUES ($1, $2)`;
db.query(query, [email, name]);
```

### Why Parameterized Queries Work

**Malicious Input:**
```javascript
const email = "test@test.com'; DROP TABLE leads; --";
const name = "Robert'; DROP TABLE students;--"; // "Little Bobby Tables"
```

**With Parameterized Query (Safe):**
```sql
-- The malicious SQL is treated as literal string data, not SQL code
INSERT INTO leads (email, name)
VALUES ('test@test.com''; DROP TABLE leads; --', 'Robert''; DROP TABLE students;--');
-- Result: Email and name stored as-is, no SQL injection
```

**Without Parameterized Query (Vulnerable):**
```sql
-- The malicious SQL is executed
INSERT INTO leads (email, name)
VALUES ('test@test.com'; DROP TABLE leads; --', 'Robert');
-- Result: leads table is DELETED
```

### Database Layer Protection

**PostgreSQL Configuration:**
- Use least-privilege database user
- Read/write access ONLY to necessary tables
- No DROP, CREATE, or ALTER permissions
- No access to system tables

---

## 🛡️ XSS Prevention

### Input Sanitization (First Layer)

Remove HTML and script tags during input processing (as documented above).

### Output Encoding (Second Layer)

**When displaying lead data in HTML, ALWAYS escape:**

```javascript
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  return String(text).replace(/[&<>"'/]/g, char => map[char]);
}
```

**Example Usage:**
```javascript
// In React
<div>{escapeHtml(lead.name)}</div>

// In HTML template
<div>{{escapeHtml(lead.name)}}</div>
```

### Content Security Policy (CSP)

**HTTP Header (recommended):**
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
```

This prevents inline JavaScript from executing even if it somehow gets stored.

---

## 📋 Validation Summary Table

| Field | Required | Max Length | Format | Sanitization |
|-------|----------|------------|--------|--------------|
| landing_page_id | ✅ Always | N/A (integer) | Integer > 0 | None (typed) |
| email | ✅ Always | 255 | Valid email | Trim, lowercase |
| name | ⚠️ Dynamic | 255 | Free text | Strip HTML, remove scripts |
| phone | ⚠️ Dynamic | 50 | Flexible | Keep digits & separators only |
| company | ⚠️ Dynamic | 255 | Free text | Strip HTML, remove scripts |
| job_title | ⚠️ Dynamic | 255 | Free text | Strip HTML, remove scripts |
| message | ⚠️ Dynamic | 10,000 | Free text | Strip HTML, remove scripts, preserve newlines |
| referrer_url | ❌ Optional | 2,048 | URL | Trim, remove control chars |
| landing_url | ❌ Optional | 2,048 | URL | Trim, remove control chars |
| user_agent | ❌ Optional | 1,000 | Free text | Trim, remove control chars |
| ip_address | ❌ Optional | 45 | IPv4/IPv6 | Validate format |
| website | ❌ Must be empty | N/A | N/A | Not stored (honeypot) |
| form_load_time | ❌ Optional | N/A (integer) | Unix timestamp | Not stored (bot detection) |

---

## 🧪 Test Cases for Validation

### Email Validation Tests

```javascript
// Valid emails
expect(validateEmail('test@test.com')).toBe(true);
expect(validateEmail('test.name@test.com')).toBe(true);
expect(validateEmail('test+tag@test.com')).toBe(true);
expect(validateEmail('TEST@TEST.COM')).toBe(true); // case insensitive

// Invalid emails
expect(validateEmail('test')).toBe(false); // no @
expect(validateEmail('test@')).toBe(false); // no domain
expect(validateEmail('@test.com')).toBe(false); // no local
expect(validateEmail('test @test.com')).toBe(false); // space
expect(validateEmail('test@@test.com')).toBe(false); // double @
```

### HTML Sanitization Tests

```javascript
// Script tag removal
expect(sanitizeName('<script>alert("xss")</script>John'))
  .toBe('John');

// HTML tag removal
expect(sanitizeName('<b>John</b> <i>Smith</i>'))
  .toBe('John Smith');

// Script keyword removal
expect(sanitizeName('John onclick=alert("xss") Smith'))
  .toBe('John  Smith');

// Control character removal
expect(sanitizeName('John\x00Smith'))
  .toBe('JohnSmith');

// Multiple space collapse
expect(sanitizeName('John   Smith'))
  .toBe('John Smith');
```

### SQL Injection Tests

```javascript
// Classic SQL injection attempts (should be stored as literal text)
const maliciousInputs = [
  "'; DROP TABLE leads; --",
  "1' OR '1'='1",
  "admin'--",
  "' UNION SELECT * FROM users--"
];

maliciousInputs.forEach(input => {
  // With parameterized queries, this is stored safely as text
  const lead = await createLead({ email: input + '@test.com', name: 'Test' });
  expect(lead.email).toBe(sanitizeEmail(input + '@test.com'));
});

// Verify tables still exist
const result = await db.query('SELECT COUNT(*) FROM leads');
expect(result.rows[0].count).toBeGreaterThan(0);
```

### XSS Prevention Tests

```javascript
// XSS attempts (should be stripped)
const xssInputs = [
  '<script>alert("xss")</script>',
  '<img src=x onerror=alert("xss")>',
  '<iframe src="javascript:alert(\'xss\')">',
  'javascript:alert("xss")',
  '<svg onload=alert("xss")>'
];

xssInputs.forEach(input => {
  const sanitized = sanitizeName(input);
  expect(sanitized).not.toMatch(/<script|<img|<iframe|<svg/i);
  expect(sanitized).not.toMatch(/javascript:|onerror|onload/i);
});
```

### Length Limit Tests

```javascript
// Truncation tests
const longName = 'A'.repeat(300);
expect(sanitizeName(longName).length).toBe(255);

const longEmail = 'a'.repeat(250) + '@test.com';
expect(sanitizeEmail(longEmail).length).toBeLessThanOrEqual(255);

const longMessage = 'A'.repeat(15000);
expect(sanitizeMessage(longMessage).length).toBe(10000);
```

---

## 📊 Security Checklist

### Input Validation
- [ ] All required fields validated
- [ ] Email format validated
- [ ] Length limits enforced
- [ ] Data types validated

### Sanitization
- [ ] HTML tags removed from all text fields
- [ ] Script keywords removed
- [ ] Control characters removed
- [ ] Whitespace normalized

### SQL Injection Prevention
- [ ] All queries use parameterized statements
- [ ] No string concatenation in SQL
- [ ] Database user has minimal permissions
- [ ] Input validation as defense-in-depth

### XSS Prevention
- [ ] HTML stripped on input
- [ ] Output encoding on display
- [ ] CSP headers configured
- [ ] No innerHTML usage with user data

### Bot Protection
- [ ] Honeypot field implemented
- [ ] Time-based check implemented
- [ ] Rate limiting active
- [ ] Generic error messages (don't reveal detection)

### Privacy & Compliance
- [ ] IP address handling compliant with GDPR
- [ ] Data retention policy defined
- [ ] User can request data deletion
- [ ] Privacy policy linked on forms

---

## 🔮 Future Enhancements (Phase 2+)

### Advanced Validation
- Email verification (send confirmation link)
- Phone number format validation (per country)
- Real-time validation API endpoint
- Custom regex validation per field

### Enhanced Security
- Google reCAPTCHA v3 integration
- More sophisticated bot detection (behavioral analysis)
- IP reputation checking (blocklists)
- Duplicate submission detection (same email/IP)

### Data Quality
- Email deliverability checking (MX record validation)
- Disposable email detection (reject temporary emails)
- Profanity filter for message field
- Language detection

### Privacy Features
- IP address anonymization (automatic masking)
- GDPR consent tracking
- Right to be forgotten (automated deletion)
- Data export API

---

**Document Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-03
**Security Review:** Required before production deployment
**Maintained by:** DMAT Security & Backend Team
