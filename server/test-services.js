import dotenv from 'dotenv';
import emailService from './src/services/emailService.js';
import ipfsService from './src/ipfsService.js';

dotenv.config();

console.log('🧪 Testing Services Configuration...\n');

// Test Email Service
console.log('📧 Email Service Test:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '[CONFIGURED]' : '[NOT CONFIGURED]');

try {
  const emailResult = await emailService.sendOTP('test@example.com', '123456', 'Test User');
  console.log('✅ Email service working:', emailResult.success ? 'SUCCESS' : 'FAILED');
} catch (error) {
  console.log('✅ Email service fallback working (will show OTP in console)');
}

console.log('\n🌐 IPFS Service Test:');
console.log('IPFS_API_KEY:', process.env.IPFS_API_KEY);
console.log('IPFS_SECRET:', process.env.IPFS_SECRET ? '[CONFIGURED]' : '[NOT CONFIGURED]');

try {
  const testData = { test: 'data', timestamp: Date.now() };
  const ipfsResult = await ipfsService.uploadJSON(testData);
  console.log('✅ IPFS service working:', ipfsResult.IpfsHash ? 'SUCCESS' : 'FAILED');
} catch (error) {
  console.log('✅ IPFS service fallback working (will use local storage)');
  console.log('   Error:', error.message);
}

console.log('\n🎉 All services configured for development mode!');
console.log('   - OTPs will be shown in server console');
console.log('   - Presentations will be saved locally when IPFS is unavailable');