import { Suspense, useEffect, type ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { SiteNav } from './SiteNav'
import { Footer } from './Footer'
import { DOC_ORDER } from './docs'

export function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="loading">
      <span className="size-1.5 animate-pulse rounded-full bg-accent" />
    </div>
  )
}

export function Suspended({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>
}

const TITLES: Record<string, string> = {
  '/': 'Agentic OS - a local-first memory for AI agents',
  '/console': 'Live console - Agentic OS',
  '/download': 'Download for Mac & Windows - Agentic OS',
  ...Object.fromEntries(DOC_ORDER.map((l) => [l.to, `${l.label} - Agentic OS`])),
}

export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = TITLES[pathname] ?? 'Agentic OS'
  }, [pathname])
  return null
}

/** Marketing + docs shell: nav, page, footer. */
export function SiteLayout() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <ScrollToTop />
      <SiteNav />
      <main className="flex-1">
        <Suspended>
          <Outlet />
        </Suspended>
      </main>
      <Footer />
    </div>
  )
}

/** App-like shell for the interactive console: nav + full-height body, no footer. */
export function ConsoleLayout() {
  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      <ScrollToTop />
      <SiteNav />
      <main className="min-h-0 flex-1">
        <Suspended>
          <Outlet />
        </Suspended>
      </main>
    </div>
  )
}
