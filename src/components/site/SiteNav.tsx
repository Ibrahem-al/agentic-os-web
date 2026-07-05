import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { GithubLogo, List, X, DownloadSimple } from '@phosphor-icons/react'
import { cn } from '../../lib/format'
import { APP_REPO } from '../../lib/site'
import { Wordmark } from './Wordmark'

const LINKS = [
  { to: '/console', label: 'Live console' },
  { to: '/learn', label: 'Docs' },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-25 border-b transition-colors duration-200',
        scrolled
          ? 'border-line bg-bg/85 backdrop-blur-md'
          : 'border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1240px] items-center gap-6 px-5 sm:px-8">
        <Link to="/" aria-label="Agentic OS home" className="rounded-md">
          <Wordmark />
        </Link>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-1.5 text-[13px] transition-colors duration-120',
                  isActive
                    ? 'text-ink'
                    : 'text-ink-mute hover:bg-raised hover:text-ink',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          <a
            href={APP_REPO}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] text-ink-mute transition-colors duration-120 hover:bg-raised hover:text-ink"
          >
            <GithubLogo size={16} weight="fill" />
            GitHub
          </a>
          <Link
            to="/download"
            className="ml-2 flex h-8 items-center gap-1.5 rounded-md bg-accent px-3.5 text-[13px] font-medium text-accent-ink transition-colors duration-120 hover:bg-accent/85 active:translate-y-px"
          >
            <DownloadSimple size={16} weight="bold" />
            Download
          </Link>
        </div>

        <button
          className="ml-auto flex size-9 items-center justify-center rounded-md text-ink-mute hover:bg-raised hover:text-ink md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'close menu' : 'open menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <List size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-line bg-surface px-5 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-[14px]',
                    isActive ? 'bg-raised text-ink' : 'text-ink-mute hover:bg-raised',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href={APP_REPO}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-[14px] text-ink-mute hover:bg-raised"
            >
              <GithubLogo size={16} weight="fill" />
              GitHub
            </a>
            <Link
              to="/download"
              className="mt-1 flex h-10 items-center justify-center gap-1.5 rounded-md bg-accent text-[14px] font-medium text-accent-ink"
            >
              <DownloadSimple size={16} weight="bold" />
              Download
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
