import { useState } from "react";

export default function IncomeEditModal({ income, handleUpdate, onClose }) {
  const [form, setForm] = useState({
    name: income.name,
    amount: income.amount,
  });

  const submitHandler = (e) => {
    e.preventDefault();
    handleUpdate({ ...income, ...form, amount: Number(form.amount) });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Income</h3>

        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg p-2"
            placeholder="Income Name"
          />
          <input
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full border rounded-lg p-2"
            placeholder="Amount"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
