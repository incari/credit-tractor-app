"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Home as HomeFill,
  Car as CarFill,
  Bolt as BoltFill,
  ShoppingCart as ShoppingCartFill,
  PiggyBank as PiggyBankFill,
  Film as FilmFill,
  Heart as HeartFill,
  Shield as ShieldFill,
} from "lucide-react";
import { IncomeForm } from "../components/income-form";
import { ExpenseForm } from "../components/expense-form";
import {
  useUserSettings,
  useIncomes,
  useUpdateIncome,
  useDeleteIncome,
  useExpenses,
  useUpdateExpense,
  useDeleteExpense,
  useExpenseCategories,
} from "../lib/queries";
import { formatCurrency } from "../utils/currencies";
import { UndoSnackbar } from "../components/undo-snackbar";
import type {
  UndoAction,
  Income,
  Expense,
  ExpenseCategory,
} from "../types/payment";
import { translations } from "../utils/translations";

const iconMap: Record<string, React.ElementType> = {
  home: HomeFill,
  car: CarFill,
  bolt: BoltFill,
  "shopping-cart": ShoppingCartFill,
  "piggy-bank": PiggyBankFill,
  film: FilmFill,
  heart: HeartFill,
  shield: ShieldFill,
  // add more as needed
};

export default function FinancesPage() {
  const [tab, setTab] = useState("incomes");
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [undoAction, setUndoAction] = useState<UndoAction | null>(null);

  const { data: userSettings } = useUserSettings();
  const { data: incomes, isLoading: incomesLoading } = useIncomes();
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: categories = [] } = useExpenseCategories();
  const updateIncomeMutation = useUpdateIncome();
  const deleteIncomeMutation = useDeleteIncome();
  const updateExpenseMutation = useUpdateExpense();
  const deleteExpenseMutation = useDeleteExpense();

  const lang = (userSettings?.language || "EN") as keyof typeof translations;
  const t = translations[lang];

  const handleEditIncome = (income: Income) => {
    setEditingIncome(income);
    setShowIncomeForm(true);
  };

  const handleDeleteIncome = async (id: string) => {
    const deletedIncome = incomes?.find((i) => i.id === id);
    try {
      await deleteIncomeMutation.mutateAsync(id);
      if (deletedIncome) {
        setUndoAction({
          id: Date.now().toString(),
          type: "delete",
          message: `Income "${deletedIncome.name}" deleted successfully`,
          data: { deletedIncome },
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleDeleteExpense = async (id: string) => {
    const deletedExpense = expenses?.find((e) => e.id === id);
    try {
      await deleteExpenseMutation.mutateAsync(id);
      if (deletedExpense) {
        setUndoAction({
          id: Date.now().toString(),
          type: "delete",
          message: `Expense "${deletedExpense.name}" deleted successfully`,
          data: { deletedExpense },
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleIncomeSubmit = () => {
    setShowIncomeForm(false);
    setEditingIncome(null);
  };

  const handleExpenseSubmit = () => {
    setShowExpenseForm(false);
    setEditingExpense(null);
  };

  const getCategoryInfo = (categoryId: string | null | undefined) => {
    if (!categoryId) return null;
    return categories.find((cat: ExpenseCategory) => cat.id === categoryId);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t.finances ?? "Finances"}</h1>
      </div>

      {!showIncomeForm && !showExpenseForm && (
        <>
          <div className="bg-white rounded-2xl p-2 flex w-full mb-2 shadow">
            <button
              className={`flex-1 font-semibold py-2.5 rounded-xl transition-all duration-150 ${
                tab === "incomes"
                  ? "bg-green-500 text-white shadow font-bold"
                  : "text-gray-500 bg-transparent hover:bg-gray-100"
              }`}
              onClick={() => setTab("incomes")}
            >
              {t.incomes ?? "Incomes"}
            </button>
            <button
              className={`flex-1 font-semibold py-2.5 rounded-xl transition-all duration-150 ${
                tab === "expenses"
                  ? "bg-green-500 text-white shadow font-bold"
                  : "text-gray-500 bg-transparent hover:bg-gray-100"
              }`}
              onClick={() => setTab("expenses")}
            >
              {t.expenses ?? "Expenses"}
            </button>
          </div>
          <div className="flex justify-end mb-4">
            {tab === "incomes" && (
              <Button
                onClick={() => setShowIncomeForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                {t.addIncome ?? "Add income"}
              </Button>
            )}
            {tab === "expenses" && (
              <Button
                onClick={() => setShowExpenseForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                {t.addExpense ?? "Add expense"}
              </Button>
            )}
          </div>
        </>
      )}

      {showIncomeForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIncome
                ? t.editIncome ?? "Edit Income"
                : t.addIncome ?? "Add income"}
            </CardTitle>
            <CardDescription>
              {editingIncome
                ? t.updateIncomeDesc ?? "Update the income details"
                : t.addIncomeDesc ?? "Add a new income source"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <IncomeForm
              t={t}
              onSubmit={handleIncomeSubmit}
              isEditing={!!editingIncome}
              initialData={editingIncome}
            />
            <Button
              variant="outline"
              onClick={() => {
                setShowIncomeForm(false);
                setEditingIncome(null);
              }}
              className="w-full"
            >
              {t.cancelEdit ?? "Cancel"}
            </Button>
          </CardContent>
        </Card>
      )}
      {showExpenseForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingExpense
                ? t.editExpense ?? "Edit Expense"
                : t.addExpense ?? "Add expense"}
            </CardTitle>
            <CardDescription>
              {editingExpense
                ? t.updateExpenseDesc ?? "Update the expense details"
                : t.addExpenseDesc ?? "Add a new expense"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ExpenseForm
              t={t}
              onSubmit={handleExpenseSubmit}
              isEditing={!!editingExpense}
              initialData={editingExpense}
            />
            <Button
              variant="outline"
              onClick={() => {
                setShowExpenseForm(false);
                setEditingExpense(null);
              }}
              className="w-full"
            >
              {t.cancelEdit ?? "Cancel"}
            </Button>
          </CardContent>
        </Card>
      )}

      {!showIncomeForm &&
        !showExpenseForm &&
        (tab === "incomes" ? (
          <Card>
            <CardHeader>
              <CardTitle>{t.incomes ?? "Incomes"}</CardTitle>
              <CardDescription>
                {t.manageIncomes ?? "Manage your income sources"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {incomesLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading incomes...
                </div>
              ) : incomes && incomes.length > 0 ? (
                <div className="space-y-3">
                  {incomes.map((income) => (
                    <div
                      key={income.id}
                      className="border rounded-lg p-4 hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <h3 className="font-medium text-lg">{income.name}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div>
                              <span className="font-medium">
                                {t.amount ?? "Amount"}:
                              </span>{" "}
                              {formatCurrency(income.amount, income.currency)}
                            </div>
                            <div>
                              <span className="font-medium">
                                {t.paymentDate ?? "Payment Date"}:
                              </span>{" "}
                              {new Date(income.start_date).toLocaleDateString()}
                            </div>
                            {income.is_recurring && (
                              <div>
                                <span className="font-medium">
                                  {t.frequency ?? "Frequency"}:
                                </span>{" "}
                                {t[
                                  income.recurrence_interval?.toLowerCase() ??
                                    ""
                                ] ?? income.recurrence_interval}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditIncome(income)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteIncome(income.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {t.noIncomes ??
                    "No incomes found. Add your first income to get started."}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t.expenses ?? "Expenses"}</CardTitle>
              <CardDescription>
                {t.manageExpenses ?? "Manage your expenses"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {expensesLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading expenses...
                </div>
              ) : expenses && expenses.length > 0 ? (
                <div className="space-y-3">
                  {expenses.map((expense) => {
                    const category = expense.category;
                    return (
                      <div
                        key={expense.id}
                        className="border rounded-lg p-4 hover:bg-muted/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-lg">
                                {expense.name}
                              </h3>
                              {category && (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted">
                                  {category.icon && iconMap[category.icon] && (
                                    <span
                                      style={{
                                        color: category.color || "#3B82F6",
                                      }}
                                    >
                                      {React.createElement(
                                        iconMap[category.icon],
                                        { size: 18 }
                                      )}
                                    </span>
                                  )}
                                  {category.icon && !iconMap[category.icon] && (
                                    <span
                                      style={{
                                        color: category.color || "#3B82F6",
                                      }}
                                    >
                                      {category.icon}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">
                                  {t.amount ?? "Amount"}:
                                </span>{" "}
                                {formatCurrency(
                                  expense.amount,
                                  expense.currency
                                )}
                              </div>
                              <div>
                                <span className="font-medium">
                                  {t.paymentDate ?? "Payment Date"}:
                                </span>{" "}
                                {new Date(
                                  expense.start_date
                                ).toLocaleDateString()}
                              </div>
                              {expense.is_recurring && (
                                <div>
                                  <span className="font-medium">
                                    {t.frequency ?? "Frequency"}:
                                  </span>{" "}
                                  {t[
                                    (expense.recurrence_interval?.toLowerCase() ??
                                      "") as keyof typeof t
                                  ] ?? expense.recurrence_interval}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditExpense(expense)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteExpense(expense.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No expenses found. Add your first expense to get started.
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      <UndoSnackbar
        action={undoAction}
        onUndo={() => setUndoAction(null)}
        onDismiss={() => setUndoAction(null)}
      />
    </div>
  );
}
