'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Plane,
  Users,
  Settings,
  UserCog,
  Shield,
  Key,
  LogOut,
} from 'lucide-react';
import React from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Tours', href: '/admin/tours', icon: Plane },
  { name: 'Agents', href: '/admin/agents', icon: Users },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    subItems: [
      { name: 'Users', href: '/admin/settings/users', icon: UserCog },
      { name: 'Roles', href: '/admin/settings/roles', icon: Shield },
      { name: 'Role Access', href: '/admin/settings/access', icon: Key },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.subItems && item.subItems.some(subItem => pathname === subItem.href));
          
          return (
            <div key={item.name}>
              <button
                onClick={() => item.subItems ? toggleSection(item.name) : null}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </div>
                {item.subItems && (
                  <svg
                    className={cn(
                      'h-4 w-4 transition-transform',
                      expandedSection === item.name ? 'rotate-180' : ''
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>
              {item.subItems && expandedSection === item.name && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        pathname === subItem.href
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <subItem.icon className="h-4 w-4" />
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <button
          onClick={() => {
            // TODO: Implement logout
            console.log('Logout clicked');
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
} 