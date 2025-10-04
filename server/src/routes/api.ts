import express from 'express';

const router = express.Router();

// API status endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// Example protected endpoint
router.get('/protected', (req, res) => {
  res.json({
    message: 'This is a protected endpoint',
    timestamp: new Date().toISOString(),
  });
});

export default router;
