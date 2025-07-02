import React, { useState } from "react";
import { EnhancedCombobox } from "./enhanced-combobox";
import { supabase } from "../lib/supabase";
import { useAddExpense, useUpdateExpense } from "../lib/queries";

interface ExpenseFormProps {
  onSubmit: () => void;
  isEditing?: boolean;
  initialData?: any;
}

const defaultCategories = [
  { value: "Groceries", label: "Groceries" },
  { value: "Rent", label: "Rent" },
  { value: "Utilities", label: "Utilities" },
  { value: "Dining", label: "Dining" },
  { value: "Transport", label: "Transport" },
  { value: "Health", label: "Health" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Other", label: "Other" },
];
const defaultAccounts = [
  { value: "Checking", label: "Checking" },
  { value: "Savings", label: "Savings" },
  { value: "Cash", label: "Cash" },
  { value: "Other", label: "Other" },
];
const paymentMethods = [
  { value: "Credit Card", label: "Credit Card" },
  { value: "Debit Card", label: "Debit Card" },
  { value: "Cash", label: "Cash" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "Other", label: "Other" },
];
const frequencies = ["Weekly", "Biweekly", "Monthly", "Quarterly", "Yearly"];

export function ExpenseForm({
  onSubmit,
  isEditing = false,
  initialData,
}: ExpenseFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categoryOptions, setCategoryOptions] = useState(defaultCategories);
  const [category, setCategory] = useState(defaultCategories[0].value);
  const [accountOptions, setAccountOptions] = useState(defaultAccounts);
  const [account, setAccount] = useState(defaultAccounts[0].value);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value);
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState(frequencies[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addExpenseMutation = useAddExpense();
  const updateExpenseMutation = useUpdateExpense();

  const handleAddCategory = (newCat: { name: string }) => {
    const newOption = { value: newCat.name, label: newCat.name };
    setCategoryOptions((prev) => [...prev, newOption]);
    setCategory(newCat.name);
  };
  const handleAddAccount = (newAcc: { name: string }) => {
    const newOption = { value: newAcc.name, label: newAcc.name };
    setAccountOptions((prev) => [...prev, newOption]);
    setAccount(newAcc.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expenseData = {
      name,
      amount: parseFloat(amount),
      date,
      category,
      account,
      payment_method: paymentMethod,
      recurring,
      frequency: recurring ? frequency : null,
      notes,
    };
    if (isEditing && initialData) {
      updateExpenseMutation.mutate(
        { ...expenseData, id: initialData.id },
        { onSuccess: onSubmit, onError: (err: any) => setError(err.message) }
      );
    } else {
      addExpenseMutation.mutate(expenseData, {
        onSuccess: onSubmit,
        onError: (err: any) => setError(err.message),
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="expense-name"
            className="block font-medium"
          >
            Name
          </label>
          <input
            id="expense-name"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="expense-amount"
            className="block font-medium"
          >
            Amount
          </label>
          <input
            id="expense-amount"
            type="number"
            className="w-full border rounded px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="expense-date"
            className="block font-medium"
          >
            Date
          </label>
          <input
            id="expense-date"
            type="date"
            className="w-full border rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="expense-category"
            className="block font-medium"
          >
            Category
          </label>
          <EnhancedCombobox
            options={categoryOptions}
            value={category}
            onValueChange={setCategory}
            onAddCard={({ name }) => handleAddCategory({ name })}
            placeholder="Select or add category..."
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="expense-account"
            className="block font-medium"
          >
            Account
          </label>
          <EnhancedCombobox
            options={accountOptions}
            value={account}
            onValueChange={setAccount}
            onAddCard={({ name }) => handleAddAccount({ name })}
            placeholder="Select or add account..."
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="expense-payment-method"
            className="block font-medium"
          >
            Payment Method
          </label>
          <select
            id="expense-payment-method"
            className="w-full border rounded px-3 py-2"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            {paymentMethods.map((pm) => (
              <option
                key={pm.value}
                value={pm.value}
              >
                {pm.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="expense-recurring"
            type="checkbox"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
          />
          <label
            htmlFor="expense-recurring"
            className="font-medium"
          >
            Recurring?
          </label>
        </div>
        {recurring && (
          <div className="space-y-2">
            <label
              htmlFor="expense-frequency"
              className="block font-medium"
            >
              Frequency
            </label>
            <select
              id="expense-frequency"
              className="w-full border rounded px-3 py-2"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            >
              {frequencies.map((freq) => (
                <option
                  key={freq}
                  value={freq}
                >
                  {freq}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="expense-notes"
          className="block font-medium"
        >
          Notes
        </label>
        <textarea
          id="expense-notes"
          className="w-full border rounded px-3 py-2"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 font-medium"
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
}
