# DMAT Backend

Node.js + Express backend API server for the Digital Marketing Automation Tool.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
nano .env

# Start development server
npm run dev
```

Server runs on: **http://localhost:5001**

## 📋 Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14.x
- Database `dmat_db` created and migrated
- MinIO (for image uploads - Phase 2)

## 📦 Available Scripts

### Development
```bash
npm run dev          # Start server with nodemon (auto-reload)
```

### Production
```bash
npm start            # Start production server
```

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **PostgreSQL** - Database
- **pg** - PostgreSQL client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **MinIO** - S3-compatible object storage (Phase 2)
- **Axios** - HTTP client for WordPress integration (Phase 2)
- **Multer** - File upload handling (Phase 2)
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **nodemon** - Development auto-reload

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection pool
│   ├── controllers/
│   │   └── healthController.js  # Health & DB check endpoints
│   ├── routes/
│   │   └── healthRoutes.js      # API route definitions
│   ├── middleware/              # Express middleware (future)
│   └── utils/                   # Helper functions (future)
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── server.js                    # Application entry point
└── README.md                    # This file
```

## ⚙️ Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required variables:

```env
# Server
NODE_ENV=development
PORT=5001
API_BASE_URL=http://localhost:5001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dmat_db
DB_USER=postgres
DB_PASSWORD=postgres

# CORS
CORS_ORIGIN=http://localhost:5173

# JWT
JWT_SECRET=dmat-super-secret-key-change-in-production-2024

# MinIO (Phase 2 - Image uploads)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET=dmat-images

# WordPress Integration (Phase 2 - Optional)
# WP_SITE_URL=https://yoursite.com
# WP_USERNAME=your-wordpress-username
# WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "DMAT Backend is running",
  "timestamp": "2025-11-28T06:00:00.000Z"
}
```

### Database Check
```http
GET /api/db-check
```

**Response:**
```json
{
  "status": "ok",
  "message": "Database connection successful",
  "data": {
    "currentTime": "2025-11-28T06:00:00.000Z",
    "userCount": 5
  },
  "timestamp": "2025-11-28T06:00:00.000Z"
}
```

### Root
```http
GET /
```

**Response:**
```json
{
  "message": "DMAT Backend API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "dbCheck": "/api/db-check"
  }
}
```

## 🗄️ Database Setup

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE dmat_db;

# Exit
\q
```

### 2. Run Migrations

```bash
# From DMAT root directory
cd database
psql -U postgres -d dmat_db -f migrations/001_create_core_tables.sql
psql -U postgres -d dmat_db -f migrations/002_add_custom_fields.sql
psql -U postgres -d dmat_db -f migrations/003_add_images.sql
psql -U postgres -d dmat_db -f migrations/004_add_landing_page_enhancements.sql
```

### 3. Seed Sample Data (Optional)

```bash
psql -U postgres -d dmat_db -f seeds/001_sample_data.sql
```

### 4. Verify Tables

```bash
psql -U postgres -d dmat_db -c "\dt"
```

Expected tables:
- `users`
- `landing_pages`
- `leads`
- `custom_fields`

## 🧪 Testing Endpoints

### Using curl

```bash
# Health check
curl http://localhost:5000/api/health

# Database check
curl http://localhost:5000/api/db-check
```

### Using Browser

- Health: http://localhost:5000/api/health
- DB Check: http://localhost:5000/api/db-check

## 🔧 Development Guidelines

### Adding New Endpoints

1. **Create Controller** in `src/controllers/`
   ```javascript
   export const myController = async (req, res) => {
     // Your logic here
   };
   ```

2. **Create Route** in `src/routes/`
   ```javascript
   import { myController } from '../controllers/myController.js';
   router.get('/my-route', myController);
   ```

3. **Register Route** in `server.js`
   ```javascript
   import myRoutes from './src/routes/myRoutes.js';
   app.use('/api', myRoutes);
   ```

### Database Queries

Use the connection pool from `src/config/database.js`:

```javascript
import pool from '../config/database.js';

export const myController = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
};
```

## 🚨 Troubleshooting

### Database Connection Failed

**Error:** `connect ECONNREFUSED`
```bash
# Check if PostgreSQL is running
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

**Error:** `password authentication failed`
```bash
# Update backend/.env with correct DB_PASSWORD
```

**Error:** `database "dmat_dev" does not exist`
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE dmat_dev;"
```

### Port Already in Use

**Error:** `EADDRINUSE :::5000`
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or change PORT in .env
```

### CORS Errors

If frontend can't connect:
1. Check `CORS_ORIGIN` in `.env` matches frontend URL
2. Restart backend server after changing `.env`
3. Check browser console for specific CORS error

## 📊 Implementation Status

### Phase 1 (MVP) ✅ COMPLETE
✅ Landing Page CRUD APIs
✅ Lead Capture & Management APIs
✅ JWT Authentication & Authorization
✅ User Management
✅ Database schema & migrations
✅ Input validation & sanitization
✅ Error handling

### Phase 2 (Enhancements) ✅ COMPLETE
✅ Custom Fields API (dynamic form fields)
✅ Image Upload with MinIO (S3-compatible storage)
✅ WordPress REST API Integration
✅ Hero image management
✅ Enhanced landing page features (headline, body, CTA)

## 🔗 Related Documentation

- [Main README](../README.md) - Full project documentation
- [WordPress Setup Guide](../WORDPRESS_SETUP.md) - WordPress integration
- [MinIO Setup Guide](../MINIO_SETUP.md) - Image storage setup
- [Testing Scenarios](../docs/TESTING_SCENARIOS.md) - UI testing guide
- [Frontend README](../frontend/README.md) - Frontend documentation
- [Database Documentation](../database/Database.md) - Database structure

---

**Built by the Innovate Electronics Team**
