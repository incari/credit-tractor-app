"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  TrendingUp,
  Shield,
  Globe,
  Smartphone,
  BarChart3,
  CheckCircle,
  Play,
  LogOut,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { useUser } from "@/app/lib/queries";
import { supabase } from "@/app/lib/supabase";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Footer } from "@/app/components/footer";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HumanoidSection from "@/components/landing/HumanoidSection";
import ImageShowcaseSection from "@/components/landing/ImageShowcaseSection";
import Testimonials from "@/components/landing/Testimonials";
import DetailsSection from "@/components/landing/DetailsSection";
import Newsletter from "@/components/landing/Newsletter";
import SpecsSection from "@/components/landing/SpecsSection";
import MadeByHumans from "@/components/landing/MadeByHumans";
import Navbar from "@/components/landing/Navbar";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const router = useRouter();
  const { data: user } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Optimistically clear user from cache
    queryClient.setQueryData(["user"], null);
    queryClient.clear();
    router.push("/");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div>
      <main className="space-y-0">
        <Hero />
        <Features />
        <HumanoidSection />
        <SpecsSection />
        <ImageShowcaseSection />
        <Testimonials />
        <DetailsSection />
        <Newsletter />
        <MadeByHumans />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
