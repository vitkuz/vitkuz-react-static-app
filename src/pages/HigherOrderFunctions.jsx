import CodeBlock from '../components/CodeBlock'

const builtInCode = `// map – transform every element (returns new array)
const doubled = [1, 2, 3, 4, 5].map((n) => n * 2)
// [2, 4, 6, 8, 10]

// filter – keep elements that pass a predicate (returns new array)
const evens = [1, 2, 3, 4, 5, 6].filter((n) => n % 2 === 0)
// [2, 4, 6]

// reduce – accumulate values into a single result
const sum = [1, 2, 3, 4, 5].reduce((acc, n) => acc + n, 0)
// 15

// Chaining them together (left-to-right data flow)
const result = [1, 2, 3, 4, 5, 6, 7, 8]
  .filter((n) => n % 2 === 0)  // [2, 4, 6, 8]
  .map((n) => n * 10)          // [20, 40, 60, 80]
  .reduce((acc, n) => acc + n, 0) // 200`

const customHofCode = `// A higher-order function that creates other functions
const createMultiplier = (factor) => (n) => n * factor

const double = createMultiplier(2)
const triple = createMultiplier(3)

double(5)  // 10
triple(5)  // 15

// HOF that accepts a function and returns a new one
const withLogging = (fn) => (...args) => {
  const result = fn(...args)
  console.log(\`\${fn.name}(\${args.join(', ')}) => \${result}\`)
  return result
}

const loggedAdd = withLogging((a, b) => a + b)
loggedAdd(3, 4) // logs: "add(3, 4) => 7"`

const onceCode = `// once – a HOF that ensures a function runs only once
const once = (fn) => {
  let called = false, result
  return (...args) => {
    if (!called) {
      called = true
      result = fn(...args)
    }
    return result
  }
}

const initApp = once(() => ({ startedAt: Date.now() }))

const state1 = initApp() // { startedAt: 1712345678000 }
const state2 = initApp() // same object, fn not called again
state1 === state2 // true`

export default function HigherOrderFunctions() {
  return (
    <article className="prose prose-gray mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-black">
        Higher-Order Functions
      </h1>
      <p className="mt-4 leading-relaxed text-gray-500">
        A higher-order function (HOF) is a function that either takes one or
        more functions as arguments, returns a function, or both. HOFs are the
        backbone of functional programming — they let you abstract over
        behaviour, not just data.
      </p>

      <h2 className="mt-10 text-xl font-medium text-black">
        When to use it
      </h2>
      <ul className="mt-3 space-y-2 text-gray-500">
        <li>You find yourself repeating the same looping or conditional logic.</li>
        <li>You want to configure behaviour without duplicating code.</li>
        <li>You need to wrap functions with cross-cutting concerns (logging, memoisation).</li>
        <li>You want to build composable, testable building blocks.</li>
      </ul>

      <h2 className="mt-10 text-xl font-medium text-black">
        Built-in HOFs: map, filter, reduce
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        JavaScript&rsquo;s Array methods are classic HOFs — they accept a
        function and apply it to each element without mutating the original.
      </p>
      <div className="mt-4">
        <CodeBlock code={builtInCode} />
      </div>

      <h2 className="mt-10 text-xl font-medium text-black">
        Custom HOFs
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        Writing your own HOFs is straightforward. Here a factory creates
        multiplier functions, and a decorator wraps any function with logging.
      </p>
      <div className="mt-4">
        <CodeBlock code={customHofCode} />
      </div>

      <h2 className="mt-10 text-xl font-medium text-black">
        Practical example: <code>once</code>
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        A common HOF pattern — guarantee a function runs only once, caching
        the result for subsequent calls.
      </p>
      <div className="mt-4">
        <CodeBlock code={onceCode} />
      </div>
    </article>
  )
}
