# JSON Authentication Setup

This project now uses JSON file-based authentication instead of MongoDB.

## Features
- User registration and login with proper validation
- Password hashing with bcrypt
- JWT token authentication
- JSON file storage for user data

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create a test user:
```bash
node create-test-user.js
```

3. Start the server:
```bash
npm run dev
# or
node start-json-server.js
```

## Test Credentials
- Email: test@example.com
- Password: password123

## How it works

1. **Registration**: Users can create accounts via `/api/auth/register`
2. **Login**: Users authenticate via `/api/auth/login` with valid email/password
3. **Storage**: User data is stored in `data/users.json`
4. **Security**: Passwords are hashed, JWT tokens are used for sessions

## Files Created/Modified

### Server Files:
- `src/utils/jsonDatabase.js` - JSON database operations
- `src/controllers/jsonAuthController.js` - Authentication logic
- `src/routes/jsonAuth.js` - Auth routes
- `src/middleware/auth.js` - Updated for JSON database
- `data/users.json` - User storage file
- `start-json-server.js` - Standalone server
- `create-test-user.js` - Test user creation

### Client Files:
- `pages/Login.jsx` - Updated for proper validation
- `pages/Signup.jsx` - Updated for API registration

## Authentication Flow

1. User enters valid email/password
2. Server validates credentials against JSON database
3. If valid, JWT token is generated and returned
4. Client stores token and user data
5. Protected routes require valid JWT token

The system now properly validates users and only allows login with correct credentials stored in the JSON database.