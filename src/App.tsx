// App — the root component.
// Holds global state (dark mode + tasks) and wires up drag-and-drop.
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

// ---- Types ----

export type QuadrantCode = 'Q1' | 'Q2' | 'Q3' | 'Q4';

// Anything a task can be dropped into.
export type DropTarget = QuadrantCode | 'inbox';

export type Task = {
  id: string;
  title: string;
  quadrant: QuadrantCode | null; // null = still in the Inbox
  completed: boolean;
  createdAt: number;
};

// ---- Persistence ----

const TASKS_STORAGE_KEY = 'eisenhower.tasks';

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Task[];
  } catch {
    return [];
  }
}

// Every valid drop target, used to validate what dnd-kit hands us.
const VALID_TARGETS: DropTarget[] = ['inbox', 'Q1', 'Q2', 'Q3', 'Q4'];

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

  // ---- Drag state ----
  // The id of the task currently being dragged (null when idle).
  // Used only to render the floating DragOverlay.
  const [activeId, setActiveId] = useState<string | null>(null);

  // MouseSensor handles mouse. TouchSensor handles fingers.
  // The activation constraints mean a plain click or tap is NOT a drag —
  // so the ✕ delete button still works normally.
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
      quadrant: null,
      completed: false,
      createdAt: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  // Move a task into a quadrant (or back to the Inbox).
  function moveTask(id: string, target: DropTarget) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, quadrant: target === 'inbox' ? null : target }
          : t
      )
    );
  }

  // ---- Drag handlers ----

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const { active, over } = event;
    if (!over) return; // dropped outside any zone — do nothing

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
          <TaskPanel tasks={tasks} onAdd={addTask} onDelete={deleteTask} />
          <Matrix tasks={tasks} onDelete={deleteTask} />
        </main>

        {/* The floating card that follows your cursor while dragging */}
        <DragOverlay dropAnimation={null}>
          {activeTask ? <TaskCard task={activeTask} overlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}