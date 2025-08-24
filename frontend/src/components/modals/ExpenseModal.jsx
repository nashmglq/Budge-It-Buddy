import React from 'react';

const ExpenseModal = ({ form, setForm, onSubmit, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h3 className="text-xl font-bold text-[#821131] mb-4">Add or Edit Expense</h3>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FABC3F]"
          />
          <input
            type="number"
            placeholder="Amount"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FABC3F]"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#FABC3F] hover:bg-[#E85C0D] text-white px-4 py-2 rounded-md"
            >
              Submit Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
