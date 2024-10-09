const Category = require('../models/Category');
const User = require('../models/User');

const addCategory = async (req, res) => {
  const { category_name } = req.body; // Change to category_name
  const userId = req.user.id; // Get the userId from the token (set by the authMiddleware)

  if (!category_name) { // Check for category_name instead of name
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    // Check if the user already has a category with the same name
    const existingCategory = await Category.findOne({ where: { category_name, userId } });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists for this user' });
    }

    const newCategory = await Category.create({ category_name, userId }); // Change to category_name
    res.status(201).json({ message: 'Category created successfully!', category: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserCategories = async (req, res) => {
  const userId = req.user.id;

  try {
    const categories = await Category.findAll({ where: { userId } });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params; // Category ID
  const { category_name } = req.body; // Change to category_name
  const userId = req.user.id;

  try {
    const category = await Category.findOne({ where: { id, userId } });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update category name if provided
    category.category_name = category_name || category.category_name; // Change to category_name
    await category.save();
    
    res.status(200).json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const category = await Category.findOne({ where: { id, userId } });

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.destroy();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  addCategory,
  getUserCategories,
  updateCategory,
  deleteCategory,
};
