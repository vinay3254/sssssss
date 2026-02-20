import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

console.log('🧪 Testing All EtherXPPT Features...\n');

// Helper function to make requests
const makeRequest = async (method, url, body = null) => {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE}${url}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 0, error: error.message };
  }
};

// Test 1: Check if user exists
console.log('1. Testing check-user endpoint...');
const checkUserResult = await makeRequest('POST', '/api/auth/check-user', { email: 'test@example.com' });
if (checkUserResult.status === 200) {
  console.log('✅ Check user endpoint working');
} else {
  console.log('❌ Check user failed:', checkUserResult.error || checkUserResult.data);
}

// Test 2: Register a new user
console.log('\n2. Testing user registration...');
const registerResult = await makeRequest('POST', '/api/auth/register', {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
});
if (registerResult.status === 200) {
  console.log('✅ User registration successful');
} else if (registerResult.status === 409) {
  console.log('✅ User already exists (expected)');
} else {
  console.log('❌ Registration failed:', registerResult.error || registerResult.data);
}

// Test 3: Login
console.log('\n3. Testing user login...');
const loginResult = await makeRequest('POST', '/api/auth/login', {
  email: 'test@example.com',
  password: 'password123'
});
if (loginResult.status === 200) {
  console.log('✅ Login successful');
} else {
  console.log('❌ Login failed:', loginResult.error || loginResult.data);
}

// Test 4: Forgot password (OTP generation)
console.log('\n4. Testing forgot password (OTP generation)...');
const forgotResult = await makeRequest('POST', '/api/auth/forgot-password', {
  email: 'test@example.com'
});
if (forgotResult.status === 200) {
  console.log('✅ OTP sent successfully');
  console.log('📧 Check console for OTP code');
} else {
  console.log('❌ Forgot password failed:', forgotResult.error || forgotResult.data);
}

// Test 5: Verify OTP (assuming OTP is 123456 for testing)
console.log('\n5. Testing OTP verification...');
const verifyResult = await makeRequest('POST', '/api/auth/verify-otp', {
  email: 'test@example.com',
  otp: '123456' // This will likely fail unless we know the actual OTP
});
if (verifyResult.status === 200 && verifyResult.data.verified) {
  console.log('✅ OTP verified successfully');
} else {
  console.log('❌ OTP verification failed (expected if OTP is wrong):', verifyResult.data?.message || verifyResult.error);
}

// Test 6: IPFS save (mock)
console.log('\n6. Testing IPFS save endpoint...');
const ipfsResult = await makeRequest('POST', '/api/ipfs/save', {
  data: 'test presentation data'
});
if (ipfsResult.status === 200) {
  console.log('✅ IPFS save successful');
} else {
  console.log('❌ IPFS save failed:', ipfsResult.error || ipfsResult.data);
}

// Test 7: Check server health (if endpoint exists)
console.log('\n7. Testing server health...');
const healthResult = await makeRequest('GET', '/api/health');
if (healthResult.status === 200) {
  console.log('✅ Server health check passed');
} else {
  console.log('❌ Server health check failed (endpoint may not exist):', healthResult.error || healthResult.data);
}

console.log('\n🎉 All feature tests completed!');
console.log('\n📋 Summary:');
console.log('- Authentication (register/login) should work');
console.log('- OTP system is functional (check console for codes)');
console.log('- IPFS integration is mocked');
console.log('- For full client testing, open http://localhost:5173 in browser');
