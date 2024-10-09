const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./User"); // Import User model for association

class MonthlyBudget extends Model {}

MonthlyBudget.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_monthly_budget: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    remaining_monthly_budget: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    category_remaining_budget: {
      // New field
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
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
  },
  {
    sequelize,
    modelName: "MonthlyBudget",
  }
);

// Associate MonthlyBudget with User
MonthlyBudget.belongsTo(User, { foreignKey: "userId" });

module.exports = MonthlyBudget;
