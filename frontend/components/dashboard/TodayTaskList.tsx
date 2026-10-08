'use client';

import React, { useState } from 'react';
import { Task } from '@/types/task';
import { Check } from 'lucide-react';

interface TodayTaskListProps {
  tasks: Task[];
  onSelectTask?: (task: Task) => void;
  onToggleStatus?: (taskId: string) => void;
}

export function TodayTaskList({ tasks, onSelectTask, onToggleStatus }: TodayTaskListProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'important' | 'notes' | 'links'>('important');

  const defaultItems = [
    {
      id: 'today-1',
      title: 'Create a user flow of social application design',
      badge: 'Approved',
      badgeClass: 'bg-[#E6F7EC] text-[#1E8E3E]',
      checked: true,
    },
    {
      id: 'today-2',
      title: 'Create a user flow of social application design',
      badge: 'In review',
      badgeClass: 'bg-[#FDE8E8] text-[#C81E1E]',
      checked: true,
    },
    {
      id: 'today-3',
      title: 'Landing page design for Fintech project of singapore',
      badge: 'In review',
      badgeClass: 'bg-[#FDE8E8] text-[#C81E1E]',
      checked: true,
    },
    {
      id: 'today-4',
      title: 'Interactive prototype for app screens of deltamine project',
      badge: 'On going',
      badgeClass: 'bg-[#FFE8D6] text-[#E65100]',
      checked: false,
    },
    {
      id: 'today-5',
      title: 'Interactive prototype for app screens of deltamine project',
      badge: 'Approved',
      badgeClass: 'bg-[#E6F7EC] text-[#1E8E3E]',
      checked: true,
    },
  ];

  // Map real backend tasks if available
  const listItems =
    tasks.length > 0
      ? tasks.slice(0, 5).map((t, idx) => ({
          id: t.id,
          title: t.title,
          badge: t.status === 'COMPLETED' ? 'Approved' : t.priority === 'HIGH' ? 'In review' : 'On going',
          badgeClass:
            t.status === 'COMPLETED'
              ? 'bg-[#E6F7EC] text-[#1E8E3E]'
              : t.priority === 'HIGH'
              ? 'bg-[#FDE8E8] text-[#C81E1E]'
              : 'bg-[#FFE8D6] text-[#E65100]',
          checked: t.status === 'COMPLETED' || idx % 2 === 0,
          rawTask: t,
        }))
      : defaultItems;

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 shadow-sm">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-bold text-[#1A1A1A]">Today task</h3>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-1 transition-colors ${
              activeTab === 'all'
                ? 'text-[#F15A24] border-b-2 border-[#F15A24]'
                : 'text-[#8E8E93] hover:text-[#1A1A1A]'
            }`}
          >
            All <span className="text-[10px] opacity-70">10</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('important')}
            className={`pb-1 transition-colors ${
              activeTab === 'important'
                ? 'text-[#F15A24] border-b-2 border-[#F15A24]'
                : 'text-[#8E8E93] hover:text-[#1A1A1A]'
            }`}
          >
            Important
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`pb-1 transition-colors ${
              activeTab === 'notes'
                ? 'text-[#F15A24] border-b-2 border-[#F15A24]'
                : 'text-[#8E8E93] hover:text-[#1A1A1A]'
            }`}
          >
            Notes <span className="text-[10px] opacity-70">08</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('links')}
            className={`pb-1 transition-colors ${
              activeTab === 'links'
                ? 'text-[#F15A24] border-b-2 border-[#F15A24]'
                : 'text-[#8E8E93] hover:text-[#1A1A1A]'
            }`}
          >
            Links <span className="text-[10px] opacity-70">10</span>
          </button>
        </div>
      </div>

      {/* Task Checklist Items */}
      <div className="space-y-2.5">
        {listItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if ((item as any).rawTask && onSelectTask) {
                onSelectTask((item as any).rawTask);
              }
            }}
            className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#FAF7F2] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3 truncate">
              {/* Orange Radio Bullet */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus?.(item.id);
                }}
                className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-90 ${
                  item.checked
                    ? 'bg-[#F15A24] text-white shadow-xs'
                    : 'border-2 border-[#D5CDC4] bg-white'
                }`}
              >
                {item.checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>

              {/* Title */}
              <span className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#F15A24] transition-colors truncate">
                {item.title}
              </span>
            </div>

            {/* Status Pill Badge */}
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap flex-shrink-0 ${item.badgeClass}`}
            >
              {item.badge}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
