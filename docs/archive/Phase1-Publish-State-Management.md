# Phase 1 Publish State Management

**Version:** 1.0
**Date:** 2025-12-03
**Purpose:** Specification of database state during landing page publishing

---

## 📋 Overview

This document specifies exactly what DMAT stores before, during, and after publishing a landing page. It covers database field updates, state transitions, error handling, and optional audit logging.

**Publishing Goal:** Transform a draft landing page into a publicly accessible page while maintaining complete audit trail and error handling.

---

## 🗄️ Database Schema Additions

### Landing Pages Table Updates

**Required Fields (Already Defined):**
```sql
-- Existing fields from migrations/002_extend_landing_pages.sql
publish_status VARCHAR(50) NOT NULL DEFAULT 'draft';
published_url VARCHAR(2048);
published_at TIMESTAMP WITH TIME ZONE;
```

**Recommended Additional Fields (Phase 1.5):**
```sql
-- Publishing workflow tracking
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS last_publish_attempt_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS last_publish_error TEXT;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_landing_pages_publish_status
ON landing_pages(publish_status);

CREATE INDEX IF NOT EXISTS idx_landing_pages_last_publish_attempt
ON landing_pages(last_publish_attempt_at DESC)
WHERE last_publish_attempt_at IS NOT NULL;
```

### Optional: Publication Log Table (Audit Trail)

**Purpose:** Track every publish attempt for debugging and analytics

```sql
CREATE TABLE IF NOT EXISTS landing_page_publication_log (
  id SERIAL PRIMARY KEY,
  landing_page_id INTEGER NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,

  -- Attempt tracking
  attempt_number INTEGER NOT NULL DEFAULT 1,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attempted_by INTEGER REFERENCES users(id) ON DELETE SET NULL,

  -- Status and result
  status VARCHAR(50) NOT NULL, -- 'success', 'failed', 'aborted'

  -- Platform details
  platform VARCHAR(50) NOT NULL, -- 'mock', 'wordpress'

  -- Success data
  published_url VARCHAR(2048),
  duration_ms INTEGER, -- How long publish took

  -- Error data
  error_code VARCHAR(100),
  error_message TEXT,
  error_details JSONB,

  -- Stack trace for debugging (optional)
  stack_trace TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_publication_log_landing_page
ON landing_page_publication_log(landing_page_id, attempted_at DESC);

CREATE INDEX IF NOT EXISTS idx_publication_log_status
ON landing_page_publication_log(status, attempted_at DESC);

CREATE INDEX IF NOT EXISTS idx_publication_log_attempted_by
ON landing_page_publication_log(attempted_by, attempted_at DESC)
WHERE attempted_by IS NOT NULL;
```

---

## 🔄 Publish Workflow & State Transitions

### State Machine

**Valid States:**
- `draft` - Initial state, not published
- `publishing` - Publish in progress (optional, for UI feedback)
- `published` - Successfully published and live
- `failed` - Publish attempt failed (optional, or revert to draft)

**Valid Transitions:**
```
draft → publishing → published (success)
draft → publishing → failed (error, keep as failed)
draft → publishing → draft (error, revert to draft)

published → publishing → published (re-publish)
published → draft (unpublish - Phase 2)

failed → publishing → published (retry success)
failed → publishing → failed (retry failed)
failed → draft (abandon, start over)
```

### State Transition Diagram

```
┌───────┐
│ draft │
└───┬───┘
    │ Click "Publish"
    ↓
┌────────────┐
│ publishing │ ← (Optional intermediate state)
└─────┬──────┘
      │
      ├─ Success ─→ ┌───────────┐
      │             │ published │
      │             └───────────┘
      │
      └─ Failure ─→ ┌────────┐
                    │ failed │ ← (Or revert to draft)
                    └────────┘
```

---

## 📝 Publish Workflow: Step-by-Step

### Before Publishing (Validation)

**Pre-Publish Checks:**
```javascript
// 1. Check current status
if (landingPage.publish_status === 'publishing') {
  return error('Publish already in progress');
}

// 2. Validate required fields
const errors = validatePublishRequirements(landingPage);
if (errors.length > 0) {
  return error('Validation failed', errors);
}

// 3. Check slug uniqueness (if republishing with different slug)
const duplicate = await checkSlugUnique(landingPage.slug, landingPage.id);
if (duplicate) {
  return error('Slug already in use');
}
```

---

### Step 1: Record Publish Attempt Start

**Database Update:**
```sql
UPDATE landing_pages
SET
  publish_status = 'publishing',
  last_publish_attempt_at = CURRENT_TIMESTAMP,
  last_publish_error = NULL,  -- Clear previous error
  updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
```

**Fields Updated:**
- `publish_status` → `'publishing'` (indicates publish in progress)
- `last_publish_attempt_at` → Current timestamp
- `last_publish_error` → `NULL` (clear any previous error)
- `updated_at` → Current timestamp

**Optional: Create Publication Log Entry (Start)**
```sql
INSERT INTO landing_page_publication_log (
  landing_page_id,
  attempt_number,
  attempted_at,
  attempted_by,
  status,
  platform
) VALUES (
  $1,  -- landing_page_id
  (SELECT COALESCE(MAX(attempt_number), 0) + 1
   FROM landing_page_publication_log
   WHERE landing_page_id = $1),  -- Auto-increment attempt number
  CURRENT_TIMESTAMP,
  $2,  -- attempted_by (user_id)
  'in_progress',
  $3   -- platform ('mock' or 'wordpress')
)
RETURNING id;
```

**Why Record Attempt Start:**
- Prevents concurrent publish attempts (check `publish_status = 'publishing'`)
- Tracks publish history (when was last attempt)
- Provides UI feedback ("Publishing in progress...")
- Debugging (know when publish started if it hangs)

---

### Step 2: Call Publisher Adapter

**Adapter Call:**
```javascript
const startTime = Date.now();

try {
  // Call appropriate publisher (mock or WordPress)
  const result = await publisher.publish({
    id: landingPage.id,
    title: landingPage.title,
    slug: landingPage.slug,
    headline: landingPage.headline,
    subheading: landingPage.subheading,
    body_text: landingPage.body_text,
    cta_text: landingPage.cta_text,
    hero_image_url: landingPage.hero_image_url,
    form_fields: landingPage.form_fields
  });

  const duration = Date.now() - startTime;

  // Success path (go to Step 3)

} catch (error) {
  const duration = Date.now() - startTime;

  // Failure path (go to Step 4)
}
```

**Adapter Success Result:**
```javascript
{
  success: true,
  published_url: "https://dmat-app.example.com/pages/free-marketing-guide-2025.html",
  platform: "mock",
  metadata: {
    file_path: "/var/www/dmat/public/pages/free-marketing-guide-2025.html",
    file_size: 12543
  }
}
```

**Adapter Failure Result:**
```javascript
{
  success: false,
  error: {
    code: "DISK_FULL",
    message: "Failed to write HTML file: disk full",
    details: {
      required_space: 15000,
      available_space: 1000
    }
  }
}
```

---

### Step 3: On Success - Update Database

**Database Update (Success):**
```sql
UPDATE landing_pages
SET
  publish_status = 'published',
  published_url = $2,
  published_at = COALESCE(published_at, CURRENT_TIMESTAMP),  -- Set only if NULL (preserve first publish)
  last_publish_error = NULL,  -- Clear any error
  updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
```

**Fields Updated on Success:**
- `publish_status` → `'published'`
- `published_url` → URL from adapter (e.g., `https://dmat-app.example.com/pages/{slug}.html`)
- `published_at` → Current timestamp (only if NULL - preserves first publish date)
- `last_publish_error` → `NULL` (clear error)
- `updated_at` → Current timestamp

**Optional: Update Publication Log (Success):**
```sql
UPDATE landing_page_publication_log
SET
  status = 'success',
  published_url = $2,
  duration_ms = $3,
  error_code = NULL,
  error_message = NULL,
  error_details = NULL
WHERE id = $1;  -- Use log entry ID from Step 1
```

**Why Preserve First Publish Date:**
```sql
published_at = COALESCE(published_at, CURRENT_TIMESTAMP)
```

- First publish: `published_at` is NULL → Set to CURRENT_TIMESTAMP
- Re-publish: `published_at` has value → Keep original value
- Benefit: Know when page was originally published (analytics)

**Business Logic:**
```javascript
async function onPublishSuccess(landingPageId, publishResult, logEntryId, duration) {
  // Update landing page
  const updatedPage = await db.query(`
    UPDATE landing_pages
    SET
      publish_status = 'published',
      published_url = $2,
      published_at = COALESCE(published_at, CURRENT_TIMESTAMP),
      last_publish_error = NULL,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `, [landingPageId, publishResult.published_url]);

  // Update publication log (if using)
  if (logEntryId) {
    await db.query(`
      UPDATE landing_page_publication_log
      SET
        status = 'success',
        published_url = $2,
        duration_ms = $3
      WHERE id = $1
    `, [logEntryId, publishResult.published_url, duration]);
  }

  return updatedPage.rows[0];
}
```

---

### Step 4: On Failure - Update Database

**Database Update (Failure):**
```sql
UPDATE landing_pages
SET
  publish_status = 'failed',  -- Or 'draft' to revert
  last_publish_error = $2,
  updated_at = CURRENT_TIMESTAMP
WHERE id = $1
RETURNING *;
```

**Fields Updated on Failure:**
- `publish_status` → `'failed'` (or `'draft'` to revert)
- `last_publish_error` → Error message from adapter
- `updated_at` → Current timestamp
- `published_url` → Unchanged (keep previous URL if re-publishing)
- `published_at` → Unchanged (keep original publish date)

**Optional: Update Publication Log (Failure):**
```sql
UPDATE landing_page_publication_log
SET
  status = 'failed',
  duration_ms = $2,
  error_code = $3,
  error_message = $4,
  error_details = $5,
  stack_trace = $6
WHERE id = $1;
```

**Error Message Storage:**
```javascript
// Format error message for storage
function formatErrorMessage(error) {
  // Keep it concise but informative
  const message = error.message || 'Unknown error';

  // Truncate if too long (database limit)
  if (message.length > 5000) {
    return message.substring(0, 5000) + '... (truncated)';
  }

  return message;
}
```

**Business Logic:**
```javascript
async function onPublishFailure(landingPageId, error, logEntryId, duration) {
  // Format error for storage
  const errorMessage = formatErrorMessage(error);
  const errorDetails = error.details ? JSON.stringify(error.details) : null;

  // Update landing page
  const updatedPage = await db.query(`
    UPDATE landing_pages
    SET
      publish_status = 'failed',
      last_publish_error = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING *
  `, [landingPageId, errorMessage]);

  // Update publication log (if using)
  if (logEntryId) {
    await db.query(`
      UPDATE landing_page_publication_log
      SET
        status = 'failed',
        duration_ms = $2,
        error_code = $3,
        error_message = $4,
        error_details = $5,
        stack_trace = $6
      WHERE id = $1
    `, [
      logEntryId,
      duration,
      error.code || 'UNKNOWN_ERROR',
      errorMessage,
      errorDetails,
      error.stack || null
    ]);
  }

  return updatedPage.rows[0];
}
```

**Should Status Be 'failed' or 'draft'?**

**Option A: Set to 'failed'**
- Pro: Clear indication that publish failed
- Pro: Can filter/display failed publishes in UI
- Pro: User can retry from failed state
- Con: Adds another state to manage

**Option B: Revert to 'draft'**
- Pro: Simpler state machine (no failed state)
- Pro: User can edit and retry naturally
- Con: Loses information that publish was attempted
- Con: Must check `last_publish_error` to know it failed

**Recommendation for Phase 1:** Use `'failed'` state for better debugging and user feedback.

---

## 🔒 Transaction Handling

### Database Transactions

**Why Transactions Matter:**
- Publish is a multi-step operation
- Database must be consistent even if server crashes mid-publish
- Prevent partial updates

**Transaction Wrapper:**
```javascript
async function publishLandingPage(landingPageId, userId) {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    // Step 1: Record attempt start
    const logEntry = await recordPublishAttemptStart(client, landingPageId, userId);

    // Step 2: Call publisher adapter (outside transaction - may take time)
    // Note: We commit the "publishing" state first, then call adapter
    await client.query('COMMIT');

    const startTime = Date.now();
    let publishResult;

    try {
      publishResult = await publisher.publish(landingPage);
      const duration = Date.now() - startTime;

      // Step 3: Update on success
      await onPublishSuccess(landingPageId, publishResult, logEntry.id, duration);

      return {
        success: true,
        landingPage: await getLandingPage(landingPageId),
        message: 'Landing page published successfully'
      };

    } catch (publishError) {
      const duration = Date.now() - startTime;

      // Step 4: Update on failure
      await onPublishFailure(landingPageId, publishError, logEntry.id, duration);

      return {
        success: false,
        error: publishError
      };
    }

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

**Key Transaction Points:**

1. **Before calling adapter:** Commit transaction with status = 'publishing'
   - Why: Adapter call may take seconds/minutes
   - Can't hold DB transaction open that long
   - Other requests can see "publishing" status

2. **After adapter returns:** New transaction for success/failure update
   - Fast operation (single UPDATE)
   - Can be in transaction

---

## 📊 Database State Examples

### Example 1: First Successful Publish

**Before Publish (Draft):**
```sql
id: 5
title: "Free Marketing Guide 2025"
slug: "free-marketing-guide-2025"
publish_status: "draft"
published_url: NULL
published_at: NULL
last_publish_attempt_at: NULL
last_publish_error: NULL
created_at: "2025-12-03 10:00:00"
updated_at: "2025-12-03 10:30:00"
```

**During Publish (Publishing):**
```sql
id: 5
publish_status: "publishing"
last_publish_attempt_at: "2025-12-03 11:00:00"
last_publish_error: NULL
updated_at: "2025-12-03 11:00:00"
-- (other fields unchanged)
```

**After Successful Publish:**
```sql
id: 5
publish_status: "published"
published_url: "https://dmat-app.example.com/pages/free-marketing-guide-2025.html"
published_at: "2025-12-03 11:00:05"  -- First publish time
last_publish_attempt_at: "2025-12-03 11:00:00"
last_publish_error: NULL
updated_at: "2025-12-03 11:00:05"
```

---

### Example 2: Re-Publish (Update Existing Page)

**Before Re-Publish (Already Published):**
```sql
id: 5
publish_status: "published"
published_url: "https://dmat-app.example.com/pages/free-marketing-guide-2025.html"
published_at: "2025-12-03 11:00:05"  -- Original publish time
last_publish_attempt_at: "2025-12-03 11:00:00"
last_publish_error: NULL
updated_at: "2025-12-03 14:30:00"  -- Page was edited
```

**After Successful Re-Publish:**
```sql
id: 5
publish_status: "published"
published_url: "https://dmat-app.example.com/pages/free-marketing-guide-2025.html"  -- Same URL
published_at: "2025-12-03 11:00:05"  -- Preserved (original publish time)
last_publish_attempt_at: "2025-12-03 15:00:00"  -- Updated to latest attempt
last_publish_error: NULL
updated_at: "2025-12-03 15:00:00"
```

**Note:** `published_at` unchanged (preserves original publish date)

---

### Example 3: Failed Publish

**Before Publish (Draft):**
```sql
id: 6
title: "Contact Sales"
slug: "contact-sales"
publish_status: "draft"
published_url: NULL
published_at: NULL
last_publish_attempt_at: NULL
last_publish_error: NULL
```

**After Failed Publish:**
```sql
id: 6
publish_status: "failed"
published_url: NULL
published_at: NULL
last_publish_attempt_at: "2025-12-03 16:00:00"
last_publish_error: "Failed to write HTML file: disk full. Required 15KB, available 1KB."
updated_at: "2025-12-03 16:00:00"
```

---

### Example 4: Retry After Failure

**Before Retry (Failed State):**
```sql
id: 6
publish_status: "failed"
last_publish_attempt_at: "2025-12-03 16:00:00"
last_publish_error: "Failed to write HTML file: disk full..."
```

**During Retry (Publishing):**
```sql
id: 6
publish_status: "publishing"
last_publish_attempt_at: "2025-12-03 16:30:00"  -- New attempt
last_publish_error: NULL  -- Cleared
updated_at: "2025-12-03 16:30:00"
```

**After Successful Retry:**
```sql
id: 6
publish_status: "published"
published_url: "https://dmat-app.example.com/pages/contact-sales.html"
published_at: "2025-12-03 16:30:05"  -- Set on first successful publish
last_publish_attempt_at: "2025-12-03 16:30:00"
last_publish_error: NULL
updated_at: "2025-12-03 16:30:05"
```

---

## 📋 Publication Log Table Examples

### Example Log Entries

**Entry 1: Successful First Publish**
```sql
id: 1
landing_page_id: 5
attempt_number: 1
attempted_at: "2025-12-03 11:00:00"
attempted_by: 1  -- User ID
status: "success"
platform: "mock"
published_url: "https://dmat-app.example.com/pages/free-marketing-guide-2025.html"
duration_ms: 245
error_code: NULL
error_message: NULL
error_details: NULL
created_at: "2025-12-03 11:00:00"
```

**Entry 2: Failed Publish Attempt**
```sql
id: 2
landing_page_id: 6
attempt_number: 1
attempted_at: "2025-12-03 16:00:00"
attempted_by: 2
status: "failed"
platform: "mock"
published_url: NULL
duration_ms: 120
error_code: "DISK_FULL"
error_message: "Failed to write HTML file: disk full. Required 15KB, available 1KB."
error_details: '{"required_space": 15000, "available_space": 1000}'
stack_trace: "Error: ENOSPC: no space left on device..."
created_at: "2025-12-03 16:00:00"
```

**Entry 3: Successful Retry**
```sql
id: 3
landing_page_id: 6
attempt_number: 2  -- Second attempt
attempted_at: "2025-12-03 16:30:00"
attempted_by: 2
status: "success"
platform: "mock"
published_url: "https://dmat-app.example.com/pages/contact-sales.html"
duration_ms: 198
error_code: NULL
error_message: NULL
error_details: NULL
created_at: "2025-12-03 16:30:00"
```

---

## 🔍 Querying Publish History

### Get Latest Publish Attempt

```sql
-- Get most recent publish attempt for a landing page
SELECT *
FROM landing_page_publication_log
WHERE landing_page_id = 5
ORDER BY attempted_at DESC
LIMIT 1;
```

### Get All Failed Publishes

```sql
-- Get all failed publish attempts (for debugging)
SELECT
  l.landing_page_id,
  lp.title,
  lp.slug,
  l.attempted_at,
  l.error_code,
  l.error_message,
  u.name AS attempted_by_name
FROM landing_page_publication_log l
JOIN landing_pages lp ON l.landing_page_id = lp.id
LEFT JOIN users u ON l.attempted_by = u.id
WHERE l.status = 'failed'
ORDER BY l.attempted_at DESC;
```

### Get Publish Success Rate

```sql
-- Calculate success rate for all publishes
SELECT
  COUNT(*) AS total_attempts,
  SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) AS successful,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed,
  ROUND(
    100.0 * SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) / COUNT(*),
    2
  ) AS success_rate_pct
FROM landing_page_publication_log;
```

### Get Average Publish Duration

```sql
-- Get average publish time by platform
SELECT
  platform,
  COUNT(*) AS attempts,
  ROUND(AVG(duration_ms)) AS avg_duration_ms,
  ROUND(AVG(duration_ms) / 1000.0, 2) AS avg_duration_sec,
  MIN(duration_ms) AS min_duration_ms,
  MAX(duration_ms) AS max_duration_ms
FROM landing_page_publication_log
WHERE status = 'success'
GROUP BY platform;
```

---

## 🔁 Retry Logic

### Automatic vs Manual Retry

**Phase 1 Recommendation:** Manual retry only (user clicks "Retry" button)

**Why:**
- Simpler implementation
- User has control
- Can fix issues before retry (e.g., edit content)
- Automatic retry can mask real problems

**Phase 2+:** Add automatic retry for transient errors

### Manual Retry Implementation

```javascript
async function retryPublish(landingPageId, userId) {
  // Get current landing page
  const landingPage = await getLandingPage(landingPageId);

  // Check can retry
  if (landingPage.publish_status !== 'failed' && landingPage.publish_status !== 'draft') {
    return error('Cannot retry: page is currently publishing or already published');
  }

  // Retry is just a regular publish
  return publishLandingPage(landingPageId, userId);
}
```

### UI: Display Retry Option

```javascript
// In frontend dashboard
if (landingPage.publish_status === 'failed') {
  return (
    <div className="publish-failed">
      <p className="error">
        Publish failed: {landingPage.last_publish_error}
      </p>
      <button onClick={() => retryPublish(landingPage.id)}>
        Retry Publish
      </button>
      <button onClick={() => editLandingPage(landingPage.id)}>
        Edit & Fix Issues
      </button>
    </div>
  );
}
```

---

## 🚨 Error Handling Best Practices

### Error Categories

**1. Validation Errors (400 - User Fixable)**
- Missing required fields
- Invalid slug format
- Duplicate slug
- Invalid form configuration

**Action:** Don't record as publish attempt, return validation errors to UI

**2. Server Errors (500 - Transient)**
- Disk full
- Network timeout
- Database connection failed
- WordPress API unavailable

**Action:** Record as failed attempt, allow retry

**3. Fatal Errors (500 - Requires Intervention)**
- WordPress authentication failed (bad credentials)
- Filesystem permissions error
- Database corruption

**Action:** Record as failed, alert admin, require manual intervention

### Error Message Guidelines

**Bad Error Messages:**
```
"Error"
"Publish failed"
"Something went wrong"
```

**Good Error Messages:**
```
"Failed to write HTML file: disk full. Required 15KB, available 1KB. Please contact your system administrator."

"WordPress API authentication failed. Please check WordPress credentials in settings."

"Network timeout connecting to WordPress. The WordPress site may be down or unreachable. Please try again in a few minutes."
```

**Error Message Template:**
```
[What happened] [Why it happened] [What to do about it]
```

---

## 📊 Database Field Summary

### landing_pages Table Fields

| Field | Type | Purpose | Set When | Null Allowed |
|-------|------|---------|----------|--------------|
| `publish_status` | VARCHAR(50) | Current state | Always | No (default 'draft') |
| `published_url` | VARCHAR(2048) | Public URL | On successful publish | Yes |
| `published_at` | TIMESTAMP | First publish time | On first successful publish | Yes |
| `last_publish_attempt_at` | TIMESTAMP | Latest attempt time | On every publish attempt | Yes |
| `last_publish_error` | TEXT | Latest error message | On publish failure | Yes |
| `updated_at` | TIMESTAMP | Last modification | On any update | No |

### publication_log Table Fields (Optional)

| Field | Type | Purpose |
|-------|------|---------|
| `id` | SERIAL | Primary key |
| `landing_page_id` | INTEGER | Which page |
| `attempt_number` | INTEGER | Attempt count (1, 2, 3...) |
| `attempted_at` | TIMESTAMP | When attempt started |
| `attempted_by` | INTEGER | User ID who attempted |
| `status` | VARCHAR(50) | Result ('success', 'failed') |
| `platform` | VARCHAR(50) | Publisher used ('mock', 'wordpress') |
| `published_url` | VARCHAR(2048) | URL if successful |
| `duration_ms` | INTEGER | How long publish took |
| `error_code` | VARCHAR(100) | Error code if failed |
| `error_message` | TEXT | Error description if failed |
| `error_details` | JSONB | Structured error data |
| `stack_trace` | TEXT | Full stack trace for debugging |

---

## 🧪 Testing Scenarios

### Test 1: First Successful Publish

**Setup:**
- Landing page in 'draft' status
- Valid content

**Expected Result:**
```sql
publish_status: 'published'
published_url: 'https://...'
published_at: <timestamp>
last_publish_attempt_at: <timestamp>
last_publish_error: NULL
```

### Test 2: Publish Failure (Disk Full)

**Setup:**
- Simulate disk full error in mock publisher

**Expected Result:**
```sql
publish_status: 'failed'
published_url: NULL
published_at: NULL
last_publish_attempt_at: <timestamp>
last_publish_error: 'Failed to write HTML file: disk full...'
```

### Test 3: Retry After Failure

**Setup:**
- Landing page in 'failed' status
- Fix underlying issue (free up disk)
- Click retry

**Expected Result:**
```sql
publish_status: 'published'
published_url: 'https://...'
published_at: <timestamp>
last_publish_attempt_at: <timestamp> (new)
last_publish_error: NULL (cleared)
```

### Test 4: Re-Publish (Update)

**Setup:**
- Landing page already published
- Edit content
- Publish again

**Expected Result:**
```sql
publish_status: 'published'
published_url: 'https://...' (same)
published_at: <original timestamp> (preserved)
last_publish_attempt_at: <new timestamp>
last_publish_error: NULL
```

### Test 5: Concurrent Publish Attempts

**Setup:**
- Two users click "Publish" at same time

**Expected Result:**
- First request: Sets status to 'publishing', continues
- Second request: Sees status = 'publishing', returns error "Publish already in progress"

**Implementation:**
```javascript
// Check for concurrent publish
const result = await db.query(`
  UPDATE landing_pages
  SET publish_status = 'publishing',
      last_publish_attempt_at = CURRENT_TIMESTAMP
  WHERE id = $1
    AND publish_status != 'publishing'  -- Only update if not already publishing
  RETURNING *
`, [landingPageId]);

if (result.rows.length === 0) {
  return error('Publish already in progress');
}
```

---

## 📚 Related Documentation

- [Phase1-Publish-Workflow.md](./Phase1-Publish-Workflow.md) - Detailed publish workflow
- [Phase1-WordPress-Integration-Strategy.md](./Phase1-WordPress-Integration-Strategy.md) - Publisher implementations
- [Phase1-LandingPage-Lifecycle.md](./Phase1-LandingPage-Lifecycle.md) - State machine details
- [Database.md](../database/Database.md) - Complete database schema

---

## 🔮 Future Enhancements (Phase 2+)

### Scheduled Publishing

```sql
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS scheduled_publish_at TIMESTAMP WITH TIME ZONE;

-- New state: 'scheduled'
```

### Unpublish Functionality

```sql
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS unpublished_at TIMESTAMP WITH TIME ZONE;

-- State transition: published → draft (unpublish)
```

### Automatic Retry

```sql
ALTER TABLE landing_pages
ADD COLUMN IF NOT EXISTS retry_count INTEGER NOT NULL DEFAULT 0;
ADD COLUMN IF NOT EXISTS max_retries INTEGER NOT NULL DEFAULT 3;
ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMP WITH TIME ZONE;
```

### Version History

```sql
CREATE TABLE landing_page_versions (
  id SERIAL PRIMARY KEY,
  landing_page_id INTEGER NOT NULL REFERENCES landing_pages(id),
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

**Document Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-03
**Maintained by:** DMAT Backend & Database Team
