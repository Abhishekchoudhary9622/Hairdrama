'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types/task';
import { User } from '@/types/user';
import { TaskStatusBadge, TaskPriorityBadge } from './TaskStatusBadge';
import { formatDate, isOverdue } from '@/lib/utils';
import { Calendar, User as UserIcon, Play, CheckCircle2, RotateCcw, Trash2, ExternalLink } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  currentUser: User | null;
  onSelectTask: (task: Task) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onDeleteTask?: (taskId: string) => Promise<void>;
}

export function TaskCard({
  task,
  currentUser,
  onSelectTask,
  onStatusChange,
  onDeleteTask,
}: TaskCardProps) {
  const isCreator = currentUser?.id === task.created_by;
  const isAssignee = currentUser?.id === task.assigned_to;
  const canUpdateStatus = isCreator || isAssignee;
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <div className="group relative bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col justify-between">
      {/* Top badges & actions */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <TaskStatusBadge status={task.status} size="sm" />
            <TaskPriorityBadge priority={task.priority} size="sm" />
          </div>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {isCreator && onDeleteTask && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete task "${task.title}"?`)) {
                    onDeleteTask(task.id);
                  }
                }}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Delete task (Creator only)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onSelectTask(task)}
              className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
              title="View details & activity history"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectTask(task)}
          className="text-base font-semibold text-slate-100 hover:text-indigo-300 transition-colors cursor-pointer line-clamp-1 mb-2"
        >
          {task.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {task.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer Info & Quick State Action */}
      <div className="pt-3 border-t border-slate-800/80 mt-2 space-y-3">
        {/* Assignee & Due Date Meta */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          {/* Assignee avatar & name */}
          <div className="flex items-center gap-2 truncate max-w-[55%]">
            {task.assignee?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={task.assignee.avatar_url}
                alt={task.assignee.name}
                className="w-5 h-5 rounded-full border border-slate-700 flex-shrink-0"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 border border-slate-700">
                <UserIcon className="w-3 h-3" />
              </div>
            )}
            <span className="truncate text-slate-300 font-medium">
              {task.assignee?.name || 'Unassigned'}
            </span>
          </div>

          {/* Due date */}
          <div
            className={`flex items-center gap-1.5 flex-shrink-0 font-medium ${
              overdue
                ? 'text-rose-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(task.due_date)}</span>
            {overdue && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 uppercase font-bold tracking-wider">
                Overdue
              </span>
            )}
          </div>
        </div>

        {/* Quick Transition CTA */}
        {canUpdateStatus && (
          <div className="pt-1 flex items-center gap-2">
            {task.status === 'TODO' && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Progress</span>
              </button>
            )}

            {task.status === 'IN_PROGRESS' && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, 'COMPLETED')}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Completed</span>
              </button>
            )}

            {task.status === 'COMPLETED' && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reopen Task</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
