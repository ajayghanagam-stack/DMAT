-- ============================================================================
-- DMAT - Rollback Landing Pages Extension
-- Migration: 002_rollback_extend_landing_pages.sql
-- Description: Removes Phase 1 extension fields from landing_pages table
-- Author: DMAT Team
-- Date: 2025-12-03
-- Rolls back: 002_extend_landing_pages.sql
-- ============================================================================

-- ============================================================================
-- WARNING
-- ============================================================================
-- This rollback will DELETE all data in the new columns!
-- - headline, subheading, body_text, cta_text, hero_image_url
-- - form_fields
-- - publish_status, published_url, published_at
--
-- Make sure you have a database backup before running this rollback!
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. DROP INDEXES
-- ============================================================================

-- Drop publish_status index
DROP INDEX IF EXISTS idx_landing_pages_publish_status;

-- Drop published_at index
DROP INDEX IF EXISTS idx_landing_pages_published_at;

-- Drop form_fields GIN index
DROP INDEX IF EXISTS idx_landing_pages_form_fields;

-- ============================================================================
-- 2. DROP CONSTRAINTS
-- ============================================================================

-- Drop publish_status check constraint
ALTER TABLE landing_pages
DROP CONSTRAINT IF EXISTS landing_pages_publish_status_check;

-- ============================================================================
-- 3. DROP PUBLISHING METADATA COLUMNS
-- ============================================================================

-- Drop published_at column
ALTER TABLE landing_pages
DROP COLUMN IF EXISTS published_at;

-- Drop published_url column
ALTER TABLE landing_pages
DROP COLUMN IF EXISTS published_url;

-- Drop publish_status column
ALTER TABLE landing_pages
DROP COLUMN IF EXISTS publish_status;

-- ============================================================================
-- 4. DROP FORM CONFIGURATION COLUMN
-- ============================================================================

-- Drop form_fields column
ALTER TABLE landing_pages
DROP COLUMN IF EXISTS form_fields;

-- ============================================================================
-- 5. DROP BASIC CONTENT COLUMNS
-- ============================================================================

-- Drop hero_image_url column
ALTER TABLE landing_pages
DROP COLUMN IF EXISTS hero_image_url;

-- Drop cta_text column
ALTER TABLE landing_pages
DROP COLUMN IF EXISTS cta_text;

-- Drop body_text column
ALTER TABLE landing_pages
DROP COLUMN IF EXISTS body_text;

-- Drop subheading column
ALTER TABLE landing_pages
DROP COLUMN IF EXISTS subheading;

-- Drop headline column
ALTER TABLE landing_pages
DROP COLUMN IF EXISTS headline;

-- ============================================================================
-- 6. VERIFICATION QUERIES
-- ============================================================================

-- Verify columns are removed
SELECT
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'landing_pages'
ORDER BY ordinal_position;

-- Verify indexes are removed
SELECT
  indexname
FROM pg_indexes
WHERE tablename = 'landing_pages'
ORDER BY indexname;

-- Show remaining landing_pages structure
SELECT
  COUNT(*) AS total_pages,
  COUNT(DISTINCT created_by) AS unique_creators,
  COUNT(CASE WHEN status = 'draft' THEN 1 END) AS draft_pages,
  COUNT(CASE WHEN status = 'published' THEN 1 END) AS published_pages,
  COUNT(CASE WHEN status = 'archived' THEN 1 END) AS archived_pages
FROM landing_pages;

COMMIT;

-- ============================================================================
-- END OF ROLLBACK
-- ============================================================================

SELECT '⚠️  Migration 002 rollback completed. Table returned to Migration 001 state.' AS status;
