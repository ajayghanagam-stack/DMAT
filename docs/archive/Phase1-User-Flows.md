# Phase 1 User Flows

**Version:** 1.0
**Date:** 2025-12-03
**Purpose:** Document the three core user flows for Phase 1 MVP

---

## 📋 Overview

This document defines the three essential user flows that prove the Phase 1 MVP concept:

1. **Flow 1:** Create Landing Page (Marketer creates a draft page)
2. **Flow 2:** Publish Landing Page (Marketer makes page public)
3. **Flow 3:** Lead Capture (Public visitor submits form → Lead appears in DMAT)

These flows represent the complete end-to-end journey from page creation to lead capture, which is the core success criteria for Phase 1.

---

## 🎯 Flow 1: Create Landing Page

### Overview
**Actor:** Marketer (Admin or Editor)
**Goal:** Create a new landing page and save it as a draft
**Duration:** ~5-10 minutes
**Outcome:** Draft landing page stored in database

---

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FLOW 1: CREATE LANDING PAGE                 │
└─────────────────────────────────────────────────────────────────────┘

┌──────────┐
│ Marketer │
└────┬─────┘
     │
     │ 1. Logs into DMAT
     ↓
┌─────────────────┐
│ DMAT Dashboard  │
│                 │
│ - Overview      │
│ - Landing Pages │──────────┐
│ - Leads         │          │ Shows list of existing pages
│ - Analytics     │          │ (draft & published)
└─────────────────┘          │
     │                       │
     │ 2. Clicks "Create New Landing Page"
     ↓
┌──────────────────────────────────────────────────────────────┐
│              CREATE LANDING PAGE FORM                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1: Basic Info                                         │
│  ┌────────────────────────────────────────────┐             │
│  │ Title: [Free Marketing Guide 2025______]  │ (Required)  │
│  │ Slug:  [free-marketing-guide-2025______]  │ (Required)  │
│  └────────────────────────────────────────────┘             │
│                                                              │
│  Step 2: Content                                            │
│  ┌────────────────────────────────────────────┐             │
│  │ Headline:    [Download Your Free Guide__] │ (Optional)  │
│  │ Subheading:  [Learn latest strategies___] │ (Optional)  │
│  │ Body Text:   [Comprehensive 50-page____]  │ (Optional)  │
│  │ CTA Button:  [Get Free Guide___________]  │ (Optional)  │
│  │ Hero Image:  [https://example.com/img__]  │ (Optional)  │
│  └────────────────────────────────────────────┘             │
│                                                              │
│  Step 3: Form Fields (default provided)                     │
│  ┌────────────────────────────────────────────┐             │
│  │ ☑ Name (text, required)                   │             │
│  │ ☑ Email (email, required)                 │             │
│  │ ☐ Phone (tel, optional)                   │             │
│  │ [+ Add Field]                             │             │
│  └────────────────────────────────────────────┘             │
│                                                              │
│  [Save as Draft]  [Preview]  [Cancel]                       │
└──────────────────────────────────────────────────────────────┘
     │
     │ 3. Marketer fills in fields
     │    - Title: "Free Marketing Guide 2025"
     │    - Slug: "free-marketing-guide-2025"
     │    - Headline, content, etc. (optional for draft)
     │
     │ 4. Clicks "Save as Draft"
     ↓
┌──────────────────────────────────────────────────────────────┐
│                     VALIDATION                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ✓ Title present? ─────────────→ YES                        │
│  ✓ Slug present? ──────────────→ YES                        │
│  ✓ Slug unique? ───────────────→ YES                        │
│  ✓ Slug valid format? ─────────→ YES (lowercase-with-dashes)│
│  ✓ User authenticated? ────────→ YES (admin/editor)         │
│                                                              │
│  Optional fields validation:                                │
│  ⚠ Headline missing (ok for draft)                          │
│  ⚠ Body text missing (ok for draft)                         │
│                                                              │
│  RESULT: ✅ VALID - Can save draft                          │
└──────────────────────────────────────────────────────────────┘
     │
     │ 5. POST /api/landing-pages
     ↓
┌──────────────────────────────────────────────────────────────┐
│                   BACKEND PROCESSING                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Authenticate request (check JWT token)                  │
│  2. Validate permissions (admin or editor)                  │
│  3. Validate required fields (title, slug)                  │
│  4. Check slug uniqueness (query database)                  │
│  5. Sanitize inputs (prevent XSS)                           │
│  6. Create database record                                  │
│                                                              │
│  INSERT INTO landing_pages (                                │
│    title, slug, headline, subheading, body_text,            │
│    cta_text, hero_image_url, form_fields,                   │
│    publish_status, created_by, created_at                   │
│  ) VALUES (...)                                             │
│                                                              │
│  7. Return created landing page with ID                     │
└──────────────────────────────────────────────────────────────┘
     │
     │ 6. Response: 201 Created
     │    { id: 5, title: "...", publish_status: "draft" }
     ↓
┌──────────────────────────────────────────────────────────────┐
│                   SUCCESS CONFIRMATION                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅ Success!                                                 │
│                                                              │
│  Landing page "Free Marketing Guide 2025" saved as draft.   │
│                                                              │
│  [View Page]  [Continue Editing]  [Go to Dashboard]         │
└──────────────────────────────────────────────────────────────┘
     │
     │ 7. Redirect to Landing Pages list or edit page
     ↓
┌─────────────────────────────────────────────────┐
│          LANDING PAGES LIST                     │
├─────────────────────────────────────────────────┤
│                                                 │
│ Title                          Status    Actions│
│ ────────────────────────────── ──────── ────────│
│ Free Marketing Guide 2025      Draft    Edit    │
│ Welcome to DMAT                Draft    Edit    │
│ Product Launch Q1              Published Edit   │
│                                                 │
│ [+ Create New Landing Page]                     │
└─────────────────────────────────────────────────┘

END FLOW 1
```

---

### Detailed Steps

#### Step 1: Login & Navigation
- **User Action:** Marketer logs into DMAT
- **System:** Verifies credentials, establishes session (JWT)
- **Screen:** Dashboard with navigation menu

#### Step 2: Initiate Creation
- **User Action:** Clicks "Create New Landing Page" button
- **System:** Renders create form with empty fields
- **API Call:** GET /api/landing-pages/new (may fetch templates)

#### Step 3: Fill Form
- **User Action:** Enters page information
  - **Required:** Title, Slug
  - **Optional:** Headline, Subheading, Body Text, CTA, Image URL
  - **Default:** Form fields (name, email, phone)
- **System:** Auto-generates slug from title (can be edited)
- **System:** Provides real-time validation feedback

#### Step 4: Save Draft
- **User Action:** Clicks "Save as Draft"
- **System:** Validates required fields
- **API Call:** POST /api/landing-pages
  ```json
  {
    "title": "Free Marketing Guide 2025",
    "slug": "free-marketing-guide-2025",
    "headline": "Download Your Free Guide",
    "subheading": "Learn the latest strategies",
    "body_text": "Our comprehensive guide...",
    "cta_text": "Get Free Guide",
    "hero_image_url": "https://example.com/hero.jpg",
    "form_fields": {
      "fields": [
        {"name": "name", "type": "text", "required": true},
        {"name": "email", "type": "email", "required": true},
        {"name": "phone", "type": "tel", "required": false}
      ]
    }
  }
  ```

#### Step 5: Database Insert
- **System:** Creates new record
  ```sql
  INSERT INTO landing_pages (
    title, slug, headline, subheading, body_text,
    cta_text, hero_image_url, form_fields,
    publish_status, created_by, created_at
  ) VALUES (
    'Free Marketing Guide 2025',
    'free-marketing-guide-2025',
    'Download Your Free Guide',
    'Learn the latest strategies',
    'Our comprehensive guide...',
    'Get Free Guide',
    'https://example.com/hero.jpg',
    '{"fields":[...]}',
    'draft',
    3,  -- current user ID
    CURRENT_TIMESTAMP
  );
  ```

#### Step 6: Success Response
- **System:** Returns created record with ID
- **UI:** Shows success message
- **User Action:** Chooses next step (edit, view list, dashboard)

---

### Error Scenarios

**Slug Already Exists:**
```
❌ Error: A page with slug "free-marketing-guide-2025" already exists.
   Please choose a different slug or title.

   Suggested: free-marketing-guide-2025-2
```

**Missing Required Field:**
```
❌ Error: Please fill in all required fields

   Missing:
   • Title (required)
```

**Validation Error:**
```
❌ Error: Invalid slug format

   Slug must contain only lowercase letters, numbers, and dashes.
   Example: my-landing-page-2025
```

---

## 🚀 Flow 2: Publish Landing Page

### Overview
**Actor:** Marketer (Admin or Editor)
**Goal:** Make a draft landing page publicly accessible
**Duration:** ~2-3 minutes
**Outcome:** Page published to WordPress (or DMAT URL), accessible to public

---

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      FLOW 2: PUBLISH LANDING PAGE                   │
└─────────────────────────────────────────────────────────────────────┘

┌──────────┐
│ Marketer │
└────┬─────┘
     │
     │ 1. Navigates to Landing Pages list
     ↓
┌─────────────────────────────────────────────────────────────┐
│              LANDING PAGES LIST                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Title                          Status    Actions            │
│ ────────────────────────────── ──────── ──────────────────  │
│ Free Marketing Guide 2025      Draft    [Edit] [Publish]   │◄─── Click
│ Welcome to DMAT                Draft    [Edit] [Publish]   │
│ Product Launch Q1              Published [Edit] [Unpublish]│
└─────────────────────────────────────────────────────────────┘
     │
     │ 2. Clicks "Publish" on draft page
     ↓
┌──────────────────────────────────────────────────────────────┐
│                  PRE-PUBLISH VALIDATION                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Checking if page is ready to publish...                    │
│                                                              │
│  ✓ Title present ───────────────→ YES                       │
│  ✓ Slug valid & unique ─────────→ YES                       │
│  ✓ Form fields valid ───────────→ YES                       │
│  ✓ Email field in form ─────────→ YES                       │
│  ⚠ Headline present ────────────→ NO (recommended)          │
│  ⚠ Body text present ───────────→ YES                       │
│                                                              │
│  RESULT: ✅ READY TO PUBLISH (with warnings)                │
└──────────────────────────────────────────────────────────────┘
     │
     │ 3. Show confirmation dialog
     ↓
┌──────────────────────────────────────────────────────────────┐
│               PUBLISH CONFIRMATION DIALOG                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  📢 Ready to publish?                                        │
│                                                              │
│  Page: "Free Marketing Guide 2025"                          │
│  Slug: free-marketing-guide-2025                            │
│                                                              │
│  ⚠ Warnings:                                                │
│  • Headline is missing (recommended for better UX)          │
│                                                              │
│  This page will be publicly accessible at:                  │
│  https://innovateelectronics.com/lp/free-marketing-guide... │
│                                                              │
│  [Cancel]  [Publish Anyway]                                 │
└──────────────────────────────────────────────────────────────┘
     │
     │ 4. User clicks "Publish Anyway"
     ↓
┌──────────────────────────────────────────────────────────────┐
│                    PUBLISHING PROCESS                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 1: Update Database                                    │
│  ────────────────────────────────────────────               │
│  UPDATE landing_pages SET                                   │
│    publish_status = 'published',                            │
│    published_at = CURRENT_TIMESTAMP,                        │
│    published_url = NULL  (set after WordPress publish)      │
│  WHERE id = 5;                                              │
│                                                              │
│  Status: ✅ Database updated                                │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 2: Publish to WordPress (Optional - Phase 1)          │
│  ────────────────────────────────────────────────           │
│  POST https://innovateelectronics.com/wp-json/wp/v2/pages   │
│                                                              │
│  Headers:                                                    │
│    Authorization: Bearer [JWT_TOKEN]                         │
│                                                              │
│  Body:                                                       │
│    {                                                         │
│      "title": "Free Marketing Guide 2025",                  │
│      "slug": "free-marketing-guide-2025",                   │
│      "content": "<html>... rendered page ...</html>",       │
│      "status": "publish"                                     │
│    }                                                         │
│                                                              │
│  Response: 201 Created                                       │
│    {                                                         │
│      "id": 123,                                             │
│      "link": "https://innovateelectronics.com/lp/free..."   │
│    }                                                         │
│                                                              │
│  Status: ✅ Published to WordPress                          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Step 3: Update Published URL                               │
│  ────────────────────────────────────────────────           │
│  UPDATE landing_pages SET                                   │
│    published_url = 'https://innovateelectronics.com/lp/...' │
│  WHERE id = 5;                                              │
│                                                              │
│  Status: ✅ URL stored                                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
     │
     │ 5. Success response
     ↓
┌──────────────────────────────────────────────────────────────┐
│                   PUBLISH SUCCESS                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅ Published successfully!                                  │
│                                                              │
│  Your landing page is now live at:                          │
│  https://innovateelectronics.com/lp/free-marketing-guide... │
│                                                              │
│  [Copy URL]  [View Page]  [Share]  [Go to Dashboard]        │
└──────────────────────────────────────────────────────────────┘
     │
     │ 6. Page status updated in list
     ↓
┌─────────────────────────────────────────────────────────────┐
│              LANDING PAGES LIST (Updated)                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Title                          Status      Actions          │
│ ────────────────────────────── ────────── ────────────────  │
│ Free Marketing Guide 2025      Published  [Edit] [Unpub.]  │◄─── Updated
│ Welcome to DMAT                Draft      [Edit] [Publish] │
│ Product Launch Q1              Published  [Edit] [Unpub.]  │
└─────────────────────────────────────────────────────────────┘

END FLOW 2
```

---

### Detailed Steps

#### Step 1: Navigate to Page
- **User Action:** Goes to Landing Pages list
- **System:** Displays all pages with status badges
- **API Call:** GET /api/landing-pages

#### Step 2: Initiate Publish
- **User Action:** Clicks "Publish" button
- **System:** Performs pre-publish validation
- **Validation Checks:**
  - Required fields present
  - Form has at least one email field
  - User has publish permission

#### Step 3: Confirmation
- **System:** Shows confirmation dialog with warnings
- **User Action:** Reviews and confirms
- **Decision Point:** Cancel or proceed

#### Step 4: Publish Process
- **API Call:** POST /api/landing-pages/:id/publish

**Backend Processing:**
1. **Update Database:**
   ```sql
   UPDATE landing_pages SET
     publish_status = 'published',
     published_at = COALESCE(published_at, CURRENT_TIMESTAMP),
     updated_at = CURRENT_TIMESTAMP
   WHERE id = 5;
   ```

2. **Publish to WordPress** (if configured):
   ```javascript
   const wordpressResponse = await fetch('https://site.com/wp-json/wp/v2/pages', {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${WORDPRESS_JWT}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       title: page.title,
       slug: page.slug,
       content: renderPageHTML(page),
       status: 'publish'
     })
   });
   ```

3. **Store Published URL:**
   ```sql
   UPDATE landing_pages SET
     published_url = 'https://innovateelectronics.com/lp/free-marketing-guide-2025'
   WHERE id = 5;
   ```

#### Step 5: Success Notification
- **System:** Shows success message with public URL
- **User Options:**
  - Copy URL
  - View live page (new tab)
  - Share on social media
  - Return to dashboard

---

### Error Scenarios

**WordPress API Failure:**
```
❌ Error: Failed to publish to WordPress

Details: Connection timeout

The page status remains as "draft". Your data is safe.

Options:
[Retry]  [Save for Manual Publish]  [Contact Support]
```

**Missing Email Field:**
```
❌ Cannot publish: No email field in form

Your form must have at least one email field to capture leads.

[Edit Form Fields]  [Cancel]
```

**Permission Denied:**
```
❌ Permission Denied

You don't have permission to publish landing pages.
Contact your admin to request editor or admin access.

[OK]
```

---

## 👤 Flow 3: Lead Capture (Public Visitor)

### Overview
**Actor:** Public Visitor (anonymous)
**Goal:** Submit form and become a lead
**Duration:** ~1-2 minutes
**Outcome:** Lead data stored in database, appears in marketer's Leads list

---

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FLOW 3: LEAD CAPTURE                        │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────┐
│Public Visitor │
└───────┬───────┘
        │
        │ 1. Discovers landing page URL
        │    (from email, social media, ad, etc.)
        │
        │ https://innovateelectronics.com/lp/free-marketing-guide-2025
        ↓
┌──────────────────────────────────────────────────────────────┐
│              LANDING PAGE (Public View)                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                        │ │
│  │  [Hero Image]                                         │ │
│  │                                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Download Your Free Digital Marketing Guide                 │
│  ═══════════════════════════════════════════════════════    │
│                                                              │
│  Learn the latest strategies that drive results             │
│  ───────────────────────────────────────────────────────    │
│                                                              │
│  Our comprehensive 50-page guide covers SEO, social media,  │
│  content marketing, email campaigns, and analytics. Join    │
│  over 10,000 marketers who have downloaded this resource!   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           📋 Get Your Free Guide                      │ │
│  │                                                        │ │
│  │  Name:  [________________]  *Required                 │ │
│  │  Email: [________________]  *Required                 │ │
│  │  Phone: [________________]  Optional                  │ │
│  │                                                        │ │
│  │         [Get Free Guide]                              │ │
│  │                                                        │ │
│  │  🔒 We respect your privacy. No spam.                 │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
        │
        │ 2. Visitor fills out form
        │    Name: John Doe
        │    Email: john@example.com
        │    Phone: +1-555-0123
        │
        │ 3. Clicks "Get Free Guide"
        ↓
┌──────────────────────────────────────────────────────────────┐
│                CLIENT-SIDE VALIDATION                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ✓ Name filled? ────────────────→ YES                       │
│  ✓ Email filled? ───────────────→ YES                       │
│  ✓ Email valid format? ─────────→ YES (john@example.com)    │
│  ✓ Phone format ok? ────────────→ YES (optional, valid)     │
│                                                              │
│  RESULT: ✅ VALID - Submitting...                           │
└──────────────────────────────────────────────────────────────┘
        │
        │ 4. POST /api/leads (public endpoint, no auth required)
        │
        │ Body: {
        │   "landing_page_id": 5,
        │   "name": "John Doe",
        │   "email": "john@example.com",
        │   "phone": "+1-555-0123",
        │   "source": "landing_page",
        │   "source_details": "LP: free-marketing-guide-2025",
        │   "referrer_url": "https://google.com/search?q=marketing",
        │   "landing_url": "https://innovateelectronics.com/lp/...",
        │   "user_agent": "Mozilla/5.0...",
        │   "ip_address": "192.168.1.100"
        │ }
        ↓
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND PROCESSING                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Validate input data                                     │
│     ✓ Name present                                          │
│     ✓ Email valid format                                    │
│     ✓ Landing page exists and is published                  │
│                                                              │
│  2. Sanitize inputs (prevent XSS)                           │
│     - Strip HTML tags from name, message                    │
│     - Validate email format                                 │
│                                                              │
│  3. Capture metadata                                        │
│     - Extract referrer from request headers                 │
│     - Extract user agent from request headers               │
│     - Capture IP address (optional, privacy-aware)          │
│     - Parse UTM parameters from landing_url                 │
│                                                              │
│  4. Check for duplicate (optional - Phase 2)                │
│     - Query existing leads by email                         │
│     - For Phase 1: Allow duplicates                         │
│                                                              │
│  5. Insert into database                                    │
│                                                              │
│  INSERT INTO leads (                                        │
│    landing_page_id, name, email, phone,                     │
│    source, source_details,                                  │
│    referrer_url, landing_url,                               │
│    user_agent, ip_address,                                  │
│    status, created_at                                       │
│  ) VALUES (                                                 │
│    5,                                                       │
│    'John Doe',                                              │
│    'john@example.com',                                      │
│    '+1-555-0123',                                           │
│    'landing_page',                                          │
│    'LP: free-marketing-guide-2025',                         │
│    'https://google.com/search?q=marketing',                 │
│    'https://innovateelectronics.com/lp/free-...',           │
│    'Mozilla/5.0 (Windows NT 10.0...) Chrome/120...',        │
│    '192.168.1.100',                                         │
│    'new',                                                   │
│    CURRENT_TIMESTAMP                                        │
│  );                                                         │
│                                                              │
│  6. Return success                                          │
│     { id: 42, status: "success" }                           │
└──────────────────────────────────────────────────────────────┘
        │
        │ 5. Response: 201 Created
        ↓
┌──────────────────────────────────────────────────────────────┐
│                    THANK YOU PAGE                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                    ✅ Thank You!                             │
│                                                              │
│  Your free guide is on its way to:                          │
│  john@example.com                                           │
│                                                              │
│  Please check your inbox (and spam folder) for the          │
│  download link.                                             │
│                                                              │
│  While you're here, check out these resources:              │
│  • Blog Post: 10 Marketing Tips for 2025                    │
│  • Webinar: AI in Marketing (Jan 15)                        │
│  • Case Study: How Company X Increased ROI by 300%          │
│                                                              │
│  [Visit Our Blog]  [Register for Webinar]                   │
└──────────────────────────────────────────────────────────────┘
        │
        │ Meanwhile, in DMAT...
        ↓
┌──────────────────────────────────────────────────────────────┐
│              DMAT LEADS SCREEN (Marketer View)               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  🔔 New lead captured! (real-time notification)             │
│                                                              │
│  Leads (38 total)                                           │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Name         Email              Source        Date    Status│
│  ──────────── ─────────────────  ────────────  ────── ───────│
│  John Doe     john@example.com   LP: free-... Today   New   │◄─ NEW!
│  Jane Smith   jane@example.com   LP: webinar  Dec 2   New   │
│  Bob Johnson  bob@example.com    Social: LI   Dec 1   Contac│
│                                                              │
│  [Export CSV]  [Filter by Source]  [Filter by Status]       │
└──────────────────────────────────────────────────────────────┘
        │
        │ 6. Marketer clicks on new lead
        ↓
┌──────────────────────────────────────────────────────────────┐
│                     LEAD DETAIL VIEW                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Lead #42                                       Status: New  │
│  ═══════════════════════════════════════════════════════    │
│                                                              │
│  Contact Information                                        │
│  ───────────────────────────────────────────────            │
│  Name:    John Doe                                          │
│  Email:   john@example.com                                  │
│  Phone:   +1-555-0123                                       │
│  Company: -                                                 │
│  Title:   -                                                 │
│                                                              │
│  Source Attribution                                         │
│  ───────────────────────────────────────────────            │
│  Source:   Landing Page                                     │
│  Details:  LP: free-marketing-guide-2025                    │
│  Referrer: https://google.com/search?q=marketing            │
│  Campaign: utm_source=google&utm_medium=organic             │
│                                                              │
│  Technical Details                                          │
│  ───────────────────────────────────────────────            │
│  IP:         192.168.1.100                                  │
│  Device:     Desktop (Chrome on Windows)                    │
│  Captured:   Dec 3, 2025 at 2:30 PM                        │
│                                                              │
│  Actions                                                    │
│  ───────────────────────────────────────────────            │
│  [Mark as Contacted]  [Export]  [Delete]                    │
└──────────────────────────────────────────────────────────────┘

END FLOW 3

✅ SUCCESS CRITERIA MET:
   1. Landing page created ✅
   2. Landing page published ✅
   3. Public visitor submitted form ✅
   4. Lead appears in DMAT ✅
```

---

### Detailed Steps

#### Step 1: Visitor Arrives
- **Source:** Email, social media, Google search, ad
- **Action:** Opens landing page URL
- **System:** Serves public page (no authentication required)
- **Page Load:**
  - Fetch page data by slug
  - Render headline, content, form
  - Load tracking scripts (analytics, UTM capture)

#### Step 2: Fill Form
- **User Action:** Visitor enters information
- **System:** Provides real-time validation feedback
- **UX:** Clear labels, placeholders, error messages

#### Step 3: Submit Form
- **User Action:** Clicks submit button
- **Client Validation:** Check required fields before API call
- **API Call:** POST /api/leads

**Request Payload:**
```json
{
  "landing_page_id": 5,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "source": "landing_page",
  "source_details": "LP: free-marketing-guide-2025",
  "referrer_url": "https://google.com/search?q=marketing+guide",
  "landing_url": "https://innovateelectronics.com/lp/free-marketing-guide-2025?utm_source=google&utm_medium=organic",
  "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
  "ip_address": "192.168.1.100"
}
```

#### Step 4: Backend Processing
**Validation:**
- Required fields present
- Email format valid
- Landing page exists and is published

**Sanitization:**
- Strip HTML tags (prevent XSS)
- Trim whitespace
- Normalize phone number format

**Database Insert:**
```sql
INSERT INTO leads (
  landing_page_id, name, email, phone,
  source, source_details, referrer_url, landing_url,
  user_agent, ip_address, status, created_at
) VALUES (
  5, 'John Doe', 'john@example.com', '+1-555-0123',
  'landing_page', 'LP: free-marketing-guide-2025',
  'https://google.com/search?q=marketing',
  'https://innovateelectronics.com/lp/free-marketing-guide-2025?utm_source=google',
  'Mozilla/5.0...',
  '192.168.1.100',
  'new',
  CURRENT_TIMESTAMP
);
```

#### Step 5: Thank You Page
- **System:** Shows success message
- **Display:** Email confirmation
- **Optional:** Download link, related content, social share buttons

#### Step 6: Marketer Notification
- **System:** Real-time notification (optional in Phase 1)
- **Dashboard:** Lead count updates
- **Leads List:** New lead appears at top

---

### Error Scenarios

**Invalid Email:**
```
❌ Please enter a valid email address

Example: john@example.com
```

**Missing Required Field:**
```
❌ Please fill in all required fields

Required:
• Name
• Email
```

**Server Error:**
```
❌ Something went wrong

We couldn't process your request. Please try again.

If the problem persists, contact support@innovateelectronics.com
```

**Page Not Found:**
```
❌ Page Not Found

This landing page may have been removed or is no longer available.

[Visit Homepage]
```

---

## 📊 Flow Summary

### Flow Comparison

| Aspect | Flow 1: Create | Flow 2: Publish | Flow 3: Capture |
|--------|----------------|-----------------|-----------------|
| **Actor** | Marketer | Marketer | Public Visitor |
| **Authentication** | Required | Required | Not Required |
| **Duration** | 5-10 min | 2-3 min | 1-2 min |
| **API Calls** | 1 (POST) | 1-2 (POST + WordPress) | 1 (POST) |
| **Database Ops** | 1 INSERT | 2 UPDATE | 1 INSERT |
| **User Skill** | Basic | Basic | None |
| **Success Rate** | High | Medium (WordPress dependency) | High |

---

## 🔗 System Integration Points

### Flow 1 → Flow 2
- Draft page (Flow 1 output) becomes input for Flow 2
- `publish_status = 'draft'` changes to `'published'`

### Flow 2 → Flow 3
- Published page (Flow 2 output) becomes accessible for Flow 3
- `published_url` is the entry point for public visitors

### Flow 3 → Marketer
- Lead created in Flow 3 appears in DMAT Leads screen
- Completes the full cycle: Create → Publish → Capture

---

## ✅ Success Criteria

All three flows working together prove Phase 1 MVP:

1. ✅ **Flow 1 Success:** Marketer can create and save a draft landing page
2. ✅ **Flow 2 Success:** Marketer can publish page (gets public URL)
3. ✅ **Flow 3 Success:** Public visitor can submit form → Lead appears in DMAT

**End-to-End Test:**
```
Create landing page → Save draft → Publish →
Get URL → Open in incognito → Fill form → Submit →
Check DMAT → See new lead ✅
```

---

## 📚 Related Documentation

- [Phase 1 Success Criteria](./Phase1-Success-Criteria.md)
- [Phase 1 Landing Page Lifecycle](./Phase1-LandingPage-Lifecycle.md)
- [Phase 1 Landing Page Schema](./Phase1-LandingPage-Schema.md)
- [Phase 1 Lead Schema](./Phase1-Lead-Schema.md)

---

**User Flows Version:** 1.0
**Last Updated:** 2025-12-03
**Maintained by:** DMAT Team
