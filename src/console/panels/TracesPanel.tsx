import { useState } from 'react'
import { PanelHeader, DataTable, EmptyState, type Column } from '../../components/kit'
import { cn, duration, truncate } from '../../lib/format'
import { TRACES, type Trace, type TraceSpan } from '../data'

function depthOf(span: TraceSpan, spans: TraceSpan[]): number {
  let d = 0
  let cur = span
  const byId = new Map(spans.map((s) => [s.id, s]))
  while (cur.parent) {
    const p = byId.get(cur.parent)
    if (!p) break
    cur = p
    d += 1
    if (d > 8) break
  }
  return d
}

function Waterfall({ trace }: { trace: Trace }) {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div>
      <div className="flex items-baseline gap-3 border-b border-line px-4 py-2.5">
        <span className="truncate text-[13px] font-semibold">{trace.root}</span>
        <span className="font-mono text-[12px] text-ink-mute">
          {duration(trace.durMs)} · {trace.spanCount} spans
        </span>
      </div>
      <div className="px-4 py-2">
        {trace.spans.map((s) => {
          const left = (s.startMs / trace.durMs) * 100
          const width = Math.max(0.5, (s.durMs / trace.durMs) * 100)
          const isOpen = open === s.id
          return (
            <div key={s.id}>
              <button
                onClick={() => setOpen(isOpen ? null : s.id)}
                aria-expanded={isOpen}
                className="flex h-6 w-full items-center border-b border-line text-left transition-colors hover:bg-raised"
              >
                <span
                  className="shrink-0 truncate pr-2 text-[11px]"
                  style={{ width: '40%', paddingLeft: depthOf(s, trace.spans) * 12 }}
                >
                  {s.name}
                </span>
                <span className="relative h-full flex-1">
                  <span
                    className={cn(
                      'absolute top-1/2 h-2 -translate-y-1/2 rounded-[2px]',
                      s.status === 'error' ? 'bg-err' : 'bg-accent',
                    )}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                </span>
                <span className="w-16 text-right font-mono text-[11px] text-ink-mute">
                  {duration(s.durMs)}
                </span>
              </button>
              {isOpen && (
                <div className="border-b border-line bg-surface px-3 py-2">
                  <dl className="grid grid-cols-[minmax(96px,max-content)_1fr] gap-x-4 gap-y-1 text-[12px]">
                    {s.attributes.map((a, i) => {
                      const perm = a.k.startsWith('permission.')
                      return (
                        <div key={i} className="contents">
                          <dt className={cn('font-mono text-[11px] leading-5', perm ? 'font-semibold text-ink' : 'text-ink-mute')}>{a.k}</dt>
                          <dd className={cn('font-mono text-[11px] leading-5', perm && 'font-semibold text-ink')}>{a.v}</dd>
                        </div>
                      )
                    })}
                  </dl>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function TracesPanel() {
  const [selected, setSelected] = useState<Trace | null>(TRACES[0] ?? null)

  const cols: Column<Trace>[] = [
    { key: 'root', header: 'root', render: (t) => truncate(t.root, 40) },
    { key: 'started', header: 'started', className: 'whitespace-nowrap', render: (t) => <span className="font-mono text-[11px] text-ink-mute">{t.started}</span> },
    { key: 'dur', header: 'duration', className: 'text-right font-mono', render: (t) => duration(t.durMs) },
    { key: 'spans', header: 'spans', className: 'text-right font-mono', render: (t) => t.spanCount },
    { key: 'err', header: 'errors', className: 'text-right font-mono', render: (t) => <span className={cn(t.errorCount > 0 && 'text-err')}>{t.errorCount}</span> },
  ]

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="traces" />
      <div className="grid min-h-0 flex-1 grid-cols-[2fr_3fr]">
        <div className="min-h-0 overflow-y-auto border-r border-line">
          <DataTable columns={cols} rows={TRACES} rowKey={(t) => t.id} onRowClick={setSelected} selectedKey={selected?.id} empty="no traces yet" />
        </div>
        <div className="min-h-0 overflow-y-auto">
          {selected ? <Waterfall trace={selected} /> : <EmptyState>select a trace to see its span waterfall</EmptyState>}
        </div>
      </div>
    </div>
  )
}
