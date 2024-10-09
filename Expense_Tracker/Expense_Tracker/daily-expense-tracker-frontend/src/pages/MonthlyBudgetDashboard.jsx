// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserMonthlyBudgets } from "../redux/monthlyBudgetSlice";
import {
  fetchUserCategoryBudgets,
  addCategoryBudget,
  updateCategoryBudget,
  deleteCategoryBudget,
} from "../redux/categoryBudgetSlice";
import { fetchUserCategories } from "../redux/categorySlice";
import { FaPlusCircle, FaEdit, FaTrash } from "react-icons/fa"; // Imported modern icons

const MonthlyBudgetDashboard = () => {
  const dispatch = useDispatch();
  const monthlyBudgets = useSelector((state) => state.monthlyBudget.budgets);
  const categoryBudgets = useSelector((state) => state.categoryBudget.budgets);
  const categories = useSelector((state) => state.category.categories);
  const loading = useSelector((state) => state.monthlyBudget.loading);
  const error = useSelector((state) => state.monthlyBudget.error);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [categoryAmount, setCategoryAmount] = useState("");
  const [editingBudgetId, setEditingBudgetId] = useState(null);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  useEffect(() => {
    dispatch(fetchUserMonthlyBudgets());
    dispatch(fetchUserCategoryBudgets());
    dispatch(fetchUserCategories());
  }, [dispatch]);

  const filteredBudgets = monthlyBudgets.filter(
    (budget) => budget.month === currentMonth && budget.year === currentYear
  );

  const totalBudget = filteredBudgets.reduce(
    (acc, budget) => acc + budget.total_monthly_budget,
    0
  );

  const remainingBudget = filteredBudgets.reduce(
    (acc, budget) => acc + budget.remaining_monthly_budget,
    0
  );

  const handleModalSubmit = (e) => {
    e.preventDefault();
    const budgetDetails = {
      categoryId,
      category_budget: categoryAmount,
      monthlyBudgetId: filteredBudgets[0]?.id,
    };

    if (editingBudgetId) {
      dispatch(updateCategoryBudget({ id: editingBudgetId, budgetData: { category_budget: categoryAmount }}))
        .unwrap()
        .then(() => {
          setEditingBudgetId(null);
          setCategoryAmount("");
          setCategoryId("");
        })
        .catch((error) => {
          console.error("Failed to update category budget: ", error);
        });
    } else {
      dispatch(addCategoryBudget(budgetDetails))
        .unwrap()
        .then(() => {
          setCategoryAmount("");
          setCategoryId("");
        })
        .catch((error) => {
          console.error("Failed to add category budget: ", error);
        });
    }
    setIsModalOpen(false);
  };

  const handleEditBudget = (id, currentAmount, categoryId) => {
    setEditingBudgetId(id);
    setCategoryAmount(currentAmount);
    setCategoryId(categoryId);
    setIsModalOpen(true);
  };

  const handleDeleteBudget = (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      dispatch(deleteCategoryBudget(id))
        .unwrap()
        .then(() => {
          console.log("Category budget deleted successfully");
        })
        .catch((error) => {
          console.error("Failed to delete category budget: ", error);
        });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <nav className="bg-blue-500 text-white rounded-lg p-4 mb-4">
          <h3 className="text-2xl font-bold text-center">{monthNames[currentMonth - 1]}</h3>
        </nav>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-100 p-4 rounded-lg shadow-md relative flex flex-col items-center">
            <h3 className="text-lg font-bold">Total Budget</h3>
            <p className="text-2xl">Rs.{totalBudget.toFixed(2)}</p>
            <button
              onClick={() => navigate(`/edit-monthly-budget/${filteredBudgets[0]?.id}`)}
              className="absolute top-2 right-2 p-1 text-gray-600 hover:text-gray-800"
              aria-label="Edit Monthly Budget"
            >
              <FaEdit className="h-5 w-5" />
            </button>
          </div>
          <div className="bg-green-100 p-4 rounded-lg shadow-md flex flex-col items-center">
            <h3 className="text-lg font-bold">Remaining Budget</h3>
            <p className={`text-2xl ${remainingBudget < 0 ? 'text-red-600' : 'text-gray-900'}`}>
              Rs.{remainingBudget.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingBudgetId(null);
            setCategoryId("");
          }}
          className="flex items-center bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition mb-4"
        >
          <FaPlusCircle className="h-5 w-5 mr-2" />
          Add Category Budget
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Category Budgets</h2>
        {loading ? (
          <p className="text-gray-600">Loading category budgets...</p>
        ) : error ? (
          <p className="text-red-500">Error fetching category budgets: {error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-lg divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-4 text-left" style={{ minWidth: '150px' }}>
                    <strong>Category</strong>
                  </th>
                  <th className="py-3 px-4 text-left" style={{ minWidth: '120px' }}>
                    <strong>Budget</strong>
                  </th>
                  <th className="py-3 px-4 text-left" style={{ minWidth: '130px' }}>
                    <strong>Remaining</strong>
                  </th>
                  <th className="py-3 px-4 text-left" style={{ minWidth: '100px' }}>
                    <strong>Actions</strong>
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {categoryBudgets.map((categoryBudget) => {
                  const category = categories.find((cat) => cat.id === categoryBudget.categoryId);

                  return (
                    <tr key={categoryBudget.id} className="border-b border-gray-200 hover:bg-gray-100 transition duration-200">
                      <td className="py-3 px-4 whitespace-nowrap text-left font-medium text-gray-900">
                        {category ? category.category_name : "Unknown Category"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-left text-gray-600">
                        Rs.{categoryBudget.category_budget}
                      </td>
                      <td className={`py-3 px-4 whitespace-nowrap text-left ${categoryBudget.remaining_category_budget < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        Rs.{categoryBudget.remaining_category_budget.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-left font-medium space-x-2">
                        <button
                          onClick={() => handleEditBudget(categoryBudget.id, categoryBudget.category_budget, categoryBudget.categoryId)}
                          className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded p-1 transition duration-200"
                          aria-label="Edit Category Budget"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBudget(categoryBudget.id)}
                          className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 rounded p-1 transition duration-200"
                          aria-label="Delete Category Budget"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">{editingBudgetId ? "Edit Category Budget" : "Add Category Budget"}</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="category">
                  Category
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2" htmlFor="amount">
                  Budget Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  value={categoryAmount}
                  onChange={(e) => setCategoryAmount(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                >
                  {editingBudgetId ? "Update Budget" : "Add Budget"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyBudgetDashboard;
