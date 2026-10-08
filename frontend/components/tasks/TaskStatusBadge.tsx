'use client';

import React from 'react';
import { TaskStatus, TaskPriority } from '@/types/task';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';
import { CheckCircle2, Clock, CircleDot, AlertTriangle, AlertCircle, ShieldAlert } from 'lucide-react';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export function TaskStatusBadge({ status, size = 'md' }: TaskStatusBadgeProps) {
  const meta = TASK_STATUSES.find((s) => s.value === status) || {
    label: status,
    color: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${
        isSmall ? 'text-xs px-2.5 py-0.5' : 'text-xs px-3 py-1'
      } ${meta.color} transition-colors`}
    >
      {status === 'TODO' && <CircleDot className="w-3.5 h-3.5 opacity-70" />}
      {status === 'IN_PROGRESS' && <Clock className="w-3.5 h-3.5 animate-spin-slow text-blue-400" />}
      {status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
      <span>{meta.label}</span>
    </span>
  );
}

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export function TaskPriorityBadge({ priority, size = 'md' }: TaskPriorityBadgeProps) {
  const meta = TASK_PRIORITIES.find((p) => p.value === priority) || {
    label: priority,
    color: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full ${
        isSmall ? 'text-xs px-2.5 py-0.5' : 'text-xs px-3 py-1'
      } ${meta.color}`}
    >
      {priority === 'LOW' && <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />}
      {priority === 'MEDIUM' && <CircleDot className="w-3.5 h-3.5 text-cyan-400" />}
      {priority === 'HIGH' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
      {priority === 'URGENT' && <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />}
      <span>{meta.label}</span>
    </span>
  );
}
