import type { ReactNode } from 'react'

export interface WidgetProps {
  title?: string
  children: ReactNode
}

export default function Widget({ title, children }: WidgetProps): ReactNode {
  return (
    <figure className="not-prose my-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
      <figcaption className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2">
        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
          Live
        </span>
        {title && (
          <span className="text-sm font-medium text-slate-700">{title}</span>
        )}
      </figcaption>
      <div className="px-4 py-4">{children}</div>
    </figure>
  )
}
