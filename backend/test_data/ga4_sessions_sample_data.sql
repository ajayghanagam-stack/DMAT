-- Sample GA4 Sessions Data for Traffic Sources
-- This populates the ga4_sessions table with realistic traffic source distribution

-- Last 30 days of session data grouped by traffic source
-- Property ID: properties/456789012 (matches other GA4 sample data)

-- Organic Search - Highest traffic source
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'Organic Search', 520, 195.30),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'Organic Search', 498, 189.20),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'Organic Search', 542, 201.50),
('properties/456789012', CURRENT_DATE - INTERVAL '4 days', 'Organic Search', 515, 193.40),
('properties/456789012', CURRENT_DATE - INTERVAL '5 days', 'Organic Search', 491, 187.60),
('properties/456789012', CURRENT_DATE - INTERVAL '6 days', 'Organic Search', 528, 198.20),
('properties/456789012', CURRENT_DATE - INTERVAL '7 days', 'Organic Search', 509, 191.80);

-- Direct Traffic - Second highest
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'Direct', 325, 168.40),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'Direct', 312, 163.50),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'Direct', 338, 172.80),
('properties/456789012', CURRENT_DATE - INTERVAL '4 days', 'Direct', 318, 165.90),
('properties/456789012', CURRENT_DATE - INTERVAL '5 days', 'Direct', 305, 161.20),
('properties/456789012', CURRENT_DATE - INTERVAL '6 days', 'Direct', 331, 170.50),
('properties/456789012', CURRENT_DATE - INTERVAL '7 days', 'Direct', 321, 167.30);

-- Social Media - Growing source
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'Social', 198, 142.60),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'Social', 189, 138.30),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'Social', 205, 146.90),
('properties/456789012', CURRENT_DATE - INTERVAL '4 days', 'Social', 195, 141.20),
('properties/456789012', CURRENT_DATE - INTERVAL '5 days', 'Social', 184, 136.70),
('properties/456789012', CURRENT_DATE - INTERVAL '6 days', 'Social', 201, 145.50),
('properties/456789012', CURRENT_DATE - INTERVAL '7 days', 'Social', 192, 140.10);

-- Referral Traffic
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'Referral', 145, 178.90),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'Referral', 139, 173.40),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'Referral', 151, 182.70),
('properties/456789012', CURRENT_DATE - INTERVAL '4 days', 'Referral', 143, 176.50),
('properties/456789012', CURRENT_DATE - INTERVAL '5 days', 'Referral', 135, 171.20),
('properties/456789012', CURRENT_DATE - INTERVAL '6 days', 'Referral', 148, 180.30),
('properties/456789012', CURRENT_DATE - INTERVAL '7 days', 'Referral', 141, 175.10);

-- Email Marketing
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '1 day', 'Email', 57, 215.30),
('properties/456789012', CURRENT_DATE - INTERVAL '2 days', 'Email', 60, 220.60),
('properties/456789012', CURRENT_DATE - INTERVAL '3 days', 'Email', 53, 209.40),
('properties/456789012', CURRENT_DATE - INTERVAL '4 days', 'Email', 52, 207.80),
('properties/456789012', CURRENT_DATE - INTERVAL '5 days', 'Email', 52, 207.50),
('properties/456789012', CURRENT_DATE - INTERVAL '6 days', 'Email', 48, 201.20),
('properties/456789012', CURRENT_DATE - INTERVAL '7 days', 'Email', 46, 198.40);

-- Week 2 (8-14 days ago) - Organic Search
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '8 days', 'Organic Search', 485, 182.50),
('properties/456789012', CURRENT_DATE - INTERVAL '9 days', 'Organic Search', 471, 177.80),
('properties/456789012', CURRENT_DATE - INTERVAL '10 days', 'Organic Search', 503, 185.20),
('properties/456789012', CURRENT_DATE - INTERVAL '11 days', 'Organic Search', 478, 179.60),
('properties/456789012', CURRENT_DATE - INTERVAL '12 days', 'Organic Search', 492, 183.90),
('properties/456789012', CURRENT_DATE - INTERVAL '13 days', 'Organic Search', 512, 186.50),
('properties/456789012', CURRENT_DATE - INTERVAL '14 days', 'Organic Search', 495, 183.30);

-- Week 2 - Direct
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '8 days', 'Direct', 298, 158.90),
('properties/456789012', CURRENT_DATE - INTERVAL '9 days', 'Direct', 289, 154.70),
('properties/456789012', CURRENT_DATE - INTERVAL '10 days', 'Direct', 308, 162.40),
('properties/456789012', CURRENT_DATE - INTERVAL '11 days', 'Direct', 295, 157.20),
('properties/456789012', CURRENT_DATE - INTERVAL '12 days', 'Direct', 302, 160.30),
('properties/456789012', CURRENT_DATE - INTERVAL '13 days', 'Direct', 315, 165.60),
('properties/456789012', CURRENT_DATE - INTERVAL '14 days', 'Direct', 306, 161.80);

-- Week 2 - Social
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '8 days', 'Social', 178, 133.50),
('properties/456789012', CURRENT_DATE - INTERVAL '9 days', 'Social', 172, 129.80),
('properties/456789012', CURRENT_DATE - INTERVAL '10 days', 'Social', 185, 137.40),
('properties/456789012', CURRENT_DATE - INTERVAL '11 days', 'Social', 176, 132.20),
('properties/456789012', CURRENT_DATE - INTERVAL '12 days', 'Social', 181, 134.90),
('properties/456789012', CURRENT_DATE - INTERVAL '13 days', 'Social', 189, 138.50),
('properties/456789012', CURRENT_DATE - INTERVAL '14 days', 'Social', 183, 135.70);

-- Week 2 - Referral
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '8 days', 'Referral', 131, 166.20),
('properties/456789012', CURRENT_DATE - INTERVAL '9 days', 'Referral', 127, 162.50),
('properties/456789012', CURRENT_DATE - INTERVAL '10 days', 'Referral', 138, 169.80),
('properties/456789012', CURRENT_DATE - INTERVAL '11 days', 'Referral', 129, 164.30),
('properties/456789012', CURRENT_DATE - INTERVAL '12 days', 'Referral', 134, 167.40),
('properties/456789012', CURRENT_DATE - INTERVAL '13 days', 'Referral', 142, 171.90),
('properties/456789012', CURRENT_DATE - INTERVAL '14 days', 'Referral', 136, 168.50);

-- Week 2 - Email
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '8 days', 'Email', 42, 193.40),
('properties/456789012', CURRENT_DATE - INTERVAL '9 days', 'Email', 42, 193.20),
('properties/456789012', CURRENT_DATE - INTERVAL '10 days', 'Email', 44, 197.50),
('properties/456789012', CURRENT_DATE - INTERVAL '11 days', 'Email', 43, 195.80),
('properties/456789012', CURRENT_DATE - INTERVAL '12 days', 'Email', 39, 188.70),
('properties/456789012', CURRENT_DATE - INTERVAL '13 days', 'Email', 47, 201.30),
('properties/456789012', CURRENT_DATE - INTERVAL '14 days', 'Email', 45, 198.90);

-- Week 3 (15-21 days ago) - Organic Search
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '15 days', 'Organic Search', 452, 173.90),
('properties/456789012', CURRENT_DATE - INTERVAL '16 days', 'Organic Search', 438, 169.70),
('properties/456789012', CURRENT_DATE - INTERVAL '17 days', 'Organic Search', 467, 176.40),
('properties/456789012', CURRENT_DATE - INTERVAL '18 days', 'Organic Search', 445, 172.20),
('properties/456789012', CURRENT_DATE - INTERVAL '19 days', 'Organic Search', 429, 168.50),
('properties/456789012', CURRENT_DATE - INTERVAL '20 days', 'Organic Search', 461, 174.80),
('properties/456789012', CURRENT_DATE - INTERVAL '21 days', 'Organic Search', 471, 177.80);

-- Week 3 - Direct
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '15 days', 'Direct', 281, 151.20),
('properties/456789012', CURRENT_DATE - INTERVAL '16 days', 'Direct', 273, 147.30),
('properties/456789012', CURRENT_DATE - INTERVAL '17 days', 'Direct', 289, 154.60),
('properties/456789012', CURRENT_DATE - INTERVAL '18 days', 'Direct', 278, 149.80),
('properties/456789012', CURRENT_DATE - INTERVAL '19 days', 'Direct', 265, 143.90),
('properties/456789012', CURRENT_DATE - INTERVAL '20 days', 'Direct', 285, 152.70),
('properties/456789012', CURRENT_DATE - INTERVAL '21 days', 'Direct', 289, 154.80);

-- Week 3 - Social
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '15 days', 'Social', 165, 125.30),
('properties/456789012', CURRENT_DATE - INTERVAL '16 days', 'Social', 160, 121.60),
('properties/456789012', CURRENT_DATE - INTERVAL '17 days', 'Social', 171, 129.40),
('properties/456789012', CURRENT_DATE - INTERVAL '18 days', 'Social', 163, 123.90),
('properties/456789012', CURRENT_DATE - INTERVAL '19 days', 'Social', 156, 119.20),
('properties/456789012', CURRENT_DATE - INTERVAL '20 days', 'Social', 168, 127.10),
('properties/456789012', CURRENT_DATE - INTERVAL '21 days', 'Social', 172, 130.80);

-- Week 3 - Referral
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '15 days', 'Referral', 118, 158.90),
('properties/456789012', CURRENT_DATE - INTERVAL '16 days', 'Referral', 114, 155.70),
('properties/456789012', CURRENT_DATE - INTERVAL '17 days', 'Referral', 124, 162.40),
('properties/456789012', CURRENT_DATE - INTERVAL '18 days', 'Referral', 117, 157.20),
('properties/456789012', CURRENT_DATE - INTERVAL '19 days', 'Referral', 111, 153.50),
('properties/456789012', CURRENT_DATE - INTERVAL '20 days', 'Referral', 121, 160.80),
('properties/456789012', CURRENT_DATE - INTERVAL '21 days', 'Referral', 127, 164.80);

-- Week 3 - Email
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '15 days', 'Email', 40, 186.20),
('properties/456789012', CURRENT_DATE - INTERVAL '16 days', 'Email', 39, 184.60),
('properties/456789012', CURRENT_DATE - INTERVAL '17 days', 'Email', 44, 193.50),
('properties/456789012', CURRENT_DATE - INTERVAL '18 days', 'Email', 40, 186.40),
('properties/456789012', CURRENT_DATE - INTERVAL '19 days', 'Email', 37, 179.70),
('properties/456789012', CURRENT_DATE - INTERVAL '20 days', 'Email', 43, 191.20),
('properties/456789012', CURRENT_DATE - INTERVAL '21 days', 'Email', 42, 189.30);

-- Week 4 (22-30 days ago) - Organic Search
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '22 days', 'Organic Search', 418, 166.20),
('properties/456789012', CURRENT_DATE - INTERVAL '23 days', 'Organic Search', 404, 162.90),
('properties/456789012', CURRENT_DATE - INTERVAL '24 days', 'Organic Search', 431, 169.50),
('properties/456789012', CURRENT_DATE - INTERVAL '25 days', 'Organic Search', 412, 164.40),
('properties/456789012', CURRENT_DATE - INTERVAL '26 days', 'Organic Search', 429, 168.50),
('properties/456789012', CURRENT_DATE - INTERVAL '27 days', 'Organic Search', 445, 172.20),
('properties/456789012', CURRENT_DATE - INTERVAL '28 days', 'Organic Search', 398, 161.60),
('properties/456789012', CURRENT_DATE - INTERVAL '29 days', 'Organic Search', 438, 169.70),
('properties/456789012', CURRENT_DATE - INTERVAL '30 days', 'Organic Search', 421, 167.30);

-- Week 4 - Direct
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '22 days', 'Direct', 258, 140.80),
('properties/456789012', CURRENT_DATE - INTERVAL '23 days', 'Direct', 250, 137.20),
('properties/456789012', CURRENT_DATE - INTERVAL '24 days', 'Direct', 266, 144.90),
('properties/456789012', CURRENT_DATE - INTERVAL '25 days', 'Direct', 254, 138.60),
('properties/456789012', CURRENT_DATE - INTERVAL '26 days', 'Direct', 265, 143.90),
('properties/456789012', CURRENT_DATE - INTERVAL '27 days', 'Direct', 278, 149.80),
('properties/456789012', CURRENT_DATE - INTERVAL '28 days', 'Direct', 245, 135.60),
('properties/456789012', CURRENT_DATE - INTERVAL '29 days', 'Direct', 273, 147.30),
('properties/456789012', CURRENT_DATE - INTERVAL '30 days', 'Direct', 260, 141.20);

-- Week 4 - Social
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '22 days', 'Social', 149, 115.30),
('properties/456789012', CURRENT_DATE - INTERVAL '23 days', 'Social', 144, 111.70),
('properties/456789012', CURRENT_DATE - INTERVAL '24 days', 'Social', 155, 119.80),
('properties/456789012', CURRENT_DATE - INTERVAL '25 days', 'Social', 147, 113.90),
('properties/456789012', CURRENT_DATE - INTERVAL '26 days', 'Social', 156, 119.20),
('properties/456789012', CURRENT_DATE - INTERVAL '27 days', 'Social', 163, 123.90),
('properties/456789012', CURRENT_DATE - INTERVAL '28 days', 'Social', 141, 109.60),
('properties/456789012', CURRENT_DATE - INTERVAL '29 days', 'Social', 160, 121.60),
('properties/456789012', CURRENT_DATE - INTERVAL '30 days', 'Social', 151, 116.20);

-- Week 4 - Referral
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '22 days', 'Referral', 105, 149.20),
('properties/456789012', CURRENT_DATE - INTERVAL '23 days', 'Referral', 102, 146.90),
('properties/456789012', CURRENT_DATE - INTERVAL '24 days', 'Referral', 111, 154.50),
('properties/456789012', CURRENT_DATE - INTERVAL '25 days', 'Referral', 104, 148.40),
('properties/456789012', CURRENT_DATE - INTERVAL '26 days', 'Referral', 111, 153.50),
('properties/456789012', CURRENT_DATE - INTERVAL '27 days', 'Referral', 117, 157.20),
('properties/456789012', CURRENT_DATE - INTERVAL '28 days', 'Referral', 98, 143.60),
('properties/456789012', CURRENT_DATE - INTERVAL '29 days', 'Referral', 114, 155.70),
('properties/456789012', CURRENT_DATE - INTERVAL '30 days', 'Referral', 107, 150.30);

-- Week 4 - Email
INSERT INTO ga4_sessions (property_id, date, traffic_source, session_count, avg_session_duration) VALUES
('properties/456789012', CURRENT_DATE - INTERVAL '22 days', 'Email', 34, 178.40),
('properties/456789012', CURRENT_DATE - INTERVAL '23 days', 'Email', 33, 176.90),
('properties/456789012', CURRENT_DATE - INTERVAL '24 days', 'Email', 37, 185.50),
('properties/456789012', CURRENT_DATE - INTERVAL '25 days', 'Email', 35, 180.60),
('properties/456789012', CURRENT_DATE - INTERVAL '26 days', 'Email', 37, 179.70),
('properties/456789012', CURRENT_DATE - INTERVAL '27 days', 'Email', 40, 186.40),
('properties/456789012', CURRENT_DATE - INTERVAL '28 days', 'Email', 32, 174.60),
('properties/456789012', CURRENT_DATE - INTERVAL '29 days', 'Email', 39, 184.60),
('properties/456789012', CURRENT_DATE - INTERVAL '30 days', 'Email', 35, 181.30);
