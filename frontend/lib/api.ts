import { API_BASE_URL } from './constants';
import { User } from '@/types/user';
import { Task, TaskStats, TaskActivity, TaskStatus, TaskPriority } from '@/types/task';
import { AppNotification } from '@/types/notification';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('hairdrama_token');
  }

  public setAuthToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hairdrama_token', token);
    }
  }

  public removeAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hairdrama_token');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await response.json().catch(() => ({
      success: false,
      error: { code: 'PARSE_ERROR', message: 'Unable to parse server response' },
    }));

    if (!response.ok || !data.success) {
      const errorMsg = data.error?.message || data.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      (err as any).code = data.error?.code || 'UNKNOWN_ERROR';
      throw err;
    }

    return data.data as T;
  }

  // Auth API
  async getGoogleAuthUrl(): Promise<string> {
    const res = await this.request<{ auth_url: string }>('/auth/google');
    return res.auth_url;
  }

  async devLogin(email: string, name?: string): Promise<{ user: User; token: string }> {
    return this.request<{ user: User; token: string }>('/auth/dev-login', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.removeAuthToken();
    }
  }

  // Users API
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.request<User[]>(`/users/search?q=${encodeURIComponent(query)}`);
  }

  // Tasks API
  async getTasks(params?: {
    status?: string;
    priority?: string;
    assigned_to?: string;
    search?: string;
    view?: string;
  }): Promise<Task[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.priority) query.append('priority', params.priority);
    if (params?.assigned_to) query.append('assigned_to', params.assigned_to);
    if (params?.search) query.append('search', params.search);
    if (params?.view) query.append('view', params.view);

    const queryString = query.toString();
    return this.request<Task[]>(`/tasks${queryString ? `?${queryString}` : ''}`);
  }

  async getTaskStats(): Promise<TaskStats> {
    return this.request<TaskStats>('/tasks/stats');
  }

  async getTaskById(id: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`);
  }

  async createTask(taskData: {
    title: string;
    description?: string;
    assigned_to: string;
    priority?: TaskPriority;
    due_date?: string | null;
  }): Promise<Task> {
    return this.request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.request<Task>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async assignTask(id: string, assigned_to: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ assigned_to }),
    });
  }

  async deleteTask(id: string): Promise<void> {
    await this.request(`/tasks/${id}`, { method: 'DELETE' });
  }

  async getTaskActivity(id: string): Promise<TaskActivity[]> {
    return this.request<TaskActivity[]>(`/tasks/${id}/activity`);
  }

  // Notifications API
  async getNotifications(unreadOnly = false): Promise<{ notifications: AppNotification[]; unread_count: number }> {
    return this.request<{ notifications: AppNotification[]; unread_count: number }>(
      `/notifications?unread_only=${unreadOnly}`
    );
  }

  async markNotificationRead(id: string): Promise<AppNotification> {
    return this.request<AppNotification>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead(): Promise<{ modified_count: number }> {
    return this.request<{ modified_count: number }>('/notifications/read-all', {
      method: 'PATCH',
    });
  }
}

export const api = new ApiClient();
