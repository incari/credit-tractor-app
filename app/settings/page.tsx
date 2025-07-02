"use client";
import { useState } from "react";
import { Settings } from "../components/settings";
import {
  usePayments,
  useUserSettings,
  useUpdateUserSettings,
  useUser,
  useCreditCards,
} from "../lib/queries";
import { LoadingScreen } from "../components/loading-screen";
import type { UserSettings, Payment } from "../types/payment";

export default function SettingsPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: payments = [], isLoading: paymentsLoading } = usePayments();
  const { data: userSettings } = useUserSettings();
  const updateUserSettingsMutation = useUpdateUserSettings();
  const { data: creditCards = [] } = useCreditCards();

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
        subMessage="Loading settings..."
      />
    );
  }

  const updateSettings = async (newSettings: UserSettings) => {
    try {
      await updateUserSettingsMutation.mutateAsync(newSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Settings
        userSettings={currentUserSettings}
        onUpdateSettings={updateSettings}
        payments={payments}
        onUpdatePayments={() => {}}
        creditCards={creditCards}
      />
    </div>
  );
}
