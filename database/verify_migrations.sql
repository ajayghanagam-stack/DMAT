-- ============================================================================
-- DMAT Phase 1 Database Verification Script
-- ============================================================================
-- Purpose: Comprehensive verification of all Phase 1 migrations
-- Usage: psql -d dmat_dev -f verify_migrations.sql
-- Author: DMAT Team
-- Date: 2025-12-03
-- ============================================================================

\echo '╔════════════════════════════════════════════════════════════════════╗'
\echo '║  DMAT Phase 1 Database Verification                                ║'
\echo '╚════════════════════════════════════════════════════════════════════╝'
\echo ''

-- ============================================================================
-- 1. TABLE VERIFICATION
-- ============================================================================

\echo '=== 1. TABLE VERIFICATION ==='
\echo ''

SELECT
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

\echo ''
\echo 'Expected: 3 tables (users, landing_pages, leads)'
\echo ''

-- ============================================================================
-- 2. RECORD COUNTS
-- ============================================================================

\echo '=== 2. RECORD COUNTS ==='
\echo ''

SELECT 'users' AS table_name, COUNT(*) AS record_count FROM users
UNION ALL
SELECT 'landing_pages', COUNT(*) FROM landing_pages
UNION ALL
SELECT 'leads', COUNT(*) FROM leads;

\echo ''
\echo 'Expected: users >= 5, landing_pages >= 4, leads >= 8'
\echo ''

-- ============================================================================
-- 3. FOREIGN KEY VERIFICATION
-- ============================================================================

\echo '=== 3. FOREIGN KEY VERIFICATION ==='
\echo ''

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
\echo 'Expected: 2 foreign keys'
\echo '  - landing_pages.created_by → users.id (RESTRICT/CASCADE)'
\echo '  - leads.landing_page_id → landing_pages.id (SET NULL/CASCADE)'
\echo ''

-- ============================================================================
-- 4. INDEX VERIFICATION
-- ============================================================================

\echo '=== 4. INDEX VERIFICATION ==='
\echo ''

SELECT
  tablename,
  COUNT(*) AS index_count
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

\echo ''
\echo 'Expected: users >= 4, landing_pages >= 9, leads >= 10'
\echo ''

-- ============================================================================
-- 5. LANDING PAGES - COLUMN VERIFICATION
-- ============================================================================

\echo '=== 5. LANDING_PAGES - COLUMN VERIFICATION ==='
\echo ''

SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'landing_pages'
  AND column_name IN (
    'id', 'title', 'slug',
    'headline', 'subheading', 'body_text', 'cta_text', 'hero_image_url',
    'form_fields', 'publish_status', 'published_url', 'published_at',
    'created_by', 'created_at', 'updated_at'
  )
ORDER BY ordinal_position;

\echo ''
\echo 'Expected: 15+ columns including Phase 1 fields'
\echo ''

-- ============================================================================
-- 6. LEADS - COLUMN VERIFICATION
-- ============================================================================

\echo '=== 6. LEADS - COLUMN VERIFICATION ==='
\echo ''

SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'leads'
  AND column_name IN (
    'id', 'landing_page_id', 'name', 'email', 'phone',
    'company', 'job_title', 'message',
    'source', 'source_details', 'referrer_url', 'landing_url',
    'user_agent', 'ip_address', 'status',
    'created_at', 'updated_at'
  )
ORDER BY ordinal_position;

\echo ''
\echo 'Expected: 17 columns including Phase 1 fields'
\echo ''

-- ============================================================================
-- 7. LANDING PAGES - DATA CHECK
-- ============================================================================

\echo '=== 7. LANDING_PAGES - DATA CHECK ==='
\echo ''

SELECT
  COUNT(*) AS total_pages,
  COUNT(headline) AS pages_with_headline,
  COUNT(form_fields) AS pages_with_form_config,
  COUNT(CASE WHEN publish_status = 'draft' THEN 1 END) AS draft_pages,
  COUNT(CASE WHEN publish_status = 'published' THEN 1 END) AS published_pages
FROM landing_pages;

\echo ''
\echo 'Expected: All pages should have headline and form_fields'
\echo ''

-- ============================================================================
-- 8. LEADS - DATA CHECK
-- ============================================================================

\echo '=== 8. LEADS - DATA CHECK ==='
\echo ''

SELECT
  COUNT(*) AS total_leads,
  COUNT(company) AS leads_with_company,
  COUNT(source_details) AS leads_with_source_details,
  COUNT(referrer_url) AS leads_with_referrer,
  COUNT(landing_url) AS leads_with_landing_url,
  COUNT(message) AS leads_with_message
FROM leads;

\echo ''
\echo 'Expected: All leads should have source_details (backfilled)'
\echo ''

-- ============================================================================
-- 9. TRIGGER VERIFICATION
-- ============================================================================

\echo '=== 9. TRIGGER VERIFICATION ==='
\echo ''

SELECT
  trigger_name,
  event_manipulation AS event,
  event_object_table AS table_name,
  action_timing AS timing
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

\echo ''
\echo 'Expected: 3 triggers (one per table for updated_at)'
\echo ''

-- ============================================================================
-- 10. CONSTRAINT VERIFICATION
-- ============================================================================

\echo '=== 10. CONSTRAINT VERIFICATION ==='
\echo ''

SELECT
  conrelid::regclass AS table_name,
  conname AS constraint_name,
  contype AS constraint_type,
  CASE contype
    WHEN 'c' THEN 'CHECK'
    WHEN 'f' THEN 'FOREIGN KEY'
    WHEN 'p' THEN 'PRIMARY KEY'
    WHEN 'u' THEN 'UNIQUE'
    WHEN 't' THEN 'TRIGGER'
  END AS type_description
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass::text, contype, conname;

\echo ''
\echo 'Expected: PRIMARY KEYs, FOREIGN KEYs, UNIQUE, and CHECK constraints'
\echo ''

-- ============================================================================
-- 11. SAMPLE DATA VERIFICATION
-- ============================================================================

\echo '=== 11. SAMPLE DATA VERIFICATION ==='
\echo ''

\echo 'Users:'
SELECT
  id,
  name,
  email,
  role
FROM users
ORDER BY id
LIMIT 5;

\echo ''
\echo 'Landing Pages:'
SELECT
  id,
  title,
  slug,
  headline,
  publish_status
FROM landing_pages
ORDER BY created_at DESC
LIMIT 5;

\echo ''
\echo 'Leads:'
SELECT
  id,
  name,
  email,
  company,
  source,
  source_details,
  status
FROM leads
ORDER BY created_at DESC
LIMIT 5;

\echo ''

-- ============================================================================
-- 12. PHASE 1 READINESS CHECK
-- ============================================================================

\echo '=== 12. PHASE 1 READINESS CHECK ==='
\echo ''

SELECT
  'Database Ready for Phase 1' AS status,
  CASE
    WHEN (SELECT COUNT(*) FROM users) >= 5 THEN '✅'
    ELSE '❌'
  END AS has_users,
  CASE
    WHEN (SELECT COUNT(*) FROM landing_pages) >= 1 THEN '✅'
    ELSE '❌'
  END AS has_landing_pages,
  CASE
    WHEN (SELECT COUNT(*) FROM leads) >= 3 THEN '✅'
    ELSE '❌'
  END AS has_leads,
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'headline') = 1 THEN '✅'
    ELSE '❌'
  END AS landing_pages_extended,
  CASE
    WHEN (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'source_details') = 1 THEN '✅'
    ELSE '❌'
  END AS leads_refined,
  CASE
    WHEN (SELECT COUNT(*) FROM pg_constraint WHERE contype = 'f') = 2 THEN '✅'
    ELSE '❌'
  END AS fk_constraints_ok;

\echo ''

-- ============================================================================
-- 13. FINAL STATUS
-- ============================================================================

\echo '=== 13. FINAL STATUS ==='
\echo ''

DO $$
DECLARE
  user_count INT;
  page_count INT;
  lead_count INT;
  headline_exists INT;
  source_details_exists INT;
  fk_count INT;
  all_ready BOOLEAN;
BEGIN
  SELECT COUNT(*) INTO user_count FROM users;
  SELECT COUNT(*) INTO page_count FROM landing_pages;
  SELECT COUNT(*) INTO lead_count FROM leads;
  SELECT COUNT(*) INTO headline_exists FROM information_schema.columns WHERE table_name = 'landing_pages' AND column_name = 'headline';
  SELECT COUNT(*) INTO source_details_exists FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'source_details';
  SELECT COUNT(*) INTO fk_count FROM pg_constraint WHERE contype = 'f';

  all_ready := (
    user_count >= 5 AND
    page_count >= 1 AND
    lead_count >= 3 AND
    headline_exists = 1 AND
    source_details_exists = 1 AND
    fk_count = 2
  );

  IF all_ready THEN
    RAISE NOTICE '';
    RAISE NOTICE '╔════════════════════════════════════════════════════════════════════╗';
    RAISE NOTICE '║  ✅ SUCCESS: Database is ready for Phase 1 development!            ║';
    RAISE NOTICE '╚════════════════════════════════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE 'Summary:';
    RAISE NOTICE '  - Users: % (expected >= 5)', user_count;
    RAISE NOTICE '  - Landing Pages: % (expected >= 1)', page_count;
    RAISE NOTICE '  - Leads: % (expected >= 3)', lead_count;
    RAISE NOTICE '  - Landing Pages Extended: ✅';
    RAISE NOTICE '  - Leads Refined: ✅';
    RAISE NOTICE '  - Foreign Keys: % (expected 2)', fk_count;
    RAISE NOTICE '';
    RAISE NOTICE 'All migrations applied successfully! 🚀';
    RAISE NOTICE '';
  ELSE
    RAISE NOTICE '';
    RAISE NOTICE '╔════════════════════════════════════════════════════════════════════╗';
    RAISE NOTICE '║  ⚠️  WARNING: Database may not be fully ready                      ║';
    RAISE NOTICE '╚════════════════════════════════════════════════════════════════════╝';
    RAISE NOTICE '';
    RAISE NOTICE 'Issues detected:';
    IF user_count < 5 THEN
      RAISE NOTICE '  ❌ Users: % (expected >= 5)', user_count;
    END IF;
    IF page_count < 1 THEN
      RAISE NOTICE '  ❌ Landing Pages: % (expected >= 1)', page_count;
    END IF;
    IF lead_count < 3 THEN
      RAISE NOTICE '  ❌ Leads: % (expected >= 3)', lead_count;
    END IF;
    IF headline_exists != 1 THEN
      RAISE NOTICE '  ❌ Migration 002 may not be applied (headline column missing)';
    END IF;
    IF source_details_exists != 1 THEN
      RAISE NOTICE '  ❌ Migration 003 may not be applied (source_details column missing)';
    END IF;
    IF fk_count != 2 THEN
      RAISE NOTICE '  ❌ Foreign Keys: % (expected 2)', fk_count;
    END IF;
    RAISE NOTICE '';
    RAISE NOTICE 'Please review the MIGRATION_GUIDE.md and apply missing migrations.';
    RAISE NOTICE '';
  END IF;
END $$;

\echo ''
\echo '╔════════════════════════════════════════════════════════════════════╗'
\echo '║  Verification Complete                                             ║'
\echo '╚════════════════════════════════════════════════════════════════════╝'
\echo ''

-- ============================================================================
-- END OF VERIFICATION
-- ============================================================================
