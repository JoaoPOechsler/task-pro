"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  subscribeTasks,
  createTask as fbCreate,
  updateTask as fbUpdate,
  deleteTask as fbDelete,
} from "@/lib/tasks";
import { Task } from "@/types/task";

type TaskInput = Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">;

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsubscribe = subscribeTasks(user.uid, (data) => {
      setTasks(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  return {
    tasks,
    loading,
    createTask: (data: TaskInput) => fbCreate(user!.uid, data),
    updateTask: (id: string, data: Partial<TaskInput>) => fbUpdate(id, data),
    deleteTask: (id: string) => fbDelete(id),
  };
}
