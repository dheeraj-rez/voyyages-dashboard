import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "AgentFlow Dashboard",
  description: "Manage your AgentFlow account",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user data or context if needed for all dashboard pages
  // e.g., const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader /> {/* Include the main header for dashboard views */}
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 container mx-auto">
        {children}
      </main>
      <Toaster /> {/* Toaster for dashboard actions */}
    </div>
  );
}
