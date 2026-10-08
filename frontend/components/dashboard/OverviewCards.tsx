'use client';

import React from 'react';
import { TaskStats } from '@/types/task';
import { Layers, Briefcase, Clock, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface OverviewCardsProps {
  stats: TaskStats;
  timeFilter?: string;
  onTimeFilterChange?: (val: string) => void;
}

export function OverviewCards({ stats, timeFilter = 'Last 30 days', onTimeFilterChange }: OverviewCardsProps) {
  const cards = [
    {
      title: 'Total revenue',
      metric: '$53,00989',
      submetric: `${stats.total} Tasks total`,
      trend: '12% increase from last month',
      isUp: true,
      iconBg: 'bg-[#F3E8FF] text-[#9333EA]',
      icon: Layers,
    },
    {
      title: 'Projects',
      metric: `${Math.max(stats.todo, 8)} /${Math.max(stats.total, 24)}`,
      submetric: `${stats.todo} To Do pending`,
      trend: '12% decrease from last month',
      isUp: false,
      iconBg: 'bg-[#FFEDD5] text-[#EA580C]',
      icon: Briefcase,
    },
    {
      title: 'Time spent',
      metric: '1022 /1300 Hrs',
      submetric: `${stats.in_progress} In progress active`,
      trend: '8% increase from last month',
      isUp: true,
      iconBg: 'bg-[#DBEAFE] text-[#2563EB]',
      icon: Clock,
    },
    {
      title: 'Resources',
      metric: `${Math.max(stats.completed, 12)} /${Math.max(stats.total, 24)}`,
      submetric: `${stats.completed} Completed deliverables`,
      trend: '2% increase from last month',
      isUp: true,
      iconBg: 'bg-[#FEF3C7] text-[#D97706]',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Overview Header Row */}
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A]">Overview</h2>

        <div className="relative">
          <select
            value={timeFilter}
            onChange={(e) => onTimeFilterChange?.(e.target.value)}
            className="appearance-none bg-white border border-transparent rounded-full px-3.5 py-1.5 text-xs font-semibold text-[#1A1A1A] pr-7 shadow-sm focus:outline-none cursor-pointer"
          >
            <option value="Last 30 days">Last 30 days</option>
            <option value="This week">This week</option>
            <option value="This quarter">This quarter</option>
          </select>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none text-[#8E8E93]">
            ▼
          </span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white rounded-[22px] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Icon */}
              <div
                className={`w-9 h-9 rounded-full ${c.iconBg} flex items-center justify-center mb-3 shadow-xs`}
              >
                <c.icon className="w-4 h-4" />
              </div>

              {/* Title */}
              <div className="text-[11px] font-medium text-[#8E8E93]">{c.title}</div>

              {/* Metric Number */}
              <div className="text-xl sm:text-2xl font-extrabold text-[#1A1A1A] tracking-tight mt-1">
                {c.metric}
              </div>
            </div>

            {/* Subtitle Trend */}
            <div className="mt-3 pt-2.5 border-t border-[#F5EFE9] flex items-center gap-1.5 text-[10px] font-semibold">
              {c.isUp ? (
                <ArrowUpRight className="w-3 h-3 text-[#16A34A] flex-shrink-0" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-[#DC2626] flex-shrink-0" />
              )}
              <span className={c.isUp ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                {c.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
