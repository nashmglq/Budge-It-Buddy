import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function IncomeHistoryChart({ incomeHistory }) {
  // --- Custom Tooltip (rely on x-axis index) ---
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload; // full data point
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border text-sm">
        <p className="font-semibold text-gray-800">{item.date}</p>
        <p className="text-gray-600">₱ {item.amount.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

  return (
    <div
      className="p-6 rounded-2xl shadow-md border border-gray-200"
      style={{ backgroundColor: "#f5f6f8" }}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Income History
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={incomeHistory} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="index"
              tickFormatter={(idx) => incomeHistory[idx]?.date || ""}
            />
          <YAxis />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
          <Bar dataKey="amount" fill="#FABC3F" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
