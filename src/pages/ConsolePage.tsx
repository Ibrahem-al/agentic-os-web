import { Link } from 'react-router-dom'
import { ArrowRight, Info } from '@phosphor-icons/react'
import { ConsoleApp } from '../console/ConsoleApp'

export function ConsolePage() {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-3 border-b border-line bg-surface/60 px-4 py-2">
        <Info size={15} className="shrink-0 text-accent" />
        <p className="min-w-0 text-[12.5px] text-ink-mute">
          <span className="text-ink">Interactive recreation.</span> Every panel runs on seeded
          data. Approve a staged write, undo an audited action, open a trace, browse the memory
          graph. It is the real cockpit, rebuilt in the browser.
        </p>
        <Link
          to="/download"
          className="ml-auto hidden shrink-0 items-center gap-1 font-mono text-[12px] text-accent hover:underline sm:flex"
        >
          run the real thing <ArrowRight size={13} />
        </Link>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="h-full min-w-[900px]">
          <ConsoleApp />
        </div>
      </div>
    </div>
  )
}
