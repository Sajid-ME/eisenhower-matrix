// Vite config — controls how the app is built.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // IMPORTANT: change this to '/YOUR-REPO-NAME/'
  // This must match your GitHub repo name exactly, with slashes on both sides.
  base: '/eisenhower-matrix/',
  plugins: [react(), tailwindcss()],
});