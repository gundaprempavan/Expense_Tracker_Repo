import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMonthlyBudget,
  fetchUserMonthlyBudgets,
  fetchMonthlyBudgetById,
  updateMonthlyBudget,
} from "../redux/monthlyBudgetSlice";
import { useNavigate, useParams } from "react-router-dom";

const AddMonthlyBudget = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [totalMonthlyBudget, setTotalMonthlyBudget] = useState("");
  const [error, setError] = useState(null);
  const loading = useSelector((state) => state.monthlyBudget.loading);
  const existingBudgets = useSelector((state) => state.monthlyBudget.budgets);

  useEffect(() => {
    dispatch(fetchUserMonthlyBudgets());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchMonthlyBudgetById(id)).unwrap().then((budget) => {
        setMonth(budget.month);
        setYear(budget.year);
        setTotalMonthlyBudget(budget.total_monthly_budget);
      });
    }
  }, [dispatch, id]);

  const validateBudget = () => {
    if (!totalMonthlyBudget || isNaN(totalMonthlyBudget)) {
      return "Please enter a valid total monthly budget amount.";
    }
    const budgetExists = existingBudgets.some(
      (budget) => budget.month === month && budget.year === year
    );
    if (budgetExists && !id) {
      return "You already have a budget set for this month and year.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateBudget();
    if (validationError) {
      setError(validationError);
      return;
    }

    const budgetData = {
      month,
      year,
      total_monthly_budget: parseFloat(totalMonthlyBudget),
    };

    try {
      if (id) {
        await dispatch(updateMonthlyBudget({ id, budgetData })).unwrap();
      } else {
        await dispatch(addMonthlyBudget(budgetData)).unwrap();
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
          {id ? "Edit Monthly Budget" : "Set Monthly Budget"}
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="month" className="block text-gray-600 mb-2">
              Month
            </label>
            <input
              type="number"
              name="month"
              id="month"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="year" className="block text-gray-600 mb-2">
              Year
            </label>
            <input
              type="number"
              name="year"
              id="year"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="totalBudget" className="block text-gray-600 mb-2">
              Total Monthly Budget
            </label>
            <input
              type="number"
              name="totalBudget"
              id="totalBudget"
              placeholder="Enter your total monthly budget"
              className="border border-gray-300 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={totalMonthlyBudget}
              onChange={(e) => setTotalMonthlyBudget(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 w-full rounded hover:bg-blue-600 transition duration-200"
            disabled={loading}
          >
            {loading
              ? id
                ? "Updating Budget..."
                : "Setting Budget..."
              : id
              ? "Update Budget"
              : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMonthlyBudget;
