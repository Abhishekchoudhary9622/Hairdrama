'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskDetails } from '@/components/tasks/TaskDetails';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { Task } from '@/types/task';
import { Plus, CheckSquare, Inbox } from 'lucide-react';

function TasksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const initialView = (searchParams.get('view') as any) || 'all';
  const initialStatus = searchParams.get('status') || '';

  const {
    tasks,
    loading: tasksLoading,
    filters,
    setFilters,
    createTask,
    updateStatus,
    reassignTask,
    deleteTask,
  } = useTasks({
    view: initialView,
    status: initialStatus,
  });

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || (!user && typeof window !== 'undefined')) {
    return (
      <div className="min-h-screen bg-[#EBE4DD] flex items-center justify-center text-[#8E8E93]">
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm">
          <div className="w-4 h-4 border-2 border-[#F15A24] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#1A1A1A]">Loading tasks...</span>
        </div>
      </div>
    );
  }

  const displayedTasks = tasks.filter((t) => {
    if (!searchQuery) return true;
    return (
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#EBE4DD] p-2 sm:p-4 lg:p-6 flex items-center justify-center">
      <div className="w-full max-w-[1560px] bg-[#F7F2EC] border border-[#E5DDD2] rounded-[28px] sm:rounded-[36px] shadow-2xl flex overflow-hidden min-h-[92vh]">
        <Sidebar
          className="hidden lg:flex"
          onCreateTask={() => setCreateModalOpen(true)}
        />
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <Navbar
            title="All Tasks"
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSidebar={() => setMobileNavOpen(true)}
          />

          <main className="p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#1A1A1A] tracking-tight">
                  Task Deliverables
                </h2>
                <p className="text-xs text-[#8E8E93] mt-0.5">
                  Filter, assign, and track project tasks with deterministic state machines.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F15A24] hover:bg-[#E04E1B] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>

            <TaskFilters filters={filters} onChange={setFilters} />

            {tasksLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
                <div className="w-6 h-6 border-2 border-[#F15A24] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Loading task collection...</span>
              </div>
            ) : displayedTasks.length === 0 ? (
              <div className="bg-white border border-[#E8E1D9] rounded-[28px] p-12 text-center space-y-3">
                <Inbox className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-[#1A1A1A]">No tasks found</h3>
                <p className="text-xs text-[#8E8E93] max-w-sm mx-auto">
                  No tasks match your selected view or search criteria.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayedTasks.map((task) => (
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
          </main>
        </div>
      </div>

      <TaskForm
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={async (data) => {
          await createTask(data);
        }}
      />

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

export default function TasksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EBE4DD]" />}>
      <TasksContent />
    </Suspense>
  );
}
