-- Sample GA4 Analytics Data
-- This file contains realistic sample data for testing Google Analytics integration
-- Includes: Daily metrics, page views, and events for the last 30 days

-- Note: This data uses the GA4 property added via the UI
-- Property ID format: properties/456789012 or similar

-- ============================================================================
-- Daily Metrics (ga4_metrics)
-- Realistic traffic patterns with growth trend
-- ============================================================================

-- Week 4 (Most recent - 7 days ago to today)
-- Growing traffic, good engagement
INSERT INTO ga4_metrics (property_id, date, users, new_users, sessions, engaged_sessions, engagement_rate, avg_session_duration, pages_per_session, bounce_rate, conversions, conversion_rate, total_revenue, desktop_users, mobile_users, tablet_users) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 892, 234, 1245, 987, 79.28, 185.50, 3.8, 42.10, 23, 1.85, 1150.00, 445, 378, 69),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 856, 221, 1198, 945, 78.88, 178.20, 3.7, 43.50, 21, 1.75, 1050.00, 428, 364, 64),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 923, 245, 1289, 1034, 80.22, 192.30, 4.1, 40.80, 26, 2.02, 1300.00, 461, 391, 71),
('properties/456789012', CURRENT_DATE - INTERVAL '4 days', 878, 228, 1223, 978, 79.97, 186.75, 3.9, 41.90, 24, 1.96, 1200.00, 439, 373, 66),
('properties/456789012', CURRENT_DATE - INTERVAL '5 days', 834, 215, 1167, 925, 79.26, 181.40, 3.6, 43.20, 22, 1.88, 1100.00, 417, 354, 63),
('properties/456789012', CURRENT_DATE - INTERVAL '6 days', 901, 238, 1256, 1005, 80.01, 189.60, 4.0, 41.20, 25, 1.99, 1250.00, 450, 382, 69),
('properties/456789012', CURRENT_DATE - INTERVAL '7 days', 867, 224, 1209, 965, 79.82, 183.90, 3.8, 42.30, 23, 1.90, 1150.00, 433, 368, 66);

-- Week 3 (8-14 days ago)
-- Moderate traffic
INSERT INTO ga4_metrics (property_id, date, users, new_users, sessions, engaged_sessions, engagement_rate, avg_session_duration, pages_per_session, bounce_rate, conversions, conversion_rate, total_revenue, desktop_users, mobile_users, tablet_users) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '8 days', 812, 209, 1134, 898, 79.19, 176.50, 3.5, 44.10, 20, 1.76, 1000.00, 406, 345, 61),
('properties/456789012', CURRENT_DATE - INTERVAL '9 days', 789, 203, 1101, 872, 79.20, 172.80, 3.4, 44.80, 19, 1.73, 950.00, 394, 335, 60),
('properties/456789012', CURRENT_DATE - INTERVAL '10 days', 845, 218, 1178, 934, 79.29, 180.20, 3.6, 43.50, 21, 1.78, 1050.00, 422, 359, 64),
('properties/456789012', CURRENT_DATE - INTERVAL '11 days', 798, 206, 1113, 882, 79.24, 174.60, 3.5, 44.30, 20, 1.80, 1000.00, 399, 339, 60),
('properties/456789012', CURRENT_DATE - INTERVAL '12 days', 823, 212, 1148, 909, 79.18, 177.90, 3.5, 43.90, 20, 1.74, 1000.00, 411, 350, 62),
('properties/456789012', CURRENT_DATE - INTERVAL '13 days', 856, 221, 1195, 947, 79.25, 181.50, 3.7, 43.20, 21, 1.76, 1050.00, 428, 364, 64),
('properties/456789012', CURRENT_DATE - INTERVAL '14 days', 834, 215, 1165, 923, 79.23, 178.30, 3.6, 43.70, 21, 1.80, 1050.00, 417, 354, 63);

-- Week 2 (15-21 days ago)
-- Lower traffic
INSERT INTO ga4_metrics (property_id, date, users, new_users, sessions, engaged_sessions, engagement_rate, avg_session_duration, pages_per_session, bounce_rate, conversions, conversion_rate, total_revenue, desktop_users, mobile_users, tablet_users) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '15 days', 756, 195, 1056, 836, 79.17, 168.90, 3.3, 45.20, 18, 1.70, 900.00, 378, 321, 57),
('properties/456789012', CURRENT_DATE - INTERVAL '16 days', 734, 189, 1024, 811, 79.20, 165.70, 3.2, 45.60, 17, 1.66, 850.00, 367, 312, 55),
('properties/456789012', CURRENT_DATE - INTERVAL '17 days', 778, 200, 1086, 860, 79.19, 171.40, 3.4, 44.90, 19, 1.75, 950.00, 389, 330, 59),
('properties/456789012', CURRENT_DATE - INTERVAL '18 days', 745, 192, 1040, 824, 79.23, 167.20, 3.3, 45.40, 18, 1.73, 900.00, 372, 316, 57),
('properties/456789012', CURRENT_DATE - INTERVAL '19 days', 712, 183, 994, 788, 79.28, 163.50, 3.2, 45.90, 17, 1.71, 850.00, 356, 302, 54),
('properties/456789012', CURRENT_DATE - INTERVAL '20 days', 767, 198, 1071, 848, 79.18, 169.80, 3.4, 45.10, 18, 1.68, 900.00, 383, 326, 58),
('properties/456789012', CURRENT_DATE - INTERVAL '21 days', 789, 203, 1101, 872, 79.20, 172.80, 3.4, 44.80, 19, 1.73, 950.00, 394, 335, 60);

-- Week 1 (22-30 days ago)
-- Initial lower traffic
INSERT INTO ga4_metrics (property_id, date, users, new_users, sessions, engaged_sessions, engagement_rate, avg_session_duration, pages_per_session, bounce_rate, conversions, conversion_rate, total_revenue, desktop_users, mobile_users, tablet_users) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '22 days', 701, 180, 978, 775, 79.24, 161.20, 3.1, 46.30, 16, 1.64, 800.00, 350, 298, 53),
('properties/456789012', CURRENT_DATE - INTERVAL '23 days', 678, 174, 946, 750, 79.28, 158.90, 3.0, 46.70, 15, 1.59, 750.00, 339, 288, 51),
('properties/456789012', CURRENT_DATE - INTERVAL '24 days', 723, 186, 1009, 800, 79.29, 164.50, 3.2, 45.80, 17, 1.68, 850.00, 361, 307, 55),
('properties/456789012', CURRENT_DATE - INTERVAL '25 days', 689, 177, 962, 763, 79.31, 160.40, 3.1, 46.50, 16, 1.66, 800.00, 344, 293, 52),
('properties/456789012', CURRENT_DATE - INTERVAL '26 days', 712, 183, 994, 788, 79.28, 163.50, 3.2, 45.90, 17, 1.71, 850.00, 356, 302, 54),
('properties/456789012', CURRENT_DATE - INTERVAL '27 days', 745, 192, 1040, 824, 79.23, 167.20, 3.3, 45.40, 18, 1.73, 900.00, 372, 316, 57),
('properties/456789012', CURRENT_DATE - INTERVAL '28 days', 667, 171, 931, 738, 79.27, 157.60, 3.0, 47.00, 15, 1.61, 750.00, 333, 284, 50),
('properties/456789012', CURRENT_DATE - INTERVAL '29 days', 734, 189, 1024, 811, 79.20, 165.70, 3.2, 45.60, 17, 1.66, 850.00, 367, 312, 55),
('properties/456789012', CURRENT_DATE - INTERVAL '30 days', 695, 179, 970, 769, 79.28, 162.30, 3.1, 46.20, 16, 1.65, 800.00, 347, 295, 53);

-- ============================================================================
-- Page Views (ga4_page_views)
-- Top pages with realistic traffic distribution
-- ============================================================================

-- Home page - highest traffic
INSERT INTO ga4_page_views (property_id, date, page_path, page_title, views, unique_views, avg_time_on_page, entrances, exits, exit_rate) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', '/', 'Home - DMAT', 2890, 1245, 65.30, 890, 234, 18.80),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', '/', 'Home - DMAT', 2785, 1198, 63.20, 856, 225, 18.79),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', '/', 'Home - DMAT', 2998, 1289, 68.40, 923, 246, 19.08);

-- Landing Pages - second highest
INSERT INTO ga4_page_views (property_id, date, page_path, page_title, views, unique_views, avg_time_on_page, entrances, exits, exit_rate) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', '/landing-pages', 'Landing Pages - DMAT', 1534, 892, 125.60, 134, 89, 5.80),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', '/landing-pages', 'Landing Pages - DMAT', 1478, 856, 121.40, 129, 86, 5.82),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', '/landing-pages', 'Landing Pages - DMAT', 1587, 923, 128.90, 139, 92, 5.80);

-- Leads page
INSERT INTO ga4_page_views (property_id, date, page_path, page_title, views, unique_views, avg_time_on_page, entrances, exits, exit_rate) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', '/leads', 'Leads - DMAT', 1423, 825, 156.80, 98, 145, 10.19),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', '/leads', 'Leads - DMAT', 1370, 795, 151.20, 94, 140, 10.22),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', '/leads', 'Leads - DMAT', 1478, 856, 162.30, 102, 151, 10.21);

-- Analytics/Keywords page
INSERT INTO ga4_page_views (property_id, date, page_path, page_title, views, unique_views, avg_time_on_page, entrances, exits, exit_rate) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', '/keywords', 'Keywords - DMAT', 1245, 712, 198.40, 67, 98, 7.87),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', '/keywords', 'Keywords - DMAT', 1198, 685, 192.30, 64, 94, 7.85),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', '/keywords', 'Keywords - DMAT', 1289, 738, 204.50, 69, 101, 7.83);

-- Analytics dashboard
INSERT INTO ga4_page_views (property_id, date, page_path, page_title, views, unique_views, avg_time_on_page, entrances, exits, exit_rate) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', '/analytics', 'Analytics - DMAT', 1067, 624, 178.90, 56, 87, 8.15),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', '/analytics', 'Analytics - DMAT', 1026, 601, 173.20, 54, 84, 8.19),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', '/analytics', 'Analytics - DMAT', 1101, 646, 184.60, 58, 90, 8.17);

-- Blog posts - various landing pages
INSERT INTO ga4_page_views (property_id, date, page_path, page_title, views, unique_views, avg_time_on_page, entrances, exits, exit_rate) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', '/blog/marketing-automation', 'Marketing Automation Guide', 856, 498, 245.60, 234, 112, 13.08),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', '/blog/marketing-automation', 'Marketing Automation Guide', 823, 479, 237.80, 225, 108, 13.12),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', '/blog/marketing-automation', 'Marketing Automation Guide', 889, 517, 253.40, 246, 117, 13.16);

INSERT INTO ga4_page_views (property_id, date, page_path, page_title, views, unique_views, avg_time_on_page, entrances, exits, exit_rate) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', '/blog/lead-generation', 'Lead Generation Strategies', 734, 427, 218.30, 189, 95, 12.94),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', '/blog/lead-generation', 'Lead Generation Strategies', 706, 411, 211.40, 182, 91, 12.89),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', '/blog/lead-generation', 'Lead Generation Strategies', 762, 443, 225.20, 196, 99, 12.99);

-- Pricing page - high conversion intent
INSERT INTO ga4_page_views (property_id, date, page_path, page_title, views, unique_views, avg_time_on_page, entrances, exits, exit_rate) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', '/pricing', 'Pricing - DMAT', 623, 445, 134.70, 45, 178, 28.57),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', '/pricing', 'Pricing - DMAT', 599, 428, 130.20, 43, 171, 28.55),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', '/pricing', 'Pricing - DMAT', 646, 461, 139.20, 46, 184, 28.48);

-- ============================================================================
-- Events (ga4_events)
-- Custom events and conversions
-- ============================================================================

-- Page view events
INSERT INTO ga4_events (property_id, date, event_name, event_count, unique_users, event_value, conversion_count) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'page_view', 11530, 892, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'page_view', 11097, 856, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'page_view', 11937, 923, 0.00, 0);

-- Click events
INSERT INTO ga4_events (property_id, date, event_name, event_count, unique_users, event_value, conversion_count) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'click', 3456, 678, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'click', 3325, 652, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'click', 3589, 701, 0.00, 0);

-- Form submissions - high value conversion
INSERT INTO ga4_events (property_id, date, event_name, event_count, unique_users, event_value, conversion_count) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'form_submit', 145, 134, 7250.00, 145),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'form_submit', 139, 129, 6950.00, 139),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'form_submit', 151, 139, 7550.00, 151);

-- Lead capture - primary conversion
INSERT INTO ga4_events (property_id, date, event_name, event_count, unique_users, event_value, conversion_count) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'lead_capture', 89, 87, 4450.00, 89),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'lead_capture', 86, 84, 4300.00, 86),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'lead_capture', 92, 90, 4600.00, 92);

-- Button clicks - CTA engagement
INSERT INTO ga4_events (property_id, date, event_name, event_count, unique_users, event_value, conversion_count) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'cta_click', 567, 398, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'cta_click', 545, 383, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'cta_click', 589, 413, 0.00, 0);

-- Demo requests - high value conversion
INSERT INTO ga4_events (property_id, date, event_name, event_count, unique_users, event_value, conversion_count) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'demo_request', 34, 34, 3400.00, 34),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'demo_request', 32, 32, 3200.00, 32),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'demo_request', 37, 37, 3700.00, 37);

-- Video plays
INSERT INTO ga4_events (property_id, date, event_name, event_count, unique_users, event_value, conversion_count) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'video_start', 234, 198, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'video_start', 225, 191, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'video_start', 246, 207, 0.00, 0);

-- Download events
INSERT INTO ga4_events (property_id, date, event_name, event_count, unique_users, event_value, conversion_count) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'file_download', 123, 112, 0.00, 23),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'file_download', 118, 108, 0.00, 21),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'file_download', 129, 117, 0.00, 26);

-- Scroll depth tracking
INSERT INTO ga4_events (property_id, date, event_name, event_count, unique_users, event_value, conversion_count) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'scroll', 5678, 734, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'scroll', 5461, 706, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'scroll', 5923, 762, 0.00, 0);

-- Session start
INSERT INTO ga4_events (property_id, date, event_name, event_count, unique_users, event_value, conversion_count) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'session_start', 1245, 892, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'session_start', 1198, 856, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'session_start', 1289, 923, 0.00, 0);

-- First visit
INSERT INTO ga4_events (property_id, date, event_name, event_count, unique_users, event_value, conversion_count) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'first_visit', 234, 234, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'first_visit', 221, 221, 0.00, 0),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'first_visit', 245, 245, 0.00, 0);
