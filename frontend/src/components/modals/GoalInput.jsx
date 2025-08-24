import React, { useState } from "react";
import axios from "axios";

const baseURL = "http://localhost:5001";

export const GoalInput = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
  });

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${baseURL}/api/post-goal`, formData, config);
      onClose();
    } catch (err) {
      console.error("Error saving goal:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">Add Goal</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target Amount
            </label>
            <input
              type="number"
              name="targetAmount"
              value={formData.targetAmount}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Current Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Amount
            </label>
            <input
              type="number"
              name="currentAmount"
              value={formData.currentAmount}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
