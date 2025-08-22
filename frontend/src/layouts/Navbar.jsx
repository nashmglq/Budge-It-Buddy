import React, { useState } from "react";
import {
  Menu,
  LayoutDashboard,
  PiggyBank,
  HandCoins,
  ChartColumnIncreasing,
  ChevronLeft,
  ChevronRight,
  Wallet,
} from "lucide-react";

function Navbar({ collapsed, setCollapsed }) {
  const [isOpen, setIsOpen] = useState(false); // mobile toggle

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Income", icon: <PiggyBank size={20} /> },
    { name: "Expense", icon: <HandCoins size={20} /> },
    { name: "Insights", icon: <ChartColumnIncreasing size={20} /> },
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
          <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-200 dark:border-gray-700 relative">
            <Wallet className="text-primary" size={28} />
            {!collapsed && (
              <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Budge-it-Buddy
              </span>
            )}

            {/* 🔹 Burger Button (inside header when sidebar open) */}
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
                <a
                  href="#"
                  className="flex items-center p-2 text-gray-700 rounded-lg dark:text-gray-200 
                            hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <span className="text-primary">{item.icon}</span>
                  {!collapsed && <span className="ms-3">{item.name}</span>}
                </a>
              </li>
            ))}
          </ul>

          {/* 🔹 Collapse/Expand Button (Desktop Only, at bottom) */}
          <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-700 hidden sm:block">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center justify-center w-full p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>
      </aside>

      {/* 🔹 Burger Button (mobile, when sidebar closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="sm:hidden fixed top-4 left-4 z-50 p-2 text-gray-700 rounded-lg bg-white border shadow-md dark:bg-gray-800 dark:text-white"
        >
          <Menu size={24} />
        </button>
      )}
    </>
  );
}

export default Navbar;
