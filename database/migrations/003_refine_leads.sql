-- ============================================================================
-- DMAT - Leads Table Refinement for Phase 1
-- Migration: 003_refine_leads.sql
-- Description: Adds Phase 1 contact, attribution, and tracking fields to leads
-- Author: DMAT Team
-- Date: 2025-12-03
-- Dependencies: 001_create_core_tables.sql
-- ============================================================================

-- ============================================================================
-- 1. ADD ADDITIONAL CONTACT & FORM DATA FIELDS
-- ============================================================================

-- Add company field
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS company VARCHAR(255);

COMMENT ON COLUMN leads.company IS 'Lead company/organization name (B2B forms)';

-- Add job_title field
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS job_title VARCHAR(255);

COMMENT ON COLUMN leads.job_title IS 'Lead job title/role (B2B forms)';

-- Add message field
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS message TEXT;

COMMENT ON COLUMN leads.message IS 'Custom message/notes from form submission or inquiry';

-- ============================================================================
-- 2. ADD SOURCE ATTRIBUTION FIELDS
-- ============================================================================

-- Add source_details field
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS source_details VARCHAR(500);

COMMENT ON COLUMN leads.source_details IS 'Specific source identifier (e.g., "LP: free-guide-2025", "Webinar: AI Marketing Jan 2025")';

-- Add referrer_url field
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS referrer_url VARCHAR(2048);

COMMENT ON COLUMN leads.referrer_url IS 'HTTP Referrer - where visitor came from before landing page (traffic source)';

-- Add landing_url field
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS landing_url VARCHAR(2048);

COMMENT ON COLUMN leads.landing_url IS 'Full URL where form was submitted, including UTM parameters for campaign tracking';

-- ============================================================================
-- 3. ADD TECHNICAL METADATA FIELDS
-- ============================================================================

-- Add user_agent field
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS user_agent VARCHAR(500);

COMMENT ON COLUMN leads.user_agent IS 'Browser/device user agent string (for device type analytics)';

-- Add ip_address field
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);

COMMENT ON COLUMN leads.ip_address IS 'IPv4 or IPv6 address (for duplicate detection and basic geo-targeting, subject to privacy laws)';

-- ============================================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index on source_details for filtering
CREATE INDEX IF NOT EXISTS idx_leads_source_details
ON leads(source_details)
WHERE source_details IS NOT NULL;

-- Index on company for B2B filtering
CREATE INDEX IF NOT EXISTS idx_leads_company
ON leads(company)
WHERE company IS NOT NULL;

-- Index on ip_address for duplicate detection
CREATE INDEX IF NOT EXISTS idx_leads_ip_address
ON leads(ip_address)
WHERE ip_address IS NOT NULL;

-- Partial text search index on referrer_url (for traffic source analysis)
-- Using text_pattern_ops for LIKE/ILIKE queries
CREATE INDEX IF NOT EXISTS idx_leads_referrer_url_pattern
ON leads(referrer_url text_pattern_ops)
WHERE referrer_url IS NOT NULL;

-- ============================================================================
-- 5. BACKFILL SOURCE_DETAILS FOR EXISTING LEADS (OPTIONAL)
-- ============================================================================

-- Update existing leads to populate source_details from landing_page slug
UPDATE leads l
SET source_details = 'LP: ' || lp.slug
FROM landing_pages lp
WHERE l.landing_page_id = lp.id
  AND l.source = 'landing_page'
  AND l.source_details IS NULL;

-- Update leads without landing_page_id to use generic source_details
UPDATE leads
SET source_details = CASE
  WHEN source = 'webinar' THEN 'Webinar Registration'
  WHEN source = 'social_media' THEN 'Social Media Campaign'
  WHEN source = 'wordpress_form' THEN 'WordPress Contact Form'
  WHEN source = 'manual' THEN 'Manually Entered'
  WHEN source = 'csv_import' THEN 'CSV Import'
  WHEN source = 'other' THEN 'Other Source'
  ELSE source
END
WHERE source_details IS NULL
  AND landing_page_id IS NULL;

-- ============================================================================
-- 6. INSERT SAMPLE DATA FOR TESTING
-- ============================================================================

-- Sample Lead 1: Simple landing page form
INSERT INTO leads (
  landing_page_id,
  name,
  email,
  phone,
  source,
  source_details,
  referrer_url,
  landing_url,
  status,
  created_at
) VALUES (
  1,
  'Sarah Johnson',
  'sarah.johnson@example.com',
  '+1-555-1001',
  'landing_page',
  'LP: free-marketing-guide-2025',
  'https://google.com/search?q=digital+marketing+guide',
  'https://innovateelectronics.com/lp/free-marketing-guide-2025?utm_source=google&utm_medium=organic',
  'new',
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- Sample Lead 2: B2B contact form with message
INSERT INTO leads (
  landing_page_id,
  name,
  email,
  phone,
  company,
  job_title,
  message,
  source,
  source_details,
  landing_url,
  user_agent,
  ip_address,
  status,
  created_at
) VALUES (
  2,
  'Michael Chen',
  'michael.chen@techcorp.com',
  '+1-555-2002',
  'TechCorp Solutions',
  'VP of Marketing',
  'Hi, I am interested in learning more about DMAT for our enterprise team of 50+ marketers. Can we schedule a demo?',
  'landing_page',
  'LP: contact-us',
  'https://innovateelectronics.com/contact',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  '203.0.113.42',
  'new',
  CURRENT_TIMESTAMP
)
ON CONFLICT DO NOTHING;

-- Sample Lead 3: Social media campaign lead
INSERT INTO leads (
  landing_page_id,
  name,
  email,
  source,
  source_details,
  referrer_url,
  landing_url,
  user_agent,
  ip_address,
  status,
  created_at
) VALUES (
  1,
  'Emily Rodriguez',
  'emily.r@startup.io',
  'social_media',
  'LinkedIn Campaign: Q1-2025-Product-Launch',
  'https://linkedin.com/feed/',
  'https://innovateelectronics.com/lp/dmat-pro-launch?utm_source=linkedin&utm_medium=social&utm_campaign=q1-launch',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  '198.51.100.23',
  'new',
  CURRENT_TIMESTAMP - INTERVAL '2 days'
)
ON CONFLICT DO NOTHING;

-- Sample Lead 4: Webinar registration
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
  status,
  created_at
) VALUES (
  3,
  'David Kim',
  'david.kim@innovators.com',
  '+1-555-3003',
  'Innovators Inc',
  'Marketing Manager',
  'webinar',
  'Webinar: AI-Powered Marketing Automation - January 2025',
  'https://twitter.com/InnovateElectronics/status/12345',
  'https://innovateelectronics.com/webinar-ai-marketing?utm_source=twitter&utm_medium=social',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
  'qualified',
  CURRENT_TIMESTAMP - INTERVAL '5 days'
)
ON CONFLICT DO NOTHING;

-- Sample Lead 5: Direct traffic (no referrer)
INSERT INTO leads (
  landing_page_id,
  name,
  email,
  phone,
  source,
  source_details,
  landing_url,
  user_agent,
  ip_address,
  status,
  created_at
) VALUES (
  1,
  'Jessica Brown',
  'jessica.brown@email.com',
  '+1-555-4004',
  'landing_page',
  'LP: free-marketing-guide-2025',
  'https://innovateelectronics.com/lp/free-marketing-guide-2025',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  '192.0.2.56',
  'new',
  CURRENT_TIMESTAMP - INTERVAL '1 day'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. VERIFICATION QUERIES
-- ============================================================================

-- Verify new columns exist
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
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
ORDER BY ordinal_position;

-- Verify indexes created
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'leads'
  AND indexname LIKE 'idx_leads_%'
ORDER BY indexname;

-- Show sample leads with new fields
SELECT
  id,
  name,
  email,
  company,
  source,
  source_details,
  LEFT(referrer_url, 50) AS referrer_preview,
  created_at
FROM leads
ORDER BY created_at DESC
LIMIT 10;

-- Count leads by source and source_details
SELECT
  source,
  source_details,
  COUNT(*) AS lead_count
FROM leads
GROUP BY source, source_details
ORDER BY lead_count DESC, source;

-- Traffic source analysis (from referrer_url)
SELECT
  CASE
    WHEN referrer_url ILIKE '%google%' THEN 'Google'
    WHEN referrer_url ILIKE '%facebook%' THEN 'Facebook'
    WHEN referrer_url ILIKE '%linkedin%' THEN 'LinkedIn'
    WHEN referrer_url ILIKE '%twitter%' OR referrer_url ILIKE '%x.com%' THEN 'Twitter/X'
    WHEN referrer_url IS NULL THEN 'Direct'
    ELSE 'Other'
  END AS traffic_source,
  COUNT(*) AS leads
FROM leads
GROUP BY traffic_source
ORDER BY leads DESC;

-- Show leads with messages (inquiries)
SELECT
  name,
  email,
  company,
  LEFT(message, 100) AS message_preview,
  created_at
FROM leads
WHERE message IS NOT NULL
ORDER BY created_at DESC;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

SELECT '✅ Migration 003: Leads Refinement completed successfully!' AS status;
