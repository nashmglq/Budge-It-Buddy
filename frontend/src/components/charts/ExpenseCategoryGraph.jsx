import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const ExpenseCategoryGraph = ({ expenses }) => {
  const data = expenses.map((expense) => ({
    name: expense.name,
    amount: expense.price,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-[#821131] mb-4">Expense Category</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(value) => `₱${value}`}
            interval={0}
            domain={[0, 'auto']}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
          <Bar dataKey="amount" fill="#E85C0D" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseCategoryGraph;
