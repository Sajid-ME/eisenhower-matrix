// App — the root component.
// It holds global state (dark mode) and lays out the page.
import { useEffect, useState } from 'react';
import Header from './components/Header';
import TaskPanel from './components/TaskPanel';
import Matrix from './components/Matrix';

export default function App() {
  // Dark mode state. On first load, we read the saved preference
  // from localStorage. If nothing is saved, default to light mode.
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  // Whenever `dark` changes, apply it to the <html> element
  // and remember the choice for next time.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header dark={dark} onToggleDark={() => setDark((d) => !d)} />

      {/* Main layout:
          - On mobile: stacked (panel on top, matrix below)
          - On large screens: two columns — panel 320px, matrix fills the rest */}
      <main className="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-[320px_1fr] lg:p-6">
        <TaskPanel />
        <Matrix />
      </main>
    </div>
  );
}