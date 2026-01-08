-- Migration: Create LinkedIn Integration Tables
-- Phase 4: Social Publishing (LinkedIn)
-- Tables: linkedin_oauth_tokens, linkedin_posts

-- ============================================================================
-- Table: linkedin_oauth_tokens
-- Purpose: Store LinkedIn OAuth tokens for each user
-- ============================================================================
CREATE TABLE IF NOT EXISTS linkedin_oauth_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP NOT NULL,
  scope TEXT,
  linkedin_user_id VARCHAR(255),
  linkedin_user_name VARCHAR(255),
  linkedin_user_email VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================================
-- Table: linkedin_posts
-- Purpose: Store LinkedIn post history and metadata
-- ============================================================================
CREATE TABLE IF NOT EXISTS linkedin_posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  linkedin_post_id VARCHAR(255),
  post_content TEXT NOT NULL,
  post_url TEXT,
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'published',
  linkedin_urn VARCHAR(500),
  engagement_count INTEGER DEFAULT 0,
  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, linkedin_post_id)
);

-- ============================================================================
-- Indexes for performance
-- ============================================================================

-- linkedin_oauth_tokens indexes
CREATE INDEX IF NOT EXISTS idx_linkedin_oauth_tokens_user_id ON linkedin_oauth_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_oauth_tokens_expires_at ON linkedin_oauth_tokens(expires_at);

-- linkedin_posts indexes
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_user_id ON linkedin_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_published_at ON linkedin_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_linkedin_posts_status ON linkedin_posts(status);

-- ============================================================================
-- Comments for documentation
-- ============================================================================

COMMENT ON TABLE linkedin_oauth_tokens IS 'Stores LinkedIn OAuth 2.0 access tokens for each user';
COMMENT ON TABLE linkedin_posts IS 'Stores LinkedIn post history with metadata';

COMMENT ON COLUMN linkedin_oauth_tokens.access_token IS 'OAuth 2.0 access token for LinkedIn API';
COMMENT ON COLUMN linkedin_oauth_tokens.refresh_token IS 'OAuth 2.0 refresh token for token renewal';
COMMENT ON COLUMN linkedin_oauth_tokens.expires_at IS 'Timestamp when the access token expires';
COMMENT ON COLUMN linkedin_oauth_tokens.scope IS 'OAuth scopes granted (e.g., w_member_social, r_liteprofile)';

COMMENT ON COLUMN linkedin_posts.linkedin_post_id IS 'LinkedIn post ID returned from API';
COMMENT ON COLUMN linkedin_posts.post_content IS 'The text content of the post';
COMMENT ON COLUMN linkedin_posts.post_url IS 'Public URL to view the post on LinkedIn';
COMMENT ON COLUMN linkedin_posts.linkedin_urn IS 'LinkedIn URN (Uniform Resource Name) for the post';
COMMENT ON COLUMN linkedin_posts.status IS 'Post status: published, failed, deleted';
