"use client";
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
import { Plus, Edit, Trash2 } from "lucide-react";
import { IncomeForm } from "../components/income-form";
import { ExpenseForm } from "../components/expense-form";
import {
  useUserSettings,
  useIncomes,
  useUpdateIncome,
  useDeleteIncome,
} from "../lib/queries";
import { formatCurrency } from "../utils/currencies";
import { UndoSnackbar } from "../components/undo-snackbar";
import type { UndoAction, Income } from "../types/payment";

export default function FinancesPage() {
  const [tab, setTab] = useState("incomes");
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [undoAction, setUndoAction] = useState<UndoAction | null>(null);

  const { data: userSettings } = useUserSettings();
  const { data: incomes, isLoading: incomesLoading } = useIncomes();
  const updateIncomeMutation = useUpdateIncome();
  const deleteIncomeMutation = useDeleteIncome();

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

  const handleIncomeSubmit = () => {
    setShowIncomeForm(false);
    setEditingIncome(null);
  };

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
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIncome ? "Edit Income" : "Add Income"}
            </CardTitle>
            <CardDescription>
              {editingIncome
                ? "Update the income details"
                : "Add a new income source"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <IncomeForm
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
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}
      {showExpenseForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
            <CardDescription>Add a new expense</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ExpenseForm onSubmit={() => setShowExpenseForm(false)} />
            <Button
              variant="outline"
              onClick={() => setShowExpenseForm(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}
      {!showIncomeForm && !showExpenseForm && (
        <>
          <div className="flex justify-end mb-4">
            {tab === "incomes" ? (
              <Button
                onClick={() => setShowIncomeForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add income
              </Button>
            ) : (
              <Button
                onClick={() => setShowExpenseForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add expense
              </Button>
            )}
          </div>
          {tab === "incomes" ? (
            <Card>
              <CardHeader>
                <CardTitle>Incomes</CardTitle>
                <CardDescription>Manage your income sources</CardDescription>
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
                            <h3 className="font-medium text-lg">
                              {income.name}
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <div>
                                <span className="font-medium">Amount:</span>{" "}
                                {formatCurrency(income.amount, income.currency)}
                              </div>
                              <div>
                                <span className="font-medium">
                                  Payment Date:
                                </span>{" "}
                                {new Date(
                                  income.start_date
                                ).toLocaleDateString()}
                              </div>
                              {income.is_recurring && (
                                <div>
                                  <span className="font-medium">
                                    Frequency:
                                  </span>{" "}
                                  {income.recurrence_interval}
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
                    No incomes found. Add your first income to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
                <CardDescription>Manage your expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>
                    List and manage your regular and one-time expenses here.
                  </p>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-1">
                      Expense Categories
                    </h3>
                    <p>
                      Manage categories (icon, color, name) and add custom ones.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <UndoSnackbar
            action={undoAction}
            onUndo={() => setUndoAction(null)}
            onDismiss={() => setUndoAction(null)}
          />
        </>
      )}
    </div>
  );
}
