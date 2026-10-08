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
        <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[#F7F2EC] border border-[#E5DDD2] rounded-2xl text-left text-xs text-[#1A1A1A] hover:bg-[#EFE9E0] focus:outline-none focus:border-[#F15A24] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <div className="flex items-center gap-2.5 truncate">
          {selectedUser ? (
            <>
              {selectedUser.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selectedUser.avatar_url}
                  alt={selectedUser.name}
                  className="w-6 h-6 rounded-full border border-slate-300 object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#141414] flex items-center justify-center text-[10px] font-bold text-white">
                  {selectedUser.name.charAt(0)}
                </div>
              )}
              <div className="truncate">
                <span className="font-bold text-[#1A1A1A]">{selectedUser.name}</span>
                <span className="text-[10px] text-[#8E8E93] ml-1.5 hidden sm:inline">({selectedUser.email})</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-[#8E8E93]">
              <Users className="w-3.5 h-3.5" />
              <span>{loading ? 'Loading team members...' : 'Select team member...'}</span>
            </div>
          )}
        </div>
        <span className="text-[#8E8E93] text-[9px]">▼</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-[#E5DDD2] rounded-2xl shadow-xl py-1 divide-y divide-[#F0EAE1]">
            {users.length === 0 ? (
              <div className="px-4 py-3 text-xs text-[#8E8E93] text-center">
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
                    className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs hover:bg-[#FAF7F2] transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#FFF0E6] text-[#E65100]' : 'text-[#1A1A1A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {user.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatar_url}
                          alt={user.name}
                          className="w-6 h-6 rounded-full border border-slate-200 object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#141414] flex items-center justify-center text-[10px] font-bold text-white">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div className="truncate">
                        <div className="font-bold text-[#1A1A1A] truncate">{user.name}</div>
                        <div className="text-[10px] text-[#8E8E93] truncate">{user.email}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#E65100] flex-shrink-0" />}
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
