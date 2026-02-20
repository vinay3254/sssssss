import express from 'express';
const router = express.Router();

const versions = new Map();

// Save version
router.post('/save', (req, res) => {
  const { presentationId, data, comment, userId } = req.body;
  const versionId = `v_${Date.now()}`;
  versions.set(versionId, {
    presentationId,
    data,
    comment: comment || 'Auto-save',
    userId,
    created: new Date(),
    version: Array.from(versions.values()).filter(v => v.presentationId === presentationId).length + 1
  });
  res.json({ success: true, versionId });
});

// Get version history
router.get('/:presentationId', (req, res) => {
  const presentationVersions = Array.from(versions.values())
    .filter(v => v.presentationId === req.params.presentationId)
    .sort((a, b) => b.created - a.created);
  res.json({ versions: presentationVersions });
});

// Restore version
router.post('/restore', (req, res) => {
  const { versionId } = req.body;
  const version = versions.get(versionId);
  if (version) {
    res.json({ success: true, data: version.data });
  } else {
    res.status(404).json({ error: 'Version not found' });
  }
});

// Compare versions
router.post('/compare', (req, res) => {
  const { versionId1, versionId2 } = req.body;
  const v1 = versions.get(versionId1);
  const v2 = versions.get(versionId2);
  res.json({ 
    success: true, 
    comparison: { 
      version1: v1?.created, 
      version2: v2?.created,
      changes: 'Detailed diff would be calculated here'
    }
  });
});

export default router;