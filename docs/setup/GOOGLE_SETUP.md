# Google Account Setup Guide for DMAT SEO Engine

This guide provides step-by-step instructions for setting up Google integrations to retrieve keyword data from Google Search Console and analytics data from Google Analytics 4.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Google Cloud Console Setup](#google-cloud-console-setup)
3. [Enable Required APIs](#enable-required-apis)
4. [Create OAuth 2.0 Credentials](#create-oauth-20-credentials)
5. [Configure Backend Environment](#configure-backend-environment)
6. [Connect Google Account in DMAT](#connect-google-account-in-dmat)
7. [Using Search Console Integration](#using-search-console-integration)
8. [Using Analytics Integration](#using-analytics-integration)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:
- A Google Account with access to:
  - Google Search Console (with verified website property)
  - Google Analytics 4 (with configured property)
- Admin access to your DMAT backend configuration
- The DMAT application running locally or on a server

---

## Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google Account
3. Click on the project dropdown at the top of the page
4. Click **"New Project"**
5. Enter project details:
   - **Project Name**: `DMAT SEO Engine` (or your preferred name)
   - **Organization**: Select if applicable (optional)
6. Click **"Create"**
7. Wait for the project to be created (usually takes a few seconds)
8. Select the newly created project from the project dropdown

---

## Enable Required APIs

### Step 2: Enable Google Search Console API

1. In the Google Cloud Console, navigate to **"APIs & Services"** > **"Library"**
2. Search for **"Google Search Console API"**
3. Click on **"Google Search Console API"** from the results
4. Click the **"Enable"** button
5. Wait for the API to be enabled

### Step 3: Enable Google Analytics Data API

1. Still in the **"APIs & Services"** > **"Library"** section
2. Search for **"Google Analytics Data API"**
3. Click on **"Google Analytics Data API"** from the results
4. Click the **"Enable"** button
5. Wait for the API to be enabled

### Step 4: Enable Google Analytics Admin API

1. In the **"APIs & Services"** > **"Library"** section
2. Search for **"Google Analytics Admin API"**
3. Click on **"Google Analytics Admin API"** from the results
4. Click the **"Enable"** button
5. Wait for the API to be enabled

---

## Create OAuth 2.0 Credentials

### Step 5: Configure OAuth Consent Screen

1. Navigate to **"APIs & Services"** > **"OAuth consent screen"**
2. Select **User Type**:
   - **Internal**: If you're using Google Workspace (only users in your organization)
   - **External**: For general use (recommended for most cases)
3. Click **"Create"**

4. Fill in the **OAuth consent screen** information:
   - **App name**: `DMAT SEO Engine`
   - **User support email**: Your email address
   - **App logo**: (Optional) Upload your company logo
   - **Application home page**: `http://localhost:3000` (or your production domain)
   - **Authorized domains**: Add your domain (e.g., `yourdomain.com`)
   - **Developer contact information**: Your email address
5. Click **"Save and Continue"**

6. **Add Scopes**:
   - Click **"Add or Remove Scopes"**
   - Search for and add the following scopes:
     - `https://www.googleapis.com/auth/webmasters.readonly` (Search Console - read-only)
     - `https://www.googleapis.com/auth/analytics.readonly` (Analytics - read-only)
   - Click **"Update"**
   - Click **"Save and Continue"**

7. **Test Users** (if you selected "External" and app is in testing mode):
   - Click **"Add Users"**
   - Add the email addresses that will test the OAuth flow
   - Click **"Add"**
   - Click **"Save and Continue"**

8. Review the summary and click **"Back to Dashboard"**

### Step 6: Create OAuth 2.0 Client ID

1. Navigate to **"APIs & Services"** > **"Credentials"**
2. Click **"Create Credentials"** at the top
3. Select **"OAuth client ID"**
4. Configure the OAuth client:
   - **Application type**: Select **"Web application"**
   - **Name**: `DMAT OAuth Client`

5. **Authorized JavaScript origins**:
   - Click **"Add URI"**
   - Add: `http://localhost:3000` (for local development)
   - Add: `https://yourdomain.com` (for production, if applicable)

6. **Authorized redirect URIs**:
   - Click **"Add URI"**
   - Add: `http://localhost:5001/api/admin/google/oauth/callback` (for local development)
   - Add: `https://api.yourdomain.com/api/admin/google/oauth/callback` (for production)

7. Click **"Create"**

8. **Save Your Credentials**:
   - A dialog will appear showing your **Client ID** and **Client Secret**
   - **IMPORTANT**: Copy these values immediately - you'll need them for the backend configuration
   - Click **"Download JSON"** to save a backup copy
   - Click **"OK"**

---

## Configure Backend Environment

### Step 7: Update Backend Environment Variables

1. Navigate to your DMAT backend directory:
   ```bash
   cd /Users/ajaychandraghanagam/projects/DMAT/backend
   ```

2. Open the `.env` file in a text editor:
   ```bash
   nano .env
   # or
   code .env
   ```

3. Add or update the following Google OAuth configuration:
   ```env
   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:5001/api/admin/google/oauth/callback
   ```

4. Replace the placeholder values:
   - `GOOGLE_CLIENT_ID`: Paste the Client ID from Step 6
   - `GOOGLE_CLIENT_SECRET`: Paste the Client Secret from Step 6
   - `GOOGLE_REDIRECT_URI`: Should match the redirect URI you configured in Step 6

5. Save the file and exit

### Step 8: Restart the Backend Server

1. Stop the current backend server (if running):
   ```bash
   # Press Ctrl+C in the terminal running the backend
   ```

2. Restart the backend:
   ```bash
   npm start
   ```

3. Verify the server starts without errors and shows:
   ```
   🔐 Google OAuth configured: ✓
   ```

---

## Connect Google Account in DMAT

### Step 9: Authenticate with Google OAuth

1. Open your browser and navigate to the DMAT admin panel:
   ```
   http://localhost:3000
   ```

2. Log in to DMAT with your admin credentials

3. Navigate to **"Analytics"** page from the sidebar

4. Look for the **"Google Account Connection"** section at the top

5. Click the **"Connect Google Account"** button

6. You'll be redirected to Google's OAuth consent screen:
   - Select the Google Account you want to connect
   - Review the permissions requested:
     - View Search Console data
     - View Google Analytics data
   - Click **"Allow"** to grant permissions

7. You'll be redirected back to DMAT

8. Verify the connection:
   - You should see a success message
   - The Analytics page should now show **"Connected as: your-email@gmail.com"**
   - A **"Disconnect"** button should be available

---

## Using Search Console Integration

### Step 10: Sync Keyword Data from Search Console

1. Navigate to the **"Keywords"** page in DMAT

2. In the **"Sync Section"** at the top:
   - **Select Website**: Choose your website from the dropdown
     - This dropdown is automatically populated with sites from your Search Console account
   - **Select Time Range**: Choose the date range for data sync
     - Last 7 days
     - Last 30 days
     - Last 90 days

3. Click the **"Sync Data"** button

4. Wait for the sync to complete:
   - You'll see a "Syncing..." message
   - The sync may take 10-60 seconds depending on data volume
   - A success message will show: "Successfully synced X keyword records"

5. The page will automatically refresh to show:
   - **Top Performing Keywords**: Sorted by clicks, impressions, or CTR
   - **Declining Keywords**: Keywords losing ranking positions
   - **All Keywords Table**: Complete list with performance metrics

### Step 11: Export Keyword Data to CSV

1. On the **"Keywords"** page, scroll to the **"All Keywords"** section

2. (Optional) Use the search box to filter keywords

3. Click the **"Export CSV"** button

4. A CSV file will download with columns:
   - Keyword
   - URL
   - Impressions
   - Clicks
   - CTR (Click-Through Rate)
   - Position (Average ranking position)
   - First Seen
   - Last Seen
   - Data Points (Number of days tracked)

---

## Using Analytics Integration

### Step 12: Connect GA4 Property to Landing Page

1. Navigate to **"Landing Pages"** in DMAT

2. Create a new landing page or edit an existing one

3. In the landing page form, find the **"GA4 Property"** dropdown:
   - This dropdown is automatically populated with GA4 properties from your connected Google Account
   - Select the GA4 property you want to use for tracking this landing page

4. Save the landing page

5. Publish the landing page (if not already published)

### Step 13: View Analytics Dashboard

1. Navigate to the **"Analytics"** page

2. Select a **GA4 Property** from the dropdown at the top

3. Choose a **Date Range**:
   - Last 7 days
   - Last 30 days
   - Last 90 days

4. Click **"Load Analytics"**

5. The dashboard will display:
   - **Total Users**: Unique visitors to your landing pages
   - **Total Sessions**: Number of visits
   - **Avg Session Duration**: Average time spent on site
   - **Bounce Rate**: Percentage of single-page sessions
   - **Traffic by Source/Medium**: Where your visitors are coming from
   - **Top Pages**: Most visited landing pages
   - **Conversion Events**: Custom events tracked

---

## Troubleshooting

### OAuth Connection Issues

**Problem**: "Invalid redirect URI" error during OAuth flow

**Solution**:
1. Verify the redirect URI in Google Cloud Console matches exactly:
   - `http://localhost:5001/api/admin/google/oauth/callback`
2. Check that the `GOOGLE_REDIRECT_URI` in `.env` matches
3. Restart the backend server after making changes

---

**Problem**: "Access denied" or "Insufficient permissions" error

**Solution**:
1. Verify you enabled the required APIs:
   - Google Search Console API
   - Google Analytics Data API
   - Google Analytics Admin API
2. Check that OAuth scopes include:
   - `https://www.googleapis.com/auth/webmasters.readonly`
   - `https://www.googleapis.com/auth/analytics.readonly`
3. Disconnect and reconnect your Google Account in DMAT

---

**Problem**: "Connection status: Not connected" after clicking "Connect Google Account"

**Solution**:
1. Check browser console for errors
2. Verify backend server is running and accessible
3. Check backend logs for OAuth errors
4. Ensure you completed the OAuth consent screen setup in Google Cloud Console

---

### Search Console Issues

**Problem**: No sites appearing in the "Select Website" dropdown

**Solution**:
1. Verify you have at least one verified property in Google Search Console
2. Go to [Google Search Console](https://search.google.com/search-console) and verify a property
3. Wait a few minutes for changes to propagate
4. Disconnect and reconnect your Google Account in DMAT

---

**Problem**: "Sync failed" error when syncing keywords

**Solution**:
1. Check that you selected a valid website from the dropdown
2. Verify your Search Console property has data for the selected date range
3. Check backend logs for specific error messages
4. Try reducing the date range (e.g., use "Last 7 days" instead of "Last 90 days")

---

**Problem**: No keyword data appears after successful sync

**Solution**:
1. Check if your website has enough traffic to generate Search Console data
   - New sites may take 2-3 days to appear in Search Console
2. Verify the date range you selected has data in Search Console
3. Check the database to confirm data was stored:
   ```sql
   SELECT COUNT(*) FROM search_console_keywords;
   ```

---

### Analytics Issues

**Problem**: No GA4 properties appearing in dropdown

**Solution**:
1. Verify you have at least one GA4 property set up
2. Go to [Google Analytics](https://analytics.google.com/) and create a GA4 property
3. Ensure your Google Account has at least "Viewer" access to the GA4 property
4. Disconnect and reconnect your Google Account in DMAT

---

**Problem**: Analytics dashboard shows no data or "No data available"

**Solution**:
1. Verify your GA4 property is receiving data:
   - Go to Google Analytics and check for recent traffic
2. Check the date range - new GA4 properties may not have historical data
3. Ensure the selected GA4 property is the correct one for your landing pages
4. Try a different date range (e.g., "Last 30 days" instead of "Last 7 days")

---

**Problem**: CSV export returns empty file or error

**Solution**:
1. Ensure you have synced keyword data first (see Step 10)
2. Check that keywords appear in the "All Keywords" table
3. Check browser console for errors
4. Verify the backend server is running without errors
5. Try exporting without search filters first

---

### Database Issues

**Problem**: "Database error" when syncing or loading data

**Solution**:
1. Verify PostgreSQL is running:
   ```bash
   brew services list | grep postgresql
   ```
2. Check database connection in `.env` file:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=dmat
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```
3. Test database connectivity:
   ```bash
   psql -h localhost -U postgres -d dmat -c "SELECT 1;"
   ```
4. Check backend logs for specific database errors

---

## Security Best Practices

1. **Never commit `.env` file to version control**
   - Add `.env` to `.gitignore`
   - Use environment variables for production deployment

2. **Rotate OAuth credentials regularly**
   - Create new credentials every 6-12 months
   - Delete old credentials from Google Cloud Console

3. **Use least-privilege scopes**
   - The integration uses read-only scopes for security
   - Never grant write permissions unless absolutely necessary

4. **Monitor OAuth token usage**
   - Review Google Cloud Console for unusual API activity
   - Set up quota alerts for API usage

5. **Secure production environment**
   - Use HTTPS for all production URLs
   - Update authorized domains to production domains only
   - Remove localhost URLs from production OAuth credentials

---

## Additional Resources

- [Google Search Console API Documentation](https://developers.google.com/webmaster-tools)
- [Google Analytics Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [DMAT Phase 3 Testing Scenarios](./PHASE3_TESTING_SCENARIOS.md)

---

## Support

If you encounter issues not covered in this guide:

1. Check the backend server logs for detailed error messages
2. Review the browser console for frontend errors
3. Verify all prerequisites are met
4. Consult the Google Cloud Console audit logs for API errors
5. Contact your system administrator for assistance

---

**Last Updated**: December 2025
**DMAT Version**: Phase 3 (SEO Engine)
