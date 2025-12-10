# Phase 1 Landing Page Lifecycle

**Version:** 1.0
**Date:** 2025-12-03
**Purpose:** Define states, transitions, and business rules for landing page lifecycle

---

## 📋 Overview

This document defines the complete lifecycle of a landing page in DMAT Phase 1, including all possible states, allowed transitions, validation rules, and business logic.

---

## 🎯 Design Goals

1. **Simple for Phase 1** - Focus on essential workflow (Draft → Published)
2. **Future-Ready** - Define states for Phase 2+ without implementing them
3. **Clear Rules** - Explicit validation for each state transition
4. **Audit Trail** - Track when and who performed each transition
5. **User-Friendly** - Intuitive state names and transitions

---

## 📊 Landing Page States

### Phase 1 States (Implemented)

#### 1. Draft
**Status Code:** `draft`
**Description:** Page is being created or edited, not publicly accessible

**Characteristics:**
- Default state for new pages
- Content can be freely edited
- Not accessible to public visitors
- No published URL assigned
- Can have incomplete/invalid content
- `published_at` is NULL
- `published_url` is NULL

**Who Can Access:**
- Admins (full access)
- Editors (full access)
- Viewers (read-only)

---

#### 2. Published
**Status Code:** `published`
**Description:** Page is live and publicly accessible

**Characteristics:**
- Page is accessible via public URL
- Content should be complete and validated
- `published_at` is set (timestamp of first publish)
- `published_url` is set (WordPress URL or DMAT URL)
- Can still be edited (updates go live immediately)
- Appears in public page listings

**Who Can Access:**
- Public (anyone with URL)
- Admins (full access)
- Editors (full access)
- Viewers (read-only in DMAT)

---

### Phase 2+ States (Defined but Not Implemented)

#### 3. Unpublished
**Status Code:** `unpublished`
**Description:** Page was published but has been taken down

**Characteristics:**
- Previously had `published` status
- No longer publicly accessible
- Retains `published_at` timestamp (historical record)
- `published_url` retained or cleared (TBD in Phase 2)
- Can be re-published or archived

**Future Use Cases:**
- Seasonal campaigns (unpublish after campaign ends)
- Content updates requiring review
- Temporary takedowns for compliance

**Phase 1 Status:** NOT IMPLEMENTED (will use `draft` instead)

---

#### 4. Scheduled
**Status Code:** `scheduled`
**Description:** Page set to auto-publish at a future date/time

**Characteristics:**
- Has scheduled publish timestamp
- Not yet publicly accessible
- Content should be complete and validated
- Auto-transitions to `published` at scheduled time

**Future Use Cases:**
- Product launch pages
- Time-sensitive promotions
- Coordinated multi-channel campaigns

**Phase 1 Status:** NOT IMPLEMENTED

---

#### 5. Archived
**Status Code:** `archived`
**Description:** Page is no longer active but retained for historical purposes

**Characteristics:**
- Not publicly accessible
- Cannot be easily re-published (requires admin action)
- Content is read-only
- Leads associated with page are preserved
- Retained for reporting and analytics

**Future Use Cases:**
- Old campaigns (keep for historical data)
- Compliance/audit trail
- Reference for future campaigns

**Phase 1 Status:** DEFINED but minimal implementation

---

## 🔄 State Transition Diagram

### Phase 1 Simplified Workflow

```
┌─────────────┐
│   CREATE    │
│  New Page   │
└──────┬──────┘
       │
       ↓
┌─────────────┐      Publish       ┌─────────────┐
│             │─────────────────────→              │
│    DRAFT    │                     │  PUBLISHED  │
│             │←─────────────────────              │
└─────────────┘   Unpublish (TBD)  └─────────────┘
       │                                    │
       │                                    │
       │ Archive (Phase 2)         Archive (Phase 2)
       ↓                                    ↓
┌─────────────┐                    ┌─────────────┐
│             │                    │             │
│  ARCHIVED   │                    │  ARCHIVED   │
│             │                    │             │
└─────────────┘                    └─────────────┘
```

### Phase 2+ Full Workflow (Future)

```
┌─────────────┐
│   CREATE    │
└──────┬──────┘
       │
       ↓
┌─────────────┐    Publish    ┌─────────────┐   Unpublish  ┌──────────────┐
│             │──────────────→ │             │─────────────→ │              │
│    DRAFT    │                │  PUBLISHED  │              │ UNPUBLISHED  │
│             │←──────────────│             │←─────────────│              │
└─────────────┘   Edit/Update └─────────────┘   Edit      └──────────────┘
       │                  │                            │
       │ Schedule         │ Archive                    │ Archive
       ↓                  ↓                            ↓
┌─────────────┐      ┌─────────────┐            ┌─────────────┐
│             │      │             │            │             │
│  SCHEDULED  │      │  ARCHIVED   │            │  ARCHIVED   │
│             │      │             │            │             │
└──────┬──────┘      └─────────────┘            └─────────────┘
       │
       │ (Auto at scheduled time)
       ↓
┌─────────────┐
│  PUBLISHED  │
└─────────────┘
```

---

## ✅ State Transitions (Phase 1)

### 1. CREATE → Draft
**Action:** Create new landing page
**Trigger:** User clicks "Create Landing Page" and saves

**Validation:**
- ✅ Title is required (max 500 chars)
- ✅ Slug is required, unique, and valid format (lowercase-with-dashes)
- ✅ User must be authenticated (admin or editor)
- ✅ Created_by is set to current user

**Side Effects:**
- Set `publish_status = 'draft'`
- Set `created_at = CURRENT_TIMESTAMP`
- Set `updated_at = CURRENT_TIMESTAMP`
- Set `published_at = NULL`
- Set `published_url = NULL`

**Who Can Perform:** Admin, Editor

---

### 2. Draft → Published
**Action:** Publish landing page (make it public)
**Trigger:** User clicks "Publish" button

**Validation:**
- ✅ Title must be present
- ✅ Slug must be unique
- ✅ Headline should be present (recommended, not required)
- ✅ Body text should be present (recommended, not required)
- ✅ Form fields must be valid JSON and contain at least one field
- ✅ At least one form field must be of type "email" (for lead capture)
- ✅ User must have publish permission (admin or editor)

**Side Effects:**
- Set `publish_status = 'published'`
- Set `published_at = CURRENT_TIMESTAMP` (if first publish, otherwise keep original)
- Set `published_url = [WordPress URL or DMAT URL]`
- Set `updated_at = CURRENT_TIMESTAMP`
- **Publish to WordPress** (if configured)
- **Or** Generate public DMAT URL (if WordPress not configured)

**Who Can Perform:** Admin, Editor

**Business Rules:**
- First publish sets `published_at` (immutable timestamp)
- Re-publish (after unpublish) keeps original `published_at`
- Publishing sends page to WordPress REST API (Phase 1 implementation pending)

---

### 3. Published → Draft (Unpublish)
**Action:** Take down published page
**Trigger:** User clicks "Unpublish" button

**Phase 1 Status:** ⚠️ SIMPLIFIED - Returns to `draft` state (no separate `unpublished` state)

**Validation:**
- ✅ Page must be in `published` state
- ✅ User must have publish permission (admin or editor)
- ⚠️ Confirm action (data may be lost if WordPress page is deleted)

**Side Effects:**
- Set `publish_status = 'draft'`
- Set `updated_at = CURRENT_TIMESTAMP`
- **Optional:** Clear `published_url` (or keep for reference)
- **Keep:** `published_at` timestamp (historical record)
- **WordPress:** Page remains in WordPress (manual deletion required)

**Who Can Perform:** Admin, Editor

**Business Rules:**
- Page no longer accessible via public URL (DMAT-hosted)
- WordPress page remains (Phase 1 does not auto-delete)
- Can be re-published at any time

**Phase 2 Enhancement:** Use `unpublished` state instead of `draft`

---

### 4. Draft → Archived (Phase 2)
**Action:** Archive old/unused draft page
**Trigger:** User clicks "Archive" button

**Phase 1 Status:** ❌ NOT IMPLEMENTED

**Future Validation:**
- Page must be in `draft` state
- User must be admin
- Confirm action (archived pages are read-only)

**Future Side Effects:**
- Set `status = 'archived'` (using legacy status field)
- Set `updated_at = CURRENT_TIMESTAMP`
- Page becomes read-only

---

### 5. Published → Archived (Phase 2)
**Action:** Archive old campaign after it ends
**Trigger:** User clicks "Archive" button

**Phase 1 Status:** ❌ NOT IMPLEMENTED

**Future Validation:**
- Page must be in `published` or `unpublished` state
- User must be admin
- Confirm action (cannot undo)

**Future Side Effects:**
- Set `status = 'archived'`
- Set `updated_at = CURRENT_TIMESTAMP`
- Remove from public access
- Page becomes read-only
- Leads remain accessible

---

## 📋 Validation Rules by State

### Draft State Requirements
**Minimum Required:**
- ✅ Title (VARCHAR 500)
- ✅ Slug (VARCHAR 255, unique, lowercase-with-dashes)

**Optional (can be added later):**
- Headline
- Subheading
- Body text
- CTA text
- Hero image URL
- Form fields (has default value)

**Business Logic:**
- Can save incomplete pages
- Can save without validation errors
- Auto-saves allowed

---

### Published State Requirements
**Required Before Publishing:**
- ✅ Title (must be present)
- ✅ Slug (must be unique)
- ✅ Form fields (must have valid JSON)
- ✅ At least one email field in form (for lead capture)

**Recommended (warnings if missing):**
- ⚠️ Headline (improves user experience)
- ⚠️ Body text (explains offer)
- ⚠️ CTA text (clear call-to-action)

**Optional:**
- Subheading
- Hero image URL

**Business Logic:**
- Validate before allowing publish
- Show warnings for missing recommended fields
- Block publish if required fields missing
- Allow publish with warnings if only recommended fields missing

---

## 🔐 Permissions & Access Control

### State-Based Permissions

| State | Admin | Editor | Viewer | Public |
|-------|-------|--------|--------|--------|
| **Draft** | Edit, Publish, Delete | Edit, Publish, Delete | View only | No access |
| **Published** | Edit, Unpublish, Delete | Edit, Unpublish, Delete | View only | View only (public URL) |
| **Unpublished** | Edit, Publish, Archive | Edit, Publish | View only | No access |
| **Archived** | View, Restore | View only | View only | No access |

### Action Permissions

| Action | Admin | Editor | Viewer |
|--------|-------|--------|--------|
| Create page | ✅ | ✅ | ❌ |
| Edit draft | ✅ | ✅ | ❌ |
| Publish page | ✅ | ✅ | ❌ |
| Unpublish page | ✅ | ✅ | ❌ |
| Delete page | ✅ | ✅ | ❌ |
| Archive page | ✅ | ❌ | ❌ |
| Restore archived | ✅ | ❌ | ❌ |

---

## 📝 Database Fields & State Mapping

### Relevant Database Fields

```sql
landing_pages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,

  -- Phase 1 fields
  headline VARCHAR(500),
  subheading VARCHAR(1000),
  body_text TEXT,
  cta_text VARCHAR(100) DEFAULT 'Submit',
  hero_image_url VARCHAR(2048),
  form_fields JSONB NOT NULL DEFAULT [...],

  -- Publishing state (Phase 1)
  publish_status VARCHAR(50) NOT NULL DEFAULT 'draft',
  published_url VARCHAR(2048),
  published_at TIMESTAMP,

  -- Legacy state (keep for Phase 2)
  status VARCHAR(50) NOT NULL DEFAULT 'draft',

  -- Audit
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
)
```

### Field Updates by Transition

**Draft → Published:**
```sql
UPDATE landing_pages SET
  publish_status = 'published',
  published_at = COALESCE(published_at, CURRENT_TIMESTAMP), -- Set only if NULL
  published_url = 'https://example.com/lp/slug-here',
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?;
```

**Published → Draft (Unpublish):**
```sql
UPDATE landing_pages SET
  publish_status = 'draft',
  -- published_at remains unchanged (historical record)
  -- published_url remains unchanged (reference)
  updated_at = CURRENT_TIMESTAMP
WHERE id = ?;
```

---

## 🎨 UI/UX Guidelines

### Status Badge Display

**Draft:**
- Color: Gray
- Icon: ✏️ (pencil)
- Text: "Draft"

**Published:**
- Color: Green
- Icon: ✅ (check)
- Text: "Published"

**Unpublished (Phase 2):**
- Color: Orange
- Icon: 🔒 (lock)
- Text: "Unpublished"

**Archived (Phase 2):**
- Color: Blue
- Icon: 📦 (box)
- Text: "Archived"

### Action Buttons by State

**When viewing Draft page:**
- Primary: "Publish" (blue button)
- Secondary: "Preview" (gray button)
- Tertiary: "Delete" (red button, with confirmation)

**When viewing Published page:**
- Primary: "Edit" (blue button) → saves changes live
- Secondary: "Unpublish" (orange button, with confirmation)
- Tertiary: "Preview" (gray button)

---

## ⚠️ Edge Cases & Error Handling

### Concurrent Editing
**Scenario:** Two users edit the same page simultaneously

**Phase 1 Solution:**
- Last write wins (simple)
- Show warning if page was updated since load

**Phase 2 Enhancement:**
- Implement optimistic locking (check `updated_at`)
- Show conflict resolution UI

---

### Publishing Failures
**Scenario:** WordPress API call fails during publish

**Solution:**
- Keep page in `draft` state
- Show error message to user
- Log error for debugging
- Provide retry option

---

### Deleting Published Pages
**Scenario:** User tries to delete a page with published status

**Phase 1 Solution:**
- Require unpublish first (two-step process)
- OR allow delete with strong confirmation

**Considerations:**
- What happens to leads associated with page?
- Answer: Leads remain (FK is SET NULL)

---

### Missing Required Fields
**Scenario:** User tries to publish page with missing required fields

**Solution:**
- Block publish action
- Highlight missing fields in UI
- Show clear error message
- Provide "Save as Draft" option

---

## 📊 Analytics & Reporting

### State-Based Metrics

**By State:**
- Count of pages in each state
- Time spent in each state (avg, min, max)
- Transition frequency (Draft→Published, Published→Draft)

**Queries:**
```sql
-- Count by state
SELECT
  publish_status,
  COUNT(*) AS page_count
FROM landing_pages
GROUP BY publish_status;

-- Average time to publish
SELECT
  AVG(published_at - created_at) AS avg_time_to_publish
FROM landing_pages
WHERE published_at IS NOT NULL;
```

---

## 🚀 Phase 1 Implementation Checklist

### Database
- [x] `publish_status` field with CHECK constraint
- [x] `published_at` timestamp field
- [x] `published_url` field
- [x] Default values set correctly

### Backend API
- [ ] POST /api/landing-pages/:id/publish (Draft → Published)
- [ ] POST /api/landing-pages/:id/unpublish (Published → Draft)
- [ ] Validation logic for state transitions
- [ ] Permission checks for each action

### Frontend UI
- [ ] Status badge display
- [ ] Publish button (when in Draft)
- [ ] Unpublish button (when in Published)
- [ ] Confirmation dialogs for destructive actions
- [ ] Validation error messages
- [ ] Success notifications

### Testing
- [ ] Unit tests for state transitions
- [ ] Integration tests for publish workflow
- [ ] Permission tests for each role
- [ ] Error handling tests

---

## 📚 Related Documentation

- [Phase 1 Success Criteria](./Phase1-Success-Criteria.md)
- [Phase 1 Landing Page Schema](./Phase1-LandingPage-Schema.md)
- [Database Schema](./Database-Schema.md)

---

## 📝 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-03 | Initial lifecycle definition for Phase 1 | DMAT Team |

---

## 🔮 Future Enhancements (Phase 2+)

1. **Scheduled Publishing**
   - Add `scheduled_publish_at` timestamp
   - Implement cron job for auto-publish
   - `scheduled` state

2. **Unpublished State**
   - Separate state for taken-down pages
   - Track unpublish reason
   - Re-publish workflow

3. **Version History**
   - Track all changes to published pages
   - Rollback capability
   - Diff viewer

4. **Approval Workflow**
   - Editor creates → Admin approves → Published
   - `pending_approval` state
   - Comments/feedback system

5. **A/B Testing**
   - Multiple variants of same page
   - Traffic splitting
   - Performance comparison

---

**Lifecycle Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-03
**Maintained by:** DMAT Team
