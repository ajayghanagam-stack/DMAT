# Phase 1 - Browser Test Scenarios

**Version:** 1.0
**Date:** 2025-12-04
**Status:** Implementation Complete
**Purpose:** Comprehensive browser testing guide for Phase 1 implementation

---

## 📋 Overview

This document provides step-by-step test scenarios to verify the complete Phase 1 implementation through the browser. All scenarios should be tested to ensure the landing page to lead capture flow works correctly.

**Test Environment:**
- Backend API: http://localhost:5001
- Frontend App: http://localhost:5173
- Test User: admin@innovateelectronics.com / password123

---

## 🔐 Authentication Scenarios

### ✅ Scenario 1: Successful Login
**Steps:**
1. Navigate to http://localhost:5173
2. Enter credentials:
   - Email: `admin@innovateelectronics.com`
   - Password: `password123`
3. Click "Sign In"

**Expected Result:**
- ✓ Redirected to Landing Pages list at `/landing-pages`
- ✓ Sidebar shows user name "Admin User"
- ✓ Navigation menu shows "Landing Pages" and "Leads"

---

### ❌ Scenario 2: Failed Login
**Steps:**
1. Navigate to http://localhost:5173/login
2. Enter wrong credentials:
   - Email: `admin@innovateelectronics.com`
   - Password: `wrongpassword`
3. Click "Sign In"

**Expected Result:**
- ✓ Stays on login page
- ✓ Error message displayed: "Invalid email or password"
- ✓ Form fields remain populated with email

---

### 🔒 Scenario 3: Protected Route Access
**Steps:**
1. Open http://localhost:5173/landing-pages in incognito/private window (not logged in)

**Expected Result:**
- ✓ Automatically redirected to `/login`
- ✓ Cannot access protected pages without authentication

---

### 🚪 Scenario 4: Logout
**Steps:**
1. While logged in, click "Logout" button in sidebar footer
2. Try to access http://localhost:5173/landing-pages

**Expected Result:**
- ✓ Redirected to login page after logout
- ✓ Cannot access protected pages
- ✓ Token removed from localStorage

---

## 📄 Landing Pages Management

### 📋 Scenario 5: View All Landing Pages
**Steps:**
1. Login and navigate to "Landing Pages"
2. Observe the page content

**Expected Result:**
- ✓ See 4-5 sample landing pages in grid view
- ✓ Each card shows:
  - Title
  - Slug (e.g., /test-page)
  - Status badge (Draft or Published)
  - Created date
  - Published date (if published)
  - Headline text (if present)
- ✓ Three action buttons: Edit, Preview, Delete

---

### 🔍 Scenario 6: Search Landing Pages
**Steps:**
1. In the search box at top, type "marketing"
2. Observe results
3. Clear search
4. Observe results

**Expected Result:**
- ✓ Only pages with "marketing" in title/headline/slug appear
- ✓ Search is case-insensitive
- ✓ Clearing search shows all pages again

---

### 🔖 Scenario 7: Filter by Status
**Steps:**
1. Click "Draft" filter button
2. Observe results
3. Click "Published" filter button
4. Observe results
5. Click "All" filter button

**Expected Result:**
- ✓ "Draft": Only draft pages shown (yellow/orange badge)
- ✓ "Published": Only published pages shown (green badge)
- ✓ "All": All pages shown regardless of status
- ✓ Active filter button is highlighted

---

### ➕ Scenario 8: Create New Landing Page
**Steps:**
1. Click "+ Create Landing Page" button
2. Fill in the form:
   - **Title**: "Test Landing Page 2025"
   - **Slug**: Auto-generated or edit to "test-page-2025"
   - **Headline**: "Download Our Free Guide"
   - **Subheading**: "Learn digital marketing strategies"
   - **Body Text**: "Get access to our comprehensive guide covering SEO, social media, and content marketing."
   - **Hero Image URL**: `https://via.placeholder.com/1200x600/667eea/ffffff?text=Test+Page`
   - **CTA Text**: "Get Free Guide"
3. Click "Save Draft"

**Expected Result:**
- ✓ Success alert appears
- ✓ Redirected to edit page with ID in URL (e.g., `/landing-pages/6/edit`)
- ✓ Form is populated with saved data
- ✓ "Delete" button appears (red, bottom left)
- ✓ "Publish" button appears (green, bottom right)

---

### ✏️ Scenario 9: Edit Existing Landing Page
**Steps:**
1. From landing pages list, click "Edit" on any page
2. Change the headline text to "Updated Headline"
3. Click "Save Changes"
4. Navigate back to landing pages list
5. Find the edited page

**Expected Result:**
- ✓ Success alert: "Landing page updated successfully!"
- ✓ Changes saved to database
- ✓ Updated headline visible in card preview

---

### 👁️ Scenario 10: Preview Landing Page (Draft)
**Steps:**
1. While editing a page, click "👁 Preview" button
2. Observe the preview in new tab

**Expected Result:**
- ✓ New tab opens showing HTML preview
- ✓ Yellow banner at top: "⚠️ PREVIEW MODE - Form submissions will not be saved"
- ✓ Gradient hero section with purple/blue colors
- ✓ Headline and subheading displayed correctly
- ✓ Body text rendered with line breaks
- ✓ Hero image displayed (if URL provided)
- ✓ Form with three fields visible:
  - Full Name (required)
  - Email Address (required)
  - Phone Number (optional)
- ✓ Submit button shows custom CTA text
- ✓ Form submission disabled (alert shows "Preview mode")

---

### 🚀 Scenario 11: Publish Landing Page
**Steps:**
1. Edit any draft landing page
2. Click green "Publish" button
3. Confirm the dialog
4. Navigate back to landing pages list

**Expected Result:**
- ✓ Confirmation dialog appears
- ✓ Success message after confirmation
- ✓ Redirected to landing pages list
- ✓ Page status badge changes to "Published" (green)
- ✓ "Published" date appears in the card
- ✓ Published URL populated in database

---

### 🔍 Scenario 12: Preview Published Page
**Steps:**
1. Click "Preview" on a published page
2. Observe the preview

**Expected Result:**
- ✓ Opens in new tab
- ✓ Yellow preview banner still shows
- ✓ Form submission still disabled (preview mode)
- ✓ All content renders correctly

---

### 🗑️ Scenario 13: Delete Landing Page
**Steps:**
1. Click "Delete" button (red) on any page card in list view
2. Confirm deletion dialog

**Expected Result:**
- ✓ Confirmation dialog appears
- ✓ Page removed from list immediately after confirmation
- ✓ Page deleted from database
- ✓ No error messages

---

### 🔤 Scenario 14: Auto-Slug Generation
**Steps:**
1. Click "+ Create Landing Page"
2. Type in Title field: "Amazing Product Launch 2025!!!"
3. Observe Slug field
4. Manually edit slug to "my-custom-slug"
5. Change title to something else
6. Observe slug field

**Expected Result:**
- ✓ Slug auto-generates as "amazing-product-launch-2025"
- ✓ Special characters removed automatically
- ✓ Spaces converted to hyphens
- ✓ After manual edit, slug no longer auto-updates when title changes

---

## 👥 Leads Management

### 📋 Scenario 15: View All Leads
**Steps:**
1. Click "Leads" in sidebar navigation
2. Observe the leads table

**Expected Result:**
- ✓ Table with 8-9 sample leads visible
- ✓ Columns: Name, Email, Phone, Source, Status, Submitted, Actions
- ✓ Each row shows complete lead information
- ✓ Status badges color-coded:
  - New: Blue
  - Contacted: Yellow
  - Qualified: Purple
  - Converted: Green

---

### 🔍 Scenario 16: Search Leads
**Steps:**
1. In search box, type an email address from the visible leads
2. Observe filtered results
3. Clear search and type a name
4. Clear search again

**Expected Result:**
- ✓ Only leads matching email appear
- ✓ Search works for name field
- ✓ Search works for phone field
- ✓ Search works for landing page source
- ✓ Search is case-insensitive
- ✓ Clearing search restores all leads

---

### 🔖 Scenario 17: Filter Leads by Status
**Steps:**
1. Click "New" filter button
2. Click "Contacted" filter button
3. Click "Qualified" filter button
4. Click "Converted" filter button
5. Click "All" filter button

**Expected Result:**
- ✓ "New": Only leads with blue "New" badge shown
- ✓ "Contacted": Only leads with yellow "Contacted" badge shown
- ✓ "Qualified": Only leads with purple "Qualified" badge shown
- ✓ "Converted": Only leads with green "Converted" badge shown
- ✓ "All": All leads shown
- ✓ Active filter button highlighted

---

### 👁️ Scenario 18: View Lead Details
**Steps:**
1. Click "View" button on any lead row
2. Observe the right panel that appears

**Expected Result:**
- ✓ Right panel slides in with lead details
- ✓ Contact Information section shows:
  - Name
  - Email (clickable mailto: link)
  - Phone (clickable tel: link if present)
- ✓ Source section shows:
  - Landing page title
  - Submitted date and time
- ✓ Status section shows:
  - Current status badge
  - Four status change buttons
- ✓ Metadata section shows:
  - IP address
  - User agent
  - Referrer (if available)

---

### ✏️ Scenario 19: Update Lead Status
**Steps:**
1. Open lead details (current status: "New")
2. Click "Contacted" button
3. Observe changes
4. Click "Qualified" button
5. Click "Converted" button

**Expected Result:**
- ✓ Status badge updates immediately
- ✓ Clicked button becomes disabled (grayed out)
- ✓ Status in table row updates
- ✓ Other status buttons remain enabled
- ✓ No page reload required

---

### ❌ Scenario 20: Close Lead Details Panel
**Steps:**
1. With details panel open, click the "✕" button in top right
2. Observe the view

**Expected Result:**
- ✓ Panel closes smoothly
- ✓ Returns to table-only view
- ✓ Selected row highlight removed

---

### 📥 Scenario 21: Export Leads to CSV
**Steps:**
1. Click "📥 Export CSV" button
2. Open the downloaded file

**Expected Result:**
- ✓ CSV file downloads automatically
- ✓ Filename format: `leads-export-YYYY-MM-DD.csv`
- ✓ File contains all visible leads
- ✓ Columns include: ID, Name, Email, Phone, Status, Landing Page, Submitted Date, etc.
- ✓ Data is properly formatted (commas escaped, quotes handled)

---

### 📊 Scenario 22: Export Filtered Leads
**Steps:**
1. Click "Converted" status filter
2. Click "📥 Export CSV"
3. Open the downloaded file

**Expected Result:**
- ✓ CSV contains only converted leads
- ✓ Filtered data matches what's visible in table
- ✓ Export respects active filters

---

## 🔄 End-to-End Flow

### 🎯 Scenario 23: Complete Marketing Campaign Flow

**Part 1: Create Campaign**

1. Login to DMAT at http://localhost:5173
2. Navigate to "Landing Pages"
3. Click "+ Create Landing Page"
4. Fill in form:
   - **Title**: "2025 Marketing Masterclass"
   - **Slug**: "marketing-masterclass-2025"
   - **Headline**: "Join Our Free Marketing Masterclass"
   - **Subheading**: "Learn from industry experts"
   - **Body Text**: "Register now for our exclusive 3-hour workshop covering SEO, social media, and content marketing strategies."
   - **CTA Text**: "Reserve My Spot"
5. Click "Save Draft"

**Expected:**
- ✓ Page created, redirected to edit view

**Part 2: Preview & Publish**

6. Click "👁 Preview" button
7. Review the styled landing page
8. Close preview tab
9. Click green "Publish" button
10. Confirm publication

**Expected:**
- ✓ Preview shows complete styled page
- ✓ Status changes to "Published"
- ✓ Published date populated

**Part 3: Simulate Lead Submission**

11. Note the landing page ID from the URL
12. Open a terminal and run:
```bash
curl -X POST http://localhost:5001/api/public/leads \
  -H "Content-Type: application/json" \
  -d '{
    "landing_page_id": YOUR_PAGE_ID,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "555-9876"
  }'
```

**Expected:**
- ✓ Response: `{"status":"success","message":"Lead submitted successfully"}`

**Part 4: Manage Lead**

13. Navigate to "Leads" section
14. Search for "Jane Doe" or "jane@example.com"
15. Click "View" on Jane's lead
16. Verify source shows "2025 Marketing Masterclass"
17. Click "Contacted" status button
18. Click "Qualified" button
19. Click "Converted" button

**Expected:**
- ✓ Jane Doe appears in leads list
- ✓ Status = "New" initially
- ✓ Source correctly attributed
- ✓ Status updates work smoothly

**Part 5: Export & Analyze**

20. Click "📥 Export CSV" button
21. Open CSV file
22. Verify Jane Doe is in the export
23. Filter by "Converted"
24. Export again
25. Verify only converted leads in second export

**Expected:**
- ✓ CSV downloads successfully
- ✓ Jane's data present in first export
- ✓ Second export filtered correctly

---

## 🐛 Error Handling Scenarios

### ❌ Scenario 24: Create Page Without Required Fields
**Steps:**
1. Click "+ Create Landing Page"
2. Leave Title field empty
3. Click "Save Draft"

**Expected Result:**
- ✓ Browser shows HTML5 validation: "Please fill out this field"
- ✓ Form does not submit
- ✓ Title field highlighted

---

### ⚠️ Scenario 25: Create Duplicate Slug
**Steps:**
1. Create a page with slug "test-page" and save
2. Create another new page
3. Use same slug "test-page"
4. Try to save

**Expected Result:**
- ✓ Error message: "A landing page with slug 'test-page' already exists"
- ✓ Form remains open with data intact
- ✓ User can edit slug and retry

---

### 🔍 Scenario 26: Edit Non-Existent Page
**Steps:**
1. Manually navigate to: http://localhost:5173/landing-pages/99999/edit

**Expected Result:**
- ✓ Error message displayed
- ✓ "Loading..." state completes
- ✓ Error shown gracefully

---

### 🔑 Scenario 27: Invalid Token (Session Expired)
**Steps:**
1. Login successfully
2. Open browser DevTools (F12)
3. Go to Application/Storage → Local Storage
4. Delete the "token" key
5. Try to navigate to any protected page

**Expected Result:**
- ✓ Automatically redirected to login
- ✓ Auth context detects invalid token
- ✓ User must login again

---

## 🎨 UI/UX Scenarios

### 📱 Scenario 28: Responsive Design (Mobile)
**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
3. Select "iPhone 12 Pro" or similar mobile device
4. Navigate through all pages

**Expected Result:**
- ✓ Sidebar collapses to icons-only on mobile
- ✓ Tables scroll horizontally on small screens
- ✓ Action buttons stack vertically
- ✓ Forms remain fully functional
- ✓ No horizontal scrolling on page
- ✓ Text remains readable
- ✓ Touch targets appropriately sized

---

### 📭 Scenario 29: Empty States
**Steps:**
1. Filter landing pages by "Published" when no published pages exist
2. Filter leads by "Converted" when no converted leads exist

**Expected Result:**
- ✓ Empty state message displayed
- ✓ Helpful text: "No [items] found"
- ✓ Suggestion to adjust filters or create new items
- ✓ Icon displayed (📄 or 👥)

---

### 📏 Scenario 30: Long Content Handling
**Steps:**
1. Create landing page with very long title (400+ characters)
2. Add very long body text (multiple paragraphs)
3. Save and view in list

**Expected Result:**
- ✓ Title truncates with ellipsis in card view
- ✓ Full title visible in edit form
- ✓ Body text wraps properly
- ✓ No layout breaking
- ✓ Cards maintain consistent height

---

## 🧭 Navigation & Routing Scenarios

### 🔗 Scenario 31: Direct URL Access (Logged In)
**Steps:**
1. Login successfully
2. Manually type: http://localhost:5173/leads
3. Press Enter

**Expected Result:**
- ✓ Leads page loads directly
- ✓ Sidebar shows "Leads" as active
- ✓ No unnecessary redirects

---

### ⬅️➡️ Scenario 32: Browser Back/Forward
**Steps:**
1. Navigate: Landing Pages → Create New → Leads → Browser Back → Browser Back

**Expected Result:**
- ✓ Each back click returns to previous page
- ✓ Page state preserved
- ✓ No errors in console

---

### 🔄 Scenario 33: Page Refresh
**Steps:**
1. While editing a landing page form (with unsaved changes)
2. Press F5 to refresh

**Expected Result:**
- ✓ Page reloads
- ✓ Unsaved changes are lost (no auto-save in Phase 1)
- ✓ Saved data reloads from database

---

## 📊 Data Validation Scenarios

### 📧 Scenario 34: Email Validation
**Steps:**
1. Attempt to submit lead via API with invalid email:
```bash
curl -X POST http://localhost:5001/api/public/leads \
  -H "Content-Type: application/json" \
  -d '{
    "landing_page_id": 1,
    "name": "Test User",
    "email": "notanemail",
    "phone": "555-1234"
  }'
```

**Expected Result:**
- ✓ Error response with validation message
- ✓ Lead not created in database

---

### 🔢 Scenario 35: Status Filter Accuracy
**Steps:**
1. Go to Leads page
2. Count total leads
3. Click each status filter and count leads
4. Sum all status counts

**Expected Result:**
- ✓ Sum of filtered counts equals total count
- ✓ No lead appears in multiple status categories
- ✓ Each lead counted exactly once

---

## 🎯 Quick Smoke Test (5 Minutes)

Run this rapid test to verify core functionality:

1. ✅ Login → See landing pages list
2. ✅ Create new page → Save draft → Success
3. ✅ Edit page → Change title → Save → Success
4. ✅ Publish page → Confirm → Status changes to published
5. ✅ Preview page → See styled HTML with form
6. ✅ Navigate to Leads → See table of leads
7. ✅ Click View on a lead → See detail panel
8. ✅ Change lead status → Status updates
9. ✅ Export CSV → File downloads
10. ✅ Logout → Redirected to login

**If all 10 items pass: Core functionality verified ✅**

---

## 📝 Testing Checklist

Use this checklist to track your testing progress:

### Authentication
- [ ] Successful login
- [ ] Failed login
- [ ] Protected route redirect
- [ ] Logout

### Landing Pages
- [ ] View all pages
- [ ] Search pages
- [ ] Filter by status (Draft/Published)
- [ ] Create new page
- [ ] Edit existing page
- [ ] Preview page
- [ ] Publish page
- [ ] Delete page
- [ ] Auto-slug generation

### Leads
- [ ] View all leads
- [ ] Search leads
- [ ] Filter by status (New/Contacted/Qualified/Converted)
- [ ] View lead details
- [ ] Update lead status
- [ ] Export to CSV
- [ ] Export filtered leads

### Error Handling
- [ ] Required field validation
- [ ] Duplicate slug error
- [ ] Invalid token redirect
- [ ] Non-existent resource handling

### UI/UX
- [ ] Mobile responsive design
- [ ] Empty states
- [ ] Long content handling
- [ ] Browser back/forward
- [ ] Page refresh

### End-to-End
- [ ] Complete campaign flow (create → publish → lead → manage)

---

## 🚀 Test Coverage Summary

**Total Scenarios:** 35
**Critical Path Scenarios:** 10 (Quick Smoke Test)
**Estimated Testing Time:** 2-3 hours (complete), 5 minutes (smoke test)

---

## 📞 Support

If you encounter issues while testing:
1. Check browser console for errors (F12 → Console tab)
2. Check backend logs in terminal
3. Verify both frontend and backend servers are running
4. Ensure database is properly set up with sample data

**Environment Checklist:**
- [ ] Backend running on http://localhost:5001
- [ ] Frontend running on http://localhost:5173
- [ ] PostgreSQL database running
- [ ] Database migrated with sample data
- [ ] Test user credentials valid

---

**Last Updated:** 2025-12-04
**Phase:** Phase 1 - Landing Pages & Leads
**Status:** ✅ Implementation Complete
