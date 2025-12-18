# Phase 3: SEO Engine - Testing Scenarios

**Document Version:** 1.0
**Created:** December 2025
**Phase:** Phase 3 - SEO Engine Implementation

---

## Table of Contents
1. [Pre-Testing Setup](#pre-testing-setup)
2. [Task 1: Google OAuth Integration](#task-1-google-oauth-integration)
3. [Task 3: Google Search Console Integration](#task-3-google-search-console-integration)
4. [Task 4: Google Analytics (GA4) Integration](#task-4-google-analytics-ga4-integration)
5. [Task 5: Public Landing Page Improvements](#task-5-public-landing-page-improvements)
6. [Integration Testing](#integration-testing)
7. [Error Handling & Edge Cases](#error-handling--edge-cases)

---

## Pre-Testing Setup

### Prerequisites
- [ ] Backend server running on http://localhost:5001
- [ ] Frontend server running on http://localhost:5173
- [ ] PostgreSQL database `dmat_db` is running
- [ ] All Phase 3 migrations completed:
  - Migration 003_create_analytics_tables.sql
- [ ] Google Cloud Project created with required APIs enabled:
  - Google OAuth 2.0 API
  - Google Search Console API
  - Google Analytics Data API v1
- [ ] .env file configured with:
  ```
  GOOGLE_CLIENT_ID=your-client-id
  GOOGLE_CLIENT_SECRET=your-client-secret
  GOOGLE_REDIRECT_URI=http://localhost:5001/api/admin/google/oauth/callback
  ```

### Test User Credentials
- **Email:** admin@example.com (or your test user)
- **Password:** (as configured in your database)

### Test Google Account
- **Email:** (Google account with Search Console and GA4 access)
- **Properties:** At least one verified website in Search Console and one GA4 property

---

## Task 1: Google OAuth Integration

### Test Case 1.1: OAuth Authorization Flow
**Objective:** Verify that users can successfully connect their Google account

**Steps:**
1. Login to DMAT at http://localhost:5173/login
2. Navigate to "Google Account" page from sidebar
3. Verify page shows "Not Connected" status
4. Click "Connect Google Account" button
5. Browser redirects to Google OAuth consent screen
6. Select your Google account
7. Grant permissions for:
   - Google Search Console
   - Google Analytics
8. Verify redirect back to DMAT app
9. Verify "Connected" status appears
10. Verify connected email is displayed

**Expected Results:**
- [ ] OAuth flow completes without errors
- [ ] User redirected back to Google Account page
- [ ] Status shows "Connected"
- [ ] Google email address displayed
- [ ] Success message appears
- [ ] Connection persists after page refresh

**Test Data:**
- User ID: (logged in user)
- Google Account: (your test Google account)

---

### Test Case 1.2: OAuth Status Check
**Objective:** Verify OAuth connection status is accurately reflected

**Steps:**
1. Login to DMAT
2. Navigate to Google Account page
3. Verify connection status
4. Refresh the page
5. Verify status persists

**Expected Results:**
- [ ] Status API returns correct connection state
- [ ] UI accurately reflects connection status
- [ ] Status persists across sessions
- [ ] Token expiry is handled gracefully

---

### Test Case 1.3: Disconnect Google Account
**Objective:** Verify users can disconnect their Google account

**Steps:**
1. Ensure Google account is connected
2. Navigate to Google Account page
3. Click "Disconnect" button
4. Confirm disconnection in prompt
5. Verify status changes to "Not Connected"
6. Navigate to Keywords page
7. Navigate to Analytics page

**Expected Results:**
- [ ] Disconnection successful
- [ ] Status changes immediately
- [ ] OAuth tokens removed from database
- [ ] Keywords page shows "Connect Google Account" message
- [ ] Analytics page shows "Connect Google Account" message

---

### Test Case 1.4: Token Refresh
**Objective:** Verify OAuth tokens are automatically refreshed when expired

**Steps:**
1. Connect Google account
2. Wait for access token to expire (or manually set expiry in database)
3. Attempt to sync keywords or analytics
4. Verify operation succeeds with automatic token refresh

**Expected Results:**
- [ ] Token automatically refreshed
- [ ] API call succeeds
- [ ] No user intervention required
- [ ] New tokens stored in database

---

## Task 3: Google Search Console Integration

### Test Case 3.1: View Search Console Sites
**Objective:** Verify that connected Search Console properties are listed

**Steps:**
1. Ensure Google account is connected
2. Navigate to Keywords page (http://localhost:5173/keywords)
3. Check "Select Site" dropdown

**Expected Results:**
- [ ] Dropdown populates with Search Console sites
- [ ] Sites show full URL (e.g., https://example.com/)
- [ ] "-- Select a GA4 Property --" placeholder shown
- [ ] If no sites, appropriate message displayed

**Test Data:**
- Minimum 1 verified site in Search Console

---

### Test Case 3.2: Sync Keyword Data
**Objective:** Verify keyword performance data can be synced from Search Console

**Steps:**
1. Navigate to Keywords page
2. Select a site from dropdown
3. Select time period (7 days, 30 days, or 90 days)
4. Click "Sync Keyword Data" button
5. Wait for sync to complete
6. Verify success message with row count
7. Check that data appears in tables:
   - All Keywords table
   - Top Keywords table
   - Declining Keywords table

**Expected Results:**
- [ ] Sync button shows "Syncing..." state
- [ ] Success alert shows number of records synced
- [ ] All Keywords table populates with data showing:
   - Query (keyword)
   - Clicks
   - Impressions
   - CTR
   - Position
   - Date
- [ ] Top Keywords (sorted by clicks descending)
- [ ] Declining Keywords (keywords with position drop)
- [ ] Loading states handled properly

**Test Data:**
- Site with actual search traffic data
- Date range with sufficient data

---

### Test Case 3.3: Keyword Filtering
**Objective:** Verify keyword search and filtering works correctly

**Steps:**
1. After syncing keywords
2. In search box, enter a keyword (e.g., "marketing")
3. Press Enter or wait for auto-search
4. Verify filtered results

**Expected Results:**
- [ ] Table filters to matching keywords
- [ ] Search is case-insensitive
- [ ] "X keywords found" count updates
- [ ] Clear search shows all keywords again

---

### Test Case 3.4: Sort Keywords
**Objective:** Verify keyword sorting by different metrics

**Steps:**
1. After syncing keywords
2. Select different sort options:
   - Sort by Clicks
   - Sort by Impressions
   - Sort by CTR
   - Sort by Position
3. Verify sorting for each

**Expected Results:**
- [ ] Table re-sorts correctly
- [ ] Top Keywords update based on sort criteria
- [ ] Sort order is correct (descending for most metrics)

---

### Test Case 3.5: Export Keywords to CSV
**Objective:** Verify keyword data can be exported

**Steps:**
1. After syncing keywords
2. Optionally apply search filter
3. Click "Export to CSV" button
4. Check browser downloads

**Expected Results:**
- [ ] CSV file downloads successfully
- [ ] Filename format: `keywords-{timestamp}.csv`
- [ ] CSV contains headers: Query, Clicks, Impressions, CTR, Position, Date
- [ ] All filtered keywords included
- [ ] Data matches table display
- [ ] File opens correctly in Excel/Google Sheets

---

### Test Case 3.6: View Top Keywords
**Objective:** Verify top performing keywords are displayed correctly

**Steps:**
1. After syncing keywords
2. Check "Top Keywords (Last 30 Days)" section
3. Verify top 10 keywords shown

**Expected Results:**
- [ ] Shows exactly 10 keywords (or less if fewer available)
- [ ] Sorted by selected metric (clicks by default)
- [ ] Each keyword shows:
   - Query
   - Clicks count
   - Impressions count
- [ ] Updates when sort criteria changes

---

### Test Case 3.7: View Declining Keywords
**Objective:** Verify keywords with declining positions are identified

**Steps:**
1. After syncing keywords
2. Check "Declining Keywords" section
3. Review keywords listed

**Expected Results:**
- [ ] Shows keywords with position drop
- [ ] Shows up to 10 declining keywords
- [ ] Each shows position change indicator
- [ ] Useful for SEO monitoring

---

### Test Case 3.8: Multi-Day Sync
**Objective:** Verify syncing multiple date ranges works correctly

**Steps:**
1. Select 7-day period, sync
2. Switch to 30-day period, sync again
3. Switch to 90-day period, sync again
4. Verify data for all periods

**Expected Results:**
- [ ] Each sync adds new data
- [ ] Existing data updated (not duplicated)
- [ ] Date ranges handled correctly
- [ ] Database constraints prevent duplicates

---

### Test Case 3.9: Indexing Issues (if implemented)
**Objective:** Verify indexing issues from Search Console are displayed

**Steps:**
1. Navigate to Keywords page
2. Check for "Indexing Issues" section (if visible)
3. Review any indexing problems

**Expected Results:**
- [ ] Indexing issues displayed if any exist
- [ ] Issues categorized by severity
- [ ] URL and error description shown
- [ ] Fix suggestions provided

---

## Task 4: Google Analytics (GA4) Integration

### Test Case 4.1: Add GA4 Property
**Objective:** Verify users can add GA4 properties to track

**Steps:**
1. Navigate to Analytics page (http://localhost:5173/analytics)
2. Click "+ Add Property" button
3. Fill in property form:
   - Property ID: `properties/123456789` (your GA4 property ID)
   - Property Name: "My Website"
   - Website URL: "https://example.com"
   - Timezone: "America/New_York"
   - Currency Code: "USD"
4. Click "Add Property" button
5. Verify success message

**Expected Results:**
- [ ] Form validates required fields
- [ ] Property added successfully
- [ ] Success alert appears
- [ ] Property appears in dropdown
- [ ] Form clears and collapses
- [ ] Database record created

**Test Data:**
- Valid GA4 Property ID from your Google Analytics account

---

### Test Case 4.2: View GA4 Properties
**Objective:** Verify added properties are listed correctly

**Steps:**
1. Navigate to Analytics page
2. Check "Select Property" dropdown

**Expected Results:**
- [ ] All added properties listed
- [ ] Shows property name and URL
- [ ] Dropdown allows selection
- [ ] First property auto-selected if available

---

### Test Case 4.3: Sync Analytics Data
**Objective:** Verify GA4 metrics, page views, and events can be synced

**Steps:**
1. Navigate to Analytics page
2. Select a GA4 property from dropdown
3. Select time period (7, 30, or 90 days)
4. Click "Sync Analytics Data" button
5. Wait for sync (may take 10-30 seconds)
6. Verify success message with row count
7. Check data appears in:
   - Overview cards
   - Device Breakdown
   - Top Pages table
   - Top Events table

**Expected Results:**
- [ ] Sync button shows "Syncing..." state
- [ ] Success alert shows total records synced
- [ ] Overview section shows:
   - Total Users (with New Users sub-metric)
   - Sessions (with Engagement Rate)
   - Avg. Session Duration
   - Conversions (with Revenue)
- [ ] Device Breakdown shows:
   - Desktop users count
   - Mobile users count
   - Tablet users count
- [ ] Top Pages table shows:
   - Page Title
   - Page Path
   - Views count
- [ ] Top Events table shows:
   - Event Name
   - Total Count
- [ ] All numbers formatted correctly (commas, percentages, currency)

**Test Data:**
- GA4 property with actual traffic data
- Time period with sufficient data

---

### Test Case 4.4: Switch Between Properties
**Objective:** Verify switching between different GA4 properties works

**Steps:**
1. Add multiple GA4 properties
2. Select first property, sync data
3. Verify data displayed
4. Switch to second property
5. Verify data updates (or shows empty state)
6. Sync second property
7. Verify correct data displayed

**Expected Results:**
- [ ] Switching properties updates dashboard
- [ ] Each property shows its own data
- [ ] No data mixing between properties
- [ ] Loading states handled properly

---

### Test Case 4.5: Change Time Period
**Objective:** Verify changing time period updates analytics data

**Steps:**
1. Select a property
2. Select "Last 7 days", sync
3. Note metrics values
4. Switch to "Last 30 days", sync
5. Verify metrics updated
6. Switch to "Last 90 days", sync
7. Verify metrics updated

**Expected Results:**
- [ ] Each time period shows correct date range
- [ ] Metrics values change appropriately
- [ ] Summary cards update
- [ ] Top pages/events update
- [ ] Database stores all periods

---

### Test Case 4.6: View Top Pages Performance
**Objective:** Verify top pages are ranked and displayed correctly

**Steps:**
1. After syncing analytics
2. Scroll to "Top Pages" section
3. Review listed pages

**Expected Results:**
- [ ] Shows up to 10 top pages
- [ ] Sorted by views (descending)
- [ ] Each page shows:
   - Page Title
   - Page Path
   - Total Views count
- [ ] Page paths are properly formatted
- [ ] Links/paths are clearly visible

---

### Test Case 4.7: View Top Events
**Objective:** Verify top events are displayed correctly

**Steps:**
1. After syncing analytics
2. Scroll to "Top Events" section
3. Review listed events

**Expected Results:**
- [ ] Shows up to 10 top events
- [ ] Sorted by event count (descending)
- [ ] Each event shows:
   - Event Name
   - Total Count
- [ ] Common GA4 events visible (e.g., page_view, click, scroll)

---

### Test Case 4.8: Format Validation
**Objective:** Verify all numbers and metrics are formatted correctly

**Steps:**
1. After syncing analytics
2. Review all displayed metrics

**Expected Results:**
- [ ] Large numbers have comma separators (e.g., "1,234")
- [ ] Percentages show "%" symbol (e.g., "45.67%")
- [ ] Currency shows "$" symbol (e.g., "$123.45")
- [ ] Durations show "m s" format (e.g., "2m 34s")
- [ ] Zero values show properly (not "NaN" or "undefined")
- [ ] Decimals limited to 2 places for percentages

---

### Test Case 4.9: Empty State Handling
**Objective:** Verify appropriate messages when no data available

**Steps:**
1. Add a new property with no historical data
2. Attempt to sync
3. Verify empty state messages

**Expected Results:**
- [ ] "No analytics data available" message shown
- [ ] Instructions to sync data displayed
- [ ] No errors or crashes
- [ ] Empty tables handled gracefully

---

### Test Case 4.10: Device Breakdown Accuracy
**Objective:** Verify device categorization is correct

**Steps:**
1. After syncing analytics
2. Review Device Breakdown section
3. Calculate total: Desktop + Mobile + Tablet
4. Compare to Total Users

**Expected Results:**
- [ ] All three device types shown
- [ ] Device counts add up reasonably (may not equal total users exactly due to GA4 data model)
- [ ] Icons displayed for each device type
- [ ] Counts formatted with commas

---

## Task 5: Public Landing Page Improvements

### Test Case 5.1: View Public URL in Landing Pages List
**Objective:** Verify public URLs are displayed for published landing pages

**Steps:**
1. Login to DMAT at http://localhost:5173/login
2. Navigate to "Landing Pages" page from sidebar
3. Locate a published landing page in the list
4. Look for the "Public URL" field in the page card

**Expected Results:**
- [ ] Published landing pages show "Public URL:" label
- [ ] Public URL displays in format: `/p/{slug}`
- [ ] URL is clickable and styled in purple/blue color
- [ ] URL opens in new tab when clicked
- [ ] Draft landing pages do NOT show public URL field
- [ ] External link icon (↗) appears next to URL

**Test Data:**
- Published landing page with slug: "free-mg-december-2026"
- Expected URL: `/p/free-mg-december-2026`

---

### Test Case 5.2: Access Public Landing Page via Frontend Route
**Objective:** Verify public landing pages are accessible via `/p/:slug` route

**Steps:**
1. Ensure a landing page is published with slug: "free-mg-december-2026"
2. Open browser (incognito mode recommended)
3. Navigate to: `http://localhost:5173/p/free-mg-december-2026`
4. Wait for page to load

**Expected Results:**
- [ ] Page loads successfully (HTTP 200)
- [ ] No authentication required
- [ ] Hero section displays with image (if configured)
- [ ] Headline displays correctly using `subheading` field
- [ ] Hero image displays correctly using `hero_image_url` field
- [ ] All content sections render properly
- [ ] Lead capture form displays with all configured fields
- [ ] CTA button shows correct text
- [ ] SEO meta tags are set (check page source):
  - `<title>` matches seo_title or title
  - `<meta name="description">` matches seo_description
  - `<meta name="keywords">` matches seo_keywords (if set)
- [ ] No console errors in browser DevTools

**Important Notes:**
- Frontend route `/p/:slug` makes API call to backend `/api/public/landing-page/:slug`
- Backend returns only published landing pages
- Database column `subheading` is used (not `subheadline`)
- Database column `hero_image_url` is used (not `hero_image`)

---

### Test Case 5.3: Public Landing Page - Draft Access Denied
**Objective:** Verify draft landing pages cannot be accessed publicly

**Steps:**
1. Ensure a landing page exists in "draft" status with slug: "draft-test-page"
2. Attempt to navigate to: `http://localhost:5173/p/draft-test-page`

**Expected Results:**
- [ ] Page displays "Page Not Found" error
- [ ] Error message: "Landing page not found or not published"
- [ ] HTTP 404 status returned from API
- [ ] No landing page content visible
- [ ] No form visible

---

### Test Case 5.4: Public Landing Page - Invalid Slug
**Objective:** Verify graceful handling of invalid slugs

**Steps:**
1. Navigate to: `http://localhost:5173/p/invalid-slug-that-does-not-exist`

**Expected Results:**
- [ ] Page displays "Page Not Found" error
- [ ] Error message: "Landing page not found or not published"
- [ ] HTTP 404 status returned from API
- [ ] No landing page content visible
- [ ] User-friendly error display

---

### Test Case 5.5: Public Landing Page - GA4 Integration
**Objective:** Verify GA4 tracking initializes on public landing pages

**Pre-conditions:**
- Landing page published with GA4 property ID configured

**Steps:**
1. Navigate to published landing page: `http://localhost:5173/p/{slug}`
2. Open browser DevTools Console
3. Wait 2-3 seconds for page to fully load
4. Check for GA4 script initialization

**Expected Results:**
- [ ] GA4 script tag loaded: `https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXX`
- [ ] `window.gtag` function defined
- [ ] `window.dataLayer` array exists
- [ ] Initial `page_view` event tracked
- [ ] Page view includes:
  - `page_title`: Landing page title
  - `page_location`: Current URL
  - `page_path`: Current path

**Console Verification:**
```javascript
// Type in browser console:
window.gtag // Should be function
window.dataLayer // Should be array with events
```

**Note:** If no GA4 property ID configured, GA4 scripts should NOT load

---

### Test Case 5.6: Public Landing Page - Lead Submission with GA4 Tracking
**Objective:** Verify lead form submissions trigger GA4 events

**Pre-conditions:**
- Landing page published with GA4 property ID
- Form configured with fields

**Steps:**
1. Navigate to published landing page
2. Open browser DevTools Console
3. Fill out lead form with test data
4. Click submit button
5. Monitor console for GA4 events

**Expected Results:**
- [ ] `form_submit_attempt` event fired when clicking submit
- [ ] Event parameters include:
  - `landing_page`: Slug of current page
  - `form_fields`: Number of fields submitted
- [ ] On successful submission, `lead_capture` event fired
- [ ] `lead_capture` event parameters include:
  - `landing_page`: Slug
  - `lead_id`: ID of created lead
- [ ] On error, `form_submit_error` event fired with error code

**Console Event Verification:**
```javascript
// Events should appear in dataLayer:
window.dataLayer.filter(e => e[0] === 'event')
```

---

### Test Case 5.7: Public Landing Page - Content Rendering
**Objective:** Verify all landing page content renders correctly

**Pre-conditions:**
- Published landing page with:
  - Hero image
  - Headline and subheading
  - Multiple content sections
  - Form with custom fields
  - Theme settings configured

**Steps:**
1. Navigate to published landing page
2. Scroll through entire page
3. Inspect all content sections

**Expected Results:**
- [ ] **Hero Section:**
  - Hero image displays at correct size
  - Headline uses `headline` field or falls back to `title`
  - Subheading displays using `subheading` field
  - Heading color matches `theme_settings.headingColor`
- [ ] **Content Sections:**
  - All content sections render in order
  - Section headings display
  - Section content renders HTML correctly (dangerouslySetInnerHTML)
  - Section images display if configured
  - Section layout classes applied (full-width, two-column, etc.)
- [ ] **Form Section:**
  - Form heading: "Get Started Today"
  - All form fields render in correct order
  - Field labels match configuration
  - Placeholders display correctly
  - Required fields marked with asterisk (*)
  - Field types rendered correctly (text, email, tel, textarea)
  - Honeypot field hidden (anti-bot protection)
  - Submit button uses `cta_text` or defaults to "Submit"
  - Button colors match theme settings
- [ ] **Footer:**
  - Copyright year displays current year
  - Footer text: "© {year} All rights reserved."
- [ ] **Theme Settings:**
  - Background color applied to page
  - Text color applied
  - Font family applied
  - Button color and text color applied

---

### Test Case 5.8: Public Landing Page - Responsive Design
**Objective:** Verify public landing page is responsive on mobile devices

**Steps:**
1. Navigate to published landing page
2. Open browser DevTools (F12)
3. Toggle device toolbar (Ctrl+Shift+M)
4. Test different viewports:
   - Mobile (375px width)
   - Tablet (768px width)
   - Desktop (1920px width)

**Expected Results:**
- [ ] Layout adjusts to screen size
- [ ] Hero image scales appropriately
- [ ] Text remains readable on all devices
- [ ] Form fields are usable on mobile
- [ ] Submit button is tappable (minimum 44px height)
- [ ] No horizontal scrolling required
- [ ] Content sections stack vertically on mobile

---

### Test Case 5.9: Database Column Name Fixes Verification
**Objective:** Verify database column name fixes are correctly implemented

**Pre-conditions:**
- Database has columns: `subheading`, `hero_image_url`
- Code previously used: `subheadline`, `hero_image`

**Steps:**
1. Create/edit a landing page in admin panel
2. Set "Subheading" field to: "Test Subheading Text"
3. Upload a hero image
4. Publish the landing page
5. Navigate to public URL: `/p/{slug}`
6. Verify content displays correctly

**Expected Results:**
- [ ] Subheading displays on public page: "Test Subheading Text"
- [ ] Hero image displays correctly (not broken image)
- [ ] No console errors about missing fields
- [ ] Backend query uses `SELECT *` to avoid column naming issues
- [ ] Frontend accesses `landingPage.subheading` (not `landingPage.subheadline`)
- [ ] Frontend accesses `landingPage.hero_image_url` (not `landingPage.hero_image`)

**Database Verification:**
```sql
SELECT subheading, hero_image_url FROM landing_pages WHERE slug = 'test-slug';
-- Both columns should have values
```

**Code Verification:**
- Backend controller uses `SELECT *` query
- Frontend PublicLandingPage.jsx uses correct property names:
  - Line 235: `landingPage.subheading`
  - Line 226: `landingPage.hero_image_url`

---

### Test Case 5.10: Public Link Click from Admin Panel
**Objective:** Verify clicking public URL from admin panel works correctly

**Pre-conditions:**
- User logged in
- Landing page published

**Steps:**
1. Navigate to Landing Pages list in admin panel
2. Find a published landing page card
3. Click the public URL link (e.g., `/p/free-mg-december-2026`)

**Expected Results:**
- [ ] New browser tab opens
- [ ] Public landing page loads in new tab
- [ ] URL in address bar: `http://localhost:5173/p/{slug}`
- [ ] Page displays correctly
- [ ] User is NOT logged out of admin panel
- [ ] Can switch back to admin tab without issues
- [ ] `target="_blank"` and `rel="noopener noreferrer"` attributes prevent security issues

---

## Integration Testing

### Test Case INT-1: Full SEO Workflow
**Objective:** Test complete SEO monitoring workflow

**Steps:**
1. Connect Google Account
2. Navigate to Keywords page
3. Sync Search Console keywords
4. Review top/declining keywords
5. Export keywords to CSV
6. Navigate to Analytics page
7. Add GA4 property
8. Sync analytics data
9. Review traffic metrics
10. Review top pages and events
11. Compare keyword rankings with page performance

**Expected Results:**
- [ ] Complete workflow executes without errors
- [ ] Data flows correctly between features
- [ ] All features work together seamlessly
- [ ] Performance is acceptable (<3s for each sync)

---

### Test Case INT-2: Multi-User Scenarios
**Objective:** Verify data isolation between users

**Steps:**
1. Login as User A
2. Connect Google Account A
3. Sync keywords and analytics for User A
4. Logout
5. Login as User B
6. Connect Google Account B
7. Sync keywords and analytics for User B
8. Verify User B only sees their own data

**Expected Results:**
- [ ] Users see only their own OAuth connections
- [ ] Users see only their own keywords
- [ ] Users see only their own analytics
- [ ] No data leakage between users

---

### Test Case INT-3: Session Persistence
**Objective:** Verify OAuth and data persist across sessions

**Steps:**
1. Connect Google Account
2. Sync keywords and analytics
3. Close browser completely
4. Reopen browser and login
5. Navigate to Keywords page
6. Navigate to Analytics page

**Expected Results:**
- [ ] Google account remains connected
- [ ] Previously synced data still visible
- [ ] No need to re-authenticate
- [ ] All features work normally

---

## Error Handling & Edge Cases

### Test Case ERR-1: OAuth Errors
**Objective:** Verify graceful handling of OAuth failures

**Scenarios to Test:**
1. **User denies permissions:**
   - Start OAuth flow
   - Click "Cancel" on Google consent screen
   - Verify error message shown
   - Verify connection status remains "Not Connected"

2. **Invalid OAuth credentials in .env:**
   - Set invalid GOOGLE_CLIENT_ID
   - Attempt to connect
   - Verify meaningful error message

3. **Network failure during OAuth:**
   - Disconnect network during OAuth flow
   - Verify timeout handling
   - Verify error message

**Expected Results:**
- [ ] Clear error messages displayed
- [ ] No crashes or white screens
- [ ] User can retry connection
- [ ] Errors logged to console for debugging

---

### Test Case ERR-2: API Rate Limits
**Objective:** Verify handling of Google API rate limits

**Steps:**
1. Rapidly sync keywords multiple times
2. Rapidly sync analytics multiple times
3. Observe behavior

**Expected Results:**
- [ ] Rate limit errors caught gracefully
- [ ] User-friendly message displayed
- [ ] Suggestion to wait before retrying
- [ ] No data corruption

---

### Test Case ERR-3: No Google Account Connected
**Objective:** Verify features handle missing OAuth gracefully

**Steps:**
1. Ensure no Google account connected
2. Navigate to Keywords page
3. Navigate to Analytics page
4. Attempt to sync data

**Expected Results:**
- [ ] "Connect Google Account" message shown
- [ ] Link to Google Account page provided
- [ ] Sync button disabled or shows error
- [ ] No crashes

---

### Test Case ERR-4: Invalid Property ID
**Objective:** Verify validation of GA4 property IDs

**Steps:**
1. Navigate to Analytics page
2. Click "+ Add Property"
3. Enter invalid property ID: "invalid-id"
4. Submit form

**Expected Results:**
- [ ] Validation error shown
- [ ] Form not submitted
- [ ] Clear instruction on correct format
- [ ] Example property ID format shown

---

### Test Case ERR-5: Network Timeout
**Objective:** Verify handling of slow/failed API responses

**Steps:**
1. Throttle network to slow 3G
2. Attempt to sync keywords
3. Attempt to sync analytics

**Expected Results:**
- [ ] Loading states shown during sync
- [ ] Appropriate timeout (e.g., 30 seconds)
- [ ] Error message if timeout occurs
- [ ] User can retry

---

### Test Case ERR-6: Database Connection Lost
**Objective:** Verify handling of database errors

**Steps:**
1. Stop PostgreSQL database
2. Attempt to sync data
3. Observe error handling

**Expected Results:**
- [ ] Error caught and logged
- [ ] User-friendly error message
- [ ] Application doesn't crash
- [ ] Retry option available

---

### Test Case ERR-7: Incomplete Data Sync
**Objective:** Verify partial sync failures are handled

**Steps:**
1. Start syncing large dataset
2. Interrupt network mid-sync
3. Verify data integrity

**Expected Results:**
- [ ] Partial data not committed (transaction rollback)
- [ ] Error message shown
- [ ] User can retry full sync
- [ ] No corrupt data in database

---

## Performance Testing

### Test Case PERF-1: Large Dataset Sync
**Objective:** Verify performance with large amounts of data

**Test Parameters:**
- Keywords: 1000+ keywords over 90 days
- Analytics: 3 months of data

**Expected Results:**
- [ ] Keyword sync completes in <30 seconds
- [ ] Analytics sync completes in <60 seconds
- [ ] UI remains responsive during sync
- [ ] Progress indication shown
- [ ] No browser crashes or freezes

---

### Test Case PERF-2: Concurrent User Load
**Objective:** Verify system handles multiple users syncing simultaneously

**Steps:**
1. Have 5+ users login concurrently
2. All users sync keywords simultaneously
3. All users sync analytics simultaneously

**Expected Results:**
- [ ] All syncs complete successfully
- [ ] No significant slowdown
- [ ] No data mixing between users
- [ ] Database handles concurrent writes

---

## Security Testing

### Test Case SEC-1: Token Storage Security
**Objective:** Verify OAuth tokens are stored securely

**Steps:**
1. Connect Google Account
2. Check database oauth_tokens table
3. Verify token storage

**Expected Results:**
- [ ] Access tokens stored in database (server-side only)
- [ ] Tokens not exposed in frontend localStorage
- [ ] Tokens not in API responses
- [ ] Refresh tokens handled securely

---

### Test Case SEC-2: Authorization Checks
**Objective:** Verify users can only access their own data

**Steps:**
1. Login as User A (ID: 1)
2. Note GA4 property ID
3. Craft API request with another user's property ID
4. Attempt to access

**Expected Results:**
- [ ] Request denied with 403 Forbidden
- [ ] Authorization middleware enforces user ownership
- [ ] No data leakage

---

## Testing Checklist Summary

### Task 1: Google OAuth
- [ ] OAuth connection flow
- [ ] Status check
- [ ] Disconnection
- [ ] Token refresh
- [ ] Error handling

### Task 3: Search Console
- [ ] View sites list
- [ ] Sync keywords (7/30/90 days)
- [ ] Filter/search keywords
- [ ] Sort keywords
- [ ] Export to CSV
- [ ] View top keywords
- [ ] View declining keywords
- [ ] Handle empty states

### Task 4: Google Analytics
- [ ] Add GA4 property
- [ ] View properties list
- [ ] Sync analytics data
- [ ] Switch between properties
- [ ] Change time periods
- [ ] View top pages
- [ ] View top events
- [ ] Device breakdown
- [ ] Number formatting
- [ ] Handle empty states

### Task 5: Public Landing Page Improvements
- [ ] View public URL in landing pages list
- [ ] Access public landing page via `/p/:slug` route
- [ ] Draft access denied (404 for unpublished pages)
- [ ] Invalid slug handling
- [ ] GA4 integration on public pages
- [ ] Lead submission with GA4 tracking
- [ ] Content rendering (hero, sections, form)
- [ ] Responsive design on mobile/tablet
- [ ] Database column name fixes (subheading, hero_image_url)
- [ ] Public link click from admin panel

### Integration & Error Handling
- [ ] Full SEO workflow
- [ ] Multi-user scenarios
- [ ] Session persistence
- [ ] OAuth errors
- [ ] API rate limits
- [ ] Network failures
- [ ] Invalid inputs
- [ ] Database errors

### Performance & Security
- [ ] Large dataset handling
- [ ] Concurrent users
- [ ] Token security
- [ ] Authorization checks

---

## Bug Report Template

When reporting bugs found during testing, use this format:

```
**Bug ID:** BUG-XXX
**Severity:** Critical / High / Medium / Low
**Component:** OAuth / Keywords / Analytics
**Test Case:** [Test case ID]

**Description:**
[Clear description of the bug]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Environment:**
- Browser: Chrome 120 / Firefox 121 / Safari 17
- OS: macOS / Windows / Linux
- Server: localhost:5001
- Frontend: localhost:5173

**Screenshots/Logs:**
[Attach if available]

**Additional Notes:**
[Any other relevant information]
```

---

## Test Sign-Off

### Testing Completed By:
- **Name:**
- **Date:**
- **Phase:** Phase 3

### Test Results:
- Total Test Cases: 55 (Task 1: 4, Task 3: 9, Task 4: 10, Task 5: 10, Integration: 3, Error Handling: 7, Performance: 2, Security: 2)
- Passed: ___
- Failed: ___
- Blocked: ___
- Not Tested: ___

### Critical Issues Found:
1. [Issue description]
2. [Issue description]

### Recommendations:
[Any recommendations for improvements or follow-up]

---

**End of Phase 3 Testing Scenarios**
