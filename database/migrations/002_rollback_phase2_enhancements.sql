-- ============================================================
-- Phase 2 Database Rollback Migration
-- Created: 2025-12-09
-- Purpose: Rollback Phase 2 enhancements
-- ============================================================

-- ============================================================
-- ROLLBACK IN REVERSE ORDER
-- ============================================================

-- 1. Remove landing page enhancements
ALTER TABLE landing_pages
  DROP COLUMN IF EXISTS form_config,
  DROP COLUMN IF EXISTS template_id;

-- 2. Drop templates table
DROP TABLE IF EXISTS templates CASCADE;

-- 3. Drop page views table
DROP TABLE IF EXISTS page_views CASCADE;

-- 4. Drop lead notes table
DROP TABLE IF EXISTS lead_notes CASCADE;

-- 5. Remove lead enhancement columns
ALTER TABLE leads
  DROP COLUMN IF EXISTS last_submitted_at,
  DROP COLUMN IF EXISTS duplicate_count,
  DROP COLUMN IF EXISTS assigned_at,
  DROP COLUMN IF EXISTS assigned_to;

-- ============================================================
-- Rollback Complete
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE 'Phase 2 rollback completed successfully!';
END $$;
