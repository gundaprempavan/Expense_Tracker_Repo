const express = require('express');
const {
  addExpense,
  getAllUserExpenses,
  getBudgetExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getHistoricalExpenses
} = require('../controller/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for expenses
router.post('/add', authMiddleware, addExpense);
router.get('/user/expenses', authMiddleware, getAllUserExpenses);
router.get('/budget/:monthlyBudgetId', authMiddleware, getBudgetExpenses); // Adjusted to monthlyBudgetId
router.get('/:id', authMiddleware, getExpenseById);
router.put('/update/:id', authMiddleware, updateExpense);
router.delete('/delete/:id', authMiddleware, deleteExpense);
router.get('/user/historical',authMiddleware,getHistoricalExpenses)
module.exports = router;
