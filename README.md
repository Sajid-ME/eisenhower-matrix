# Eisenhower Matrix

**A to-do app that doesn't just store your tasks — it tells you which one to do first.**

Dump your tasks in one place. Drag them into a 2×2 grid: Do First, Schedule, Delegate, Avoid.
Ten seconds later, you know exactly what to work on.

🔗 **Live app:** [https://sajid-me.github.io/eisenhower-matrix/]

---

## Why

Most to-do apps are just lists. They store tasks but don't help you decide what matters. So you end up doing whatever feels urgent, and the important work keeps sliding to tomorrow.

This app uses the **Eisenhower Matrix** — a prioritization method used by everyone from US presidents to Fortune 500 execs — to turn a chaotic list into a clear decision.

|  | Urgent | Not Urgent |
|---|---|---|
| **Important** | 🔴 Q1 · Do First | 🔵 Q2 · Schedule |
| **Not Important** | 🟡 Q3 · Delegate | ⚫ Q4 · Avoid |

---

## Features

- ⚡ **Quick capture** — type a task, press Enter. No forms, no categories.
- 🖱️ **Drag-and-drop matrix** — move tasks between quadrants in one motion.
- ✨ **Auto-sort** — reads your task title and suggests a quadrant ("email boss" → Q1, "scroll Instagram" → Q4).
- 📊 **Analytics** — see where your tasks actually live and how much you've completed.
- 📝 **Task editor** — notes, complete toggle, and a "Delegate to" field for Q3.
- 🌗 **Light / dark mode** — instant switch, remembers your choice.
- 📱 **Responsive** — tabbed quadrant view on phones, full grid on desktop.
- 🔒 **100% local** — no account, no server, no tracking. Everything stays in your browser.
- 🌐 **Offline** — works with no internet connection.

---

## How it works

1. **Dump** — add every task to the Inbox. No thinking required.
2. **Sort** — drag each task into one of four quadrants, or hit **Auto-sort** and let the rules engine guess.
3. **Work** — open the app, look at Q1, start doing.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Drag & drop | dnd-kit |
| Charts | Recharts |
| Storage | Browser localStorage |
| Hosting | GitHub Pages |

No backend. No database. No API keys. The entire app ships as static files.

---

## Run Locally

Requires **Node.js 20+**.

```bash
git clone https://github.com/Sajid-ME/eisenhower-matrix
cd eisenhower-matrix
npm install
npm run dev