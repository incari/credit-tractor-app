import React, { useState } from "react";
import { EnhancedCombobox } from "./enhanced-combobox";
import { supabase } from "../lib/supabase";
import { useAddIncome, useUpdateIncome } from "../lib/queries";

interface IncomeFormProps {
  onSubmit: () => void;
  isEditing?: boolean;
  initialData?: any;
}

const defaultCategories = [
  { value: "Salary", label: "Salary" },
  { value: "Bonus", label: "Bonus" },
  { value: "Investment", label: "Investment" },
  { value: "Gift", label: "Gift" },
  { value: "Refund", label: "Refund" },
  { value: "Other", label: "Other" },
];
const defaultAccounts = [
  { value: "Checking", label: "Checking" },
  { value: "Savings", label: "Savings" },
  { value: "Cash", label: "Cash" },
  { value: "Other", label: "Other" },
];
const frequencies = ["Weekly", "Biweekly", "Monthly", "Quarterly", "Yearly"];

export function IncomeForm({
  onSubmit,
  isEditing = false,
  initialData,
}: IncomeFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categoryOptions, setCategoryOptions] = useState(defaultCategories);
  const [category, setCategory] = useState(defaultCategories[0].value);
  const [accountOptions, setAccountOptions] = useState(defaultAccounts);
  const [account, setAccount] = useState(defaultAccounts[0].value);
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState(frequencies[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addIncomeMutation = useAddIncome();
  const updateIncomeMutation = useUpdateIncome();

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
    const incomeData = {
      name,
      amount: parseFloat(amount),
      date,
      category,
      account,
      recurring,
      frequency: recurring ? frequency : null,
      notes,
    };
    if (isEditing && initialData) {
      updateIncomeMutation.mutate(
        { ...incomeData, id: initialData.id },
        { onSuccess: onSubmit, onError: (err: any) => setError(err.message) }
      );
    } else {
      addIncomeMutation.mutate(incomeData, {
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
            htmlFor="income-name"
            className="block font-medium"
          >
            Name
          </label>
          <input
            id="income-name"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="income-amount"
            className="block font-medium"
          >
            Amount
          </label>
          <input
            id="income-amount"
            type="number"
            className="w-full border rounded px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="income-date"
            className="block font-medium"
          >
            Date
          </label>
          <input
            id="income-date"
            type="date"
            className="w-full border rounded px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="income-category"
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
            htmlFor="income-account"
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
        <div className="flex items-center space-x-2">
          <input
            id="income-recurring"
            type="checkbox"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
          />
          <label
            htmlFor="income-recurring"
            className="font-medium"
          >
            Recurring?
          </label>
        </div>
        {recurring && (
          <div className="space-y-2">
            <label
              htmlFor="income-frequency"
              className="block font-medium"
            >
              Frequency
            </label>
            <select
              id="income-frequency"
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
          htmlFor="income-notes"
          className="block font-medium"
        >
          Notes
        </label>
        <textarea
          id="income-notes"
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
        {loading ? "Adding..." : "Add Income"}
      </button>
    </form>
  );
}
