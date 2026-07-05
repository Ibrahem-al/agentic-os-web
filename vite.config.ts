import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Marketing + knowledge site for Agentic OS.
// React 19 + Vite 7 + Tailwind v4 + Motion — the same renderer stack the
// desktop app ships (React 19 + Vite + Tailwind v4), so the cockpit
// recreations use the real component grammar.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
  },
})
