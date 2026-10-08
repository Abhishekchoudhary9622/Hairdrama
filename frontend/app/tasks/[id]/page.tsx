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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar onToggleSidebar={() => setMobileNavOpen(true)} />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar className="hidden lg:flex" />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tasks</span>
          </Link>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs">Loading task details...</span>
            </div>
          ) : error ? (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl text-center max-w-md mx-auto space-y-3">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="text-base font-semibold text-white">Access Denied or Not Found</h3>
              <p className="text-xs text-slate-400">{error}</p>
              <Link
                href="/dashboard"
                className="inline-block px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-white mt-2"
              >
                Go to Dashboard
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
  );
}

export default function SingleTaskPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <SingleTaskContent />
    </Suspense>
  );
}
