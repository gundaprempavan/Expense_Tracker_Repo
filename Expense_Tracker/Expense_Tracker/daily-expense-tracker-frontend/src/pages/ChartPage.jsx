import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserExpenses } from "../redux/expenseSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaChartBar, FaCalendarDay, FaCalendarWeek, FaCalendarAlt } from 'react-icons/fa';
 
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
 
const ChartPage = () => {
  const dispatch = useDispatch();
  const { expenses, loading, error } = useSelector((state) => state.expense);
  const [timeFrame, setTimeFrame] = useState("day");
 
  useEffect(() => {
    dispatch(fetchUserExpenses());
  }, [dispatch]);
 
  const handleTimeFrameChange = (newTimeFrame) => {
    setTimeFrame(newTimeFrame);
  };
 
  const prepareChartData = () => {
    const groupedExpenses = {};
    const today = new Date();
    let pastDates = [];
 
    if (timeFrame === "day") {
      pastDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return date.toLocaleDateString();
      });
    } else if (timeFrame === "week") {
      pastDates = Array.from({ length: 7 }, (_, i) => {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - (i * 7) - (today.getDay() || 7));
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
      });
    } else if (timeFrame === "month") {
      pastDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        return date.toLocaleString("default", { month: "long", year: "numeric" });
      });
    } else if (timeFrame === "year") {
      pastDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setFullYear(today.getFullYear() - i);
        return date.getFullYear();
      });
    }
 
    pastDates.forEach((date) => {
      groupedExpenses[date] = {};
    });
 
    expenses.forEach((expense) => {
      const date = new Date(expense.createdAt);
      const category = expense.Category.category_name;
      const amount = expense.amount; 
      if (timeFrame === "day") {
        const formattedDate = date.toLocaleDateString();
        if (pastDates.includes(formattedDate)) {
          groupedExpenses[formattedDate][category] = (groupedExpenses[formattedDate][category] || 0) + amount;
        }
      } else if (timeFrame === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const weekLabel = `${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`;
 
        if (pastDates.includes(weekLabel)) {
          groupedExpenses[weekLabel][category] = (groupedExpenses[weekLabel][category] || 0) + amount;
        }
      } else if (timeFrame === "month") {
        const monthLabel = date.toLocaleString("default", { month: "long", year: "numeric" });
        if (pastDates.includes(monthLabel)) {
          groupedExpenses[monthLabel][category] = (groupedExpenses[monthLabel][category] || 0) + amount;
        }
      } else if (timeFrame === "year") {
        const yearLabel = date.getFullYear();
        if (pastDates.includes(yearLabel)) {
          groupedExpenses[yearLabel][category] = (groupedExpenses[yearLabel][category] || 0) + amount;
        }
      }
    });
 
    const labels = pastDates;
    const datasets = [];
    const categories = new Set();
 
    Object.values(groupedExpenses).forEach((dayExpenses) => {
      Object.keys(dayExpenses).forEach((category) => {
        categories.add(category);
      });
    });
 
    categories.forEach((category) => {
      const data = labels.map((label) => groupedExpenses[label][category] || 0);
      datasets.push({
        label: category,
        data: data,
        backgroundColor: getColorForCategory(),
      });
    });
 
    return { labels, datasets };
  };
 
  const getColorForCategory = () => {
    const randomColor = () => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgba(${r}, ${g}, ${b}, 0.5)`; 
    };
 
    return randomColor();
  };
 
  const chartData = prepareChartData();
 
  if (loading) return <div className="text-center">Loading...</div>;
  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-700">Please add an expense.</p>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-[92%] w-full p-6 bg-white shadow-md rounded-lg" style={{ width: '100%', height: '95%' }}>
        <h2 className="text-3xl font-bold mb-6 flex items-center">
          <FaChartBar className="mr-2 text-blue-600" />
          Expenses Bar Chart
        </h2>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => handleTimeFrameChange("day")}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${timeFrame === "day" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            <FaCalendarDay className="mr-2" />
            Last 7 Days
          </button>
          <button
            onClick={() => handleTimeFrameChange("week")}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${timeFrame === "week" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            <FaCalendarWeek className="mr-2" />
            Last 7 Weeks
          </button>
          <button
            onClick={() => handleTimeFrameChange("month")}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${timeFrame === "month" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            <FaCalendarAlt className="mr-2" />
            Last 7 Months
          </button>
          <button
            onClick={() => handleTimeFrameChange("year")}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${timeFrame === "year" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
          >
            <FaCalendarAlt className="mr-2" />
            Last 7 Years
          </button>
        </div>
        <Bar
          data={{
            labels: chartData.labels,
            datasets: chartData.datasets,
          }}
          options={{
            responsive: true,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
              },
            },
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: `Expenses by Category for the Last 7 ${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)}(s)`,
              },
            },
          }}
        />
      </div>
    </div>
  );
};
 
export default ChartPage;