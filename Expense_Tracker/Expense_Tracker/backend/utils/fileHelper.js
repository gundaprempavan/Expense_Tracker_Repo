// utils/fileHelper.js
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Export data as CSV
const exportToCSV = (data, filename) => {
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(data);
  fs.writeFileSync(`./exports/${filename}.csv`, csv);
};

// Export data as PDF
const exportToPDF = (data, filename) => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(`./exports/${filename}.pdf`));
  
  doc.fontSize(20).text('Expense Report', { align: 'center' });
  doc.moveDown();
  data.forEach((item) => {
    doc.fontSize(14).text(`Category: ${item.category}`);
    doc.text(`Amount: ${item.amount}`);
    doc.text(`Description: ${item.description}`);
    doc.text(`Date: ${item.date}`);
    doc.moveDown();
  });
  
  doc.end();
};

module.exports = { exportToCSV, exportToPDF };
