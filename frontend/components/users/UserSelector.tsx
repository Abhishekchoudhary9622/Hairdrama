'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { api } from '@/lib/api';
import { Users, Check } from 'lucide-react';

interface UserSelectorProps {
  selectedUserId: string;
  onSelectUser: (user: User) => void;
  label?: string;
  disabled?: boolean;
}

export function UserSelector({
  selectedUserId,
  onSelectUser,
  label = 'Assign To',
  disabled = false,
}: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await api.getUsers();
        setUsers(data);
      } catch (err) {
        console.error('Failed to load users for selector:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-left text-sm text-slate-200 hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2.5 truncate">
          {selectedUser ? (
            <>
              {selectedUser.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedUser.avatar_url}
                  alt={selectedUser.name}
                  className="w-6 h-6 rounded-full border border-slate-700 bg-slate-800"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {selectedUser.name.charAt(0)}
                </div>
              )}
              <div className="truncate">
                <span className="font-medium text-slate-200">{selectedUser.name}</span>
                <span className="text-xs text-slate-400 ml-1.5 hidden sm:inline">({selectedUser.email})</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4" />
              <span>{loading ? 'Loading team members...' : 'Select team member...'}</span>
            </div>
          )}
        </div>
        <span className="text-slate-500 text-xs">▼</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-1 divide-y divide-slate-800/50">
            {users.length === 0 ? (
              <div className="px-4 py-3 text-xs text-slate-400 text-center">
                {loading ? 'Loading team members...' : 'No other users found.'}
              </div>
            ) : (
              users.map((user) => {
                const isSelected = user.id === selectedUserId;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      onSelectUser(user);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-sm hover:bg-slate-800/80 transition-colors ${
                      isSelected ? 'bg-indigo-950/40 text-indigo-300' : 'text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {user.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-6 h-6 rounded-full border border-slate-700"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-semibold text-white">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div className="truncate">
                        <div className="font-medium text-slate-200 truncate">{user.name}</div>
                        <div className="text-xs text-slate-400 truncate">{user.email}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
