import CodeBlock from '../components/CodeBlock'

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
    <article className="prose prose-gray mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-black">
        Memoization
      </h1>
      <p className="mt-4 leading-relaxed text-gray-500">
        Memoization is an optimisation technique that stores the results of
        expensive function calls and returns the cached result when the same
        inputs occur again. It works because pure functions always produce the
        same output for the same input.
      </p>

      <h2 className="mt-10 text-xl font-medium text-black">
        When to use it
      </h2>
      <ul className="mt-3 space-y-2 text-gray-500">
        <li>The function is pure — same arguments always give the same result.</li>
        <li>The function is called repeatedly with the same arguments.</li>
        <li>The computation is expensive enough to justify the cache overhead.</li>
        <li>The argument space is reasonably bounded (or you evict stale entries).</li>
      </ul>

      <h2 className="mt-10 text-xl font-medium text-black">
        A generic <code>memoize</code> HOF
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        Build a memoization wrapper once and apply it to any pure function.
        The fibonacci example below goes from exponential to linear time just
        by adding <code>memoize</code>.
      </p>
      <div className="mt-4">
        <CodeBlock code={memoizeCode} />
      </div>

      <h2 className="mt-10 text-xl font-medium text-black">
        WeakMap for object arguments
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        When the single argument is an object, a WeakMap-based approach is
        cleaner — no stringification needed, and entries are garbage-collected
        when the key object is no longer referenced.
      </p>
      <div className="mt-4">
        <CodeBlock code={weakMapCode} />
      </div>
    </article>
  )
}
