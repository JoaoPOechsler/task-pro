"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task";
import Sidebar from "@/components/Sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Loader2, X, Flag, Calendar, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

const PRIORITY_COLORS: Record<string, string> = {
  alta: "#ef4444",
  media: "#f59e0b",
  baixa: "#22c55e",
};

const STATUS_LABELS: Record<string, string> = {
  todo: "A Fazer",
  doing: "Fazendo",
  done: "Concluído",
};

const PRIORITY_LABELS: Record<string, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

export default function CalendarPage() {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks();
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const events = tasks
    .filter((t) => t.dueDate)
    .map((t) => ({
      id: t.id,
      title: t.title,
      date: t.dueDate!.toISOString().split("T")[0],
      backgroundColor: PRIORITY_COLORS[t.priority],
      borderColor: PRIORITY_COLORS[t.priority],
      textColor: "#ffffff",
      extendedProps: { taskId: t.id },
    }));

  function handleEventClick(info: { event: { id: string } }) {
    const task = tasks.find((t) => t.id === info.event.id);
    if (task) setSelectedTask(task);
  }

  const now = new Date();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Calendário</h1>
          <p className="text-gray-400 text-sm mt-0.5">Tarefas exibidas pela data de vencimento</p>
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap gap-3 mb-4">
          {[
            { label: "Alta prioridade", color: "#ef4444" },
            { label: "Média prioridade", color: "#f59e0b" },
            { label: "Baixa prioridade", color: "#22c55e" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
              {item.label}
            </div>
          ))}
        </div>

        {tasksLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-4 calendar-wrapper">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              eventClick={handleEventClick}
              locale="pt-br"
              buttonText={{ today: "Hoje", month: "Mês", week: "Semana", day: "Dia" }}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth",
              }}
              height="auto"
              eventDisplay="block"
              dayMaxEvents={3}
            />
          </div>
        )}

        {/* Modal de detalhes da tarefa */}
        {selectedTask && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes da tarefa: ${selectedTask.title}`}
          >
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 text-sm">Detalhes da Tarefa</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  aria-label="Fechar detalhes"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">{selectedTask.title}</h3>
                  {selectedTask.description && (
                    <p className="text-sm text-gray-500 mt-1">{selectedTask.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Prioridade</p>
                      <p className="text-sm font-medium text-gray-700">
                        {PRIORITY_LABELS[selectedTask.priority]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedTask.status === "done" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : selectedTask.status === "doing" ? (
                      <Clock className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-blue-400" />
                    )}
                    <div>
                      <p className="text-xs text-gray-400">Status</p>
                      <p className="text-sm font-medium text-gray-700">
                        {STATUS_LABELS[selectedTask.status]}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedTask.dueDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Vencimento</p>
                      <p className={`text-sm font-medium ${
                        selectedTask.dueDate < now && selectedTask.status !== "done"
                          ? "text-red-600"
                          : "text-gray-700"
                      }`}>
                        {selectedTask.dueDate.toLocaleDateString("pt-BR", {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                        {selectedTask.dueDate < now && selectedTask.status !== "done" && (
                          <span className="ml-2 text-xs text-red-500">(Vencida)</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {selectedTask.subtasks.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400 mb-2">
                      Subtarefas ({selectedTask.subtasks.filter((s) => s.completed).length}/
                      {selectedTask.subtasks.length})
                    </p>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                        style={{
                          width: `${
                            (selectedTask.subtasks.filter((s) => s.completed).length /
                              selectedTask.subtasks.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      {selectedTask.subtasks.slice(0, 4).map((s) => (
                        <div key={s.id} className="flex items-center gap-2 text-sm">
                          <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                            s.completed ? "bg-blue-600 border-blue-600" : "border-gray-300"
                          }`}>
                            {s.completed && (
                              <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-white">
                                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" />
                              </svg>
                            )}
                          </div>
                          <span className={s.completed ? "line-through text-gray-400" : "text-gray-700"}>
                            {s.title}
                          </span>
                        </div>
                      ))}
                      {selectedTask.subtasks.length > 4 && (
                        <p className="text-xs text-gray-400">
                          +{selectedTask.subtasks.length - 4} mais...
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium py-2 rounded-lg text-sm transition-colors"
                  >
                    Fechar
                  </button>
                  <a
                    href={`/tasks/${selectedTask.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors text-center"
                  >
                    Ver detalhes
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
