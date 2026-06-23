"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import {
  subscribeComments,
  addComment,
  deleteComment,
  updateTask,
} from "@/lib/tasks";
import { Task, Subtask, Priority, TaskStatus, Comment } from "@/types/task";
import Sidebar from "@/components/Sidebar";
import {
  Loader2,
  ArrowLeft,
  Pencil,
  Trash2,
  Plus,
  Save,
  X,
  MessageSquare,
  CheckSquare,
  Square,
  Flag,
  Calendar,
  Send,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
];

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "A Fazer" },
  { value: "doing", label: "Fazendo" },
  { value: "done", label: "Concluído" },
];

const PRIORITY_COLORS: Record<string, string> = {
  alta: "bg-red-100 text-red-700",
  media: "bg-yellow-100 text-yellow-700",
  baixa: "bg-green-100 text-green-700",
};

const STATUS_COLORS: Record<string, string> = {
  todo: "bg-blue-100 text-blue-700",
  doing: "bg-yellow-100 text-yellow-700",
  done: "bg-green-100 text-green-700",
};

export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: taskId } = use(params);
  const { user, userProfile, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading, deleteTask } = useTasks();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editPriority, setEditPriority] = useState<Priority>("media");
  const [editStatus, setEditStatus] = useState<TaskStatus>("todo");
  const [editSubtasks, setEditSubtasks] = useState<Subtask[]>([]);
  const [newSubtask, setNewSubtask] = useState("");

  // Comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [sendingComment, setSendingComment] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!tasksLoading) {
      const found = tasks.find((t) => t.id === taskId);
      if (found) {
        setTask(found);
      } else if (!tasksLoading) {
        router.replace("/tasks");
      }
    }
  }, [tasks, tasksLoading, taskId, router]);

  useEffect(() => {
    if (!taskId) return;
    const unsub = subscribeComments(taskId, setComments);
    return unsub;
  }, [taskId]);

  function startEdit() {
    if (!task) return;
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditDate(task.dueDate ? task.dueDate.toISOString().split("T")[0] : "");
    setEditPriority(task.priority);
    setEditStatus(task.status);
    setEditSubtasks([...task.subtasks]);
    setEditing(true);
  }

  async function saveEdit() {
    if (!task || !editTitle.trim()) {
      toast.error("O título é obrigatório.");
      return;
    }
    setSaving(true);
    try {
      await updateTask(task.id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        dueDate: editDate ? new Date(editDate + "T12:00:00") : null,
        priority: editPriority,
        status: editStatus,
        subtasks: editSubtasks,
      });
      toast.success("Tarefa atualizada!");
      setEditing(false);
    } catch {
      toast.error("Erro ao salvar tarefa.");
    } finally {
      setSaving(false);
    }
  }

  async function toggleSubtask(subtaskId: string) {
    if (!task) return;
    const updated = task.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    await updateTask(task.id, { subtasks: updated });
  }

  async function handleDelete() {
    if (!task) return;
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;
    await deleteTask(task.id);
    toast.success("Tarefa excluída!");
    router.push("/tasks");
  }

  function addEditSubtask() {
    if (!newSubtask.trim()) return;
    setEditSubtasks([
      ...editSubtasks,
      { id: crypto.randomUUID(), title: newSubtask.trim(), completed: false },
    ]);
    setNewSubtask("");
  }

  async function handleAddComment() {
    if (!newComment.trim() || !user) return;
    setSendingComment(true);
    try {
      await addComment(taskId, {
        text: newComment.trim(),
        userId: user.uid,
        userName: userProfile?.name ?? user.displayName ?? user.email ?? "Usuário",
      });
      setNewComment("");
    } catch {
      toast.error("Erro ao adicionar comentário.");
    } finally {
      setSendingComment(false);
    }
  }

  if (authLoading || tasksLoading || !task) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
        </main>
      </div>
    );
  }

  const now = new Date();
  const completedSubs = task.subtasks.filter((s) => s.completed).length;
  const progressPct = task.subtasks.length > 0 ? (completedSubs / task.subtasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/tasks"
            aria-label="Voltar para tarefas"
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex-1">
            <p className="text-xs text-gray-400">Detalhes da Tarefa</p>
          </div>
          <div className="flex items-center gap-2">
            {!editing && (
              <>
                <button
                  onClick={startEdit}
                  aria-label="Editar tarefa"
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  aria-label="Excluir tarefa"
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir
                </button>
              </>
            )}
            {editing && (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancelar
                </button>
                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Salvar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {/* Card principal */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Título *</label>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Descrição</label>
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Vencimento
                    </label>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      <Flag className="w-3 h-3 inline mr-1" />
                      Prioridade
                    </label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as Priority)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {PRIORITY_OPTIONS.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Status</label>
                  <div className="flex gap-2">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setEditStatus(s.value)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                          editStatus === s.value
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-200 text-gray-600 hover:border-blue-300"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-1">
                    <h1 className={`text-lg font-bold ${task.status === "done" ? "line-through text-gray-400" : "text-gray-900"}`}>
                      {task.title}
                    </h1>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{task.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[task.status]}`}>
                    {STATUS_OPTIONS.find((s) => s.value === task.status)?.label}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>
                    <Flag className="w-2.5 h-2.5 inline mr-1" />
                    {PRIORITY_OPTIONS.find((p) => p.value === task.priority)?.label}
                  </span>
                  {task.dueDate && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1 ${
                      task.dueDate < now && task.status !== "done"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      <Calendar className="w-2.5 h-2.5" />
                      {task.dueDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Subtarefas */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Subtarefas</h2>

            {editing ? (
              <div className="space-y-2">
                {editSubtasks.map((s) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={s.completed}
                      onChange={() =>
                        setEditSubtasks(editSubtasks.map((st) =>
                          st.id === s.id ? { ...st, completed: !st.completed } : st
                        ))
                      }
                      className="rounded accent-blue-600"
                    />
                    <span className={`text-sm flex-1 ${s.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                      {s.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditSubtasks(editSubtasks.filter((st) => st.id !== s.id))}
                      aria-label={`Remover subtarefa: ${s.title}`}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEditSubtask(); } }}
                    placeholder="Adicionar subtarefa..."
                    className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addEditSubtask}
                    aria-label="Adicionar subtarefa"
                    className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {task.subtasks.length > 0 && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">{completedSubs}/{task.subtasks.length} concluídas</span>
                      <span className="text-xs font-medium text-blue-600">{Math.round(progressPct)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                        role="progressbar"
                        aria-valuenow={Math.round(progressPct)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                )}
                {task.subtasks.length === 0 && (
                  <p className="text-xs text-gray-400">Nenhuma subtarefa. Clique em Editar para adicionar.</p>
                )}
                <div className="space-y-2">
                  {task.subtasks.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => toggleSubtask(s.id)}
                      aria-label={`${s.completed ? "Desmarcar" : "Marcar"} subtarefa: ${s.title}`}
                      className="flex items-center gap-2 w-full text-left py-1 hover:bg-gray-50 rounded-lg px-1 transition-colors"
                    >
                      {s.completed ? (
                        <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-300 shrink-0" />
                      )}
                      <span className={`text-sm ${s.completed ? "line-through text-gray-400" : "text-gray-700"}`}>
                        {s.title}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Comentários / Log de trabalho */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Log de Trabalho
            </h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {comments.length === 0 && (
                <p className="text-xs text-gray-400">Nenhum comentário ainda.</p>
              )}
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-xs font-bold text-blue-600">
                    {c.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700">{c.userName}</span>
                      <span className="text-xs text-gray-400">
                        {c.createdAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {c.userId === user?.uid && (
                        <button
                          onClick={() => deleteComment(taskId, c.id)}
                          aria-label="Excluir comentário"
                          className="ml-auto text-gray-300 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                placeholder="Adicionar comentário ou log..."
                aria-label="Novo comentário"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddComment}
                disabled={sendingComment || !newComment.trim()}
                aria-label="Enviar comentário"
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {sendingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400">
              Criada em{" "}
              {task.createdAt.toLocaleDateString("pt-BR", {
                day: "2-digit", month: "long", year: "numeric",
              })}
              {" · "}
              Atualizada em{" "}
              {task.updatedAt.toLocaleDateString("pt-BR", {
                day: "2-digit", month: "long", year: "numeric",
              })}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
