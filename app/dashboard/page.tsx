"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PaymentDashboard } from "../components/payment-dashboard";
import {
  usePayments,
  useUpdatePayment,
  useUserSettings,
  useUser,
} from "../lib/queries";
import { UndoSnackbar } from "../components/undo-snackbar";
import { LoadingScreen } from "../components/loading-screen";
import type { UndoAction, UserSettings } from "../types/payment";

export default function DashboardPage() {
  const [undoAction, setUndoAction] = useState<UndoAction | null>(null);
  const { data: user, isLoading: userLoading } = useUser();
  const { data: payments = [], isLoading: paymentsLoading } = usePayments();
  const { data: userSettings } = useUserSettings();
  const updatePaymentMutation = useUpdatePayment();
  const router = useRouter();

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

  // Redirect to home if not authenticated
  if (!user) {
    if (typeof window !== "undefined") {
      router.replace("/");
    }
    return <LoadingScreen message="Redirecting..." />;
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

  const updateSettings = async (newSettings: UserSettings) => {
    // This can be implemented if needed for dashboard
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PaymentDashboard
        payments={payments}
        userSettings={currentUserSettings}
        onMarkAsPaid={markPaymentAsPaid}
        onMarkAsUnpaid={markPaymentAsUnpaid}
        onUpdateSettings={updateSettings}
      />
      <UndoSnackbar
        action={undoAction}
        onUndo={() => setUndoAction(null)}
        onDismiss={() => setUndoAction(null)}
      />
    </div>
  );
}
