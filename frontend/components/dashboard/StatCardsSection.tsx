'use client';

import React from 'react';
import { TaskStats } from '@/types/task';
import { Layers, Calendar, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface StatCardsSectionProps {
  stats: TaskStats;
  onFilterClick?: (status: string) => void;
}

export function StatCardsSection({ stats, onFilterClick }: StatCardsSectionProps) {
  return (
    <div className="space-y-3">
      {/* Row 1: Total (24), To Do (8), Active (6) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Total */}
        <div
          onClick={() => onFilterClick?.('')}
          className="bg-white border border-[#E8E1D9] hover:border-[#D5CDC4] rounded-[22px] p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-[#8E8E93] group-hover:text-[#1A1A1A] transition-colors">
              Total
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] mt-1 tracking-tight">
              {stats.total}
            </div>
            <span className="text-[10px] text-[#8E8E93] mt-0.5 block">
              All deliverables
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* To Do */}
        <div
          onClick={() => onFilterClick?.('TODO')}
          className="bg-white border border-[#E8E1D9] hover:border-[#D5CDC4] rounded-[22px] p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-[#8E8E93] group-hover:text-[#1A1A1A] transition-colors">
              To Do
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] mt-1 tracking-tight">
              {stats.todo}
            </div>
            <span className="text-[10px] text-[#8E8E93] mt-0.5 block">
              Pending kickoff
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#F7F2EC] text-[#555] flex items-center justify-center shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Active / In Progress */}
        <div
          onClick={() => onFilterClick?.('IN_PROGRESS')}
          className="bg-white border border-[#E8E1D9] hover:border-[#D5CDC4] rounded-[22px] p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-[#8E8E93] group-hover:text-[#1A1A1A] transition-colors">
              Active
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#E65100] mt-1 tracking-tight">
              {stats.in_progress}
            </div>
            <span className="text-[10px] text-[#E65100]/80 mt-0.5 block">
              In progress now
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#FFE8D6] text-[#E65100] flex items-center justify-center shadow-xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Row 2: Done (10), Overdue (2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Done */}
        <div
          onClick={() => onFilterClick?.('COMPLETED')}
          className="bg-white border border-[#E8E1D9] hover:border-[#D5CDC4] rounded-[22px] p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-[#8E8E93] group-hover:text-[#1A1A1A] transition-colors">
              Done
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#1E8E3E] mt-1 tracking-tight">
              {stats.completed}
            </div>
            <span className="text-[10px] text-[#1E8E3E]/80 mt-0.5 block">
              Successfully completed
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#E6F7EC] text-[#1E8E3E] flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Overdue */}
        <div
          onClick={() => onFilterClick?.('OVERDUE')}
          className="bg-white border border-[#E8E1D9] hover:border-[#D5CDC4] rounded-[22px] p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div>
            <span className="text-xs font-bold text-[#8E8E93] group-hover:text-[#1A1A1A] transition-colors">
              Overdue
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#D93025] mt-1 tracking-tight">
              {stats.overdue}
            </div>
            <span className="text-[10px] text-[#D93025]/80 mt-0.5 block">
              Requires immediate action
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#FCE8E6] text-[#D93025] flex items-center justify-center shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
