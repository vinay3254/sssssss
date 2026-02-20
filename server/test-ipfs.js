import dotenv from 'dotenv';
import ipfsService from './src/ipfsService.js';

dotenv.config();

async function testIPFS() {
  console.log('🧪 Testing IPFS Integration...\n');

  // Check environment variables
  console.log('📋 Environment Check:');
  console.log(`IPFS_API_KEY: ${process.env.IPFS_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`IPFS_SECRET: ${process.env.IPFS_SECRET ? '✅ Set' : '❌ Missing'}`);
  console.log(`IPFS_JWT: ${process.env.IPFS_JWT ? '✅ Set' : '❌ Missing'}\n`);

  if (!process.env.IPFS_API_KEY || !process.env.IPFS_SECRET) {
    console.log('❌ IPFS credentials not configured. Please set up your .env file.');
    console.log('📖 See IPFS-SETUP.md for instructions.');
    return;
  }

  // Test data
  const testPresentation = {
    title: 'IPFS Test Presentation',
    slides: [
      {
        id: 1,
        title: 'Test Slide',
        content: 'This is a test slide for IPFS integration',
        background: '#ffffff',
        textColor: '#000000'
      }
    ],
    createdAt: new Date().toISOString(),
    testData: true
  };

  try {
    console.log('💾 Testing JSON upload to IPFS...');
    const result = await ipfsService.uploadJSON(testPresentation);
    
    console.log('✅ Upload successful!');
    console.log(`📄 IPFS Hash: ${result.IpfsHash}`);
    console.log(`🌐 Gateway URL: https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    console.log(`📊 Size: ${result.PinSize} bytes`);
    console.log(`⏰ Timestamp: ${result.Timestamp}\n`);

    // Test retrieval
    console.log('📥 Testing retrieval from IPFS...');
    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Retrieval successful!');
      console.log(`📋 Title: ${data.title}`);
      console.log(`📄 Slides: ${data.slides.length}`);
      console.log('🎉 IPFS integration is working correctly!\n');
    } else {
      console.log('❌ Failed to retrieve from IPFS gateway');
    }

  } catch (error) {
    console.log('❌ IPFS test failed:');
    console.error(error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your Pinata API credentials');
    console.log('2. Verify your internet connection');
    console.log('3. Ensure your Pinata account has sufficient quota');
  }
}

testIPFS();