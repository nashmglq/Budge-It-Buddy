import React from "react";
import DashboardLayout from "../layouts/DashboardLayout";

export const DashboardScreen = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Grid with 2 columns (1 on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl shadow-md bg-blue-500 text-white">
            <h2 className="text-lg font-semibold">Card 1</h2>
            <p className="mt-2">This is the first card.</p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl shadow-md bg-green-500 text-white">
            <h2 className="text-lg font-semibold">Card 2</h2>
            <p className="mt-2">This is the second card.</p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl shadow-md bg-yellow-500 text-gray-900">
            <h2 className="text-lg font-semibold">Card 3</h2>
            <p className="mt-2">This is the third card.</p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl shadow-md bg-red-500 text-white">
            <h2 className="text-lg font-semibold">Card 4</h2>
            <p className="mt-2">This is the fourth card.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
