'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskDetails } from '@/components/tasks/TaskDetails';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { Task, TaskStatus } from '@/types/task';
import {
  Plus,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  Inbox,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    tasks,
    stats,
    loading: tasksLoading,
    filters,
    setFilters,
    createTask,
    updateStatus,
    reassignTask,
    deleteTask,
  } = useTasks();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || (!user && typeof window !== 'undefined')) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Verifying authenticated session...</span>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: Layers,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'To Do',
      value: stats.todo,
      icon: Calendar,
      color: 'text-slate-300',
      bg: 'bg-slate-800/50 border-slate-700/60',
    },
    {
      title: 'Active / In Progress',
      value: stats.in_progress,
      icon: Clock,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Done / Completed',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <Navbar onToggleSidebar={() => setMobileNavOpen(true)} />
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:flex" />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Good morning, {user?.name.split(' ')[0]} 👋
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Here is your project workflow overview and pending deliverables.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {statCards.map((c) => (
              <div
                key={c.title}
                className={`p-4 rounded-2xl border ${c.bg} flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-400 truncate">{c.title}</span>
                  <c.icon className={`w-4 h-4 ${c.color}`} />
                </div>
                <div className={`text-2xl sm:text-3xl font-extrabold ${c.color}`}>
                  {c.value}
                </div>
              </div>
            ))}
          </div>

          {/* Task Management Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight">Tasks</h2>
              <span className="text-xs text-slate-400">{tasks.length} tasks found</span>
            </div>

            {/* Filters */}
            <TaskFilters filters={filters} onChange={setFilters} />

            {/* Task Grid */}
            {tasksLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Loading task collection...</span>
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center space-y-3">
                <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-slate-300">No tasks found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No tasks matched your current filter or view criteria. Create a new task or adjust your filters above.
                </p>
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 mt-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create First Task</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    currentUser={user}
                    onSelectTask={(t) => setSelectedTask(t)}
                    onStatusChange={async (id, status) => {
                      await updateStatus(id, status);
                    }}
                    onDeleteTask={async (id) => {
                      await deleteTask(id);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Task Creation Modal */}
      <TaskForm
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={async (data) => {
          await createTask(data);
        }}
      />

      {/* Task Details & Activity Modal */}
      <TaskDetails
        task={selectedTask}
        currentUser={user}
        onClose={() => setSelectedTask(null)}
        onStatusChange={async (id, status) => {
          const updated = await updateStatus(id, status);
          if (updated) setSelectedTask(updated);
        }}
        onReassign={async (id, assigneeId) => {
          const updated = await reassignTask(id, assigneeId);
          if (updated) setSelectedTask(updated);
        }}
        onDelete={async (id) => {
          await deleteTask(id);
          setSelectedTask(null);
        }}
      />
    </div>
  );
}
