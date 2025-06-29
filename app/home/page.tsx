"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HumanoidSection from "@/components/landing/HumanoidSection";
import SpecsSection from "@/components/landing/SpecsSection";
import DetailsSection from "@/components/landing/DetailsSection";
import ImageShowcaseSection from "@/components/landing/ImageShowcaseSection";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import Newsletter from "@/components/landing/Newsletter";
import MadeByHumans from "@/components/landing/MadeByHumans";
import Footer from "@/components/landing/Footer";

const Index = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".animate-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = (e.target as HTMLAnchorElement)
          .getAttribute("href")
          ?.substring(1);
        if (!targetId) return;

        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        const offset = window.innerWidth < 768 ? 100 : 80;

        window.scrollTo({
          top: targetElement.offsetTop - offset,
          behavior: "smooth",
        });
      });
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
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

export default Index;
