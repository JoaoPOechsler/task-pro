"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/hooks/useTasks";
import { updateTask } from "@/lib/tasks";
import { Task, TaskStatus } from "@/types/task";
import Sidebar from "@/components/Sidebar";
import TaskModal from "@/components/TaskModal";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Loader2, Plus, GripVertical, Calendar, Flag } from "lucide-react";
import { toast } from "sonner";

const COLUMNS: { id: TaskStatus; label: string; color: string; bg: string }[] = [
  { id: "todo", label: "A Fazer", color: "text-blue-600", bg: "bg-blue-50" },
  { id: "doing", label: "Fazendo", color: "text-yellow-600", bg: "bg-yellow-50" },
  { id: "done", label: "Concluído", color: "text-green-600", bg: "bg-green-50" },
];

const PRIORITY_COLORS: Record<string, string> = {
  alta: "bg-red-100 text-red-700",
  media: "bg-yellow-100 text-yellow-700",
  baixa: "bg-green-100 text-green-700",
};

const PRIORITY_LABELS: Record<string, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};

function TaskCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });
  const style = { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.4 : 1 };
  const now = new Date();
  const isOverdue = task.dueDate && task.dueDate < now && task.status !== "done";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm cursor-grab active:cursor-grabbing select-none touch-none"
      {...listeners}
      {...attributes}
      aria-label={`Tarefa: ${task.title}`}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${task.status === "done" ? "line-through text-gray-400" : "text-gray-800"}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-gray-400 truncate mt-0.5">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${PRIORITY_COLORS[task.priority]}`}>
              <Flag className="w-2.5 h-2.5 inline mr-0.5" />
              {PRIORITY_LABELS[task.priority]}
            </span>
            {task.dueDate && (
              <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-red-500" : "text-gray-400"}`}>
                <Calendar className="w-3 h-3" />
                {task.dueDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
              </span>
            )}
          </div>
          {task.subtasks.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-400">
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtarefas
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all"
                  style={{
                    width: `${(task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DroppableColumn({
  id,
  label,
  color,
  bg,
  tasks,
  activeId,
  onAddClick,
}: {
  id: TaskStatus;
  label: string;
  color: string;
  bg: string;
  tasks: Task[];
  activeId: string | null;
  onAddClick: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl border transition-colors ${
        isOver ? "border-blue-300 bg-blue-50/50" : "border-gray-200 bg-gray-50"
      } min-h-[400px]`}
      aria-label={`Coluna: ${label}`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${color}`}>{label}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${bg} ${color}`}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={onAddClick}
          aria-label={`Adicionar tarefa em ${label}`}
          className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 p-3 space-y-2 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} isDragging={activeId === task.id} />
        ))}
        {tasks.length === 0 && (
          <div className="h-24 flex items-center justify-center text-xs text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
            Solte aqui
          </div>
        )}
      </div>
    </div>
  );
}

export default function KanbanPage() {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading, createTask } = useTasks();
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

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

  const activeTask = tasks.find((t) => t.id === activeId) ?? null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === newStatus) return;

    try {
      await updateTask(taskId, { status: newStatus });
      toast.success("Status atualizado!");
    } catch {
      toast.error("Erro ao mover tarefa.");
    }
  }

  function handleAddClick(status: TaskStatus) {
    setDefaultStatus(status);
    setShowModal(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Quadro Kanban</h1>
          <p className="text-gray-400 text-sm mt-0.5">Arraste as tarefas entre as colunas</p>
        </div>

        {tasksLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {COLUMNS.map((col) => (
                <DroppableColumn
                  key={col.id}
                  id={col.id}
                  label={col.label}
                  color={col.color}
                  bg={col.bg}
                  tasks={tasks.filter((t) => t.status === col.id)}
                  activeId={activeId}
                  onAddClick={() => handleAddClick(col.id)}
                />
              ))}
            </div>

            <DragOverlay>
              {activeTask && (
                <div className="bg-white border border-blue-300 rounded-lg p-3 shadow-xl rotate-2 opacity-95">
                  <p className="text-sm font-medium text-gray-800">{activeTask.title}</p>
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      {showModal && (
        <TaskModal
          task={undefined}
          onClose={() => setShowModal(false)}
          onSave={async (data) => {
            await createTask({ ...data, status: defaultStatus });
            toast.success("Tarefa criada!");
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
