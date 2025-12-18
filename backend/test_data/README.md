# Test Data for DMAT

This folder contains sample data for testing the DMAT application features.

## Files

### search_console_sample_data.sql
Sample keyword performance data for testing Google Search Console integration (Phase 3 - Task 3).

### ga4_analytics_sample_data.sql
Sample Google Analytics 4 (GA4) data for testing Analytics dashboard integration (Phase 3 - Task 4).
**GA4 Property ID**: `properties/456789012` (DMAT Application)

### connected_sample_data.sql
Sample data that connects SEO keywords, GA4 page views, and leads to actual published landing pages.
Creates realistic integrated performance data for testing the unified analytics view.
**GA4 Property ID**: `properties/456789012` (DMAT Application)

**What's included:**
- 100+ keyword records across 30 days
- 8 different keywords with various performance patterns:
  - **Trending UP**: "digital marketing automation" - improving rankings over time
  - **Stable**: "landing page builder" - consistent top 3 position
  - **Trending DOWN**: "lead generation software" - declining slightly
  - **Long-tail**: High CTR, low volume keywords
  - **Brand keywords**: "DMAT" with 90% CTR
- Multiple devices: DESKTOP, MOBILE, TABLET
- Multiple countries: USA, GBR (UK), CAN (Canada), AUS (Australia)
- Historical data (30 days) for trend analysis
- 7 sample indexing issues (3 open, 1 in progress, 3 resolved)

**Performance patterns:**
- High performers: 10-15% CTR, positions 1-5
- Medium performers: 5-10% CTR, positions 5-10
- Brand keywords: 80-90% CTR, position 1

**What's included in GA4 sample data:**
- 30 days of daily metrics (ga4_metrics table)
- 8 different pages × 3 days = 24 page view records (ga4_page_views table)
- 11 event types × 3 days = 33 event records (ga4_events table)
- Realistic traffic patterns with growth trend (growing from ~700 to ~900 daily users)
- Complete device breakdown (Desktop: ~50%, Mobile: ~42%, Tablet: ~8%)
- Engagement metrics: ~79% engagement rate, avg 180 seconds session duration
- Conversion tracking: ~20 conversions/day, ~$1000 revenue/day
- Top pages: Home, Landing Pages, Leads, Keywords, Analytics, Blog posts, Pricing
- Tracked events: page_view, click, form_submit, lead_capture, cta_click, demo_request, video_start, file_download, scroll, session_start, first_visit

## How to Load Sample Data

### Prerequisites
1. Database migrations must be run first:
   ```bash
   cd backend
   psql -U postgres -d dmat_db -f migrations/001_create_google_credentials_table.sql
   psql -U postgres -d dmat_db -f migrations/002_create_seo_tables.sql
   psql -U postgres -d dmat_db -f migrations/003_create_analytics_tables.sql
   ```

### Load Search Console Sample Data

```bash
# From the backend directory
cd backend
psql -U postgres -d dmat_db -f test_data/search_console_sample_data.sql
```

### Load GA4 Analytics Sample Data

```bash
# From the backend directory
cd backend
psql -U postgres -d dmat_db -f test_data/ga4_analytics_sample_data.sql
```

### Verify Data Loaded Successfully

```bash
# Connect to database
psql -U postgres -d dmat_db

# Run verification queries
SELECT COUNT(*) as total_keywords FROM seo_keywords;

# Top performing keywords
SELECT keyword, SUM(clicks) as total_clicks, AVG(position) as avg_position
FROM seo_keywords
GROUP BY keyword
ORDER BY total_clicks DESC
LIMIT 5;

# Performance by device
SELECT device, SUM(impressions) as impressions, SUM(clicks) as clicks, AVG(ctr) as avg_ctr
FROM seo_keywords
GROUP BY device
ORDER BY clicks DESC;

# Exit
\q
```

## Using Sample Data for Testing

### Test Scenarios

1. **View Keywords Dashboard**
   - Navigate to `/keywords` in the frontend
   - Should see 8 unique keywords
   - Verify metrics: impressions, clicks, CTR, position

2. **Filter by Device**
   - Test device filter (Desktop/Mobile/Tablet)
   - Verify different performance across devices

3. **Filter by Date Range**
   - Test last 7 days, 30 days
   - Verify historical data appears

4. **Sort Keywords**
   - Sort by clicks, impressions, CTR, position
   - Verify sorting works correctly

5. **Export to CSV**
   - Export keywords data
   - Verify all columns are present

6. **Trend Analysis**
   - View "digital marketing automation" - should show upward trend
   - View "landing page builder" - should show stable trend
   - View "lead generation software" - should show slight downward trend

7. **International Data**
   - Filter by country if implemented
   - Verify USA, GBR, CAN, AUS data

8. **Indexing Issues**
   - View indexing issues dashboard
   - Should see 7 issues (4 open/in-progress, 3 resolved)

## Clearing Sample Data

If you need to clear the sample data and start fresh:

```bash
psql -U postgres -d dmat_db

-- Clear all data
TRUNCATE TABLE seo_keywords CASCADE;
TRUNCATE TABLE seo_indexing_issues CASCADE;

-- Or delete specific test data (keeps real synced data)
DELETE FROM seo_keywords WHERE date >= CURRENT_DATE - INTERVAL '30 days';
```

## Adding More Test Data

You can modify the SQL file to add more:
- Keywords for your specific niche
- Different date ranges
- Different countries
- More indexing issues
- Custom performance patterns

Just follow the INSERT pattern in the file.

## Notes

- Sample data uses relative dates (CURRENT_DATE - INTERVAL) so it always appears recent
- CTR is calculated as: (clicks / impressions) * 100
- Position values: 1.0 = #1 ranking, 10.0 = #10 ranking
- The UNIQUE constraint prevents duplicate records for same keyword+URL+date+country+device
- Indexing issues use realistic issue types from Google Search Console

## Expected Data Summary

After loading, you should have approximately:

| Metric | Count |
|--------|-------|
| Total keyword records | ~120 |
| Unique keywords | 8 |
| Date range | Last 30 days |
| Devices | 3 (Desktop, Mobile, Tablet) |
| Countries | 4 (USA, GBR, CAN, AUS) |
| Indexing issues | 7 |

## Troubleshooting

**Error: relation "seo_keywords" does not exist**
- Run migration 002_create_seo_tables.sql first

**Error: duplicate key value violates unique constraint**
- Data already exists for that keyword+date+device+country combination
- Either clear existing data or modify the sample data dates

**No data showing in frontend**
- Verify data was inserted: `SELECT COUNT(*) FROM seo_keywords;`
- Check date filters in UI match the sample data dates
- Check browser console for API errors
