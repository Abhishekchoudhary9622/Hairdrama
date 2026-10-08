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
import { Task, TaskStatus } from '@/types/task';
import { isOverdue } from '@/lib/utils';
import {
  Plus,
  Inbox,
  Kanban,
  LayoutGrid,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

function TasksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const initialView = (searchParams.get('view') as any) || 'assigned';
  const initialStatus = searchParams.get('status') || '';

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
  } = useTasks({
    view: initialView,
    status: initialStatus,
  });

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'board' | 'grid'>('board');

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

  // Filter by local search query if typed
  const displayedTasks = tasks.filter((t) => {
    if (!searchQuery) return true;
    return (
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Separate tasks by workflow status
  const todoTasks = displayedTasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = displayedTasks.filter((t) => t.status === 'IN_PROGRESS');
  const completedTasks = displayedTasks.filter((t) => t.status === 'COMPLETED');
  const overdueTasks = displayedTasks.filter((t) => isOverdue(t.due_date, t.status));

  // Determine dynamic title
  let pageTitle = 'All Deliverables';
  let pageSubtitle = 'All deliverables and roadmap items across the team.';
  if (filters.view === 'assigned' || (!filters.view && !filters.status)) {
    pageTitle = 'My Tasks';
    pageSubtitle = 'Tasks assigned to you that require your active execution or review.';
  } else if (filters.view === 'created') {
    pageTitle = 'Created by Me';
    pageSubtitle = 'Tasks and deliverables you initiated and delegated.';
  } else if (filters.status === 'COMPLETED') {
    pageTitle = 'Completed Tasks';
    pageSubtitle = 'Successfully delivered and approved work items.';
  } else if (filters.status === 'IN_PROGRESS') {
    pageTitle = 'Active / In Progress';
    pageSubtitle = 'Workstreams currently in execution.';
  } else if (filters.status === 'TODO') {
    pageTitle = 'To Do Deliverables';
    pageSubtitle = 'Pending backlog awaiting kickoff.';
  } else if (filters.status === 'OVERDUE') {
    pageTitle = 'Overdue Tasks';
    pageSubtitle = 'Tasks that have exceeded their target deadline.';
  }

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
            title={pageTitle}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            onToggleSidebar={() => setMobileNavOpen(true)}
          />

          <main className="p-4 sm:p-6 space-y-5">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/70 backdrop-blur-sm p-5 rounded-[24px] border border-[#E8E1D9] shadow-xs">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
                  {pageTitle}
                </h1>
                <p className="text-xs sm:text-sm text-[#777] mt-0.5">
                  {pageSubtitle}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* View Mode Toggle (Board vs Grid) */}
                <div className="bg-[#F7F2EC] p-1 rounded-full border border-[#E5DDD2] flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('board')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'board'
                        ? 'bg-[#141414] text-white shadow-xs'
                        : 'text-[#777] hover:text-[#1A1A1A]'
                    }`}
                    title="Kanban Board View (Separated by Status Columns)"
                  >
                    <Kanban className="w-3.5 h-3.5" />
                    <span>Board</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-[#141414] text-white shadow-xs'
                        : 'text-[#777] hover:text-[#1A1A1A]'
                    }`}
                    title="Grid / List View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>List</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F15A24] hover:bg-[#E04E1B] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer transform active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Task</span>
                </button>
              </div>
            </div>

            {/* Quick Status Segment Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-[22px] border border-[#E8E1D9] shadow-xs">
              {/* Ownership Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {[
                  { id: 'assigned', label: 'Assigned To Me' },
                  { id: 'created', label: 'Created By Me' },
                  { id: 'all', label: 'All Deliverables' },
                ].map((tab) => {
                  const isSelected = (filters.view || 'assigned') === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFilters({ ...filters, view: tab.id as any })}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#141414] text-white shadow-xs'
                          : 'bg-[#F7F2EC] text-[#777] hover:text-[#1A1A1A]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Status Filter Pills with Counts */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {[
                  { id: '', label: 'All', count: displayedTasks.length, color: 'bg-slate-100 text-slate-700' },
                  { id: 'TODO', label: 'To Do', count: todoTasks.length, color: 'bg-slate-100 text-slate-700' },
                  { id: 'IN_PROGRESS', label: 'Active', count: inProgressTasks.length, color: 'bg-[#FFE8D6] text-[#E65100]' },
                  { id: 'COMPLETED', label: 'Done', count: completedTasks.length, color: 'bg-[#E6F7EC] text-[#1E8E3E]' },
                  { id: 'OVERDUE', label: 'Overdue', count: overdueTasks.length, color: 'bg-[#FCE8E6] text-[#D93025]' },
                ].map((pill) => {
                  const isSelected = (filters.status || '') === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => setFilters({ ...filters, status: pill.id })}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#F15A24] text-white shadow-xs'
                          : 'bg-[#F7F2EC] text-[#666] hover:text-[#1A1A1A]'
                      }`}
                    >
                      <span>{pill.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? 'bg-white/20 text-white' : pill.color
                        }`}
                      >
                        {pill.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Dropdowns (Search, Priority) */}
            <TaskFilters filters={filters} onChange={setFilters} />

            {/* Content Area */}
            {tasksLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
                <div className="w-6 h-6 border-2 border-[#F15A24] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs">Loading tasks...</span>
              </div>
            ) : displayedTasks.length === 0 ? (
              <div className="bg-white border border-[#E8E1D9] rounded-[28px] p-12 text-center space-y-3 shadow-xs">
                <Inbox className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-[#1A1A1A]">No tasks match your selected view</h3>
                <p className="text-xs text-[#8E8E93] max-w-sm mx-auto">
                  Try switching to &quot;All Deliverables&quot; or clearing your active filters.
                </p>
              </div>
            ) : viewMode === 'board' ? (
              /* KANBAN BOARD VIEW: 3 Dedicated Workflow Columns */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
                {/* Column 1: To Do */}
                <div className="bg-[#F3EFE9] border border-[#E5DDD2] rounded-[24px] p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E0D7CC]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-slate-400" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                        To Do
                      </h2>
                    </div>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white text-[#555] border border-[#DDD5CC]">
                      {todoTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                    {todoTasks.length === 0 ? (
                      <div className="py-8 text-center text-[11px] text-[#8E8E93] bg-white/50 rounded-2xl border border-dashed border-[#DDD5CC]">
                        No pending to-do tasks
                      </div>
                    ) : (
                      todoTasks.map((task) => (
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
                      ))
                    )}
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="bg-[#FFF4EC] border border-[#FCDCC9] rounded-[24px] p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F7CDB4]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#E65100] animate-pulse" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#E65100]">
                        In Progress
                      </h2>
                    </div>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white text-[#E65100] border border-[#F7CDB4]">
                      {inProgressTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                    {inProgressTasks.length === 0 ? (
                      <div className="py-8 text-center text-[11px] text-[#8E8E93] bg-white/50 rounded-2xl border border-dashed border-[#F7CDB4]">
                        No tasks currently in progress
                      </div>
                    ) : (
                      inProgressTasks.map((task) => (
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
                      ))
                    )}
                  </div>
                </div>

                {/* Column 3: Completed */}
                <div className="bg-[#EBF7EF] border border-[#D0EED9] rounded-[24px] p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#C0E7CC]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#1E8E3E]" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E8E3E]">
                        Completed
                      </h2>
                    </div>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white text-[#1E8E3E] border border-[#C0E7CC]">
                      {completedTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                    {completedTasks.length === 0 ? (
                      <div className="py-8 text-center text-[11px] text-[#8E8E93] bg-white/50 rounded-2xl border border-dashed border-[#C0E7CC]">
                        No completed tasks in this view
                      </div>
                    ) : (
                      completedTasks.map((task) => (
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
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* GRID VIEW: Organized with Status Section Headers */
              <div className="space-y-6">
                {inProgressTasks.length > 0 && (!filters.status || filters.status === 'IN_PROGRESS') && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#E65100]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E65100]" />
                      <span>In Progress ({inProgressTasks.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {inProgressTasks.map((task) => (
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
                  </div>
                )}

                {todoTasks.length > 0 && (!filters.status || filters.status === 'TODO' || filters.status === 'OVERDUE') && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#1A1A1A]">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <span>To Do Deliverables ({todoTasks.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {todoTasks.map((task) => (
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
                  </div>
                )}

                {completedTasks.length > 0 && (!filters.status || filters.status === 'COMPLETED') && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-[#1E8E3E]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1E8E3E]" />
                      <span>Completed ({completedTasks.length})</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {completedTasks.map((task) => (
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
                  </div>
                )}
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
