// TaskPanel — the left column.
// For now it's a static shell. In Step 3 we'll wire up the input
// and render the real task list.
export default function TaskPanel() {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-base font-semibold">Tasks</h2>

      {/* Input + Add button (not functional yet) */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a task…"
          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950"
        />
        <button className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-500">
          Add
        </button>
      </div>

      {/* Empty state message */}
      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        No tasks yet. Add your first one above.
      </p>
    </aside>
  );
}