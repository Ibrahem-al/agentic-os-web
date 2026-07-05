import { useState } from 'react'
import { Copy, Check } from '@phosphor-icons/react'
import { PanelHeader, Badge, Button, Select, TextInput, SectionHead, useToast } from '../../components/kit'
import { CLAUDE_MCP_ADD, MCP_URL } from '../../lib/site'
import { SETTINGS } from '../data'

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      onClick={() => {
        navigator.clipboard?.writeText(text)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? <Check size={13} weight="bold" className="text-ok" /> : <Copy size={13} />}
      {copied ? 'copied' : 'copy'}
    </Button>
  )
}

export function SettingsPanel() {
  const toast = useToast()
  const [provider, setProvider] = useState(SETTINGS.cloudProvider)
  const [model, setModel] = useState(SETTINGS.modelOverride)
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="flex h-full flex-col">
      <PanelHeader title="settings" />
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 py-4">
        {/* cloud provider */}
        <section className="max-w-3xl">
          <SectionHead title="cloud provider" meta="the reasoning tier background agents use" />
          <div className="flex flex-wrap items-end gap-2">
            <Select
              value={provider}
              onChange={setProvider}
              label="provider"
              options={SETTINGS.providers.map((p) => ({ value: p, label: p }))}
            />
            <div className="flex-1">
              <TextInput value={model} onChange={setModel} label="model override" mono />
            </div>
            <Button size="default" variant="primary" onClick={() => toast('saved', 'ok')}>save</Button>
          </div>
          <p className="mt-2 text-[11px] text-ink-faint">api keys and provider changes arm background agents on next launch</p>
        </section>

        {/* api keys */}
        <section className="max-w-3xl border-t border-line pt-5">
          <SectionHead title="api keys" meta="stored encrypted via safeStorage, never on disk in plaintext" />
          {SETTINGS.apiKeys.map((k) => (
            <div key={k.provider} className="flex items-center gap-3 border-b border-line py-2">
              <span className="w-28">{k.provider}</span>
              {k.set ? <Badge status="key set" label="key set" /> : <span className="font-mono text-[11px] text-ink-faint">no key</span>}
              <span className="ml-auto">
                <Button onClick={() => toast('safeStorage is a desktop-only capability; this is a demo', 'info')}>set key</Button>
              </span>
            </div>
          ))}
        </section>

        {/* local models */}
        <section className="max-w-3xl border-t border-line pt-5">
          <SectionHead title="local models" meta="ollama serves bge-m3 embeddings and the small llm" />
          <div className="flex flex-wrap items-center gap-2">
            <Badge status={SETTINGS.ollamaState} />
            <span className="font-mono text-[11px] text-ink-mute">{SETTINGS.ollamaModels.join(' · ')}</span>
          </div>
          <div className="mt-3 flex items-end gap-2">
            <div className="flex-1">
              <TextInput value={SETTINGS.smallLlm} onChange={() => {}} label="small llm override" mono />
            </div>
            <Button size="default" variant="primary" onClick={() => toast('saved', 'ok')}>save</Button>
          </div>
        </section>

        {/* mcp connection */}
        <section className="max-w-3xl border-t border-line pt-5">
          <SectionHead title="mcp connection" meta="connect claude code or any mcp client" />
          <p className="font-mono text-[12px] text-ink-mute">{MCP_URL}</p>
          <div className="mt-2 flex items-start gap-2">
            <pre className="min-w-0 flex-1 overflow-x-auto rounded-md bg-raised p-3 font-mono text-[12px] break-all whitespace-pre-wrap">
              {CLAUDE_MCP_ADD}
            </pre>
            <CopyBtn text={CLAUDE_MCP_ADD} />
          </div>
          <p className="mt-2 font-mono text-[11px] text-ink-faint">
            C:\Users\ibrah\AppData\Roaming\agentic-os\.mcp.json
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Button onClick={() => setRevealed((r) => !r)}>{revealed ? 'hide token' : 'reveal token'}</Button>
            {revealed && (
              <code className="rounded bg-raised px-2 py-1 font-mono text-[11px] break-all text-ink-mute">
                8Kx2v_qN4mTp…RbW7 (demo; real token lives in the OS keychain)
              </code>
            )}
          </div>
          <p className="mt-2 text-[11px] text-ink-faint">
            the token replaces &lt;token&gt; in the command. treat it like a password.
          </p>
        </section>

        {/* hook */}
        <section className="max-w-3xl border-t border-line pt-5">
          <SectionHead title="session-end hook" meta="claude code posts finished sessions to the extraction queue" />
          <p className="text-[13px] text-ink-mute">
            installed - sessions extract automatically when they end
          </p>
          <div className="mt-2">
            <Button variant="primary" onClick={() => toast('already installed - nothing changed', 'info')}>
              reinstall / repair hook
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
