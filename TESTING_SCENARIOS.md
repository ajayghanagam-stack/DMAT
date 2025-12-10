# DMAT Testing Scenarios - Phase 1 & Phase 2
## Complete UI Functionality Verification Guide

**Document Version:** 2.0
**Last Updated:** December 10, 2024
**Coverage:** Phase 1 + Phase 2 Features

---

## Table of Contents
1. [User Authentication](#1-user-authentication)
2. [Landing Page Management](#2-landing-page-management)
3. [Custom Fields Editor](#3-custom-fields-editor)
4. [Image Upload](#4-image-upload)
5. [Publishing & WordPress Integration](#5-publishing--wordpress-integration)
6. [Lead Capture](#6-lead-capture)
7. [Lead Management](#7-lead-management)

---

## 1. User Authentication

### Scenario 1.1: Successful Login
**Feature:** User Authentication
**Objective:** Verify user can login with valid credentials

**Pre-conditions:**
- Application is running (backend on port 5001, frontend on port 5173)
- Test user exists in database (run database migrations)

**Test Steps:**
1. Navigate to `http://localhost:5173/login`
2. Enter username: `admin`
3. Enter password: `admin123`
4. Click "Login" button

**Expected Results:**
- ✓ User is redirected to landing pages list (`/admin/landing-pages`)
- ✓ Navigation menu shows user's name
- ✓ JWT token is stored in browser storage
- ✓ No error messages displayed

**Validation Points:**
- Check browser DevTools > Application > Local Storage for JWT token
- Verify backend returns 200 status code
- Confirm navigation menu displays correctly

---

### Scenario 1.2: Failed Login - Invalid Credentials
**Feature:** User Authentication
**Objective:** Verify error handling for invalid credentials

**Test Steps:**
1. Navigate to `http://localhost:5173/login`
2. Enter username: `wronguser`
3. Enter password: `wrongpassword`
4. Click "Login" button

**Expected Results:**
- ✓ Error message displayed: "Invalid credentials"
- ✓ User remains on login page
- ✓ No JWT token stored
- ✓ Form fields are cleared or highlighted

---

### Scenario 1.3: Session Persistence
**Feature:** User Authentication
**Objective:** Verify user session persists after page refresh

**Pre-conditions:**
- User is logged in

**Test Steps:**
1. Login successfully
2. Refresh the page (F5 or Ctrl+R)

**Expected Results:**
- ✓ User remains logged in
- ✓ Landing pages list still displayed
- ✓ No redirect to login page

---

### Scenario 1.4: Logout
**Feature:** User Authentication
**Objective:** Verify user can logout successfully

**Pre-conditions:**
- User is logged in

**Test Steps:**
1. Click "Logout" button in navigation
2. Observe page behavior

**Expected Results:**
- ✓ User redirected to login page
- ✓ JWT token removed from browser storage
- ✓ Attempting to access protected pages redirects to login

---

## 2. Landing Page Management

### Scenario 2.1: View Landing Pages List
**Feature:** Landing Page List
**Objective:** Verify landing pages list displays correctly

**Pre-conditions:**
- User is logged in
- At least 1 landing page exists in database

**Test Steps:**
1. Navigate to `/admin/landing-pages`
2. Observe the list of landing pages

**Expected Results:**
- ✓ List displays all landing pages
- ✓ Each item shows: Title, Status (Draft/Published), Created Date
- ✓ "Create New Landing Page" button is visible
- ✓ Edit and Delete buttons visible for each page

**Data to Verify:**
- Title matches database
- Status badge color: Gray for Draft, Green for Published
- Dates formatted correctly (e.g., "Dec 10, 2024")

---

### Scenario 2.2: Create New Landing Page (Basic)
**Feature:** Landing Page Creation
**Objective:** Create a new landing page with basic information

**Pre-conditions:**
- User is logged in

**Test Steps:**
1. Click "Create New Landing Page" button
2. Fill in the form:
   - **Title:** "Free Marketing Guide 2024"
   - **Slug:** (auto-generated from title or manually enter "free-marketing-guide-2024")
   - **Headline:** "Download Your Free Marketing Guide"
   - **Subheading:** "Learn proven strategies to grow your business"
   - **Body Text:** "This comprehensive guide covers email marketing, social media, and content strategy."
   - **CTA Text:** "Get My Free Guide"
3. Click "Save as Draft"

**Expected Results:**
- ✓ Success message: "Landing page created successfully"
- ✓ Redirected to landing pages list
- ✓ New landing page appears in list with "Draft" status
- ✓ Slug is URL-friendly (lowercase, hyphens, no spaces)

**Backend Validation:**
- Check database: `SELECT * FROM landing_pages ORDER BY created_at DESC LIMIT 1;`
- Verify status = 'draft'
- Verify all fields saved correctly

---

### Scenario 2.3: Edit Existing Landing Page
**Feature:** Landing Page Editing
**Objective:** Modify an existing landing page

**Pre-conditions:**
- At least one landing page exists

**Test Steps:**
1. From landing pages list, click "Edit" on any landing page
2. Modify the following:
   - **Headline:** Change to "Updated Headline - Winter 2024"
   - **Body Text:** Add new paragraph
3. Click "Save Changes"

**Expected Results:**
- ✓ Success message displayed
- ✓ Changes reflected in the list
- ✓ Opening the page again shows updated content
- ✓ `updated_at` timestamp changed in database

---

### Scenario 2.4: Delete Landing Page
**Feature:** Landing Page Deletion
**Objective:** Delete an existing landing page

**Pre-conditions:**
- At least one draft landing page exists

**Test Steps:**
1. Click "Delete" button on a draft landing page
2. Confirm deletion in confirmation dialog

**Expected Results:**
- ✓ Confirmation dialog appears
- ✓ After confirmation, landing page removed from list
- ✓ Success message: "Landing page deleted successfully"
- ✓ Record removed from database (soft delete or hard delete)

**Important Note:**
- Published landing pages should show warning about leads/data loss
- Draft pages can be deleted without warning

---

## 3. Custom Fields Editor

### Scenario 3.1: Add Custom Form Fields
**Feature:** Custom Fields (Phase 2)
**Objective:** Add custom form fields to a landing page

**Pre-conditions:**
- User is logged in
- Editing a landing page

**Test Steps:**
1. Open landing page editor
2. Navigate to "Form Fields" section
3. Click "Add Field" button
4. Configure first field:
   - **Type:** Text Input
   - **Label:** "Full Name"
   - **Field Name:** "full_name"
   - **Placeholder:** "Enter your full name"
   - **Required:** Yes (check the box)
5. Click "Add Field" again
6. Configure second field:
   - **Type:** Email
   - **Label:** "Email Address"
   - **Field Name:** "email"
   - **Placeholder:** "you@example.com"
   - **Required:** Yes
7. Click "Add Field" again
8. Configure third field:
   - **Type:** Phone
   - **Label:** "Phone Number"
   - **Field Name:** "phone"
   - **Placeholder:** "(555) 123-4567"
   - **Required:** No
9. Click "Add Field" again
10. Configure fourth field:
    - **Type:** Textarea
    - **Label:** "Tell us about your business"
    - **Field Name:** "business_description"
    - **Placeholder:** "Describe your business..."
    - **Required:** No
11. Click "Save Changes"

**Expected Results:**
- ✓ All 4 fields appear in the form preview
- ✓ Required fields show asterisk (*) indicator
- ✓ Fields saved to database in correct order
- ✓ Field types render correctly (text input vs textarea)

**Validation:**
- Check database: `SELECT form_fields FROM landing_pages WHERE id = ?;`
- Verify JSON structure contains all fields with correct properties

---

### Scenario 3.2: Reorder Custom Fields
**Feature:** Custom Fields Reordering
**Objective:** Change the order of form fields

**Pre-conditions:**
- Landing page with at least 3 custom fields

**Test Steps:**
1. Open landing page editor
2. In Form Fields section, use drag handles to reorder
3. Drag "Phone Number" field to be first
4. Drag "Email Address" to be last
5. Click "Save Changes"

**Expected Results:**
- ✓ Fields display in new order
- ✓ Order persisted after page refresh
- ✓ Public landing page shows fields in new order

---

### Scenario 3.3: Edit Custom Field Properties
**Feature:** Custom Fields Editing
**Objective:** Modify existing field properties

**Pre-conditions:**
- Landing page with custom fields

**Test Steps:**
1. Click "Edit" on the "Phone Number" field
2. Change:
   - **Required:** Yes (check the box)
   - **Placeholder:** "Required: (555) 123-4567"
3. Click "Update Field"
4. Click "Save Changes"

**Expected Results:**
- ✓ Field now shows as required (asterisk)
- ✓ Placeholder text updated
- ✓ Form validation enforces requirement on public page

---

### Scenario 3.4: Delete Custom Field
**Feature:** Custom Fields Deletion
**Objective:** Remove a field from the form

**Pre-conditions:**
- Landing page with multiple custom fields

**Test Steps:**
1. Click "Delete" on the "Business Description" field
2. Confirm deletion if prompted
3. Click "Save Changes"

**Expected Results:**
- ✓ Field removed from form preview
- ✓ Field not displayed on public landing page
- ✓ Existing leads still retain data from that field

---

## 4. Image Upload

### Scenario 4.1: Upload Hero Image
**Feature:** Image Upload with MinIO (Phase 2)
**Objective:** Upload and set a hero image for landing page

**Pre-conditions:**
- User is logged in
- Editing a landing page
- MinIO is running (check: `http://localhost:9001`)
- Have a test image ready (JPEG or PNG, < 5MB)

**Test Steps:**
1. Open landing page editor
2. Navigate to "Hero Image" section
3. Click "Upload Image" or "Choose File"
4. Select an image file from your computer:
   - Example: `marketing-hero.jpg` (1920x1080, 500KB)
5. Click "Upload" or wait for auto-upload
6. Click "Save Changes"

**Expected Results:**
- ✓ Upload progress indicator shown during upload
- ✓ Image preview displayed after upload
- ✓ Image URL stored in database (MinIO URL)
- ✓ Success message: "Image uploaded successfully"

**Validation Points:**
- Check MinIO console: `http://localhost:9001`
  - Login: minioadmin / minioadmin123
  - Verify image exists in `dmat-images` bucket
- Database check: `SELECT hero_image_url FROM landing_pages WHERE id = ?;`
- URL format: `http://localhost:9000/dmat-images/[timestamp]-[filename]`

---

### Scenario 4.2: Replace Existing Hero Image
**Feature:** Image Upload
**Objective:** Replace an existing hero image

**Pre-conditions:**
- Landing page already has a hero image

**Test Steps:**
1. Open landing page editor
2. Current hero image is displayed
3. Click "Replace Image" or "Upload New Image"
4. Select a different image file
5. Confirm replacement if prompted
6. Click "Save Changes"

**Expected Results:**
- ✓ Old image preview replaced with new image
- ✓ Old image URL replaced in database
- ✓ Old image file may remain in MinIO (optional cleanup)

---

### Scenario 4.3: Remove Hero Image
**Feature:** Image Upload
**Objective:** Remove hero image from landing page

**Pre-conditions:**
- Landing page has a hero image

**Test Steps:**
1. Open landing page editor
2. Click "Remove Image" or delete icon
3. Confirm removal
4. Click "Save Changes"

**Expected Results:**
- ✓ Image preview removed
- ✓ `hero_image_url` set to NULL in database
- ✓ Public landing page displays without hero image

---

### Scenario 4.4: Image Upload Validation
**Feature:** Image Upload Validation
**Objective:** Verify file type and size validation

**Test Steps:**
1. Attempt to upload invalid file types:
   - PDF file
   - MP4 video file
   - .txt file
2. Attempt to upload oversized file (> 5MB if limit exists)

**Expected Results:**
- ✓ Error message: "Invalid file type. Only JPEG and PNG allowed"
- ✓ Error message: "File size exceeds 5MB limit"
- ✓ Upload blocked, no file sent to MinIO
- ✓ User can retry with valid file

---

## 5. Publishing & WordPress Integration

### Scenario 5.1: Publish Landing Page (No WordPress)
**Feature:** Publishing
**Objective:** Publish a landing page without WordPress configured

**Pre-conditions:**
- Landing page in draft status
- WordPress NOT configured (WP_SITE_URL empty in .env)

**Test Steps:**
1. Open landing page editor
2. Verify all required fields completed:
   - Title, Headline, Body Text, CTA Text
   - At least 1 form field (email)
3. Click "Publish" button
4. Confirm publication if prompted

**Expected Results:**
- ✓ Status changes from "Draft" to "Published"
- ✓ Success message: "Landing page published successfully"
- ✓ `published_url` field populated with DMAT-hosted URL
- ✓ `status` = 'published' in database
- ✓ `published_at` timestamp set

**Published URL Format:**
- `http://localhost:5001/pages/free-marketing-guide-2024.html`

---

### Scenario 5.2: Publish Landing Page with WordPress
**Feature:** WordPress Integration (Phase 2)
**Objective:** Publish landing page to WordPress site

**Pre-conditions:**
- WordPress site configured in `.env`:
  ```
  WP_SITE_URL=https://yoursite.com
  WP_USERNAME=admin
  WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
  ```
- Backend server restarted after configuration
- WordPress Application Password generated

**Test Steps:**
1. Open landing page editor
2. Complete all required fields
3. Click "Publish" button
4. Wait for WordPress publishing process

**Expected Results:**
- ✓ Success message: "Landing page published to WordPress successfully"
- ✓ `published_url` contains WordPress post URL (e.g., `https://yoursite.com/free-marketing-guide-2024`)
- ✓ `wordpress_post_id` stored in database
- ✓ Status = 'published'

**WordPress Verification:**
1. Login to WordPress admin
2. Go to Posts → All Posts
3. Verify new post exists with:
   - Title matching landing page title
   - Content including hero image, headline, body text, and form
   - Status = Published
   - Slug matching landing page slug

---

### Scenario 5.3: Test WordPress Connection
**Feature:** WordPress Integration
**Objective:** Verify WordPress credentials are valid

**Pre-conditions:**
- WordPress configured in .env

**Test Steps:**
1. Use API endpoint or admin panel "Test Connection" button
2. Make request to: `GET /api/admin/wordpress/test`
3. Include JWT token in Authorization header

**Expected Results:**
- ✓ Success response with WordPress site info:
  ```json
  {
    "success": true,
    "message": "WordPress connection successful",
    "siteInfo": {
      "name": "My WordPress Site",
      "url": "https://yoursite.com",
      "username": "admin"
    }
  }
  ```

**Error Cases to Test:**
- Invalid Application Password → "Authentication failed"
- Wrong site URL → "Cannot reach WordPress site"
- Missing credentials → "WordPress is not configured"

---

### Scenario 5.4: View Published Landing Page
**Feature:** Public Landing Page
**Objective:** Verify published landing page is accessible

**Pre-conditions:**
- Landing page published

**Test Steps:**
1. Copy the `published_url` from admin panel
2. Open in new browser tab/window (incognito mode recommended)
3. Observe the public landing page

**Expected Results:**
- ✓ Hero image displayed (if configured)
- ✓ Headline and subheading visible
- ✓ Body text formatted correctly
- ✓ All custom form fields displayed in correct order
- ✓ Required fields marked with asterisk (*)
- ✓ CTA button displays correct text
- ✓ Page is responsive (test on mobile view)

**Visual Checklist:**
- Layout is clean and professional
- Images load correctly
- Form fields are properly aligned
- Button is visible and clickable
- No broken links or missing content

---

## 6. Lead Capture

### Scenario 6.1: Submit Lead Form (Valid Data)
**Feature:** Lead Capture
**Objective:** Submit form from public landing page

**Pre-conditions:**
- Landing page is published
- Form has fields: Full Name, Email, Phone

**Test Steps:**
1. Navigate to published landing page URL
2. Fill in the form:
   - **Full Name:** "John Smith"
   - **Email:** "john.smith@example.com"
   - **Phone:** "(555) 123-4567"
3. Click the CTA button (e.g., "Get My Free Guide")

**Expected Results:**
- ✓ Form submits successfully
- ✓ Success message displayed: "Thank you! Your information has been submitted."
- ✓ Form fields cleared or disabled
- ✓ Lead stored in database

**Database Verification:**
```sql
SELECT * FROM leads WHERE email = 'john.smith@example.com' ORDER BY created_at DESC LIMIT 1;
```
- Verify all field values saved correctly
- Check `landing_page_id` references correct landing page
- Verify `submitted_at` timestamp

---

### Scenario 6.2: Submit Lead Form (Missing Required Field)
**Feature:** Lead Capture Validation
**Objective:** Verify required field validation

**Pre-conditions:**
- Landing page published with required email field

**Test Steps:**
1. Navigate to published landing page
2. Fill in form but leave "Email" field empty
3. Click submit button

**Expected Results:**
- ✓ Form does not submit
- ✓ Error message: "Email is required" or similar
- ✓ Email field highlighted in red
- ✓ Focus moves to empty required field
- ✓ No lead created in database

---

### Scenario 6.3: Submit Lead Form (Invalid Email Format)
**Feature:** Lead Capture Validation
**Objective:** Verify email format validation

**Test Steps:**
1. Navigate to published landing page
2. Fill in form:
   - **Email:** "notanemail" (invalid format)
3. Click submit button

**Expected Results:**
- ✓ Form validation error
- ✓ Error message: "Please enter a valid email address"
- ✓ Email field highlighted
- ✓ No lead created

**Test Additional Invalid Formats:**
- "test@" → Invalid
- "@example.com" → Invalid
- "test @example.com" → Invalid (space)
- "test@example" → May be invalid depending on validation

---

### Scenario 6.4: Duplicate Lead Submission
**Feature:** Lead Capture
**Objective:** Verify behavior when same email submits again

**Pre-conditions:**
- Lead already submitted with email "john@example.com"

**Test Steps:**
1. Navigate to same published landing page
2. Submit form with same email: "john@example.com"
3. But different name: "John Doe" (was "John Smith")

**Expected Results:**
(Behavior depends on implementation)

**Option A - Allow Duplicate:**
- ✓ New lead record created
- ✓ Both leads visible in admin panel
- ✓ Different `id` and `created_at`

**Option B - Prevent Duplicate:**
- ✓ Error message: "This email has already been submitted"
- ✓ No new lead created
- ✓ Original lead data unchanged

---

### Scenario 6.5: Lead Capture from WordPress Published Page
**Feature:** Lead Capture via WordPress
**Objective:** Verify form works on WordPress-published landing page

**Pre-conditions:**
- Landing page published to WordPress

**Test Steps:**
1. Navigate to WordPress post URL (e.g., `https://yoursite.com/free-marketing-guide-2024`)
2. Scroll to form section
3. Fill in form fields
4. Click submit button

**Expected Results:**
- ✓ Form submits via AJAX to DMAT backend
- ✓ Lead saved in DMAT database
- ✓ Success message displayed on WordPress page
- ✓ Form data includes `landing_page_id`

**Special Considerations:**
- CORS must allow WordPress domain
- WordPress form must post to: `http://localhost:5001/api/public/leads` or production API URL
- Check browser console for CORS errors

---

## 7. Lead Management

### Scenario 7.1: View Leads List
**Feature:** Lead Management
**Objective:** View all captured leads in admin panel

**Pre-conditions:**
- User is logged in
- At least 3 leads exist in database

**Test Steps:**
1. Navigate to `/admin/leads` or click "Leads" in navigation
2. Observe the leads list

**Expected Results:**
- ✓ List displays all leads in reverse chronological order (newest first)
- ✓ Each lead shows:
  - Name
  - Email
  - Landing Page Title
  - Submission Date/Time
  - Status (if applicable)
- ✓ View Details button for each lead
- ✓ Pagination if more than 10 leads (or configured page size)

---

### Scenario 7.2: View Lead Details
**Feature:** Lead Details
**Objective:** View all information about a specific lead

**Pre-conditions:**
- At least one lead exists

**Test Steps:**
1. From leads list, click "View Details" on any lead
2. Observe the detail view

**Expected Results:**
- ✓ All form fields and values displayed:
  - Full Name: "John Smith"
  - Email: "john.smith@example.com"
  - Phone: "(555) 123-4567"
  - Any custom fields and their values
- ✓ Metadata displayed:
  - Landing Page Title (linked to landing page)
  - Submitted At: "Dec 10, 2024 2:30 PM"
  - Lead ID
- ✓ "Back to Leads" or navigation available

**Custom Fields Display:**
- All custom fields from the landing page form shown
- Values formatted appropriately (URLs clickable, etc.)

---

### Scenario 7.3: Filter Leads by Landing Page
**Feature:** Lead Filtering
**Objective:** Filter leads by source landing page

**Pre-conditions:**
- Leads from multiple landing pages exist

**Test Steps:**
1. On leads list page, locate filter dropdown
2. Select a specific landing page from dropdown
3. Click "Apply Filter" or filter applies automatically

**Expected Results:**
- ✓ Only leads from selected landing page displayed
- ✓ Count updates to show filtered number
- ✓ Filter selection persists if page refreshed
- ✓ "Clear Filter" option available

---

### Scenario 7.4: Search Leads
**Feature:** Lead Search
**Objective:** Search leads by email or name

**Pre-conditions:**
- Multiple leads exist

**Test Steps:**
1. Locate search box on leads list page
2. Enter search term: "john"
3. Press Enter or click Search button

**Expected Results:**
- ✓ Results filtered to show only matching leads
- ✓ Matches found in name OR email
- ✓ Search is case-insensitive
- ✓ "No results found" message if no matches
- ✓ Clear search button available

**Test Various Searches:**
- Partial email: "smith@" → finds john.smith@example.com
- Full name: "John Smith" → finds exact match
- Partial name: "Joh" → finds John, Johnny, etc.

---

### Scenario 7.5: Export Leads to CSV
**Feature:** Lead Export
**Objective:** Export leads data to CSV file

**Pre-conditions:**
- At least 5 leads exist

**Test Steps:**
1. On leads list page, click "Export to CSV" button
2. Optionally apply filter first (e.g., specific landing page)
3. Download should start automatically

**Expected Results:**
- ✓ CSV file downloads to browser
- ✓ Filename format: `leads-export-2024-12-10.csv`
- ✓ CSV contains all visible leads (respects filters)
- ✓ CSV headers match form fields:
  - ID, Name, Email, Phone, Landing Page, Submitted At, [Custom Fields...]
- ✓ Data properly escaped (commas, quotes handled)

**CSV Validation:**
- Open in Excel/Google Sheets
- Verify all rows present
- Check special characters handled correctly
- Verify dates formatted properly

---

### Scenario 7.6: Delete Lead
**Feature:** Lead Deletion
**Objective:** Remove a lead from the system

**Pre-conditions:**
- At least one lead exists

**Test Steps:**
1. On leads list, click "Delete" button for a lead
2. Confirm deletion in confirmation dialog

**Expected Results:**
- ✓ Confirmation dialog: "Are you sure you want to delete this lead?"
- ✓ After confirmation, lead removed from list
- ✓ Success message displayed
- ✓ Lead removed from database (soft delete or hard delete)

**Important:**
- Deletion should be irreversible (unless soft delete implemented)
- Consider data retention policies

---

## 8. End-to-End Integration Scenarios

### Scenario 8.1: Complete Campaign Workflow
**Feature:** End-to-End Integration
**Objective:** Test complete workflow from creation to lead capture

**Test Steps:**
1. **Create Landing Page:**
   - Login to admin
   - Create new landing page: "Product Launch 2024"
   - Add hero image
   - Add custom fields: Name, Email, Company, Interest Level (dropdown)
   - Save as draft

2. **Configure and Publish:**
   - Review and edit content
   - Click Publish
   - Verify published URL

3. **Capture Lead:**
   - Open published URL in incognito window
   - Fill and submit form
   - Verify success message

4. **View Lead:**
   - Return to admin panel
   - Navigate to Leads
   - Find the new lead
   - Verify all data captured correctly

**Expected Results:**
- ✓ Entire workflow completes without errors
- ✓ Data consistency maintained throughout
- ✓ Lead data matches submitted form data
- ✓ All custom fields visible in lead details

---

### Scenario 8.2: WordPress Publishing to Lead Capture
**Feature:** End-to-End with WordPress
**Objective:** Test WordPress integration full workflow

**Pre-conditions:**
- WordPress configured

**Test Steps:**
1. Create and publish landing page to WordPress
2. Verify post created on WordPress site
3. Open WordPress post URL in browser
4. Submit form from WordPress page
5. Verify lead captured in DMAT admin panel

**Expected Results:**
- ✓ Lead captured from WordPress-hosted form
- ✓ `landing_page_id` correctly linked
- ✓ All form data saved
- ✓ Referrer tracking shows WordPress URL (if implemented)

---

## 9. Performance & Stress Testing

### Scenario 9.1: Multiple Concurrent Form Submissions
**Feature:** Performance
**Objective:** Verify system handles concurrent submissions

**Test Steps:**
1. Open published landing page in 5 different browser tabs
2. Fill forms with different data in each tab
3. Submit all 5 forms within 10 seconds

**Expected Results:**
- ✓ All 5 leads captured successfully
- ✓ No duplicate or lost submissions
- ✓ All leads show correct timestamps
- ✓ No database conflicts or errors

---

### Scenario 9.2: Large Image Upload
**Feature:** Performance
**Objective:** Test upload of maximum allowed image size

**Test Steps:**
1. Prepare image file at size limit (e.g., 4.9MB)
2. Upload as hero image
3. Monitor upload progress

**Expected Results:**
- ✓ Upload completes successfully
- ✓ Progress indicator shows accurate progress
- ✓ Image displays correctly after upload
- ✓ File stored in MinIO
- ✓ Reasonable upload time (< 30 seconds on good connection)

---

## 10. Error Handling & Edge Cases

### Scenario 10.1: Backend Server Down
**Feature:** Error Handling
**Objective:** Verify graceful degradation when backend unavailable

**Test Steps:**
1. Stop backend server
2. Attempt to login
3. Attempt to submit lead form

**Expected Results:**
- ✓ User-friendly error message (not technical stack trace)
- ✓ Message: "Unable to connect to server. Please try again later."
- ✓ No JavaScript console errors breaking the page
- ✓ UI remains usable

---

### Scenario 10.2: MinIO Service Down
**Feature:** Error Handling
**Objective:** Verify image upload handling when MinIO unavailable

**Test Steps:**
1. Stop MinIO service: `pkill minio` or stop Docker container
2. Attempt to upload hero image

**Expected Results:**
- ✓ Error message: "Image upload service unavailable"
- ✓ Form remains functional (can save without image)
- ✓ User can retry after MinIO restored

---

### Scenario 10.3: WordPress Connection Failure
**Feature:** Error Handling
**Objective:** Test publishing when WordPress unavailable

**Pre-conditions:**
- WordPress configured but site is down or credentials invalid

**Test Steps:**
1. Attempt to publish landing page

**Expected Results:**
- ✓ Error message: "Failed to publish to WordPress: [error details]"
- ✓ Landing page saved as draft (not lost)
- ✓ User can retry publishing
- ✓ Option to publish without WordPress (fallback to DMAT URL)

---

## 11. Browser Compatibility Testing

### Scenario 11.1: Cross-Browser Testing
**Feature:** Compatibility
**Objective:** Verify functionality across major browsers

**Browsers to Test:**
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Safari (latest, macOS)
- Microsoft Edge (latest)

**Test Cases:**
1. Login
2. Create landing page
3. Upload image
4. Publish landing page
5. Submit lead form

**Expected Results:**
- ✓ All features work consistently across browsers
- ✓ UI renders correctly
- ✓ No browser-specific JavaScript errors
- ✓ Form validation works in all browsers

---

### Scenario 11.2: Mobile Responsiveness
**Feature:** Mobile Support
**Objective:** Verify responsive design on mobile devices

**Test Steps:**
1. Open public landing page on mobile device or browser DevTools mobile view
2. Test different screen sizes:
   - iPhone SE (375x667)
   - iPhone 12 Pro (390x844)
   - iPad (768x1024)
   - Android Phone (360x640)

**Expected Results:**
- ✓ Page layout adjusts to screen size
- ✓ Images scale appropriately
- ✓ Form fields are usable (not too small)
- ✓ Buttons are tappable (minimum 44x44px)
- ✓ Text is readable without zooming
- ✓ No horizontal scrolling required

---

## 12. Security Testing

### Scenario 12.1: SQL Injection Prevention
**Feature:** Security
**Objective:** Verify input sanitization

**Test Steps:**
1. In form fields, enter SQL injection attempts:
   - Name: `'; DROP TABLE leads; --`
   - Email: `admin'--@example.com`
2. Submit form
3. Check database integrity

**Expected Results:**
- ✓ Input treated as literal string, not SQL
- ✓ Database tables intact
- ✓ Lead saved with the literal input (or rejected as invalid)

---

### Scenario 12.2: XSS Prevention
**Feature:** Security
**Objective:** Prevent cross-site scripting

**Test Steps:**
1. Submit form with JavaScript in fields:
   - Name: `<script>alert('XSS')</script>`
   - Comment: `<img src=x onerror="alert('XSS')">`
2. View lead details in admin panel

**Expected Results:**
- ✓ Scripts do not execute in admin panel
- ✓ Content is escaped/sanitized
- ✓ Displays as plain text: `<script>alert('XSS')</script>`

---

### Scenario 12.3: Authentication Required
**Feature:** Security
**Objective:** Verify protected routes require authentication

**Test Steps:**
1. Logout from admin panel
2. Attempt to access: `/admin/landing-pages` directly via URL
3. Attempt to access: `/admin/leads`

**Expected Results:**
- ✓ Redirected to login page
- ✓ No data exposed
- ✓ After login, redirected to originally requested page

---

## Testing Checklist Summary

### Phase 1 Features
- [ ] User Authentication (Login/Logout)
- [ ] Landing Page List View
- [ ] Create Landing Page
- [ ] Edit Landing Page
- [ ] Delete Landing Page
- [ ] Publish Landing Page
- [ ] View Published Landing Page
- [ ] Submit Lead Form (Public)
- [ ] View Leads List (Admin)
- [ ] View Lead Details

### Phase 2 Features
- [ ] Add Custom Form Fields
- [ ] Edit Custom Fields
- [ ] Reorder Custom Fields
- [ ] Delete Custom Fields
- [ ] Upload Hero Image
- [ ] Replace Hero Image
- [ ] Remove Hero Image
- [ ] Publish to WordPress
- [ ] WordPress Connection Test
- [ ] Lead Capture from WordPress Page

### Non-Functional Testing
- [ ] Performance (Concurrent Submissions)
- [ ] Large File Upload
- [ ] Error Handling (Server Down)
- [ ] Cross-Browser Compatibility
- [ ] Mobile Responsiveness
- [ ] Security (SQL Injection, XSS)
- [ ] Session Management

---

## Test Data Reference

### Sample Landing Pages
1. **Free Marketing Guide 2024**
   - Slug: free-marketing-guide-2024
   - Fields: Name, Email, Phone
   - Status: Published

2. **Product Launch - Winter Sale**
   - Slug: winter-sale-2024
   - Fields: Name, Email, Company, Interest Level
   - Status: Draft

3. **Webinar Registration**
   - Slug: webinar-registration-jan-2024
   - Fields: Full Name, Email, Company, Job Title, Questions
   - Status: Published

### Sample Leads
1. **John Smith**
   - Email: john.smith@example.com
   - Phone: (555) 123-4567
   - Source: Free Marketing Guide 2024

2. **Jane Doe**
   - Email: jane.doe@business.com
   - Company: Acme Corp
   - Source: Winter Sale 2024

3. **Bob Johnson**
   - Email: bob@startup.io
   - Job Title: Marketing Director
   - Source: Webinar Registration

---

## Testing Environment Setup

### Prerequisites
1. **Backend Server:**
   ```bash
   cd backend
   node server.js
   # Should run on http://localhost:5001
   ```

2. **Frontend Server:**
   ```bash
   cd frontend
   npm run dev
   # Should run on http://localhost:5173
   ```

3. **PostgreSQL Database:**
   ```bash
   # Verify running:
   psql -U postgres -c "SELECT version();"
   # Should show PostgreSQL 15.x or higher
   ```

4. **MinIO Storage:**
   ```bash
   # Verify running:
   curl http://localhost:9000/minio/health/live
   # Should return 200 OK
   ```

5. **Database Migrations:**
   ```bash
   cd database
   psql -U postgres -d dmat_db -f migrations/001_initial_schema.sql
   # Run all migration files in order
   ```

### Environment Variables
Verify `.env` files are configured:

**Backend .env:**
```
NODE_ENV=development
PORT=5001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dmat_db
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=dmat-images

# Optional: WordPress Integration
WP_SITE_URL=https://yoursite.com
WP_USERNAME=admin
WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

**Frontend .env:**
```
VITE_API_BASE_URL=http://localhost:5001
```

---

## Reporting Issues

When reporting test failures, include:
1. **Scenario Number** (e.g., Scenario 2.3)
2. **Steps to Reproduce**
3. **Expected vs Actual Result**
4. **Screenshots** (if UI issue)
5. **Browser Console Errors** (F12 → Console tab)
6. **Network Request Details** (F12 → Network tab)
7. **Environment Details** (OS, Browser, Backend/Frontend versions)

### Example Bug Report
```
Scenario: 3.1 - Add Custom Form Fields
Expected: Field saves with "phone" type
Actual: Field saves as "text" type
Steps:
1. Create landing page
2. Add field with type="phone"
3. Save
4. Check database: form_fields JSON shows type="text"
Browser: Chrome 120.0.6099.109
Console Errors: None
Network: POST /api/admin/landing-pages returns 200 but wrong field type
```

---

## Document Version History

- **v2.0** (Dec 10, 2024) - Added Phase 2 scenarios: Custom Fields, Image Upload, WordPress Integration
- **v1.0** (Dec 5, 2024) - Initial version with Phase 1 scenarios

---

**End of Testing Scenarios Document**
