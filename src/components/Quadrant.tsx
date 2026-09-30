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
};

export default function Quadrant({
  code,
  title,
  subtitle,
  accent,
  body,
  tasks,
  onDelete,
}: QuadrantProps) {
  // Make this quadrant a droppable zone using its code as the id.
  const { setNodeRef, isOver } = useDroppable({ id: code });

  return (
    <section
      ref={setNodeRef}
      className={[
        'flex min-h-[200px] flex-col overflow-hidden rounded-xl border transition',
        'border-slate-200 dark:border-slate-800',
        body,
        // Highlight when a task is hovering over this quadrant
        isOver ? 'ring-2 ring-indigo-500 ring-offset-0' : '',
      ].join(' ')}
    >
      {/* Colored header bar */}
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

      {/* Task list */}
      <div className="flex-1 space-y-2 p-2.5">
        {tasks.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-500 dark:text-slate-400">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} />
          ))
        )}
      </div>
    </section>
  );
}