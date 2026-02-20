import dotenv from 'dotenv';

dotenv.config();

console.log('Environment variables:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set (' + process.env.EMAIL_PASS.length + ' chars)' : 'Not set');
console.log('Current working directory:', process.cwd());
console.log('NODE_ENV:', process.env.NODE_ENV);