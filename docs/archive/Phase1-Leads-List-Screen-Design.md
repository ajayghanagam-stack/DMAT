# Phase 1 Leads List Screen - Design Specification

**Version:** 1.0
**Date:** 2025-12-04
**Purpose:** UI/UX design specification for the leads list screen in DMAT admin dashboard

---

## 📋 Overview

The leads list screen is where DMAT users view and manage all leads captured through their landing pages. This screen provides filtering, sorting, search, and bulk actions to help users find and process leads efficiently.

**User Goals:**
- View all captured leads at a glance
- Filter leads by landing page, date range, and status
- Search for specific leads by name or email
- Sort leads by different criteria (default: newest first)
- Export leads for use in other tools
- Understand lead source and context

**Design Principles:**
- **Scannable** - Table layout with clear columns and visual hierarchy
- **Filterable** - Multiple filter options to narrow down results
- **Actionable** - Easy access to common operations (export, view details)
- **Informative** - Show key information at a glance

**Related Documentation:**
- [Phase1-Leads-Schema.md](./Phase1-Leads-Schema.md) - Database schema for leads
- [Phase1-Lead-Capture-API.md](./Phase1-Lead-Capture-API.md) - Lead capture API
- [Phase1-Lead-Capture-Behavior.md](./Phase1-Lead-Capture-Behavior.md) - Lead behavior

---

## 🎯 Screen Location

**URL:** `/admin/leads`

**Navigation:**
- Accessible from main admin navigation: "Leads" menu item
- Badge showing new/unread lead count (optional, Phase 2)

**Breadcrumb:**
```
Dashboard > Leads
```

---

## 🏗️ Page Layout

### Desktop Layout (> 1024px)

```
┌────────────────────────────────────────────────────────────────┐
│  DMAT Header                                                   │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐                                              │
│  │              │  ┌─────────────────────────────────────┐    │
│  │  Sidebar     │  │  Leads                              │    │
│  │  Navigation  │  │                                     │    │
│  │              │  │  [Filters & Search Bar]             │    │
│  │  • Dashboard │  │                                     │    │
│  │  • Landing   │  ├─────────────────────────────────────┤    │
│  │    Pages     │  │                                     │    │
│  │  • Leads ← ✓ │  │  [Leads Table]                     │    │
│  │  • Settings  │  │                                     │    │
│  │              │  │  - Name                             │    │
│  │              │  │  - Email                            │    │
│  │              │  │  - Phone                            │    │
│  │              │  │  - Landing Page                     │    │
│  │              │  │  - Created At                       │    │
│  │              │  │  - Source                           │    │
│  │              │  │  - Status                           │    │
│  │              │  │                                     │    │
│  │              │  ├─────────────────────────────────────┤    │
│  │              │  │  [Pagination Controls]              │    │
│  │              │  └─────────────────────────────────────┘    │
│  └──────────────┘                                              │
└────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

```
┌──────────────────────────────┐
│  DMAT Header                 │
├──────────────────────────────┤
│  Leads                       │
│                              │
│  [Search]                    │
│  [Filters] (collapsible)     │
│                              │
│  ┌────────────────────────┐ │
│  │ Card 1                 │ │
│  │ Name: John Doe         │ │
│  │ Email: john@example    │ │
│  │ Landing: Free Guide    │ │
│  │ Created: 2 hours ago   │ │
│  │ Status: New            │ │
│  └────────────────────────┘ │
│                              │
│  ┌────────────────────────┐ │
│  │ Card 2                 │ │
│  │ ...                    │ │
│  └────────────────────────┘ │
│                              │
│  [Load More]                 │
└──────────────────────────────┘
```

---

## 📊 Table Columns

### Column Overview

| # | Column | Width | Sortable | Default Order | Required |
|---|--------|-------|----------|---------------|----------|
| 1 | Name | 15% | Yes | - | Yes |
| 2 | Email | 20% | Yes | - | Yes |
| 3 | Phone | 12% | No | - | No |
| 4 | Landing Page | 18% | Yes | - | Yes |
| 5 | Created At | 12% | Yes | DESC (default) | Yes |
| 6 | Source | 13% | No | - | No |
| 7 | Status | 10% | Yes | - | Yes |

**Total:** 100% width

---

## 📋 Column Specifications

### Column 1: Name

**Label:** "Name"

**Width:** 15% of table width

**Content:** Lead's full name from form submission

**Sortable:** Yes

**Format:**
- Display full name as submitted: "John Doe"
- If empty → Show "—" (em dash, gray)
- Truncate if longer than ~30 characters, show full name on hover (tooltip)

**Visual Example:**
```
Name
────────────
John Doe
Jane Smith
Michael Johnson
—
```

**States:**
- Default: Black text (#111827)
- Empty: Gray "—" (#9CA3AF)
- Hover: Show tooltip if truncated

**Accessibility:**
- `<th>Name</th>` with scope="col"
- `<td>John Doe</td>`

---

### Column 2: Email

**Label:** "Email"

**Width:** 20% of table width

**Content:** Lead's email address (always required)

**Sortable:** Yes (alphabetically)

**Format:**
- Display email address: "john.doe@example.com"
- All lowercase (as stored in database)
- Truncate if longer than ~35 characters, show full email on hover
- Make clickable → Opens default email client with "mailto:" link

**Visual Example:**
```
Email
────────────────────────
john.doe@example.com    ✉
jane.smith@company.com  ✉
michael.j@verylongdo... ✉
```

**Interaction:**
- Click email → Opens: `mailto:john.doe@example.com`
- Hover → Show full email if truncated
- Hover → Underline to indicate clickable

**States:**
- Default: Blue text (#3B82F6) to indicate link
- Hover: Underline + darker blue
- Click: Standard link behavior

**Accessibility:**
- `<a href="mailto:john.doe@example.com">john.doe@example.com</a>`
- aria-label="Send email to john.doe@example.com"

---

### Column 3: Phone

**Label:** "Phone"

**Width:** 12% of table width

**Content:** Lead's phone number (optional field)

**Sortable:** No

**Format:**
- Display as submitted (no formatting transformation)
- If empty → Show "—" (em dash, gray)
- Make clickable → Opens phone dialer with "tel:" link (mobile)

**Visual Example:**
```
Phone
──────────────
(555) 123-4567
+1-555-987-6543
—
555.123.4567
```

**Interaction:**
- Click phone → Opens: `tel:+15551234567` (stripped of formatting)
- Hover → Underline to indicate clickable (if not empty)

**States:**
- Default: Blue text if present (#3B82F6), gray if empty
- Hover: Underline if present
- Empty: Gray "—" (#9CA3AF)

**Note:** Don't enforce format standardization in display (show as user entered). Phone number validation ensures valid format exists.

**Accessibility:**
- `<a href="tel:+15551234567">(555) 123-4567</a>`
- If empty: `<td>—</td>`

---

### Column 4: Landing Page

**Label:** "Landing Page"

**Width:** 18% of table width

**Content:** Title of the landing page that captured this lead

**Sortable:** Yes (alphabetically by title)

**Format:**
- Display landing page title: "Free Marketing Guide 2025"
- Truncate if longer than ~40 characters, show full title on hover
- Make clickable → Opens landing page edit screen in new tab (optional)
- Show icon if landing page is no longer published or deleted

**Visual Example:**
```
Landing Page
────────────────────────────
Free Marketing Guide 2025
SEO Checklist Download
Product Demo Sign-Up
[Deleted] ⚠
```

**Interaction:**
- Click title → Navigate to `/admin/landing-pages/:id/edit` (optional behavior)
- Hover → Show full title if truncated
- If deleted/unpublished → Show warning icon with tooltip

**States:**
- Default: Dark gray text (#374151)
- Deleted/Not Found: Red text with "⚠" icon
- Hover: Slightly darker, cursor pointer (if clickable)

**Special Cases:**
- If landing page deleted → Show "[Deleted Landing Page]" in gray italics with warning icon
- If landing page unpublished → Show normal title (still exists)

**Accessibility:**
- `<td>Free Marketing Guide 2025</td>` or
- `<a href="/admin/landing-pages/42/edit">Free Marketing Guide 2025</a>`
- Deleted: `<td class="deleted"><span aria-label="Warning: Landing page deleted">⚠</span> [Deleted]</td>`

---

### Column 5: Created At

**Label:** "Created At"

**Width:** 12% of table width

**Content:** Timestamp when lead was submitted

**Sortable:** Yes (default sort: DESC - newest first)

**Format:**
- Show relative time if recent (< 24 hours): "2 hours ago", "15 minutes ago"
- Show absolute date if older: "Dec 3, 2025" or "Dec 3, 2025 2:30 PM"
- Show full timestamp on hover: "December 3, 2025 at 2:30:15 PM EST"

**Visual Example:**
```
Created At
────────────────
2 hours ago
5 minutes ago
Dec 3, 2025
Nov 28, 2025
```

**Format Logic:**
```
If timestamp < 1 hour ago:
  → "X minutes ago"
If timestamp < 24 hours ago:
  → "X hours ago"
If timestamp < 7 days ago:
  → "X days ago"
If timestamp < 365 days ago:
  → "Dec 3, 2025" (no time)
Else:
  → "Dec 3, 2024" (include year)
```

**Hover Tooltip:**
```
December 3, 2025 at 2:30:15 PM EST
```

**Sort Behavior:**
- Default: Descending (newest first) ← **Important**
- Click "Created At" header → Toggle ASC/DESC
- Show ↓ or ↑ indicator next to column name

**Accessibility:**
- `<td><time datetime="2025-12-03T14:30:15Z" title="December 3, 2025 at 2:30:15 PM EST">2 hours ago</time></td>`

---

### Column 6: Source

**Label:** "Source"

**Width:** 13% of table width

**Content:** How the lead found the landing page (referrer or UTM source)

**Sortable:** No

**Format:**
- Show domain of referrer: "google.com", "facebook.com", "direct"
- Extract from `referrer_url` field in database
- If no referrer (direct visit) → Show "Direct"
- If from UTM parameters → Show UTM source (Phase 2)

**Visual Example:**
```
Source
─────────────
google.com
facebook.com
Direct
linkedin.com
```

**Data Mapping:**
```
referrer_url: "https://www.google.com/search?q=marketing+guide"
  → Extract domain: "google.com"

referrer_url: null or empty
  → Show: "Direct"

referrer_url: "https://www.facebook.com/posts/123"
  → Extract domain: "facebook.com"

landing_url contains UTM params: "?utm_source=newsletter"
  → Show: "newsletter" (Phase 2 enhancement)
```

**Interaction:**
- Hover → Show full referrer URL in tooltip
- No click action

**States:**
- Default: Medium gray text (#6B7280)
- "Direct": Italic text
- Hover: Show tooltip with full URL

**Accessibility:**
- `<td title="https://www.google.com/search?q=marketing+guide">google.com</td>`
- `<td>Direct</td>`

---

### Column 7: Status

**Label:** "Status"

**Width:** 10% of table width

**Content:** Lead processing status

**Sortable:** Yes

**Format:**
- Show status badge with color coding
- Possible values:
  - **New** - Just captured, not yet reviewed (blue)
  - **Contacted** - Sales team has reached out (green)
  - **Qualified** - Lead is qualified (purple)
  - **Converted** - Lead became customer (green)
  - **Unqualified** - Not a good fit (gray)
  - **Spam** - Marked as spam (red)

**Visual Example:**
```
Status
──────────
[New]         ← Blue badge
[Contacted]   ← Green badge
[Qualified]   ← Purple badge
[Converted]   ← Dark green badge
[Unqualified] ← Gray badge
[Spam]        ← Red badge
```

**Badge Design:**
```
┌─────────────┐
│  New        │  Background: Light blue (#DBEAFE)
└─────────────┘  Text: Dark blue (#1E40AF)

┌─────────────┐
│  Contacted  │  Background: Light green (#D1FAE5)
└─────────────┘  Text: Dark green (#065F46)

┌─────────────┐
│  Qualified  │  Background: Light purple (#E9D5FF)
└─────────────┘  Text: Dark purple (#6B21A8)

┌─────────────┐
│  Converted  │  Background: Light green (#D1FAE5)
└─────────────┘  Text: Dark green (#065F46)

┌─────────────┐
│  Unqualified│  Background: Light gray (#F3F4F6)
└─────────────┘  Text: Dark gray (#374151)

┌─────────────┐
│  Spam       │  Background: Light red (#FEE2E2)
└─────────────┘  Text: Dark red (#991B1B)
```

**Interaction:**
- Click status badge → Open dropdown to change status (Phase 2)
- Phase 1: Read-only display only

**Default Value:**
- All new leads start as "New" status
- Status can be updated via API (Phase 2)

**Accessibility:**
- `<td><span class="badge badge-new" role="status">New</span></td>`
- Color + text (not color alone) for accessibility

---

## 🔍 Filters & Search

### Filter Section Layout

**Location:** Above table, below page title

**Layout:**
```
┌────────────────────────────────────────────────────────────────┐
│  Leads                                        [Export] [•••]   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌───────────────┐  ┌──────────────┐       │
│  │ 🔍 Search... │  │ Landing Page  │  │ Date Range   │       │
│  │              │  │ All Pages ▼   │  │ Last 30 days│       │
│  └──────────────┘  └───────────────┘  └──────────────┘       │
│                                                                │
│  ┌──────────────┐  [Clear Filters]                            │
│  │ Status       │                                              │
│  │ All ▼        │                                              │
│  └──────────────┘                                              │
│                                                                │
│  Showing 47 leads                                              │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│  [Table Headers]                                               │
│  ...                                                           │
└────────────────────────────────────────────────────────────────┘
```

---

### Filter 1: Search (Name/Email)

**Label:** None (placeholder text only)

**Type:** Text input with search icon

**Placeholder:** "🔍 Search by name or email..."

**Width:** ~30% of filter row

**Behavior:**
- Search as user types (debounced 300ms)
- Case-insensitive search
- Searches in both `name` and `email` fields
- Partial match (contains)

**Search Logic:**
```
User types: "john"

Matches:
- Name: "John Doe"
- Name: "Johnny Smith"
- Email: "john@example.com"
- Email: "mary@johnson.com"

SQL equivalent:
WHERE (LOWER(name) LIKE '%john%' OR LOWER(email) LIKE '%john%')
```

**Visual States:**

**Empty:**
```
┌────────────────────────┐
│ 🔍 Search by name or   │
│    email...            │
└────────────────────────┘
```

**Typing:**
```
┌────────────────────────┐
│ 🔍 john            [×] │ ← Clear button appears
└────────────────────────┘
```

**With Results:**
```
Showing 5 leads matching "john"
```

**No Results:**
```
No leads found matching "john"
[Clear Search]
```

**Interaction:**
- Type → Debounce 300ms → Search
- Click [×] → Clear search, show all leads
- Press Escape → Clear search

**Accessibility:**
- `<input type="search" placeholder="Search by name or email..." aria-label="Search leads by name or email">`
- Live region for result count: `<div role="status" aria-live="polite">Showing 5 leads</div>`

---

### Filter 2: Landing Page

**Label:** "Landing Page" (above dropdown)

**Type:** Dropdown select

**Width:** ~25% of filter row

**Options:**
- **All Pages** (default)
- List of all landing pages (published and draft)
- Sorted alphabetically by title

**Dropdown Options:**
```
┌─────────────────────────────┐
│ All Pages              ✓    │
├─────────────────────────────┤
│ Free Marketing Guide 2025   │
│ Product Demo Sign-Up        │
│ SEO Checklist Download      │
│ Webinar Registration        │
└─────────────────────────────┘
```

**Behavior:**
- Select landing page → Filter leads to only that landing page
- Show count of leads per landing page (Phase 2 enhancement):
  ```
  ┌─────────────────────────────┐
  │ All Pages (47)         ✓    │
  ├─────────────────────────────┤
  │ Free Marketing Guide (23)   │
  │ Product Demo Sign-Up (12)   │
  │ SEO Checklist (8)           │
  │ Webinar Registration (4)    │
  └─────────────────────────────┘
  ```

**Data Source:**
- Load from: GET /api/admin/landing-pages (all pages)
- Display `title` field
- Filter by `landing_page_id`

**Empty State:**
- If no landing pages exist → Disable filter, show "(No pages created)"

**Accessibility:**
- `<label for="landing-page-filter">Landing Page</label>`
- `<select id="landing-page-filter" aria-label="Filter by landing page">`

---

### Filter 3: Date Range

**Label:** "Date Range" (above dropdown)

**Type:** Dropdown with preset ranges + custom option

**Width:** ~25% of filter row

**Preset Options:**
- **Last 7 days**
- **Last 30 days** (default)
- **Last 90 days**
- **This month**
- **Last month**
- **This year**
- **All time**
- **Custom range...** → Opens date picker modal

**Dropdown:**
```
┌─────────────────────────────┐
│ Last 7 days                 │
│ Last 30 days           ✓    │
│ Last 90 days                │
│ This month                  │
│ Last month                  │
│ This year                   │
│ All time                    │
├─────────────────────────────┤
│ Custom range...             │
└─────────────────────────────┘
```

**Custom Range Modal:**
```
╔═══════════════════════════════╗
║  Select Date Range            ║
╠═══════════════════════════════╣
║                               ║
║  From: [Dec 1, 2025]  📅      ║
║                               ║
║  To:   [Dec 4, 2025]  📅      ║
║                               ║
║       [Cancel]  [Apply]       ║
╚═══════════════════════════════╝
```

**Behavior:**
- Select preset → Immediately filter leads
- Select "Custom range" → Open date picker modal
- In modal: Choose start and end dates → Click Apply → Filter leads
- Date range is inclusive (includes both start and end dates)

**Filter Logic:**
```
"Last 7 days":
  WHERE created_at >= NOW() - INTERVAL '7 days'

"Last 30 days":
  WHERE created_at >= NOW() - INTERVAL '30 days'

"This month":
  WHERE created_at >= DATE_TRUNC('month', NOW())

"Custom range" (Dec 1 - Dec 4):
  WHERE created_at >= '2025-12-01 00:00:00'
    AND created_at <= '2025-12-04 23:59:59'
```

**Display When Custom Selected:**
```
┌─────────────────────────────┐
│ Date Range                  │
│ Dec 1 - Dec 4, 2025    ▼    │
└─────────────────────────────┘
```

**Accessibility:**
- `<label for="date-range-filter">Date Range</label>`
- `<select id="date-range-filter">`
- Date picker: Use accessible date picker component with keyboard navigation

---

### Filter 4: Status

**Label:** "Status" (above dropdown)

**Type:** Dropdown select (single selection)

**Width:** ~20% of filter row

**Options:**
- **All** (default)
- **New**
- **Contacted**
- **Qualified**
- **Converted**
- **Unqualified**
- **Spam**

**Dropdown:**
```
┌─────────────────────────────┐
│ All                    ✓    │
├─────────────────────────────┤
│ New                         │
│ Contacted                   │
│ Qualified                   │
│ Converted                   │
│ Unqualified                 │
│ Spam                        │
└─────────────────────────────┘
```

**With Count (Phase 2):**
```
┌─────────────────────────────┐
│ All (47)               ✓    │
├─────────────────────────────┤
│ New (23)                    │
│ Contacted (12)              │
│ Qualified (8)               │
│ Converted (3)               │
│ Unqualified (1)             │
│ Spam (0)                    │
└─────────────────────────────┘
```

**Behavior:**
- Select status → Filter leads to only that status
- "All" shows all statuses

**Accessibility:**
- `<label for="status-filter">Status</label>`
- `<select id="status-filter" aria-label="Filter by status">`

---

### Clear Filters Button

**Label:** "Clear Filters"

**Type:** Text link or secondary button

**Location:** Below filter dropdowns

**Visibility:** Only shown when any filter is active (not default)

**Behavior:**
- Click → Reset all filters to defaults:
  - Search: Empty
  - Landing Page: All Pages
  - Date Range: Last 30 days
  - Status: All
- Reload table with default results

**Visual:**
```
[Clear Filters]  ← Blue text link
```

**Accessibility:**
- `<button type="button" class="link">Clear Filters</button>`

---

### Active Filters Summary

**Location:** Below filters, above table (optional, nice to have)

**Format:** Pills/chips showing active filters

**Visual Example:**
```
Filters: [Landing Page: Free Guide ×] [Status: New ×] [Search: john ×]
```

**Behavior:**
- Click × on any pill → Remove that filter
- Click "Clear all" → Remove all filters

**Phase:** Phase 2 enhancement (not required for Phase 1)

---

## 🔢 Sorting

### Sortable Columns

**Sortable Columns:**
1. Name (A-Z / Z-A)
2. Email (A-Z / Z-A)
3. Landing Page (A-Z / Z-A)
4. Created At (Newest / Oldest) ← **Default: Newest first**
5. Status (A-Z / Z-A)

**Non-Sortable Columns:**
- Phone (optional field, no meaningful sort order)
- Source (referrer domain, no meaningful sort order)

---

### Default Sort Order

**Default:** Created At, Descending (newest first)

**Visual Indicator:**
```
┌────────────────────────────────────────────────────────┐
│ Name | Email | Phone | Landing Page | Created At ↓ | ...│
└────────────────────────────────────────────────────────┘
                                        ↓ = Sorted descending
```

---

### Sort Interaction

**Behavior:**
- Click column header → Sort by that column
- First click → Ascending (↑)
- Second click → Descending (↓)
- Third click → Remove sort, return to default (Created At ↓)

**Exception:** "Created At" column:
- First click → Descending ↓ (newest first) ← Already default
- Second click → Ascending ↑ (oldest first)
- Third click → Return to Descending ↓ (default)

**Visual States:**

**Unsorted Column:**
```
Name
```

**Sorted Ascending:**
```
Name ↑
```

**Sorted Descending:**
```
Name ↓
```

**Multiple Column Sort (Phase 2):**
- Hold Shift + Click another column → Secondary sort
- Not required for Phase 1

---

### Sort API Integration

**API Endpoint:** GET /api/admin/leads

**Query Parameters:**
```
GET /api/admin/leads?sort_by=created_at&sort_order=desc

sort_by options:
- name
- email
- landing_page_title (or landing_page_id with JOIN)
- created_at (default)
- status

sort_order options:
- asc (ascending)
- desc (descending, default for created_at)
```

**Example API Calls:**

**Default (newest first):**
```
GET /api/admin/leads?sort_by=created_at&sort_order=desc
```

**Sort by name A-Z:**
```
GET /api/admin/leads?sort_by=name&sort_order=asc
```

**Sort by landing page Z-A:**
```
GET /api/admin/leads?sort_by=landing_page_title&sort_order=desc
```

---

## 📄 Pagination

### Pagination Controls

**Location:** Below table

**Format:** Previous/Next buttons + page numbers

**Visual:**
```
┌────────────────────────────────────────────────────────┐
│  [Table content above]                                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Showing 1-25 of 47 leads                             │
│                                                        │
│  [← Previous]  1  [2]  3  4  5  [Next →]              │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

### Pagination Settings

**Default Page Size:** 25 leads per page

**Page Size Options:**
- 10 per page
- 25 per page (default)
- 50 per page
- 100 per page

**Page Size Selector:**
```
Show: [25 ▼] per page
```

**API Parameters:**
```
GET /api/admin/leads?page=1&limit=25

page: Current page number (1-indexed)
limit: Number of results per page
```

---

### Pagination States

**First Page:**
```
[← Previous] (disabled)  [1]  2  3  4  5  [Next →]
                         ^^^
                      Current page
```

**Middle Page:**
```
[← Previous]  1  2  [3]  4  5  [Next →]
                     ^^^
```

**Last Page:**
```
[← Previous]  1  2  3  4  [5]  [Next →] (disabled)
                             ^^^
```

**Many Pages (ellipsis):**
```
[← Previous]  1  ...  5  [6]  7  ...  15  [Next →]
                             ^^^
```

---

### Pagination Behavior

**Click "Next":**
- Load next page (page + 1)
- Scroll to top of table
- Show loading state during fetch

**Click "Previous":**
- Load previous page (page - 1)
- Scroll to top of table
- Show loading state during fetch

**Click page number:**
- Jump directly to that page
- Scroll to top of table
- Show loading state during fetch

**Change page size:**
- Reset to page 1
- Load with new page size
- Update pagination controls

**URL Updates:**
- Update URL with page parameter: `/admin/leads?page=3`
- Allow bookmarking and sharing specific page
- Browser back/forward navigation works

---

## 🎭 Screen States

### State 1: Loading

**Shown when:** Initial page load or filter/sort change

**Visual:**
```
┌────────────────────────────────────────────────────────┐
│  Leads                                                 │
├────────────────────────────────────────────────────────┤
│  [Filters section - enabled]                           │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Loading leads...                                      │
│                                                        │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  (skeleton rows)    │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                      │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Behavior:**
- Show skeleton loading rows (gray bars in table shape)
- Keep filters enabled (user can change while loading)
- Don't show pagination during loading

---

### State 2: Empty (No Leads)

**Shown when:** No leads have been captured yet (first-time user)

**Visual:**
```
┌────────────────────────────────────────────────────────┐
│  Leads                                    [Export]     │
├────────────────────────────────────────────────────────┤
│  [Filters section - all disabled]                      │
├────────────────────────────────────────────────────────┤
│                                                        │
│                     📊                                 │
│                                                        │
│              No leads captured yet                     │
│                                                        │
│   Leads will appear here when visitors submit          │
│   forms on your published landing pages.               │
│                                                        │
│         [Create Landing Page]                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Elements:**
- Icon: 📊 or similar (large, centered, gray)
- Heading: "No leads captured yet"
- Description: Explain what will appear here
- CTA Button: "Create Landing Page" → Navigate to landing page creator

**Behavior:**
- Disable all filters (no data to filter)
- Show empty state message
- Provide clear next action (create landing page)

---

### State 3: No Results (Filtered)

**Shown when:** Filters applied but no matching leads

**Visual:**
```
┌────────────────────────────────────────────────────────┐
│  Leads                                    [Export]     │
├────────────────────────────────────────────────────────┤
│  [Filters section - enabled and active]                │
│                                                        │
│  Filters: [Landing Page: Free Guide ×] [Status: New ×]│
├────────────────────────────────────────────────────────┤
│                                                        │
│                     🔍                                 │
│                                                        │
│           No leads match your filters                  │
│                                                        │
│   Try adjusting your filters or search criteria.       │
│                                                        │
│              [Clear All Filters]                       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Elements:**
- Icon: 🔍 (search/filter icon)
- Heading: "No leads match your filters"
- Description: Suggest action
- CTA Button: "Clear All Filters" → Reset to defaults

**Behavior:**
- Keep filters enabled (user can adjust)
- Show active filters summary
- Provide easy way to clear filters

---

### State 4: Loaded with Data

**Shown when:** Leads loaded successfully

**Visual:**
```
┌────────────────────────────────────────────────────────┐
│  Leads                                    [Export] [•••]│
├────────────────────────────────────────────────────────┤
│  [Filters & Search]                                    │
│                                                        │
│  Showing 47 leads                                      │
├────────────────────────────────────────────────────────┤
│  Name    │Email        │Phone      │Landing Page│...  │
├──────────┼─────────────┼───────────┼────────────┼─────┤
│ John Doe │john@exa...  │(555) 123-4│Free Guide  │...  │
│ Jane Sm..│jane@com...  │—          │Product Demo│...  │
│ Michael..│michael@...  │555.987.65 │SEO Checkli │...  │
│ ...      │...          │...        │...         │...  │
├────────────────────────────────────────────────────────┤
│  Showing 1-25 of 47 leads                              │
│  [← Previous]  [1]  2  [Next →]                       │
└────────────────────────────────────────────────────────┘
```

**Elements:**
- Results count: "Showing 47 leads" or "Showing 1-25 of 47 leads"
- Table with all columns
- Pagination controls
- Action buttons (Export, etc.)

---

### State 5: Error

**Shown when:** API call fails or network error

**Visual:**
```
┌────────────────────────────────────────────────────────┐
│  Leads                                    [Export]     │
├────────────────────────────────────────────────────────┤
│  [Filters section - enabled]                           │
├────────────────────────────────────────────────────────┤
│                                                        │
│                     ⚠️                                 │
│                                                        │
│            Failed to load leads                        │
│                                                        │
│   There was an error loading your leads.               │
│   Please try again.                                    │
│                                                        │
│              [Try Again]                               │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Elements:**
- Icon: ⚠️ (warning/error icon, red/orange)
- Heading: "Failed to load leads"
- Description: Brief error message
- CTA Button: "Try Again" → Retry API call

**Behavior:**
- Keep filters enabled
- Don't show table or pagination
- Provide retry button
- Log error to console/monitoring

---

## 🎨 Row Actions & Interactions

### Row Hover State

**Behavior:**
- Hover over row → Light background color (#F9FAFB)
- Cursor: default (not pointer, since row itself is not clickable)
- Actions column appears (if hidden by default)

**Visual:**
```
Before hover:
┌──────────────────────────────────────────┐
│ John Doe │ john@example.com │ ... │      │
└──────────────────────────────────────────┘

On hover:
┌──────────────────────────────────────────┐
│ John Doe │ john@example.com │ ... │ [•••]│ ← Light gray background
└──────────────────────────────────────────┘
```

---

### Row Click Behavior (Phase 2)

**Phase 1:** Rows not clickable (no detail view yet)

**Phase 2:** Click row → Open lead detail modal/page

**Current Phase 1 Behavior:**
- Rows not clickable
- Individual cell actions work (email link, phone link)
- Actions menu for each row (see below)

---

### Row Actions Menu

**Location:** Last column (or appears on hover)

**Trigger:** Click "•••" (three-dot menu icon)

**Menu Options:**

```
┌─────────────────────┐
│ View Details        │ ← Phase 2
│ Send Email          │
│ Copy Email Address  │
│ Mark as Contacted   │ ← Phase 2
│ Mark as Spam        │ ← Phase 2
│ Delete Lead         │ ← Phase 2, requires confirmation
└─────────────────────┘
```

**Phase 1 Available Actions:**
- **Send Email** → Opens mailto: link
- **Copy Email Address** → Copies email to clipboard

**Phase 2 Actions:**
- View Details → Open lead detail modal
- Mark as Contacted/Spam → Update status via API
- Delete Lead → Show confirmation, then delete via API

**Visual:**
```
┌────────────────────────────────────────────────────┐
│ Name    │Email        │...│Created At  │Status│[•••]│
├─────────┼─────────────┼───┼────────────┼──────┼─────┤
│ John Doe│john@exa...  │...│2 hours ago │New   │[•••]│
│                                              ▼       │
│                         ┌─────────────────┐         │
│                         │ Send Email      │         │
│                         │ Copy Email      │         │
│                         └─────────────────┘         │
└────────────────────────────────────────────────────┘
```

**Accessibility:**
- Button: `<button aria-label="Actions for John Doe" aria-haspopup="menu">`
- Menu: `<div role="menu">`
- Menu items: `<button role="menuitem">Send Email</button>`

---

## 📤 Bulk Actions & Export

### Export Button

**Location:** Top right of screen, next to page title

**Label:** "Export"

**Icon:** ⬇ or 📥 (download icon)

**Visual:**
```
┌────────────────────────────────────────────────────────┐
│  Leads                         [Export ⬇] [•••]       │
└────────────────────────────────────────────────────────┘
```

**Click Behavior:**
- Opens export options dropdown:

```
┌─────────────────────────┐
│ Export as CSV           │
│ Export as Excel (.xlsx) │ ← Phase 2
│ Export filtered results │ ← Phase 2
└─────────────────────────┘
```

**Phase 1 Behavior:**
- Click "Export" → Immediately download all leads as CSV
- Filename: `leads-export-2025-12-04.csv`
- Include all columns: Name, Email, Phone, Landing Page, Created At, Source, Status

**CSV Format:**
```csv
Name,Email,Phone,Landing Page,Created At,Source,Status
John Doe,john@example.com,(555) 123-4567,Free Marketing Guide 2025,2025-12-04 14:30:15,google.com,New
Jane Smith,jane@company.com,,Product Demo Sign-Up,2025-12-04 12:15:00,Direct,Contacted
```

**Phase 2 Enhancements:**
- Export filtered results only
- Export selected rows (bulk selection)
- Export as Excel
- Custom column selection

**API Endpoint:**
```
GET /api/admin/leads/export?format=csv

Response:
Content-Type: text/csv
Content-Disposition: attachment; filename="leads-export-2025-12-04.csv"

[CSV data]
```

---

### Bulk Selection (Phase 2)

**Feature:** Select multiple leads for bulk actions

**UI Elements:**
- Checkbox in table header (select all)
- Checkbox in each row
- Bulk actions toolbar (appears when items selected)

**Not Required for Phase 1**

---

## 📱 Responsive Design

### Desktop (> 1024px)

**Layout:** Full table with all columns visible

**Columns:** All 7 columns displayed

**Filters:** All filters displayed in single row

**Pagination:** Full pagination with page numbers

---

### Tablet (768px - 1024px)

**Layout:** Adjusted table, some columns narrower

**Columns:** All 7 columns, with adjusted widths:
- Name: 12%
- Email: 18%
- Phone: Hide or show on demand
- Landing Page: 15%
- Created At: 12%
- Source: 10%
- Status: 10%

**Filters:** Filters stack in 2x2 grid:
```
[Search...............]  [Landing Page...]
[Date Range.......]  [Status........]
```

**Pagination:** Fewer page numbers shown

---

### Mobile (< 768px)

**Layout:** Card view (no table)

**Card Design:**
```
┌────────────────────────────┐
│ John Doe            [•••]  │
│ john@example.com     ✉     │
│ (555) 123-4567      ☎     │
│                            │
│ Landing: Free Marketing... │
│ Created: 2 hours ago       │
│ Source: google.com         │
│ Status: [New]              │
└────────────────────────────┘
```

**Filters:**
- Collapse into "Filters" button
- Click → Expand filter panel (drawer/accordion)
- Show count of active filters on button: "Filters (2)"

**Pagination:**
- Simplified: [← Previous] Page 3 of 10 [Next →]
- Or: "Load More" button (infinite scroll)

**Search:**
- Full width
- Sticky at top when scrolling

---

## ♿ Accessibility

### Keyboard Navigation

**Tab Order:**
1. Search field
2. Landing Page filter dropdown
3. Date Range filter dropdown
4. Status filter dropdown
5. Clear Filters button (if visible)
6. Export button
7. Table headers (sortable columns)
8. Table rows (focusable for screen readers)
9. Row action menus
10. Pagination controls

**Keyboard Shortcuts:**
- `/` → Focus search field (like GitHub)
- `Esc` → Clear search field
- `Tab` → Navigate through interactive elements
- `Enter` / `Space` → Activate buttons and links
- `↑` / `↓` → Navigate table rows (Phase 2)

---

### Screen Reader Support

**Table Semantics:**
```html
<table role="table" aria-label="Leads table">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col" aria-sort="descending">Created At</th>
      ...
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td><a href="mailto:john@example.com">john@example.com</a></td>
      <td><time datetime="2025-12-04T14:30:15Z">2 hours ago</time></td>
      ...
    </tr>
  </tbody>
</table>
```

**Sort Announcements:**
- When column header clicked: "Sorted by Created At, descending"
- Use `aria-sort` attribute: `aria-sort="descending"`

**Filter Announcements:**
- When filter applied: "Showing 23 leads filtered by Free Marketing Guide"
- Use live region: `<div role="status" aria-live="polite">Showing 23 leads</div>`

**Empty States:**
- "No leads captured yet" should be announced
- Use proper heading structure (`<h2>`, `<h3>`)

---

### Focus Management

**After Filter:**
- Apply filter → Focus moves to results count announcement
- Screen reader announces: "Showing 23 leads"

**After Sort:**
- Click sort → Focus stays on column header
- Screen reader announces sort state

**After Pagination:**
- Navigate to new page → Focus moves to top of table
- Screen reader announces page change

---

### Color Contrast

**WCAG AA Compliance:**
- Status badges: Text + background meet 4.5:1 contrast ratio
- Table text: #111827 on white background (21:1 ratio) ✓
- Links: Blue (#3B82F6) on white (8.59:1 ratio) ✓

**Don't Rely on Color Alone:**
- Status uses badges with text, not just color
- Sort indicators use arrows (↑↓), not just color
- Required fields use asterisk, not just color

---

## 🧪 User Scenarios

### Scenario 1: View All Recent Leads

**Steps:**
1. User navigates to `/admin/leads`
2. See table with all leads, newest first (default)
3. See "Showing 47 leads"
4. Scroll through first 25 leads
5. Click "Next" to see page 2

**Expected Result:** User sees all recent leads in reverse chronological order

---

### Scenario 2: Find Leads from Specific Landing Page

**Steps:**
1. User opens "Landing Page" filter dropdown
2. Select "Free Marketing Guide 2025"
3. Table updates to show only leads from that page
4. See "Showing 23 leads"

**Expected Result:** User sees only leads captured by selected landing page

---

### Scenario 3: Search for Specific Lead by Email

**Steps:**
1. User clicks search field
2. Types: "john@example.com"
3. After 300ms debounce, table updates
4. See 1 lead matching search
5. See "Showing 1 lead matching 'john@example.com'"

**Expected Result:** User finds the specific lead they're looking for

---

### Scenario 4: Export All Leads to CSV

**Steps:**
1. User clicks "Export" button
2. Browser downloads `leads-export-2025-12-04.csv`
3. User opens CSV in Excel/Google Sheets
4. See all lead data in spreadsheet format

**Expected Result:** User has local copy of all leads for analysis

---

### Scenario 5: View Leads from Last Week Only

**Steps:**
1. User opens "Date Range" filter dropdown
2. Select "Last 7 days"
3. Table updates to show only recent leads
4. See "Showing 12 leads"

**Expected Result:** User sees only leads captured in the last week

---

## 🔮 Future Enhancements (Phase 2+)

### Lead Detail View
- Click row → Open detail modal/page
- Show all form fields (including custom fields)
- Show full referrer URL and UTM parameters
- Show lead timeline (captured → contacted → converted)
- Add notes and tags

### Bulk Actions
- Select multiple leads (checkboxes)
- Bulk status updates (mark all as contacted)
- Bulk export (export selected only)
- Bulk delete (with confirmation)

### Advanced Filters
- Filter by multiple landing pages (multi-select)
- Filter by custom form fields
- Filter by UTM parameters
- Save filter presets

### Status Management
- Click status badge → Quick status change dropdown
- Add custom statuses
- Status workflow automation

### Lead Scoring
- Show lead score column
- Auto-calculate based on criteria
- Sort by score

### Integration Actions
- Send to CRM (Salesforce, HubSpot)
- Add to email list (Mailchimp, SendGrid)
- Create task in project management tool

### Analytics
- Show conversion funnel
- Lead source analytics
- Landing page performance comparison

---

## 📚 Related Documentation

- **Database Schema:** [Phase1-Leads-Schema.md](./Phase1-Leads-Schema.md)
- **Lead Capture API:** [Phase1-Lead-Capture-API.md](./Phase1-Lead-Capture-API.md)
- **Lead Capture Behavior:** [Phase1-Lead-Capture-Behavior.md](./Phase1-Lead-Capture-Behavior.md)
- **Validation Rules:** [Phase1-Validation-Sanitization-Rules.md](./Phase1-Validation-Sanitization-Rules.md)

---

## ✅ Implementation Checklist

### Page Setup
- [ ] Create leads list component/page
- [ ] Set up route: `/admin/leads`
- [ ] Add to main navigation menu
- [ ] Implement breadcrumb

### Table Structure
- [ ] Create responsive table component
- [ ] Implement 7 columns with correct widths
- [ ] Add sortable column headers
- [ ] Style table with proper spacing and borders
- [ ] Implement hover states for rows

### Filters
- [ ] Create search input with debounce (300ms)
- [ ] Create landing page dropdown (load from API)
- [ ] Create date range dropdown with presets
- [ ] Create custom date range picker modal
- [ ] Create status dropdown
- [ ] Implement "Clear Filters" button
- [ ] Show active filters count

### Sorting
- [ ] Make 5 columns sortable (Name, Email, Landing Page, Created At, Status)
- [ ] Default sort: Created At descending (newest first)
- [ ] Show sort indicators (↑↓)
- [ ] Toggle sort order on click
- [ ] Update API calls with sort parameters

### Pagination
- [ ] Implement pagination controls
- [ ] Default: 25 per page
- [ ] Show page numbers with ellipsis
- [ ] Previous/Next buttons
- [ ] Page size selector
- [ ] Update URL with page parameter
- [ ] Scroll to top on page change

### API Integration
- [ ] Create API client for GET /api/admin/leads
- [ ] Pass filter parameters (landing_page_id, date_range, status, search)
- [ ] Pass sort parameters (sort_by, sort_order)
- [ ] Pass pagination parameters (page, limit)
- [ ] Handle loading state
- [ ] Handle error state
- [ ] Handle empty state

### Data Display
- [ ] Format name (truncate if long)
- [ ] Format email (make clickable mailto:)
- [ ] Format phone (make clickable tel:, show "—" if empty)
- [ ] Format landing page title (handle deleted pages)
- [ ] Format created_at (relative time with tooltip)
- [ ] Format source (extract domain from referrer)
- [ ] Format status (colored badges)

### Export Functionality
- [ ] Add Export button
- [ ] Implement CSV export (all leads)
- [ ] Generate proper filename with date
- [ ] API endpoint: GET /api/admin/leads/export

### Row Actions
- [ ] Add actions menu (•••) to each row
- [ ] Implement "Send Email" action
- [ ] Implement "Copy Email" action
- [ ] Show menu on click, hide on outside click

### States
- [ ] Loading state (skeleton rows)
- [ ] Empty state (no leads captured yet)
- [ ] No results state (filtered, no matches)
- [ ] Error state (failed to load)
- [ ] Loaded state (data displayed)

### Responsive Design
- [ ] Desktop layout (full table, all columns)
- [ ] Tablet layout (adjusted widths)
- [ ] Mobile layout (card view)
- [ ] Collapsible filters on mobile
- [ ] Simplified pagination on mobile

### Accessibility
- [ ] Proper table semantics (thead, tbody, th[scope])
- [ ] Sortable columns with aria-sort
- [ ] Live region for filter results
- [ ] Keyboard navigation support
- [ ] Focus management
- [ ] WCAG AA color contrast
- [ ] Screen reader announcements

### Testing
- [ ] Test all filters individually
- [ ] Test combined filters
- [ ] Test search with debounce
- [ ] Test sorting all columns
- [ ] Test pagination
- [ ] Test export
- [ ] Test responsive layouts
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility

---

**Design Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-04
**Maintained by:** DMAT Product & Design Team
