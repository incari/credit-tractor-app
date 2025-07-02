"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Tractor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/app/lib/queries";
import { supabase } from "@/app/lib/supabase";
import { Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-2 sm:py-3 md:py-4 transition-all duration-300",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-lg" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#"
          className="flex items-center space-x-3"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            if (isMenuOpen) {
              setIsMenuOpen(false);
              document.body.style.overflow = "";
            }
          }}
          aria-label="Credit Tractor"
        >
          <div className="bg-green-500 p-2 rounded-lg">
            <Tractor className="h-6 w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold text-gray-900">
              Credit Tractor
            </span>
            <div className="text-xs text-gray-600">Payment Tracking</div>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {!user && (
            <>
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#demo"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Demo
              </a>
              <a
                href="/setup"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Button
                  asChild
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <span className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Setup
                  </span>
                </Button>
              </a>
            </>
          )}
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <Link
                href="/settings"
                passHref
                legacyBehavior
              >
                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    "border-gray-300 cursor-pointer",
                    pathname.startsWith("/settings")
                      ? "bg-green-500 text-white border-green-500 hover:bg-green-500 hover:text-white"
                      : "text-gray-700 hover:bg-gray-50 "
                  )}
                >
                  <span className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <a href="/login">
                <Button
                  asChild
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <span>Login</span>
                </Button>
              </a>
              <a href="/login">
                <Button
                  asChild
                  className="bg-green-500 hover:bg-green-600"
                >
                  <span>Get Started</span>
                </Button>
              </a>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 p-3 focus:outline-none"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
            document.body.style.overflow = !isMenuOpen ? "hidden" : "";
          }}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white flex flex-col pt-16 px-6 md:hidden transition-all duration-300 ease-in-out",
          isMenuOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full pointer-events-none"
        )}
      >
        <nav className="flex flex-col space-y-8 items-center mt-8">
          {!user && (
            <>
              <a
                href="#features"
                className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100"
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = "";
                }}
              >
                Features
              </a>
              <a
                href="#demo"
                className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100"
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = "";
                }}
              >
                Demo
              </a>
              <a
                href="/setup"
                className="w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = "";
                }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full justify-center"
                >
                  <span className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Setup
                  </span>
                </Button>
              </a>
            </>
          )}
          {user ? (
            <div className="flex flex-col space-y-2 w-full items-center">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <Link
                href="/settings"
                passHref
                legacyBehavior
              >
                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    "border-gray-300 cursor-pointer",
                    pathname.startsWith("/settings")
                      ? "bg-green-500 text-white border-green-500 hover:bg-green-500 hover:text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:bg-green-600"
                  )}
                >
                  <span className="flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                  document.body.style.overflow = "";
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full justify-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <a
                href="/login"
                className="w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = "";
                }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full justify-center"
                >
                  <span>Login</span>
                </Button>
              </a>
              <a
                href="/login"
                className="w-full"
                onClick={() => {
                  setIsMenuOpen(false);
                  document.body.style.overflow = "";
                }}
              >
                <Button
                  asChild
                  className="bg-green-500 hover:bg-green-600 w-full justify-center"
                >
                  <span>Get Started</span>
                </Button>
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
