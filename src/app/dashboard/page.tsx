"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { CheckSquare, Clock, AlertTriangle, Loader2, ListTodo } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  const now = new Date();
  const pending = tasks.filter((t) => t.status !== "done").length;
  const doneThisWeek = tasks.filter((t) => {
    if (t.status !== "done") return false;
    const diff = now.getTime() - t.updatedAt.getTime();
    return diff <= 7 * 24 * 60 * 60 * 1000;
  }).length;
  const overdue = tasks.filter(
    (t) => t.status !== "done" && t.dueDate && t.dueDate < now
  ).length;

  const displayName = userProfile?.name ?? user.displayName ?? user.email ?? "Usuário";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Olá, {displayName.split(" ")[0]}!
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Resumo das suas tarefas</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              {tasksLoading ? (
                <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />
              ) : (
                <p className="text-xl font-bold text-gray-900">{pending}</p>
              )}
              <p className="text-xs text-gray-400">Pendentes</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
              <CheckSquare className="w-4 h-4 text-green-600" />
            </div>
            <div>
              {tasksLoading ? (
                <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />
              ) : (
                <p className="text-xl font-bold text-gray-900">{doneThisWeek}</p>
              )}
              <p className="text-xs text-gray-400">Concluídas esta semana</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              {tasksLoading ? (
                <Loader2 className="w-4 h-4 text-gray-300 animate-spin" />
              ) : (
                <p className="text-xl font-bold text-gray-900">{overdue}</p>
              )}
              <p className="text-xs text-gray-400">Vencidas</p>
            </div>
          </div>
        </div>

        {/* Tarefas recentes ou empty state */}
        {!tasksLoading && tasks.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <ListTodo className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Nenhuma tarefa ainda</h3>
            <p className="text-xs text-gray-400 mb-4">Comece criando sua primeira tarefa.</p>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Criar tarefa
            </Link>
          </div>
        ) : (
          !tasksLoading && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-700">Tarefas recentes</h2>
                <Link href="/tasks" className="text-xs text-blue-600 hover:underline">Ver todas</Link>
              </div>
              <div className="divide-y divide-gray-50">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 px-4 py-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      task.status === "done" ? "bg-green-400" :
                      task.status === "doing" ? "bg-blue-400" : "bg-gray-300"
                    }`} />
                    <span className={`text-sm flex-1 truncate ${task.status === "done" ? "line-through text-gray-400" : "text-gray-700"}`}>
                      {task.title}
                    </span>
                    {task.dueDate && task.dueDate < now && task.status !== "done" && (
                      <span className="text-xs text-red-400 shrink-0">Vencida</span>
                    )}
                    {task.dueDate && task.dueDate >= now && (
                      <span className="text-xs text-gray-400 shrink-0">
                        {task.dueDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}
