# Agentic OS — marketing & knowledge site

The website for **[Agentic OS](https://github.com/Ibrahem-al/agentic-os)**: a local-first Electron
desktop app that is a memory-and-tool backend for AI agents. Claude orchestrates over MCP; Agentic OS
serves context on demand, learns from finished sessions, and runs background agents that improve over
time.

This site does two jobs:

- **Markets the product** with animated simulations that recreate the app's real look and feel — the
  dark "instrument panel" cockpit, the live `get_context` retrieval pipeline, and the layered system
  architecture.
- **Documents the internals** for an engineer taking the project over: the MCP server and how Claude
  connects, the whole system design, the retrieval pipeline, the graph memory, the background agents,
  the security model, and every part of the tech stack.

It also ships a **fully interactive recreation of the nine-panel operations console** at `/console` —
the real cockpit, rebuilt in the browser on seeded data.

## Stack

Deliberately the same renderer stack the desktop app ships, so the cockpit recreations use the real
component grammar:

- **React 19** + **React Router 7**
- **Vite 7** + **TypeScript 5.8** (strict)
- **Tailwind CSS v4** — the app's exact OKLCH design tokens (indigo accent, semantic state colors,
  mono numerals, hairline density)
- **Motion** for restrained, reduced-motion-aware animation
- **Phosphor Icons**, self-hosted **Archivo** + **JetBrains Mono**

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

## Structure

```
src/
  components/
    kit.tsx            faithful recreation of the app's UI kit (table, badge,
                       diff, trace waterfall, modal, toast, confidence meter)
    site/              nav, footer, docs primitives, code blocks
    marketing/         the live simulations (retrieval, architecture, window frame)
  console/             the interactive nine-panel operations console + seeded data
  pages/               home, download, 404
  pages/learn/         the knowledge base (architecture, mcp, retrieval, memory,
                       agents, security, stack, build)
```

## Deploy

The site is a single-page app with clean URLs. Deploy configs are included:

- **Vercel** — `vercel.json` rewrites all routes to `index.html`.
- **Netlify** — `public/_redirects` does the same.

Any static host works as long as unknown paths fall back to `index.html`.

## License

MIT. The product runs fully on your machine.
