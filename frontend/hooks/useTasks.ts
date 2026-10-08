'use client';

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStats, TaskFiltersState, TaskStatus, TaskPriority } from '@/types/task';
import { api } from '@/lib/api';

export function useTasks(initialFilters?: TaskFiltersState) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    todo: 0,
    in_progress: 0,
    completed: 0,
    overdue: 0,
  });
  const [filters, setFilters] = useState<TaskFiltersState>(initialFilters || {});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasksAndStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedTasks, fetchedStats] = await Promise.all([
        api.getTasks({
          status: filters.status,
          priority: filters.priority,
          assigned_to: filters.assignee,
          search: filters.search,
          view: filters.view,
        }),
        api.getTaskStats(),
      ]);
      setTasks(fetchedTasks);
      setStats(fetchedStats);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasksAndStats();
  }, [fetchTasksAndStats]);

  const createTask = async (data: {
    title: string;
    description?: string;
    assigned_to: string;
    priority?: TaskPriority;
    due_date?: string | null;
  }) => {
    try {
      const newTask = await api.createTask(data);
      await fetchTasksAndStats();
      return newTask;
    } catch (err: any) {
      throw err;
    }
  };

  const updateStatus = async (taskId: string, status: TaskStatus) => {
    try {
      const updated = await api.updateTaskStatus(taskId, status);
      await fetchTasksAndStats();
      return updated;
    } catch (err: any) {
      throw err;
    }
  };

  const reassignTask = async (taskId: string, assignedToId: string) => {
    try {
      const updated = await api.assignTask(taskId, assignedToId);
      await fetchTasksAndStats();
      return updated;
    } catch (err: any) {
      throw err;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updated = await api.updateTask(taskId, updates);
      await fetchTasksAndStats();
      return updated;
    } catch (err: any) {
      throw err;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      await fetchTasksAndStats();
    } catch (err: any) {
      throw err;
    }
  };

  return {
    tasks,
    stats,
    loading,
    error,
    filters,
    setFilters,
    createTask,
    updateStatus,
    reassignTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasksAndStats,
  };
}
