import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

const memoizeCode = `// memoize – caches results keyed by arguments
const memoize = (fn) => {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

// An expensive pure function
const fibonacci = memoize((n) => {
  if (n < 2) return n
  return fibonacci(n - 1) + fibonacci(n - 2)
})

fibonacci(40) // computed once, cached for sub-calls too
fibonacci(40) // instant – served from cache`

const weakMapCode = `// WeakMap-based memoization – better for object-keyed caches
const memoizeWeak = (fn) => {
  const cache = new WeakMap()
  return (arg) => {
    if (cache.has(arg)) return cache.get(arg)
    const result = fn(arg)
    cache.set(arg, result)
    return result
  }
}

const heavyTransform = memoizeWeak((obj) => {
  // expensive computation on obj
  return { ...obj, processed: true }
})

const data = { id: 1, value: 'hello' }
const a = heavyTransform(data)
const b = heavyTransform(data)
a === b // true — same reference returned`

export default function Memoization() {
  return (
    <>
      <StepHeader
        order={8}
        title="Memoization"
        intro="Memoization is an optimisation technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again. It works because pure functions always produce the same output for the same input."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>When to use it</h2>
        <ul>
          <li>The function is pure — same arguments always give the same result.</li>
          <li>The function is called repeatedly with the same arguments.</li>
          <li>The computation is expensive enough to justify the cache overhead.</li>
          <li>The argument space is reasonably bounded (or you evict stale entries).</li>
        </ul>

        <h2>
          A generic <code>memoize</code> HOF
        </h2>
        <p>
          Build a memoization wrapper once and apply it to any pure function.
          The fibonacci example below goes from exponential to linear time just
          by adding <code>memoize</code>.
        </p>
        <CodeBlock code={memoizeCode} />

        <h2>WeakMap for object arguments</h2>
        <p>
          When the single argument is an object, a WeakMap-based approach is
          cleaner — no stringification needed, and entries are garbage-collected
          when the key object is no longer referenced.
        </p>
        <CodeBlock code={weakMapCode} />

        <Callout tone="warn" title="Memoization is not free">
          Every memoized call adds cache lookup overhead. Only memoize
          functions that are genuinely expensive and called repeatedly
          with the same arguments. For cheap functions, the cache overhead
          may exceed the computation cost.
        </Callout>
      </div>
    </>
  )
}
