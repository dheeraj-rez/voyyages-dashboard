import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"; // Ensure Toaster is available

export const metadata: Metadata = {
  title: "AgentFlow - Authentication",
  description: "Login or register for AgentFlow",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Removed AppHeader from here, focuses solely on auth form presentation
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      {children}
      <Toaster /> {/* Keep Toaster for login/auth feedback */}
    </div>
  );
}
