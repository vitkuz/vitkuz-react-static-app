import { useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
  slug: 'proxy',
  title: 'Proxy',
  navLabel: 'Proxy',
  category: 'Structural',
  order: 12,
}

const lazyProxyCode = `// --- A lazy-initialization proxy ---
// Wraps a factory function; delays execution until first call,
// then caches the result for all future calls.

const lazy = (factory) => {
  let value
  let done = false

  return () => {
    if (done) return value
    value = factory()
    done = true
    return value
  }
}

// --- Usage ---

// Expensive computation we want to defer
const loadConfig = () => {
  console.log('Loading configuration…')
  return { theme: 'dark', lang: 'en' }
}

const config = lazy(loadConfig)

// loadConfig hasn't run yet — nothing logged
// First call triggers the factory:
config() // logs "Loading configuration…"
// Subsequent calls return the cached result:
config() // no log, returns cached object`

const memoProxyCode = `// --- An access-control / caching "memo" proxy ---
// Wraps any function, caches results keyed by argument.

const memo = (fn) => {
  const cache = new Map()

  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

// --- Usage ---

const slowAdd = (a, b) => {
  console.log('Computing…')
  return a + b
}

const fastAdd = memo(slowAdd)

fastAdd(2, 3) // logs "Computing…", returns 5
fastAdd(2, 3) // cache hit — no log, returns 5
fastAdd(2, 3) // cache hit — no log, returns 5`

/* ------------------------------------------------------------------ */
/*  Shared logic — lifted from the memo example above                 */
/* ------------------------------------------------------------------ */

function memo<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  const cache = new Map<string, R>()
  return (...args: A): R => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)!
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

/* ------------------------------------------------------------------ */
/*  ProxyWidget — interactive memoization proxy demo                   */
/* ------------------------------------------------------------------ */

interface CallEntry {
  args: string
  result: number
  cached: boolean
}

function ProxyWidget(): ReactNode {
  const computeRef = useRef(0)
  const [calls, setCalls] = useState<CallEntry[]>([])

  // Memoized add — the ref tracks how many times the inner fn actually runs
  const memoAdd = useMemo(() => {
    computeRef.current = 0
    const add = (a: number, b: number): number => {
      computeRef.current++
      return a + b
    }
    return memo(add)
  }, [])

  const handleCall = () => {
    // Small range → cache hits after the first few calls
    const a = Math.floor(Math.random() * 5)
    const b = Math.floor(Math.random() * 5)
    const before = computeRef.current
    const result = memoAdd(a, b)
    const cached = computeRef.current === before
    setCalls((prev) => [
      ...prev.slice(-9),
      { args: `${a} + ${b}`, result, cached },
    ])
  }

  const totalCalls = calls.length
  const totalComputes = computeRef.current
  const cacheHits = totalCalls - totalComputes

  return (
    <div className="space-y-4">
      <button
        onClick={handleCall}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
      >
        Call memoized function
      </button>

      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <span className="text-slate-500">Calls: </span>
          <span className="font-mono">{totalCalls}</span>
        </div>
        <div>
          <span className="text-slate-500">Computations: </span>
          <span className="font-mono">{totalComputes}</span>
        </div>
        <div>
          <span className="text-slate-500">Cache hits: </span>
          <span className="font-mono">{cacheHits}</span>
        </div>
      </div>

      {calls.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500">
            Recent calls (newest first)
          </p>
          {[...calls].reverse().map((call, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="font-mono">
                {call.args} = {call.result}
              </span>
              <span
                className={
                  call.cached
                    ? 'rounded px-1.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700'
                    : 'rounded px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700'
                }
              >
                {call.cached ? 'cached' : 'computed'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProxyPattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={12}
        title="Proxy"
        intro="Provide a surrogate or placeholder for another object to control access to it. The Proxy pattern lets you add a layer of indirection that can handle lazy loading, caching, logging, or access control — all without the client needing to know."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Proxy pattern provides a substitute for a real object, letting
          you intercept requests before they reach the target. Classic use
          cases include lazy initialization (virtual proxy), access control
          (protection proxy), and caching (caching proxy) — all while exposing
          the same interface as the real subject.
        </p>

        <h2>OO → functional</h2>
        <p>
          In OO, you create a <code>Proxy</code> class that implements the same
          interface as the <code>RealSubject</code> and delegates to it
          conditionally. In functional programming,{' '}
          <strong>a proxy is just a higher-order function</strong> that wraps
          the original, keeps the same signature, and adds behavior before or
          after forwarding the call. Closures hold the proxy's internal state
          (cache, access flag, etc.) — no classes needed.
        </p>

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={['Subject «interface»', 'RealSubject', 'Proxy']}
            fp={['fn signature (= interface)', 'original function', 'memo / lazy (= proxy)']}
          />
        </Diagram>

        <h2>Functional example: lazy proxy</h2>
        <p>
          <code>lazy</code> takes a <strong>factory function</strong> and
          returns a proxy function with the same zero-argument signature.
          Internally, a closure tracks whether the value has been computed.
          The factory runs at most once — perfect for deferring expensive
          initialization until the result is actually needed.
        </p>
        <CodeBlock code={lazyProxyCode} />

        <h2>Functional example: memoization proxy</h2>
        <p>
          <code>memo</code> wraps any function to add result caching. It
          serializes the arguments as a cache key and returns the cached value
          on subsequent identical calls. This is a classic <em>caching
          proxy</em> — the original function is never modified, and callers
          use the proxy exactly as they would the original.
        </p>
        <CodeBlock code={memoProxyCode} />

        <Widget title="Try the memoization proxy">
          <ProxyWidget />
        </Widget>

        <Callout tone="tip">
          In FP, the Proxy pattern is just a <strong>closure wrapping a
          function</strong>. Use it to add lazy evaluation, caching, or access
          checks without changing the original function's signature — pure
          composition over inheritance.
        </Callout>

        <Diagram caption="Data flow through a memoizing proxy">
          <FlowDiagram steps={['caller', 'proxy (memo)', 'original fn', 'result']} />
        </Diagram>
      </div>
    </>
  )
}
