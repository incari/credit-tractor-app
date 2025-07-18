import { createClient } from "@supabase/supabase-js";

// Get environment variables with fallbacks
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project-id.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";

// Check if credentials are properly configured
const hasValidCredentials =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "https://your-project-id.supabase.co" &&
  supabaseAnonKey !== "your-anon-key" &&
  supabaseUrl.includes("supabase.co");

console.log("Supabase credentials check:", {
  supabaseUrl,
  hasValidCredentials,
  isMock: !hasValidCredentials,
});

let supabase: any = null;

if (hasValidCredentials) {
  console.log("Creating real Supabase client with valid credentials");
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
  console.log("Real Supabase client created successfully");
} else {
  // Create a mock client for development when credentials are missing
  console.log("Using mock Supabase client - credentials not configured");
  supabase = {
    auth: {
      getUser: () => {
        console.log("Mock getUser called");
        return Promise.resolve({
          data: { user: null },
          error: new Error("Supabase not configured"),
        });
      },
      onAuthStateChange: () => {
        console.log("Mock onAuthStateChange called");
        return {
          data: { subscription: { unsubscribe: () => {} } },
        };
      },
      signInWithOAuth: () =>
        Promise.resolve({ error: new Error("Supabase not configured") }),
      signInWithPassword: () =>
        Promise.resolve({ error: new Error("Supabase not configured") }),
      signUp: () =>
        Promise.resolve({ error: new Error("Supabase not configured") }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () =>
            Promise.resolve({
              data: [],
              error: new Error("Supabase not configured"),
            }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({ error: new Error("Supabase not configured") }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () =>
              Promise.resolve({ error: new Error("Supabase not configured") }),
          }),
        }),
      }),
      delete: () => ({
        eq: () =>
          Promise.resolve({ error: new Error("Supabase not configured") }),
      }),
      upsert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({ error: new Error("Supabase not configured") }),
        }),
      }),
    }),
  };
}

export { supabase };

export type Database = {
  public: {
    Tables: {
      credit_tractor_payments: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          price: number;
          installments: number;
          first_payment_date: string;
          credit_card: string;
          initial_payment: number;
          interest_rate: number;
          payment_type: "monthly" | "beginning" | "ending" | "custom";
          custom_day_of_month: number | null;
          currency: string;
          paid_installments: number[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          price: number;
          installments: number;
          first_payment_date: string;
          credit_card: string;
          initial_payment?: number;
          interest_rate?: number;
          payment_type?: "monthly" | "beginning" | "ending" | "custom";
          custom_day_of_month?: number | null;
          currency: string;
          paid_installments?: number[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          price?: number;
          installments?: number;
          first_payment_date?: string;
          credit_card?: string;
          initial_payment?: number;
          interest_rate?: number;
          payment_type?: "monthly" | "beginning" | "ending" | "custom";
          custom_day_of_month?: number | null;
          currency?: string;
          paid_installments?: number[];
          created_at?: string;
          updated_at?: string;
        };
      };
      credit_tractor_credit_cards: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          last_four: string;
          limit: number | null;
          yearly_fee: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          last_four: string;
          limit?: number | null;
          yearly_fee?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          last_four?: string;
          limit?: number | null;
          yearly_fee?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      credit_tractor_user_settings: {
        Row: {
          id: string;
          user_id: string;
          language: "EN" | "ES" | "DE" | "FR" | "IT" | "PT";
          currency: string;
          last_used_card: string | null;
          months_to_show: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          language?: "EN" | "ES" | "DE" | "FR" | "IT" | "PT";
          currency?: string;
          last_used_card?: string | null;
          months_to_show?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          language?: "EN" | "ES" | "DE" | "FR" | "IT" | "PT";
          currency?: string;
          last_used_card?: string | null;
          months_to_show?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      credit_tractor_payment_stats: {
        Row: {
          user_id: string;
          total_payments: number;
          total_amount: number;
          avg_installments: number;
          unique_cards: number;
        };
      };
    };
  };
};
