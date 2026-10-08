'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { API_BASE_URL } from '@/lib/constants';
import { Server, Database, Mail, CheckCircle2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#EBE4DD] p-2 sm:p-4 lg:p-6 flex items-center justify-center">
      <div className="w-full max-w-[1560px] bg-[#F7F2EC] border border-[#E5DDD2] rounded-[28px] sm:rounded-[36px] shadow-2xl flex overflow-hidden min-h-[92vh]">
        <Sidebar className="hidden lg:flex" />
        <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <Navbar title="Menu Settings" onToggleSidebar={() => setMobileNavOpen(true)} />

          <main className="p-4 sm:p-6 space-y-6 max-w-4xl">
            {/* User Profile Card */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E8E1D9] space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">
                User Profile
              </h2>
              <div className="flex items-center gap-4">
                {user?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover border border-[#DDD5CC]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#141414] text-white flex items-center justify-center text-xl font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-extrabold text-[#1A1A1A]">{user?.name}</h3>
                  <p className="text-xs text-[#8E8E93]">{user?.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#E6F7EC] text-[#1E8E3E] text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Authenticated Session Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health Diagnostics */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E8E1D9] space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">
                System Health & Diagnostics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 bg-[#FBF8F4] rounded-[20px] border border-[#E8E1D9] flex items-center gap-3">
                  <Server className="w-5 h-5 text-[#F15A24] flex-shrink-0" />
                  <div>
                    <div className="text-[#8E8E93]">Flask REST API</div>
                    <div className="font-bold text-[#1A1A1A]">
                      {checkingHealth ? 'Checking...' : apiHealth?.status || 'Active'}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#FBF8F4] rounded-[20px] border border-[#E8E1D9] flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#16A34A] flex-shrink-0" />
                  <div>
                    <div className="text-[#8E8E93]">MongoDB Persistence</div>
                    <div className="font-bold text-[#1A1A1A]">
                      {apiHealth?.database_mock ? 'In-Memory (mongomock)' : 'Connected (PyMongo)'}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#FBF8F4] rounded-[20px] border border-[#E8E1D9] flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
                  <div>
                    <div className="text-[#8E8E93]">Gmail API Dispatch</div>
                    <div className="font-bold text-[#1A1A1A]">Resilient Async</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Three Layer Architecture Summary */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E8E1D9] space-y-3 text-xs text-[#555] leading-relaxed">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                System Architecture Specification
              </h2>
              <ul className="space-y-1.5 list-disc list-inside">
                <li><strong className="text-[#1A1A1A]">Presentation Layer:</strong> Next.js App Router, TypeScript, Tailwind CSS, customized after Promage UI design tokens.</li>
                <li><strong className="text-[#1A1A1A]">Business / Application Layer:</strong> Flask REST API, authentication middleware, permission matrices, state machine validator.</li>
                <li><strong className="text-[#1A1A1A]">Repository Layer:</strong> UserRepository, TaskRepository, NotificationRepository, ActivityRepository over MongoDB.</li>
                <li><strong className="text-[#1A1A1A]">Gmail Service:</strong> Decoupled email delivery ensuring database actions never fail if external SMTP encounters delays.</li>
              </ul>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
