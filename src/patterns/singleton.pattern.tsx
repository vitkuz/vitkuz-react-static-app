import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta: PatternMeta = {
  slug: 'singleton',
  title: 'Singleton',
  navLabel: 'Singleton',
  category: 'Creational',
  order: 5,
}

const eagerCode = `// --- Eager singleton via ES module ---

// loadConfig runs once at module load time — the result is cached by the
// module system and every importer receives the same frozen object.
const loadConfig = () => ({
  apiBase: 'https://api.example.com/v2',
  timeout: 5000,
  retries: 3,
})

export const config = Object.freeze(loadConfig())
// config is created exactly once, shared across the entire app`

const lazyCode = `// --- Lazy singleton (created on first access) ---

// The IIFE closes over the instance variable; the module cache ensures
// the exported getter is the very same function for every importer.
const getDb = (() => {
  let instance = null

  const createDb = () => {
    // Expensive one-time initialisation: connection pool, warm-up, etc.
    return { pool: Symbol('db-pool'), status: 'connected' }
  }

  return () => {
    instance ??= createDb()
    return instance
  }
})()

export { getDb }

// Every consumer calls getDb() and receives the identical object`

export default function SingletonPattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={5}
        title="Singleton"
        intro="Ensure a class has only one instance and provide a global point of access to it — the classic OO formulation. In functional JavaScript we let the ES module system do the heavy lifting."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Singleton pattern restricts a type to a single instance and gives
          the whole application a well-known access point to it. Classic
          motivations include shared configuration objects, database connection
          pools, and caches — things where having more than one copy would be
          wasteful or incorrect.
        </p>

        <h2>OO → functional</h2>
        <p>
          In Node and ES modules <strong>the module system IS the
          singleton</strong>. When a module is first imported its top‑level
          code runs once; the runtime caches the module record and every
          subsequent <code>import</code> receives the same exports — no{' '}
          <code>class</code>, no private static field, no{' '}
          <code>getInstance()</code> ceremony. A value computed at module‑load
          time and exported is already a true singleton. For lazy
          initialisation you wrap the value in a getter backed by a
          closure‑scoped variable; the module cache guarantees every caller
          shares the same getter and therefore the same instance.
        </p>

        <h2>Functional example</h2>
        <p>
          The snippet below exports a frozen configuration object —{' '}
          <code>loadConfig()</code> runs exactly once when the module is first
          imported, and <code>Object.freeze</code> prevents any consumer from
          accidentally mutating the shared state.
        </p>
        <CodeBlock code={eagerCode} />

        <p>
          When the singleton is expensive to create and may never be needed,
          use a lazy variant. The IIFE hides the internal{' '}
          <code>instance</code> variable inside a closure; the{' '}
          <code>??=</code> (nullish‑coalescing assignment) ensures the factory
          runs at most once. Because the module system caches the exported
          function itself, every importer calls the very same{' '}
          <code>getDb</code> and reaches the same <code>instance</code>.
        </p>
        <CodeBlock code={lazyCode} />

        <Callout tone="tip">
          In FP, Singletons are trivial: <strong>export a frozen value</strong>{' '}
          from a module and the ES‑module cache takes care of the rest. No
          classes, no static state, no global registry — just the language
          runtime doing what it already does. Be mindful of testability,
          though: a module‑level singleton is hard to reset between tests.
          When that matters, consider passing the shared dependency down
          instead of importing it directly.
        </Callout>
      </div>
    </>
  )
}
