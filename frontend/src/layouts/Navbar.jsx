import React, { useState, useContext } from "react";
import {
  Menu,
  LayoutDashboard,
  PiggyBank,
  HandCoins,
  ChartColumnIncreasing,
  ChevronLeft,
  ChevronRight,
  Wallet,
  LogOut,
  UserRound
} from "lucide-react";
import { UserContext } from "../context/UserContext";
import { useNavigate, NavLink } from "react-router-dom";
import LogoutModal from "../components/modals/LogoutModal";

function Navbar({ collapsed, setCollapsed }) {
  const [isOpen, setIsOpen] = useState(false); // mobile toggle
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => setIsLogoutModalOpen(true);

  const confirmLogout = () => {
    logoutUser();
    setIsLogoutModalOpen(false);
    navigate("/"); // redirect to login
  };

  const cancelLogout = () => setIsLogoutModalOpen(false);

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/home" },
    { name: "Income", icon: <PiggyBank size={20} />, path: "/income" },
    { name: "Expense", icon: <HandCoins size={20} />, path: "/expense" },
    { name: "Insights", icon: <ChartColumnIncreasing size={20} />, path: "/insight" },
    { name: "Profile", icon: <UserRound size={20} />, path: "/profile" }
    
  ];

  return (
    <>
      {/* 🔹 Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          sm:translate-x-0 
          bg-white border-r border-gray-200 
          dark:bg-gray-800 dark:border-gray-700
          ${collapsed ? "w-20" : "w-64"}`}
        aria-label="Sidebar"
      >
        <div className="h-full flex flex-col overflow-y-auto bg-white dark:bg-gray-800 relative">
          {/* 🔹 Header / Logo */}
          <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-200 dark:border-gray-700 relative mb-5">
            <Wallet className="text-primary" size={28} />
            {!collapsed && (
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Budge-it-Buddy
              </span>
            )}

            {isOpen && (
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden absolute top-1/2 -translate-y-1/2 right-7 -mr-2 p-2 bg-white border rounded-lg shadow-md dark:bg-gray-800 dark:text-white"
              >
                <Menu size={24} />
              </button>
            )}
          </div>

          {/* 🔹 Menu Items */}
          <ul className="px-3 pb-4 space-y-2 font-medium">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded-lg group ${
                      isActive
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  <span className="text-primary">{item.icon}</span>
                  {!collapsed && <span className="ms-3">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* 🔹 Collapse & Logout Buttons */}
          <div className="mt-auto px-3 pb-4 space-y-2">
            {/* Collapse Button */}
            <div className="hidden sm:block">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="flex items-center justify-center w-full p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className="flex items-center justify-center w-full p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut size={20} className="me-2" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* 🔹 Burger Button (mobile) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="sm:hidden fixed top-4 left-4 z-50 p-2 text-gray-700 rounded-lg bg-white border shadow-md dark:bg-gray-800 dark:text-white"
        >
          <Menu size={24} />
        </button>
      )}

      {/* 🔹 Full-Screen Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </>
  );
}

export default Navbar;
