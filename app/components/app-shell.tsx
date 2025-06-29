"use client";
import { useUser } from "../lib/queries";
import { LandingPage } from "./landing-page";
import { LoadingScreen } from "./loading-screen";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { data: user } = useUser();
  if (!user) {
    return (
      <>
        <LandingPage onGetStarted={() => window.location.assign("/login")} />
      </>
    );
  }
  return <>{children}</>;
}
