# DMAT - Digital Marketing Automation Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)

Enterprise-grade marketing automation platform for centralizing and automating digital marketing operations across WordPress, social media, webinars, and SEO.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Database](#database)
- [Development](#development)
- [API Integrations](#api-integrations)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Quick Reference](#quick-reference)

---

## 🎯 Overview

DMAT is an enterprise-level platform designed to centralize and automate all digital marketing operations. It integrates with:

- Corporate WordPress Website
- Webinar / Event Management System (EMS)
- Social Media Platforms (LinkedIn, Facebook, Instagram, YouTube, X/Twitter)
- Google Analytics & Search Console

**Built for:** Innovate Electronics
**Team:** Bhavya, Pavan, Sharath
**Leadership:** Deepa M

---

### 📍 Current Status: Phase 3 Implementation Complete ✅

**Phase 1 (MVP)** - Fully implemented and functional:
- ✅ Landing Page Builder (admin interface + public pages)
- ✅ Lead Management System (capture + management)
- ✅ JWT Authentication & Security
- ✅ Complete React Frontend
- ✅ Node.js Backend APIs
- ✅ PostgreSQL Database with sample data

**Phase 2 (Enhancements)** - Fully implemented and functional:
- ✅ Custom Fields Editor (dynamic form fields for landing pages)
- ✅ Image Upload with MinIO (S3-compatible object storage)
- ✅ Real WordPress Integration (REST API publishing)
- ✅ Hero Image Management
- ✅ Enhanced Landing Page Features

**Phase 3 (SEO Engine)** - Fully implemented and functional:
- ✅ Google OAuth 2.0 Integration (Search Console + Analytics)
- ✅ Keyword Tracking & Performance Monitoring
- ✅ Google Analytics 4 (GA4) Dashboard
- ✅ Search Console Data Sync
- ✅ Keyword CSV Export
- ✅ Public Landing Page GA4 Tracking

**Ready for Production!** See [Phase 3 Implementation](#phase-3-implementation-) for details.

---

## 🚀 Quick Start

Get the full stack running (Frontend ↔ Backend ↔ Database ↔ MinIO):

> **📌 Platform Support:** This README includes specific instructions for both **Windows** and **Mac** users. Look for platform-specific sections throughout the guide.

**Quick Steps:**
1. **Setup Database:** Create PostgreSQL database `dmat_dev` and run migrations
   - [Mac/Linux Instructions](#2-database-setup)
   - [Windows Instructions](#2-database-setup)
2. **Setup MinIO:** Install and start MinIO for image uploads
   - Run `./setup-minio.sh` (automated setup)
3. **Setup Backend:** Install dependencies and configure `.env`
   - Platform-specific commands provided in [Backend Setup](#3-backend-setup)
4. **Setup Frontend:** Install dependencies and configure `.env`
   - Platform-specific commands provided in [Frontend Setup](#4-frontend-setup)
5. **Start All Services:** Run backend, frontend, and MinIO servers
   - See [Development](#development) for platform-specific startup commands
6. **Verify:** See "✅ All systems connected successfully!" in browser

When complete, you'll see:
- Backend Status: **ok** ✅
- Database Status: **ok** ✅
- MinIO Status: **ok** ✅
- Users in Database: **5** 📊

✅ **Full stack is ready!** See [Installation](#installation) for detailed platform-specific steps.

💡 **New to the project?** Check the [Quick Reference](#quick-reference) section for a command cheat sheet.

---

## ✨ Features

### Phase 1 Features (MVP) ✅

#### 1. Landing Page Builder
- Block-based editor for quick page creation
- Draft and publish workflow
- Preview before publishing
- Automatic URL slug generation
- SEO-friendly HTML output

#### 2. Lead Management System (LMS)
- Unified lead database from all sources
- Lead capture forms on landing pages
- Lead lifecycle tracking (status management)
- Search and filter capabilities
- CSV export functionality

#### 3. User Authentication & Security
- JWT-based authentication
- Role-based access control
- Protected admin routes
- Secure password handling

### Phase 2 Features (Enhancements) ✅

#### 1. Custom Fields Editor
- **Dynamic Form Fields:** Add unlimited custom fields to landing pages
- **Field Types:** Text, Email, Phone, Textarea, Select, Checkbox, Radio
- **Field Configuration:**
  - Set field labels and placeholders
  - Mark fields as required or optional
  - Reorder fields with drag-and-drop
  - Field validation rules
- **Real-time Preview:** See form changes instantly
- **Lead Data Capture:** Custom field responses stored with each lead

#### 2. Image Upload & Management
- **Hero Image Upload:** Add compelling visuals to landing pages
- **MinIO Integration:** S3-compatible object storage (100% free, open-source)
- **Image Features:**
  - Drag-and-drop upload interface
  - Image preview before publishing
  - Automatic image optimization
  - CDN-ready URLs
  - Replace or remove images easily
- **Supported Formats:** JPEG, PNG, WebP
- **Storage:** Self-hosted MinIO (no cloud costs)

#### 3. Real WordPress Integration
- **WordPress REST API:** Direct publishing to WordPress sites
- **100% FREE:** Uses built-in WordPress REST API (no plugins needed)
- **Features:**
  - One-click publish to WordPress
  - Application Password authentication (secure)
  - Automatic HTML conversion
  - Hero images included in WordPress posts
  - Custom form fields rendered in posts
  - SEO metadata preserved
- **Fallback:** DMAT-hosted URLs if WordPress not configured
- **Management:** Update or delete WordPress posts from DMAT

#### 4. Enhanced Landing Page Features
- Headline and subheading support
- Body text with rich content
- Call-to-action (CTA) button customization
- Responsive design (mobile-optimized)
- Form submission tracking

### Phase 3 Features (SEO Engine) ✅

#### 1. Google OAuth 2.0 Integration
- **Secure Authentication:** OAuth 2.0 flow for Google APIs
- **Multi-Service Access:** Single authentication for Search Console and Analytics
- **Token Management:** Automatic token refresh and storage
- **Connection Status:** Real-time OAuth connection monitoring
- **Easy Disconnect:** One-click account disconnection

#### 2. Google Search Console Integration
- **Website Verification:** Automatic detection of verified properties
- **Keyword Data Sync:** Pull search query performance data
- **Date Range Selection:** Flexible date range (7, 30, 90 days)
- **Performance Metrics:**
  - Search queries (keywords)
  - Impressions and clicks
  - Click-through rate (CTR)
  - Average ranking position
- **Data Storage:** PostgreSQL database with efficient indexing
- **API Endpoints:** RESTful APIs for keyword data access

#### 3. Keyword Tracking & Analytics
- **Top Performing Keywords:** Identify high-traffic search terms
- **Declining Keywords:** Track keywords losing position
- **Keyword Trends:** Historical position and CTR tracking
- **Search Filters:** Filter by keyword, URL, date range
- **Pagination:** Handle large keyword datasets efficiently
- **CSV Export:** Export keyword data with all metrics

#### 4. Google Analytics 4 (GA4) Integration
- **Property Selection:** List and select GA4 properties
- **Analytics Dashboard:** Comprehensive metrics visualization
  - Total users and sessions
  - Average session duration
  - Bounce rate
  - Page views
  - Traffic sources (source/medium)
  - Top pages performance
  - Conversion events tracking
- **Date Range Analysis:** Flexible date range selection
- **Real-time Data:** Pull latest analytics data on demand

#### 5. Landing Page GA4 Tracking
- **Auto-Initialization:** GA4 tracking code injection on public pages
- **Event Tracking:**
  - Page views
  - Form submissions
  - Lead captures
  - User interactions
- **Custom Events:** Track custom conversion goals
- **Privacy-Friendly:** Respects user privacy preferences

#### 6. Analytics & Keywords Pages
- **Keywords Page:** Dedicated UI for keyword performance monitoring
  - Top keywords card with sorting (clicks, impressions, CTR)
  - Declining keywords alert card
  - All keywords table with search
  - Data sync interface
  - CSV export button
- **Analytics Page:** Comprehensive GA4 analytics dashboard
  - Property selector
  - Date range picker
  - Metrics cards (users, sessions, duration, bounce rate)
  - Traffic sources chart
  - Top pages table
  - Google account connection status

### Future Features (Roadmap)

#### Phase 4+: Social Media Automation
- Multi-platform scheduling (LinkedIn, Facebook, Instagram, YouTube, X/Twitter)
- Centralized content calendar
- Performance metrics tracking
- Auto-generate UTM links

#### 7. Analytics Dashboard
- Unified view across all digital channels
- Interactive graphs and KPIs
- Campaign-wise breakdown
- Export capabilities

#### 8. Automated Reporting
- Weekly/monthly PDF reports
- Auto-email delivery to management
- Comprehensive performance summaries

---

## 🛠 Tech Stack

### Core Technologies (100% Open-Source & Free)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend** | Node.js + Express | REST API server |
| **Frontend** | React + Vite | User interface |
| **Database** | PostgreSQL | Data persistence |
| **Object Storage** | MinIO | S3-compatible image storage |
| **Queue System** | Redis + BullMQ | Background jobs & scheduling (Phase 3+) |
| **PDF Generation** | Puppeteer | Automated reports (Phase 6) |

### Phase 2 Additions

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Image Storage** | MinIO | Self-hosted S3-compatible object storage for hero images |
| **Image Upload** | Multer + MinIO Client | File upload handling and storage |
| **WordPress Integration** | WordPress REST API | Direct publishing to WordPress sites |
| **Authentication** | Application Passwords | Secure WordPress REST API authentication |

### Phase 3 Additions

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Google OAuth 2.0** | Google APIs Client Library | Secure authentication for Google services |
| **Search Console Integration** | Google Search Console API | Keyword tracking and search performance data |
| **Analytics Integration** | Google Analytics Data API (GA4) | Website analytics and user behavior tracking |
| **Analytics Admin** | Google Analytics Admin API | GA4 property management and configuration |
| **Token Storage** | PostgreSQL | Secure OAuth token storage and management |
| **SEO Database** | PostgreSQL | Keyword performance and indexing issue tracking |

### API Integrations

- **WordPress REST API** (Phase 2: Implemented ✅)
- **Google Search Console API** (Phase 3: Implemented ✅)
- **Google Analytics Data API (GA4)** (Phase 3: Implemented ✅)
- **Google Analytics Admin API** (Phase 3: Implemented ✅)
- LinkedIn Marketing API
- Meta Graph API (Facebook & Instagram)
- Twitter API v2
- YouTube Data API

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

#### Node.js >= 18.x
- **Windows:** Download installer from [nodejs.org](https://nodejs.org/) and run the .msi installer
- **Mac:** Download from [nodejs.org](https://nodejs.org/) or install via Homebrew: `brew install node`
- **npm** or **yarn** comes bundled with Node.js

#### PostgreSQL >= 14.x
- **Windows:** Download installer from [postgresql.org](https://www.postgresql.org/download/windows/) and follow the installation wizard
- **Mac:** Install via Homebrew: `brew install postgresql@14` or download from [postgresql.org](https://www.postgresql.org/download/macosx/)

#### MinIO (Phase 2 Requirement)
- **Automatic Setup:** Run `./setup-minio.sh` (recommended)
- **Manual Setup:** Download from [min.io/download](https://min.io/download)
- **Alternative:** Use Docker: `docker run -p 9000:9000 -p 9001:9001 minio/minio server /data --console-address ":9001"`

#### Git
- **Windows:** Download from [git-scm.com](https://git-scm.com/downloads)
- **Mac:** Install via Homebrew: `brew install git` or download from [git-scm.com](https://git-scm.com/downloads)

### Optional Tools
- **Docker** & **Docker Compose**
  - **Windows:** [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - **Mac:** [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- **Postman** (for API testing): [Download](https://www.postman.com/downloads/)

### Platform Comparison

| Aspect | Windows | Mac |
|--------|---------|-----|
| **Package Manager** | Manual downloads or Chocolatey | Homebrew (recommended) |
| **PostgreSQL User** | `postgres` (default) | System username |
| **PostgreSQL Password** | Set during installation | Usually empty (Homebrew) |
| **Default Port 5000** | Usually available | Blocked by AirPlay (use 5001) |
| **Shell Scripts** | Use PowerShell or WSL | Native Bash support |
| **MinIO Setup** | Run PowerShell as Admin | Native script execution |

---

## 🚀 Installation

### 1. Clone the Repository

#### Windows (Command Prompt or PowerShell)
```bash
git clone https://github.com/ajayghanagam-stack/DMAT.git
cd DMAT
```

#### Mac (Terminal)
```bash
git clone https://github.com/ajayghanagam-stack/DMAT.git
cd DMAT
```

### 2. Database Setup

#### Mac/Linux
```bash
# Using automated setup script (recommended)
chmod +x ./database/setup.sh
./database/setup.sh setup
```

#### Windows
```powershell
# Option 1: Manual setup using psql
# First, ensure PostgreSQL is installed and running
# Open Command Prompt or PowerShell as Administrator

# Create the database
psql -U postgres -c "CREATE DATABASE dmat_db;"

# Run the migration
psql -U postgres -d dmat_db -f database/migrations/001_initial_schema.sql
```

📖 **For detailed database setup, see:**
- [Database Setup Instructions](./database/README.md)

### 3. MinIO Setup (Phase 2 Requirement)

MinIO is required for image upload functionality.

#### Automated Setup (Recommended)
```bash
# Both Mac and Windows (from project root)
./setup-minio.sh
```

This script will:
- Download MinIO binary for your platform
- Create storage directory
- Start MinIO server on ports 9000 (API) and 9001 (Console)
- Create `dmat-images` bucket automatically
- Configure access credentials

#### Manual Setup
See [docs/setup/MINIO_SETUP.md](./docs/setup/MINIO_SETUP.md) for detailed instructions.

#### Verify MinIO Installation
```bash
# Check if MinIO is running
# Mac/Linux:
lsof -i :9000

# Windows:
netstat -ano | findstr :9000
```

Access MinIO Console at http://localhost:9001:
- **Username:** minioadmin
- **Password:** minioadmin123

### 4. Backend Setup

#### Windows
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file with your configuration
notepad .env
```

#### Mac
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env
# Or use any text editor: open -e .env
```

### 5. Frontend Setup

#### Windows
```bash
# Navigate to frontend directory
cd ..\frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file with your configuration
notepad .env
```

#### Mac
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
nano .env
# Or use any text editor: open -e .env
```

---

## ⚙️ Configuration

> **Port Configuration Note:**
> - **Mac Users:** The backend runs on port **5001** instead of 5000 because port 5000 is used by macOS ControlCenter on macOS Monterey and later.
> - **Windows Users:** Port 5000 is typically available. You can use either port 5000 or 5001 in the `.env` file.

### Backend Environment Variables (.env)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5001
API_BASE_URL=http://localhost:5001

# CORS
CORS_ORIGIN=http://localhost:5173

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dmat_db
# Mac: Use your system username (run 'whoami' to find it), password usually empty
# Windows: Use 'postgres' as default user, set password from installation
DB_USER=your_username
DB_PASSWORD=your_password  # Mac (Homebrew): usually empty or 'postgres'

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# MinIO Configuration (Phase 2 - Required for image uploads)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=dmat-images

# WordPress Integration (Phase 2 - Optional, 100% FREE)
# Leave empty to disable WordPress integration
# WP_SITE_URL=https://yoursite.com
# WP_USERNAME=your-wordpress-username
# WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx

# How to generate Application Password:
# 1. Login to WordPress admin
# 2. Go to Users → Profile
# 3. Scroll to "Application Passwords" section
# 4. Enter name (e.g., "DMAT") and click "Add New Application Password"
# 5. Copy the generated password (format: xxxx xxxx xxxx xxxx xxxx xxxx)

# Google OAuth Configuration (Phase 3 - Required for SEO features)
# See docs/setup/GOOGLE_SETUP.md for complete setup instructions
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:5001/api/admin/google/oauth/callback

# How to get Google OAuth credentials:
# 1. Go to Google Cloud Console (console.cloud.google.com)
# 2. Create a new project or select existing
# 3. Enable APIs: Search Console API, Analytics Data API, Analytics Admin API
# 4. Create OAuth 2.0 credentials (Web application)
# 5. Add authorized redirect URI: http://localhost:5001/api/admin/google/oauth/callback
# 6. Copy Client ID and Client Secret to .env file
# 7. See docs/setup/GOOGLE_SETUP.md for detailed step-by-step instructions
```

### Frontend Environment Variables (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5001
VITE_APP_NAME=DMAT
VITE_APP_VERSION=3.0.0
```

### WordPress Integration Setup (Optional)

WordPress integration is **100% FREE** and uses the built-in WordPress REST API (no plugins or costs).

**To enable WordPress publishing:**
1. Follow the guide in [docs/setup/WORDPRESS_SETUP.md](./docs/setup/WORDPRESS_SETUP.md)
2. Generate Application Password in your WordPress admin
3. Add credentials to `backend/.env`
4. Restart backend server

**Features when enabled:**
- One-click publish landing pages to WordPress
- Automatic HTML conversion with images and forms
- No monthly costs or API limits

See [docs/setup/WORDPRESS_SETUP.md](./docs/setup/WORDPRESS_SETUP.md) for complete setup instructions.

---

## 📁 Project Structure

```
DMAT/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   │   ├── analyticsController.js        # GA4 analytics (Phase 3)
│   │   │   ├── googleOAuthController.js      # Google OAuth (Phase 3)
│   │   │   ├── publicLandingPageController.js # Public pages (Phase 3)
│   │   │   └── searchConsoleController.js    # Search Console (Phase 3)
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   │   ├── analyticsRoutes.js            # GA4 routes (Phase 3)
│   │   │   ├── googleOAuthRoutes.js          # OAuth routes (Phase 3)
│   │   │   ├── publicLandingPageRoutes.js    # Public routes (Phase 3)
│   │   │   └── searchConsoleRoutes.js        # Search Console routes (Phase 3)
│   │   ├── services/        # Business logic
│   │   │   ├── wordpress.js                  # WordPress REST API (Phase 2)
│   │   │   ├── googleApi.js                  # Google APIs client (Phase 3)
│   │   │   ├── analyticsService.js           # GA4 service (Phase 3)
│   │   │   └── searchConsoleService.js       # Search Console service (Phase 3)
│   │   ├── middleware/      # Express middleware
│   │   └── utils/           # Helper functions
│   ├── .env.example         # Environment template
│   ├── package.json
│   └── server.js            # Entry point
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   │   ├── AnalyticsPage.jsx             # GA4 analytics dashboard (Phase 3)
│   │   │   ├── KeywordsPage.jsx              # Keyword tracking UI (Phase 3)
│   │   │   └── PublicLandingPage.jsx         # Public page viewer (Phase 3)
│   │   ├── services/        # API service calls
│   │   ├── context/         # Context providers
│   │   ├── utils/           # Helper functions
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── .env.example         # Environment template
│   └── package.json
│
├── database/                # Database setup & migrations
│   ├── migrations/          # SQL migration files
│   │   └── 001_initial_schema.sql
│   └── README.md            # Database setup guide
│
├── docs/                    # Documentation
│   ├── DMAT.md              # Project specification
│   ├── DMAT.docx            # Project specification (Word)
│   ├── TESTING_SCENARIOS.md        # UI testing guide (Phase 1 & 2)
│   ├── PHASE3_TESTING_SCENARIOS.md # UI testing guide (Phase 3)
│   ├── setup/                      # Setup guides
│   │   ├── GOOGLE_SETUP.md         # Google OAuth & API setup (Phase 3)
│   │   ├── WORDPRESS_SETUP.md      # WordPress integration guide (Phase 2)
│   │   └── MINIO_SETUP.md          # MinIO storage setup (Phase 2)
│   └── archive/                    # Phase 1 planning documents
│
├── bin/                     # Binaries (MinIO)
├── minio-storage/           # MinIO data storage (gitignored)
├── setup-minio.sh           # MinIO automated setup script
├── docker-compose.yml       # Docker setup (optional)
├── .gitignore
├── README.md                # This file
└── LICENSE
```

---

## 💻 Development

### Starting the Development Servers

You need **4 services** running for full Phase 2 functionality:

#### Terminal 1 - Backend Server
```bash
cd backend
node server.js
# Runs on http://localhost:5001
```

#### Terminal 2 - Frontend Server
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

#### Terminal 3 - PostgreSQL Database
```bash
# Mac:
brew services start postgresql@14

# Windows:
net start postgresql-x64-14
```

#### Terminal 4 - MinIO Server
```bash
# From project root
./setup-minio.sh
# API: http://localhost:9000
# Console: http://localhost:9001
```

### Accessing the Application

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend UI** | http://localhost:5173 | admin / admin123 |
| **Backend API** | http://localhost:5001/api/health | N/A |
| **MinIO Console** | http://localhost:9001 | minioadmin / minioadmin123 |

### Available Scripts

#### Backend
```bash
node server.js       # Start server
npm test             # Run tests (if configured)
```

#### Frontend
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🔌 API Integrations

### 1. WordPress Setup (Phase 2 - Implemented ✅)

**100% FREE** - Uses built-in WordPress REST API (no plugins or costs)

1. Generate Application Password in WordPress admin
2. Add credentials to `backend/.env`:
   ```env
   WP_SITE_URL=https://yoursite.com
   WP_USERNAME=your-username
   WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
   ```
3. Restart backend server
4. Test connection via admin panel

📖 **Complete guide:** [docs/setup/WORDPRESS_SETUP.md](./docs/setup/WORDPRESS_SETUP.md)

### 2. MinIO Setup (Phase 2 - Implemented ✅)

**100% FREE** - Self-hosted S3-compatible object storage

1. Run automated setup: `./setup-minio.sh`
2. Or follow manual setup in [docs/setup/MINIO_SETUP.md](./docs/setup/MINIO_SETUP.md)
3. Access console at http://localhost:9001
4. Bucket `dmat-images` created automatically

### 3. Google APIs Setup (Phase 3 - Implemented ✅)

**100% FREE** - Uses Google Cloud APIs for Search Console & Analytics

**Prerequisites:**
- Google Account with access to Search Console and/or Analytics
- Website verified in Google Search Console
- GA4 property configured in Google Analytics

**Setup Steps:**

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable required APIs:
     - Google Search Console API
     - Google Analytics Data API
     - Google Analytics Admin API

2. **Configure OAuth 2.0:**
   - Create OAuth 2.0 credentials (Web application)
   - Add authorized redirect URI: `http://localhost:5001/api/admin/google/oauth/callback`
   - Configure OAuth consent screen
   - Add scopes:
     - `https://www.googleapis.com/auth/webmasters.readonly`
     - `https://www.googleapis.com/auth/analytics.readonly`

3. **Update Backend Environment:**
   ```env
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5001/api/admin/google/oauth/callback
   ```

4. **Restart Backend Server:**
   ```bash
   cd backend && npm start
   ```

5. **Connect Google Account:**
   - Login to DMAT admin panel
   - Navigate to Analytics page
   - Click "Connect Google Account"
   - Authorize access to Search Console and Analytics

6. **Start Using:**
   - **Keywords Page:** Select site → Sync keyword data → View top/declining keywords → Export CSV
   - **Analytics Page:** Select GA4 property → Load analytics → View metrics dashboard

📖 **Complete step-by-step guide:** [docs/setup/GOOGLE_SETUP.md](./docs/setup/GOOGLE_SETUP.md)

**Features Enabled:**
- ✅ Keyword performance tracking from Search Console
- ✅ Website analytics from GA4
- ✅ Traffic source analysis
- ✅ Top/declining keywords monitoring
- ✅ CSV export of keyword data
- ✅ Public landing page GA4 tracking

---

## 📊 Database

DMAT uses PostgreSQL with a well-structured relational schema. Core tables include:

**Phase 1 & 2 Tables:**
- `users` - System users with role-based access
- `landing_pages` - Landing page content and metadata
  - Supports custom `form_fields` JSON (Phase 2)
  - Stores `hero_image_url` for MinIO images (Phase 2)
  - Stores `ga4_property_id` for analytics tracking (Phase 3)
  - WordPress integration fields: `wordpress_post_id`, `wordpress_url`
- `leads` - Unified lead database from all sources
  - Captures custom form field responses

**Phase 3 Tables (SEO Engine):**
- `google_oauth_tokens` - Secure storage for Google OAuth tokens
  - Access tokens and refresh tokens
  - Token expiration tracking
  - User-specific token isolation
- `search_console_keywords` - Keyword performance data
  - Search queries and URLs
  - Impressions, clicks, CTR, position metrics
  - Date-based tracking for historical analysis
  - Indexed for fast querying
- `indexing_issues` - SEO indexing problems (future use)
  - URL and issue type tracking
  - Severity levels
  - Status management

📖 **For complete database documentation:**
- **[Database Setup Guide](./database/README.md)** - Setup instructions and migration commands

---

## 📚 Documentation

### Project Documentation
- **[DMAT Project Specification](./docs/DMAT.md)** - Complete project overview (Word version: DMAT.docx)
- **[Testing Scenarios - Phase 1 & 2](./docs/TESTING_SCENARIOS.md)** - 50+ UI test scenarios
- **[Testing Scenarios - Phase 3](./docs/PHASE3_TESTING_SCENARIOS.md)** - 55+ UI test scenarios for SEO Engine

### Setup Guides
**Phase 2:**
- **[WordPress Setup Guide](./docs/setup/WORDPRESS_SETUP.md)** - WordPress REST API integration setup
- **[MinIO Setup Guide](./docs/setup/MINIO_SETUP.md)** - S3-compatible object storage setup

**Phase 3:**
- **[Google Setup Guide](./docs/setup/GOOGLE_SETUP.md)** - Google OAuth, Search Console & Analytics setup

### Phase 1, 2 & 3 Implementation ✅

**Phase 1 (MVP) - COMPLETE** - Landing page builder and lead management
**Phase 2 (Enhancements) - COMPLETE** - Custom fields, image uploads, WordPress integration
**Phase 3 (SEO Engine) - COMPLETE** - Google Analytics, Search Console, Keyword tracking

**What's Working:**
- ✅ Complete authentication flow (login, JWT tokens, protected routes)
- ✅ Landing page CRUD operations (create, edit, publish, delete, preview)
- ✅ **Custom form fields** (add/edit/reorder dynamic fields)
- ✅ **Hero image uploads** (via MinIO S3-compatible storage)
- ✅ **Real WordPress publishing** (REST API integration)
- ✅ **Google OAuth integration** (Search Console + Analytics)
- ✅ **Keyword tracking & analytics** (Search Console data sync)
- ✅ **GA4 analytics dashboard** (users, sessions, traffic sources)
- ✅ **Public landing pages** (SEO-friendly with GA4 tracking)
- ✅ **CSV export** (keywords and leads data)
- ✅ Lead capture API (public form submission with validation)
- ✅ Lead management (view, filter, search, update status, export CSV)
- ✅ Responsive UI with gradient design
- ✅ 100+ test scenarios documented

**Quick Start:**
1. Login at http://localhost:5173 (Credentials: `admin` / `admin123`)
2. **Connect Google Account** (Analytics page → Connect Google Account)
3. **Sync keyword data** (Keywords page → Select site → Sync Data)
4. **View GA4 analytics** (Analytics page → Select property → Load Analytics)
5. Create landing page with custom fields and GA4 tracking
6. Upload hero image
7. Preview and publish (to WordPress if configured)
8. View public landing page at /p/your-slug
9. View captured leads with custom field responses
10. Export keyword and lead data to CSV

---

### Phase 1 Planning Documents (Reference) 📋

All Phase 1 planning documents have been moved to `docs/archive/` for reference.

---

## 🗺 Roadmap

### Phase 1 - MVP ✅ COMPLETE
**Landing Page Builder & Lead Management - Fully Implemented**

All features implemented and functional:
- ✅ Landing page admin APIs (create, list, edit, publish, delete, preview)
- ✅ Lead capture API (public form submission with validation)
- ✅ Lead management APIs (list, get, update status, export CSV)
- ✅ Frontend UI (landing page list, form, preview, leads management)
- ✅ JWT authentication & protected routes
- ✅ Security & access control implemented
- ✅ PostgreSQL database with sample data
- ✅ Responsive design (mobile & desktop)

**Status:** ✅ Production Ready

---

### Phase 2 - Enhancements & Integrations ✅ COMPLETE
**Advanced Features & WordPress Integration**

All features implemented and functional:
- ✅ **Custom Fields Editor** - Dynamic form fields for landing pages
  - Add/edit/delete/reorder custom fields
  - Multiple field types (text, email, phone, textarea, select, etc.)
  - Field validation and required/optional configuration
  - Real-time preview of form changes
- ✅ **Image Upload with MinIO** - S3-compatible object storage
  - Hero image upload to landing pages
  - Self-hosted MinIO server (100% free)
  - Image preview and management
  - CDN-ready URLs
- ✅ **Real WordPress Integration** - REST API publishing
  - One-click publish to WordPress
  - Application Password authentication
  - Automatic HTML conversion
  - Hero images and custom forms included
  - Update/delete WordPress posts
  - 100% free (built-in WordPress REST API)
- ✅ **Enhanced Landing Pages**
  - Headline and subheading
  - Body text support
  - Custom CTA buttons
  - SEO-friendly output

**Status:** ✅ Production Ready

---

### Phase 3 - SEO Engine ✅ COMPLETE
**Google Analytics, Search Console & Keyword Tracking**

All features implemented and functional:
- ✅ **Google OAuth 2.0 Integration** - Secure authentication flow
  - OAuth consent screen configuration
  - Token storage and refresh
  - Connection status monitoring
  - Easy account disconnection
- ✅ **Google Search Console Integration** - Keyword tracking
  - Website verification detection
  - Search query performance data sync
  - Flexible date range selection (7, 30, 90 days)
  - Metrics: impressions, clicks, CTR, position
  - PostgreSQL storage with efficient indexing
- ✅ **Keyword Analytics** - Performance monitoring
  - Top performing keywords dashboard
  - Declining keywords alerts
  - Keyword trends and historical tracking
  - Advanced search and filtering
  - CSV export with all metrics
- ✅ **Google Analytics 4 Integration** - Website analytics
  - GA4 property selection
  - Comprehensive metrics dashboard
  - Traffic source analysis
  - Top pages performance
  - Conversion event tracking
- ✅ **Public Landing Pages** - SEO-optimized pages
  - Dynamic route (/p/:slug)
  - SEO meta tags (title, description, keywords)
  - GA4 tracking code injection
  - Event tracking (page views, form submissions, leads)
  - Responsive design
- ✅ **Analytics & Keywords Pages** - Dedicated UI
  - Keywords page with top/declining cards
  - Analytics dashboard with metrics visualization
  - Data sync interface
  - Export capabilities

**Status:** ✅ Production Ready

---

### Phase 4 - Social Publishing (NEXT)
- Post composer
- Content calendar
- Multi-channel scheduler (LinkedIn, Facebook, Instagram, YouTube, X/Twitter)

### Phase 5 - Analytics Dashboard
- Unified metrics
- Visualization engine
- Campaign performance tracking

### Phase 6 - Reporting Engine
- PDF generator (Puppeteer)
- Scheduled reporting
- Email delivery to management

### Phase 7 - Testing & Deployment
- QA testing
- User training
- Production launch

---

## 🔮 Future Enhancements

- AI-based copywriting & post generation
- Predictive lead scoring models
- Integrated email marketing automation
- CRM integration (Zoho, HubSpot, Salesforce)
- Competitor performance monitoring
- Marketing attribution AI

---

## 🔧 Troubleshooting

### Common Issues

#### MinIO Not Starting
```bash
# Check if port 9000 is in use
# Mac:
lsof -i :9000

# Windows:
netstat -ano | findstr :9000

# Kill process if needed
# Mac:
kill -9 <PID>

# Windows:
taskkill /PID <PID> /F

# Restart MinIO
./setup-minio.sh
```

#### Image Upload Failing
```bash
# Verify MinIO is running
curl http://localhost:9000/minio/health/live
# Should return: 200 OK

# Check MinIO console
open http://localhost:9001
# Login: minioadmin / minioadmin123
# Verify 'dmat-images' bucket exists
```

#### WordPress Publishing Error
```bash
# Test WordPress connection
curl -X GET http://localhost:5001/api/admin/wordpress/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Check credentials in backend/.env
# Verify WordPress site is accessible
# See docs/setup/WORDPRESS_SETUP.md for troubleshooting
```

#### PostgreSQL Connection Issues
```bash
# Mac:
brew services list
brew services start postgresql@14

# Windows:
sc query postgresql-x64-14
net start postgresql-x64-14
```

#### Port 5000 Already in Use (Mac AirPlay)
```bash
# Option 1: Disable AirPlay Receiver
# System Preferences → Sharing → Uncheck "AirPlay Receiver"

# Option 2: Use port 5001 (already configured in .env.example)
```

---

## 📖 Quick Reference

### Essential Commands

#### Starting Services

| Service | Command |
|---------|---------|
| **PostgreSQL** (Mac) | `brew services start postgresql@14` |
| **PostgreSQL** (Windows) | `net start postgresql-x64-14` |
| **Backend** | `cd backend && node server.js` |
| **Frontend** | `cd frontend && npm run dev` |
| **MinIO** | `./setup-minio.sh` |

#### MinIO Commands

```bash
# Start MinIO
./setup-minio.sh

# Check if running
lsof -i :9000        # Mac
netstat -ano | findstr :9000  # Windows

# Access console
open http://localhost:9001
```

#### Database Operations

```bash
# Connect to database (Mac)
psql -d dmat_db

# Connect to database (Windows)
psql -U postgres -d dmat_db

# Run migrations
psql -d dmat_db -f database/migrations/001_initial_schema.sql
```

---

### First-Time Setup Checklist

- [ ] Install Node.js >= 18.x
- [ ] Install PostgreSQL >= 14.x
- [ ] Install Git
- [ ] Clone the repository
- [ ] Create PostgreSQL database `dmat_db`
- [ ] Run database migrations
- [ ] **Setup MinIO** (`./setup-minio.sh`)
- [ ] Setup backend `.env` file (including MinIO config)
- [ ] Setup frontend `.env` file
- [ ] Install backend dependencies (`npm install`)
- [ ] Install frontend dependencies (`npm install`)
- [ ] *(Optional)* Configure WordPress integration
- [ ] Start PostgreSQL service
- [ ] **Start MinIO service**
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Verify connection at http://localhost:5173
- [ ] **Test image upload feature**
- [ ] *(Optional)* Test WordPress publishing

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

**Development Team:**
- Bhavya
- Pavan
- Sharath

**Project Lead:**
- Deepa M

**Organization:**
Innovate Electronics

---

**Built with ❤️ by the Innovate Electronics Team**
