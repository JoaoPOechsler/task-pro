import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task, Comment } from "@/types/task";

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

export function subscribeComments(taskId: string, callback: (comments: Comment[]) => void) {
  const q = query(
    collection(db, "tasks", taskId, "comments"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const comments = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        text: data.text as string,
        userId: data.userId as string,
        userName: data.userName as string,
        createdAt: data.createdAt ? (data.createdAt as Timestamp).toDate() : new Date(),
      } satisfies Comment;
    });
    callback(comments);
  });
}

export async function addComment(
  taskId: string,
  comment: Omit<Comment, "id" | "createdAt">
) {
  await addDoc(collection(db, "tasks", taskId, "comments"), {
    ...comment,
    createdAt: serverTimestamp(),
  });
}

export async function deleteComment(taskId: string, commentId: string) {
  await deleteDoc(doc(db, "tasks", taskId, "comments", commentId));
}
