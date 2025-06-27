"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, LogOut, CreditCard } from "lucide-react";
import { PaymentForm } from "./components/payment-form";
import { PaymentDashboard } from "./components/payment-dashboard";
import { PaymentTable } from "./components/payment-table";
import { PaymentEdit } from "./components/payment-edit";
import { Settings } from "./components/settings";
import { LandingPage } from "./components/landing-page";
import type { Payment, UserSettings, UndoAction } from "./types/payment";
import { translations } from "./utils/translations";
import { Footer } from "./components/footer";
import { PWAInstall } from "./components/pwa-install";
import { UndoSnackbar } from "./components/undo-snackbar";
import { supabase } from "./lib/supabase";
import {
  usePayments,
  useAddPayment,
  useUpdatePayment,
  useDeletePayment,
  useCreditCards,
  useAddCreditCard,
  useUserSettings,
  useUpdateUserSettings,
  useUser,
} from "./lib/queries";

export default function CreditTractor() {
  const [undoAction, setUndoAction] = useState<UndoAction | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const router = useRouter();

  // React Query hooks
  const { data: user } = useUser();
  const { data: payments = [], isLoading: paymentsLoading } = usePayments();
  const { data: creditCards = [] } = useCreditCards();
  const { data: userSettings } = useUserSettings();
  const addPaymentMutation = useAddPayment();
  const updatePaymentMutation = useUpdatePayment();
  const deletePaymentMutation = useDeletePayment();
  const addCreditCardMutation = useAddCreditCard();
  const updateUserSettingsMutation = useUpdateUserSettings();

  const currentUserSettings: UserSettings = {
    language: userSettings?.language || "EN",
    currency: userSettings?.currency || "EUR",
    creditCards: creditCards,
    lastUsedCard: userSettings?.lastUsedCard || undefined,
    monthsToShow: userSettings?.monthsToShow || 12,
  };

  // Show landing page if user is not authenticated
  if (!user) {
    return <LandingPage onGetStarted={() => router.push("/login")} />;
  }

  // Show main app for authenticated users
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const addPayment = async (payment: Omit<Payment, "id">) => {
    try {
      await addPaymentMutation.mutateAsync(payment);

      // Update last used card
      await updateUserSettingsMutation.mutateAsync({
        ...currentUserSettings,
        lastUsedCard: payment.creditCard,
      });

      // Add credit card if not already present
      if (!creditCards.some((card) => card.lastFour === payment.creditCard)) {
        await addCreditCardMutation.mutateAsync({
          lastFour: payment.creditCard,
          name: `Card ending in ${payment.creditCard}`,
        });
      }

      setUndoAction({
        id: Date.now().toString(),
        type: "add",
        message: `Payment plan "${payment.name}" added successfully`,
        data: { payment },
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

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

  const handleUndo = () => {
    setUndoAction(null);
  };

  const updateSettings = async (newSettings: UserSettings) => {
    try {
      await updateUserSettingsMutation.mutateAsync(newSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const t = translations[currentUserSettings.language];

  if (paymentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto animate-pulse">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto" />
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (activeTab === "add-payment") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-center space-y-2 flex-1">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Credit Tractor
                  </h1>
                  <p className="text-lg font-medium text-green-600">
                    Payment Tracking Made Simple
                  </p>
                </div>
              </div>
              <p className="text-gray-600">{t.addNewPayment}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:block">
                Welcome, {user.email}
              </span>
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">{t.addNewPayment}</CardTitle>
              <CardDescription className="text-center">
                {t.addNewPaymentDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentForm
                onSubmit={(payment) => {
                  addPayment(payment);
                  setActiveTab("dashboard");
                }}
                userSettings={currentUserSettings}
                onAddCard={(card) => {
                  addCreditCardMutation.mutate(card);
                }}
              />
              <Button
                variant="outline"
                onClick={() => setActiveTab("dashboard")}
                className="w-full mt-4"
              >
                {t.close}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-center space-y-2 flex-1">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Credit Tractor
                </h1>
                <p className="text-lg font-medium text-green-600">
                  Payment Tracking Made Simple
                </p>
              </div>
            </div>
            <p className="text-gray-600">
              Track your credit card payments and manage payment plans
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 hidden md:block">
                Welcome, {user.email}
              </span>
              <Button
                onClick={() => setActiveTab("add-payment")}
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t.addPayment}
              </Button>
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 gap-1 h-auto p-1 md:grid-cols-4 md:gap-0 md:h-10 md:p-1 bg-white border">
            <TabsTrigger
              value="dashboard"
              className="text-xs px-2 py-2 md:text-sm md:px-3 md:py-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              {t.dashboard}
            </TabsTrigger>
            <TabsTrigger
              value="edit"
              className="text-xs px-2 py-2 md:text-sm md:px-3 md:py-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              {t.payments}
            </TabsTrigger>
            <TabsTrigger
              value="table"
              className="text-xs px-2 py-2 md:text-sm md:px-3 md:py-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              {t.tableView}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="text-xs px-2 py-2 md:text-sm md:px-3 md:py-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              {t.settings}
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="dashboard"
            className="space-y-4"
          >
            <PaymentDashboard
              payments={payments}
              userSettings={currentUserSettings}
              onMarkAsPaid={markPaymentAsPaid}
              onMarkAsUnpaid={markPaymentAsUnpaid}
              onUpdateSettings={updateSettings}
            />
          </TabsContent>

          <TabsContent
            value="edit"
            className="space-y-4"
          >
            <PaymentEdit
              payments={payments}
              userSettings={currentUserSettings}
              onUpdate={updatePayment}
              onDelete={deletePayment}
              onMarkAsPaid={markPaymentAsPaid}
              onMarkAsUnpaid={markPaymentAsUnpaid}
            />
          </TabsContent>

          <TabsContent
            value="table"
            className="space-y-4"
          >
            <PaymentTable
              payments={payments}
              userSettings={currentUserSettings}
              onDelete={deletePayment}
              onMarkAsPaid={markPaymentAsPaid}
              onMarkAsUnpaid={markPaymentAsUnpaid}
            />
          </TabsContent>

          <TabsContent
            value="settings"
            className="space-y-4"
          >
            <Settings
              userSettings={currentUserSettings}
              onUpdateSettings={updateSettings}
              payments={payments}
              onUpdatePayments={() => {}} // Not needed with React Query
            />
          </TabsContent>
        </Tabs>

        <Footer />
        <PWAInstall />
        <UndoSnackbar
          action={undoAction}
          onUndo={handleUndo}
          onDismiss={() => setUndoAction(null)}
        />
      </div>
    </div>
  );
}
