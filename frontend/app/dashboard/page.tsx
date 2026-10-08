'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Navbar } from '@/components/layout/Navbar';
import { StatCardsSection } from '@/components/dashboard/StatCardsSection';
import { MyTasksSection } from '@/components/dashboard/MyTasksSection';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskDetails } from '@/components/tasks/TaskDetails';
import { Task } from '@/types/task';
import { Plus } from 'lucide-react';

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
  } = useTasks({ view: 'assigned' });

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
      <div className="min-h-screen bg-[#EBE4DD] flex items-center justify-center text-[#8E8E93]">
        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-full shadow-sm">
          <div className="w-4 h-4 border-2 border-[#F15A24] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-[#1A1A1A]">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const handleStatFilterClick = (statusKey: string) => {
    if (statusKey === 'OVERDUE') {
      setFilters((prev) => ({
        ...prev,
        status: 'OVERDUE',
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        status: statusKey,
      }));
    }
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'Abhishek';

  return (
    <div className="min-h-screen bg-[#EBE4DD] p-2 sm:p-4 lg:p-6 flex items-center justify-center">
      {/* Outer Enclosing Container matching the tablet-frame aesthetic */}
      <div className="w-full max-w-[1560px] bg-[#F7F2EC] border border-[#E5DDD2] rounded-[28px] sm:rounded-[36px] shadow-2xl flex overflow-hidden min-h-[92vh]">
        {/* Dark Left Sidebar (Section 19: Dashboard, My Tasks, Assigned, Completed, Settings) */}
        <Sidebar
          className="hidden lg:flex"
          onCreateTask={() => setCreateModalOpen(true)}
        />
        <MobileNav
          isOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />

        {/* Main Content Dashboard Area */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Header (Section 19: Logo, Search, Notifications, Profile) */}
          <Navbar
            title="Dashboard"
            searchValue={filters.search || ''}
            onSearchChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
            onToggleSidebar={() => setMobileNavOpen(true)}
          />

          {/* Dashboard Body */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Section 19: Greeting Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/70 backdrop-blur-sm p-5 sm:p-6 rounded-[24px] border border-[#E8E1D9] shadow-xs">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
                  Good morning, {firstName} 👋
                </h1>
                <p className="text-xs sm:text-sm text-[#777] mt-1 font-medium">
                  Here is an overview of your team deliverables, active workflows, and deadlines.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#F15A24] hover:bg-[#E04E1B] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all transform active:scale-95 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Task</span>
              </button>
            </div>

            {/* Section 19: 5 Stat Cards (Row 1: Total 24, To Do 8, Active 6; Row 2: Done 10, Overdue 2) */}
            <StatCardsSection
              stats={stats}
              onFilterClick={handleStatFilterClick}
            />

            {/* Section 19 & 20: My Tasks Section with Filters, Search, Tabs & Task Items */}
            <MyTasksSection
              tasks={tasks}
              currentUser={user}
              filters={filters}
              onFilterChange={setFilters}
              onCreateTask={() => setCreateModalOpen(true)}
              onSelectTask={(task) => setSelectedTask(task)}
              onStatusChange={async (taskId, status) => {
                await updateStatus(taskId, status);
              }}
              onDeleteTask={async (taskId) => {
                await deleteTask(taskId);
              }}
            />
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      <TaskForm
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={async (data) => {
          await createTask(data);
        }}
      />

      {/* Task Details & Activity History Audit Trail Modal */}
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
