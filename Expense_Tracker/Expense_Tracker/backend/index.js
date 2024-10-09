// routes/index.js
//import authRoutes from './routes/authRoutes';
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const router = express.Router();

// Mount the routes
router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);
router.use('/budgets', budgetRoutes);

module.exports = router;
