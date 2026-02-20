import jsonDb from './src/utils/jsonDatabase.js';

async function createTestUser() {
  try {
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const user = await jsonDb.createUser(testUser);
    console.log('✅ Test user created successfully:');
    console.log('Email:', user.email);
    console.log('Password: password123');
    console.log('User ID:', user.id);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  }
}

createTestUser();