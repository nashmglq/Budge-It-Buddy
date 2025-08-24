import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { Wallet, ArrowDownCircle, ArrowUpCircle, MessageCircle } from "lucide-react";
import IncomeHistoryChart from "../components/charts/IncomeHistoryChart";
import ExpenseCategoryChart from "../components/charts/ExpenseCategoryChart";
import BalanceOverTimeChart from "../components/charts/BalanceOverTimeChart";
import { ChatBotModal } from "../components/modals/ChatBotModal";

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
  const [isChatOpen, setIsChatOpen] = useState(false);

  const token = localStorage.getItem("token");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <InfoCard icon={<Wallet />} label="Current Balance" value={balance} color="--color-balance" />
          <InfoCard icon={<ArrowUpCircle />} label="Total Income" value={income} color="--color-income" />
          <InfoCard icon={<ArrowDownCircle />} label="Total Expenses" value={expenses} color="--color-expenses" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <IncomeHistoryChart incomeHistory={incomeHistory} />
          <ExpenseCategoryChart expenses={expensesList} />
        </div>

        <div className="grid grid-cols-1 mt-10">
          <BalanceOverTimeChart incomeHistory={incomeHistory} expensesList={expensesList} />
        </div>
      </div>

      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
      >
        <MessageCircle size={24} />
      </button>

      <ChatBotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </DashboardLayout>
  );
};
