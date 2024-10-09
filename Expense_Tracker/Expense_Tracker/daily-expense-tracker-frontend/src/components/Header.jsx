// src/components/Header.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/userSlice"; // Adjust the import based on your actual path
import { useNavigate } from "react-router-dom";
import { HiOutlineUser, HiOutlineLogin, HiOutlineLogout } from "react-icons/hi"; // Importing icons

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated); // Adjust based on your state structure

  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.removeItem("token");
    navigate("/login"); // Navigate to login page after logout
  };

  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="flex-grow text-center text-3xl font-bold">Daily Expense Tracker</h1>
        <nav>
          <ul className="flex space-x-6">
            {isAuthenticated ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center hover:text-blue-400 transition duration-200"
                >
                  <HiOutlineLogout className="mr-1" /> Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center hover:text-blue-400 transition duration-200"
                  >
                    <HiOutlineLogin className="mr-1" /> Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/register")}
                    className="flex items-center hover:text-blue-400 transition duration-200"
                  >
                    <HiOutlineUser className="mr-1" /> Register
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
