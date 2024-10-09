// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import RecoverPassword from "./features/auth/RecoverPassword";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./redux/userSlice";
import AddMonthlyBudget from "./pages/AddMonthlyBudget";
import MonthlyBudgetDashboard from "./pages/MonthlyBudgetDashboard";
import CategoryPage from "./pages/CategoryPage";
import ChartPage from "./pages/ChartPage";
import ReportsPage from "./pages/ReportsPage";
import ExpensePrediction from "./pages/ExpensePrediction";

const AppLayout = () => {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const noSidebarRoutes = ["/login", "/register", "/recover-password"];

  return (
    <div className="app-layout flex">
      {/* Sidebar should not be rendered on login, register, and password-recovery pages */}
      {!noSidebarRoutes.includes(location.pathname) && isAuthenticated && (
        <Sidebar />
      )}
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/recover-password" element={<RecoverPassword />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-budget" element={<AddMonthlyBudget />} />
          <Route path="/monthly-budget" element={<MonthlyBudgetDashboard />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/edit-monthly-budget/:id" element={<AddMonthlyBudget />} /> 
          <Route path="/charts" element={<ChartPage/>} />  
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/expense-prediction" element={<ExpensePrediction/>} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(loginUser({ token }));
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Header />
      <AppLayout />
    </Router>
  );
};

export default App;
