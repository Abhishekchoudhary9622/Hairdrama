'use client';

import React from 'react';
import { TaskFiltersState } from '@/types/task';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';
import { Search, Filter, X } from 'lucide-react';

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onChange: (filters: TaskFiltersState) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search tasks by title or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={filters.status || ''}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            {TASK_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            value={filters.priority || ''}
            onChange={(e) => onChange({ ...filters, priority: e.target.value })}
            className="px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-xs font-medium text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Priorities</option>
            {TASK_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* View Scope Tabs */}
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
              className={`px-3.5 py-1.5 rounded-full font-medium transition-all ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
