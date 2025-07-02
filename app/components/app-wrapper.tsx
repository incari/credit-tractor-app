"use client";

import type React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { supabase } from "../lib/supabase";
import { useUser } from "../lib/queries";
import { LoadingScreen } from "./loading-screen";

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
  const router = useRouter();
  const queryClient = useQueryClient();

  // Check if Supabase credentials are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasCredentials =
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== "https://your-project-id.supabase.co" &&
    supabaseKey !== "your-anon-key";

  useEffect(() => {
    if (!hasCredentials) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string) => {
      if (event === "SIGNED_OUT") {
        queryClient.setQueryData(["user"], null);
        queryClient.clear();
        if (typeof window !== "undefined") router.push("/");
      }
    });
    return () => subscription.unsubscribe();
  }, [hasCredentials, queryClient, router]);

  // Show connection error if there's an issue with Supabase (not auth errors)
  if (error && !error.message.includes("auth")) {
    return (
      <LoadingScreen
        message="Connection Error"
        subMessage="Unable to connect to Supabase. Please check your credentials and try again."
        debugInfo={<span>Error: {error.message}</span>}
      />
    );
  }

  // Redirect to home page if user is not authenticated and not already on home, login, or setup page
  if (
    !user &&
    typeof window !== "undefined" &&
    window.location.pathname !== "/" &&
    window.location.pathname !== "/login" &&
    window.location.pathname !== "/setup"
  ) {
    router.push("/");
    return <LoadingScreen message="Redirecting to home..." />;
  }

  // Render children by default, even while loading user
  return <>{children}</>;
}

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
