'use client';

import React from 'react';
import { Task } from '@/types/task';
import { formatDate } from '@/lib/utils';

interface TaskSummaryTableProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  statusFilter?: string;
  onStatusFilterChange?: (val: string) => void;
  assigneeFilter?: string;
  onAssigneeFilterChange?: (val: string) => void;
}

export function TaskSummaryTable({
  tasks,
  onSelectTask,
  statusFilter = '',
  onStatusFilterChange,
  assigneeFilter = '',
  onAssigneeFilterChange,
}: TaskSummaryTableProps) {
  // If no backend tasks exist yet, provide demo rows styled identically to screenshot
  const displayTasks = tasks.length > 0 ? tasks : [
    {
      id: 'demo-1',
      title: 'Nelsa web developement',
      description: 'Core web experience and component library',
      status: 'COMPLETED' as const,
      priority: 'MEDIUM' as const,
      created_by: '1',
      assigned_to: '1',
      assignee: { id: '1', name: 'Om prakash sao', email: 'om@hairdrama.tech', created_at: '' },
      due_date: '2026-05-25T00:00:00Z',
      created_at: '2026-05-01T00:00:00Z',
    },
    {
      id: 'demo-2',
      title: 'Datascale AI app',
      description: 'Predictive intelligence model and pipeline',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      created_by: '1',
      assigned_to: '2',
      assignee: { id: '2', name: 'Nelsan mando', email: 'nelsan@hairdrama.tech', created_at: '' },
      due_date: '2026-06-20T00:00:00Z',
      created_at: '2026-05-01T00:00:00Z',
    },
    {
      id: 'demo-3',
      title: 'Media channel branding',
      description: 'Asset pipeline and visual identity review',
      status: 'TODO' as const,
      priority: 'URGENT' as const,
      created_by: '1',
      assigned_to: '3',
      assignee: { id: '3', name: 'Tiruvally priya', email: 'priya@hairdrama.tech', created_at: '' },
      due_date: '2026-07-13T00:00:00Z',
      created_at: '2026-05-01T00:00:00Z',
    },
    {
      id: 'demo-4',
      title: 'Corfax iOS app developement',
      description: 'Mobile Swift application architecture',
      status: 'COMPLETED' as const,
      priority: 'LOW' as const,
      created_by: '1',
      assigned_to: '4',
      assignee: { id: '4', name: 'Matte hannery', email: 'matte@hairdrama.tech', created_at: '' },
      due_date: '2026-12-20T00:00:00Z',
      created_at: '2026-05-01T00:00:00Z',
    },
    {
      id: 'demo-5',
      title: 'Website builder developement',
      description: 'Drag and drop canvas renderer',
      status: 'IN_PROGRESS' as const,
      priority: 'MEDIUM' as const,
      created_by: '1',
      assigned_to: '5',
      assignee: { id: '5', name: 'Sukumar rao', email: 'sukumar@hairdrama.tech', created_at: '' },
      due_date: '2026-03-15T00:00:00Z',
      created_at: '2026-05-01T00:00:00Z',
    },
  ];

  const getStatusBadge = (status: string, priority?: string) => {
    if (status === 'COMPLETED') {
      return (
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#E6F7EC] text-[#1E8E3E]">
          Completed
        </span>
      );
    }
    if (priority === 'URGENT') {
      return (
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FCE8E6] text-[#D93025]">
          At risk
        </span>
      );
    }
    if (priority === 'HIGH') {
      return (
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFF8E1] text-[#B78103]">
          Delayed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFE8D6] text-[#E65100]">
        On going
      </span>
    );
  };

  const getProgressPercentage = (status: string, priority?: string) => {
    if (status === 'COMPLETED') return 100;
    if (priority === 'URGENT') return 15;
    if (priority === 'HIGH') return 35;
    return 60;
  };

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 shadow-sm">
      {/* Table Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-sm font-bold text-[#1A1A1A]">Project summary</h3>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              value=""
              onChange={() => {}}
              className="appearance-none bg-[#F7F2EC] hover:bg-[#EFE8E0] rounded-full px-3 py-1 text-[11px] font-bold text-[#1A1A1A] pr-6 shadow-2xs focus:outline-none cursor-pointer"
            >
              <option value="">Project</option>
              <option value="web">Web</option>
              <option value="app">Mobile</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none text-[#8E8E93]">
              ▼
            </span>
          </div>

          <div className="relative">
            <select
              value={assigneeFilter}
              onChange={(e) => onAssigneeFilterChange?.(e.target.value)}
              className="appearance-none bg-[#F7F2EC] hover:bg-[#EFE8E0] rounded-full px-3 py-1 text-[11px] font-bold text-[#1A1A1A] pr-6 shadow-2xs focus:outline-none cursor-pointer"
            >
              <option value="">Project manager</option>
              <option value="om">Om prakash sao</option>
              <option value="nelsan">Nelsan mando</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none text-[#8E8E93]">
              ▼
            </span>
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange?.(e.target.value)}
              className="appearance-none bg-[#F7F2EC] hover:bg-[#EFE8E0] rounded-full px-3 py-1 text-[11px] font-bold text-[#1A1A1A] pr-6 shadow-2xs focus:outline-none cursor-pointer"
            >
              <option value="">Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">On going</option>
              <option value="TODO">To Do</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none text-[#8E8E93]">
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#F5EFE9] text-[#8E8E93] text-[11px] font-bold">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Project manager</th>
              <th className="pb-3 font-medium">Due date</th>
              <th className="pb-3 font-medium text-center">Status</th>
              <th className="pb-3 font-medium text-center">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F9F6F0]">
            {displayTasks.map((task) => {
              const progress = getProgressPercentage(task.status, task.priority);
              const strokeColor =
                progress === 100
                  ? '#1E8E3E'
                  : progress >= 50
                  ? '#E65100'
                  : progress >= 30
                  ? '#B78103'
                  : '#D93025';

              return (
                <tr
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="hover:bg-[#FDFBF7] transition-colors cursor-pointer group"
                >
                  {/* Name */}
                  <td className="py-3.5 pr-3 font-bold text-[#1A1A1A] group-hover:text-[#F15A24] transition-colors truncate max-w-[180px]">
                    {task.title}
                  </td>

                  {/* Project manager / Assignee */}
                  <td className="py-3.5 pr-3 text-[#555] font-medium truncate max-w-[140px]">
                    {task.assignee?.name || 'Unassigned'}
                  </td>

                  {/* Due date */}
                  <td className="py-3.5 pr-3 text-[#777] font-medium whitespace-nowrap">
                    {formatDate(task.due_date)}
                  </td>

                  {/* Status Pill Badge */}
                  <td className="py-3.5 px-2 text-center whitespace-nowrap">
                    {getStatusBadge(task.status, task.priority)}
                  </td>

                  {/* Circular Mini Progress Meter */}
                  <td className="py-3.5 pl-2 text-center">
                    <div className="inline-flex items-center justify-center relative w-7 h-7">
                      <svg className="w-7 h-7 -rotate-90" viewBox="0 0 32 32">
                        <circle
                          cx="16"
                          cy="16"
                          r="13"
                          fill="none"
                          stroke="#EBE4DD"
                          strokeWidth="3"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="13"
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth="3"
                          strokeDasharray={81.68}
                          strokeDashoffset={81.68 - (81.68 * progress) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[8px] font-extrabold text-[#1A1A1A]">
                        {progress}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
