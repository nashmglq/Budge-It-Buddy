import { useState } from "react";
import { ArrowUpCircle } from "lucide-react";
import axios from "axios";

// --- Edit Modal ---
function EditIncomeModal({ income, onClose, onSave }) {
  const [name, setName] = useState(income?.name || "");
  const [amount, setAmount] = useState(income?.amount || 0);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5001/api/update-income/${income.id}`,
        { name, amount: parseInt(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        onSave({ ...income, name, amount });
        onClose();
      }
    } catch (err) {
      console.error("Error updating income:", err);
      alert("Failed to update income ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Income</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md p-2"
            placeholder="Name"
            required
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border rounded-md p-2"
            placeholder="Amount"
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 rounded-md border text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Income List Card ---
export default function IncomeListCard({ incomes, handleDelete, handleUpdate }) {
  const [editingIncome, setEditingIncome] = useState(null);

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 w-full h-72 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Income History</h3>

      <ul className="space-y-3 overflow-y-auto flex-1">
        {incomes.length === 0 ? (
          <p className="text-gray-500 text-sm">No income records yet.</p>
        ) : (
          [...incomes]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
            .map((income) => (
              <li
                key={income.id}
                className="flex flex-col sm:flex-row sm:items-center bg-gray-50 border p-3 rounded-md shadow-sm gap-2 sm:gap-4"
              >
                {/* Left: Icon + Name */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full">
                  {/* Left: Name + Date */}
                  <div className="flex items-center gap-2 min-w-0">
                    <ArrowUpCircle className="text-green-500 w-5 h-5 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-gray-800 font-medium truncate">
                        {income.name} - ₱{income.amount.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-xs opacity-70">
                        {new Date(income.createdAt).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex gap-2 mt-2 sm:mt-0 sm:flex-row flex-wrap sm:justify-end">
                    <button
                      onClick={() => setEditingIncome(income)}
                      className="text-sm bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(income.id)}
                      className="text-sm bg-[#C7253E] hover:bg-[#821131] text-white px-3 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))
        )}
      </ul>

      {/* Edit Modal */}
      {editingIncome && (
        <EditIncomeModal
          income={editingIncome}
          onClose={() => setEditingIncome(null)}
          onSave={handleUpdate}
        />
      )}
    </div>
  );
}
