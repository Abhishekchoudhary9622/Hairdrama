'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Navbar } from '@/components/layout/Navbar';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { TaskSummaryTable } from '@/components/dashboard/TaskSummaryTable';
import { TodayTaskList } from '@/components/dashboard/TodayTaskList';
import { OverallProgressGauge } from '@/components/dashboard/OverallProgressGauge';
import { WorkloadChart } from '@/components/dashboard/WorkloadChart';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskDetails } from '@/components/tasks/TaskDetails';
import { Task } from '@/types/task';

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
          <span className="text-xs font-semibold text-[#1A1A1A]">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery) return true;
    return (
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-[#EBE4DD] p-2 sm:p-4 lg:p-6 flex items-center justify-center">
      {/* Outer Enclosing Container matching the tablet-frame aesthetic */}
      <div className="w-full max-w-[1560px] bg-[#F7F2EC] border border-[#E5DDD2] rounded-[28px] sm:rounded-[36px] shadow-2xl flex overflow-hidden min-h-[92vh]">
        {/* Dark Left Sidebar */}
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
          {/* Header */}
          <Navbar
            title="Dashboard"
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSidebar={() => setMobileNavOpen(true)}
          />

          {/* Dashboard Body */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Top Overview 4 Metric Cards */}
            <OverviewCards stats={stats} />

            {/* Split 2-Column Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Project Summary Table & Today Task (7 of 12 cols) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-5">
                <TaskSummaryTable
                  tasks={filteredTasks}
                  onSelectTask={(t) => setSelectedTask(t)}
                  statusFilter={filters.status}
                  onStatusFilterChange={(val) => setFilters({ ...filters, status: val })}
                />

                <TodayTaskList
                  tasks={filteredTasks}
                  onSelectTask={(t) => setSelectedTask(t)}
                  onToggleStatus={async (id) => {
                    const task = tasks.find((t) => t.id === id);
                    if (task) {
                      const next = task.status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
                      await updateStatus(id, next);
                    }
                  }}
                />
              </div>

              {/* Right Column: Overall Progress Speedometer & Projects Workload (5 of 12 cols) */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-5">
                <OverallProgressGauge stats={stats} />

                <WorkloadChart />
              </div>
            </div>
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
