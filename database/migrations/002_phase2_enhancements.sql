-- ============================================================
-- Phase 2 Database Migration
-- Created: 2025-12-09
-- Purpose: Add Phase 2 enhancements (lead management, analytics, templates)
-- ============================================================

-- ============================================================
-- 1. LEAD ENHANCEMENTS
-- ============================================================

-- Add lead assignment and tracking columns
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS duplicate_count INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS last_submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add index for assigned_to for faster filtering
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);

-- ============================================================
-- 2. LEAD NOTES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS lead_notes (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL CHECK (char_length(note_text) <= 1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_notes_created_at ON lead_notes(created_at DESC);

-- Add comment
COMMENT ON TABLE lead_notes IS 'Stores notes/comments on leads for tracking follow-ups';

-- ============================================================
-- 3. PAGE VIEWS ANALYTICS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS page_views (
  id SERIAL PRIMARY KEY,
  landing_page_id INTEGER NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  referrer TEXT,
  user_agent TEXT,
  ip_address INET,
  session_id VARCHAR(100)
);

-- Add indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_page_views_landing_page_id ON page_views(landing_page_id);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views(viewed_at DESC);

-- Add comment
COMMENT ON TABLE page_views IS 'Tracks landing page views for analytics';

-- ============================================================
-- 4. TEMPLATES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url TEXT,
  html_structure TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add comment
COMMENT ON TABLE templates IS 'Landing page templates for different layouts';

-- ============================================================
-- 5. INSERT DEFAULT TEMPLATES (BEFORE adding FK constraint)
-- ============================================================

INSERT INTO templates (id, name, description, html_structure) VALUES
(1, 'Hero + Form', 'Classic hero section with form on the right',
'<div class="template-hero-form">
  <div class="hero-content">
    <h1>{{headline}}</h1>
    <h2>{{subheading}}</h2>
    <div class="body-content">{{body}}</div>
  </div>
  <div class="form-container">
    {{form}}
  </div>
</div>'),

(2, 'Two Column', 'Image left, form right layout',
'<div class="template-two-column">
  <div class="image-section">
    <img src="{{image_url}}" alt="{{headline}}" />
  </div>
  <div class="form-section">
    <h1>{{headline}}</h1>
    <h2>{{subheading}}</h2>
    <div class="body-content">{{body}}</div>
    {{form}}
  </div>
</div>'),

(3, 'Minimal Centered', 'Centered form with minimal design',
'<div class="template-minimal">
  <div class="centered-content">
    <h1>{{headline}}</h1>
    <h2>{{subheading}}</h2>
    <div class="body-content">{{body}}</div>
    {{form}}
  </div>
</div>')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. UPDATE SEQUENCE FOR TEMPLATES
-- ============================================================

-- Set sequence to start after default templates
SELECT setval('templates_id_seq', 3, true);

-- ============================================================
-- 7. LANDING PAGE ENHANCEMENTS (AFTER templates exist)
-- ============================================================

-- Add template and form config columns
ALTER TABLE landing_pages
  ADD COLUMN IF NOT EXISTS template_id INTEGER REFERENCES templates(id) DEFAULT 1,
  ADD COLUMN IF NOT EXISTS form_config JSONB DEFAULT '{"fields": ["name", "email", "phone", "message"]}'::jsonb;

-- Add index for template_id
CREATE INDEX IF NOT EXISTS idx_landing_pages_template_id ON landing_pages(template_id);

-- ============================================================
-- Migration Complete
-- ============================================================

-- Verify migration
DO $$
BEGIN
  RAISE NOTICE 'Phase 2 migration completed successfully!';
  RAISE NOTICE '- Added lead assignment columns';
  RAISE NOTICE '- Created lead_notes table';
  RAISE NOTICE '- Created page_views table';
  RAISE NOTICE '- Created templates table with 3 default templates';
  RAISE NOTICE '- Added landing page enhancements';
END $$;
