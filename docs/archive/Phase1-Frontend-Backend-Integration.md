# Phase 1 Frontend-Backend Integration - Landing Page Form

**Version:** 1.0
**Date:** 2025-12-04
**Purpose:** Define how the landing page form (frontend) communicates with the backend APIs

---

## 📋 Overview

This document specifies all API calls that the landing page create/edit form makes to the backend. It defines when calls are made, what data is sent, what responses are expected, and how the frontend handles those responses.

**Key Principles:**
- **Optimistic UI** - Show immediate feedback before API responds
- **Error Handling** - Gracefully handle all error scenarios
- **Auto-Save** - Prevent data loss with periodic saves
- **Validation** - Check data integrity before submission

**Related Documentation:**
- [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md) - Backend API specifications
- [Phase1-Landing-Page-Form-Design.md](./Phase1-Landing-Page-Form-Design.md) - Frontend form design

---

## 🎯 API Endpoints Used

### Summary Table

| Action | Method | Endpoint | When Called |
|--------|--------|----------|-------------|
| Load landing page (edit) | GET | `/api/admin/landing-pages/:id` | Page load (edit mode) |
| Check slug uniqueness | GET | `/api/admin/landing-pages?slug=:slug` | Slug field blur/change |
| Create draft | POST | `/api/admin/landing-pages` | Save Draft (create mode) |
| Update draft/published | PUT | `/api/admin/landing-pages/:id` | Save Draft (edit mode) |
| Publish | POST | `/api/admin/landing-pages/:id/publish` | Publish button click |
| Delete | DELETE | `/api/admin/landing-pages/:id` | Delete confirmation |
| Auto-save | POST/PUT | `/api/admin/landing-pages(/:id)` | Every 30s or 5s after typing |

---

## 📥 Operation 1: Load Existing Landing Page (Edit Mode)

### When Called

**Trigger:** User navigates to edit page (`/admin/landing-pages/:id/edit`)

**Timing:** Immediately on page load

---

### API Call

**Method:** `GET`

**Endpoint:** `/api/admin/landing-pages/:id`

**URL Example:**
```
GET /api/admin/landing-pages/42
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:** None (GET request)

---

### Expected Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 42,
    "title": "Free Marketing Guide 2025",
    "slug": "free-marketing-guide-2025",
    "headline": "Download Your Free Digital Marketing Guide",
    "subheading": "Learn the latest strategies that drive results in 2025",
    "body_text": "Our comprehensive 50-page guide covers...",
    "hero_image_url": "https://example.com/images/hero.jpg",
    "cta_text": "Get Your Free Guide",
    "form_fields": {
      "fields": [
        {"name": "name", "type": "text", "required": true, "label": "Full Name"},
        {"name": "email", "type": "email", "required": true, "label": "Email Address"},
        {"name": "phone", "type": "tel", "required": false, "label": "Phone Number"}
      ]
    },
    "publish_status": "published",
    "published_url": "https://dmat-app.example.com/pages/free-marketing-guide-2025.html",
    "published_at": "2025-12-01T14:30:00Z",
    "created_by": 5,
    "created_at": "2025-11-28T10:00:00Z",
    "updated_at": "2025-12-01T14:30:00Z"
  }
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "LANDING_PAGE_NOT_FOUND",
    "message": "Landing page not found"
  }
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this landing page"
  }
}
```

---

### Frontend Behavior

**Before API Call:**
- Show loading skeleton in form fields
- Disable all input fields
- Disable all action buttons
- Show page title: "Loading..."

**On Success (200):**
- Populate all form fields with `data` values
- Convert `form_fields.fields` array to checkbox states:
  - If field name exists in array → checkbox checked
  - If field name doesn't exist → checkbox unchecked
- Show status badge based on `publish_status`:
  - `"draft"` → Gray "Draft" badge
  - `"published"` → Green "Published" badge
  - `"failed"` → Red "Publish Failed" badge
- Update page title: "Edit Landing Page"
- Enable all input fields
- Enable all action buttons
- Store original values for change detection

**On Error (404):**
- Show error page: "Landing page not found"
- Show button: "Back to Landing Pages"
- Don't show form

**On Error (401/403):**
- Show error message: "You don't have permission to view this page"
- Redirect to login (401) or landing pages list (403)

**On Error (500/Network Error):**
- Show error message: "Failed to load landing page. Please try again."
- Show "Retry" button
- Retry on click

---

## 🔍 Operation 2: Check Slug Uniqueness

### When Called

**Trigger:** User types in slug field or title auto-generates slug

**Timing:** Debounced (wait 500ms after user stops typing)

**Note:** Only check if slug has changed from original value (in edit mode)

---

### API Call

**Method:** `GET`

**Endpoint:** `/api/admin/landing-pages?slug=:slug`

**URL Example:**
```
GET /api/admin/landing-pages?slug=free-marketing-guide-2025
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:** None (GET request)

---

### Expected Response

**Slug Available (200 OK, empty list):**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "pages": 0
  }
}
```

**Slug Taken (200 OK, has results):**
```json
{
  "success": true,
  "data": [
    {
      "id": 17,
      "title": "Free Marketing Guide",
      "slug": "free-marketing-guide-2025",
      "publish_status": "published"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

**Note:** In edit mode, if the found landing page ID matches the current page ID, the slug is considered available (user hasn't changed it).

---

### Frontend Behavior

**Before API Call:**
- Show loading indicator next to slug field (small spinner)
- Don't show validation state yet

**On Success (slug available):**
- Hide loading indicator
- Show green checkmark ✓ next to slug field
- Remove any error messages
- Mark slug as valid

**On Success (slug taken):**
- Hide loading indicator
- Show red X ✗ next to slug field
- Show error message: "This slug is already in use. Please choose another."
- Mark slug as invalid
- Disable "Save Draft" and "Publish" buttons

**On Error (Network/500):**
- Hide loading indicator
- Don't show validation state (assume valid to not block user)
- Will be validated again on save

**Special Case (Edit Mode):**
- If found landing page ID === current page ID → Slug is available (no error)
- User is editing the same page, so slug hasn't actually changed

---

## ✏️ Operation 3: Create Landing Page (Save Draft - Create Mode)

### When Called

**Trigger:**
- User clicks "Save Draft" button (create mode)
- Auto-save timer (every 30s or 5s after typing stops)

**Precondition:** Form must pass required field validation (Title, Slug)

---

### API Call

**Method:** `POST`

**Endpoint:** `/api/admin/landing-pages`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Free Marketing Guide 2025",
  "slug": "free-marketing-guide-2025",
  "headline": "Download Your Free Digital Marketing Guide",
  "subheading": "Learn the latest strategies that drive results in 2025",
  "body_text": "Our comprehensive 50-page guide covers SEO, social media, content marketing, and more.\n\nDownload now and transform your marketing strategy!",
  "hero_image_url": "https://example.com/images/marketing-hero.jpg",
  "cta_text": "Get Your Free Guide",
  "form_fields": {
    "fields": [
      {
        "name": "name",
        "type": "text",
        "required": true,
        "label": "Full Name",
        "placeholder": "Enter your full name"
      },
      {
        "name": "email",
        "type": "email",
        "required": true,
        "label": "Email Address",
        "placeholder": "you@example.com"
      },
      {
        "name": "phone",
        "type": "tel",
        "required": false,
        "label": "Phone Number",
        "placeholder": "(555) 123-4567"
      }
    ]
  }
}
```

**Field Mapping (Form → API):**

| Form Field | API Field | Transform |
|------------|-----------|-----------|
| Title | `title` | Trim whitespace |
| Slug | `slug` | Lowercase, trim |
| Headline | `headline` | Trim, null if empty |
| Subheading | `subheading` | Trim, null if empty |
| Body Text | `body_text` | Trim, null if empty |
| Hero Image URL | `hero_image_url` | Trim, null if empty |
| CTA Text | `cta_text` | Trim, null if empty |
| Form Fields (checkboxes) | `form_fields.fields` | Convert to array (see below) |

**Form Fields Conversion Logic:**

Convert checked checkboxes to `form_fields.fields` array:

```
Checked boxes:
- ☑ Name
- ☑ Email
- ☐ Phone
- ☑ Company
- ☐ Job Title
- ☐ Message

Becomes:
{
  "fields": [
    {"name": "name", "type": "text", "required": true, "label": "Full Name", "placeholder": "Enter your full name"},
    {"name": "email", "type": "email", "required": true, "label": "Email Address", "placeholder": "you@example.com"},
    {"name": "company", "type": "text", "required": false, "label": "Company", "placeholder": "Your company name"}
  ]
}
```

**Field Defaults:**
- Name: label="Full Name", placeholder="Enter your full name"
- Email: label="Email Address", placeholder="you@example.com"
- Phone: label="Phone Number", placeholder="(555) 123-4567"
- Company: label="Company", placeholder="Your company name"
- Job Title: label="Job Title", placeholder="Your job title"
- Message: label="Message", placeholder="Enter your message here"

**Required Status:**
- Email: Always `required: true` (hardcoded)
- Name: Default `required: true` (can be changed in Phase 2)
- All others: Default `required: false`

---

### Expected Response

**Success (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 43,
    "title": "Free Marketing Guide 2025",
    "slug": "free-marketing-guide-2025",
    "headline": "Download Your Free Digital Marketing Guide",
    "subheading": "Learn the latest strategies that drive results in 2025",
    "body_text": "Our comprehensive 50-page guide covers...",
    "hero_image_url": "https://example.com/images/marketing-hero.jpg",
    "cta_text": "Get Your Free Guide",
    "form_fields": {
      "fields": [...]
    },
    "publish_status": "draft",
    "published_url": null,
    "published_at": null,
    "created_by": 8,
    "created_at": "2025-12-04T16:45:00Z",
    "updated_at": "2025-12-04T16:45:00Z"
  },
  "message": "Landing page created successfully"
}
```

**Error Responses:**

**400 Bad Request (Validation Error):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "slug",
        "message": "Slug 'free-marketing-guide-2025' is already in use"
      }
    ]
  }
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

---

### Frontend Behavior

**Before API Call (Manual Save):**
- Disable "Save Draft" button
- Change button text to "Saving..." with spinner
- Disable all input fields
- Don't allow navigation away

**Before API Call (Auto-Save):**
- Show "Saving..." indicator (small, non-intrusive, top of form)
- Don't disable inputs (user can keep typing)
- Don't disable buttons

**On Success (201):**
- Store returned `id` (43) - form is now in "edit mode"
- Update URL from `/admin/landing-pages/new` to `/admin/landing-pages/43/edit` (without page reload)
- Enable all inputs and buttons
- Change button text back to "Save Draft"
- Show success message: "Draft saved successfully" (toast notification, 3 seconds)
- Update "Last saved" timestamp: "Last saved: just now"
- Store returned data as "original values" for change detection
- Mark form as "no unsaved changes"

**On Error (400 - Validation):**
- Enable all inputs and buttons
- Change button text back to "Save Draft"
- Show validation errors inline:
  - For each item in `error.details`, find the matching field
  - Show red border around field
  - Show error message below field
- Scroll to first error field
- Focus first error field

**On Error (401):**
- Show error message: "Your session has expired. Please log in again."
- Redirect to login page after 2 seconds

**On Error (500/Network Error):**
- Enable all inputs and buttons
- Change button text back to "Save Draft"
- Show error message: "Failed to save draft. Please try again."
- For auto-save: Show non-intrusive notification, don't block user

---

## 💾 Operation 4: Update Landing Page (Save Draft - Edit Mode)

### When Called

**Trigger:**
- User clicks "Save Draft" button (edit mode)
- Auto-save timer (every 30s or 5s after typing stops)

**Precondition:**
- Landing page already exists (has ID)
- Form must pass required field validation (Title, Slug)

---

### API Call

**Method:** `PUT` (full update) or `PATCH` (partial update)

**Recommended:** Use `PUT` with all fields for simplicity

**Endpoint:** `/api/admin/landing-pages/:id`

**URL Example:**
```
PUT /api/admin/landing-pages/43
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Free Marketing Guide 2025 (Updated)",
  "slug": "free-marketing-guide-2025",
  "headline": "Download Your Free Digital Marketing Guide",
  "subheading": "Learn the latest strategies that drive results in 2025",
  "body_text": "Our comprehensive 50-page guide covers SEO, social media, content marketing, and more.\n\nDownload now and transform your marketing strategy!",
  "hero_image_url": "https://example.com/images/marketing-hero.jpg",
  "cta_text": "Get Your Free Guide",
  "form_fields": {
    "fields": [
      {"name": "name", "type": "text", "required": true, "label": "Full Name", "placeholder": "Enter your full name"},
      {"name": "email", "type": "email", "required": true, "label": "Email Address", "placeholder": "you@example.com"},
      {"name": "phone", "type": "tel", "required": false, "label": "Phone Number", "placeholder": "(555) 123-4567"}
    ]
  }
}
```

**Note:** Same field mapping and transformations as Create (Operation 3)

---

### Expected Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 43,
    "title": "Free Marketing Guide 2025 (Updated)",
    "slug": "free-marketing-guide-2025",
    "headline": "Download Your Free Digital Marketing Guide",
    "subheading": "Learn the latest strategies that drive results in 2025",
    "body_text": "Our comprehensive 50-page guide covers...",
    "hero_image_url": "https://example.com/images/marketing-hero.jpg",
    "cta_text": "Get Your Free Guide",
    "form_fields": {
      "fields": [...]
    },
    "publish_status": "draft",
    "published_url": null,
    "published_at": null,
    "created_by": 8,
    "created_at": "2025-12-04T16:45:00Z",
    "updated_at": "2025-12-04T17:10:00Z"
  },
  "message": "Landing page updated successfully"
}
```

**Error Responses:**

Same as Create (Operation 3):
- 400 Bad Request (validation errors)
- 401 Unauthorized
- 404 Not Found (if landing page was deleted)
- 500 Internal Server Error

---

### Frontend Behavior

**Same as Create (Operation 3) except:**

**On Success (200):**
- Don't change URL (already on edit page)
- Show success message: "Draft saved successfully"
- Update "Last saved" timestamp
- Store returned data as "original values"
- Mark form as "no unsaved changes"

**Additional Error Case (404):**
- Show error: "This landing page has been deleted"
- Redirect to landing pages list after 3 seconds

---

## 🚀 Operation 5: Publish Landing Page

### When Called

**Trigger:** User clicks "Publish" or "Update & Republish" button

**Precondition:**
- Form must pass all validation (required + format)
- Form must be saved first (has an ID)
- If has unsaved changes → Auto-save first, then publish

**Workflow:**
1. If form has unsaved changes → Save draft first (Operation 3 or 4)
2. Wait for save to complete
3. If save successful → Proceed with publish
4. If save failed → Don't publish, show save error

---

### API Call

**Method:** `POST`

**Endpoint:** `/api/admin/landing-pages/:id/publish`

**URL Example:**
```
POST /api/admin/landing-pages/43/publish
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body (Optional Configuration):**
```json
{
  "wordpress_enabled": true,
  "wordpress_category_id": 5
}
```

**Note:** In Phase 1, body is likely empty `{}` since we're using mock WordPress (static files). Configuration shown above is for Phase 2 real WordPress integration.

---

### Expected Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 43,
    "publish_status": "published",
    "published_url": "https://dmat-app.example.com/pages/free-marketing-guide-2025.html",
    "published_at": "2025-12-04T17:30:00Z",
    "wordpress_post_id": null
  },
  "message": "Landing page published successfully",
  "warnings": []
}
```

**Success with Warnings (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 43,
    "publish_status": "published",
    "published_url": "https://dmat-app.example.com/pages/free-marketing-guide-2025.html",
    "published_at": "2025-12-04T17:30:00Z",
    "wordpress_post_id": null
  },
  "message": "Landing page published successfully",
  "warnings": [
    "No headline provided - using page title as fallback",
    "No hero image provided - page will have no banner image"
  ]
}
```

**Error Responses:**

**400 Bad Request (Missing Recommended Fields):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Some recommended fields are missing",
    "details": [
      {
        "field": "headline",
        "message": "Headline is recommended for better engagement",
        "severity": "warning"
      },
      {
        "field": "body_text",
        "message": "Body text is recommended to explain your offer",
        "severity": "warning"
      }
    ]
  }
}
```

**Note:** This 400 response is controversial. Alternative: Always return 200 with warnings, never block publish. Decision: Use warnings in success response (200), don't block publish.

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "LANDING_PAGE_NOT_FOUND",
    "message": "Landing page not found"
  }
}
```

**500 Internal Server Error (Publish Failed):**
```json
{
  "success": false,
  "error": {
    "code": "PUBLISH_FAILED",
    "message": "Failed to publish landing page to WordPress",
    "details": {
      "platform": "wordpress",
      "wordpress_error": "Connection timeout"
    }
  }
}
```

---

### Frontend Behavior

**Before API Call:**

**Step 1: Check for unsaved changes**
- If form has unsaved changes → Show modal:
  - "You have unsaved changes. Save before publishing?"
  - [Cancel] [Save & Publish]
- If user clicks "Save & Publish" → Save draft first (Operation 4)
- If save successful → Proceed to Step 2
- If save failed → Stop, show save error, don't publish

**Step 2: Check for missing recommended fields**
- Check if headline is empty
- Check if body_text is empty
- Check if hero_image_url is empty
- If any missing → Show warning modal:
  - "Some recommended fields are missing:"
  - • Headline
  - • Body Text
  - • Hero Image
  - "Publishing without these may reduce engagement. Publish anyway?"
  - [Go Back] [Publish Anyway]
- If user clicks "Go Back" → Cancel publish, return to form
- If user clicks "Publish Anyway" → Proceed to Step 3

**Step 3: Start publish**
- Disable "Publish" button
- Change button text to "Publishing..." with spinner
- Disable all input fields
- Disable other action buttons
- Show progress message: "Publishing your landing page..."

---

**On Success (200):**
- Enable all inputs and buttons
- Change button text to "Update & Republish" (for already-published page)
- Update status badge to "Published" (green)
- Update `published_url` in form state
- Update `published_at` timestamp
- Show success message: "Landing page published successfully!" (toast, 5 seconds)
- Show published URL with "View Page" button:
  - "Your page is live at: [View Page →]"
  - Link opens published page in new tab
- If warnings exist → Show warnings (non-blocking):
  - "Published successfully with warnings:"
  - List each warning
  - "You can edit the page to address these later"
- Mark form as "no unsaved changes"

**On Error (404):**
- Enable all inputs and buttons
- Change button text back to "Publish"
- Show error message: "Landing page not found. It may have been deleted."
- Redirect to landing pages list after 3 seconds

**On Error (500 - Publish Failed):**
- Enable all inputs and buttons
- Change button text back to "Publish"
- Update status badge to "Publish Failed" (red)
- Show error modal:
  - Title: "Publish Failed"
  - Message: "Failed to publish landing page: [error message]"
  - "Your draft has been saved, but publishing failed. Please try again or contact support if the problem persists."
  - [Try Again] [Back to Edit]
- If "Try Again" → Retry publish (call API again)
- If "Back to Edit" → Close modal, user can edit

**On Error (Network/Timeout):**
- Enable all inputs and buttons
- Change button text back to "Publish"
- Show error message: "Network error. Please check your connection and try again."
- Show "Retry" button

---

## 🗑️ Operation 6: Delete Landing Page

### When Called

**Trigger:** User clicks "Delete" button (edit mode only), then confirms in modal

**Precondition:** Landing page must exist (has ID)

---

### API Call

**Method:** `DELETE`

**Endpoint:** `/api/admin/landing-pages/:id`

**URL Example:**
```
DELETE /api/admin/landing-pages/43
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:** None

---

### Expected Response

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Landing page deleted successfully"
}
```

**Error Responses:**

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "LANDING_PAGE_NOT_FOUND",
    "message": "Landing page not found"
  }
}
```

**409 Conflict (If Business Rule: Can't Delete Published Pages):**
```json
{
  "success": false,
  "error": {
    "code": "CANNOT_DELETE_PUBLISHED",
    "message": "Cannot delete a published landing page. Unpublish it first."
  }
}
```

**Note:** Decision needed: Can users delete published pages? Options:
- **Option A:** Allow deletion (simpler, user in control)
- **Option B:** Require unpublish first (safer, prevents accidents)
- **Recommended:** Option A for Phase 1, add "Unpublish" feature in Phase 2

---

### Frontend Behavior

**Before API Call:**

**Step 1: Show confirmation modal**
- Title: "Delete Landing Page?"
- Message: "This action cannot be undone. All data for '[Landing Page Title]' will be permanently deleted."
- If published: Add warning: "⚠️ This page is currently published and receiving traffic. Deleting it will break the published link."
- Buttons: [Cancel] [Delete Forever]
- Delete button: Red, destructive style

**Step 2: On confirm**
- Close modal
- Show loading overlay on form
- Disable all inputs and buttons
- Show message: "Deleting landing page..."

---

**On Success (200):**
- Show success message: "Landing page deleted successfully" (toast, 3 seconds)
- Redirect to landing pages list: `/admin/landing-pages`
- Clear form state

**On Error (404):**
- Show error message: "Landing page not found. It may have already been deleted."
- Redirect to landing pages list after 2 seconds

**On Error (409 - Can't Delete Published):**
- Show error modal:
  - Title: "Cannot Delete Published Page"
  - Message: "This landing page is currently published. You must unpublish it before deleting."
  - Button: [OK]
- Close modal on OK, return to edit form

**On Error (500/Network):**
- Show error message: "Failed to delete landing page. Please try again."
- Show "Retry" button
- On retry → Call API again
- On cancel → Return to edit form

---

## 💾 Operation 7: Auto-Save

### When Called

**Trigger:**
- Every 30 seconds (if form has changes)
- 5 seconds after user stops typing (debounced)

**Precondition:**
- Form has unsaved changes (compared to last saved state)
- Form passes required field validation (Title, Slug)

**Don't Auto-Save If:**
- No changes since last save
- User is actively typing (wait for 5s pause)
- Previous auto-save is still in progress
- Form has validation errors in required fields

---

### API Call

**Same as:**
- Create (Operation 3) if in create mode (no ID yet)
- Update (Operation 4) if in edit mode (has ID)

---

### Frontend Behavior

**Different from Manual Save:**

**Before API Call:**
- Show subtle "Saving..." indicator (top right of form, small text)
- Don't disable any inputs (user can keep typing)
- Don't disable buttons
- Don't show loading spinner on buttons

**On Success:**
- Hide "Saving..." indicator
- Briefly show "Saved" indicator (2 seconds)
- Update "Last saved" timestamp: "Last saved: just now"
- Store returned data as new baseline for change detection
- Mark form as "no unsaved changes"
- If was in create mode and got back an ID → Switch to edit mode (update URL)

**On Error:**
- Hide "Saving..." indicator
- Show non-intrusive notification: "Auto-save failed" (small toast, bottom right)
- Don't block user or show modal
- Don't interrupt user's work
- User can manually save later

**Retry Logic:**
- Don't retry automatically (to avoid spam)
- Next auto-save attempt will happen in 30s or on next typing pause

---

## 🔄 Operation Summary: Full User Flows

### Flow 1: Create New Landing Page

**Steps:**

1. **Navigate to create page**
   - User clicks "+ New Landing Page" button
   - Navigate to `/admin/landing-pages/new`
   - Show empty form

2. **Fill in title**
   - User types: "Free Marketing Guide 2025"
   - Slug auto-generates: "free-marketing-guide-2025"
   - After 500ms → API call to check slug uniqueness (Operation 2)
   - Response: Slug available ✓

3. **Fill in other fields**
   - User fills: Headline, Subheading, Body, etc.
   - User checks: Name, Email, Phone form fields
   - 5 seconds after typing stops → Auto-save triggered (Operation 7)
   - API: POST /api/admin/landing-pages (Operation 3)
   - Response: Success, ID = 43
   - URL updates to: `/admin/landing-pages/43/edit`
   - Form now in edit mode

4. **Publish**
   - User clicks "Publish" button
   - Check: Missing headline (recommended field)
   - Show warning modal: "Headline is missing. Publish anyway?"
   - User clicks "Publish Anyway"
   - API: POST /api/admin/landing-pages/43/publish (Operation 5)
   - Response: Success, published_url = "https://..."
   - Status badge changes to "Published"
   - Show success message + "View Page" link

**API Calls Made:**
1. GET /api/admin/landing-pages?slug=free-marketing-guide-2025 (uniqueness check)
2. POST /api/admin/landing-pages (auto-save)
3. POST /api/admin/landing-pages/43/publish (publish)

---

### Flow 2: Edit Existing Published Page

**Steps:**

1. **Navigate to edit page**
   - User clicks "Edit" on published page from list
   - Navigate to `/admin/landing-pages/43/edit`
   - API: GET /api/admin/landing-pages/43 (Operation 1)
   - Response: Success, populate form
   - Show status badge: "Published"

2. **Make changes**
   - User updates headline text
   - Mark form as "Unsaved changes"
   - 5 seconds after typing stops → Auto-save
   - API: PUT /api/admin/landing-pages/43 (Operation 4)
   - Response: Success
   - Show "Saved" indicator

3. **Republish**
   - User clicks "Update & Republish" button
   - No unsaved changes (auto-saved already)
   - No missing recommended fields
   - API: POST /api/admin/landing-pages/43/publish (Operation 5)
   - Response: Success
   - Show "Published successfully" message

**API Calls Made:**
1. GET /api/admin/landing-pages/43 (load)
2. PUT /api/admin/landing-pages/43 (auto-save)
3. POST /api/admin/landing-pages/43/publish (republish)

---

### Flow 3: Delete Draft Landing Page

**Steps:**

1. **Navigate to edit page**
   - User clicks "Edit" on draft page
   - Navigate to `/admin/landing-pages/55/edit`
   - API: GET /api/admin/landing-pages/55 (Operation 1)
   - Response: Success, status = "draft"

2. **Decide to delete**
   - User clicks "Delete" button (bottom left)
   - Show confirmation modal: "Delete Landing Page? This cannot be undone."
   - User clicks "Delete Forever"
   - API: DELETE /api/admin/landing-pages/55 (Operation 6)
   - Response: Success
   - Show "Deleted successfully" message
   - Redirect to `/admin/landing-pages`

**API Calls Made:**
1. GET /api/admin/landing-pages/55 (load)
2. DELETE /api/admin/landing-pages/55 (delete)

---

### Flow 4: Handle Network Error During Save

**Steps:**

1. **User fills form**
   - User creates new landing page
   - Fills in title, headline, body text
   - Clicks "Save Draft"

2. **Network error**
   - API: POST /api/admin/landing-pages
   - Response: Network timeout (no response)
   - Show error: "Failed to save draft. Please try again."
   - Button re-enabled

3. **User retries**
   - User clicks "Save Draft" again
   - API: POST /api/admin/landing-pages
   - Response: Success, ID = 44
   - Show "Saved successfully" message
   - URL updates to edit mode

**API Calls Made:**
1. POST /api/admin/landing-pages (failed - network timeout)
2. POST /api/admin/landing-pages (retry - success)

---

## 🎨 UI States During API Calls

### Loading States

**1. Page Load (Edit Mode):**
```
┌────────────────────────────────────┐
│ Loading...                         │
├────────────────────────────────────┤
│                                    │
│ [Loading skeleton]                 │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                  │
│                                    │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                  │
│                                    │
└────────────────────────────────────┘
```

**2. Saving Draft (Manual):**
```
┌────────────────────────────────────┐
│ Edit Landing Page          [Draft] │
├────────────────────────────────────┤
│ [All fields disabled during save]  │
│                                    │
│ [Cancel] [Saving...🔄] [Publish]  │
└────────────────────────────────────┘
```

**3. Auto-Saving:**
```
┌────────────────────────────────────┐
│ Edit Landing Page  Saving... 🔄    │
├────────────────────────────────────┤
│ [All fields remain enabled]        │
│                                    │
│ [Cancel] [Save Draft] [Publish]    │
└────────────────────────────────────┘
```

**4. Publishing:**
```
┌────────────────────────────────────┐
│ Edit Landing Page          [Draft] │
├────────────────────────────────────┤
│ [All fields disabled]              │
│                                    │
│ Publishing your landing page...    │
│                                    │
│ [Cancel] [Save Draft] [Publishing...🔄]│
└────────────────────────────────────┘
```

**5. Checking Slug Uniqueness:**
```
┌────────────────────────────────────┐
│ URL Slug *                      🔄 │
├────────────────────────────────────┤
│ free-marketing-guide-2025          │
└────────────────────────────────────┘
  Checking availability...
```

---

### Success States

**1. Draft Saved:**
```
┌────────────────────────────────────┐
│ Edit Landing Page          [Draft] │
│                 Last saved: just now│
├────────────────────────────────────┤
│                                    │
│ ✅ Draft saved successfully        │
│                                    │
└────────────────────────────────────┘
```

**2. Published:**
```
┌────────────────────────────────────┐
│ Edit Landing Page      [Published] │
├────────────────────────────────────┤
│                                    │
│ ✅ Landing page published successfully!│
│                                    │
│ Your page is live at:              │
│ [View Page →]                      │
│                                    │
│ [Cancel] [Save Draft] [Update & Republish]│
└────────────────────────────────────┘
```

**3. Slug Available:**
```
┌────────────────────────────────────┐
│ URL Slug *                      ✓  │
├────────────────────────────────────┤
│ free-marketing-guide-2025          │
└────────────────────────────────────┘
  Available
```

---

### Error States

**1. Validation Error (Inline):**
```
┌────────────────────────────────────┐
│ Page Title *                    ✗  │
├────────────────────────────────────┤
│                                    │← Red border
└────────────────────────────────────┘
❌ Title is required
```

**2. Slug Taken:**
```
┌────────────────────────────────────┐
│ URL Slug *                      ✗  │
├────────────────────────────────────┤
│ free-marketing-guide-2025          │← Red border
└────────────────────────────────────┘
❌ This slug is already in use. Please choose another.
```

**3. Save Failed:**
```
┌────────────────────────────────────┐
│ Edit Landing Page          [Draft] │
├────────────────────────────────────┤
│                                    │
│ ❌ Failed to save draft. Please try again.│
│                                    │
│ [Cancel] [Save Draft] [Publish]    │
└────────────────────────────────────┘
```

**4. Publish Failed:**
```
╔════════════════════════════════════╗
║  Publish Failed                    ║
╠════════════════════════════════════╣
║                                    ║
║  Failed to publish landing page:   ║
║  Connection timeout                ║
║                                    ║
║  Your draft has been saved, but    ║
║  publishing failed. Please try     ║
║  again or contact support.         ║
║                                    ║
║       [Try Again]  [Back to Edit]  ║
╚════════════════════════════════════╝
```

---

## 🔐 Authentication & Authorization

### Authentication

**All API calls require authentication:**

**Method:** JWT (JSON Web Token) in Authorization header

**Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Storage:**
- Stored in browser: `localStorage` or `sessionStorage`
- Retrieved on every API call

**Token Expiration:**
- If token expired → API returns 401 Unauthorized
- Frontend redirects to login page: `/login`
- After login → Redirect back to original page

---

### Authorization

**Permissions:**

**View Landing Page (GET):**
- User must own the landing page, OR
- User must be admin

**Create Landing Page (POST):**
- Any authenticated user can create

**Update Landing Page (PUT):**
- User must own the landing page, OR
- User must be admin

**Publish Landing Page (POST /publish):**
- User must own the landing page, OR
- User must be admin

**Delete Landing Page (DELETE):**
- User must own the landing page, OR
- User must be admin

**Forbidden (403) Response:**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource"
  }
}
```

**Frontend Behavior on 403:**
- Show error message: "You don't have permission to access this landing page"
- Redirect to landing pages list after 3 seconds

---

## 🔄 Data Synchronization

### Change Detection

**Track Unsaved Changes:**

**Method:** Compare current form state to last saved state

**Implementation:**
1. On page load or successful save → Store form values as "originalValues"
2. On every input change → Compare current values to originalValues
3. If different → Mark as "unsaved changes"
4. If same → Mark as "no unsaved changes"

**What to Compare:**
- All 8 form fields (title, slug, headline, subheading, body_text, hero_image_url, cta_text, form_fields)
- Deep comparison for form_fields array

**Visual Indicator:**
```
┌────────────────────────────────────┐
│ Edit Landing Page  • Unsaved changes│
└────────────────────────────────────┘
```

**Navigation Warning:**
- If user tries to navigate away (clicks Cancel, back button, or different link)
- If form has unsaved changes → Show confirmation:
  - "You have unsaved changes. Discard them?"
  - [Stay on Page] [Discard Changes]

---

### Optimistic UI Updates

**Principle:** Update UI immediately, before API responds

**Examples:**

**1. Save Draft:**
- User clicks "Save Draft"
- Immediately:
  - Disable button
  - Show "Saving..." text
  - Mark as "saving" state
- After API responds:
  - Re-enable button
  - Show success message or error

**2. Publish:**
- User clicks "Publish"
- Immediately:
  - Change button to "Publishing..."
  - Update status badge to "Publishing" (blue, with spinner)
- After API responds:
  - Change status badge to "Published" (green) or "Failed" (red)
  - Update button text to "Update & Republish"

**3. Delete:**
- User confirms delete
- Immediately:
  - Show "Deleting..." overlay
  - Disable all inputs
- After API responds:
  - Redirect to list (success)
  - Show error (failure)

**Rollback on Error:**
- If API call fails → Revert UI to previous state
- Example: If publish fails → Change status badge back to "Draft"

---

### Handling Stale Data

**Scenario:** User opens edit page, another user publishes the same page

**Problem:** User A's form shows old data

**Solution (Phase 2):**
- Periodic refresh (every 60 seconds) → GET latest data
- Show notification if data changed: "This page was updated by another user. Refresh to see changes."
- On next save → Check `updated_at` timestamp, reject if stale

**Phase 1 Solution:**
- No real-time sync
- Last write wins
- User can manually refresh page

---

## 📊 Error Handling Summary

### Error Categories

**1. Validation Errors (400)**
- Show inline below field
- Scroll to first error
- Don't submit to API until fixed

**2. Authentication Errors (401)**
- Redirect to login
- Preserve intended action (redirect back after login)

**3. Authorization Errors (403)**
- Show error message
- Redirect to list page

**4. Not Found Errors (404)**
- Show "Page not found" message
- Redirect to list page

**5. Server Errors (500)**
- Show error message with details
- Offer "Retry" button
- Log error to monitoring service (Phase 2)

**6. Network Errors**
- Detect: No response, timeout, connection refused
- Show: "Network error. Please check your connection."
- Offer: "Retry" button
- For auto-save: Silent failure, don't interrupt user

---

### Retry Logic

**User-Initiated Retry:**
- Show "Retry" button on error
- On click → Make same API call again
- Limit: No automatic retry limit (user controls)

**Automatic Retry (Conservative):**
- Don't retry automatically in most cases
- Exception: Auto-save can retry once after 30s

**Exponential Backoff (Phase 2):**
- If implementing auto-retry
- Wait: 1s, 2s, 4s, 8s between retries
- Max retries: 3

---

## 🧪 Testing Scenarios

### Happy Path Tests

1. **Create and publish new landing page**
   - Fill all fields
   - Save draft
   - Publish
   - Verify published URL works

2. **Edit and republish existing page**
   - Load existing page
   - Make changes
   - Auto-save triggers
   - Republish
   - Verify changes reflected

3. **Delete draft page**
   - Open draft page
   - Click delete
   - Confirm
   - Verify redirect to list

---

### Error Handling Tests

1. **Slug uniqueness conflict**
   - Enter slug that already exists
   - Verify error shown
   - Change slug
   - Verify error clears

2. **Missing required fields**
   - Leave title empty
   - Click "Save Draft"
   - Verify inline error shown
   - Verify form not submitted

3. **Session expiration during edit**
   - Open edit page
   - Wait for session to expire (or simulate)
   - Click "Save Draft"
   - Verify 401 response
   - Verify redirect to login

4. **Network error during publish**
   - Fill form
   - Click "Publish"
   - Simulate network disconnection
   - Verify error message shown
   - Verify "Retry" button works

5. **Landing page deleted by another user**
   - User A opens edit page for ID 50
   - User B deletes ID 50
   - User A clicks "Save Draft"
   - Verify 404 response
   - Verify error message + redirect

---

### Edge Cases

1. **Very long text in fields**
   - Enter 10,000 characters in body_text
   - Verify saves correctly
   - Verify publishes correctly

2. **Special characters in slug**
   - Enter "Free Guide!!!" as title
   - Verify slug auto-generates as "free-guide"
   - Verify special chars removed

3. **Empty optional fields**
   - Create page with only title and slug
   - Publish
   - Verify warning modal shown
   - Verify publish succeeds anyway

4. **Rapid typing (auto-save debounce)**
   - Type continuously for 10 seconds
   - Verify auto-save doesn't trigger until 5s pause
   - Verify only one auto-save call made

5. **Multiple tabs open (same page)**
   - Open edit page in two tabs
   - Edit in tab A, save
   - Edit in tab B, save
   - Verify last write wins (tab B changes saved)

---

## 📚 Related API Documentation

For detailed API specifications, see:

- **GET /api/admin/landing-pages/:id** → [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md) lines 447-554
- **GET /api/admin/landing-pages** (list/search) → [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md) lines 199-445
- **POST /api/admin/landing-pages** (create) → [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md) lines 1-198
- **PUT /api/admin/landing-pages/:id** (update) → [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md) lines 555-730
- **POST /api/admin/landing-pages/:id/publish** → [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md) lines 731-1018
- **DELETE /api/admin/landing-pages/:id** → [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md) lines 1019-1181

---

## ✅ Implementation Checklist

### API Integration Setup
- [ ] Create API client utility (fetch wrapper with auth)
- [ ] Set up base URL configuration (env variable)
- [ ] Implement JWT token storage and retrieval
- [ ] Add auth header to all requests
- [ ] Handle 401 responses (redirect to login)

### Load Landing Page (Edit Mode)
- [ ] Fetch landing page on edit page load
- [ ] Show loading skeleton during fetch
- [ ] Populate form fields from API response
- [ ] Convert form_fields array to checkbox states
- [ ] Handle 404 (show error, redirect)
- [ ] Handle 403 (show permission error)

### Slug Uniqueness Check
- [ ] Implement debounced API call (500ms)
- [ ] Show loading spinner during check
- [ ] Display checkmark on success (available)
- [ ] Display error on conflict (taken)
- [ ] Skip check if slug unchanged (edit mode)

### Create Landing Page
- [ ] Build request body from form state
- [ ] Transform form fields to API format
- [ ] Make POST request on "Save Draft"
- [ ] Handle validation errors (show inline)
- [ ] Update URL to edit mode on success
- [ ] Store returned ID in component state

### Update Landing Page
- [ ] Make PUT request on "Save Draft" (edit mode)
- [ ] Handle validation errors
- [ ] Update "Last saved" timestamp
- [ ] Mark as "no unsaved changes"

### Publish Landing Page
- [ ] Check for unsaved changes before publish
- [ ] Auto-save if needed, wait for completion
- [ ] Show warning modal if missing recommended fields
- [ ] Make POST request to /publish endpoint
- [ ] Update status badge and published URL
- [ ] Show success message with "View Page" link
- [ ] Handle publish errors (show retry option)

### Delete Landing Page
- [ ] Show confirmation modal on delete click
- [ ] Make DELETE request on confirm
- [ ] Show loading overlay during delete
- [ ] Redirect to list on success
- [ ] Handle errors (show message, allow retry)

### Auto-Save
- [ ] Set up 30-second interval timer
- [ ] Set up 5-second debounce on input change
- [ ] Check for unsaved changes before auto-save
- [ ] Show "Saving..." indicator (non-intrusive)
- [ ] Don't disable inputs during auto-save
- [ ] Handle errors silently (toast notification)

### Error Handling
- [ ] Handle all HTTP status codes (400, 401, 403, 404, 500)
- [ ] Handle network errors (timeout, no connection)
- [ ] Show appropriate error messages
- [ ] Implement retry functionality
- [ ] Log errors to console (Phase 1) or monitoring service (Phase 2)

### Change Detection
- [ ] Store original values on load/save
- [ ] Compare current values to original on every change
- [ ] Show "Unsaved changes" indicator
- [ ] Warn on navigation if unsaved changes

### UI States
- [ ] Loading state (skeleton)
- [ ] Saving state (button disabled, spinner)
- [ ] Auto-saving state (subtle indicator)
- [ ] Publishing state (button disabled, progress)
- [ ] Success state (toast notifications)
- [ ] Error state (inline errors, modals)

---

**Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-04
**Maintained by:** DMAT Development Team
