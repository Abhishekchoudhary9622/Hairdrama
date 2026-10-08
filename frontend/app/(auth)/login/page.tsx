'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { UserCheck, Shield, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, devLogin, user, loading } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleDevLogin = async (email: string, name: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await devLogin(email, name);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    await handleDevLogin(customEmail, customEmail.split('@')[0]);
  };

  return (
    <div className="min-h-screen bg-[#EBE4DD] flex flex-col justify-center items-center px-4 py-8 relative selection:bg-[#F15A24] selection:text-white">
      {/* Outer Card Container */}
      <div className="w-full max-w-md bg-white border border-[#E5DDD2] rounded-[32px] p-6 sm:p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandLogo theme="light" size="lg" />
          <p className="text-xs text-[#8E8E93] font-medium pt-1">
            Enterprise Task Management & Productivity
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Primary Action: Google OAuth Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={loginWithGoogle}
            disabled={isSubmitting || loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-[#141414] hover:bg-black text-white font-bold rounded-full shadow-md transition-all transform active:scale-95 disabled:opacity-50 text-xs sm:text-sm cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
          <p className="text-[10px] text-[#8E8E93] text-center">
            Secured via Google OAuth 2.0 verified identity
          </p>
        </div>

        {/* Section 27 Demo Switcher Separator */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-[#F0EAE1] w-full" />
          <span className="bg-white px-3 text-[10px] text-[#8E8E93] uppercase tracking-wider font-bold absolute">
            Section 27 Demonstration
          </span>
        </div>

        {/* Two-User Quick Test Cards */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-[#1A1A1A] flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-[#F15A24]" />
            <span>Instant Test Personas (1-Click Switch)</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Account A: Abhishek Verma */}
            <button
              type="button"
              onClick={() => handleDevLogin('abhishek@hairdrama.tech', 'Abhishek Verma')}
              disabled={isSubmitting}
              className="p-3 bg-[#FBF8F4] hover:bg-[#F5EFE9] border border-[#E8E1D9] hover:border-[#F15A24]/40 rounded-[20px] text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#F15A24] transition-colors">
                  Abhishek
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#FFF0E6] text-[#E65100] font-bold">
                  Creator
                </span>
              </div>
              <div className="text-[10px] text-[#8E8E93] truncate">abhishek@hairdrama.tech</div>
            </button>

            {/* Account B: Rahul Sharma */}
            <button
              type="button"
              onClick={() => handleDevLogin('rahul@hairdrama.tech', 'Rahul Sharma')}
              disabled={isSubmitting}
              className="p-3 bg-[#FBF8F4] hover:bg-[#F5EFE9] border border-[#E8E1D9] hover:border-[#22C55E]/40 rounded-[20px] text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#16A34A] transition-colors">
                  Rahul
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#E6F7EC] text-[#1E8E3E] font-bold">
                  Assignee
                </span>
              </div>
              <div className="text-[10px] text-[#8E8E93] truncate">rahul@hairdrama.tech</div>
            </button>
          </div>
        </div>

        {/* Custom Email Fast Entry */}
        <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-[#F5EFE9] space-y-2">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Or custom test email..."
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              className="flex-1 px-3.5 py-2 bg-[#F7F2EC] border border-[#E5DDD2] rounded-full text-xs text-[#1A1A1A] placeholder-[#8E8E93] focus:outline-none focus:border-[#F15A24]"
            />
            <button
              type="submit"
              disabled={isSubmitting || !customEmail}
              className="px-4 py-2 bg-[#F15A24] hover:bg-[#E04E1B] disabled:opacity-50 text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>Login</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </form>

        {/* Bottom System Certifications */}
        <div className="pt-2 border-t border-[#F5EFE9] flex items-center justify-center gap-4 text-[10px] text-[#8E8E93]">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#F15A24]" />
            <span>Google OAuth</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="w-3 h-3 text-[#22C55E]" />
            <span>Gmail API</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#2563EB]" />
            <span>MongoDB Atlas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
