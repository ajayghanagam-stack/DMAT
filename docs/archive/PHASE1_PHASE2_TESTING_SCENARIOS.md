# Phase 1 & Phase 2 Testing Scenarios (ARCHIVED)

**Document Version:** 1.0
**Created:** December 2025
**Status:** ARCHIVED
**Phases:** Phase 1 (MVP) & Phase 2 (Enhancements)

> **Note:** This document archives the testing scenarios for Phase 1 and Phase 2, which have been completed. For current testing, refer to Phase 3 testing scenarios.

---

## Phase 1: MVP - Core Features

### Overview
Phase 1 implemented the core landing page builder and lead management system.

### Features Tested:
- Landing Page CRUD operations
- Lead capture and management
- User authentication (JWT)
- Basic analytics dashboard

---

## Phase 1 Test Cases

### Authentication & User Management

#### Test Case P1-AUTH-1: User Login
**Objective:** Verify users can login with credentials

**Steps:**
1. Navigate to http://localhost:5173/login
2. Enter email: admin@example.com
3. Enter password: (configured password)
4. Click "Login" button

**Expected Results:**
- [ ] Successful authentication
- [ ] JWT token stored
- [ ] Redirect to dashboard
- [ ] User name displayed in UI

---

#### Test Case P1-AUTH-2: Invalid Login
**Objective:** Verify error handling for invalid credentials

**Steps:**
1. Navigate to login page
2. Enter invalid credentials
3. Attempt login

**Expected Results:**
- [ ] Error message displayed
- [ ] No redirect
- [ ] No token stored
- [ ] Password field cleared

---

#### Test Case P1-AUTH-3: Token Expiry
**Objective:** Verify token expiry handling

**Steps:**
1. Login successfully
2. Wait for token to expire (or manually expire in database)
3. Attempt authenticated action

**Expected Results:**
- [ ] Token validation fails
- [ ] Redirect to login
- [ ] Session cleared

---

### Landing Pages Management

#### Test Case P1-LP-1: Create Landing Page
**Objective:** Verify landing page creation

**Steps:**
1. Navigate to Landing Pages
2. Click "+ Create Landing Page"
3. Fill in form:
   - Name: "Product Launch Page"
   - Slug: "product-launch"
   - Title: "Amazing New Product"
   - Description: "Discover our latest innovation"
4. Click "Create"

**Expected Results:**
- [ ] Page created successfully
- [ ] Success message shown
- [ ] Redirect to page list
- [ ] New page appears in list
- [ ] Status: "Draft"

---

#### Test Case P1-LP-2: Edit Landing Page
**Objective:** Verify landing page editing

**Steps:**
1. From page list, click "Edit" on a page
2. Modify fields
3. Click "Save"

**Expected Results:**
- [ ] Changes saved
- [ ] Success message shown
- [ ] Updated_at timestamp updated
- [ ] Changes reflected in list

---

#### Test Case P1-LP-3: Delete Landing Page
**Objective:** Verify landing page deletion

**Steps:**
1. Click "Delete" on a page
2. Confirm deletion

**Expected Results:**
- [ ] Confirmation prompt shown
- [ ] Page deleted from database
- [ ] Removed from list
- [ ] Associated data handled (cascading delete or warning)

---

#### Test Case P1-LP-4: Publish Landing Page
**Objective:** Verify publishing functionality

**Steps:**
1. Select a draft page
2. Click "Publish"
3. Verify public URL

**Expected Results:**
- [ ] Status changes to "Published"
- [ ] Public URL accessible at /public/{slug}
- [ ] Page visible to non-authenticated users
- [ ] Analytics tracking starts

---

#### Test Case P1-LP-5: View Landing Page Stats
**Objective:** Verify page-level analytics

**Steps:**
1. Click "Stats" on a published page
2. Review metrics

**Expected Results:**
- [ ] Views count displayed
- [ ] Leads count displayed
- [ ] Conversion rate calculated
- [ ] Data updates in real-time

---

### Lead Management

#### Test Case P1-LEAD-1: Capture Lead from Public Page
**Objective:** Verify lead form submission from public landing page

**Steps:**
1. Navigate to public page: /public/{slug}
2. Fill lead form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "(555) 123-4567"
   - Message: "Interested in learning more"
3. Click "Submit"

**Expected Results:**
- [ ] Form validation passes
- [ ] Lead saved to database
- [ ] Success message shown
- [ ] Form clears
- [ ] Email notification sent (if configured)
- [ ] Lead appears in admin leads list

---

#### Test Case P1-LEAD-2: View Leads List
**Objective:** Verify leads listing in admin panel

**Steps:**
1. Navigate to Leads page
2. Review leads table

**Expected Results:**
- [ ] All leads displayed
- [ ] Shows: Name, Email, Phone, Landing Page, Date
- [ ] Sorted by date (newest first)
- [ ] Pagination works (if implemented)

---

#### Test Case P1-LEAD-3: View Lead Details
**Objective:** Verify individual lead information

**Steps:**
1. Click on a lead in the list
2. View lead details modal/page

**Expected Results:**
- [ ] All lead information displayed
- [ ] Shows source landing page
- [ ] Shows submission timestamp
- [ ] Shows custom field responses (Phase 2)
- [ ] Edit/Delete options available

---

#### Test Case P1-LEAD-4: Update Lead Status
**Objective:** Verify lead status management

**Steps:**
1. Open lead details
2. Change status (e.g., New → Contacted → Qualified)
3. Save changes

**Expected Results:**
- [ ] Status updated in database
- [ ] Status reflected in leads list
- [ ] Status change logged with timestamp
- [ ] Updated_at timestamp updated

---

#### Test Case P1-LEAD-5: Export Leads to CSV
**Objective:** Verify lead export functionality

**Steps:**
1. Navigate to Leads page
2. Click "Export to CSV"
3. Check downloaded file

**Expected Results:**
- [ ] CSV file downloads
- [ ] Contains all lead fields
- [ ] Proper CSV formatting
- [ ] Opens correctly in Excel/Sheets

---

### Analytics Dashboard

#### Test Case P1-DASH-1: View Dashboard Metrics
**Objective:** Verify dashboard displays key metrics

**Steps:**
1. Navigate to Dashboard
2. Review metrics cards

**Expected Results:**
- [ ] Total landing pages count
- [ ] Total leads count
- [ ] Total page views
- [ ] Average conversion rate
- [ ] Recent leads list
- [ ] Recent page views

---

---

## Phase 2: Enhancements

### Overview
Phase 2 added custom fields, image uploads, and WordPress integration.

### Features Added:
- Custom form fields for landing pages
- Image upload with MinIO (S3-compatible storage)
- Hero images for landing pages
- WordPress REST API integration
- Enhanced landing page content (headline, body, CTA)

---

## Phase 2 Test Cases

### Custom Fields

#### Test Case P2-CF-1: Add Custom Field to Landing Page
**Objective:** Verify custom fields can be added to landing pages

**Steps:**
1. Edit a landing page
2. Navigate to "Custom Fields" section
3. Click "+ Add Field"
4. Configure field:
   - Label: "Company Name"
   - Type: "text"
   - Required: true
5. Save landing page

**Expected Results:**
- [ ] Custom field added
- [ ] Field appears in form builder
- [ ] Field configuration saved
- [ ] Field order can be adjusted (drag/drop if implemented)

---

#### Test Case P2-CF-2: Custom Field Types
**Objective:** Verify different field types work correctly

**Field Types to Test:**
- Text (single line)
- Textarea (multi-line)
- Email
- Phone
- Number
- Date
- Dropdown (select)
- Checkbox
- Radio buttons

**Expected Results:**
- [ ] Each type renders correctly on public page
- [ ] Validation works for each type
- [ ] Data saved correctly in database
- [ ] Data displayed correctly in lead details

---

#### Test Case P2-CF-3: Required Field Validation
**Objective:** Verify required field enforcement

**Steps:**
1. Create landing page with required custom fields
2. On public page, submit form without filling required fields

**Expected Results:**
- [ ] Validation errors shown
- [ ] Form not submitted
- [ ] Clear error messages
- [ ] Focus on first error field

---

#### Test Case P2-CF-4: Custom Field Responses
**Objective:** Verify custom field responses are captured

**Steps:**
1. Submit lead with custom field values
2. View lead details in admin

**Expected Results:**
- [ ] All custom field responses saved
- [ ] Values displayed in lead details
- [ ] Field labels shown with values
- [ ] Included in CSV export

---

### Image Upload & Management

#### Test Case P2-IMG-1: Upload Hero Image
**Objective:** Verify image upload to MinIO storage

**Steps:**
1. Edit a landing page
2. Navigate to "Hero Image" section
3. Click "Upload Image"
4. Select image file (e.g., hero-banner.jpg)
5. Confirm upload

**Expected Results:**
- [ ] Image uploads successfully
- [ ] Progress indicator shown during upload
- [ ] Thumbnail preview displayed
- [ ] Image URL stored in database
- [ ] Image accessible via MinIO URL
- [ ] Image displays on public landing page

---

#### Test Case P2-IMG-2: Replace Hero Image
**Objective:** Verify existing image can be replaced

**Steps:**
1. On page with existing hero image
2. Click "Change Image"
3. Upload new image
4. Confirm replacement

**Expected Results:**
- [ ] Old image replaced (or deleted from storage)
- [ ] New image uploaded
- [ ] Database updated with new URL
- [ ] Public page shows new image immediately

---

#### Test Case P2-IMG-3: Delete Hero Image
**Objective:** Verify image deletion

**Steps:**
1. Click "Remove Image" on a page with hero image
2. Confirm deletion

**Expected Results:**
- [ ] Image removed from storage (MinIO)
- [ ] Database field cleared
- [ ] No image shown on public page
- [ ] Placeholder or default shown

---

#### Test Case P2-IMG-4: Image Format Validation
**Objective:** Verify only allowed formats are accepted

**Allowed Formats:** JPG, PNG, WebP, GIF
**Max Size:** 5MB (or configured limit)

**Steps:**
1. Attempt to upload various file types:
   - Valid: .jpg, .png, .webp, .gif
   - Invalid: .pdf, .docx, .exe, .svg
2. Attempt to upload large file (>5MB)

**Expected Results:**
- [ ] Valid formats accepted
- [ ] Invalid formats rejected with error
- [ ] File size limit enforced
- [ ] Clear error messages shown

---

### Enhanced Landing Page Content

#### Test Case P2-CONTENT-1: Edit Headline and Body
**Objective:** Verify enhanced content fields

**Steps:**
1. Edit a landing page
2. Fill in:
   - Headline: "Transform Your Business Today"
   - Subheadline: "Join thousands of satisfied customers"
   - Body: Rich text content (multiple paragraphs)
3. Save changes

**Expected Results:**
- [ ] All content fields saved
- [ ] Rich text formatting preserved
- [ ] Content displays correctly on public page
- [ ] Responsive on mobile devices

---

#### Test Case P2-CONTENT-2: Call-to-Action (CTA)
**Objective:** Verify CTA button configuration

**Steps:**
1. Configure CTA:
   - Button Text: "Get Started Free"
   - Button Color: "#007bff"
   - Button Link: "#contact-form"
2. Save and view public page

**Expected Results:**
- [ ] CTA button displayed prominently
- [ ] Custom text shown
- [ ] Custom color applied
- [ ] Link works correctly (scrolls to form)

---

### WordPress Integration

#### Test Case P2-WP-1: Configure WordPress Connection
**Objective:** Verify WordPress API connection setup

**Steps:**
1. In backend .env, configure:
   ```
   WP_SITE_URL=https://yoursite.com
   WP_USERNAME=admin
   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
   ```
2. Restart backend server
3. Test connection (if API endpoint exists)

**Expected Results:**
- [ ] Connection successful
- [ ] WordPress site accessible via REST API
- [ ] Authentication works
- [ ] Connection status shown in admin

---

#### Test Case P2-WP-2: Sync Landing Page to WordPress
**Objective:** Verify landing page can be published to WordPress

**Steps:**
1. Create/edit a landing page
2. Click "Publish to WordPress"
3. Confirm sync

**Expected Results:**
- [ ] Page created in WordPress as draft/published post
- [ ] Title, content, featured image synced
- [ ] WordPress post ID stored
- [ ] Link to WordPress post shown
- [ ] Subsequent updates sync correctly

---

#### Test Case P2-WP-3: WordPress Sync Error Handling
**Objective:** Verify error handling for WordPress issues

**Scenarios:**
1. Invalid WordPress credentials
2. WordPress site unreachable
3. WordPress API rate limit

**Expected Results:**
- [ ] Errors caught gracefully
- [ ] User-friendly error messages
- [ ] Detailed errors logged
- [ ] Sync can be retried

---

### General Enhancements

#### Test Case P2-PERF-1: Page Load Performance
**Objective:** Verify performance with images and custom fields

**Expected Results:**
- [ ] Public page loads in <2 seconds
- [ ] Images lazy-loaded or optimized
- [ ] Form submission responsive
- [ ] Admin dashboard loads quickly

---

#### Test Case P2-MOBILE-1: Mobile Responsiveness
**Objective:** Verify all features work on mobile

**Steps:**
1. Test on mobile device or emulator
2. Test all pages:
   - Public landing pages
   - Admin dashboard
   - Lead forms
   - Image uploads

**Expected Results:**
- [ ] All pages responsive
- [ ] Forms usable on mobile
- [ ] Images scale correctly
- [ ] Navigation works
- [ ] Touch interactions smooth

---

## Test Summary

### Phase 1 Coverage
- Authentication: 3 test cases
- Landing Pages: 5 test cases
- Lead Management: 5 test cases
- Dashboard: 1 test case
**Total Phase 1:** 14 test cases

### Phase 2 Coverage
- Custom Fields: 4 test cases
- Image Upload: 4 test cases
- Enhanced Content: 2 test cases
- WordPress Integration: 3 test cases
- General: 2 test cases
**Total Phase 2:** 15 test cases

**Combined Total:** 29 test cases for Phase 1 & 2

---

## Known Issues (Historical)

### Phase 1 Issues (Resolved)
1. Token expiry not initially handled - Fixed in v1.1
2. Lead export missing custom fields - Fixed in v1.2

### Phase 2 Issues (Resolved)
1. Image upload progress not shown - Fixed in v2.1
2. WordPress sync timeout on large content - Increased timeout in v2.2

---

## Archive Notes

**Date Archived:** December 2025

These testing scenarios cover the foundational features of the DMAT platform. Phase 1 and Phase 2 have been successfully completed and deployed.

**Current Phase:** Phase 3 (SEO Engine)

For current testing procedures, refer to:
- `/docs/PHASE3_TESTING_SCENARIOS.md`

---

**End of Phase 1 & 2 Testing Scenarios (Archived)**
