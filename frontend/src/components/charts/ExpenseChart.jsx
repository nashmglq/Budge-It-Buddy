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
  const data = expenses
    .filter((expense) => expense.createdAt && typeof expense.price === 'number')
    .map((expense, idx) => {
      const d = new Date(expense.createdAt);
      return {
        index: idx,
        ts: d.getTime(),
        amount: expense.price,
      };
    });

  const total = expenses.reduce((sum, expense) => sum + (expense.price || 0), 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-[#821131]">Expense Trend</h3>
        <h3 className="text-md font-semibold text-[#821131]">
          Total: <span className="text-[#FABC3F] font-bold">₱{total.toLocaleString()}</span>
        </h3>
      </div>

      {/* Scrollable container for mobile */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="index"
                type="category"
                tickFormatter={(i) =>
                  data[i]
                    ? new Date(data[i].ts).toLocaleDateString('en-PH', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : ''
                }
                interval={0}
              />
              <YAxis
                tickFormatter={(value) => `₱${value.toLocaleString()}`}
                domain={[0, 'auto']}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                labelFormatter={(_, payload) => {
                  if (payload && payload.length) {
                    const ts = payload[0].payload.ts;
                    return new Date(ts).toLocaleString('en-PH', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                  }
                  return '';
                }}
                formatter={(value) => `₱${value.toLocaleString()}`}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#C7253E"
                strokeWidth={3}
                dot
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseChart;
