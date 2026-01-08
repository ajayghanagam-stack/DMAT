# DMAT Testing Scenarios - Complete Guide
## Phase 1, Phase 2, and Phase 3 Feature Verification

**Document Version:** 3.0
**Last Updated:** December 18, 2025
**Coverage:** Phase 1 (MVP) + Phase 2 (Enhancements) + Phase 3 (SEO Engine)

---

## Table of Contents

### Phase 1 & 2 Features
1. [User Authentication](#1-user-authentication)
2. [Landing Page Management](#2-landing-page-management)
3. [Custom Fields Editor](#3-custom-fields-editor)
4. [Image Upload](#4-image-upload)
5. [Publishing & WordPress Integration](#5-publishing--wordpress-integration)
6. [Lead Capture](#6-lead-capture)
7. [Lead Management](#7-lead-management)
8. [End-to-End Integration Scenarios](#8-end-to-end-integration-scenarios)
9. [Performance & Stress Testing](#9-performance--stress-testing)
10. [Error Handling & Edge Cases](#10-error-handling--edge-cases)
11. [Browser Compatibility Testing](#11-browser-compatibility-testing)
12. [Security Testing](#12-security-testing)

### Phase 3 SEO Engine Features
13. [Pre-Testing Setup (Phase 3)](#13-pre-testing-setup-phase-3)
14. [Google OAuth Integration](#14-google-oauth-integration)
15. [Google Search Console Integration](#15-google-search-console-integration)
16. [Google Analytics (GA4) Integration](#16-google-analytics-ga4-integration)
17. [Public Landing Page Improvements](#17-public-landing-page-improvements)
18. [SEO Integration Testing](#18-seo-integration-testing)
19. [SEO Error Handling](#19-seo-error-handling)
20. [SEO Performance Testing](#20-seo-performance-testing)
21. [SEO Security Testing](#21-seo-security-testing)

---

# PHASE 1 & PHASE 2 TESTING SCENARIOS

## 1. User Authentication

### Scenario 1.1: Successful Login
**Feature:** User Authentication
**Objective:** Verify user can login with valid credentials

**Pre-conditions:**
- Application is running (backend on port 5001, frontend on port 5173)
- Test user exists in database (run database migrations)

**Test Steps:**
1. Navigate to `http://localhost:5173/login`
2. Enter email: `admin@innovateelectronics.com`
3. Enter password: `password123`
4. Click "Sign In" button

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
2. Enter email: `wronguser@example.com`
3. Enter password: `wrongpassword`
4. Click "Sign In" button

**Expected Results:**
- ✓ Error message displayed: "Invalid email or password"
- ✓ User remains on login page
- ✓ No JWT token stored
- ✓ Form fields remain populated for retry

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
1. Navigate to `/landing-pages`
2. Observe the list of landing pages

**Expected Results:**
- ✓ Page header shows "Landing Pages" with subtitle "Create and manage your landing pages"
- ✓ "+ Create Landing Page" button visible in top right
- ✓ Search box visible with placeholder "Search pages..."
- ✓ Filter buttons visible: "All", "Draft", "Published"
- ✓ Each landing page card shows:
  - Page title (large, bold)
  - Status badge (Draft in amber/yellow, Published in green)
  - Headline preview (truncated)
  - Slug (prefixed with "/")
  - Created date (formatted as "MMM DD, YYYY")
  - Published date (if published)
  - Action buttons: "Edit", "Preview", "Delete"

**Data to Verify:**
- Status badge colors: Draft uses amber-100 background with amber-800 text, Published uses green-100 background with green-800 text
- Dates formatted correctly (e.g., "Dec 10, 2024")
- Empty state shows when no landing pages exist

---

### Scenario 2.2: Create New Landing Page (Basic)
**Feature:** Landing Page Creation
**Objective:** Create a new landing page with basic information

**Pre-conditions:**
- User is logged in
- At least one template exists in the database

**Test Steps:**
1. Click "+ Create Landing Page" button
2. On template selection screen, select a template (click on template card)
3. Fill in the form:
   - **Page Title:** "Free Marketing Guide 2025"
   - **URL Slug:** Leave auto-generated or manually enter "free-marketing-guide-2025"
   - **Headline:** "Download Your Free Marketing Guide"
   - **Subheading:** "Learn proven strategies to grow your business"
   - **Body Text:** "This comprehensive guide covers email marketing, social media, and content strategy."
   - **Call-to-Action Button Text:** "Get My Free Guide"
4. Scroll to bottom and click "Save Draft"

**Expected Results:**
- ✓ Success alert: "Landing page created successfully!"
- ✓ Redirected to `/landing-pages` (landing pages list)
- ✓ New landing page appears in list with "Draft" status badge (amber background)
- ✓ Slug auto-generated from title (lowercase, hyphens replace spaces)
- ✓ Default form fields created: Full Name (required), Email Address (required), Phone Number (optional)

**Backend Validation:**
- Check database: `SELECT * FROM landing_pages ORDER BY created_at DESC LIMIT 1;`
- Verify publish_status = 'draft'
- Verify form_fields JSON contains default 3 fields
- Verify all text fields saved correctly

---

### Scenario 2.3: Edit Existing Landing Page
**Feature:** Landing Page Editing
**Objective:** Modify an existing landing page

**Pre-conditions:**
- At least one landing page exists

**Test Steps:**
1. From landing pages list, click "Edit" button on any landing page
2. Wait for form to load with existing data
3. Modify the following:
   - **Headline:** Change to "Updated Headline - Winter 2025"
   - **Body Text:** Add new paragraph at the end
4. Scroll to bottom and click "Save Changes"

**Expected Results:**
- ✓ Success alert: "Landing page updated successfully!"
- ✓ User remains on edit page (not redirected)
- ✓ Navigate back to list, changes reflected in headline preview
- ✓ Click "Edit" again to verify changes persisted
- ✓ `updated_at` timestamp changed in database

**Important Notes:**
- Template selection is NOT shown in edit mode (only on create)
- Form fields section shows existing custom fields with ability to add/edit/delete
- Preview button appears in header to open preview in new tab

---

### Scenario 2.4: Delete Landing Page
**Feature:** Landing Page Deletion
**Objective:** Delete an existing landing page

**Pre-conditions:**
- At least one landing page exists (draft or published)

**Test Steps:**
1. From landing pages list, click "Delete" button on any landing page card
2. Observe confirmation dialog
3. Click "Delete" in the confirmation dialog (or "Cancel" to abort)

**Expected Results:**
- ✓ Browser confirmation dialog appears with message: "Are you sure you want to delete this landing page?"
- ✓ After confirming, success alert: "Landing page deleted successfully!"
- ✓ Landing page removed from list immediately
- ✓ Record removed from database (hard delete)

**Important Notes:**
- No special warning for published pages with leads (same confirmation for all)
- Deletion is permanent and cannot be undone
- Associated leads are NOT deleted (referential integrity maintained)

---

## 3. Custom Fields Editor

### Scenario 3.1: Add Custom Form Fields
**Feature:** Custom Fields (Phase 2)
**Objective:** Add custom form fields to a landing page

**Pre-conditions:**
- User is logged in
- Creating or editing a landing page
- Default 3 fields already exist (name, email, phone)

**Test Steps:**
1. Scroll to "Form Configuration" section
2. Observe existing default fields
3. Click "+ Add Field" button to add fourth field
4. Configure the new field inline:
   - **Field Name:** "company" (small text input on left)
   - **Label:** "Company Name" (medium text input)
   - **Type:** Select "text" from dropdown
   - **Placeholder:** "Enter your company name"
   - **Required:** Check the checkbox
5. Click "+ Add Field" again to add fifth field
6. Configure another field:
   - **Field Name:** "message"
   - **Label:** "Tell us about your needs"
   - **Type:** Select "textarea" from dropdown
   - **Placeholder:** "Describe what you're looking for..."
   - **Required:** Leave unchecked
7. Scroll to bottom and click "Save Draft" or "Save Changes"

**Expected Results:**
- ✓ New fields appear immediately after clicking "+ Add Field"
- ✓ Each field row shows: drag handle (⋮⋮), field name input, label input, type dropdown, placeholder input, required checkbox, delete button (✕)
- ✓ Success alert: "Landing page created successfully!" or "Landing page updated successfully!"
- ✓ All custom fields saved to database in form_fields JSON
- ✓ Field types available in dropdown: text, email, tel, number, url, textarea

**Validation:**
- Check database: `SELECT form_fields FROM landing_pages WHERE id = ?;`
- Verify JSON structure: `{"fields": [{"name": "...", "type": "...", "label": "...", "required": true/false, "placeholder": "..."}, ...]}`

**Important Notes:**
- Drag handles (⋮⋮) are displayed but drag-and-drop is NOT implemented
- Fields must be manually reordered by deleting and re-adding if needed
- No asterisk (*) indicator shown in the form editor (only on public form)

---

### Scenario 3.2: Reorder Custom Fields
**Feature:** Custom Fields Reordering
**Status:** ⚠️ NOT IMPLEMENTED
**Objective:** Change the order of form fields

**Current Behavior:**
- Drag handles (⋮⋮) are displayed on each field row
- However, drag-and-drop functionality is NOT implemented
- Fields cannot be reordered by dragging

**Workaround:**
To change field order, users must:
1. Delete fields that need to move
2. Re-add them in the desired position using "+ Add Field"
3. Re-enter field configuration (name, label, type, placeholder, required)
4. Save changes

**Expected Future Implementation:**
- ✓ Click and drag using the drag handle (⋮⋮)
- ✓ Drop field in new position
- ✓ Visual indicator during drag operation
- ✓ Order changes reflected immediately
- ✓ Save to persist new order

---

### Scenario 3.3: Edit Custom Field Properties
**Feature:** Custom Fields Editing
**Objective:** Modify existing field properties

**Pre-conditions:**
- Landing page with custom fields (at least 3 default fields)

**Test Steps:**
1. Locate the "Phone Number" field row in Form Configuration section
2. Modify the field inline:
   - **Label:** Change from "Phone Number" to "Contact Phone"
   - **Placeholder:** Change to "Required: (555) 123-4567"
   - **Required:** Check the checkbox
3. Scroll to bottom and click "Save Changes"
4. Wait for success message

**Expected Results:**
- ✓ Field updates immediately in the editor
- ✓ Success alert: "Landing page updated successfully!"
- ✓ Changes persist after page refresh
- ✓ Required field will enforce validation on public form
- ✓ No separate "Edit" button - all fields are editable inline

**Validation:**
- Navigate to landing page preview
- Verify updated label and placeholder show on form
- Try submitting form without phone - should show validation error

---

### Scenario 3.4: Delete Custom Field
**Feature:** Custom Fields Deletion
**Objective:** Remove a field from the form

**Pre-conditions:**
- Landing page with multiple custom fields (at least 4 fields)

**Test Steps:**
1. Locate any non-essential field in Form Configuration section (e.g., a "message" textarea field)
2. Click the delete button (✕) on the right side of that field row
3. Observe the confirmation dialog
4. Click "OK" to confirm deletion
5. Verify field row disappears immediately
6. Scroll to bottom and click "Save Changes"

**Expected Results:**
- ✓ Browser confirmation dialog appears: "Are you sure you want to delete this field?"
- ✓ After confirming, field row removed immediately from editor
- ✓ Field not included in form_fields JSON when saving
- ✓ Success alert: "Landing page updated successfully!"
- ✓ Field not displayed on public landing page after save
- ✓ Existing leads that have data for deleted field retain that data (historical data preserved)

**Important Notes:**
- Deletion is immediate in UI but not persisted until "Save Changes"
- If you delete a field and don't save, refreshing the page will restore it
- No undo functionality - must re-add field manually if deleted by mistake

---

## 4. Image Upload

### Scenario 4.1: Upload Hero Image
**Feature:** Image Upload with MinIO (Phase 2)
**Objective:** Upload and set a hero image for landing page

**Pre-conditions:**
- User is logged in
- Creating or editing a landing page
- MinIO is running (check: `http://localhost:9001`)
- Have a test image ready (JPEG, PNG, GIF, or WebP, < 5MB)

**Test Steps:**
1. Scroll to "Hero Image" section in the landing page form
2. Observe the upload area with "📁 Click to upload image" text
3. Click on the upload area or "Choose File" button
4. Select an image file from your computer:
   - Example: `marketing-hero.jpg` (1920x1080, 500KB)
5. Wait for upload to complete (automatic after file selection)
6. Observe the image preview
7. Scroll to bottom and click "Save Draft" or "Save Changes"

**Expected Results:**
- ✓ During upload: "Uploading..." text shown with spinner
- ✓ Success alert: "Image uploaded successfully!"
- ✓ Image preview displayed with full width
- ✓ "Remove Image" button appears below preview
- ✓ Image URL stored in formData.hero_image_url
- ✓ After save: Success alert and image persists

**Validation Points:**
- Check MinIO console: `http://localhost:9001`
  - Login: minioadmin / minioadmin123
  - Navigate to "dmat-images" bucket
  - Verify image file exists with timestamp prefix
- Database check: `SELECT hero_image_url FROM landing_pages WHERE id = ?;`
- URL format: `http://localhost:9000/dmat-images/[timestamp]-[filename]`
- Accepted file types: image/jpeg, image/jpg, image/png, image/gif, image/webp

**Important Notes:**
- Upload happens immediately on file selection (no separate upload button)
- Image must be saved with landing page to persist
- Image is stored separately in MinIO before landing page save

---

### Scenario 4.2: Replace Existing Hero Image
**Feature:** Image Upload
**Objective:** Replace an existing hero image

**Pre-conditions:**
- Landing page already has a hero image uploaded

**Test Steps:**
1. Open landing page editor (click "Edit" from list)
2. Scroll to "Hero Image" section
3. Observe current hero image preview is displayed
4. Click "Remove Image" button
5. Wait for confirmation
6. Upload area reappears
7. Click upload area and select a different image file
8. Wait for new image to upload
9. Click "Save Changes"

**Expected Results:**
- ✓ After removing: Upload area reappears immediately
- ✓ After selecting new image: "Uploading..." shown, then preview of new image
- ✓ Success alert: "Image uploaded successfully!"
- ✓ After save: New image URL stored in database
- ✓ Old image file remains in MinIO (no automatic cleanup)

**Important Notes:**
- No direct "Replace" button - must remove then upload new
- Old images accumulate in MinIO storage (manual cleanup needed)
- Each upload gets unique timestamp prefix to avoid conflicts

---

### Scenario 4.3: Remove Hero Image
**Feature:** Image Upload
**Objective:** Remove hero image from landing page

**Pre-conditions:**
- Landing page has a hero image uploaded

**Test Steps:**
1. Open landing page editor
2. Scroll to "Hero Image" section with current image preview
3. Click "Remove Image" button below the preview
4. Observe upload area reappears
5. Scroll to bottom and click "Save Changes"

**Expected Results:**
- ✓ Image preview removed immediately after clicking "Remove Image"
- ✓ Upload area ("📁 Click to upload image") reappears
- ✓ Success alert: "Landing page updated successfully!"
- ✓ `hero_image_url` set to NULL or empty string in database
- ✓ Public landing page displays without hero image (if published)
- ✓ Image file remains in MinIO storage (not deleted)

---

### Scenario 4.4: Image Upload Validation
**Feature:** Image Upload Validation
**Objective:** Verify file type and size validation

**Test Steps:**
1. Navigate to landing page form, Hero Image section
2. Attempt to upload invalid file type:
   - Try uploading a PDF file (e.g., `document.pdf`)
   - Try uploading a text file (e.g., `notes.txt`)
   - Try uploading a video file (e.g., `video.mp4`)
3. Observe error handling
4. Attempt to upload oversized file:
   - Create or find image file > 5MB
   - Try to upload the large file
5. Observe error handling

**Expected Results:**

**Invalid File Type:**
- ✓ Error alert appears: "Invalid file type. Please upload JPEG, PNG, GIF, or WebP image."
- ✓ No upload request sent to server
- ✓ Upload area remains in initial state
- ✓ User can close alert and try again

**Oversized File:**
- ✓ Error alert appears: "File size exceeds 5MB limit."
- ✓ No upload request sent to server
- ✓ Upload area remains in initial state
- ✓ User can close alert and try again

**Validation Details:**
- Frontend validation happens before API call (prevents unnecessary requests)
- Accepted MIME types: image/jpeg, image/jpg, image/png, image/gif, image/webp
- Max file size: 5MB (5 * 1024 * 1024 bytes)
- Backend also validates via multer middleware as secondary check

---

## 5. Publishing & WordPress Integration

### Scenario 5.1: Publish Landing Page (No WordPress)
**Feature:** Publishing
**Objective:** Publish a landing page without WordPress configured

**Pre-conditions:**
- Landing page exists and is in draft status
- WordPress NOT configured (WP_SITE_URL empty or not set in backend .env)
- All required fields completed

**Test Steps:**
1. Navigate to landing pages list
2. Click "Edit" on a draft landing page
3. Verify page has required content:
   - Page Title, Headline filled
   - At least default form fields (name, email, phone)
4. Click "Publish" button at bottom right
5. Wait for confirmation/response

**Expected Results:**
- ✓ Success alert: "Landing page published successfully!"
- ✓ Status badge changes from "Draft" (amber) to "Published" (green) in list
- ✓ `publish_status` = 'published' in database
- ✓ `published_at` timestamp set to current time
- ✓ `published_url` field populated with DMAT-hosted URL (if public serving configured)
- ✓ `wordpress_post_id` remains NULL
- ✓ `wordpress_url` remains NULL

**Published URL Format:**
- Format: `{API_BASE_URL}/api/public/pages/{slug}.html` or custom public URL
- Example: `http://localhost:5001/api/public/pages/free-marketing-guide-2025.html`

**Important Notes:**
- Publish button only appears in edit mode, not during initial creation
- Must save as draft first, then edit and publish
- No confirmation dialog - publishes immediately on button click

---

### Scenario 5.2: Publish Landing Page with WordPress
**Feature:** WordPress Integration (Phase 2)
**Objective:** Publish landing page to WordPress site

**Pre-conditions:**
- WordPress site configured in backend `.env`:
  ```
  WP_SITE_URL=https://yoursite.com
  WP_USERNAME=admin
  WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
  ```
- Backend server restarted after .env configuration
- WordPress Application Password generated (Users → Profile → Application Passwords)
- Landing page in draft status

**Test Steps:**
1. Navigate to landing pages list
2. Click "Edit" on a draft landing page
3. Verify all required content is complete
4. Click "Publish" button at bottom right
5. Wait for WordPress publishing process (may take 3-5 seconds)

**Expected Results:**
- ✓ Success alert: "Landing page published successfully!" (or specific WordPress success message)
- ✓ `publish_status` = 'published' in database
- ✓ `published_url` contains WordPress post URL (e.g., `https://yoursite.com/free-marketing-guide-2025`)
- ✓ `wordpress_post_id` stored in database (the WP post ID number)
- ✓ `wordpress_url` stored with full WordPress post URL
- ✓ `published_at` timestamp set

**WordPress Verification:**
1. Login to WordPress admin (`https://yoursite.com/wp-admin`)
2. Navigate to Posts → All Posts
3. Verify new post exists with:
   - Title matching landing page title exactly
   - Content including hero image (if uploaded), headline, subheading, body text, and embedded form
   - Post status = "Published" (not draft)
   - Slug matching landing page slug
   - Author set to authenticated WP user

**Error Handling:**
- If WordPress publish fails, backend returns 500 error with WordPress error details
- Landing page status may remain draft or partially published
- Check backend console logs for detailed WordPress API errors

---

### Scenario 5.3: Test WordPress Connection
**Feature:** WordPress Integration
**Status:** ⚠️ NO UI - API ONLY
**Objective:** Verify WordPress credentials are valid

**Pre-conditions:**
- WordPress configured in backend .env
- JWT authentication token available

**Test Steps (via API/cURL):**
1. Get JWT token by logging in: `POST /api/auth/login`
2. Make authenticated request:
```bash
curl -X GET http://localhost:5001/api/admin/wordpress/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Results:**

**Success Case:**
```json
{
  "success": true,
  "message": "WordPress connection successful",
  "siteInfo": {
    "name": "My WordPress Site",
    "url": "https://yoursite.com",
    "description": "Site description"
  }
}
```

**Error Cases:**
- Invalid Application Password:
  ```json
  {"success": false, "message": "Authentication failed: Invalid credentials"}
  ```
- Wrong site URL / Site unreachable:
  ```json
  {"success": false, "message": "Cannot connect to WordPress site"}
  ```
- Missing credentials (WP_SITE_URL not set):
  ```json
  {"success": false, "message": "WordPress is not configured"}
  ```

**Important Notes:**
- No UI button for testing connection exists in current version
- Must test via API endpoint directly
- Useful for debugging WordPress integration issues before publishing

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

### Scenario 6.6: Admin Publishes Landing Page and Gets Public URL
**Feature:** Landing Page Publishing & URL Distribution
**Objective:** Verify admin can publish a landing page and obtain the public URL for distribution

**Pre-conditions:**
- User is logged in as admin
- Landing page created and saved as draft
- Landing page has slug: "free-marketing-campaign-dec-2025"

**Test Steps:**
1. Navigate to landing page edit page
2. Click "Publish" button
3. Confirm publish action in confirmation dialog
4. Observe the publish success modal

**Expected Results:**
- ✓ Publish success modal appears with title: "🎉 Landing Page Published Successfully!"
- ✓ Modal displays message: "Your landing page is now live and ready to collect leads."
- ✓ Public URL section shows:
  - Label: "Public URL:"
  - Read-only input field with URL: `http://localhost:5001/public/free-marketing-campaign-dec-2025`
  - "📋 Copy URL" button next to input
- ✓ "Sharing suggestions" section lists distribution methods:
  - 📧 Email campaigns (Mailchimp, SendGrid, etc.)
  - 📱 Social media (Facebook, LinkedIn, Twitter, Instagram)
  - 💰 Paid advertising (Google Ads, Facebook Ads)
  - 📄 QR codes (Business cards, flyers, posters)
  - 🌐 Website CTAs and blog posts
- ✓ Modal footer contains:
  - "👁 View Landing Page" button (opens URL in new tab)
  - "Done" button (closes modal)

**Copy URL Functionality Test:**
1. Click "📋 Copy URL" button
2. Expected: Alert appears saying "URL copied to clipboard!"
3. Paste into text editor (Ctrl+V or Cmd+V)
4. Expected: URL `http://localhost:5001/public/free-marketing-campaign-dec-2025` is pasted

**View Landing Page Test:**
1. Click "👁 View Landing Page" button
2. Expected: New tab opens with public landing page
3. Expected: No preview banner visible
4. Expected: Form is fully functional

**API Verification:**
```javascript
// Backend response should include public_url
{
  "success": true,
  "data": {
    "id": 15,
    "title": "Free Marketing Campaign",
    "slug": "free-marketing-campaign-dec-2025",
    "publish_status": "published",
    "published_at": "2025-12-11T10:30:00Z",
    "published_url": "http://localhost:5001/public/free-marketing-campaign-dec-2025",
    "public_url": "http://localhost:5001/public/free-marketing-campaign-dec-2025"
  },
  "message": "Landing page published successfully (WordPress not configured)"
}
```

**Important Notes:**
- Modal only appears after successful publish
- URL format is `{backend_url}/public/{slug}`
- Copy functionality works in modern browsers (navigator.clipboard API)
- Fallback copy method for older browsers using textarea element

---

### Scenario 6.7: External User Accesses Public Landing Page (Incognito Mode)
**Feature:** Public Landing Page Access
**Objective:** Verify external users can access published landing pages without authentication

**Pre-conditions:**
- Landing page published with slug: "free-marketing-campaign-dec-2025"
- Public URL: `http://localhost:5001/public/free-marketing-campaign-dec-2025`

**Test Steps:**
1. Open browser in incognito/private mode (Ctrl+Shift+N in Chrome)
2. Navigate to: `http://localhost:5001/public/free-marketing-campaign-dec-2025`
3. Observe the page content

**Expected Results:**
- ✓ Landing page loads successfully (HTTP 200)
- ✓ **No preview banner** displayed (confirms public mode)
- ✓ **No authentication required** (no login prompt)
- ✓ Page displays all content sections:
  - Hero section with headline and subheadline
  - Body content with HTML formatting
  - Form section with all configured fields
  - Images loaded from MinIO storage (if configured)
  - CTA button with correct text
- ✓ Page title matches landing page title
- ✓ Form is interactive and ready for submission
- ✓ No admin controls or edit buttons visible
- ✓ CORS headers allow access from any origin

**Browser Console Verification:**
1. Open browser DevTools (F12)
2. Check Console tab
3. Expected: No CORS errors
4. Expected: No authentication errors
5. Expected: No 404 errors for assets

**Network Tab Verification:**
1. Open Network tab in DevTools
2. Reload page
3. Check initial request to `/public/free-marketing-campaign-dec-2025`
4. Expected Response Headers:
   - `Content-Type: text/html`
   - `Access-Control-Allow-Origin: *` (for public routes)
   - Status: `200 OK`

**Test Invalid/Unpublished Slug:**
1. Navigate to: `http://localhost:5001/public/invalid-slug-123`
2. Expected: JSON error response with 404 status
   ```json
   {
     "status": "error",
     "message": "Landing page not found",
     "error": {
       "code": "NOT_FOUND",
       "message": "No landing page found with slug: invalid-slug-123"
     }
   }
   ```

**Test Draft Landing Page Access:**
1. Change landing page status to "draft" in database
2. Navigate to public URL
3. Expected: JSON error response with 404 status
   ```json
   {
     "status": "error",
     "message": "Landing page not found",
     "error": {
       "code": "NOT_PUBLISHED",
       "message": "This landing page is not currently published"
     }
   }
   ```

**Important Notes:**
- Public URLs work in any browser without authentication
- No JWT token required for `/public/:slug` routes
- Different CORS policy than admin routes (allows all origins)
- Draft pages return 404 to external users (security feature)

---

### Scenario 6.8: External User Submits Lead Form and Admin Verifies
**Feature:** End-to-End Lead Capture Flow
**Objective:** Complete external user enrollment journey from URL to lead creation

**Pre-conditions:**
- Landing page published with public URL
- Admin has copied and distributed the public URL
- Form configured with fields: Full Name, Email, Phone

**Test Steps - External User (Incognito Browser):**
1. Open incognito/private browser window
2. Navigate to public URL: `http://localhost:5001/public/free-marketing-campaign-dec-2025`
3. Verify page loads without errors
4. Fill out the form:
   - **Full Name:** "Sarah Johnson"
   - **Email:** "sarah.johnson@example.com"
   - **Phone:** "555-987-6543"
5. Click CTA button (e.g., "Get My Free Guide")
6. Observe the submission process

**Expected Results - Form Submission:**
- ✓ Form submits via AJAX POST to `http://localhost:5001/api/public/leads`
- ✓ Success message appears: "Thank you! Your information has been submitted."
- ✓ Form fields are cleared or disabled
- ✓ No page reload occurs
- ✓ Browser console shows no errors

**Network Request Verification:**
1. Open DevTools Network tab before submission
2. Submit form
3. Find POST request to `/api/public/leads`
4. Expected Request:
   ```json
   {
     "landing_page_id": 15,
     "form_data": {
       "Full Name": "Sarah Johnson",
       "Email": "sarah.johnson@example.com",
       "Phone": "555-987-6543"
     }
   }
   ```
5. Expected Response (Status 201):
   ```json
   {
     "success": true,
     "message": "Lead captured successfully",
     "lead": {
       "id": 42,
       "landing_page_id": 15,
       "name": "Sarah Johnson",
       "email": "sarah.johnson@example.com",
       "phone": "555-987-6543",
       "status": "new",
       "submitted_at": "2025-12-11T14:30:00Z"
     }
   }
   ```

**Test Steps - Admin Verification:**
1. In separate authenticated browser session, log in as admin
2. Navigate to Leads page (`/leads`)
3. Look for the newly submitted lead

**Expected Results - Admin Panel:**
- ✓ New lead appears at top of leads list (newest first)
- ✓ Lead details match submission:
  - Name: "Sarah Johnson"
  - Email: "sarah.johnson@example.com"
  - Phone: "(555) 987-6543" (formatted)
  - Status: Badge shows "New" in blue color
  - Source: Shows landing page title "Free Marketing Campaign"
  - Submitted: Shows current date/time
  - Assigned To: Shows "-" (unassigned)
- ✓ Click "View" button to open lead details panel
- ✓ Lead details panel displays all submitted information
- ✓ Contact information section shows clickable email (mailto:) and phone (tel:) links

**Database Verification:**
```sql
SELECT * FROM leads
WHERE email = 'sarah.johnson@example.com'
ORDER BY created_at DESC
LIMIT 1;
```
- ✓ Record exists with correct values
- ✓ `landing_page_id` matches published landing page ID (15)
- ✓ `status` = 'new'
- ✓ `form_data` JSONB column contains all submitted fields
- ✓ `submitted_at` timestamp matches submission time

**Important Notes:**
- This scenario demonstrates complete external user journey
- No authentication required for external user
- Lead immediately visible to admin after submission
- Form submission works from any origin (public CORS policy)
- Phone number auto-formatted in admin panel display

---

### Scenario 6.9: URL Distribution Methods and Best Practices
**Feature:** Landing Page URL Distribution
**Objective:** Document various methods to distribute public landing page URLs

**Distribution Channels:**

**1. Email Campaigns:**
- Copy public URL from publish success modal
- Paste into email campaign platforms:
  - Mailchimp: Add as button or hyperlink in email template
  - SendGrid: Include in campaign body or footer
  - Email signature: Add as clickable link
- Use UTM parameters for tracking: `?utm_source=email&utm_campaign=dec2025`
- Test email in inbox before sending to list

**2. Social Media Sharing:**
- **Facebook:**
  - Post as status update with URL
  - Add to Facebook Ads campaign destination
  - Include in page bio/about section
- **LinkedIn:**
  - Share in post with compelling copy
  - Add to company page featured section
  - Include in LinkedIn Ads
- **Twitter/X:**
  - Tweet with shortened URL (bit.ly, tinyurl)
  - Pin to profile for visibility
- **Instagram:**
  - Add to bio link (Linktree, Beacons)
  - Share in Stories with "Link" sticker
  - Include in post captions (though not clickable)

**3. Paid Advertising:**
- **Google Ads:**
  - Use as final URL in search ads
  - Add to display ad campaigns
  - Set as destination for Google Shopping ads
- **Facebook/Instagram Ads:**
  - Set as website destination in ad setup
  - Use with "Learn More" or "Sign Up" CTA button
- **LinkedIn Ads:**
  - Sponsored content destination URL
  - Lead Gen Form alternative

**4. QR Code Generation:**
- Use online QR generator (qr-code-generator.com, qr.io)
- Input public URL: `http://localhost:5001/public/free-marketing-campaign-dec-2025`
- Download QR code as PNG/SVG
- Print on:
  - Business cards
  - Flyers and brochures
  - Posters and banners
  - Product packaging
  - Event signage
- Test QR code with phone camera before printing

**5. Website Integration:**
- Add as CTA button on homepage
- Include in blog post content
- Create popup with link
- Add to website footer
- Embed in sidebar widget
- Create dedicated landing page with redirect

**6. Direct Sharing:**
- Copy URL from modal and send via:
  - Text message (SMS)
  - WhatsApp/Telegram
  - Slack/Discord
  - Email (one-to-one)

**URL Tracking Best Practices:**
- Add UTM parameters to track sources:
  ```
  http://localhost:5001/public/slug?utm_source=facebook&utm_medium=social&utm_campaign=dec2025
  ```
- Use different URLs for different channels to measure effectiveness
- Monitor lead sources in admin analytics dashboard
- A/B test different headlines by creating multiple landing pages

**Important Notes:**
- Public URL format: `{backend_url}/public/{slug}`
- URLs work without authentication
- CORS allows embedding in iframes (if needed)
- Production URLs would use domain: `https://yourdomain.com/public/slug`
- Slug should be memorable and descriptive for easy sharing

---

### Scenario 6.10: Preview Mode Lead Capture (Admin Testing)
**Feature:** Preview Mode Lead Submission
**Objective:** Verify admins can test lead submissions in preview mode before publishing

**Pre-conditions:**
- User logged in as admin
- Landing page in "draft" status (not published)
- Form configured with fields

**Test Steps:**
1. Navigate to landing pages list (`/landing-pages`)
2. Click "Preview" button on draft landing page
3. New tab opens with URL: `http://localhost:5001/api/admin/landing-pages/:id/preview?token=...`
4. Observe the preview banner at top of page

**Expected Results - Preview Banner:**
- ✓ Blue banner at top of page (sticky position)
- ✓ Banner text: "🔍 PREVIEW MODE - Lead submissions will be saved for testing"
- ✓ Banner background: #2196F3 (blue)
- ✓ Banner text color: white
- ✓ Banner stays visible when scrolling

**Test Lead Submission in Preview:**
1. Fill out the form with test data:
   - **Full Name:** "Test User Preview"
   - **Email:** "test.preview@example.com"
   - **Phone:** "555-111-2222"
2. Click CTA button
3. Observe submission

**Expected Results:**
- ✓ Form submits successfully
- ✓ Success message displayed
- ✓ Lead saved to database (despite draft status)
- ✓ Form posts to: `http://localhost:5001/api/public/leads`

**Admin Verification:**
1. Return to admin panel (authenticated session)
2. Navigate to Leads page
3. Verify test lead appears in list

**Expected Results:**
- ✓ Lead visible with email "test.preview@example.com"
- ✓ Source shows landing page title (even though draft)
- ✓ Status: "new"
- ✓ All form data captured correctly

**Important Use Cases:**
- Allows admin to test form before publishing
- Verifies form fields capture data correctly
- Tests custom field configurations
- Confirms success messages display properly
- Validates form validation rules

**Important Notes:**
- Preview mode uses authentication (token in query param)
- Preview URL format: `/api/admin/landing-pages/:id/preview?token=...`
- Preview allows submissions from draft pages (testing feature)
- Published pages use different URL: `/public/:slug`
- Preview banner distinguishes from public pages

---

## 7. Lead Management

### Scenario 7.1: View Leads List
**Feature:** Lead Management
**Objective:** View all captured leads in admin panel

**Pre-conditions:**
- User is logged in
- At least 3 leads exist in database

**Test Steps:**
1. Navigate to `/leads` or click "Leads" in navigation menu
2. Observe the leads list and toolbar

**Expected Results:**
- ✓ Page header shows "Leads" with subtitle "Manage and track your leads"
- ✓ "📥 Export CSV" button visible in top right
- ✓ Search box with placeholder "Search leads..."
- ✓ Status filter buttons: "All", "New", "Contacted", "Qualified", "Converted"
- ✓ Table with columns:
  - Checkbox (for bulk selection)
  - Name
  - Email
  - Phone (formatted as (123) 456-7890)
  - Source (landing page title)
  - Assigned To (user name or "-")
  - Status (colored badge: New=blue, Contacted=amber, Qualified=indigo, Converted=green)
  - Submitted (formatted date/time)
  - "View" button
- ✓ Leads displayed in reverse chronological order (newest first)
- ✓ Selecting leads shows bulk actions bar at top with status update buttons and assign dropdown

**Important Notes:**
- Route is `/leads` NOT `/admin/leads`
- No traditional pagination shown (may load more on scroll or fixed limit)
- Phone numbers auto-formatted
- Detail panel opens on right side (not separate page)

---

### Scenario 7.2: View Lead Details
**Feature:** Lead Details Panel
**Objective:** View all information about a specific lead

**Pre-conditions:**
- At least one lead exists

**Test Steps:**
1. From leads list table, click "View" button on any lead row
2. Observe the right-side panel that slides in

**Expected Results:**
- ✓ Detail panel opens on right side of screen (overlay or push layout)
- ✓ Close button (×) visible at top right of panel
- ✓ **Contact Information** section shows:
  - Name with value
  - Email as clickable mailto: link
  - Phone as clickable tel: link (formatted)
  - Any additional custom field values
- ✓ **Source** section shows:
  - Source: Landing page title (or "Direct" if no landing page)
  - Submitted: Formatted date/time
- ✓ **Assignment** section shows:
  - "Assigned To" dropdown with current assignment
  - List of users plus "Unassigned" option
  - Changes save automatically on selection
- ✓ **Status** section shows:
  - Current status as colored badge
  - Action buttons: "New", "Contacted", "Qualified", "Converted"
  - Current status button is disabled
- ✓ **Notes & Comments** section shows:
  - Textarea for adding new note (max 1000 chars with counter)
  - "Add Note" button (disabled if empty)
  - List of existing notes with author, timestamp, and delete button (×)
- ✓ **Metadata** section (if available):
  - IP Address
  - User Agent

**Important Notes:**
- Detail panel is a slide-in panel, NOT a separate page
- No "Back" button - close with × or click outside panel
- Email and phone are interactive links
- Assignment and status changes happen in the detail panel
- Notes are threaded conversation style

---

### Scenario 7.3: Filter Leads by Status
**Feature:** Lead Status Filtering
**Objective:** Filter leads by their current status

**Pre-conditions:**
- Leads with different statuses exist (New, Contacted, Qualified, Converted)

**Test Steps:**
1. On leads list page, observe status filter buttons below search box
2. Click "Contacted" status button
3. Observe filtered results
4. Click "All" to clear filter

**Expected Results:**
- ✓ Only leads with "Contacted" status displayed in table
- ✓ "Contacted" button appears active/selected (highlighted)
- ✓ Table updates immediately (client-side filtering)
- ✓ Click "All" to show all leads again
- ✓ Filter does NOT persist after page refresh

**Additional Statuses Available:**
- All (default, shows everything)
- New
- Contacted
- Qualified
- Converted

**Important Notes:**
- No landing page filter dropdown in current UI
- Only status filtering via buttons
- Filtering happens client-side (instant, no API call)

---

### Scenario 7.4: Search Leads
**Feature:** Lead Search
**Objective:** Search leads by multiple fields

**Pre-conditions:**
- Multiple leads exist

**Test Steps:**
1. Locate search box at top of leads page (placeholder "Search leads...")
2. Enter search term: "john"
3. Observe results update automatically (no Enter key needed)

**Expected Results:**
- ✓ Results filter automatically as you type (instant client-side search)
- ✓ Searches across multiple fields:
  - Name (lead_data.name)
  - Email (lead_data.email)
  - Phone (lead_data.phone)
  - Landing page title (source)
- ✓ Search is case-insensitive
- ✓ Empty state message if no matches
- ✓ Clear search by deleting text

**Test Various Searches:**
- Partial email: "smith" → finds john.smith@example.com
- Full name: "John Smith" → finds exact match
- Partial name: "Joh" → finds John, Johnny, etc.
- Phone digits: "555" → finds leads with 555 in phone
- Landing page: "marketing" → finds leads from "Marketing Guide" page

**Important Notes:**
- No separate "Search" button - updates as you type
- No "Clear" button - just delete text
- Search respects active status filter (searches within filtered results)

---

### Scenario 7.5: Export Leads to CSV
**Feature:** Lead Export
**Objective:** Export leads data to CSV file

**Pre-conditions:**
- At least 5 leads exist

**Test Steps:**
1. On leads list page, click "📥 Export CSV" button at top right
2. Optionally apply status filter or search first
3. Wait for download to start automatically

**Expected Results:**
- ✓ CSV file downloads to browser immediately
- ✓ Filename format: `leads-export-YYYY-MM-DD.csv` (e.g., `leads-export-2025-12-10.csv`)
- ✓ CSV contains all filtered/searched leads (respects current view)
- ✓ CSV has 8 columns:
  - ID
  - Name
  - Email
  - Phone
  - Landing Page (title)
  - Source (landing page title or "Direct")
  - Status
  - Created At (ISO format)
- ✓ Data properly escaped (handles commas in names, etc.)

**Important Notes:**
- Export respects search filter (only exports visible/filtered results)
- Export respects status filter
- Does NOT include custom fields beyond the standard ones
- No progress indicator (instant download for small datasets)
- ✓ Data properly escaped (commas, quotes handled)

**CSV Validation:**
- Open in Excel/Google Sheets
- Verify all rows present
- Check special characters handled correctly
- Verify dates formatted properly

---

### Scenario 7.6: Bulk Update Lead Status
**Feature:** Bulk Lead Status Update
**Objective:** Update status of multiple leads at once

**Pre-conditions:**
- At least 3 leads exist with different statuses

**Test Steps:**
1. On leads list page, select multiple leads using checkboxes
2. Observe bulk actions bar appears at top
3. Click one of the status buttons (e.g., "Contacted")
4. Observe confirmation or immediate update

**Expected Results:**
- ✓ Bulk actions bar shows "[N] lead(s) selected"
- ✓ Status update buttons available: "New", "Contacted", "Qualified", "Converted"
- ✓ Click "Contacted" updates all selected leads to that status
- ✓ Status badges in table update for all affected leads
- ✓ Bulk action bar shows "Clear Selection" button
- ✓ Selection clears after update completes

**Additional Bulk Actions:**
- **Assign To:** Dropdown to assign all selected leads to a user or "Unassigned"
- Changes save automatically

**Important Notes:**
- ⚠️ **NO DELETE FUNCTIONALITY** in current UI - leads cannot be deleted from the interface
- Delete endpoint exists in API (`DELETE /api/admin/leads/:id`) but no UI button
- To remove a lead, must use API directly or database access
- This is intentional for data retention and audit purposes

**API Delete (for reference only):**
```bash
curl -X DELETE http://localhost:5001/api/admin/leads/123 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

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

# PHASE 3 SEO ENGINE TESTING SCENARIOS

## 13. Pre-Testing Setup (Phase 3)

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

## 14. Google OAuth Integration

### Test Case 14.1: OAuth Authorization Flow
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

### Test Case 14.2: OAuth Status Check
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

### Test Case 14.3: Disconnect Google Account
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

### Test Case 14.4: Token Refresh
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

## 15. Google Search Console Integration

### Test Case 15.1: View Search Console Sites
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

### Test Case 15.2: Sync Keyword Data
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

### Test Case 15.3: Keyword Filtering
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

### Test Case 15.4: Sort Keywords
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

### Test Case 15.5: Export Keywords to CSV
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

### Test Case 15.6: View Top Keywords
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

### Test Case 15.7: View Declining Keywords
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

### Test Case 15.8: Multi-Day Sync
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

### Test Case 15.9: Indexing Issues (if implemented)
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

## 16. Google Analytics (GA4) Integration

### Test Case 16.1: Add GA4 Property
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

### Test Case 16.2: View GA4 Properties
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

### Test Case 16.3: Sync Analytics Data
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

### Test Case 16.4: Switch Between Properties
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

### Test Case 16.5: Change Time Period
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

### Test Case 16.6: View Top Pages Performance
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

### Test Case 16.7: View Top Events
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

### Test Case 16.8: Format Validation
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

### Test Case 16.9: Empty State Handling
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

### Test Case 16.10: Device Breakdown Accuracy
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

## 17. Public Landing Page Improvements

### Test Case 17.1: View Public URL in Landing Pages List
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

### Test Case 17.2: Access Public Landing Page via Frontend Route
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

### Test Case 17.3: Public Landing Page - Draft Access Denied
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

### Test Case 17.4: Public Landing Page - Invalid Slug
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

### Test Case 17.5: Public Landing Page - GA4 Integration
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

### Test Case 17.6: Public Landing Page - Lead Submission with GA4 Tracking
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

### Test Case 17.7: Public Landing Page - Content Rendering
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

### Test Case 17.8: Public Landing Page - Responsive Design
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

### Test Case 17.9: Database Column Name Fixes Verification
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

### Test Case 17.10: Public Link Click from Admin Panel
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

## 18. SEO Integration Testing

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

## 19. SEO Error Handling

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

## 20. SEO Performance Testing

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

## 21. SEO Security Testing

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

### Phase 3 SEO Engine Features
- [ ] Google OAuth
  - [ ] OAuth connection flow
  - [ ] Status check
  - [ ] Disconnection
  - [ ] Token refresh
  - [ ] Error handling

- [ ] Search Console
  - [ ] View sites list
  - [ ] Sync keywords (7/30/90 days)
  - [ ] Filter/search keywords
  - [ ] Sort keywords
  - [ ] Export to CSV
  - [ ] View top keywords
  - [ ] View declining keywords
  - [ ] Handle empty states

- [ ] Google Analytics
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

- [ ] Public Landing Page Improvements
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

- [ ] Integration & Error Handling
  - [ ] Full SEO workflow
  - [ ] Multi-user scenarios
  - [ ] Session persistence
  - [ ] OAuth errors
  - [ ] API rate limits
  - [ ] Network failures
  - [ ] Invalid inputs
  - [ ] Database errors

- [ ] Performance & Security
  - [ ] Large dataset handling
  - [ ] Concurrent users
  - [ ] Token security
  - [ ] Authorization checks

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
1. **Free Marketing Guide 2025**
   - Slug: free-marketing-guide-2025
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
   - Source: Free Marketing Guide 2025

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

# Phase 3: Google Integration
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5001/api/admin/google/oauth/callback
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

- **v3.0** (Dec 18, 2025) - Consolidated all phases (1, 2, and 3) into single document
- **v2.0** (Dec 10, 2024) - Added Phase 2 scenarios: Custom Fields, Image Upload, WordPress Integration
- **v1.0** (Dec 5, 2024) - Initial version with Phase 1 scenarios

---

**End of Complete Testing Scenarios Document**
