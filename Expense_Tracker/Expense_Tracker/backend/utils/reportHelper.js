// utils/reportHelper.js
const { exportToCSV, exportToPDF } = require('./fileHelper');
const db = require('../config/db');

// Generate report (CSV/PDF)
const generateReport = async (userId, format) => {
  const expenses = await db.query(
    'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
    [userId]
  );

  if (format === 'csv') {
    exportToCSV(expenses.rows, 'expense_report');
  } else if (format === 'pdf') {
    exportToPDF(expenses.rows, 'expense_report');
  }

  return expenses.rows;
};

// Placeholder for expense prediction
const generatePrediction = async () => {
  // This can be handled by triggering the Python script or ML model (via Python integration)
  return 'Prediction Model Placeholder';
};

module.exports = { generateReport, generatePrediction };
