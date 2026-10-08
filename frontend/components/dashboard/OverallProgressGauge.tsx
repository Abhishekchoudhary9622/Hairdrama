'use client';

import React from 'react';
import { TaskStats } from '@/types/task';

interface OverallProgressGaugeProps {
  stats: TaskStats;
  percentage?: number;
}

export function OverallProgressGauge({ stats, percentage = 72 }: OverallProgressGaugeProps) {
  // If stats have completed tasks, dynamically calculate or use 72%
  const total = stats.total || 95;
  const completed = stats.completed || 26;
  const delayed = stats.overdue || 35;
  const ongoing = stats.in_progress || 35;
  const pct = total > 0 ? Math.round((completed / total) * 100) : percentage;

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-[#1A1A1A]">Overall Progress</h3>

        <div className="relative">
          <select
            value="All"
            onChange={() => {}}
            className="appearance-none bg-[#F7F2EC] hover:bg-[#EFE8E0] rounded-full px-3 py-1 text-[11px] font-bold text-[#1A1A1A] pr-6 shadow-2xs focus:outline-none cursor-pointer"
          >
            <option value="All">All</option>
            <option value="This Month">This Month</option>
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none text-[#8E8E93]">
            ▼
          </span>
        </div>
      </div>

      {/* Semicircular Gauge SVG */}
      <div className="relative flex flex-col items-center justify-center my-3">
        <div className="relative w-56 h-32 flex items-center justify-center">
          <svg className="w-56 h-36 overflow-visible" viewBox="0 0 200 110">
            {/* Outer dotted tick ring */}
            <circle
              cx="100"
              cy="100"
              r="84"
              fill="none"
              stroke="#E8E2DA"
              strokeWidth="4"
              strokeDasharray="2 6"
              strokeDashoffset="0"
            />

            {/* Background Arc Track */}
            <path
              d="M 22 100 A 78 78 0 0 1 178 100"
              fill="none"
              stroke="#F5EFE9"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Colored Segment 1: Green (0 - 25%) */}
            <path
              d="M 22 100 A 78 78 0 0 1 45 45"
              fill="none"
              stroke="#22C55E"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Colored Segment 2: Yellow (25% - 60%) */}
            <path
              d="M 45 45 A 78 78 0 0 1 125 25"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="12"
            />

            {/* Colored Segment 3: Orange (60% - 100%) */}
            <path
              d="M 125 25 A 78 78 0 0 1 178 100"
              fill="none"
              stroke="#F15A24"
              strokeWidth="12"
              strokeLinecap="round"
            />

            {/* Scale Markings */}
            <text x="18" y="108" fontSize="8" fontWeight="bold" fill="#8E8E93">0</text>
            <text x="40" y="38" fontSize="8" fontWeight="bold" fill="#8E8E93">25</text>
            <text x="135" y="24" fontSize="8" fontWeight="bold" fill="#8E8E93">60</text>
            <text x="175" y="108" fontSize="8" fontWeight="bold" fill="#8E8E93">100</text>
          </svg>

          {/* Center Metric Text */}
          <div className="absolute bottom-1 flex flex-col items-center">
            <span className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              {pct}%
            </span>
            <span className="text-[11px] font-medium text-[#8E8E93] -mt-1">
              Completed
            </span>
          </div>
        </div>
      </div>

      {/* 4 Bottom Columns */}
      <div className="grid grid-cols-4 gap-1 pt-3 border-t border-[#F5EFE9] text-center">
        <div>
          <div className="text-base sm:text-lg font-extrabold text-[#1A1A1A]">{total}</div>
          <div className="text-[10px] font-medium text-[#8E8E93] leading-tight">Total projects</div>
        </div>

        <div>
          <div className="text-base sm:text-lg font-extrabold text-[#22C55E]">{completed}</div>
          <div className="text-[10px] font-medium text-[#8E8E93] leading-tight">Completed</div>
        </div>

        <div>
          <div className="text-base sm:text-lg font-extrabold text-[#F59E0B]">{delayed}</div>
          <div className="text-[10px] font-medium text-[#8E8E93] leading-tight">Delayed</div>
        </div>

        <div>
          <div className="text-base sm:text-lg font-extrabold text-[#F15A24]">{ongoing}</div>
          <div className="text-[10px] font-medium text-[#8E8E93] leading-tight">On going</div>
        </div>
      </div>
    </div>
  );
}
