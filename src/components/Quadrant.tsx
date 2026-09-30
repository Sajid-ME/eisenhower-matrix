// Quadrant — one cell of the 2x2 matrix.
// It is a droppable zone and renders whatever tasks live inside it.
import { useDroppable } from '@dnd-kit/core';
import type { Task, QuadrantCode } from '../App';
import TaskCard from './TaskCard';

type QuadrantProps = {
  code: QuadrantCode;
  title: string;
  subtitle: string;
  accent: string;
  body: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  // When true, reduce the min height so more quadrants fit on screen.
  // Used during drag on mobile.
  compact?: boolean;
};

export default function Quadrant({
  code,
  title,
  subtitle,
  accent,
  body,
  tasks,
  onDelete,
  onToggleComplete,
  onEdit,
  compact = false,
}: QuadrantProps) {
  const { setNodeRef, isOver } = useDroppable({ id: code });

  return (
    <section
      ref={setNodeRef}
      className={[
        'flex flex-col overflow-hidden rounded-xl border transition',
        compact ? 'min-h-[110px]' : 'min-h-[200px]',
        'border-slate-200 dark:border-slate-800',
        body,
        isOver ? 'ring-2 ring-indigo-500 ring-offset-0' : '',
      ].join(' ')}
    >
      <div className={`flex items-center justify-between px-3 py-2 ${accent}`}>
        <div>
          <h3 className="text-sm font-semibold">
            {code} · {title}
          </h3>
          <p className="text-xs opacity-80">{subtitle}</p>
        </div>
        <span className="rounded-full bg-white/30 px-2 py-0.5 text-xs font-medium">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 space-y-2 p-2.5">
        {tasks.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-500 dark:text-slate-400">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
            />
          ))
        )}
      </div>
    </section>
  );
}