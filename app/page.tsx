"use client";

import { useState, useEffect } from "react";
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
import { Plus, CreditCard } from "lucide-react";
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
import { LoadingScreen } from "./components/loading-screen";

export default function HomePage() {
  const { data: user, isLoading } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);
  if (isLoading) return null;
  if (!user) return <LandingPage onGetStarted={() => router.push("/login")} />;
  return null;
}
