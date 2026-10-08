'use client';

import React, { useState, useEffect } from 'react';
import { Task, TaskActivity, TaskStatus } from '@/types/task';
import { User } from '@/types/user';
import { TaskStatusBadge, TaskPriorityBadge } from './TaskStatusBadge';
import { UserSelector } from '@/components/users/UserSelector';
import { api } from '@/lib/api';
import { formatDate, formatDateTime, isOverdue } from '@/lib/utils';
import { X, History, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';

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
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white border border-[#E5DDD2] rounded-[32px] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FDFBF7] flex-shrink-0">
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
                className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors"
                title="Delete task (Creator only)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 shadow-xs transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#1A1A1A]">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight mb-2">
              {task.title}
            </h2>
            <div className="text-xs text-[#555] leading-relaxed bg-[#F7F2EC] p-4 rounded-2xl border border-[#E8E1D9] whitespace-pre-wrap">
              {task.description || 'No description provided.'}
            </div>
          </div>

          {/* Workflow & Assignment Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FBF8F4] p-4 rounded-2xl border border-[#E8E1D9]">
            {/* Status Transition Control */}
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-2">
                Workflow Status
              </label>
              {canUpdateStatus ? (
                <div className="flex items-center gap-2 flex-wrap">
                  {task.status !== 'TODO' && (
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleStatusSelect('TODO')}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white hover:bg-slate-50 text-[#555] border border-[#DDD5CC] transition-colors"
                    >
                      To Do
                    </button>
                  )}
                  {task.status !== 'IN_PROGRESS' && (
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleStatusSelect('IN_PROGRESS')}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FFE8D6] hover:bg-[#FFDFC4] text-[#E65100] transition-colors"
                    >
                      In Progress
                    </button>
                  )}
                  {task.status !== 'COMPLETED' && (
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleStatusSelect('COMPLETED')}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#E6F7EC] hover:bg-[#D4F0DE] text-[#1E8E3E] transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Complete Task</span>
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-[#8E8E93]">
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
            <div className="p-3 bg-[#F7F2EC] rounded-2xl border border-[#E8E1D9]">
              <span className="text-[#8E8E93] block mb-0.5 text-[10px] font-semibold">Created By</span>
              <span className="font-bold text-[#1A1A1A] truncate block">
                {task.creator?.name || 'Unknown'}
              </span>
            </div>

            <div className="p-3 bg-[#F7F2EC] rounded-2xl border border-[#E8E1D9]">
              <span className="text-[#8E8E93] block mb-0.5 text-[10px] font-semibold">Due Date</span>
              <span
                className={`font-bold block truncate ${
                  overdue ? 'text-rose-600' : 'text-[#1A1A1A]'
                }`}
              >
                {formatDate(task.due_date)}
              </span>
            </div>

            <div className="p-3 bg-[#F7F2EC] rounded-2xl border border-[#E8E1D9]">
              <span className="text-[#8E8E93] block mb-0.5 text-[10px] font-semibold">Created</span>
              <span className="font-bold text-[#1A1A1A] block truncate">
                {formatDate(task.created_at)}
              </span>
            </div>

            <div className="p-3 bg-[#F7F2EC] rounded-2xl border border-[#E8E1D9]">
              <span className="text-[#8E8E93] block mb-0.5 text-[10px] font-semibold">Completed</span>
              <span className="font-bold text-[#1A1A1A] block truncate">
                {task.completed_at ? formatDate(task.completed_at) : 'Incomplete'}
              </span>
            </div>
          </div>

          {/* Activity History Audit Trail */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-[#F15A24]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                Activity Audit Trail
              </h3>
            </div>

            <div className="space-y-3">
              {loadingActivities ? (
                <div className="text-xs text-[#8E8E93] py-3 text-center">Loading audit history...</div>
              ) : activities.length === 0 ? (
                <div className="text-xs text-[#8E8E93] py-2">No activity logged yet.</div>
              ) : (
                <div className="relative border-l border-[#E2DBD2] ml-3 space-y-4 py-1">
                  {activities.map((act) => (
                    <div key={act.id} className="relative pl-6">
                      <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-white border-2 border-[#F15A24]" />
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-[#1A1A1A]">
                          {act.user?.name || 'System User'}
                        </span>
                        <span className="text-[10px] text-[#8E8E93]">
                          {formatDateTime(act.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-[#555] mt-0.5">
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
