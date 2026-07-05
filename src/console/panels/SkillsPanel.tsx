import { useState } from 'react'
import {
  PanelHeader,
  DataTable,
  Badge,
  Button,
  Select,
  EmptyState,
  SectionHead,
  useToast,
  type Column,
} from '../../components/kit'
import { cn, truncate } from '../../lib/format'
import { SKILLS, type SkillRow, type SkillVersion, type SkillExample } from '../data'

function conf(n: number | null): string {
  return n == null ? '-' : n.toFixed(2)
}

function Detail({ skill }: { skill: SkillRow }) {
  const toast = useToast()
  const [mode, setMode] = useState('stylistic')
  const [drift, setDrift] = useState('flag')

  const verCols: Column<SkillVersion>[] = [
    { key: 'version', header: 'version', className: 'font-mono', render: (v) => truncate(v.id, 16) },
    { key: 'status', header: 'status', render: (v) => <Badge status={v.status} /> },
    { key: 'benchmark', header: 'benchmark', className: 'text-right font-mono', render: (v) => conf(v.benchmark) },
    { key: 'created', header: 'created', className: 'whitespace-nowrap', render: (v) => <span className="font-mono text-[11px] text-ink-mute">{v.created}</span> },
  ]

  return (
    <div className="flex flex-col gap-4 px-4 py-3">
      <div>
        <div className="text-[16px] font-semibold">{skill.name}</div>
        <div className="font-mono text-[11px] text-ink-faint">{skill.id}</div>
        <div className="font-mono text-[12px] text-ink-mute">current: {skill.currentVersion}</div>
      </div>

      <div>
        <SectionHead title="improvement" />
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={mode}
            onChange={setMode}
            ariaLabel="adoption mode"
            options={[
              { value: 'stylistic', label: 'stylistic - human approves' },
              { value: 'verifiable', label: 'verifiable - auto-adopt on win' },
            ]}
          />
          <Select
            value={drift}
            onChange={setDrift}
            ariaLabel="drift policy"
            options={[
              { value: 'flag', label: 'drift: flag only' },
              { value: 'revert', label: 'drift: auto-revert' },
            ]}
          />
          <Button variant="primary" onClick={() => toast('improvement task enqueued - watch tasks & watchers', 'ok')}>
            improve now
          </Button>
          <Button
            variant="danger"
            disabled={skill.versions < 2}
            title={skill.versions < 2 ? 'no standing adoption to roll back' : 'restore the previous version'}
            onClick={() => toast('previous version restored', 'info')}
          >
            rollback
          </Button>
        </div>
        <p className="mt-2 font-mono text-[11px] text-ink-faint">
          last improvement run: 12s ago · nightly slot 02:00 (event-gated)
        </p>
      </div>

      <div>
        <SectionHead title="instructions" />
        <div className="max-h-56 overflow-y-auto rounded-md bg-raised p-3 text-[12px] leading-5 whitespace-pre-wrap">
          {skill.instructions}
        </div>
      </div>

      <div>
        <SectionHead title="versions" />
        <DataTable columns={verCols} rows={skill.versionRows} rowKey={(v) => v.id} empty="no versions recorded" />
      </div>

      <div>
        <SectionHead title="examples" />
        {skill.exampleRows.length === 0 ? (
          <p className="text-[13px] text-ink-mute">no examples recorded</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {skill.exampleRows.map((e: SkillExample, i) => (
              <li key={i} className="flex items-start gap-2 text-[13px]">
                <Badge status={e.kind} label={e.kind} />
                <span className="leading-5 text-ink-mute">{e.content}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {skill.correctionRows.length > 0 && (
        <div>
          <SectionHead title="corrections" />
          <ul className="flex flex-col gap-1 text-[13px]">
            {skill.correctionRows.map((c, i) => (
              <li key={i}>
                <span className="font-mono text-[11px] text-ink-mute">corr</span> {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function SkillsPanel() {
  const [selected, setSelected] = useState<SkillRow | null>(SKILLS[0] ?? null)

  const cols: Column<SkillRow>[] = [
    { key: 'name', header: 'name', render: (s) => s.name },
    { key: 'cv', header: 'current version', className: 'font-mono', render: (s) => s.currentVersion },
    { key: 'versions', header: 'versions', className: 'text-right font-mono', render: (s) => s.versions },
    { key: 'uses', header: 'uses', className: 'text-right font-mono', render: (s) => s.uses },
    {
      key: 'examples',
      header: 'examples',
      className: 'font-mono',
      render: (s) => (
        <span>
          {s.examples} {s.failExamples > 0 && <span className="text-err">({s.failExamples} fail)</span>}
        </span>
      ),
    },
    { key: 'corrections', header: 'corrections', className: 'text-right font-mono', render: (s) => s.corrections },
    { key: 'score', header: 'active score', className: 'text-right font-mono', render: (s) => conf(s.score) },
  ]

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="skills" />
      <div className="grid min-h-0 flex-1 grid-cols-[3fr_2fr]">
        <div className="min-h-0 overflow-y-auto border-r border-line">
          <DataTable columns={cols} rows={SKILLS} rowKey={(s) => s.id} onRowClick={setSelected} selectedKey={selected?.id} empty="no skills saved yet" />
        </div>
        <div className={cn('min-h-0 overflow-y-auto')}>
          {selected ? <Detail skill={selected} /> : <EmptyState>select a skill</EmptyState>}
        </div>
      </div>
    </div>
  )
}
