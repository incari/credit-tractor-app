"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useUser } from "../lib/queries";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";

export default function ClientNavShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!isLoading && user && pathname === "/") {
      router.replace("/dashboard");
    }
  }, [user, isLoading, pathname, router]);
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white pt-24">
        <div className="flex justify-center pb-4">
          <Tabs
            key={pathname}
            value={
              pathname.startsWith("/dashboard")
                ? "dashboard"
                : pathname.startsWith("/payments")
                ? "payments"
                : pathname.startsWith("/table")
                ? "table"
                : undefined
            }
            className="w-full max-w-2xl"
          >
            <TabsList className="w-full grid grid-cols-3 gap-1 h-auto p-1 md:h-12 md:p-1 bg-white border rounded-lg">
              <TabsTrigger
                asChild
                value="dashboard"
                className="text-xs px-2 py-2 md:text-sm md:px-3 md:py-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Link
                  href="/dashboard"
                  className="w-full text-center"
                >
                  Dashboard
                </Link>
              </TabsTrigger>
              <TabsTrigger
                asChild
                value="payments"
                className="text-xs px-2 py-2 md:text-sm md:px-3 md:py-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Link
                  href="/payments"
                  className="w-full text-center"
                >
                  Payments
                </Link>
              </TabsTrigger>
              <TabsTrigger
                asChild
                value="table"
                className="text-xs px-2 py-2 md:text-sm md:px-3 md:py-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Link
                  href="/table"
                  className="w-full text-center"
                >
                  Table
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="container mx-auto p-4 space-y-6">{children}</div>
      </div>
    </>
  );
}
