# Phase 1 Leads API Integration - Frontend-Backend Communication

**Version:** 1.0
**Date:** 2025-12-04
**Purpose:** Define how the leads UI (list screen and details panel) communicates with backend APIs

---

## 📋 Overview

This document specifies all API calls that the leads management interface makes to the backend. It defines when calls are made, what data is sent, what responses are expected, and how the frontend handles those responses.

**Key Principles:**
- **Efficient Loading** - Fetch only what's needed, when needed
- **Responsive UI** - Show loading states, don't block user
- **Error Resilience** - Handle all error scenarios gracefully
- **Real-time Updates** - Keep UI in sync with backend state

**Related Documentation:**
- [Phase1-Leads-List-Screen-Design.md](./Phase1-Leads-List-Screen-Design.md) - List screen UI design
- [Phase1-Lead-Details-View-Design.md](./Phase1-Lead-Details-View-Design.md) - Details panel UI design
- [Phase1-Leads-Schema.md](./Phase1-Leads-Schema.md) - Database schema

---

## 🎯 API Endpoints Used

### Summary Table

| Operation | Method | Endpoint | When Called | Required |
|-----------|--------|----------|-------------|----------|
| List leads | GET | `/api/admin/leads` | Page load, filter/sort/pagination | Yes |
| Get lead details | GET | `/api/admin/leads/:id` | Open details panel | Yes |
| Update lead status | PATCH | `/api/admin/leads/:id` | Change status in details panel | Optional Phase 1 |
| Export leads | GET | `/api/admin/leads/export` | Click export button | Phase 1 |
| Delete lead | DELETE | `/api/admin/leads/:id` | Delete confirmation | Phase 2 |

---

## 📥 Operation 1: List Leads

### When Called

**Triggers:**
- User navigates to `/admin/leads` (initial page load)
- User applies any filter (search, landing page, date range, status)
- User changes sort order (click column header)
- User navigates to different page (click pagination)
- User changes page size (select different items per page)
- User clears filters

**Timing:** Immediately on trigger, with debounce for search (300ms)

---

### API Call

**Method:** `GET`

**Endpoint:** `/api/admin/leads`

**Base URL Example:**
```
GET /api/admin/leads
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:** None (GET request)

---

### Query Parameters

**Pagination Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | integer | No | 1 | Current page number (1-indexed) |
| `limit` | integer | No | 25 | Number of leads per page |

**Filter Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `search` | string | No | - | Search by name or email (partial match) |
| `landing_page_id` | integer | No | - | Filter by specific landing page |
| `status` | string | No | - | Filter by status (new, contacted, etc.) |
| `date_from` | ISO date | No | - | Filter leads created after this date |
| `date_to` | ISO date | No | - | Filter leads created before this date |

**Sort Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `sort_by` | string | No | `created_at` | Field to sort by |
| `sort_order` | string | No | `desc` | Sort direction (asc or desc) |

**Valid `sort_by` values:**
- `name` - Sort by lead name alphabetically
- `email` - Sort by email alphabetically
- `landing_page_title` - Sort by landing page title
- `created_at` - Sort by submission date (default)
- `status` - Sort by status alphabetically

**Valid `sort_order` values:**
- `asc` - Ascending (A-Z, oldest first)
- `desc` - Descending (Z-A, newest first, default for created_at)

---

### Example API Calls

**1. Initial Page Load (Defaults):**
```
GET /api/admin/leads?page=1&limit=25&sort_by=created_at&sort_order=desc
```

**2. Search by Name/Email:**
```
GET /api/admin/leads?page=1&limit=25&search=john&sort_by=created_at&sort_order=desc
```

**3. Filter by Landing Page:**
```
GET /api/admin/leads?page=1&limit=25&landing_page_id=42&sort_by=created_at&sort_order=desc
```

**4. Filter by Status:**
```
GET /api/admin/leads?page=1&limit=25&status=new&sort_by=created_at&sort_order=desc
```

**5. Filter by Date Range (Last 7 Days):**
```
GET /api/admin/leads?page=1&limit=25&date_from=2025-11-27&date_to=2025-12-04&sort_by=created_at&sort_order=desc
```

**6. Custom Date Range:**
```
GET /api/admin/leads?page=1&limit=25&date_from=2025-12-01&date_to=2025-12-04&sort_by=created_at&sort_order=desc
```

**7. Sort by Name (Alphabetical):**
```
GET /api/admin/leads?page=1&limit=25&sort_by=name&sort_order=asc
```

**8. Multiple Filters Combined:**
```
GET /api/admin/leads?page=1&limit=25&landing_page_id=42&status=new&date_from=2025-11-27&search=john&sort_by=created_at&sort_order=desc
```

**9. Pagination (Page 2):**
```
GET /api/admin/leads?page=2&limit=25&sort_by=created_at&sort_order=desc
```

**10. Different Page Size:**
```
GET /api/admin/leads?page=1&limit=50&sort_by=created_at&sort_order=desc
```

---

### Expected Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 12847,
      "landing_page_id": 42,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "(555) 123-4567",
      "company": "Acme Corporation",
      "job_title": "Marketing Director",
      "message": "I'm interested in learning more...",
      "status": "new",
      "referrer_url": "https://www.google.com/search?q=marketing",
      "landing_url": "https://dmat-app.example.com/pages/free-guide.html",
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
      "ip_address": "192.168.1.100",
      "created_at": "2025-12-04T14:30:15Z",
      "landing_page": {
        "id": 42,
        "title": "Free Marketing Guide 2025",
        "slug": "free-marketing-guide-2025",
        "published_url": "https://dmat-app.example.com/pages/free-marketing-guide-2025.html",
        "publish_status": "published"
      }
    },
    {
      "id": 12846,
      "landing_page_id": 43,
      "name": "Jane Smith",
      "email": "jane@company.com",
      "phone": null,
      "company": null,
      "job_title": null,
      "message": null,
      "status": "contacted",
      "referrer_url": null,
      "landing_url": "https://dmat-app.example.com/pages/product-demo.html",
      "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/537.36",
      "ip_address": "192.168.1.101",
      "created_at": "2025-12-04T12:15:00Z",
      "landing_page": {
        "id": 43,
        "title": "Product Demo Sign-Up",
        "slug": "product-demo-signup",
        "published_url": "https://dmat-app.example.com/pages/product-demo-signup.html",
        "publish_status": "published"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 47,
    "pages": 2,
    "has_next": true,
    "has_previous": false
  },
  "filters": {
    "search": null,
    "landing_page_id": null,
    "status": null,
    "date_from": null,
    "date_to": null
  },
  "sort": {
    "sort_by": "created_at",
    "sort_order": "desc"
  }
}
```

**Response Field Descriptions:**

**`data` Array:**
- Contains array of lead objects
- Each lead includes full contact information
- Includes nested `landing_page` object with title and URL
- `phone`, `company`, `job_title`, `message` can be `null` (optional fields)
- `referrer_url` can be `null` (direct visits)

**`pagination` Object:**
- `page`: Current page number
- `limit`: Items per page
- `total`: Total number of leads matching filters
- `pages`: Total number of pages
- `has_next`: Boolean, true if more pages exist
- `has_previous`: Boolean, true if previous page exists

**`filters` Object:**
- Echo back applied filters
- Useful for debugging and UI state management

**`sort` Object:**
- Echo back current sort settings

---

### Error Responses

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

**400 Bad Request (Invalid Parameters):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameters",
    "details": [
      {
        "field": "page",
        "message": "Page must be a positive integer"
      },
      {
        "field": "status",
        "message": "Invalid status value. Must be one of: new, contacted, qualified, converted, unqualified, spam"
      }
    ]
  }
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An error occurred while fetching leads"
  }
}
```

---

### Frontend Behavior

**Before API Call:**
- Show loading state (skeleton rows in table)
- Keep filters enabled (user can change while loading)
- Don't show pagination controls during loading
- If filtering/sorting (not initial load) → Show subtle loading indicator

**On Success (200):**
- Parse `data` array and populate table rows
- For each lead, extract:
  - Name → Column 1
  - Email → Column 2 (make clickable mailto:)
  - Phone → Column 3 (make clickable tel:, show "—" if null)
  - Landing Page title → Column 4 (from `landing_page.title`)
  - Created At → Column 5 (format as relative time: "2 hours ago")
  - Source → Column 6 (extract domain from `referrer_url`, show "Direct" if null)
  - Status → Column 7 (show colored badge based on status value)

- Update results count:
  - If search/filters active: "Showing X leads matching [criteria]"
  - If no filters: "Showing X leads"
  - With pagination: "Showing 1-25 of 47 leads"

- Update pagination controls:
  - Current page: Bold/highlighted
  - Previous button: Disable if `has_previous` is false
  - Next button: Disable if `has_next` is false
  - Show page numbers based on `pages` value

- Update sort indicators:
  - Add ↑ or ↓ to sorted column header
  - Based on `sort.sort_by` and `sort.sort_order`

- Remove loading state

**On Error (401):**
- Show error message: "Your session has expired. Please log in again."
- Redirect to login page after 2 seconds

**On Error (400):**
- Show error message: "Invalid request parameters"
- If `details` provided → Show specific validation errors
- Reset to default parameters (no filters, default sort)
- Retry with defaults

**On Error (500/Network Error):**
- Show error state (empty table with error message):
  ```
  ⚠️ Failed to load leads
  There was an error loading your leads. Please try again.
  [Try Again]
  ```
- Keep filters enabled
- Provide "Try Again" button → Retry same API call
- Don't show table or pagination

**Empty Results (data array is empty):**

**Case 1: No leads exist at all (no filters applied):**
- Show empty state:
  ```
  📊 No leads captured yet
  Leads will appear here when visitors submit forms on your published landing pages.
  [Create Landing Page]
  ```

**Case 2: Filters applied but no matches:**
- Show no results state:
  ```
  🔍 No leads match your filters
  Try adjusting your filters or search criteria.
  [Clear All Filters]
  ```

---

### Data Transformations

**Source Extraction:**
```
referrer_url: "https://www.google.com/search?q=marketing"
→ Extract domain: "google.com"

referrer_url: null
→ Show: "Direct"

referrer_url: "https://m.facebook.com/posts/12345"
→ Extract domain: "facebook.com" (strip www. and m.)
```

**Timestamp Formatting:**
```
created_at: "2025-12-04T14:30:15Z"

If < 1 hour ago: "X minutes ago"
If < 24 hours ago: "X hours ago"
If < 7 days ago: "X days ago"
If < 365 days ago: "Dec 4, 2025"
Else: "Dec 4, 2024"

Hover tooltip: "December 4, 2025 at 2:30:15 PM EST"
```

**Status Badge Mapping:**
```
status: "new" → Blue badge "New"
status: "contacted" → Green badge "Contacted"
status: "qualified" → Purple badge "Qualified"
status: "converted" → Dark green badge "Converted"
status: "unqualified" → Gray badge "Unqualified"
status: "spam" → Red badge "Spam"
```

---

## 📄 Operation 2: Get Lead Details

### When Called

**Trigger:** User clicks a lead row in the leads list

**Timing:** Immediately on row click (before panel animation completes)

**Note:** If lead data is already available from the list response, may skip API call and use cached data. Optional optimization for Phase 1.

---

### API Call

**Method:** `GET`

**Endpoint:** `/api/admin/leads/:id`

**URL Example:**
```
GET /api/admin/leads/12847
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:** None (GET request)

**URL Parameters:**
- `:id` - Lead ID (integer)

---

### Expected Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 12847,
    "landing_page_id": 42,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "(555) 123-4567",
    "company": "Acme Corporation",
    "job_title": "Marketing Director",
    "message": "I'm interested in learning more about your digital marketing solutions for enterprise clients. We have a team of 50+ and are looking to improve our lead generation process.",
    "status": "new",
    "referrer_url": "https://www.google.com/search?q=digital+marketing+guide",
    "landing_url": "https://dmat-app.example.com/pages/free-marketing-guide.html?utm_source=google&utm_medium=organic",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "ip_address": "192.168.1.100",
    "created_at": "2025-12-04T14:30:15Z",
    "updated_at": "2025-12-04T14:30:15Z",
    "landing_page": {
      "id": 42,
      "title": "Free Marketing Guide 2025",
      "slug": "free-marketing-guide-2025",
      "published_url": "https://dmat-app.example.com/pages/free-marketing-guide-2025.html",
      "publish_status": "published"
    }
  }
}
```

**Note:** Response includes same fields as list response, but this is the authoritative, complete version. List may have truncated some fields for performance.

---

### Error Responses

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "LEAD_NOT_FOUND",
    "message": "Lead not found"
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
    "message": "You don't have permission to access this lead"
  }
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An error occurred while fetching lead details"
  }
}
```

---

### Frontend Behavior

**Before API Call:**
- Open side panel immediately (don't wait for API response)
- Slide in animation starts (300ms)
- Show loading skeleton in panel:
  ```
  ┌───────────────────────────────┐
  │  Lead Details          [×]    │
  ├───────────────────────────────┤
  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓              │
  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓          │
  │                               │
  │  Contact Information          │
  │  ▓▓▓▓▓▓▓▓▓▓▓▓                │
  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓            │
  └───────────────────────────────┘
  ```
- Update URL to include lead ID: `/admin/leads?view=12847`

**On Success (200):**
- Populate all panel sections with data from response:

  **Header Section:**
  - Lead name: `data.name`
  - Lead email: `data.email` (clickable mailto:)
  - Status badge: `data.status`

  **Contact Information Section:**
  - Email: `data.email`
  - Phone: `data.phone` (or "Not provided" if null)
  - Name: `data.name`
  - Company: `data.company` (or "Not provided" if null)
  - Job Title: `data.job_title` (or "Not provided" if null)
  - Message: `data.message` (full text, or "No message provided" if null)

  **Landing Page Section:**
  - Title: `data.landing_page.title`
  - Published URL: `data.landing_page.published_url`
  - "View Page" link → Opens `published_url` in new tab
  - "Edit Page" link → Navigate to `/admin/landing-pages/${data.landing_page_id}/edit`
  - If `landing_page` is null → Show "⚠ [Deleted Landing Page]"

  **Source Data Section:**
  - Referrer URL: `data.referrer_url` (full URL, or "Direct visit (no referrer)" if null)
  - Landing URL: `data.landing_url` (full URL)
  - Source: Extract domain from `referrer_url` (or "Direct" if null)

  **Metadata Section:**
  - Submitted: Format `data.created_at` as absolute + relative time
  - IP Address: `data.ip_address`
  - User Agent: `data.user_agent` (full string)
  - Lead ID: `data.id`

  **Status Section:**
  - Current status badge: `data.status`
  - Dropdown: Pre-select `data.status`

- Remove loading skeleton
- Enable all interactions

**On Error (404):**
- Show error state in panel:
  ```
  ⚠️ Lead Not Found
  This lead could not be loaded. It may have been deleted.
  [Close]
  ```
- Disable all fields
- Only show close button
- User clicks Close → Close panel, return to list

**On Error (401/403):**
- Show error message: "You don't have permission to view this lead"
- Close panel after 2 seconds
- If 401 → Redirect to login

**On Error (500/Network):**
- Show error state in panel:
  ```
  ⚠️ Failed to Load Lead
  There was an error loading this lead. Please try again.
  [Try Again] [Close]
  ```
- "Try Again" → Retry API call
- "Close" → Close panel

---

## ✏️ Operation 3: Update Lead Status (Optional Phase 1)

### When Called

**Trigger:** User changes status in details panel and clicks "Update Status" button

**Precondition:**
- Lead details panel is open
- User has selected a different status from dropdown
- "Update Status" button is enabled (status changed from current)

**Timing:** Immediately on "Update Status" button click

---

### API Call

**Method:** `PATCH`

**Endpoint:** `/api/admin/leads/:id`

**URL Example:**
```
PATCH /api/admin/leads/12847
```

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "contacted"
}
```

**URL Parameters:**
- `:id` - Lead ID (integer)

**Request Body Parameters:**
- `status` - New status value (string)

**Valid Status Values:**
- `"new"`
- `"contacted"`
- `"qualified"`
- `"converted"`
- `"unqualified"`
- `"spam"`

---

### Expected Response

**Success (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 12847,
    "status": "contacted",
    "updated_at": "2025-12-04T16:45:00Z"
  },
  "message": "Lead status updated successfully"
}
```

**Note:** Response includes minimal data (just updated fields). Frontend already has full lead data in panel.

---

### Error Responses

**400 Bad Request (Invalid Status):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid status value",
    "details": [
      {
        "field": "status",
        "message": "Status must be one of: new, contacted, qualified, converted, unqualified, spam"
      }
    ]
  }
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": {
    "code": "LEAD_NOT_FOUND",
    "message": "Lead not found"
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
    "message": "You don't have permission to update this lead"
  }
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An error occurred while updating lead status"
  }
}
```

---

### Frontend Behavior

**Before API Call:**
- Disable "Update Status" button
- Change button text to "Updating..." with spinner
- Disable status dropdown (prevent changes during update)
- Keep panel open and visible

**On Success (200):**
- Update current status badge to new status (use value from response: `data.status`)
- Show success message: "✓ Status updated successfully" (green, below status section)
- Show timestamp: "Updated just now" (gray text)
- Success message fades out after 3 seconds
- Re-enable status dropdown
- Reset button text to "Update Status"
- Disable button (no change from current status now)
- **Update leads list in background:**
  - Find row with matching lead ID
  - Update status badge in that row to new status
  - Don't reload entire list (just update one row)
- Store new status as current status for change detection

**On Error (400 - Invalid Status):**
- Re-enable status dropdown
- Re-enable button
- Show error message: "Invalid status value. Please try again." (red, below status section)
- Keep dropdown on selected value (user can change and retry)

**On Error (404):**
- Show error message: "This lead has been deleted"
- Disable status controls
- Show "Close" button
- Close panel automatically after 3 seconds

**On Error (401/403):**
- Show error message: "You don't have permission to update this lead"
- Re-enable dropdown and button
- If 401 → Redirect to login after 2 seconds

**On Error (500/Network):**
- Re-enable status dropdown
- Re-enable button
- Show error message: "Failed to update status. Please try again." (red, below status section)
- Keep dropdown on selected value
- User can click button again to retry

---

## 📤 Operation 4: Export Leads (Phase 1)

### When Called

**Trigger:** User clicks "Export" button (top right of leads list screen)

**Timing:** Immediately on button click

**Note:** Export all leads matching current filters (not just current page)

---

### API Call

**Method:** `GET`

**Endpoint:** `/api/admin/leads/export`

**URL Example:**
```
GET /api/admin/leads/export?format=csv
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `format` | string | No | `csv` | Export format (csv, xlsx in Phase 2) |
| `search` | string | No | - | Same as list API |
| `landing_page_id` | integer | No | - | Same as list API |
| `status` | string | No | - | Same as list API |
| `date_from` | ISO date | No | - | Same as list API |
| `date_to` | ISO date | No | - | Same as list API |

**Important:** Pass same filter parameters as current list view to export only filtered results (Phase 2 enhancement). For Phase 1, may export all leads regardless of filters (simpler).

---

### Expected Response

**Success (200 OK):**

**Response Headers:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="leads-export-2025-12-04.csv"
```

**Response Body (CSV format):**
```csv
Name,Email,Phone,Company,Job Title,Landing Page,Created At,Source,Status
John Doe,john@example.com,(555) 123-4567,Acme Corporation,Marketing Director,Free Marketing Guide 2025,2025-12-04 14:30:15,google.com,new
Jane Smith,jane@company.com,,,Product Demo Sign-Up,2025-12-04 12:15:00,Direct,contacted
Michael Johnson,michael@tech.com,(555) 987-6543,Tech Corp,CTO,SEO Checklist Download,2025-12-03 18:45:00,linkedin.com,qualified
```

**CSV Column Order:**
1. Name
2. Email
3. Phone (empty if null)
4. Company (empty if null)
5. Job Title (empty if null)
6. Landing Page (title)
7. Created At (formatted as YYYY-MM-DD HH:MM:SS)
8. Source (extracted domain, or "Direct")
9. Status

**CSV Formatting Rules:**
- Double quotes around values containing commas
- Empty string for null values (not "null")
- Timestamps in local timezone or UTC with timezone indicator
- Header row included

---

### Error Responses

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

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": {
    "code": "EXPORT_FAILED",
    "message": "Failed to generate export file"
  }
}
```

---

### Frontend Behavior

**Before API Call:**
- Disable "Export" button
- Change button text to "Exporting..." with spinner
- Don't block rest of UI (user can continue browsing)

**On Success (200):**
- Browser automatically downloads file (due to Content-Disposition header)
- Filename: `leads-export-2025-12-04.csv` (date is today's date)
- Re-enable button
- Change button text back to "Export"
- Show success toast: "✓ Leads exported successfully" (3 seconds)

**On Error (401):**
- Show error message: "Your session has expired. Please log in again."
- Redirect to login

**On Error (500):**
- Re-enable button
- Show error message: "Failed to export leads. Please try again."
- User can retry by clicking button again

**Alternative Implementation (Phase 2):**
- Show export options modal:
  ```
  ╔═══════════════════════════════════╗
  ║  Export Leads                     ║
  ╠═══════════════════════════════════╣
  ║  Format:                          ║
  ║  ○ CSV                            ║
  ║  ○ Excel (.xlsx)                  ║
  ║                                   ║
  ║  Scope:                           ║
  ║  ○ All leads (47 leads)           ║
  ║  ○ Filtered results (23 leads)    ║
  ║  ○ Selected leads (5 leads)       ║
  ║                                   ║
  ║     [Cancel]  [Export]            ║
  ╚═══════════════════════════════════╝
  ```

---

## 🔄 Complete User Flows

### Flow 1: View Leads List (Initial Load)

**Steps:**

1. **User navigates to /admin/leads**
   - Browser loads page
   - React component mounts

2. **Frontend makes API call**
   - API: `GET /api/admin/leads?page=1&limit=25&sort_by=created_at&sort_order=desc`
   - Show loading skeleton in table

3. **API responds with 47 leads (page 1 of 2)**
   - Response includes 25 leads in `data` array
   - Pagination: `{page: 1, limit: 25, total: 47, pages: 2, has_next: true}`

4. **Frontend displays results**
   - Populate table with 25 rows
   - Show "Showing 1-25 of 47 leads"
   - Show pagination: [← Previous (disabled)] [1 (active)] [2] [Next →]
   - Sort indicator on "Created At" column: ↓

**API Calls Made:** 1 (GET /api/admin/leads)

---

### Flow 2: Search for Specific Lead

**Steps:**

1. **User types in search field**
   - User types: "john"
   - Frontend waits 300ms (debounce)

2. **Frontend makes API call**
   - API: `GET /api/admin/leads?page=1&limit=25&search=john&sort_by=created_at&sort_order=desc`
   - Show subtle loading indicator (don't replace table, just indicate loading)

3. **API responds with 5 matching leads**
   - Response includes 5 leads in `data` array
   - Pagination: `{page: 1, limit: 25, total: 5, pages: 1, has_next: false}`

4. **Frontend displays filtered results**
   - Update table with 5 rows
   - Show "Showing 5 leads matching 'john'"
   - Hide pagination (only 1 page)
   - Keep search field value: "john"
   - Show "Clear Filters" button (if not visible already)

**API Calls Made:** 1 (GET /api/admin/leads with search)

---

### Flow 3: Filter by Landing Page and Status

**Steps:**

1. **User selects landing page filter**
   - User opens "Landing Page" dropdown
   - User selects "Free Marketing Guide 2025" (ID: 42)

2. **Frontend makes API call**
   - API: `GET /api/admin/leads?page=1&limit=25&landing_page_id=42&sort_by=created_at&sort_order=desc`
   - Show loading state

3. **API responds with 23 leads from that page**
   - Update table with results
   - Show "Showing 23 leads"

4. **User also selects status filter**
   - User opens "Status" dropdown
   - User selects "New"

5. **Frontend makes API call**
   - API: `GET /api/admin/leads?page=1&limit=25&landing_page_id=42&status=new&sort_by=created_at&sort_order=desc`
   - Show loading state

6. **API responds with 8 leads matching both filters**
   - Update table with 8 rows
   - Show "Showing 8 leads"

**API Calls Made:** 2 (one for each filter change)

---

### Flow 4: Sort by Name

**Steps:**

1. **User on leads list with default sort (Created At ↓)**
   - Table shows 47 leads, newest first

2. **User clicks "Name" column header**
   - Frontend detects click on sortable column
   - Toggle sort to ascending (first click on new column → ascending)

3. **Frontend makes API call**
   - API: `GET /api/admin/leads?page=1&limit=25&sort_by=name&sort_order=asc`
   - Show loading state

4. **API responds with leads sorted A-Z by name**
   - Update table with new order
   - Move sort indicator from "Created At" to "Name": ↑
   - First row: "Alice Johnson"
   - Last row (of page): "Michael Chen"

5. **User clicks "Name" column header again**
   - Toggle to descending

6. **Frontend makes API call**
   - API: `GET /api/admin/leads?page=1&limit=25&sort_by=name&sort_order=desc`

7. **API responds with leads sorted Z-A**
   - Update table
   - Sort indicator: ↓
   - First row: "Zoe Williams"

**API Calls Made:** 2 (one for each sort change)

---

### Flow 5: Paginate Through Results

**Steps:**

1. **User on page 1 of 2 (47 total leads)**
   - Showing leads 1-25
   - Pagination: [← Previous (disabled)] [1 (active)] [2] [Next →]

2. **User clicks "Next" or page "2"**
   - Frontend makes API call
   - API: `GET /api/admin/leads?page=2&limit=25&sort_by=created_at&sort_order=desc`
   - Show loading state

3. **API responds with page 2 (remaining 22 leads)**
   - Response includes 22 leads (47 - 25 = 22)
   - Pagination: `{page: 2, limit: 25, total: 47, pages: 2, has_next: false, has_previous: true}`

4. **Frontend displays page 2**
   - Update table with 22 rows
   - Show "Showing 26-47 of 47 leads"
   - Update pagination: [← Previous] [1] [2 (active)] [Next → (disabled)]
   - Scroll to top of table

**API Calls Made:** 1 (GET /api/admin/leads with page=2)

---

### Flow 6: Open Lead Details and Update Status

**Steps:**

1. **User clicks on "John Doe" row in list**
   - Frontend opens side panel (slides in from right)
   - URL updates to `/admin/leads?view=12847`

2. **Frontend makes API call**
   - API: `GET /api/admin/leads/12847`
   - Show loading skeleton in panel

3. **API responds with full lead details**
   - Populate all panel sections with data
   - Current status badge shows: "New"
   - Status dropdown pre-selected: "New"

4. **User wants to mark as contacted**
   - User opens status dropdown
   - User selects "Contacted"
   - "Update Status" button enables (detects change)

5. **User clicks "Update Status"**
   - Frontend makes API call
   - API: `PATCH /api/admin/leads/12847` with `{"status": "contacted"}`
   - Button shows "Updating..." with spinner
   - Dropdown disabled

6. **API responds with success**
   - Response: `{"success": true, "data": {"id": 12847, "status": "contacted", "updated_at": "..."}}`

7. **Frontend updates UI**
   - Current status badge updates to "Contacted" (green)
   - Show success message: "✓ Status updated successfully"
   - Show timestamp: "Updated just now"
   - Re-enable dropdown, reset button
   - **Update list row in background:**
     - Find row with ID 12847
     - Change status badge from "New" to "Contacted"
   - Success message fades after 3 seconds

**API Calls Made:** 2 (GET details, PATCH status)

---

### Flow 7: Export Leads

**Steps:**

1. **User on leads list (no filters, 47 leads)**
   - User clicks "Export" button (top right)

2. **Frontend makes API call**
   - API: `GET /api/admin/leads/export?format=csv`
   - Button shows "Exporting..." with spinner

3. **API responds with CSV file**
   - Response headers: `Content-Type: text/csv`, `Content-Disposition: attachment; filename="leads-export-2025-12-04.csv"`
   - Response body: CSV data for all 47 leads

4. **Browser downloads file**
   - Browser's download mechanism handles file
   - File saved to Downloads folder: `leads-export-2025-12-04.csv`
   - Button returns to "Export"
   - Show success toast: "✓ Leads exported successfully"

5. **User opens CSV in Excel**
   - All 47 leads visible in spreadsheet
   - 9 columns: Name, Email, Phone, Company, Job Title, Landing Page, Created At, Source, Status

**API Calls Made:** 1 (GET /api/admin/leads/export)

---

### Flow 8: Handle Network Error

**Steps:**

1. **User attempts to load leads list**
   - API: `GET /api/admin/leads`
   - Network disconnected or server down

2. **API call fails (network error)**
   - No response received
   - Frontend timeout after 30 seconds

3. **Frontend shows error state**
   - Empty table area
   - Error message:
     ```
     ⚠️ Failed to load leads
     There was an error loading your leads. Please try again.
     [Try Again]
     ```

4. **User clicks "Try Again"**
   - Frontend retries same API call
   - API: `GET /api/admin/leads?page=1&limit=25&sort_by=created_at&sort_order=desc`

5. **Network restored, API succeeds**
   - Load leads normally
   - Show table with results

**API Calls Made:** 2 (initial failed attempt, retry success)

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
- After login → Redirect back to `/admin/leads` (preserve URL)

---

### Authorization

**Permissions:**

**View Leads (GET /api/admin/leads):**
- Any authenticated admin user can view leads

**View Lead Details (GET /api/admin/leads/:id):**
- Any authenticated admin user can view individual lead

**Update Lead Status (PATCH /api/admin/leads/:id):**
- Any authenticated admin user can update status
- May restrict to certain roles in Phase 2 (e.g., only sales team)

**Export Leads (GET /api/admin/leads/export):**
- Any authenticated admin user can export
- May restrict to admin role in Phase 2

**Delete Lead (DELETE /api/admin/leads/:id):**
- Admin role only (Phase 2)

---

## 📊 Error Handling Summary

### Error Categories

**1. Authentication Errors (401)**
- Redirect to login
- Preserve intended URL (redirect back after login)

**2. Authorization Errors (403)**
- Show error message: "You don't have permission to perform this action"
- Don't redirect (user may have permission to view, just not update)

**3. Not Found Errors (404)**
- Lead list: Should not happen (empty list is different from 404)
- Lead details: Show "Lead not found" in panel, allow close
- Update status: Show "Lead was deleted", close panel

**4. Validation Errors (400)**
- Show specific field errors if `details` provided
- Allow user to correct and retry

**5. Server Errors (500)**
- Show error message with retry option
- Log error to console/monitoring (Phase 2)

**6. Network Errors**
- Show error message with retry option
- Detect: No response, timeout, connection refused
- User can retry same operation

---

## 🔄 State Management

### URL State

**Query Parameters to Maintain:**
- `page` - Current page number
- `search` - Search query
- `landing_page_id` - Selected landing page filter
- `status` - Selected status filter
- `date_from` and `date_to` - Date range filter
- `sort_by` and `sort_order` - Sort settings
- `view` - Open lead details panel (lead ID)

**Example URLs:**
```
/admin/leads
/admin/leads?page=2
/admin/leads?search=john
/admin/leads?landing_page_id=42&status=new
/admin/leads?view=12847
/admin/leads?page=2&status=contacted&view=12846
```

**Benefits:**
- Bookmarkable URLs
- Browser back/forward navigation works
- Share URLs with teammates
- Refresh page preserves state

---

### Cache Management

**List Data Caching:**
- Cache list response for current filter/sort/page combination
- Cache duration: 60 seconds
- Invalidate cache when:
  - Filter/sort/page changes
  - Lead status updated (update single row)
  - New lead submitted (Phase 2, via real-time updates)

**Lead Details Caching:**
- Cache lead details by ID
- Cache duration: 5 minutes
- Update cache when status updated (don't refetch)

**Not Required for Phase 1** (can fetch on every API call for simplicity)

---

## 🧪 Testing Scenarios

### API Integration Tests

**1. List leads with default parameters**
- Call: GET /api/admin/leads?page=1&limit=25&sort_by=created_at&sort_order=desc
- Expect: 200 OK with data array
- Verify: Pagination object present, sort order correct

**2. Search for leads by name**
- Call: GET /api/admin/leads?search=john
- Expect: Only leads with "john" in name or email returned

**3. Filter by landing page**
- Call: GET /api/admin/leads?landing_page_id=42
- Expect: Only leads from landing page 42 returned

**4. Filter by date range**
- Call: GET /api/admin/leads?date_from=2025-12-01&date_to=2025-12-04
- Expect: Only leads created within date range returned

**5. Sort by different columns**
- Call: GET /api/admin/leads?sort_by=name&sort_order=asc
- Expect: Leads sorted A-Z by name

**6. Paginate through results**
- Call page 1: GET /api/admin/leads?page=1&limit=25
- Call page 2: GET /api/admin/leads?page=2&limit=25
- Expect: Different leads on each page, no overlap

**7. Get lead details by ID**
- Call: GET /api/admin/leads/12847
- Expect: Full lead data returned

**8. Update lead status**
- Call: PATCH /api/admin/leads/12847 with {"status": "contacted"}
- Expect: 200 OK, status updated

**9. Export leads to CSV**
- Call: GET /api/admin/leads/export?format=csv
- Expect: CSV file downloaded with all leads

**10. Handle authentication error**
- Call any endpoint without auth token
- Expect: 401 Unauthorized

**11. Handle not found error**
- Call: GET /api/admin/leads/999999 (non-existent ID)
- Expect: 404 Not Found

**12. Handle invalid status value**
- Call: PATCH /api/admin/leads/12847 with {"status": "invalid"}
- Expect: 400 Bad Request with validation error

---

## 📚 Related Documentation

- **List Screen Design:** [Phase1-Leads-List-Screen-Design.md](./Phase1-Leads-List-Screen-Design.md)
- **Details Panel Design:** [Phase1-Lead-Details-View-Design.md](./Phase1-Lead-Details-View-Design.md)
- **Database Schema:** [Phase1-Leads-Schema.md](./Phase1-Leads-Schema.md)
- **Lead Capture API:** [Phase1-Lead-Capture-API.md](./Phase1-Lead-Capture-API.md)

---

## ✅ Implementation Checklist

### API Client Setup
- [ ] Create API client utility (fetch wrapper)
- [ ] Set up base URL configuration (env variable)
- [ ] Implement JWT token storage and retrieval
- [ ] Add auth header to all requests
- [ ] Handle 401 responses (redirect to login)
- [ ] Implement request timeout (30 seconds)

### List Leads (GET /api/admin/leads)
- [ ] Build query parameters from UI state (filters, sort, pagination)
- [ ] Make GET request on page load
- [ ] Make GET request on filter change (debounce search 300ms)
- [ ] Make GET request on sort change
- [ ] Make GET request on pagination change
- [ ] Parse response and populate table
- [ ] Handle loading state (skeleton)
- [ ] Handle success state (display data)
- [ ] Handle empty state (no leads)
- [ ] Handle no results state (filters applied, no matches)
- [ ] Handle error state (404, 500, network)
- [ ] Extract source from referrer_url
- [ ] Format timestamps (relative + tooltip)
- [ ] Update pagination controls
- [ ] Update sort indicators
- [ ] Update URL with query parameters

### Get Lead Details (GET /api/admin/leads/:id)
- [ ] Make GET request on row click
- [ ] Show loading skeleton in panel
- [ ] Parse response and populate panel sections
- [ ] Handle null values (phone, company, message, etc.)
- [ ] Handle deleted landing page (landing_page is null)
- [ ] Handle error state (404, 500, network)
- [ ] Update URL with ?view=:id parameter

### Update Lead Status (PATCH /api/admin/leads/:id)
- [ ] Detect status change in dropdown
- [ ] Enable/disable "Update Status" button based on change
- [ ] Build request body: {"status": "..."}
- [ ] Make PATCH request on button click
- [ ] Show loading state (button spinner, disable dropdown)
- [ ] Handle success (update badge, show message, update list row)
- [ ] Handle error (show message, re-enable controls)
- [ ] Update cache (don't refetch details)

### Export Leads (GET /api/admin/leads/export)
- [ ] Make GET request on "Export" button click
- [ ] Handle file download (Content-Disposition header)
- [ ] Show loading state (button spinner)
- [ ] Handle success (show toast)
- [ ] Handle error (show message, allow retry)

### Error Handling
- [ ] Handle all HTTP status codes (400, 401, 403, 404, 500)
- [ ] Handle network errors (timeout, no connection)
- [ ] Show appropriate error messages
- [ ] Provide retry functionality where appropriate
- [ ] Log errors to console (Phase 1) or monitoring (Phase 2)

### State Management
- [ ] Update URL query parameters on state change
- [ ] Parse URL on page load to restore state
- [ ] Handle browser back/forward navigation
- [ ] Sync list and details panel (update list row on status change)

### Testing
- [ ] Test all API calls with valid data
- [ ] Test error scenarios (401, 404, 500, network)
- [ ] Test filter combinations
- [ ] Test sorting all columns
- [ ] Test pagination
- [ ] Test search with debounce
- [ ] Test status update flow
- [ ] Test export functionality
- [ ] Test URL state persistence
- [ ] Test browser back/forward navigation

---

**Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-04
**Maintained by:** DMAT Development Team
