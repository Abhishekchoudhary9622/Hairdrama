'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { API_BASE_URL } from '@/lib/constants';
import { Settings, Shield, Server, Database, Mail, CheckCircle2, UserCheck } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [apiHealth, setApiHealth] = useState<any>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function checkHealth() {
      try {
        setCheckingHealth(true);
        const res = await fetch(`${API_BASE_URL}/health`);
        const data = await res.json();
        setApiHealth(data);
      } catch (err: any) {
        setApiHealth({ status: 'unreachable', error: err.message });
      } finally {
        setCheckingHealth(false);
      }
    }
    checkHealth();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onToggleSidebar={() => setMobileNavOpen(true)} />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar className="hidden lg:flex" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-extrabold text-white tracking-tight">System Settings</h1>
          </div>

          {/* Profile Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              User Profile
            </h2>
            <div className="flex items-center gap-4">
              {user?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl border border-slate-700 bg-slate-800"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl font-bold text-white">
                  {user?.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{user?.name}</h3>
                <p className="text-xs text-slate-400">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authenticated Session</span>
                </div>
              </div>
            </div>
          </div>

          {/* Backend & Database Health */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              System Health & Diagnostics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center gap-3">
                <Server className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <div className="text-slate-400">Flask Backend</div>
                  <div className="font-semibold text-white">
                    {checkingHealth ? 'Checking...' : apiHealth?.status || 'Unknown'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center gap-3">
                <Database className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-slate-400">MongoDB Persistence</div>
                  <div className="font-semibold text-white">
                    {apiHealth?.database_mock ? 'In-Memory (mongomock)' : 'Connected (PyMongo)'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-center gap-3">
                <Mail className="w-5 h-5 text-violet-400 flex-shrink-0" />
                <div>
                  <div className="text-slate-400">Gmail API Dispatcher</div>
                  <div className="font-semibold text-white">Resilient Async</div>
                </div>
              </div>
            </div>
          </div>

          {/* Architecture Philosophy Breakdown */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs text-slate-400 leading-relaxed">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Three-Layer Architecture Review
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong className="text-slate-200">Presentation Layer:</strong> Next.js App Router, TypeScript, Tailwind CSS, Lucide icons, centralized API client.
              </li>
              <li>
                <strong className="text-slate-200">Business / Application Layer:</strong> Flask REST API, authentication middleware, permission matrices, state machine validator.
              </li>
              <li>
                <strong className="text-slate-200">Data Access / Repository Layer:</strong> UserRepository, TaskRepository, NotificationRepository, ActivityRepository over MongoDB.
              </li>
              <li>
                <strong className="text-slate-200">Decoupled Email Service:</strong> Gmail API is cleanly separated so database operations succeed even if external email delivery encounters intermittent network failures.
              </li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
