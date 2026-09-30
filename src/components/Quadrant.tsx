// Quadrant — one cell of the 2x2 matrix.
// It's reusable: we pass in colors and text, and it renders the same shape.
type QuadrantProps = {
  code: string;      // "Q1", "Q2", ...
  title: string;     // "Do First"
  subtitle: string;  // "Important · Urgent"
  accent: string;    // Tailwind classes for the header bar
  body: string;      // Tailwind classes for the body background
};

export default function Quadrant({ code, title, subtitle, accent, body }: QuadrantProps) {
  return (
    <section
      className={`flex min-h-[180px] flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 ${body}`}
    >
      {/* Header bar with color */}
      <div className={`flex items-center justify-between px-3 py-2 ${accent}`}>
        <div>
          <h3 className="text-sm font-semibold">
            {code} · {title}
          </h3>
          <p className="text-xs opacity-80">{subtitle}</p>
        </div>
        {/* Task count badge — will become dynamic later */}
        <span className="rounded-full bg-white/30 px-2 py-0.5 text-xs font-medium">
          0
        </span>
      </div>

      {/* Body — empty for now */}
      <div className="flex flex-1 items-center justify-center p-3 text-xs text-slate-500 dark:text-slate-400">
        Drop tasks here
      </div>
    </section>
  );
}