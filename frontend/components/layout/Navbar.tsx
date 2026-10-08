'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { LogOut, Sparkles, UserCheck, Shield, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout, devLogin } = useAuth();
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  const handleSwitchUser = async (email: string, name: string) => {
    try {
      await devLogin(email, name);
      setShowSwitchMenu(false);
      window.location.reload();
    } catch (err) {
      console.error('Failed to switch persona:', err);
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile menu toggle & Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle navigation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                Hairdrama Tech
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Task Manager
              </span>
            </div>
          </div>
        </div>

        {/* Right: Notifications, Quick User Switcher, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Section 27 Two-User Demo Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSwitchMenu(!showSwitchMenu)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-950/80 border border-indigo-700/50 text-indigo-300 text-xs font-semibold transition-colors"
              title="Test Section 27 Two-User flow (Abhishek & Rahul)"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Persona: {user?.name.split(' ')[0] || 'Switch'}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showSwitchMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSwitchMenu(false)} />
                <div className="absolute right-0 mt-1.5 w-60 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-2 z-50 divide-y divide-slate-800 text-xs">
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Test Account (Sec 27)
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => handleSwitchUser('abhishek@hairdrama.tech', 'Abhishek Verma')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-white">Abhishek Verma</div>
                        <div className="text-[10px] text-slate-400">abhishek@hairdrama.tech (Creator)</div>
                      </div>
                      {user?.email === 'abhishek@hairdrama.tech' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchUser('rahul@hairdrama.tech', 'Rahul Sharma')}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-white">Rahul Sharma</div>
                        <div className="text-[10px] text-slate-400">rahul@hairdrama.tech (Assignee)</div>
                      </div>
                      {user?.email === 'rahul@hairdrama.tech' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Notifications */}
          <NotificationBell />

          {/* User Profile Avatar */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              {user.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-slate-700 bg-slate-800"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                  {user.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {user.email}
                </div>
              </div>

              <button
                type="button"
                onClick={() => logout()}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors ml-1"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
