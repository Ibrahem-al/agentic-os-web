import { useState } from 'react'
import {
  PanelHeader,
  DataTable,
  Badge,
  Button,
  SectionHead,
  KV,
  TextInput,
  useToast,
  type Column,
} from '../../components/kit'
import { truncate } from '../../lib/format'
import { JOBS, WATCHED, SCHEDULES, type Job, type WatchedFolder } from '../data'

export function TasksPanel() {
  const toast = useToast()
  const [scanning, setScanning] = useState<string | null>(null)

  const scan = (name: string) => {
    setScanning(name)
    window.setTimeout(() => {
      setScanning(null)
      toast('scanned 12 files: 3 ingested, 9 skipped, 0 failed', 'ok')
    }, 900)
  }

  const jobCols: Column<Job>[] = [
    { key: 'id', header: 'id', className: 'font-mono', render: (j) => truncate(j.id, 20) },
    { key: 'kind', header: 'kind', render: (j) => j.kind },
    { key: 'status', header: 'status', render: (j) => <Badge status={j.status} /> },
    { key: 'attempts', header: 'attempts', className: 'text-right font-mono', render: (j) => j.attempts },
    { key: 'updated', header: 'updated', className: 'whitespace-nowrap', render: (j) => <span className="font-mono text-[11px] text-ink-mute">{j.updated}</span> },
    {
      key: 'error',
      header: 'last error',
      render: (j) =>
        j.error ? (
          <span className="font-mono text-[11px] text-err" title={j.error}>{truncate(j.error, 60)}</span>
        ) : (
          <span className="text-ink-faint">-</span>
        ),
    },
  ]

  const folderCols: Column<WatchedFolder>[] = [
    { key: 'name', header: 'name', render: (f) => f.name },
    { key: 'path', header: 'path', className: 'font-mono max-w-64', render: (f) => <span className="block truncate" title={f.path}>{f.path}</span> },
    { key: 'tags', header: 'tags', render: (f) => f.tags || '-' },
    { key: 'ext', header: 'extensions', render: (f) => f.extensions },
    { key: 'enabled', header: 'enabled', className: 'font-mono', render: (f) => (f.enabled ? 'yes' : 'no') },
    {
      key: 'actions',
      header: 'actions',
      render: (f) => (
        <span className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
          <Button onClick={() => scan(f.name)} disabled={scanning === f.name}>
            {scanning === f.name ? 'scanning…' : 'scan now'}
          </Button>
          <Button variant="danger" onClick={() => toast(`removed ${f.name}`, 'info')}>remove</Button>
        </span>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="tasks & watchers" />
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-4">
        <section>
          <SectionHead title="triggers" meta="queue, schedules and rules" />
          <KV
            rows={[
              { k: 'queue', v: '1 pending · 1 running' },
              { k: 'running', v: <span className="font-mono">job-demo-4</span> },
              { k: 'session-end hook', v: 'installed' },
            ]}
          />
          <ul className="mt-3 flex flex-col gap-1 font-mono text-[11px] text-ink-mute">
            {SCHEDULES.map((s) => (
              <li key={s.name}>
                {s.name} ({s.cron}) - next {s.next}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionHead title="background jobs" meta="retries: 3 attempts, backoff 1m / 5m / 25m" />
          <DataTable columns={jobCols} rows={JOBS} rowKey={(j) => j.id} empty="no background jobs yet" />
        </section>

        <section>
          <SectionHead title="watched folders" meta="watched automatically while the app runs - scan now forces a pass" />
          <DataTable columns={folderCols} rows={WATCHED} rowKey={(f) => f.name} empty="no watched folders - add one below" />
          <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-line pt-3">
            <TextInput value="" onChange={() => {}} label="name" className="w-40" />
            <TextInput value="" onChange={() => {}} label="path" mono className="w-72" />
            <Button size="default">browse</Button>
            <TextInput value="" onChange={() => {}} label="tags" placeholder="tags, comma separated" className="w-56" />
            <Button size="default" variant="primary" disabled>add folder</Button>
          </div>
        </section>
      </div>
    </div>
  )
}
