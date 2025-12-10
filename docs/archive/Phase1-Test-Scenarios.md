# Phase 1 Test Scenarios - Comprehensive Testing Guide

**Version:** 1.0
**Date:** 2025-12-04
**Purpose:** Define realistic test scenarios to verify DMAT Phase 1 functionality

---

## 📋 Overview

This document defines comprehensive test scenarios for DMAT Phase 1. These scenarios cover end-to-end user flows, API testing, security testing, error handling, and edge cases.

**Testing Goals:**
- Verify all features work as specified
- Ensure security controls are enforced
- Validate error handling is user-friendly
- Confirm data integrity throughout workflows
- Test realistic usage patterns

**Testing Approach:**
- **Manual Testing:** For user flows and UI/UX validation
- **Automated Testing:** For API endpoints and regression testing
- **Security Testing:** For authentication and authorization
- **Performance Testing:** For rate limiting and load handling (Phase 2)

**Related Documentation:**
- [Phase1-Security-Access-Control.md](./Phase1-Security-Access-Control.md)
- [Phase1-Protected-Public-Endpoints.md](./Phase1-Protected-Public-Endpoints.md)
- All Phase 1 API and design specifications

---

## 🎯 Test Scenario Categories

1. **User Authentication Flows** - Login, logout, session management
2. **Landing Page Management** - Create, edit, publish, delete
3. **Lead Capture Flows** - Form submission, validation, storage
4. **Lead Management** - View, filter, sort, export, status updates
5. **Security & Access Control** - Authentication, authorization, ownership
6. **Error Handling** - Validation errors, network errors, edge cases
7. **UI/UX Testing** - Responsive design, accessibility, user experience
8. **Integration Testing** - End-to-end workflows across features

---

## 🔐 Category 1: User Authentication Flows

### Scenario 1.1: Successful Login

**Objective:** Verify user can log in with valid credentials

**Preconditions:**
- User account exists with email: `user@example.com`, password: `SecurePass123!`

**Steps:**
1. Navigate to `/login`
2. Enter email: `user@example.com`
3. Enter password: `SecurePass123!`
4. Click "Login" button

**Expected Results:**
- ✅ Login successful
- ✅ JWT token received and stored in localStorage
- ✅ User redirected to `/admin/landing-pages`
- ✅ User info displayed in header/sidebar

**Test Data:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

---

### Scenario 1.2: Failed Login - Invalid Email

**Objective:** Verify login fails with invalid email

**Steps:**
1. Navigate to `/login`
2. Enter email: `nonexistent@example.com`
3. Enter password: `AnyPassword123!`
4. Click "Login" button

**Expected Results:**
- ❌ Login failed
- ❌ Error message displayed: "Invalid email or password"
- ❌ No token stored
- ❌ User remains on login page

---

### Scenario 1.3: Failed Login - Invalid Password

**Objective:** Verify login fails with wrong password

**Steps:**
1. Navigate to `/login`
2. Enter email: `user@example.com`
3. Enter password: `WrongPassword123!`
4. Click "Login" button

**Expected Results:**
- ❌ Login failed
- ❌ Error message displayed: "Invalid email or password"
- ❌ No token stored
- ❌ User remains on login page

---

### Scenario 1.4: Access Protected Route Without Login

**Objective:** Verify unauthenticated users cannot access admin pages

**Steps:**
1. Ensure no auth token in localStorage (clear browser data)
2. Attempt to navigate directly to `/admin/landing-pages`

**Expected Results:**
- ❌ Access denied
- ✅ Redirected to `/login`
- ✅ Message displayed: "Please log in to continue"
- ✅ After login, redirected back to intended page

---

### Scenario 1.5: Session Expiration

**Objective:** Verify expired token handling

**Preconditions:**
- User logged in with token that expires in 1 minute (for testing)

**Steps:**
1. User logged in and browsing admin dashboard
2. Wait for token to expire (or manually set expired token)
3. Make any API request (e.g., load landing pages list)

**Expected Results:**
- ❌ API returns 401 with `TOKEN_EXPIRED` code
- ✅ Message displayed: "Your session has expired. Please log in again."
- ✅ User redirected to `/login`
- ✅ Intended URL preserved for post-login redirect

---

### Scenario 1.6: Logout

**Objective:** Verify user can log out successfully

**Steps:**
1. User logged in and on any admin page
2. Click "Logout" button in header/sidebar

**Expected Results:**
- ✅ Token removed from localStorage
- ✅ User state cleared
- ✅ Redirected to `/login`
- ✅ Message displayed: "You have been logged out successfully"
- ✅ Cannot access admin pages without logging in again

---

## 📄 Category 2: Landing Page Management

### Scenario 2.1: Create Landing Page → Save Draft → Edit → Publish (CRITICAL PATH)

**Objective:** Verify complete landing page lifecycle

**Steps:**

**Part 1: Create and Save Draft**
1. User logs in successfully
2. Navigate to `/admin/landing-pages`
3. Click "+ New Landing Page" button
4. Navigate to `/admin/landing-pages/new`
5. Fill in form:
   - Title: "Free Marketing Guide 2025"
   - Slug: Auto-generated "free-marketing-guide-2025"
   - Headline: "Download Your Free Digital Marketing Guide"
   - Subheading: "Learn the latest strategies"
   - Body Text: "Our comprehensive guide covers..."
   - CTA Text: "Get Your Free Guide"
   - Form Fields: Check Name, Email, Phone
6. Click "Save Draft" button

**Expected Results (Part 1):**
- ✅ API call: POST /api/admin/landing-pages
- ✅ Success message: "Draft saved successfully"
- ✅ URL updates to `/admin/landing-pages/:id/edit`
- ✅ Status badge shows "Draft"
- ✅ New page appears in landing pages list with "Draft" status

**Part 2: Edit Draft**
7. Make changes to headline: "Get Your Free Marketing Guide 2025"
8. Add company field: Check "Company" checkbox
9. Click "Save Draft" again

**Expected Results (Part 2):**
- ✅ API call: PUT /api/admin/landing-pages/:id
- ✅ Success message: "Draft saved successfully"
- ✅ Changes reflected in form
- ✅ Status remains "Draft"

**Part 3: Publish**
10. Click "Publish" button
11. Confirm in warning modal if prompted about missing fields

**Expected Results (Part 3):**
- ✅ API call: POST /api/admin/landing-pages/:id/publish
- ✅ Status badge changes to "Published" (green)
- ✅ Published URL displayed with "View Page" link
- ✅ Success message: "Landing page published successfully!"
- ✅ List shows "Published" status
- ✅ Published URL is accessible

**Part 4: Verify Published Page**
12. Click "View Page" link or copy published URL
13. Open in new tab (logged out state)

**Expected Results (Part 4):**
- ✅ Published page loads without authentication
- ✅ Headline displays correctly
- ✅ Form shows: Name, Email, Phone, Company fields
- ✅ CTA button shows: "Get Your Free Guide"
- ✅ Form action points to lead capture API

**Test Data:**
```json
{
  "title": "Free Marketing Guide 2025",
  "slug": "free-marketing-guide-2025",
  "headline": "Download Your Free Digital Marketing Guide",
  "subheading": "Learn the latest strategies",
  "body_text": "Our comprehensive 50-page guide covers SEO, social media, content marketing, and more.",
  "cta_text": "Get Your Free Guide",
  "form_fields": {
    "fields": [
      {"name": "name", "type": "text", "required": true, "label": "Full Name"},
      {"name": "email", "type": "email", "required": true, "label": "Email Address"},
      {"name": "phone", "type": "tel", "required": false, "label": "Phone Number"},
      {"name": "company", "type": "text", "required": false, "label": "Company"}
    ]
  }
}
```

---

### Scenario 2.2: Auto-Save Draft

**Objective:** Verify auto-save functionality

**Steps:**
1. User on edit page for a landing page
2. Make a change to title field
3. Stop typing and wait 5 seconds (auto-save debounce)

**Expected Results:**
- ✅ "Saving..." indicator appears
- ✅ API call: PUT /api/admin/landing-pages/:id
- ✅ "Saved" indicator appears briefly
- ✅ "Last saved: just now" timestamp updated
- ✅ Changes persisted (reload page to verify)

---

### Scenario 2.3: Slug Uniqueness Check

**Objective:** Verify slug uniqueness validation

**Preconditions:**
- Landing page exists with slug "marketing-guide"

**Steps:**
1. Create new landing page
2. Enter title: "Marketing Guide"
3. Slug auto-generates to "marketing-guide"
4. Slug field loses focus (blur event)

**Expected Results:**
- ✅ Real-time API call: GET /api/admin/landing-pages?slug=marketing-guide
- ✅ Response shows existing page with that slug
- ❌ Red X appears next to slug field
- ❌ Error message: "This slug is already in use. Please choose another."
- ❌ "Save Draft" and "Publish" buttons disabled

**Resolution:**
5. Change slug to "marketing-guide-2025"
6. Slug field loses focus

**Expected Results:**
- ✅ Green checkmark appears
- ✅ No error message
- ✅ Buttons enabled

---

### Scenario 2.4: Publish with Missing Recommended Fields

**Objective:** Verify warning for missing non-required fields

**Steps:**
1. Create landing page with only Title and Slug (no headline, body, image)
2. Click "Publish" button

**Expected Results:**
- ⚠️ Warning modal appears:
  - "Some recommended fields are missing:"
  - • Headline
  - • Body Text
  - • Hero Image
  - "Publish anyway?"
  - Buttons: [Go Back] [Publish Anyway]
3. Click "Publish Anyway"

**Expected Results:**
- ✅ Page publishes successfully
- ✅ Published page renders without missing fields (uses defaults)

---

### Scenario 2.5: Delete Landing Page

**Objective:** Verify landing page deletion

**Steps:**
1. Open edit page for a draft landing page
2. Click "Delete" button (bottom left, red text)
3. Confirmation modal appears:
   - "Delete Landing Page?"
   - "This action cannot be undone. All data will be permanently deleted."
   - Buttons: [Cancel] [Delete Forever]
4. Click "Delete Forever"

**Expected Results:**
- ✅ API call: DELETE /api/admin/landing-pages/:id
- ✅ Success message: "Landing page deleted successfully"
- ✅ Redirected to `/admin/landing-pages`
- ✅ Page no longer appears in list
- ✅ Published URL returns 404 (if was published)

---

### Scenario 2.6: Edit Published Landing Page

**Objective:** Verify editing and republishing

**Preconditions:**
- Landing page already published

**Steps:**
1. Open edit page for published landing page
2. Status badge shows "Published"
3. Make changes to headline
4. Auto-save triggers (or manual save)
5. Click "Update & Republish" button

**Expected Results:**
- ✅ API call: PUT /api/admin/landing-pages/:id (save)
- ✅ API call: POST /api/admin/landing-pages/:id/publish (republish)
- ✅ Success message: "Landing page updated and republished"
- ✅ Published URL shows updated content
- ✅ `published_at` timestamp preserved (not updated)

---

### Scenario 2.7: List Landing Pages with Filters

**Objective:** Verify list filtering works

**Preconditions:**
- Multiple landing pages exist with different statuses

**Steps:**
1. Navigate to `/admin/landing-pages`
2. All pages displayed (default view)
3. Select "Published" from Status filter

**Expected Results:**
- ✅ List updates to show only published pages
- ✅ Draft pages hidden
- ✅ Results count updates: "Showing X published pages"

4. Select "Draft" from Status filter

**Expected Results:**
- ✅ List updates to show only draft pages
- ✅ Results count updates

---

## 📝 Category 3: Lead Capture Flows

### Scenario 3.1: Submit Valid Form → Lead Appears in DMAT (CRITICAL PATH)

**Objective:** Verify complete lead capture and storage flow

**Preconditions:**
- Landing page published at: `https://dmat-app.example.com/pages/free-marketing-guide.html`
- Page has form fields: Name, Email, Phone, Company

**Steps:**

**Part 1: Submit Form**
1. Open published landing page URL (not logged in)
2. Fill out form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "(555) 123-4567"
   - Company: "Acme Corporation"
3. Click "Get Your Free Guide" button

**Expected Results (Part 1):**
- ✅ API call: POST /api/public/leads
- ✅ Request includes all form data + metadata (referrer, landing URL, user agent, IP)
- ✅ Response: 201 Created
- ✅ Success message displayed: "Thank you for your submission!"
- ✅ Form cleared or confirmation page shown

**Part 2: Verify Lead in DMAT**
4. Log in to DMAT as landing page owner
5. Navigate to `/admin/leads`

**Expected Results (Part 2):**
- ✅ New lead appears at top of list (newest first)
- ✅ Name: "John Doe"
- ✅ Email: "john@example.com"
- ✅ Phone: "(555) 123-4567"
- ✅ Landing Page: "Free Marketing Guide 2025"
- ✅ Status: "New" (blue badge)
- ✅ Created At: "just now" or "X minutes ago"

**Part 3: View Lead Details**
6. Click on "John Doe" row

**Expected Results (Part 3):**
- ✅ Side panel opens with full lead details
- ✅ Contact Information section shows all submitted fields
- ✅ Company: "Acme Corporation"
- ✅ Landing Page section shows page title and URL
- ✅ Source Data section shows referrer URL
- ✅ Metadata section shows IP address, user agent, timestamp

**Test Data:**
```json
{
  "landing_page_id": 42,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "company": "Acme Corporation",
  "referrer_url": "https://www.google.com/search?q=marketing+guide",
  "landing_url": "https://dmat-app.example.com/pages/free-marketing-guide.html",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
  "ip_address": "192.168.1.100"
}
```

---

### Scenario 3.2: Submit with Missing Required Fields → Appropriate Error (CRITICAL PATH)

**Objective:** Verify validation for required fields

**Preconditions:**
- Published landing page with form fields: Name (required), Email (required), Phone (optional)

**Steps:**
1. Open published landing page
2. Fill out form:
   - Name: "Jane Smith"
   - Email: (leave empty)
   - Phone: "(555) 987-6543"
3. Click submit button

**Expected Results:**
- ❌ Form submission blocked (client-side validation)
- ❌ Email field highlighted with red border
- ❌ Error message below email field: "Email is required"
- ❌ No API call made
- ❌ Lead not created in database

**Alternative: Backend Validation**
4. Bypass client-side validation (e.g., via API tool)
5. Submit request with missing email

**Expected Results:**
- ❌ API returns 400 Bad Request
- ❌ Response includes validation error:
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Validation failed",
      "details": [
        {
          "field": "email",
          "message": "Email is required"
        }
      ]
    }
  }
  ```
- ❌ Lead not created

---

### Scenario 3.3: Submit with Invalid Email Format

**Objective:** Verify email format validation

**Steps:**
1. Open published landing page
2. Fill out form:
   - Name: "Test User"
   - Email: "invalid-email"
   - Phone: "(555) 111-2222"
3. Click submit button

**Expected Results:**
- ❌ Client-side validation error: "Please enter a valid email address"
- ❌ Email field highlighted
- ❌ No API call made

**Backend Test:**
4. Bypass client validation and submit

**Expected Results:**
- ❌ API returns 400 Bad Request
- ❌ Validation error: "Invalid email format"

---

### Scenario 3.4: Submit from Direct Visit (No Referrer)

**Objective:** Verify handling of direct traffic

**Steps:**
1. Type published URL directly in browser address bar (or bookmark)
2. Fill out and submit valid form

**Expected Results:**
- ✅ Form submits successfully
- ✅ Lead created with:
  - `referrer_url`: null
  - Source displayed as "Direct" in leads list
- ✅ All other fields captured correctly

---

### Scenario 3.5: Rate Limit Exceeded

**Objective:** Verify rate limiting on lead capture

**Steps:**
1. Open published landing page
2. Submit valid form 10 times within 60 seconds (same IP)
3. Attempt 11th submission

**Expected Results:**
- ✅ First 10 submissions succeed (201 Created)
- ❌ 11th submission fails: 429 Too Many Requests
- ❌ Error message: "Too many submissions. Please try again later."
- ✅ After 60 seconds, submissions allowed again

---

### Scenario 3.6: Bot Detection - Honeypot Field

**Objective:** Verify honeypot field blocks bots

**Steps:**
1. Open published landing page
2. Fill out form including honeypot field (hidden from humans):
   - Name: "Bot Submission"
   - Email: "bot@example.com"
   - Website: "https://spam-site.com" ← Honeypot field
3. Submit form

**Expected Results:**
- ❌ API returns 400 Bad Request
- ❌ Error code: "SPAM_DETECTED"
- ❌ Lead not created
- ✅ Response appears successful to bot (security measure)

---

## 👥 Category 4: Lead Management

### Scenario 4.1: View Leads List

**Objective:** Verify leads list displays correctly

**Preconditions:**
- 10+ leads exist in database from user's landing pages

**Steps:**
1. Log in and navigate to `/admin/leads`

**Expected Results:**
- ✅ Table displays with 7 columns: Name, Email, Phone, Landing Page, Created At, Source, Status
- ✅ Leads sorted by Created At descending (newest first)
- ✅ Only leads from user's landing pages visible
- ✅ Pagination controls shown if > 25 leads
- ✅ Results count: "Showing X leads" or "Showing 1-25 of X leads"

---

### Scenario 4.2: Filter Leads by Landing Page

**Objective:** Verify landing page filter

**Preconditions:**
- Leads from multiple landing pages exist

**Steps:**
1. On leads list page
2. Open "Landing Page" filter dropdown
3. Select "Free Marketing Guide 2025"

**Expected Results:**
- ✅ API call with filter: GET /api/admin/leads?landing_page_id=42
- ✅ List updates to show only leads from that page
- ✅ Other pages' leads hidden
- ✅ Results count updates
- ✅ "Clear Filters" button appears

---

### Scenario 4.3: Search Leads by Name/Email

**Objective:** Verify search functionality

**Steps:**
1. On leads list page
2. Type "john" in search field
3. Wait 300ms (debounce)

**Expected Results:**
- ✅ API call: GET /api/admin/leads?search=john
- ✅ List updates to show matching leads:
  - Name contains "john" (case-insensitive): "John Doe", "Johnny Smith"
  - Email contains "john": "mary@johnson.com"
- ✅ Results count: "Showing X leads matching 'john'"

---

### Scenario 4.4: Sort Leads by Name

**Objective:** Verify sorting functionality

**Steps:**
1. On leads list page (default sort: Created At ↓)
2. Click "Name" column header

**Expected Results:**
- ✅ API call: GET /api/admin/leads?sort_by=name&sort_order=asc
- ✅ Leads sorted alphabetically A-Z by name
- ✅ Sort indicator moves from "Created At" to "Name": ↑
- ✅ First lead: "Alice Johnson"

3. Click "Name" column header again

**Expected Results:**
- ✅ Leads sorted Z-A by name
- ✅ Sort indicator: ↓
- ✅ First lead: "Zoe Williams"

---

### Scenario 4.5: Update Lead Status

**Objective:** Verify status update workflow

**Steps:**
1. On leads list page
2. Click on a lead with status "New"
3. Side panel opens with lead details
4. Current status badge shows "New" (blue)
5. Open "Update Status" dropdown
6. Select "Contacted"
7. Click "Update Status" button

**Expected Results:**
- ✅ Button shows "Updating..." with spinner
- ✅ API call: PATCH /api/admin/leads/:id with {"status": "contacted"}
- ✅ Response: 200 OK
- ✅ Current status badge updates to "Contacted" (green)
- ✅ Success message: "✓ Status updated successfully"
- ✅ "Updated just now" timestamp shown
- ✅ **List row also updates** (status badge changes to "Contacted" without refresh)

---

### Scenario 4.6: Export Leads to CSV

**Objective:** Verify CSV export functionality

**Steps:**
1. On leads list page with 47 leads
2. Click "Export" button (top right)

**Expected Results:**
- ✅ Button shows "Exporting..." with spinner
- ✅ API call: GET /api/admin/leads/export?format=csv
- ✅ CSV file downloads: `leads-export-2025-12-04.csv`
- ✅ File contains 47 leads + header row (48 rows total)
- ✅ Columns: Name, Email, Phone, Company, Job Title, Landing Page, Created At, Source, Status
- ✅ Success toast: "✓ Leads exported successfully"
- ✅ Open in Excel → All data displays correctly

---

### Scenario 4.7: View Lead Details - All Fields

**Objective:** Verify all lead fields display correctly

**Steps:**
1. Click on lead with all optional fields filled
2. Side panel opens

**Expected Results:**
- ✅ Header: Name, Email, Status badge
- ✅ Contact Information:
  - Email (clickable, sends to mailto:)
  - Phone (clickable, sends to tel:)
  - Company
  - Job Title
  - Message (full text, multi-line)
- ✅ Landing Page:
  - Title
  - Published URL (clickable)
  - "View Page" and "Edit Page" links
- ✅ Source Data:
  - Full referrer URL
  - Full landing URL
  - Extracted source domain
- ✅ Metadata:
  - Submitted timestamp (absolute + relative)
  - IP address
  - User agent
  - Lead ID

---

### Scenario 4.8: View Lead with Missing Optional Fields

**Objective:** Verify handling of null/empty fields

**Steps:**
1. Lead submitted with only Name and Email (no phone, company, etc.)
2. View lead details in panel

**Expected Results:**
- ✅ Name: Displays "John Doe"
- ✅ Email: Displays "john@example.com"
- ✅ Phone: Shows "Not provided" (gray text)
- ✅ Company: Shows "Not provided"
- ✅ Job Title: Shows "Not provided"
- ✅ Message: Shows "No message provided"
- ✅ No errors or blank spaces

---

## 🔒 Category 5: Security & Access Control

### Scenario 5.1: Access Admin Endpoints Without Login → Denied (CRITICAL PATH)

**Objective:** Verify protected endpoints require authentication

**Steps:**
1. Clear browser data (no auth token)
2. Attempt to access via browser:
   - `/admin/landing-pages`
   - `/admin/leads`

**Expected Results:**
- ❌ Access denied
- ✅ Redirected to `/login`
- ✅ Message: "Please log in to continue"

3. Attempt API call without token:
   ```bash
   curl -X GET https://api.dmat.com/api/admin/landing-pages
   ```

**Expected Results:**
- ❌ Response: 401 Unauthorized
- ❌ Error: {"code": "UNAUTHORIZED", "message": "Authentication required"}

---

### Scenario 5.2: User Cannot Access Other User's Landing Pages

**Objective:** Verify resource ownership enforcement

**Preconditions:**
- User A owns Landing Page 42
- User B owns Landing Page 50
- User B logged in

**Steps:**
1. User B attempts to access User A's page:
   - Navigate to `/admin/landing-pages/42/edit`
   - Or API call: GET /api/admin/landing-pages/42

**Expected Results:**
- ❌ Access denied: 403 Forbidden
- ❌ Error message: "You don't have permission to access this resource"
- ✅ Page not visible in User B's list
- ✅ Edit form not accessible

---

### Scenario 5.3: User Cannot See Other User's Leads

**Objective:** Verify lead access control

**Preconditions:**
- User A has leads from their landing pages
- User B has leads from their landing pages
- User B logged in

**Steps:**
1. User B navigates to `/admin/leads`

**Expected Results:**
- ✅ Only User B's leads visible
- ✅ User A's leads not in list (filtered by backend)
- ✅ Attempting to access User A's lead by ID → 403 Forbidden

---

### Scenario 5.4: SQL Injection Prevention

**Objective:** Verify input sanitization

**Steps:**
1. Submit form with SQL injection attempt in name field:
   - Name: `'; DROP TABLE leads; --`
   - Email: "test@example.com"
2. Submit form

**Expected Results:**
- ✅ Lead created successfully (not blocked)
- ✅ Database not affected (parameterized queries prevent injection)
- ✅ Name stored exactly as entered (sanitized on display)
- ✅ View in leads list → Name displays safely (no script execution)

---

### Scenario 5.5: XSS Prevention

**Objective:** Verify script injection prevention

**Steps:**
1. Submit form with XSS attempt in message field:
   - Name: "Test User"
   - Email: "test@example.com"
   - Message: `<script>alert('XSS')</script>`
2. Submit form
3. View lead in admin panel

**Expected Results:**
- ✅ Lead created
- ✅ Message stored: `<script>alert('XSS')</script>` (raw text)
- ✅ View in panel → Message displays as plain text (no alert popup)
- ✅ Script tags escaped or stripped on display
- ✅ No JavaScript execution

---

### Scenario 5.6: CORS Validation

**Objective:** Verify CORS allows public lead capture

**Steps:**
1. Published page at: `https://dmat-app.example.com`
2. API at: `https://api.dmat.com`
3. Submit form from published page (cross-origin request)

**Expected Results:**
- ✅ Request allowed (CORS headers present)
- ✅ Response includes: `Access-Control-Allow-Origin: *` or specific domain
- ✅ Lead created successfully
- ✅ No CORS error in browser console

---

## ❌ Category 6: Error Handling

### Scenario 6.1: Network Error During Save

**Objective:** Verify graceful handling of network failures

**Steps:**
1. User editing landing page
2. Simulate network disconnection (browser DevTools → Offline)
3. Click "Save Draft"

**Expected Results:**
- ❌ Save fails (network timeout)
- ❌ Error message: "Failed to save draft. Please try again."
- ✅ Form data preserved (not lost)
- ✅ User can retry after reconnecting
- ✅ "Save Draft" button re-enabled

---

### Scenario 6.2: Server Error (500)

**Objective:** Verify 500 error handling

**Steps:**
1. Simulate server error (backend returns 500)
2. User attempts to load leads list

**Expected Results:**
- ❌ List fails to load
- ❌ Error state displayed:
  - Icon: ⚠️
  - Message: "Failed to load leads. Please try again."
  - Button: [Try Again]
- ✅ Click "Try Again" → Retries API call
- ✅ No blank white screen or unhandled error

---

### Scenario 6.3: Invalid Slug Format

**Objective:** Verify slug validation

**Steps:**
1. Create landing page
2. Manually edit slug to: "Invalid Slug!!!"
3. Attempt to save

**Expected Results:**
- ❌ Validation error: "Slug must contain only lowercase letters, numbers, and hyphens"
- ❌ Slug field highlighted red
- ❌ Save button disabled until fixed

---

### Scenario 6.4: Publish Failed (WordPress Connection Error)

**Objective:** Verify publish failure handling

**Steps:**
1. Create and save landing page
2. Click "Publish"
3. Backend publish call fails (WordPress/file system error)

**Expected Results:**
- ❌ Publish fails
- ❌ Status badge changes to "Publish Failed" (red)
- ❌ Error modal:
  - Title: "Publish Failed"
  - Message: "Failed to publish landing page: [error details]"
  - Buttons: [Try Again] [Back to Edit]
- ✅ Draft preserved (not lost)
- ✅ User can edit and retry publish

---

### Scenario 6.5: Landing Page Deleted While Editing

**Objective:** Verify handling of deleted resources

**Steps:**
1. User A opens edit page for Landing Page 42
2. User B (or admin) deletes Landing Page 42
3. User A clicks "Save Draft"

**Expected Results:**
- ❌ Save fails: 404 Not Found
- ❌ Error message: "This landing page has been deleted"
- ✅ Redirect to landing pages list after 3 seconds
- ✅ Page no longer in list

---

## 🎨 Category 7: UI/UX Testing

### Scenario 7.1: Responsive Design - Mobile

**Objective:** Verify mobile layout works correctly

**Steps:**
1. Open DMAT on mobile device (or browser DevTools → iPhone 12)
2. Navigate through all pages:
   - Login page
   - Landing pages list
   - Create/edit landing page
   - Leads list
   - Lead details

**Expected Results:**
- ✅ All pages render correctly (no horizontal scroll)
- ✅ Buttons are touch-friendly (min 44px height)
- ✅ Text is readable (min 16px font size)
- ✅ Forms are usable (fields stack vertically)
- ✅ Navigation menu collapses to hamburger
- ✅ Tables convert to card view on small screens
- ✅ Lead details panel becomes full-screen overlay

---

### Scenario 7.2: Keyboard Navigation

**Objective:** Verify keyboard accessibility

**Steps:**
1. Open landing page create form
2. Use only keyboard (Tab, Enter, Escape)
3. Navigate through all fields and buttons

**Expected Results:**
- ✅ Tab moves focus through all interactive elements in logical order
- ✅ Focus indicators visible (blue outline)
- ✅ Enter activates buttons
- ✅ Escape closes modals/panels
- ✅ No keyboard traps
- ✅ Can complete all tasks without mouse

---

### Scenario 7.3: Screen Reader Compatibility

**Objective:** Verify screen reader support

**Steps:**
1. Enable screen reader (NVDA, JAWS, VoiceOver)
2. Navigate landing pages list
3. Navigate to create form

**Expected Results:**
- ✅ Table structure announced correctly
- ✅ Column headers read
- ✅ Form labels associated with inputs
- ✅ Error messages announced
- ✅ Status changes announced (aria-live regions)
- ✅ Button purposes clear

---

### Scenario 7.4: Color Contrast (WCAG AA)

**Objective:** Verify sufficient color contrast

**Steps:**
1. Use browser extension or tool to check contrast ratios
2. Check all text elements, buttons, and interactive elements

**Expected Results:**
- ✅ Body text: 4.5:1 minimum ratio
- ✅ Large text (18px+): 3:1 minimum
- ✅ Interactive elements: 3:1 minimum
- ✅ Status badges meet contrast requirements
- ✅ Link colors distinguishable from text

---

## 🔗 Category 8: Integration Testing (End-to-End)

### Scenario 8.1: Complete User Journey - Marketing Manager

**Objective:** Test realistic end-to-end workflow

**Persona:** Sarah, Marketing Manager at a SaaS company

**Complete Workflow:**

1. **Login**
   - Sarah logs in to DMAT
   - Sees empty landing pages list (first time user)

2. **Create Landing Page**
   - Clicks "+ New Landing Page"
   - Creates "Free Demo" page
   - Adds headline, body text, form fields
   - Saves draft

3. **Preview and Edit**
   - Previews draft
   - Notices typo in headline
   - Edits and saves again

4. **Publish**
   - Clicks "Publish"
   - Gets warning about missing hero image
   - Publishes anyway
   - Copies published URL

5. **Share with Team**
   - Sends published URL to sales team
   - Sales team shares on social media

6. **First Lead Arrives**
   - Visitor fills out form
   - Sarah receives notification (Phase 2 feature)
   - Sarah opens DMAT, sees new lead in list

7. **Follow Up**
   - Views lead details
   - Copies email address
   - Sends follow-up email (outside DMAT)
   - Updates status to "Contacted"

8. **Track Leads**
   - More leads come in throughout the day
   - Sarah filters by "New" status
   - Reviews and updates statuses

9. **Weekly Export**
   - End of week, Sarah exports all leads
   - Sends CSV to CRM team for import

10. **Create Second Page**
    - Sarah creates another page for different campaign
    - Reuses similar structure (copy/paste content)
    - Publishes new page

**Success Criteria:**
- ✅ All steps complete without errors
- ✅ All features work as expected
- ✅ Data persists correctly
- ✅ Workflow feels natural and efficient

---

### Scenario 8.2: High Volume - 100 Leads in One Day

**Objective:** Verify system handles multiple leads

**Steps:**
1. Published landing page receives 100 form submissions in 24 hours
2. Various submission times, different referrers, different data

**Expected Results:**
- ✅ All 100 leads captured successfully
- ✅ No data loss
- ✅ Leads list loads quickly (< 2 seconds)
- ✅ Pagination works (4 pages at 25 per page)
- ✅ Export includes all 100 leads
- ✅ No duplicate submissions (unless legitimate)

---

## 📊 Test Coverage Summary

### Critical Path Scenarios (Must Pass)

These scenarios represent the most important user flows:

1. ✅ **User Login** (1.1)
2. ✅ **Create → Save → Edit → Publish Landing Page** (2.1)
3. ✅ **Submit Valid Form → Lead Appears** (3.1)
4. ✅ **Submit with Missing Required Fields → Error** (3.2)
5. ✅ **Access Protected Route Without Login → Denied** (5.1)
6. ✅ **View Leads List** (4.1)
7. ✅ **Update Lead Status** (4.5)

**Total Critical Scenarios:** 7

---

### All Test Scenarios by Category

| Category | Scenario Count | Critical |
|----------|----------------|----------|
| 1. Authentication | 6 | 1 |
| 2. Landing Page Management | 7 | 1 |
| 3. Lead Capture | 6 | 2 |
| 4. Lead Management | 8 | 2 |
| 5. Security & Access Control | 6 | 1 |
| 6. Error Handling | 5 | 0 |
| 7. UI/UX Testing | 4 | 0 |
| 8. Integration Testing | 2 | 0 |
| **Total** | **44** | **7** |

---

## 🛠️ Test Execution Plan

### Phase 1: Manual Testing (Week 1)

**Day 1: Critical Path**
- Run all 7 critical scenarios
- Fix any blockers immediately

**Day 2: Authentication & Security**
- Test all authentication flows
- Verify access control

**Day 3: Landing Pages**
- Test all landing page CRUD operations
- Verify publish workflow

**Day 4: Leads**
- Test lead capture and management
- Verify filtering, sorting, export

**Day 5: Error Handling & Edge Cases**
- Test all error scenarios
- Verify graceful degradation

---

### Phase 2: Automated Testing (Week 2)

**API Tests:**
- Write automated tests for all API endpoints
- Use tools: Jest, Supertest, or Postman/Newman
- Cover happy path + error cases

**Frontend Tests:**
- Write component tests (React Testing Library)
- Write E2E tests (Playwright or Cypress)
- Focus on critical paths first

**CI/CD Integration:**
- Run tests on every commit
- Prevent deployment if tests fail

---

### Phase 3: User Acceptance Testing (Week 3)

**Beta Testers:**
- Invite 3-5 users to test DMAT
- Provide test account and sample landing page
- Collect feedback on usability

**Scenarios:**
- Ask users to complete realistic workflows
- Observe where they struggle
- Track completion time

**Feedback Collection:**
- Survey after testing
- Bug reports
- Feature requests

---

## 📝 Test Data Setup

### Required Test Data

**Users:**
```
User 1 (Test Admin):
  - Email: admin@test.com
  - Password: TestAdmin123!

User 2 (Test User):
  - Email: user@test.com
  - Password: TestUser123!
```

**Landing Pages:**
```
Page 1 (Published):
  - Title: Free Marketing Guide 2025
  - Slug: free-marketing-guide-2025
  - Status: Published
  - Owner: User 1

Page 2 (Draft):
  - Title: Product Demo Sign-Up
  - Slug: product-demo-signup
  - Status: Draft
  - Owner: User 1

Page 3 (Published, owned by User 2):
  - Title: SEO Checklist
  - Slug: seo-checklist
  - Status: Published
  - Owner: User 2
```

**Leads:**
```
Create 20-50 sample leads with:
  - Various landing pages
  - Different statuses (New, Contacted, Qualified, Converted)
  - Different submission dates (last 30 days)
  - Mix of complete and partial data (some with phone/company, some without)
  - Various referrers (Google, Facebook, Direct, LinkedIn)
```

### Database Seed Script

```sql
-- Insert test users
INSERT INTO users (name, email, password_hash, created_at)
VALUES
  ('Test Admin', 'admin@test.com', '$2b$10$...', NOW()),
  ('Test User', 'user@test.com', '$2b$10$...', NOW());

-- Insert test landing pages
INSERT INTO landing_pages (title, slug, headline, created_by, publish_status, created_at)
VALUES
  ('Free Marketing Guide 2025', 'free-marketing-guide-2025', 'Download Your Free Guide', 1, 'published', NOW() - INTERVAL '7 days'),
  ('Product Demo Sign-Up', 'product-demo-signup', 'Schedule Your Demo', 1, 'draft', NOW() - INTERVAL '3 days'),
  ('SEO Checklist', 'seo-checklist', 'Get Your Free Checklist', 2, 'published', NOW() - INTERVAL '14 days');

-- Insert test leads (50 leads with variety)
-- (SQL generation script...)
```

---

## ✅ Test Results Template

### Test Execution Tracking

| Scenario ID | Scenario Name | Status | Tester | Date | Notes |
|-------------|---------------|--------|--------|------|-------|
| 1.1 | Successful Login | ✅ Pass | Sarah | 12/04 | - |
| 1.2 | Failed Login - Invalid Email | ✅ Pass | Sarah | 12/04 | - |
| 2.1 | Create → Publish Landing Page | ❌ Fail | John | 12/04 | Auto-save not working |
| 3.1 | Submit Form → Lead Appears | ✅ Pass | John | 12/04 | - |
| ... | ... | ... | ... | ... | ... |

**Status Values:**
- ✅ Pass - Test passed all criteria
- ❌ Fail - Test failed, bug found
- ⚠️ Partial - Test passed with minor issues
- ⏸️ Blocked - Cannot test (dependency not ready)
- ⏭️ Skipped - Intentionally skipped

---

## 🐛 Bug Report Template

```
BUG #001: Auto-save not triggering after typing

Severity: High
Category: Landing Pages
Scenario: 2.2 (Auto-Save Draft)

Steps to Reproduce:
1. Open edit page for landing page
2. Change title field
3. Stop typing for 5+ seconds

Expected Result:
- "Saving..." indicator appears
- API call made
- "Saved" indicator shown

Actual Result:
- Nothing happens
- No API call
- Changes not saved

Environment:
- Browser: Chrome 120
- OS: Windows 11
- User: admin@test.com

Screenshot: [attached]
Console Logs: [attached]

Priority: P1 (Blocks critical scenario)
Assigned To: [Developer Name]
Status: Open
```

---

## 📚 Related Documentation

- **Security:** [Phase1-Security-Access-Control.md](./Phase1-Security-Access-Control.md)
- **Endpoints:** [Phase1-Protected-Public-Endpoints.md](./Phase1-Protected-Public-Endpoints.md)
- **All API Specs:** Phase1-LandingPage-API.md, Phase1-Lead-Capture-API.md, Phase1-Leads-API-Integration.md

---

**Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-04
**Maintained by:** DMAT QA Team
