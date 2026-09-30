// TaskCard — a single draggable task chip.
// Used in three places:
//   1. The Inbox list (left panel)
//   2. Inside a quadrant
//   3. As the floating "drag overlay" that follows the cursor
import { useDraggable } from '@dnd-kit/core';
import type { Task } from '../App';

type TaskCardProps = {
  task: Task;
  onDelete?: (id: string) => void;
  overlay?: boolean;
};

export default function TaskCard({ task, onDelete, overlay = false }: TaskCardProps) {
  // useDraggable makes this element draggable.
  // When `overlay` is true, we render a non-interactive copy for the floating preview.
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    disabled: overlay,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={[
        'group flex cursor-grab items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-sm select-none active:cursor-grabbing',
        'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800',
        // Fade the original while it's being dragged
        isDragging && !overlay ? 'opacity-30' : '',
        // The floating overlay gets a shadow and ring
        overlay ? 'shadow-xl ring-2 ring-indigo-500' : '',
      ].join(' ')}
    >
      <span
        className={
          task.completed
            ? 'text-slate-400 line-through'
            : 'text-slate-800 dark:text-slate-100'
        }
      >
        {task.title}
      </span>

      {onDelete && (
        <button
          onClick={() => onDelete(task.id)}
          // Stop the drag sensor from hijacking the click
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