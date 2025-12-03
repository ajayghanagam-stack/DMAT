-- ============================================================================
-- DMAT - Landing Pages Extension for Phase 1
-- Migration: 002_extend_landing_pages.sql
-- Description: Adds Phase 1 content, form, and publishing fields
-- Author: DMAT Team
-- Date: 2025-12-03
-- Dependencies: 001_create_core_tables.sql
-- ============================================================================

-- ============================================================================
-- 1. ADD BASIC CONTENT FIELDS
-- ============================================================================

-- Add headline field
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS headline VARCHAR(500);

COMMENT ON COLUMN landing_pages.headline IS 'Main headline/H1 text displayed at top of landing page';

-- Add subheading field
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS subheading VARCHAR(1000);

COMMENT ON COLUMN landing_pages.subheading IS 'Supporting subheading/H2 text below headline';

-- Add body_text field
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS body_text TEXT;

COMMENT ON COLUMN landing_pages.body_text IS 'Main body content (plain text or simple HTML)';

-- Add cta_text field
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS cta_text VARCHAR(100) DEFAULT 'Submit';

COMMENT ON COLUMN landing_pages.cta_text IS 'Call-to-action button text';

-- Add hero_image_url field
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS hero_image_url VARCHAR(2048);

COMMENT ON COLUMN landing_pages.hero_image_url IS 'URL to hero/banner image for the landing page';

-- ============================================================================
-- 2. ADD FORM CONFIGURATION FIELD
-- ============================================================================

-- Add form_fields JSON configuration
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS form_fields JSONB NOT NULL DEFAULT '{
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
}'::jsonb;

COMMENT ON COLUMN landing_pages.form_fields IS 'JSONB configuration of form fields to display on landing page';

-- ============================================================================
-- 3. ADD PUBLISHING METADATA FIELDS
-- ============================================================================

-- Add publish_status field
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS publish_status VARCHAR(50) NOT NULL DEFAULT 'draft';

-- Add constraint for publish_status
ALTER TABLE landing_pages
ADD CONSTRAINT landing_pages_publish_status_check
CHECK (publish_status IN ('draft', 'published', 'unpublished', 'scheduled'));

COMMENT ON COLUMN landing_pages.publish_status IS 'Current publishing status: draft, published, unpublished, or scheduled';

-- Add published_url field
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS published_url VARCHAR(2048);

COMMENT ON COLUMN landing_pages.published_url IS 'Full URL where page is publicly accessible (WordPress URL or DMAT URL)';

-- Add published_at field
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP;

COMMENT ON COLUMN landing_pages.published_at IS 'Timestamp when page was first published (NULL if never published)';

-- ============================================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index on publish_status for filtering published pages
CREATE INDEX IF NOT EXISTS idx_landing_pages_publish_status
ON landing_pages(publish_status);

-- Index on published_at for chronological sorting
CREATE INDEX IF NOT EXISTS idx_landing_pages_published_at
ON landing_pages(published_at DESC NULLS LAST);

-- GIN index on form_fields for JSONB queries (if needed in future)
CREATE INDEX IF NOT EXISTS idx_landing_pages_form_fields
ON landing_pages USING gin(form_fields);

-- ============================================================================
-- 5. UPDATE EXISTING ROWS (IF ANY)
-- ============================================================================

-- Set default publish_status based on existing status field
UPDATE landing_pages
SET publish_status = status
WHERE publish_status = 'draft'
  AND status IN ('draft', 'published', 'archived');

-- For any existing published pages, set published_at to created_at
UPDATE landing_pages
SET published_at = created_at
WHERE publish_status = 'published'
  AND published_at IS NULL;

-- ============================================================================
-- 6. INSERT SAMPLE DATA FOR TESTING
-- ============================================================================

-- Sample Landing Page 1: Marketing Guide (Full fields)
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
  created_by,
  created_at
) VALUES (
  'Free Digital Marketing Guide 2025',
  'free-marketing-guide-2025',
  'Download Your Free Digital Marketing Guide',
  'Learn the latest strategies that drive results in 2025',
  'Our comprehensive 50-page guide covers SEO, social media, content marketing, email campaigns, and analytics. Join over 10,000 marketers who have already downloaded this valuable resource and transformed their marketing results!',
  'Get Your Free Guide',
  'https://via.placeholder.com/1200x600/4A90E2/ffffff?text=Marketing+Guide+2025',
  '{
    "fields": [
      {
        "name": "name",
        "label": "Full Name",
        "type": "text",
        "required": true,
        "placeholder": "John Doe"
      },
      {
        "name": "email",
        "label": "Work Email",
        "type": "email",
        "required": true,
        "placeholder": "john@company.com"
      },
      {
        "name": "company",
        "label": "Company Name",
        "type": "text",
        "required": false,
        "placeholder": "Acme Inc"
      }
    ]
  }'::jsonb,
  'draft',
  1,
  CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO NOTHING;

-- Sample Landing Page 2: Webinar Registration (Minimal fields)
INSERT INTO landing_pages (
  title,
  slug,
  headline,
  body_text,
  cta_text,
  publish_status,
  created_by,
  created_at
) VALUES (
  'Webinar: AI in Marketing',
  'webinar-ai-marketing-jan-2025',
  'Join Our Free Webinar: AI-Powered Marketing Automation',
  'January 15, 2025 at 2:00 PM EST. Discover how AI is transforming digital marketing. Our expert panel will share real-world case studies and actionable insights you can implement immediately.',
  'Reserve My Spot',
  'draft',
  1,
  CURRENT_TIMESTAMP
)
ON CONFLICT (slug) DO NOTHING;

-- Sample Landing Page 3: Product Launch (Published)
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
  published_url,
  published_at,
  created_by,
  created_at
) VALUES (
  'New Product Launch - DMAT Pro',
  'dmat-pro-launch',
  'Introducing DMAT Pro',
  'The complete marketing automation solution for enterprises',
  'DMAT Pro combines landing pages, social media automation, lead management, and analytics in one powerful platform. Early bird pricing available for the first 100 customers!',
  'Get Early Access',
  'https://via.placeholder.com/1200x600/2ECC71/ffffff?text=DMAT+Pro',
  '{
    "fields": [
      {
        "name": "name",
        "label": "Your Name",
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
        "required": true,
        "placeholder": "+1 (555) 000-0000"
      }
    ]
  }'::jsonb,
  'published',
  'https://innovateelectronics.com/lp/dmat-pro-launch',
  CURRENT_TIMESTAMP - INTERVAL '3 days',
  1,
  CURRENT_TIMESTAMP - INTERVAL '5 days'
)
ON CONFLICT (slug) DO NOTHING;

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
ORDER BY ordinal_position;

-- Verify indexes created
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'landing_pages'
  AND indexname LIKE 'idx_landing_pages_%'
ORDER BY indexname;

-- Show sample landing pages
SELECT
  id,
  title,
  slug,
  headline,
  publish_status,
  published_at,
  created_at
FROM landing_pages
ORDER BY created_at DESC
LIMIT 5;

-- Verify form_fields structure
SELECT
  id,
  title,
  jsonb_pretty(form_fields) AS form_configuration
FROM landing_pages
WHERE form_fields IS NOT NULL
LIMIT 3;

-- Count landing pages by publish status
SELECT
  publish_status,
  COUNT(*) AS page_count
FROM landing_pages
GROUP BY publish_status
ORDER BY page_count DESC;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================

SELECT '✅ Migration 002: Landing Pages Extension completed successfully!' AS status;
