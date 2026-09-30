// Header — top bar with the app name, view toggle, and dark mode toggle.
import type { View } from '../App';

type HeaderProps = {
  dark: boolean;
  onToggleDark: () => void;
  view: View;
  onViewChange: (view: View) => void;
};

export default function Header({ dark, onToggleDark, view, onViewChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 lg:px-6">
        {/* Left: logo + title */}
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-md">
            <div className="bg-rose-500" />
            <div className="bg-indigo-500" />
            <div className="bg-amber-500" />
            <div className="bg-slate-500" />
          </div>
          <h1 className="hidden text-lg font-semibold sm:block">Eisenhower Matrix</h1>
        </div>

        {/* Center: view toggle */}
        <div className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
          <button
            onClick={() => onViewChange('matrix')}
            className={[
              'rounded-md px-3 py-1 text-xs font-medium transition',
              view === 'matrix'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
            ].join(' ')}
          >
            Matrix
          </button>
          <button
            onClick={() => onViewChange('analytics')}
            className={[
              'rounded-md px-3 py-1 text-xs font-medium transition',
              view === 'analytics'
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-slate-100'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100',
            ].join(' ')}
          >
            Analytics
          </button>
        </div>

        {/* Right: dark mode toggle */}
        <button
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          {dark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}