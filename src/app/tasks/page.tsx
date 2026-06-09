"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Loader2,
  ListTodo,
  Pencil,
  Trash2,
  Calendar,
  Flag,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { Task, Priority, TaskStatus } from "@/types/task";
import Sidebar from "@/components/Sidebar";
import TaskModal from "@/components/TaskModal";

const statusLabels: Record<TaskStatus, string> = {
  todo: "A fazer",
  doing: "Em andamento",
  done: "Concluída",
};

const statusColors: Record<TaskStatus, string> = {
  todo: "bg-gray-100 text-gray-600",
  doing: "bg-blue-50 text-blue-600",
  done: "bg-green-50 text-green-600",
};

const priorityLabels: Record<Priority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

const priorityColors: Record<Priority, string> = {
  baixa: "bg-gray-100 text-gray-500",
  media: "bg-yellow-50 text-yellow-600",
  alta: "bg-red-50 text-red-500",
};

type FilterStatus = TaskStatus | "all";

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterPriority, setFilterPriority] = useState<Priority | "all">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  function isOverdue(task: Task) {
    return task.dueDate && task.status !== "done" && task.dueDate < new Date();
  }

  function formatDate(date: Date) {
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  function subtaskProgress(task: Task) {
    if (!task.subtasks.length) return null;
    const done = task.subtasks.filter((s) => s.completed).length;
    return { done, total: task.subtasks.length };
  }

  async function handleSave(data: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">) {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data);
        toast.success("Tarefa atualizada!");
      } else {
        await createTask(data);
        toast.success("Tarefa criada!");
      }
    } catch {
      toast.error("Erro ao salvar tarefa.");
      throw new Error("save failed");
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteTask(id);
      toast.success("Tarefa excluída.");
    } catch {
      toast.error("Erro ao excluir tarefa.");
    } finally {
      setDeletingId(null);
    }
  }

  function openCreate() {
    setEditingTask(undefined);
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  const statusTabs: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "Todas" },
    { value: "todo", label: "A fazer" },
    { value: "doing", label: "Em andamento" },
    { value: "done", label: "Concluídas" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-6 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tarefas</h1>
            <p className="text-gray-400 text-sm mt-0.5">{tasks.length} tarefa{tasks.length !== 1 ? "s" : ""} no total</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Nova tarefa
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar tarefa..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as Priority | "all")}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
          >
            <option value="all">Todas as prioridades</option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        {/* Tabs de status */}
        <div className="flex gap-1 mb-5 bg-white border border-gray-200 rounded-lg p-1 w-fit">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                filterStatus === tab.value
                  ? "bg-blue-600 text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <ListTodo className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              {tasks.length === 0 ? "Nenhuma tarefa ainda" : "Nenhuma tarefa encontrada"}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              {tasks.length === 0
                ? "Crie sua primeira tarefa clicando em Nova tarefa."
                : "Tente ajustar os filtros ou a busca."}
            </p>
            {tasks.length === 0 && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Criar tarefa
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((task) => {
              const progress = subtaskProgress(task);
              const overdue = isOverdue(task);
              return (
                <div
                  key={task.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{task.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>
                        {statusLabels[task.status]}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${priorityColors[task.priority]}`}>
                        <Flag className="w-2.5 h-2.5" />
                        {priorityLabels[task.priority]}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-gray-400 line-clamp-2 mb-2">{task.description}</p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      {task.dueDate && (
                        <span className={`text-xs flex items-center gap-1 ${overdue ? "text-red-500" : "text-gray-400"}`}>
                          <Calendar className="w-3 h-3" />
                          {overdue ? "Vencida em " : ""}{formatDate(task.dueDate)}
                        </span>
                      )}
                      {progress && (
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${(progress.done / progress.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{progress.done}/{progress.total}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(task)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={deletingId === task.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {deletingId === task.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {modalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
