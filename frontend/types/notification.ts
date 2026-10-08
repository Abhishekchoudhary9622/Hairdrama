export interface AppNotification {
  id: string;
  user_id: string;
  task_id?: string | null;
  type: 'TASK_ASSIGNED' | 'TASK_COMPLETED' | 'TASK_STATUS_CHANGED' | 'TASK_UPDATED';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
