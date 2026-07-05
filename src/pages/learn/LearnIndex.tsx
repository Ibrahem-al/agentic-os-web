import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { DocHeader, DOC_NAV } from '../../components/site/docs'
import { ArchitectureStack } from '../../components/marketing/ArchitectureStack'

export function LearnIndex() {
  const sections = DOC_NAV.flatMap((g) => g.links).filter((l) => l.to !== '/learn')
  return (
    <div>
      <DocHeader
        kicker="engineering handbook"
        title="Understand every part of Agentic OS"
        intro="This is the handoff. If you were rebuilding Agentic OS from scratch, these pages would tell you how each subsystem works, what it is built on, and why the boundaries sit where they do. Start with the architecture, then follow the data."
      />

      <div className="mt-10 rounded-lg border border-line bg-surface/40 p-5 sm:p-7">
        <div className="font-mono text-[11px] text-ink-faint">the system, top to bottom</div>
        <div className="mt-5">
          <ArchitectureStack animate={false} />
        </div>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {sections.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="group flex flex-col rounded-lg border border-line bg-surface/40 p-5 transition-colors hover:border-line-strong hover:bg-surface"
          >
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-ink group-hover:text-accent">{l.label}</span>
              <ArrowRight size={16} className="text-ink-faint transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
            </div>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-mute">{l.blurb}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
