# EmailJS Setup Guide for Contact Form

This guide will help you set up EmailJS to send emails from your portfolio contact form to `tdeomare1@gmail.com`.

## Why EmailJS?

- ✅ **Free Tier**: 200 emails/month (perfect for portfolio sites)
- ✅ **No Backend Required**: Works entirely from the frontend
- ✅ **Easy Setup**: Simple configuration process
- ✅ **Reliable**: Trusted by thousands of developers
- ✅ **Secure**: Uses public keys (no sensitive credentials exposed)

## Step-by-Step Setup

### Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up"** (top right corner)
3. Sign up with your email or use Google/GitHub login
4. Verify your email address if required

### Step 2: Add Email Service

1. After logging in, go to **"Email Services"** in the left sidebar
2. Click **"Add New Service"**
3. Choose **"Gmail"** (recommended) or any other email service
4. Click **"Connect Account"** and authorize EmailJS to send emails from your Gmail account
   - **Note**: You'll need to use a Gmail account that you can access
   - If you want emails sent to `tdeomare1@gmail.com`, you can:
     - Use `tdeomare1@gmail.com` as the service email, OR
     - Use any Gmail account and configure the template to send to `tdeomare1@gmail.com`
5. After connecting, note down your **Service ID** (you'll need this later)

### Step 3: Create Email Template

1. Go to **"Email Templates"** in the left sidebar
2. Click **"Create New Template"**
3. Configure the template:

   **Template Name**: `Portfolio Contact Form`

   **Subject**: 
   ```
   New Contact Form Submission: {{subject}}
   ```

   **Content**: 
   - **Option 1 (Simple Text)**: Copy the simple template below
   - **Option 2 (HTML Template - Recommended)**: Use the beautiful HTML template from `email-template.html` file in your project root
   
   **Simple Text Template**:
   ```
   You have received a new message from your portfolio contact form.

   Name: {{from_name}}
   Email: {{from_email}}
   Company: {{company}}
   Subject: {{subject}}
   Received At: {{time}}

   Message:
   {{message}}

   ---
   This email was sent from your portfolio website contact form.
   ```

   **HTML Template** (Recommended - Beautiful & Mobile Responsive):
   - Open the `email-template.html` file in your project root
   - Copy the entire HTML content
   - In EmailJS template editor, switch to **"HTML"** mode (toggle button in the editor)
   - Paste the HTML content
   - The template uses these variables:
     - `{{from_name}}` - Sender's name
     - `{{from_email}}` - Sender's email address
     - `{{company}}` - Company/Organization name
     - `{{subject}}` - Message subject
     - `{{message}}` - Message content
     - `{{time}}` - Formatted timestamp

4. Set **To Email** to: `tdeomare1@gmail.com`
5. Set **From Name** to: `Portfolio Website`
6. Set **From Email** to: Your Gmail address (the one you connected)
7. Click **"Save"**
8. Note down your **Template ID** (you'll need this later)

### Step 4: Get Your Public Key

1. Go to **"Account"** → **"General"** in the left sidebar
2. Scroll down to find your **Public Key** (also called API Key)
3. Copy this key (you'll need it in the next step)

### Step 5: Install EmailJS Package

Run this command in your project root:

```bash
npm install @emailjs/browser
```

### Step 6: Configure Environment Variables

1. Create or update `.env` file in your project root:

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
```

2. Replace the placeholders with your actual values:
   - `your_public_key_here` → Your Public Key from Step 4
   - `your_service_id_here` → Your Service ID from Step 2
   - `your_template_id_here` → Your Template ID from Step 3

**Example:**
```env
VITE_EMAILJS_PUBLIC_KEY=abc123xyz789
VITE_EMAILJS_SERVICE_ID=service_gmail123
VITE_EMAILJS_TEMPLATE_ID=template_contact456
```

3. **Important**: Make sure `.env` is in your `.gitignore` file to keep your keys secure

### Step 7: Test the Contact Form

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Contact section on your portfolio
3. Fill out the form with test data
4. Submit the form
5. Check your email inbox (`tdeomare1@gmail.com`) for the test email

### Step 8: Verify Everything Works

✅ Form submits successfully
✅ Success message appears
✅ Email is received at `tdeomare1@gmail.com`
✅ All form fields are included in the email

## Troubleshooting

### Issue: "EmailJS public key is not configured"
**Solution**: Make sure your `.env` file has `VITE_EMAILJS_PUBLIC_KEY` and restart your dev server.

### Issue: "Failed to send email"
**Solution**: 
- Check that all environment variables are set correctly
- Verify your Service ID and Template ID are correct
- Make sure you've saved the email template
- Check EmailJS dashboard for any error messages

### Issue: Emails not received
**Solution**:
- Check spam/junk folder
- Verify the "To Email" in your template is `tdeomare1@gmail.com`
- Check EmailJS dashboard → "Logs" to see if emails were sent

### Issue: Rate limit exceeded
**Solution**: Free tier allows 200 emails/month. Upgrade to a paid plan if needed.

## Security Best Practices

1. ✅ **Never commit `.env` file** to Git
2. ✅ **Use environment variables** for all sensitive keys
3. ✅ **Public Key is safe** to expose (it's designed to be public)
4. ✅ **Service ID and Template ID** are also safe (they're not sensitive)

## Alternative: Using Your Own Gmail Account

If you want to use `tdeomare1@gmail.com` as the sending account:

1. Connect `tdeomare1@gmail.com` as your Email Service
2. You may need to enable "Less secure app access" or use App Passwords
3. For Gmail, you might need to generate an App Password:
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Generate a password for "Mail" and use it when connecting

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add the same environment variables in your hosting platform's dashboard
2. For Vercel: Go to Project Settings → Environment Variables
3. For Netlify: Go to Site Settings → Environment Variables
4. Make sure to add them for "Production" environment

## Free Tier Limits

- **200 emails/month** - Perfect for portfolio sites
- **2 email services** - Enough for your needs
- **2 email templates** - Sufficient for contact forms

## Need Help?

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: Check their dashboard or community forums

---

**Your Contact Form is now ready!** 🎉

Once set up, recruiters and visitors can contact you directly through your portfolio website, and you'll receive all messages at `tdeomare1@gmail.com`.


