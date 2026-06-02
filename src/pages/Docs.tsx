import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import StepHeader from '../components/StepHeader'

const patterns = [
  {
    to: '/docs/patterns/composition',
    title: 'Function Composition',
    desc: 'Combine functions into pipelines with pipe and compose, making data flow explicit and testable.',
  },
  {
    to: '/docs/patterns/currying',
    title: 'Currying & Partial Application',
    desc: 'Transform multi-argument functions into chains of single-argument functions for better reusability.',
  },
  {
    to: '/docs/patterns/higher-order-functions',
    title: 'Higher-Order Functions',
    desc: 'Functions that take or return functions — the foundation of abstraction in functional programming.',
  },
  {
    to: '/docs/patterns/immutability',
    title: 'Immutability',
    desc: 'Never mutate data; always produce new values with spread, map, filter, and slice.',
  },
  {
    to: '/docs/patterns/memoization',
    title: 'Memoization',
    desc: 'Cache expensive pure-function results so repeated calls with the same arguments are instant.',
  },
  {
    to: '/docs/patterns/maybe',
    title: 'Either / Maybe Pattern',
    desc: 'Wrap optional values so you can chain operations without scattering null checks everywhere.',
  },
]

export default function Docs(): ReactNode {
  return (
    <>
      <StepHeader
        order={2}
        title="Introduction"
        intro="Welcome to the documentation. Explore functional programming patterns with clear explanations and syntax-highlighted code examples written in a pure functional style."
      />
      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Functional patterns</h2>
        <p>
          Each pattern page explains the concept, when to reach for it, and
          demonstrates it with practical JavaScript code.
        </p>
      </div>
      <div className="not-prose mt-6 grid gap-4 sm:grid-cols-2">
        {patterns.map((p) => (
          <Link
            key={p.to}
            to={p.to}
            className="rounded-lg border border-slate-200 bg-white px-5 py-4 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <strong className="text-sm font-medium text-slate-900">
              {p.title}
            </strong>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {p.desc}
            </p>
          </Link>
        ))}
      </div>
    </>
  )
}
