'use client';

import React, { useState } from 'react';
import { TaskPriority } from '@/types/task';
import { User } from '@/types/user';
import { UserSelector } from '@/components/users/UserSelector';
import { TASK_PRIORITIES } from '@/lib/constants';
import { X, Plus, AlertCircle } from 'lucide-react';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    assigned_to: string;
    due_date?: string | null;
  }) => Promise<void>;
}

export function TaskForm({ isOpen, onClose, onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [assignedToUser, setAssignedToUser] = useState<User | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!assignedToUser) {
      setError('Please select an assignee from the team');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        assigned_to: assignedToUser.id,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      });
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setAssignedToUser(null);
      setDueDate('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white border border-[#E5DDD2] rounded-[32px] shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FDFBF7]">
          <div>
            <h2 className="text-base font-extrabold text-[#1A1A1A] tracking-tight">Create New Task</h2>
            <p className="text-xs text-[#8E8E93] mt-0.5">
              Assign deliverables to team members with automated email notifications.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 flex items-center justify-center text-slate-500 shadow-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
              Task Title <span className="text-[#F15A24]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Fix authentication token refresh"
              className="w-full px-4 py-2.5 bg-[#F7F2EC] border border-[#E5DDD2] rounded-2xl text-xs text-[#1A1A1A] placeholder-[#8E8E93] focus:outline-none focus:border-[#F15A24]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide scope, requirements, or links..."
              className="w-full px-4 py-2.5 bg-[#F7F2EC] border border-[#E5DDD2] rounded-2xl text-xs text-[#1A1A1A] placeholder-[#8E8E93] focus:outline-none focus:border-[#F15A24] resize-none"
            />
          </div>

          {/* Assignee & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UserSelector
              selectedUserId={assignedToUser?.id || ''}
              onSelectUser={(u) => setAssignedToUser(u)}
              label="Assignee *"
            />

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F7F2EC] border border-[#E5DDD2] rounded-2xl text-xs text-[#1A1A1A] focus:outline-none focus:border-[#F15A24]"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TASK_PRIORITIES.map((p) => {
                const isSelected = priority === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value as TaskPriority)}
                    className={`py-2 px-3 rounded-full text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-[#141414] text-white shadow-sm ring-2 ring-[#F15A24]'
                        : 'bg-[#F7F2EC] text-[#555] hover:bg-[#EFE9E0]'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#F5EFE9] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-full border border-[#DDD5CC] text-xs font-bold text-[#555] hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full bg-[#F15A24] hover:bg-[#E04E1B] text-xs font-bold text-white shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Creating...' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
