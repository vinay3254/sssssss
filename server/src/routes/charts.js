import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', auth, (req, res) => {
  const { type, data, options } = req.body;
  
  const chartConfig = {
    type,
    data,
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      ...options
    }
  };
  
  res.json({ chartId: `chart_${Date.now()}`, config: chartConfig });
});

router.post('/table', auth, (req, res) => {
  const { rows, columns, data } = req.body;
  
  const tableConfig = {
    id: `table_${Date.now()}`,
    rows: rows || 3,
    columns: columns || 3,
    data: data || Array(rows || 3).fill().map(() => Array(columns || 3).fill(''))
  };
  
  res.json(tableConfig);
});

export default router;