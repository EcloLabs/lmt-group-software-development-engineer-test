'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Package } from 'lucide-react';

const navItems = [
  {
    href: '/dashboard',
    label: 'Tableau de bord',
    icon: LayoutDashboard,
  },
  {
    href: '/articles',
    label: 'Articles',
    icon: Package,
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 py-4 border-b-2 transition-colors',
                  isActive
                    ? 'border-slate-900 text-slate-900 font-medium'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
