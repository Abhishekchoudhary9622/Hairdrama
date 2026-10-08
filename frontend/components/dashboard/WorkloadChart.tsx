'use client';

import React from 'react';

interface WorkloadChartProps {
  filter?: string;
}

export function WorkloadChart({ filter = 'Last 3 months' }: WorkloadChartProps) {
  const members = [
    {
      name: 'Sam',
      count: '07',
      topType: 'black',
      hollowBeads: 2,
    },
    {
      name: 'Meldy',
      count: '08',
      topType: 'black',
      hollowBeads: 3,
    },
    {
      name: 'Ken',
      count: '02',
      topType: 'black',
      hollowBeads: 1,
    },
    {
      name: 'Dmitry',
      count: '10',
      topType: 'orange', // Highlighted peak center
      hollowBeads: 4,
    },
    {
      name: 'Vego',
      count: '08',
      topType: 'black',
      hollowBeads: 3,
    },
    {
      name: 'Kadin',
      count: '02',
      topType: 'black',
      hollowBeads: 1,
    },
    {
      name: 'Maim',
      count: '04',
      topType: 'black',
      hollowBeads: 2,
    },
  ];

  return (
    <div className="bg-white rounded-[24px] p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[#1A1A1A]">Projects Workload</h3>

        <div className="relative">
          <select
            value={filter}
            onChange={() => {}}
            className="appearance-none bg-[#F7F2EC] hover:bg-[#EFE8E0] rounded-full px-3 py-1 text-[11px] font-bold text-[#1A1A1A] pr-6 shadow-2xs focus:outline-none cursor-pointer"
          >
            <option value="Last 3 months">Last 3 months</option>
            <option value="This month">This month</option>
            <option value="This year">This year</option>
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none text-[#8E8E93]">
            ▼
          </span>
        </div>
      </div>

      {/* Beaded Columns Chart Area */}
      <div className="h-44 flex items-end justify-between px-2 pt-2">
        {members.map((m, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2 flex-1">
            {/* Column of Stacked Beads */}
            <div className="relative flex flex-col-reverse items-center justify-start gap-1 pb-1">
              {/* Vertical connecting background line */}
              <div className="absolute top-0 bottom-0 w-[1.5px] bg-[#E8E1D9] -z-0" />

              {/* Hollow white beads underneath */}
              {Array.from({ length: m.hollowBeads }).map((_, bIdx) => (
                <div
                  key={bIdx}
                  className="w-4 h-4 rounded-full bg-white border border-[#222] z-10 shadow-2xs"
                />
              ))}

              {/* Top Highlight/Count Bead */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-extrabold text-white z-10 shadow-xs ${
                  m.topType === 'orange' ? 'bg-[#F15A24]' : 'bg-[#1A1A1A]'
                }`}
              >
                {m.count}
              </div>
            </div>

            {/* Member Name */}
            <span className="text-[10px] font-medium text-[#8E8E93] truncate max-w-[40px]">
              {m.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
