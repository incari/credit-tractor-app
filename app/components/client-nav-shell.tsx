"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useUser, useUserSettings } from "../lib/queries";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/landing/Navbar";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Plus } from "lucide-react";
import { translations } from "../utils/translations";

export default function ClientNavShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useUser();
  const { data: userSettings } = useUserSettings();
  const router = useRouter();
  const pathname = usePathname();
  const lang = (userSettings?.language as keyof typeof translations) || "EN";
  const t = translations[lang];
  useEffect(() => {
    if (!isLoading && user && pathname === "/") {
      router.replace("/dashboard");
    }
  }, [user, isLoading, pathname, router]);
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-green-50 to-white pt-16 md:pt-20">
        {user ? (
          <div className="flex justify-center pb-4 items-center gap-4">
            <Tabs
              key={pathname}
              value={
                pathname.startsWith("/dashboard")
                  ? "dashboard"
                  : pathname.startsWith("/payments")
                  ? "payments"
                  : pathname.startsWith("/table")
                  ? "table"
                  : pathname.startsWith("/finances")
                  ? "finances"
                  : undefined
              }
              className="w-full max-w-2xl"
            >
              <TabsList className="w-full grid grid-cols-4 gap-1 h-auto p-1 md:h-12 md:p-1 bg-white border rounded-lg">
                <TabsTrigger
                  asChild
                  value="dashboard"
                  className="text-xs px-2 py-2 md:text-sm md:px-3 md:py-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <Link
                    href="/dashboard"
                    className="w-full text-center"
                  >
                    {t.dashboard}
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
                    {t.payments}
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
                    {t.tableView}
                  </Link>
                </TabsTrigger>
                <TabsTrigger
                  asChild
                  value="finances"
                  className="text-xs px-2 py-2 md:text-sm md:px-3 md:py-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
                >
                  <Link
                    href="/finances"
                    className="w-full text-center"
                  >
                    {t.finances}
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        ) : null}
        <div className="container mx-auto p-4 space-y-6">{children}</div>
      </div>
    </>
  );
}
