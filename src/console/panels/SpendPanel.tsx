import { PanelHeader, DataTable, SectionHead, Button, type Column } from '../../components/kit'
import { usd, tokens, truncate } from '../../lib/format'
import { SPEND, type SpendTask, type SpendCall } from '../data'

export function SpendPanel() {
  const taskCols: Column<SpendTask>[] = [
    { key: 'task', header: 'task', className: 'font-mono', render: (t) => <span title={t.taskId}>{truncate(t.taskId, 24)}</span> },
    { key: 'calls', header: 'calls', className: 'text-right font-mono', render: (t) => t.calls },
    { key: 'usd', header: 'usd', className: 'text-right font-mono', render: (t) => usd(t.usd) },
    { key: 'last', header: 'last', className: 'whitespace-nowrap', render: (t) => <span className="font-mono text-[11px] text-ink-mute">{t.last}</span> },
  ]
  const callCols: Column<SpendCall>[] = [
    { key: 'when', header: 'when', className: 'whitespace-nowrap', render: (c) => <span className="font-mono text-[11px] text-ink-mute">{c.when}</span> },
    { key: 'provider', header: 'provider', render: (c) => c.provider },
    { key: 'model', header: 'model', className: 'font-mono', render: (c) => c.model },
    { key: 'tok', header: 'tokens in/out', className: 'font-mono', render: (c) => `${tokens(c.inTok)} / ${tokens(c.outTok)}` },
    { key: 'usd', header: 'usd', className: 'text-right font-mono', render: (c) => usd(c.usd) },
  ]

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="spend" actions={<Button>refresh</Button>} />
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-4">
        <div className="flex flex-wrap items-baseline gap-8 border border-line px-4 py-3">
          <div className="flex flex-col">
            <span className="text-[11px] text-ink-mute">total</span>
            <span className="font-mono text-[16px]">{usd(SPEND.total)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-ink-mute">last 24h</span>
            <span className="font-mono text-[13px]">{usd(SPEND.last24h)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] text-ink-mute">per-task ceiling</span>
            <span className="font-mono text-[13px]">
              {usd(SPEND.ceiling)} <span className="font-sans text-[11px] text-ink-faint">(default, per-task override)</span>
            </span>
          </div>
        </div>

        <section>
          <SectionHead title="by task" />
          <DataTable columns={taskCols} rows={SPEND.byTask} rowKey={(t) => t.taskId} empty="no cloud spend recorded" />
        </section>

        <section>
          <SectionHead title="recent calls" />
          <DataTable columns={callCols} rows={SPEND.recent} rowKey={(c) => `${c.when}-${c.usd}`} empty="no cloud calls yet" />
        </section>
      </div>
    </div>
  )
}
