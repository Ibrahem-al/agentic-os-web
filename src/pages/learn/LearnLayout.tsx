import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, List } from '@phosphor-icons/react'
import { cn } from '../../lib/format'
import { DOC_NAV, DOC_ORDER } from '../../components/site/docs'
import { Suspended } from '../../components/site/SiteLayout'

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-6" aria-label="documentation">
      {DOC_NAV.map((group) => (
        <div key={group.title}>
          <div className="px-2.5 font-mono text-[11px] tracking-wide text-ink-faint">{group.title}</div>
          <ul className="mt-1.5 flex flex-col">
            {group.links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/learn'}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'block rounded-md px-2.5 py-1.5 text-[13.5px] transition-colors duration-120',
                      isActive
                        ? 'bg-raised text-ink shadow-[inset_2px_0_0_var(--color-accent)]'
                        : 'text-ink-mute hover:bg-raised hover:text-ink',
                    )
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function LearnLayout() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const idx = DOC_ORDER.findIndex((l) => l.to === pathname)
  const prev = idx > 0 ? DOC_ORDER[idx - 1] : null
  const next = idx >= 0 && idx < DOC_ORDER.length - 1 ? DOC_ORDER[idx + 1] : null

  return (
    <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-0 px-5 sm:px-8 lg:grid-cols-[224px_1fr] lg:gap-12">
      {/* mobile toggle */}
      <div className="flex items-center gap-2 border-b border-line py-3 lg:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 rounded-md border border-line-strong px-3 py-1.5 text-[13px] text-ink-mute"
          aria-expanded={open}
        >
          <List size={16} /> Contents
        </button>
      </div>
      {open && (
        <div className="border-b border-line py-4 lg:hidden">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      )}

      {/* desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto py-10 pr-2">
          <SidebarNav />
        </div>
      </aside>

      {/* content */}
      <div className="min-w-0 py-10 lg:py-12">
        <Suspended>
          <Outlet />
        </Suspended>

        {(prev || next) && (
          <div className="mt-16 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
            {prev ? (
              <Link
                to={prev.to}
                className="group flex flex-col rounded-md border border-line p-4 transition-colors hover:border-line-strong hover:bg-surface/60"
              >
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink-faint">
                  <ArrowLeft size={12} /> previous
                </span>
                <span className="mt-1 text-[14px] font-medium text-ink group-hover:text-accent">{prev.label}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to={next.to}
                className="group flex flex-col items-end rounded-md border border-line p-4 text-right transition-colors hover:border-line-strong hover:bg-surface/60"
              >
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-ink-faint">
                  next <ArrowRight size={12} />
                </span>
                <span className="mt-1 text-[14px] font-medium text-ink group-hover:text-accent">{next.label}</span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
