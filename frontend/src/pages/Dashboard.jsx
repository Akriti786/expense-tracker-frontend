import { useState } from "react";
import ExpenseForm from "../components/ExpenseForm.jsx";
import ExpenseList from "../components/ExpenseList.jsx";
import { useExpenses } from "../context/ExpenseContext.jsx";

const formatMoney = (value) =>
  `₹${Number(value).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const Dashboard = () => {
  const { income, spending, balance, expenses } = useExpenses();
  const [editingExpense, setEditingExpense] = useState(null);

  return (
    <div className="dashboard">
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">
            Track your income and expenses in one place.
          </p>
        </div>
      </div>

      <section className="summary-grid">
        <div className="summary-card">
          <span>Total Balance</span>
          <strong>{formatMoney(balance)}</strong>
        </div>

        <div className="summary-card">
          <span>Total Income</span>
          <strong className="income">{formatMoney(income)}</strong>
        </div>

        <div className="summary-card">
          <span>Total Spending</span>
          <strong className="expense">{formatMoney(spending)}</strong>
        </div>

        <div className="summary-card">
          <span>Transactions</span>
          <strong>{expenses.length}</strong>
        </div>
      </section>

      <section className="dashboard-grid">
        <ExpenseForm
          editingExpense={editingExpense}
          onDone={() => setEditingExpense(null)}
        />

        <ExpenseList onEdit={setEditingExpense} />
      </section>
    </div>
  );
};

export default Dashboard;
