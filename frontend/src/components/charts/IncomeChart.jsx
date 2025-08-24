import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function IncomeChart({ incomeData }) {
  // Use a numeric timestamp for precise hover targeting; format labels for display
  const chartData = incomeData.map((item, idx) => {
    const d = new Date(item.createdAt);
    return {
      index: idx,           // sequential spacing
      ts: d.getTime(),      // real timestamp
      amount: Number(item.amount),
    };
  });

  return (
    <div className="w-full h-80 bg-white shadow rounded-2xl p-5">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="index"
            type="category"
            tickFormatter={(i) =>
              chartData[i]
                ? new Date(chartData[i].ts).toLocaleString("en-PH", {
                    month: "short",
                    day: "numeric",
                  })
                : ""
            }
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis
            tickFormatter={(v) =>
              typeof v === "number" ? `₱${v.toLocaleString()}` : v
            }
          />
          <Tooltip
            // Read ts from payload to format the REAL date/time
            labelFormatter={(_, payload) => {
              if (payload && payload.length) {
                const ts = payload[0].payload.ts;
                return new Date(ts).toLocaleString("en-PH", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
              }
              return "";
            }}
            formatter={(v) =>
              typeof v === "number" ? `₱${v.toLocaleString()}` : v
            }
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#006400"
            strokeWidth={3}
            dot
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
