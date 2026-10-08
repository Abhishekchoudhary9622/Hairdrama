export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const TASK_STATUSES = [
  { value: 'TODO', label: 'To Do', color: 'bg-slate-500/10 text-slate-400 border-slate-700/50' },
  { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-500/10 text-blue-400 border-blue-700/50' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-700/50' },
] as const;

export const TASK_PRIORITIES = [
  { value: 'LOW', label: 'Low', color: 'bg-slate-500/10 text-slate-400 border-slate-700/50' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-700/50' },
  { value: 'HIGH', label: 'High', color: 'bg-amber-500/10 text-amber-400 border-amber-700/50' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-rose-500/10 text-rose-400 border-rose-700/50' },
] as const;
