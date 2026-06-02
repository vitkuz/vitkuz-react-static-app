import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

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

/* ------------------------------------------------------------------ */
/*  Shared logic — lifted from the code examples above                */
/* ------------------------------------------------------------------ */

interface AppConfig {
  apiBase: string
  timeout: number
  retries: number
}

interface DbConnection {
  id: string
  pool: symbol
  status: string
}

const loadConfig = (): AppConfig => ({
  apiBase: 'https://api.example.com/v2',
  timeout: 5000,
  retries: 3,
})

// Eager singleton — created once at module evaluation time
const appConfig: AppConfig = Object.freeze(loadConfig())

const getDb = (() => {
  let instance: DbConnection | null = null

  const createDb = (): DbConnection => ({
    id: crypto.randomUUID(),
    pool: Symbol('db-pool'),
    status: 'connected',
  })

  return (): DbConnection => {
    instance ??= createDb()
    return instance
  }
})()

void appConfig // referenced so tsc knows it's used

function SingletonWidget(): ReactNode {
  const [calls, setCalls] = useState<Array<{ call: number; instanceId: string }>>([])

  const handleGetInstance = (): void => {
    const db = getDb()
    setCalls((prev) => [...prev, { call: prev.length + 1, instanceId: db.id }])
  }

  const allSame: boolean =
    calls.length > 1 && calls.every((c) => c.instanceId === calls[0]!.instanceId)

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Click the button multiple times. Every call returns the{' '}
        <strong>same instance</strong> — the module cache guarantees the factory
        runs at most once.
      </p>

      <button
        type="button"
        onClick={handleGetInstance}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
      >
        getDb()
      </button>

      {calls.length > 0 && (
        <div className="space-y-1">
          {calls.map((c) => (
            <div
              key={c.call}
              className="flex items-center gap-2 text-sm text-slate-700"
            >
              <span className="text-slate-400">Call #{c.call}</span>
              <span className="text-slate-300">→</span>
              <span className="font-mono text-slate-800">
                instance id: {c.instanceId}
              </span>
            </div>
          ))}
        </div>
      )}

      {allSame && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          ✅ All {calls.length} calls returned the <strong>same instance</strong>.
          The ES module cache makes every <code className="font-mono text-emerald-800">getDb()</code> call
          resolve to the identical object.
        </div>
      )}
    </div>
  )
}

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

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={[
              'Singleton «class»',
              '-instance (static)',
              '+getInstance()',
              'Client',
            ]}
            fp={[
              'ES module cache',
              'loadConfig()',
              'getDb()',
              'appConfig / db',
            ]}
          />
        </Diagram>

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

        <Widget title="Try the lazy singleton">
          <SingletonWidget />
        </Widget>

        <Callout tone="tip">
          In FP, Singletons are trivial: <strong>export a frozen value</strong>{' '}
          from a module and the ES‑module cache takes care of the rest. No
          classes, no static state, no global registry — just the language
          runtime doing what it already does. Be mindful of testability,
          though: a module‑level singleton is hard to reset between tests.
          When that matters, consider passing the shared dependency down
          instead of importing it directly.
        </Callout>

        <Diagram caption="Eager singleton: module load → cached instance">
          <FlowDiagram
            steps={['import', 'loadConfig()', 'Object.freeze()', 'shared config']}
          />
        </Diagram>
      </div>
    </>
  )
}
