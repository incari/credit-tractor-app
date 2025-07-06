import React, { useState } from "react";
import { EnhancedCombobox } from "./enhanced-combobox";
import { supabase } from "../lib/supabase";
import { useAddIncome, useUpdateIncome, useUserSettings } from "../lib/queries";
import { CurrencySelector } from "./currency-selector";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

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

// Helper function to get the last day of the current month
const getLastDayOfCurrentMonth = () => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.toISOString().split("T")[0];
};

export function IncomeForm({
  onSubmit,
  isEditing = false,
  initialData,
}: IncomeFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
  const [paymentDate, setPaymentDate] = useState(
    isEditing && initialData?.start_date ? initialData.start_date : ""
  );
  const [currency, setCurrency] = useState(initialData?.currency || "EUR");
  const [isRecurring, setIsRecurring] = useState(
    initialData?.is_recurring || false
  );
  const [recurrenceInterval, setRecurrenceInterval] = useState(
    initialData?.recurrence_interval || "Monthly"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addIncomeMutation = useAddIncome();
  const updateIncomeMutation = useUpdateIncome();
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

    const incomeData = {
      name,
      amount: parseFloat(amount),
      currency,
      is_recurring: isRecurring,
      recurrence_interval: isRecurring ? recurrenceInterval : null,
      start_date: paymentDate,
      end_date: null, // Always null since we removed end date
    };

    try {
      if (isEditing && initialData) {
        await updateIncomeMutation.mutateAsync({
          ...incomeData,
          id: initialData.id,
        });
      } else {
        await addIncomeMutation.mutateAsync(incomeData);
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
            step="0.01"
            className="w-full border rounded px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="income-currency"
            className="block font-medium"
          >
            Currency
          </label>
          <CurrencySelector
            value={currency}
            onValueChange={setCurrency}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="income-payment-date"
            className="block font-medium"
          >
            Payment Date
          </label>
          <input
            id="income-payment-date"
            type="date"
            className="w-full border rounded px-3 py-2"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="income-recurring"
            checked={isRecurring}
            onCheckedChange={setIsRecurring}
          />
          <label
            htmlFor="income-recurring"
            className="font-medium"
          >
            Recurring
          </label>
        </div>
        {isRecurring && (
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
              value={recurrenceInterval}
              onChange={(e) => setRecurrenceInterval(e.target.value)}
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
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading
          ? isEditing
            ? "Updating..."
            : "Adding..."
          : isEditing
          ? "Update Income"
          : "Add Income"}
      </Button>
    </form>
  );
}
