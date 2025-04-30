import type { Metadata } from "next";
import { AppHeader } from "@/components/layout/header"; // Reuse header if appropriate, or create a dashboard-specific one
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
  // Here you might fetch user data or context needed for the dashboard layout
  // e.g., const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen w-full flex-col">
       {/* Optionally include a sidebar or different header for dashboards */}
      {/* <DashboardSidebar user={user} /> */}
      {/* <DashboardHeader user={user} /> */}
      <AppHeader /> {/* Reusing the main header for simplicity */}
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 container mx-auto">
        {children}
      </main>
      <Toaster />
    </div>
  );
}
