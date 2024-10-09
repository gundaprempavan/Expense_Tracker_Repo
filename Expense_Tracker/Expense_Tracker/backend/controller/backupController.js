// controllers/backupController.js
const fs = require('fs');
const path = require('path');
const db = require('../config/db'); // Import your database configuration
const { exportToCSV, exportToPDF } = require('../utils/fileHelper'); // Utility functions to handle exports

// Export data as CSV or PDF
const exportData = async (req, res) => {
  const format = req.query.format; // Get format from query parameters (e.g., ?format=csv or ?format=pdf)

  try {
    // Fetch data from the database
    const { rows: expenses } = await db.query('SELECT * FROM expenses WHERE user_id = $1', [req.user.id]);

    if (format === 'csv') {
      // Export to CSV
      const csvFilePath = path.join(__dirname, '../exports/expenses.csv');
      await exportToCSV(expenses, csvFilePath);
      res.download(csvFilePath, 'expenses.csv'); // Send the CSV file to the user
    } else if (format === 'pdf') {
      // Export to PDF
      const pdfFilePath = path.join(__dirname, '../exports/expenses.pdf');
      await exportToPDF(expenses, pdfFilePath);
      res.download(pdfFilePath, 'expenses.pdf'); // Send the PDF file to the user
    } else {
      return res.status(400).json({ error: 'Invalid format. Please use "csv" or "pdf".' });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Error exporting data' });
  }
};

// Backup data
const backupData = async (req, res) => {
  try {
    // Logic to backup data
    const backupFilePath = path.join(__dirname, '../backups/backup.json');
    
    // Fetch all data from the database (you may need to adjust this based on your database schema)
    const { rows: expenses } = await db.query('SELECT * FROM expenses WHERE user_id = $1', [req.user.id]);
    
    // Save data to a backup file
    fs.writeFileSync(backupFilePath, JSON.stringify(expenses, null, 2));

    res.download(backupFilePath, 'backup.json'); // Send the backup file to the user
  } catch (error) {
    console.error('Error backing up data:', error);
    res.status(500).json({ error: 'Error backing up data' });
  }
};

module.exports = { exportData, backupData };
