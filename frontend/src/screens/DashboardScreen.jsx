import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { Wallet, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import IncomeHistoryChart from "../components/charts/IncomeHistoryChart";
import ExpenseCategoryChart from "../components/charts/ExpenseCategoryChart";
import BalanceOverTimeChart from "../components/charts/BalanceOverTimeChart";

axios.defaults.baseURL = "http://localhost:5001";

const InfoCard = ({ icon, label, value, color }) => {
  const backgroundColor = color.startsWith("--") ? `var(${color})` : color;
  return (
    <div
      className="flex gap-6 p-6 rounded-2xl shadow-md shadow-gray-200 border border-gray-100 transition duration-500 hover:scale-105"
      style={{ backgroundColor: "#fff9f2" }}
    >
      <div
        className="w-14 h-14 flex items-center justify-center text-[26px] text-white rounded-xl drop-shadow-md hover:scale-110 transition duration-500"
        style={{ backgroundColor }}
      >
        {icon}
      </div>
      <div>
        <h6 className="text-gray-700 text-sm">{label}</h6>
        <span className="font-semibold text-gray-900 tracking-widest text-lg">
          ₱ {value.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export const DashboardScreen = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [expensesList, setExpensesList] = useState([]);
  const [incomeHistory, setIncomeHistory] = useState([]);
  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    // Fetch income
    axios
      .get("/api/get-income", config)
      .then((res) => {
        setIncome(res.data.totalIncome || 0);
        if (res.data.success) {
          const formatted = res.data.success.map((item, idx) => {
            const d = new Date(item.createdAt);
            return {
              index: idx,
              ts: d.getTime(),
              date: d.toLocaleDateString("default", {
                month: "short",
                day: "numeric",
              }),
              amount: Number(item.amount),
            };
          });
          setIncomeHistory(formatted);
        }
      })
      .catch((err) => console.error("Income fetch error:", err));

    // Fetch expenses
    axios
      .get("/api/get-expenses", config)
      .then((res) => {
        setExpenses(res.data.totalExpenses || 0);
        setExpensesList(res.data.success || []);
      })
      .catch((err) => console.error("Expenses fetch error:", err));
  }, []);

  const balance = income - expenses;


  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Top 3 Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <InfoCard
            icon={<Wallet />}
            label="Current Balance"
            value={balance}
            color="--color-balance"
          />
          <InfoCard
            icon={<ArrowUpCircle />}
            label="Total Income"
            value={income}
            color="--color-income"
          />
          <InfoCard
            icon={<ArrowDownCircle />}
            label="Total Expenses"
            value={expenses}
            color="--color-expenses"
          />
        </div>

        {/* Bottom 2 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Income History */}
          <IncomeHistoryChart incomeHistory={incomeHistory} />

          {/* Expense Category */}
          <ExpenseCategoryChart expenses={expensesList} />
        </div>

        {/* Income vs Expense */}
        <div className="grid grid-cols-1 mt-10">
        <BalanceOverTimeChart
          incomeHistory={incomeHistory}
          expensesList={expensesList}
        />
        </div>
      </div>
    </DashboardLayout>
  );
};
