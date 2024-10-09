import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserExpenses } from '../redux/expenseSlice';
import { fetchUserMonthlyBudgets } from '../redux/monthlyBudgetSlice';
import { FiArrowUpRight, FiArrowDownRight, FiCalendar } from 'react-icons/fi';

const ReportsPage = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('all'); // State for filter ('all', 'week', 'month', 'year')

  // Get expenses and budgets from Redux
  const { expenses, loading: expensesLoading, error: expensesError } = useSelector((state) => state.expense);
  const { budgets, loading: budgetsLoading, error: budgetsError } = useSelector((state) => state.monthlyBudget);

  useEffect(() => {
    // Fetch the expenses and all user monthly budgets when the component mounts
    dispatch(fetchUserExpenses());
    dispatch(fetchUserMonthlyBudgets());
  }, [dispatch]);

  // Helper function to filter expenses based on the selected period
  const filterExpenses = (expenses) => {
    const now = new Date();
  
    if (filter === 'week') {
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now);
      const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // If it's Sunday (0), subtract 6; otherwise subtract (dayOfWeek - 1)
      startOfWeek.setDate(now.getDate() - daysToSubtract); 
      startOfWeek.setHours(0, 0, 0, 0);
  
      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.createdAt);
        return expenseDate >= startOfWeek && expenseDate <= now;
      });
    }
  
    if (filter === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return expenses.filter(expense => new Date(expense.createdAt) >= startOfMonth);
    }

    if (filter === 'year') {
      const startOfYear = new Date(now.getFullYear(), 0, 1); // January 1st of the current year
      return expenses.filter(expense => new Date(expense.createdAt) >= startOfYear);
    }
  
    return expenses; // If filter is 'all', return all expenses
  };

  // Helper function to convert expenses to CSV
  const convertToCSV = (data) => {
    const headers = ['ID', 'Expense Name', 'Category', 'Amount', 'Total Budget', 'Remaining Budget', 'Date'];
    const rows = data.map((expense,index) => {
      const budget = budgets.find(b => b.id === expense.monthlyBudgetId);
      return [
        index+1,
        expense.expense_name,
        expense.Category.category_name,
        expense.amount.toFixed(2),
        budget ? budget.total_monthly_budget.toFixed(2) : 'N/A',
        budget ? budget.remaining_monthly_budget.toFixed(2) : 'N/A',
        new Date(expense.createdAt).toLocaleDateString()
      ];
    });

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');

    return csvContent;
  };

  // Trigger CSV download
  const downloadCSV = () => {
    const csvData = convertToCSV(filteredExpenses);
    const baseFilename = 
      filter === 'month' ? 'monthly_expenses_report' :
      filter === 'week' ? 'weekly_expenses_report' :
      filter === 'year' ? 'yearly_expenses_report' :
      'all_expenses_report';
  
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${baseFilename}.csv`; // Use dynamic filename
    link.click();
  };
  

  if (expensesLoading || budgetsLoading) return <div className="text-center text-gray-600">Loading...</div>;
  if (expensesError) return (
      <div className="text-center text-gray-700 py-10">
        <h2 className="text-2xl font-semibold">Please Add an expense for viewing Reports</h2>
        <p>Please add some expenses to generate Reports.</p>
    </div>
    );
  if (budgetsError) return <div className="text-red-500">Error fetching budgets: {budgetsError}</div>;

  const filteredExpenses = filterExpenses(expenses);
  

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Expense Reports</h1>

      {/* Filter Dropdown */}
      <div className="flex justify-between mb-4">
        <div>
          <label htmlFor="filter" className="mr-2 text-gray-700">Filter by:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg shadow-sm"
          >
            <option value="all">All</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        
        {/* Download CSV Button */}
        <button
          onClick={downloadCSV}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
        >
          Download as CSV
        </button>
      </div>

      {/* Table for Expenses */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left" style={{ minWidth: '50px' }}>ID</th>
              <th className="py-3 px-4 text-left" style={{ minWidth: '150px' }}>Expense Name</th>
              <th className="py-3 px-4 text-left" style={{ minWidth: '120px' }}>Category</th>
              <th className="py-3 px-4 text-left" style={{ minWidth: '100px' }}>Amount</th>
              <th className="py-3 px-4 text-left" style={{ minWidth: '100px' }}>Total Budget</th>
              <th className="py-3 px-4 text-left" style={{ minWidth: '130px' }}>Remaining Budget</th>
              <th className="py-3 px-4 text-left" style={{ minWidth: '100px' }}>Date <FiCalendar className="inline-block ml-1" /></th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {filteredExpenses.map((expense,index) => {
              const budget = budgets.find((b) => b.id === expense.monthlyBudgetId);

              return (
                <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4 text-left whitespace-nowrap">{index+1}</td>
                  <td className="py-3 px-4 text-left">{expense.expense_name}</td>
                  <td className="py-3 px-4 text-left">{expense.Category.category_name}</td>
                  <td className="py-3 px-4 text-left font-bold text-green-600">{expense.amount.toFixed(2)}</td>
                  <td className="py-3 px-4 text-left">
                    {budget ? (
                      <span className="flex items-center text-left space-x-1">
                        <span>{budget.total_monthly_budget.toFixed(2)}</span>
                        <FiArrowUpRight className="text-blue-500" />
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-left">
                    {budget ? (
                      <span className="flex items-center text-leftspace-x-1">
                        <span>{budget.remaining_monthly_budget.toFixed(2)}</span>
                        <FiArrowDownRight className={`text-${budget.remaining_monthly_budget > 0 ? 'green' : 'red'}-500`} />
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td className="py-3 px-4 text-left">
                    {new Date(expense.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
