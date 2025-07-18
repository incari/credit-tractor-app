"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";
import type {
  Payment,
  CreditCard,
  UserSettings,
  Income,
  Expense,
} from "../types/payment";

// Auth queries
export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      // Check if we're using the mock Supabase client
      const isMockClient =
        !supabase.auth.getUser ||
        supabase.auth.getUser.toString().includes("Mock getUser");
      if (isMockClient) {
        return null;
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      // Don't throw error for missing auth session - just return null
      if (
        error &&
        (error.message.includes("Auth session missing") ||
          error.message.includes("Not authenticated"))
      ) {
        return null;
      }

      if (error) {
        throw error;
      }

      return user;
    },
    retry: false, // Don't retry if auth fails
    staleTime: 0, // Always consider data stale to ensure fresh checks
    gcTime: 0, // Don't keep data in cache
  });
}

// Payment queries
export function usePayments() {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      // Check if we're using the mock Supabase client
      const isMockClient =
        !supabase.auth.getUser ||
        supabase.auth.getUser.toString().includes("Mock getUser");
      if (isMockClient) {
        return [];
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      // Don't throw error for missing auth session - just return empty array
      if (
        authError &&
        (authError.message.includes("Auth session missing") ||
          authError.message.includes("Not authenticated"))
      ) {
        return [];
      }

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("credit_tractor_payments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data.map((payment: any) => ({
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
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
        .from("credit_tractor_payments")
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
        .from("credit_tractor_payments")
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
        .from("credit_tractor_payments")
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
        error: authError,
      } = await supabase.auth.getUser();

      // Don't throw error for missing auth session - just return empty array
      if (
        authError &&
        (authError.message.includes("Auth session missing") ||
          authError.message.includes("Not authenticated"))
      ) {
        return [];
      }

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("credit_tractor_credit_cards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data.map((card: any) => ({
        id: card.id,
        name: card.name,
        lastFour: card.last_four,
        limit: card.credit_limit,
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
        .from("credit_tractor_credit_cards")
        .insert({
          user_id: user.id,
          name: card.name,
          last_four: card.lastFour,
          credit_limit: card.limit,
          yearly_fee: card.yearlyFee,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }
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
    onSuccess: (data) => {},
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
    },
  });
}

// Add update and delete mutations for credit cards
export function useUpdateCreditCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (card: CreditCard) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("credit_tractor_credit_cards")
        .update({
          name: card.name,
          last_four: card.lastFour,
          credit_limit: card.limit,
          yearly_fee: card.yearlyFee,
          updated_at: new Date().toISOString(),
        })
        .eq("id", card.id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (updatedCard) => {
      await queryClient.cancelQueries({ queryKey: ["credit-cards"] });
      const previousCards = queryClient.getQueryData<CreditCard[]>([
        "credit-cards",
      ]);
      queryClient.setQueryData<CreditCard[]>(["credit-cards"], (old) =>
        old ? old.map((c) => (c.id === updatedCard.id ? updatedCard : c)) : []
      );
      return { previousCards };
    },
    onError: (err, updatedCard, context) => {
      queryClient.setQueryData(["credit-cards"], context?.previousCards);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-cards"] });
    },
  });
}

export function useDeleteCreditCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cardId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("credit_tractor_credit_cards")
        .delete()
        .eq("id", cardId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onMutate: async (cardId) => {
      await queryClient.cancelQueries({ queryKey: ["credit-cards"] });
      const previousCards = queryClient.getQueryData<CreditCard[]>([
        "credit-cards",
      ]);
      queryClient.setQueryData<CreditCard[]>(["credit-cards"], (old) =>
        old ? old.filter((c) => c.id !== cardId) : []
      );
      return { previousCards };
    },
    onError: (err, cardId, context) => {
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
        error: authError,
      } = await supabase.auth.getUser();

      // Don't throw error for missing auth session - just return defaults
      if (
        authError &&
        (authError.message.includes("Auth session missing") ||
          authError.message.includes("Not authenticated"))
      ) {
        return {
          language: "EN" as const,
          currency: "EUR",
          lastUsedCard: null,
          monthsToShow: 12,
        };
      }

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("credit_tractor_user_settings")
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
        .from("credit_tractor_user_settings")
        .upsert(
          {
            user_id: user.id,
            language: settings.language,
            currency: settings.currency,
            last_used_card: settings.lastUsedCard,
            months_to_show: settings.monthsToShow,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        )
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
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["user-settings"], (old: any) => ({
        ...old,
        ...variables,
      }));
    },
  });
}

export function useAddIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (income: any) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("credit_tractor_incomes")
        .insert({
          user_id: user.id,
          name: income.name,
          amount: income.amount,
          currency: income.currency,
          is_recurring: income.is_recurring,
          recurrence_interval: income.recurrence_interval,
          start_date: income.start_date,
          end_date: income.end_date,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async (newIncome) => {
      await queryClient.cancelQueries({ queryKey: ["incomes"] });
      const previous = queryClient.getQueryData(["incomes"]);
      queryClient.setQueryData(["incomes"], (old: any) =>
        old ? [newIncome, ...old] : [newIncome]
      );
      return { previous };
    },
    onError: (err, newIncome, context) => {
      queryClient.setQueryData(["incomes"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });
}

export function useUpdateIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (income: any) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("credit_tractor_incomes")
        .update({
          name: income.name,
          amount: income.amount,
          currency: income.currency,
          is_recurring: income.is_recurring,
          recurrence_interval: income.recurrence_interval,
          start_date: income.start_date,
          end_date: income.end_date,
          updated_at: new Date().toISOString(),
        })
        .eq("id", income.id)
        .eq("user_id", user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async (updatedIncome) => {
      await queryClient.cancelQueries({ queryKey: ["incomes"] });
      const previous = queryClient.getQueryData(["incomes"]);
      queryClient.setQueryData(["incomes"], (old: any) =>
        old
          ? old.map((i: any) => (i.id === updatedIncome.id ? updatedIncome : i))
          : []
      );
      return { previous };
    },
    onError: (err, updatedIncome, context) => {
      queryClient.setQueryData(["incomes"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });
}

export function useAddExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expense: any) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("credit_tractor_expenses")
        .insert({
          user_id: user.id,
          name: expense.name,
          amount: expense.amount,
          currency: expense.currency,
          category_id: expense.category_id,
          is_recurring: expense.is_recurring,
          recurrence_interval: expense.recurrence_interval,
          start_date: expense.start_date,
          end_date: expense.end_date,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async (newExpense) => {
      await queryClient.cancelQueries({ queryKey: ["expenses"] });
      const previous = queryClient.getQueryData(["expenses"]);
      queryClient.setQueryData(["expenses"], (old: any) =>
        old ? [newExpense, ...old] : [newExpense]
      );
      return { previous };
    },
    onError: (err, newExpense, context) => {
      queryClient.setQueryData(["expenses"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expense: any) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("credit_tractor_expenses")
        .update({
          name: expense.name,
          amount: expense.amount,
          currency: expense.currency,
          category_id: expense.category_id,
          is_recurring: expense.is_recurring,
          recurrence_interval: expense.recurrence_interval,
          start_date: expense.start_date,
          end_date: expense.end_date,
          updated_at: new Date().toISOString(),
        })
        .eq("id", expense.id)
        .eq("user_id", user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async (updatedExpense) => {
      await queryClient.cancelQueries({ queryKey: ["expenses"] });
      const previous = queryClient.getQueryData(["expenses"]);
      queryClient.setQueryData(["expenses"], (old: any) =>
        old
          ? old.map((e: any) =>
              e.id === updatedExpense.id ? updatedExpense : e
            )
          : []
      );
      return { previous };
    },
    onError: (err, updatedExpense, context) => {
      queryClient.setQueryData(["expenses"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (expenseId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("credit_tractor_expenses")
        .delete()
        .eq("id", expenseId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onMutate: async (expenseId) => {
      await queryClient.cancelQueries({ queryKey: ["expenses"] });
      const previous = queryClient.getQueryData(["expenses"]);
      queryClient.setQueryData(["expenses"], (old: any) =>
        old ? old.filter((e: any) => e.id !== expenseId) : []
      );
      return { previous };
    },
    onError: (err, expenseId, context) => {
      queryClient.setQueryData(["expenses"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

// Fetch incomes
export function useIncomes() {
  return useQuery<Income[]>({
    queryKey: ["incomes"],
    queryFn: async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (
        authError &&
        (authError.message.includes("Auth session missing") ||
          authError.message.includes("Not authenticated"))
      ) {
        return [];
      }
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("credit_tractor_incomes")
        .select("*")
        .eq("user_id", user.id)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch expenses
export function useExpenses() {
  return useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (
        authError &&
        (authError.message.includes("Auth session missing") ||
          authError.message.includes("Not authenticated"))
      ) {
        return [];
      }
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("credit_tractor_expenses")
        .select(
          `
          *,
          category:credit_tractor_expense_categories(
            id,
            name,
            icon,
            color
          )
        `
        )
        .eq("user_id", user.id)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export function useDeleteIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (incomeId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("credit_tractor_incomes")
        .delete()
        .eq("id", incomeId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onMutate: async (incomeId) => {
      await queryClient.cancelQueries({ queryKey: ["incomes"] });
      const previous = queryClient.getQueryData(["incomes"]);
      queryClient.setQueryData(["incomes"], (old: any) =>
        old ? old.filter((i: any) => i.id !== incomeId) : []
      );
      return { previous };
    },
    onError: (err, incomeId, context) => {
      queryClient.setQueryData(["incomes"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes"] });
    },
  });
}

// Expense Categories queries
export function useExpenseCategories() {
  return useQuery({
    queryKey: ["expense-categories"],
    queryFn: async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (
        authError &&
        (authError.message.includes("Auth session missing") ||
          authError.message.includes("Not authenticated"))
      ) {
        return [];
      }

      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("credit_tractor_expense_categories")
        .select("*")
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .order("name", { ascending: true });

      if (error) throw error;
      return Array.isArray(data) ? data : [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddExpenseCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: any) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("credit_tractor_expense_categories")
        .insert({
          user_id: user.id,
          name: category.name,
          icon: category.icon,
          color: category.color,
          is_default: category.is_default || false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ["expense-categories"] });
      const previous = queryClient.getQueryData(["expense-categories"]);
      queryClient.setQueryData(["expense-categories"], (old: any) =>
        old ? [newCategory, ...old] : [newCategory]
      );
      return { previous };
    },
    onError: (err, newCategory, context) => {
      queryClient.setQueryData(["expense-categories"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
    },
  });
}

export function useUpdateExpenseCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category: any) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("credit_tractor_expense_categories")
        .update({
          name: category.name,
          icon: category.icon,
          color: category.color,
          is_default: category.is_default,
          updated_at: new Date().toISOString(),
        })
        .eq("id", category.id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (updatedCategory) => {
      await queryClient.cancelQueries({ queryKey: ["expense-categories"] });
      const previous = queryClient.getQueryData(["expense-categories"]);
      queryClient.setQueryData(["expense-categories"], (old: any) =>
        old
          ? old.map((c: any) =>
              c.id === updatedCategory.id ? updatedCategory : c
            )
          : []
      );
      return { previous };
    },
    onError: (err, updatedCategory, context) => {
      queryClient.setQueryData(["expense-categories"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
    },
  });
}

export function useDeleteExpenseCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (categoryId: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("credit_tractor_expense_categories")
        .delete()
        .eq("id", categoryId)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({ queryKey: ["expense-categories"] });
      const previous = queryClient.getQueryData(["expense-categories"]);
      queryClient.setQueryData(["expense-categories"], (old: any) =>
        old ? old.filter((c: any) => c.id !== categoryId) : []
      );
      return { previous };
    },
    onError: (err, categoryId, context) => {
      queryClient.setQueryData(["expense-categories"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["expense-categories"] });
    },
  });
}
