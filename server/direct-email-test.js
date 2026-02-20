import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

console.log('Testing direct email send...');
console.log('From:', process.env.EMAIL_USER);

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER,
  subject: 'Test OTP - EtherXPPT',
  text: 'Your OTP is: 123456',
  html: '<h2>Your OTP is: <strong>123456</strong></h2>'
};

transporter.sendMail(mailOptions)
  .then(info => {
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  })
  .catch(error => {
    console.log('❌ Email failed:', error.message);
    console.log('Error code:', error.code);
  });