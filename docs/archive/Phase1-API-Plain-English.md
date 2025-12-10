# Phase 1 Landing Page API - Plain English Specification

**Version:** 1.0
**Date:** 2025-12-03
**Purpose:** Human-readable specification of landing page admin API operations

---

## 📋 Overview

This document explains what each API operation does, what information you need to provide, what you'll get back, and what can go wrong. Written in plain English for easy understanding by all team members.

**Who uses these APIs:** Only authenticated DMAT users (admins, editors, viewers)

**Not included:** Public-facing APIs (those come later)

---

## 🔐 Authentication Basics

**All operations require login**

Before using any of these operations, the user must be logged in. The system checks:
- Is the user authenticated? (Do they have a valid login token?)
- Does the user have permission to perform this action? (Are they an admin, editor, or viewer?)

**Permission levels:**
- **Viewer:** Can only look at landing pages (read-only)
- **Editor:** Can create, edit, publish, and delete landing pages
- **Admin:** Same as editor (Phase 1 treats them the same)

---

## 1️⃣ Create Landing Page

### What it does
Creates a new landing page in draft status (not yet published).

### Who can do this
- Admin
- Editor
- NOT viewers (they can only view, not create)

### What you need to provide

**Required information:**
- **Title** - The name of your landing page (e.g., "Free Marketing Guide 2025")
  - Must be 1-500 characters
  - Example: "Download Our Free SEO Checklist"

- **Slug** - The URL-friendly identifier (appears in the web address)
  - Must be 1-255 characters
  - Must be unique (no other landing page can have the same slug)
  - Must be lowercase with hyphens only (no spaces, special characters, or uppercase)
  - Example: "free-seo-checklist-2025"

**Optional information (you can add these now or later):**
- **Headline** - The main heading visitors see (H1)
  - Max 500 characters
  - Example: "Get Your Free SEO Checklist"

- **Subheading** - Supporting text under the headline (H2)
  - Max 1000 characters
  - Example: "Boost your rankings with our proven 50-point checklist"

- **Body Text** - The main content explaining your offer
  - No length limit
  - Example: "Our comprehensive SEO checklist includes everything you need to..."

- **CTA Text** - The button text (call-to-action)
  - Max 100 characters
  - Default: "Submit"
  - Example: "Download Free Checklist"

- **Hero Image URL** - URL to the main banner/hero image
  - Max 2048 characters
  - Must be a valid URL
  - Example: "https://example.com/images/seo-hero.jpg"

- **Form Fields** - The fields you want in your lead capture form
  - Must be valid JSON format
  - Must include at least one email field (so you can capture leads)
  - Default form includes: name, email, phone
  - Example custom form: name, email, company, job title

### What you get back

**On success:**
- **ID** - A unique number assigned to this landing page (e.g., 5)
- **All the information you provided** (title, slug, headline, etc.)
- **Publish Status** - Will be "draft" (not yet published)
- **Published URL** - Will be empty/null (page isn't published yet)
- **Published At** - Will be empty/null (page isn't published yet)
- **Created By** - Your user ID (who created this page)
- **Created At** - Timestamp when page was created (e.g., "2025-12-03 10:30:00")
- **Updated At** - Timestamp of last update (same as created_at initially)
- **Success message** - "Landing page created successfully"

**Example response:**
```
✅ Success!
Landing page ID: 5
Title: "Free Marketing Guide 2025"
Slug: "free-marketing-guide-2025"
Status: Draft
Created: December 3, 2025 at 10:30 AM
```

### What can go wrong (errors)

**Missing required information:**
- **Error:** "Title is required"
  - **Fix:** Provide a title

- **Error:** "Slug is required"
  - **Fix:** Provide a slug

**Invalid slug format:**
- **Error:** "Slug must contain only lowercase letters, numbers, and hyphens"
  - **Happens when:** You use spaces, uppercase, or special characters
  - **Fix:** Change "Free Guide!" to "free-guide"

**Duplicate slug:**
- **Error:** "A landing page with this slug already exists"
  - **Happens when:** Another landing page already uses that slug
  - **Fix:** Choose a different slug (e.g., "free-guide-2025" instead of "free-guide")

**Invalid form fields:**
- **Error:** "Form fields must contain at least one email field for lead capture"
  - **Happens when:** Your custom form doesn't include an email field
  - **Fix:** Add an email field to your form configuration

**Permission denied:**
- **Error:** "Insufficient permissions. This action requires admin or editor role."
  - **Happens when:** A viewer tries to create a landing page
  - **Fix:** Must be logged in as admin or editor

**Not logged in:**
- **Error:** "Authentication required. Please provide a valid login token."
  - **Happens when:** User is not logged in
  - **Fix:** Log in first

---

## 2️⃣ List Landing Pages

### What it does
Shows you a list of all landing pages with filtering, searching, and sorting options.

### Who can do this
- Admin
- Editor
- Viewer (yes, viewers can see the list)

### What you can provide (all optional)

**Pagination:**
- **Page number** - Which page of results to show
  - Default: 1 (first page)
  - Example: 2 (show second page)

- **Items per page** - How many landing pages to show at once
  - Default: 20
  - Maximum: 100
  - Example: 50 (show 50 pages at a time)

**Filters:**
- **Status filter** - Only show pages with specific status
  - Options: "draft", "published", "all"
  - Default: "all" (show everything)
  - Example: "published" (only show published pages)

- **Created by filter** - Only show pages created by specific user
  - Provide user ID number
  - Example: 2 (only show pages created by user #2)

- **Search** - Find pages by title, headline, or slug
  - Example: "marketing" (finds all pages with "marketing" in title/headline/slug)

**Sorting:**
- **Sort by** - Which field to sort by
  - Options: "created_at", "updated_at", "title", "published_at"
  - Default: "created_at"
  - Example: "published_at" (sort by publication date)

- **Sort order** - Ascending or descending
  - Options: "asc" (oldest first), "desc" (newest first)
  - Default: "desc"
  - Example: "desc" (show newest first)

### What you get back

**On success:**
- **List of landing pages** - Each page includes:
  - ID, title, slug, headline
  - Publish status ("draft" or "published")
  - Published URL (if published)
  - Published date (if published)
  - Created by (user ID and name)
  - Created date
  - Updated date

- **Pagination information:**
  - Current page number
  - Total number of pages
  - Total number of items
  - Items per page
  - Has next page? (yes/no)
  - Has previous page? (yes/no)

- **Active filters:**
  - What filters are currently applied

**Example response:**
```
✅ Success!
Found 42 landing pages (showing page 1 of 3)

Page 1:
1. Free Marketing Guide 2025
   Status: Published
   URL: https://innovateelectronics.com/lp/free-marketing-guide-2025
   Published: Dec 2, 2025
   Created by: Admin User

2. Contact Sales
   Status: Published
   URL: https://innovateelectronics.com/lp/contact-sales
   Published: Nov 28, 2025
   Created by: Editor User

... (18 more pages)

Showing 20 of 42 total pages
```

**Empty results:**
```
✅ Success!
No landing pages found matching your filters.
```

### What can go wrong (errors)

**Invalid page number:**
- **Error:** "Page number must be a positive integer"
  - **Happens when:** You provide a negative number or zero
  - **Fix:** Use page=1, page=2, etc.

**Invalid limit:**
- **Error:** "Limit must be between 1 and 100"
  - **Happens when:** You ask for 0 items or more than 100
  - **Fix:** Use a number between 1 and 100

**Not logged in:**
- **Error:** "Authentication required"
  - **Fix:** Log in first

---

## 3️⃣ Get Single Landing Page

### What it does
Shows complete details of one specific landing page.

### Who can do this
- Admin
- Editor
- Viewer (yes, viewers can see page details)

### What you need to provide

**Required:**
- **Landing page ID** - The unique number of the page you want to see
  - Example: 5 (show me landing page #5)

### What you get back

**On success:**
- **Complete landing page details:**
  - ID
  - Title, slug, headline, subheading, body text
  - CTA text, hero image URL
  - Form fields (complete JSON configuration)
  - Publish status ("draft" or "published")
  - Published URL (if published)
  - Published date (if published)
  - Created by (user ID, name, and email)
  - Created date
  - Updated date
  - **Lead count** - How many leads this page has captured

**Example response:**
```
✅ Success!
Landing Page #5: "Free Marketing Guide 2025"

Status: Draft
Slug: free-marketing-guide-2025
Headline: "Download Your Free Digital Marketing Guide"
Subheading: "Learn the latest strategies that drive results in 2025"
Body: "Our comprehensive 50-page guide covers SEO, social media..."
CTA Button: "Get Your Free Guide"
Hero Image: https://example.com/images/marketing-guide-hero.jpg

Form Fields:
- Full Name (required)
- Work Email (required)
- Company Name (optional)

Created by: Admin User (admin@example.com)
Created: Dec 3, 2025 at 10:30 AM
Last updated: Dec 3, 2025 at 10:30 AM

Leads captured: 0
```

### What can go wrong (errors)

**Page not found:**
- **Error:** "Landing page not found"
  - **Happens when:** No landing page exists with that ID
  - **Fix:** Check the ID number is correct

**Invalid ID:**
- **Error:** "Invalid landing page ID. Must be a positive integer."
  - **Happens when:** You provide a negative number, zero, or text
  - **Fix:** Use a valid ID like 1, 2, 5, etc.

**Not logged in:**
- **Error:** "Authentication required"
  - **Fix:** Log in first

---

## 4️⃣ Update Landing Page

### What it does
Changes information on an existing landing page. You only need to provide the fields you want to change (partial updates are allowed).

### Who can do this
- Admin
- Editor
- NOT viewers

### What you need to provide

**Required:**
- **Landing page ID** - Which page you want to update
  - Example: 5 (update landing page #5)

**At least one field to update:**
Any of these (you don't need to provide all of them, just the ones you want to change):
- Title
- Slug (must still be unique)
- Headline
- Subheading
- Body text
- CTA text
- Hero image URL
- Form fields

**Important note about published pages:**
If the page is already published, your changes will go live immediately. There's no "draft" mode for edits in Phase 1.

### What you get back

**On success:**
- **Updated landing page details** (all fields, showing your changes)
- **Updated At** timestamp (shows when you made the change)
- **Success message** - "Landing page updated successfully"

**Example request:**
```
Update landing page #5:
- Change title to: "Updated Title - Free Marketing Guide 2025"
- Change CTA text to: "Download Now"
(leave everything else unchanged)
```

**Example response:**
```
✅ Success!
Landing page #5 updated

Title: "Updated Title - Free Marketing Guide 2025" (changed)
CTA Button: "Download Now" (changed)
Headline: "Download Your Free Digital Marketing Guide" (unchanged)
... (all other fields unchanged)

Last updated: Dec 3, 2025 at 11:15 AM
```

### What can go wrong (errors)

**Empty update:**
- **Error:** "At least one field must be provided for update"
  - **Happens when:** You don't provide any fields to change
  - **Fix:** Provide at least one field to update

**Page not found:**
- **Error:** "Landing page not found"
  - **Happens when:** No landing page exists with that ID
  - **Fix:** Check the ID number is correct

**Duplicate slug:**
- **Error:** "A landing page with this slug already exists"
  - **Happens when:** You're changing the slug to one that's already in use by another page
  - **Fix:** Choose a different slug

**Invalid slug format:**
- **Error:** "Slug must contain only lowercase letters, numbers, and hyphens"
  - **Fix:** Use only lowercase letters, numbers, and hyphens (no spaces or special characters)

**Invalid form fields:**
- **Error:** "Form fields must contain at least one email field for lead capture"
  - **Happens when:** Your updated form doesn't include an email field
  - **Fix:** Make sure your form has an email field

**Permission denied:**
- **Error:** "Insufficient permissions. This action requires admin or editor role."
  - **Happens when:** A viewer tries to update a page
  - **Fix:** Must be logged in as admin or editor

**Not logged in:**
- **Error:** "Authentication required"
  - **Fix:** Log in first

---

## 5️⃣ Publish Landing Page

### What it does
Takes a draft landing page and makes it public. This involves:
1. Checking that the page is ready to publish
2. Exporting it to WordPress (if WordPress is enabled)
3. Generating a public URL
4. Changing status from "draft" to "published"

### Who can do this
- Admin
- Editor
- NOT viewers

### What you need to provide

**Required:**
- **Landing page ID** - Which page you want to publish
  - Example: 5 (publish landing page #5)

**Optional (WordPress settings):**
- **WordPress enabled** - Should we push this to WordPress?
  - Default: true (yes, publish to WordPress)
  - Example: false (use DMAT-hosted page instead)

- **WordPress category ID** - Which WordPress category to put this in
  - Example: 5

- **WordPress author ID** - Which WordPress user should be the author
  - Example: 2

### What the system checks before publishing

**Required checks (will block publishing if missing):**
1. Title must be present
2. Slug must be unique
3. Form fields must be valid JSON
4. Form must have at least one email field (for capturing leads)

**Recommended checks (will show warnings but still allow publishing):**
1. Headline should be present (better user experience)
2. Body text should be present (explains the offer)
3. CTA text should be present (clear call-to-action)
4. Hero image URL could be present (more attractive page)

### What you get back

**On success (WordPress enabled):**
- **Updated landing page details:**
  - Publish status changed to "published"
  - Published URL (WordPress URL where visitors can access it)
  - Published date (when it was first published)
  - WordPress post ID (reference number in WordPress)
  - All other page details
- **Success message** - "Landing page published successfully to WordPress"
- **Warnings** (if any) - List of recommended fields that are missing

**Example response:**
```
✅ Success!
Landing page published to WordPress

Title: "Free Marketing Guide 2025"
Status: Published (was Draft)
Public URL: https://innovateelectronics.com/lp/free-marketing-guide-2025
Published: Dec 3, 2025 at 12:00 PM
WordPress Post ID: 847

No warnings - all recommended fields are present!
```

**On success (WordPress disabled - DMAT-hosted):**
- Same as above, but:
  - Published URL is a DMAT URL instead of WordPress
  - No WordPress post ID
  - Message: "Landing page published successfully (DMAT-hosted)"

**Example response:**
```
✅ Success!
Landing page published (DMAT-hosted)

Title: "Free Marketing Guide 2025"
Status: Published
Public URL: https://dmat-app.example.com/public/lp/free-marketing-guide-2025
Published: Dec 3, 2025 at 12:00 PM

⚠️ Warnings:
- Missing recommended field: headline
- Missing recommended field: body_text
- Missing recommended field: hero_image_url
```

### What can go wrong (errors)

**Page not found:**
- **Error:** "Landing page not found"
  - **Happens when:** No landing page exists with that ID
  - **Fix:** Check the ID number is correct

**Already published:**
- **Error:** "Landing page is already published. Use the update endpoint to make changes."
  - **Happens when:** The page status is already "published"
  - **Fix:** If you want to make changes, use the Update operation instead
  - **Note:** In Phase 1, you can't "re-publish" a page - once it's published, you edit it directly

**Missing required fields:**
- **Error:** "Landing page cannot be published. Required fields are missing."
  - **Details:** List of missing required fields
  - **Happens when:** Title is missing, or form doesn't have an email field
  - **Fix:** Add the missing required fields first, then try publishing again

**Invalid form:**
- **Error:** "Form must contain at least one email field for lead capture"
  - **Happens when:** Your form configuration doesn't include an email field
  - **Fix:** Add an email field to your form

**WordPress API failure:**
- **Error:** "Failed to publish to WordPress. Please try again."
  - **Happens when:** WordPress is unreachable or returns an error
  - **Possible causes:**
    - WordPress site is down
    - Network connection issue
    - Invalid WordPress credentials
    - WordPress API is not enabled
  - **Fix:**
    - Check WordPress site is accessible
    - Verify WordPress credentials are correct
    - Try again in a few moments
    - Contact system administrator if problem persists

**Permission denied:**
- **Error:** "Insufficient permissions. This action requires admin or editor role."
  - **Happens when:** A viewer tries to publish a page
  - **Fix:** Must be logged in as admin or editor

**Not logged in:**
- **Error:** "Authentication required"
  - **Fix:** Log in first

---

## 6️⃣ Delete Landing Page

### What it does
Permanently removes a landing page from the system.

**Important notes:**
- Draft pages can be deleted freely
- Published pages require confirmation (safety measure)
- Leads captured by this page will NOT be deleted (they remain in the system with no associated landing page)
- WordPress pages are NOT automatically deleted (you must delete them manually in WordPress)

### Who can do this
- Admin
- Editor
- NOT viewers

### What you need to provide

**Required:**
- **Landing page ID** - Which page you want to delete
  - Example: 5 (delete landing page #5)

**Optional (for published pages):**
- **Force delete** - Confirm you want to delete a published page
  - Default: false (don't delete published pages)
  - Example: true (yes, delete it even though it's published)

### What you get back

**On success (draft page deleted):**
- **Confirmation:**
  - ID of deleted page
  - Title of deleted page
  - Status (was "draft")
  - Deletion timestamp
- **Success message** - "Landing page deleted successfully"

**Example response:**
```
✅ Success!
Landing page deleted

ID: 5
Title: "Free Marketing Guide 2025"
Status: Draft
Deleted: Dec 3, 2025 at 1:00 PM
```

**On success (published page force-deleted):**
- Same as above, plus:
  - Lead count (how many leads were associated)
  - Warnings about WordPress and leads

**Example response:**
```
✅ Success!
Landing page deleted (force=true)

ID: 3
Title: "Contact Sales"
Status: Published
Deleted: Dec 3, 2025 at 1:00 PM
Associated leads: 23

⚠️ Important:
- WordPress page NOT deleted automatically. You must delete it manually in WordPress.
- 23 leads were associated with this page. They remain in the system but no longer linked to a landing page.
```

### What can go wrong (errors)

**Page not found:**
- **Error:** "Landing page not found"
  - **Happens when:** No landing page exists with that ID
  - **Fix:** Check the ID number is correct

**Cannot delete published page (without force):**
- **Error:** "Cannot delete published landing page. Unpublish it first or use force=true."
  - **Details:**
    - Current status: "published"
    - Published URL
    - Number of leads captured
  - **Happens when:** You try to delete a published page without the force flag
  - **Fix:** Either:
    - Add force=true to confirm deletion, OR
    - Unpublish the page first (change status to draft), then delete

**Example:**
```
❌ Error!
Cannot delete published landing page

ID: 3
Title: "Contact Sales"
Status: Published
URL: https://innovateelectronics.com/lp/contact-sales
Leads captured: 23

This page is live and has captured leads. Are you sure you want to delete it?
To proceed, use force=true parameter.
```

**Permission denied:**
- **Error:** "Insufficient permissions. This action requires admin or editor role."
  - **Happens when:** A viewer tries to delete a page
  - **Fix:** Must be logged in as admin or editor

**Not logged in:**
- **Error:** "Authentication required"
  - **Fix:** Log in first

---

## 📊 Quick Reference: What Each Operation Does

| Operation | What It Does | Required Info | Who Can Do It |
|-----------|--------------|---------------|---------------|
| **Create** | Make a new draft landing page | Title, slug | Admin, Editor |
| **List** | See all landing pages (with filters) | Nothing (all optional) | Admin, Editor, Viewer |
| **Get** | See details of one page | Page ID | Admin, Editor, Viewer |
| **Update** | Change page content | Page ID + at least one field | Admin, Editor |
| **Publish** | Make page public (export to WordPress) | Page ID | Admin, Editor |
| **Delete** | Remove page permanently | Page ID | Admin, Editor |

---

## 🚨 Common Error Scenarios

### "I can't create/update/publish/delete"
**Possible causes:**
1. You're not logged in → Log in first
2. You're logged in as a viewer → Need to be admin or editor
3. Network issue → Try again

### "Slug already exists"
**Cause:** Another landing page already uses that slug
**Solution:** Choose a different slug (e.g., add year or make it more specific)

### "Page not found"
**Cause:** No landing page exists with that ID
**Solution:** Check the ID number, or use the List operation to find the correct ID

### "Cannot publish - missing required fields"
**Cause:** Page doesn't have minimum required information
**Solution:** Add the missing fields (usually title or email field in form)

### "WordPress publish failed"
**Cause:** WordPress is unreachable or returned an error
**Solution:**
1. Check WordPress site is working
2. Try again in a moment
3. Contact administrator if problem continues
4. Alternative: Disable WordPress and use DMAT-hosted URL instead

---

## ✅ Best Practices

### Creating landing pages
1. **Choose unique, descriptive slugs** - Use the page topic and maybe the year
   - Good: "free-marketing-guide-2025"
   - Bad: "guide", "page1", "test"

2. **Start with minimum required fields** - You can add more later
   - Required: Title, slug
   - Recommended: Also add headline, body text, CTA text

3. **Always include an email field in forms** - Required for lead capture
   - The system won't let you publish without it

### Publishing pages
1. **Review before publishing** - Check all content is correct
   - Pay attention to warnings about missing recommended fields

2. **Understand that published pages go live immediately**
   - Phase 1 doesn't have a staging/preview mode
   - Any edits to published pages are live instantly

3. **Test the form** - Make sure the form fields match what you want to collect

### Deleting pages
1. **Be careful with published pages** - They might have captured leads
2. **Check lead count first** - Use Get operation to see how many leads exist
3. **WordPress cleanup** - Remember to manually delete the WordPress page too

---

## 📚 Related Documentation

For technical details and JSON examples, see:
- [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md) - Complete technical API specification
- [Phase1-LandingPage-Schema.md](./Phase1-LandingPage-Schema.md) - Database field details
- [Phase1-LandingPage-Lifecycle.md](./Phase1-LandingPage-Lifecycle.md) - Status and state transitions
- [Phase1-User-Flows.md](./Phase1-User-Flows.md) - End-to-end workflows

---

**Document Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-03
**Maintained by:** DMAT Product Team
