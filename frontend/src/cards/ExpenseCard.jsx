import React from 'react';

const ExpenseCard = ({ onOpen }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold text-[#821131] mb-4">ADD EXPENSE</h3>
        <p className="text-sm text-gray-500 mb-4">Log your expense details by clicking the button below.</p>
      <button
        onClick={onOpen}
        className="bg-[#FABC3F] hover:bg-[#E85C0D] text-white font-semibold px-6 py-3 rounded-md"
      >
        + Add Expense
      </button>
    </div>
  );
};

export default ExpenseCard;
