import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import IncomeChart from '../components/charts/IncomeChart';
import IncomeCard from '../cards/IncomeCard';
import IncomeListCard from '../cards/IncomeListCard';
axios.defaults.baseURL = 'http://localhost:5001';

export const IncomeScreen = () => {
  const [incomes, setIncomes] = useState([]);
  const [form, setForm] = useState({ name: '', amount: '' });
  const [editId, setEditId] = useState(null);
  const [total, setTotal] = useState(0);
  const token = localStorage.getItem('token');


  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // --- Fetch Incomes ---
  const fetchIncomes = () => {
    axios
      .get('/api/get-income', config)
      .then((res) => {
        setIncomes(res.data.success); // backend returns { success: income }
        setTotal(res.data.totalIncome); // backend returns totalIncome
      })
      .catch((err) => {
        console.error('Fetch error:', err.response?.data?.error || err.message);
      });
  };

  // --- Submit Income (Add / Update) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.amount) return;

    try {
      if (editId) {
        await axios.put(
          `/api/update-income/${editId}`,
          {
            name: form.name,
            amount: parseInt(form.amount),
          },
          config
        );
      } else {
        await axios.post(
          '/api/post-income',
          {
            name: form.name,
            amount: parseInt(form.amount),
          },
          config
        );
      }

      setForm({ name: '', amount: '' });
      setEditId(null);
      fetchIncomes();
    } catch (err) {
      console.error('Submit error:', err.response?.data?.error || err.message);
    }
  };

  // --- Delete Income ---
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/delete-income/${id}`, config);
      fetchIncomes();
    } catch (err) {
      console.error('Delete error:', err.response?.data?.error || err.message);
    }
  };

  // --- Edit Income ---
  const handleEdit = (income) => {
    setForm({ name: income.name, amount: income.amount });
    setEditId(income.id);
  };

  const handleUpdate = (updatedIncome) => {
    setIncomes((prev) =>
      prev.map((income) =>
        income.id === updatedIncome.id ? updatedIncome : income
      )
    );
  };


  useEffect(() => {
    fetchIncomes();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8 bg-white min-h-screen">
        <h2 className="text-2xl font-bold text-[#006400] mb-6">Income</h2>
        <div className='grid: grid-cols-1 mb-10'>
          <IncomeChart incomeData={incomes} />
        </div>
        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Income Form Card */}
          <div className="w-full">
            <IncomeCard
              handleSubmit={handleSubmit}
              form={form}
              setForm={setForm}
              editId={editId}
              setEditId={setEditId}
            />
          </div>

          {/* Income List Card */}
          <div className="w-full">
            <IncomeListCard
              incomes={incomes}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
            />
          </div>
        </div>

        {/* Total */}
         <div className="grid grid-cols-1 gap-4 w-full mt-10">
      <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
        <h3 className="text-lg font-semibold text-[#006400] mb-2">
          Total
        </h3>
        <span className="text-2xl font-bold text-green-600">
          ₱{total.toLocaleString()}
        </span>
      </div>
    </div>

        {/* Income List */}
        
      </div>
    </DashboardLayout>
  );
};
