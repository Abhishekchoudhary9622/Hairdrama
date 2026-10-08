'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { Task, TaskStatus } from '@/types/task';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { TaskDetails } from '@/components/tasks/TaskDetails';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function SingleTaskContent() {
  const params = useParams();
  const router = useRouter();
  const taskId = params?.id as string;
  const { user, loading: authLoading } = useAuth();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadTask() {
      if (!taskId) return;
      try {
        setLoading(true);
        setError(null);
        const data = await api.getTaskById(taskId);
        setTask(data);
      } catch (err: any) {
        setError(err.message || 'Unable to load task');
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      loadTask();
    }
  }, [taskId, user]);

  return (
    <div className="min-h-screen bg-[#EBE4DD] p-2 sm:p-4 lg:p-6 flex items-center justify-center">
      <div className="w-full max-w-[1560px] bg-[#F7F2EC] border border-[#E5DDD2] rounded-[28px] sm:rounded-[36px] shadow-2xl flex overflow-hidden min-h-[92vh]">
        <Sidebar className="hidden lg:flex" />
        <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <Navbar title="Task Details" onToggleSidebar={() => setMobileNavOpen(true)} />

          <main className="p-4 sm:p-6 space-y-6">
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#8E8E93] hover:text-[#1A1A1A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Tasks</span>
            </Link>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
                <div className="w-6 h-6 border-2 border-[#F15A24] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Loading task details...</span>
              </div>
            ) : error ? (
              <div className="p-8 bg-white border border-[#E8E1D9] rounded-[28px] text-center max-w-md mx-auto space-y-3">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <h3 className="text-sm font-bold text-[#1A1A1A]">Access Denied or Not Found</h3>
                <p className="text-xs text-[#8E8E93]">{error}</p>
                <Link
                  href="/dashboard"
                  className="inline-block px-5 py-2 bg-[#141414] hover:bg-black text-xs font-bold rounded-full text-white mt-2"
                >
                  Return to Dashboard
                </Link>
              </div>
            ) : task ? (
              <TaskDetails
                task={task}
                currentUser={user}
                onClose={() => router.push('/tasks')}
                onStatusChange={async (id: string, status: TaskStatus) => {
                  const updated = await api.updateTaskStatus(id, status);
                  setTask(updated);
                }}
                onReassign={async (id: string, newAssigneeId: string) => {
                  const updated = await api.assignTask(id, newAssigneeId);
                  setTask(updated);
                }}
                onDelete={async (id: string) => {
                  await api.deleteTask(id);
                  router.push('/tasks');
                }}
              />
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function SingleTaskPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EBE4DD]" />}>
      <SingleTaskContent />
    </Suspense>
  );
}
