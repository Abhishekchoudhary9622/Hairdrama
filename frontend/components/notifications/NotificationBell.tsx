'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, CheckCheck, Inbox, CheckCircle, UserPlus, RefreshCw } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, refreshNotifications } =
    useNotifications();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors border border-transparent hover:border-slate-700/60"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-lg animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-semibold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => refreshNotifications()}
                  className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllAsRead()}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
              {notifications.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <Inbox className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No notifications yet</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    You will receive alerts here when tasks are assigned or completed.
                  </p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!item.is_read) markAsRead(item.id);
                    }}
                    className={`p-3.5 text-left transition-colors cursor-pointer flex gap-3 ${
                      item.is_read
                        ? 'bg-slate-900/50 opacity-70 hover:opacity-100 hover:bg-slate-800/40'
                        : 'bg-indigo-950/20 hover:bg-indigo-950/40 border-l-2 border-indigo-500'
                    }`}
                  >
                    <div className="mt-0.5">
                      {item.type === 'TASK_ASSIGNED' && (
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <UserPlus className="w-3.5 h-3.5" />
                        </div>
                      )}
                      {item.type === 'TASK_COMPLETED' && (
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                      )}
                      {item.type !== 'TASK_ASSIGNED' && item.type !== 'TASK_COMPLETED' && (
                        <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                          <Bell className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`text-xs font-semibold truncate ${
                            item.is_read ? 'text-slate-300' : 'text-white'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-500 flex-shrink-0">
                          {formatDateTime(item.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
