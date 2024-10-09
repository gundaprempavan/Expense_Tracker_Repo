const express = require('express');
const {
  addCategorywiseBudget,
  getUserCategorywiseBudgets,
  getCategorywiseBudgetById,
  updateCategorywiseBudget,
  deleteCategorywiseBudget,
} = require('../controller/categorywiseBudgetController');
const authMiddleware = require('../middleware/authMiddleware'); // Adjust the path to your auth middleware

const router = express.Router();

// Route for adding a category-wise budget (requires authentication)
router.post('/add', authMiddleware, addCategorywiseBudget); // Add a new category-wise budget
router.get('/', authMiddleware, getUserCategorywiseBudgets); // Get all category-wise budgets for the user
router.get('/:id', authMiddleware, getCategorywiseBudgetById); // Get a category-wise budget by ID
router.put('/update/:id', authMiddleware, updateCategorywiseBudget); // Update an existing category-wise budget
router.delete('/delete/:id', authMiddleware, deleteCategorywiseBudget); // Delete a category-wise budget

module.exports = router;
