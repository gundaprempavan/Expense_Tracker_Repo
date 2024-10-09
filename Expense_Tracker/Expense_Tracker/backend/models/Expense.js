const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 
const MonthlyBudget = require('./MonthlyBudget'); 
const Category = require('./Category');
const User = require('./User');

class Expense extends Model {}

Expense.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  expense_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  expense_url: {
    type: DataTypes.STRING,
    allowNull: true,  // Allow null if some expenses don't have a URL
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  monthlyBudgetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: MonthlyBudget,
      key: 'id',
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  sequelize,
  modelName: 'Expense',
});

// Associate Expense with Category, User, and MonthlyBudget
Expense.belongsTo(Category, { foreignKey: 'categoryId' });
Expense.belongsTo(User, { foreignKey: 'userId' });
Expense.belongsTo(MonthlyBudget, { foreignKey: 'monthlyBudgetId' });

module.exports = Expense;
