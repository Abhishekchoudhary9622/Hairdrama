import { User } from './user';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_by: string;
  creator?: User;
  assigned_to: string;
  assignee?: User;
  due_date?: string | null;
  created_at: string;
  updated_at?: string | null;
  completed_at?: string | null;
}

export interface TaskActivity {
  id: string;
  task_id: string;
  user_id: string;
  user?: User;
  action: string;
  old_value?: string | null;
  new_value?: string | null;
  created_at: string;
}

export interface TaskFiltersState {
  search?: string;
  status?: string;
  priority?: string;
  assignee?: string;
  view?: 'all' | 'created' | 'assigned';
}

export interface TaskStats {
  total: number;
  todo: number;
  in_progress: number;
  completed: number;
  overdue: number;
}
