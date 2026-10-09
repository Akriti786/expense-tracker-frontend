import { useEffect, useState } from "react";
import { useExpenses } from "../context/ExpenseContext.jsx";

const initialForm = {
  title: "",
  amount: "",
  category: "Food",
  type: "expense",
  date: new Date().toISOString().slice(0, 10),
  description: "",
};

const ExpenseForm = ({ editingExpense, onDone }) => {
  const { addExpense, updateExpense } = useExpenses();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        type: editingExpense.type,
        date: editingExpense.date
          ? new Date(editingExpense.date).toISOString().slice(0, 10)
          : initialForm.date,
        description: editingExpense.description || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [editingExpense]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.amount) {
      setError("Title and amount are required");
      return;
    }

    try {
      setSaving(true);

      if (editingExpense) {
        await updateExpense(editingExpense._id, form);
      } else {
        await addExpense(form);
      }

      setForm(initialForm);
      onDone?.();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card expense-form" onSubmit={handleSubmit}>
      <div className="card-title-row">
        <h2>{editingExpense ? "Edit Transaction" : "Add Transaction"}</h2>

        {editingExpense && (
          <button
            type="button"
            className="text-button"
            onClick={() => onDone?.()}
          >
            Cancel
          </button>
        )}
      </div>

      {error && <div className="error-box">{error}</div>}

      <label>
        Title
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Grocery"
        />
      </label>

      <label>
        Amount
        <input
          name="amount"
          type="number"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          placeholder="0"
        />
      </label>

      <div className="form-grid">
        <label>
          Type
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>

        <label>
          Category
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Health</option>
            <option>Education</option>
            <option>Salary</option>
            <option>Other</option>
          </select>
        </label>
      </div>

      <label>
        Date
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional description"
          rows="3"
        />
      </label>

      <button className="primary-button" disabled={saving}>
        {saving
          ? "Saving..."
          : editingExpense
          ? "Update Transaction"
          : "Add Transaction"}
      </button>
    </form>
  );
};

export default ExpenseForm;
