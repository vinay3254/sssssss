# EmailJS Setup Instructions

## Current Status
EmailJS is not configured properly, so OTPs are shown in the server console (fallback mode).

## Quick Fix (For Testing)
Use the OTP displayed in the server terminal when you request a password reset.
Example: `📧 FALLBACK - OTP for your@email.com: 553286`

## Permanent Fix (Setup EmailJS)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account (100 emails/month free)

### Step 2: Add Email Service
1. Go to "Email Services" in dashboard
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the setup instructions
5. Copy your **Service ID** (e.g., service_abc123)

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Set up template with these variables:
   - **To Email**: `{{to_email}}`
   - **Subject**: EtherXPPT - Password Reset OTP
   - **Content**: 
     ```
     Hello,
     
     Your OTP code is: {{otp_code}}
     
     This code will expire in 30 minutes.
     
     If you didn't request this, please ignore this email.
     
     - {{from_name}}
     ```
4. Copy your **Template ID** (e.g., template_xyz789)

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key** (e.g., user_abc123xyz)

### Step 5: Update .env File
Edit `server/.env`:
```env
EMAILJS_SERVICE_ID=your_service_id_here
EMAILJS_TEMPLATE_ID=your_template_id_here
EMAILJS_PUBLIC_KEY=your_public_key_here
```

### Step 6: Restart Server
```bash
cd server
npm start
```

## Testing
1. Go to forgot password page
2. Enter your email
3. Check your email inbox for OTP
4. If it fails, check spam folder or server console

## Alternative: Use Gmail SMTP (More Reliable)

If you prefer not to use EmailJS, you can use Gmail SMTP directly:

1. Enable 2-factor authentication on your Gmail
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Update `.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-digit-app-password
   ```
4. The server will automatically use SMTP instead of EmailJS
