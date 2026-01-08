# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DMAT (Digital Marketing Automation Tool) is an enterprise-grade marketing automation platform built for Innovate Electronics. It centralizes and automates digital marketing operations across WordPress, social media (LinkedIn), webinars, and SEO analytics.

**Tech Stack:**
- **Backend:** Node.js + Express.js (REST API)
- **Frontend:** React 18+ with Vite
- **Database:** PostgreSQL 14+
- **Object Storage:** MinIO (S3-compatible for images)
- **Authentication:** JWT-based with bcrypt
- **External APIs:** WordPress REST API, Google OAuth 2.0 (Search Console + Analytics), LinkedIn OAuth 2.0

## Essential Commands

### Development Workflow

**Start all services (requires 4 terminals):**

```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - PostgreSQL (Mac)
brew services start postgresql@14

# Terminal 4 - MinIO
./setup-minio.sh
```

**Frontend:**
```bash
cd frontend
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Backend:**
```bash
cd backend
node server.js       # Start server (http://localhost:5001)
npm run dev          # Start with nodemon (auto-reload)
```

**Database:**
```bash
# Run migrations (from project root)
psql -d dmat_dev -f backend/migrations/001_create_google_credentials_table.sql
psql -d dmat_dev -f backend/migrations/002_create_seo_tables.sql
psql -d dmat_dev -f backend/migrations/003_create_analytics_tables.sql
psql -d dmat_dev -f backend/migrations/004_create_linkedin_tables.sql

# Note: Core schema migrations are in database/migrations/ directory
# Additional feature migrations are in backend/migrations/ directory

# Connect to database
psql -d dmat_dev

# Check database connection
psql -d dmat_dev -c "SELECT COUNT(*) FROM users;"
```

**MinIO (Image Storage):**
```bash
# Start MinIO (automated setup)
./setup-minio.sh

# Access MinIO Console: http://localhost:9001
# Credentials: minioadmin / minioadmin123

# Check if MinIO is running
lsof -i :9000        # Mac
netstat -ano | findstr :9000  # Windows
```

## Architecture

### Backend Structure

The backend follows a layered architecture with clear separation of concerns:

**Request Flow:** Routes → Middleware → Controllers → Services → Database

```
backend/
├── server.js                    # Express app entry point, route mounting
├── src/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection pool
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   └── validation.js        # Request validation
│   ├── routes/                  # Express route definitions
│   │   ├── authRoutes.js        # Login, verify token
│   │   ├── landingPageRoutes.js # Landing page CRUD (admin)
│   │   ├── leadRoutes.js        # Lead management (admin)
│   │   ├── publicRoutes.js      # Public lead capture API
│   │   ├── googleOAuthRoutes.js # Google OAuth flow
│   │   ├── searchConsoleRoutes.js # Keyword tracking APIs
│   │   ├── ga4Routes.js         # Google Analytics APIs
│   │   ├── linkedinRoutes.js    # LinkedIn OAuth + posting
│   │   └── uploadRoutes.js      # MinIO image upload
│   ├── controllers/             # Request handlers, response formatting
│   │   ├── authController.js
│   │   ├── landingPageController.js
│   │   ├── leadController.js
│   │   ├── googleOAuthController.js
│   │   ├── searchConsoleController.js
│   │   ├── ga4Controller.js
│   │   └── linkedinPostController.js
│   ├── services/                # Business logic layer
│   │   ├── storage.js           # MinIO client initialization
│   │   ├── wordpress.js         # WordPress REST API client
│   │   ├── googleApi.js         # Google OAuth + API client
│   │   ├── searchConsoleService.js # Search Console data sync
│   │   ├── ga4Service.js        # GA4 analytics data
│   │   └── linkedinService.js   # LinkedIn API integration
│   └── models/                  # Database query functions (if present)
```

**Key Architecture Patterns:**

1. **Authentication Flow:**
   - Login: POST `/api/auth/login` → JWT token issued
   - All `/api/admin/*` routes require JWT in `Authorization: Bearer <token>` header
   - Public routes (`/api/public/*`, `/public/:slug`) have no authentication
   - Middleware: `auth.js` verifies JWT and injects `req.user`

2. **CORS Configuration:**
   - Admin routes: Restricted to `CORS_ORIGIN` (default: http://localhost:5173)
   - Public routes: Allow all origins (`*`) for lead capture and public pages
   - Implemented via dynamic CORS middleware in server.js based on request path

3. **OAuth Integration Pattern:**
   - Google OAuth: `/api/admin/google/oauth/authorize` → consent screen → `/api/admin/google/oauth/callback`
   - LinkedIn OAuth: `/api/admin/linkedin/oauth/login` → consent screen → `/api/admin/linkedin/oauth/callback`
   - Tokens stored encrypted in PostgreSQL (`google_oauth_tokens`, `linkedin_oauth_tokens`)
   - Automatic token refresh handled by service layer (googleApi.js, linkedinService.js)

4. **Image Upload Flow:**
   - Frontend → `POST /api/admin/upload/image` (multipart/form-data)
   - Multer processes file → MinIO client uploads to bucket
   - Returns public URL: `http://localhost:9000/dmat-images/{filename}`
   - URL stored in `landing_pages.hero_image_url`

5. **API Route Organization:**
   - All routes mounted in `server.js` with clear prefixes
   - Route files in `backend/src/routes/` (e.g., landingPageRoutes.js, leadRoutes.js)
   - Controllers in `backend/src/controllers/` handle request/response
   - Services in `backend/src/services/` contain business logic and external API calls
   - Database pool accessed via `backend/src/config/database.js`

### Frontend Structure

React SPA with context-based authentication:

```
frontend/src/
├── App.jsx                      # Router configuration
├── main.jsx                     # React entry point
├── context/
│   └── AuthContext.jsx          # JWT token management, auth state
├── components/
│   ├── Layout.jsx               # Admin layout with sidebar navigation
│   ├── ProtectedRoute.jsx       # Route guard for authenticated pages
│   └── ...                      # Reusable UI components
├── pages/                       # Route components
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── LandingPagesPage.jsx     # List all landing pages
│   ├── LandingPageFormPage.jsx  # Create/edit landing pages
│   ├── LeadsPage.jsx            # Lead management table
│   ├── GoogleAccountPage.jsx    # Google OAuth connection
│   ├── SEODashboardPage.jsx     # Keyword tracking dashboard
│   ├── LinkedInPage.jsx         # LinkedIn post publishing
│   └── PublicLandingPage.jsx    # Public-facing landing page viewer
└── services/
    └── api.js                   # Axios instance with JWT interceptor
```

**Key Frontend Patterns:**

1. **Authentication:**
   - `AuthContext` stores JWT in localStorage
   - `api.js` axios instance auto-includes `Authorization` header
   - `ProtectedRoute` redirects to `/login` if no token

2. **Navigation Structure:**
   - `/dashboard` - System overview
   - `/landing-pages` - Landing page management
   - `/landing-pages/new` - Create new landing page
   - `/landing-pages/:id/edit` - Edit landing page
   - `/landing-pages/:id/preview` - Preview landing page (no Layout wrapper)
   - `/leads` - Lead database
   - `/users` - User management
   - `/seo-dashboard` - Keyword tracking (Google Search Console)
   - `/linkedin` - LinkedIn post publishing
   - `/google-account` - Google OAuth connection management
   - `/p/:slug` - Public landing page viewer (no authentication)

### Database Schema

PostgreSQL database with the following key tables:

**Core Tables:**
- `users` - System users (admin login)
- `landing_pages` - Landing page content, supports:
  - `form_fields` (JSONB) - Dynamic custom form fields
  - `hero_image_url` (TEXT) - MinIO image URL
  - `ga4_property_id` (TEXT) - GA4 tracking ID
  - `wordpress_post_id`, `wordpress_url` - WordPress integration
- `leads` - Unified lead database with custom field responses (JSONB)
- `lead_notes` - Lead activity tracking

**SEO/Analytics Tables (Phase 3):**
- `google_oauth_tokens` - Encrypted OAuth tokens (access + refresh)
- `search_console_keywords` - Keyword performance data (impressions, clicks, CTR, position)
- `indexing_issues` - SEO indexing problems

**Social Media Tables (Phase 4):**
- `linkedin_oauth_tokens` - LinkedIn OAuth tokens
- `linkedin_posts` - Published post history

**Important Schema Details:**
- `landing_pages.form_fields` stores dynamic form configuration as JSON array
- `leads.custom_fields` stores user-submitted form responses as JSON object
- All timestamps use `TIMESTAMP WITH TIME ZONE`
- OAuth tokens are encrypted before storage in database
- Foreign keys with `ON DELETE CASCADE` for data integrity

### External Services Layer

**Service Files and Their Responsibilities:**

- `storage.js` - MinIO client initialization and bucket management
- `wordpress.js` - WordPress REST API client for publishing posts
- `googleApi.js` - Google OAuth 2.0 client and token management
- `searchConsoleService.js` - Google Search Console API data sync
- `ga4Service.js` - Google Analytics 4 data fetching
- `integratedAnalyticsService.js` - Combined analytics data aggregation
- `seoDashboardService.js` - SEO metrics and keyword tracking
- `linkedinService.js` - LinkedIn OAuth and UGC Posts API integration

**Key Service Patterns:**
- Services handle token refresh automatically
- All external API calls include error handling and retry logic
- Database operations use parameterized queries to prevent SQL injection
- Services return standardized response objects: `{ success, data, error }`

## Configuration

### Environment Variables

**Backend (.env):**
```env
PORT=5001                         # Backend server port (5000 conflicts with macOS)
DB_NAME=dmat_dev                  # PostgreSQL database name
JWT_SECRET=<random-secret>        # JWT signing key

# MinIO (required for image uploads)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_BUCKET=dmat-images

# Optional integrations (leave empty to disable)
WP_SITE_URL=                      # WordPress site URL
WP_USERNAME=                      # WordPress username
WP_APP_PASSWORD=                  # WordPress Application Password

GOOGLE_CLIENT_ID=                 # Google OAuth client ID
GOOGLE_CLIENT_SECRET=             # Google OAuth secret

LINKEDIN_CLIENT_ID=               # LinkedIn OAuth client ID
LINKEDIN_CLIENT_SECRET=           # LinkedIn OAuth secret
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_APP_NAME=DMAT
```

### Setup Checklist

1. **Database:** Create `dmat_dev` database and run migrations
   - Core schema: `database/migrations/` (e.g., 001_create_core_tables.sql)
   - Feature migrations: `backend/migrations/` (001-004 for Google, SEO, Analytics, LinkedIn)
2. **MinIO:** Run `./setup-minio.sh` to auto-setup image storage
3. **Backend:** Copy `.env.example` to `.env`, configure database credentials and API keys
4. **Frontend:** Copy `.env.example` to `.env`
5. **Default Login:** `admin` / `admin123`

## Feature Implementation Status

**Phase 1 (MVP) ✅ Complete:**
- Landing page builder (CRUD operations)
- Lead capture API (public form submission)
- Lead management (search, filter, CSV export)
- JWT authentication

**Phase 2 (Enhancements) ✅ Complete:**
- Custom form fields (dynamic field editor)
- Hero image uploads (MinIO integration)
- WordPress REST API publishing

**Phase 3 (SEO Engine) ✅ Complete:**
- Google OAuth 2.0 (Search Console + Analytics)
- Keyword tracking dashboard
- GA4 analytics integration
- Public landing pages with GA4 tracking

**Phase 4 (Social Publishing) ✅ Complete:**
- LinkedIn OAuth 2.0
- LinkedIn text post publishing
- Post history tracking

**Phase 5 (Next):**
- Multi-platform social (Facebook, Instagram, Twitter, YouTube)
- Post scheduling

## Common Development Tasks

### Adding New API Routes

1. Create route file in `backend/src/routes/`
2. Create controller in `backend/src/controllers/`
3. Create service in `backend/src/services/` (if business logic needed)
4. Mount route in `server.js`
5. Add authentication middleware if needed: `router.use(authenticateToken)`

### Adding New Frontend Pages

1. Create page component in `frontend/src/pages/`
2. Add route in `App.jsx` inside `<ProtectedRoute>` wrapper
3. Add navigation link in `Layout.jsx` sidebar
4. Create API service function in `frontend/src/services/api.js`

### Database Schema Changes

1. Determine if change is core schema or feature-specific
   - Core schema changes: `database/migrations/00X_description.sql`
   - Feature-specific changes: `backend/migrations/00X_description.sql`
2. Write SQL schema changes with proper indexes and foreign keys
3. Create rollback file: `00X_rollback_description.sql`
4. Test migration: `psql -d dmat_dev -f path/to/00X_description.sql`
5. Document in migration file with comments

## Important Notes

- **Port 5000 Conflict:** macOS uses port 5000 for AirPlay. Backend uses port 5001 by default.
- **MinIO Required:** Image upload features will fail if MinIO is not running.
- **JWT Storage:** Frontend stores JWT in `localStorage` - avoid storing sensitive data.
- **Public Routes:** Routes in `/api/public/*` and `/public/:slug` bypass authentication.
- **OAuth Tokens:** Stored encrypted in PostgreSQL, automatically refreshed by service layer.
- **Custom Fields:** Landing pages support dynamic form fields stored as JSONB.
- **WordPress Integration:** Optional, uses built-in WordPress REST API (no plugins needed).
- **Migration Locations:** Core schema in `database/migrations/`, feature-specific in `backend/migrations/`.
- **Environment Variables:** Backend uses `dotenv`, frontend uses Vite's `VITE_` prefix for env vars.
- **JSONB Fields:** `landing_pages.form_fields` and `leads.custom_fields` store dynamic form data as JSON.

## Testing

**Default Test Account:**
- Username: `admin`
- Password: `admin123`

**Public Landing Page URL Pattern:**
- Format: `http://localhost:5173/p/{slug}`
- Example: `http://localhost:5173/p/summer-sale-2024`

**API Health Check:**
```bash
curl http://localhost:5001/api/health
curl http://localhost:5001/api/db-check
```

## Common Debugging Scenarios

### Backend Not Connecting to Database
```bash
# Check PostgreSQL is running
brew services list | grep postgresql  # Mac
# Check connection with psql
psql -d dmat_dev -c "SELECT 1;"
# Verify credentials in backend/.env match PostgreSQL user/password
```

### Frontend Cannot Reach Backend
```bash
# Verify backend is running on correct port
curl http://localhost:5001/api/health
# Check CORS_ORIGIN in backend/.env matches frontend URL
# Check VITE_API_BASE_URL in frontend/.env is correct
```

### Image Upload Fails
```bash
# Verify MinIO is running
curl http://localhost:9000/minio/health/live
# Check MinIO credentials in backend/.env
# Verify bucket exists: http://localhost:9001 (minioadmin/minioadmin123)
```

### OAuth Integration Issues
```bash
# Google OAuth: Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in backend/.env
# LinkedIn OAuth: Check LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET
# Verify redirect URIs match exactly in OAuth console and .env
# Check database for stored tokens: SELECT * FROM google_oauth_tokens;
```

## Documentation

- Full project specification: `docs/DMAT.md`
- Testing scenarios: `docs/PHASE4_TESTING_SCENARIOS.md` (latest), archived: `docs/archive/PHASE1_PHASE2_PHASE3_TESTING_SCENARIOS.md`
- Setup guides:
  - `docs/setup/LINKEDIN_SETUP.md` - LinkedIn OAuth & posting (Phase 4)
  - `docs/setup/GOOGLE_SETUP.md` - Google OAuth, Search Console & Analytics (Phase 3)
  - `docs/setup/WORDPRESS_SETUP.md` - WordPress integration (Phase 2)
  - `docs/setup/MINIO_SETUP.md` - MinIO object storage (Phase 2)
