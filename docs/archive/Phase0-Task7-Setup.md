# Phase 0 - Task 7: Full Stack Connection Setup

This guide walks you through connecting all three layers: Frontend ↔ Backend ↔ Database

---

## Overview

By the end of this task, you will have:
- ✅ PostgreSQL database `dmat_dev` with tables created
- ✅ Backend API server running on `http://localhost:5000`
- ✅ Frontend app calling backend and displaying connection status
- ✅ All three layers communicating successfully

---

## Prerequisites

Ensure you have installed:
- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm or yarn

---

## Part A: Backend ↔ Database Setup

### Step 1: Install PostgreSQL (if not installed)

#### macOS
```bash
# Using Homebrew
brew install postgresql@14
brew services start postgresql@14

# Verify installation
psql --version
```

#### Windows
```powershell
# Download and install from https://www.postgresql.org/download/windows/
# Or using Chocolatey:
choco install postgresql14

# Start PostgreSQL service
# Services can be managed via Windows Services Manager
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Step 2: Create Database

#### macOS & Linux
```bash
# Connect to PostgreSQL
psql -U postgres

# If you get "role does not exist" error, create postgres user first:
createuser -s postgres

# Then connect
psql -U postgres
```

#### Windows
```powershell
# Open Command Prompt or PowerShell
# Connect to PostgreSQL
psql -U postgres
```

#### Create the database (all platforms)
```sql
-- Create database
CREATE DATABASE dmat_dev;

-- Verify
\l

-- Exit psql
\q
```

### Step 3: Run Database Migrations

```bash
# Navigate to DMAT root directory
cd /path/to/DMAT

# Run migration script
psql -U postgres -d dmat_dev -f database/migrations/001_create_core_tables.sql

# Verify tables were created
psql -U postgres -d dmat_dev -c "\dt"
```

Expected output:
```
              List of relations
 Schema |     Name      | Type  |  Owner
--------+---------------+-------+----------
 public | landing_pages | table | postgres
 public | leads         | table | postgres
 public | users         | table | postgres
```

### Step 4: Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Step 5: Configure Backend Environment

Edit `backend/.env`:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_BASE_URL=http://localhost:5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dmat_dev
DB_USER=postgres
DB_PASSWORD=        # Leave empty if no password set

# CORS
CORS_ORIGIN=http://localhost:5173
```

**Note for Windows users:** If you set a password during PostgreSQL installation, add it to `DB_PASSWORD`.

### Step 6: Start Backend Server

```bash
# From backend directory
npm run dev
```

Expected output:
```
==================================================
🚀 DMAT Backend Server
📡 Running on: http://localhost:5000
🌍 Environment: development
🔗 API Endpoints:
   - GET /api/health
   - GET /api/db-check
==================================================
✓ Database connected successfully
```

### Step 7: Test Backend Endpoints

Open a new terminal and test:

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","message":"DMAT Backend is running","timestamp":"..."}

# Test database connection
curl http://localhost:5000/api/db-check

# Expected response:
# {"status":"ok","message":"Database connection successful","data":{...}}
```

✅ **Part A Complete!** Backend is connected to database.

---

## Part B: Frontend ↔ Backend Connection

### Step 1: Ensure Frontend Has Dependencies

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies (if not done in Task 6)
npm install

# Create .env file if it doesn't exist
cp .env.example .env
```

### Step 2: Verify Frontend Environment

Check `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=DMAT
VITE_APP_VERSION=1.0.0
```

### Step 3: Start Frontend Server

```bash
# From frontend directory
npm run dev
```

Expected output:
```
  VITE v7.2.4  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 4: Open Browser and Verify

1. Open browser: http://localhost:5173
2. You should see:
   - **Header:** "DMAT – Digital Marketing Automation Tool"
   - **Title:** "Hello DMAT – Phase 0"
   - **Status Panel** showing:
     - Backend Status: **ok** (green)
     - Database Status: **ok** (green)
     - Users in Database: **5** (from seed data)
   - **Success message:** "✅ All systems connected successfully!"

✅ **Part B Complete!** Frontend is connected to backend.

---

## Troubleshooting

### Backend won't connect to database

**Error:** `role "postgres" does not exist`
```bash
# Create postgres user
createuser -s postgres
```

**Error:** `database "dmat_dev" does not exist`
```bash
# Create database
psql -U postgres -c "CREATE DATABASE dmat_dev;"
```

**Error:** `password authentication failed`
```bash
# Set password for postgres user
psql -U postgres
ALTER USER postgres WITH PASSWORD 'your_password';

# Then update backend/.env with DB_PASSWORD=your_password
```

### Frontend shows "Backend Status: offline"

1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Check CORS configuration:**
   - Ensure `backend/.env` has `CORS_ORIGIN=http://localhost:5173`
   - Restart backend server after changing .env

3. **Check browser console for errors:**
   - Open Developer Tools (F12)
   - Look for fetch errors

### Frontend shows "Database Status: offline"

1. **Check database is running:**
   ```bash
   # macOS
   brew services list | grep postgresql

   # Linux
   sudo systemctl status postgresql

   # Windows
   # Check Services Manager for PostgreSQL
   ```

2. **Verify tables exist:**
   ```bash
   psql -U postgres -d dmat_dev -c "\dt"
   ```

3. **Check backend logs:**
   - Look for database connection errors in backend terminal

---

## Platform-Specific Notes

### macOS

- PostgreSQL data directory: `/usr/local/var/postgresql@14/`
- Configuration file: `/usr/local/var/postgresql@14/postgresql.conf`
- Logs: `/usr/local/var/log/postgresql@14.log`

**Common macOS Commands:**
```bash
# Start PostgreSQL
brew services start postgresql@14

# Stop PostgreSQL
brew services stop postgresql@14

# Restart PostgreSQL
brew services restart postgresql@14
```

### Windows

- PostgreSQL data directory: `C:\Program Files\PostgreSQL\14\data\`
- Configuration file: `C:\Program Files\PostgreSQL\14\data\postgresql.conf`
- Logs: `C:\Program Files\PostgreSQL\14\data\log\`

**Common Windows Commands:**
```powershell
# Start PostgreSQL (Services Manager)
# Or using sc command:
sc start postgresql-x64-14

# Stop PostgreSQL
sc stop postgresql-x64-14
```

**Windows Firewall:**
If backend can't connect to database, ensure PostgreSQL port 5432 is allowed:
```powershell
netsh advfirewall firewall add rule name="PostgreSQL" dir=in action=allow protocol=TCP localport=5432
```

### Linux

- PostgreSQL data directory: `/var/lib/postgresql/14/main/`
- Configuration file: `/etc/postgresql/14/main/postgresql.conf`
- Logs: `/var/log/postgresql/`

**Common Linux Commands:**
```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Stop PostgreSQL
sudo systemctl stop postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Enable auto-start on boot
sudo systemctl enable postgresql
```

---

## Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `dmat_dev` created
- [ ] Tables (`users`, `landing_pages`, `leads`) created via migrations
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Backend `.env` configured with database credentials
- [ ] Backend server running on port 5000
- [ ] `/api/health` endpoint returns `{"status":"ok"}`
- [ ] `/api/db-check` endpoint returns `{"status":"ok"}` with user count
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] Frontend `.env` has correct API_BASE_URL
- [ ] Frontend server running on port 5173
- [ ] Browser shows "Backend Status: ok"
- [ ] Browser shows "Database Status: ok"
- [ ] Browser shows "Users in Database: 5"
- [ ] Success message displayed: "✅ All systems connected successfully!"

---

## Next Steps

✅ **Phase 0, Task 7 is complete!**

All three layers are now communicating:
- Frontend (React) → Backend (Express) → Database (PostgreSQL)

You're ready to move on to Phase 1 development!

---

**Need Help?**
- Check the [Main README](../README.md) for overall project setup
- Check [Database Schema](./Database-Schema.md) for database structure
- Check [MVP Scope](./MVP-Scope.md) for feature planning

---

**DMAT Team - Innovate Electronics**
