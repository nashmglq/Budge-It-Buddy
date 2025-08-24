import React from 'react';
import { FaTrashAlt, FaArrowDown } from 'react-icons/fa';

const ExpenseListCard = ({ expenses, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-[#821131] mb-4">Expense History</h3>
      <ul className="space-y-4">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="flex justify-between items-center bg-gray-50 border p-4 rounded-xl shadow-sm"
          >
            {/* Left: Name and Date */}
            <div>
              <p className="text-gray-800 font-medium">{expense.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(expense.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Right: Delete + Amount + Edit */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onDelete(expense.id)}
                className="text-gray-500 hover:text-[#C7253E] transition"
                aria-label={`Delete ${expense.name}`}
              >
                <FaTrashAlt size={18} />
              </button>

              <div className="flex items-center bg-red-50 text-[#C7253E] font-semibold px-3 py-1 rounded-full text-sm gap-2">
                <span>- ₱{expense.price.toLocaleString()}</span>
                <FaArrowDown size={14} />
              </div>

              <button
                onClick={() => onEdit(expense)}
                className="text-sm bg-[#FABC3F] hover:bg-[#E85C0D] text-white px-3 py-1 rounded-md"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseListCard;
