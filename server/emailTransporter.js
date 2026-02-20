import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;
let isMock = false;

// Initialize transporter. Prefer explicit SMTP config via env vars, otherwise use an Ethereal test account for safe development.
const initTransporter = async () => {
  // If full SMTP configuration is provided, use it
  if (process.env.EMAIL_HOST && process.env.EMAIL_PORT && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: (process.env.EMAIL_SECURE === 'true'),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    try {
      await transporter.verify();
      console.log('✅ Email transporter verified and ready');
      isMock = false;
      return;
    } catch (err) {
      console.warn('⚠️ Email transporter verification failed:', err.message);
      // fall through to create a test account
    }
  }

  // Fallback: create Ethereal account for development/testing (safe; messages are not sent to real inboxes)
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    isMock = true;
    console.log('ℹ️ Using Ethereal test account for email (development). Preview URLs will be available in logs (no real email delivered).');
  } catch (err) {
    console.error('❌ Failed to set up email transporter:', err.message);
    // Keep transporter null; callers should handle this case
  }
};

// Initialize immediately (best-effort)
initTransporter().catch(err => console.error('Email init error:', err.message));

export default {
  async sendMail(options) {
    if (!transporter) {
      // Try initializing again if not ready
      await initTransporter();
      if (!transporter) throw new Error('Email transporter not configured');
    }

    try {
      const info = await transporter.sendMail(options);

      // Do NOT log or extract OTPs from the message. Only log non-sensitive information.
      console.log(`📧 Email sent to ${options.to} (mock=${isMock})`);

      // If using Ethereal, provide preview URL to help developers inspect the message without sending real email
      if (isMock && typeof nodemailer.getTestMessageUrl === 'function') {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) console.log(`ℹ️ Preview URL: ${previewUrl}`);
      }

      return info;
    } catch (err) {
      console.error('❌ Email send failed:', err.message);
      throw err;
    }
  },
  isMock: () => isMock
};