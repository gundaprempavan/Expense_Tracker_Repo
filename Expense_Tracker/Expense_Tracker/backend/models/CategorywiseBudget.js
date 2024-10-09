const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); 
const MonthlyBudget = require('./MonthlyBudget'); 
const Category = require('./Category'); 
const User = require('./User'); 

class CategorywiseBudget extends Model {}

CategorywiseBudget.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  category_budget: {
    type: DataTypes.DOUBLE,
    allowNull: false,
  },
  remaining_category_budget: {
    type: DataTypes.DOUBLE,
    allowNull: false,
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
  modelName: 'CategorywiseBudget',
});

// Associations
CategorywiseBudget.belongsTo(User, { foreignKey: 'userId' });
CategorywiseBudget.belongsTo(Category, { foreignKey: 'categoryId' });
CategorywiseBudget.belongsTo(MonthlyBudget, { foreignKey: 'monthlyBudgetId' });

module.exports = CategorywiseBudget;
