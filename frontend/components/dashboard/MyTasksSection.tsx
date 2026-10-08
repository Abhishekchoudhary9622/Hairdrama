'use client';

import React from 'react';
import { Task, TaskStatus, TaskFiltersState } from '@/types/task';
import { User } from '@/types/user';
import { TaskStatusBadge, TaskPriorityBadge } from '@/components/tasks/TaskStatusBadge';
import { formatDate, isOverdue } from '@/lib/utils';
import {
  Plus,
  Search,
  Calendar,
  User as UserIcon,
  Play,
  CheckCircle2,
  RotateCcw,
  ExternalLink,
  X,
  Inbox,
  Trash2,
} from 'lucide-react';

interface MyTasksSectionProps {
  tasks: Task[];
  currentUser: User | null;
  filters: TaskFiltersState;
  onFilterChange: (filters: TaskFiltersState) => void;
  onCreateTask: () => void;
  onSelectTask: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
}

export function MyTasksSection({
  tasks,
  currentUser,
  filters,
  onFilterChange,
  onCreateTask,
  onSelectTask,
  onStatusChange,
  onDeleteTask,
}: MyTasksSectionProps) {
  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.priority || (filters.view && filters.view !== 'assigned')
  );

  // Group tasks by status
  const todoTasks = tasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');
  const overdueTasks = tasks.filter((t) => isOverdue(t.due_date, t.status));

  const renderTaskCard = (task: Task) => {
    const isCreator = currentUser?.id === task.created_by;
    const isAssignee = currentUser?.id === task.assigned_to;
    const canUpdateStatus = isCreator || isAssignee;
    const overdue = isOverdue(task.due_date, task.status);

    return (
      <div
        key={task.id}
        onClick={() => onSelectTask(task)}
        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-[20px] bg-[#FBF8F4] hover:bg-[#F5EFE9] border border-[#E8E1D9] hover:border-[#D5CDC4] transition-all cursor-pointer"
      >
        {/* Left: Task Title & Description & Assignee */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-[#1A1A1A] group-hover:text-[#F15A24] transition-colors truncate">
              {task.title}
            </h3>
            <ExternalLink className="w-3 h-3 text-[#AAA] group-hover:text-[#F15A24] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>

          <p className="text-[11px] text-[#777] line-clamp-1 leading-snug">
            {task.description || 'No description provided.'}
          </p>

          {/* Assignee & Due Date Sub-meta */}
          <div className="flex items-center gap-3 pt-1 text-[10px] text-[#8E8E93]">
            <div className="flex items-center gap-1.5 font-medium">
              {task.assignee?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={task.assignee.avatar_url}
                  alt={task.assignee.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-3 h-3 text-[#999]" />
              )}
              <span className="text-[#555] font-semibold">{task.assignee?.name || 'Unassigned'}</span>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#999]" />
              <span className={overdue ? 'text-rose-600 font-bold' : 'text-[#8E8E93]'}>
                {formatDate(task.due_date)}
              </span>
              {overdue && (
                <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 text-[8px] font-bold uppercase">
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Priority Badge, Status Badge & Quick Action Button */}
        <div
          className="flex items-center gap-2 sm:gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E1D9]"
          onClick={(e) => e.stopPropagation()}
        >
          <TaskPriorityBadge priority={task.priority} size="sm" />
          <TaskStatusBadge status={task.status} size="sm" />

          {/* Quick Action Button */}
          {canUpdateStatus && (
            <>
              {task.status === 'TODO' && (
                <button
                  type="button"
                  onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
                  className="px-3 py-1.5 rounded-full bg-[#FFE8D6] hover:bg-[#FFDFC4] text-[#E65100] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Start Progress"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span className="hidden sm:inline">Start</span>
                </button>
              )}

              {task.status === 'IN_PROGRESS' && (
                <button
                  type="button"
                  onClick={() => onStatusChange(task.id, 'COMPLETED')}
                  className="px-3 py-1.5 rounded-full bg-[#E6F7EC] hover:bg-[#D4F0DE] text-[#1E8E3E] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Complete Task"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Complete</span>
                </button>
              )}

              {task.status === 'COMPLETED' && (
                <button
                  type="button"
                  onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Reopen Task"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Reopen</span>
                </button>
              )}
            </>
          )}

          {/* Creator Delete button */}
          {isCreator && onDeleteTask && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete task "${task.title}"?`)) {
                  onDeleteTask(task.id);
                }
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete task (Creator only)"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 shadow-sm border border-[#E8E1D9] space-y-5">
      {/* Top Header: "My Tasks" and "+ Create Task" Button (Section 19) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-[#1A1A1A] tracking-tight">
            My Tasks
          </h2>
          <p className="text-xs text-[#8E8E93] mt-0.5">
            Deliverables and tickets organized by workflow progress and ownership.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateTask}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#F15A24] hover:bg-[#E04E1B] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Filter Bar (Section 20: Search, Status, Priority, Assignee) */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search tasks by title..."
              className="w-full pl-10 pr-4 py-2 bg-[#F7F2EC] border border-[#E5DDD2] rounded-full text-xs text-[#1A1A1A] placeholder-[#8E8E93] focus:outline-none focus:border-[#F15A24] shadow-2xs"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, search: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={filters.priority || ''}
              onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
              className="appearance-none bg-[#F7F2EC] border border-[#E5DDD2] rounded-full px-3.5 py-2 pr-7 text-xs font-bold text-[#1A1A1A] focus:outline-none focus:border-[#F15A24] cursor-pointer"
            >
              <option value="">Priority: All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none text-[#8E8E93]">
              ▼
            </span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => onFilterChange({ search: '', status: '', priority: '', view: 'assigned' })}
              className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#555] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}
        </div>

        {/* Secondary Row: Ownership Tabs & Status Segment Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Ownership Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'assigned', label: 'Assigned To Me' },
              { id: 'created', label: 'Created By Me' },
              { id: 'all', label: 'All Tasks' },
            ].map((tab) => {
              const isSelected = (filters.view || 'assigned') === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, view: tab.id as any })}
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

          {/* Workflow Status Segment Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: '', label: 'All', count: tasks.length },
              { id: 'TODO', label: 'To Do', count: todoTasks.length },
              { id: 'IN_PROGRESS', label: 'Active', count: inProgressTasks.length },
              { id: 'COMPLETED', label: 'Done', count: completedTasks.length },
              { id: 'OVERDUE', label: 'Overdue', count: overdueTasks.length },
            ].map((pill) => {
              const isSelected = (filters.status || '') === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, status: pill.id })}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#F15A24] text-white shadow-xs'
                      : 'bg-[#F7F2EC] text-[#666] hover:text-[#1A1A1A]'
                  }`}
                >
                  <span>{pill.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#555] border border-slate-200'
                    }`}
                  >
                    {pill.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task List: Grouped by Workflow Status so tasks are never jumbled together */}
      <div className="space-y-5 pt-1">
        {tasks.length === 0 ? (
          <div className="py-12 text-center text-[#8E8E93] bg-[#FBF8F4] rounded-[20px] border border-[#E8E1D9] space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-[#CCC]" />
            <div className="text-xs font-bold text-[#1A1A1A]">No tasks match your filter</div>
            <div className="text-[11px] text-[#8E8E93]">Create a new task or reset filters above.</div>
          </div>
        ) : filters.status ? (
          /* Single Status Filter Active: show that status list directly */
          <div className="space-y-2.5">
            {tasks.map(renderTaskCard)}
          </div>
        ) : (
          /* All Statuses Active: Group into clear status sections so they are not all together */
          <div className="space-y-6">
            {/* Active / In Progress Section */}
            {inProgressTasks.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#E65100]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E65100] animate-pulse" />
                  <span>In Progress Deliverables ({inProgressTasks.length})</span>
                </div>
                <div className="space-y-2.5">
                  {inProgressTasks.map(renderTaskCard)}
                </div>
              </div>
            )}

            {/* To Do Section */}
            {todoTasks.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#1A1A1A]">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span>To Do Backlog ({todoTasks.length})</span>
                </div>
                <div className="space-y-2.5">
                  {todoTasks.map(renderTaskCard)}
                </div>
              </div>
            )}

            {/* Completed Section */}
            {completedTasks.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-extrabold text-[#1E8E3E]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E8E3E]" />
                  <span>Completed Deliverables ({completedTasks.length})</span>
                </div>
                <div className="space-y-2.5">
                  {completedTasks.map(renderTaskCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
