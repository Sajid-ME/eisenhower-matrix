// Vite config — controls how the app is built.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // The path the site is served from on GitHub Pages.
  // MUST match your repo name exactly, with slashes on both sides.
  // Example: if repo is "eisenhower-matrix", base = "/eisenhower-matrix/".
  base: '/eisenhower-matrix/',

  plugins: [react(), tailwindcss()],
});