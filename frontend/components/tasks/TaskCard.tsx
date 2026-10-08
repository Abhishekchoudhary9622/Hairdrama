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
    <div className="group relative bg-white hover:bg-[#FDFBF7] border border-[#E8E1D9] hover:border-[#D5CDC4] rounded-[22px] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
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
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete task (Creator only)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => onSelectTask(task)}
              className="p-1.5 text-slate-400 hover:text-[#F15A24] hover:bg-orange-50 rounded-lg transition-colors"
              title="View details & activity history"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelectTask(task)}
          className="text-sm font-bold text-[#1A1A1A] hover:text-[#F15A24] transition-colors cursor-pointer line-clamp-1 mb-1.5"
        >
          {task.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-[#777] line-clamp-2 leading-relaxed mb-4">
          {task.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer Info & Quick State Action */}
      <div className="pt-3 border-t border-[#F5EFE9] mt-2 space-y-3">
        {/* Assignee & Due Date Meta */}
        <div className="flex items-center justify-between text-xs text-[#777]">
          {/* Assignee avatar & name */}
          <div className="flex items-center gap-2 truncate max-w-[55%]">
            {task.assignee?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={task.assignee.avatar_url}
                alt={task.assignee.name}
                className="w-5 h-5 rounded-full border border-slate-200 flex-shrink-0"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 border border-slate-200">
                <UserIcon className="w-3 h-3" />
              </div>
            )}
            <span className="truncate text-[#1A1A1A] font-semibold text-[11px]">
              {task.assignee?.name || 'Unassigned'}
            </span>
          </div>

          {/* Due date */}
          <div
            className={`flex items-center gap-1.5 flex-shrink-0 text-[11px] font-medium ${
              overdue
                ? 'text-rose-600 font-bold'
                : 'text-[#8E8E93]'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.due_date)}</span>
            {overdue && (
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 uppercase font-bold tracking-wider">
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
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-[#FFE8D6] hover:bg-[#FFDFC4] text-[#E65100] text-xs font-bold transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start Progress</span>
              </button>
            )}

            {task.status === 'IN_PROGRESS' && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, 'COMPLETED')}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-[#E6F7EC] hover:bg-[#D4F0DE] text-[#1E8E3E] text-xs font-bold transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Completed</span>
              </button>
            )}

            {task.status === 'COMPLETED' && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, 'IN_PROGRESS')}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reopen</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
