"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { supabase } from "../lib/supabase";
import { EnvSetup } from "./env-setup";
import { useUser } from "../lib/queries";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, error } = useUser();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const router = useRouter();

  // Check if Supabase credentials are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const hasCredentials =
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== "https://your-project-id.supabase.co" &&
    supabaseKey !== "your-anon-key";

  useEffect(() => {
    if (!hasCredentials) {
      setIsAuthLoading(false);
      return;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [hasCredentials]);

  // Show environment setup if credentials are missing
  if (!hasCredentials) {
    return <EnvSetup />;
  }

  // Show loading state
  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show connection error if there's an issue with Supabase
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto">
            <Loader2 className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-red-800">
            Connection Error
          </h2>
          <p className="text-red-600">
            Unable to connect to Supabase. Please check your credentials and try
            again.
          </p>
          <p className="text-sm text-red-500">Error: {error.message}</p>
        </div>
      </div>
    );
  }

  // Redirect to home page if user is not authenticated and not already on home page or login page
  if (
    !user &&
    typeof window !== "undefined" &&
    window.location.pathname !== "/" &&
    window.location.pathname !== "/login"
  ) {
    router.push("/");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent>{children}</AppContent>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
