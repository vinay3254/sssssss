import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

console.log('🧪 Testing IPFS Save Endpoint...\n');

const testData = {
  slides: [{ id: 1, title: 'Test Slide', content: 'Test content' }],
  presentationMeta: { title: 'Test Presentation' },
  savedAt: new Date().toISOString()
};

try {
  console.log('Testing IPFS save endpoint...');
  const response = await fetch(`${API_BASE}/api/ipfs/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testData)
  });

  const result = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', result);

  if (response.ok && result.success) {
    console.log('✅ IPFS save successful');
  } else {
    console.log('❌ IPFS save failed');
  }
} catch (error) {
  console.log('❌ Test failed:', error.message);
}

console.log('\n🎉 IPFS save test completed!');
