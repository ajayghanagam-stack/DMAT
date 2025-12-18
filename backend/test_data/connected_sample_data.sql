-- Connected Sample Data for DMAT
-- Links SEO Keywords, GA4 Analytics, and Leads to actual Landing Pages
-- Run this after loading the base sample data

-- Clear existing sample data (optional - keeps your real data intact)
-- DELETE FROM seo_keywords WHERE date >= CURRENT_DATE - INTERVAL '30 days';
-- DELETE FROM ga4_page_views WHERE date >= CURRENT_DATE - INTERVAL '3 days';

-- ============================================================================
-- SEO Keywords for Landing Page ID 4: "New Product Launch - DMAT Pro"
-- Slug: dmat-pro-launch
-- ============================================================================

-- Keywords targeting the DMAT Pro launch page
INSERT INTO seo_keywords (url, keyword, date, country, device, clicks, impressions, ctr, position) VALUES
-- Main product keyword
('/public/dmat-pro-launch', 'dmat pro features', CURRENT_DATE - INTERVAL '1 day', 'USA', 'DESKTOP', 85, 1200, 7.08, 2.3),
('/public/dmat-pro-launch', 'dmat pro features', CURRENT_DATE - INTERVAL '2 days', 'USA', 'DESKTOP', 78, 1150, 6.78, 2.5),
('/public/dmat-pro-launch', 'dmat pro features', CURRENT_DATE - INTERVAL '3 days', 'USA', 'DESKTOP', 82, 1180, 6.95, 2.4),

('/public/dmat-pro-launch', 'marketing automation pro', CURRENT_DATE - INTERVAL '1 day', 'USA', 'MOBILE', 45, 890, 5.06, 3.8),
('/public/dmat-pro-launch', 'marketing automation pro', CURRENT_DATE - INTERVAL '2 days', 'USA', 'MOBILE', 42, 850, 4.94, 4.1),

('/public/dmat-pro-launch', 'dmat professional version', CURRENT_DATE - INTERVAL '1 day', 'GBR', 'DESKTOP', 32, 420, 7.62, 1.9),
('/public/dmat-pro-launch', 'new marketing tools 2025', CURRENT_DATE - INTERVAL '1 day', 'USA', 'TABLET', 18, 280, 6.43, 3.2);

-- ============================================================================
-- SEO Keywords for Landing Page ID 10: "2025 Marketing Masterclass"
-- Slug: 2025-marketing-masterclass
-- ============================================================================

INSERT INTO seo_keywords (url, keyword, date, country, device, clicks, impressions, ctr, position) VALUES
('/public/2025-marketing-masterclass', 'marketing masterclass 2025', CURRENT_DATE - INTERVAL '1 day', 'USA', 'DESKTOP', 120, 1500, 8.00, 1.5),
('/public/2025-marketing-masterclass', 'marketing masterclass 2025', CURRENT_DATE - INTERVAL '2 days', 'USA', 'DESKTOP', 115, 1480, 7.77, 1.6),
('/public/2025-marketing-masterclass', 'marketing masterclass 2025', CURRENT_DATE - INTERVAL '3 days', 'USA', 'DESKTOP', 125, 1520, 8.22, 1.4),

('/public/2025-marketing-masterclass', 'digital marketing course', CURRENT_DATE - INTERVAL '1 day', 'USA', 'MOBILE', 68, 950, 7.16, 2.8),
('/public/2025-marketing-masterclass', 'digital marketing course', CURRENT_DATE - INTERVAL '2 days', 'USA', 'MOBILE', 65, 920, 7.07, 2.9),

('/public/2025-marketing-masterclass', 'online marketing training', CURRENT_DATE - INTERVAL '1 day', 'GBR', 'DESKTOP', 42, 580, 7.24, 2.1),
('/public/2025-marketing-masterclass', 'learn digital marketing', CURRENT_DATE - INTERVAL '1 day', 'CAN', 'MOBILE', 28, 410, 6.83, 3.5);

-- ============================================================================
-- SEO Keywords for Landing Page ID 13: "Free Marketing Guide 2025"
-- Slug: free-marketing-guide-2025-1
-- ============================================================================

INSERT INTO seo_keywords (url, keyword, date, country, device, clicks, impressions, ctr, position) VALUES
('/public/free-marketing-guide-2025-1', 'free marketing guide', CURRENT_DATE - INTERVAL '1 day', 'USA', 'DESKTOP', 95, 1100, 8.64, 1.8),
('/public/free-marketing-guide-2025-1', 'free marketing guide', CURRENT_DATE - INTERVAL '2 days', 'USA', 'DESKTOP', 90, 1080, 8.33, 1.9),
('/public/free-marketing-guide-2025-1', 'free marketing guide', CURRENT_DATE - INTERVAL '3 days', 'USA', 'DESKTOP', 98, 1120, 8.75, 1.7),

('/public/free-marketing-guide-2025-1', 'marketing ebook free download', CURRENT_DATE - INTERVAL '1 day', 'USA', 'MOBILE', 55, 720, 7.64, 2.4),
('/public/free-marketing-guide-2025-1', 'marketing ebook free download', CURRENT_DATE - INTERVAL '2 days', 'USA', 'MOBILE', 52, 700, 7.43, 2.5),

('/public/free-marketing-guide-2025-1', 'digital marketing pdf', CURRENT_DATE - INTERVAL '1 day', 'GBR', 'DESKTOP', 38, 510, 7.45, 2.7);

-- ============================================================================
-- SEO Keywords for Landing Page ID 15: "Free Marketing campaign Dec 2025"
-- Slug: free-marketing-campaign-dec-2025
-- ============================================================================

INSERT INTO seo_keywords (url, keyword, date, country, device, clicks, impressions, ctr, position) VALUES
('/public/free-marketing-campaign-dec-2025', 'marketing campaign templates', CURRENT_DATE - INTERVAL '1 day', 'USA', 'DESKTOP', 72, 980, 7.35, 2.2),
('/public/free-marketing-campaign-dec-2025', 'marketing campaign templates', CURRENT_DATE - INTERVAL '2 days', 'USA', 'DESKTOP', 68, 950, 7.16, 2.3),

('/public/free-marketing-campaign-dec-2025', 'campaign planning tools', CURRENT_DATE - INTERVAL '1 day', 'USA', 'MOBILE', 44, 650, 6.77, 3.1),
('/public/free-marketing-campaign-dec-2025', 'free campaign resources', CURRENT_DATE - INTERVAL '1 day', 'GBR', 'DESKTOP', 29, 390, 7.44, 2.8);

-- ============================================================================
-- GA4 Page Views - Connected to Landing Pages
-- Property: DMAT Application (properties/456789012)
-- ============================================================================

INSERT INTO ga4_page_views (property_id, date, page_path, page_title, views, unique_views, avg_time_on_page, entrances, exits, exit_rate) VALUES
-- DMAT Pro Launch page
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', '/public/dmat-pro-launch', 'New Product Launch - DMAT Pro', 450, 380, 95.5, 420, 85, 18.89),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', '/public/dmat-pro-launch', 'New Product Launch - DMAT Pro', 425, 360, 92.3, 400, 80, 18.82),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', '/public/dmat-pro-launch', 'New Product Launch - DMAT Pro', 440, 370, 94.1, 410, 82, 18.64),

-- Marketing Masterclass page
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', '/public/2025-marketing-masterclass', '2025 Marketing Masterclass', 620, 520, 135.8, 580, 75, 12.10),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', '/public/2025-marketing-masterclass', '2025 Marketing Masterclass', 600, 500, 132.4, 560, 72, 12.00),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', '/public/2025-marketing-masterclass', '2025 Marketing Masterclass', 630, 530, 138.2, 590, 78, 12.38),

-- Free Marketing Guide page
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', '/public/free-marketing-guide-2025-1', 'Free Marketing Guide 2025', 520, 440, 88.6, 490, 95, 18.27),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', '/public/free-marketing-guide-2025-1', 'Free Marketing Guide 2025', 500, 420, 85.3, 470, 90, 18.00),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', '/public/free-marketing-guide-2025-1', 'Free Marketing Guide 2025', 530, 450, 90.2, 500, 98, 18.49),

-- Marketing Campaign Dec page
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', '/public/free-marketing-campaign-dec-2025', 'Free Marketing campaign Dec 2025', 385, 320, 78.4, 360, 88, 22.86),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', '/public/free-marketing-campaign-dec-2025', 'Free Marketing campaign Dec 2025', 370, 310, 75.9, 345, 85, 22.97),

-- Test page (less traffic)
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', '/public/test-page', 'Updated Test Page', 180, 155, 62.3, 165, 42, 23.33),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', '/public/test-page', 'Updated Test Page', 175, 150, 60.8, 160, 40, 22.86);

-- ============================================================================
-- Sample Leads - Connected to Landing Pages
-- ============================================================================

-- Leads for DMAT Pro Launch (Landing Page ID 4)
INSERT INTO leads (email, name, phone, landing_page_id, company, message, status, created_at) VALUES
('john.smith@example.com', 'John Smith', '+1-555-0101', 4, 'Tech Corp', 'Interested in DMAT Pro features', 'new', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
('sarah.jones@example.com', 'Sarah Jones', '+1-555-0102', 4, 'Marketing Inc', 'Would like to learn about Pro Features', 'contacted', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('mike.wilson@example.com', 'Mike Wilson', NULL, 4, NULL, 'Requesting DMAT Pro Trial', 'new', CURRENT_TIMESTAMP - INTERVAL '5 hours'),
('emma.brown@example.com', 'Emma Brown', '+1-555-0103', 4, 'StartupXYZ', 'Exploring DMAT Pro for our team', 'qualified', CURRENT_TIMESTAMP - INTERVAL '1 day'),

-- Leads for Marketing Masterclass (Landing Page ID 10)
('david.miller@example.com', 'David Miller', '+1-555-0104', 10, NULL, 'Sign up for Digital Marketing Course', 'new', CURRENT_TIMESTAMP - INTERVAL '30 minutes'),
('lisa.garcia@example.com', 'Lisa Garcia', '+1-555-0105', 10, 'Agency Partners', 'Marketing Manager looking for training', 'contacted', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
('james.martinez@example.com', 'James Martinez', NULL, 10, NULL, 'Interested in Masterclass 2025', 'new', CURRENT_TIMESTAMP - INTERVAL '6 hours'),
('anna.lopez@example.com', 'Anna Lopez', '+1-555-0106', 10, 'Digital Solutions', 'Team training inquiry', 'new', CURRENT_TIMESTAMP - INTERVAL '8 hours'),
('chris.anderson@example.com', 'Chris Anderson', '+1-555-0107', 10, NULL, 'Online Training for marketing skills', 'qualified', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('jennifer.taylor@example.com', 'Jennifer Taylor', NULL, 10, NULL, 'Marketing Director - signed up', 'converted', CURRENT_TIMESTAMP - INTERVAL '2 days'),

-- Leads for Free Marketing Guide (Landing Page ID 13)
('robert.thomas@example.com', 'Robert Thomas', '+1-555-0108', 13, NULL, 'Download Marketing Guide PDF', 'new', CURRENT_TIMESTAMP - INTERVAL '45 minutes'),
('maria.hernandez@example.com', 'Maria Hernandez', '+1-555-0109', 13, 'Growth Co', 'Requesting free guide', 'new', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('william.moore@example.com', 'William Moore', NULL, 13, NULL, 'Looking for Free Resources', 'contacted', CURRENT_TIMESTAMP - INTERVAL '4 hours'),
('patricia.martin@example.com', 'Patricia Martin', '+1-555-0110', 13, 'Marketing Pros', 'Guide download request', 'new', CURRENT_TIMESTAMP - INTERVAL '7 hours'),

-- Leads for Marketing Campaign Dec (Landing Page ID 15)
('richard.jackson@example.com', 'Richard Jackson', '+1-555-0111', 15, NULL, 'Interested in Campaign Templates', 'new', CURRENT_TIMESTAMP - INTERVAL '1.5 hours'),
('linda.white@example.com', 'Linda White', '+1-555-0112', 15, 'Campaign Masters', 'Requesting campaign resources', 'contacted', CURRENT_TIMESTAMP - INTERVAL '5 hours'),
('charles.harris@example.com', 'Charles Harris', NULL, 15, NULL, 'Download Campaign Resources', 'new', CURRENT_TIMESTAMP - INTERVAL '9 hours');

-- Summary of connected sample data
-- Landing Page ID 4 (DMAT Pro): 4 keywords groups, 3 days page views, 4 leads
-- Landing Page ID 10 (Masterclass): 4 keywords groups, 3 days page views, 6 leads
-- Landing Page ID 13 (Marketing Guide): 3 keywords groups, 3 days page views, 4 leads
-- Landing Page ID 15 (Campaign Dec): 2 keywords groups, 2 days page views, 3 leads
-- Landing Page ID 5 (Test Page): 0 keywords, 2 days page views, 0 leads (shows variety)
-- Landing Page ID 17: No data (shows pages without traffic yet)
