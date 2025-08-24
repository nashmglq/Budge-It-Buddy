import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const ExpenseChart = ({ expenses }) => {
  // Format data: map each expense to { date, amount }
  const data = expenses
    .filter((expense) => expense.createdAt)
    .map((expense) => ({
      date: new Date(expense.createdAt).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
      }),
      amount: expense.price,
    }));

  const total = expenses.reduce((sum, expense) => sum + expense.price, 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-[#821131]">Expense Trend</h3>
        <h3 className="text-md font-semibold text-[#821131]">
          Total: <span className="text-[#FABC3F] font-bold">₱{total.toLocaleString()}</span>
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            tickFormatter={(value) => `₱${value.toLocaleString()}`}
            domain={[0, 'auto']}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#C7253E"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
