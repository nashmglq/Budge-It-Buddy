import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const BalanceOverTimeChart = ({ incomeHistory = [], expensesList = [] }) => {
  const chartData = useMemo(() => {
    const incomeFormatted = incomeHistory.map((item, idx) => ({
      index: idx,
      ts: new Date(item.createdAt || item.ts).getTime(),
      date: new Date(item.createdAt || item.ts).toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      }),
      income: Number(item.amount),
      expenses: 0,
    }));

    const expensesFormatted = expensesList.map((item, idx) => ({
      index: incomeHistory.length + idx,
      ts: new Date(item.createdAt || item.ts).getTime(),
      date: new Date(item.createdAt || item.ts).toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      }),
      income: 0,
      expenses: Number(item.price),
    }));

    const combined = [...incomeFormatted, ...expensesFormatted].sort(
      (a, b) => a.ts - b.ts
    );

    let balance = 0;
    return combined.map((item) => {
      balance += item.income - item.expenses;
      return {
        index: item.index,
        date: item.date,
        balance,
        income: item.income,
        expenses: item.expenses,
      };
    });
  }, [incomeHistory, expensesList]);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      <h6 className="text-gray-700 font-semibold mb-2">Balance Over Time</h6>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="index" tickFormatter={(idx) => chartData[idx]?.date} />
          <YAxis />
          <Tooltip
            formatter={(value) => `₱ ${value.toLocaleString()}`}
            labelFormatter={(idx) => chartData[idx]?.date}
          />
          <Legend />
          {/* Balance (primary color) */}
          <Line
            type="monotone"
            dataKey="balance"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ r: 4 }}
            isAnimationActive={false}
          />
          {/* Income */}
          <Line
            type="monotone"
            dataKey="income"
            stroke="var(--color-income)"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
          {/* Expenses */}
          <Line
            type="monotone"
            dataKey="expenses"
            stroke="var(--color-expenses)"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceOverTimeChart;
