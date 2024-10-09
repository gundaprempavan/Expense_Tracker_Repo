// src/pages/Register.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/userSlice";
import { HiUser, HiLockClosed, HiInformationCircle } from "react-icons/hi"; // Importing icons
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    securityQuestion: "",
    securityAnswer: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    setSuccessMessage(""); // Reset success message

    try {
      await dispatch(registerUser(formData)).unwrap();
      setSuccessMessage("Registration successful! You can now log in.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message === "Username already exists" ? "Username already exists" : "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">Name</label>
            <div className="relative">
              <HiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                className="border border-gray-300 p-3 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">Username</label>
            <div className="relative">
              <HiUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                className="border border-gray-300 p-3 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="border border-gray-300 p-3 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">Security Question</label>
            <div className="relative">
              <HiInformationCircle className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="securityQuestion"
                placeholder="Your security question"
                className="border border-gray-300 p-3 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-1">Security Answer</label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="securityAnswer"
                placeholder="Your answer"
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
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
