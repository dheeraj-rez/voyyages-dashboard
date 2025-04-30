import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "AgentFlow - Apply",
  description: "Apply to become an AgentFlow agent",
};

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      {children}
       <Toaster /> {/* Ensure toasts are visible on this layout */}
    </div>
  );
}
