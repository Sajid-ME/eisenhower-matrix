// App — the root component.
// Holds global state (dark mode + tasks), wires up drag-and-drop, and
// controls which task's editor is open.
import { useEffect, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import Header from './components/Header';
import TaskPanel from './components/TaskPanel';
import Matrix from './components/Matrix';
import TaskCard from './components/TaskCard';
import TaskEditor from './components/TaskEditor';

// ---- Types ----

export type QuadrantCode = 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type DropTarget = QuadrantCode | 'inbox';

export type Task = {
  id: string;
  title: string;
  notes: string;
  delegateTo: string;
  quadrant: QuadrantCode | null;
  completed: boolean;
  createdAt: number;
};

// ---- Persistence ----

const TASKS_STORAGE_KEY = 'eisenhower.tasks';
const VALID_TARGETS: DropTarget[] = ['inbox', 'Q1', 'Q2', 'Q3', 'Q4'];

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((t: Partial<Task>) => ({
      id: String(t.id ?? crypto.randomUUID()),
      title: String(t.title ?? ''),
      notes: String(t.notes ?? ''),
      delegateTo: String(t.delegateTo ?? ''),
      quadrant: t.quadrant ?? null,
      completed: Boolean(t.completed ?? false),
      createdAt: Number(t.createdAt ?? Date.now()),
    }));
  } catch {
    return [];
  }
}

// ---- Component ----

export default function App() {
  // ---- Dark mode ----
  const [dark, setDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  // ---- Tasks ----
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());

  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // ---- Which task's editor is open ----
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingTask = editingId ? tasks.find((t) => t.id === editingId) ?? null : null;

  // ---- Drag state ----
  const [activeId, setActiveId] = useState<string | null>(null);
  const isDragging = activeId !== null;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } })
  );

  // ---- Task actions ----

  function addTask(title: string) {
    const trimmed = title.trim();
    if (!trimmed) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: trimmed,
      notes: '',
      delegateTo: '',
      quadrant: null,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
  }

  function updateTask(id: string, patch: Partial<Task>) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function toggleComplete(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function moveTask(id: string, target: DropTarget) {
    updateTask(id, { quadrant: target === 'inbox' ? null : target });
  }

  // ---- Drag handlers ----

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = String(active.id);
    const target = String(over.id) as DropTarget;
    if (!VALID_TARGETS.includes(target)) return;

    moveTask(taskId, target);
  }

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) ?? null : null;

  // ---- Render ----

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header dark={dark} onToggleDark={() => setDark((d) => !d)} />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <main className="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-[320px_1fr] lg:p-6">
          <TaskPanel
            tasks={tasks}
            onAdd={addTask}
            onDelete={deleteTask}
            onToggleComplete={toggleComplete}
            onEdit={setEditingId}
          />
          <Matrix
            tasks={tasks}
            onDelete={deleteTask}
            onToggleComplete={toggleComplete}
            onEdit={setEditingId}
            isDragging={isDragging}
          />
        </main>

        <DragOverlay dropAnimation={null}>
          {activeTask ? <TaskCard task={activeTask} overlay /> : null}
        </DragOverlay>
      </DndContext>

      {editingTask && (
        <TaskEditor
          task={editingTask}
          onChange={(patch) => updateTask(editingTask.id, patch)}
          onClose={() => setEditingId(null)}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}