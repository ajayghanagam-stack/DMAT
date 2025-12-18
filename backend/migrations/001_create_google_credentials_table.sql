-- Migration: Create Google OAuth Credentials Table
-- Purpose: Store Google OAuth refresh tokens for API integration
-- Phase: Phase 3 - Task 1 (Google API Setup & Authentication)
-- Created: 2025-12-16

CREATE TABLE IF NOT EXISTS google_credentials (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMP,
  scope TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_google_credentials_user_id ON google_credentials(user_id);

-- Comments for documentation
COMMENT ON TABLE google_credentials IS 'Stores Google OAuth 2.0 credentials for Search Console and Analytics API access';
COMMENT ON COLUMN google_credentials.access_token IS 'Short-lived access token (expires in 1 hour)';
COMMENT ON COLUMN google_credentials.refresh_token IS 'Long-lived refresh token for obtaining new access tokens';
COMMENT ON COLUMN google_credentials.token_expiry IS 'Timestamp when access token expires';
COMMENT ON COLUMN google_credentials.scope IS 'OAuth scopes granted (webmasters.readonly, analytics.readonly)';
