# Task 2: Landing Page API Testing Guide

**Date:** 2025-12-04
**Task:** Backend API - All Landing Page Endpoints
**Status:** Complete

---

## 📋 Overview

This guide shows how to test all landing page admin API endpoints implemented in Task 2.

**Endpoints Implemented:**
- ✅ POST /api/admin/landing-pages (Create)
- ✅ GET /api/admin/landing-pages (List with filters)
- ✅ GET /api/admin/landing-pages/:id (Get single)
- ✅ PUT /api/admin/landing-pages/:id (Update)
- ✅ POST /api/admin/landing-pages/:id/publish (Publish)
- ✅ DELETE /api/admin/landing-pages/:id (Delete)
- ✅ GET /api/admin/landing-pages/stats (Statistics)

---

## 🚀 Prerequisites

1. **Database Setup:**
   ```bash
   cd database
   ./setup.sh setup
   ```

2. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Start Backend Server:**
   ```bash
   npm run dev
   ```

Server should start on http://localhost:5001 (or port specified in .env)

---

## 🔐 Authentication

For Phase 1 testing, use the `x-user-id` header:

```
x-user-id: 1
```

This will be replaced with JWT tokens in Task 11.

---

## 🧪 API Testing Examples

### 1. Create Landing Page

**Endpoint:** `POST /api/admin/landing-pages`

**cURL:**
```bash
curl -X POST http://localhost:5001/api/admin/landing-pages \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "title": "Free Marketing Guide 2025",
    "slug": "free-marketing-guide-2025",
    "headline": "Download Your Free Digital Marketing Guide",
    "subheading": "Learn the latest strategies that drive results in 2025",
    "body_text": "Our comprehensive 50-page guide covers SEO, social media, content marketing, and more.",
    "cta_text": "Get Your Free Guide",
    "form_fields": {
      "fields": [
        {
          "name": "name",
          "label": "Full Name",
          "type": "text",
          "required": true,
          "placeholder": "Enter your name"
        },
        {
          "name": "email",
          "label": "Work Email",
          "type": "email",
          "required": true,
          "placeholder": "your@company.com"
        },
        {
          "name": "company",
          "label": "Company Name",
          "type": "text",
          "required": false,
          "placeholder": "Your company"
        }
      ]
    }
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Free Marketing Guide 2025",
    "slug": "free-marketing-guide-2025",
    "headline": "Download Your Free Digital Marketing Guide",
    "publish_status": "draft",
    "published_url": null,
    "published_at": null,
    "created_by": 1,
    "created_at": "2025-12-04T...",
    "updated_at": "2025-12-04T..."
  },
  "message": "Landing page created successfully"
}
```

---

### 2. Get All Landing Pages

**Endpoint:** `GET /api/admin/landing-pages`

**cURL (No filters):**
```bash
curl -X GET http://localhost:5001/api/admin/landing-pages \
  -H "x-user-id: 1"
```

**cURL (With filters):**
```bash
curl -X GET "http://localhost:5001/api/admin/landing-pages?publish_status=draft&limit=10&orderBy=created_at&orderDir=DESC" \
  -H "x-user-id: 1"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Free Marketing Guide 2025",
      "slug": "free-marketing-guide-2025",
      "publish_status": "draft",
      "created_at": "2025-12-04T...",
      ...
    }
  ],
  "count": 1,
  "filters": {
    "publish_status": "draft"
  },
  "pagination": {
    "limit": 10
  }
}
```

---

### 3. Get Single Landing Page

**Endpoint:** `GET /api/admin/landing-pages/:id`

**cURL:**
```bash
curl -X GET http://localhost:5001/api/admin/landing-pages/1 \
  -H "x-user-id: 1"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Free Marketing Guide 2025",
    ...
  }
}
```

---

### 4. Update Landing Page

**Endpoint:** `PUT /api/admin/landing-pages/:id`

**cURL:**
```bash
curl -X PUT http://localhost:5001/api/admin/landing-pages/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{
    "headline": "Download Your Updated Free Guide!",
    "cta_text": "Download Now"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "headline": "Download Your Updated Free Guide!",
    "cta_text": "Download Now",
    ...
  },
  "message": "Landing page updated successfully"
}
```

---

### 5. Publish Landing Page

**Endpoint:** `POST /api/admin/landing-pages/:id/publish`

**cURL:**
```bash
curl -X POST http://localhost:5001/api/admin/landing-pages/1/publish \
  -H "x-user-id: 1"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "publish_status": "published",
    "published_url": "http://localhost:5001/pages/free-marketing-guide-2025.html",
    "published_at": "2025-12-04T...",
    ...
  },
  "message": "Landing page published successfully"
}
```

---

### 6. Get Landing Page Stats

**Endpoint:** `GET /api/admin/landing-pages/stats`

**cURL:**
```bash
curl -X GET http://localhost:5001/api/admin/landing-pages/stats \
  -H "x-user-id: 1"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "countByStatus": {
      "draft": 2,
      "published": 1
    },
    "total": 3
  }
}
```

---

### 7. Delete Landing Page

**Endpoint:** `DELETE /api/admin/landing-pages/:id`

**cURL:**
```bash
curl -X DELETE http://localhost:5001/api/admin/landing-pages/1 \
  -H "x-user-id: 1"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Landing page deleted successfully"
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Create → Edit → Publish → Delete

```bash
# 1. Create
curl -X POST http://localhost:5001/api/admin/landing-pages \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"title": "Summer Sale 2025", "slug": "summer-sale-2025"}'

# Response: {"success": true, "data": {"id": 1, ...}}

# 2. Update
curl -X PUT http://localhost:5001/api/admin/landing-pages/1 \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"headline": "Get 30% Off This Summer!"}'

# 3. Publish
curl -X POST http://localhost:5001/api/admin/landing-pages/1/publish \
  -H "x-user-id: 1"

# 4. Verify it's published
curl -X GET http://localhost:5001/api/admin/landing-pages/1 \
  -H "x-user-id: 1"

# Should show: "publish_status": "published"

# 5. Delete
curl -X DELETE http://localhost:5001/api/admin/landing-pages/1 \
  -H "x-user-id: 1"
```

---

## ❌ Error Handling Tests

### Test 1: Missing Required Field (title)

```bash
curl -X POST http://localhost:5001/api/admin/landing-pages \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"slug": "test-page"}'
```

**Expected:** 400 Bad Request with validation error

### Test 2: Duplicate Slug

```bash
# Create first page
curl -X POST http://localhost:5001/api/admin/landing-pages \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"title": "Page 1", "slug": "same-slug"}'

# Try to create second page with same slug
curl -X POST http://localhost:5001/api/admin/landing-pages \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"title": "Page 2", "slug": "same-slug"}'
```

**Expected:** 400 Bad Request with DUPLICATE_SLUG error

### Test 3: Invalid Slug Format

```bash
curl -X POST http://localhost:5001/api/admin/landing-pages \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1" \
  -d '{"title": "Test", "slug": "Invalid Slug With Spaces"}'
```

**Expected:** 400 Bad Request with validation error

### Test 4: Missing Authentication

```bash
curl -X POST http://localhost:5001/api/admin/landing-pages \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "slug": "test"}'
```

**Expected:** 401 Unauthorized

### Test 5: Page Not Found

```bash
curl -X GET http://localhost:5001/api/admin/landing-pages/99999 \
  -H "x-user-id: 1"
```

**Expected:** 404 Not Found

---

## 📊 Validation Rules Summary

| Field | Required | Max Length | Validation |
|-------|----------|------------|------------|
| title | ✅ Yes | 500 chars | Non-empty string |
| slug | ✅ Yes | 255 chars | Lowercase, numbers, hyphens only |
| headline | ❌ No | 500 chars | - |
| subheading | ❌ No | 1000 chars | - |
| body_text | ❌ No | Unlimited | - |
| cta_text | ❌ No | 100 chars | Default: "Submit" |
| hero_image_url | ❌ No | 2048 chars | - |
| form_fields | ❌ No | - | Must have ≥1 email field |

---

## 🔧 Troubleshooting

### Server Won't Start

```bash
# Check if database is running
psql -d dmat_dev -c "SELECT 1;"

# Check if port 5001 is already in use
lsof -i :5001

# Check environment variables
cat backend/.env
```

### Database Connection Error

```bash
# Verify database exists
psql -U postgres -c "\l" | grep dmat_dev

# Run migrations
cd database
./setup.sh setup
```

### 500 Internal Server Error

Check server logs for detailed error messages. Common issues:
- Database not running
- Missing environment variables
- Invalid SQL queries

---

## ✅ Testing Checklist

Before moving to Task 3, verify:

- [ ] Create landing page with all fields works
- [ ] Create landing page with minimal fields (title + slug) works
- [ ] List all landing pages works
- [ ] Filter landing pages by status works
- [ ] Get single landing page by ID works
- [ ] Update landing page works
- [ ] Publish landing page works
- [ ] Delete landing page works
- [ ] Get stats works
- [ ] Duplicate slug returns error
- [ ] Invalid slug format returns error
- [ ] Missing required fields returns error
- [ ] Missing authentication returns 401
- [ ] Non-existent page returns 404

---

## 📝 Next Steps

After testing Task 2:
- Proceed to Task 3: Implement Lead Capture API
- Or continue with remaining landing page features

**All 7 landing page endpoints are now functional!** 🎉
