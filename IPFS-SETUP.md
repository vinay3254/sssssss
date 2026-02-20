# IPFS Integration Setup Guide

## Overview
EtherX-PPT now includes IPFS (InterPlanetary File System) integration for decentralized storage of presentations using Pinata as the IPFS gateway.

## Features
- **Auto-save to IPFS**: Presentations are automatically saved to IPFS every 30 seconds
- **Manual save/load**: Use the Cloud Sync feature to manually save and load presentations
- **Decentralized storage**: Your presentations are stored on IPFS, making them accessible globally
- **Hash-based sharing**: Share presentations using IPFS hashes

## Setup Instructions

### 1. Get Pinata API Credentials
1. Visit [Pinata.cloud](https://pinata.cloud) and create an account
2. Go to API Keys section in your dashboard
3. Create a new API key with the following permissions:
   - `pinFileToIPFS`
   - `pinJSONToIPFS`
   - `userPinnedDataTotal`

### 2. Configure Environment Variables
1. Copy the `.env.example` file to `.env` in the server directory:
   ```bash
   cp server/.env.example server/.env
   ```

2. Edit the `.env` file and add your Pinata credentials:
   ```env
   IPFS_API_KEY=your-pinata-api-key-here
   IPFS_SECRET=your-pinata-secret-key-here
   IPFS_JWT=your-pinata-jwt-token-here
   ```

### 3. Start the Application
```bash
# Install dependencies (if not already done)
cd client && npm install
cd ../server && npm install

# Start the server
cd server && npm run dev

# Start the client (in another terminal)
cd client && npm run dev
```

## How to Use

### Auto-Save
- Presentations are automatically saved to IPFS every 30 seconds
- The IPFS hash is stored in localStorage and displayed in the bottom-right corner
- No action required from the user

### Manual Save/Load
1. Click the "Cloud Sync" button in the toolbar
2. To save: Click "Save to IPFS" button
3. To load: Enter an IPFS hash and click "Load from IPFS"
4. Copy the IPFS hash to share with others

### Sharing Presentations
1. Save your presentation to IPFS
2. Copy the IPFS hash from the status indicator or Cloud Sync dialog
3. Share the hash with others
4. Recipients can load the presentation using the hash in Cloud Sync

## Fallback Behavior
- If IPFS credentials are not configured, the system falls back to local storage
- If IPFS is temporarily unavailable, presentations are saved locally
- Users are notified when IPFS is not available

## Troubleshooting

### IPFS Not Working
1. Check that your Pinata API credentials are correct
2. Ensure your Pinata account has sufficient storage quota
3. Check the browser console for error messages
4. Verify that the server can access the internet

### Common Issues
- **"IPFS not configured"**: Add your Pinata credentials to the `.env` file
- **"Failed to save"**: Check your Pinata API key permissions
- **"Failed to load"**: Verify the IPFS hash is correct and the content exists

## Security Notes
- Never commit your `.env` file to version control
- Keep your Pinata API credentials secure
- IPFS content is public by default - don't store sensitive information
- Consider implementing encryption for sensitive presentations

## Benefits of IPFS Integration
- **Decentralized**: No single point of failure
- **Permanent**: Content is distributed across multiple nodes
- **Global**: Accessible from anywhere in the world
- **Version control**: Each save creates a unique hash
- **Bandwidth efficient**: Content is cached across the network