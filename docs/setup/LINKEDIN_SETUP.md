# LinkedIn Integration Setup Guide for DMAT

This guide provides step-by-step instructions for setting up LinkedIn OAuth 2.0 integration to enable social media post publishing from DMAT to LinkedIn.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [LinkedIn Developers Portal Setup](#linkedin-developers-portal-setup)
3. [Create LinkedIn App](#create-linkedin-app)
4. [Configure App Settings](#configure-app-settings)
5. [Request Product Access](#request-product-access)
6. [Configure OAuth Settings](#configure-oauth-settings)
7. [Configure Backend Environment](#configure-backend-environment)
8. [Connect LinkedIn Account in DMAT](#connect-linkedin-account-in-dmat)
9. [Testing LinkedIn Integration](#testing-linkedin-integration)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:
- A LinkedIn account (personal or company account)
- A LinkedIn Company Page (required for app creation)
  - If you don't have one, create a company page at [LinkedIn Pages](https://www.linkedin.com/company/setup/new/)
- Admin access to your DMAT backend configuration
- The DMAT application running locally or on a server
- Basic understanding of OAuth 2.0 flow

**Important Notes:**
- LinkedIn requires a company page to create an app (even for personal posting)
- You'll need to verify your company page before some features become available
- Processing time for product access can take 24-72 hours (OpenID Connect is usually instant)

---

## LinkedIn Developers Portal Setup

### Step 1: Access LinkedIn Developers Portal

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Sign in with your LinkedIn account
3. Click on **"My Apps"** in the top navigation
4. You'll see the Apps dashboard (empty if this is your first app)

**Screenshot:** `linkedin-01-developers-portal.png`

---

## Create LinkedIn App

### Step 2: Create a New App

1. Click the **"Create app"** button (top right)
2. Fill in the **App creation form**:

   **App Name:**
   - Enter: `DMAT` or `DMAT - Digital Marketing Automation Tool`
   - This name will be shown to users during OAuth consent

   **LinkedIn Page:**
   - Click **"Select a LinkedIn Page"** dropdown
   - Choose your company page from the list
   - If you don't have a company page, you'll need to create one first
   - **Note:** The page must exist before you can create an app

   **Privacy Policy URL:**
   - Enter your privacy policy URL
   - For development: `http://localhost:5173/privacy` (create this page)
   - For production: `https://yourdomain.com/privacy`
   - **Important:** This URL must be publicly accessible

   **App Logo (Optional but Recommended):**
   - Upload your company logo (recommended size: 300x300px)
   - This appears during OAuth consent
   - Accepted formats: PNG, JPG
   - Maximum file size: 2MB

   **Legal Agreement:**
   - ☑ Check the box: "I have read and agree to the API Terms of Use"
   - Read the terms at: https://www.linkedin.com/legal/l/api-terms-of-use

3. Click **"Create app"**
4. Wait for app creation (usually instant)
5. You'll be redirected to your new app's dashboard

**Screenshot:** `linkedin-02-create-app.png`

---

## Configure App Settings

### Step 3: Note Your Credentials

1. On your app dashboard, you'll see the **"Auth"** tab (default view)
2. Locate the **"Application credentials"** section
3. Note the following (you'll need these later):
   - **Client ID**: A long string like `abc123xyz456`
   - **Client Secret**: Click "Show" to reveal, then copy
   - **Keep these secure!** Never commit to version control

**Screenshot:** `linkedin-03-credentials.png`

**Security Best Practices:**
- Store Client Secret in environment variables only
- Never expose credentials in frontend code
- Use different credentials for development and production
- Rotate credentials if compromised

---

### Step 4: Verify App Settings

1. Click on the **"Settings"** tab
2. Verify the following settings:
   - **App Name**: Correct
   - **Company**: Correct LinkedIn Page
   - **Privacy Policy URL**: Accessible
   - **App Logo**: Displayed correctly

3. **Optional Settings** (can configure later):
   - **Terms of Service URL**: Your terms URL
   - **App Description**: Describe your app's purpose
   - **App Website**: Your company website

4. Click **"Update"** if you make any changes

---

## Request Product Access

LinkedIn uses a "products" system where you request access to specific features. For DMAT, you need two products:

### Step 5: Request "Sign In with LinkedIn using OpenID Connect"

1. Click on the **"Products"** tab
2. Locate **"Sign In with LinkedIn using OpenID Connect"**
3. Click **"Request access"** button
4. A modal will appear explaining the product
5. Review the details and click **"Request access"** again

**Approval Time:** Usually instant ✅

**What this enables:**
- OAuth 2.0 authentication
- User profile access (name, email, profile picture)
- OpenID Connect standard implementation

**Screenshot:** `linkedin-04-openid-product.png`

---

### Step 6: Request "Share on LinkedIn"

1. Still on the **"Products"** tab
2. Locate **"Share on LinkedIn"**
3. Click **"Request access"** button
4. You may see a form or questionnaire:
   - **Use case**: Explain that you're building a marketing automation tool
   - **App description**: Describe DMAT functionality
   - **Expected usage**: Estimate post frequency (be realistic)
5. Submit the request

**Approval Time:** Can take 24-72 hours ⏱️

**What this enables:**
- Post publishing to LinkedIn user feeds
- UGC (User Generated Content) Posts API
- Text-only posts (image support requires additional steps)

**Screenshot:** `linkedin-05-share-product.png`

**Important Notes:**
- You can still test OpenID Connect authentication while waiting for Share access
- Check your email for approval notifications
- You can check status in the "Products" tab (will show "Approved" when ready)

---

## Configure OAuth Settings

### Step 7: Add Redirect URIs

1. Go back to the **"Auth"** tab
2. Scroll down to **"OAuth 2.0 settings"** section
3. Locate **"Redirect URLs"** field
4. Add your redirect URIs (one per line):

   **For Development:**
   ```
   http://localhost:5001/api/admin/linkedin/oauth/callback
   ```

   **For Production:**
   ```
   https://yourdomain.com/api/admin/linkedin/oauth/callback
   ```

   **For Staging (if applicable):**
   ```
   https://staging.yourdomain.com/api/admin/linkedin/oauth/callback
   ```

5. Click **"Update"** to save

**Screenshot:** `linkedin-06-redirect-uris.png`

**Important:**
- ⚠️ The redirect URI must match **exactly** (including protocol, domain, port, and path)
- No trailing slashes
- Case-sensitive
- For localhost, use `http://` (not `https://`)
- For production, **must** use `https://`
- You can add multiple redirect URIs (one per environment)

---

### Step 8: Verify OAuth Scopes

1. Still in the **"Auth"** tab
2. Scroll down to **"OAuth 2.0 scopes"** section
3. Verify the following scopes are present:
   - ✅ `openid` - Required for OpenID Connect
   - ✅ `profile` - User's basic profile
   - ✅ `email` - User's email address
   - ✅ `w_member_social` - Permission to post on user's behalf

**Screenshot:** `linkedin-07-scopes.png`

**Scope Descriptions:**
- **openid**: Enables OpenID Connect authentication
- **profile**: Access to user's name and profile information
- **email**: Access to user's primary email address
- **w_member_social**: Write permission to post content (requires "Share on LinkedIn" product approval)

**Note:** If `w_member_social` is grayed out, wait for "Share on LinkedIn" product approval.

---

## Configure Backend Environment

### Step 9: Update Backend .env File

1. Navigate to your DMAT backend directory:
   ```bash
   cd /path/to/DMAT/backend
   ```

2. Open or create the `.env` file:
   ```bash
   # Mac/Linux
   nano .env

   # Windows
   notepad .env
   ```

3. Add the following LinkedIn configuration:
   ```env
   # LinkedIn OAuth Configuration
   LINKEDIN_CLIENT_ID=your_client_id_here
   LINKEDIN_CLIENT_SECRET=your_client_secret_here
   LINKEDIN_REDIRECT_URI=http://localhost:5001/api/admin/linkedin/oauth/callback
   ```

4. Replace the placeholder values:
   - `your_client_id_here` → Your actual Client ID from LinkedIn
   - `your_client_secret_here` → Your actual Client Secret from LinkedIn
   - Update redirect URI if using production domain

5. Save the file and exit

**Example .env (development):**
```env
# Server Configuration
NODE_ENV=development
PORT=5001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dmat_dev
DB_USER=postgres
DB_PASSWORD=your_db_password

# JWT Authentication
JWT_SECRET=your_jwt_secret

# LinkedIn OAuth Configuration
LINKEDIN_CLIENT_ID=abc123xyz456
LINKEDIN_CLIENT_SECRET=def789uvw012
LINKEDIN_REDIRECT_URI=http://localhost:5001/api/admin/linkedin/oauth/callback

# Other configurations...
```

**Security Checklist:**
- ✅ `.env` file is in `.gitignore`
- ✅ Credentials not committed to version control
- ✅ Different credentials for development and production
- ✅ Client Secret kept secure

---

### Step 10: Verify Database Migration

1. Ensure LinkedIn tables exist in your database:
   ```bash
   psql -d dmat_dev -c "\dt linkedin*"
   ```

2. Expected output:
   ```
   linkedin_oauth_tokens
   linkedin_posts
   ```

3. If tables don't exist, run the migration:
   ```bash
   cd /path/to/DMAT
   psql -d dmat_dev -f backend/migrations/004_create_linkedin_tables.sql
   ```

4. Verify migration success:
   ```bash
   psql -d dmat_dev -c "\d linkedin_oauth_tokens"
   psql -d dmat_dev -c "\d linkedin_posts"
   ```

**Screenshot:** `linkedin-08-database-tables.png`

---

### Step 11: Restart Backend Server

1. Stop the backend if it's running (Ctrl+C)
2. Start the backend:
   ```bash
   cd backend
   node server.js
   ```

3. Check the console output for:
   ```
   🔐 LinkedIn OAuth configured: ✓
   ```

4. If you see an error, verify your `.env` configuration

**Screenshot:** `linkedin-09-backend-startup.png`

---

## Connect LinkedIn Account in DMAT

### Step 12: Access LinkedIn Page

1. Open your browser and navigate to DMAT:
   ```
   http://localhost:5173
   ```

2. Log in with your DMAT credentials:
   - Username: `admin`
   - Password: `admin123` (or your password)

3. In the sidebar, click **"LinkedIn"**
4. You should see the LinkedIn integration page

**Screenshot:** `linkedin-10-dmat-login.png`

---

### Step 13: Initiate OAuth Connection

1. On the LinkedIn page, you'll see:
   - Connection status: **"Not Connected"**
   - A blue button: **"Connect LinkedIn"**

2. Click the **"Connect LinkedIn"** button
3. You'll be redirected to LinkedIn's authorization page

**Screenshot:** `linkedin-11-not-connected.png`

---

### Step 14: Authorize DMAT on LinkedIn

1. LinkedIn authorization screen will show:
   - **DMAT app name** and logo
   - **Your LinkedIn profile** information
   - **Permissions requested**:
     - Access to your profile information
     - Access to your email address
     - Permission to post on your behalf

2. Review the permissions carefully

3. Click **"Allow"** to grant permissions
   - **Note:** You can revoke access anytime from LinkedIn Settings → Apps

4. You'll be redirected back to DMAT

**Screenshot:** `linkedin-12-consent-screen.png`

---

### Step 15: Verify Connection

1. After authorization, DMAT will:
   - Exchange authorization code for access token
   - Fetch your LinkedIn profile
   - Store credentials securely in database
   - Redirect to LinkedIn page

2. You should see:
   - ✅ Green success message: "LinkedIn account connected successfully!"
   - Connection status: **"Connected"**
   - Your LinkedIn name displayed
   - Your LinkedIn email displayed
   - **"Disconnect"** button visible

3. Post composer section is now visible
4. Post statistics show: "Total Posts: 0" and "Last 30 Days: 0"

**Screenshot:** `linkedin-13-connected.png`

---

## Testing LinkedIn Integration

### Step 16: Publish Your First Test Post

1. In the **Post Composer** section:
   - Enter test text: "Testing DMAT LinkedIn integration! 🚀 #DMAT"
   - Watch the character counter update: "42/3000"

2. Click **"Publish"** button
3. Wait for the publish process (2-3 seconds)
4. You should see:
   - ✅ Green success message: "Post published successfully!"
   - Post appears in "Post History" below
   - Statistics update: "Total Posts: 1"

**Screenshot:** `linkedin-14-first-post.png`

---

### Step 17: Verify Post on LinkedIn

1. In the "Post History" section, find your post
2. Click the **"View on LinkedIn"** button
3. A new tab opens with your LinkedIn feed
4. Verify your post is visible on LinkedIn
5. Post should show the exact text you entered

**Screenshot:** `linkedin-15-post-on-linkedin.png`

**If post doesn't appear on LinkedIn:**
- Check your LinkedIn privacy settings
- Verify "Share on LinkedIn" product is approved
- Check backend logs for errors
- See [Troubleshooting](#troubleshooting) section

---

### Step 18: Test Multiple Posts

1. Publish 2-3 more test posts with different content
2. Verify each appears in post history
3. Check statistics update correctly
4. Confirm all posts visible on LinkedIn

**Test Post Ideas:**
```
Post 1: Testing DMAT LinkedIn integration! 🚀
Post 2: Second test post with #hashtags and links: https://example.com
Post 3: Testing special characters: © ® ™ • → ← ↑ ↓ 中文
```

---

### Step 19: Test Character Limit

1. Create a long post (approaching 3000 characters)
2. Watch character counter:
   - Green (0-2900 characters)
   - Orange/Warning (2900-3000 characters)
   - Red (3000+ characters)

3. Try to publish with 3001 characters
4. Should see error: "Post content exceeds 3000 character limit"

**Screenshot:** `linkedin-16-character-limit.png`

---

### Step 20: Test Disconnection

1. Click the **"Disconnect"** button
2. Confirm in the dialog: "Are you sure you want to disconnect your LinkedIn account?"
3. After confirmation:
   - Status changes to "Not Connected"
   - Post composer hidden
   - Post history hidden
   - Success message: "LinkedIn account disconnected"

4. Reconnect by clicking "Connect LinkedIn" again
5. Verify OAuth flow works again

**Note:** Previous posts remain in database but won't show until reconnected.

---

## Troubleshooting

### Issue 1: "App does not exist or has been deleted"

**Symptoms:**
- Error during OAuth redirect
- LinkedIn shows app not found message

**Solutions:**
1. Verify app still exists in LinkedIn Developers portal
2. Check Client ID in `.env` is correct
3. Ensure app is not in draft state
4. Verify LinkedIn Page is still active

---

### Issue 2: "Redirect URI mismatch"

**Symptoms:**
- OAuth fails with redirect_uri error
- Error message about invalid redirect URI

**Solutions:**
1. Check redirect URI in LinkedIn app settings **exactly** matches:
   ```
   http://localhost:5001/api/admin/linkedin/oauth/callback
   ```
2. No trailing slash
3. Correct protocol (http for localhost, https for production)
4. Case-sensitive match
5. Check `LINKEDIN_REDIRECT_URI` in `.env` matches

**Common Mistakes:**
- ❌ `http://localhost:5001/api/admin/linkedin/oauth/callback/` (trailing slash)
- ❌ `https://localhost:5001/...` (wrong protocol for localhost)
- ❌ `http://127.0.0.1:5001/...` (use localhost, not IP)

---

### Issue 3: "Invalid scope: w_member_social"

**Symptoms:**
- OAuth succeeds but posting fails
- Scope error in backend logs

**Solutions:**
1. Check "Share on LinkedIn" product approval status:
   - Go to app → Products tab
   - Status should be "Approved" (not "Pending")
2. Wait for approval (24-72 hours typical)
3. During wait, you can still test OAuth connection
4. Once approved, reconnect your account to get new scope

---

### Issue 4: "LinkedIn token expired"

**Symptoms:**
- Connection shows but posting fails
- Error: "LinkedIn token expired, please reconnect"

**Solutions:**
1. Access tokens expire after 60 days (default)
2. Click "Disconnect" then reconnect
3. Future: Implement automatic token refresh (not in Phase 4)

**Check token expiration:**
```sql
SELECT
  user_id,
  linkedin_user_name,
  expires_at,
  expires_at < NOW() as is_expired
FROM linkedin_oauth_tokens
WHERE user_id = YOUR_USER_ID;
```

---

### Issue 5: "Failed to fetch user profile"

**Symptoms:**
- OAuth redirect succeeds
- Error during profile fetch

**Solutions:**
1. Verify "Sign In with LinkedIn using OpenID Connect" is approved
2. Check scopes include: `openid`, `profile`, `email`
3. Check backend logs for detailed error
4. Try disconnecting and reconnecting

---

### Issue 6: Posts not appearing on LinkedIn

**Symptoms:**
- DMAT shows "published successfully"
- Post not visible on LinkedIn feed

**Solutions:**
1. **Check LinkedIn privacy settings:**
   - Go to LinkedIn Settings → Visibility → Posts
   - Ensure posts are set to "Public" or "Connections"

2. **Verify post URN:**
   ```sql
   SELECT linkedin_urn, post_url FROM linkedin_posts ORDER BY id DESC LIMIT 1;
   ```

3. **Check "Share on LinkedIn" product:**
   - Must be approved
   - Check Products tab in LinkedIn app

4. **Try viewing the post URL directly:**
   - Copy `post_url` from database
   - Open in browser
   - If 404, post may not have published

5. **Check LinkedIn account restrictions:**
   - Verify account not restricted or suspended
   - Check LinkedIn notifications for issues

---

### Issue 7: "Backend can't connect to database"

**Symptoms:**
- Error: "Database connection failed"
- LinkedIn tables not found

**Solutions:**
1. Verify PostgreSQL is running:
   ```bash
   # Mac
   brew services list | grep postgresql

   # Check connection
   psql -d dmat_dev -c "SELECT 1;"
   ```

2. Run migration if tables missing:
   ```bash
   psql -d dmat_dev -f backend/migrations/004_create_linkedin_tables.sql
   ```

3. Check database credentials in `.env`

---

### Issue 8: "CORS error in browser console"

**Symptoms:**
- Browser console shows CORS error
- OAuth redirect fails

**Solutions:**
1. Verify backend `CORS_ORIGIN` in `.env`:
   ```env
   CORS_ORIGIN=http://localhost:5173
   ```

2. Restart backend after changing `.env`

3. Check frontend `VITE_API_BASE_URL`:
   ```env
   VITE_API_BASE_URL=http://localhost:5001
   ```

---

### Issue 9: "Client Secret is invalid"

**Symptoms:**
- OAuth token exchange fails
- Error about invalid client credentials

**Solutions:**
1. Regenerate Client Secret in LinkedIn app:
   - Go to Auth tab
   - Click "Regenerate" next to Client Secret
   - Copy new secret immediately
   - Update `.env` with new secret
   - Restart backend

2. Verify no extra spaces in `.env`:
   ```env
   # Wrong
   LINKEDIN_CLIENT_SECRET= your_secret

   # Correct
   LINKEDIN_CLIENT_SECRET=your_secret
   ```

---

### Issue 10: "State parameter mismatch"

**Symptoms:**
- OAuth callback fails
- Error: "Invalid state parameter"

**Solutions:**
1. This is a CSRF protection error
2. Clear browser cookies and try again
3. Don't manually edit OAuth URLs
4. If persists, check backend session handling
5. Restart backend server

---

## Advanced Configuration

### Production Deployment Checklist

Before deploying to production:

- [ ] **Use HTTPS redirect URI:**
  ```env
  LINKEDIN_REDIRECT_URI=https://yourdomain.com/api/admin/linkedin/oauth/callback
  ```

- [ ] **Update LinkedIn app redirect URIs:**
  - Add production URL in LinkedIn app settings
  - Remove or keep development URL for testing

- [ ] **Secure environment variables:**
  - Use secrets management (AWS Secrets Manager, Vault, etc.)
  - Don't commit production credentials

- [ ] **Enable security headers:**
  - HTTPS only
  - Secure cookies
  - HSTS enabled

- [ ] **Test OAuth flow in production:**
  - Complete OAuth connection
  - Publish test post
  - Verify on LinkedIn

- [ ] **Monitor logs:**
  - Check for OAuth errors
  - Monitor token expiration
  - Track API rate limits

- [ ] **Set up alerts:**
  - OAuth failure rate > threshold
  - Token expiration approaching
  - API errors

---

### Multiple Environment Setup

If you have dev, staging, and production environments:

**LinkedIn App Settings:**
1. Add all redirect URIs:
   ```
   http://localhost:5001/api/admin/linkedin/oauth/callback
   https://staging.yourdomain.com/api/admin/linkedin/oauth/callback
   https://yourdomain.com/api/admin/linkedin/oauth/callback
   ```

**Backend .env files:**
- `backend/.env.development`
- `backend/.env.staging`
- `backend/.env.production`

Each with appropriate redirect URI for that environment.

---

## Security Best Practices

1. **Never expose credentials:**
   - ✅ Store in environment variables
   - ❌ Don't hardcode in source code
   - ❌ Don't commit to git

2. **Use different credentials per environment:**
   - Separate app for development
   - Separate app for production
   - Easier to manage and secure

3. **Implement token refresh:**
   - Tokens expire (currently 60 days)
   - Future: Automatic refresh before expiration
   - Phase 5 enhancement

4. **Monitor OAuth failures:**
   - Track failed login attempts
   - Alert on suspicious patterns
   - Log all OAuth events

5. **Validate user input:**
   - Sanitize post content
   - Check character limits
   - Prevent script injection

6. **Review LinkedIn app permissions:**
   - Only request necessary scopes
   - Minimal access principle
   - Review periodically

---

## API Rate Limits

LinkedIn enforces rate limits on API calls:

**OAuth Endpoints:**
- No strict published limits
- Avoid rapid repeated requests
- Respect retry-after headers

**UGC Posts API:**
- No strict per-user limits for publishing
- For enterprise/marketing, different limits apply
- Monitor for 429 (Too Many Requests) responses

**Best Practices:**
- Implement exponential backoff on errors
- Don't spam posts (users will block/report)
- Monitor response headers for rate limit info
- Cache OAuth tokens (don't re-authenticate unnecessarily)

---

## Additional Resources

### LinkedIn Documentation
- [LinkedIn OAuth 2.0](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [OpenID Connect](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)
- [UGC Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/ugc-post-api)
- [LinkedIn Developers Portal](https://www.linkedin.com/developers/)

### DMAT Documentation
- [Phase 4 Implementation Guide](../Phase-4-LinkedIn-Integration.md)
- [Phase 4 Testing Scenarios](../PHASE4_TESTING_SCENARIOS.md)
- [Main Project README](../../README.md)

### Support
- Check backend logs for detailed errors
- Review database for stored tokens and posts
- Test with cURL to isolate frontend vs backend issues
- Consult LinkedIn API status page for outages

---

## Summary

You should now have:
- ✅ LinkedIn App created and configured
- ✅ OAuth 2.0 credentials obtained
- ✅ Backend environment configured
- ✅ Database tables migrated
- ✅ LinkedIn account connected in DMAT
- ✅ Test posts published successfully

**Next Steps:**
1. Test thoroughly using [PHASE4_TESTING_SCENARIOS.md](../PHASE4_TESTING_SCENARIOS.md)
2. Configure production environment when ready
3. Train users on LinkedIn posting feature
4. Monitor usage and OAuth success rates

**Estimated Setup Time:** 30-45 minutes (excluding product approval wait time)

---

**Last Updated:** January 8, 2026
**DMAT Version:** Phase 4
**Document Version:** 1.0
