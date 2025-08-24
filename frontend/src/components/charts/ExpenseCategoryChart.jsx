import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const COLORS = ["#FABC3F", "#E85C0D", "#C7253E", "#821131", "#90bcc7", "#444"];

export default function ExpenseCategoryChart({ expenses = [] }) {
  const navigate = useNavigate();
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  // Group & sum by category
  const categoryMap = safeExpenses.reduce((acc, item) => {
    const key = item.name || "Unknown";
    acc[key] = (acc[key] || 0) + Number(item.price || 0);
    return acc;
  }, {});

  // Sort by value
  let sorted = Object.entries(categoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Top 5 + Misc
  let chartData = sorted.slice(0, 5);
  const others = sorted.slice(5);
  if (others.length) {
    const miscValue = others.reduce((sum, item) => sum + item.value, 0);
    chartData.push({ name: "Miscellaneous", value: miscValue });
  }

  return (
    <div className="p-6 rounded-2xl shadow-md border border-gray-200 bg-gray-50">
      {/* Title and button row */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Expense Categories</h2>
        <button
          onClick={() => navigate("/expense")}
          className="px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-all duration-300 transform hover:scale-105"
          style={{
            background: "var(--color-secondary)",
            transitionProperty: "background, transform",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--color-expenses)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--color-secondary)")
          }
        >
          Go to Expense
        </button>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
            >
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `₱${v.toLocaleString()}`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-sm">No expenses data yet.</p>
      )}
    </div>
  );
}
