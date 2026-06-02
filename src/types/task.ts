export type Priority = "baixa" | "media" | "alta";
export type TaskStatus = "todo" | "doing" | "done";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  status: TaskStatus;
  subtasks: Subtask[];
  createdAt: Date;
  updatedAt: Date;
}
