# Phase 1 Success Criteria & Scope

**Version:** 1.0
**Date:** 2025-12-03
**Phase:** Phase 1 - Landing Page to Lead Capture (Core Flow)
**Team:** Bhavya, Pavan, Sharath
**Project Lead:** Deepa M

---

## 🎯 Phase 1 Goal

Deliver a **minimal but complete end-to-end flow** from landing page creation to lead capture, proving the core value proposition of DMAT.

---

## ✅ "Done for Phase 1" Definition

Phase 1 is considered **COMPLETE** when all of the following are true:

### 1. Marketer Can Create a Landing Page in DMAT
- ✅ Marketer can log into DMAT
- ✅ Marketer can access a "Create Landing Page" interface
- ✅ Marketer can enter:
  - Page title
  - Page slug/URL
  - Headline text
  - Body content (simple textarea)
  - Call-to-action (CTA) button text
  - Form fields configuration (name, email, phone)
- ✅ Marketer can save the landing page as a draft
- ✅ Marketer can preview the landing page before publishing

### 2. Landing Page Can Be Published
- ✅ Marketer can click "Publish" button
- ✅ Landing page is published to:
  - **Option A:** Test WordPress site via REST API, OR
  - **Option B:** Mock endpoint that simulates WordPress publish, OR
  - **Option C:** DMAT-hosted public page (if WordPress not ready)
- ✅ System confirms successful publish with a success message
- ✅ System provides a public URL to the published page
- ✅ Published page status changes from "draft" to "published"

### 3. Public Visitor Can See Page and Submit Form
- ✅ Public visitor (not logged in) can access the published page URL
- ✅ Page displays:
  - Headline
  - Body content
  - Lead capture form with fields (name, email, phone)
  - Submit button
- ✅ Visitor can fill out the form
- ✅ Visitor can click "Submit"
- ✅ Form validates required fields (name, email)
- ✅ Form shows success message after submission
- ✅ Form submission creates a new lead record in database

### 4. Lead Shows Up in DMAT Leads List Screen
- ✅ Marketer can navigate to "Leads" section in DMAT
- ✅ Marketer sees a list/table of all leads
- ✅ Lead submitted via landing page appears in the list
- ✅ Lead record shows:
  - Name
  - Email
  - Phone (if provided)
  - Source: "Landing Page - [Page Title]"
  - Date/time submitted
  - Status: "New"
- ✅ Marketer can click on a lead to view full details

---

## 🛤 Core User Journey (The Happy Path)

```
1. Marketer logs into DMAT
   ↓
2. Marketer clicks "Create Landing Page"
   ↓
3. Marketer fills in page details (title, content, CTA, form fields)
   ↓
4. Marketer clicks "Preview" to review
   ↓
5. Marketer clicks "Publish"
   ↓
6. System publishes page and returns public URL
   ↓
7. Marketer copies URL and shares with target audience
   ↓
8. Public visitor opens URL in browser
   ↓
9. Visitor sees landing page with form
   ↓
10. Visitor fills form (name, email, phone) and clicks Submit
   ↓
11. System saves lead to database
   ↓
12. Visitor sees "Thank you" success message
   ↓
13. Marketer goes to DMAT → Leads section
   ↓
14. Marketer sees new lead in the list
   ↓
15. ✅ PHASE 1 COMPLETE - End-to-end flow proven!
```

---

## 🔧 Technical Requirements

### Frontend (React)
- Landing page creation form
- Landing page preview component
- Leads list page with table/grid view
- Lead detail view
- Basic form validation
- Success/error messaging

### Backend (Node.js + Express)
- `POST /api/landing-pages` - Create landing page
- `PUT /api/landing-pages/:id` - Update landing page
- `POST /api/landing-pages/:id/publish` - Publish landing page
- `GET /api/landing-pages/:id/preview` - Preview landing page
- `POST /api/leads` - Submit lead (public endpoint, no auth required)
- `GET /api/leads` - Get all leads (authenticated)
- `GET /api/leads/:id` - Get lead details (authenticated)

### Database (PostgreSQL)
- `landing_pages` table (already exists)
  - Add `published_url` column if needed
  - Add `template_name` column (default: "simple-form")
- `leads` table (already exists)
  - Ensure `landing_page_id` foreign key relationship

### Publishing Options (Choose One)
**Option A: WordPress Integration (Preferred)**
- WordPress REST API endpoint configured
- Authentication token in .env
- Publish landing page as WordPress page
- Return WordPress page URL

**Option B: Mock WordPress (For Testing)**
- Mock endpoint that simulates successful publish
- Returns fake URL for testing
- Can be replaced with real WordPress later

**Option C: DMAT-Hosted Page (Fallback)**
- Public route in DMAT serves landing pages
- `GET /lp/:slug` - Public landing page view
- No WordPress dependency (can add later)

---

## ❌ Explicit Exclusions for Phase 1

### What We Will NOT Build in Phase 1:

#### Page Builder Features
- ❌ Drag-and-drop interface
- ❌ Block-based editor
- ❌ Multiple layout options
- ❌ Custom styling/theming options
- ❌ Image upload (use placeholder or hardcoded image URLs only)
- ❌ Video embedding
- ❌ Multiple page sections
- ❌ Advanced typography controls

#### Template & Design
- ❌ Multiple templates (only 1 simple template)
- ❌ Template customization
- ❌ Responsive design preview
- ❌ Mobile/tablet preview modes
- ❌ Custom CSS editor
- ❌ Brand color picker

#### Form Features
- ❌ Custom form fields (only name, email, phone)
- ❌ Conditional form logic
- ❌ Multi-step forms
- ❌ File uploads
- ❌ CAPTCHA/spam protection
- ❌ Form validation beyond basic required fields
- ❌ Custom thank-you pages
- ❌ Email notifications on form submission

#### Lead Management
- ❌ Lead scoring
- ❌ Lead assignment
- ❌ Lead status workflow automation
- ❌ Lead export (CSV)
- ❌ Lead filtering/search
- ❌ Lead bulk actions
- ❌ Lead deduplication
- ❌ Lead notes/comments

#### Analytics & Tracking
- ❌ Page view tracking
- ❌ Conversion rate calculations
- ❌ UTM parameter tracking
- ❌ Google Analytics integration
- ❌ Heatmaps
- ❌ A/B testing

#### Publishing Features
- ❌ Scheduled publishing
- ❌ Unpublish/take down page
- ❌ Edit after publish
- ❌ Version history
- ❌ SEO metadata editor
- ❌ Social media preview cards

---

## ✅ Acceptance Tests

Phase 1 passes when a team member (not the developer) can:

### Test 1: Create and Publish
1. Log into DMAT
2. Create a new landing page with title "Test Product Launch"
3. Add headline: "Download Our Free Guide"
4. Add body content: "Get our comprehensive guide to digital marketing"
5. Set CTA button text: "Get Free Guide"
6. Preview the page
7. Publish the page
8. Receive a public URL
9. **PASS:** All steps complete without errors

### Test 2: Submit Lead via Public Page
1. Open published page URL in incognito/private browser
2. Verify page displays correctly (headline, content, form)
3. Fill form with:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Phone: "555-1234"
4. Click Submit
5. See success message
6. **PASS:** Form submission succeeds

### Test 3: Lead Appears in DMAT
1. Log into DMAT as marketer
2. Navigate to Leads section
3. Verify "John Doe" appears in leads list
4. Verify lead shows:
   - Email: john@example.com
   - Phone: 555-1234
   - Source: Landing Page - Test Product Launch
   - Status: New
5. Click on lead to view details
6. **PASS:** All lead data is correct

### Test 4: Multiple Leads
1. Submit 3 more leads via public form
2. All 3 leads appear in DMAT Leads list
3. Each lead has unique ID
4. Leads are sorted by newest first
5. **PASS:** All leads captured correctly

---

## 📏 Success Metrics

Phase 1 is successful when:

- ✅ 100% of acceptance tests pass
- ✅ End-to-end flow works without manual database intervention
- ✅ No critical bugs in the core flow
- ✅ Page loads in < 3 seconds
- ✅ Form submission completes in < 2 seconds
- ✅ Code is committed to Git with clear commit messages
- ✅ Basic documentation exists for how to use the feature

---

## 🚫 Out of Scope Scenarios

These scenarios do NOT need to work in Phase 1:

- Editing a published landing page
- Deleting a landing page
- Creating multiple landing pages (one is enough to prove the flow)
- Lead editing or deletion
- User roles/permissions (assume admin user)
- Error recovery (e.g., what if WordPress is down)
- Input sanitization beyond basic XSS prevention
- Advanced email validation
- Phone number formatting
- Duplicate lead detection

---

## 📦 Deliverables

### Code
- [ ] Frontend: Landing page creation form component
- [ ] Frontend: Landing page preview component
- [ ] Frontend: Leads list component
- [ ] Frontend: Lead detail component
- [ ] Backend: Landing page CRUD API endpoints
- [ ] Backend: Lead creation public endpoint
- [ ] Backend: Lead list/detail API endpoints
- [ ] Database: Any schema updates needed

### Documentation
- [ ] This document (Phase1-Success-Criteria.md)
- [ ] Basic user guide: "How to create a landing page"
- [ ] API endpoint documentation for Phase 1 endpoints

### Testing
- [ ] Manual test script for acceptance tests
- [ ] Test data: Sample landing page and leads

---

## ⏱ Estimated Timeline

- **Development:** 1-2 weeks
- **Testing:** 2-3 days
- **Bug fixes:** 2-3 days
- **Total:** ~2-3 weeks

---

## 🎓 Key Principles for Phase 1

1. **Simple is better than complex** - Use the simplest solution that works
2. **Proven flow over features** - Prove the concept works end-to-end
3. **Hardcode when needed** - It's OK to hardcode template HTML for now
4. **Manual is fine** - No automation needed (e.g., no scheduled publishing)
5. **One is enough** - One template, one test page, one happy path
6. **Build for learning** - This phase teaches us what we need for Phase 2

---

## 🔄 What Comes After Phase 1

Once Phase 1 is complete and validated:

**Phase 2 Focus Areas:**
- Multiple landing page templates
- Edit published pages
- Lead filtering and search
- WordPress integration improvements
- Form field customization
- Basic analytics (page views, conversion rate)

---

## ✍️ Sign-off

Phase 1 is considered complete when:
- All acceptance tests pass
- Project lead (Deepa M) approves the demo
- Core user journey works without developer assistance

| Role | Name | Approved | Date |
|------|------|----------|------|
| Project Lead | Deepa M | _________ | _____ |
| Developer | Bhavya | _________ | _____ |
| Developer | Pavan | _________ | _____ |
| Developer | Sharath | _________ | _____ |

---

**Focus:** Deliver one complete, working end-to-end flow. Everything else can wait.

**Remember:** Phase 1 success = Landing page → Public form → Lead in DMAT. That's it!
