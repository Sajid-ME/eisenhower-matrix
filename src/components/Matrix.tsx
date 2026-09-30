// Matrix — the 2x2 Eisenhower grid.
//
// Desktop (sm and up):  full 2x2 grid, always visible.
// Mobile (below sm):    tab bar at the top, one quadrant visible at a time.
//                       While dragging, all four quadrants appear at once
//                       so you can drop into any of them.
import { useState } from 'react';
import Quadrant from './Quadrant';
import type { Task, QuadrantCode } from '../App';

type MatrixProps = {
  tasks: Task[];
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onEdit: (id: string) => void;
  isDragging: boolean;
};

const QUADRANTS: {
  code: QuadrantCode;
  title: string;
  subtitle: string;
  accent: string;
  body: string;
}[] = [
  {
    code: 'Q1',
    title: 'Do First',
    subtitle: 'Important · Urgent',
    accent: 'bg-rose-500 text-white',
    body: 'bg-rose-50/60 dark:bg-rose-950/20',
  },
  {
    code: 'Q2',
    title: 'Schedule',
    subtitle: 'Important · Not Urgent',
    accent: 'bg-indigo-500 text-white',
    body: 'bg-indigo-50/60 dark:bg-indigo-950/20',
  },
  {
    code: 'Q3',
    title: 'Delegate',
    subtitle: 'Not Important · Urgent',
    accent: 'bg-amber-500 text-white',
    body: 'bg-amber-50/60 dark:bg-amber-950/20',
  },
  {
    code: 'Q4',
    title: 'Avoid',
    subtitle: 'Not Important · Not Urgent',
    accent: 'bg-slate-500 text-white',
    body: 'bg-slate-50/60 dark:bg-slate-950/20',
  },
];

export default function Matrix({
  tasks,
  onDelete,
  onToggleComplete,
  onEdit,
  isDragging,
}: MatrixProps) {
  // Which quadrant tab is active on mobile. Defaults to Q1.
  const [activeTab, setActiveTab] = useState<QuadrantCode>('Q1');

  // Count tasks per quadrant for the tab badges.
  const counts: Record<QuadrantCode, number> = {
    Q1: 0,
    Q2: 0,
    Q3: 0,
    Q4: 0,
  };
  for (const t of tasks) {
    if (t.quadrant) counts[t.quadrant] += 1;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Priority Matrix</h2>
        <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
          Drag tasks from the Inbox
        </p>
      </div>

      {/* Mobile tab bar — hidden on desktop and during drag */}
      {!isDragging && (
        <div className="mb-3 grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1 sm:hidden dark:bg-slate-800">
          {QUADRANTS.map((q) => {
            const isActive = activeTab === q.code;
            return (
              <button
                key={q.code}
                onClick={() => setActiveTab(q.code)}
                className={[
                  'flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-xs font-medium transition',
                  isActive
                    ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
                    : 'text-slate-600 dark:text-slate-400',
                ].join(' ')}
              >
                <span>{q.code}</span>
                <span
                  className={[
                    'rounded-full px-1.5 text-[10px] leading-none',
                    isActive
                      ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
                  ].join(' ')}
                >
                  {counts[q.code]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* The grid.
          - Normal: 1 column on mobile, 2x2 on desktop.
          - During drag: 2x2 everywhere, so all drop targets are visible. */}
      <div
        className={[
          'grid gap-3',
          isDragging ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2',
        ].join(' ')}
      >
        {QUADRANTS.map((q) => {
          // Visible if we're dragging, or if this is the active mobile tab.
          // On desktop, the `sm:block` class overrides `hidden`, so all show.
          const isVisible = isDragging || activeTab === q.code;

          return (
            <div key={q.code} className={isVisible ? '' : 'hidden sm:block'}>
              <Quadrant
                code={q.code}
                title={q.title}
                subtitle={q.subtitle}
                accent={q.accent}
                body={q.body}
                tasks={tasks.filter((t) => t.quadrant === q.code)}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                compact={isDragging}
              />
            </div>
          );
        })}
      </div>

      {/* Mobile hint */}
      <p className="mt-3 text-center text-xs text-slate-500 sm:hidden dark:text-slate-400">
        {isDragging
          ? 'Drop into a quadrant'
          : 'Tap a tab to switch quadrants'}
      </p>
    </section>
  );
}