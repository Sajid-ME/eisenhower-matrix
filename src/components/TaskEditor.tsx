// TaskEditor — a modal for editing a single task.
// Opens when you click a task card. Closes on Escape or by clicking the backdrop.
import { useEffect } from 'react';
import type { Task, QuadrantCode } from '../App';

// Human-readable names for each quadrant (used in the badge).
const QUADRANT_LABELS: Record<QuadrantCode, string> = {
  Q1: 'Do First',
  Q2: 'Schedule',
  Q3: 'Delegate',
  Q4: 'Avoid',
};

// Colors for the quadrant badge.
const QUADRANT_COLORS: Record<QuadrantCode, string> = {
  Q1: 'bg-rose-500 text-white',
  Q2: 'bg-indigo-500 text-white',
  Q3: 'bg-amber-500 text-white',
  Q4: 'bg-slate-500 text-white',
};

type TaskEditorProps = {
  task: Task;
  onChange: (patch: Partial<Task>) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
};

export default function TaskEditor({ task, onChange, onClose, onDelete }: TaskEditorProps) {
  // Close on Escape key.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    // Backdrop — clicking anywhere outside the card closes the editor.
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      {/* The modal card. stopPropagation prevents clicks inside from closing it. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {task.quadrant ? (
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${QUADRANT_COLORS[task.quadrant]}`}
              >
                {task.quadrant} · {QUADRANT_LABELS[task.quadrant]}
              </span>
            ) : (
              <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                Inbox
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 p-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Title
            </label>
            <input
              type="text"
              value={task.title}
              onChange={(e) => onChange({ title: e.target.value })}
              autoFocus
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Notes
            </label>
            <textarea
              value={task.notes}
              onChange={(e) => onChange({ notes: e.target.value })}
              placeholder="Optional details…"
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          {/* Delegate-to — only shown for Q3 tasks */}
          {task.quadrant === 'Q3' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Delegate to
              </label>
              <input
                type="text"
                value={task.delegateTo}
                onChange={(e) => onChange({ delegateTo: e.target.value })}
                placeholder="Who should handle this?"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
          <button
            onClick={() => onDelete(task.id)}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            Delete
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onChange({ completed: !task.completed })}
              className={[
                'rounded-lg px-3 py-1.5 text-sm font-medium transition',
                task.completed
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500',
              ].join(' ')}
            >
              {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>

            <button
              onClick={onClose}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}