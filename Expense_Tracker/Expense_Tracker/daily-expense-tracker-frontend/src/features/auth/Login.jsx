import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/userSlice";
import { fetchUserMonthlyBudgets } from "../../redux/monthlyBudgetSlice";
import { useNavigate } from "react-router-dom";
import { HiUser, HiLockClosed } from "react-icons/hi";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      sessionStorage.setItem("token", result.token);

      const budgets = await dispatch(fetchUserMonthlyBudgets()).unwrap();

      if (budgets.length === 0) {
        navigate("/add-budget");
      } else {
        navigate("/dashboard", { state: { budgets } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid Credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back!
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <div className="relative">
              <HiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="border border-gray-300 p-3 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="border border-gray-300 p-3 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded hover:bg-blue-600 transition duration-200 w-full"
          >
            Login
          </button>
          <p className="mt-4 text-center text-gray-600">
            <a href="/recover-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
