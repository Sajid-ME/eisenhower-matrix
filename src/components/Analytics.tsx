// Analytics — a dashboard showing how tasks are distributed and completed.
// Uses Recharts for the bar charts.
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { Task, QuadrantCode } from '../App';

type AnalyticsProps = {
  tasks: Task[];
  dark: boolean;
};

// Fixed colors matching the quadrant accent colors used in the Matrix.
const QUADRANT_COLORS: Record<QuadrantCode, string> = {
  Q1: '#f43f5e', // rose-500
  Q2: '#6366f1', // indigo-500
  Q3: '#f59e0b', // amber-500
  Q4: '#64748b', // slate-500
};

export default function Analytics({ tasks, dark }: AnalyticsProps) {
  // ---- Computed stats ----

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const open = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Count of tasks in each quadrant (regardless of completion).
  const perQuadrant: Record<QuadrantCode, { total: number; completed: number; open: number }> = {
    Q1: { total: 0, completed: 0, open: 0 },
    Q2: { total: 0, completed: 0, open: 0 },
    Q3: { total: 0, completed: 0, open: 0 },
    Q4: { total: 0, completed: 0, open: 0 },
  };

  // Tasks still in the Inbox (quadrant === null) are counted separately.
  let inboxCount = 0;

  for (const t of tasks) {
    if (t.quadrant === null) {
      inboxCount += 1;
      continue;
    }
    perQuadrant[t.quadrant].total += 1;
    if (t.completed) perQuadrant[t.quadrant].completed += 1;
    else perQuadrant[t.quadrant].open += 1;
  }

  // Chart 1 data: total tasks per quadrant.
  const barData = (['Q1', 'Q2', 'Q3', 'Q4'] as QuadrantCode[]).map((code) => ({
    name: code,
    total: perQuadrant[code].total,
  }));

  // Chart 2 data: completed vs open per quadrant.
  const stackData = (['Q1', 'Q2', 'Q3', 'Q4'] as QuadrantCode[]).map((code) => ({
    name: code,
    Completed: perQuadrant[code].completed,
    Open: perQuadrant[code].open,
  }));

  // "Important" tasks = Q1 + Q2. Shows how focused your list is.
  const importantCount = perQuadrant.Q1.total + perQuadrant.Q2.total;
  const importantRate = total === 0 ? 0 : Math.round((importantCount / total) * 100);

  // ---- Chart styling (varies with dark mode) ----

  const axisTick = { fill: dark ? '#94a3b8' : '#64748b', fontSize: 12 };
  const gridStroke = dark ? '#1e293b' : '#e2e8f0';
  const tooltipStyle = {
    backgroundColor: dark ? '#0f172a' : '#ffffff',
    border: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
    borderRadius: 8,
    fontSize: 12,
    color: dark ? '#e2e8f0' : '#0f172a',
  };

  // ---- Empty state ----

  if (total === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold">Analytics</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Add and sort some tasks to see your stats here.
        </p>
      </section>
    );
  }

  // ---- Render ----

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">Analytics</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          How your tasks are distributed
        </p>
      </div>

      {/* ---- Stat cards ---- */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total tasks" value={String(total)} />
        <StatCard label="Completed" value={String(completed)} accent="text-emerald-600 dark:text-emerald-400" />
        <StatCard label="Remaining" value={String(open)} accent="text-rose-600 dark:text-rose-400" />
        <StatCard label="Important" value={`${importantRate}%`} sub="Q1 + Q2" accent="text-indigo-600 dark:text-indigo-400" />
      </div>

      {/* ---- Progress bar ---- */}
      <div className="mb-6">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="font-medium text-slate-600 dark:text-slate-300">Completion</span>
          <span className="text-slate-500 dark:text-slate-400">{completionRate}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        {inboxCount > 0 && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {inboxCount} task{inboxCount === 1 ? '' : 's'} still in the Inbox — drag them into a quadrant to see them on the charts.
          </p>
        )}
      </div>

      {/* ---- Chart 1: tasks per quadrant ---- */}
      <div className="mb-6">
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Tasks per quadrant
        </h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: dark ? '#1e293b33' : '#f1f5f955' }} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {barData.map((entry) => (
                  <Cell key={entry.name} fill={QUADRANT_COLORS[entry.name as QuadrantCode]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ---- Chart 2: completed vs open per quadrant ---- */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          Completed vs open
        </h3>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stackData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={axisTick} axisLine={false} tickLine={false} />
              <YAxis tick={axisTick} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: dark ? '#1e293b33' : '#f1f5f955' }} />
              <Legend
                wrapperStyle={{ fontSize: 12, color: dark ? '#e2e8f0' : '#0f172a' }}
                iconType="circle"
              />
              <Bar dataKey="Completed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Open" stackId="a" fill={dark ? '#475569' : '#cbd5e1'} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

// ---- Small stat card component ----

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${accent ?? 'text-slate-900 dark:text-slate-100'}`}>
        {value}
      </p>
      {sub && <p className="text-[10px] text-slate-400 dark:text-slate-500">{sub}</p>}
    </div>
  );
}