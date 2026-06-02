import type { ReactNode } from 'react'

interface StepHeaderProps {
  order: number
  title: string
  intro?: ReactNode
}

export default function StepHeader({
  order,
  title,
  intro,
}: StepHeaderProps): ReactNode {
  return (
    <header className="not-prose mb-8 border-b border-slate-200 pb-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
        Step {order}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      {intro && (
        <p className="mt-4 text-lg leading-relaxed text-slate-600">{intro}</p>
      )}
    </header>
  )
}
