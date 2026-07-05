import { useState } from 'react'
import {
  PanelHeader,
  DataTable,
  Badge,
  Button,
  Modal,
  Confidence,
  DiffView,
  SectionHead,
  Select,
  useToast,
  type Column,
} from '../../components/kit'
import { truncate } from '../../lib/format'
import {
  STAGED_WRITES,
  APPROVALS,
  FLAGGED,
  type StagedWrite,
  type Approval,
  type FlaggedDoc,
} from '../data'

export function ReviewPanel() {
  const toast = useToast()
  const [writes, setWrites] = useState(STAGED_WRITES)
  const [approvals, setApprovals] = useState(APPROVALS)
  const [selected, setSelected] = useState<StagedWrite | null>(null)
  const [filter, setFilter] = useState('staged')

  const visibleWrites = writes.filter((w) => filter === 'all' || w.status === filter)

  const decideWrite = (id: string, status: 'committed' | 'rejected') => {
    setWrites((ws) => ws.map((w) => (w.id === id ? { ...w, status } : w)))
    setSelected(null)
    toast(status === 'committed' ? 'committed (undoable in audit log)' : 'rejected', status === 'committed' ? 'ok' : 'info')
  }

  const decideApproval = (id: string, status: 'approved' | 'denied') => {
    setApprovals((as) => as.map((a) => (a.id === id ? { ...a, status } : a)))
    toast(status === 'approved' ? 'approved' : 'denied', status === 'approved' ? 'ok' : 'info')
  }

  const pendingApprovals = approvals.filter((a) => a.status === 'pending')

  const writeCols: Column<StagedWrite>[] = [
    { key: 'id', header: 'id', className: 'font-mono', render: (w) => <span title={w.id}>{w.id.slice(0, 14)}</span> },
    { key: 'kind', header: 'kind', render: (w) => w.kind },
    { key: 'by', header: 'proposed by', className: 'font-mono', render: (w) => w.proposedBy },
    {
      key: 'target',
      header: 'target',
      render: (w) => (
        <span>
          {w.targetLabel} <span className="font-mono text-ink-mute">{w.targetId}</span>
        </span>
      ),
    },
    { key: 'created', header: 'created', className: 'whitespace-nowrap', render: (w) => <span className="font-mono text-[11px] text-ink-mute">{w.created}</span> },
    { key: 'status', header: 'status', render: (w) => <Badge status={w.status} /> },
  ]

  const apprCols: Column<Approval>[] = [
    { key: 'agent', header: 'agent', className: 'font-mono', render: (a) => a.agent },
    { key: 'action', header: 'action', render: (a) => <span>{a.actionKind} <span className="font-mono text-ink-mute">{a.actionName}</span></span> },
    { key: 'tier', header: 'tier', className: 'font-mono', render: (a) => a.tier },
    { key: 'scope', header: 'scope', className: 'font-mono text-[11px]', render: (a) => truncate(a.scope, 46) },
    { key: 'requested', header: 'requested', className: 'whitespace-nowrap', render: (a) => <span className="font-mono text-[11px] text-ink-mute">{a.requested}</span> },
    { key: 'status', header: 'status', render: (a) => <Badge status={a.status} /> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (a) =>
        a.status === 'pending' ? (
          <span className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
            <Button variant="danger" onClick={() => decideApproval(a.id, 'denied')}>deny</Button>
            <Button variant="primary" onClick={() => decideApproval(a.id, 'approved')}>approve</Button>
          </span>
        ) : null,
    },
  ]

  const flagCols: Column<FlaggedDoc>[] = [
    { key: 'source', header: 'source', className: 'font-mono', render: (f) => truncate(f.source, 40) },
    { key: 'detector', header: 'detector', render: (f) => <Badge status="flagged" label={f.detector} /> },
    { key: 'pattern', header: 'pattern', className: 'font-mono', render: (f) => f.pattern },
    { key: 'excerpt', header: 'excerpt', render: (f) => truncate(f.excerpt, 80) },
    { key: 'created', header: 'created', className: 'whitespace-nowrap', render: (f) => <span className="font-mono text-[11px] text-ink-mute">{f.created}</span> },
  ]

  return (
    <div className="flex h-full flex-col">
      <PanelHeader
        title="review queue"
        meta={`${writes.length} writes · ${pendingApprovals.length} approvals · ${FLAGGED.length} flags`}
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
        <section className="mb-6">
          <div className="flex items-center">
            <SectionHead title="staged writes" meta={visibleWrites.length} />
            <div className="ml-auto">
              <Select
                value={filter}
                onChange={setFilter}
                ariaLabel="filter staged writes"
                options={[
                  { value: 'staged', label: 'staged' },
                  { value: 'committed', label: 'committed' },
                  { value: 'rejected', label: 'rejected' },
                  { value: 'all', label: 'all' },
                ]}
              />
            </div>
          </div>
          <DataTable
            columns={writeCols}
            rows={visibleWrites}
            rowKey={(w) => w.id}
            onRowClick={(w) => setSelected(w)}
            empty="no staged writes - low-confidence extractions and corrections queue here for review"
          />
        </section>

        <section className="mb-6">
          <SectionHead title="pending approvals" meta={pendingApprovals.length} />
          <DataTable
            columns={apprCols}
            rows={approvals}
            rowKey={(a) => a.id}
            empty="no pending approvals - agent actions that need consent will queue here"
          />
        </section>

        <section>
          <SectionHead title="flagged documents" meta={FLAGGED.length} />
          <DataTable
            columns={flagCols}
            rows={FLAGGED}
            rowKey={(f) => f.id}
            empty="no injection flags - ingested documents that look like instructions land here"
          />
        </section>
      </div>

      {selected && (
        <Modal
          title="staged write"
          wide
          onClose={() => setSelected(null)}
          footer={
            selected.status === 'staged' ? (
              <>
                <Button variant="danger" onClick={() => decideWrite(selected.id, 'rejected')}>
                  reject
                </Button>
                <Button variant="primary" onClick={() => decideWrite(selected.id, 'committed')}>
                  approve
                </Button>
              </>
            ) : (
              <Badge status={selected.status} />
            )
          }
        >
          {(selected.extractedBy || selected.confidence != null || selected.evidence) && (
            <div className="mb-3">
              <dl className="grid grid-cols-[minmax(96px,max-content)_1fr] gap-x-4 gap-y-1.5 text-[12px]">
                {selected.extractedBy && (
                  <div className="contents">
                    <dt className="font-mono text-[11px] text-ink-mute">extracted by</dt>
                    <dd className="font-mono text-[12px]">{selected.extractedBy}</dd>
                  </div>
                )}
                {selected.confidence != null && (
                  <div className="contents">
                    <dt className="font-mono text-[11px] text-ink-mute">confidence</dt>
                    <dd><Confidence value={selected.confidence} /></dd>
                  </div>
                )}
                {selected.session && (
                  <div className="contents">
                    <dt className="font-mono text-[11px] text-ink-mute">session</dt>
                    <dd className="font-mono text-[12px]">{selected.session}</dd>
                  </div>
                )}
              </dl>
              {selected.evidence && (
                <blockquote className="mt-2 rounded-md bg-raised px-3 py-2 text-[12px] leading-5 text-ink-mute">
                  {selected.evidence}
                </blockquote>
              )}
            </div>
          )}
          {selected.reason && !selected.evidence && (
            <p className="mb-3 text-[12px]">
              <span className="text-ink-mute">reason: </span>
              {selected.reason}
            </p>
          )}
          <DiffView text={selected.diff} />
        </Modal>
      )}
    </div>
  )
}
