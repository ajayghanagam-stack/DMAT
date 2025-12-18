# WordPress Integration Setup Guide

This guide explains how to set up WordPress integration for the DMAT project. This feature allows you to automatically publish landing pages to your WordPress site.

## Features

- **100% FREE** - Uses built-in WordPress REST API (no plugins required for basic auth)
- Publish landing pages directly to WordPress as posts
- Automatic HTML conversion from landing page data
- Includes all form fields, images, and content
- Uses Application Passwords (secure, built into WordPress 5.6+)
- No monthly costs or API limits

## Requirements

- WordPress 5.6 or higher (for Application Passwords support)
- HTTPS enabled on your WordPress site (recommended for security)
- WordPress user account with post publishing permissions

## Setup Instructions

### 1. Generate Application Password in WordPress

Application Passwords are a secure way to authenticate with the WordPress REST API without exposing your actual password.

**Steps:**

1. Login to your WordPress admin dashboard
2. Go to **Users → Profile** (or **Users → Your Profile**)
3. Scroll down to the **"Application Passwords"** section
4. In the "New Application Password Name" field, enter: `DMAT`
5. Click **"Add New Application Password"**
6. WordPress will generate a password like: `xxxx xxxx xxxx xxxx xxxx xxxx`
7. **Copy this password immediately** - you won't be able to see it again!

**Important Notes:**
- Application Passwords are different from your regular WordPress password
- They can be revoked at any time from the same page
- Each application can have its own password for better security
- The password format includes spaces - you can copy it with or without spaces

### 2. Configure DMAT Backend

Edit your `backend/.env` file and add the following configuration:

```bash
# WordPress Integration (Optional)
WP_SITE_URL=https://yoursite.com
WP_USERNAME=your-wordpress-username
WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

**Example:**
```bash
WP_SITE_URL=https://mywebsite.com
WP_USERNAME=admin
WP_APP_PASSWORD=AbCd EfGh IjKl MnOp QrSt UvWx
```

**Configuration Details:**

- `WP_SITE_URL`: Your WordPress site URL (with https://)
  - ✅ Correct: `https://mysite.com` or `https://www.mysite.com`
  - ❌ Wrong: `http://mysite.com` (use HTTPS)
  - ❌ Wrong: `https://mysite.com/` (no trailing slash)

- `WP_USERNAME`: Your WordPress username (NOT email)
  - Find it in WordPress Admin → Users → Your Profile

- `WP_APP_PASSWORD`: The application password you generated
  - Include spaces or remove them - both work
  - Keep it secret, never commit to git

### 3. Restart Backend Server

After updating `.env`, restart your backend server to load the new configuration:

```bash
cd backend
node server.js
```

You should see a message confirming WordPress is configured:

```
WordPress integration enabled: https://yoursite.com
```

### 4. Test WordPress Connection (Optional)

You can test the WordPress connection using this endpoint:

```bash
curl -X GET http://localhost:5001/api/admin/wordpress/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

A successful response will show your WordPress site details:

```json
{
  "success": true,
  "message": "WordPress connection successful",
  "siteInfo": {
    "name": "My WordPress Site",
    "url": "https://mysite.com",
    "username": "admin"
  }
}
```

## How It Works

### Publishing Flow

1. You create a landing page in DMAT
2. Click "Publish" button
3. DMAT converts the landing page to HTML
4. DMAT creates a new WordPress post via REST API
5. The post is published to your WordPress site
6. You get back the WordPress post URL

### What Gets Published

When you publish a landing page to WordPress, it includes:

- **Title**: Landing page title
- **Content**: Converted HTML including:
  - Hero image (if provided)
  - Headline
  - Subheading
  - Body text (formatted as paragraphs)
  - Contact form with all custom fields
  - CTA button
- **Slug**: URL-friendly version of the title
- **Status**: Published immediately

### Example WordPress Post

If your landing page has:
- Title: "Free Marketing Guide 2025"
- Headline: "Download Your Free Marketing Guide"
- Hero Image: https://example.com/image.jpg
- 3 form fields: name, email, phone

DMAT will create a WordPress post with:
- URL: `https://yoursite.com/free-marketing-guide-2025`
- Full HTML content with the image, text, and form
- Published status (visible to visitors immediately)

## Troubleshooting

### Error: "WordPress is not configured"

**Cause**: Environment variables are not set or backend wasn't restarted.

**Solution**:
1. Check `backend/.env` has WP_SITE_URL, WP_USERNAME, and WP_APP_PASSWORD
2. Restart the backend server
3. Verify no typos in variable names

### Error: "Cannot reach WordPress site"

**Cause**: WordPress site URL is incorrect or site is down.

**Solution**:
1. Verify WP_SITE_URL in `.env` is correct
2. Check your WordPress site is accessible in a browser
3. Ensure HTTPS is working (not HTTP)

### Error: "Authentication failed"

**Cause**: Username or Application Password is incorrect.

**Solution**:
1. Verify WP_USERNAME matches your WordPress username (not email)
2. Generate a new Application Password in WordPress
3. Copy the new password to `.env` (with or without spaces)
4. Restart backend server

### Error: "User doesn't have permission to publish posts"

**Cause**: WordPress user account doesn't have publishing permissions.

**Solution**:
1. Login to WordPress admin
2. Go to Users → All Users
3. Click on your user
4. Verify Role is "Administrator" or "Editor"
5. Save changes

### Published post doesn't appear on WordPress

**Possible causes**:
1. Post was published but you're logged out - check while logged in
2. Post is in draft status - check WordPress admin → Posts
3. Theme doesn't display posts - check your theme settings

## Disabling WordPress Integration

To disable WordPress integration, simply comment out or remove the WordPress variables from `.env`:

```bash
# WordPress Integration (Disabled)
# WP_SITE_URL=https://yoursite.com
# WP_USERNAME=your-wordpress-username
# WP_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
```

When WordPress is disabled, publishing will use a DMAT-hosted URL instead.

## Security Best Practices

1. **Use HTTPS**: Always use HTTPS for your WordPress site
2. **Application Passwords**: Use Application Passwords, not your main WordPress password
3. **Revoke Unused Passwords**: Remove old application passwords from WordPress admin
4. **Keep .env Secret**: Never commit `.env` file to git (it's in .gitignore)
5. **Use Strong Passwords**: Generate new application passwords if compromised

## Advanced: Customizing Published Content

The WordPress HTML content is generated in `backend/src/services/wordpress.js` in the `buildWordPressContent()` function.

You can customize:
- HTML structure and CSS
- Which fields to include
- Form styling
- Additional sections

Example customization:

```javascript
// Add a custom section
html += `<div class="custom-section">
  <h3>Special Offer</h3>
  <p>Get 20% off when you sign up today!</p>
</div>`;
```

## FAQ

**Q: Do I need to install any WordPress plugins?**
A: No! The WordPress REST API is built into WordPress 5.6+. Application Passwords are also built-in.

**Q: Will this cost money?**
A: No, it's completely free. WordPress REST API has no usage limits or costs.

**Q: Can I publish to multiple WordPress sites?**
A: Currently, you can configure one WordPress site. For multiple sites, you would need to modify the code.

**Q: What if I don't have a WordPress site?**
A: That's fine! WordPress integration is optional. Landing pages will use DMAT-hosted URLs instead.

**Q: Can I unpublish or delete posts?**
A: Currently, DMAT only supports publishing. To unpublish or delete, go to WordPress admin → Posts.

**Q: Does it work with WordPress.com?**
A: Yes, but WordPress.com has different authentication. You may need to use a different method (OAuth) which is not currently supported. This works best with self-hosted WordPress.org sites.

## Support

If you encounter issues:

1. Check the backend server logs for detailed error messages
2. Verify your WordPress version is 5.6 or higher
3. Test the connection using the test endpoint
4. Check this troubleshooting guide
5. Ensure your WordPress site is publicly accessible

For more information about WordPress REST API:
- https://developer.wordpress.org/rest-api/
- https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/
