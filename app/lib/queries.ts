"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type { Payment, CreditCard, UserSettings } from "../types/payment";

// Auth queries
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
  });
}

// Payment queries
export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("creditTractor_payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((payment) => ({
        id: payment.id,
        name: payment.name,
        price: payment.price,
        installments: payment.installments,
        firstPaymentDate: payment.first_payment_date,
        creditCard: payment.credit_card,
        initialPayment: payment.initial_payment,
        interestRate: payment.interest_rate,
        paymentType: payment.payment_type,
        customDayOfMonth: payment.custom_day_of_month,
        currency: payment.currency,
        paidInstallments: payment.paid_installments || [],
      })) as Payment[];
    },
  });
}

export function useAddPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payment: Omit<Payment, "id">) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("creditTractor_payments")
        .insert({
          user_id: user.id,
          name: payment.name,
          price: payment.price,
          installments: payment.installments,
          first_payment_date: payment.firstPaymentDate,
          credit_card: payment.creditCard,
          initial_payment: payment.initialPayment,
          interest_rate: payment.interestRate,
          payment_type: payment.paymentType,
          custom_day_of_month: payment.customDayOfMonth,
          currency: payment.currency,
          paid_installments: payment.paidInstallments || [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newPayment) => {
      await queryClient.cancelQueries({ queryKey: ["payments"] });
      const previousPayments = queryClient.getQueryData<Payment[]>([
        "payments",
      ]);

      const optimisticPayment: Payment = {
        ...newPayment,
        id: `temp-${Date.now()}`,
      };

      queryClient.setQueryData<Payment[]>(["payments"], (old) =>
        old ? [optimisticPayment, ...old] : [optimisticPayment]
      );

      return { previousPayments };
    },
    onError: (err, newPayment, context) => {
      queryClient.setQueryData(["payments"], context?.previousPayments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payment: Payment) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("creditTractor_payments")
        .update({
          name: payment.name,
          price: payment.price,
          installments: payment.installments,
          first_payment_date: payment.firstPaymentDate,
          credit_card: payment.creditCard,
          initial_payment: payment.initialPayment,
          interest_rate: payment.interestRate,
          payment_type: payment.paymentType,
          custom_day_of_month: payment.customDayOfMonth,
          currency: payment.currency,
          paid_installments: payment.paidInstallments || [],
          updated_at: new Date().toISOString(),
        })
        .eq("id", payment.id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (updatedPayment) => {
      await queryClient.cancelQueries({ queryKey: ["payments"] });
      const previousPayments = queryClient.getQueryData<Payment[]>([
        "payments",
      ]);

      queryClient.setQueryData<Payment[]>(["payments"], (old) =>
        old
          ? old.map((p) => (p.id === updatedPayment.id ? updatedPayment : p))
          : []
      );

      return { previousPayments };
    },
    onError: (err, updatedPayment, context) => {
      queryClient.setQueryData(["payments"], context?.previousPayments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("creditTractor_payments")
        .delete()
        .eq("id", paymentId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onMutate: async (paymentId) => {
      await queryClient.cancelQueries({ queryKey: ["payments"] });
      const previousPayments = queryClient.getQueryData<Payment[]>([
        "payments",
      ]);

      queryClient.setQueryData<Payment[]>(["payments"], (old) =>
        old ? old.filter((p) => p.id !== paymentId) : []
      );

      return { previousPayments };
    },
    onError: (err, paymentId, context) => {
      queryClient.setQueryData(["payments"], context?.previousPayments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
}

// Credit Cards queries
export function useCreditCards() {
  return useQuery({
    queryKey: ["credit-cards"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("creditTractor_credit_cards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((card) => ({
        id: card.id,
        name: card.name,
        lastFour: card.last_four,
        limit: card.limit,
        yearlyFee: card.yearly_fee,
      })) as CreditCard[];
    },
  });
}

export function useAddCreditCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (card: Omit<CreditCard, "id">) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("creditTractor_credit_cards")
        .insert({
          user_id: user.id,
          name: card.name,
          last_four: card.lastFour,
          limit: card.limit,
          yearly_fee: card.yearlyFee,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newCard) => {
      await queryClient.cancelQueries({ queryKey: ["credit-cards"] });
      const previousCards = queryClient.getQueryData<CreditCard[]>([
        "credit-cards",
      ]);

      const optimisticCard: CreditCard = {
        ...newCard,
        id: `temp-${Date.now()}`,
      };

      queryClient.setQueryData<CreditCard[]>(["credit-cards"], (old) =>
        old ? [optimisticCard, ...old] : [optimisticCard]
      );

      return { previousCards };
    },
    onError: (err, newCard, context) => {
      queryClient.setQueryData(["credit-cards"], context?.previousCards);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
    },
  });
}

// User Settings queries
export function useUserSettings() {
  return useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("creditTractor_user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        // If no settings exist, return defaults
        if (error.code === "PGRST116") {
          return {
            language: "EN" as const,
            currency: "EUR",
            lastUsedCard: null,
            monthsToShow: 12,
          };
        }
        throw error;
      }

      return {
        language: data.language,
        currency: data.currency,
        lastUsedCard: data.last_used_card,
        monthsToShow: data.months_to_show,
      };
    },
  });
}

export function useUpdateUserSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<UserSettings>) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("creditTractor_user_settings")
        .upsert({
          user_id: user.id,
          language: settings.language,
          currency: settings.currency,
          last_used_card: settings.lastUsedCard,
          months_to_show: settings.monthsToShow,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newSettings) => {
      await queryClient.cancelQueries({ queryKey: ["user-settings"] });
      const previousSettings = queryClient.getQueryData(["user-settings"]);

      queryClient.setQueryData(["user-settings"], (old: any) => ({
        ...old,
        ...newSettings,
      }));

      return { previousSettings };
    },
    onError: (err, newSettings, context) => {
      queryClient.setQueryData(["user-settings"], context?.previousSettings);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
    },
  });
}
