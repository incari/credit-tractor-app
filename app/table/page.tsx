"use client";
import { useState } from "react";
import { PaymentTable } from "../components/payment-table";
import {
  usePayments,
  useUpdatePayment,
  useUserSettings,
  useUser,
} from "../lib/queries";
import { UndoSnackbar } from "../components/undo-snackbar";
import { LoadingScreen } from "../components/loading-screen";
import type { UndoAction, UserSettings } from "../types/payment";

export default function TablePage() {
  const [undoAction, setUndoAction] = useState<UndoAction | null>(null);
  const { data: user, isLoading: userLoading } = useUser();
  const { data: payments = [], isLoading: paymentsLoading } = usePayments();
  const { data: userSettings } = useUserSettings();
  const updatePaymentMutation = useUpdatePayment();

  const currentUserSettings: UserSettings = {
    language: userSettings?.language || "EN",
    currency: userSettings?.currency || "EUR",
    creditCards: userSettings?.creditCards ?? [],
    lastUsedCard: userSettings?.lastUsedCard || undefined,
    monthsToShow: userSettings?.monthsToShow || 12,
  };

  if (userLoading || paymentsLoading) {
    return (
      <LoadingScreen
        message="Loading your data..."
        subMessage="Loading payments..."
      />
    );
  }

  const markPaymentAsPaid = async (
    paymentId: string,
    installmentIndex: number
  ) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;
    const newPaidInstallments = [...(payment.paidInstallments || [])];
    if (!newPaidInstallments.includes(installmentIndex)) {
      newPaidInstallments.push(installmentIndex);
    }
    try {
      await updatePaymentMutation.mutateAsync({
        ...payment,
        paidInstallments: newPaidInstallments,
      });
      setUndoAction({
        id: Date.now().toString(),
        type: "markPaid",
        message: "Payment marked as paid",
        data: { paymentId, installmentIndex },
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error marking payment as paid:", error);
    }
  };

  const markPaymentAsUnpaid = async (
    paymentId: string,
    installmentIndex: number
  ) => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) return;
    const newPaidInstallments = (payment.paidInstallments || []).filter(
      (index) => index !== installmentIndex
    );
    try {
      await updatePaymentMutation.mutateAsync({
        ...payment,
        paidInstallments: newPaidInstallments,
      });
      setUndoAction({
        id: Date.now().toString(),
        type: "markUnpaid",
        message: "Payment marked as unpaid",
        data: { paymentId, installmentIndex },
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error marking payment as unpaid:", error);
    }
  };

  const deletePayment = async (id: string) => {
    // Table page may not need delete, but you can implement if needed
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PaymentTable
        payments={payments}
        userSettings={currentUserSettings}
        onDelete={deletePayment}
        onMarkAsPaid={markPaymentAsPaid}
        onMarkAsUnpaid={markPaymentAsUnpaid}
      />
      <UndoSnackbar
        action={undoAction}
        onUndo={() => setUndoAction(null)}
        onDismiss={() => setUndoAction(null)}
      />
    </div>
  );
}
