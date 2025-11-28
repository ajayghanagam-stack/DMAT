# DMAT Database Migrations

This directory contains all database migrations for the DMAT project.

## 📁 Directory Structure

```
database/
├── migrations/
│   ├── 001_create_core_tables.sql       # Creates users, landing_pages, leads
│   ├── 001_rollback_core_tables.sql     # Rollback for migration 001
│   └── ... (future migrations)
└── README.md                             # This file
```

## 🚀 Quick Start

### Prerequisites

Ensure PostgreSQL is installed and running:

```bash
# Check PostgreSQL version
psql --version

# Start PostgreSQL service (varies by OS)
# macOS (Homebrew):
brew services start postgresql

# Linux (systemd):
sudo systemctl start postgresql

# Windows:
# Start via Services or pg_ctl
```

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE dmat_db;

# Grant privileges (optional)
GRANT ALL PRIVILEGES ON DATABASE dmat_db TO your_user;

# Exit
\q
```

### 2. Run Migration

#### Option A: Using psql command

```bash
# Run migration
psql -U your_user -d dmat_db -f database/migrations/001_create_core_tables.sql

# Verify
psql -U your_user -d dmat_db -c "\dt"
```

#### Option B: Using psql interactive

```bash
# Connect to database
psql -U your_user -d dmat_db

# Run migration
\i database/migrations/001_create_core_tables.sql

# Verify tables
\dt

# View table structure
\d users
\d landing_pages
\d leads

# Exit
\q
```

#### Option C: Using Docker (if PostgreSQL is in Docker)

```bash
# Copy migration file to container
docker cp database/migrations/001_create_core_tables.sql postgres-container:/tmp/

# Execute migration
docker exec -i postgres-container psql -U postgres -d dmat_db -f /tmp/001_create_core_tables.sql
```

### 3. Rollback Migration (if needed)

```bash
# WARNING: This deletes all data!
psql -U your_user -d dmat_db -f database/migrations/001_rollback_core_tables.sql
```

## 📊 Migration 001: Core Tables

### Tables Created

#### 1. **users**
Stores system users with authentication

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(255) | Full name |
| email | VARCHAR(255) | Unique email (with validation) |
| password_hash | VARCHAR(255) | Bcrypt hashed password |
| role | VARCHAR(50) | admin, editor, or viewer |
| created_at | TIMESTAMP | Auto-managed |
| updated_at | TIMESTAMP | Auto-managed |

#### 2. **landing_pages**
Stores landing page content and metadata

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| title | VARCHAR(500) | Page title |
| slug | VARCHAR(255) | Unique URL identifier |
| content_json | JSONB | Page layout/sections |
| status | VARCHAR(50) | draft, published, or archived |
| created_by | INTEGER | FK → users.id |
| created_at | TIMESTAMP | Auto-managed |
| updated_at | TIMESTAMP | Auto-managed |

#### 3. **leads**
Stores marketing leads from all sources

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| landing_page_id | INTEGER | FK → landing_pages.id (nullable) |
| name | VARCHAR(255) | Lead name |
| email | VARCHAR(255) | Email (with validation) |
| phone | VARCHAR(50) | Phone (optional) |
| source | VARCHAR(100) | Lead source |
| status | VARCHAR(50) | Lead status |
| created_at | TIMESTAMP | Auto-managed |
| updated_at | TIMESTAMP | Auto-managed |

### Features

✅ **Automatic timestamp updates** via triggers
✅ **Foreign key constraints** with CASCADE
✅ **Email validation** using regex
✅ **Enum-like constraints** for role, status, source
✅ **Optimized indexes** for common queries
✅ **Sample seed data** for testing

### Sample Seed Data

The migration includes sample data:
- 5 users (admin, Deepa M, Bhavya, Pavan, Sharath)
- 1 sample landing page
- 3 sample leads

**Note:** Sample password hash is placeholder. Replace with actual bcrypt hash.

## 🔍 Useful Queries

### View All Tables

```sql
\dt
-- or
SELECT * FROM information_schema.tables WHERE table_schema = 'public';
```

### View Table Structure

```sql
\d users
\d landing_pages
\d leads
```

### View Indexes

```sql
\di
-- or for specific table
SELECT * FROM pg_indexes WHERE tablename = 'users';
```

### View Foreign Keys

```sql
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

### Count Records

```sql
SELECT 'users' AS table, COUNT(*) FROM users
UNION ALL
SELECT 'landing_pages', COUNT(*) FROM landing_pages
UNION ALL
SELECT 'leads', COUNT(*) FROM leads;
```

## 🧪 Testing the Schema

### Insert Test User

```sql
INSERT INTO users (name, email, password_hash, role)
VALUES ('Test User', 'test@example.com', '$2a$10$hashedpassword', 'viewer');
```

### Insert Test Landing Page

```sql
INSERT INTO landing_pages (title, slug, content_json, status, created_by)
VALUES (
    'Test Page',
    'test-page',
    '{"sections": [{"type": "hero", "title": "Hello World"}]}',
    'draft',
    1
);
```

### Insert Test Lead

```sql
INSERT INTO leads (name, email, phone, source, status, landing_page_id)
VALUES (
    'Test Lead',
    'lead@example.com',
    '+1-555-9999',
    'landing_page',
    'new',
    1
);
```

### Query Leads with Landing Page Info (JOIN)

```sql
SELECT
    l.id,
    l.name,
    l.email,
    l.source,
    l.status,
    lp.title AS landing_page_title,
    u.name AS created_by_user
FROM leads l
LEFT JOIN landing_pages lp ON l.landing_page_id = lp.id
LEFT JOIN users u ON lp.created_by = u.id;
```

## 📝 Migration Best Practices

1. **Always backup** before running migrations in production
2. **Test migrations** in development/staging first
3. **Version control** all migration files
4. **Never modify** existing migrations - create new ones
5. **Document changes** in migration comments
6. **Use transactions** for complex migrations

## 🔄 Future Migrations

When creating new migrations:

1. Use sequential numbering: `002_`, `003_`, etc.
2. Create both UP and DOWN (rollback) scripts
3. Include verification queries
4. Add comments explaining changes
5. Test thoroughly before committing

### Migration Naming Convention

```
<number>_<description>.sql
<number>_rollback_<description>.sql

Examples:
002_add_social_media_tables.sql
002_rollback_social_media_tables.sql
003_add_analytics_tables.sql
003_rollback_analytics_tables.sql
```

## 🛠 Troubleshooting

### Error: "database does not exist"

```bash
# Create the database first
psql -U postgres -c "CREATE DATABASE dmat_db;"
```

### Error: "permission denied"

```bash
# Grant privileges
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE dmat_db TO your_user;"
```

### Error: "relation already exists"

```bash
# Run rollback first
psql -U your_user -d dmat_db -f database/migrations/001_rollback_core_tables.sql

# Then run migration again
psql -U your_user -d dmat_db -f database/migrations/001_create_core_tables.sql
```

### Check PostgreSQL Connection

```bash
# Test connection
psql -U your_user -d dmat_db -c "SELECT version();"
```

## 📚 Additional Resources

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL Data Types](https://www.postgresql.org/docs/current/datatype.html)
- [PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)

---

**DMAT Database Team**
