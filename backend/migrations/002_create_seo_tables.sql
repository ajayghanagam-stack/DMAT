-- Migration: Create SEO Engine Tables
-- Task 3: Google Search Console Integration
-- Tables: seo_keywords, seo_indexing_issues

-- ============================================================================
-- Table: seo_keywords
-- Purpose: Store keyword performance data from Google Search Console
-- ============================================================================
CREATE TABLE IF NOT EXISTS seo_keywords (
  id SERIAL PRIMARY KEY,
  keyword TEXT NOT NULL,
  url TEXT,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5,2),
  position DECIMAL(5,2),
  date DATE NOT NULL,
  country VARCHAR(10),
  device VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(keyword, url, date, country, device)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_keywords_date ON seo_keywords(date);
CREATE INDEX IF NOT EXISTS idx_keywords_keyword ON seo_keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_keywords_url ON seo_keywords(url);
CREATE INDEX IF NOT EXISTS idx_keywords_date_keyword ON seo_keywords(date, keyword);

-- ============================================================================
-- Table: seo_indexing_issues
-- Purpose: Store indexing issues detected by Google Search Console
-- ============================================================================
CREATE TABLE IF NOT EXISTS seo_indexing_issues (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  issue_type VARCHAR(100),
  severity VARCHAR(20),
  description TEXT,
  detected_date DATE,
  resolved_date DATE,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_issues_status ON seo_indexing_issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_url ON seo_indexing_issues(url);
CREATE INDEX IF NOT EXISTS idx_issues_severity ON seo_indexing_issues(severity);
CREATE INDEX IF NOT EXISTS idx_issues_detected_date ON seo_indexing_issues(detected_date);

-- Add comments for documentation
COMMENT ON TABLE seo_keywords IS 'Stores keyword performance metrics from Google Search Console';
COMMENT ON TABLE seo_indexing_issues IS 'Stores indexing issues and errors detected by Google Search Console';

COMMENT ON COLUMN seo_keywords.keyword IS 'Search query/keyword';
COMMENT ON COLUMN seo_keywords.url IS 'Landing page URL for this keyword';
COMMENT ON COLUMN seo_keywords.impressions IS 'Number of times URL appeared in search results';
COMMENT ON COLUMN seo_keywords.clicks IS 'Number of clicks from search results';
COMMENT ON COLUMN seo_keywords.ctr IS 'Click-through rate (clicks/impressions * 100)';
COMMENT ON COLUMN seo_keywords.position IS 'Average ranking position in search results';
COMMENT ON COLUMN seo_keywords.country IS 'Country code (e.g., USA, GBR)';
COMMENT ON COLUMN seo_keywords.device IS 'Device type (DESKTOP, MOBILE, TABLET)';

COMMENT ON COLUMN seo_indexing_issues.issue_type IS 'Type of indexing issue (e.g., NOT_FOUND, SERVER_ERROR, REDIRECT)';
COMMENT ON COLUMN seo_indexing_issues.severity IS 'Severity level (critical, warning, info)';
COMMENT ON COLUMN seo_indexing_issues.status IS 'Issue status (open, in_progress, resolved)';
