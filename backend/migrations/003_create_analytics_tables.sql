-- Migration: Create Google Analytics (GA4) Tables
-- Task 4: Google Analytics Integration
-- Tables: ga4_properties, ga4_metrics, ga4_page_views, ga4_events

-- ============================================================================
-- Table: ga4_properties
-- Purpose: Store GA4 property information for each user
-- ============================================================================
CREATE TABLE IF NOT EXISTS ga4_properties (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  property_id VARCHAR(50) NOT NULL,
  property_name VARCHAR(255),
  website_url TEXT,
  timezone VARCHAR(100),
  currency_code VARCHAR(10),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, property_id)
);

-- ============================================================================
-- Table: ga4_metrics
-- Purpose: Store daily aggregated metrics from GA4
-- ============================================================================
CREATE TABLE IF NOT EXISTS ga4_metrics (
  id SERIAL PRIMARY KEY,
  property_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  -- Traffic metrics
  users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  sessions INTEGER DEFAULT 0,
  engaged_sessions INTEGER DEFAULT 0,
  -- Engagement metrics
  engagement_rate DECIMAL(5,2),
  avg_session_duration DECIMAL(10,2),
  pages_per_session DECIMAL(10,2),
  bounce_rate DECIMAL(5,2),
  -- Conversion metrics
  conversions INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2),
  total_revenue DECIMAL(12,2),
  -- Device breakdown
  desktop_users INTEGER DEFAULT 0,
  mobile_users INTEGER DEFAULT 0,
  tablet_users INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_id, date)
);

-- ============================================================================
-- Table: ga4_page_views
-- Purpose: Store page-level performance data
-- ============================================================================
CREATE TABLE IF NOT EXISTS ga4_page_views (
  id SERIAL PRIMARY KEY,
  property_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  page_path TEXT NOT NULL,
  page_title VARCHAR(255),
  views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  avg_time_on_page DECIMAL(10,2),
  entrances INTEGER DEFAULT 0,
  exits INTEGER DEFAULT 0,
  exit_rate DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_id, date, page_path)
);

-- ============================================================================
-- Table: ga4_events
-- Purpose: Store custom events and conversions
-- ============================================================================
CREATE TABLE IF NOT EXISTS ga4_events (
  id SERIAL PRIMARY KEY,
  property_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  event_name VARCHAR(100) NOT NULL,
  event_count INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  event_value DECIMAL(12,2),
  conversion_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_id, date, event_name)
);

-- ============================================================================
-- Indexes for performance
-- ============================================================================

-- ga4_properties indexes
CREATE INDEX IF NOT EXISTS idx_ga4_properties_user_id ON ga4_properties(user_id);
CREATE INDEX IF NOT EXISTS idx_ga4_properties_property_id ON ga4_properties(property_id);

-- ga4_metrics indexes
CREATE INDEX IF NOT EXISTS idx_ga4_metrics_property_id ON ga4_metrics(property_id);
CREATE INDEX IF NOT EXISTS idx_ga4_metrics_date ON ga4_metrics(date);
CREATE INDEX IF NOT EXISTS idx_ga4_metrics_property_date ON ga4_metrics(property_id, date);

-- ga4_page_views indexes
CREATE INDEX IF NOT EXISTS idx_ga4_page_views_property_id ON ga4_page_views(property_id);
CREATE INDEX IF NOT EXISTS idx_ga4_page_views_date ON ga4_page_views(date);
CREATE INDEX IF NOT EXISTS idx_ga4_page_views_page_path ON ga4_page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_ga4_page_views_property_date ON ga4_page_views(property_id, date);

-- ga4_events indexes
CREATE INDEX IF NOT EXISTS idx_ga4_events_property_id ON ga4_events(property_id);
CREATE INDEX IF NOT EXISTS idx_ga4_events_date ON ga4_events(date);
CREATE INDEX IF NOT EXISTS idx_ga4_events_event_name ON ga4_events(event_name);
CREATE INDEX IF NOT EXISTS idx_ga4_events_property_date ON ga4_events(property_id, date);

-- ============================================================================
-- Comments for documentation
-- ============================================================================

COMMENT ON TABLE ga4_properties IS 'Stores Google Analytics 4 property information for each user';
COMMENT ON TABLE ga4_metrics IS 'Stores daily aggregated metrics from Google Analytics 4';
COMMENT ON TABLE ga4_page_views IS 'Stores page-level performance data from Google Analytics 4';
COMMENT ON TABLE ga4_events IS 'Stores custom events and conversions from Google Analytics 4';

COMMENT ON COLUMN ga4_metrics.users IS 'Total number of users (active users with at least one session)';
COMMENT ON COLUMN ga4_metrics.new_users IS 'Number of first-time users';
COMMENT ON COLUMN ga4_metrics.sessions IS 'Total number of sessions';
COMMENT ON COLUMN ga4_metrics.engaged_sessions IS 'Number of sessions that lasted longer than 10 seconds';
COMMENT ON COLUMN ga4_metrics.engagement_rate IS 'Percentage of engaged sessions';
COMMENT ON COLUMN ga4_metrics.avg_session_duration IS 'Average session duration in seconds';
COMMENT ON COLUMN ga4_metrics.bounce_rate IS 'Percentage of single-page sessions';

COMMENT ON COLUMN ga4_page_views.page_path IS 'Page path (URL path without domain)';
COMMENT ON COLUMN ga4_page_views.views IS 'Total number of page views';
COMMENT ON COLUMN ga4_page_views.unique_views IS 'Number of sessions that viewed this page';
COMMENT ON COLUMN ga4_page_views.avg_time_on_page IS 'Average time spent on this page in seconds';
COMMENT ON COLUMN ga4_page_views.exit_rate IS 'Percentage of sessions that exited from this page';

COMMENT ON COLUMN ga4_events.event_name IS 'Name of the custom event';
COMMENT ON COLUMN ga4_events.event_count IS 'Number of times the event occurred';
COMMENT ON COLUMN ga4_events.conversion_count IS 'Number of times the event was counted as a conversion';
