import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppHeader } from '@/components/layout/header';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'AgentFlow',
  description: 'Agent Onboarding Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={cn(
          'h-full font-sans antialiased',
          GeistSans.variable // Ensure GeistSans variable is correctly referenced if installed
          // If 'geist/font/sans' is not found, replace the above line with a fallback like:
          // 'font-sans' // Assuming you have a default sans-serif in globals.css or tailwind config
        )}
      >
        <div className="flex flex-col min-h-screen">
          {/* Render AppHeader only if not on the apply page - handled by separate layouts */}
          {/* AppHeader is rendered conditionally via page layouts */}
          <main className="flex-grow"> {/* Removed container and padding, handled by specific page layouts */}
            {children}
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
