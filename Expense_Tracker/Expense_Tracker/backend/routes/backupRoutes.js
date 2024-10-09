// routes/backupRoutes.js
const express = require('express');
const { exportData, backupData } = require('../controller/backupController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Protect backup routes
router.use(authMiddleware);

// Export data (CSV/PDF)
router.get('/export', exportData);

// Backup data
router.get('/backup', backupData);

module.exports = router;
