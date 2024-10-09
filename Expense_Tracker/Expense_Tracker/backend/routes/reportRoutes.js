// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { generateReport, getExpenseTrends } = require('../controller/reportController');

// Route to generate reports
router.get('/generate', generateReport); // Add appropriate path
router.get('/trends', getExpenseTrends);  // Add appropriate path

module.exports = router;
