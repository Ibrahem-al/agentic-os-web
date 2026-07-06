import { Link } from 'react-router-dom'
import { GithubLogo } from '@phosphor-icons/react'
import { APP_REPO, APP_VERSION, MCP_URL } from '../../lib/site'
import { Wordmark } from './Wordmark'

const COLUMNS: { title: string; links: { label: string; to: string; ext?: boolean }[] }[] = [
  {
    title: 'product',
    links: [
      { label: 'Overview', to: '/' },
      { label: 'Live console', to: '/console' },
      { label: 'Download', to: '/download' },
    ],
  },
  {
    title: 'knowledge',
    links: [
      { label: 'Architecture', to: '/learn/architecture' },
      { label: 'MCP server', to: '/learn/mcp' },
      { label: 'Retrieval', to: '/learn/retrieval' },
      { label: 'Memory & storage', to: '/learn/memory' },
    ],
  },
  {
    title: 'internals',
    links: [
      { label: 'Background agents', to: '/learn/agents' },
      { label: 'Security & sandbox', to: '/learn/security' },
      { label: 'Tech stack', to: '/learn/stack' },
      { label: 'Build & ship', to: '/download' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-void">
      <div className="mx-auto max-w-[1240px] px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Wordmark />
            <p className="mt-4 text-[13px] leading-relaxed text-ink-mute">
              A local-first memory-and-tool backend for AI agents. Claude orchestrates;
              Agentic OS serves context, learns from finished sessions, and runs background
              agents that get better over time.
            </p>
            <p className="mt-4 font-mono text-[11px] text-ink-faint">
              v{APP_VERSION} · {MCP_URL}
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-[11px] text-ink-faint">{col.title}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-[13px] text-ink-mute transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-ink-faint">
            MIT licensed. Local-first — your memory never leaves your machine.
          </p>
          <a
            href={APP_REPO}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[13px] text-ink-mute transition-colors hover:text-ink sm:ml-auto"
          >
            <GithubLogo size={16} weight="fill" />
            Ibrahem-al/agentic-os
          </a>
        </div>
      </div>
    </footer>
  )
}
