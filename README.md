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

### 📍 Current Status: Phase 1 Planning Complete ✅

**Phase 1 (MVP Planning)** is complete with comprehensive specifications for:
- Landing Page Builder (admin interface + public pages)
- Lead Management System (capture + management)
- All documentation ready for Phase 2 implementation

See [Phase 1 Planning Documentation](#phase-1-planning-documentation-) for complete specifications.

---

## 🚀 Quick Start

Get the full stack running (Frontend ↔ Backend ↔ Database):

> **📌 Platform Support:** This README includes specific instructions for both **Windows** and **Mac** users. Look for platform-specific sections throughout the guide.

**Quick Steps:**
1. **Setup Database:** Create PostgreSQL database `dmat_dev` and run migrations
   - [Mac/Linux Instructions](#2-database-setup)
   - [Windows Instructions](#2-database-setup)
2. **Setup Backend:** Install dependencies and configure `.env`
   - Platform-specific commands provided in [Backend Setup](#3-backend-setup)
3. **Setup Frontend:** Install dependencies and configure `.env`
   - Platform-specific commands provided in [Frontend Setup](#4-frontend-setup)
4. **Start All Services:** Run backend and frontend servers
   - See [Development](#development) for platform-specific startup commands
5. **Verify:** See "✅ All systems connected successfully!" in browser

When complete, you'll see:
- Backend Status: **ok** ✅
- Database Status: **ok** ✅
- Users in Database: **5** 📊

✅ **Full stack is ready!** See [Installation](#installation) for detailed platform-specific steps.

💡 **New to the project?** Check the [Quick Reference](#quick-reference) section for a command cheat sheet.

---

## ✨ Features

### 1. SEO & Web Performance Monitoring
- Website visibility insights and SEO recommendations
- Keyword performance tracking via Google Search Console
- Traffic trends via Google Analytics
- SEO scoring and improvement recommendations

### 2. Social Media Automation
- Multi-platform scheduling (LinkedIn, Facebook, Instagram, YouTube, X/Twitter)
- Centralized content calendar
- Performance metrics tracking
- Auto-generate UTM links

### 3. Landing Page Builder
- Block-based editor for quick page creation
- Auto-publish to WordPress via REST API
- Automatic SEO metadata and tracking scripts
- Integrated lead capture forms

### 4. Lead Management System (LMS)
- Unified lead database from all sources
- Lead scoring and attribution
- Lead lifecycle tracking (New → Qualified → In Progress → Converted)
- Auto-deduplication

### 5. Analytics Dashboard
- Unified view across all digital channels
- Interactive graphs and KPIs
- Campaign-wise breakdown
- Export capabilities

### 6. Automated Reporting
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
| **Queue System** | Redis + BullMQ | Background jobs & scheduling |
| **PDF Generation** | Puppeteer | Automated reports |
| **File Storage** | MinIO / Cloudinary | Media assets |

### API Integrations

- WordPress REST API
- Google Analytics Data API (GA4)
- Google Search Console API
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

#### Redis >= 6.x
- **Windows:** Download from [redis.io](https://redis.io/download) or use [WSL (Windows Subsystem for Linux)](https://learn.microsoft.com/en-us/windows/wsl/install)
  - Alternative: Use [Memurai](https://www.memurai.com/) (Windows-native Redis alternative)
- **Mac:** Install via Homebrew: `brew install redis`

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
| **Redis** | Memurai (recommended) or WSL | Native Redis via Homebrew |
| **Default Port 5000** | Usually available | Blocked by AirPlay (use 5001) |
| **Shell Scripts** | Use PowerShell or WSL | Native Bash support |
| **File Commands** | `copy`, `rmdir`, `notepad` | `cp`, `rm`, `nano` |
| **Path Separator** | Backslash `\` | Forward slash `/` |

---

## 🚀 Installation

### 1. Clone the Repository

#### Windows (Command Prompt or PowerShell)
```bash
git clone https://github.com/your-org/dmat.git
cd dmat
```

#### Mac (Terminal)
```bash
git clone https://github.com/your-org/dmat.git
cd dmat
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
psql -U postgres -c "CREATE DATABASE dmat_dev;"

# Run the migration
psql -U postgres -d dmat_dev -f database/migrations/001_create_core_tables.sql
```

```powershell
# Option 2: Using WSL (Windows Subsystem for Linux)
wsl chmod +x ./database/setup.sh
wsl ./database/setup.sh setup
```

📖 **For detailed database setup, migration guides, and troubleshooting, see:**
- [Database Setup Guide](./database/Database.md)
- [Database Schema Documentation](./docs/Database-Schema.md)

### 3. Backend Setup

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

### 4. Frontend Setup

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

### 5. Redis Setup

#### Windows
```bash
# If using Memurai (recommended for Windows)
# Download and install from https://www.memurai.com/
# Memurai runs as a Windows service automatically

# Or using Docker
docker run -d -p 6379:6379 redis:alpine

# Or using WSL
wsl redis-server
```

#### Mac
```bash
# Start Redis server
redis-server

# Or run Redis in the background
brew services start redis

# Or using Docker
docker run -d -p 6379:6379 redis:alpine
```

---

## ⚙️ Configuration

> **Port Configuration Note:**
> - **Mac Users:** The backend runs on port **5001** instead of 5000 because port 5000 is used by macOS ControlCenter on macOS Monterey and later.
> - **Windows Users:** Port 5000 is typically available. You can use either port 5000 or 5001 in the `.env` file.
> - To check if a port is in use:
>   - **Windows:** `netstat -ano | findstr :5000`
>   - **Mac:** `lsof -i :5000`

### Backend Environment Variables (.env)

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5001
API_BASE_URL=http://localhost:5001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dmat_dev
# Mac: Use your system username (run 'whoami' to find it), password usually empty for Homebrew install
# Windows: Use 'postgres' as default user, set password from installation
DB_USER=your_username
DB_PASSWORD=your_password  # Mac (Homebrew): usually empty, Windows: set during installation

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# WordPress Integration
WORDPRESS_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
WORDPRESS_JWT_TOKEN=your-wordpress-jwt-token

# Google APIs
GOOGLE_ANALYTICS_PROPERTY_ID=your-ga4-property-id
GOOGLE_SEARCH_CONSOLE_SITE_URL=https://your-site.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5001/auth/google/callback

# Social Media APIs
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

META_APP_ID=your-facebook-app-id
META_APP_SECRET=your-facebook-app-secret

TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_BEARER_TOKEN=your-twitter-bearer-token

YOUTUBE_API_KEY=your-youtube-api-key

# Email Configuration (for reports)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@innovateelectronics.com

# File Storage (MinIO or Cloudinary)
STORAGE_TYPE=minio # or 'cloudinary'

# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=dmat-assets

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# EMS (Event Management System) Integration
EMS_API_URL=https://your-ems-system.com/api
EMS_API_KEY=your-ems-api-key
```

### Frontend Environment Variables (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5001
VITE_APP_NAME=DMAT
VITE_APP_VERSION=1.0.0
```

---

## 📁 Project Structure

```
dmat/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── jobs/            # Background jobs (BullMQ)
│   │   ├── utils/           # Helper functions
│   │   └── app.js           # Express app setup
│   ├── tests/               # Unit & integration tests
│   ├── .env.example         # Environment template
│   ├── package.json
│   └── server.js            # Entry point
│
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service calls
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # Context providers
│   │   ├── utils/           # Helper functions
│   │   ├── assets/          # Images, icons, etc.
│   │   ├── styles/          # Global styles
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── .env.example         # Environment template
│   ├── package.json
│   └── vite.config.js       # Vite configuration
│
├── database/                # Database setup & migrations
│   ├── migrations/          # SQL migration files
│   │   ├── 001_create_core_tables.sql
│   │   └── 001_rollback_core_tables.sql
│   ├── Database.md          # Database setup guide
│   └── setup.sh             # Automated setup script
│
├── docs/                    # Documentation
│   ├── DMAT.md              # Project specification
│   ├── MVP-Scope.md         # MVP scope & non-goals
│   └── Database-Schema.md   # Database schema details
│
├── docker-compose.yml       # Docker setup (optional)
├── .gitignore
├── README.md                # This file
└── LICENSE
```

---

## 💻 Development

### Starting the Development Servers

#### Windows

**Terminal 1 - Backend** (runs on http://localhost:5001)
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend** (runs on http://localhost:5173)
```bash
cd frontend
npm run dev
```

**Terminal 3 - Redis** (if not running as a service)
```bash
# If using Memurai, it runs automatically as a service
# If using WSL:
wsl redis-server

# Or using Docker:
docker run -d -p 6379:6379 redis:alpine
```

#### Mac

**Terminal 1 - Backend** (runs on http://localhost:5001)
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend** (runs on http://localhost:5173)
```bash
cd frontend
npm run dev
```

**Terminal 3 - Redis** (if not running as a service)
```bash
redis-server

# Or if installed via Homebrew and running as a service:
brew services start redis

# Or using Docker:
docker run -d -p 6379:6379 redis:alpine
```

> **Tip:** Open multiple terminal windows/tabs to run all services simultaneously. The backend and frontend must be running for the application to work properly.

### Available Scripts

#### Backend
```bash
npm run dev          # Start development server with nodemon
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Lint code
```

**Note:** For database migrations, use the [database setup script](./database/setup.sh) instead.

#### Frontend
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run test         # Run tests
```

### Using Docker (Optional)

Docker commands are the same for both Windows and Mac:

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers after code changes
docker-compose up -d --build
```

> **Platform Notes:**
> - **Windows:** Ensure Docker Desktop is running before executing commands. You may need to enable WSL 2 integration.
> - **Mac:** Ensure Docker Desktop is running. On Apple Silicon (M1/M2), use `--platform linux/amd64` if you encounter compatibility issues.

---

## 🔌 API Integrations

### 1. WordPress Setup

1. Install **JWT Authentication for WP REST API** plugin
2. Generate authentication token
3. Add token to `.env` file
4. Test connection:
   ```bash
   curl -X GET https://your-site.com/wp-json/wp/v2/posts \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### 2. Google APIs Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable APIs:
   - Google Analytics Data API
   - Google Search Console API
4. Create OAuth 2.0 credentials
5. Add credentials to `.env` file

### 3. Social Media APIs

#### LinkedIn
1. Create app at [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Request Marketing Developer Platform access
3. Add credentials to `.env`

#### Meta (Facebook & Instagram)
1. Create app at [Meta for Developers](https://developers.facebook.com/)
2. Add Facebook Login and Instagram Graph API products
3. Add credentials to `.env`

#### X/Twitter
1. Apply for developer account at [Twitter Developer Portal](https://developer.twitter.com/)
2. Create app and generate API keys
3. Add credentials to `.env`

#### YouTube
1. Enable YouTube Data API v3 in Google Cloud Console
2. Create API key
3. Add to `.env`

---

## 🚢 Deployment

### Backend Deployment

**Recommended: VPS with PM2**
```bash
# On your server: Install Node.js, PostgreSQL, Redis
# Clone repository and install dependencies
# Setup environment variables
# Start with PM2
npm install -g pm2
pm2 start backend/server.js --name dmat-backend
pm2 startup
pm2 save
# Setup Nginx reverse proxy and SSL with Let's Encrypt
```

**Alternative: Docker**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Frontend Deployment

**Recommended: Vercel**
```bash
cd frontend
npm install -g vercel
vercel --prod
```

**Alternative: Netlify**
```bash
cd frontend
npm run build
# Deploy dist/ folder via Netlify UI or CLI
```

---

## 📊 Database

DMAT uses PostgreSQL with a well-structured relational schema. Core tables include:
- `users` - System users with role-based access
- `landing_pages` - Landing page content and metadata
- `leads` - Unified lead database from all sources

📖 **For complete database documentation:**
- **[Database Setup & Migration Guide](./database/Database.md)** - Setup instructions, migration commands, troubleshooting
- **[Database Schema Documentation](./docs/Database-Schema.md)** - Complete ERD, table specifications, relationships, queries

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests (if implemented)
npm run test:e2e
```

---

## 📈 Monitoring & Maintenance

- **Logs:** Check application logs regularly
- **Database:** Regular backups and optimization
- **Redis:** Monitor memory usage
- **API Quotas:** Track API usage for social platforms
- **Security:** Keep dependencies updated

---

## 📚 Documentation

### Project Documentation
- **[DMAT Project Specification](./docs/DMAT.md)** - Complete project overview, features, tech stack, and implementation phases
- **[MVP Scope & Non-Goals](./docs/MVP-Scope.md)** - Detailed MVP scope, what's included/excluded, success criteria

### Database Documentation
- **[Database Setup Guide](./database/Database.md)** - Setup, migration commands, troubleshooting
- **[Database Schema Documentation](./docs/Database-Schema.md)** - ERD, table specifications, relationships, queries

### Phase 1 Planning Documentation ✅

**Phase 1 Planning Complete** - All specifications ready for implementation

**Core Specifications:**
- **[Success Criteria](./docs/Phase1-Success-Criteria.md)** - Definition of done for Phase 1
- **[Landing Page Schema](./docs/Phase1-LandingPage-Schema.md)** - Landing pages table structure and migrations
- **[Lead Schema](./docs/Phase1-Lead-Schema.md)** - Leads table structure and migrations
- **[Landing Page Lifecycle](./docs/Phase1-LandingPage-Lifecycle.md)** - State management (draft → published)
- **[User Flows](./docs/Phase1-User-Flows.md)** - Step-by-step workflows

**Backend API Specifications:**
- **[Landing Page API](./docs/Phase1-LandingPage-API.md)** - Admin API endpoints (create, list, get, update, publish, delete)
- **[API Plain English](./docs/Phase1-API-Plain-English.md)** - Non-technical API explanations
- **[Publish Workflow](./docs/Phase1-Publish-Workflow.md)** - 7-step publish process
- **[Lead Capture API](./docs/Phase1-Lead-Capture-API.md)** - Public form submission endpoint
- **[Lead Capture Behavior](./docs/Phase1-Lead-Capture-Behavior.md)** - Plain English behavior spec
- **[Validation & Sanitization Rules](./docs/Phase1-Validation-Sanitization-Rules.md)** - Security rules for all fields
- **[WordPress Integration Strategy](./docs/Phase1-WordPress-Integration-Strategy.md)** - Mock implementation approach
- **[Landing Page Content Structure](./docs/Phase1-Landing-Page-Content-Structure.md)** - HTML output format
- **[Publish State Management](./docs/Phase1-Publish-State-Management.md)** - Database state tracking

**Frontend UI/UX Specifications:**
- **[Landing Page List Screen Design](./docs/Phase1-Landing-Page-List-Screen-Design.md)** - List view with filters
- **[Landing Page Form Design](./docs/Phase1-Landing-Page-Form-Design.md)** - Create/edit form UI
- **[Frontend-Backend Integration](./docs/Phase1-Frontend-Backend-Integration.md)** - How forms talk to APIs
- **[Leads List Screen Design](./docs/Phase1-Leads-List-Screen-Design.md)** - Leads management interface
- **[Lead Details View Design](./docs/Phase1-Lead-Details-View-Design.md)** - Side panel design
- **[Leads API Integration](./docs/Phase1-Leads-API-Integration.md)** - Leads API usage patterns

**Security & Testing:**
- **[Security & Access Control](./docs/Phase1-Security-Access-Control.md)** - Authentication and authorization
- **[Protected vs Public Endpoints](./docs/Phase1-Protected-Public-Endpoints.md)** - Endpoint classification
- **[Test Scenarios](./docs/Phase1-Test-Scenarios.md)** - 44 test scenarios across 8 categories
- **[Demo Script](./docs/Phase1-Demo-Script.md)** - Production-ready demo walkthrough

### Component Documentation
- **[Backend README](./backend/README.md)** - Backend API server documentation
- **[Frontend README](./frontend/README.md)** - Frontend React app documentation

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

## 🔧 Troubleshooting

### Common Issues by Platform

#### Windows

**PostgreSQL Connection Issues**
```bash
# Check if PostgreSQL is running
sc query postgresql-x64-14

# Start PostgreSQL service
net start postgresql-x64-14
```

**Redis Connection Issues**
```bash
# If using Memurai, check service status
sc query Memurai

# Start Memurai service
net start Memurai
```

**Node Modules Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s node_modules
npm install
```

**Permission Issues**
- Run Command Prompt or PowerShell as Administrator for database operations
- Check Windows Defender/Firewall settings if ports are blocked

#### Mac

**PostgreSQL Connection Issues**
```bash
# Check if PostgreSQL is running
brew services list

# Start PostgreSQL
brew services start postgresql@14

# Or manually start
pg_ctl -D /opt/homebrew/var/postgresql@14 start
```

**Redis Connection Issues**
```bash
# Check if Redis is running
brew services list

# Start Redis
brew services start redis
```

**Port 5000 Already in Use (macOS AirPlay Receiver)**
```bash
# Option 1: Disable AirPlay Receiver
# System Preferences → Sharing → Uncheck "AirPlay Receiver"

# Option 2: Use port 5001 (already configured in .env.example)
```

**Node Modules Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

**Permission Issues**
```bash
# Fix PostgreSQL permissions
sudo chown -R $(whoami) /opt/homebrew/var/postgresql@14

# Fix npm global permissions
sudo chown -R $(whoami) ~/.npm
```

### General Troubleshooting

**Check System Requirements**
```bash
# Check Node.js version
node --version  # Should be >= 18.x

# Check npm version
npm --version

# Check PostgreSQL version
psql --version  # Should be >= 14.x

# Check Git version
git --version
```

**Database Connection Test**
```bash
# Windows
psql -U postgres -d dmat_dev -c "SELECT version();"

# Mac
psql -d dmat_dev -c "SELECT version();"
```

**Redis Connection Test**
```bash
# Both platforms
redis-cli ping
# Should return: PONG
```

---

## 📞 Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the [Troubleshooting](#troubleshooting) section above

---

## 🗺 Roadmap

### Phase 1 - MVP Planning ✅ COMPLETE
**Landing Page Builder & Lead Management - Planning Complete**

All specifications documented and ready for implementation:
- ✅ Landing page admin APIs (create, list, edit, publish, delete)
- ✅ Lead capture API (public form submission)
- ✅ Frontend UI/UX designs (list screens, forms, detail views)
- ✅ Security & access control (JWT authentication, authorization rules)
- ✅ Testing strategy (44 test scenarios)
- ✅ Demo script (production-ready walkthrough)
- ✅ Mock WordPress integration approach

**Next:** Phase 2 - MVP Implementation

### Phase 2 - MVP Implementation (NEXT)
**Landing Page Builder & Lead Management - Build It**
- Backend: Implement landing page admin APIs
- Backend: Implement lead capture API with validation
- Frontend: Build landing page list and form screens
- Frontend: Build leads management interface
- Security: JWT authentication middleware
- Testing: Execute 44 test scenarios
- Demo: Run production demo

### Phase 3 - SEO Engine
- Page analyzer
- Keyword tracker
- SEO scoring

### Phase 4 - Social Publishing
- Post composer
- Content calendar
- Multi-channel scheduler

### Phase 5 - Analytics Dashboard
- Unified metrics
- Visualization engine

### Phase 6 - Reporting Engine
- PDF generator
- Scheduled reporting

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

## 📖 Quick Reference

### Essential Commands Cheat Sheet

#### Starting Services

| Task | Windows | Mac |
|------|---------|-----|
| **Start PostgreSQL** | `net start postgresql-x64-14` | `brew services start postgresql@14` |
| **Start Redis** | `net start Memurai` or `wsl redis-server` | `brew services start redis` |
| **Start Backend** | `cd backend && npm run dev` | `cd backend && npm run dev` |
| **Start Frontend** | `cd frontend && npm run dev` | `cd frontend && npm run dev` |

#### Database Operations

| Task | Windows | Mac |
|------|---------|-----|
| **Connect to DB** | `psql -U postgres -d dmat_dev` | `psql -d dmat_dev` |
| **Create DB** | `psql -U postgres -c "CREATE DATABASE dmat_dev;"` | `createdb dmat_dev` |
| **Run Migration** | `psql -U postgres -d dmat_dev -f database/migrations/001_create_core_tables.sql` | `./database/setup.sh setup` |
| **Check DB Status** | `sc query postgresql-x64-14` | `brew services list` |

#### File Operations

| Task | Windows | Mac |
|------|---------|-----|
| **Copy .env** | `copy .env.example .env` | `cp .env.example .env` |
| **Edit .env** | `notepad .env` | `nano .env` or `open -e .env` |
| **Delete folder** | `rmdir /s node_modules` | `rm -rf node_modules` |
| **Change directory** | `cd backend` or `cd ..\frontend` | `cd backend` or `cd ../frontend` |

#### Port & Process Management

| Task | Windows | Mac |
|------|---------|-----|
| **Check port usage** | `netstat -ano \| findstr :5001` | `lsof -i :5001` |
| **Kill process on port** | `taskkill /PID <PID> /F` | `kill -9 <PID>` |
| **Find your username** | `echo %USERNAME%` | `whoami` |

#### Git Commands (Same for Both)

```bash
git status                    # Check status
git add .                     # Stage all changes
git commit -m "message"       # Commit changes
git push                      # Push to remote
git pull                      # Pull from remote
git checkout -b feature-name  # Create new branch
```

#### NPM Commands (Same for Both)

```bash
npm install                   # Install dependencies
npm run dev                   # Start development server
npm run build                 # Build for production
npm test                      # Run tests
npm cache clean --force       # Clear npm cache
```

### First-Time Setup Checklist

- [ ] Install Node.js >= 18.x
- [ ] Install PostgreSQL >= 14.x
- [ ] Install Redis (or Memurai for Windows)
- [ ] Install Git
- [ ] Clone the repository
- [ ] Create PostgreSQL database `dmat_dev`
- [ ] Run database migrations
- [ ] Setup backend `.env` file
- [ ] Setup frontend `.env` file
- [ ] Install backend dependencies (`npm install`)
- [ ] Install frontend dependencies (`npm install`)
- [ ] Start PostgreSQL service
- [ ] Start Redis service
- [ ] Start backend server
- [ ] Start frontend server
- [ ] Verify connection at http://localhost:5173

---

**Built with ❤️ by the Innovate Electronics Team**
