-- ============================================================================
-- SAMPLE DATA: Google Search Console Keywords
-- Purpose: Test data for keyword performance syncing and analytics
-- Tables: seo_keywords, seo_indexing_issues
-- ============================================================================

-- Clear existing test data (optional)
TRUNCATE TABLE seo_keywords CASCADE;
TRUNCATE TABLE seo_indexing_issues CASCADE;

-- ============================================================================
-- HIGH PERFORMING KEYWORDS
-- ============================================================================

-- Keyword 1: "digital marketing automation" - Trending UP (last 7 days, Desktop)
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('digital marketing automation', 'https://example.com/blog/marketing-automation', 1250, 125, 10.00, 3.5, CURRENT_DATE - INTERVAL '1 day', 'USA', 'DESKTOP'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 1180, 110, 9.32, 3.8, CURRENT_DATE - INTERVAL '2 days', 'USA', 'DESKTOP'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 1120, 98, 8.75, 4.2, CURRENT_DATE - INTERVAL '3 days', 'USA', 'DESKTOP'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 1080, 86, 7.96, 4.5, CURRENT_DATE - INTERVAL '4 days', 'USA', 'DESKTOP'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 1050, 78, 7.43, 5.1, CURRENT_DATE - INTERVAL '5 days', 'USA', 'DESKTOP'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 980, 68, 6.94, 5.8, CURRENT_DATE - INTERVAL '6 days', 'USA', 'DESKTOP'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 920, 62, 6.74, 6.2, CURRENT_DATE - INTERVAL '7 days', 'USA', 'DESKTOP');

-- Keyword 1: Mobile data
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('digital marketing automation', 'https://example.com/blog/marketing-automation', 850, 68, 8.00, 4.2, CURRENT_DATE - INTERVAL '1 day', 'USA', 'MOBILE'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 820, 62, 7.56, 4.5, CURRENT_DATE - INTERVAL '2 days', 'USA', 'MOBILE'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 780, 54, 6.92, 5.0, CURRENT_DATE - INTERVAL '3 days', 'USA', 'MOBILE'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 750, 48, 6.40, 5.5, CURRENT_DATE - INTERVAL '4 days', 'USA', 'MOBILE'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 720, 43, 5.97, 6.0, CURRENT_DATE - INTERVAL '5 days', 'USA', 'MOBILE');

-- Keyword 2: "landing page builder" - STABLE performance (Desktop)
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('landing page builder', 'https://example.com/features/landing-pages', 2400, 240, 10.00, 2.1, CURRENT_DATE - INTERVAL '1 day', 'USA', 'DESKTOP'),
('landing page builder', 'https://example.com/features/landing-pages', 2380, 238, 10.00, 2.0, CURRENT_DATE - INTERVAL '2 days', 'USA', 'DESKTOP'),
('landing page builder', 'https://example.com/features/landing-pages', 2420, 242, 10.00, 2.2, CURRENT_DATE - INTERVAL '3 days', 'USA', 'DESKTOP'),
('landing page builder', 'https://example.com/features/landing-pages', 2390, 236, 9.87, 2.1, CURRENT_DATE - INTERVAL '4 days', 'USA', 'DESKTOP'),
('landing page builder', 'https://example.com/features/landing-pages', 2410, 245, 10.17, 1.9, CURRENT_DATE - INTERVAL '5 days', 'USA', 'DESKTOP');

-- Keyword 2: Mobile data
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('landing page builder', 'https://example.com/features/landing-pages', 1800, 162, 9.00, 2.5, CURRENT_DATE - INTERVAL '1 day', 'USA', 'MOBILE'),
('landing page builder', 'https://example.com/features/landing-pages', 1820, 164, 9.01, 2.4, CURRENT_DATE - INTERVAL '2 days', 'USA', 'MOBILE'),
('landing page builder', 'https://example.com/features/landing-pages', 1790, 160, 8.94, 2.6, CURRENT_DATE - INTERVAL '3 days', 'USA', 'MOBILE'),
('landing page builder', 'https://example.com/features/landing-pages', 1810, 163, 9.01, 2.5, CURRENT_DATE - INTERVAL '4 days', 'USA', 'MOBILE');

-- ============================================================================
-- MEDIUM PERFORMING KEYWORDS
-- ============================================================================

-- Keyword 3: "lead generation software" - Trending SLIGHTLY DOWN (Desktop)
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('lead generation software', 'https://example.com/features/lead-management', 1500, 75, 5.00, 8.5, CURRENT_DATE - INTERVAL '1 day', 'USA', 'DESKTOP'),
('lead generation software', 'https://example.com/features/lead-management', 1480, 78, 5.27, 8.2, CURRENT_DATE - INTERVAL '2 days', 'USA', 'DESKTOP'),
('lead generation software', 'https://example.com/features/lead-management', 1520, 80, 5.26, 7.8, CURRENT_DATE - INTERVAL '3 days', 'USA', 'DESKTOP'),
('lead generation software', 'https://example.com/features/lead-management', 1510, 83, 5.50, 7.5, CURRENT_DATE - INTERVAL '4 days', 'USA', 'DESKTOP');

-- Keyword 3: Mobile data
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('lead generation software', 'https://example.com/features/lead-management', 1100, 55, 5.00, 9.0, CURRENT_DATE - INTERVAL '1 day', 'USA', 'MOBILE'),
('lead generation software', 'https://example.com/features/lead-management', 1120, 57, 5.09, 8.8, CURRENT_DATE - INTERVAL '2 days', 'USA', 'MOBILE'),
('lead generation software', 'https://example.com/features/lead-management', 1090, 58, 5.32, 8.5, CURRENT_DATE - INTERVAL '3 days', 'USA', 'MOBILE');

-- Keyword 4: "SEO tools for small business" (Desktop)
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('seo tools for small business', 'https://example.com/features/seo-engine', 980, 59, 6.02, 7.5, CURRENT_DATE - INTERVAL '1 day', 'USA', 'DESKTOP'),
('seo tools for small business', 'https://example.com/features/seo-engine', 1020, 61, 5.98, 7.6, CURRENT_DATE - INTERVAL '2 days', 'USA', 'DESKTOP'),
('seo tools for small business', 'https://example.com/features/seo-engine', 990, 60, 6.06, 7.4, CURRENT_DATE - INTERVAL '3 days', 'USA', 'DESKTOP');

-- Keyword 4: Mobile data
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('seo tools for small business', 'https://example.com/features/seo-engine', 650, 36, 5.54, 8.2, CURRENT_DATE - INTERVAL '1 day', 'USA', 'MOBILE'),
('seo tools for small business', 'https://example.com/features/seo-engine', 670, 38, 5.67, 8.0, CURRENT_DATE - INTERVAL '2 days', 'USA', 'MOBILE');

-- ============================================================================
-- LONG-TAIL KEYWORDS (High conversion)
-- ============================================================================

-- Keyword 5: "how to create landing page for lead generation" (Desktop)
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('how to create landing page for lead generation', 'https://example.com/blog/landing-page-guide', 320, 48, 15.00, 4.2, CURRENT_DATE - INTERVAL '1 day', 'USA', 'DESKTOP'),
('how to create landing page for lead generation', 'https://example.com/blog/landing-page-guide', 310, 46, 14.84, 4.5, CURRENT_DATE - INTERVAL '2 days', 'USA', 'DESKTOP'),
('how to create landing page for lead generation', 'https://example.com/blog/landing-page-guide', 330, 50, 15.15, 4.0, CURRENT_DATE - INTERVAL '3 days', 'USA', 'DESKTOP');

-- Keyword 5: Mobile data
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('how to create landing page for lead generation', 'https://example.com/blog/landing-page-guide', 280, 39, 13.93, 5.0, CURRENT_DATE - INTERVAL '1 day', 'USA', 'MOBILE'),
('how to create landing page for lead generation', 'https://example.com/blog/landing-page-guide', 270, 38, 14.07, 4.8, CURRENT_DATE - INTERVAL '2 days', 'USA', 'MOBILE');

-- ============================================================================
-- BRAND KEYWORDS (Very high CTR)
-- ============================================================================

-- Keyword 6: "DMAT" (Brand keyword, Desktop)
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('DMAT', 'https://example.com/', 450, 405, 90.00, 1.0, CURRENT_DATE - INTERVAL '1 day', 'USA', 'DESKTOP'),
('DMAT', 'https://example.com/', 460, 412, 89.57, 1.0, CURRENT_DATE - INTERVAL '2 days', 'USA', 'DESKTOP'),
('DMAT', 'https://example.com/', 440, 396, 90.00, 1.0, CURRENT_DATE - INTERVAL '3 days', 'USA', 'DESKTOP');

-- Keyword 6: Mobile data
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('DMAT', 'https://example.com/', 350, 308, 88.00, 1.0, CURRENT_DATE - INTERVAL '1 day', 'USA', 'MOBILE'),
('DMAT', 'https://example.com/', 360, 316, 87.78, 1.0, CURRENT_DATE - INTERVAL '2 days', 'USA', 'MOBILE');

-- ============================================================================
-- INTERNATIONAL KEYWORDS
-- ============================================================================

-- UK Keywords
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('landing page builder', 'https://example.com/features/landing-pages', 580, 52, 8.97, 3.2, CURRENT_DATE - INTERVAL '1 day', 'GBR', 'DESKTOP'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 420, 38, 9.05, 4.5, CURRENT_DATE - INTERVAL '1 day', 'GBR', 'DESKTOP'),
('lead generation software', 'https://example.com/features/lead-management', 350, 21, 6.00, 8.0, CURRENT_DATE - INTERVAL '1 day', 'GBR', 'DESKTOP');

-- Canada Keywords
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('landing page builder', 'https://example.com/features/landing-pages', 380, 34, 8.95, 3.5, CURRENT_DATE - INTERVAL '1 day', 'CAN', 'DESKTOP'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 290, 26, 8.97, 4.8, CURRENT_DATE - INTERVAL '1 day', 'CAN', 'DESKTOP');

-- Australia Keywords
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('landing page builder', 'https://example.com/features/landing-pages', 280, 25, 8.93, 3.8, CURRENT_DATE - INTERVAL '1 day', 'AUS', 'DESKTOP'),
('seo tools for small business', 'https://example.com/features/seo-engine', 190, 11, 5.79, 7.8, CURRENT_DATE - INTERVAL '1 day', 'AUS', 'DESKTOP');

-- ============================================================================
-- TABLET DEVICE DATA
-- ============================================================================

INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('landing page builder', 'https://example.com/features/landing-pages', 320, 28, 8.75, 2.8, CURRENT_DATE - INTERVAL '1 day', 'USA', 'TABLET'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 240, 19, 7.92, 4.0, CURRENT_DATE - INTERVAL '1 day', 'USA', 'TABLET'),
('lead generation software', 'https://example.com/features/lead-management', 180, 9, 5.00, 9.2, CURRENT_DATE - INTERVAL '1 day', 'USA', 'TABLET'),
('DMAT', 'https://example.com/', 80, 70, 87.50, 1.0, CURRENT_DATE - INTERVAL '1 day', 'USA', 'TABLET');

-- ============================================================================
-- HISTORICAL DATA (30 day trend)
-- ============================================================================

-- Digital marketing automation - showing improvement over 30 days
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('digital marketing automation', 'https://example.com/blog/marketing-automation', 650, 39, 6.00, 8.5, CURRENT_DATE - INTERVAL '30 days', 'USA', 'DESKTOP'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 680, 44, 6.47, 8.0, CURRENT_DATE - INTERVAL '25 days', 'USA', 'DESKTOP'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 720, 50, 6.94, 7.5, CURRENT_DATE - INTERVAL '20 days', 'USA', 'DESKTOP'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 780, 58, 7.44, 7.0, CURRENT_DATE - INTERVAL '15 days', 'USA', 'DESKTOP'),
('digital marketing automation', 'https://example.com/blog/marketing-automation', 850, 68, 8.00, 6.5, CURRENT_DATE - INTERVAL '10 days', 'USA', 'DESKTOP');

-- Landing page builder - showing stability over 30 days
INSERT INTO seo_keywords (keyword, url, impressions, clicks, ctr, position, date, country, device) VALUES
('landing page builder', 'https://example.com/features/landing-pages', 2350, 235, 10.00, 2.1, CURRENT_DATE - INTERVAL '30 days', 'USA', 'DESKTOP'),
('landing page builder', 'https://example.com/features/landing-pages', 2380, 238, 10.00, 2.0, CURRENT_DATE - INTERVAL '25 days', 'USA', 'DESKTOP'),
('landing page builder', 'https://example.com/features/landing-pages', 2400, 240, 10.00, 2.2, CURRENT_DATE - INTERVAL '20 days', 'USA', 'DESKTOP'),
('landing page builder', 'https://example.com/features/landing-pages', 2390, 239, 10.00, 2.1, CURRENT_DATE - INTERVAL '15 days', 'USA', 'DESKTOP'),
('landing page builder', 'https://example.com/features/landing-pages', 2410, 241, 10.00, 2.0, CURRENT_DATE - INTERVAL '10 days', 'USA', 'DESKTOP');

-- ============================================================================
-- SEO INDEXING ISSUES
-- ============================================================================

INSERT INTO seo_indexing_issues (url, issue_type, severity, description, detected_date, resolved_date, status) VALUES
('https://example.com/old-product-page', 'NOT_FOUND', 'critical', '404 error - page not found. Should redirect to new URL.', CURRENT_DATE - INTERVAL '5 days', NULL, 'open'),
('https://example.com/blog/draft-post', 'NOINDEX', 'warning', 'Page has noindex meta tag preventing indexing.', CURRENT_DATE - INTERVAL '3 days', NULL, 'open'),
('https://example.com/api/endpoint', 'ROBOTS_TXT_BLOCKED', 'info', 'Blocked by robots.txt (intentional for API endpoints).', CURRENT_DATE - INTERVAL '10 days', NULL, 'open'),
('https://example.com/slow-page', 'SERVER_ERROR', 'critical', 'Intermittent 500 errors causing indexing failures.', CURRENT_DATE - INTERVAL '2 days', NULL, 'in_progress'),
('https://example.com/old-blog-post', 'REDIRECT', 'warning', 'Redirect chain detected (301 -> 301). Fixed to single redirect.', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE - INTERVAL '10 days', 'resolved'),
('https://example.com/duplicate-content', 'SOFT_404', 'warning', 'Thin content page detected. Content expanded and improved.', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '12 days', 'resolved'),
('https://example.com/missing-canonical', 'DUPLICATE', 'warning', 'Duplicate content without canonical tag. Tag added.', CURRENT_DATE - INTERVAL '25 days', CURRENT_DATE - INTERVAL '18 days', 'resolved');

-- ============================================================================
-- END OF SAMPLE DATA
-- Total: ~65 keyword records, 7 indexing issues
-- ============================================================================
