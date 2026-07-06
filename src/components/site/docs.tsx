import type { ReactNode } from 'react'
import { cn } from '../../lib/format'

/* --------------------------------------------------------- doc navigation */

export interface DocLink {
  to: string
  label: string
  blurb: string
}
export interface DocGroup {
  title: string
  links: DocLink[]
}

export const DOC_NAV: DocGroup[] = [
  {
    title: 'start',
    links: [{ to: '/learn', label: 'Overview', blurb: 'What Agentic OS is and how the pieces fit.' }],
  },
  {
    title: 'system design',
    links: [
      { to: '/learn/architecture', label: 'Architecture', blurb: 'The layered system, boot order, and data flow.' },
      { to: '/learn/mcp', label: 'MCP server & connection', blurb: 'Transport, auth, the tool surface, and how Claude connects.' },
    ],
  },
  {
    title: 'internals',
    links: [
      { to: '/learn/retrieval', label: 'Retrieval pipeline', blurb: 'Hybrid search, fusion, rerank, and the self-correcting loop.' },
      { to: '/learn/memory', label: 'Memory & storage', blurb: 'RyuGraph, the graph schema, and the single write lane.' },
      { to: '/learn/agents', label: 'Background agents', blurb: 'Extraction and the nightly skill-improvement loop.' },
      { to: '/learn/security', label: 'Security & sandbox', blurb: 'Deno/Docker lanes, permissions, audit, and undo.' },
    ],
  },
  {
    title: 'engineering',
    links: [
      { to: '/learn/stack', label: 'Tech stack', blurb: 'Every dependency, what it does, and why it is here.' },
      { to: '/learn/build', label: 'Build & ship', blurb: 'Native rebuild, packaging for Mac/Windows, CI, and tests.' },
    ],
  },
]

export const DOC_ORDER: DocLink[] = DOC_NAV.flatMap((g) => g.links)

/* ------------------------------------------------------------ prose atoms */

export function DocProse({ children }: { children: ReactNode }) {
  return <div className="flex max-w-[74ch] flex-col gap-5">{children}</div>
}

function slug(children: ReactNode): string {
  return String(children)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function H2({ children }: { children: ReactNode }) {
  const id = slug(children)
  return (
    <h2 id={id} className="mt-8 scroll-mt-24 text-[clamp(1.35rem,2.4vw,1.7rem)] font-semibold tracking-[-0.02em]">
      {children}
    </h2>
  )
}

export function H3({ children }: { children: ReactNode }) {
  const id = slug(children)
  return (
    <h3 id={id} className="mt-4 scroll-mt-24 text-[16px] font-semibold text-ink">
      {children}
    </h3>
  )
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[14.5px] leading-relaxed text-ink-mute">{children}</p>
}

export function Ul({ children }: { children: ReactNode }) {
  return <ul className="flex flex-col gap-2 text-[14.5px] leading-relaxed text-ink-mute">{children}</ul>
}

export function Li({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="mt-2 size-1 shrink-0 rounded-full bg-accent/70" />
      <span className="min-w-0">{children}</span>
    </li>
  )
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>
}

/* --------------------------------------------------------------- spec table */

export function SpecTable({
  head,
  rows,
}: {
  head: string[]
  rows: ReactNode[][]
}) {
  return (
    <div className="overflow-x-auto rounded-md border border-line">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr className="bg-surface text-left">
            {head.map((h) => (
              <th key={h} className="border-b border-line-strong px-3 py-2 font-mono text-[11px] font-normal text-ink-mute">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {r.map((cell, j) => (
                <td key={j} className={cn('px-3 py-2 align-top', j === 0 && 'font-mono text-[12px] text-ink')}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* -------------------------------------------------------------- page header */

export function DocHeader({ kicker, title, intro }: { kicker: string; title: string; intro: string }) {
  return (
    <header className="border-b border-line pb-6">
      <div className="font-mono text-[11px] tracking-wide text-accent">{kicker}</div>
      <h1 className="mt-2 text-[clamp(1.9rem,4vw,2.6rem)] font-semibold tracking-[-0.03em]">{title}</h1>
      <p className="mt-4 max-w-[70ch] text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed text-ink-mute">{intro}</p>
    </header>
  )
}
