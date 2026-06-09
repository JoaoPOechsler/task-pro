import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task } from "@/types/task";

type TaskInput = Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">;

function toFirestore(data: Partial<TaskInput>) {
  return {
    ...data,
    dueDate: data.dueDate ? Timestamp.fromDate(data.dueDate) : null,
  };
}

function fromFirestore(id: string, data: Record<string, unknown>): Task {
  return {
    ...(data as Omit<Task, "id" | "dueDate" | "createdAt" | "updatedAt">),
    id,
    dueDate: data.dueDate ? (data.dueDate as Timestamp).toDate() : null,
    createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
    updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate() : new Date(),
  };
}

export function subscribeTasks(userId: string, callback: (tasks: Task[]) => void) {
  const q = query(collection(db, "tasks"), where("userId", "==", userId));
  return onSnapshot(q, (snap) => {
    const tasks = snap.docs
      .map((d) => fromFirestore(d.id, d.data()))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    callback(tasks);
  });
}

export async function createTask(userId: string, data: TaskInput) {
  await addDoc(collection(db, "tasks"), {
    ...toFirestore(data),
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTask(taskId: string, data: Partial<TaskInput>) {
  await updateDoc(doc(db, "tasks", taskId), {
    ...toFirestore(data),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTask(taskId: string) {
  await deleteDoc(doc(db, "tasks", taskId));
}
