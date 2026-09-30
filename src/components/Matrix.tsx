// Matrix — the 2x2 Eisenhower grid.
import Quadrant from './Quadrant';
import type { Task, QuadrantCode } from '../App';

type MatrixProps = {
  tasks: Task[];
  onDelete: (id: string) => void;
};

// All four quadrants defined in one place so the JSX stays short.
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

export default function Matrix({ tasks, onDelete }: MatrixProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Priority Matrix</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Drag tasks from the Inbox
        </p>
      </div>

      {/* 1 column on mobile, 2x2 on small screens and up */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {QUADRANTS.map((q) => (
          <Quadrant
            key={q.code}
            code={q.code}
            title={q.title}
            subtitle={q.subtitle}
            accent={q.accent}
            body={q.body}
            tasks={tasks.filter((t) => t.quadrant === q.code)}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}