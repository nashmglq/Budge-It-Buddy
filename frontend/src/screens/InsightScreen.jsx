import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { GoalInput } from "../components/modals/GoalInput";
import UpdateGoalModal from "../components/modals/GoalUpdate";
import ReactMarkdown from "react-markdown";
import { ChatBotModal } from "../components/modals/ChatBotModal"; 
import { MessageCircle } from "lucide-react"; 


const baseURL = "http://localhost:5001";

export const InsightScreen = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [data, setData] = useState([]);
  const [goals, setGoals] = useState([]);
  const [insights, setInsights] = useState("");
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/get-expenses`, config);
        if (response.data && Array.isArray(response.data.success)) {
          setData(response.data.success.sort((a, b) => b.price - a.price));
        }
      } catch {
        setData([]);
      }
    };
    fetchExpenses();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/get-goal`, config);
      if (response.data && Array.isArray(response.data.success)) {
        setGoals(response.data.success);
      }
    } catch {
      setGoals([]);
    }
  };

  const fetchInsights = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/chatbot/insights`,
        config
      );
      if (response.data && typeof response.data === "string")
        setInsights(response.data);
      else if (response.data && response.data.success)
        setInsights(response.data.success);
    } catch {
      setInsights("No insights available.");
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/delete-goal/${id}`, config);
      fetchGoals();
    } catch {}
  };

  useEffect(() => {
    fetchGoals();
    fetchInsights();
  }, [isGoalModalOpen, isUpdateModalOpen]);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 p-2">
        <div className="bg-white shadow rounded-2xl p-3 h-80 overflow-hidden">
          <h2 className="text-lg font-semibold mb-2">Spending Alerts</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart layout="vertical" data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Bar dataKey="price" fill="#821131" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-2xl p-3 h-80 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Top Spending</h2>
          <ul className="space-y-2">
            {data.map((item, idx) => (
              <li
                key={item.id}
                className="flex justify-between items-center p-2 border-b last:border-none"
              >
                <span className="font-medium truncate">
                  {idx + 1}. {item.name}
                </span>
                <span className="text-red-600 font-semibold">
                  ₱{item.price.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white shadow rounded-2xl p-3 h-80 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Insights & Tips</h2>
          <div className="text-gray-700 whitespace-pre-line">
            <ReactMarkdown>{insights}</ReactMarkdown>
          </div>
        </div>

        <div className="bg-white shadow rounded-2xl p-3 h-80 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Saving Goals</h2>
            <button
              onClick={() => setIsGoalModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              + Add Goal
            </button>
          </div>
          <ul className="space-y-4 max-h-64 overflow-y-auto">
            {goals.map((goal) => {
              const progress = Math.min(
                (goal.currentAmount / goal.targetAmount) * 100,
                100
              );
              return (
                <li key={goal.id} className="p-2 border rounded-lg break-words">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium truncate">{goal.title}</span>
                    <span className="text-sm font-semibold text-gray-600">
                      {goal.currentAmount.toLocaleString()} /{" "}
                      {goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-5 rounded-full transition-all duration-700 ease-in-out"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: "#821131",
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2 flex-wrap">
                    <button
                      onClick={() => {
                        setSelectedGoal(goal);
                        setIsUpdateModalOpen(true);
                      }}
                      className="px-3 py-1 text-sm rounded text-white transition"
                      style={{ backgroundColor: "#821131" }}
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="px-3 py-1 text-sm rounded text-white transition"
                      style={{ backgroundColor: "#821131" }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <GoalInput
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />
      <UpdateGoalModal
        goal={selectedGoal}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={fetchGoals}
      />

            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
            >
              <MessageCircle size={24} />
            </button>
      
            {/* ChatBot Modal */}
            <ChatBotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </DashboardLayout>
  );
};