"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  LogOut,
  Loader2,
  LayoutDashboard,
  Kanban,
  Calendar,
  ListTodo,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, userProfile, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const displayName = userProfile?.name ?? user.displayName ?? user.email ?? "Usuário";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 py-5 px-3 gap-1">
        <div className="flex items-center gap-2 text-blue-600 font-bold px-2 mb-5">
          <CheckSquare className="w-4 h-4" />
          TaskPRO
        </div>
        {[
          { href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" />, label: "Dashboard" },
          { href: "/tasks", icon: <ListTodo className="w-4 h-4" />, label: "Tarefas" },
          { href: "/kanban", icon: <Kanban className="w-4 h-4" />, label: "Kanban" },
          { href: "/calendar", icon: <Calendar className="w-4 h-4" />, label: "Calendário" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
        <button
          onClick={logout}
          className="mt-auto flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Olá, {displayName.split(" ")[0]}!
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">Resumo das suas tarefas</p>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-400">Pendentes</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
            <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-400">Concluídas esta semana</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 flex items-center gap-3">
            <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-400">Vencidas</p>
            </div>
          </div>
        </div>

        {/* Empty state */}
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
      </main>
    </div>
  );
}
