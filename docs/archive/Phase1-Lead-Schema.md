# Phase 1 Lead Schema Refinement

**Version:** 1.0
**Date:** 2025-12-03
**Migration:** 003_refine_leads.sql
**Purpose:** Refine leads table with additional Phase 1 tracking fields

---

## 📋 Overview

This document defines the additional fields needed for the `leads` table to support comprehensive lead tracking in Phase 1. These fields enable better lead attribution, capture form messages, and track lead sources more accurately.

---

## 🎯 Design Principles

1. **Capture Context** - Store enough information to understand where and how the lead was captured
2. **Privacy-Conscious** - Collect only necessary tracking data
3. **Attribution-Friendly** - Enable accurate source attribution for marketing ROI
4. **Form-Flexible** - Support custom form fields including messages/notes
5. **Analytics-Ready** - Structure data for future reporting and analysis

---

## 📊 Current vs. Extended Schema

### Existing Fields (From Migration 001)
- `id` - Primary key
- `landing_page_id` - Foreign key to landing_pages (nullable)
- `name` - Lead's full name
- `email` - Lead's email address
- `phone` - Lead's phone number (optional)
- `source` - Lead source category (landing_page, webinar, social_media, etc.)
- `status` - Lead status (new, contacted, qualified, etc.)
- `created_at` - When lead was captured
- `updated_at` - Last update timestamp

### New Fields (Migration 003)

#### 1. Additional Contact & Form Data

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `company` | VARCHAR(255) | YES | NULL | Lead's company name (if provided) |
| `job_title` | VARCHAR(255) | YES | NULL | Lead's job title/role (if provided) |
| `message` | TEXT | YES | NULL | Custom message/notes from form submission |

**Rationale:**
- `company` and `job_title` are common B2B form fields
- `message` captures free-text input from contact/inquiry forms
- All nullable to support minimal forms (name + email only)

#### 2. Source Attribution Fields

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `source_details` | VARCHAR(500) | YES | NULL | Specific source identifier (e.g., "LP: /free-guide-2025") |
| `referrer_url` | VARCHAR(2048) | YES | NULL | HTTP Referrer - where visitor came from before landing page |
| `landing_url` | VARCHAR(2048) | YES | NULL | Full URL where form was submitted |

**Rationale:**
- `source` field provides category (landing_page, webinar, etc.)
- `source_details` provides specific identifier within that category
- `referrer_url` shows traffic source (Google, social media link, direct, etc.)
- `landing_url` stores exact page URL with query parameters for campaign tracking

**Example Values:**
```
source: "landing_page"
source_details: "LP: free-marketing-guide-2025"
referrer_url: "https://google.com/search?q=marketing+guide"
landing_url: "https://innovateelectronics.com/lp/free-marketing-guide-2025?utm_source=google&utm_medium=cpc"
```

#### 3. Technical Metadata (Optional but Useful)

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `user_agent` | VARCHAR(500) | YES | NULL | Browser/device user agent string |
| `ip_address` | VARCHAR(45) | YES | NULL | IPv4 or IPv6 address (for basic tracking) |

**Rationale:**
- `user_agent` helps identify device type (mobile vs. desktop) for future analytics
- `ip_address` useful for duplicate detection and basic geo-targeting
- Both optional and nullable (privacy considerations)
- VARCHAR(45) supports both IPv4 (15 chars) and IPv6 (45 chars)

**Privacy Note:**
- IP addresses should be handled according to privacy laws (GDPR, CCPA)
- Consider hashing or truncating IPs if storing long-term
- User agent is less sensitive but still considered personal data

---

## 🗄 Complete Phase 1 Leads Schema

After Migration 003, the `leads` table will have:

```sql
leads (
  -- Core identity
  id SERIAL PRIMARY KEY,
  landing_page_id INTEGER REFERENCES landing_pages(id),

  -- Basic contact information
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),

  -- Additional contact details (Phase 1)
  company VARCHAR(255),
  job_title VARCHAR(255),
  message TEXT,

  -- Source attribution
  source VARCHAR(100) NOT NULL DEFAULT 'landing_page',
  source_details VARCHAR(500),
  referrer_url VARCHAR(2048),
  landing_url VARCHAR(2048),

  -- Technical metadata
  user_agent VARCHAR(500),
  ip_address VARCHAR(45),

  -- Lead management
  status VARCHAR(50) NOT NULL DEFAULT 'new',

  -- Audit fields
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

---

## 📋 Field Usage Examples

### Example 1: Simple Landing Page Form

```sql
INSERT INTO leads (
  landing_page_id,
  name,
  email,
  phone,
  source,
  source_details,
  referrer_url,
  landing_url
) VALUES (
  1,
  'John Doe',
  'john.doe@example.com',
  '+1-555-0123',
  'landing_page',
  'LP: free-marketing-guide-2025',
  'https://google.com/search?q=marketing+automation',
  'https://innovateelectronics.com/lp/free-marketing-guide-2025?utm_source=google&utm_medium=organic'
);
```

### Example 2: Contact Form with Message

```sql
INSERT INTO leads (
  landing_page_id,
  name,
  email,
  company,
  job_title,
  message,
  source,
  source_details,
  landing_url
) VALUES (
  2,
  'Jane Smith',
  'jane.smith@acmecorp.com',
  'Acme Corporation',
  'Marketing Director',
  'Interested in learning more about your enterprise pricing and implementation timeline.',
  'landing_page',
  'LP: contact-us',
  'https://innovateelectronics.com/contact'
);
```

### Example 3: Webinar Registration

```sql
INSERT INTO leads (
  landing_page_id,
  name,
  email,
  phone,
  company,
  job_title,
  source,
  source_details,
  referrer_url,
  landing_url,
  user_agent,
  ip_address
) VALUES (
  3,
  'Bob Johnson',
  'bob@techstartup.io',
  '+1-555-9999',
  'Tech Startup Inc',
  'CEO',
  'webinar',
  'Webinar: AI Marketing Jan 2025',
  'https://linkedin.com/post/12345',
  'https://innovateelectronics.com/webinar-ai-marketing?utm_source=linkedin&utm_medium=social',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  '192.168.1.100'
);
```

### Example 4: Social Media Campaign Lead

```sql
INSERT INTO leads (
  landing_page_id,
  name,
  email,
  source,
  source_details,
  referrer_url,
  landing_url
) VALUES (
  1,
  'Alice Williams',
  'alice@example.com',
  'social_media',
  'LinkedIn Campaign: Q1-2025-Product-Launch',
  'https://linkedin.com/feed/',
  'https://innovateelectronics.com/lp/dmat-pro-launch?utm_source=linkedin&utm_campaign=q1-launch'
);
```

---

## 📈 Common Queries

### Get Leads with Full Source Attribution

```sql
SELECT
  l.id,
  l.name,
  l.email,
  l.company,
  l.source,
  l.source_details,
  l.referrer_url,
  lp.title AS landing_page_title,
  l.created_at
FROM leads l
LEFT JOIN landing_pages lp ON l.landing_page_id = lp.id
ORDER BY l.created_at DESC
LIMIT 50;
```

### Count Leads by Traffic Source (Referrer Analysis)

```sql
SELECT
  CASE
    WHEN referrer_url ILIKE '%google%' THEN 'Google'
    WHEN referrer_url ILIKE '%facebook%' THEN 'Facebook'
    WHEN referrer_url ILIKE '%linkedin%' THEN 'LinkedIn'
    WHEN referrer_url ILIKE '%twitter%' OR referrer_url ILIKE '%x.com%' THEN 'Twitter/X'
    WHEN referrer_url IS NULL THEN 'Direct'
    ELSE 'Other'
  END AS traffic_source,
  COUNT(*) AS lead_count,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) AS conversions
FROM leads
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY traffic_source
ORDER BY lead_count DESC;
```

### Find Leads from Specific Landing Page

```sql
SELECT
  l.name,
  l.email,
  l.phone,
  l.company,
  l.message,
  l.created_at
FROM leads l
JOIN landing_pages lp ON l.landing_page_id = lp.id
WHERE lp.slug = 'free-marketing-guide-2025'
  AND l.created_at >= NOW() - INTERVAL '7 days'
ORDER BY l.created_at DESC;
```

### Identify Duplicate Leads (by Email)

```sql
SELECT
  email,
  COUNT(*) AS submission_count,
  MIN(created_at) AS first_submission,
  MAX(created_at) AS last_submission,
  array_agg(DISTINCT source ORDER BY source) AS sources
FROM leads
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY submission_count DESC, last_submission DESC;
```

### Campaign Performance by UTM Parameters

```sql
SELECT
  SUBSTRING(landing_url FROM 'utm_source=([^&]+)') AS utm_source,
  SUBSTRING(landing_url FROM 'utm_medium=([^&]+)') AS utm_medium,
  SUBSTRING(landing_url FROM 'utm_campaign=([^&]+)') AS utm_campaign,
  COUNT(*) AS leads,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) AS conversions,
  ROUND(
    COUNT(CASE WHEN status = 'converted' THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC * 100,
    2
  ) AS conversion_rate
FROM leads
WHERE landing_url ~ 'utm_'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY utm_source, utm_medium, utm_campaign
ORDER BY leads DESC;
```

---

## 🔄 Migration Strategy

### Forward Migration (003_refine_leads.sql)
1. Add new columns with NULL defaults (all nullable)
2. Create indexes for performance
3. Add column comments
4. Optionally backfill source_details from landing_page_id (for existing records)

### Rollback Migration (003_rollback_refine_leads.sql)
1. Drop new indexes
2. Drop new columns
3. Verify table returns to Migration 001 state

---

## ⚡ Performance Considerations

### Indexes to Add
- `idx_leads_source_details` - Filter by specific source
- `idx_leads_referrer_url` - Analyze traffic sources (partial index or GIN for pattern matching)
- `idx_leads_company` - B2B lead filtering
- `idx_leads_ip_address` - Duplicate detection (optional)

### Query Optimization
- Use partial indexes for non-null fields if most leads don't have those fields
- Consider GIN index on landing_url for UTM parameter queries
- Use `text_pattern_ops` for ILIKE queries on referrer_url

**Example Partial Index:**
```sql
CREATE INDEX idx_leads_company_not_null
ON leads(company)
WHERE company IS NOT NULL;
```

---

## 🔒 Privacy & Security Considerations

### Data Retention
- Consider time-based data retention policy for IP addresses
- Hash or truncate IP addresses after 90 days (compliance)
- Store user_agent only if needed for analytics

### GDPR/CCPA Compliance
- `ip_address` and `user_agent` are considered personal data
- Include in data export/deletion workflows
- Document data retention policy
- Consider consent tracking (future enhancement)

### PII Fields
- `name`, `email`, `phone`, `message`, `company`, `job_title` are PII
- Encrypt sensitive fields if required by compliance
- Implement secure deletion (not just soft delete)

---

## ✅ Validation Rules

### Field Constraints
- `company` - Max 255 chars
- `job_title` - Max 255 chars
- `message` - TEXT (unlimited, but recommend < 5000 chars for UX)
- `source_details` - Max 500 chars
- `referrer_url` - Max 2048 chars (standard URL length)
- `landing_url` - Max 2048 chars
- `user_agent` - Max 500 chars (typical user agent length)
- `ip_address` - Max 45 chars (supports IPv6)

### Application-Level Validation
- Validate URLs are well-formed HTTP/HTTPS
- Sanitize message field (prevent XSS)
- Validate email format (already has DB constraint)
- Validate IP address format (IPv4 or IPv6)
- Truncate user_agent if > 500 chars

---

## 🚫 What's NOT in Phase 1

### Deferred to Later Phases
- ❌ Lead scoring fields (score, grade)
- ❌ Lead assignment (assigned_to user_id)
- ❌ Lead tags/categories (separate tags table)
- ❌ Lead activity timeline (separate activities table)
- ❌ Custom fields (JSONB for dynamic fields)
- ❌ Consent tracking (gdpr_consent, marketing_consent)
- ❌ Lead enrichment data (from external APIs)
- ❌ Geographic data (city, state, country from IP)
- ❌ Device type parsing (from user_agent)

---

## 📝 Notes for Developers

1. **Backward Compatibility**: All new fields are nullable, so existing code continues to work without changes.

2. **Source vs. Source Details**:
   - `source` = category (landing_page, webinar, social_media)
   - `source_details` = specific identifier within that category

3. **URL Storage**: Store full URLs including query parameters to preserve UTM tracking data.

4. **IP Privacy**: Consider hashing IP addresses or storing only first 3 octets for IPv4 (e.g., "192.168.1.0") for privacy.

5. **Message Field**: Can store any text from form submission - inquiries, questions, special requests, etc.

6. **Null Handling**: All new fields are nullable. Validation happens at application level, not database level.

---

## 🧪 Test Data

See migration file for sample inserts demonstrating:
- Minimal lead (name + email only)
- Full lead (all fields populated)
- Lead with message/inquiry
- Lead with UTM tracking
- Lead from social media
- Duplicate lead detection

---

## 📚 References

- [Phase 1 Success Criteria](./Phase1-Success-Criteria.md)
- [Database Schema Documentation](./Database-Schema.md)
- [Phase 1 Landing Page Schema](./Phase1-LandingPage-Schema.md)

---

**Version History:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-03 | Initial lead schema refinement for Phase 1 | DMAT Team |

---

**Next Steps:**
1. Review and approve this schema
2. Create Migration 003
3. Test migration on dev database
4. Update API models to match new schema
5. Update frontend forms to capture new fields
6. Implement privacy controls for IP/user_agent data
