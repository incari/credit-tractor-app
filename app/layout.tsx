import React, { useEffect } from "react";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "./components/app-wrapper";
import AppShell from "./components/app-shell";
import Navbar from "@/components/landing/Navbar";
import Link from "next/link";
import { useUser } from "./lib/queries";
import { useRouter, usePathname } from "next/navigation";
import ClientNavShell from "./components/client-nav-shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Credit Tractor - Payment Tracking Made Simple",
  description:
    "Track your credit card payments and manage payment plans with powerful analytics and multi-currency support",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Credit Tractor",
  },
  generator: "v0.dev",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="manifest"
          href="/manifest.json"
        />
        <link
          rel="apple-touch-icon"
          href="/icon-192x192.png"
        />
      </head>
      <body className={inter.className}>
        <AppWrapper>
          <ClientNavShell>{children}</ClientNavShell>
        </AppWrapper>
      </body>
    </html>
  );
}
