'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { BrandLogo } from '@/components/ui/BrandLogo';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  LayoutDashboard,
  UserCheck,
  Layers,
  Clock,
  Users,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, loading, devLogin } = useAuth();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleQuickLogin = async (email: string, name: string) => {
    try {
      setLoggingIn(true);
      await devLogin(email, name);
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      setLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBE4DD] text-[#1A1A1A] flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-[#F15A24] selection:text-white">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4">
        <BrandLogo theme="light" size="md" />

        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-[#141414] hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-md flex items-center gap-2 transform active:scale-95"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleQuickLogin('abhishek@hairdrama.tech', 'Abhishek Verma')}
                className="hidden sm:inline-flex bg-white hover:bg-slate-50 text-[#1A1A1A] border border-[#DDD5CC] px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs"
              >
                Demo: Abhishek (PM)
              </button>

              <Link
                href="/login"
                className="bg-[#F15A24] hover:bg-[#E04E1B] text-white px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 transform active:scale-95"
              >
                <span>Sign In</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Hero & Dashboard Preview Card */}
      <main className="max-w-6xl w-full mx-auto my-auto py-8 sm:py-12 flex flex-col items-center text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E0D7CC] text-xs font-bold text-[#F15A24] shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next.js + Flask + MongoDB Enterprise Architecture</span>
        </div>

        {/* Hero Title */}
        <div className="max-w-3xl space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1A1A] leading-[1.1]">
            Next-generation task management for high-velocity teams.
          </h1>
          <p className="text-sm sm:text-base text-[#777] max-w-xl mx-auto leading-relaxed">
            Derived authentication, deterministic status transitions, instant in-app alerts,
            and resilient Gmail notifications built on clean three-layer architecture.
          </p>
        </div>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-[#141414] hover:bg-black text-white px-8 py-3.5 rounded-full text-sm font-bold shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-95"
          >
            <LayoutDashboard className="w-4 h-4 text-[#F15A24]" />
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#1A1A1A] border border-[#DDD5CC] px-7 py-3.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-[#555]" />
            <span>Test Two-User Flow (Sec 27)</span>
          </Link>
        </div>

        {/* Feature Highlights Pills */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl w-full text-left">
          <div className="bg-white p-4 rounded-[20px] shadow-xs border border-[#E8E2DA]">
            <div className="w-7 h-7 rounded-full bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center mb-2">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-bold text-[#1A1A1A]">Three-Layer Core</div>
            <div className="text-[11px] text-[#8E8E93] mt-0.5">Next.js, Flask & MongoDB</div>
          </div>

          <div className="bg-white p-4 rounded-[20px] shadow-xs border border-[#E8E2DA]">
            <div className="w-7 h-7 rounded-full bg-[#FFEDD5] text-[#EA580C] flex items-center justify-center mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-bold text-[#1A1A1A]">Strict Permissions</div>
            <div className="text-[11px] text-[#8E8E93] mt-0.5">Creator vs Assignee matrix</div>
          </div>

          <div className="bg-white p-4 rounded-[20px] shadow-xs border border-[#E8E2DA]">
            <div className="w-7 h-7 rounded-full bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center mb-2">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-bold text-[#1A1A1A]">State Machine</div>
            <div className="text-[11px] text-[#8E8E93] mt-0.5">TODO ➔ Progress ➔ Done</div>
          </div>

          <div className="bg-white p-4 rounded-[20px] shadow-xs border border-[#E8E2DA]">
            <div className="w-7 h-7 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-2">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-bold text-[#1A1A1A]">Gmail & Alerts</div>
            <div className="text-[11px] text-[#8E8E93] mt-0.5">Non-blocking resilient email</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto border-t border-[#DDD5CC] py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8E8E93] gap-2">
        <div>&copy; 2026 Hairdrama Tech. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-[#1A1A1A] transition-colors">Dashboard</Link>
          <Link href="/login" className="hover:text-[#1A1A1A] transition-colors">Sign In</Link>
          <Link href="/tasks" className="hover:text-[#1A1A1A] transition-colors">Tasks</Link>
          <Link href="/settings" className="hover:text-[#1A1A1A] transition-colors">Settings</Link>
        </div>
      </footer>
    </div>
  );
}
