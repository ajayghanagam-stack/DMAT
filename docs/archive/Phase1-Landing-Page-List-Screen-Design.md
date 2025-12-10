# Phase 1 Landing Page List Screen - Design Specification

**Version:** 1.0
**Date:** 2025-12-03
**Purpose:** UI/UX design specification for landing page list view in DMAT admin dashboard

---

## 📋 Overview

The landing page list screen is the primary interface where DMAT users (admins and editors) view, manage, and organize their landing pages. This screen provides a comprehensive overview of all landing pages with filtering, sorting, and quick actions.

**User Goals:**
- Quickly see all landing pages at a glance
- Understand status of each page (draft, published, failed)
- Access published pages easily
- Perform common actions (edit, publish, view)
- Find specific pages using filters and search

**Design Principles:**
- **Clarity** - Clear visual hierarchy and status indicators
- **Efficiency** - Quick access to common actions
- **Feedback** - Clear indication of page state and actions
- **Simplicity** - Not overwhelming, especially for first-time users

---

## 🎯 Screen Layout

### Page Structure

```
┌────────────────────────────────────────────────────────────────┐
│  DMAT Header (Logo, User Menu, Notifications)                 │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐                                              │
│  │              │                                              │
│  │  Sidebar     │  ┌─────────────────────────────────────┐   │
│  │  Navigation  │  │                                       │   │
│  │              │  │  Page Title & Actions Area           │   │
│  │  Dashboard   │  │                                       │   │
│  │  > Landing   │  ├─────────────────────────────────────┤   │
│  │    Pages     │  │                                       │   │
│  │  Leads       │  │  Filters & Search Bar                │   │
│  │  Settings    │  │                                       │   │
│  │              │  ├─────────────────────────────────────┤   │
│  │              │  │                                       │   │
│  │              │  │  Landing Pages Table                 │   │
│  │              │  │  (List of pages with columns)        │   │
│  │              │  │                                       │   │
│  │              │  │                                       │   │
│  │              │  ├─────────────────────────────────────┤   │
│  │              │  │  Pagination                          │   │
│  └──────────────┘  └─────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 📊 Table Columns

### Column Specifications

**Columns (Left to Right):**

| # | Column | Width | Sortable | Description |
|---|--------|-------|----------|-------------|
| 1 | Title | 30% | ✅ Yes | Landing page title (clickable to edit) |
| 2 | Status | 12% | ✅ Yes | Current publish status with badge |
| 3 | Created By | 15% | ✅ Yes | User who created the page |
| 4 | Created At | 12% | ✅ Yes | Creation date/time |
| 5 | Published URL | 18% | ❌ No | Link to published page (if published) |
| 6 | Actions | 13% | ❌ No | Action buttons (Edit, Publish, etc.) |

### Column 1: Title

**Display:**
- Landing page title text
- Truncate if longer than ~60 characters
- Show full title on hover (tooltip)
- Clickable (goes to edit page)

**Visual:**
```
Free Marketing Guide 2025
Contact Sales - Enterprise Demo
[Long title that gets truncated after...]
```

**Behavior:**
- Click → Navigate to edit page
- Hover → Show full title in tooltip (if truncated)

**Empty State:**
- If no title (shouldn't happen): Show "(Untitled)"

---

### Column 2: Status

**Display:**
- Badge/pill with status text and color
- Icon (optional) for visual reinforcement

**Status Values:**

| Status | Display | Color | Icon | Description |
|--------|---------|-------|------|-------------|
| `draft` | Draft | Gray | 📝 | Not yet published |
| `publishing` | Publishing... | Blue | ⏳ | Publish in progress |
| `published` | Published | Green | ✅ | Live and public |
| `failed` | Failed | Red | ❌ | Publish attempt failed |

**Visual Examples:**
```
┌─────────┐  ┌──────────────┐  ┌───────────┐  ┌────────┐
│  Draft  │  │ Publishing...│  │ Published │  │ Failed │
└─────────┘  └──────────────┘  └───────────┘  └────────┘
  Gray           Blue             Green          Red
```

**Hover Behavior:**
- `draft` → "Not yet published"
- `publishing` → "Publishing in progress, please wait..."
- `published` → "Live since [date]"
- `failed` → "Publish failed: [error message]" (show first 100 chars)

**Sortable:**
- Yes, alphabetically by status: draft, failed, published, publishing

---

### Column 3: Created By

**Display:**
- User's display name
- If current user: "You" (optional, for clarity)

**Visual:**
```
Admin User
Jane Smith
You
```

**Hover Behavior:**
- Show full user info tooltip:
  ```
  Jane Smith
  jane.smith@company.com
  Editor
  ```

**Empty State:**
- If user deleted: "(Unknown User)"

**Sortable:**
- Yes, alphabetically by user name

---

### Column 4: Created At

**Display:**
- Relative time for recent pages: "2 hours ago", "Yesterday"
- Absolute date for older pages: "Dec 3, 2025"
- Full date/time on hover

**Format Logic:**
- < 1 hour: "X minutes ago"
- < 24 hours: "X hours ago"
- Yesterday: "Yesterday at HH:MM"
- < 7 days: "Day name at HH:MM" (e.g., "Monday at 2:30 PM")
- Older: "MMM D, YYYY" (e.g., "Nov 28, 2025")

**Visual:**
```
2 hours ago
Yesterday at 3:45 PM
Nov 28, 2025
```

**Hover Behavior:**
- Show full timestamp: "December 3, 2025 at 2:30:45 PM EST"

**Sortable:**
- Yes, chronologically (default sort: newest first)

---

### Column 5: Published URL

**Display:**
- If published: Clickable link to public page
- If not published: Empty or "—" (em dash)

**Visual (Published):**
```
🔗 View Page
```
or
```
innovateelectronics.com/lp/free-guide...
```

**Visual (Not Published):**
```
—
```

**Link Behavior:**
- Click → Open published page in new tab/window
- Shows external link icon (↗)
- Truncate long URLs (show domain + slug)

**Hover Behavior:**
- Show full URL in tooltip
- "Click to view published page"

**Copy Functionality:**
- Show copy icon next to link
- Click to copy full URL to clipboard
- Show "Copied!" confirmation

**Empty State:**
- Draft/Failed pages: Show "—" or empty

**Not Sortable:**
- URLs vary too much to sort meaningfully

---

### Column 6: Actions

**Display:**
- Button group or dropdown menu
- Buttons shown depend on page status

**Action Buttons by Status:**

**Draft Page:**
```
[Edit] [Publish]
```

**Publishing Page (In Progress):**
```
[View Details] (All actions disabled)
```

**Published Page:**
```
[Edit] [View] [•••]
```

**Failed Page:**
```
[Edit] [Retry] [•••]
```

**Action Descriptions:**

| Action | Icon | Availability | Behavior |
|--------|------|--------------|----------|
| Edit | ✏️ | All statuses except publishing | Navigate to edit page |
| Publish | 🚀 | Draft only | Trigger publish workflow, show progress |
| View | 👁️ | Published only | Open published page in new tab |
| Retry | 🔄 | Failed only | Retry publish operation |
| ••• (More) | ⋮ | All | Dropdown with additional actions |

**More Actions Menu (•••):**
- Duplicate (Phase 2)
- Unpublish (Phase 2)
- Delete
- View History (Phase 2)

---

## 🔍 Filters & Search

### Filter Bar Layout

```
┌────────────────────────────────────────────────────────────────┐
│  [🔍 Search...]  [Status ▼]  [Created By ▼]  [Clear Filters]  │
└────────────────────────────────────────────────────────────────┘
```

### Search Input

**Placeholder:** "Search landing pages by title or slug..."

**Behavior:**
- Search as you type (debounced, 300ms delay)
- Search fields: title, slug, headline
- Case-insensitive
- Shows results count: "Showing 5 of 42 pages"

**Visual:**
```
┌────────────────────────────────────────────┐
│ 🔍 Search landing pages by title or slug │
└────────────────────────────────────────────┘
```

**Empty Search Result:**
```
No pages found matching "xyz"
Try adjusting your search or filters.
```

---

### Status Filter

**Label:** "Status"

**Options:**
- All Statuses (default)
- Draft
- Published
- Failed
- Publishing (show only if any exist)

**Visual:**
```
┌──────────────┐
│ Status    ▼  │
├──────────────┤
│ ✓ All        │
│   Draft      │
│   Published  │
│   Failed     │
└──────────────┘
```

**Badge Count:**
- Show count next to each option: "Draft (12)"

---

### Created By Filter

**Label:** "Created By"

**Options:**
- All Users (default)
- Me (current user)
- [List of all users who created pages]

**Visual:**
```
┌──────────────────┐
│ Created By    ▼  │
├──────────────────┤
│ ✓ All Users      │
│   Me             │
│   ─────────────  │
│   Admin User     │
│   Jane Smith     │
│   John Doe       │
└──────────────────┘
```

---

### Clear Filters Button

**Behavior:**
- Visible only when filters are active
- Click → Reset all filters to default
- Clear search input

**Visual:**
```
[× Clear Filters]
```

---

### Active Filters Display

**Show active filters as removable tags:**

```
Active Filters:  [Status: Published ×]  [Created By: Me ×]
```

**Behavior:**
- Click × to remove individual filter
- Click filter tag to edit filter

---

## 📑 Pagination

### Pagination Controls

**Position:** Bottom of table

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  Showing 1-20 of 42 pages                                   │
│                                                              │
│  [← Previous]  [1] [2] [3] ... [7]  [Next →]               │
│                                                              │
│  Show: [20 ▼] per page                                      │
└─────────────────────────────────────────────────────────────┘
```

**Items Per Page Options:**
- 10, 20, 50, 100

**Behavior:**
- Default: 20 items per page
- Remember user preference (localStorage)
- Show page numbers: First, Last, Current ± 2
- Ellipsis (...) for skipped pages
- Disable Previous/Next at boundaries

**Visual States:**

**Current Page:**
```
[1] (highlighted)
```

**Other Pages:**
```
2  3  4
```

**Disabled:**
```
← Previous (grayed out, not clickable)
```

---

## 🎨 Visual States

### Empty State (No Pages)

**Shown when:** User has no landing pages yet

**Visual:**
```
┌───────────────────────────────────────────────┐
│                                               │
│              📄                               │
│                                               │
│     No landing pages yet                      │
│                                               │
│     Create your first landing page to         │
│     start capturing leads.                    │
│                                               │
│     [+ Create Landing Page]                   │
│                                               │
└───────────────────────────────────────────────┘
```

---

### Empty State (No Results)

**Shown when:** Search/filters return no results

**Visual:**
```
┌───────────────────────────────────────────────┐
│                                               │
│              🔍                               │
│                                               │
│     No pages found matching "marketing"       │
│                                               │
│     Try adjusting your search or filters.     │
│                                               │
│     [Clear Filters]                           │
│                                               │
└───────────────────────────────────────────────┘
```

---

### Loading State

**Shown when:** Fetching data from API

**Visual:**
```
┌───────────────────────────────────────────────┐
│                                               │
│              ⏳                               │
│                                               │
│          Loading landing pages...             │
│                                               │
│          [Spinner animation]                  │
│                                               │
└───────────────────────────────────────────────┘
```

**Skeleton Loading (Alternative):**
- Show table structure with gray loading bars
- Provides better visual continuity

```
┌──────────────────────────────────────────────────┐
│ Title           Status    Created By  Created At │
├──────────────────────────────────────────────────┤
│ ▓▓▓▓▓▓▓▓        ▓▓▓▓      ▓▓▓▓▓▓      ▓▓▓▓▓▓    │
│ ▓▓▓▓▓▓▓▓▓       ▓▓▓▓      ▓▓▓▓▓▓      ▓▓▓▓▓▓    │
│ ▓▓▓▓▓▓          ▓▓▓▓      ▓▓▓▓▓▓      ▓▓▓▓▓▓    │
└──────────────────────────────────────────────────┘
```

---

### Error State

**Shown when:** API request fails

**Visual:**
```
┌───────────────────────────────────────────────┐
│                                               │
│              ⚠️                                │
│                                               │
│     Failed to load landing pages              │
│                                               │
│     An error occurred while loading your      │
│     landing pages. Please try again.          │
│                                               │
│     [Try Again]                               │
│                                               │
└───────────────────────────────────────────────┘
```

**Error Details (Developer Mode):**
- Show error message
- Show "Report Issue" button

---

## 🎯 Page Title & Actions Area

### Layout

```
┌────────────────────────────────────────────────────────────┐
│  Landing Pages                          [+ New Landing Page]│
│  Manage and publish your landing pages                      │
└────────────────────────────────────────────────────────────┘
```

**Title:** "Landing Pages" (H1)

**Subtitle:** "Manage and publish your landing pages"

**Primary Action:** "+ New Landing Page" button
- Position: Top right
- Color: Primary brand color (blue)
- Behavior: Navigate to create new page screen

---

## 📱 Responsive Design

### Desktop (> 1024px)

- Full table with all columns visible
- Filters horizontal layout
- Pagination full controls

### Tablet (768px - 1024px)

- Table with 5 columns (hide "Created By" if needed)
- Filters may stack vertically
- Pagination simplified

### Mobile (< 768px)

**Card View Instead of Table:**

```
┌─────────────────────────────────────┐
│ Free Marketing Guide 2025           │
│ Status: [Published]                 │
│ Created: 2 hours ago by Admin User  │
│ 🔗 View Page                        │
│ [Edit] [•••]                        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Contact Sales                       │
│ Status: [Draft]                     │
│ Created: Yesterday by Jane Smith    │
│ [Edit] [Publish]                    │
└─────────────────────────────────────┘
```

**Mobile Filters:**
- Filters in collapsible panel
- Search bar full width
- Status/Created By in dropdown overlay

---

## ♿ Accessibility

### Keyboard Navigation

**Tab Order:**
1. Search input
2. Status filter
3. Created By filter
4. Table headers (sortable)
5. Each row (focus highlights row)
6. Action buttons within focused row
7. Pagination controls

**Keyboard Shortcuts:**
- `Tab` - Navigate forward
- `Shift+Tab` - Navigate backward
- `Enter/Space` - Activate focused element
- `Esc` - Close dropdowns
- `↑/↓` - Navigate table rows (optional)

### Screen Reader Support

**Table Markup:**
```html
<table role="grid" aria-label="Landing pages list">
  <thead>
    <tr>
      <th scope="col" aria-sort="none">
        <button aria-label="Sort by title">Title</button>
      </th>
      <!-- ... -->
    </tr>
  </thead>
  <tbody>
    <tr aria-label="Landing page: Free Marketing Guide 2025, Status: Published">
      <!-- ... -->
    </tr>
  </tbody>
</table>
```

**Status Badges:**
```html
<span class="badge badge-published" role="status" aria-label="Published">
  Published
</span>
```

**Action Buttons:**
```html
<button aria-label="Edit Free Marketing Guide 2025">
  Edit
</button>
```

### Color Contrast

**Ensure WCAG AA compliance:**
- Text: Minimum 4.5:1 contrast ratio
- Large text (18pt+): Minimum 3:1
- Status badges: Both color AND icon for colorblind users

**Status Colors (Accessible):**
- Draft: Gray #6B7280 on light gray background
- Published: Green #10B981 on light green background
- Failed: Red #DC2626 on light red background
- Publishing: Blue #3B82F6 on light blue background

---

## 🎨 Visual Design Mockup (ASCII)

### Full Page View

```
┌──────────────────────────────────────────────────────────────────┐
│  DMAT                                   🔔  👤 Admin User ▼       │
├──┬───────────────────────────────────────────────────────────────┤
│  │                                                                │
│ D│  Landing Pages                    [+ New Landing Page]        │
│ a│  Manage and publish your landing pages                        │
│ s│                                                                │
│ h├────────────────────────────────────────────────────────────────┤
│ b│  [🔍 Search...]  [Status: All ▼]  [Created By: All ▼]  │
│ o├────────────────────────────────────────────────────────────────┤
│ a│                                                                │
│ r│  ┌──────────────────────────────────────────────────────────┐ │
│ d│  │ Title           Status    Created By  Created At  URL    │ │
│  │  ├──────────────────────────────────────────────────────────┤ │
│ L│  │ Free Marketing  Published Admin User 2 hours ago View    │ │
│ a│  │ Guide 2025                                         [Edit] │ │
│ n│  │                                                            │ │
│ d│  │ Contact Sales   Draft     Jane Smith Yesterday     —     │ │
│ i│  │ - Enterprise                                   [Edit][Pub]│ │
│ n│  │                                                            │ │
│ g│  │ Webinar Reg     Failed    Admin User Nov 28       —      │ │
│  │  │                                              [Edit][Retry] │ │
│ P│  │                                                            │ │
│ a│  │ Product Demo    Publishing... You     5 mins ago   —     │ │
│ g│  │                                           [View Details]  │ │
│ e│  └──────────────────────────────────────────────────────────┘ │
│ s│                                                                │
│  │  Showing 1-20 of 42 pages                                     │
│ L│                                                                │
│ e│  [← Previous]  [1] [2] [3] ... [7]  [Next →]                 │
│ a│                                                                │
│ d│  Show: [20 ▼] per page                                        │
│ s│                                                                │
│  │                                                                │
│ S│                                                                │
│ e│                                                                │
│ t│                                                                │
│ t│                                                                │
└──┴────────────────────────────────────────────────────────────────┘
```

---

## 🎭 Interaction Patterns

### Row Hover

**Behavior:**
- Slight background color change
- Show action buttons (if hidden by default)
- Cursor changes to pointer for clickable elements

**Visual:**
```
┌──────────────────────────────────────────────────┐
│ Free Marketing  Published  Admin  2 hrs  View   │  ← Normal
│ Guide 2025                             [Edit]   │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Contact Sales   Draft    Jane   Yesterday   —   │  ← Hovered
│ - Enterprise                        [Edit][Pub] │   (highlighted)
└──────────────────────────────────────────────────┘
```

---

### Sort Column

**Behavior:**
- Click column header to sort
- First click: Ascending
- Second click: Descending
- Third click: Remove sort (back to default)

**Visual Indicators:**
```
Title ↑         (Ascending)
Title ↓         (Descending)
Title           (Not sorted)
```

**Default Sort:**
- Created At, Descending (newest first)

---

### Bulk Actions (Phase 2)

**Checkbox Column (Future):**
```
☑ Select All

☐ Free Marketing Guide 2025
☑ Contact Sales
☑ Webinar Registration

With 2 selected: [Delete] [Duplicate]
```

---

## 🧪 User Scenarios

### Scenario 1: New User (First Time)

**State:** No landing pages exist

**Experience:**
1. See empty state illustration
2. Clear CTA: "Create your first landing page"
3. Click button → Navigate to create page

---

### Scenario 2: Find Specific Page

**State:** 50+ pages exist

**Experience:**
1. Type in search: "marketing"
2. See results filtered in real-time
3. Results show: "Showing 3 of 52 pages"
4. Click page title to edit

---

### Scenario 3: Publish Draft Page

**State:** Draft page exists

**Experience:**
1. Find page in list
2. See status: "Draft" (gray badge)
3. Click "Publish" button
4. See status change to "Publishing..." (blue badge)
5. After ~2 seconds, status changes to "Published" (green)
6. "View" link appears in Published URL column
7. Success notification: "Landing page published!"

---

### Scenario 4: Fix Failed Publish

**State:** Page failed to publish

**Experience:**
1. See status: "Failed" (red badge)
2. Hover status → See error: "Disk full..."
3. Click "Retry" button (after fixing disk issue)
4. See status change to "Publishing..."
5. Success: Status changes to "Published"

---

### Scenario 5: View Published Page

**State:** Page is published

**Experience:**
1. See status: "Published" (green)
2. See "View Page" link in Published URL column
3. Click link → Opens in new tab
4. See live landing page with form

---

## 📊 Performance Considerations

### Pagination Benefits

- Load only 20 pages at a time
- Faster initial page load
- Better performance with 1000+ pages

### Debounced Search

- Wait 300ms after typing stops
- Prevents excessive API calls
- Better UX (not laggy)

### Optimistic UI Updates

**Example: Publishing**
1. User clicks "Publish"
2. Immediately update UI (status = "Publishing...")
3. Make API call in background
4. On success: Update to "Published"
5. On failure: Revert to "Draft", show error

---

## 🔮 Future Enhancements (Phase 2+)

### Advanced Filters

- Date range picker (created between...)
- Lead count filter (pages with > 10 leads)
- Published date filter

### Column Customization

- Show/hide columns
- Reorder columns
- Save column preferences

### Bulk Actions

- Select multiple pages
- Bulk delete, bulk publish
- Bulk status change

### Views & Saved Filters

- Save filter combinations as "views"
- Quick switch between views
- Share views with team

### Analytics Preview

- Show lead count per page in table
- Conversion rate preview
- Trending indicator

---

## 📚 Related Documentation

- [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md) - API endpoints used
- [Phase1-LandingPage-Lifecycle.md](./Phase1-LandingPage-Lifecycle.md) - Status values
- [Phase1-Publish-State-Management.md](./Phase1-Publish-State-Management.md) - Publish workflow

---

## ✅ Implementation Checklist

### Data Fetching
- [ ] Implement API call to GET /api/admin/landing-pages
- [ ] Handle pagination parameters (page, limit)
- [ ] Handle filter parameters (status, created_by)
- [ ] Handle sort parameters (sort_by, sort_order)
- [ ] Handle search parameter

### UI Components
- [ ] Table component with sortable headers
- [ ] Status badge component with colors/icons
- [ ] Action button group component
- [ ] Search input with debounce
- [ ] Filter dropdowns (Status, Created By)
- [ ] Pagination controls
- [ ] Empty state component
- [ ] Loading state (spinner or skeleton)
- [ ] Error state component

### User Interactions
- [ ] Click title → Navigate to edit page
- [ ] Click "Publish" → Show confirmation, trigger publish
- [ ] Click "Edit" → Navigate to edit page
- [ ] Click "View" → Open published page in new tab
- [ ] Click "Retry" → Trigger re-publish
- [ ] Click status badge → Show details tooltip
- [ ] Click column header → Sort table
- [ ] Type in search → Filter results
- [ ] Select filter → Update table
- [ ] Click pagination → Load page

### Accessibility
- [ ] Proper ARIA labels
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Screen reader announcements
- [ ] Color contrast compliance

### Responsive Design
- [ ] Desktop layout (table)
- [ ] Tablet layout (adjusted table)
- [ ] Mobile layout (card view)

---

**Design Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-03
**Maintained by:** DMAT Product & Design Team
