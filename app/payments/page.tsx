"use client";
import { useState } from "react";
import { PaymentEdit } from "../components/payment-edit";
import {
  usePayments,
  useUpdatePayment,
  useDeletePayment,
  useUserSettings,
  useUser,
} from "../lib/queries";
import { UndoSnackbar } from "../components/undo-snackbar";
import { LoadingScreen } from "../components/loading-screen";
import type { UndoAction, UserSettings, Payment } from "../types/payment";

export default function PaymentsPage() {
  const [undoAction, setUndoAction] = useState<UndoAction | null>(null);
  const { data: user, isLoading: userLoading } = useUser();
  const { data: payments = [], isLoading: paymentsLoading } = usePayments();
  const { data: userSettings } = useUserSettings();
  const updatePaymentMutation = useUpdatePayment();
  const deletePaymentMutation = useDeletePayment();

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

  const updatePayment = async (updatedPayment: Payment) => {
    try {
      await updatePaymentMutation.mutateAsync(updatedPayment);
      setUndoAction({
        id: Date.now().toString(),
        type: "edit",
        message: `Payment plan "${updatedPayment.name}" updated successfully`,
        data: { updatedPayment },
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error updating payment:", error);
    }
  };

  const deletePayment = async (id: string) => {
    const deletedPayment = payments.find((p) => p.id === id);
    try {
      await deletePaymentMutation.mutateAsync(id);
      if (deletedPayment) {
        setUndoAction({
          id: Date.now().toString(),
          type: "delete",
          message: `Payment plan "${deletedPayment.name}" deleted successfully`,
          data: { deletedPayment },
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PaymentEdit
        payments={payments}
        userSettings={currentUserSettings}
        onUpdate={updatePayment}
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
