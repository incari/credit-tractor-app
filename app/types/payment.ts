export interface Payment {
  id: string;
  name: string;
  price: number;
  installments: number;
  firstPaymentDate: string;
  creditCard: string;
  initialPayment: number;
  interestRate: number;
  paymentType: "monthly" | "beginning" | "ending" | "custom";
  customDayOfMonth?: number; // For custom payment schedules
  currency: string;
  paidInstallments?: number[]; // Array of installment indices that are paid
}

export interface PaymentInstallment {
  paymentId: string;
  paymentName: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  creditCard: string;
  currency: string;
  installmentIndex: number;
}

export interface CreditCard {
  id: string;
  lastFour: string;
  name: string;
  limit?: number; // Credit limit
  yearlyFee?: number; // Annual fee
}

export interface UserSettings {
  language: "EN" | "ES" | "DE" | "FR" | "IT" | "PT";
  currency: string;
  creditCards: CreditCard[];
  lastUsedCard?: string;
  paymentsPerPage?: number; // For pagination
  monthsToShow?: number; // For upcoming payments pagination
}

export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

export interface UndoAction {
  id: string;
  type: "add" | "edit" | "delete" | "markPaid" | "markUnpaid";
  message: string;
  data: any;
  timestamp: number;
}

export interface Income {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  currency: string;
  is_recurring: boolean;
  recurrence_interval?: string | null;
  start_date: string;
  end_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Expense {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
  account: string;
  payment_method: string;
  recurring: boolean;
  frequency?: string | null;
  notes?: string;
}
