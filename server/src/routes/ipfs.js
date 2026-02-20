import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import ipfsService from '../ipfsService.js';

const router = express.Router();

const LOCAL_IPFS_DIR = path.join(process.cwd(), 'data', 'ipfs');

async function ensureLocalDir() {
  await fs.mkdir(LOCAL_IPFS_DIR, { recursive: true });
}

async function saveLocalJSON(data) {
  await ensureLocalDir();
  const id = `local-${Date.now()}`;
  const file = path.join(LOCAL_IPFS_DIR, `${id}.json`);
  await fs.writeFile(file, JSON.stringify(data, null, 2));
  return id;
}

async function readLocalJSON(id) {
  try {
    const file = path.join(LOCAL_IPFS_DIR, `${id}.json`);
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading local JSON:', error);
    throw new Error(`Failed to read presentation: ${error.message}`);
  }
}

router.post('/save', async (req, res) => {
  try {
    const presentationData = req.body;

    // If IPFS is not configured, persist locally
    if (!process.env.IPFS_API_KEY || process.env.IPFS_API_KEY === 'your-pinata-api-key') {
      console.log('⚠️ IPFS not configured, saving locally');
      const id = await saveLocalJSON(presentationData);
      return res.json({
        success: true,
        ipfsHash: id,
        message: 'Presentation saved locally (IPFS not configured)'
      });
    }

    try {
      const result = await ipfsService.uploadJSON(presentationData);
      return res.json({
        success: true,
        ipfsHash: result.IpfsHash,
        message: 'Presentation saved to IPFS'
      });
    } catch (err) {
      console.warn('IPFS upload failed, saving locally instead:', err?.message || err);
      const id = await saveLocalJSON(presentationData);
      return res.json({
        success: true,
        ipfsHash: id,
        message: 'Saved locally (IPFS unavailable)'
      });
    }
  } catch (error) {
    console.error('IPFS save unexpected error:', error);
    return res.status(500).json({ success: false, error: 'Failed to save presentation' });
  }
});

router.get('/load/:hash', async (req, res) => {
  try {
    const { hash } = req.params;

    if (hash.startsWith('local-')) {
      try {
        const data = await readLocalJSON(hash);
        return res.json({ success: true, data, source: 'local' });
      } catch (e) {
        return res.status(404).json({ success: false, error: 'Local presentation not found' });
      }
    }

    const response = await fetch(`https://gateway.pinata.cloud/ipfs/${hash}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from IPFS');
    }
    
    const data = await response.json();
    res.json({
      success: true,
      data,
      source: 'ipfs'
    });
  } catch (error) {
    console.error('IPFS load error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;