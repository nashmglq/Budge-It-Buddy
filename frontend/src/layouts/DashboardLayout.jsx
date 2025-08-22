import React, { useState } from "react";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar always visible */}
      <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main content */}
      <div
        className={`p-6 transition-all duration-300 
          ${collapsed ? "sm:ml-[5rem]" : "sm:ml-64"}`}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
