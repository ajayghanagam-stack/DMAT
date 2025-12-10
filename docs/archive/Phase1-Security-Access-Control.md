# Phase 1 Security & Access Control - Specification

**Version:** 1.0
**Date:** 2025-12-04
**Purpose:** Define authentication and authorization rules for DMAT Phase 1

---

## 📋 Overview

This document specifies who can do what in DMAT. It defines authentication requirements, authorization rules, and access control for all features.

**Phase 1 Approach: Keep It Simple**
- Two user types: **Authenticated Users** (logged-in admins) and **Public Visitors** (anonymous)
- No complex role system (all authenticated users have same permissions)
- Clear separation: Admin features require login, public pages don't

**Security Principles:**
- **Authentication First** - Verify identity before granting access
- **Public by Intent** - Only published landing pages and lead capture are public
- **Secure by Default** - Everything else requires authentication
- **No Lateral Access** - Users can only manage their own resources (Phase 2: team sharing)

---

## 👥 User Types

### 1. Authenticated Users (Logged-In Admins)

**Who They Are:**
- DMAT account holders who have logged in
- Identified by valid JWT (JSON Web Token)
- Typically: Marketing managers, content creators, business owners

**What They Can Do:**
- **Landing Pages:**
  - Create new landing pages
  - Edit their own landing pages
  - Publish/unpublish their own landing pages
  - Delete their own landing pages
  - View list of all their landing pages

- **Leads:**
  - View all leads captured by their landing pages
  - View detailed lead information
  - Update lead status (New → Contacted, etc.)
  - Export leads to CSV
  - Delete leads (Phase 2)

- **Account:**
  - Update their own profile
  - Change their own password
  - Log out

**What They Cannot Do:**
- Access other users' landing pages (Phase 1: single user, Phase 2: teams)
- Access other users' leads
- Access published landing pages through admin routes (use public URLs)
- Perform admin operations (Phase 2: admin role)

---

### 2. Public Visitors (Anonymous)

**Who They Are:**
- Anyone visiting a published landing page URL
- No account or login required
- Not tracked individually (only form submissions recorded)

**What They Can Do:**
- **View Published Landing Pages:**
  - Access any published landing page via public URL
  - Example: `https://dmat-app.example.com/pages/free-marketing-guide.html`

- **Submit Forms:**
  - Fill out and submit lead capture forms on published pages
  - Submit data to public lead capture API: `POST /api/public/leads`

**What They Cannot Do:**
- Access admin dashboard or any `/admin/*` routes
- View leads list or lead details
- Create, edit, or delete landing pages
- Access unpublished/draft landing pages
- Access other users' data

---

## 🔐 Authentication

### What is Authentication?

**Authentication** = Verifying who someone is (proving identity)

**In DMAT:**
- Users log in with email + password
- System returns JWT (JSON Web Token) if credentials valid
- Token proves identity for future requests

---

### Authentication Flow

**1. User Registration (Phase 1: Manual Setup, Phase 2: Self-Service)**

Phase 1 approach:
- Admin creates user accounts manually (backend script or database seed)
- Users receive credentials via email
- No public registration form

Phase 2 approach:
- Public registration page: `/register`
- User provides: Name, Email, Password
- Email verification required
- Account created automatically

---

**2. User Login**

**Frontend Route:** `/login`

**API Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 5,
      "name": "John Doe",
      "email": "user@example.com",
      "created_at": "2025-11-01T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": "2025-12-05T14:30:00Z"
  },
  "message": "Login successful"
}
```

**Response (Error - 401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

**Frontend Behavior:**
- Store token in `localStorage` or `sessionStorage`
- Store user info (name, email) in local state
- Redirect to `/admin/landing-pages` (dashboard)

---

**3. Authenticated Requests**

**All admin API requests must include JWT token:**

**Header Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example:**
```
GET /api/admin/landing-pages
Authorization: Bearer <jwt_token>
```

**Without Token:**
- API returns 401 Unauthorized
- Frontend redirects to `/login`

---

**4. Token Expiration**

**Token Lifetime:** 24 hours (configurable)

**When Token Expires:**
- API returns 401 Unauthorized with `TOKEN_EXPIRED` code
- Frontend shows message: "Your session has expired. Please log in again."
- Frontend redirects to `/login`
- After login, redirect back to intended page

**Token Refresh (Phase 2):**
- Implement refresh token mechanism
- Allows seamless token renewal without re-login

---

**5. User Logout**

**Frontend Route:** Logout button in header/sidebar

**API Endpoint:** `POST /api/auth/logout` (optional, can be frontend-only)

**Frontend Behavior:**
- Remove token from storage
- Clear user state
- Redirect to `/login`
- Show message: "You have been logged out successfully"

**Backend Behavior (Optional Phase 2):**
- Add token to blacklist (prevents reuse)
- Track logout timestamp

---

## 🛡️ Authorization

### What is Authorization?

**Authorization** = Deciding what someone can do (checking permissions)

**In DMAT:**
- After authentication proves identity, authorization checks permissions
- Example: "User 5 is logged in (authenticated), can they edit Landing Page 42? (authorization)"

---

### Authorization Rules

### Rule 1: Admin Routes Require Authentication

**Protected Routes:**
```
/admin/*
├── /admin/landing-pages
├── /admin/landing-pages/new
├── /admin/landing-pages/:id/edit
├── /admin/leads
└── /admin/settings
```

**Enforcement:**
- Frontend: Route guards check for valid token
- If no token → Redirect to `/login`
- If expired token → Show session expired message, redirect to `/login`

**Protected API Endpoints:**
```
/api/admin/*
├── GET    /api/admin/landing-pages
├── POST   /api/admin/landing-pages
├── GET    /api/admin/landing-pages/:id
├── PUT    /api/admin/landing-pages/:id
├── POST   /api/admin/landing-pages/:id/publish
├── DELETE /api/admin/landing-pages/:id
├── GET    /api/admin/leads
├── GET    /api/admin/leads/:id
├── PATCH  /api/admin/leads/:id
└── GET    /api/admin/leads/export
```

**Enforcement:**
- Backend: Middleware checks for valid JWT token
- If missing/invalid token → Return 401 Unauthorized
- If expired token → Return 401 with `TOKEN_EXPIRED` code

---

### Rule 2: Users Can Only Manage Their Own Resources

**Landing Pages:**

**Create:**
- Any authenticated user can create landing pages
- Created landing page is owned by that user (`created_by = user.id`)

**Read (List/View):**
- Users can only see their own landing pages
- SQL: `WHERE created_by = <current_user_id>`

**Update (Edit):**
- Users can only edit their own landing pages
- Backend checks: `landing_page.created_by === current_user.id`
- If not owner → Return 403 Forbidden

**Delete:**
- Users can only delete their own landing pages
- Backend checks: `landing_page.created_by === current_user.id`
- If not owner → Return 403 Forbidden

**Publish:**
- Users can only publish their own landing pages
- Backend checks: `landing_page.created_by === current_user.id`
- If not owner → Return 403 Forbidden

---

**Leads:**

**Read (List/View):**
- Users can only see leads from their own landing pages
- SQL: `WHERE landing_page_id IN (SELECT id FROM landing_pages WHERE created_by = <current_user_id>)`
- Leads from other users' pages are not visible

**Update (Status):**
- Users can only update leads from their own landing pages
- Backend checks: lead's landing page is owned by current user

**Export:**
- Users can only export leads from their own landing pages

**Delete (Phase 2):**
- Users can only delete leads from their own landing pages

---

### Rule 3: Public Endpoints Don't Require Authentication

**Public Routes:**
```
/pages/:slug.html
/pages/:slug
```

**Example URLs:**
```
https://dmat-app.example.com/pages/free-marketing-guide.html
https://dmat-app.example.com/pages/product-demo-signup.html
```

**Enforcement:**
- No authentication required
- Anyone can access published pages
- Draft/unpublished pages are NOT accessible (404 if accessed)

**Public API Endpoints:**
```
POST /api/public/leads
```

**Enforcement:**
- No authentication required
- Rate limiting applies (10 submissions/minute per IP)
- CORS enabled for cross-origin requests
- Security measures: Honeypot, bot detection, input sanitization

---

## 🔒 Access Control Matrix

### Landing Pages

| Action | Authenticated User | Public Visitor | Permission Check |
|--------|-------------------|----------------|------------------|
| **View List** | ✅ (Own pages only) | ❌ | User ID matches `created_by` |
| **View Details** | ✅ (Own pages only) | ❌ | User ID matches `created_by` |
| **Create** | ✅ | ❌ | Authenticated |
| **Edit** | ✅ (Own pages only) | ❌ | User ID matches `created_by` |
| **Publish** | ✅ (Own pages only) | ❌ | User ID matches `created_by` |
| **Delete** | ✅ (Own pages only) | ❌ | User ID matches `created_by` |
| **View Published** | ✅ (Via public URL) | ✅ | Published status = "published" |

---

### Leads

| Action | Authenticated User | Public Visitor | Permission Check |
|--------|-------------------|----------------|------------------|
| **View List** | ✅ (Own leads only) | ❌ | Lead's landing page owned by user |
| **View Details** | ✅ (Own leads only) | ❌ | Lead's landing page owned by user |
| **Update Status** | ✅ (Own leads only) | ❌ | Lead's landing page owned by user |
| **Export** | ✅ (Own leads only) | ❌ | Lead's landing page owned by user |
| **Delete** | ✅ Phase 2 (Own leads only) | ❌ | Lead's landing page owned by user |
| **Submit Form** | ✅ (Via public page) | ✅ | Landing page is published |

---

## 🚫 Error Responses

### 401 Unauthorized (Authentication Failed)

**When:**
- No token provided
- Invalid token (malformed, tampered)
- Expired token

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

**Or (Expired Token):**
```json
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Your session has expired. Please log in again."
  }
}
```

**Frontend Action:**
- Show error message
- Redirect to `/login`
- Store intended URL for post-login redirect

---

### 403 Forbidden (Authorization Failed)

**When:**
- User is authenticated but lacks permission
- User trying to access another user's resource

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You don't have permission to access this resource"
  }
}
```

**Example Scenario:**
- User A tries to edit Landing Page 42
- Landing Page 42 is owned by User B
- Backend checks: `landing_page.created_by (User B) !== current_user.id (User A)`
- Return 403 Forbidden

**Frontend Action:**
- Show error message: "You don't have permission to access this landing page"
- Redirect to landing pages list
- Don't expose that the resource exists (security)

---

## 🎯 Implementation: Backend Checks

### Middleware Pattern

**Authentication Middleware:**
```
Function: authenticateUser(req, res, next)

Steps:
1. Extract token from Authorization header
2. Verify token signature (JWT)
3. Check expiration
4. If valid → Attach user to req.user, call next()
5. If invalid → Return 401 Unauthorized
```

**Example Flow:**
```
Incoming Request: GET /api/admin/landing-pages
↓
Middleware: authenticateUser
  → Extract token
  → Verify token
  → Token valid? Attach user to req.user
  → Call next()
↓
Route Handler: getLandingPages
  → Access req.user.id
  → Query: WHERE created_by = req.user.id
  → Return results
```

---

**Authorization Helper Functions:**

```
Function: checkLandingPageOwnership(landingPageId, userId)

Steps:
1. Query database: SELECT created_by FROM landing_pages WHERE id = landingPageId
2. If not found → Return false
3. If created_by === userId → Return true
4. Else → Return false

Usage in Route:
1. User requests: PUT /api/admin/landing-pages/42
2. Extract landingPageId = 42 from URL
3. Extract userId from req.user.id (from auth middleware)
4. Check: checkLandingPageOwnership(42, userId)
5. If false → Return 403 Forbidden
6. If true → Proceed with update
```

---

### Database Queries with Access Control

**Landing Pages List:**
```sql
-- ✅ CORRECT: Only user's own pages
SELECT * FROM landing_pages
WHERE created_by = $1
ORDER BY created_at DESC;

-- ❌ WRONG: All pages (security issue)
SELECT * FROM landing_pages
ORDER BY created_at DESC;
```

**Leads List:**
```sql
-- ✅ CORRECT: Only leads from user's pages
SELECT l.* FROM leads l
INNER JOIN landing_pages lp ON l.landing_page_id = lp.id
WHERE lp.created_by = $1
ORDER BY l.created_at DESC;

-- ❌ WRONG: All leads (security issue)
SELECT * FROM leads
ORDER BY created_at DESC;
```

**Single Landing Page:**
```sql
-- ✅ CORRECT: Check ownership
SELECT * FROM landing_pages
WHERE id = $1 AND created_by = $2;

-- If result is empty → Either doesn't exist OR user doesn't own it
-- Return 404 (don't reveal existence to non-owners)
```

---

## 🌐 CORS (Cross-Origin Resource Sharing)

### Public Lead Capture Endpoint

**Endpoint:** `POST /api/public/leads`

**CORS Configuration:**
```
Access-Control-Allow-Origin: * (or specific domains)
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

**Why:**
- Published landing pages may be on different domains
- Form submissions are cross-origin requests
- CORS headers allow these requests

**Example:**
- Landing page published at: `https://dmat-app.example.com/pages/guide.html`
- Form submits to: `https://api.dmat.com/api/public/leads`
- CORS allows this cross-origin request

---

### Admin Endpoints

**Admin Endpoints:** `/api/admin/*`

**CORS Configuration:**
```
Access-Control-Allow-Origin: https://admin.dmat.com (specific origin only)
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

**Why:**
- More restrictive (specific origin only)
- Includes Authorization header for JWT
- Credentials allowed (cookies, if used)

---

## 🚨 Rate Limiting

### Public Lead Capture

**Endpoint:** `POST /api/public/leads`

**Rate Limit:** 10 submissions per minute per IP address

**Enforcement:**
- Track submissions by IP address
- If > 10 submissions in 60 seconds → Return 429 Too Many Requests

**Response (429 Too Many Requests):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many submissions. Please try again later."
  }
}
```

**Why:**
- Prevent spam/bot attacks
- Protect against DoS (Denial of Service)

---

### Admin Endpoints (Phase 2)

**Endpoints:** `/api/admin/*`

**Rate Limit:** 100 requests per minute per user

**Why:**
- Prevent abuse of admin APIs
- Protect server resources

---

## 🔐 Security Best Practices (Phase 1)

### 1. Password Security

**Requirements:**
- Minimum 8 characters
- Must include: uppercase, lowercase, number
- No common passwords (e.g., "password123")

**Storage:**
- NEVER store plain text passwords
- Use bcrypt hashing (cost factor: 10-12)
- Store hash in database

**Example (Pseudocode):**
```
Registration:
  password = "MySecurePass123"
  hash = bcrypt.hash(password, 10)
  database.save(email, hash)  // Save hash, not password

Login:
  input_password = "MySecurePass123"
  stored_hash = database.get(email).password_hash
  valid = bcrypt.compare(input_password, stored_hash)
  if valid → Generate JWT
```

---

### 2. JWT Token Security

**Token Generation:**
- Sign with strong secret key (32+ characters, random)
- Include minimal claims: user ID, email, expiration
- Set reasonable expiration (24 hours)

**Token Storage:**
- Frontend: `localStorage` or `sessionStorage`
- Never expose in URLs or logs
- Clear on logout

**Token Verification:**
- Verify signature on every request
- Check expiration
- Reject if tampered

---

### 3. Input Validation & Sanitization

**All User Input:**
- Validate format (email, phone, URLs)
- Sanitize to prevent XSS (remove script tags)
- Use parameterized queries to prevent SQL injection

**Examples:**
```
Email: Must match email regex
Phone: Must match phone format
Landing Page Slug: Only lowercase, numbers, hyphens
```

---

### 4. HTTPS Only

**All Communication:**
- Use HTTPS (TLS/SSL) for all requests
- Encrypt data in transit
- Prevent man-in-the-middle attacks

**Configuration:**
- Redirect HTTP → HTTPS
- Use valid SSL certificate (Let's Encrypt)

---

### 5. Secure Headers

**Response Headers:**
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

**Why:**
- Prevent XSS attacks
- Prevent clickjacking
- Enforce HTTPS
- Limit script sources

---

## 📝 Summary: Who Can Do What

### Authenticated Users (Logged-In)

**✅ CAN:**
- Create landing pages
- Edit their own landing pages
- Publish their own landing pages
- Delete their own landing pages
- View leads from their landing pages
- View lead details from their landing pages
- Update lead status from their landing pages
- Export leads from their landing pages
- Access admin dashboard

**❌ CANNOT:**
- Access other users' landing pages
- Access other users' leads
- Access unpublished pages via admin routes
- Bypass authentication

---

### Public Visitors (Anonymous)

**✅ CAN:**
- View published landing pages (via public URLs)
- Submit lead capture forms on published pages

**❌ CANNOT:**
- Access admin dashboard
- View leads list or details
- Create, edit, or delete landing pages
- Access draft/unpublished landing pages
- Access any `/admin/*` routes

---

## 🎯 Phase 1 vs Phase 2

### Phase 1 (Current)

**Authentication:**
- Email + password login
- JWT token (24-hour expiration)
- Manual user account creation

**Authorization:**
- Two user types: Authenticated, Public
- All authenticated users have same permissions
- Resource ownership: Users manage only their own resources

**Security:**
- HTTPS enforced
- Password hashing (bcrypt)
- Input validation/sanitization
- Rate limiting on public endpoints
- CORS configured

---

### Phase 2 (Future Enhancements)

**Authentication:**
- Self-service registration
- Email verification
- Password reset flow
- Refresh tokens (seamless renewal)
- OAuth (Google, Facebook login)
- Two-factor authentication (2FA)

**Authorization:**
- Role-based access control (Admin, Editor, Viewer)
- Team/workspace sharing
- Granular permissions (who can publish, export, etc.)
- API keys for integrations

**Security:**
- Advanced rate limiting (per endpoint)
- IP whitelisting
- Audit logs (who did what, when)
- Session management (force logout on all devices)
- Content Security Policy (CSP) enforcement

---

## 🧪 Testing Security

### Test Cases

**1. Authentication Tests:**
- ✅ Login with valid credentials → Success
- ❌ Login with invalid email → 401 Unauthorized
- ❌ Login with invalid password → 401 Unauthorized
- ❌ Access admin route without token → 401 Unauthorized
- ❌ Access admin route with expired token → 401 Unauthorized
- ❌ Access admin route with invalid token → 401 Unauthorized
- ✅ Logout → Token cleared, redirect to login

**2. Authorization Tests:**
- ✅ User A creates landing page → Success, owned by User A
- ✅ User A edits their own landing page → Success
- ❌ User A edits User B's landing page → 403 Forbidden
- ❌ User A deletes User B's landing page → 403 Forbidden
- ✅ User A views their own leads → Success
- ❌ User A views User B's leads → Not visible in list
- ✅ Public visitor views published page → Success
- ❌ Public visitor views draft page → 404 Not Found
- ❌ Public visitor accesses admin dashboard → Redirect to login

**3. Security Tests:**
- ❌ SQL injection attempt in form field → Sanitized, no effect
- ❌ XSS attempt in landing page body → Sanitized, no script execution
- ❌ Rate limit exceeded → 429 Too Many Requests
- ✅ HTTPS enforced → HTTP requests redirected to HTTPS
- ✅ Password stored as hash → Plain text not in database

---

## 📚 Related Documentation

- **Landing Page API:** [Phase1-LandingPage-API.md](./Phase1-LandingPage-API.md)
- **Lead Capture API:** [Phase1-Lead-Capture-API.md](./Phase1-Lead-Capture-API.md)
- **Leads API:** [Phase1-Leads-API-Integration.md](./Phase1-Leads-API-Integration.md)
- **Validation Rules:** [Phase1-Validation-Sanitization-Rules.md](./Phase1-Validation-Sanitization-Rules.md)

---

## ✅ Implementation Checklist

### Authentication
- [ ] Implement user registration (manual or self-service)
- [ ] Implement login endpoint (POST /api/auth/login)
- [ ] Generate JWT token on successful login
- [ ] Implement logout (clear token)
- [ ] Hash passwords with bcrypt (cost factor 10)
- [ ] Validate password strength on registration
- [ ] Handle token expiration (401 with TOKEN_EXPIRED)

### Authorization Middleware
- [ ] Create authentication middleware (verify JWT)
- [ ] Attach user to req.user on valid token
- [ ] Return 401 if token missing/invalid/expired
- [ ] Apply middleware to all /api/admin/* routes

### Resource Ownership
- [ ] Add created_by column to landing_pages table
- [ ] Filter landing pages by created_by in list query
- [ ] Check ownership before update/delete/publish
- [ ] Return 403 if user doesn't own resource
- [ ] Filter leads by landing page ownership

### Frontend Route Guards
- [ ] Check for token on admin route navigation
- [ ] Redirect to /login if no token
- [ ] Handle expired token (show message, redirect)
- [ ] Store intended URL for post-login redirect
- [ ] Clear token on logout

### Public Endpoints
- [ ] No authentication required for POST /api/public/leads
- [ ] No authentication for published page URLs
- [ ] Return 404 for unpublished pages (not 403)
- [ ] Configure CORS for public endpoints

### Rate Limiting
- [ ] Implement rate limiting on POST /api/public/leads
- [ ] Track by IP address (10 requests/minute)
- [ ] Return 429 if limit exceeded
- [ ] Optional: Rate limit admin endpoints (Phase 2)

### Security Headers
- [ ] Add security headers to all responses
- [ ] Configure HTTPS (redirect HTTP → HTTPS)
- [ ] Set up SSL certificate
- [ ] Configure CORS (restrictive for admin, open for public)

### Input Validation
- [ ] Validate all user input (frontend + backend)
- [ ] Sanitize input to prevent XSS
- [ ] Use parameterized queries (prevent SQL injection)
- [ ] Validate JWT token signature

### Testing
- [ ] Test login with valid/invalid credentials
- [ ] Test token expiration handling
- [ ] Test resource ownership checks (positive and negative)
- [ ] Test public access to published pages
- [ ] Test rate limiting enforcement
- [ ] Test security headers present
- [ ] Test HTTPS redirect
- [ ] Test XSS/SQL injection prevention

---

**Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-04
**Maintained by:** DMAT Security & Development Team
