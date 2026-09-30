// Matrix — the 2x2 Eisenhower grid.
import Quadrant from './Quadrant';

export default function Matrix() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Priority Matrix</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Drag tasks from the left panel
        </p>
      </div>

      {/* 1 column on mobile, 2x2 on small screens and up */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Quadrant
          code="Q1"
          title="Do First"
          subtitle="Important · Urgent"
          accent="bg-rose-500 text-white"
          body="bg-rose-50/50 dark:bg-rose-950/20"
        />
        <Quadrant
          code="Q2"
          title="Schedule"
          subtitle="Important · Not Urgent"
          accent="bg-indigo-500 text-white"
          body="bg-indigo-50/50 dark:bg-indigo-950/20"
        />
        <Quadrant
          code="Q3"
          title="Delegate"
          subtitle="Not Important · Urgent"
          accent="bg-amber-500 text-white"
          body="bg-amber-50/50 dark:bg-amber-950/20"
        />
        <Quadrant
          code="Q4"
          title="Avoid"
          subtitle="Not Important · Not Urgent"
          accent="bg-slate-500 text-white"
          body="bg-slate-50/50 dark:bg-slate-950/20"
        />
      </div>
    </section>
  );
}