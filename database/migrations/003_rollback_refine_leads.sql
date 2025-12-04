-- ============================================================================
-- DMAT - Rollback Leads Refinement
-- Migration: 003_rollback_refine_leads.sql
-- Description: Removes Phase 1 refinement fields from leads table
-- Author: DMAT Team
-- Date: 2025-12-03
-- Rolls back: 003_refine_leads.sql
-- ============================================================================

-- ============================================================================
-- WARNING
-- ============================================================================
-- This rollback will DELETE all data in the new columns!
-- - company, job_title, message
-- - source_details, referrer_url, landing_url
-- - user_agent, ip_address
--
-- Make sure you have a database backup before running this rollback!
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. DROP INDEXES
-- ============================================================================

-- Drop source_details index
DROP INDEX IF EXISTS idx_leads_source_details;

-- Drop company index
DROP INDEX IF EXISTS idx_leads_company;

-- Drop ip_address index
DROP INDEX IF EXISTS idx_leads_ip_address;

-- Drop referrer_url pattern index
DROP INDEX IF EXISTS idx_leads_referrer_url_pattern;

-- ============================================================================
-- 2. DROP TECHNICAL METADATA COLUMNS
-- ============================================================================

-- Drop ip_address column
ALTER TABLE leads
DROP COLUMN IF EXISTS ip_address;

-- Drop user_agent column
ALTER TABLE leads
DROP COLUMN IF EXISTS user_agent;

-- ============================================================================
-- 3. DROP SOURCE ATTRIBUTION COLUMNS
-- ============================================================================

-- Drop landing_url column
ALTER TABLE leads
DROP COLUMN IF EXISTS landing_url;

-- Drop referrer_url column
ALTER TABLE leads
DROP COLUMN IF EXISTS referrer_url;

-- Drop source_details column
ALTER TABLE leads
DROP COLUMN IF EXISTS source_details;

-- ============================================================================
-- 4. DROP ADDITIONAL CONTACT & FORM DATA COLUMNS
-- ============================================================================

-- Drop message column
ALTER TABLE leads
DROP COLUMN IF EXISTS message;

-- Drop job_title column
ALTER TABLE leads
DROP COLUMN IF EXISTS job_title;

-- Drop company column
ALTER TABLE leads
DROP COLUMN IF EXISTS company;

-- ============================================================================
-- 5. VERIFICATION QUERIES
-- ============================================================================

-- Verify columns are removed
SELECT
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;

-- Verify indexes are removed
SELECT
  indexname
FROM pg_indexes
WHERE tablename = 'leads'
ORDER BY indexname;

-- Show remaining leads structure
SELECT
  COUNT(*) AS total_leads,
  COUNT(DISTINCT source) AS unique_sources,
  COUNT(CASE WHEN status = 'new' THEN 1 END) AS new_leads,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) AS converted_leads,
  COUNT(CASE WHEN landing_page_id IS NOT NULL THEN 1 END) AS leads_with_landing_page
FROM leads;

COMMIT;

-- ============================================================================
-- END OF ROLLBACK
-- ============================================================================

SELECT '⚠️  Migration 003 rollback completed. Leads table returned to Migration 001 state.' AS status;
