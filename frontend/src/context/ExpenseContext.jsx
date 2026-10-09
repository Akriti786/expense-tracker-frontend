import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import {
  createExpense as createExpenseApi,
  deleteExpense as deleteExpenseApi,
  getExpenses,
  updateExpense as updateExpenseApi,
} from "../services/expenseService.js";

const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    if (!user) {
      setExpenses([]);
      return;
    }

    try {
      setLoading(true);
      const data = await getExpenses();
      setExpenses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  const addExpense = async (expenseData) => {
    const created = await createExpenseApi(expenseData);
    setExpenses((current) => [created, ...current]);
  };

  const updateExpense = async (id, expenseData) => {
    const updated = await updateExpenseApi(id, expenseData);

    setExpenses((current) =>
      current.map((expense) =>
        expense._id === id ? updated : expense
      )
    );
  };

  const deleteExpense = async (id) => {
    await deleteExpenseApi(id);

    setExpenses((current) =>
      current.filter((expense) => expense._id !== id)
    );
  };

  const income = expenses
    .filter((expense) => expense.type === "income")
    .reduce((total, expense) => total + Number(expense.amount), 0);

  const spending = expenses
    .filter((expense) => expense.type === "expense")
    .reduce((total, expense) => total + Number(expense.amount), 0);

  const balance = income - spending;

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        income,
        spending,
        balance,
        addExpense,
        updateExpense,
        deleteExpense,
        fetchExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => useContext(ExpenseContext);
