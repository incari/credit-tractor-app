"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tractor, Settings, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "../lib/queries";
import { supabase } from "../lib/supabase";
import Navbar from "@/components/landing/Navbar";
import { useQueryClient } from "@tanstack/react-query";

const Header = () => {
  const { data: user } = useUser();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    queryClient.setQueryData(["user"], null);
    queryClient.clear();
    router.push("/");
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-3"
          aria-label="Home"
        >
          <span className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <Tractor className="h-6 w-6 text-white" />
          </span>
          <span>
            <span className="text-xl font-bold text-gray-900">
              Credit Tractor
            </span>
            <span className="block text-xs text-gray-600">
              Payment Tracking
            </span>
          </span>
        </Link>
        <div className="flex-1 flex justify-end">
          <Navbar />
        </div>
      </div>
    </header>
  );
};

export default Header;
