# Phase 1 Lead Details View - Design Specification

**Version:** 1.0
**Date:** 2025-12-04
**Purpose:** UI/UX design specification for the lead details view in DMAT admin dashboard

---

## 📋 Overview

The lead details view displays all information about a specific lead, including contact information, source data, and metadata. Users can view full details and update the lead's status manually.

**User Goals:**
- View all lead information in one place
- See full values for all fields (not truncated)
- Understand lead source and context
- Update lead status manually (New → Contacted, etc.)
- Copy contact information easily
- Quickly navigate between leads

**Design Principles:**
- **Quick Access** - Open from leads list without page navigation
- **Scannable** - Clear sections with visual hierarchy
- **Actionable** - Easy status updates and contact actions
- **Non-Intrusive** - Doesn't block the full screen unnecessarily

**Related Documentation:**
- [Phase1-Leads-Schema.md](./Phase1-Leads-Schema.md) - Database schema for leads
- [Phase1-Leads-List-Screen-Design.md](./Phase1-Leads-List-Screen-Design.md) - Leads list screen

---

## 🎯 Design Approach: Side Panel vs Modal

### Recommendation: Side Panel (Phase 1)

**Rationale:**
- Maintains context of leads list in background
- Easier to navigate between multiple leads
- More modern UX pattern (like Gmail, Notion)
- Less disruptive than full-screen modal
- Better for responsive design (can collapse on mobile)

**Alternative:** Modal overlay (simpler implementation but less elegant)

---

## 🏗️ Side Panel Layout

### Desktop Layout (> 1024px)

```
┌──────────────────────────────────────────────────────────────────┐
│  DMAT Header                                                     │
├──────────────────────────────────────────────────────────────────┤
│  ┌────────────┐                                                  │
│  │            │  ┌───────────────────┐  ┌─────────────────────┐ │
│  │  Sidebar   │  │  Leads List       │  │  Lead Details    [×]│ │
│  │  Nav       │  │                   │  ├─────────────────────┤ │
│  │            │  │  [Filters]        │  │                     │ │
│  │            │  │                   │  │  John Doe           │ │
│  │            │  │  [Table...]       │  │  john@example.com   │ │
│  │            │  │  • John Doe ← ✓   │  │                     │ │
│  │            │  │  • Jane Smith     │  │  Contact Info       │ │
│  │            │  │  • Michael...     │  │  • Email            │ │
│  │            │  │                   │  │  • Phone            │ │
│  │            │  │                   │  │                     │ │
│  │            │  │                   │  │  Landing Page       │ │
│  │            │  │                   │  │  • Title            │ │
│  │            │  │                   │  │  • URL              │ │
│  │            │  │                   │  │                     │ │
│  │            │  │                   │  │  Source Data        │ │
│  │            │  │                   │  │  • Referrer         │ │
│  │            │  │                   │  │  • Landing URL      │ │
│  │            │  │                   │  │                     │ │
│  │            │  │                   │  │  Metadata           │ │
│  │            │  │                   │  │  • IP Address       │ │
│  │            │  │                   │  │  • User Agent       │ │
│  │            │  │                   │  │                     │ │
│  │            │  │                   │  │  [Status Update ▼]  │ │
│  │            │  │                   │  │                     │ │
│  │            │  │  [Pagination]     │  │  [Actions...]       │ │
│  └────────────┘  └───────────────────┘  └─────────────────────┘ │
│                   ← 60% width →          ← 40% width →          │
└──────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (< 768px)

**Full-Screen Overlay:**

```
┌──────────────────────────────┐
│  ← Back    Lead Details   [×]│
├──────────────────────────────┤
│                              │
│  John Doe                    │
│  john@example.com            │
│                              │
│  Contact Information         │
│  • Email: john@example.com   │
│  • Phone: (555) 123-4567     │
│                              │
│  Landing Page                │
│  • Free Marketing Guide      │
│  • View Page →               │
│                              │
│  Source Data                 │
│  • Referrer: google.com      │
│  • Landing URL: ...          │
│                              │
│  Metadata                    │
│  • Submitted: 2 hours ago    │
│  • IP: 192.168.1.1           │
│                              │
│  Status: [New ▼]             │
│                              │
│  [Send Email] [Copy Email]   │
│                              │
└──────────────────────────────┘
```

---

## 📊 Panel Sections

### Section 1: Header

**Components:**
- Lead name (large, bold)
- Lead email (below name, clickable)
- Close button [×] (top right)
- Status badge (top right, below close button)

**Layout:**
```
┌───────────────────────────────────────┐
│  Lead Details                    [×]  │
├───────────────────────────────────────┤
│                                       │
│  John Doe                    [New]    │
│  john@example.com ✉                   │
│                                       │
└───────────────────────────────────────┘
```

**Styling:**
- Name: 24px, bold, dark gray (#111827)
- Email: 16px, blue (#3B82F6), clickable
- Status badge: Same as list view (colored badge)
- Close button: Gray icon, hover → darker

**Interactions:**
- Click email → Opens mailto:john@example.com
- Click [×] → Close panel
- Click outside panel → Close panel (optional)
- Press Escape → Close panel

---

### Section 2: Contact Information

**Label:** "Contact Information" (section heading)

**Fields Displayed:**
- Email (with icon, clickable)
- Phone (with icon, clickable, show "Not provided" if empty)
- Name (full name as submitted)
- Company (if provided)
- Job Title (if provided)
- Message (if provided, show full text)

**Layout:**
```
┌───────────────────────────────────────┐
│  Contact Information                  │
├───────────────────────────────────────┤
│                                       │
│  ✉ Email                              │
│  john@example.com                     │
│  [Send Email] [Copy]                  │
│                                       │
│  ☎ Phone                              │
│  (555) 123-4567                       │
│  [Call] [Copy]                        │
│                                       │
│  👤 Full Name                         │
│  John Doe                             │
│                                       │
│  🏢 Company                           │
│  Acme Corporation                     │
│                                       │
│  💼 Job Title                         │
│  Marketing Director                   │
│                                       │
│  💬 Message                           │
│  I'm interested in learning more      │
│  about your digital marketing         │
│  solutions for enterprise clients.    │
│                                       │
└───────────────────────────────────────┘
```

**Field Format:**

**Email:**
```
✉ Email
john@example.com
[Send Email] [Copy]
```
- Blue, clickable
- Two action buttons below:
  - "Send Email" → Opens mailto:
  - "Copy" → Copies email to clipboard, shows "Copied!" feedback

**Phone:**
```
☎ Phone
(555) 123-4567
[Call] [Copy]

OR (if empty):

☎ Phone
Not provided
```
- If provided: Blue, clickable (tel: link)
- Two action buttons: "Call" and "Copy"
- If empty: Gray text "Not provided"

**Full Name:**
```
👤 Full Name
John Doe
```
- Dark gray text
- Read-only display

**Company:**
```
🏢 Company
Acme Corporation

OR (if empty):

🏢 Company
Not provided
```

**Job Title:**
```
💼 Job Title
Marketing Director

OR (if empty):

💼 Job Title
Not provided
```

**Message:**
```
💬 Message
I'm interested in learning more about your digital
marketing solutions for enterprise clients. We have
a team of 50+ and are looking to improve our lead
generation process.

OR (if empty):

💬 Message
No message provided
```
- Show full text (no truncation)
- Multi-line text area styling
- Light gray background for better readability

---

### Section 3: Landing Page

**Label:** "Landing Page" (section heading)

**Fields Displayed:**
- Landing page title
- Landing page URL (published URL)
- Link to view page (opens in new tab)
- Link to edit page (internal admin link)

**Layout:**
```
┌───────────────────────────────────────┐
│  Landing Page                         │
├───────────────────────────────────────┤
│                                       │
│  📄 Free Marketing Guide 2025         │
│                                       │
│  🔗 Published URL                     │
│  https://dmat-app.example.com/        │
│  pages/free-marketing-guide.html      │
│                                       │
│  [View Page →] [Edit Page]            │
│                                       │
└───────────────────────────────────────┘
```

**Interactions:**
- Click "View Page" → Opens published URL in new tab
- Click "Edit Page" → Navigate to `/admin/landing-pages/:id/edit`
- Published URL is selectable/copyable text

**Special Case (Deleted Landing Page):**
```
┌───────────────────────────────────────┐
│  Landing Page                         │
├───────────────────────────────────────┤
│                                       │
│  ⚠ [Deleted Landing Page]             │
│                                       │
│  Landing Page ID: 42                  │
│                                       │
│  This landing page has been deleted   │
│  and is no longer available.          │
│                                       │
└───────────────────────────────────────┘
```

---

### Section 4: Source Data

**Label:** "Source Data" (section heading)

**Fields Displayed:**
- Referrer URL (full URL)
- Landing URL (full URL with query parameters)
- Source (extracted domain or "Direct")
- UTM parameters (if present, Phase 2)

**Layout:**
```
┌───────────────────────────────────────┐
│  Source Data                          │
├───────────────────────────────────────┤
│                                       │
│  🌐 Referrer                          │
│  https://www.google.com/search?       │
│  q=digital+marketing+guide            │
│  [Copy]                               │
│                                       │
│  🔗 Landing URL                       │
│  https://dmat-app.example.com/        │
│  pages/free-marketing-guide.html      │
│  [Copy]                               │
│                                       │
│  📍 Source                            │
│  google.com                           │
│                                       │
└───────────────────────────────────────┘
```

**Field Format:**

**Referrer URL:**
```
🌐 Referrer
https://www.google.com/search?q=digital+marketing+guide
[Copy]

OR (if direct visit):

🌐 Referrer
Direct visit (no referrer)
```
- Full URL displayed (no truncation)
- Wrap to multiple lines if long
- Copy button copies full URL
- If null/empty → Show "Direct visit (no referrer)" in gray

**Landing URL:**
```
🔗 Landing URL
https://dmat-app.example.com/pages/free-marketing-guide.html?utm_source=email&utm_campaign=newsletter
[Copy]
```
- Full URL including query parameters
- Useful for seeing UTM parameters (Phase 2 can parse and display separately)
- Copy button copies full URL

**Source:**
```
📍 Source
google.com
```
- Extracted domain from referrer
- Read-only display
- Shows "Direct" if no referrer

---

### Section 5: Metadata

**Label:** "Metadata" (section heading)

**Fields Displayed:**
- Submitted timestamp (absolute date/time)
- IP Address
- User Agent (browser/device info)
- Lead ID (for reference)

**Layout:**
```
┌───────────────────────────────────────┐
│  Metadata                             │
├───────────────────────────────────────┤
│                                       │
│  🕐 Submitted                         │
│  December 4, 2025 at 2:30:15 PM EST   │
│  (2 hours ago)                        │
│                                       │
│  🌐 IP Address                        │
│  192.168.1.100                        │
│  [Copy]                               │
│                                       │
│  💻 User Agent                        │
│  Mozilla/5.0 (Windows NT 10.0;        │
│  Win64; x64) Chrome/120.0.0.0         │
│                                       │
│  Detected: Windows, Chrome            │
│                                       │
│  🔢 Lead ID                           │
│  #12847                               │
│                                       │
└───────────────────────────────────────┘
```

**Field Format:**

**Submitted:**
```
🕐 Submitted
December 4, 2025 at 2:30:15 PM EST
(2 hours ago)
```
- Absolute timestamp on first line
- Relative time on second line (gray, italic)

**IP Address:**
```
🌐 IP Address
192.168.1.100
[Copy]
```
- Monospace font
- Copy button

**User Agent:**
```
💻 User Agent
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36

Detected: Windows, Chrome
```
- Full user agent string (wrap to multiple lines)
- Small, monospace font
- Second line: Human-readable summary (Phase 2: parse user agent)
- If too long, show first 200 chars with "... [Show More]" expand option

**Lead ID:**
```
🔢 Lead ID
#12847
```
- Numeric ID from database
- Useful for support/debugging
- Gray text

---

### Section 6: Status Management

**Label:** "Status" (section heading)

**Components:**
- Current status badge (large)
- Status dropdown selector
- Last updated timestamp (after status change)

**Layout:**
```
┌───────────────────────────────────────┐
│  Status                               │
├───────────────────────────────────────┤
│                                       │
│  Current Status: [New]                │
│                                       │
│  Update Status:                       │
│  ┌─────────────────────────────────┐ │
│  │ New                        ▼    │ │
│  └─────────────────────────────────┘ │
│                                       │
│  [Update Status]                      │
│                                       │
└───────────────────────────────────────┘
```

**Dropdown Options:**
```
┌─────────────────────────────────┐
│ New                        ✓    │ ← Current status
├─────────────────────────────────┤
│ Contacted                       │
│ Qualified                       │
│ Converted                       │
│ Unqualified                     │
│ Spam                            │
└─────────────────────────────────┘
```

**Workflow:**

**Step 1: Initial State**
```
Current Status: [New]

Update Status:
[New ▼]

[Update Status] (disabled - no change)
```

**Step 2: User Selects Different Status**
```
Current Status: [New]

Update Status:
[Contacted ▼]

[Update Status] (enabled - change detected)
```

**Step 3: User Clicks "Update Status" Button**
- API call: PUT /api/admin/leads/:id
- Request body: `{ "status": "contacted" }`
- Show loading state: Button shows "Updating..."
- Disable dropdown during update

**Step 4: Success**
```
Current Status: [Contacted] ← Updated badge

Update Status:
[Contacted ▼]

[Update Status] (disabled - no change)

✓ Status updated successfully
  Updated just now
```
- Current status badge updates to new status
- Dropdown resets to new current status
- Show success message (green, fades after 3 seconds)
- Show "Updated just now" timestamp (gray, below badge)
- Update leads list in background (if visible)

**Step 5: Error**
```
Current Status: [New] ← Stays unchanged

Update Status:
[Contacted ▼]

[Update Status] (re-enabled)

✗ Failed to update status. Please try again.
```
- Show error message (red)
- Re-enable button for retry
- Dropdown stays on selected value (allows retry)

---

### Section 7: Quick Actions

**Label:** None (action buttons at bottom)

**Buttons:**
- Send Email (primary action)
- Copy Email (secondary action)
- Delete Lead (destructive, bottom left, Phase 2)

**Layout:**
```
┌───────────────────────────────────────┐
│                                       │
│  [Delete Lead]     [Copy Email]       │
│                    [Send Email]       │
│                                       │
└───────────────────────────────────────┘
     ↑ Left               ↑ Right
```

**Button Specifications:**

**Send Email (Primary):**
```
[Send Email ✉]
```
- Primary button (blue, filled)
- Opens mailto:john@example.com
- Full width on mobile

**Copy Email (Secondary):**
```
[Copy Email 📋]
```
- Secondary button (gray, outline)
- Copies email to clipboard
- Shows "Copied!" tooltip for 2 seconds
- Changes to "✓ Copied" briefly, then back to "Copy Email"

**Delete Lead (Destructive, Phase 2):**
```
[Delete Lead]
```
- Text link (red)
- Left-aligned, separate from other actions
- Click → Show confirmation modal:
  ```
  ╔═══════════════════════════════════╗
  ║  Delete Lead?                     ║
  ╠═══════════════════════════════════╣
  ║                                   ║
  ║  Are you sure you want to delete  ║
  ║  this lead for John Doe?          ║
  ║                                   ║
  ║  This action cannot be undone.    ║
  ║                                   ║
  ║     [Cancel]  [Delete Lead]       ║
  ╚═══════════════════════════════════╝
  ```
- On confirm → DELETE /api/admin/leads/:id
- On success → Close panel, remove from list, show toast "Lead deleted"

---

## 🎬 Open/Close Behavior

### Opening the Panel

**Trigger:** Click a lead row in the leads list

**Animation:**
- Slide in from right (300ms ease-out)
- Subtle fade overlay on list (optional, 40% opacity black)

**URL Update:**
- Update URL to include lead ID: `/admin/leads?view=12847`
- Allows bookmarking and sharing specific lead view
- Browser back button closes panel

**Loading State:**
- If lead data needs to be fetched (not already in list)
- Show skeleton loading in panel:
  ```
  ┌───────────────────────────────────┐
  │  Lead Details              [×]    │
  ├───────────────────────────────────┤
  │                                   │
  │  ▓▓▓▓▓▓▓▓▓▓▓▓                    │
  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                │
  │                                   │
  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓        │
  │  ▓▓▓▓▓▓▓▓▓▓▓▓                    │
  │                                   │
  └───────────────────────────────────┘
  ```

---

### Closing the Panel

**Triggers:**
1. Click [×] close button (top right)
2. Press Escape key
3. Click outside panel (optional, can be disabled)
4. Click browser back button
5. Navigate to different page

**Animation:**
- Slide out to right (300ms ease-in)
- Fade out overlay
- URL updates to remove ?view parameter: `/admin/leads`

**Unsaved Changes Warning:**
- If status was changed but not saved (dropdown changed, button not clicked)
- Show confirmation:
  ```
  ╔═══════════════════════════════════╗
  ║  Unsaved Changes                  ║
  ╠═══════════════════════════════════╣
  ║  You have unsaved status changes. ║
  ║  Discard changes?                 ║
  ║                                   ║
  ║     [Keep Editing]  [Discard]     ║
  ╚═══════════════════════════════════╝
  ```
- If no unsaved changes → Close immediately

---

## 🔄 Navigation Between Leads

### Previous/Next Buttons (Phase 2 Enhancement)

**Location:** Top of panel, next to title

**Layout:**
```
┌───────────────────────────────────────┐
│  [←] [→]  Lead Details           [×]  │
├───────────────────────────────────────┤
│  John Doe                             │
│  ...                                  │
└───────────────────────────────────────┘
```

**Behavior:**
- Click [←] → Load previous lead from list
- Click [→] → Load next lead from list
- Disable [←] if first lead
- Disable [→] if last lead
- Update URL parameter: ?view=12846
- Show loading state during navigation

**Keyboard Shortcuts:**
- `←` or `k` → Previous lead
- `→` or `j` → Next lead
- `Esc` → Close panel

**Not Required for Phase 1** (nice to have for Phase 2)

---

## 📱 Responsive Behavior

### Desktop (> 1024px)

**Layout:** Side panel (40% width, max 500px)
- Slides in from right
- List remains visible on left (60%)
- Overlay dims list slightly
- Panel scrollable if content exceeds height

---

### Tablet (768px - 1024px)

**Layout:** Side panel (50% width)
- Slides in from right
- List partially visible on left (50%)
- Overlay dims list
- Panel scrollable

---

### Mobile (< 768px)

**Layout:** Full-screen overlay
- Covers entire screen
- Back button in header (top left)
- Close button in header (top right)
- List completely hidden
- Full scrollable content

**Header:**
```
┌──────────────────────────────┐
│  ← Back   Lead Details   [×] │
└──────────────────────────────┘
```

**Actions:** Full-width buttons (stacked vertically)

---

## ♿ Accessibility

### Keyboard Navigation

**Tab Order:**
1. Close button [×]
2. Email link
3. Send Email button
4. Copy Email button
5. Phone link (if present)
6. Call button (if phone present)
7. Copy Phone button (if phone present)
8. View Page link
9. Edit Page link
10. Copy Referrer button
11. Copy Landing URL button
12. Copy IP button
13. Status dropdown
14. Update Status button
15. Quick action buttons

**Keyboard Shortcuts:**
- `Esc` → Close panel
- `Ctrl/Cmd + C` → Copy email (when focused)
- `Enter` → Activate focused button
- `Tab` → Navigate forward
- `Shift + Tab` → Navigate backward

---

### Screen Reader Support

**Panel Announcement:**
```html
<aside role="complementary" aria-label="Lead details for John Doe">
  <h2 id="lead-details-title">Lead Details</h2>
  ...
</aside>
```

**Section Headings:**
```html
<h3>Contact Information</h3>
<h3>Landing Page</h3>
<h3>Source Data</h3>
<h3>Metadata</h3>
<h3>Status</h3>
```

**Status Update Announcement:**
```html
<div role="status" aria-live="polite">
  Status updated successfully
</div>
```

**Copy Button Feedback:**
```html
<button aria-label="Copy email address">
  Copy Email
</button>
<!-- After click: -->
<button aria-label="Email address copied to clipboard">
  ✓ Copied
</button>
```

---

### Focus Management

**On Open:**
- Focus moves to close button [×] or panel container
- Screen reader announces: "Lead details for John Doe"
- Focus trapped within panel (Tab doesn't go back to list)

**On Close:**
- Focus returns to clicked row in list
- Screen reader announces: "Lead details closed"

**During Status Update:**
- Focus stays on "Update Status" button
- Button shows loading state: "Updating..."
- On success: Focus stays on button, announcement: "Status updated successfully"
- On error: Focus stays on button, announcement: "Failed to update status"

---

### WCAG AA Compliance

**Color Contrast:**
- All text meets 4.5:1 minimum ratio
- Status badges meet contrast requirements
- Link colors (#3B82F6) meet 4.5:1 on white

**Focus Indicators:**
- Blue outline (2px solid #3B82F6)
- Visible on all interactive elements
- High contrast (3:1 minimum)

**Text Sizing:**
- Minimum 16px for body text
- Can be zoomed to 200% without breaking layout

---

## 🎨 Visual Design

### Typography

**Lead Name (Header):**
- Font: System, 24px, bold
- Color: #111827 (dark gray)
- Line height: 1.2

**Section Headings:**
- Font: System, 16px, semibold
- Color: #374151 (medium gray)
- Margin: 24px top, 12px bottom

**Field Labels:**
- Font: System, 14px, medium
- Color: #6B7280 (gray)
- Icon + label format

**Field Values:**
- Font: System, 16px, regular
- Color: #111827 (dark gray)
- Line height: 1.5

**Links:**
- Font: System, 16px, medium
- Color: #3B82F6 (blue)
- Hover: #2563EB (darker blue) + underline

---

### Spacing

**Panel Padding:** 24px (all sides)
**Section Spacing:** 32px between sections
**Field Spacing:** 16px between fields
**Label to Value:** 4px
**Button Spacing:** 8px between buttons

---

### Colors

**Background:**
- Panel: White (#FFFFFF)
- Overlay: rgba(0, 0, 0, 0.4)

**Borders:**
- Panel left border: 1px solid #E5E7EB
- Section separators: 1px solid #F3F4F6

**Buttons:**
- Primary (Send Email): #3B82F6 bg, white text
- Secondary (Copy): Transparent bg, #6B7280 border, #374151 text
- Destructive (Delete): #DC2626 text, no background

**Status Badges:** Same as list view
- New: #DBEAFE bg, #1E40AF text
- Contacted: #D1FAE5 bg, #065F46 text
- Qualified: #E9D5FF bg, #6B21A8 text
- Converted: #D1FAE5 bg, #065F46 text
- Unqualified: #F3F4F6 bg, #374151 text
- Spam: #FEE2E2 bg, #991B1B text

---

## 🔌 API Integration

### Get Lead Details

**Endpoint:** GET /api/admin/leads/:id

**When Called:**
- When panel is opened from list
- If lead data not already available from list response

**Request:**
```
GET /api/admin/leads/12847
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
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
    "message": "I'm interested in learning more about your digital marketing solutions...",
    "status": "new",
    "referrer_url": "https://www.google.com/search?q=digital+marketing+guide",
    "landing_url": "https://dmat-app.example.com/pages/free-marketing-guide.html",
    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
    "ip_address": "192.168.1.100",
    "created_at": "2025-12-04T14:30:15Z",
    "landing_page": {
      "id": 42,
      "title": "Free Marketing Guide 2025",
      "slug": "free-marketing-guide-2025",
      "published_url": "https://dmat-app.example.com/pages/free-marketing-guide-2025.html"
    }
  }
}
```

**Error Responses:**

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

---

### Update Lead Status

**Endpoint:** PUT /api/admin/leads/:id

**When Called:**
- When user clicks "Update Status" button after selecting new status

**Request:**
```
PUT /api/admin/leads/12847
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "contacted"
}
```

**Response (200 OK):**
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

**Error Responses:**

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

---

## 🎭 Screen States

### State 1: Loading

**Shown when:** Panel is opening and fetching lead data

**Visual:**
```
┌───────────────────────────────────┐
│  Lead Details              [×]    │
├───────────────────────────────────┤
│                                   │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓                  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓              │
│                                   │
│  Contact Information              │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                │
│  ▓▓▓▓▓▓▓▓▓▓                      │
│                                   │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                │
│  ▓▓▓▓▓▓▓▓▓▓                      │
│                                   │
└───────────────────────────────────┘
```

**Behavior:**
- Show skeleton loading bars
- Disable all interactions
- Show loading spinner in header (optional)

---

### State 2: Loaded

**Shown when:** Lead data successfully loaded

**Visual:** Full panel with all sections populated (as shown in layouts above)

**Behavior:**
- All data displayed
- All interactions enabled
- Scrollable if content exceeds panel height

---

### State 3: Error

**Shown when:** Failed to load lead data (404, 500, network error)

**Visual:**
```
┌───────────────────────────────────┐
│  Lead Details              [×]    │
├───────────────────────────────────┤
│                                   │
│            ⚠️                     │
│                                   │
│     Failed to Load Lead           │
│                                   │
│  This lead could not be loaded.   │
│  It may have been deleted.        │
│                                   │
│        [Try Again]                │
│        [Close]                    │
│                                   │
└───────────────────────────────────┘
```

**Behavior:**
- Show error icon and message
- Provide "Try Again" button → Retry API call
- Provide "Close" button → Close panel
- 404 errors: Show "Lead has been deleted" message

---

### State 4: Updating Status

**Shown when:** User clicks "Update Status" button

**Visual:**
```
┌───────────────────────────────────┐
│  Status                           │
├───────────────────────────────────┤
│                                   │
│  Current Status: [New]            │
│                                   │
│  Update Status:                   │
│  [Contacted ▼] (disabled)         │
│                                   │
│  [Updating... 🔄] (loading)       │
│                                   │
└───────────────────────────────────┘
```

**Behavior:**
- Button text changes to "Updating..."
- Show loading spinner on button
- Disable dropdown
- Disable button

---

### State 5: Status Updated (Success)

**Shown when:** Status update API call succeeds

**Visual:**
```
┌───────────────────────────────────┐
│  Status                           │
├───────────────────────────────────┤
│                                   │
│  Current Status: [Contacted] ✓    │
│  Updated just now                 │
│                                   │
│  Update Status:                   │
│  [Contacted ▼]                    │
│                                   │
│  [Update Status] (disabled)       │
│                                   │
│  ✓ Status updated successfully    │
│                                   │
└───────────────────────────────────┘
```

**Behavior:**
- Current status badge updates to new status
- Show success message (green, fades after 3 seconds)
- Show "Updated just now" timestamp
- Re-enable dropdown for future changes
- Update leads list in background (row status badge)

---

## 🧪 User Scenarios

### Scenario 1: View Full Lead Details

**Steps:**
1. User is on leads list screen
2. User clicks on "John Doe" row
3. Side panel slides in from right
4. All lead information displayed
5. User scrolls to see all sections
6. User reviews contact info, landing page, source data

**Expected Result:** User sees all lead details in organized, scannable format

---

### Scenario 2: Send Email to Lead

**Steps:**
1. User opens lead details panel
2. User sees email: john@example.com
3. User clicks "Send Email" button
4. Default email client opens with new message
5. To: john@example.com pre-filled
6. User composes email and sends

**Expected Result:** User can quickly contact lead via email

---

### Scenario 3: Copy Lead Email

**Steps:**
1. User opens lead details panel
2. User clicks "Copy Email" button
3. Button briefly shows "✓ Copied"
4. Email copied to clipboard
5. User pastes email into CRM or other tool

**Expected Result:** User can easily copy email for use elsewhere

---

### Scenario 4: Update Lead Status

**Steps:**
1. User opens lead details for a "New" lead
2. User opens "Update Status" dropdown
3. User selects "Contacted"
4. User clicks "Update Status" button
5. Button shows "Updating..."
6. API call succeeds
7. Current status updates to "Contacted"
8. Success message appears: "✓ Status updated successfully"
9. Badge in leads list also updates to "Contacted"

**Expected Result:** User successfully updates lead status, visible in both panel and list

---

### Scenario 5: View Lead Source

**Steps:**
1. User opens lead details
2. User scrolls to "Source Data" section
3. User sees:
   - Referrer: https://www.google.com/search?q=marketing
   - Source: google.com
4. User clicks "Copy" next to referrer URL
5. Referrer URL copied to clipboard
6. User can analyze where lead came from

**Expected Result:** User understands lead source and can copy data for analysis

---

### Scenario 6: Close Panel

**Steps:**
1. User finishes reviewing lead
2. User clicks [×] close button (or presses Escape)
3. Panel slides out to right
4. URL updates to remove ?view parameter
5. Focus returns to lead row in list
6. User can click another lead to open different details

**Expected Result:** User can easily close panel and return to list

---

## 🔮 Future Enhancements (Phase 2+)

### Lead Timeline
- Show history of status changes
- Show when lead was contacted
- Show notes added by team members
- Show email sent/opened (if email tracking enabled)

### Notes & Comments
- Add internal notes about lead
- Tag team members
- Set reminders for follow-up

### Lead Scoring
- Show calculated lead score
- Show scoring breakdown (factors that contributed to score)
- Ability to manually adjust score

### Custom Fields
- Display all custom form fields (beyond standard fields)
- Support for different field types (date, dropdown, checkbox, etc.)

### Activity Feed
- Show all interactions with this lead
- Email sent/opened
- Page visits (if tracking enabled)
- Form submissions (if submitted multiple forms)

### Quick Edit
- Edit lead information inline
- Update name, email, phone, company, etc.
- Save changes without closing panel

### Related Leads
- Show other leads from same company
- Show other leads from same email domain
- Duplicate detection

### Export Single Lead
- Export this lead as vCard
- Export as JSON
- Share lead via email

### Integrations
- Send to CRM button (Salesforce, HubSpot)
- Add to email list (Mailchimp, SendGrid)
- Create task in PM tool (Asana, Trello)

---

## 📚 Related Documentation

- **Database Schema:** [Phase1-Leads-Schema.md](./Phase1-Leads-Schema.md)
- **Leads List Screen:** [Phase1-Leads-List-Screen-Design.md](./Phase1-Leads-List-Screen-Design.md)
- **Lead Capture API:** [Phase1-Lead-Capture-API.md](./Phase1-Lead-Capture-API.md)
- **Validation Rules:** [Phase1-Validation-Sanitization-Rules.md](./Phase1-Validation-Sanitization-Rules.md)

---

## ✅ Implementation Checklist

### Panel Setup
- [ ] Create side panel component
- [ ] Implement slide-in/out animation (300ms)
- [ ] Add overlay dimming on list
- [ ] Handle open/close behavior
- [ ] Update URL with ?view parameter
- [ ] Handle browser back button (closes panel)

### Panel Structure
- [ ] Create header with name, email, close button
- [ ] Implement 6 sections (Contact, Landing Page, Source, Metadata, Status, Actions)
- [ ] Add section headings with icons
- [ ] Implement scrollable content area

### Contact Information Section
- [ ] Display email with icon (clickable mailto:)
- [ ] Display phone with icon (clickable tel:, or "Not provided")
- [ ] Display name, company, job title
- [ ] Display message (full text, multi-line)
- [ ] Add "Send Email" and "Copy Email" buttons
- [ ] Add "Call" and "Copy Phone" buttons (if phone present)
- [ ] Implement copy-to-clipboard functionality
- [ ] Show "Copied!" feedback

### Landing Page Section
- [ ] Display landing page title
- [ ] Display published URL (selectable text)
- [ ] Add "View Page" link (opens in new tab)
- [ ] Add "Edit Page" link (internal navigation)
- [ ] Handle deleted landing page case (show warning)

### Source Data Section
- [ ] Display full referrer URL
- [ ] Display full landing URL
- [ ] Display extracted source (domain)
- [ ] Add copy buttons for URLs
- [ ] Handle "Direct" visit case (no referrer)

### Metadata Section
- [ ] Display submitted timestamp (absolute + relative)
- [ ] Display IP address with copy button
- [ ] Display full user agent string
- [ ] Add human-readable browser/OS detection (Phase 2)
- [ ] Display lead ID

### Status Management
- [ ] Display current status badge
- [ ] Create status dropdown with all options
- [ ] Detect status change (enable/disable update button)
- [ ] Implement "Update Status" button
- [ ] API call: PUT /api/admin/leads/:id
- [ ] Show loading state during update
- [ ] Show success message on update
- [ ] Show error message on failure
- [ ] Update list row status in background
- [ ] Handle unsaved changes warning

### Quick Actions
- [ ] Add "Send Email" button (primary)
- [ ] Add "Copy Email" button (secondary)
- [ ] Add "Delete Lead" button (Phase 2, with confirmation)

### API Integration
- [ ] GET /api/admin/leads/:id (load lead details)
- [ ] PUT /api/admin/leads/:id (update status)
- [ ] Handle loading state (skeleton)
- [ ] Handle error state (404, 500)
- [ ] Handle success state (display data)

### Open/Close Behavior
- [ ] Open on row click from list
- [ ] Slide in animation
- [ ] URL update (add ?view=:id)
- [ ] Close on [×] button click
- [ ] Close on Escape key
- [ ] Close on outside click (optional)
- [ ] Close on back button
- [ ] Slide out animation
- [ ] URL update (remove ?view)
- [ ] Focus return to list row
- [ ] Unsaved changes warning (if status changed but not saved)

### States
- [ ] Loading state (skeleton)
- [ ] Loaded state (full data)
- [ ] Error state (failed to load)
- [ ] Updating status state (loading button)
- [ ] Status updated state (success message)

### Responsive Design
- [ ] Desktop: Side panel (40% width, max 500px)
- [ ] Tablet: Side panel (50% width)
- [ ] Mobile: Full-screen overlay with back button
- [ ] Adjust button layouts for mobile (full width, stacked)

### Accessibility
- [ ] Proper ARIA labels and roles
- [ ] Keyboard navigation (Tab order)
- [ ] Focus management (on open, on close)
- [ ] Focus trap within panel
- [ ] Escape key closes panel
- [ ] Screen reader announcements
- [ ] Status update announcements (aria-live)
- [ ] WCAG AA color contrast
- [ ] Focus indicators on all interactive elements

### Testing
- [ ] Test open/close behavior
- [ ] Test all links (email, phone, view page, edit page)
- [ ] Test copy buttons with clipboard API
- [ ] Test status update flow (change, save, success, error)
- [ ] Test unsaved changes warning
- [ ] Test URL updates and browser back button
- [ ] Test responsive layouts (desktop, tablet, mobile)
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test error handling (404, 500, network)

---

**Design Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-04
**Maintained by:** DMAT Product & Design Team
