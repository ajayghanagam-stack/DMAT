# DMAT Database Migration Guide

**Version:** 1.0
**Date:** 2025-12-03
**Database:** PostgreSQL 14+
**Purpose:** Complete guide for applying Phase 1 database migrations

---

## 📋 Overview

This guide provides step-by-step instructions for applying all DMAT database migrations from initial setup through Phase 1 completion.

**Total Migrations:** 3 (001, 002, 003)
**Estimated Time:** 5-10 minutes
**Rollback Available:** Yes (for all migrations)

---

## ✅ Pre-Migration Checklist

Before running migrations, ensure:

- [ ] PostgreSQL 14+ is installed and running
- [ ] Database `dmat_dev` exists (or create it)
- [ ] You have necessary permissions (CREATE, ALTER, INSERT)
- [ ] You have a backup (recommended for production)
- [ ] You've read this guide completely

---

## 🗄 Migration Overview

### Migration 001: Core Tables
**File:** `001_create_core_tables.sql`
**Rollback:** `001_rollback_core_tables.sql`
**Status:** ✅ Required for Phase 1

**Creates:**
- `users` table (authentication)
- `landing_pages` table (basic structure)
- `leads` table (basic structure)
- Foreign key relationships
- Indexes for performance
- Triggers for `updated_at` auto-update
- Sample seed data (5 users, 1 landing page, 3 leads)

**Foreign Keys:**
- `landing_pages.created_by` → `users.id` (ON DELETE RESTRICT, ON UPDATE CASCADE)
- `leads.landing_page_id` → `landing_pages.id` (ON DELETE SET NULL, ON UPDATE CASCADE)

---

### Migration 002: Landing Pages Extension
**File:** `002_extend_landing_pages.sql`
**Rollback:** `002_rollback_extend_landing_pages.sql`
**Status:** ✅ Required for Phase 1

**Adds to `landing_pages`:**
- Content fields: `headline`, `subheading`, `body_text`, `cta_text`, `hero_image_url`
- Form configuration: `form_fields` (JSONB)
- Publishing metadata: `publish_status`, `published_url`, `published_at`
- Performance indexes
- Sample landing pages (3 examples)

**Dependencies:** Migration 001 must be applied first

**Foreign Keys:** No changes (all existing FKs preserved)

---

### Migration 003: Leads Refinement
**File:** `003_refine_leads.sql`
**Rollback:** `003_rollback_refine_leads.sql`
**Status:** ✅ Required for Phase 1

**Adds to `leads`:**
- Additional contact: `company`, `job_title`, `message`
- Source attribution: `source_details`, `referrer_url`, `landing_url`
- Technical metadata: `user_agent`, `ip_address`
- Partial indexes for performance
- Backfills `source_details` from existing data
- Sample leads (5 examples)

**Dependencies:** Migration 001 must be applied first

**Foreign Keys:** No changes (all existing FKs preserved)

---

## 🚀 Quick Start (Fresh Database)

If you're starting fresh, run all migrations in order:

```bash
cd database

# Create database (if not exists)
createdb dmat_dev

# Run all migrations in order
psql -d dmat_dev -f migrations/001_create_core_tables.sql
psql -d dmat_dev -f migrations/002_extend_landing_pages.sql
psql -d dmat_dev -f migrations/003_refine_leads.sql

# Verify
psql -d dmat_dev -c "\dt"  # List tables
psql -d dmat_dev -c "SELECT COUNT(*) FROM users;"  # Should return 5
```

**Expected Output:**
```
Migration 001: ✅ DMAT Core Tables Migration Completed Successfully!
Migration 002: ✅ Migration 002: Landing Pages Extension completed successfully!
Migration 003: ✅ Migration 003: Leads Refinement completed successfully!
```

---

## 📝 Step-by-Step Migration Process

### Step 1: Verify Prerequisites

```bash
# Check PostgreSQL version (should be 14+)
psql --version

# Check if database exists
psql -l | grep dmat_dev

# If database doesn't exist, create it
createdb dmat_dev

# Test connection
psql -d dmat_dev -c "SELECT version();"
```

---

### Step 2: Apply Migration 001 (Core Tables)

```bash
# Navigate to database directory
cd database

# Run migration
psql -d dmat_dev -f migrations/001_create_core_tables.sql

# Verify tables created
psql -d dmat_dev -c "\dt"

# Expected tables: users, landing_pages, leads
```

**Verification Queries:**

```sql
-- Check users table
SELECT COUNT(*) AS user_count FROM users;
-- Expected: 5 users

-- Check landing_pages table
SELECT COUNT(*) AS page_count FROM landing_pages;
-- Expected: 1 landing page

-- Check leads table
SELECT COUNT(*) AS lead_count FROM leads;
-- Expected: 3 leads

-- Verify foreign keys
SELECT
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confrelid::regclass AS referenced_table
FROM pg_constraint
WHERE contype = 'f'
  AND connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass::text;
```

**Expected Constraints:**
- `fk_landing_pages_created_by`: landing_pages → users
- `fk_leads_landing_page_id`: leads → landing_pages

---

### Step 3: Apply Migration 002 (Landing Pages Extension)

```bash
# Run migration
psql -d dmat_dev -f migrations/002_extend_landing_pages.sql

# Verify new columns
psql -d dmat_dev -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'landing_pages' ORDER BY ordinal_position;"
```

**Verification Queries:**

```sql
-- Check new columns exist
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'landing_pages'
  AND column_name IN (
    'headline',
    'subheading',
    'body_text',
    'cta_text',
    'hero_image_url',
    'form_fields',
    'publish_status',
    'published_url',
    'published_at'
  )
ORDER BY column_name;

-- Should return 9 rows

-- Check sample data
SELECT
  id,
  title,
  headline,
  publish_status,
  published_at
FROM landing_pages
ORDER BY created_at DESC
LIMIT 5;

-- Should show 4 landing pages total (1 from 001, 3 from 002)

-- Verify form_fields structure
SELECT
  id,
  title,
  jsonb_pretty(form_fields) AS form_config
FROM landing_pages
WHERE form_fields IS NOT NULL
LIMIT 1;
```

---

### Step 4: Apply Migration 003 (Leads Refinement)

```bash
# Run migration
psql -d dmat_dev -f migrations/003_refine_leads.sql

# Verify new columns
psql -d dmat_dev -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'leads' ORDER BY ordinal_position;"
```

**Verification Queries:**

```sql
-- Check new columns exist
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
  AND column_name IN (
    'company',
    'job_title',
    'message',
    'source_details',
    'referrer_url',
    'landing_url',
    'user_agent',
    'ip_address'
  )
ORDER BY column_name;

-- Should return 8 rows

-- Check sample data
SELECT
  id,
  name,
  email,
  company,
  source_details,
  LEFT(referrer_url, 30) AS referrer
FROM leads
ORDER BY created_at DESC
LIMIT 5;

-- Should show 8 leads total (3 from 001, 5 from 003)

-- Verify source_details backfill
SELECT
  source,
  source_details,
  COUNT(*) AS lead_count
FROM leads
GROUP BY source, source_details
ORDER BY source;
```

---

## 🔍 Complete Verification Script

Run this comprehensive verification after all migrations:

```sql
-- ============================================================================
-- DMAT Phase 1 Database Verification
-- ============================================================================

\echo '=== TABLE VERIFICATION ==='
SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

\echo ''
\echo '=== RECORD COUNTS ==='
SELECT 'users' AS table_name, COUNT(*) AS record_count FROM users
UNION ALL
SELECT 'landing_pages', COUNT(*) FROM landing_pages
UNION ALL
SELECT 'leads', COUNT(*) FROM leads;

\echo ''
\echo '=== FOREIGN KEY VERIFICATION ==='
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column,
  rc.delete_rule,
  rc.update_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

\echo ''
\echo '=== INDEX VERIFICATION ==='
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

\echo ''
\echo '=== LANDING PAGES - NEW FIELDS CHECK ==='
SELECT
  COUNT(*) AS total_pages,
  COUNT(headline) AS pages_with_headline,
  COUNT(form_fields) AS pages_with_form_config,
  COUNT(CASE WHEN publish_status = 'draft' THEN 1 END) AS draft_pages,
  COUNT(CASE WHEN publish_status = 'published' THEN 1 END) AS published_pages
FROM landing_pages;

\echo ''
\echo '=== LEADS - NEW FIELDS CHECK ==='
SELECT
  COUNT(*) AS total_leads,
  COUNT(company) AS leads_with_company,
  COUNT(source_details) AS leads_with_source_details,
  COUNT(referrer_url) AS leads_with_referrer,
  COUNT(landing_url) AS leads_with_landing_url,
  COUNT(message) AS leads_with_message
FROM leads;

\echo ''
\echo '=== TRIGGER VERIFICATION ==='
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

\echo ''
\echo '=== PHASE 1 READINESS CHECK ==='
SELECT
  'Database Ready for Phase 1' AS status,
  (SELECT COUNT(*) FROM users) >= 5 AS has_users,
  (SELECT COUNT(*) FROM landing_pages) >= 1 AS has_landing_pages,
  (SELECT COUNT(*) FROM leads) >= 3 AS has_leads,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'headline') = 1 AS landing_pages_extended,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'source_details') = 1 AS leads_refined;

\echo ''
\echo '✅ Verification Complete!'
```

**Save this as `verify_migrations.sql` and run:**

```bash
psql -d dmat_dev -f verify_migrations.sql
```

---

## 🔄 Rollback Procedures

If you need to undo migrations (in reverse order):

### Rollback Migration 003

```bash
psql -d dmat_dev -f migrations/003_rollback_refine_leads.sql
```

**Warning:** This will DELETE all data in:
- `company`, `job_title`, `message`
- `source_details`, `referrer_url`, `landing_url`
- `user_agent`, `ip_address`

### Rollback Migration 002

```bash
psql -d dmat_dev -f migrations/002_rollback_extend_landing_pages.sql
```

**Warning:** This will DELETE all data in:
- `headline`, `subheading`, `body_text`, `cta_text`, `hero_image_url`
- `form_fields`
- `publish_status`, `published_url`, `published_at`

### Rollback Migration 001

```bash
psql -d dmat_dev -f migrations/001_rollback_core_tables.sql
```

**Warning:** This will DROP all tables (`users`, `landing_pages`, `leads`)

---

## 🛠 Troubleshooting

### Issue: "relation already exists"

**Cause:** Migration already applied or partial application

**Solution:**
```bash
# Check what tables exist
psql -d dmat_dev -c "\dt"

# If tables exist but migration failed, check the error
# You may need to manually fix or rollback first
```

### Issue: "permission denied"

**Cause:** Insufficient database permissions

**Solution:**
```bash
# Grant necessary permissions
psql -d dmat_dev -c "GRANT ALL PRIVILEGES ON DATABASE dmat_dev TO your_username;"
```

### Issue: "foreign key constraint violation"

**Cause:** Trying to apply migrations out of order

**Solution:**
- Always apply migrations in numerical order: 001 → 002 → 003
- If you need to rollback, do it in reverse order: 003 → 002 → 001

### Issue: "column does not exist"

**Cause:** Previous migration not applied

**Solution:**
```bash
# Check migration status
psql -d dmat_dev -c "SELECT column_name FROM information_schema.columns WHERE table_name = 'landing_pages';"

# Apply missing migrations in order
```

---

## 📊 Migration Dependency Graph

```
001_create_core_tables.sql
    ├── Creates: users, landing_pages, leads
    ├── FK: landing_pages.created_by → users.id
    └── FK: leads.landing_page_id → landing_pages.id
         ↓
002_extend_landing_pages.sql
    ├── Depends on: 001
    ├── Adds columns to: landing_pages
    └── Preserves all FKs
         ↓
003_refine_leads.sql
    ├── Depends on: 001
    ├── Adds columns to: leads
    └── Preserves all FKs
```

**Note:** Migrations 002 and 003 are independent of each other and can be applied in any order after 001. However, we recommend applying them sequentially (001 → 002 → 003) for consistency.

---

## ✅ Success Criteria

After all migrations, you should have:

- [x] **3 tables:** users, landing_pages, leads
- [x] **2 foreign key constraints** (properly enforced)
- [x] **20+ indexes** (for query performance)
- [x] **3 triggers** (for auto-updating `updated_at`)
- [x] **5+ users** in the database
- [x] **4+ landing pages** with Phase 1 fields
- [x] **8+ leads** with Phase 1 tracking fields

---

## 🔐 Security Notes

1. **Production Migrations:**
   - Always backup before running migrations
   - Test on staging environment first
   - Run during low-traffic periods

2. **Credentials:**
   - Never commit database credentials
   - Use environment variables for connection strings
   - Use strong passwords for database users

3. **Sample Data:**
   - Migrations include sample data for testing
   - Remove sample data in production if not needed
   - Sample passwords are bcrypt hashed (placeholder hashes)

---

## 📚 Additional Resources

- [Database Schema Documentation](../docs/Database-Schema.md)
- [Phase 1 Success Criteria](../docs/Phase1-Success-Criteria.md)
- [Phase 1 Landing Page Schema](../docs/Phase1-LandingPage-Schema.md)
- [Phase 1 Lead Schema](../docs/Phase1-Lead-Schema.md)

---

## 📞 Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Review PostgreSQL logs for detailed error messages
3. Verify you're running migrations in the correct order
4. Ensure all prerequisites are met

---

**Migration Guide Version:** 1.0
**Last Updated:** 2025-12-03
**Maintained by:** DMAT Database Team
