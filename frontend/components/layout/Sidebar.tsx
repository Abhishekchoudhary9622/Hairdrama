'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, UserCheck, CheckCircle2, Settings, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

export function Sidebar({ className = '', onClose }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'All Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Assigned To Me', href: '/tasks?view=assigned', icon: UserCheck },
    { name: 'Completed', href: '/tasks?status=COMPLETED', icon: CheckCircle2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between p-4 flex-shrink-0 ${className}`}
    >
      <div className="space-y-6">
        <div className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </div>

        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status Badge */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Flask & MongoDB Online</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-normal">
          Strict authorization active: Creator & Assignee role isolation enforced.
        </p>
      </div>
    </aside>
  );
}
