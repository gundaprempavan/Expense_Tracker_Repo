// src/pages/RecoverPassword.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { recoverPassword } from "../../redux/userSlice";
import { HiUser, HiLockClosed, HiInformationCircle } from "react-icons/hi"; // Import relevant icons
import { useNavigate } from "react-router-dom";

const RecoverPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    securityAnswer: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(recoverPassword(formData)).unwrap();
      setMessage(response.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      // Optionally redirect to login or another page after successful recovery
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: 'url("path/to/your/background-image.jpg")' }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
          Recover Password
        </h2>
        {message && (
          <p className="text-green-500 mb-4 text-center">{message}</p>
        )}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <HiUser className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="border border-gray-300 p-3 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 relative">
            <HiInformationCircle className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="securityAnswer"
              placeholder="Security Answer"
              className="border border-gray-300 p-3 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4 relative">
            <HiLockClosed className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="border border-gray-300 p-3 pl-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 w-full rounded hover:bg-blue-600 transition duration-200"
          >
            Recover Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecoverPassword;
