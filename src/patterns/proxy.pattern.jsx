import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
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

export default function ProxyPattern() {
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

        <Callout tone="tip">
          In FP, the Proxy pattern is just a <strong>closure wrapping a
          function</strong>. Use it to add lazy evaluation, caching, or access
          checks without changing the original function's signature — pure
          composition over inheritance.
        </Callout>
      </div>
    </>
  )
}
