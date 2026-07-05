import { useState } from 'react'
import {
  PanelHeader,
  DataTable,
  Badge,
  Button,
  Modal,
  Select,
  TextInput,
  useToast,
  type Column,
} from '../../components/kit'
import { cn } from '../../lib/format'
import { AUDIT, type AuditEntry } from '../data'

export function AuditPanel() {
  const toast = useToast()
  const [entries, setEntries] = useState(AUDIT)
  const [kind, setKind] = useState('all')
  const [agentFilter, setAgentFilter] = useState('')
  const [confirm, setConfirm] = useState<AuditEntry | null>(null)

  const filtered = entries.filter(
    (e) =>
      (kind === 'all' || e.kind === kind) &&
      (agentFilter === '' || e.agent.toLowerCase().includes(agentFilter.toLowerCase())),
  )

  const doUndo = (id: string) => {
    setEntries((es) => es.map((e) => (e.id === id ? { ...e, undone: true } : e)))
    setConfirm(null)
    toast('undone', 'ok')
  }

  const cols: Column<AuditEntry>[] = [
    {
      key: 'sq',
      header: '',
      className: 'w-6',
      render: (e) => (
        <span
          className={cn(
            'mt-1 inline-block size-2 rounded-[2px]',
            e.undone ? 'bg-undo' : e.outcome === 'ok' ? 'bg-ok' : 'bg-err',
          )}
        />
      ),
    },
    { key: 'when', header: 'when', className: 'whitespace-nowrap', render: (e) => <span className="font-mono text-[11px] text-ink-mute">{e.when}</span> },
    { key: 'agent', header: 'agent', className: 'font-mono', render: (e) => <span className={cn(e.undone && 'text-ink-mute')}>{e.agent}</span> },
    {
      key: 'kind',
      header: 'kind',
      render: (e) => (
        <span className="flex flex-wrap items-center gap-1">
          <Badge status={e.kind} label={e.kind} />
          <Badge status={e.outcome} />
        </span>
      ),
    },
    {
      key: 'description',
      header: 'description',
      className: 'w-full',
      render: (e) => (
        <span className={cn('break-words', e.undone && 'text-ink-mute')}>
          {e.description}
          {e.error && <span className="mt-1 block font-mono text-[11px] text-err">{e.error}</span>}
        </span>
      ),
    },
    {
      key: 'delta',
      header: 'delta',
      className: 'font-mono text-[11px] text-ink-faint whitespace-nowrap',
      render: (e) => (e.reversible ? 'reversible' : 'irreversible'),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right whitespace-nowrap',
      render: (e) =>
        e.undone ? (
          <Badge status="undone" label="undone" />
        ) : e.reversible ? (
          <span onClick={(ev) => ev.stopPropagation()}>
            <Button onClick={() => setConfirm(e)}>undo</Button>
          </span>
        ) : null,
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <PanelHeader
        title="audit log"
        meta={`${entries.length} actions`}
        actions={
          <>
            <Select
              value={kind}
              onChange={setKind}
              ariaLabel="filter kind"
              options={[
                { value: 'all', label: 'all kinds' },
                { value: 'action', label: 'action' },
                { value: 'graph-write', label: 'graph-write' },
                { value: 'file-write', label: 'file-write' },
                { value: 'undo', label: 'undo' },
              ]}
            />
            <TextInput value={agentFilter} onChange={setAgentFilter} placeholder="filter agent" ariaLabel="filter agent" mono className="w-44" />
          </>
        }
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
        <DataTable
          columns={cols}
          rows={filtered}
          rowKey={(e) => e.id}
          empty="no audit entries match the current filters"
        />
      </div>

      {confirm && (
        <Modal
          title="undo action"
          onClose={() => setConfirm(null)}
          footer={
            <>
              <Button onClick={() => setConfirm(null)}>cancel</Button>
              <Button variant="danger" onClick={() => doUndo(confirm.id)}>undo</Button>
            </>
          }
        >
          <p className="text-[13px]">{confirm.description}</p>
          <p className="mt-2 text-[12px] leading-5 text-ink-mute">
            applies the recorded inverse delta through the write lane. the undo itself is audited
            and cannot be re-done.
          </p>
        </Modal>
      )}
    </div>
  )
}
