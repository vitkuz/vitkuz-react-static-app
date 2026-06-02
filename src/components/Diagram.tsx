/**
 * Diagram primitives contract
 * ---------------------------
 * Each pattern page may render <CompareDiagram .../> and/or <FlowDiagram .../>
 * inside its prose, and interactive demos go in a locally-defined *Widget
 * component wrapped in <Widget title="...">. No shared files need editing to
 * add a widget/diagram to a pattern — everything is either a shared primitive
 * or local to the pattern file.
 */

import type { ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/*  Diagram — a titled figure wrapper                                  */
/* ------------------------------------------------------------------ */

export interface DiagramProps {
  title?: string
  caption?: string
  children: ReactNode
}

export function Diagram({ title, caption, children }: DiagramProps): ReactNode {
  return (
    <figure className="not-prose my-6 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
      {title && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </p>
      )}
      {children}
      {caption && <p className="mt-3 text-xs text-slate-500">{caption}</p>}
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/*  FlowDiagram — connected step chips                                 */
/* ------------------------------------------------------------------ */

export interface FlowDiagramProps {
  steps: string[]
}

const arrow = <span className="text-slate-400">{'\u2192'}</span>

export function FlowDiagram({ steps }: FlowDiagramProps): ReactNode {
  if (steps.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        return (
          <span key={`${step}-${i}`} className="flex items-center gap-2">
            <span
              className={
                isLast
                  ? 'rounded-md border border-blue-300 bg-blue-50 px-3 py-1.5 text-sm font-mono text-blue-700'
                  : 'rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-mono text-slate-700'
              }
            >
              {step}
            </span>
            {!isLast && arrow}
          </span>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  CompareDiagram — OO vs FP side-by-side                             */
/* ------------------------------------------------------------------ */

export interface CompareDiagramProps {
  oo: string[]
  fp: string[]
}

export function CompareDiagram({
  oo,
  fp,
}: CompareDiagramProps): ReactNode {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Object-Oriented column */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Object-Oriented
        </p>
        <div className="flex flex-col gap-1.5">
          {oo.map((item, i) => (
            <span
              key={`oo-${i}`}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Functional column */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          Functional
        </p>
        <div className="flex flex-col gap-1.5">
          {fp.map((item, i) => (
            <span
              key={`fp-${i}`}
              className="rounded-md border border-blue-300 px-3 py-1.5 text-sm text-blue-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
