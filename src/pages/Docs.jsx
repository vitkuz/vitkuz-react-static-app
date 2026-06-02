import { Link } from 'react-router-dom'

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

export default function Docs() {
  return (
    <article className="prose prose-gray mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-black">
        Introduction
      </h1>
      <p className="mt-4 leading-relaxed text-gray-500">
        Welcome to the documentation. Explore functional programming patterns
        with clear explanations and syntax-highlighted code examples written
        in a pure functional style.
      </p>

      <h2 className="mt-10 text-xl font-medium text-black">
        Functional patterns
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        Each pattern page explains the concept, when to reach for it, and
        demonstrates it with practical JavaScript code.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {patterns.map((p) => (
          <Link
            key={p.to}
            to={p.to}
            className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100"
          >
            <strong className="text-sm font-medium text-black">{p.title}</strong>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              {p.desc}
            </p>
          </Link>
        ))}
      </div>
    </article>
  )
}
