"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error during auth callback:", error);
        router.push("/");
        return;
      }

      if (data.session) {
        console.log("Auth callback successful, redirecting to home");
        // Optimistically update user cache
        const { user } = data.session;
        if (user) {
          // @ts-ignore
          window.__REACT_QUERY_CLIENT__?.setQueryData(["user"], user);
        }
        router.push("/");
      } else {
        console.log("No session found, redirecting to home");
        router.push("/");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center pt-24 md:pt-28 min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-7rem)]">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Completing sign in...</h2>
        <p className="text-muted-foreground">
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  );
}
