import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import ExpenseChart from '../components/charts/ExpenseChart';
import ExpenseCard from '../cards/ExpenseCard';
import ExpenseModal from '../components/modals/ExpenseModal';
import ExpenseCategoryGraph from '../components/charts/ExpenseCategoryGraph';
import ExpenseListCard from '../cards/ExpenseListCard';
axios.defaults.baseURL = 'http://localhost:5001';

export const ExpenseScreen = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ name: '', price: '' });
  const [editId, setEditId] = useState(null);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
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
      setShowModal(false);
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
    setShowModal(true);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8 bg-white min-h-screen">
        <h2 className="text-2xl font-bold text-[#821131] mb-6">Expenses</h2>

        <div className="mb-10">
          <ExpenseChart expenses={expenses} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <ExpenseCard onOpen={() => setShowModal(true)} />
          <ExpenseCategoryGraph expenses={expenses} />
        </div>

      <ExpenseListCard
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

        {showModal && (
          <ExpenseModal
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            onClose={() => {
              setForm({ name: '', price: '' });
              setEditId(null);
              setShowModal(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};
