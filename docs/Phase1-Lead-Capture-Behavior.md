# Phase 1 Lead Capture Endpoint - Behavioral Specification

**Version:** 1.0
**Date:** 2025-12-03
**Purpose:** Plain English specification of lead capture endpoint behavior

---

## 📋 Overview

This document describes what happens when a visitor submits a form on a published landing page. It covers what information is required, how it's validated, what happens when everything works correctly, and what happens when something goes wrong.

**Endpoint:** `POST /api/public/leads`

**Who uses this:** Public visitors filling out landing page forms (no login required)

**Where it's called from:** WordPress landing pages or DMAT-hosted landing pages

---

## 📥 Required Input Fields

### Always Required

**1. landing_page_id**
- **What it is:** The ID number of the landing page this form is on
- **Format:** Integer (whole number)
- **Example:** `5`
- **How it's provided:** Hidden field in the form
- **Why it's required:** Tells DMAT which landing page captured this lead

**2. email**
- **What it is:** The visitor's email address
- **Format:** Valid email address
- **Example:** `"john.smith@company.com"`
- **Why it's required:** Primary way to contact the lead and identify them

### Conditionally Required

**Other fields** marked as `required: true` in the landing page's form configuration

For example, if the landing page form has these fields configured:
- Name (required)
- Email (required) ✓ Always required
- Company (optional)
- Phone (optional)

Then both **name** and **email** must be provided by the visitor.

---

## 📤 Optional Input Fields

### Standard Contact Information

**name**
- **What it is:** Full name of the visitor
- **Format:** Text, up to 255 characters
- **Example:** `"John Smith"`

**phone**
- **What it is:** Phone number
- **Format:** Text (any format), up to 50 characters
- **Example:** `"+1-555-123-4567"` or `"555-123-4567"` or `"(555) 123-4567"`

**company**
- **What it is:** Company name where visitor works
- **Format:** Text, up to 255 characters
- **Example:** `"Acme Corporation"`

**job_title**
- **What it is:** Visitor's job title or role
- **Format:** Text, up to 255 characters
- **Example:** `"Marketing Director"`

**message**
- **What it is:** Free-form message or comment from visitor
- **Format:** Text, no length limit
- **Example:** `"I'm interested in learning more about your enterprise plan for a team of 50 people."`

### Technical Metadata (Automatically Captured)

**referrer_url**
- **What it is:** The webpage the visitor was on before landing on this page
- **Format:** URL, up to 2048 characters
- **Example:** `"https://google.com/search?q=digital+marketing+guide"`
- **How it's captured:** JavaScript: `document.referrer`

**landing_url**
- **What it is:** The full URL of the landing page, including UTM tracking parameters
- **Format:** URL, up to 2048 characters
- **Example:** `"https://innovateelectronics.com/lp/free-marketing-guide-2025?utm_source=google&utm_medium=cpc&utm_campaign=q4-2025"`
- **How it's captured:** JavaScript: `window.location.href`

**user_agent**
- **What it is:** Information about the visitor's browser and device
- **Format:** Text, up to 1000 characters
- **Example:** `"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."`
- **How it's captured:** JavaScript: `navigator.userAgent` OR automatically from HTTP headers

**ip_address**
- **What it is:** Visitor's IP address
- **Format:** IPv4 or IPv6 address
- **Example:** `"192.168.1.100"` or `"2001:0db8:85a3:0000:0000:8a2e:0370:7334"`
- **How it's captured:** Automatically by backend from request headers

### Custom Fields

Any other fields defined in the landing page's form configuration will be accepted and stored.

---

## ✅ Validation Rules

### 1. landing_page_id Validation

**Rule:** Must be provided and must match a published landing page

**What happens:**
1. Check if `landing_page_id` is provided
2. Look up landing page in database
3. Verify landing page exists
4. Verify landing page status is "published"

**Passes if:**
- landing_page_id is a valid integer
- Landing page exists in database
- Landing page publish_status = "published"

**Fails if:**
- landing_page_id is missing → Error: "Missing required field: landing_page_id"
- landing_page_id doesn't exist → Error: "Landing page not found"
- Landing page is not published → Error: "This landing page is not currently accepting submissions"

### 2. Email Validation

**Rule:** Email must be provided and must be a valid email format

**What happens:**
1. Check if email is provided
2. Check if email matches valid email pattern

**Valid email format:**
- Contains exactly one `@` symbol
- Has text before the `@`
- Has text after the `@`
- Has a dot (`.`) after the `@`
- Has text after the final dot

**Examples of valid emails:**
- ✅ `john@company.com`
- ✅ `john.smith@company.co.uk`
- ✅ `john+tag@company.com`
- ✅ `john_smith@company-name.com`

**Examples of invalid emails:**
- ❌ `john` (no @ symbol)
- ❌ `john@` (nothing after @)
- ❌ `@company.com` (nothing before @)
- ❌ `john@company` (no dot after @)
- ❌ `john @company.com` (space in email)

**Passes if:**
- Email is provided
- Email matches valid email pattern

**Fails if:**
- Email is missing → Error: "Email is required"
- Email format is invalid → Error: "Please provide a valid email address"

### 3. Required Fields Validation

**Rule:** Any field marked as `required: true` in the landing page's form configuration must be provided

**What happens:**
1. Get the landing page's form field configuration
2. Find all fields where `required: true`
3. Check if each required field has a value in the submission
4. Value must not be empty or just whitespace

**Example form configuration:**
```json
{
  "fields": [
    { "name": "name", "required": true },
    { "name": "email", "required": true },
    { "name": "company", "required": false },
    { "name": "phone", "required": false }
  ]
}
```

For this configuration:
- **Must provide:** name, email
- **Optional:** company, phone

**Passes if:**
- All required fields have values
- Values are not empty or just whitespace

**Fails if:**
- Any required field is missing or empty → Error: "[Field Label] is required"

**Example error:**
```
Required fields are missing:
- Full Name is required
- Email is required
```

### 4. Field Length Validation

**Rule:** Fields cannot exceed maximum allowed length

**Limits:**
- name: 255 characters
- email: 255 characters
- phone: 50 characters
- company: 255 characters
- job_title: 255 characters
- message: 10,000 characters
- referrer_url: 2,048 characters
- landing_url: 2,048 characters
- user_agent: 1,000 characters

**What happens:**
- If a field exceeds its maximum length, it's automatically truncated (cut off)
- No error is returned (graceful handling)

**Example:**
If someone submits a name with 300 characters, only the first 255 characters are stored.

### 5. Spam Detection

**Rule:** Submissions showing bot-like behavior are rejected

**Honeypot Check:**
- Form includes a hidden field called `website`
- This field is hidden from human visitors but visible to bots
- If this field has any value, the submission is rejected as spam

**Time-Based Check:**
- Form includes a hidden timestamp showing when the form loaded
- If submission happens less than 2 seconds after form load, rejected as bot

**Passes if:**
- Honeypot field is empty
- At least 2 seconds elapsed between form load and submission

**Fails if:**
- Honeypot field has any value → Error: "Invalid submission" (generic message to not reveal spam detection)
- Submitted in less than 2 seconds → Error: "Invalid submission"

### 6. Rate Limiting

**Rule:** Maximum 10 submissions per minute from the same IP address

**What happens:**
- System tracks how many submissions come from each IP address
- If more than 10 submissions in 1 minute, additional submissions are blocked

**Passes if:**
- Less than 10 submissions from this IP in the last minute

**Fails if:**
- 10 or more submissions from this IP in the last minute → Error: "Too many submissions. Please try again in a moment."

**Wait time:**
- User must wait until 1 minute has passed since their first submission in the current window

### 7. Input Sanitization

**Rule:** All input is cleaned before being stored

**What happens:**
1. **Trim whitespace** - Remove spaces from beginning and end
   - Input: `"  John Smith  "` → Stored: `"John Smith"`

2. **Remove control characters** - Remove invisible/special characters
   - Removes characters like null bytes, carriage returns, etc.

3. **Truncate to max length** - Cut off at maximum allowed length
   - Input: 300-character name → Stored: First 255 characters

**Note:** This is automatic and does not produce errors. Data is silently cleaned.

---

## ✅ Success Behavior

### What Happens on Successful Submission

**Step 1: Lead is Saved**
1. All form data is stored in the `leads` table in the database
2. A unique lead ID is assigned (e.g., 42)
3. Source is set to "landing_page"
4. Source details is set to "LP: [landing-page-slug]"
5. Created timestamp is recorded

**Step 2: Response is Sent**

The backend sends back a success response with:
- **HTTP Status:** 201 Created
- **Success flag:** `true`
- **Message:** Thank you message
- **Data:** Lead ID and email
- **Redirect URL:** Optional thank you page URL

**Example Success Response:**
```json
{
  "success": true,
  "message": "Thank you for your submission!",
  "data": {
    "lead_id": 42,
    "email": "john.smith@company.com"
  },
  "redirect_url": null
}
```

**Example with Redirect:**
```json
{
  "success": true,
  "message": "Thank you for your submission!",
  "data": {
    "lead_id": 42,
    "email": "john.smith@company.com"
  },
  "redirect_url": "https://innovateelectronics.com/thank-you"
}
```

**Step 3: User Sees Confirmation**

**Option A: Show Message (No Redirect)**
- Success message displayed on the page
- Form is reset (cleared)
- User stays on the landing page

**Example:**
```
✅ Thank you for your submission!
We'll be in touch soon.
```

**Option B: Redirect to Thank You Page**
- User is automatically redirected to a thank you page
- Usually happens after 1-2 second delay
- Thank you page can provide additional information, next steps, or download link

**Example:**
```
✅ Thank you! Redirecting you now...
[After 1.5 seconds, browser goes to /thank-you page]
```

### What Data is Stored

**In the `leads` table:**

| Field | Value |
|-------|-------|
| id | 42 (auto-generated) |
| name | "John Smith" |
| email | "john.smith@company.com" |
| phone | "+1-555-123-4567" |
| company | "Acme Corporation" |
| job_title | "Marketing Director" |
| message | "Interested in enterprise plan" |
| source | "landing_page" |
| source_details | "LP: free-marketing-guide-2025" |
| landing_page_id | 5 |
| referrer_url | "https://google.com/search?q=..." |
| landing_url | "https://innovateelectronics.com/lp/free-marketing-guide-2025?utm_source=google..." |
| user_agent | "Mozilla/5.0 (Windows NT 10.0..." |
| ip_address | "192.168.1.100" |
| created_at | "2025-12-03 14:30:00" |
| updated_at | "2025-12-03 14:30:00" |

**This lead now appears in:**
- DMAT admin dashboard leads list
- Can be filtered by landing page
- Can be exported to CSV
- Can be viewed individually with all details

---

## ❌ Failure Behavior

### What Happens When Something Goes Wrong

When validation fails or an error occurs, the backend sends back an error response and the lead is **NOT** saved.

### Error Response Format

All errors follow this format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... },
    "statusCode": 400
  }
}
```

### Common Error Scenarios

#### 1. Missing landing_page_id

**What causes it:**
- Form doesn't include the hidden `landing_page_id` field
- JavaScript error prevents field from being submitted

**HTTP Status:** 400 Bad Request

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required field: landing_page_id",
    "statusCode": 400
  }
}
```

**What user sees:**
```
❌ Submission failed. Please try again.
```

**What to do:**
- This indicates a technical issue with the form setup
- User can try refreshing the page and submitting again
- If persists, contact support

---

#### 2. Landing Page Not Found

**What causes it:**
- landing_page_id doesn't match any landing page in the database
- Landing page was deleted after being published

**HTTP Status:** 404 Not Found

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "LANDING_PAGE_NOT_FOUND",
    "message": "Landing page not found",
    "statusCode": 404
  }
}
```

**What user sees:**
```
❌ This form is no longer available.
```

**What to do:**
- User cannot submit this form
- Contact the site owner

---

#### 3. Landing Page Not Published

**What causes it:**
- Landing page was unpublished after visitor loaded the page
- Landing page status changed from "published" to "draft"

**HTTP Status:** 400 Bad Request

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "LANDING_PAGE_NOT_PUBLISHED",
    "message": "This landing page is not currently accepting submissions",
    "statusCode": 400
  }
}
```

**What user sees:**
```
❌ This form is not currently accepting submissions.
```

**What to do:**
- User cannot submit this form
- Contact the site owner

---

#### 4. Missing Required Fields

**What causes it:**
- User didn't fill out all required fields
- JavaScript validation was bypassed
- User disabled JavaScript

**HTTP Status:** 400 Bad Request

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Required fields are missing",
    "details": [
      {
        "field": "name",
        "message": "Full Name is required"
      },
      {
        "field": "email",
        "message": "Email is required"
      }
    ],
    "statusCode": 400
  }
}
```

**What user sees:**
```
❌ Required fields are missing:
- Full Name is required
- Email is required

Please fill out all required fields.
```

**What to do:**
- Fill in the missing required fields
- Submit the form again

---

#### 5. Invalid Email Format

**What causes it:**
- User entered an invalid email address
- Email doesn't contain @ symbol
- Email doesn't have proper format

**HTTP Status:** 400 Bad Request

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [
      {
        "field": "email",
        "message": "Please provide a valid email address"
      }
    ],
    "statusCode": 400
  }
}
```

**What user sees:**
```
❌ Invalid email format
Please provide a valid email address.
```

**What to do:**
- Check email address for typos
- Make sure it includes @ symbol
- Make sure it has a domain (e.g., @company.com)
- Submit again with corrected email

---

#### 6. Spam Detected

**What causes it:**
- Honeypot field was filled (indicates bot)
- Form submitted too quickly (< 2 seconds)

**HTTP Status:** 400 Bad Request

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "SPAM_DETECTED",
    "message": "Invalid submission",
    "statusCode": 400
  }
}
```

**What user sees:**
```
❌ Invalid submission. Please try again.
```

**Note:** Generic message is intentional (don't reveal spam detection logic)

**What to do:**
- If legitimate user, refresh page and try again more slowly
- Make sure to only fill in visible fields

---

#### 7. Rate Limit Exceeded

**What causes it:**
- Same IP address submitted more than 10 forms in 1 minute
- Possible bot attack or user repeatedly clicking submit

**HTTP Status:** 429 Too Many Requests

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many submissions. Please try again in a moment.",
    "statusCode": 429
  }
}
```

**What user sees:**
```
❌ Too many submissions. Please try again in a moment.
```

**What to do:**
- Wait 1 minute
- Try submitting again
- Don't click submit button multiple times

---

#### 8. Database Error

**What causes it:**
- Database is down or unreachable
- Database connection pool exhausted
- Disk space full
- Other technical issue

**HTTP Status:** 500 Internal Server Error

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An error occurred while processing your submission. Please try again.",
    "statusCode": 500
  }
}
```

**What user sees:**
```
❌ An error occurred while processing your submission.
Please try again.
```

**What to do:**
- Try submitting again in a few moments
- If error persists, contact support
- Technical team is automatically notified

---

#### 9. Service Unavailable

**What causes it:**
- Database is completely unreachable
- Backend service is restarting
- Maintenance mode

**HTTP Status:** 503 Service Unavailable

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "SERVICE_UNAVAILABLE",
    "message": "Service temporarily unavailable. Please try again later.",
    "statusCode": 503
  }
}
```

**What user sees:**
```
❌ Service temporarily unavailable.
Please try again later.
```

**What to do:**
- Wait a few minutes
- Try again
- If urgent, contact support

---

#### 10. Network Error (Client-Side)

**What causes it:**
- Visitor's internet connection dropped
- CORS blocked by browser (misconfiguration)
- Request timeout
- Firewall blocking request

**What happens:**
- JavaScript fetch() call fails
- No response received from server
- Caught by JavaScript catch block

**What user sees:**
```
❌ Network error. Please check your connection and try again.
```

**What to do:**
- Check internet connection
- Try again
- Try from a different network if problem persists

---

## 🔄 User Experience Flow

### Successful Submission Flow

```
1. Visitor fills out form
   ↓
2. Visitor clicks "Submit" button
   ↓
3. Button shows "Submitting..." (disabled)
   ↓
4. Form data sent to DMAT API
   ↓
5. DMAT validates and saves lead
   ↓
6. Success response received
   ↓
7a. Show success message on page
    - "Thank you for your submission!"
    - Form is reset
    OR
7b. Redirect to thank you page
    - "Thank you! Redirecting..."
    - Browser goes to /thank-you
```

### Failed Submission Flow

```
1. Visitor fills out form (some fields missing)
   ↓
2. Visitor clicks "Submit" button
   ↓
3. Button shows "Submitting..." (disabled)
   ↓
4. Form data sent to DMAT API
   ↓
5. DMAT validates and finds errors
   ↓
6. Error response received
   ↓
7. Show error message
   - "Required fields are missing"
   - List specific fields
   - Button re-enabled
   ↓
8. Visitor corrects errors and tries again
```

---

## 📊 Quick Reference

### Required Fields Summary

| Field | Always Required? | Condition |
|-------|------------------|-----------|
| landing_page_id | ✅ Yes | Must be valid and published |
| email | ✅ Yes | Must be valid email format |
| Other fields | ⚠️ Depends | Based on landing page form config |

### HTTP Status Codes

| Status | Meaning | When |
|--------|---------|------|
| 201 | Created | Success - lead saved |
| 400 | Bad Request | Validation error |
| 404 | Not Found | Landing page doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Database/server error |
| 503 | Service Unavailable | Service is down |

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Missing or invalid fields |
| LANDING_PAGE_NOT_FOUND | 404 | Landing page doesn't exist |
| LANDING_PAGE_NOT_PUBLISHED | 400 | Landing page not accepting submissions |
| SPAM_DETECTED | 400 | Bot or spam submission detected |
| RATE_LIMIT_EXCEEDED | 429 | Too many submissions from this IP |
| INTERNAL_SERVER_ERROR | 500 | Unexpected server error |
| SERVICE_UNAVAILABLE | 503 | Service temporarily down |

---

## 💡 Best Practices

### For Frontend Implementation

**1. Show Clear Error Messages**
- Display specific validation errors next to the relevant fields
- Use friendly language ("Please provide your email address" not "Invalid email")
- Show errors in red to draw attention

**2. Disable Submit Button During Submission**
- Change button text to "Submitting..." or show spinner
- Prevents duplicate submissions
- Gives user feedback that something is happening

**3. Handle All Error Scenarios**
- Network errors (connection lost)
- Validation errors (missing fields)
- Server errors (500/503)
- Provide helpful guidance in each case

**4. Don't Lose User Data on Error**
- Keep form filled with user's data when showing errors
- User shouldn't have to re-type everything
- Only clear form on successful submission

**5. Provide Thank You Experience**
- Show clear success message
- OR redirect to thank you page with next steps
- Consider offering download, additional resources, or setting expectations for follow-up

### For Landing Page Design

**1. Keep Forms Short**
- Only ask for essential information in Phase 1
- Every additional field reduces conversion
- Can gather more info later via email

**2. Clear Field Labels**
- Use descriptive labels ("Work Email" not just "Email")
- Mark required fields with asterisk (*)
- Provide placeholder text as examples

**3. Set Expectations**
- Tell users what happens after they submit
- "We'll send your guide to your email within 5 minutes"
- "A sales rep will contact you within 24 hours"

**4. Privacy Assurance**
- Include link to privacy policy
- "We respect your privacy and will never share your information"
- Builds trust and increases submissions

---

## 📚 Related Documentation

For technical implementation details, see:
- [Phase1-Lead-Capture-API.md](./Phase1-Lead-Capture-API.md) - Complete technical specification
- [Phase1-Lead-Schema.md](./Phase1-Lead-Schema.md) - Database field details
- [Phase1-Publish-Workflow.md](./Phase1-Publish-Workflow.md) - How forms are created and published
- [Phase1-User-Flows.md](./Phase1-User-Flows.md) - Complete user journeys

---

**Document Version:** 1.0 (Phase 1)
**Last Updated:** 2025-12-03
**Maintained by:** DMAT Product Team
