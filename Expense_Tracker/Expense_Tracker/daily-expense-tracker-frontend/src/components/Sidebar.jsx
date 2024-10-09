import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineCreditCard,
  HiOutlineTag,
  HiOutlineCalendar,
  HiOutlineDocumentReport,
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineTrendingUp
} from "react-icons/hi";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // State to toggle sidebar

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`${ 
        isCollapsed ? "w-20" : "w-72"
      } bg-gradient-to-b from-indigo-700 to-purple-700 text-white flex flex-col shadow-lg h-screen sticky top-0 transition-all duration-300`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="p-4 text-white focus:outline-none self-end"
      >
        {isCollapsed ? <HiOutlineChevronDoubleRight size={24} /> : <HiOutlineChevronDoubleLeft size={24} />}
      </button>

      {/* Sidebar Header */}
      <div className={`${isCollapsed ? "hidden" : "p-4 bg-indigo-800 text-center"}`}>
        <h2 className="text-3xl font-bold tracking-wide mb-4">Dashboard</h2>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-grow mt-2 space-y-1">
        <NavItem to="/dashboard" icon={<HiOutlineHome />} label="Home" isCollapsed={isCollapsed} />
        <NavItem to="/add-budget" icon={<HiOutlineCreditCard />} label="Add Budget" isCollapsed={isCollapsed} />
        <NavItem to="/monthly-budget" icon={<HiOutlineCalendar />} label="Monthly Budget" isCollapsed={isCollapsed} />
        <NavItem to="/categories" icon={<HiOutlineTag />} label="Categories" isCollapsed={isCollapsed} />
        <NavItem to="/charts" icon={<HiOutlineChartBar />} label="Charts" isCollapsed={isCollapsed} />
        <NavItem to="/reports" icon={<HiOutlineDocumentReport />} label="Reports" isCollapsed={isCollapsed} />
        <NavItem to="/expense-prediction" icon={<HiOutlineTrendingUp />} label="Expense Prediction" isCollapsed={isCollapsed} />

      </nav>
    </div>
  );
};

const NavItem = ({ to, icon, label, isCollapsed }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-4 rounded-lg transition-all duration-300 group ${
        isActive ? "bg-white text-indigo-600 shadow-lg" : "hover:bg-indigo-600 hover:text-indigo-200"
      }`
    }
  >
    <span className="text-2xl">{icon}</span>
    {/* Conditionally render the label based on collapsed state */}
    {!isCollapsed && (
      <span className="ml-4 text-lg group-hover:translate-x-1 transition-transform duration-200">
        {label}
      </span>
    )}
  </NavLink>
);

export default Sidebar;
