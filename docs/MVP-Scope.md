# DMAT - MVP Scope & Non-Goals Document

**Version:** 1.0
**Date:** November 28, 2025
**Team:** Bhavya, Pavan, Sharath
**Project Lead:** Deepa M
**Organization:** Innovate Electronics

---

## 📋 Document Purpose

This document defines the **Minimum Viable Product (MVP)** scope for DMAT. It clearly separates what WILL be built in the initial release from what will be deferred to future phases. This ensures the team stays focused and delivers a working product quickly.

---

## ✅ MVP SCOPE - What We WILL Build

### 1. Core Platform Infrastructure

#### 1.1 User Management (Basic)
- **IN SCOPE:**
  - User registration and login
  - JWT-based authentication
  - Basic role management (Admin, Editor, Viewer)
  - Password reset functionality
  - User profile management

- **OUT OF SCOPE (Future):**
  - OAuth/SSO integration
  - Two-factor authentication (2FA)
  - Advanced permission systems
  - User activity audit logs

---

#### 1.2 Dashboard & Navigation
- **IN SCOPE:**
  - Main dashboard with navigation menu
  - Overview cards showing key metrics
  - Responsive layout (desktop-first)
  - Basic data visualization (charts/graphs)

- **OUT OF SCOPE (Future):**
  - Customizable dashboards
  - Widget drag-and-drop
  - Mobile app
  - Dark mode
  - Multi-language support

---

### 2. WordPress Integration (Core Module)

#### 2.1 Basic Content Sync
- **IN SCOPE:**
  - Connect to WordPress site via REST API
  - Fetch existing posts and pages
  - View WordPress content in DMAT dashboard
  - Basic metadata display (title, excerpt, status, date)
  - Manual sync trigger

- **OUT OF SCOPE (Future):**
  - Real-time sync via webhooks
  - Bulk edit WordPress content
  - Media library management
  - Custom post type management
  - Yoast SEO integration

---

### 3. Landing Page Builder (Simplified)

#### 3.1 Basic Page Creation
- **IN SCOPE:**
  - Simple form-based landing page creator (not drag-and-drop)
  - Pre-defined templates (3-5 templates)
  - Basic text and image fields
  - Publish to WordPress as a page
  - Preview before publishing

- **OUT OF SCOPE (Future):**
  - Drag-and-drop block editor
  - Advanced styling options
  - A/B testing
  - Custom templates
  - Version history
  - Duplicate/clone pages

---

### 4. Lead Management System (Basic)

#### 4.1 Lead Database
- **IN SCOPE:**
  - Centralized lead database
  - Manual lead entry
  - Import leads from CSV
  - Basic lead information (name, email, phone, source, status)
  - Lead list view with search and filters
  - Export leads to CSV
  - Lead source tracking (WordPress forms, manual entry)

- **OUT OF SCOPE (Future):**
  - Lead scoring algorithms
  - Lead assignment/distribution
  - Lead lifecycle automation
  - Email integration
  - CRM integration (Zoho, HubSpot, Salesforce)
  - Duplicate detection AI
  - Lead enrichment services
  - EMS integration (defer to Phase 2)

---

### 5. Social Media Publishing (Limited Platforms)

#### 5.1 Basic Social Publishing
- **IN SCOPE:**
  - Connect to **2 platforms only**: LinkedIn + Facebook
  - Create and schedule posts (text + single image)
  - Content calendar view (monthly)
  - View scheduled posts
  - Edit/delete scheduled posts
  - Manual publish (post now)

- **OUT OF SCOPE (Future):**
  - Instagram, Twitter/X, YouTube publishing
  - Multiple images/carousel posts
  - Video uploads
  - Story/Reels support
  - Auto-generate UTM links
  - Social listening/monitoring
  - Engagement tracking (likes, comments, shares)
  - Post performance analytics
  - Media library
  - Team collaboration features
  - Post approval workflows

---

### 6. SEO & Analytics (Read-Only Insights)

#### 6.1 Basic SEO Monitoring
- **IN SCOPE:**
  - Connect to Google Search Console
  - View top 20 keywords and their rankings
  - View total clicks, impressions, CTR (last 30 days)
  - Simple data table display
  - Manual refresh

- **OUT OF SCOPE (Future):**
  - Google Analytics integration
  - SEO health scoring
  - Page-level SEO analysis
  - Broken link detection
  - Keyword recommendations
  - Competitor analysis
  - Indexing issue detection
  - SEO improvement suggestions
  - Historical trend charts

---

### 7. Basic Reporting (Manual)

#### 7.1 Simple Reports
- **IN SCOPE:**
  - Generate basic report (PDF) with:
    - Lead count by source
    - Social posts published count
    - Top 10 keywords from Search Console
    - Date range selector
  - Download report as PDF
  - Manual report generation (on-demand)

- **OUT OF SCOPE (Future):**
  - Automated scheduled reports
  - Email delivery
  - Custom report builder
  - Advanced analytics
  - Month-over-month comparisons
  - Executive summary reports
  - Report templates
  - Share reports via link

---

## ❌ NON-GOALS - What We Will NOT Build in MVP

### Deferred to Phase 2 or Later

#### Analytics & Insights
- ❌ Google Analytics integration
- ❌ Real-time analytics dashboard
- ❌ Conversion tracking
- ❌ Campaign attribution modeling
- ❌ Custom metrics and KPIs
- ❌ Predictive analytics

#### Advanced Social Media
- ❌ Instagram publishing
- ❌ Twitter/X publishing
- ❌ YouTube publishing
- ❌ Social media monitoring/listening
- ❌ Engagement metrics tracking
- ❌ Sentiment analysis
- ❌ Influencer tracking
- ❌ Social inbox

#### Advanced Landing Pages
- ❌ Drag-and-drop builder
- ❌ A/B testing
- ❌ Heatmaps
- ❌ Session recordings
- ❌ Advanced form builders
- ❌ Conditional logic
- ❌ Multi-step forms
- ❌ Pop-ups and exit intent

#### Advanced Lead Management
- ❌ AI-based lead scoring
- ❌ Lead nurturing automation
- ❌ Email campaigns
- ❌ SMS campaigns
- ❌ Lead assignment rules
- ❌ CRM integrations
- ❌ Sales pipeline management
- ❌ Lead activity timeline

#### Automation & Workflows
- ❌ Marketing automation workflows
- ❌ Trigger-based actions
- ❌ Drip campaigns
- ❌ Webhook automation
- ❌ Zapier integration

#### Advanced Reporting
- ❌ Automated scheduled reports
- ❌ Custom report builder
- ❌ White-label reports
- ❌ Data warehouse integration
- ❌ BI tool integration

#### EMS Integration
- ❌ Webinar platform integration
- ❌ Event registration sync
- ❌ Attendee tracking
- ❌ Webinar analytics

#### AI & Machine Learning
- ❌ AI copywriting
- ❌ Content recommendations
- ❌ Predictive lead scoring
- ❌ Image generation
- ❌ Chatbot

#### Advanced Features
- ❌ Multi-tenant architecture
- ❌ White-labeling
- ❌ API for third-party integrations
- ❌ Mobile app
- ❌ Browser extensions
- ❌ Slack/Teams integration
- ❌ Notification system

---

## 🎯 MVP Success Criteria

The MVP will be considered successful when:

1. ✅ Users can log in securely
2. ✅ WordPress content is visible in DMAT
3. ✅ Users can create and publish basic landing pages to WordPress
4. ✅ Leads can be entered, viewed, filtered, and exported
5. ✅ Social posts can be scheduled on LinkedIn and Facebook
6. ✅ Google Search Console data is visible
7. ✅ Basic PDF reports can be generated
8. ✅ System is stable and performs well with 100+ leads
9. ✅ All core workflows have been tested and documented

---

## 📊 MVP Feature Priority Matrix

| Feature | Priority | Complexity | MVP Status |
|---------|----------|------------|------------|
| User Authentication | HIGH | Low | ✅ INCLUDED |
| WordPress Sync | HIGH | Medium | ✅ INCLUDED |
| Basic Landing Pages | HIGH | Medium | ✅ INCLUDED |
| Lead Database | HIGH | Low | ✅ INCLUDED |
| Social Publishing (LinkedIn + Facebook) | HIGH | High | ✅ INCLUDED |
| Google Search Console | MEDIUM | Medium | ✅ INCLUDED |
| Basic Reports | MEDIUM | Medium | ✅ INCLUDED |
| Instagram/Twitter | MEDIUM | High | ❌ PHASE 2 |
| Google Analytics | MEDIUM | Medium | ❌ PHASE 2 |
| EMS Integration | MEDIUM | High | ❌ PHASE 2 |
| Lead Scoring | LOW | High | ❌ PHASE 3 |
| A/B Testing | LOW | High | ❌ PHASE 3 |
| AI Features | LOW | Very High | ❌ PHASE 4+ |

---

## 🔄 Scope Change Process

If new features are requested during MVP development:

1. **Evaluate:** Is it critical for MVP or can it wait?
2. **Document:** Add to "Future Enhancements" list
3. **Discuss:** Team meeting with Deepa M to decide
4. **Update:** Update this document with version control
5. **Communicate:** Notify all team members

**Golden Rule:** When in doubt, defer to Phase 2. Ship the MVP fast, iterate based on feedback.

---

## 📅 MVP Timeline Expectations

**Phase 0:** 1-2 weeks (Setup & Foundation)
**Phase 1-7:** 8-12 weeks (Feature Development)
**Testing & QA:** 2 weeks
**Total MVP Duration:** ~12-16 weeks

---

## 🚀 Post-MVP Roadmap

### Phase 2 (3 months after MVP)
- Instagram & Twitter integration
- Google Analytics integration
- EMS integration
- Advanced reporting

### Phase 3 (6 months after MVP)
- Lead scoring
- Email marketing
- A/B testing
- Advanced analytics

### Phase 4 (12 months after MVP)
- AI features
- CRM integrations
- Mobile app
- Advanced automation

---

## 📝 Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-11-28 | Initial MVP scope definition | DMAT Team |

---

## ✍️ Approval & Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Lead | Deepa M | _________ | _____ |
| Developer | Bhavya | _________ | _____ |
| Developer | Pavan | _________ | _____ |
| Developer | Sharath | _________ | _____ |

---

**Note:** This is a living document. It will be reviewed and updated as the project progresses. All changes require team consensus and project lead approval.

---

**Built with focus and clarity by the Innovate Electronics DMAT Team**
