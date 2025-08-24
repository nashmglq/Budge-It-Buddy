import IncomeModal from "../components/modals/IncomeModal";

export default function IncomeCard({ handleSubmit, form, setForm, editId, setEditId }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full h-72 flex flex-col">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Add Income</h3>
      <p className="text-sm text-gray-500 mb-4">
        Log your income details by clicking the button below.
      </p>

      <IncomeModal
        handleSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        editId={editId}
        setEditId={setEditId}
      />
    </div>
  );
}
