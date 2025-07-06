import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import {
  useAddExpense,
  useUpdateExpense,
  useUserSettings,
} from "../lib/queries";
import { CurrencySelector } from "./currency-selector";
import { CategorySelector } from "./category-selector";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ExpenseFormProps {
  onSubmit: () => void;
  isEditing?: boolean;
  initialData?: any;
  t: any;
}

const frequencies = ["Weekly", "Biweekly", "Monthly", "Quarterly", "Yearly"];

// Helper function to get the last day of the current month
const getLastDayOfCurrentMonth = () => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.toISOString().split("T")[0];
};

export function ExpenseForm({
  onSubmit,
  isEditing = false,
  initialData,
  t,
}: ExpenseFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
  const [paymentDate, setPaymentDate] = useState(
    isEditing && initialData?.start_date ? initialData.start_date : ""
  );
  const [currency, setCurrency] = useState(initialData?.currency || "EUR");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [isRecurring, setIsRecurring] = useState(
    initialData?.is_recurring || false
  );
  const [recurrenceInterval, setRecurrenceInterval] = useState(
    initialData?.recurrence_interval || "Monthly"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addExpenseMutation = useAddExpense();
  const updateExpenseMutation = useUpdateExpense();
  const { data: userSettings } = useUserSettings();

  // Set default currency from user settings only if not editing
  React.useEffect(() => {
    if (!isEditing && userSettings?.currency) {
      setCurrency(userSettings.currency);
    }
  }, [userSettings, isEditing]);

  // Set default payment date on client side to prevent hydration issues
  React.useEffect(() => {
    if (!isEditing && !initialData?.start_date && !paymentDate) {
      setPaymentDate(getLastDayOfCurrentMonth());
    }
  }, [isEditing, initialData, paymentDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const expenseData = {
      name,
      amount: parseFloat(amount),
      currency,
      category_id: categoryId || null,
      is_recurring: isRecurring,
      recurrence_interval: isRecurring ? recurrenceInterval : null,
      start_date: paymentDate,
      end_date: null, // Always null since we don't use end date
    };

    try {
      if (isEditing && initialData) {
        await updateExpenseMutation.mutateAsync({
          ...expenseData,
          id: initialData.id,
        });
      } else {
        await addExpenseMutation.mutateAsync(expenseData);
      }
      onSubmit();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            {t.name ?? "Name"}
          </label>
          <input
            id="expense-name"
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder={t.name ?? "Name"}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="expense-amount"
            className="block font-medium"
          >
            {t.amount ?? "Amount"}
          </label>
          <input
            id="expense-amount"
            type="number"
            step="0.01"
            className="w-full border rounded px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder={t.amount ?? "Amount"}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="expense-currency"
            className="block font-medium"
          >
            {t.currency ?? "Currency"}
          </label>
          <CurrencySelector
            value={currency}
            onValueChange={setCurrency}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="expense-category"
            className="block font-medium"
          >
            {t.category ?? "Category"}
          </label>
          <CategorySelector
            value={categoryId}
            onValueChange={setCategoryId}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="expense-payment-date"
            className="block font-medium"
          >
            {t.paymentDate ?? "Payment Date"}
          </label>
          <input
            id="expense-payment-date"
            type="date"
            className="w-full border rounded px-3 py-2"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
            placeholder={t.paymentDate ?? "Payment Date"}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="expense-recurring"
            checked={isRecurring}
            onCheckedChange={setIsRecurring}
          />
          <label
            htmlFor="expense-recurring"
            className="font-medium"
          >
            {t.recurring ?? "Recurring"}
          </label>
        </div>
        {isRecurring && (
          <div className="space-y-2">
            <label
              htmlFor="expense-frequency"
              className="block font-medium"
            >
              {t.frequency ?? "Frequency"}
            </label>
            <select
              id="expense-frequency"
              className="w-full border rounded px-3 py-2"
              value={recurrenceInterval}
              onChange={(e) => setRecurrenceInterval(e.target.value)}
            >
              {frequencies.map((freq) => (
                <option
                  key={freq}
                  value={freq}
                >
                  {t[freq.toLowerCase()] ?? freq}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? t.saving ?? "Saving..."
          : isEditing
          ? t.updateExpense ?? "Update Expense"
          : t.addExpense ?? "Add Expense"}
      </Button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </form>
  );
}
