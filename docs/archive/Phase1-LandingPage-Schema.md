# Phase 1 Landing Page Schema Extension

**Version:** 1.0
**Date:** 2025-12-03
**Migration:** 002_extend_landing_pages.sql
**Purpose:** Extend landing_pages table with Phase 1 required fields

---

## 📋 Overview

This document defines the additional fields needed for the `landing_pages` table to support Phase 1 functionality. These fields enable marketers to create simple, form-based landing pages without requiring a complex drag-and-drop builder.

---

## 🎯 Design Principles

1. **Explicit over Generic** - Use specific columns instead of only relying on JSONB for Phase 1 core fields
2. **Simple First** - Start with flat fields; add complexity later if needed
3. **Query-Friendly** - Make common queries easy (e.g., find all published pages)
4. **Form-Focused** - Prioritize lead capture functionality

---

## 📊 Extended Schema

### Current Fields (From Migration 001)
- `id` - Primary key
- `title` - Page title
- `slug` - URL-friendly identifier
- `content_json` - JSONB for flexible content storage
- `status` - Publication status (draft/published/archived)
- `created_by` - User who created the page
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### New Fields (Migration 002)

#### 1. Basic Content Fields

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `headline` | VARCHAR(500) | YES | NULL | Main headline/H1 text displayed at top of page |
| `subheading` | VARCHAR(1000) | YES | NULL | Supporting subheading/H2 text below headline |
| `body_text` | TEXT | YES | NULL | Main body content (can be plain text or simple HTML) |
| `cta_text` | VARCHAR(100) | YES | 'Submit' | Call-to-action button text |
| `hero_image_url` | VARCHAR(2048) | YES | NULL | URL to hero/banner image |

**Rationale:**
- These are the most common elements of any landing page
- Having explicit fields makes templates simple to build
- NULL-able to allow progressive form filling
- varchar limits prevent abuse while allowing reasonable content

#### 2. Form Configuration

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `form_fields` | JSONB | NO | See below | Configuration of form fields to display |

**Default Value:**
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
      "label": "Email Address",
      "type": "email",
      "required": true,
      "placeholder": "your@email.com"
    },
    {
      "name": "phone",
      "label": "Phone Number",
      "type": "tel",
      "required": false,
      "placeholder": "+1 (555) 000-0000"
    }
  ]
}
```

**Form Field Schema:**
```typescript
{
  fields: Array<{
    name: string;          // Field identifier (name, email, phone, company, etc.)
    label: string;         // Display label shown to user
    type: string;          // HTML input type (text, email, tel, etc.)
    required: boolean;     // Whether field is required
    placeholder: string;   // Placeholder text
    options?: string[];    // For select/radio types (Phase 2+)
  }>
}
```

**Rationale:**
- JSONB allows flexible form configuration without schema changes
- Default provides name/email/phone (Phase 1 requirement)
- Extensible for Phase 2+ (custom fields, dropdowns, etc.)
- Frontend can dynamically render forms from this config

#### 3. Publishing Metadata

| Field | Type | Nullable | Default | Description |
|-------|------|----------|---------|-------------|
| `publish_status` | VARCHAR(50) | NO | 'draft' | Current publishing status |
| `published_url` | VARCHAR(2048) | YES | NULL | Full URL where page is publicly accessible |
| `published_at` | TIMESTAMP | YES | NULL | When page was first published (NULL if never published) |

**Valid `publish_status` Values:**
- `draft` - Page is being edited, not public
- `published` - Page is live and publicly accessible
- `unpublished` - Page was published but taken down (Phase 2+)
- `scheduled` - Page scheduled for future publish (Phase 2+)

**Rationale:**
- `publish_status` is more explicit than generic `status` field
- `published_url` stores where visitors can access the page (WordPress URL or DMAT URL)
- `published_at` tracks first publish time (immutable once set)
- Status workflow: draft → published (simple for Phase 1)

---

## 🗄 Complete Phase 1 Schema

After Migration 002, the `landing_pages` table will have:

```sql
landing_pages (
  -- Core identity
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,

  -- Content fields (Phase 1)
  headline VARCHAR(500),
  subheading VARCHAR(1000),
  body_text TEXT,
  cta_text VARCHAR(100) DEFAULT 'Submit',
  hero_image_url VARCHAR(2048),

  -- Form configuration
  form_fields JSONB NOT NULL DEFAULT (see above),

  -- Publishing metadata
  publish_status VARCHAR(50) NOT NULL DEFAULT 'draft',
  published_url VARCHAR(2048),
  published_at TIMESTAMP,

  -- Legacy/flexible storage
  content_json JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(50) NOT NULL DEFAULT 'draft',

  -- Audit fields
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

---

## 🔍 Field Usage Examples

### Example 1: Simple Landing Page

```sql
INSERT INTO landing_pages (
  title,
  slug,
  headline,
  subheading,
  body_text,
  cta_text,
  hero_image_url,
  form_fields,
  publish_status,
  created_by
) VALUES (
  'Free Marketing Guide 2025',
  'free-marketing-guide-2025',
  'Download Your Free Marketing Guide',
  'Learn the latest digital marketing strategies for 2025',
  'Our comprehensive 50-page guide covers SEO, social media, content marketing, and more. Join 10,000+ marketers who have already downloaded it!',
  'Get Free Guide',
  'https://example.com/images/marketing-guide-hero.jpg',
  '{
    "fields": [
      {"name": "name", "label": "Full Name", "type": "text", "required": true, "placeholder": "John Doe"},
      {"name": "email", "label": "Work Email", "type": "email", "required": true, "placeholder": "john@company.com"},
      {"name": "company", "label": "Company Name", "type": "text", "required": false, "placeholder": "Acme Inc"}
    ]
  }'::jsonb,
  'draft',
  1
);
```

### Example 2: Webinar Registration Page

```sql
INSERT INTO landing_pages (
  title,
  slug,
  headline,
  subheading,
  body_text,
  cta_text,
  form_fields,
  publish_status,
  created_by
) VALUES (
  'Webinar: AI in Marketing',
  'webinar-ai-marketing-jan-2025',
  'Join Our Free Webinar: AI in Marketing',
  'January 15, 2025 at 2:00 PM EST',
  'Discover how AI is transforming digital marketing. Our expert panel will share real-world case studies and actionable insights you can implement immediately.',
  'Reserve My Spot',
  '{
    "fields": [
      {"name": "name", "label": "Your Name", "type": "text", "required": true, "placeholder": "Enter your name"},
      {"name": "email", "label": "Email", "type": "email", "required": true, "placeholder": "your@email.com"},
      {"name": "phone", "label": "Phone", "type": "tel", "required": true, "placeholder": "+1 (555) 000-0000"}
    ]
  }'::jsonb,
  'draft',
  1
);
```

---

## 📈 Common Queries

### Get All Published Pages
```sql
SELECT id, title, slug, published_url, published_at
FROM landing_pages
WHERE publish_status = 'published'
ORDER BY published_at DESC;
```

### Get Page for Public Display
```sql
SELECT
  headline,
  subheading,
  body_text,
  cta_text,
  hero_image_url,
  form_fields
FROM landing_pages
WHERE slug = 'free-marketing-guide-2025'
  AND publish_status = 'published';
```

### Get Pages by Creator
```sql
SELECT
  lp.id,
  lp.title,
  lp.publish_status,
  lp.created_at,
  u.name AS created_by_name
FROM landing_pages lp
JOIN users u ON lp.created_by = u.id
WHERE lp.created_by = 3
ORDER BY lp.created_at DESC;
```

### Count Leads per Landing Page
```sql
SELECT
  lp.id,
  lp.title,
  lp.publish_status,
  COUNT(l.id) AS lead_count
FROM landing_pages lp
LEFT JOIN leads l ON lp.id = l.landing_page_id
GROUP BY lp.id, lp.title, lp.publish_status
ORDER BY lead_count DESC;
```

---

## 🔄 Migration Strategy

### Forward Migration (002_extend_landing_pages.sql)
1. Add new columns with NULL defaults
2. Add constraints and checks
3. Create indexes for query performance
4. Update existing rows with default values (if any)
5. Add column comments

### Rollback Migration (002_rollback_extend_landing_pages.sql)
1. Drop new indexes
2. Drop new columns
3. Verify table returns to Migration 001 state

---

## ⚡ Performance Considerations

### Indexes to Add
- `idx_landing_pages_publish_status` - Fast filtering by publish status
- `idx_landing_pages_published_at` - Sort published pages chronologically
- `idx_landing_pages_form_fields` - GIN index for JSONB queries (if needed)

### Query Optimization
- Use `publish_status = 'published'` for public queries (indexed)
- Avoid SELECT * - only fetch needed fields
- Use JOINs sparingly in public endpoints

---

## 🚫 What's NOT in Phase 1

### Deferred to Later Phases
- ❌ SEO metadata fields (meta_description, meta_keywords)
- ❌ Template selection (template_id FK)
- ❌ A/B testing variants (variant_of FK)
- ❌ Scheduling (scheduled_publish_at)
- ❌ Analytics tracking (view_count, conversion_count)
- ❌ Custom CSS/styling fields
- ❌ Multi-language support (locale fields)
- ❌ Version history

---

## ✅ Validation Rules

### Field Constraints
- `headline` - Max 500 chars (fits most use cases)
- `subheading` - Max 1000 chars
- `body_text` - TEXT (unlimited, but recommend < 5000 chars for UX)
- `cta_text` - Max 100 chars (typical button text)
- `hero_image_url` - Max 2048 chars (standard URL length)
- `published_url` - Max 2048 chars
- `publish_status` - CHECK constraint (draft, published, unpublished, scheduled)

### Application-Level Validation
- Validate URLs are well-formed HTTP/HTTPS
- Sanitize HTML in body_text (prevent XSS)
- Validate form_fields JSON structure matches schema
- Ensure at least one field in form_fields array
- Require email field in form_fields for lead capture

---

## 📝 Notes for Developers

1. **Backward Compatibility**: The existing `content_json` field remains for future flexibility. Phase 1 uses explicit fields, but Phase 2+ could migrate to JSONB-heavy model if needed.

2. **status vs publish_status**: We keep both for now:
   - `status` - Legacy field from Migration 001 (can deprecate later)
   - `publish_status` - Phase 1 explicit publishing workflow

3. **Form Fields Default**: Every new landing page gets name/email/phone form by default. Marketers can customize via UI in Phase 2+.

4. **NULL Handling**: Content fields are nullable to allow saving drafts progressively. Validation happens at publish time.

5. **Image Storage**: Phase 1 uses URLs (external hosting). Phase 2+ can add file upload to S3/MinIO.

---

## 🧪 Test Data

See migration file for sample inserts demonstrating:
- Minimal landing page (only required fields)
- Full landing page (all fields populated)
- Custom form configuration
- Published vs draft states

---

## 📚 References

- [Phase 1 Success Criteria](./Phase1-Success-Criteria.md)
- [Database Schema Documentation](./Database-Schema.md)
- [DMAT Project Specification](./DMAT.md)

---

**Version History:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-03 | Initial schema definition for Phase 1 | DMAT Team |

---

**Next Steps:**
1. Review and approve this schema
2. Create Migration 002
3. Test migration on dev database
4. Update API models to match new schema
5. Update frontend forms to use new fields
