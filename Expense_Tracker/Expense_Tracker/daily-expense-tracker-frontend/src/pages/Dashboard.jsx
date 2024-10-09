import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMonthlyBudgets } from "../redux/monthlyBudgetSlice";
import { fetchUserCategoryBudgets } from "../redux/categoryBudgetSlice";
import { fetchBudgetExpenses, addExpense, updateExpense, deleteExpense } from "../redux/expenseSlice";
import { fetchUserCategories } from "../redux/categorySlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HiPlus, HiPencil, HiTrash, HiCurrencyRupee, HiExclamation } from "react-icons/hi"; // Importing icons
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'; // Importing Recharts components
import { FiCalendar } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa'; // Import icons


const Dashboard = () => {
  const dispatch = useDispatch();
  const monthlyBudgets = useSelector((state) => state.monthlyBudget.budgets);
  const loading = useSelector((state) => state.monthlyBudget.loading);
  const error = useSelector((state) => state.monthlyBudget.error);
  const expenses = useSelector((state) => state.expense.expenses);
  const userCategories = useSelector((state) => state.category.categories);
  const [alertVisible, setAlertVisible] = useState(false); // State for alert visibility
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const budgets = useSelector((state) => state.categoryBudget.budgets);
  const categories = useSelector((state) => state.category.categories); // Select categories from the state

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    dispatch(fetchUserMonthlyBudgets());
    dispatch(fetchUserCategories());
  }, [dispatch]);

  useEffect(() => {
    const currentBudget = monthlyBudgets.find(
      (budget) => budget.month === currentMonth && budget.year === currentYear
    );
    if (currentBudget) {
      dispatch(fetchBudgetExpenses(currentBudget.id));
      const remainingBudget = currentBudget.remaining_monthly_budget;
      const totalBudget = currentBudget.total_monthly_budget; // Get the total monthly budget

      // Check if remaining budget is less than 10% of total budget
      if (remainingBudget < 0.1 * totalBudget) {
        setAlertVisible(true); // Show alert if remaining budget is below 10%
      } else {
        setAlertVisible(false); // Hide alert if above 10%
      }
    }
  }, [dispatch, monthlyBudgets, currentMonth, currentYear]);

  const filteredBudgets = monthlyBudgets.filter(
    (budget) => budget.month === currentMonth && budget.year === currentYear
  );

  const remainingBudget = filteredBudgets.reduce(
    (acc, budget) => acc + budget.remaining_monthly_budget,
    0
  );

  const handleAddOrUpdateExpense = () => {
    const currentBudget = filteredBudgets[0];
    if (currentBudget) {
      const expenseData = {
        expense_name: expenseName,
        amount: parseFloat(amount),
        categoryId: categoryId,
        monthlyBudgetId: currentBudget.id,
        createdAt: selectedDate.toISOString(),
      };

      if (isEditing && currentExpenseId) {
        dispatch(updateExpense({ id: currentExpenseId, expenseData }));
      } else {
        dispatch(addExpense(expenseData))
          .then(() => {
            // Reload the page after adding the expense
            window.location.reload();
          });
      }

      resetForm();
      setModalOpen(false);
    }
  };

  const handleEditClick = (expense) => {
    setIsEditing(true);
    setCurrentExpenseId(expense.id);
    setExpenseName(expense.expense_name);
    setAmount(expense.amount);
    setCategoryId(expense.categoryId);
    setSelectedDate(new Date(expense.createdAt));
    setModalOpen(true);
  };

  const resetForm = () => {
    setExpenseName("");
    setAmount("");
    setCategoryId("");
    setSelectedDate(new Date());
    setIsEditing(false);
    setCurrentExpenseId(null);
  };

  const handleDeleteClick = (expenseId) => {
    dispatch(deleteExpense(expenseId));
  };

  const getCategoryNameById = (categoryId) => {
    const category = userCategories.find((cat) => cat.id === categoryId);
    return category ? category.category_name : "Unknown Category";
  };

  const generateRandomColorsForCategories = () => {
    const categoryColors = {};
    categories.forEach(category => {
      // Generate RGB values ensuring they are below 128 to avoid light colors
      const r = Math.floor(Math.random() * 128); // 0-127
      const g = Math.floor(Math.random() * 128); // 0-127
      const b = Math.floor(Math.random() * 128); // 0-127

      // Convert to hex and create the color
      categoryColors[category.id] = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    });
    return categoryColors;
  };


  const categoryColors = generateRandomColorsForCategories();

  const getPieChartData = () => {
    const data = [];
    const categoryTotals = {};

    expenses.forEach(expense => {
      const categoryName = getCategoryNameById(expense.categoryId);
      if (categoryTotals[categoryName]) {
        categoryTotals[categoryName] += expense.amount;
      } else {
        categoryTotals[categoryName] = expense.amount;
      }
    });

    for (const [category, amount] of Object.entries(categoryTotals)) {
      data.push({ name: category, value: amount, color: categoryColors[categories.find(cat => cat.category_name === category)?.id] });
    }

    return data;
  };

  const pieChartData = getPieChartData();

  const currentBudget = filteredBudgets[0]; // Extract the current budget

  const totalBudget = currentBudget ? currentBudget.total_monthly_budget : 0;

  useEffect(() => {
    dispatch(fetchUserCategoryBudgets());
    dispatch(fetchUserCategories()); // Fetch categories on component mount
  }, [dispatch]);

  if (loading) return (
    <div className="flex justify-center items-center py-10">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          <span className="ml-2 text-lg text-gray-700">Loading...</span>
      </div>
  );
  if (error) return <div>Error: {error}</div>;

  // Create a map of category IDs to category names
  const categoryMap = {};
  categories.forEach(category => {
    categoryMap[category.id] = category.category_name; // Map ID to name
  });

  // Prepare data for the PieChart with category names
  const data = budgets.map((budget) => ({
    name: categoryMap[budget.categoryId] || "Unknown Category", // Replace ID with category name
    value: budget.category_budget,
    color: categoryColors[budget.categoryId]
  }));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-8">
      <h2 className="text-4xl font-extrabold mb-8 text-gray-800 flex items-center">
        <HiCurrencyRupee className="text-green-600 mr-2" />
        Monthly Budget Overview
      </h2>

      {/* Loading and Alerts */}
      {loading && <p className="text-red-500 mb-4">Loading monthly budgets...</p>}

      {alertVisible && (
        <div className="flex items-center bg-yellow-50 border-l-4 border-red-600 text-red-600 p-4 mb-6 rounded-lg">
          <HiExclamation className="mr-2 text-red-600" />
          Warning: Your remaining budget is below 10%!
        </div>
      )}

      {/* Budget Display */}
      {filteredBudgets.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-600 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-1">
              Budget for {monthNames[currentMonth - 1]}:
              <span className="text-green-600 font-bold"> Rs.{totalBudget.toFixed(2)}</span>
            </h3>
            <p className="text-lg">
              Remaining Budget:
              <span className={`font-bold ml-2 ${remainingBudget < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                Rs.{remainingBudget.toFixed(2)}
              </span>
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <HiPlus className="mr-2 text-white" />
            Add Expense
          </button>
        </div>
      ) : (
        <p className="text-gray-800 text-lg">Please add a monthly budget for the current month.</p>
      )}


      {expenses.length > 0 && (
        <div className="flex space-x-6">
          {/* Category Wise Budget Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex-1">
            <h3 className="text-2xl font-semibold mb-4">Category-Wise-Budget</h3>
            <PieChart width={500} height={400}>
              <Pie data={data} dataKey="value" nameKey="name" cx="55%" cy="50%" outerRadius={160}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          {/* Expense Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg flex-1">
            <h3 className="text-2xl font-semibold mb-4">Expenses-Breakdown</h3>
            <PieChart width={500} height={400}>
              <Pie data={pieChartData} dataKey="value" nameKey="name" cx="55%" cy="50%" outerRadius={140}>
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Expense" : "Add Expense"}</h2>
            <input
              type="text"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              placeholder="Expense Name"
              className="border p-2 mb-2 w-full"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="border p-2 mb-2 w-full"
            />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border p-2 mb-2 w-full"
            >
              <option value="">Select Category</option>
              {userCategories.map((category) => (
                <option key={category.id} value={category.id}>{category.category_name}</option>
              ))}
            </select>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date(currentYear, currentMonth - 1, 1)}  // First day of the current month
              maxDate={new Date(currentYear, currentMonth, 0)}  // Last day of the current month
              className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddOrUpdateExpense}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                {isEditing ? "Update Expense" : "Add Expense"}
              </button>
              <button
                onClick={() => setModalOpen(false)}
                className="ml-2 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <h3 className="text-2xl font-semibold mt-8 mb-4">Expenses List</h3>
      {expenses.length === 0 ? (
        <p>No expenses recorded for this month.</p>
      ) : (
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left" style={{ minWidth: '50px' }}>ID</th>
              <th className="py-3 px-4 text-left" style={{ minWidth: '150px' }}>Expense Name</th>
              <th className="py-3 px-4 text-left" style={{ minWidth: '120px' }}>Category</th>
              <th className="py-3 px-4 text-right" style={{ minWidth: '100px' }}>Amount</th>
              <th className="py-3 px-4 text-right" style={{ minWidth: '100px' }}>Date <FiCalendar className="inline-block ml-1" /></th>
              <th className="py-3 px-4 text-right" style={{ minWidth: '130px' }}>Actions</th>

            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            
            {expenses.map((expense, index) => (
              <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-4 text-left whitespace-nowrap">{index + 1}</td>
                <td className="py-3 px-4 text-left">{expense.expense_name}</td>
                <td className="py-3 px-4 text-left">{getCategoryNameById(expense.categoryId)}</td>
                <td className="py-3 px-4 text-right font-bold text-red-500">{expense.amount.toFixed(2)}</td>
                <td className="py-3 px-4 text-right">
                  {new Date(expense.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => handleEditClick(expense)}>
                      <HiPencil className="text-blue-500 hover:text-blue-700" />
                    </button>
                    <button onClick={() => handleDeleteClick(expense.id)}>
                      <HiTrash className="text-red-500 hover:text-red-700" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default Dashboard;
