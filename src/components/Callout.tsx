import type { ReactNode } from 'react'

export type CalloutTone = 'info' | 'tip' | 'warn'

interface ToneStyle {
  wrap: string
  label: string
  icon: string
  defaultTitle: string
}

const tones: Record<CalloutTone, ToneStyle> = {
  info: {
    wrap: 'border-blue-300 bg-blue-50 text-blue-950',
    label: 'text-blue-700',
    icon: 'ℹ',
    defaultTitle: 'Note',
  },
  tip: {
    wrap: 'border-emerald-300 bg-emerald-50 text-emerald-950',
    label: 'text-emerald-700',
    icon: '✓',
    defaultTitle: 'Tip',
  },
  warn: {
    wrap: 'border-amber-300 bg-amber-50 text-amber-950',
    label: 'text-amber-800',
    icon: '⚠',
    defaultTitle: 'Warning',
  },
}

interface CalloutProps {
  tone?: CalloutTone
  title?: string
  children: ReactNode
}

export default function Callout({
  tone = 'info',
  title,
  children,
}: CalloutProps): ReactNode {
  const t: ToneStyle = tones[tone] ?? tones.info
  return (
    <aside className={`not-prose my-6 rounded-lg border-l-4 px-4 py-3 ${t.wrap}`}>
      <p className={`mb-1 flex items-center gap-2 font-semibold ${t.label}`}>
        <span>{t.icon}</span>
        <span>{title || t.defaultTitle}</span>
      </p>
      <div className="text-sm leading-relaxed [&_code]:rounded [&_code]:bg-black/5 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]">
        {children}
      </div>
    </aside>
  )
}
