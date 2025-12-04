# Phase 1 Protected vs Public Endpoints - Classification

**Version:** 1.0
**Date:** 2025-12-04
**Purpose:** Identify which API endpoints require authentication vs public access

---

## 📋 Overview

This document provides a clear classification of all DMAT API endpoints, identifying which require authentication (protected) and which allow public access. This serves as a reference for implementing authentication middleware.

**Key Principle:**
- **Protected** = Requires JWT token in Authorization header (admin operations)
- **Public** = No authentication required (visitor-facing operations)

**Related Documentation:**
- [Phase1-Security-Access-Control.md](./Phase1-Security-Access-Control.md) - Security and access control rules
- [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md) - Landing page admin API
- [Phase1-Lead-Capture-API.md](./Phase1-Lead-Capture-API.md) - Public lead capture API
- [Phase1-Leads-API-Integration.md](./Phase1-Leads-API-Integration.md) - Leads management API

---

## 🔒 Protected Endpoints (Require Authentication)

### Authentication Requirement

**All endpoints in this section require:**
- Valid JWT token in Authorization header
- Format: `Authorization: Bearer <jwt_token>`
- If missing/invalid → Return 401 Unauthorized
- If expired → Return 401 with `TOKEN_EXPIRED` code

---

### 1. Landing Page Admin APIs

**Base Path:** `/api/admin/landing-pages`

**Purpose:** Manage landing pages (CRUD operations + publish)

**Who Can Access:** Authenticated users only

---

#### 1.1 List Landing Pages

**Endpoint:** `GET /api/admin/landing-pages`

**Auth Required:** ✅ Yes

**Purpose:** View list of user's own landing pages

**Authorization Check:**
- Query filters by `created_by = current_user.id`
- Users only see their own landing pages

**Example Request:**
```
GET /api/admin/landing-pages?page=1&limit=25
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Without Auth:**
```
GET /api/admin/landing-pages

Response (401):
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

---

#### 1.2 Get Landing Page Details

**Endpoint:** `GET /api/admin/landing-pages/:id`

**Auth Required:** ✅ Yes

**Purpose:** View details of specific landing page

**Authorization Check:**
- User must own the landing page (`created_by = current_user.id`)
- If not owner → Return 403 Forbidden
- If doesn't exist → Return 404 Not Found

**Example Request:**
```
GET /api/admin/landing-pages/42
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### 1.3 Create Landing Page

**Endpoint:** `POST /api/admin/landing-pages`

**Auth Required:** ✅ Yes

**Purpose:** Create new landing page

**Authorization Check:**
- User must be authenticated
- New page automatically owned by current user

**Example Request:**
```
POST /api/admin/landing-pages
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Free Marketing Guide 2025",
  "slug": "free-marketing-guide-2025",
  "headline": "Download Your Free Guide",
  ...
}
```

---

#### 1.4 Update Landing Page

**Endpoint:** `PUT /api/admin/landing-pages/:id`

**Auth Required:** ✅ Yes

**Purpose:** Update existing landing page

**Authorization Check:**
- User must own the landing page
- If not owner → Return 403 Forbidden

**Example Request:**
```
PUT /api/admin/landing-pages/42
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Free Marketing Guide 2025 (Updated)",
  "headline": "Get Your Free Marketing Guide",
  ...
}
```

---

#### 1.5 Publish Landing Page

**Endpoint:** `POST /api/admin/landing-pages/:id/publish`

**Auth Required:** ✅ Yes

**Purpose:** Publish landing page (make publicly accessible)

**Authorization Check:**
- User must own the landing page
- If not owner → Return 403 Forbidden

**Example Request:**
```
POST /api/admin/landing-pages/42/publish
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "wordpress_enabled": true
}
```

---

#### 1.6 Delete Landing Page

**Endpoint:** `DELETE /api/admin/landing-pages/:id`

**Auth Required:** ✅ Yes

**Purpose:** Delete landing page

**Authorization Check:**
- User must own the landing page
- If not owner → Return 403 Forbidden

**Example Request:**
```
DELETE /api/admin/landing-pages/42
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 2. Leads Management APIs

**Base Path:** `/api/admin/leads`

**Purpose:** View and manage leads captured from landing pages

**Who Can Access:** Authenticated users only

---

#### 2.1 List Leads

**Endpoint:** `GET /api/admin/leads`

**Auth Required:** ✅ Yes

**Purpose:** View list of leads from user's landing pages

**Authorization Check:**
- Query filters by landing pages owned by user
- SQL: `WHERE landing_page_id IN (SELECT id FROM landing_pages WHERE created_by = current_user.id)`
- Users only see leads from their own pages

**Example Request:**
```
GET /api/admin/leads?page=1&limit=25&status=new
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### 2.2 Get Lead Details

**Endpoint:** `GET /api/admin/leads/:id`

**Auth Required:** ✅ Yes

**Purpose:** View details of specific lead

**Authorization Check:**
- Lead's landing page must be owned by user
- If not owner → Return 403 Forbidden
- If doesn't exist → Return 404 Not Found

**Example Request:**
```
GET /api/admin/leads/12847
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### 2.3 Update Lead Status

**Endpoint:** `PATCH /api/admin/leads/:id`

**Auth Required:** ✅ Yes

**Purpose:** Update lead's status (e.g., New → Contacted)

**Authorization Check:**
- Lead's landing page must be owned by user
- If not owner → Return 403 Forbidden

**Example Request:**
```
PATCH /api/admin/leads/12847
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "status": "contacted"
}
```

---

#### 2.4 Export Leads

**Endpoint:** `GET /api/admin/leads/export`

**Auth Required:** ✅ Yes

**Purpose:** Export leads to CSV file

**Authorization Check:**
- Only exports leads from user's landing pages
- Same filtering as list endpoint

**Example Request:**
```
GET /api/admin/leads/export?format=csv
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

#### 2.5 Delete Lead (Phase 2)

**Endpoint:** `DELETE /api/admin/leads/:id`

**Auth Required:** ✅ Yes

**Purpose:** Delete specific lead

**Authorization Check:**
- Lead's landing page must be owned by user
- If not owner → Return 403 Forbidden

**Example Request:**
```
DELETE /api/admin/leads/12847
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 3. Authentication APIs

**Base Path:** `/api/auth`

**Purpose:** User authentication (login/logout)

---

#### 3.1 Login

**Endpoint:** `POST /api/auth/login`

**Auth Required:** ❌ No (this is how users get the token)

**Purpose:** Authenticate user and return JWT token

**Example Request:**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

Response (200):
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2025-12-05T14:30:00Z"
  }
}
```

---

#### 3.2 Logout

**Endpoint:** `POST /api/auth/logout`

**Auth Required:** ⚠️ Optional (can be frontend-only)

**Purpose:** Invalidate user session

**Example Request:**
```
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Note:** Phase 1 can implement logout client-side only (clear token from storage). Phase 2 can add server-side token blacklisting.

---

#### 3.3 Register (Phase 2)

**Endpoint:** `POST /api/auth/register`

**Auth Required:** ❌ No

**Purpose:** Create new user account (self-service registration)

**Status:** Phase 2 feature

---

#### 3.4 Password Reset (Phase 2)

**Endpoints:**
- `POST /api/auth/forgot-password` - Request reset link
- `POST /api/auth/reset-password` - Reset with token

**Auth Required:** ❌ No

**Status:** Phase 2 feature

---

## 🌐 Public Endpoints (No Authentication Required)

### Authentication Requirement

**All endpoints in this section:**
- Do NOT require JWT token
- Accessible by anyone (anonymous visitors)
- May have rate limiting (to prevent abuse)
- May have CORS enabled (for cross-origin requests)

---

### 1. Lead Capture API

**Base Path:** `/api/public/leads`

**Purpose:** Submit lead capture forms from published landing pages

**Who Can Access:** Anyone (public visitors)

---

#### 1.1 Submit Lead

**Endpoint:** `POST /api/public/leads`

**Auth Required:** ❌ No

**Purpose:** Submit form data from published landing page

**Security Measures:**
- Rate limiting: 10 submissions/minute per IP
- CORS enabled (allow cross-origin from landing pages)
- Honeypot field (bot detection)
- Input validation and sanitization
- Verify landing page is published

**Example Request:**
```
POST /api/public/leads
Content-Type: application/json

{
  "landing_page_id": 42,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "company": "Acme Corporation",
  "message": "I'm interested in learning more...",
  "referrer_url": "https://www.google.com/search?q=marketing",
  "landing_url": "https://dmat-app.example.com/pages/free-guide.html",
  "user_agent": "Mozilla/5.0...",
  "website": ""
}

Response (201):
{
  "success": true,
  "message": "Thank you for your submission!",
  "data": {
    "lead_id": 12848
  }
}
```

**Rate Limit Exceeded:**
```
POST /api/public/leads
(11th request within 1 minute)

Response (429):
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many submissions. Please try again later."
  }
}
```

**Why Public:**
- Must be accessible from published landing pages
- Visitors are anonymous (no accounts)
- Form submission is the primary conversion action
- Rate limiting prevents abuse

---

### 2. Published Landing Pages (Optional)

**Base Path:** `/api/public/landing-pages/:slug` or direct file serving

**Purpose:** Serve published landing pages to visitors

**Who Can Access:** Anyone (public visitors)

---

#### Option A: Static File Serving (Recommended Phase 1)

**Endpoint:** Static files served by web server (Nginx, Apache, CDN)

**URLs:**
```
https://dmat-app.example.com/pages/free-marketing-guide.html
https://dmat-app.example.com/pages/product-demo-signup.html
```

**Auth Required:** ❌ No

**How It Works:**
- Publish action generates static HTML file
- File saved to public directory: `/public/pages/:slug.html`
- Web server serves file directly (no API call)
- Fast, cacheable, CDN-friendly

**Example:**
```
GET https://dmat-app.example.com/pages/free-marketing-guide.html

Response (200):
Content-Type: text/html

<!DOCTYPE html>
<html>
  <head>
    <title>Free Marketing Guide 2025</title>
  </head>
  <body>
    <h1>Download Your Free Guide</h1>
    <form action="https://api.dmat.com/api/public/leads">
      ...
    </form>
  </body>
</html>
```

---

#### Option B: Dynamic API Serving (Optional Phase 2)

**Endpoint:** `GET /api/public/landing-pages/:slug`

**Auth Required:** ❌ No

**Purpose:** Dynamically render landing page from database

**Example Request:**
```
GET /api/public/landing-pages/free-marketing-guide
Accept: text/html

Response (200):
Content-Type: text/html

<!DOCTYPE html>
<html>
  ...
</html>
```

**Why Optional:**
- More complex (requires server-side rendering)
- Slower than static files
- Useful for dynamic content (A/B testing, personalization)
- Phase 1: Static files are sufficient

**Authorization Check:**
- Landing page must be published (`publish_status = 'published'`)
- If draft/unpublished → Return 404 Not Found (not 403, don't reveal existence)

---

### 3. Health Check / Status

**Base Path:** `/api/health` or `/api/status`

**Purpose:** Check if API is running (for monitoring, load balancers)

---

#### 3.1 Health Check

**Endpoint:** `GET /api/health`

**Auth Required:** ❌ No

**Purpose:** Verify API is responsive

**Example Request:**
```
GET /api/health

Response (200):
{
  "status": "ok",
  "timestamp": "2025-12-04T14:30:00Z"
}
```

**Why Public:**
- Needed by monitoring tools
- Load balancers need unauthenticated health checks
- Doesn't expose sensitive data

---

## 📊 Summary Tables

### Protected Endpoints Summary

| Endpoint | Method | Purpose | Auth Required | Owner Check |
|----------|--------|---------|---------------|-------------|
| `/api/admin/landing-pages` | GET | List landing pages | ✅ | Created by user |
| `/api/admin/landing-pages/:id` | GET | Get landing page | ✅ | Owner only |
| `/api/admin/landing-pages` | POST | Create landing page | ✅ | Auto-owned |
| `/api/admin/landing-pages/:id` | PUT | Update landing page | ✅ | Owner only |
| `/api/admin/landing-pages/:id/publish` | POST | Publish landing page | ✅ | Owner only |
| `/api/admin/landing-pages/:id` | DELETE | Delete landing page | ✅ | Owner only |
| `/api/admin/leads` | GET | List leads | ✅ | From user's pages |
| `/api/admin/leads/:id` | GET | Get lead details | ✅ | From user's pages |
| `/api/admin/leads/:id` | PATCH | Update lead status | ✅ | From user's pages |
| `/api/admin/leads/export` | GET | Export leads | ✅ | From user's pages |
| `/api/admin/leads/:id` | DELETE | Delete lead | ✅ Phase 2 | From user's pages |

**Total Protected Endpoints:** 11

---

### Public Endpoints Summary

| Endpoint | Method | Purpose | Rate Limited | CORS |
|----------|--------|---------|--------------|------|
| `/api/public/leads` | POST | Submit form | ✅ 10/min | ✅ Enabled |
| `/pages/:slug.html` | GET | View published page | ❌ | ✅ Enabled |
| `/api/public/landing-pages/:slug` | GET | Get page (optional) | ❌ | ✅ Enabled |
| `/api/auth/login` | POST | User login | ⚠️ 5/min | ✅ Enabled |
| `/api/health` | GET | Health check | ❌ | ✅ Enabled |

**Total Public Endpoints:** 5

---

## 🛠️ Implementation Guidance

### Backend: Express.js Middleware

**Authentication Middleware:**

```javascript
// middleware/auth.js

const jwt = require('jsonwebtoken');

async function authenticateUser(req, res, next) {
  try {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer "

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check expiration (jwt.verify does this automatically)
    // If expired, jwt.verify throws TokenExpiredError

    // 4. Attach user to request
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    // 5. Continue to route handler
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Your session has expired. Please log in again.'
        }
      });
    }

    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authentication token'
      }
    });
  }
}

module.exports = { authenticateUser };
```

---

**Applying Middleware to Routes:**

```javascript
// routes/landingPages.js

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');

// All routes in this file require authentication
router.use(authenticateUser);

// Protected endpoints
router.get('/', getLandingPages);           // GET /api/admin/landing-pages
router.get('/:id', getLandingPageById);     // GET /api/admin/landing-pages/:id
router.post('/', createLandingPage);        // POST /api/admin/landing-pages
router.put('/:id', updateLandingPage);      // PUT /api/admin/landing-pages/:id
router.post('/:id/publish', publishPage);   // POST /api/admin/landing-pages/:id/publish
router.delete('/:id', deleteLandingPage);   // DELETE /api/admin/landing-pages/:id

module.exports = router;
```

```javascript
// routes/leads.js

const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');

// All routes in this file require authentication
router.use(authenticateUser);

// Protected endpoints
router.get('/', getLeads);                  // GET /api/admin/leads
router.get('/:id', getLeadById);            // GET /api/admin/leads/:id
router.patch('/:id', updateLeadStatus);     // PATCH /api/admin/leads/:id
router.get('/export', exportLeads);         // GET /api/admin/leads/export
router.delete('/:id', deleteLead);          // DELETE /api/admin/leads/:id (Phase 2)

module.exports = router;
```

```javascript
// routes/public.js

const express = require('express');
const router = express.Router();
const { rateLimiter } = require('../middleware/rateLimiter');

// Public endpoint - NO authentication middleware
router.post('/leads', rateLimiter, submitLead);  // POST /api/public/leads

module.exports = router;
```

```javascript
// server.js

const express = require('express');
const app = express();

// Public routes (no auth)
app.use('/api/public', require('./routes/public'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/health', require('./routes/health'));

// Protected routes (auth required)
app.use('/api/admin/landing-pages', require('./routes/landingPages'));
app.use('/api/admin/leads', require('./routes/leads'));

// Static file serving for published pages
app.use('/pages', express.static('public/pages'));
```

---

### Frontend: Route Guards

**React Router Example:**

```javascript
// components/PrivateRoute.js

import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Check token expiration (optional, API will also check)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expired = payload.exp * 1000 < Date.now();

    if (expired) {
      localStorage.removeItem('authToken');
      return <Navigate to="/login" replace />;
    }
  } catch (e) {
    // Invalid token format
    localStorage.removeItem('authToken');
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
```

```javascript
// App.js

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pages/:slug" element={<PublicLandingPage />} />

        {/* Protected routes */}
        <Route path="/admin/landing-pages" element={
          <PrivateRoute>
            <LandingPagesList />
          </PrivateRoute>
        } />

        <Route path="/admin/landing-pages/new" element={
          <PrivateRoute>
            <CreateLandingPage />
          </PrivateRoute>
        } />

        <Route path="/admin/landing-pages/:id/edit" element={
          <PrivateRoute>
            <EditLandingPage />
          </PrivateRoute>
        } />

        <Route path="/admin/leads" element={
          <PrivateRoute>
            <LeadsList />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🔍 Testing Checklist

### Protected Endpoints Tests

**For each protected endpoint:**

- [ ] ✅ Request with valid token → Success (200/201)
- [ ] ❌ Request without token → 401 Unauthorized
- [ ] ❌ Request with invalid token → 401 Unauthorized
- [ ] ❌ Request with expired token → 401 with TOKEN_EXPIRED
- [ ] ❌ Request with tampered token → 401 Unauthorized
- [ ] ❌ User A tries to access User B's resource → 403 Forbidden

**Specific Tests:**

```bash
# Valid request
curl -X GET https://api.dmat.com/api/admin/landing-pages \
  -H "Authorization: Bearer valid_token_here"
# Expected: 200 OK with data

# No token
curl -X GET https://api.dmat.com/api/admin/landing-pages
# Expected: 401 Unauthorized

# Invalid token
curl -X GET https://api.dmat.com/api/admin/landing-pages \
  -H "Authorization: Bearer invalid_token"
# Expected: 401 Unauthorized

# Expired token
curl -X GET https://api.dmat.com/api/admin/landing-pages \
  -H "Authorization: Bearer expired_token"
# Expected: 401 with TOKEN_EXPIRED code

# Access other user's resource
curl -X GET https://api.dmat.com/api/admin/landing-pages/99 \
  -H "Authorization: Bearer user_a_token"
# (Page 99 owned by User B)
# Expected: 403 Forbidden or 404 Not Found
```

---

### Public Endpoints Tests

**For each public endpoint:**

- [ ] ✅ Request without token → Success
- [ ] ✅ Request with token → Success (token optional, ignored)
- [ ] ✅ Cross-origin request → Success (CORS headers present)
- [ ] ❌ Rate limit exceeded → 429 Too Many Requests

**Specific Tests:**

```bash
# Submit lead (no token)
curl -X POST https://api.dmat.com/api/public/leads \
  -H "Content-Type: application/json" \
  -d '{"landing_page_id": 42, "name": "John Doe", "email": "john@example.com"}'
# Expected: 201 Created

# CORS headers present
curl -X OPTIONS https://api.dmat.com/api/public/leads \
  -H "Origin: https://external-site.com" \
  -H "Access-Control-Request-Method: POST"
# Expected: CORS headers in response

# Rate limit test (11 requests in 60 seconds)
for i in {1..11}; do
  curl -X POST https://api.dmat.com/api/public/leads \
    -H "Content-Type: application/json" \
    -d '{"landing_page_id": 42, "email": "test@example.com"}'
done
# Expected: First 10 succeed, 11th returns 429
```

---

## 📚 Related Documentation

- **Security & Access Control:** [Phase1-Security-Access-Control.md](./Phase1-Security-Access-Control.md)
- **Landing Page API:** [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md)
- **Lead Capture API:** [Phase1-Lead-Capture-API.md](./Phase1-Lead-Capture-API.md)
- **Leads API Integration:** [Phase1-Leads-API-Integration.md](./Phase1-Leads-API-Integration.md)

---

## ✅ Implementation Checklist

### Backend Setup
- [ ] Create authentication middleware (verify JWT)
- [ ] Apply middleware to all `/api/admin/*` routes
- [ ] Configure CORS for public endpoints
- [ ] Set up rate limiting for `/api/public/leads`
- [ ] Configure static file serving for `/pages/*`

### Endpoint Configuration
- [ ] Protected: Landing pages (6 endpoints)
- [ ] Protected: Leads (5 endpoints)
- [ ] Public: Lead capture (1 endpoint)
- [ ] Public: Published pages (static files)
- [ ] Public: Authentication (login)
- [ ] Public: Health check

### Frontend Setup
- [ ] Create PrivateRoute component (route guard)
- [ ] Apply to all `/admin/*` routes
- [ ] Store JWT token on login
- [ ] Include token in API requests (Authorization header)
- [ ] Handle 401 responses (redirect to login)
- [ ] Clear token on logout

### Testing
- [ ] Test all protected endpoints (with/without token)
- [ ] Test ownership checks (403 forbidden)
- [ ] Test public endpoints (no token required)
- [ ] Test rate limiting (429 too many requests)
- [ ] Test CORS (cross-origin requests work)
- [ ] Test expired token handling

---

**Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-04
**Maintained by:** DMAT Development Team
