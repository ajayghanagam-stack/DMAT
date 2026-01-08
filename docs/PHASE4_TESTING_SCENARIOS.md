# DMAT Testing Scenarios - Phase 4
## LinkedIn Integration Feature Verification

**Document Version:** 1.0
**Last Updated:** January 8, 2026
**Coverage:** Phase 4 (LinkedIn Social Publishing)
**Test Environment:** Development (localhost)

---

## Table of Contents

1. [Pre-Testing Setup](#pre-testing-setup)
2. [Test Environment Verification](#test-environment-verification)
3. [LinkedIn OAuth Integration](#linkedin-oauth-integration)
4. [Post Publishing](#post-publishing)
5. [Post History and Management](#post-history-and-management)
6. [Post Statistics](#post-statistics)
7. [Account Management](#account-management)
8. [Error Handling and Edge Cases](#error-handling-and-edge-cases)
9. [API Testing](#api-testing)
10. [Database Testing](#database-testing)
11. [Security Testing](#security-testing)
12. [Integration Testing](#integration-testing)
13. [Performance Testing](#performance-testing)
14. [Browser Compatibility](#browser-compatibility)
15. [Acceptance Criteria](#acceptance-criteria)

---

## Pre-Testing Setup

### Prerequisites

**1. LinkedIn Developer App Setup:**

📖 **See complete setup guide:** [LinkedIn Setup Guide](setup/LINKEDIN_SETUP.md)

**Checklist:**
- [ ] LinkedIn Developer account created
- [ ] DMAT app created in LinkedIn Developers portal
- [ ] "Sign In with LinkedIn using OpenID Connect" product approved
- [ ] "Share on LinkedIn" product requested/approved
- [ ] Redirect URIs configured:
  - `http://localhost:5001/api/admin/linkedin/oauth/callback`
- [ ] Client ID and Client Secret obtained

**Note:** If you haven't completed LinkedIn setup yet, follow the [LinkedIn Setup Guide](setup/LINKEDIN_SETUP.md) before proceeding with testing. The guide includes screenshots and troubleshooting for common issues.

**2. Backend Configuration:**
```bash
cd backend

# Verify .env configuration
cat .env | grep LINKEDIN

# Expected:
# LINKEDIN_CLIENT_ID=your_client_id
# LINKEDIN_CLIENT_SECRET=your_secret
# LINKEDIN_REDIRECT_URI=http://localhost:5001/api/admin/linkedin/oauth/callback
```

**3. Database Migration:**
```bash
# Run LinkedIn tables migration
psql -d dmat_dev -f backend/migrations/004_create_linkedin_tables.sql

# Verify tables created
psql -d dmat_dev -c "\dt linkedin*"

# Expected output:
# linkedin_oauth_tokens
# linkedin_posts
```

**4. Services Running:**
```bash
# Terminal 1: PostgreSQL
brew services start postgresql@14

# Terminal 2: Backend
cd backend && node server.js
# Verify: "LinkedIn OAuth configured: ✓"

# Terminal 3: Frontend
cd frontend && npm run dev
# Verify: Running on http://localhost:5173

# Terminal 4: MinIO (if testing with images)
./setup-minio.sh
```

**5. Test User Account:**
- [ ] DMAT admin user exists
- [ ] Can login to DMAT
- [ ] Has valid JWT token
- [ ] Has personal LinkedIn account for testing

**6. Clear Previous Test Data:**
```sql
-- Clean up any existing test data
DELETE FROM linkedin_posts;
DELETE FROM linkedin_oauth_tokens;
```

---

## Test Environment Verification

### Scenario 0.1: Backend Health Check
**Objective:** Verify backend services are running correctly

**Steps:**
1. Open terminal
2. Run: `curl http://localhost:5001/api/health`
3. Run: `curl http://localhost:5001/api/db-check`

**Expected Result:**
- ✅ Health endpoint returns 200 OK
- ✅ DB check returns user count
- ✅ Backend logs show "LinkedIn OAuth configured: ✓"

---

### Scenario 0.2: Frontend Access
**Objective:** Verify frontend is accessible

**Steps:**
1. Open browser
2. Navigate to `http://localhost:5173`
3. Login with test credentials

**Expected Result:**
- ✅ Frontend loads without errors
- ✅ Login successful
- ✅ Dashboard displays

---

### Scenario 0.3: LinkedIn Menu Navigation
**Objective:** Verify LinkedIn page is accessible

**Steps:**
1. Login to DMAT
2. Look for "LinkedIn" link in sidebar
3. Click "LinkedIn" link
4. Verify URL changes to `/linkedin`

**Expected Result:**
- ✅ LinkedIn menu item visible
- ✅ Page loads successfully
- ✅ LinkedIn page content displays

---

## LinkedIn OAuth Integration

### Scenario 1.1: Initial Connection Status Check
**Feature:** OAuth Status Display
**Objective:** Verify initial "Not Connected" state

**Pre-conditions:**
- No LinkedIn connection exists for test user
- User is logged in to DMAT

**Steps:**
1. Navigate to `/linkedin` page
2. Observe connection status card

**Expected Result:**
- ✅ "Not Connected" status displayed
- ✅ Gray status indicator shown
- ✅ "Connect LinkedIn" button visible
- ✅ Post composer disabled/hidden
- ✅ Post history hidden
- ✅ No user name/email displayed

**Screenshot Location:** `screenshots/phase4/01-not-connected.png`

---

### Scenario 1.2: Initiate OAuth Flow
**Feature:** OAuth Connection
**Objective:** Successfully start LinkedIn OAuth flow

**Steps:**
1. Navigate to `/linkedin` page
2. Verify "Not Connected" status
3. Click "Connect LinkedIn" button
4. Observe browser behavior

**Expected Result:**
- ✅ Browser redirects to LinkedIn domain
- ✅ URL starts with `https://www.linkedin.com/oauth/v2/authorization`
- ✅ Query parameters present:
  - `response_type=code`
  - `client_id=your_client_id`
  - `redirect_uri=http://localhost:5001/...`
  - `state=` (random UUID)
  - `scope=openid profile email w_member_social`

**Screenshot Location:** `screenshots/phase4/02-linkedin-consent.png`

---

### Scenario 1.3: LinkedIn Authorization (Allow)
**Feature:** OAuth Consent
**Objective:** Grant permissions to DMAT

**Pre-conditions:**
- Logged in to LinkedIn in same browser
- On LinkedIn consent screen

**Steps:**
1. Review permissions requested:
   - Access to profile
   - Access to email
   - Permission to post on your behalf
2. Click "Allow" button
3. Wait for redirect

**Expected Result:**
- ✅ Permissions listed correctly
- ✅ DMAT app name displayed
- ✅ Redirect to `http://localhost:5001/api/admin/linkedin/oauth/callback?code=...&state=...`
- ✅ Then redirect to `http://localhost:5173/linkedin?success=true`

**Backend Logs Should Show:**
```
OAuth callback received
State validated
Code exchange successful
User profile fetched
Tokens stored in database
```

---

### Scenario 1.4: Post-Connection Status
**Feature:** Connected Status Display
**Objective:** Verify connection successful

**Pre-conditions:**
- Just completed OAuth flow
- Redirected back to DMAT

**Steps:**
1. Observe LinkedIn page after redirect
2. Check connection status card
3. Verify success message

**Expected Result:**
- ✅ Green success banner: "LinkedIn account connected successfully!"
- ✅ Connection status shows "Connected"
- ✅ Green status indicator
- ✅ LinkedIn user name displayed (your name)
- ✅ LinkedIn email displayed
- ✅ "Disconnect" button visible
- ✅ Post composer now visible
- ✅ Post statistics displayed (0 posts)

**Screenshot Location:** `screenshots/phase4/03-connected-status.png`

---

### Scenario 1.5: Database Token Verification
**Feature:** Token Storage
**Objective:** Verify tokens stored in database

**Steps:**
1. Open database client
2. Query tokens:
```sql
SELECT
  user_id,
  access_token IS NOT NULL as has_access_token,
  refresh_token IS NOT NULL as has_refresh_token,
  expires_at,
  scope,
  linkedin_user_id,
  linkedin_user_name,
  linkedin_user_email,
  created_at
FROM linkedin_oauth_tokens
WHERE user_id = YOUR_USER_ID;
```

**Expected Result:**
- ✅ One row returned
- ✅ `has_access_token = true`
- ✅ `has_refresh_token = true` or `NULL` (depends on LinkedIn)
- ✅ `expires_at` is future date
- ✅ `scope` contains: `openid,profile,email,w_member_social`
- ✅ `linkedin_user_id` populated (OpenID Connect `sub`)
- ✅ `linkedin_user_name` = your LinkedIn name
- ✅ `linkedin_user_email` = your LinkedIn email
- ✅ `created_at` = current timestamp

---

### Scenario 1.6: OAuth Denial Handling
**Feature:** OAuth Error Handling
**Objective:** Handle user denying permissions

**Pre-conditions:**
- Not connected to LinkedIn
- Fresh browser session

**Steps:**
1. Navigate to `/linkedin`
2. Click "Connect LinkedIn"
3. On LinkedIn consent screen, click "Cancel" or "Deny"
4. Observe behavior

**Expected Result:**
- ✅ Redirect back to DMAT
- ✅ URL contains: `?error=...`
- ✅ Red error banner displayed with message
- ✅ Status still shows "Not Connected"
- ✅ No tokens stored in database
- ✅ User can try connecting again

**Screenshot Location:** `screenshots/phase4/04-oauth-denied.png`

---

### Scenario 1.7: Connection Status Persistence
**Feature:** Status Persistence
**Objective:** Verify connection persists across sessions

**Pre-conditions:**
- LinkedIn account connected
- Tokens in database

**Steps:**
1. Navigate away from LinkedIn page
2. Close browser tab
3. Open new browser tab
4. Login to DMAT again
5. Navigate to `/linkedin` page

**Expected Result:**
- ✅ Status shows "Connected" immediately
- ✅ User name and email displayed
- ✅ No need to reconnect
- ✅ Post composer available

---

## Post Publishing

### Scenario 2.1: Publish Simple Text Post
**Feature:** Basic Post Publishing
**Objective:** Successfully publish text-only post

**Pre-conditions:**
- LinkedIn account connected
- On `/linkedin` page

**Steps:**
1. Locate post composer section
2. Enter text in textarea: "Testing DMAT LinkedIn integration! 🚀 #DMAT #Automation"
3. Observe character counter
4. Click "Publish" button
5. Wait for response

**Expected Result:**
- ✅ Character counter shows: "54/3000"
- ✅ Publish button enabled
- ✅ Loading spinner appears during publish
- ✅ Success message: "Post published successfully!"
- ✅ Post appears in history section below
- ✅ Textarea clears after success
- ✅ Post visible on LinkedIn (verify externally)

**Screenshot Location:** `screenshots/phase4/05-post-published.png`

**Database Verification:**
```sql
SELECT * FROM linkedin_posts ORDER BY published_at DESC LIMIT 1;
```
- ✅ New row with post content
- ✅ `linkedin_post_id` populated
- ✅ `post_url` contains LinkedIn URL
- ✅ `status = 'published'`

---

### Scenario 2.2: Character Counter Functionality
**Feature:** Character Validation
**Objective:** Verify character counter updates correctly

**Steps:**
1. Focus on post composer textarea
2. Type: "A" (1 character)
3. Observe counter
4. Type more characters up to 2990
5. Type 10 more characters (3000 total)
6. Observe counter color
7. Try to type 1 more character (3001)

**Expected Result:**
- ✅ Counter shows "1/3000" after first character
- ✅ Counter updates in real-time
- ✅ At 2900+ characters: counter turns orange (warning)
- ✅ At 3000 characters: counter shows "3000/3000"
- ✅ At 3001+: counter turns red, publish button disabled
- ✅ Error message: "Post content exceeds 3000 character limit"

**Screenshot Location:** `screenshots/phase4/06-character-limit.png`

---

### Scenario 2.3: Empty Post Validation
**Feature:** Input Validation
**Objective:** Prevent publishing empty posts

**Steps:**
1. Leave textarea empty
2. Click "Publish" button

**Expected Result:**
- ✅ Red error message: "Post content cannot be empty"
- ✅ Post NOT published
- ✅ No API call made (check Network tab)
- ✅ Publish button disabled or error shown before click

---

### Scenario 2.4: Whitespace-Only Post Validation
**Feature:** Content Validation
**Objective:** Prevent posts with only spaces/newlines

**Steps:**
1. Enter only spaces and newlines in textarea:
   ```



   ```
2. Click "Publish" button

**Expected Result:**
- ✅ Error message: "Post content cannot be empty"
- ✅ Post NOT published
- ✅ `.trim()` validation working

---

### Scenario 2.5: Long Post Publishing
**Feature:** Maximum Length Post
**Objective:** Publish post at character limit

**Steps:**
1. Prepare exactly 3000 character text:
   ```javascript
   // JavaScript console:
   'A'.repeat(3000)
   ```
2. Paste into textarea
3. Verify counter shows "3000/3000"
4. Click "Publish"

**Expected Result:**
- ✅ Post accepted
- ✅ Publishing successful
- ✅ Full content saved to database
- ✅ Full content visible on LinkedIn

---

### Scenario 2.6: Post with Special Characters
**Feature:** Content Encoding
**Objective:** Handle special characters correctly

**Steps:**
1. Enter post with special characters:
   ```
   Testing special chars:
   - Emojis: 😀 🎉 🚀 ❤️
   - Symbols: © ® ™ € £ ¥
   - Accents: café résumé naïve
   - Math: ∑ ∫ π ∞
   - Arrows: → ← ↑ ↓
   - Unicode: 中文 日本語 한국어
   ```
2. Publish post
3. Verify on LinkedIn

**Expected Result:**
- ✅ All characters accepted
- ✅ Post published successfully
- ✅ Characters display correctly on LinkedIn
- ✅ Database stores UTF-8 correctly

---

### Scenario 2.7: Post with URLs
**Feature:** Link Handling
**Objective:** Verify URLs in posts work correctly

**Steps:**
1. Enter post with URLs:
   ```
   Check out these links:
   https://example.com
   www.google.com
   Contact: email@example.com
   ```
2. Publish post
3. View on LinkedIn

**Expected Result:**
- ✅ Post published
- ✅ URLs auto-detected by LinkedIn
- ✅ Clickable links on LinkedIn
- ✅ URLs stored as plain text in database

---

### Scenario 2.8: Post with Hashtags
**Feature:** Hashtag Support
**Objective:** Verify hashtags work

**Steps:**
1. Enter post:
   ```
   Great day for #Marketing #Automation #AI #MachineLearning!

   Follow us at @Company (if mentions supported)
   ```
2. Publish post
3. Check on LinkedIn

**Expected Result:**
- ✅ Post published
- ✅ Hashtags clickable on LinkedIn
- ✅ Hashtags properly formatted

---

### Scenario 2.9: Multiple Posts in Succession
**Feature:** Sequential Publishing
**Objective:** Publish multiple posts without issues

**Steps:**
1. Publish post 1: "First test post"
2. Wait for success
3. Immediately publish post 2: "Second test post"
4. Wait for success
5. Publish post 3: "Third test post"

**Expected Result:**
- ✅ All 3 posts published successfully
- ✅ All 3 appear in post history
- ✅ Correct order (newest first)
- ✅ No rate limiting errors
- ✅ All visible on LinkedIn

---

### Scenario 2.10: Post Publishing Without Connection
**Feature:** Connection Validation
**Objective:** Prevent publishing without LinkedIn connection

**Steps:**
1. Manually delete tokens from database:
   ```sql
   DELETE FROM linkedin_oauth_tokens WHERE user_id = YOUR_USER_ID;
   ```
2. Refresh `/linkedin` page
3. Try to access post composer

**Expected Result:**
- ✅ Status shows "Not Connected"
- ✅ Post composer hidden or disabled
- ✅ If accessed via API, returns 401 error

---

## Post History and Management

### Scenario 3.1: View Post History
**Feature:** Post History Display
**Objective:** View previously published posts

**Pre-conditions:**
- At least 3 posts published

**Steps:**
1. Navigate to `/linkedin` page
2. Scroll to "Post History" section
3. Observe post list

**Expected Result:**
- ✅ All published posts shown
- ✅ Newest post at top
- ✅ Each row shows:
  - Post content (truncated if long)
  - Published date/time
  - "View on LinkedIn" link
- ✅ Posts sorted by `published_at DESC`

**Screenshot Location:** `screenshots/phase4/07-post-history.png`

---

### Scenario 3.2: Empty Post History
**Feature:** Empty State
**Objective:** Handle no posts gracefully

**Pre-conditions:**
- LinkedIn connected
- No posts published

**Steps:**
1. Navigate to `/linkedin` page
2. Look at post history section

**Expected Result:**
- ✅ Empty state message displayed
- ✅ Message: "No posts yet. Publish your first post above!"
- ✅ No table shown
- ✅ Friendly, encouraging tone

---

### Scenario 3.3: Post Content Display
**Feature:** Content Rendering
**Objective:** Verify post content displays correctly

**Steps:**
1. Publish post with 500+ characters
2. Check post history
3. Observe content display

**Expected Result:**
- ✅ Full content shown OR
- ✅ Content truncated with "..." and "Read more" link
- ✅ Formatting preserved
- ✅ Special characters displayed correctly

---

### Scenario 3.4: Post Timestamp Formatting
**Feature:** Date Display
**Objective:** Verify dates formatted properly

**Steps:**
1. Publish post today
2. Check post history
3. Observe timestamp

**Expected Result:**
- ✅ Shows relative time: "5 minutes ago", "2 hours ago", "Just now"
- ✅ OR absolute time: "Jan 8, 2026 at 10:30 AM"
- ✅ Consistent format across all posts
- ✅ Timezone considered

---

### Scenario 3.5: View on LinkedIn Link
**Feature:** External Link
**Objective:** Navigate to LinkedIn post

**Steps:**
1. Publish a post
2. Find post in history
3. Click "View on LinkedIn" button/link
4. Observe behavior

**Expected Result:**
- ✅ New tab opens
- ✅ LinkedIn post page loads
- ✅ URL format: `https://www.linkedin.com/feed/update/{urn}`
- ✅ Post visible on LinkedIn
- ✅ Content matches DMAT post

**Note:** URL construction is best-effort; LinkedIn may change URL format.

---

### Scenario 3.6: Post History Pagination (Future)
**Feature:** Pagination
**Objective:** Handle large post counts

**Pre-conditions:**
- 25+ posts published

**Steps:**
1. Navigate to post history
2. Look for pagination controls
3. Click "Next page"

**Expected Result:**
- ✅ Shows 20 posts per page (default)
- ✅ Pagination controls visible
- ✅ "Next" and "Previous" buttons
- ✅ Page number indicator

**Note:** Pagination may not be implemented in Phase 4; plan for future.

---

## Post Statistics

### Scenario 4.1: Total Posts Count
**Feature:** Post Statistics
**Objective:** Display accurate total post count

**Pre-conditions:**
- Published exactly 5 posts

**Steps:**
1. Navigate to `/linkedin` page
2. Locate statistics section
3. Check "Total Posts" card

**Expected Result:**
- ✅ Shows "5" as total posts
- ✅ Updates immediately after new post
- ✅ Matches database count:
  ```sql
  SELECT COUNT(*) FROM linkedin_posts WHERE user_id = YOUR_USER_ID;
  ```

**Screenshot Location:** `screenshots/phase4/08-statistics.png`

---

### Scenario 4.2: Last 30 Days Count
**Feature:** Recent Activity
**Objective:** Count posts from last 30 days

**Pre-conditions:**
- Published 3 posts today
- Published 2 posts 45 days ago

**Steps:**
1. View statistics section
2. Check "Posts Last 30 Days" card

**Expected Result:**
- ✅ Shows "3" (only recent posts)
- ✅ Excludes posts older than 30 days
- ✅ Updates after new post
- ✅ Calculation:
  ```sql
  SELECT COUNT(*) FROM linkedin_posts
  WHERE user_id = YOUR_USER_ID
  AND published_at >= NOW() - INTERVAL '30 days';
  ```

---

### Scenario 4.3: Statistics After First Post
**Feature:** Statistics Update
**Objective:** Update stats after first post

**Pre-conditions:**
- No posts published yet
- LinkedIn connected

**Steps:**
1. Verify stats show:
   - Total Posts: 0
   - Last 30 Days: 0
2. Publish first post
3. Check stats immediately

**Expected Result:**
- ✅ Total Posts updates to 1
- ✅ Last 30 Days updates to 1
- ✅ Update happens without page refresh
- ✅ Statistics section visible

---

### Scenario 4.4: Statistics Not Shown When Disconnected
**Feature:** Conditional Display
**Objective:** Hide stats when not connected

**Steps:**
1. Ensure LinkedIn disconnected
2. Navigate to `/linkedin` page
3. Look for statistics section

**Expected Result:**
- ✅ Statistics section hidden or shows 0
- ✅ No confusing data displayed
- ✅ Clear that connection needed

---

## Account Management

### Scenario 5.1: Disconnect LinkedIn Account
**Feature:** Account Disconnection
**Objective:** Successfully disconnect account

**Pre-conditions:**
- LinkedIn account connected
- Some posts published

**Steps:**
1. Navigate to `/linkedin` page
2. Locate "Disconnect" button
3. Click "Disconnect"
4. Confirm action in confirmation dialog
5. Wait for response

**Expected Result:**
- ✅ Confirmation prompt: "Are you sure you want to disconnect your LinkedIn account?"
- ✅ After confirm: Success message "LinkedIn account disconnected"
- ✅ Status changes to "Not Connected"
- ✅ User name/email hidden
- ✅ Post composer hidden
- ✅ Post history hidden
- ✅ Statistics hidden
- ✅ Tokens deleted from database:
  ```sql
  SELECT COUNT(*) FROM linkedin_oauth_tokens WHERE user_id = YOUR_USER_ID;
  -- Should return 0
  ```

**Screenshot Location:** `screenshots/phase4/09-disconnected.png`

---

### Scenario 5.2: Disconnect and Reconnect
**Feature:** Reconnection
**Objective:** Reconnect after disconnecting

**Pre-conditions:**
- Just disconnected (Scenario 5.1)

**Steps:**
1. Click "Connect LinkedIn" button again
2. Complete OAuth flow
3. Authorize on LinkedIn

**Expected Result:**
- ✅ OAuth flow works again
- ✅ Successfully reconnects
- ✅ New tokens stored
- ✅ Post history from before NOT visible (expected)
- ✅ Can publish new posts
- ✅ New posts tracked separately

**Note:** Previous posts remain in database tied to user, but current UI doesn't show posts from previous connection sessions.

---

### Scenario 5.3: Connection Status After Disconnect
**Feature:** Status Persistence
**Objective:** Verify disconnect persists across sessions

**Steps:**
1. Disconnect LinkedIn account
2. Close browser
3. Open new browser
4. Login to DMAT
5. Navigate to `/linkedin`

**Expected Result:**
- ✅ Still shows "Not Connected"
- ✅ No automatic reconnection
- ✅ User must reconnect manually

---

### Scenario 5.4: Cancel Disconnect
**Feature:** Confirmation Dialog
**Objective:** Cancel disconnection

**Steps:**
1. Click "Disconnect" button
2. Confirmation dialog appears
3. Click "Cancel" or close dialog

**Expected Result:**
- ✅ Dialog closes
- ✅ Account remains connected
- ✅ No changes made
- ✅ Tokens still in database

---

## Error Handling and Edge Cases

### Scenario 6.1: Token Expiration Handling
**Feature:** Token Expiration
**Objective:** Detect and handle expired tokens

**Setup:**
1. Connect LinkedIn account
2. Manually expire token in database:
   ```sql
   UPDATE linkedin_oauth_tokens
   SET expires_at = NOW() - INTERVAL '1 day'
   WHERE user_id = YOUR_USER_ID;
   ```

**Steps:**
1. Refresh `/linkedin` page
2. Try to publish a post

**Expected Result:**
- ✅ Status shows "Connected" (token exists)
- ✅ When publishing: Error message "LinkedIn token expired"
- ✅ Message: "Please reconnect your LinkedIn account"
- ✅ Post NOT published
- ✅ No 500 error, graceful handling

**Screenshot Location:** `screenshots/phase4/10-token-expired.png`

---

### Scenario 6.2: Network Error During Publishing
**Feature:** Error Handling
**Objective:** Handle network failures

**Setup:**
1. Connect LinkedIn
2. Stop backend server temporarily

**Steps:**
1. Try to publish post
2. Observe error

**Expected Result:**
- ✅ Error message: "Failed to publish post" or "Network error"
- ✅ Textarea content preserved (not cleared)
- ✅ User can retry after backend back online
- ✅ No data corruption

---

### Scenario 6.3: LinkedIn API Error
**Feature:** External API Error
**Objective:** Handle LinkedIn API failures

**Setup:**
Temporarily modify backend to simulate API error

**Steps:**
1. Try to publish post
2. LinkedIn API returns error

**Expected Result:**
- ✅ Error message with LinkedIn error details
- ✅ Clear message to user
- ✅ Post NOT saved to database
- ✅ Can retry

---

### Scenario 6.4: Database Connection Failure
**Feature:** Database Error
**Objective:** Handle database outages

**Setup:**
1. Stop PostgreSQL temporarily
2. Try to check connection status

**Expected Result:**
- ✅ Error message: "Database error"
- ✅ No crash
- ✅ Graceful degradation
- ✅ User sees friendly error

---

### Scenario 6.5: Invalid Authorization Code
**Feature:** OAuth Error
**Objective:** Handle corrupted OAuth callback

**Setup:**
Manually navigate to:
```
http://localhost:5001/api/admin/linkedin/oauth/callback?code=invalid&state=invalid
```

**Expected Result:**
- ✅ Redirect to frontend with error
- ✅ Error message displayed
- ✅ No tokens saved
- ✅ No crash

---

### Scenario 6.6: Concurrent Post Publishing
**Feature:** Race Conditions
**Objective:** Handle simultaneous publishes

**Steps:**
1. Open two browser tabs with `/linkedin`
2. Enter different posts in each
3. Click "Publish" in both tabs simultaneously

**Expected Result:**
- ✅ Both posts publish successfully
- ✅ Both appear in history
- ✅ No data corruption
- ✅ Unique IDs assigned

---

### Scenario 6.7: Special Characters in Post
**Feature:** Input Sanitization
**Objective:** Handle SQL injection attempts

**Steps:**
1. Enter post with SQL-like content:
   ```
   Test'; DROP TABLE linkedin_posts;--
   ```
2. Publish post

**Expected Result:**
- ✅ Post published as plain text
- ✅ No SQL injection
- ✅ Content saved verbatim
- ✅ Tables intact

---

### Scenario 6.8: XSS Attempt in Post
**Feature:** XSS Protection
**Objective:** Prevent cross-site scripting

**Steps:**
1. Enter post:
   ```html
   <script>alert('XSS')</script>
   <img src=x onerror=alert('XSS')>
   ```
2. Publish post
3. View post history

**Expected Result:**
- ✅ Script tags NOT executed
- ✅ Content displayed as plain text
- ✅ HTML escaped in UI
- ✅ No alert popups

---

### Scenario 6.9: Browser Back Button During OAuth
**Feature:** OAuth Flow Resilience
**Objective:** Handle navigation during OAuth

**Steps:**
1. Click "Connect LinkedIn"
2. On LinkedIn consent screen, click browser back button
3. Return to DMAT

**Expected Result:**
- ✅ Returns to LinkedIn page
- ✅ Still shows "Not Connected"
- ✅ No error state
- ✅ Can retry connection

---

### Scenario 6.10: Multiple Browser Tabs
**Feature:** Multi-tab Behavior
**Objective:** Handle same user in multiple tabs

**Steps:**
1. Open DMAT in Tab 1
2. Connect LinkedIn in Tab 1
3. Open DMAT in Tab 2
4. Verify both show connected
5. Disconnect in Tab 1
6. Check Tab 2

**Expected Result:**
- ✅ Both tabs initially show connected
- ✅ After disconnect: Tab 2 may show stale state
- ✅ Refreshing Tab 2 shows disconnected
- ✅ No crashes or errors

---

## API Testing

### Scenario 7.1: Check Connection Status API
**Feature:** Status API
**Objective:** Test connection status endpoint

**Setup:**
Connect LinkedIn account first

**API Call:**
```bash
curl -X GET http://localhost:5001/api/admin/linkedin/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "connected": true,
  "linkedinUserName": "Your Name",
  "linkedinUserEmail": "your@email.com",
  "linkedinUserId": "abc123",
  "tokenExpired": false,
  "expiresAt": "2026-02-08T10:30:00Z"
}
```

**Validations:**
- ✅ 200 OK status
- ✅ All fields present
- ✅ Valid timestamp format
- ✅ `tokenExpired = false`

---

### Scenario 7.2: Publish Post API
**Feature:** Publishing API
**Objective:** Test post creation endpoint

**API Call:**
```bash
curl -X POST http://localhost:5001/api/admin/linkedin/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Test post from API!"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Post published successfully",
  "post": {
    "id": 1,
    "linkedinPostId": "urn:li:share:1234567890",
    "content": "Test post from API!",
    "postUrl": "https://www.linkedin.com/feed/update/...",
    "imageUrl": null,
    "publishedAt": "2026-01-08T10:30:00Z"
  }
}
```

**Validations:**
- ✅ 201 Created status
- ✅ `success = true`
- ✅ Post object returned
- ✅ Valid LinkedIn URN
- ✅ Post visible on LinkedIn

---

### Scenario 7.3: Get Post History API
**Feature:** History API
**Objective:** Test post retrieval

**API Call:**
```bash
curl -X GET "http://localhost:5001/api/admin/linkedin/posts?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "linkedin_post_id": "urn:li:share:1234567890",
      "post_content": "Test post...",
      "post_url": "https://...",
      "status": "published",
      "published_at": "2026-01-08T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 1,
    "totalPages": 1
  }
}
```

**Validations:**
- ✅ 200 OK
- ✅ Posts array present
- ✅ Pagination object correct
- ✅ Newest posts first

---

### Scenario 7.4: Get Statistics API
**Feature:** Stats API
**Objective:** Test statistics endpoint

**API Call:**
```bash
curl -X GET http://localhost:5001/api/admin/linkedin/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "totalPosts": 5,
  "postsLast30Days": 3
}
```

**Validations:**
- ✅ 200 OK
- ✅ Numbers match database
- ✅ Both fields present

---

### Scenario 7.5: Disconnect API
**Feature:** Disconnect API
**Objective:** Test account disconnection

**API Call:**
```bash
curl -X DELETE http://localhost:5001/api/admin/linkedin/disconnect \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "LinkedIn account disconnected"
}
```

**Validations:**
- ✅ 200 OK
- ✅ Success message
- ✅ Tokens deleted from database

---

### Scenario 7.6: Unauthorized API Access
**Feature:** Authentication
**Objective:** Reject requests without JWT

**API Call:**
```bash
curl -X GET http://localhost:5001/api/admin/linkedin/status
# No Authorization header
```

**Expected Response:**
```json
{
  "error": "Unauthorized",
  "message": "No token provided"
}
```

**Validations:**
- ✅ 401 Unauthorized
- ✅ Clear error message
- ✅ No data leaked

---

### Scenario 7.7: Invalid JWT Token
**Feature:** Token Validation
**Objective:** Reject invalid tokens

**API Call:**
```bash
curl -X GET http://localhost:5001/api/admin/linkedin/status \
  -H "Authorization: Bearer invalid_token_12345"
```

**Expected Response:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid token"
}
```

**Validations:**
- ✅ 401 Unauthorized
- ✅ Token rejected
- ✅ No backend crash

---

### Scenario 7.8: Publish Without Connection
**Feature:** Validation
**Objective:** Reject post when not connected

**Setup:**
Ensure no LinkedIn connection

**API Call:**
```bash
curl -X POST http://localhost:5001/api/admin/linkedin/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Test"}'
```

**Expected Response:**
```json
{
  "error": "LinkedIn account not connected",
  "message": "Please connect your LinkedIn account first"
}
```

**Validations:**
- ✅ 401 Unauthorized
- ✅ Clear error message
- ✅ No post created

---

## Database Testing

### Scenario 8.1: Foreign Key Constraints
**Feature:** Data Integrity
**Objective:** Verify cascade delete works

**Steps:**
1. Create test user
2. Connect LinkedIn for test user
3. Publish 3 posts
4. Delete test user:
   ```sql
   DELETE FROM users WHERE id = TEST_USER_ID;
   ```
5. Check related records:
   ```sql
   SELECT COUNT(*) FROM linkedin_oauth_tokens WHERE user_id = TEST_USER_ID;
   SELECT COUNT(*) FROM linkedin_posts WHERE user_id = TEST_USER_ID;
   ```

**Expected Result:**
- ✅ Both queries return 0
- ✅ Cascade delete worked
- ✅ No orphaned records

---

### Scenario 8.2: Unique Constraint on user_id
**Feature:** Database Constraints
**Objective:** Prevent duplicate tokens

**Steps:**
1. Connect LinkedIn (tokens created)
2. Try to insert duplicate:
   ```sql
   INSERT INTO linkedin_oauth_tokens (user_id, access_token, expires_at)
   VALUES (YOUR_USER_ID, 'test', NOW() + INTERVAL '1 hour');
   ```

**Expected Result:**
- ✅ Error: "duplicate key value violates unique constraint"
- ✅ Constraint prevents duplicate
- ✅ Original tokens unchanged

---

### Scenario 8.3: Token Expiration Query
**Feature:** Database Queries
**Objective:** Test expiration detection

**Query:**
```sql
SELECT
  user_id,
  linkedin_user_name,
  expires_at,
  expires_at < NOW() as is_expired
FROM linkedin_oauth_tokens;
```

**Expected Result:**
- ✅ Query executes
- ✅ `is_expired` boolean correct
- ✅ Can identify expired tokens

---

### Scenario 8.4: Post Count by Date Range
**Feature:** Analytics Queries
**Objective:** Test date range filtering

**Query:**
```sql
SELECT
  DATE(published_at) as date,
  COUNT(*) as post_count
FROM linkedin_posts
WHERE user_id = YOUR_USER_ID
  AND published_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(published_at)
ORDER BY date DESC;
```

**Expected Result:**
- ✅ Query executes
- ✅ Correct counts per day
- ✅ Only last 30 days

---

### Scenario 8.5: Index Performance
**Feature:** Database Performance
**Objective:** Verify indexes used

**Query:**
```sql
EXPLAIN ANALYZE
SELECT * FROM linkedin_posts
WHERE user_id = YOUR_USER_ID
ORDER BY published_at DESC
LIMIT 20;
```

**Expected Result:**
- ✅ Uses `idx_linkedin_posts_user_id`
- ✅ Uses `idx_linkedin_posts_published_at`
- ✅ Fast execution (< 10ms)
- ✅ No sequential scan

---

## Security Testing

### Scenario 9.1: SQL Injection in Post Content
**Feature:** SQL Injection Protection
**Objective:** Verify parameterized queries

**Steps:**
1. Publish post with SQL:
   ```
   ' OR '1'='1
   '; DROP TABLE linkedin_posts; --
   ```
2. Check database

**Expected Result:**
- ✅ Content stored verbatim
- ✅ No SQL executed
- ✅ Tables intact
- ✅ Parameterized queries work

---

### Scenario 9.2: XSS in Post Content
**Feature:** XSS Protection
**Objective:** Prevent script execution

**Steps:**
1. Publish post:
   ```html
   <script>alert('XSS')</script>
   <img src=x onerror=alert(1)>
   ```
2. View post history

**Expected Result:**
- ✅ No scripts execute
- ✅ Content escaped
- ✅ HTML rendered as text

---

### Scenario 9.3: CSRF Protection
**Feature:** CSRF Protection
**Objective:** Verify state parameter

**Steps:**
1. Start OAuth flow, note state param
2. Manually construct callback URL with different state:
   ```
   http://localhost:5001/api/admin/linkedin/oauth/callback?code=xxx&state=wrong
   ```
3. Navigate to URL

**Expected Result:**
- ✅ Error: "Invalid state parameter"
- ✅ CSRF attack prevented
- ✅ No tokens stored

---

### Scenario 9.4: JWT Token Expiration
**Feature:** Token Security
**Objective:** Reject expired JWT

**Setup:**
Use expired JWT token

**API Call:**
```bash
curl -X GET http://localhost:5001/api/admin/linkedin/status \
  -H "Authorization: Bearer EXPIRED_TOKEN"
```

**Expected Result:**
- ✅ 401 Unauthorized
- ✅ "Token expired" message
- ✅ Must re-login

---

### Scenario 9.5: Unauthorized Access to Other User's Posts
**Feature:** Authorization
**Objective:** Prevent cross-user access

**Steps:**
1. Login as User A, get JWT
2. Connect LinkedIn as User A
3. Login as User B, get different JWT
4. Use User B's JWT to access User A's posts:
   ```bash
   curl http://localhost:5001/api/admin/linkedin/posts \
     -H "Authorization: Bearer USER_B_JWT"
   ```

**Expected Result:**
- ✅ Only User B's posts returned (empty if none)
- ✅ User A's posts NOT visible
- ✅ No cross-user data leak

---

## Integration Testing

### Scenario 10.1: End-to-End Flow
**Feature:** Complete Workflow
**Objective:** Test entire user journey

**Steps:**
1. Login to DMAT
2. Navigate to LinkedIn page
3. Connect LinkedIn account
4. Publish 3 posts
5. View post history
6. Check statistics
7. Disconnect account
8. Verify disconnected state

**Expected Result:**
- ✅ All steps complete successfully
- ✅ No errors encountered
- ✅ Data consistent throughout
- ✅ UI updates correctly

**Time to Complete:** ~5 minutes

---

### Scenario 10.2: Multi-User Isolation
**Feature:** Data Isolation
**Objective:** Verify users don't see each other's data

**Steps:**
1. Login as User A
2. Connect LinkedIn as User A
3. Publish post: "User A post"
4. Logout
5. Login as User B
6. Connect LinkedIn as User B
7. View post history

**Expected Result:**
- ✅ User B sees NO posts (fresh account)
- ✅ User A's post NOT visible
- ✅ Statistics show 0 for User B
- ✅ Proper data isolation

---

### Scenario 10.3: Browser Session Persistence
**Feature:** Session Management
**Objective:** Verify state persists across page loads

**Steps:**
1. Connect LinkedIn
2. Publish 2 posts
3. Close browser completely
4. Open browser
5. Navigate to DMAT
6. Login
7. Go to LinkedIn page

**Expected Result:**
- ✅ Still shows connected
- ✅ Post history preserved
- ✅ Statistics correct
- ✅ No re-authentication needed

---

### Scenario 10.4: OAuth Redirect Chain
**Feature:** OAuth Flow
**Objective:** Verify complete redirect chain

**Steps:**
1. Start at `/linkedin`
2. Click "Connect"
3. Track redirects:
   - DMAT → LinkedIn OAuth
   - LinkedIn → DMAT callback
   - DMAT callback → DMAT frontend

**Expected Result:**
- ✅ All redirects complete
- ✅ Final URL: `/linkedin?success=true`
- ✅ Success message shown
- ✅ Connection established

---

## Performance Testing

### Scenario 11.1: Post Publishing Speed
**Feature:** Performance
**Objective:** Measure post publish time

**Steps:**
1. Publish post
2. Measure time from click to success

**Expected Result:**
- ✅ Total time < 3 seconds
- ✅ Acceptable user experience
- ✅ No timeout errors

---

### Scenario 11.2: Post History Load Time
**Feature:** Query Performance
**Objective:** Measure history load speed

**Setup:**
Publish 50 posts

**Steps:**
1. Navigate to `/linkedin`
2. Measure time to load history

**Expected Result:**
- ✅ Loads in < 1 second
- ✅ No pagination needed yet
- ✅ Smooth scrolling

---

### Scenario 11.3: Database Query Performance
**Feature:** Database Performance
**Objective:** Verify queries are fast

**Steps:**
Run EXPLAIN ANALYZE on key queries

**Expected Result:**
- ✅ All queries < 10ms
- ✅ Indexes used correctly
- ✅ No sequential scans

---

### Scenario 11.4: Concurrent User Load
**Feature:** Scalability
**Objective:** Handle multiple users

**Setup:**
5 users connect and publish simultaneously

**Steps:**
1. All users connect LinkedIn
2. All publish posts at same time
3. Check results

**Expected Result:**
- ✅ All posts succeed
- ✅ No conflicts
- ✅ No database locks
- ✅ Response time acceptable

---

## Browser Compatibility

### Scenario 12.1: Chrome/Edge (Chromium)
**Browser:** Google Chrome or Microsoft Edge

**Steps:**
1. Complete full workflow
2. Test all features

**Expected Result:**
- ✅ All features work
- ✅ UI renders correctly
- ✅ OAuth redirects work

---

### Scenario 12.2: Firefox
**Browser:** Mozilla Firefox

**Steps:**
1. Complete OAuth flow
2. Publish posts
3. View history

**Expected Result:**
- ✅ All features work
- ✅ No Firefox-specific issues
- ✅ OAuth works

---

### Scenario 12.3: Safari (Mac)
**Browser:** Safari

**Steps:**
1. Test OAuth flow
2. Check localStorage
3. Test publishing

**Expected Result:**
- ✅ OAuth works
- ✅ JWT stored correctly
- ✅ All features functional

**Note:** Safari has strict cookie/storage policies; verify JWT persists.

---

### Scenario 12.4: Mobile Browsers
**Browsers:** Chrome Mobile, Safari iOS

**Steps:**
1. Open DMAT on mobile
2. Test responsive design
3. Complete OAuth on mobile

**Expected Result:**
- ✅ UI responsive
- ✅ Buttons accessible
- ✅ OAuth works on mobile
- ✅ Text input comfortable

---

## Regression Testing

### Scenario 13.1: Existing Features Unaffected
**Feature:** Regression Prevention
**Objective:** Verify Phase 4 doesn't break existing features

**Pre-conditions:**
- Phase 1-3 features working before Phase 4

**Steps:**
1. **Landing Pages:**
   - Create new landing page
   - Edit existing landing page
   - Publish landing page
   - Delete landing page
2. **Leads:**
   - View leads list
   - Export leads to CSV
   - Filter and search leads
3. **Google Account:**
   - Check Google OAuth still works
   - Access SEO Dashboard
   - Sync Search Console data
4. **Authentication:**
   - Login/logout
   - JWT token validation
   - Protected routes

**Expected Result:**
- ✅ All Phase 1-3 features work exactly as before
- ✅ No UI breaking changes
- ✅ No database conflicts
- ✅ No API route conflicts

---

### Scenario 13.2: Database Integrity
**Feature:** Schema Compatibility
**Objective:** Verify new tables don't affect existing tables

**Steps:**
1. Check all migrations ran successfully
2. Verify foreign keys intact:
   ```sql
   SELECT
     tc.table_name,
     kcu.column_name,
     ccu.table_name AS foreign_table_name,
     ccu.column_name AS foreign_column_name
   FROM information_schema.table_constraints AS tc
   JOIN information_schema.key_column_usage AS kcu
     ON tc.constraint_name = kcu.constraint_name
   JOIN information_schema.constraint_column_usage AS ccu
     ON ccu.constraint_name = tc.constraint_name
   WHERE tc.constraint_type = 'FOREIGN KEY'
   ORDER BY tc.table_name;
   ```

**Expected Result:**
- ✅ All existing foreign keys preserved
- ✅ New LinkedIn tables have proper constraints
- ✅ No orphaned records
- ✅ All indexes present

---

### Scenario 13.3: API Route Conflicts
**Feature:** Route Isolation
**Objective:** Verify no route conflicts

**Steps:**
1. Get all API routes:
   ```bash
   curl http://localhost:5001/ | jq .endpoints
   ```
2. Verify LinkedIn routes don't conflict with existing
3. Test all existing API endpoints

**Expected Result:**
- ✅ All existing endpoints respond correctly
- ✅ No 404 errors on old routes
- ✅ LinkedIn routes under `/api/admin/linkedin/*`
- ✅ No naming conflicts

---

### Scenario 13.4: Frontend Navigation
**Feature:** UI Compatibility
**Objective:** Verify sidebar and navigation intact

**Steps:**
1. Check all sidebar links present:
   - Dashboard
   - Landing Pages
   - Leads
   - Users
   - SEO Dashboard
   - LinkedIn (NEW)
   - Google Account
2. Click each link
3. Verify pages load

**Expected Result:**
- ✅ All links working
- ✅ LinkedIn added without breaking layout
- ✅ Active link highlighting works
- ✅ Responsive on mobile

---

## Accessibility Testing

### Scenario 14.1: Keyboard Navigation
**Feature:** Keyboard Accessibility
**Objective:** Navigate LinkedIn page with keyboard only

**Steps:**
1. Navigate to `/linkedin` using keyboard (Tab key)
2. Tab through all interactive elements:
   - Connect button
   - Post textarea
   - Publish button
   - View on LinkedIn links
   - Disconnect button
3. Activate elements with Enter/Space
4. Navigate post history table

**Expected Result:**
- ✅ All elements reachable via Tab
- ✅ Visible focus indicators
- ✅ Logical tab order
- ✅ Can publish post without mouse
- ✅ No keyboard traps

**Screenshot Location:** `screenshots/phase4/accessibility-keyboard.png`

---

### Scenario 14.2: Screen Reader Compatibility
**Feature:** Screen Reader Support
**Objective:** Test with screen reader

**Tools:** VoiceOver (Mac), NVDA (Windows), or JAWS

**Steps:**
1. Navigate to LinkedIn page with screen reader on
2. Listen to announcements
3. Interact with form
4. Check button labels
5. Verify error messages announced

**Expected Result:**
- ✅ Page title announced
- ✅ Buttons have clear labels
- ✅ Form fields have labels
- ✅ Error messages read aloud
- ✅ Success messages announced
- ✅ ARIA attributes present where needed

---

### Scenario 14.3: Color Contrast
**Feature:** Visual Accessibility
**Objective:** Verify sufficient color contrast

**Tools:** Browser DevTools Lighthouse or WAVE

**Steps:**
1. Run accessibility audit
2. Check contrast ratios:
   - Button text on background
   - Link text
   - Status indicators
   - Character counter colors
   - Error/success messages

**Expected Result:**
- ✅ All text meets WCAG AA standard (4.5:1)
- ✅ Large text meets 3:1 ratio
- ✅ Status indicators have 3:1 contrast
- ✅ No color-only indicators (use icons too)

---

### Scenario 14.4: Form Labels and ARIA
**Feature:** Semantic HTML
**Objective:** Verify proper labeling

**Steps:**
1. Inspect post composer form
2. Check for:
   - `<label>` elements
   - `aria-label` attributes
   - `aria-describedby` for errors
   - `role` attributes where needed
3. Validate HTML

**Expected Result:**
- ✅ All form inputs have labels
- ✅ Error messages associated with fields
- ✅ Buttons have descriptive text
- ✅ No HTML validation errors
- ✅ Proper heading hierarchy (h1, h2, h3)

---

### Scenario 14.5: Zoom and Text Resize
**Feature:** Responsive Text
**Objective:** Test at different zoom levels

**Steps:**
1. Zoom browser to 200%
2. Navigate LinkedIn page
3. Test all functionality
4. Zoom to 400% (if supported)
5. Check text wrapping

**Expected Result:**
- ✅ Layout doesn't break at 200% zoom
- ✅ All text readable
- ✅ No horizontal scrolling (vertical OK)
- ✅ Buttons still clickable
- ✅ Form usable

---

## Monitoring and Logging

### Scenario 15.1: Backend Logging Verification
**Feature:** Server Logging
**Objective:** Verify proper logging

**Steps:**
1. Start backend with logging enabled
2. Perform actions:
   - Connect LinkedIn
   - Publish post
   - Disconnect
3. Check console logs

**Expected Logs:**
```
OAuth callback received
State validated: true
Code exchange successful
User profile fetched: [Name]
Tokens stored for user_id: 1
---
Publishing post for user_id: 1
Post published: urn:li:share:...
Post saved to database: id=1
---
Disconnecting LinkedIn for user_id: 1
Tokens deleted
```

**Expected Result:**
- ✅ All key actions logged
- ✅ No sensitive data logged (tokens, passwords)
- ✅ User IDs included for tracing
- ✅ Errors logged with stack traces
- ✅ Log level appropriate (info, warn, error)

---

### Scenario 15.2: Error Logging
**Feature:** Error Tracking
**Objective:** Verify errors logged properly

**Steps:**
1. Trigger various errors:
   - Token expiration
   - API failure
   - Database error
   - Network timeout
2. Check error logs

**Expected Logs:**
```
ERROR: LinkedIn token expired for user_id: 1
ERROR: Failed to publish post: LinkedIn API error
ERROR: Database query failed: connection timeout
```

**Expected Result:**
- ✅ All errors logged with context
- ✅ Error messages clear
- ✅ Stack traces included
- ✅ User IDs for debugging
- ✅ No sensitive data exposed

---

### Scenario 15.3: Frontend Console Logs
**Feature:** Client-Side Logging
**Objective:** Verify clean console

**Steps:**
1. Open browser DevTools console
2. Navigate to `/linkedin`
3. Complete full workflow
4. Check for errors or warnings

**Expected Result:**
- ✅ No console errors
- ✅ No 404 errors for resources
- ✅ No CORS errors
- ✅ No React warnings
- ✅ API calls logged in Network tab

---

### Scenario 15.4: Network Request Monitoring
**Feature:** API Monitoring
**Objective:** Monitor all API calls

**Steps:**
1. Open DevTools Network tab
2. Filter: XHR/Fetch
3. Perform actions and observe requests:
   - GET `/api/admin/linkedin/status`
   - GET `/api/admin/linkedin/oauth/login`
   - POST `/api/admin/linkedin/posts`
   - GET `/api/admin/linkedin/posts`
   - GET `/api/admin/linkedin/stats`
   - DELETE `/api/admin/linkedin/disconnect`

**Expected Result:**
- ✅ All requests return expected status codes
- ✅ Response times reasonable (< 2s)
- ✅ Proper headers set (Content-Type, Authorization)
- ✅ No failed requests
- ✅ Response payloads correct

**Screenshot Location:** `screenshots/phase4/network-monitoring.png`

---

### Scenario 15.5: Database Query Logging
**Feature:** Query Performance
**Objective:** Monitor database queries

**Steps:**
1. Enable PostgreSQL query logging:
   ```sql
   ALTER DATABASE dmat_dev SET log_statement = 'all';
   SELECT pg_reload_conf();
   ```
2. Perform actions
3. Check PostgreSQL logs

**Expected Result:**
- ✅ All queries logged
- ✅ Queries use parameterized statements
- ✅ No N+1 query problems
- ✅ Efficient queries (use indexes)
- ✅ Transaction boundaries correct

---

## Production Readiness

### Scenario 16.1: Environment Variables Check
**Feature:** Configuration Management
**Objective:** Verify all required env vars set

**Checklist:**
```bash
# Backend .env
- [ ] LINKEDIN_CLIENT_ID (not empty)
- [ ] LINKEDIN_CLIENT_SECRET (not empty)
- [ ] LINKEDIN_REDIRECT_URI (correct domain)
- [ ] JWT_SECRET (strong random value)
- [ ] DB_* variables (correct for production)
- [ ] NODE_ENV=production
```

**Production Specific:**
- ✅ HTTPS redirect URI (not HTTP)
- ✅ No default/example values
- ✅ Secrets not in version control
- ✅ Environment-specific configs

---

### Scenario 16.2: Security Headers Check
**Feature:** HTTP Security
**Objective:** Verify security headers

**Steps:**
1. Check response headers in production:
   ```bash
   curl -I https://yourdomain.com/api/health
   ```

**Expected Headers:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

**Expected Result:**
- ✅ All security headers present
- ✅ HTTPS enforced
- ✅ Secure cookies (httpOnly, secure)

---

### Scenario 16.3: Database Backup Verification
**Feature:** Data Protection
**Objective:** Verify backup process

**Steps:**
1. Check backup schedule configured
2. Verify backup includes LinkedIn tables:
   ```bash
   pg_dump dmat_dev -t linkedin_oauth_tokens -t linkedin_posts
   ```
3. Test restore process

**Expected Result:**
- ✅ Regular backups scheduled
- ✅ LinkedIn tables included
- ✅ Can restore from backup
- ✅ Backup stored securely

---

### Scenario 16.4: Rate Limiting Check
**Feature:** API Protection
**Objective:** Verify rate limiting (if implemented)

**Steps:**
1. Make 100 requests rapidly to publish endpoint
2. Check for rate limit response

**Expected Result:**
- ✅ Rate limiting active (if implemented)
- ✅ 429 Too Many Requests returned
- ✅ Retry-After header present
- ✅ LinkedIn API rate limits respected

---

### Scenario 16.5: Monitoring and Alerts
**Feature:** System Monitoring
**Objective:** Verify monitoring setup

**Checklist:**
- [ ] Application logs centralized (e.g., CloudWatch, Papertrail)
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Uptime monitoring (e.g., UptimeRobot)
- [ ] Performance monitoring (e.g., New Relic)
- [ ] Alert rules configured:
  - High error rate
  - API latency > 2s
  - Database connection failures
  - OAuth failures > threshold

---

## Common Issues and Troubleshooting

### Issue 1: "LinkedIn account not connected" when it should be

**Symptoms:**
- User sees "Connected" but gets error when publishing

**Diagnosis:**
```sql
SELECT
  user_id,
  expires_at,
  expires_at < NOW() as is_expired
FROM linkedin_oauth_tokens
WHERE user_id = ?;
```

**Solutions:**
- If `is_expired = true`: Reconnect account
- If no row: Tokens lost, reconnect
- If valid token: Check backend logs for API error

---

### Issue 2: OAuth callback fails with "Invalid state"

**Symptoms:**
- Redirect from LinkedIn fails
- Error: "Invalid state parameter"

**Diagnosis:**
- CSRF token mismatch
- Session expired during OAuth

**Solutions:**
1. Clear browser cookies
2. Try OAuth flow again
3. Check session storage working
4. Verify state generation/validation in backend

---

### Issue 3: Posts not appearing on LinkedIn

**Symptoms:**
- DMAT shows "published successfully"
- Post history shows post
- Post NOT visible on LinkedIn

**Diagnosis:**
```sql
SELECT
  post_content,
  linkedin_urn,
  post_url,
  status
FROM linkedin_posts
WHERE id = ?;
```

**Solutions:**
1. Check `linkedin_urn` is valid URN format
2. Try URL in browser: `post_url`
3. Check LinkedIn privacy settings
4. Verify scope `w_member_social` granted
5. Check LinkedIn account not restricted

---

### Issue 4: Character counter showing wrong count

**Symptoms:**
- Counter doesn't match actual characters
- Emoji counted incorrectly

**Diagnosis:**
- JavaScript `length` vs visual characters
- Emoji may be 2+ code units

**Solutions:**
- Use proper character counting:
  ```javascript
  [...text].length  // Count code points correctly
  ```
- Test with emoji: 😀 🚀 ❤️

---

### Issue 5: Database migration fails

**Symptoms:**
- `004_create_linkedin_tables.sql` errors
- Tables not created

**Common Errors:**
```
ERROR: relation "linkedin_oauth_tokens" already exists
```

**Solutions:**
1. Check if tables already exist:
   ```sql
   \dt linkedin*
   ```
2. If exist, verify schema matches:
   ```sql
   \d linkedin_oauth_tokens
   \d linkedin_posts
   ```
3. If schema wrong, drop and recreate:
   ```sql
   DROP TABLE linkedin_posts;
   DROP TABLE linkedin_oauth_tokens;
   -- Re-run migration
   ```

---

### Issue 6: "Failed to fetch user profile" error

**Symptoms:**
- OAuth code exchange works
- Profile fetch fails

**Diagnosis:**
- OpenID Connect endpoint issue
- Scope `openid profile email` not granted

**Solutions:**
1. Verify scopes in LinkedIn app settings
2. Check "Sign In with LinkedIn using OpenID Connect" approved
3. Try re-requesting permissions
4. Check access token valid

---

## Test Data Management

### Scenario 17.1: Test Data Setup
**Feature:** Test Environment Preparation
**Objective:** Create consistent test data

**SQL Script:**
```sql
-- Create test user (if not exists)
INSERT INTO users (username, email, password_hash, role, created_at)
VALUES ('testuser', 'test@example.com', '$2a$10$...', 'admin', NOW())
ON CONFLICT (username) DO NOTHING
RETURNING id;

-- Clear existing test data
DELETE FROM linkedin_posts WHERE user_id = (SELECT id FROM users WHERE username = 'testuser');
DELETE FROM linkedin_oauth_tokens WHERE user_id = (SELECT id FROM users WHERE username = 'testuser');

-- Reset sequences
SELECT setval('linkedin_posts_id_seq', (SELECT COALESCE(MAX(id), 0) FROM linkedin_posts) + 1);
SELECT setval('linkedin_oauth_tokens_id_seq', (SELECT COALESCE(MAX(id), 0) FROM linkedin_oauth_tokens) + 1);
```

---

### Scenario 17.2: Test Data Cleanup
**Feature:** Post-Test Cleanup
**Objective:** Remove test data

**Cleanup Script:**
```sql
-- Delete test posts from LinkedIn (manual via LinkedIn)

-- Delete from database
DELETE FROM linkedin_posts
WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'test%')
  AND published_at > NOW() - INTERVAL '1 hour';

-- Optionally disconnect test accounts
DELETE FROM linkedin_oauth_tokens
WHERE user_id IN (SELECT id FROM users WHERE username LIKE 'test%');
```

**Expected Result:**
- ✅ Test data removed
- ✅ Production data untouched
- ✅ Test posts manually deleted from LinkedIn

---

### Scenario 17.3: Data Anonymization for Testing
**Feature:** Privacy Protection
**Objective:** Create safe test data

**Steps:**
1. Copy production data to test environment
2. Anonymize sensitive fields:
```sql
UPDATE linkedin_oauth_tokens SET
  access_token = 'REDACTED_' || id,
  refresh_token = 'REDACTED_' || id,
  linkedin_user_email = 'test' || user_id || '@example.com';

UPDATE linkedin_posts SET
  post_content = 'Test post ' || id;
```

**Expected Result:**
- ✅ Realistic data structure
- ✅ No real tokens exposed
- ✅ No personal information
- ✅ Can't post to real LinkedIn

---

## Acceptance Criteria

### Phase 4 is COMPLETE when:

#### Functionality
- [x] LinkedIn OAuth 2.0 works (connect/disconnect)
- [x] Text post publishing works
- [x] Post history displays correctly
- [x] Post statistics accurate
- [x] Character counter functional
- [x] All validation rules enforced

#### User Experience
- [x] UI intuitive and clear
- [x] Error messages helpful
- [x] Success feedback immediate
- [x] Loading states shown
- [x] Responsive design works

#### Technical
- [x] Database schema implemented
- [x] API endpoints functional
- [x] OAuth flow secure (CSRF protection)
- [x] JWT authentication on all routes
- [x] Foreign keys and constraints working
- [x] No SQL injection vulnerabilities
- [x] No XSS vulnerabilities

#### Testing
- [x] All test scenarios pass
- [x] API testing complete
- [x] Database testing done
- [x] Security testing passed
- [x] Browser compatibility verified

#### Documentation
- [x] Phase 4 documentation complete
- [x] Testing scenarios documented
- [x] Setup guide clear
- [x] Known limitations documented

---

## Test Summary Template

Use this template to record test results:

```markdown
## Test Execution Summary

**Date:** YYYY-MM-DD
**Tester:** [Name]
**Environment:** Development / Staging / Production
**Build Version:** [Version]

### Test Results

| Scenario | Status | Notes |
|----------|--------|-------|
| 1.1 Initial Status | ✅ Pass | - |
| 1.2 OAuth Flow | ✅ Pass | - |
| 1.3 Authorization | ✅ Pass | - |
| 2.1 Simple Post | ✅ Pass | - |
| 2.2 Character Counter | ✅ Pass | - |
| ... | ... | ... |

### Summary Statistics

- **Total Scenarios:** 60+
- **Passed:** 0
- **Failed:** 0
- **Blocked:** 0
- **Skipped:** 0

### Critical Issues Found

1. [Issue description]
   - **Severity:** High/Medium/Low
   - **Steps to Reproduce:** ...
   - **Expected:** ...
   - **Actual:** ...

### Recommendations

- [Recommendation 1]
- [Recommendation 2]

### Sign-off

- [x] All critical scenarios passed
- [x] All blocking issues resolved
- [x] Phase 4 ready for production

**Approved by:** [Name]
**Date:** YYYY-MM-DD
```

---

## Appendix: Quick Reference

### Test User Credentials
```
Username: admin
Password: admin123
```

### API Base URL
```
Backend: http://localhost:5001
Frontend: http://localhost:5173
```

### Database Connection
```bash
psql -d dmat_dev
```

### Common SQL Queries
```sql
-- Check connection
SELECT * FROM linkedin_oauth_tokens WHERE user_id = 1;

-- Check posts
SELECT * FROM linkedin_posts WHERE user_id = 1 ORDER BY published_at DESC;

-- Count posts
SELECT COUNT(*) FROM linkedin_posts WHERE user_id = 1;

-- Clear test data
DELETE FROM linkedin_posts WHERE user_id = 1;
DELETE FROM linkedin_oauth_tokens WHERE user_id = 1;
```

### cURL Examples
```bash
# Status check
curl http://localhost:5001/api/admin/linkedin/status \
  -H "Authorization: Bearer $TOKEN"

# Publish post
curl -X POST http://localhost:5001/api/admin/linkedin/posts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Test post"}'

# Get history
curl http://localhost:5001/api/admin/linkedin/posts \
  -H "Authorization: Bearer $TOKEN"
```

---

**Document End - Phase 4 Testing Scenarios**

**Total Scenarios:** 95+
**Coverage:** Comprehensive (Functional, Security, Performance, Accessibility, Production Readiness)
**Estimated Testing Time:**
- **Complete Coverage:** 8-10 hours (all scenarios)
- **Core Functional:** 3-4 hours (critical features)
- **Quick Smoke Test:** 30 minutes (happy path only)

**Test Categories:**
- Environment Setup: 3 scenarios
- OAuth Integration: 7 scenarios
- Post Publishing: 10 scenarios
- Post History: 6 scenarios
- Statistics: 4 scenarios
- Account Management: 4 scenarios
- Error Handling: 10 scenarios
- API Testing: 8 scenarios
- Database Testing: 5 scenarios
- Security Testing: 5 scenarios
- Integration Testing: 4 scenarios
- Performance Testing: 4 scenarios
- Browser Compatibility: 4 scenarios
- Regression Testing: 4 scenarios
- Accessibility Testing: 5 scenarios
- Monitoring/Logging: 5 scenarios
- Production Readiness: 5 scenarios
- Test Data Management: 3 scenarios

**Next Steps After Testing:**
1. ✅ Complete all critical path scenarios (1-7)
2. ✅ Document any bugs found with screenshots
3. ✅ Verify acceptance criteria met
4. ✅ Get stakeholder sign-off
5. ✅ Deploy to production
6. ✅ Monitor production logs for 48 hours
7. ✅ User training and documentation handoff
