-- ============================================================================
-- DMAT - Core Database Schema Rollback
-- Migration: 001_rollback_core_tables.sql
-- Description: Rolls back users, landing_pages, and leads tables
-- Author: DMAT Team
-- Date: 2025-11-28
-- ============================================================================

-- WARNING: This will delete all data in these tables!
-- Use with caution, especially in production environments.

-- ============================================================================
-- 1. DROP TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS trigger_leads_updated_at ON leads;
DROP TRIGGER IF EXISTS trigger_landing_pages_updated_at ON landing_pages;
DROP TRIGGER IF EXISTS trigger_users_updated_at ON users;

-- ============================================================================
-- 2. DROP TABLES (in reverse order due to foreign key constraints)
-- ============================================================================

DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS landing_pages CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- 3. DROP FUNCTIONS
-- ============================================================================

DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================================================
-- 4. VERIFICATION
-- ============================================================================

-- Verify tables are dropped
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('users', 'landing_pages', 'leads');

-- Should return 0 rows if rollback was successful

-- ============================================================================
-- END OF ROLLBACK
-- ============================================================================

SELECT 'DMAT Core Tables Rollback Completed!' AS status;
