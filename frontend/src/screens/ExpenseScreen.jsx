import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';

axios.defaults.baseURL = 'http://localhost:5001';

export const ExpenseScreen = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ name: '', price: '' });
  const [editId, setEditId] = useState(null);
  const [total, setTotal] = useState(0);
  const token = localStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchExpenses = () => {
    axios
      .get('/api/get-expenses', config)
      .then((res) => {
        setExpenses(res.data.success);
        setTotal(res.data.totalExpenses);
      })
      .catch((err) => {
        console.error('Fetch error:', err.response?.data?.error || err.message);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    try {
      if (editId) {
        await axios.put(`/api/update-expenses/${editId}`, {
          name: form.name,
          price: parseInt(form.price),
        }, config);
      } else {
        await axios.post('/api/post-expenses', {
          name: form.name,
          price: parseInt(form.price),
        }, config);
      }

      setForm({ name: '', price: '' });
      setEditId(null);
      fetchExpenses();
    } catch (err) {
      console.error('Submit error:', err.response?.data?.error || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/delete-expenses/${id}`, config);
      fetchExpenses();
    } catch (err) {
      console.error('Delete error:', err.response?.data?.error || err.message);
    }
  };

  const handleEdit = (expense) => {
    setForm({ name: expense.name, price: expense.price });
    setEditId(expense.id);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8 bg-white min-h-screen">
        <h2 className="text-2xl font-bold text-[#821131] mb-6">Expenses</h2>

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="px-4 py-2 border rounded-md w-40 focus:outline-none focus:ring-2 focus:ring-[#FABC3F]"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="px-4 py-2 border rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-[#FABC3F]"
          />
          <button
            type="submit"
            className="bg-[#FABC3F] hover:bg-[#E85C0D] text-white font-semibold px-4 py-2 rounded-md"
          >
            {editId ? 'Update' : 'Add'} Expense
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => {
                setForm({ name: '', price: '' });
                setEditId(null);
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
        </form>

        <h3 className="text-lg font-semibold text-[#821131] mb-4">
          Total: <span className="text-[#FABC3F] font-bold">₱{total}</span>
        </h3>

        <ul className="space-y-3">
          {expenses.map((expense) => (
            <li
              key={expense.id}
              className="flex justify-between items-center bg-gray-50 border p-4 rounded-md shadow-sm"
            >
              <span className="text-gray-800 font-medium">
                {expense.name} - ₱{expense.price}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(expense)}
                  className="text-sm bg-[#FABC3F] hover:bg-[#E85C0D] text-white px-3 py-1 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="text-sm bg-[#C7253E] hover:bg-[#821131] text-white px-3 py-1 rounded-md"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </DashboardLayout>
  );
};
