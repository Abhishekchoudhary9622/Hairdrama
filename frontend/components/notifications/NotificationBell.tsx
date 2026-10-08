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
        className="w-8 h-8 rounded-full bg-white hover:bg-slate-50 flex items-center justify-center text-[#1A1A1A] transition-colors relative shadow-2xs"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 text-[#444]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#F15A24] ring-2 ring-white animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E5DDD2] rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-[#F0EAE1]">
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between bg-[#FDFBF7]">
              <div className="flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-[#F15A24]" />
                <span className="text-xs font-bold text-[#1A1A1A]">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#FFF0E6] text-[#E65100]">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => refreshNotifications()}
                  className="p-1 text-[#8E8E93] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  title="Refresh alerts"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllAsRead()}
                    className="text-[11px] text-[#F15A24] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-[#F9F6F0]">
              {notifications.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <Inbox className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#1A1A1A]">No notifications yet</p>
                  <p className="text-[10px] text-[#8E8E93] mt-0.5">
                    Real-time alerts appear when tasks are assigned or completed.
                  </p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (!item.is_read) markAsRead(item.id);
                    }}
                    className={`p-3 text-left transition-colors cursor-pointer flex gap-3 ${
                      item.is_read
                        ? 'bg-white opacity-75 hover:opacity-100 hover:bg-[#FAF7F2]'
                        : 'bg-[#FFF9F5] hover:bg-[#FFF4EC] border-l-3 border-[#F15A24]'
                    }`}
                  >
                    <div className="mt-0.5">
                      {item.type === 'TASK_ASSIGNED' && (
                        <div className="w-6 h-6 rounded-full bg-[#FFF0E6] text-[#E65100] flex items-center justify-center">
                          <UserPlus className="w-3 h-3" />
                        </div>
                      )}
                      {item.type === 'TASK_COMPLETED' && (
                        <div className="w-6 h-6 rounded-full bg-[#E6F7EC] text-[#1E8E3E] flex items-center justify-center">
                          <CheckCircle className="w-3 h-3" />
                        </div>
                      )}
                      {item.type !== 'TASK_ASSIGNED' && item.type !== 'TASK_COMPLETED' && (
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                          <Bell className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`text-xs truncate ${
                            item.is_read ? 'font-medium text-[#555]' : 'font-bold text-[#1A1A1A]'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[9px] text-[#8E8E93] flex-shrink-0">
                          {formatDateTime(item.created_at)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#666] line-clamp-2 leading-snug">
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
