// TaskPanel — the left column: quick capture + the Inbox list.
// The Inbox is also a drop target, so you can drag tasks back out of the matrix.
import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Task } from '../App';
import TaskCard from './TaskCard';

type TaskPanelProps = {
  tasks: Task[];
  onAdd: (title: string) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
};

export default function TaskPanel({
  tasks,
  onAdd,
  onDelete,
  onToggleComplete,
  onEdit,
}: TaskPanelProps) {
  const [draft, setDraft] = useState('');

  const inboxTasks = tasks.filter((t) => t.quadrant === null);
  const { setNodeRef, isOver } = useDroppable({ id: 'inbox' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onAdd(draft);
    setDraft('');
  }

  return (
    <aside className="flex max-h-[80vh] flex-col rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">Inbox</h2>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {inboxTasks.length}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
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