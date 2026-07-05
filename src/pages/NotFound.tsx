import { Link } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import { Container } from '../components/site/primitives'

export function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="font-mono text-[13px] text-err">404 · not found</div>
      <h1 className="mt-4 text-[clamp(1.8rem,4vw,2.6rem)] font-semibold tracking-[-0.03em]">
        This route was never staged.
      </h1>
      <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ink-mute">
        The page you asked for is not in memory. Head back to the overview, or browse the docs.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="flex h-10 items-center gap-2 rounded-md bg-accent px-5 text-[13.5px] font-semibold text-accent-ink hover:bg-accent/85"
        >
          Home
        </Link>
        <Link
          to="/learn"
          className="flex h-10 items-center gap-2 rounded-md border border-line-strong px-5 text-[13.5px] font-medium text-ink hover:bg-raised"
        >
          Read the docs <ArrowRight size={15} />
        </Link>
      </div>
    </Container>
  )
}
