# Phase 1 Landing Page Edit/Create Form - Design Specification

**Version:** 1.0
**Date:** 2025-12-03
**Purpose:** UI/UX design specification for landing page create/edit form in DMAT admin dashboard

---

## 📋 Overview

The landing page form is where DMAT users create new landing pages or edit existing ones. This form should be intuitive, guide users through the essential fields, provide real-time validation, and make it easy to save drafts or publish pages.

**User Goals:**
- Create a landing page quickly
- Edit existing pages easily
- Understand what each field does
- Preview how the page will look
- Save work without publishing
- Publish when ready

**Design Principles:**
- **Progressive Disclosure** - Show essential fields first, advanced options later
- **Immediate Feedback** - Validate as user types, show errors inline
- **Forgiving** - Auto-save drafts, prevent data loss
- **Clear Actions** - Obvious difference between Save Draft and Publish

---

## 🎯 Screen Modes

### Two Modes

**1. Create Mode**
- URL: `/admin/landing-pages/new`
- Page Title: "Create Landing Page"
- All fields empty
- No "Delete" button
- Focus: Title field on load

**2. Edit Mode**
- URL: `/admin/landing-pages/:id/edit`
- Page Title: "Edit Landing Page"
- All fields populated from database
- Show "Delete" button (bottom left)
- Show current status badge

---

## 🏗️ Page Layout

### Structure

```
┌────────────────────────────────────────────────────────────────┐
│  DMAT Header                                                   │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐                                              │
│  │              │                                              │
│  │  Sidebar     │  ┌─────────────────────────────────────┐   │
│  │  Navigation  │  │                                       │   │
│  │              │  │  Page Title & Status                 │   │
│  │              │  │                                       │   │
│  │              │  ├─────────────────────────────────────┤   │
│  │              │  │                                       │   │
│  │              │  │  Form Fields                         │   │
│  │              │  │  (Scrollable content area)           │   │
│  │              │  │                                       │   │
│  │              │  │  - Page Information                  │   │
│  │              │  │  - Content                           │   │
│  │              │  │  - Form Configuration                │   │
│  │              │  │                                       │   │
│  │              │  ├─────────────────────────────────────┤   │
│  │              │  │                                       │   │
│  │              │  │  Actions Bar (Sticky)                │   │
│  │              │  │  [Cancel] [Save Draft] [Publish]     │   │
│  └──────────────┘  └─────────────────────────────────────┘   │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 📝 Form Sections

### Section 1: Page Information

**Fields:**
1. Title (Required)
2. Slug (Required, Auto-generated from title)

---

### Section 2: Content

**Fields:**
3. Headline
4. Subheading
5. Body Text
6. Hero Image URL
7. CTA Text

---

### Section 3: Form Configuration

**Fields:**
8. Form Fields (Checkboxes with basic fields)

---

## 📊 Field Specifications

### Field 1: Title

**Label:** "Page Title" *

**Type:** Text input (single line)

**Required:** Yes

**Max Length:** 500 characters

**Placeholder:** "e.g., Free Marketing Guide 2025"

**Help Text:** "Internal name for this landing page. Shown in browser tab and search results."

**Validation:**
- Required: "Title is required"
- Max length: "Title must be 500 characters or less"
- Trim whitespace

**Visual:**
```
┌────────────────────────────────────────────────────┐
│ Page Title *                                       │
├────────────────────────────────────────────────────┤
│ Free Marketing Guide 2025                          │
└────────────────────────────────────────────────────┘
  Internal name for this landing page.
```

**Behavior:**
- Auto-generate slug as user types (in Edit mode, only if slug hasn't been manually edited)
- Show character count: "45 / 500" (when focused or > 400 chars)

---

### Field 2: Slug

**Label:** "URL Slug" *

**Type:** Text input (single line)

**Required:** Yes

**Max Length:** 255 characters

**Placeholder:** "free-marketing-guide-2025"

**Help Text:** "URL-friendly identifier (lowercase, hyphens only). This will be part of your page URL."

**Auto-Generated:** Yes (from Title, until manually edited)

**Validation:**
- Required: "Slug is required"
- Format: Must match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
  - Error: "Slug must contain only lowercase letters, numbers, and hyphens"
- Unique: Check against existing pages
  - Error: "This slug is already in use. Please choose another."
- No leading/trailing hyphens
  - Error: "Slug cannot start or end with a hyphen"
- Max length: "Slug must be 255 characters or less"

**Visual:**
```
┌────────────────────────────────────────────────────┐
│ URL Slug *                                         │
├────────────────────────────────────────────────────┤
│ free-marketing-guide-2025                          │
└────────────────────────────────────────────────────┘
  Your page will be at: https://dmat-app.example.com/pages/
  free-marketing-guide-2025.html

  ⓘ Auto-generated from title. Edit to customize.
```

**Auto-Generation Logic:**
```javascript
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-')           // Collapse multiple hyphens
    .substring(0, 255);             // Truncate to max length
}
```

**Behavior:**
- Auto-generate on title change (until user manually edits slug)
- Once manually edited, stop auto-generation
- Show "Reset to Auto" button if manually edited
- Real-time validation (check uniqueness with debounce)
- Show checkmark ✓ when valid and unique

---

### Field 3: Headline

**Label:** "Headline"

**Type:** Text input (single line)

**Required:** No (Recommended)

**Max Length:** 500 characters

**Placeholder:** "e.g., Download Your Free Digital Marketing Guide"

**Help Text:** "Main heading visitors will see (H1). Use title as fallback if empty."

**Validation:**
- Max length: "Headline must be 500 characters or less"

**Visual:**
```
┌────────────────────────────────────────────────────┐
│ Headline                                           │
├────────────────────────────────────────────────────┤
│ Download Your Free Digital Marketing Guide         │
└────────────────────────────────────────────────────┘
  Main heading visitors will see.
```

**Warning (if empty):**
```
⚠️ Recommended: Add a headline for better visitor engagement.
If left empty, your Page Title will be used.
```

---

### Field 4: Subheading

**Label:** "Subheading"

**Type:** Text input (single line)

**Required:** No (Recommended)

**Max Length:** 1000 characters

**Placeholder:** "e.g., Learn the latest strategies that drive results in 2025"

**Help Text:** "Supporting text below the headline (H2). Also used in social media sharing."

**Validation:**
- Max length: "Subheading must be 1000 characters or less"

**Visual:**
```
┌────────────────────────────────────────────────────┐
│ Subheading                                         │
├────────────────────────────────────────────────────┤
│ Learn the latest strategies that drive results     │
│ in 2025                                            │
└────────────────────────────────────────────────────┘
  Supporting text below the headline.
```

---

### Field 5: Body Text

**Label:** "Body Content"

**Type:** Textarea (multi-line)

**Required:** No (Recommended)

**Max Length:** None (practical limit: 10,000 chars)

**Rows:** 8 (auto-expand)

**Placeholder:**
```
Tell visitors about your offer...

Our comprehensive 50-page guide covers:
- SEO strategies
- Social media marketing
- Content marketing
- And more...
```

**Help Text:** "Main content of your landing page. Use double line breaks for paragraphs."

**Validation:**
- None (optional field)

**Visual:**
```
┌────────────────────────────────────────────────────┐
│ Body Content                                       │
├────────────────────────────────────────────────────┤
│ Our comprehensive 50-page guide covers SEO,        │
│ social media, content marketing, and more.         │
│                                                    │
│ Download now and transform your marketing          │
│ strategy!                                          │
│                                                    │
│                                                    │
│                                                    │
└────────────────────────────────────────────────────┘
  Main content of your landing page.
```

**Features:**
- Auto-resize as user types
- Preserve line breaks
- Show character count when > 5000 chars
- Format preview (Phase 2: show how paragraphs will render)

---

### Field 6: Hero Image URL

**Label:** "Hero Image URL"

**Type:** Text input (URL)

**Required:** No

**Max Length:** 2048 characters

**Placeholder:** "https://example.com/images/hero.jpg"

**Help Text:** "URL to your banner/hero image. Recommended size: 1200×630px."

**Validation:**
- URL format: Must start with `http://` or `https://`
  - Error: "Please enter a valid URL (must start with http:// or https://)"
- Max length: "URL must be 2048 characters or less"

**Visual:**
```
┌────────────────────────────────────────────────────┐
│ Hero Image URL                                     │
├────────────────────────────────────────────────────┤
│ https://example.com/images/marketing-hero.jpg      │
└────────────────────────────────────────────────────┘
  URL to your banner/hero image.

  ┌──────────────────────────┐
  │                          │  ← Image preview
  │   [Preview thumbnail]    │    (if URL is valid)
  │                          │
  └──────────────────────────┘
```

**Features:**
- Image preview (load and show thumbnail if URL is valid image)
- Show loading state while checking URL
- Show error if URL doesn't load
- File upload (Phase 2)

---

### Field 7: CTA Text

**Label:** "Call-to-Action Button Text"

**Type:** Text input (single line)

**Required:** No

**Max Length:** 100 characters

**Default:** "Submit"

**Placeholder:** "e.g., Get Your Free Guide"

**Help Text:** "Text on the form submit button. Default: 'Submit'"

**Validation:**
- Max length: "CTA text must be 100 characters or less"

**Visual:**
```
┌────────────────────────────────────────────────────┐
│ Call-to-Action Button Text                        │
├────────────────────────────────────────────────────┤
│ Get Your Free Guide                                │
└────────────────────────────────────────────────────┘
  Text on the form submit button.

  Preview: [Get Your Free Guide]  ← Button preview
```

**Features:**
- Live preview of button below field
- Show default if empty: "Submit"

---

### Field 8: Form Fields

**Label:** "Lead Capture Form Fields"

**Type:** Checkbox group

**Required:** At least one must be "Email" (always checked)

**Help Text:** "Select which fields to include in your lead capture form. Email is required."

**Visual:**
```
┌────────────────────────────────────────────────────┐
│ Lead Capture Form Fields                          │
├────────────────────────────────────────────────────┤
│                                                    │
│  ☑ Name                    (Text field)           │
│  ☑ Email *                 (Email field)          │
│  ☐ Phone                   (Phone field)          │
│  ☐ Company                 (Text field)           │
│  ☐ Job Title               (Text field)           │
│  ☐ Message                 (Text area)            │
│                                                    │
│  Advanced Options ▼  (collapsed by default)       │
│                                                    │
└────────────────────────────────────────────────────┘
  Email is always required for lead capture.
```

**Default Selection (New Page):**
- ✅ Name (checked)
- ✅ Email (checked, disabled - always required)
- ❌ Phone (unchecked)
- ❌ Company (unchecked)
- ❌ Job Title (unchecked)
- ❌ Message (unchecked)

**Field Options:**

| Field | Type | Always Included? | Can Uncheck? |
|-------|------|------------------|--------------|
| Name | Text | No | Yes |
| Email | Email | Yes | No (always required) |
| Phone | Tel | No | Yes |
| Company | Text | No | Yes |
| Job Title | Text | No | Yes |
| Message | Textarea | No | Yes |

**Behavior:**
- Email checkbox is checked and disabled (can't uncheck)
- Hover on Email: "Email field is required for lead capture"
- At least one email field must exist (enforced)

**Advanced Options (Phase 2):**
- Collapsed by default
- Click to expand
- Options:
  - Mark fields as required/optional
  - Customize field labels
  - Customize placeholders
  - Add custom fields

---

## 🎨 Visual Organization

### Form Layout

**Two-Column Layout (Desktop):**

```
┌─────────────────────────────────────────────────────────────┐
│  Create Landing Page                        [Draft] badge   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SECTION: Page Information                          │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                     │   │
│  │  Page Title *                                       │   │
│  │  [____________________________]                     │   │
│  │                                                     │   │
│  │  URL Slug *                                         │   │
│  │  [____________________________]                     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SECTION: Content                                   │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                     │   │
│  │  Headline                                           │   │
│  │  [____________________________]                     │   │
│  │                                                     │   │
│  │  Subheading                                         │   │
│  │  [____________________________]                     │   │
│  │                                                     │   │
│  │  Body Content                                       │   │
│  │  [                            ]                     │   │
│  │  [                            ]                     │   │
│  │  [                            ]                     │   │
│  │                                                     │   │
│  │  Hero Image URL                                     │   │
│  │  [____________________________]                     │   │
│  │                                                     │   │
│  │  CTA Button Text                                    │   │
│  │  [____________________________]                     │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  SECTION: Form Configuration                        │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │                                                     │   │
│  │  Lead Capture Form Fields                           │   │
│  │  ☑ Name     ☑ Email *    ☐ Phone                   │   │
│  │  ☐ Company  ☐ Job Title  ☐ Message                 │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ACTIONS (Sticky bottom)                            │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  [Delete]              [Cancel] [Save Draft] [Publish]│   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔘 Action Buttons

### Button Specifications

**Location:** Sticky bottom bar (always visible)

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│  [Delete]              [Cancel] [Save Draft] [Publish]     │
└─────────────────────────────────────────────────────────────┘
   Left aligned          Right aligned →
```

---

### Button 1: Delete

**Label:** "Delete"

**Style:** Text link (red/destructive color)

**Position:** Bottom left

**Visibility:** Edit mode only (not shown in create mode)

**Behavior:**
- Click → Show confirmation modal
- Modal: "Delete Landing Page?"
  - "This action cannot be undone. All data will be permanently deleted."
  - [Cancel] [Delete Forever]
- On confirm → DELETE request → Navigate to list page
- Show error if delete fails (page is published)

**States:**
- Default: Red text link
- Hover: Underlined
- Disabled: Grayed out (if page is publishing)

---

### Button 2: Cancel

**Label:** "Cancel"

**Style:** Secondary button (outline or ghost)

**Position:** Bottom right (before Save Draft)

**Behavior:**
- Click → Navigate back to list page
- If form has unsaved changes → Show confirmation modal
  - "You have unsaved changes. Discard them?"
  - [Keep Editing] [Discard Changes]
- If no changes → Navigate immediately

**States:**
- Default: Gray outline
- Hover: Gray background
- Focus: Blue outline

---

### Button 3: Save Draft

**Label:** "Save Draft"

**Style:** Secondary button (filled, gray)

**Position:** Bottom right (before Publish)

**Behavior:**
- Click → Validate required fields only (Title, Slug)
- If valid → POST/PUT to API
- Set `publish_status = 'draft'`
- Show success message: "Draft saved successfully"
- Stay on edit page (don't navigate away)
- If validation fails → Show inline errors, don't save

**States:**
- Default: Gray button
- Hover: Darker gray
- Loading: "Saving..." with spinner
- Success: Brief checkmark, then back to normal
- Disabled: Grayed out (while publishing)

**Keyboard Shortcut:** `Cmd/Ctrl + S`

---

### Button 4: Publish

**Label:** "Publish" (if never published) or "Update & Republish" (if already published)

**Style:** Primary button (filled, blue/brand color)

**Position:** Bottom right (rightmost button)

**Behavior:**
- Click → Validate ALL fields (required + recommended)
- If missing recommended fields → Show warning modal
  - "Some recommended fields are missing:"
  - • Headline
  - • Body Text
  - "Publish anyway?" [Go Back] [Publish Anyway]
- If valid → POST to `/api/admin/landing-pages/:id/publish`
- Show publishing state: Button shows "Publishing..." with spinner
- On success:
  - Update status badge to "Published"
  - Show success message: "Landing page published successfully!"
  - Show published URL with "View Page" link
  - Stay on edit page
- On failure:
  - Show error message (inline or modal)
  - Revert button state

**States:**
- Default: Blue button "Publish"
- Hover: Darker blue
- Loading: "Publishing..." with spinner (button disabled)
- Success: Brief checkmark "Published!", then changes to "Update & Republish"
- Disabled: Grayed out (if already publishing or form invalid)

---

## ✅ Validation

### Validation Timing

**Real-time Validation:**
- Slug format: As user types (debounced)
- Slug uniqueness: On blur or after typing stops (debounced 500ms)
- Max lengths: Show character count approaching limit
- URL format: On blur

**On Save/Publish:**
- All required fields
- All format validations
- Recommended field warnings (publish only)

---

### Validation States

**Field States:**

**1. Default (Untouched)**
```
┌────────────────────────────────────┐
│ Page Title *                       │
├────────────────────────────────────┤
│                                    │
└────────────────────────────────────┘
```

**2. Valid (After Input)**
```
┌────────────────────────────────────┐
│ Page Title *                    ✓  │
├────────────────────────────────────┤
│ Free Marketing Guide 2025          │
└────────────────────────────────────┘
```

**3. Invalid (Error)**
```
┌────────────────────────────────────┐
│ Page Title *                    ✗  │
├────────────────────────────────────┤
│                                    │  ← Red border
└────────────────────────────────────┘
❌ Title is required
```

**4. Warning (Recommended but empty)**
```
┌────────────────────────────────────┐
│ Headline                           │
├────────────────────────────────────┤
│                                    │
└────────────────────────────────────┘
⚠️ Recommended: Add a headline for better engagement
```

---

### Error Messages

**Format:**
- Inline below field (red text with icon)
- Specific and actionable
- User-friendly language

**Examples:**

✅ **Good Error Messages:**
- "Title is required"
- "Slug must contain only lowercase letters, numbers, and hyphens"
- "This slug is already in use. Please choose another."
- "Please enter a valid URL (must start with http:// or https://)"

❌ **Bad Error Messages:**
- "Invalid input"
- "Error"
- "This field is wrong"

---

### Warning Messages

**Warnings (not errors):**
- Missing recommended fields (headline, body text, etc.)
- Long content (>5000 characters)
- No hero image

**Format:**
- Yellow/orange color
- Icon: ⚠️
- Less prominent than errors
- Don't block saving

---

## 💾 Auto-Save

### Auto-Save Behavior

**When:**
- Every 30 seconds (if changes exist)
- After user stops typing for 5 seconds (debounced)
- Before navigating away (if possible)

**What Gets Saved:**
- Draft status only (not published)
- All fields (including empty ones)

**Visual Feedback:**
```
Last saved: 2 minutes ago    (gray text, top of form)
Saving...                     (while saving)
Saved                         (briefly after save)
```

**Error Handling:**
- If auto-save fails: Show non-intrusive notification
- "Auto-save failed. Your changes may not be saved."
- Don't interrupt user's work

---

## 🎭 Form States

### State 1: Empty (Create Mode)

**Shown when:** Creating new landing page

**Visual:**
- All fields empty
- Placeholder text visible
- No validation errors
- Status badge: None or "New"
- Buttons: [Cancel] [Save Draft] [Publish]

---

### State 2: Loading (Fetching Data)

**Shown when:** Loading existing page in edit mode

**Visual:**
- Skeleton loading (gray bars in field positions)
- Buttons disabled
- Loading indicator

```
┌────────────────────────────────────┐
│ Page Title *                       │
├────────────────────────────────────┤
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                │  ← Loading bar
└────────────────────────────────────┘
```

---

### State 3: Editing (Has Changes)

**Shown when:** User has made changes

**Visual:**
- Unsaved indicator: "• Unsaved changes" (top of form)
- Auto-save indicator: "Last saved: 2 minutes ago"
- [Cancel] shows confirmation if clicked
- Exit warning if user tries to navigate away

---

### State 4: Saving Draft

**Shown when:** Save Draft clicked or auto-save in progress

**Visual:**
- "Save Draft" button shows "Saving..." with spinner
- All inputs disabled during save
- Brief success message after save

---

### State 5: Publishing

**Shown when:** Publish button clicked

**Visual:**
- "Publish" button shows "Publishing..." with spinner
- All inputs disabled
- Progress indicator (optional)
- Can take a few seconds

---

### State 6: Published

**Shown when:** Page successfully published

**Visual:**
- Status badge changes to "Published" (green)
- Success message: "Landing page published successfully!"
- Published URL shown with "View Page" link
- "Publish" button changes to "Update & Republish"

---

### State 7: Publish Failed

**Shown when:** Publish operation fails

**Visual:**
- Error message (modal or inline)
- Details of what went wrong
- "Retry" button or "Edit & Try Again"
- Form remains in previous state (draft or published)

---

### State 8: Validation Errors

**Shown when:** Form submitted with invalid data

**Visual:**
- Scroll to first error field
- Highlight all error fields with red borders
- Show inline error messages
- Summary message at top: "Please fix 2 errors before saving"

---

## 📱 Responsive Design

### Desktop (> 1024px)

- Two-column layout for wide fields
- Full form visible without much scrolling
- Sticky action buttons at bottom

### Tablet (768px - 1024px)

- Single column layout
- Slightly narrower form
- Same sticky buttons

### Mobile (< 768px)

- Single column, full width fields
- Stack all inputs vertically
- Action buttons full width, stacked:
  ```
  [Save Draft]
  [Publish]
  [Cancel]
  [Delete]  (if edit mode)
  ```
- Sections collapsible to save space

---

## ♿ Accessibility

### Keyboard Navigation

**Tab Order:**
1. Title field
2. Slug field
3. Headline field
4. Subheading field
5. Body text field
6. Hero image URL field
7. CTA text field
8. Form field checkboxes (Name, Email, etc.)
9. Cancel button
10. Save Draft button
11. Publish button

**Keyboard Shortcuts:**
- `Cmd/Ctrl + S` - Save Draft
- `Cmd/Ctrl + Enter` - Publish (with confirmation)
- `Esc` - Close modals

---

### Screen Reader Support

**Field Labels:**
```html
<label for="title">
  Page Title
  <span class="required" aria-label="required">*</span>
</label>
<input id="title" aria-required="true" aria-describedby="title-help">
<p id="title-help" class="help-text">Internal name for this landing page.</p>
```

**Error Announcements:**
```html
<input aria-invalid="true" aria-describedby="title-error">
<p id="title-error" role="alert">Title is required</p>
```

**Status Badge:**
```html
<span class="badge" role="status" aria-label="Status: Published">
  Published
</span>
```

---

### Focus Management

**Auto-Focus:**
- On page load: Title field (create mode)
- On validation error: First error field

**Focus Indicators:**
- Blue outline on all interactive elements
- High contrast (WCAG AA)
- Visible on keyboard focus (not click)

---

## 🎨 Visual Design

### Typography

**Field Labels:**
- Font: System font, 14px, semibold
- Color: Dark gray (#374151)
- Required indicator: Red asterisk (*)

**Field Values:**
- Font: System font, 16px, regular
- Color: Black (#111827)
- Line height: 1.5

**Help Text:**
- Font: System font, 13px, regular
- Color: Gray (#6B7280)
- Italic: No

**Error Text:**
- Font: System font, 13px, medium
- Color: Red (#DC2626)
- Icon: ❌ or ⚠️

---

### Spacing

**Between Sections:** 32px
**Between Fields:** 20px
**Field Label to Input:** 8px
**Input to Help Text:** 4px

---

### Colors

**Field Borders:**
- Default: #D1D5DB (light gray)
- Focus: #3B82F6 (blue)
- Error: #DC2626 (red)
- Success: #10B981 (green)

**Button Colors:**
- Primary (Publish): #3B82F6 (blue)
- Secondary (Save Draft): #6B7280 (gray)
- Cancel: Transparent with border
- Delete: #DC2626 (red text)

---

## 🧪 User Scenarios

### Scenario 1: Create First Landing Page

**Steps:**
1. Click "+ New Landing Page" from list
2. See empty form
3. Fill in Title: "Free Marketing Guide"
4. See slug auto-generated: "free-marketing-guide"
5. Fill in Headline, Subheading, Body
6. Select form fields: Name ✓, Email ✓ (auto), Phone ✓
7. Click "Save Draft"
8. See success: "Draft saved"
9. Click "Publish"
10. See publishing: "Publishing..."
11. See success: "Published!" + View link

---

### Scenario 2: Edit Published Page

**Steps:**
1. Click "Edit" on published page from list
2. See form populated with current values
3. See status badge: "Published"
4. Update headline text
5. See "Unsaved changes" indicator
6. Click "Save Draft"
7. See "Saved" confirmation
8. Click "Update & Republish"
9. See confirmation: "Landing page updated and republished"

---

### Scenario 3: Fix Validation Errors

**Steps:**
1. Fill in Headline but forget Title
2. Click "Save Draft"
3. See error: "Title is required"
4. Scroll to Title field (auto-scroll)
5. See red border on Title field
6. Fill in Title
7. See checkmark ✓
8. Click "Save Draft" again
9. Success

---

### Scenario 4: Publish with Warnings

**Steps:**
1. Create page with only Title and Slug
2. Click "Publish"
3. See warning modal:
   "Some recommended fields are missing:
   • Headline
   • Body Text
   • Hero Image"
4. Choose: [Go Back] or [Publish Anyway]
5. If "Publish Anyway" → Publishes with warnings

---

## 🔮 Future Enhancements (Phase 2+)

### Rich Text Editor

- WYSIWYG editor for Body Text
- Formatting: Bold, italic, lists, links
- Insert images, videos
- HTML preview mode

### Live Preview

- Split screen: Form on left, preview on right
- See changes in real-time
- Mobile preview mode
- Switch between desktop/tablet/mobile views

### Media Library

- Upload images directly
- Browse uploaded images
- Image editor (crop, resize)
- Stock image integration

### Advanced Form Builder

- Drag-and-drop field ordering
- Custom field types
- Conditional logic (show field if...)
- Multi-step forms

### Templates

- Start from template
- Save as template
- Template library

### SEO Tools

- Meta description editor
- Preview in search results
- SEO score/recommendations
- Open Graph preview

---

## 📚 Related Documentation

- [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md) - API endpoints
- [Phase1-LandingPage-Schema.md](./Phase1-LandingPage-Schema.md) - Field definitions
- [Phase1-Validation-Sanitization-Rules.md](./Phase1-Validation-Sanitization-Rules.md) - Validation rules
- [Phase1-Landing-Page-Content-Structure.md](./Phase1-Landing-Page-Content-Structure.md) - Output format

---

## ✅ Implementation Checklist

### Form Setup
- [ ] Create form component (create/edit modes)
- [ ] Fetch landing page data (edit mode)
- [ ] Initialize form state (React state or form library)
- [ ] Handle route parameters (ID for edit mode)

### Field Components
- [ ] Title input with character count
- [ ] Slug input with auto-generation
- [ ] Headline input
- [ ] Subheading input
- [ ] Body text textarea (auto-resize)
- [ ] Hero image URL with preview
- [ ] CTA text input with button preview
- [ ] Form fields checkbox group

### Validation
- [ ] Required field validation
- [ ] Slug format validation
- [ ] Slug uniqueness check (API call, debounced)
- [ ] URL format validation
- [ ] Max length validation
- [ ] Inline error display
- [ ] Error summary

### Actions
- [ ] Cancel button with unsaved changes warning
- [ ] Save Draft functionality
- [ ] Publish functionality
- [ ] Delete functionality (edit mode only)
- [ ] Auto-save (debounced)
- [ ] Keyboard shortcuts

### State Management
- [ ] Loading state (fetching data)
- [ ] Saving state (draft save)
- [ ] Publishing state
- [ ] Success state
- [ ] Error state
- [ ] Unsaved changes tracking

### Accessibility
- [ ] Proper labels with aria-describedby
- [ ] Required indicators (visual + aria-required)
- [ ] Error announcements (role="alert")
- [ ] Focus management
- [ ] Keyboard navigation
- [ ] Skip links

### Responsive Design
- [ ] Desktop layout
- [ ] Tablet layout
- [ ] Mobile layout (stacked buttons)
- [ ] Touch-friendly inputs (min height 44px)

---

**Design Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-03
**Maintained by:** DMAT Product & Design Team
