import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function IncomeChart({ incomeData }) {
  // Keep each entry separate (include time)
  const chartData = incomeData.map((item) => ({
    date: new Date(item.createdAt).toLocaleString("en-PH", {
      month: "short",
      day: "numeric",
    }),
    amount: item.amount,
  }));

  return (
    <div className="w-full h-80 bg-white shadow rounded-2xl p-5">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" interval={0} angle={-45} textAnchor="end" height={80} />
          <YAxis tickFormatter={(value) => `₱${value.toLocaleString()}`} />
          <Tooltip formatter={(value) => `₱${value.toLocaleString()}`} />
          <Line type="monotone" dataKey="amount" stroke="#006400" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
