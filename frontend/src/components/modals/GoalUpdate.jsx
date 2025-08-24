import React, { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "http://localhost:5001/api";

export default function UpdateGoalModal({ goal, isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setTargetAmount(goal.targetAmount);
      setCurrentAmount(goal.currentAmount);
    }
  }, [goal]);

  const handleSubmit = async () => {
    try {
      await axios.put(
        `${baseUrl}/update-goal/${goal.id}`,
        {
          title,
          targetAmount: parseInt(targetAmount),
          currentAmount: parseInt(currentAmount),
        },
        config
      );
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-2xl w-96 shadow-lg border border-green-500">
        <h2 className="text-xl font-bold text-green-600 mb-4">Update Goal</h2>

        <input
          type="text"
          placeholder="Title"
          className="w-full mb-3 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Target Amount"
          className="w-full mb-3 p-2 border rounded"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />

        <input
          type="number"
          placeholder="Current Amount"
          className="w-full mb-3 p-2 border rounded"
          value={currentAmount}
          onChange={(e) => setCurrentAmount(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
