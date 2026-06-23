export type Priority = "baixa" | "media" | "alta";
export type TaskStatus = "todo" | "doing" | "done";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: Priority;
  status: TaskStatus;
  subtasks: Subtask[];
  createdAt: Date;
  updatedAt: Date;
}
