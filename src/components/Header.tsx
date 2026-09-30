// Header — top bar with the app name, logo, and dark mode toggle.
type HeaderProps = {
  dark: boolean;
  onToggleDark: () => void;
};

export default function Header({ dark, onToggleDark }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          {/* Little 4-color logo made from 4 divs in a 2x2 grid */}
          <div className="grid h-8 w-8 grid-cols-2 grid-rows-2 gap-0.5 overflow-hidden rounded-md">
            <div className="bg-rose-500" />
            <div className="bg-indigo-500" />
            <div className="bg-amber-500" />
            <div className="bg-slate-500" />
          </div>
          <h1 className="text-lg font-semibold">Eisenhower Matrix</h1>
        </div>

        <button
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </header>
  );
}