'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Sparkles, ArrowRight, UserCheck, Shield, Mail, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, devLogin, user, loading } = useAuth();
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
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
    await handleDevLogin(customEmail, customName || customEmail.split('@')[0]);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 items-center justify-center shadow-xl shadow-indigo-600/30 mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Hairdrama Tech
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Enterprise Task Management & Collaboration Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Primary Action: Google OAuth Button */}
          <div>
            <button
              type="button"
              onClick={loginWithGoogle}
              disabled={isSubmitting || loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-2xl shadow-lg transition-all transform active:scale-[0.99] disabled:opacity-50 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span>Continue with Google OAuth 2.0</span>
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-2">
              Redirects to official Google consent screen for verified identity.
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase tracking-wider font-semibold absolute">
              Section 27 Demonstration
            </span>
          </div>

          {/* 1-Click Fast Persona Switcher for Section 27 Two-User Testing */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span>Instant Test Switcher (Two-User Demo)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDevLogin('abhishek@hairdrama.tech', 'Abhishek Verma')}
                disabled={isSubmitting}
                className="p-3 bg-slate-950/60 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/50 rounded-2xl text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300">
                    Abhishek
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                    Creator
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">abhishek@hairdrama.tech</div>
              </button>

              <button
                type="button"
                onClick={() => handleDevLogin('rahul@hairdrama.tech', 'Rahul Sharma')}
                disabled={isSubmitting}
                className="p-3 bg-slate-950/60 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/50 rounded-2xl text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-300">
                    Rahul
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    Assignee
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">rahul@hairdrama.tech</div>
              </button>
            </div>
          </div>

          {/* Custom Persona Input */}
          <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Or custom test email..."
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={isSubmitting || !customEmail}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
              >
                <span>Login</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>

        {/* Footer Security Badges */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Google OAuth 2.0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gmail API</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            <span>MongoDB Atlas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
