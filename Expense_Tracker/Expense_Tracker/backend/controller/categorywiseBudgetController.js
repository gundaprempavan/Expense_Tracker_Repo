const CategorywiseBudget = require("../models/CategorywiseBudget");
const MonthlyBudget = require("../models/MonthlyBudget");

const addCategorywiseBudget = async (req, res) => {
  const { categoryId, monthlyBudgetId, category_budget } = req.body;
  const userId = req.user.id;

  if (!categoryId || !monthlyBudgetId || category_budget === undefined) {
    return res.status(400).json({
      message:
        "Category ID, Monthly Budget ID, and category budget are required",
    });
  }

  try {
    // Fetch the related MonthlyBudget
    const monthlyBudget = await MonthlyBudget.findOne({
      where: { id: monthlyBudgetId, userId },
    });

    if (!monthlyBudget) {
      return res.status(404).json({ message: "Monthly budget not found" });
    }

    // Check if the category_budget is within the remaining budget
    if (category_budget > monthlyBudget.category_remaining_budget) {
      return res
        .status(400)
        .json({ message: "Category budget exceeds the remaining budget" });
    }

    // Create the new category-wise budget
    const newCategoryBudget = await CategorywiseBudget.create({
      categoryId,
      monthlyBudgetId,
      userId,
      category_budget,
      remaining_category_budget: category_budget, // Initially equal to category_budget
    });

    // Update the remaining category budget in MonthlyBudget
    monthlyBudget.category_remaining_budget -= category_budget;
    await monthlyBudget.save();

    res.status(201).json({
      message: "Category-wise budget created successfully",
      categoryBudget: newCategoryBudget,
    });
  } catch (error) {
    console.error("Error creating category-wise budget:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all category-wise budgets for a user
const getUserCategorywiseBudgets = async (req, res) => {
  const userId = req.user.id;

  try {
    const categoryBudgets = await CategorywiseBudget.findAll({
      where: { userId },
    });
    res.status(200).json(categoryBudgets);
  } catch (error) {
    console.error("Error fetching category-wise budgets:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single category-wise budget by ID
const getCategorywiseBudgetById = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryBudget = await CategorywiseBudget.findOne({
      where: { id, userId: req.user.id },
    });
    if (!categoryBudget) {
      return res
        .status(404)
        .json({ message: "Category-wise budget not found" });
    }
    res.status(200).json(categoryBudget);
  } catch (error) {
    console.error("Error fetching category-wise budget:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateCategorywiseBudget = async (req, res) => {
  const { id } = req.params;
  const { category_budget } = req.body;

  try {
    const categoryBudget = await CategorywiseBudget.findOne({
      where: { id, userId: req.user.id },
    });

    if (!categoryBudget) {
      return res
        .status(404)
        .json({ message: "Category-wise budget not found" });
    }

    // Fetch the related MonthlyBudget
    const monthlyBudget = await MonthlyBudget.findOne({
      where: { id: categoryBudget.monthlyBudgetId, userId: req.user.id },
    });

    if (!monthlyBudget) {
      return res.status(404).json({ message: "Monthly budget not found" });
    }

    const budgetDifference = category_budget - categoryBudget.category_budget;

    // Check if the new category_budget fits within the remaining budget
    if (budgetDifference > monthlyBudget.category_remaining_budget) {
      return res.status(400).json({
        message: "Adjusted category budget exceeds the remaining budget",
      });
    }

    // Update the category-wise budget and adjust remaining budget
    categoryBudget.remaining_category_budget += budgetDifference;
    categoryBudget.category_budget = category_budget;
    await categoryBudget.save();

    // Adjust the remaining category budget in MonthlyBudget
    monthlyBudget.category_remaining_budget -= budgetDifference;
    await monthlyBudget.save();

    res.status(200).json({
      message: "Category-wise budget updated successfully",
      categoryBudget,
    });
  } catch (error) {
    console.error("Error updating category-wise budget:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a category-wise budget
// Delete a category-wise budget
const deleteCategorywiseBudget = async (req, res) => {
  const { id } = req.params;

  try {
    const categoryBudget = await CategorywiseBudget.findOne({
      where: { id, userId: req.user.id },
    });

    if (!categoryBudget) {
      return res
        .status(404)
        .json({ message: "Category-wise budget not found" });
    }

    // Fetch the related MonthlyBudget
    const monthlyBudget = await MonthlyBudget.findOne({
      where: { id: categoryBudget.monthlyBudgetId, userId: req.user.id },
    });

    if (!monthlyBudget) {
      return res.status(404).json({ message: "Monthly budget not found" });
    }

    // Add the category budget back to the monthly budget
    monthlyBudget.category_remaining_budget += categoryBudget.category_budget;
    await monthlyBudget.save();

    // Now delete the category-wise budget
    await categoryBudget.destroy();

    res
      .status(200)
      .json({ message: "Category-wise budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting category-wise budget:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addCategorywiseBudget,
  getUserCategorywiseBudgets,
  getCategorywiseBudgetById,
  updateCategorywiseBudget,
  deleteCategorywiseBudget,
};
