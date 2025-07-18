"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Tractor, X } from "lucide-react";
import { supabase } from "@/app/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { LoadingScreen } from "../loading-screen";

export function AuthForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleEmailAuth = async (
    email: string,
    password: string,
    isSignUp: boolean
  ) => {
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signUpError) throw signUpError;

        // Try to log in immediately after sign up
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!signInError) {
          // Optimistically set user in cache and redirect
          const {
            data: { user: loggedInUser },
          } = await supabase.auth.getUser();
          queryClient.setQueryData(["user"], loggedInUser);
          router.push("/");
          return;
        }

        // If login fails (likely due to unconfirmed email), show confirmation message
        setMessage({
          type: "success",
          text: "Check your email for the confirmation link!",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Optimistically set user in cache and redirect
        const {
          data: { user: loggedInUser },
        } = await supabase.auth.getUser();
        queryClient.setQueryData(["user"], loggedInUser);
        router.push("/");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-7rem)]">
      {/* Background decorations */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-green-100 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-100 rounded-full opacity-40 blur-3xl"></div>

      <Card className="w-full max-w-md relative bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          onClick={handleBack}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 p-2 rounded-lg">
              <Tractor className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Credit Tractor
          </CardTitle>
          <p className="text-lg font-medium text-gray-600 mt-2">
            Payment Tracking Made Simple
          </p>
          <CardDescription className="text-gray-600 mt-2">
            Sign in to your account to start tracking your credit payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Tabs
              defaultValue="signin"
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-sm"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="signin"
                className="mt-6"
              >
                <EmailForm
                  onSubmit={(email, password) =>
                    handleEmailAuth(email, password, false)
                  }
                  loading={loading}
                />
              </TabsContent>

              <TabsContent
                value="signup"
                className="mt-6"
              >
                <EmailForm
                  onSubmit={(email, password) =>
                    handleEmailAuth(email, password, true)
                  }
                  loading={loading}
                />
              </TabsContent>
            </Tabs>

            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
                className={`${
                  message.type === "success"
                    ? "bg-green-100 border-green-200 text-green-700"
                    : "bg-red-100 border-red-200 text-red-700"
                }`}
              >
                <Mail
                  className={`h-4 w-4 ${
                    message.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                />
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmailForm({
  onSubmit,
  loading,
}: {
  onSubmit: (email: string, password: string) => void;
  loading: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-gray-900 font-medium"
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="border-gray-300 focus:border-green-600 focus:ring-green-600 transition-colors"
        />
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-gray-900 font-medium"
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="border-gray-300 focus:border-green-600 focus:ring-green-600 transition-colors"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
        disabled={loading}
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Continue
      </Button>
    </form>
  );
}
