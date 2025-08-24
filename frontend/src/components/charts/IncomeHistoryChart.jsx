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
import { useNavigate } from "react-router-dom";

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

 const navigate = useNavigate();

  return (
    <div
  className="p-6 rounded-2xl shadow-md border border-gray-200"
  style={{ backgroundColor: "#f5f6f8" }}
>
  {/* Title and button row */}
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-gray-800">Income History</h2>
    <button
      onClick={() => navigate("/income")}
      className="px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
      style={{
        background: "var(--color-secondary)",
        transitionProperty: "background, transform",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--color-income)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "var(--color-secondary)")
      }
    >
      Go to Income
    </button>
  </div>

  {/* Chart */}
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={incomeHistory} barCategoryGap="20%">
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="index"
        tickFormatter={(idx) => incomeHistory[idx]?.date || ""}
      />
      <YAxis />
      <Tooltip
        content={<CustomTooltip />}
        cursor={{ fill: "rgba(0,0,0,0.05)" }}
      />
      <Bar dataKey="amount" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
</div>

  );
}
