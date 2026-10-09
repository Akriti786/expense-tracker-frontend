import { useMemo, useState } from "react";
import { useExpenses } from "../context/ExpenseContext.jsx";

const ExpenseList = ({ onEdit }) => {
  const { expenses, loading, deleteExpense } = useExpenses();

  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesType =
        typeFilter === "all" || expense.type === typeFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        expense.category === categoryFilter;

      return matchesType && matchesCategory;
    });
  }, [expenses, typeFilter, categoryFilter]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    try {
      await deleteExpense(id);
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section className="card expense-list">
      <div className="list-header">
        <div>
          <h2>Transactions</h2>
          <p>{filteredExpenses.length} transaction(s)</p>
        </div>

        <div className="filters">
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="all">All Categories</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Health</option>
            <option>Education</option>
            <option>Salary</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="center-message">Loading transactions...</div>
      ) : filteredExpenses.length === 0 ? (
        <div className="empty-state">
          No transactions found. Add your first one!
        </div>
      ) : (
        <div className="transaction-list">
          {filteredExpenses.map((expense) => (
            <article className="transaction" key={expense._id}>
              <div className="transaction-main">
                <div>
                  <h3>{expense.title}</h3>
                  <p>
                    {expense.category} ·{" "}
                    {new Date(expense.date).toLocaleDateString()}
                  </p>

                  {expense.description && (
                    <small>{expense.description}</small>
                  )}
                </div>

                <strong className={expense.type}>
                  {expense.type === "income" ? "+" : "-"}₹
                  {Number(expense.amount).toLocaleString("en-IN", {
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </div>

              <div className="transaction-actions">
                <button
                  className="small-button"
                  onClick={() => onEdit(expense)}
                >
                  Edit
                </button>

                <button
                  className="small-button danger"
                  onClick={() => handleDelete(expense._id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default ExpenseList;
