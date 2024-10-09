const express = require("express");
const { sequelize } = require("./config/db"); // Adjust this path as needed
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const categorywiseBudgetRoutes = require("./routes/categorywiseBudgetRoutes"); // Import the new routes
const expenseRoutes = require("./routes/expenseRoutes");
const cors = require("cors"); // Move the cors import to the top

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Allow only your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify the methods you want to allow
    credentials: true, // Allow credentials (if needed)
  })
);

// Define your models
const User = require("./models/User");
const CategorywiseBudget = require("./models/CategorywiseBudget");
const Category = require("./models/Category");
const Expense = require("./models/Expense");
const MonthlyBudget = require("./models/MonthlyBudget");

// Define associations
User.hasMany(CategorywiseBudget, { foreignKey: "userId" });
User.hasMany(Category, { foreignKey: "userId" });
User.hasMany(Expense, { foreignKey: "userId" });
User.hasMany(MonthlyBudget, { foreignKey: "userId" });

CategorywiseBudget.belongsTo(User, { foreignKey: "userId" });
CategorywiseBudget.hasMany(Expense, { foreignKey: "monthlyBudgetId" });

Category.belongsTo(User, { foreignKey: "userId" });
Category.hasMany(Expense, { foreignKey: "categoryId" });

Expense.belongsTo(CategorywiseBudget, { foreignKey: "monthlyBudgetId" });
Expense.belongsTo(Category, { foreignKey: "categoryId" });

// Sync models with the database
const syncModels = async () => {
  try {
    await sequelize.sync({ force: false }); // Set force: true to drop and recreate tables
    console.log("Database & tables created!");
  } catch (error) {
    console.error("Error syncing models:", error);
  }
};

// Define routes after middleware
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/categorywise-budget", categorywiseBudgetRoutes); // Add the new categorywise budget routes
app.use("/api/expense", expenseRoutes);

app.listen(5000, async () => {
  console.log("Server is running on port 5000");
  await syncModels();
});
