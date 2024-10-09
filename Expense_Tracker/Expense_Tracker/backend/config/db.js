// config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables

// Set up Sequelize connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
});

// Function to test the database connection
const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

// Export the Sequelize instance and connect function
module.exports = {
  sequelize,
  connect,
};
