# DMAT Database Schema

**Version:** 1.1
**Date:** 2025-12-03
**Database:** PostgreSQL 14+
**Last Updated:** Migration 002 - Phase 1 Landing Pages Extension

---

## 📊 Entity Relationship Diagram (ERD)

```
┌─────────────────────────┐
│        USERS            │
├─────────────────────────┤
│ PK  id (SERIAL)         │
│     name                │
│ UQ  email               │
│     password_hash       │
│     role                │
│     created_at          │
│     updated_at          │
└─────────────────────────┘
           │
           │ 1
           │
           │ created_by (FK)
           │
           │ *
┌─────────────────────────┐
│    LANDING_PAGES        │
├─────────────────────────┤
│ PK  id (SERIAL)         │
│     title               │
│ UQ  slug                │
│     headline *          │
│     subheading *        │
│     body_text *         │
│     cta_text *          │
│     hero_image_url *    │
│     form_fields *       │
│     publish_status *    │
│     published_url *     │
│     published_at *      │
│     content_json        │
│     status              │
│ FK  created_by          │───────┐
│     created_at          │       │
│     updated_at          │       │
└─────────────────────────┘       │
          * = Phase 1 fields      │
           │                      │
           │ 1                    │
           │                      │
           │ landing_page_id (FK) │
           │                      │
           │ 0..*                 │
┌─────────────────────────┐       │
│        LEADS            │       │
├─────────────────────────┤       │
│ PK  id (SERIAL)         │       │
│ FK  landing_page_id     │───────┘
│     name                │
│     email               │
│     phone               │
│     source              │
│     status              │
│     created_at          │
│     updated_at          │
└─────────────────────────┘

Legend:
PK = Primary Key
FK = Foreign Key
UQ = Unique Constraint
*  = Many (in relationships) OR Phase 1 fields (in table columns)
1  = One
```

---

## 📋 Table Specifications

### 1. USERS

**Purpose:** Store system users with authentication credentials

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | User ID |
| name | VARCHAR(255) | NOT NULL | - | Full name |
| email | VARCHAR(255) | NOT NULL, UNIQUE, CHECK (email format) | - | Login email |
| password_hash | VARCHAR(255) | NOT NULL | - | Bcrypt hashed password |
| role | VARCHAR(50) | NOT NULL, CHECK (admin/editor/viewer) | 'viewer' | User role |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_users_email` on `email`
- `idx_users_role` on `role`
- `idx_users_created_at` on `created_at DESC`

**Triggers:**
- `trigger_users_updated_at` - Auto-updates `updated_at` on row update

**Valid Roles:**
- `admin` - Full system access
- `editor` - Can create/edit content
- `viewer` - Read-only access

---

### 2. LANDING_PAGES

**Purpose:** Store landing page content and metadata

#### Core Fields

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | Landing page ID |
| title | VARCHAR(500) | NOT NULL | - | Page title |
| slug | VARCHAR(255) | NOT NULL, UNIQUE, CHECK (lowercase-with-dashes) | - | URL identifier |

#### Phase 1 Content Fields (Migration 002)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| headline | VARCHAR(500) | NULLABLE | NULL | Main headline/H1 text |
| subheading | VARCHAR(1000) | NULLABLE | NULL | Supporting subheading/H2 text |
| body_text | TEXT | NULLABLE | NULL | Main body content |
| cta_text | VARCHAR(100) | NULLABLE | 'Submit' | Call-to-action button text |
| hero_image_url | VARCHAR(2048) | NULLABLE | NULL | URL to hero/banner image |

#### Form Configuration (Migration 002)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| form_fields | JSONB | NOT NULL | See below | Form field configuration |

**Default form_fields value:**
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

#### Publishing Metadata (Migration 002)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| publish_status | VARCHAR(50) | NOT NULL, CHECK | 'draft' | Current publishing status |
| published_url | VARCHAR(2048) | NULLABLE | NULL | Public URL where page is accessible |
| published_at | TIMESTAMP | NULLABLE | NULL | When page was first published |

**Valid publish_status values:**
- `draft` - Work in progress, not public
- `published` - Live and publicly accessible
- `unpublished` - Was published but taken down
- `scheduled` - Scheduled for future publish (Phase 2+)

#### Legacy/Audit Fields

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| content_json | JSONB | NOT NULL | '{}' | Legacy flexible storage |
| status | VARCHAR(50) | NOT NULL, CHECK (draft/published/archived) | 'draft' | Legacy status field |
| created_by | INTEGER | NOT NULL, FK → users(id) | - | Creator user ID |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Creation time |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_landing_pages_slug` on `slug`
- `idx_landing_pages_status` on `status`
- `idx_landing_pages_publish_status` on `publish_status` *(Migration 002)*
- `idx_landing_pages_published_at` on `published_at DESC NULLS LAST` *(Migration 002)*
- `idx_landing_pages_created_by` on `created_by`
- `idx_landing_pages_created_at` on `created_at DESC`
- `idx_landing_pages_content_json` (GIN index) on `content_json`
- `idx_landing_pages_form_fields` (GIN index) on `form_fields` *(Migration 002)*

**Foreign Keys:**
- `created_by` → `users(id)` ON DELETE RESTRICT ON UPDATE CASCADE

**Triggers:**
- `trigger_landing_pages_updated_at` - Auto-updates `updated_at` on row update

**Example Phase 1 Landing Page:**
```sql
INSERT INTO landing_pages (
  title, slug, headline, subheading, body_text,
  cta_text, hero_image_url, form_fields,
  publish_status, created_by
) VALUES (
  'Free Marketing Guide 2025',
  'free-marketing-guide-2025',
  'Download Your Free Digital Marketing Guide',
  'Learn the latest strategies that drive results',
  'Our comprehensive 50-page guide covers SEO, social media, content marketing...',
  'Get Your Free Guide',
  'https://example.com/images/hero.jpg',
  '{
    "fields": [
      {"name": "name", "label": "Full Name", "type": "text", "required": true},
      {"name": "email", "label": "Work Email", "type": "email", "required": true},
      {"name": "company", "label": "Company", "type": "text", "required": false}
    ]
  }'::jsonb,
  'draft',
  1
);
```

---

### 3. LEADS

**Purpose:** Store marketing leads from all sources

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | SERIAL | PRIMARY KEY | auto | Lead ID |
| landing_page_id | INTEGER | NULLABLE, FK → landing_pages(id) | NULL | Source landing page |
| name | VARCHAR(255) | NOT NULL | - | Lead full name |
| email | VARCHAR(255) | NOT NULL, CHECK (email format) | - | Lead email |
| phone | VARCHAR(50) | NULLABLE | NULL | Lead phone number |
| source | VARCHAR(100) | NOT NULL, CHECK (valid sources) | 'landing_page' | Lead source |
| status | VARCHAR(50) | NOT NULL, CHECK (valid statuses) | 'new' | Lead status |
| created_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Lead capture time |
| updated_at | TIMESTAMP | NOT NULL | CURRENT_TIMESTAMP | Last update time |

**Indexes:**
- `idx_leads_email` on `email`
- `idx_leads_landing_page_id` on `landing_page_id`
- `idx_leads_source` on `source`
- `idx_leads_status` on `status`
- `idx_leads_created_at` on `created_at DESC`
- `idx_leads_name` on `name`
- `idx_leads_source_status` (composite) on `(source, status)`
- `idx_leads_landing_page_status` (composite) on `(landing_page_id, status)`

**Foreign Keys:**
- `landing_page_id` → `landing_pages(id)` ON DELETE SET NULL ON UPDATE CASCADE

**Triggers:**
- `trigger_leads_updated_at` - Auto-updates `updated_at` on row update

**Valid Sources:**
- `landing_page` - From landing page form
- `webinar` - From webinar registration
- `social_media` - From social media campaign
- `wordpress_form` - From WordPress contact form
- `manual` - Manually entered
- `csv_import` - Bulk CSV import
- `other` - Other sources

**Valid Statuses:**
- `new` - Just captured, not contacted
- `contacted` - Initial contact made
- `qualified` - Meets qualification criteria
- `in_progress` - Actively being worked on
- `converted` - Successfully converted to customer
- `closed_won` - Deal closed successfully
- `closed_lost` - Deal lost
- `unqualified` - Does not meet criteria

---

## 🔗 Relationships

### One-to-Many Relationships

#### Users → Landing Pages (1:*)
- **Relationship:** One user can create many landing pages
- **Foreign Key:** `landing_pages.created_by` → `users.id`
- **Delete Behavior:** RESTRICT (cannot delete user who created pages)
- **Update Behavior:** CASCADE (user ID updates propagate)

#### Landing Pages → Leads (1:0..*)
- **Relationship:** One landing page can capture many leads (or none)
- **Foreign Key:** `leads.landing_page_id` → `landing_pages.id`
- **Delete Behavior:** SET NULL (if page deleted, lead remains with NULL page_id)
- **Update Behavior:** CASCADE (page ID updates propagate)
- **Nullable:** Yes (leads can come from sources other than landing pages)

---

## 📈 Common Queries

### 1. Get all landing pages with creator info

```sql
SELECT
    lp.id,
    lp.title,
    lp.slug,
    lp.status,
    u.name AS created_by_name,
    u.email AS created_by_email,
    lp.created_at
FROM landing_pages lp
JOIN users u ON lp.created_by = u.id
ORDER BY lp.created_at DESC;
```

### 2. Get all leads with landing page and creator info

```sql
SELECT
    l.id,
    l.name AS lead_name,
    l.email AS lead_email,
    l.source,
    l.status,
    lp.title AS landing_page_title,
    u.name AS page_creator
FROM leads l
LEFT JOIN landing_pages lp ON l.landing_page_id = lp.id
LEFT JOIN users u ON lp.created_by = u.id
ORDER BY l.created_at DESC;
```

### 3. Count leads by source

```sql
SELECT
    source,
    COUNT(*) AS total_leads,
    COUNT(CASE WHEN status = 'converted' THEN 1 END) AS converted_leads,
    ROUND(
        COUNT(CASE WHEN status = 'converted' THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC * 100,
        2
    ) AS conversion_rate
FROM leads
GROUP BY source
ORDER BY total_leads DESC;
```

### 4. Get landing page performance

```sql
SELECT
    lp.id,
    lp.title,
    lp.slug,
    lp.status,
    COUNT(l.id) AS total_leads,
    COUNT(CASE WHEN l.status = 'converted' THEN 1 END) AS converted_leads,
    ROUND(
        COUNT(CASE WHEN l.status = 'converted' THEN 1 END)::NUMERIC / NULLIF(COUNT(l.id), 0) * 100,
        2
    ) AS conversion_rate
FROM landing_pages lp
LEFT JOIN leads l ON lp.id = l.landing_page_id
GROUP BY lp.id, lp.title, lp.slug, lp.status
ORDER BY total_leads DESC;
```

### 5. Get leads created in the last 30 days

```sql
SELECT
    id,
    name,
    email,
    source,
    status,
    created_at
FROM leads
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;
```

### 6. Search leads by name or email

```sql
SELECT
    id,
    name,
    email,
    phone,
    source,
    status
FROM leads
WHERE
    name ILIKE '%john%'
    OR email ILIKE '%john%'
ORDER BY created_at DESC;
```

---

## 🔒 Security Considerations

### Password Storage
- **Never store plain text passwords**
- Use bcrypt with salt rounds ≥ 10
- Hash passwords in application layer before INSERT

### Email Validation
- Email format validated at database level using regex
- Additional validation should be done in application layer
- Consider email verification workflow

### SQL Injection Prevention
- Use parameterized queries
- Never concatenate user input into SQL
- Use ORM/query builder when possible

### Data Access
- Implement row-level security if needed
- Use database roles and permissions
- Audit sensitive operations

---

## 🚀 Performance Optimization

### Indexing Strategy
✅ All foreign keys are indexed
✅ Frequently searched columns (email, status, source) are indexed
✅ Timestamp columns for sorting are indexed
✅ Composite indexes for common query patterns
✅ GIN index on JSONB for content_json queries

### Query Optimization Tips
- Use EXPLAIN ANALYZE to check query performance
- Avoid SELECT * - select only needed columns
- Use pagination for large result sets
- Consider materialized views for complex reports

### Monitoring
- Monitor slow queries
- Track index usage
- Analyze table statistics regularly
- Consider partitioning for very large tables

---

## 📊 Data Migration Plan

### Migration 001: Core Tables (Completed ✅)
- ✅ users (basic user authentication)
- ✅ landing_pages (basic structure)
- ✅ leads (lead capture)
- ✅ Triggers for updated_at
- ✅ Sample seed data

### Migration 002: Phase 1 Landing Pages Extension (Completed ✅)
- ✅ Content fields (headline, subheading, body_text, cta_text, hero_image_url)
- ✅ Form configuration (form_fields JSONB)
- ✅ Publishing metadata (publish_status, published_url, published_at)
- ✅ Indexes for performance
- ✅ Sample Phase 1 data

### Future Migrations

#### Phase 2: Social Media
- social_accounts
- social_posts
- social_analytics
- social_media_metrics

#### Phase 3: SEO & Analytics
- seo_metrics
- keywords
- analytics_snapshots
- page_performance

#### Phase 4: Reporting
- reports
- report_schedules
- report_templates

#### Phase 5: Advanced Features
- campaigns
- email_templates
- automation_workflows
- landing_page_templates

---

## 📝 Maintenance Tasks

### Daily
- Monitor database performance
- Check for failed queries
- Review slow query log

### Weekly
- Review and optimize slow queries
- Check index usage
- Backup database

### Monthly
- Analyze table statistics
- Review and update indexes
- Archive old data if needed
- Review storage usage

---

**DMAT Database Team**
