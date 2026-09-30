// TaskPanel — the left column: quick capture + the Inbox list.
// Includes rule-based quadrant suggestions (see src/lib/suggest.ts).
import { useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Task, QuadrantCode } from '../App';
import TaskCard from './TaskCard';
import { suggestQuadrant, QUADRANT_LABELS } from '../lib/suggest';

type TaskPanelProps = {
  tasks: Task[];
  onAdd: (title: string, quadrant?: QuadrantCode | null) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  onAutoSort: () => number;
};

// Colors for the suggestion chip, one per quadrant (mirrors the matrix accents).
const CHIP_COLORS: Record<QuadrantCode, string> = {
  Q1: 'border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-900/40',
  Q2: 'border-indigo-300 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-200 dark:hover:bg-indigo-900/40',
  Q3: 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-900/40',
  Q4: 'border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800',
};

export default function TaskPanel({
  tasks,
  onAdd,
  onDelete,
  onToggleComplete,
  onEdit,
  onAutoSort,
}: TaskPanelProps) {
  const [draft, setDraft] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Live suggestion computed from the current draft.
  const suggestion = suggestQuadrant(draft);

  const inboxTasks = tasks.filter((t) => t.quadrant === null);
  const { setNodeRef, isOver } = useDroppable({ id: 'inbox' });

  // Auto-clear the feedback message after a couple of seconds.
  useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 2500);
    return () => clearTimeout(t);
  }, [feedback]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd(draft); // add to Inbox (no quadrant)
    setDraft('');
  }

  // Click "Add to Qn" or press Ctrl/Cmd+Enter.
  function handleAddToSuggestion() {
    if (!suggestion || !draft.trim()) return;
    onAdd(draft, suggestion.quadrant);
    setDraft('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Ctrl+Enter or Cmd+Enter → add straight to the suggested quadrant.
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && suggestion) {
      e.preventDefault();
      handleAddToSuggestion();
    }
  }

  function handleAutoSort() {
    const moved = onAutoSort();
    if (moved > 0) {
      setFeedback(`Sorted ${moved} task${moved === 1 ? '' : 's'} ✨`);
    } else {
      setFeedback('No confident suggestions in the Inbox.');
    }
  }

  // Trim the matched-words list so it never overflows the chip.
  function formatMatched(words: string[]): string {
    const shown = words.slice(0, 2);
    const extra = words.length - shown.length;
    return extra > 0 ? `${shown.join(', ')} +${extra}` : shown.join(', ');
  }

  return (
    <aside className="flex max-h-[80vh] flex-col rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      {/* Header: title + count + auto-sort button */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">Inbox</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {inboxTasks.length}
          </span>
        </div>

        {inboxTasks.length > 0 && (
          <button
            onClick={handleAutoSort}
            title="Sort every Inbox task that has a confident suggestion"
            className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            ✨ Auto-sort
          </button>
        )}
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task…"
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Add
        </button>
      </form>

      {/* Live suggestion chip — appears only while typing a matchable title */}
      {draft.trim() && suggestion && (
        <button
          type="button"
          onClick={handleAddToSuggestion}
          title="Ctrl/Cmd + Enter to add here"
          className={[
            'mt-2 flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition',
            CHIP_COLORS[suggestion.quadrant],
          ].join(' ')}
        >
          <span className="flex items-center gap-1.5 truncate">
            <span>✨</span>
            <span className="font-medium">
              Add to {suggestion.quadrant} · {QUADRANT_LABELS[suggestion.quadrant]}
            </span>
          </span>
          <span className="shrink-0 text-[10px] opacity-70">
            {formatMatched(suggestion.matched)}
          </span>
        </button>
      )}

      {/* Feedback line after auto-sort */}
      {feedback && (
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{feedback}</p>
      )}

      {/* Droppable Inbox list */}
      <div
        ref={setNodeRef}
        className={[
          'mt-4 flex-1 overflow-y-auto rounded-lg p-1 transition',
          isOver
            ? 'bg-indigo-50 ring-2 ring-indigo-400 dark:bg-indigo-950/40'
            : 'bg-transparent',
        ].join(' ')}
      >
        {inboxTasks.length === 0 ? (
          <p className="px-1 py-2 text-xs text-slate-500 dark:text-slate-400">
            {tasks.length === 0
              ? 'No tasks yet. Add your first one above.'
              : 'Inbox is empty. Nice work.'}
          </p>
        ) : (
          <ul className="space-y-2">
            {inboxTasks.map((task) => (
              <li key={task.id}>
                <TaskCard
                  task={task}
                  onDelete={onDelete}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEdit}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}