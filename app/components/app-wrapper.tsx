"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { supabase } from "../lib/supabase";

import { useUser } from "../lib/queries";
import { Loader2 } from "lucide-react";
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
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authState, setAuthState] = useState<string>("");
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

  console.log("Environment variables check:", {
    supabaseUrl: supabaseUrl ? "Set" : "Not set",
    supabaseKey: supabaseKey ? "Set" : "Not set",
    hasCredentials,
  });

  useEffect(() => {
    console.log("AppWrapper useEffect triggered:", { hasCredentials });

    if (!hasCredentials) {
      console.log("No credentials - setting isAuthLoading to false");
      setIsAuthLoading(false);
      return;
    }

    // Check if we're using the mock Supabase client
    const isMockClient =
      !supabase.auth.getUser ||
      supabase.auth.getUser.toString().includes("Mock getUser");
    if (isMockClient) {
      console.log(
        "Detected mock Supabase client - setting isAuthLoading to false"
      );
      setIsAuthLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      console.log("Getting initial session...");
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("Initial session result:", session?.user?.email);

        // If we have a session, set auth state immediately
        if (session?.user) {
          setAuthState("SIGNED_IN");
        }
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        console.log(
          "Setting isAuthLoading to false after initial session check"
        );
        setIsAuthLoading(false);
      }
    };

    getInitialSession();

    console.log("Setting up auth state change listener...");
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      console.log("Auth state changed:", event, session?.user?.email);
      setIsAuthLoading(false);
      setAuthState(event);

      // Force a re-render when auth state changes
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        console.log("Invalidating queries due to auth state change:", event);
        // Clear all queries first to ensure clean state
        queryClient.clear();
        // Invalidate user query to refetch data
        await queryClient.invalidateQueries({ queryKey: ["user"] });

        // Force a page reload to ensure fresh state
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }
    });

    return () => {
      console.log("Cleaning up auth state change listener");
      subscription.unsubscribe();
    };
  }, [hasCredentials, queryClient]);

  // Debug logging
  console.log("AppContent state:", {
    user: user?.email,
    isLoading,
    isAuthLoading,
    hasCredentials,
    authState,
    error: error?.message,
  });

  // Handle case where user data is cached but auth state is signed out
  if (user && authState === "SIGNED_OUT") {
    console.log(
      "User data cached but auth state is signed out - clearing cache and showing landing page"
    );
    // Clear the user query cache to force a fresh check
    queryClient.setQueryData(["user"], null);
    // Show landing page
    return <>{children}</>;
  }

  // Show connection error if there's an issue with Supabase
  if (error) {
    // Don't show connection error for auth-related errors (like missing session)
    if (
      error.message.includes("Auth session missing") ||
      error.message.includes("Not authenticated") ||
      error.message.includes("auth")
    ) {
      // This is an auth error, not a connection error - just show the children
      // which will handle the unauthenticated state
      return <>{children}</>;
    }

    return (
      <LoadingScreen
        message="Connection Error"
        subMessage="Unable to connect to Supabase. Please check your credentials and try again."
        debugInfo={<span>Error: {error.message}</span>}
      />
    );
  }

  // Redirect to home page if user is not authenticated and not already on home page, login page, or setup page
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
