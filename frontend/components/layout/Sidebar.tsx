'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import {
  LayoutDashboard,
  CheckSquare,
  Layers,
  CheckCircle2,
  Settings,
  Plus,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
  onCreateTask?: () => void;
}

function SidebarNavList({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view');
  const currentStatus = searchParams.get('status');

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', href: '/tasks?view=assigned', icon: CheckSquare },
    { name: 'All Tasks', href: '/tasks?view=all', icon: Layers },
    { name: 'Completed', href: '/tasks?status=COMPLETED&view=all', icon: CheckCircle2 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="space-y-1.5">
      {navItems.map((item) => {
        let isActive = false;
        if (item.href === '/dashboard') {
          isActive = pathname === '/dashboard';
        } else if (item.href === '/settings') {
          isActive = pathname.startsWith('/settings');
        } else if (pathname === '/tasks') {
          if (item.href === '/tasks?view=assigned') {
            isActive = (currentView === 'assigned' && !currentStatus) || (!currentView && !currentStatus);
          } else if (item.href === '/tasks?view=all') {
            isActive = currentView === 'all' && !currentStatus;
          } else if (item.href === '/tasks?status=COMPLETED') {
            isActive = currentStatus === 'COMPLETED';
          }
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-full text-xs transition-all ${
              isActive
                ? 'bg-white text-[#F15A24] font-bold shadow-md'
                : 'text-[#8E8E93] hover:text-white hover:bg-white/5 font-medium'
            }`}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar({ className = '', onClose, onCreateTask }: SidebarProps) {
  return (
    <aside
      className={`w-60 bg-[#141414] text-white rounded-[24px] flex flex-col justify-between p-5 my-2 ml-2 select-none flex-shrink-0 shadow-xl ${className}`}
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-1 pt-1">
          <BrandLogo theme="dark" size="md" />
        </div>

        {/* Primary "+ Create Task" Button */}
        <div>
          <button
            type="button"
            onClick={onCreateTask}
            className="w-full bg-[#F15A24] hover:bg-[#E04E1B] text-white rounded-full py-2.5 px-4 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/25 transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>
        </div>

        {/* Navigation Items */}
        <Suspense fallback={<nav className="space-y-1.5" />}>
          <SidebarNavList onClose={onClose} />
        </Suspense>
      </div>

      {/* Footer System Status Info */}
      <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] text-white/50 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-white/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>MongoDB & Flask API</span>
        </div>
        <p className="leading-tight text-white/40">
          Creator & Assignee permissions enforced.
        </p>
      </div>
    </aside>
  );
}
