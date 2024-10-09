const express = require('express');
const {
  addMonthlyBudget,
  getUserMonthlyBudgets,
  getMonthlyBudgetById,
  updateMonthlyBudget,
  deleteMonthlyBudget
} = require('../controller/budgetController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/add', authMiddleware, addMonthlyBudget);
router.get('/', authMiddleware, getUserMonthlyBudgets);
router.get('/:id', authMiddleware, getMonthlyBudgetById);
router.put('/update/:id', authMiddleware, updateMonthlyBudget);
router.delete('/delete/:id', authMiddleware, deleteMonthlyBudget);

module.exports = router;
