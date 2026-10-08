'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { Search, ChevronDown, ChevronLeft, LogOut, UserCheck } from 'lucide-react';

interface NavbarProps {
  title?: string;
  onToggleSidebar?: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export function Navbar({
  title = 'Dashboard',
  onToggleSidebar,
  searchValue = '',
  onSearchChange,
}: NavbarProps) {
  const { user, logout, devLogin } = useAuth();
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  const handleSwitchUser = async (email: string, name: string) => {
    try {
      await devLogin(email, name);
      setShowSwitchMenu(false);
      window.location.reload();
    } catch (err) {
      console.error('Failed to switch user:', err);
    }
  };

  return (
    <header className="w-full pt-4 px-4 sm:px-6 pb-2 flex items-center justify-between gap-3">
      {/* Left: Back / Toggle Button & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-[#1A1A1A] flex items-center justify-center shadow-sm transition-transform active:scale-95"
          title="Toggle Navigation"
        >
          <ChevronLeft className="w-4 h-4 text-[#555]" />
        </button>

        <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right: Search, Notifications, Profile Pill */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Bar */}
        <div className="relative hidden md:flex items-center w-60 lg:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3.5 text-[#8E8E93]" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search for anything..."
            className="w-full bg-white pl-9 pr-4 py-2 rounded-full text-xs text-[#1A1A1A] placeholder-[#8E8E93] shadow-sm border border-transparent focus:outline-none focus:border-[#F15A24]/40"
          />
        </div>

        {/* Notifications Icon Pill */}
        <div className="bg-white rounded-full shadow-sm flex items-center justify-center p-0.5">
          <NotificationBell />
        </div>

        {/* User Profile Pill matching screenshot */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSwitchMenu(!showSwitchMenu)}
            className="bg-white hover:bg-[#FAFAF9] rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 flex items-center gap-2.5 shadow-sm transition-all"
          >
            {user?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}

            <div className="hidden sm:block text-left pr-1 leading-tight">
              <div className="text-xs font-bold text-[#1A1A1A] truncate max-w-[110px]">
                {user?.name || 'Alex meian'}
              </div>
              <div className="text-[10px] text-[#8E8E93] truncate max-w-[110px]">
                {user?.email === 'abhishek@hairdrama.tech'
                  ? 'Product manager'
                  : user?.email === 'rahul@hairdrama.tech'
                  ? 'Lead Engineer'
                  : 'Team Member'}
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#8E8E93]" />
          </button>

          {/* Profile Dropdown & Section 27 Quick Switcher */}
          {showSwitchMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowSwitchMenu(false)} />
              <div className="absolute right-0 mt-2 w-64 bg-white border border-[#EAE3DB] rounded-2xl shadow-xl p-2.5 z-50 divide-y divide-[#F0EAE1] text-xs">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8E8E93]">
                  Current Persona & Account
                </div>

                <div className="py-1.5 space-y-1">
                  <button
                    type="button"
                    onClick={() => handleSwitchUser('abhishek@hairdrama.tech', 'Abhishek Verma')}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                      user?.email === 'abhishek@hairdrama.tech'
                        ? 'bg-[#F15A24]/10 text-[#F15A24] font-bold'
                        : 'hover:bg-slate-50 text-[#1A1A1A]'
                    }`}
                  >
                    <div>
                      <div className="font-bold">Abhishek Verma</div>
                      <div className="text-[10px] text-[#8E8E93]">Product Manager (Creator)</div>
                    </div>
                    {user?.email === 'abhishek@hairdrama.tech' && (
                      <span className="w-2 h-2 rounded-full bg-[#F15A24]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSwitchUser('rahul@hairdrama.tech', 'Rahul Sharma')}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                      user?.email === 'rahul@hairdrama.tech'
                        ? 'bg-[#F15A24]/10 text-[#F15A24] font-bold'
                        : 'hover:bg-slate-50 text-[#1A1A1A]'
                    }`}
                  >
                    <div>
                      <div className="font-bold">Rahul Sharma</div>
                      <div className="text-[10px] text-[#8E8E93]">Lead Engineer (Assignee)</div>
                    </div>
                    {user?.email === 'rahul@hairdrama.tech' && (
                      <span className="w-2 h-2 rounded-full bg-[#F15A24]" />
                    )}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium text-xs"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
