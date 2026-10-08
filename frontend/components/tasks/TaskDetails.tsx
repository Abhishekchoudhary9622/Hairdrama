'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskActivity, TaskStatus } from '@/types/task';
import { User } from '@/types/user';
import { TaskStatusBadge, TaskPriorityBadge } from './TaskStatusBadge';
import { UserSelector } from '@/components/users/UserSelector';
import { api } from '@/lib/api';
import { formatDate, formatDateTime, isOverdue } from '@/lib/utils';
import {
  X,
  Calendar,
  Clock,
  User as UserIcon,
  Activity,
  History,
  AlertCircle,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

interface TaskDetailsProps {
  task: Task | null;
  currentUser: User | null;
  onClose: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => Promise<void>;
  onReassign: (taskId: string, newAssigneeId: string) => Promise<void>;
  onDelete?: (taskId: string) => Promise<void>;
}

export function TaskDetails({
  task,
  currentUser,
  onClose,
  onStatusChange,
  onReassign,
  onDelete,
}: TaskDetailsProps) {
  const [activities, setActivities] = useState<TaskActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      async function loadActivity() {
        try {
          setLoadingActivities(true);
          const logs = await api.getTaskActivity(task!.id);
          setActivities(logs);
        } catch (err) {
          console.error('Failed to load task activity:', err);
        } finally {
          setLoadingActivities(false);
        }
      }
      loadActivity();
    }
  }, [task]);

  if (!task) return null;

  const isCreator = currentUser?.id === task.created_by;
  const isAssignee = currentUser?.id === task.assigned_to;
  const canUpdateStatus = isCreator || isAssignee;
  const overdue = isOverdue(task.due_date, task.status);

  const handleStatusSelect = async (newStatus: TaskStatus) => {
    try {
      setUpdating(true);
      setError(null);
      await onStatusChange(task.id, newStatus);
      // Refresh activities
      const logs = await api.getTaskActivity(task.id);
      setActivities(logs);
    } catch (err: any) {
      setError(err.message || 'Status transition failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleReassign = async (user: User) => {
    try {
      setUpdating(true);
      setError(null);
      await onReassign(task.id, user.id);
      const logs = await api.getTaskActivity(task.id);
      setActivities(logs);
    } catch (err: any) {
      setError(err.message || 'Reassignment failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
          </div>

          <div className="flex items-center gap-2">
            {isCreator && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete task "${task.title}"?`)) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
                title="Delete task (Creator only)"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight mb-2">
              {task.title}
            </h2>
            <div className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 whitespace-pre-wrap">
              {task.description || 'No description provided.'}
            </div>
          </div>

          {/* Workflow & Assignment Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/30 p-4 rounded-2xl border border-slate-800">
            {/* Status Transition Control */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Workflow Status
              </label>
              {canUpdateStatus ? (
                <div className="flex items-center gap-2 flex-wrap">
                  {task.status !== 'TODO' && (
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleStatusSelect('TODO')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    >
                      Move to TODO
                    </button>
                  )}
                  {task.status !== 'IN_PROGRESS' && (
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleStatusSelect('IN_PROGRESS')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-colors"
                    >
                      In Progress
                    </button>
                  )}
                  {task.status !== 'COMPLETED' && (
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleStatusSelect('COMPLETED')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete Task</span>
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Only the task creator or assignee can transition status.
                </p>
              )}
            </div>

            {/* Reassign Control */}
            <div>
              <UserSelector
                selectedUserId={task.assigned_to}
                onSelectUser={handleReassign}
                label={isCreator ? 'Reassign Task (Creator only)' : 'Assigned To'}
                disabled={!isCreator || updating}
              />
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Created By</span>
              <span className="font-medium text-slate-200 truncate block">
                {task.creator?.name || 'Unknown'}
              </span>
            </div>

            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Due Date</span>
              <span
                className={`font-medium block truncate ${
                  overdue ? 'text-rose-400 font-semibold' : 'text-slate-200'
                }`}
              >
                {formatDate(task.due_date)}
              </span>
            </div>

            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Created</span>
              <span className="font-medium text-slate-200 block truncate">
                {formatDate(task.created_at)}
              </span>
            </div>

            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Completed</span>
              <span className="font-medium text-slate-200 block truncate">
                {task.completed_at ? formatDate(task.completed_at) : 'Incomplete'}
              </span>
            </div>
          </div>

          {/* Activity History Audit Trail */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Activity Audit Trail
              </h3>
            </div>

            <div className="space-y-3">
              {loadingActivities ? (
                <div className="text-xs text-slate-500 py-3 text-center">Loading audit history...</div>
              ) : activities.length === 0 ? (
                <div className="text-xs text-slate-500 py-2">No activity logged yet.</div>
              ) : (
                <div className="relative border-l border-slate-800 ml-3 space-y-4 py-1">
                  {activities.map((act) => (
                    <div key={act.id} className="relative pl-6">
                      <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-slate-800 border-2 border-indigo-500" />
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-medium text-slate-300">
                          {act.user?.name || 'System User'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {formatDateTime(act.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {act.action === 'CREATED_TASK' && `Created task with initial state`}
                        {act.action === 'STATUS_CHANGED' &&
                          `Changed status from ${act.old_value} to ${act.new_value}`}
                        {act.action === 'ASSIGNED_TASK' && `Reassigned task`}
                        {act.action === 'UPDATED_TASK' && `Updated task fields`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
