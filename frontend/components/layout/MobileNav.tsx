'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { X } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-xs bg-slate-950 border-r border-slate-800 flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-sm font-bold text-white">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Sidebar className="w-full border-none flex-1" onClose={onClose} />
      </div>
    </div>
  );
}
