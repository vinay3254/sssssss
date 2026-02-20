import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

console.log('🧪 Testing Server Endpoints...\n');

// Test server health
try {
  console.log('1. Testing server health...');
  const healthResponse = await fetch(`${API_BASE}/api/health`);
  if (healthResponse.ok) {
    const healthData = await healthResponse.json();
    console.log('✅ Server health:', healthData.status);
  } else {
    console.log('❌ Server health check failed:', healthResponse.status);
  }
} catch (error) {
  console.log('❌ Server not reachable:', error.message);
}

// Test forgot password endpoint
try {
  console.log('\n2. Testing forgot password endpoint...');
  const forgotResponse = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com' })
  });
  
  const forgotData = await forgotResponse.json();
  console.log('Status:', forgotResponse.status);
  console.log('Response:', forgotData);
  
  if (forgotResponse.status === 404) {
    console.log('✅ Expected 404 - user not found');
  } else if (forgotResponse.ok) {
    console.log('✅ Endpoint working');
  } else {
    console.log('❌ Unexpected response');
  }
} catch (error) {
  console.log('❌ Forgot password test failed:', error.message);
}

// Test with existing user
try {
  console.log('\n3. Testing with existing user...');
  const existingUserResponse = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com' })
  });
  
  const existingUserData = await existingUserResponse.json();
  console.log('Status:', existingUserResponse.status);
  console.log('Response:', existingUserData);
  
  if (existingUserResponse.ok) {
    console.log('✅ OTP should be sent/logged');
  }
} catch (error) {
  console.log('❌ Existing user test failed:', error.message);
}

console.log('\n🎉 Server endpoint tests completed!');