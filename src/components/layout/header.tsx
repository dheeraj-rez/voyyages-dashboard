import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Workflow } from 'lucide-react';

export function AppHeader() {
  // Placeholder for authentication status and user role
  const isAuthenticated = false; // Replace with actual auth check
  const userRole = 'guest'; // Replace with actual user role (admin, ops, agent, guest)

  const navItems = [
    { href: '/apply', label: 'Apply', roles: ['guest'] },
    { href: '/admin', label: 'Admin Dashboard', roles: ['admin'] },
    { href: '/ops', label: 'Ops Dashboard', roles: ['ops', 'admin'] },
    { href: '/agent', label: 'Agent Dashboard', roles: ['agent', 'admin'] },
  ];

  const visibleNavItems = navItems.filter(item => {
    if (item.roles.includes('guest') && !isAuthenticated) return true;
    if (isAuthenticated && item.roles.includes(userRole)) return true;
    return false;
  });


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Workflow className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              AgentFlow
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {visibleNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
             <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
               <Workflow className="h-6 w-6 text-primary" />
               <span className="font-bold">
                 AgentFlow
               </span>
             </Link>
            <nav className="flex flex-col space-y-4">
              {visibleNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        {/* Auth Buttons */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isAuthenticated ? (
            <Button variant="outline">Logout</Button> // Add logout logic
          ) : (
            <>
              <Button asChild variant="ghost">
                 <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                 <Link href="/apply">Apply Now</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
