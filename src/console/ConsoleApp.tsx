import { useState } from 'react'
import { cn } from '../lib/format'
import { ToastProvider, StatusDot } from '../components/kit'
import { MCP_URL, APP_VERSION } from '../lib/site'
import { SUBSYSTEMS } from './data'
import { MemoryPanel } from './panels/MemoryPanel'
import { ReviewPanel } from './panels/ReviewPanel'
import { AuditPanel } from './panels/AuditPanel'
import { SpendPanel } from './panels/SpendPanel'
import { TasksPanel } from './panels/TasksPanel'
import { TracesPanel } from './panels/TracesPanel'
import { SkillsPanel } from './panels/SkillsPanel'
import { IngestPanel } from './panels/IngestPanel'
import { SettingsPanel } from './panels/SettingsPanel'

type PanelKey =
  | 'memory'
  | 'review'
  | 'audit'
  | 'spend'
  | 'tasks'
  | 'traces'
  | 'skills'
  | 'ingest'
  | 'settings'

const NAV: { key: PanelKey; label: string; badge?: number }[] = [
  { key: 'memory', label: 'memory' },
  { key: 'review', label: 'review queue', badge: 4 },
  { key: 'audit', label: 'audit log' },
  { key: 'spend', label: 'spend' },
  { key: 'tasks', label: 'tasks & watchers' },
  { key: 'traces', label: 'traces' },
  { key: 'skills', label: 'skills' },
  { key: 'ingest', label: 'ingestion' },
  { key: 'settings', label: 'settings' },
]

const PANELS: Record<PanelKey, () => React.ReactElement> = {
  memory: MemoryPanel,
  review: ReviewPanel,
  audit: AuditPanel,
  spend: SpendPanel,
  tasks: TasksPanel,
  traces: TracesPanel,
  skills: SkillsPanel,
  ingest: IngestPanel,
  settings: SettingsPanel,
}

export function ConsoleApp({ initial = 'memory' }: { initial?: PanelKey }) {
  const [active, setActive] = useState<PanelKey>(initial)
  const Panel = PANELS[active]

  return (
    <ToastProvider>
      <div className="flex h-full min-h-0 bg-bg text-ink">
        <nav
          aria-label="panels"
          className="z-20 flex w-[216px] shrink-0 flex-col border-r border-line bg-surface"
        >
          <div className="px-4 pt-4 pb-3">
            <div className="text-[14px] font-semibold tracking-tight">agentic-os</div>
            <div className="font-mono text-[11px] text-ink-faint">operations console</div>
          </div>
          <ul className="min-h-0 flex-1 overflow-y-auto px-2">
            {NAV.map((n) => {
              const on = n.key === active
              return (
                <li key={n.key}>
                  <button
                    onClick={() => setActive(n.key)}
                    aria-current={on ? 'page' : undefined}
                    className={cn(
                      'flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-[7px] text-left text-[13px] transition-colors duration-120',
                      on
                        ? 'bg-raised text-ink shadow-[inset_2px_0_0_var(--color-accent)]'
                        : 'text-ink-mute hover:bg-raised hover:text-ink',
                    )}
                  >
                    {n.label}
                    {n.badge != null && n.badge > 0 && (
                      <span className="rounded-full bg-warn/15 px-1.5 font-mono text-[11px] text-warn">
                        {n.badge}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="border-t border-line px-4 py-3">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {SUBSYSTEMS.map((s) => (
                <span key={s.key} className="flex items-center gap-1.5 font-mono text-[11px]">
                  <StatusDot up={s.up} />
                  <span className={s.up ? 'text-ink-mute' : 'text-err'}>{s.key}</span>
                </span>
              ))}
            </div>
            <div className="mt-2 font-mono text-[11px] text-ink-faint">
              v{APP_VERSION} · {MCP_URL}
            </div>
          </div>
        </nav>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Panel />
        </div>
      </div>
    </ToastProvider>
  )
}

export type { PanelKey }
