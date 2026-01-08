# Phase 3: SEO Engine Implementation

**Project:** DMAT - Digital Marketing Automation Tool
**Phase:** Phase 3 - SEO & Web Performance Monitoring
**Status:** Planning
**Document Version:** 1.0
**Last Updated:** 2025-12-11

---

## Table of Contents

1. [Overview](#overview)
2. [Objectives](#objectives)
3. [Task Breakdown](#task-breakdown)
4. [Tech Stack Additions](#tech-stack-additions)
5. [Cost Analysis](#cost-analysis)
6. [Database Schema](#database-schema)
7. [API Endpoints](#api-endpoints)
8. [Dependencies](#dependencies)
9. [Timeline Estimate](#timeline-estimate)
10. [Success Criteria](#success-criteria)

---

## Overview

Phase 3 focuses on implementing a comprehensive SEO Engine that provides website visibility insights, performance monitoring, and actionable SEO recommendations. This phase integrates with Google Search Console, Google Analytics (GA4), and WordPress to deliver enterprise-grade SEO monitoring capabilities.

**Key Capabilities:**
- Real-time SEO health monitoring
- Keyword performance tracking
- Traffic analytics and trends
- Page-level SEO analysis
- Indexing issue detection
- Automated recommendations
- Historical data tracking

---

## Objectives

1. **Integrate Google APIs** - Connect to Google Search Console and Google Analytics for data collection
2. **WordPress SEO Sync** - Pull metadata, titles, keywords, and tags from WordPress
3. **Keyword Tracking** - Monitor keyword rankings, impressions, clicks, and CTR over time
4. **Traffic Analytics** - Track website traffic trends and user engagement metrics
5. **SEO Analysis** - Detect SEO issues (missing metadata, slow pages, broken links)
6. **Scoring System** - Provide overall SEO health scores with improvement recommendations
7. **Automation** - Schedule daily/weekly data syncs and analysis jobs
8. **Dashboard** - Build unified SEO insights dashboard with visualizations

---

## Task Breakdown

### Task 1: Google API Setup & Authentication
**Objective:** Establish secure connections to Google services

**Priority:** High (Prerequisite for all other tasks)
**Estimated Effort:** 3-5 days

**Subtasks:**
1. Create Google Cloud Project
2. Enable Google Search Console API
3. Enable Google Analytics Data API (GA4)
4. Generate OAuth 2.0 credentials
5. Implement OAuth flow in backend
6. Store refresh tokens securely in database
7. Create API service wrapper for Google APIs
8. Add environment variables for Google credentials
9. Test authentication flow end-to-end
10. Handle token refresh logic
11. Add error handling for auth failures

**Technical Requirements:**
- Google Cloud account
- OAuth 2.0 implementation
- Secure token storage
- googleapis npm package

**Deliverables:**
- Working OAuth flow
- Google API service wrapper
- Environment configuration
- Authentication documentation

---

### Task 2: WordPress Metadata Integration
**Objective:** Pull SEO-related data from WordPress site

**Priority:** High
**Estimated Effort:** 4-6 days

**Subtasks:**
1. Extend existing WordPress service to pull metadata
2. Fetch page/post titles and descriptions
3. Fetch meta keywords and tags
4. Pull categories and taxonomies
5. Fetch post/page slugs and URLs
6. Store metadata in PostgreSQL
7. Create scheduled job to sync metadata (daily)
8. Build API endpoints to view WordPress SEO data
9. Handle pagination for large sites (1000+ pages)
10. Implement incremental sync (only changed pages)
11. Add error handling for WordPress API failures

**Database Changes:**
```sql
CREATE TABLE seo_pages (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  keywords TEXT[],
  h1_tag TEXT,
  word_count INTEGER,
  last_modified TIMESTAMP,
  last_checked TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Deliverables:**
- WordPress metadata sync service
- Scheduled daily sync job
- API endpoints for metadata
- Database schema

---

### Task 3: Google Search Console Integration
**Objective:** Track keyword performance and search visibility

**Priority:** High
**Estimated Effort:** 5-7 days

**Subtasks:**
1. Implement Search Console API client
2. Fetch search analytics data:
   - Query (keyword)
   - Impressions
   - Clicks
   - CTR (Click-through rate)
   - Position (average ranking)
3. Fetch indexing status data
4. Detect indexing issues (errors, warnings, excluded pages)
5. Store historical keyword data by date
6. Create API endpoints for keyword analytics
7. Build scheduled sync job (weekly/monthly)
8. Implement date range filtering (7/30/90 days)
9. Handle API rate limits gracefully
10. Add data aggregation by page, query, country
11. Store URL inspection data

**Database Changes:**
```sql
CREATE TABLE seo_keywords (
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
  UNIQUE(keyword, url, date)
);

CREATE TABLE seo_indexing_issues (
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
```

**Deliverables:**
- Search Console integration service
- Keyword tracking functionality
- Indexing issue detection
- Scheduled sync jobs
- API endpoints

---

### Task 4: Google Analytics Integration
**Objective:** Track traffic trends and user engagement

**Priority:** High
**Estimated Effort:** 5-7 days

**Subtasks:**
1. Implement GA4 Data API client
2. Fetch traffic metrics:
   - Total users
   - Sessions
   - Pageviews
   - Bounce rate
   - Session duration
   - New vs. returning users
3. Fetch traffic sources:
   - Organic search
   - Direct
   - Referral
   - Social
   - Paid
4. Fetch page-level analytics (top pages)
5. Store traffic data by date
6. Create API endpoints for analytics data
7. Build scheduled sync job (daily)
8. Implement conversion tracking
9. Track landing page performance
10. Add user demographics (optional)
11. Handle GA4 property selection

**Database Changes:**
```sql
CREATE TABLE seo_traffic (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  users INTEGER DEFAULT 0,
  sessions INTEGER DEFAULT 0,
  pageviews INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2),
  avg_session_duration DECIMAL(10,2),
  source_category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date, source_category)
);

CREATE TABLE seo_page_analytics (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_views INTEGER DEFAULT 0,
  avg_time_on_page DECIMAL(10,2),
  exit_rate DECIMAL(5,2),
  entrances INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(url, date)
);
```

**Deliverables:**
- GA4 integration service
- Traffic analytics tracking
- Page-level analytics
- Daily sync job
- API endpoints

---

### Task 5: SEO Page Analyzer
**Objective:** Detect SEO issues on pages

**Priority:** Medium
**Estimated Effort:** 7-10 days

**Subtasks:**
1. Build page health checker service
2. Detect missing metadata:
   - Missing title tags
   - Missing meta descriptions
   - Missing H1 tags
   - Duplicate titles/descriptions
   - Missing alt text on images
3. Analyze page speed (via PageSpeed Insights API)
4. Detect broken links (internal and external)
5. Check image optimization (size, format)
6. Verify robots.txt and sitemap.xml
7. Check mobile-friendliness
8. Analyze content quality (word count, readability)
9. Generate SEO score (0-100) for each page
10. Create recommendations engine
11. Store analysis results with history
12. Build API endpoints for page analysis
13. Schedule weekly full-site scans
14. Implement priority-based crawling

**Database Changes:**
```sql
CREATE TABLE seo_page_analysis (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES seo_pages(id),
  url TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  issues JSONB,
  recommendations JSONB,
  page_speed_score INTEGER,
  mobile_friendly BOOLEAN,
  word_count INTEGER,
  analyzed_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE seo_issues (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES seo_pages(id),
  analysis_id INTEGER REFERENCES seo_page_analysis(id),
  issue_type VARCHAR(100),
  severity VARCHAR(20),
  description TEXT,
  fix_instructions TEXT,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Tech Stack:**
- PageSpeed Insights API (FREE)
- Cheerio (HTML parsing)
- Puppeteer (optional, for crawling)

**Deliverables:**
- Page analyzer service
- Issue detection system
- SEO scoring algorithm
- Weekly scan scheduler
- API endpoints

---

### Task 6: SEO Scoring System
**Objective:** Calculate and display SEO health scores

**Priority:** Medium
**Estimated Effort:** 3-5 days

**Subtasks:**
1. Define scoring algorithm:
   - Metadata completeness (20%)
   - Keyword rankings (25%)
   - Page speed (20%)
   - Technical issues (15%)
   - Content quality (10%)
   - Indexing health (10%)
2. Implement scoring calculation logic
3. Track score history over time
4. Create score improvement recommendations
5. Build API endpoint for scores
6. Add alerts for score drops (>10% decrease)
7. Generate score breakdown by category
8. Compare scores month-over-month
9. Add score visualizations (gauges, trends)

**Database Changes:**
```sql
CREATE TABLE seo_scores (
  id SERIAL PRIMARY KEY,
  overall_score INTEGER DEFAULT 0,
  metadata_score INTEGER,
  keywords_score INTEGER,
  speed_score INTEGER,
  technical_score INTEGER,
  content_score INTEGER,
  indexing_score INTEGER,
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Deliverables:**
- Scoring algorithm
- Score history tracking
- API endpoints
- Score breakdown reports

---

### Task 7: Keyword Tracker Dashboard
**Objective:** Visualize keyword performance over time

**Priority:** Medium
**Estimated Effort:** 5-7 days

**Subtasks:**
1. Design keyword tracker UI layout
2. Display keyword ranking trends (line charts)
3. Show impressions/clicks over time
4. Highlight top-performing keywords (top 10)
5. Highlight declining keywords (dropping rankings)
6. Add keyword search/filter functionality
7. Implement sorting (by clicks, impressions, position)
8. Export keyword data to CSV
9. Show keyword distribution by position (1-3, 4-10, 11-20, 21+)
10. Add date range selector
11. Display keyword opportunity score

**Frontend Components:**
- `KeywordTrackerPage.jsx`
- `KeywordRankingChart.jsx`
- `KeywordTable.jsx`
- `KeywordFilters.jsx`
- `KeywordExportButton.jsx`

**Deliverables:**
- Keyword tracker UI
- Interactive charts
- Filter/search functionality
- CSV export
- Responsive design

---

### Task 8: SEO Insights Dashboard
**Objective:** Unified dashboard showing all SEO metrics

**Priority:** High
**Estimated Effort:** 7-10 days

**Subtasks:**
1. Design dashboard layout (wireframe)
2. Display key metrics cards:
   - Overall SEO Score (gauge chart)
   - Total organic traffic (30-day trend)
   - Average keyword position
   - Total indexing issues (critical count)
   - Page speed score
3. Traffic trends chart (line chart, 30/60/90 days)
4. Traffic sources breakdown (pie chart or bar chart)
5. Keyword ranking trends (top 10 keywords)
6. Page health overview (donut chart: healthy/warning/critical)
7. Top-performing pages list (table)
8. Critical issues alerts (alert panel)
9. Recommendations section (priority list)
10. Date range selector (7/30/60/90 days, custom)
11. Export dashboard to PDF
12. Add refresh button for manual sync

**Frontend Components:**
- `SEODashboardPage.jsx`
- `SEOScoreCard.jsx`
- `TrafficChart.jsx`
- `TrafficSourcesChart.jsx`
- `KeywordTrendsChart.jsx`
- `PageHealthChart.jsx`
- `IssuesAlertPanel.jsx`
- `RecommendationsPanel.jsx`
- `TopPagesTable.jsx`

**Deliverables:**
- SEO dashboard UI
- Interactive charts and visualizations
- Real-time metrics
- Responsive design
- PDF export functionality

---

### Task 9: Indexing Issues Management
**Objective:** Help users fix Google indexing problems

**Priority:** Medium
**Estimated Effort:** 4-6 days

**Subtasks:**
1. Display indexing errors from Search Console
2. Categorize issues:
   - Not indexed (excluded)
   - Crawl errors (4xx, 5xx)
   - Redirect errors
   - 404 errors
   - Server errors
   - Blocked by robots.txt
3. Show affected URLs with details
4. Provide fix recommendations per issue type
5. Track issue resolution status
6. Request re-indexing via Search Console API
7. Build issue detail page/panel
8. Add issue status tracking (open/in-progress/resolved)
9. Show issue history timeline
10. Add bulk actions (mark as resolved, request reindex)

**Frontend Components:**
- `IndexingIssuesPage.jsx`
- `IssueCard.jsx`
- `IssueDetailPanel.jsx`
- `IssueStatusBadge.jsx`
- `ReindexButton.jsx`

**Deliverables:**
- Indexing issues UI
- Issue categorization
- Fix recommendations
- Re-indexing functionality
- Status tracking

---

### Task 10: Performance Recommendations Engine
**Objective:** Generate actionable SEO improvement suggestions

**Priority:** Medium
**Estimated Effort:** 5-7 days

**Subtasks:**
1. Analyze all collected SEO data
2. Generate prioritized recommendations:
   - Critical (high impact, immediate action)
   - Important (medium impact, near-term)
   - Minor (low impact, long-term)
3. Provide step-by-step fix instructions
4. Link to affected pages/URLs
5. Estimate impact of fixes (traffic, ranking)
6. Track recommendation completion
7. Build recommendations UI
8. Add snooze/dismiss functionality
9. Show recommendation history
10. Add manual recommendation creation
11. Integrate with issue tracking

**Database Changes:**
```sql
CREATE TABLE seo_recommendations (
  id SERIAL PRIMARY KEY,
  type VARCHAR(100),
  priority VARCHAR(20),
  title TEXT NOT NULL,
  description TEXT,
  fix_instructions TEXT,
  estimated_impact VARCHAR(50),
  affected_urls TEXT[],
  status VARCHAR(20) DEFAULT 'open',
  snoozed_until DATE,
  created_date TIMESTAMP DEFAULT NOW(),
  completed_date TIMESTAMP
);
```

**Deliverables:**
- Recommendations engine
- Priority-based suggestions
- Fix instructions
- UI for managing recommendations
- Impact tracking

---

### Task 11: Scheduled Background Jobs
**Objective:** Automate data syncing and analysis

**Priority:** High
**Estimated Effort:** 5-7 days

**Subtasks:**
1. Setup Redis server (local or cloud)
2. Install and configure BullMQ
3. Create job queue infrastructure
4. Create scheduled jobs:
   - **Daily (2:00 AM):** Sync GA4 traffic data
   - **Daily (2:30 AM):** Sync Search Console data
   - **Weekly (Sunday 3:00 AM):** Run full-site SEO analysis
   - **Weekly (Sunday 4:00 AM):** Update keyword rankings
   - **Monthly (1st, 5:00 AM):** Generate monthly SEO reports
5. Implement job monitoring dashboard
6. Add retry logic for failed jobs (3 retries)
7. Create admin panel for job management
8. Add email alerts for critical issues
9. Log job execution history
10. Implement job priority queue
11. Add manual job triggers

**Tech Stack:**
- Redis (job queue backend)
- BullMQ (job scheduler)
- node-cron (backup scheduler)

**Environment Variables:**
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
JOB_QUEUE_NAME=dmat-seo-jobs
```

**Deliverables:**
- Job queue infrastructure
- 5 scheduled jobs
- Job monitoring UI
- Email alerts
- Retry mechanisms

---

### Task 12: SEO API Routes
**Objective:** Backend API endpoints for SEO features

**Priority:** High
**Estimated Effort:** 4-6 days

**API Endpoints:**

```
# Dashboard & Overview
GET  /api/admin/seo/dashboard           # Dashboard summary with all metrics
GET  /api/admin/seo/score               # Overall SEO score and breakdown
GET  /api/admin/seo/score/history       # Historical scores (30/60/90 days)

# Keywords
GET  /api/admin/seo/keywords            # All keywords with pagination
GET  /api/admin/seo/keywords/:keyword   # Single keyword details and history
GET  /api/admin/seo/keywords/top        # Top performing keywords
GET  /api/admin/seo/keywords/declining  # Keywords with declining positions
GET  /api/admin/seo/keywords/export     # Export keywords to CSV

# Traffic Analytics
GET  /api/admin/seo/traffic             # Traffic data by date range
GET  /api/admin/seo/traffic/sources     # Traffic sources breakdown
GET  /api/admin/seo/traffic/trends      # Traffic trends over time

# Pages
GET  /api/admin/seo/pages               # All pages with SEO data
GET  /api/admin/seo/pages/:id           # Single page details
GET  /api/admin/seo/pages/:id/analyze   # Analyze specific page
POST /api/admin/seo/pages/:id/reanalyze # Trigger page re-analysis
GET  /api/admin/seo/pages/top           # Top performing pages
GET  /api/admin/seo/pages/issues        # Pages with issues

# Indexing Issues
GET  /api/admin/seo/issues              # All indexing issues
GET  /api/admin/seo/issues/:id          # Single issue details
POST /api/admin/seo/issues/:id/resolve  # Mark issue as resolved
POST /api/admin/seo/issues/:id/reindex  # Request re-indexing

# Recommendations
GET  /api/admin/seo/recommendations     # All recommendations
GET  /api/admin/seo/recommendations/:id # Single recommendation
POST /api/admin/seo/recommendations/:id/complete  # Mark as completed
POST /api/admin/seo/recommendations/:id/snooze    # Snooze recommendation

# Google Integration
POST /api/admin/seo/google/auth         # OAuth callback handler
GET  /api/admin/seo/google/status       # Connection status
POST /api/admin/seo/google/disconnect   # Disconnect Google account

# Data Sync
POST /api/admin/seo/sync                # Manual full sync
POST /api/admin/seo/sync/keywords       # Sync keywords only
POST /api/admin/seo/sync/traffic        # Sync traffic only
POST /api/admin/seo/sync/wordpress      # Sync WordPress metadata
GET  /api/admin/seo/sync/status         # Last sync status

# Jobs
GET  /api/admin/seo/jobs                # Job queue status
GET  /api/admin/seo/jobs/:id            # Job details
POST /api/admin/seo/jobs/:id/retry      # Retry failed job
```

**Deliverables:**
- 30+ API endpoints
- Request validation
- Error handling
- API documentation
- Postman collection

---

### Task 13: Database Schema Updates
**Objective:** Create tables for SEO data storage

**Priority:** High
**Estimated Effort:** 2-3 days

**Migration File:** `database/migrations/005_seo_engine.sql`

**New Tables:**

1. **seo_pages** - WordPress page metadata
2. **seo_keywords** - Keyword performance data
3. **seo_traffic** - Traffic analytics by date
4. **seo_page_analytics** - Page-level analytics
5. **seo_indexing_issues** - Search Console issues
6. **seo_page_analysis** - Page health scores
7. **seo_issues** - Detected SEO problems
8. **seo_scores** - Historical SEO scores
9. **seo_recommendations** - Generated recommendations
10. **google_auth_tokens** - OAuth tokens for Google APIs
11. **seo_jobs** - Job execution history

**Indexes:**
```sql
-- Performance indexes
CREATE INDEX idx_keywords_date ON seo_keywords(date);
CREATE INDEX idx_keywords_keyword ON seo_keywords(keyword);
CREATE INDEX idx_traffic_date ON seo_traffic(date);
CREATE INDEX idx_page_analytics_url ON seo_page_analytics(url);
CREATE INDEX idx_issues_status ON seo_indexing_issues(status);
```

**Deliverables:**
- Complete migration SQL file
- Table schemas with constraints
- Indexes for performance
- Migration rollback script
- Schema documentation

---

### Task 14: Testing & Documentation
**Objective:** Ensure quality and maintainability

**Priority:** High
**Estimated Effort:** 5-7 days

**Subtasks:**

**Backend Testing:**
1. Unit tests for Google API integration
2. Unit tests for WordPress metadata sync
3. API endpoint integration tests
4. Job queue tests
5. OAuth flow tests
6. Database query tests
7. Error handling tests

**Frontend Testing:**
1. Component tests (React Testing Library)
2. Dashboard rendering tests
3. Chart visualization tests
4. User interaction tests
5. API integration tests
6. Responsive design tests

**Documentation:**
1. Create Phase 3 implementation guide
2. Add SEO features to TESTING_SCENARIOS.md
3. Create SEO_SETUP.md with Google API setup instructions
4. Update main README.md with Phase 3 completion
5. API documentation (Swagger/OpenAPI)
6. Code documentation (JSDoc)
7. User guide for SEO dashboard

**Test Scenarios:**
- Google OAuth authentication flow
- Keyword data sync and display
- Traffic analytics sync
- Page analysis and scoring
- Issue detection and recommendations
- Job scheduling and execution
- Dashboard data visualization
- CSV export functionality

**Deliverables:**
- Test suite (80%+ coverage)
- Testing scenarios documentation
- Setup guides
- API documentation
- User documentation

---

## Tech Stack Additions

### New NPM Packages

**Backend:**
```json
{
  "googleapis": "^128.0.0",        // Google APIs client
  "bullmq": "^5.0.0",               // Job queue
  "redis": "^4.6.0",                // Redis client
  "ioredis": "^5.3.2",              // Alternative Redis client
  "cheerio": "^1.0.0-rc.12",        // HTML parsing
  "puppeteer": "^21.0.0"            // Web scraping (optional)
}
```

**Frontend:**
```json
{
  "recharts": "^2.10.0",            // Charts library
  "chart.js": "^4.4.0",             // Alternative charts
  "react-chartjs-2": "^5.2.0",      // React Chart.js wrapper
  "date-fns": "^2.30.0"             // Date utilities
}
```

### Infrastructure

1. **Redis Server**
   - Local installation or cloud service
   - Used for job queue (BullMQ)
   - Minimal memory requirements (~100MB)

2. **Google Cloud Project**
   - Free to create
   - Enables API access
   - OAuth credentials

---

## Cost Analysis

### **FREE (100% Open Source)**

| Component | Cost | Notes |
|-----------|------|-------|
| **Redis** | $0 | Self-hosted on existing server |
| **BullMQ** | $0 | Open-source npm package |
| **googleapis** | $0 | Official Google client library |
| **Puppeteer** | $0 | Open-source by Google |
| **Cheerio** | $0 | HTML parsing library |

### **FREE Google APIs**

| API | Daily Quota | Cost |
|-----|-------------|------|
| **Search Console API** | Unlimited queries | $0 |
| **Google Analytics (GA4)** | 25,000 requests/day | $0 |
| **PageSpeed Insights** | 25,000 requests/day | $0 |
| **Google Cloud Project** | N/A | $0 |

### **Optional Costs**

**Redis Hosting (Optional):**
- **Self-hosted:** $0/month (use existing server)
- **Redis Cloud Free Tier:** $0/month (30MB)
- **Redis Cloud Paid:** $7-10/month (1GB)
- **Upstash Free Tier:** 10,000 commands/day free

### **Total Cost: $0 - $10/month**

**Recommendation:** Start with self-hosted Redis ($0/month). All Google APIs are completely free with generous quotas.

---

## Database Schema

### Summary of New Tables

| Table | Purpose | Rows (Estimate) |
|-------|---------|-----------------|
| `seo_pages` | WordPress page metadata | 100-1,000 |
| `seo_keywords` | Keyword performance history | 10,000-100,000 |
| `seo_traffic` | Daily traffic metrics | 365+ (1 year) |
| `seo_page_analytics` | Page-level analytics | 10,000-50,000 |
| `seo_indexing_issues` | Search Console issues | 10-500 |
| `seo_page_analysis` | Page health scores | 100-1,000 |
| `seo_issues` | Detected SEO problems | 100-1,000 |
| `seo_scores` | Historical SEO scores | 365+ (1 year) |
| `seo_recommendations` | Generated recommendations | 50-200 |
| `google_auth_tokens` | OAuth tokens | 1-5 |
| `seo_jobs` | Job execution history | 1,000+ |

**Total Storage:** ~100-500 MB (first year)

---

## API Endpoints

**Total Endpoints:** 30+

**Categories:**
- Dashboard & Overview: 3 endpoints
- Keywords: 5 endpoints
- Traffic Analytics: 3 endpoints
- Pages: 6 endpoints
- Indexing Issues: 4 endpoints
- Recommendations: 4 endpoints
- Google Integration: 3 endpoints
- Data Sync: 5 endpoints
- Jobs: 3 endpoints

---

## Dependencies

### Task Dependencies

```
Task 1 (Google API Setup)
  ├─> Task 2 (WordPress Integration)
  ├─> Task 3 (Search Console)
  ├─> Task 4 (Analytics)
  └─> Task 5 (Page Analyzer)

Task 3 + Task 4 + Task 5
  └─> Task 6 (Scoring System)

Task 6
  └─> Task 10 (Recommendations)

Task 3
  ├─> Task 7 (Keyword Dashboard)
  └─> Task 9 (Indexing Issues)

All Tasks (2-10)
  └─> Task 8 (SEO Dashboard)

All Tasks (2-10)
  └─> Task 11 (Scheduled Jobs)

All Tasks
  └─> Task 13 (Database Schema)
  └─> Task 14 (Testing & Documentation)
```

### Critical Path

1. Task 1: Google API Setup (3-5 days)
2. Task 3: Search Console (5-7 days)
3. Task 4: Analytics (5-7 days)
4. Task 5: Page Analyzer (7-10 days)
5. Task 6: Scoring System (3-5 days)
6. Task 8: SEO Dashboard (7-10 days)
7. Task 11: Scheduled Jobs (5-7 days)
8. Task 14: Testing (5-7 days)

**Critical Path Duration:** ~40-56 days

---

## Timeline Estimate

### Optimistic (Full-time, experienced developer)
- **Duration:** 8-10 weeks
- **Team:** 1-2 developers
- **Velocity:** High

### Realistic (Part-time or learning curve)
- **Duration:** 12-16 weeks
- **Team:** 2-3 developers
- **Velocity:** Medium

### Conservative (Complex requirements, testing)
- **Duration:** 16-20 weeks
- **Team:** 2-4 developers
- **Velocity:** Thorough

### Recommended Approach
**Phased Implementation:**

**Phase 3.1 (Weeks 1-4):** Foundation
- Task 1: Google API Setup
- Task 13: Database Schema
- Task 2: WordPress Integration

**Phase 3.2 (Weeks 5-8):** Data Collection
- Task 3: Search Console Integration
- Task 4: Analytics Integration
- Task 11: Scheduled Jobs (basic)

**Phase 3.3 (Weeks 9-12):** Analysis & Insights
- Task 5: Page Analyzer
- Task 6: Scoring System
- Task 10: Recommendations

**Phase 3.4 (Weeks 13-16):** UI & Polish
- Task 7: Keyword Dashboard
- Task 8: SEO Dashboard
- Task 9: Indexing Issues
- Task 12: API Routes
- Task 14: Testing & Documentation

---

## Success Criteria

### Technical Criteria

✅ **Integration:**
- [ ] Google Search Console successfully connected
- [ ] Google Analytics (GA4) successfully connected
- [ ] WordPress metadata sync working
- [ ] OAuth flow functional
- [ ] Data syncing daily without errors

✅ **Data Collection:**
- [ ] Keyword data collected and stored (30+ days history)
- [ ] Traffic data collected and stored
- [ ] Page analytics collected
- [ ] Indexing issues detected
- [ ] SEO scores calculated

✅ **Analysis:**
- [ ] Page health analyzer detecting issues
- [ ] SEO scoring algorithm accurate
- [ ] Recommendations generated automatically
- [ ] Issue categorization working

✅ **Automation:**
- [ ] 5 scheduled jobs running successfully
- [ ] Job failures retry automatically
- [ ] Email alerts sent for critical issues
- [ ] Data stays current (synced within 24 hours)

✅ **User Interface:**
- [ ] SEO Dashboard displays all metrics
- [ ] Charts render correctly
- [ ] Keyword tracker functional
- [ ] Issues page shows actionable items
- [ ] Responsive design (mobile + desktop)
- [ ] CSV export working

✅ **Performance:**
- [ ] Dashboard loads in <3 seconds
- [ ] API responses <1 second
- [ ] Job execution reliable
- [ ] Database queries optimized

### Business Criteria

✅ **Value Delivered:**
- [ ] Users can see SEO health score
- [ ] Users can track keyword rankings
- [ ] Users can identify and fix SEO issues
- [ ] Users receive actionable recommendations
- [ ] Users understand traffic trends
- [ ] Users can export data for reports

✅ **Usability:**
- [ ] Non-technical users can navigate dashboard
- [ ] Issue descriptions are clear
- [ ] Fix instructions are actionable
- [ ] Data visualizations are intuitive

---

## Risks & Mitigation

### Risk 1: Google API Rate Limits
**Probability:** Low
**Impact:** Medium

**Mitigation:**
- Use batch API requests where possible
- Implement request throttling
- Cache results appropriately
- Stay within free tier limits (25,000/day is generous)

### Risk 2: OAuth Token Expiry
**Probability:** Medium
**Impact:** High

**Mitigation:**
- Implement automatic token refresh
- Store refresh tokens securely
- Add token expiry monitoring
- Alert users when re-authentication needed

### Risk 3: Large Data Volume
**Probability:** Medium
**Impact:** Medium

**Mitigation:**
- Implement data pagination
- Archive old data (>1 year)
- Optimize database indexes
- Use data aggregation for historical trends

### Risk 4: Job Failures
**Probability:** Medium
**Impact:** Medium

**Mitigation:**
- Implement retry logic (3 attempts)
- Add comprehensive error logging
- Email alerts for critical failures
- Manual job trigger capability

### Risk 5: Inaccurate SEO Scoring
**Probability:** Low
**Impact:** High

**Mitigation:**
- Research industry-standard scoring methods
- Test scoring algorithm extensively
- Allow manual score adjustments
- Document scoring methodology

---

## Next Steps

1. **Review & Approval**
   - Review this document with team
   - Approve scope and timeline
   - Allocate resources

2. **Environment Setup**
   - Create Google Cloud Project
   - Install Redis locally
   - Setup development environment

3. **Start with Phase 3.1**
   - Task 1: Google API Setup
   - Task 13: Database Schema
   - Task 2: WordPress Integration

4. **Weekly Progress Reviews**
   - Track completion against timeline
   - Adjust scope if needed
   - Address blockers quickly

---

## References

- **Google Search Console API:** https://developers.google.com/webmaster-tools
- **Google Analytics Data API:** https://developers.google.com/analytics/devguides/reporting/data/v1
- **PageSpeed Insights API:** https://developers.google.com/speed/docs/insights/v5/get-started
- **BullMQ Documentation:** https://docs.bullmq.io/
- **Redis Documentation:** https://redis.io/documentation
- **OAuth 2.0 Guide:** https://developers.google.com/identity/protocols/oauth2

---

**Document End**

*For questions or clarifications, refer to the main project documentation or contact the project lead.*
