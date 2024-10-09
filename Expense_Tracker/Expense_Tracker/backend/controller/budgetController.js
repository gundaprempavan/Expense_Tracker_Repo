const MonthlyBudget = require("../models/MonthlyBudget"); // Import MonthlyBudget model

// Add a new monthly budget
const addMonthlyBudget = async (req, res) => {
  const { month, year, total_monthly_budget } = req.body;
  const userId = req.user.id; // Extract userId from the token

  if (
    month === undefined ||
    year === undefined ||
    total_monthly_budget === undefined
  ) {
    return res
      .status(400)
      .json({ message: "Month, year, and total monthly budget are required" });
  }

  try {
    // Check if a budget already exists for the given month and year
    const existingBudget = await MonthlyBudget.findOne({
      where: {
        month,
        year,
        userId, // Ensure the check is for the specific user
      },
    });

    if (existingBudget) {
      return res.status(400).json({
        message: "Monthly budget for this month already exists.",
        budget: existingBudget,
      });
    }

    // Create a new monthly budget since it does not exist
    const newMonthlyBudget = await MonthlyBudget.create({
      month,
      year,
      total_monthly_budget,
      category_remaining_budget: total_monthly_budget,
      remaining_monthly_budget: total_monthly_budget, // Initially, remaining_monthly_budget is equal to total_monthly_budget
      userId,
    });

    res.status(201).json({
      message: "Monthly budget created successfully",
      budget: newMonthlyBudget,
    });
  } catch (error) {
    console.error("Error creating monthly budget:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all monthly budgets for a user
const getUserMonthlyBudgets = async (req, res) => {
  const userId = req.user.id;

  try {
    const monthlyBudgets = await MonthlyBudget.findAll({ where: { userId } });
    res.status(200).json(monthlyBudgets);
  } catch (error) {
    console.error("Error fetching monthly budgets:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a single monthly budget by ID
const getMonthlyBudgetById = async (req, res) => {
  const { id } = req.params;

  try {
    const monthlyBudget = await MonthlyBudget.findOne({
      where: { id, userId: req.user.id },
    });
    if (!monthlyBudget) {
      return res.status(404).json({ message: "Monthly budget not found" });
    }
    res.status(200).json(monthlyBudget);
  } catch (error) {
    console.error("Error fetching monthly budget:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update an existing monthly budget
const updateMonthlyBudget = async (req, res) => {
  const { id } = req.params;
  const { month, year, total_monthly_budget } = req.body;

  try {
    const monthlyBudget = await MonthlyBudget.findOne({
      where: { id, userId: req.user.id },
    });
    if (!monthlyBudget) {
      return res.status(404).json({ message: "Monthly budget not found" });
    }

    // Update month and year if provided
    monthlyBudget.month = month !== undefined ? month : monthlyBudget.month;
    monthlyBudget.year = year !== undefined ? year : monthlyBudget.year;

    if (total_monthly_budget !== undefined) {
      // Calculate the difference between the new and old total monthly budget
      const budgetDifference = total_monthly_budget - monthlyBudget.total_monthly_budget;

      // Update the remaining monthly budget and category remaining budget
      monthlyBudget.remaining_monthly_budget += budgetDifference;
      monthlyBudget.category_remaining_budget += budgetDifference;

      // Update the total monthly budget
      monthlyBudget.total_monthly_budget = total_monthly_budget;
    }

    // Save the changes to the database
    await monthlyBudget.save();

    res.status(200).json({
      message: "Monthly budget updated successfully",
      budget: monthlyBudget,
    });
  } catch (error) {
    console.error("Error updating monthly budget:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// Delete a monthly budget
const deleteMonthlyBudget = async (req, res) => {
  const { id } = req.params;

  try {
    const monthlyBudget = await MonthlyBudget.findOne({
      where: { id, userId: req.user.id },
    });
    if (!monthlyBudget) {
      return res.status(404).json({ message: "Monthly budget not found" });
    }

    await monthlyBudget.destroy();
    res.status(200).json({ message: "Monthly budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting monthly budget:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  addMonthlyBudget,
  getUserMonthlyBudgets,
  getMonthlyBudgetById,
  updateMonthlyBudget,
  deleteMonthlyBudget,
};
