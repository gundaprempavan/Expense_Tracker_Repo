const Expense = require("../models/Expense");
const MonthlyBudget = require("../models/MonthlyBudget");
const CategorywiseBudget = require("../models/CategorywiseBudget");
const { Op } = require('sequelize');


const addExpense = async (req, res) => {
  const { expense_name, amount, categoryId, monthlyBudgetId, expense_url, createdAt } = req.body; // Include createdAt
  const userId = req.user.id;

  if (!expense_name || !amount || !categoryId || !monthlyBudgetId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find the associated monthly budget
    const budget = await MonthlyBudget.findByPk(monthlyBudgetId);
    if (!budget) {
      return res.status(404).json({ message: "Monthly Budget not found" });
    }

    // Find the category-wise budget
    const categoryBudget = await CategorywiseBudget.findOne({
      where: { categoryId, userId, monthlyBudgetId },
    });
    if (!categoryBudget) {
      return res.status(404).json({ message: "Category-wise budget not found" });
    }

    // Create the expense with the custom createdAt date
    const newExpense = await Expense.create({
      expense_name,
      amount,
      categoryId,
      monthlyBudgetId,
      expense_url,
      userId,
      createdAt: createdAt ? new Date(createdAt) : undefined, // Use provided date or default to current date
    });

    // Update the remaining budgets after adding the expense
    budget.remaining_monthly_budget -= amount;
    categoryBudget.remaining_category_budget -= amount;

    await Promise.all([budget.save(), categoryBudget.save()]);

    res.status(201).json({ message: "Expense created successfully", expense: newExpense });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all expenses for a specific user
const getAllUserExpenses = async (req, res) => {
  const userId = req.user.id; // Get user ID from the request

  try {
    const expenses = await Expense.findAll({
      where: { userId },
      include: ["Category"], // Include category details in the response
    });

    if (expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found for this user" });
    }

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching user expenses:", error);
    res.status(500).json({ error: "Server error" });
  }
};



// Get all expenses for a specific budget
const getBudgetExpenses = async (req, res) => {
  const { monthlyBudgetId } = req.params;
  const userId = req.user.id;

  try {
    const expenses = await Expense.findAll({
      where: { monthlyBudgetId, userId },
      include: ["Category"], // Include category details in the response
    });

    if (expenses.length === 0) {
      return res
        .status(404)
        .json({ message: "No expenses found for this budget" });
    }

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching budget expenses:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get a specific expense by ID
const getExpenseById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const expense = await Expense.findOne({
      where: { id, userId },
      include: ["Category"], // Include category details in the response
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { expense_name, amount, categoryId, monthlyBudgetId, expense_url, createdAt } = req.body; // Include createdAt
  const userId = req.user.id;

  try {
    // Find the expense to be updated
    const expense = await Expense.findOne({ where: { id, userId } });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const previousAmount = expense.amount;

    // Update expense fields
    expense.expense_name = expense_name || expense.expense_name;
    expense.amount = amount || expense.amount;
    expense.categoryId = categoryId || expense.categoryId;
    expense.monthlyBudgetId = monthlyBudgetId || expense.monthlyBudgetId;
    expense.expense_url = expense_url || expense.expense_url;
    expense.createdAt = createdAt ? new Date(createdAt) : expense.createdAt; // Update the createdAt field if provided
   
    await expense.save();

    // Update the monthly and category-wise budgets based on the new amount
    const budget = await MonthlyBudget.findByPk(expense.monthlyBudgetId);
    const categoryBudget = await CategorywiseBudget.findOne({
      where: { categoryId, userId, monthlyBudgetId },
    });

    budget.remaining_monthly_budget += previousAmount - expense.amount;
    categoryBudget.remaining_category_budget += previousAmount - expense.amount;

    await Promise.all([budget.save(), categoryBudget.save()]);

    res.status(200).json({ message: "Expense updated successfully", expense });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// Delete an expense for the user
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const expense = await Expense.findOne({ where: { id, userId } });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const amount = expense.amount;

    // Find the associated monthly and category budgets
    const budget = await MonthlyBudget.findByPk(expense.monthlyBudgetId);
    const categoryBudget = await CategorywiseBudget.findOne({
      where: {
        categoryId: expense.categoryId,
        userId,
        monthlyBudgetId: expense.monthlyBudgetId,
      },
    });

    // Update the remaining budgets after deleting the expense
    budget.remaining_monthly_budget += amount;
    categoryBudget.remaining_category_budget += amount;

    await Promise.all([budget.save(), categoryBudget.save()]);

    await expense.destroy();
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// In your expenseController.js
const getHistoricalExpenses = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch expenses for the last 6 months or a specific range as needed
    const expenses = await Expense.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 6)), // Last 6 months
        },
      },
      include: ["Category"],
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching historical expenses:", error);
    res.status(500).json({ error: "Server error" });
  }
};


module.exports = {
  addExpense,
  getAllUserExpenses,
  getBudgetExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getHistoricalExpenses
};
