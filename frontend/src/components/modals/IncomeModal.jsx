import { useState } from "react";

export default function IncomeModal({ handleSubmit, form, setForm, editId, setEditId }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);

  const closeModal = () => {
    setIsOpen(false);
    setForm({ name: "", amount: "" });
    setEditId(null);
  };

  return (
    <div>
      {/* Button that opens modal */}
      <button
        onClick={openModal}
        className="bg-green-500 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md"
      >
        {editId ? "Edit Income" : "Add Income"}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Income" : "Add Income"}
            </h2>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
                setIsOpen(false); // close after submit
              }}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md"
                >
                  {editId ? "Update" : "Add"} Income
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
