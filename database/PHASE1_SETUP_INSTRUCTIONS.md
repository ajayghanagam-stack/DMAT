# Phase 1 Database Setup Instructions

**Date:** 2025-12-04
**Purpose:** Setup database tables for Phase 1 implementation

---

## 📋 Overview

Phase 1 requires three database migrations to be run:
1. **Migration 001**: Create core tables (users, landing_pages, leads)
2. **Migration 002**: Extend landing_pages with Phase 1 fields
3. **Migration 003**: Extend leads with Phase 1 tracking fields

---

## ✅ Prerequisites

Before running migrations, ensure:
- ✅ PostgreSQL 14+ is installed and running
- ✅ Database `dmat_dev` exists (or will be created)
- ✅ You have database credentials ready

---

## 🚀 Quick Setup (Recommended)

### Option 1: Using the Automated Setup Script

```bash
# Navigate to database directory
cd database

# Make script executable
chmod +x setup.sh

# Run setup (creates database and runs all migrations)
./setup.sh setup
```

**What it does:**
- Creates `dmat_dev` database if it doesn't exist
- Runs migration 001 (core tables)
- Runs migration 002 (landing pages extension)
- Runs migration 003 (leads extension)
- Seeds sample users (5 test users)

---

## 🔧 Manual Setup (Alternative)

If you prefer to run migrations manually:

### Step 1: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE dmat_dev;

# Exit psql
\q
```

### Step 2: Run Migration 001 (Core Tables)

```bash
psql -U postgres -d dmat_dev -f database/migrations/001_create_core_tables.sql
```

**Creates:**
- `users` table (16 columns)
- `landing_pages` table (basic structure)
- `leads` table (basic structure)
- Auto-update triggers for `updated_at` fields

### Step 3: Run Migration 002 (Landing Pages Extension)

```bash
psql -U postgres -d dmat_dev -f database/migrations/002_extend_landing_pages.sql
```

**Adds to landing_pages:**
- Content fields: `headline`, `subheading`, `body_text`, `cta_text`, `hero_image_url`
- Form configuration: `form_fields` (JSONB with default name/email/phone fields)
- Publishing metadata: `publish_status`, `published_url`, `published_at`

### Step 4: Run Migration 003 (Leads Extension)

```bash
psql -U postgres -d dmat_dev -f database/migrations/003_refine_leads.sql
```

**Adds to leads:**
- Additional contact: `company`, `job_title`, `message`
- Source attribution: `source_details`, `referrer_url`, `landing_url`
- Technical metadata: `user_agent`, `ip_address`
- Performance indexes

---

## ✅ Verify Setup

After running migrations, verify the setup:

```bash
# Connect to database
psql -U postgres -d dmat_dev

# Check tables exist
\dt

# Check landing_pages columns
\d landing_pages

# Check leads columns
\d leads

# Exit
\q
```

**Expected Output:**
- `users` table: 7 columns
- `landing_pages` table: 16 columns
- `leads` table: 17 columns

---

## 📊 Final Database Schema

### landing_pages Table (16 columns)

```
Core Identity:
  - id (SERIAL PRIMARY KEY)
  - title (VARCHAR 500)
  - slug (VARCHAR 255 UNIQUE)

Content Fields:
  - headline (VARCHAR 500)
  - subheading (VARCHAR 1000)
  - body_text (TEXT)
  - cta_text (VARCHAR 100, default: 'Submit')
  - hero_image_url (VARCHAR 2048)

Form Configuration:
  - form_fields (JSONB, default: name/email/phone)

Publishing Metadata:
  - publish_status (VARCHAR 50, default: 'draft')
  - published_url (VARCHAR 2048)
  - published_at (TIMESTAMP)

Legacy/Flexible:
  - content_json (JSONB)
  - status (VARCHAR 50)

Audit:
  - created_by (INTEGER, FK to users)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```

### leads Table (17 columns)

```
Core Identity:
  - id (SERIAL PRIMARY KEY)
  - landing_page_id (INTEGER, FK to landing_pages, nullable)

Basic Contact:
  - name (VARCHAR 255)
  - email (VARCHAR 255)
  - phone (VARCHAR 50)

Additional Contact:
  - company (VARCHAR 255)
  - job_title (VARCHAR 255)
  - message (TEXT)

Source Attribution:
  - source (VARCHAR 100, default: 'landing_page')
  - source_details (VARCHAR 500)
  - referrer_url (VARCHAR 2048)
  - landing_url (VARCHAR 2048)

Technical Metadata:
  - user_agent (VARCHAR 500)
  - ip_address (VARCHAR 45)

Lead Management:
  - status (VARCHAR 50, default: 'new')

Audit:
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)
```

---

## 🔄 Rollback (If Needed)

If you need to rollback any migration:

```bash
# Rollback migration 003
psql -U postgres -d dmat_dev -f database/migrations/003_rollback_refine_leads.sql

# Rollback migration 002
psql -U postgres -d dmat_dev -f database/migrations/002_rollback_extend_landing_pages.sql

# Rollback migration 001 (WARNING: Drops all tables!)
psql -U postgres -d dmat_dev -f database/migrations/001_rollback_core_tables.sql
```

---

## 🆘 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running (Mac)
brew services list

# Start PostgreSQL (Mac)
brew services start postgresql@14

# Check if PostgreSQL is running (Linux)
sudo systemctl status postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql
```

### Permission Issues

```bash
# If "permission denied" error, try with sudo or postgres user
sudo -u postgres psql -d dmat_dev -f database/migrations/001_create_core_tables.sql
```

### Database Already Exists

```bash
# If database already exists with old schema, drop and recreate
psql -U postgres -c "DROP DATABASE IF EXISTS dmat_dev;"
psql -U postgres -c "CREATE DATABASE dmat_dev;"
```

---

## 📝 Next Steps

After database setup is complete:
1. ✅ Configure backend `.env` file with database credentials
2. ✅ Test database connection from backend
3. ✅ Move to Task 2: Implement Backend APIs

---

**Migration Files Location:** `/database/migrations/`
- 001_create_core_tables.sql
- 002_extend_landing_pages.sql
- 003_refine_leads.sql

**Reference Documentation:**
- Phase1-LandingPage-Schema.md
- Phase1-Lead-Schema.md
- Database-Schema.md
