'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandLogo } from '@/components/ui/BrandLogo';
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Clock,
  GitFork,
  Users,
  Layers,
  Settings,
  Plus,
  HelpCircle,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onClose?: () => void;
  onCreateTask?: () => void;
}

export function Sidebar({ className = '', onClose, onCreateTask }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/tasks', icon: Briefcase },
    { name: 'Tasks', href: '/tasks?view=assigned', icon: CheckSquare },
    { name: 'Time log', href: '/dashboard?tab=time', icon: Clock },
    { name: 'Resource mgmt', href: '/settings', icon: GitFork },
    { name: 'Users', href: '/settings?tab=users', icon: Users },
    { name: 'Project template', href: '/tasks?view=created', icon: Layers },
    { name: 'Menu settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`w-56 bg-[#141414] text-white rounded-[24px] flex flex-col justify-between p-5 my-2 ml-2 select-none flex-shrink-0 shadow-xl ${className}`}
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="px-1 pt-1">
          <BrandLogo theme="dark" size="md" />
        </div>

        {/* Primary Action Button: "+ Create new project / task" */}
        <div>
          <button
            type="button"
            onClick={onCreateTask}
            className="w-full bg-white hover:bg-[#F2EFEA] text-[#1A1A1A] rounded-full py-2.5 px-3.5 font-bold text-xs flex items-center gap-2.5 transition-all shadow-md transform active:scale-95 cursor-pointer"
          >
            <span className="w-5 h-5 rounded-full bg-[#F15A24] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
              +
            </span>
            <span className="truncate">Create new task</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              (item.href === '/dashboard' && pathname === '/dashboard') ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href.split('?')[0]) && item.href !== '/settings');

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-full text-xs transition-all ${
                  isActive
                    ? 'bg-white text-[#F15A24] font-bold shadow-md'
                    : 'text-[#8E8E93] hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Help Icon */}
      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => alert('Hairdrama Support: Online 24/7. Connected to MongoDB Atlas & Flask REST API.')}
          className="w-7 h-7 rounded-full bg-[#F15A24] text-white flex items-center justify-center hover:bg-[#E04E1B] transition-transform hover:scale-105 shadow-md text-xs font-bold"
          title="Support & Info"
        >
          ?
        </button>
        <span className="text-[10px] text-white/30 font-medium">v1.2</span>
      </div>
    </aside>
  );
}
