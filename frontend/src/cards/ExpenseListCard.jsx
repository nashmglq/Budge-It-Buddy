import React from 'react';
import { FaTrashAlt, FaArrowDown } from 'react-icons/fa';

const ExpenseListCard = ({ expenses, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h3 className="text-lg sm:text-xl font-semibold text-[#821131] mb-4">Expense History</h3>
      <ul className="space-y-4">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 border p-4 rounded-xl shadow-sm gap-3"
          >
            {/* Left: Name and Date */}
            <div className="flex flex-col">
              <p className="text-gray-800 font-medium text-base sm:text-lg">{expense.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(expense.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3">
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
