'use client';

import React from 'react';
import { TaskStatus, TaskPriority } from '@/types/task';
import { CheckCircle2, Clock, CircleDot, AlertTriangle, ShieldAlert } from 'lucide-react';

interface TaskStatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
}

export function TaskStatusBadge({ status, size = 'md' }: TaskStatusBadgeProps) {
  const meta = {
    TODO: {
      label: 'To Do',
      color: 'bg-[#F7F2EC] text-[#555] border-[#E5DDD2]',
      icon: CircleDot,
    },
    IN_PROGRESS: {
      label: 'On going',
      color: 'bg-[#FFE8D6] text-[#E65100] border-[#FFD5BA]',
      icon: Clock,
    },
    COMPLETED: {
      label: 'Completed',
      color: 'bg-[#E6F7EC] text-[#1E8E3E] border-[#C3E8D0]',
      icon: CheckCircle2,
    },
  }[status] || {
    label: status,
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: CircleDot,
  };

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold border rounded-full ${
        isSmall ? 'text-[10px] px-2.5 py-0.5' : 'text-xs px-3 py-1'
      } ${meta.color} transition-colors`}
    >
      <meta.icon className="w-3 h-3 flex-shrink-0" />
      <span>{meta.label}</span>
    </span>
  );
}

interface TaskPriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
}

export function TaskPriorityBadge({ priority, size = 'md' }: TaskPriorityBadgeProps) {
  const meta = {
    LOW: {
      label: 'Low',
      color: 'bg-[#F7F2EC] text-[#555] border-[#E5DDD2]',
    },
    MEDIUM: {
      label: 'Medium',
      color: 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]',
    },
    HIGH: {
      label: 'Delayed',
      color: 'bg-[#FFF8E1] text-[#B78103] border-[#FEE58A]',
    },
    URGENT: {
      label: 'At risk',
      color: 'bg-[#FDE8E8] text-[#C81E1E] border-[#F8B4B4]',
    },
  }[priority] || {
    label: priority,
    color: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const isSmall = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold border rounded-full ${
        isSmall ? 'text-[10px] px-2.5 py-0.5' : 'text-xs px-3 py-1'
      } ${meta.color}`}
    >
      {priority === 'URGENT' && <ShieldAlert className="w-3 h-3 flex-shrink-0 animate-pulse" />}
      {priority === 'HIGH' && <AlertTriangle className="w-3 h-3 flex-shrink-0" />}
      <span>{meta.label}</span>
    </span>
  );
}
