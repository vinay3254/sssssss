import transporter from './emailTransporter.js';

(async () => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'no-reply@etherxppt.local',
      to: 'sample.user@example.com',
      subject: 'EtherXPPT - Test Email (Development)',
      text: 'This is a test message to verify email transporter. OTP: 000000',
      html: '<p>This is a test message to verify email transporter. <strong>OTP: 000000</strong></p>'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent. Info:', info);

    // If nodemailer returns a preview URL, print it
    if (typeof transporter.isMock === 'function' && transporter.isMock() && typeof (await import('nodemailer')).getTestMessageUrl === 'function') {
      const nodemailer = await import('nodemailer');
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) console.log('🔗 Preview URL:', previewUrl);
    }
  } catch (err) {
    console.error('❌ Test email failed:', err.message);
    process.exit(1);
  }
})();