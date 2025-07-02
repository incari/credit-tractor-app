"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { Plus } from "lucide-react";
import { IncomeForm } from "../components/income-form";
import { ExpenseForm } from "../components/expense-form";
import { useUserSettings } from "../lib/queries";

export default function FinancesPage() {
  const [tab, setTab] = useState("incomes");
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const { data: userSettings } = useUserSettings();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Finances</h1>
      <Tabs
        value={tab}
        onValueChange={setTab}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="incomes">Incomes</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>
      </Tabs>
      {showIncomeForm && (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow p-6">
            <IncomeForm onSubmit={() => setShowIncomeForm(false)} />
            <button
              className="mt-4 text-sm text-gray-500 underline"
              onClick={() => setShowIncomeForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {showExpenseForm && (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow p-6">
            <ExpenseForm onSubmit={() => setShowExpenseForm(false)} />
            <button
              className="mt-4 text-sm text-gray-500 underline"
              onClick={() => setShowExpenseForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {!showIncomeForm && !showExpenseForm && (
        <>
          <div className="flex justify-end mb-4">
            {tab === "incomes" ? (
              <button
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg shadow px-4 py-2 flex items-center gap-2 font-medium"
                aria-label="Add Income"
                onClick={() => setShowIncomeForm(true)}
              >
                <Plus className="h-5 w-5" />
                Add income
              </button>
            ) : (
              <button
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg shadow px-4 py-2 flex items-center gap-2 font-medium"
                aria-label="Add Expense"
                onClick={() => setShowExpenseForm(true)}
              >
                <Plus className="h-5 w-5" />
                Add expense
              </button>
            )}
          </div>
          {tab === "incomes" ? (
            <div className="py-4">
              {/* Incomes section placeholder */}
              <h2 className="text-xl font-semibold mb-2">Incomes</h2>
              <p>List and manage your regular and one-time incomes here.</p>
            </div>
          ) : (
            <div className="py-4">
              {/* Expenses section placeholder */}
              <h2 className="text-xl font-semibold mb-2">Expenses</h2>
              <p>List and manage your regular and one-time expenses here.</p>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-1">
                  Expense Categories
                </h3>
                <p>
                  Manage categories (icon, color, name) and add custom ones.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
