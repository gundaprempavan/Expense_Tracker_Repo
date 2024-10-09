import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaDollarSign, FaChartLine, FaSpinner } from 'react-icons/fa'; // Import icons

const ExpensePrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [spendingHabits, setSpendingHabits] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      const token = sessionStorage.getItem('token'); // Retrieve token from session storage
      try {
        const response = await axios.get('http://localhost:5001/run-expense-prediction', {
          headers: {
            'Authorization': `Bearer ${token}` // Include token in the headers
          }
        });
        setPrediction(response.data.predicted_expenses);
        setSpendingHabits(response.data.spending_habits);
      } catch (error) {
        console.error('Error fetching prediction:', error);
      }
      setLoading(false);
    };

    fetchPrediction();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  return (
    <div className="container mx-auto mt-10 p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-700">
        <FaChartLine className="inline-block mr-2" />
        Expense Prediction
      </h1>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <FaSpinner className="animate-spin text-blue-500 text-4xl" />
          <span className="ml-2 text-lg text-gray-700">Loading...</span>
        </div>
      ) : (
        <>
          {/* No Expenses Message */}
          {(!spendingHabits && !prediction) && (
            <div className="text-center text-gray-700 py-10">
              <h2 className="text-2xl font-semibold">No expense prediction available.</h2>
              <p>Please add some expenses to generate predictions.</p>
            </div>
          )}

          {/* Spending Habits Section */}
          {spendingHabits && (
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-3xl font-semibold text-blue-600 mb-4 flex items-center">
                <FaDollarSign className="mr-2 text-blue-400" />
                Spending Habits
              </h2>
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-blue-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-700">Category</th>
                    <th className="px-6 py-3 text-right text-lg font-medium text-gray-700">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.keys(spendingHabits.category_name).map((key, index) => (
                    <tr key={index}>
                      <td className="border px-6 py-4">{spendingHabits.category_name[key]}</td>
                      <td className="border px-6 py-4 text-right text-blue-600 font-semibold">
                        {spendingHabits.amount[key].toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Predicted Expenses Section */}
          {prediction && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-3xl font-semibold text-blue-600 mb-4 flex items-center">
                <FaChartLine className="mr-2 text-blue-400" />
                Predicted Expenses for Next Year
              </h2>
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-blue-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-lg font-medium text-gray-700">Category</th>
                    <th className="px-6 py-3 text-right text-lg font-medium text-gray-700">
                      Predicted Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.keys(prediction.category_name).map((key, index) => (
                    <tr key={index}>
                      <td className="border px-6 py-4">{prediction.category_name[key]}</td>
                      <td className="border px-6 py-4 text-right text-blue-600 font-semibold">
                        {prediction.predicted_amount[key].toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpensePrediction;
