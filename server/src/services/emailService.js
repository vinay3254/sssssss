import transporter from '../../server/emailTransporter.js';

class EmailService {
  // Send verification OTP via centralized transporter; never log OTP values
  async sendVerificationOTP(email, otp, name = 'User') {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'no-reply@etherxppt.local',
      to: email,
      subject: 'EtherXPPT - Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Hello ${name},</p>
          <p>Your verification code is:</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; color: #333; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info?.messageId || 'sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendOTP(email, otp, name = 'User') {
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString();

    const mailOptions = {
      from: process.env.EMAIL_USER || 'no-reply@etherxppt.local',
      to: email,
      subject: 'EtherXPPT - Authentication OTP',
      html: `
        <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px;">
          <p style="padding-top: 14px; border-top: 1px solid #eaeaea;">To authenticate, please use the following One Time Password (OTP):</p>
          <p style="font-size: 22px;"><strong>${otp}</strong></p>
          <p>This OTP will be valid for 15 minutes till <strong>${expiryTime}</strong>.</p>
          <p>Do not share this OTP with anyone. If you didn't make this request, you can safely ignore this email.</p>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info?.messageId || 'sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async sendPasswordResetConfirmation(email, name = 'User') {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'no-reply@etherxppt.local',
      to: email,
      subject: 'EtherXPPT - Password Reset Successful',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Successful</h2>
          <p>Hello ${name},</p>
          <p>Your password has been successfully reset.</p>
          <p>You can now log in with your new password.</p>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info?.messageId || 'sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();