'use client';

import React from 'react';
import { TaskFiltersState } from '@/types/task';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';
import { Search, X } from 'lucide-react';

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onChange: (filters: TaskFiltersState) => void;
  showViewTabs?: boolean;
}

export function TaskFilters({ filters, onChange, showViewTabs = false }: TaskFiltersProps) {
  const hasActiveFilters = Boolean(
    filters.search || filters.status || filters.priority || (filters.view && filters.view !== 'all')
  );

  const handleClear = () => {
    onChange({
      search: '',
      status: '',
      priority: '',
      view: 'all',
    });
  };

  return (
    <div className="space-y-3">
      {/* Search and Dropdowns Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search tasks by title or keyword..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#E8E1D9] rounded-full text-xs text-[#1A1A1A] placeholder-[#8E8E93] focus:outline-none focus:border-[#F15A24]/50 shadow-xs"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={filters.status || ''}
              onChange={(e) => onChange({ ...filters, status: e.target.value })}
              className="appearance-none bg-white border border-[#E8E1D9] rounded-full px-3.5 py-2 pr-7 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#F15A24]/50 shadow-xs cursor-pointer"
            >
              <option value="">All Statuses</option>
              {TASK_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none text-[#8E8E93]">
              ▼
            </span>
          </div>

          {/* Priority Dropdown */}
          <div className="relative">
            <select
              value={filters.priority || ''}
              onChange={(e) => onChange({ ...filters, priority: e.target.value })}
              className="appearance-none bg-white border border-[#E8E1D9] rounded-full px-3.5 py-2 pr-7 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#F15A24]/50 shadow-xs cursor-pointer"
            >
              <option value="">All Priorities</option>
              {TASK_PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] pointer-events-none text-[#8E8E93]">
              ▼
            </span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3.5 py-2 rounded-full bg-white border border-[#E8E1D9] text-[#777] hover:text-[#1A1A1A] text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* View Scope Tabs */}
      {showViewTabs && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Involved' },
            { id: 'assigned', label: 'Assigned To Me' },
            { id: 'created', label: 'Created By Me' },
          ].map((tab) => {
            const isSelected = (filters.view || 'all') === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChange({ ...filters, view: tab.id as any })}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#141414] text-white shadow-xs'
                    : 'bg-white border border-[#E8E1D9] text-[#777] hover:text-[#1A1A1A]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
