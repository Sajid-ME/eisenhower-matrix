// TaskCard — a single draggable task chip.
// Layout: [complete circle] [title] [delete ✕]
// Clicking the title area opens the editor. Clicking the circle toggles complete.
import { useDraggable } from '@dnd-kit/core';
import type { Task } from '../App';

type TaskCardProps = {
  task: Task;
  onDelete?: (id: string) => void;
  onToggleComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  overlay?: boolean;
};

export default function TaskCard({
  task,
  onDelete,
  onToggleComplete,
  onEdit,
  overlay = false,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    disabled: overlay,
  });

  // When rendering the floating overlay preview, nothing is interactive.
  const interactive = !overlay;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={interactive && onEdit ? () => onEdit(task.id) : undefined}
      className={[
        'group flex cursor-grab items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm select-none active:cursor-grabbing',
        'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
        isDragging && !overlay ? 'opacity-30' : '',
        overlay ? 'shadow-xl ring-2 ring-indigo-500' : '',
      ].join(' ')}
    >
      {/* Complete toggle — a small circle on the left */}
      {interactive && onToggleComplete ? (
        <button
          onClick={(e) => {
            e.stopPropagation(); // don't open the editor
            onToggleComplete(task.id);
          }}
          onPointerDown={(e) => e.stopPropagation()} // don't start a drag
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          className={[
            'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition',
            task.completed
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-slate-300 bg-transparent text-transparent hover:border-emerald-500 dark:border-slate-600',
          ].join(' ')}
        >
          <span className="text-[10px] leading-none">✓</span>
        </button>
      ) : (
        // In the overlay preview, show a static dot so the width matches.
        <span className="h-4 w-4 shrink-0" />
      )}

      {/* Title */}
      <span
        className={[
          'flex-1 truncate',
          task.completed
            ? 'text-slate-400 line-through'
            : 'text-slate-800 dark:text-slate-100',
        ].join(' ')}
      >
        {task.title}
      </span>

      {/* Delete — only on real cards, not the overlay */}
      {interactive && onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Delete task"
          className="rounded px-1 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:text-rose-500 focus:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}