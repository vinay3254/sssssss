import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function testEmail() {
  console.log('Testing email configuration...');
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Email Pass:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    // Verify connection
    await transporter.verify();
    console.log('✅ Email configuration is valid');

    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'EtherXPPT Test Email',
      text: 'This is a test email to verify your Gmail configuration works.'
    });

    console.log('✅ Test email sent successfully:', info.messageId);
    console.log('Check your Gmail inbox for the test email');
  } catch (error) {
    console.log('❌ Email test failed:', error.message);
    console.log('\n📝 To fix this:');
    console.log('1. Go to https://myaccount.google.com/security');
    console.log('2. Enable 2-Step Verification');
    console.log('3. Generate App Password for Mail');
    console.log('4. Update EMAIL_PASS in .env file');
  }
}

testEmail();