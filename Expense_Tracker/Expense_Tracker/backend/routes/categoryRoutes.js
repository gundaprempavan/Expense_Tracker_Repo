const express = require('express');
const { addCategory, getUserCategories, updateCategory, deleteCategory  } = require('../controller/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for adding a category (requires authentication)
router.post('/add', authMiddleware, addCategory);
router.get('/', authMiddleware, getUserCategories);
router.put('/update/:id', authMiddleware, updateCategory); // Update a category by ID
router.delete('/delete/:id', authMiddleware, deleteCategory);

module.exports = router;
