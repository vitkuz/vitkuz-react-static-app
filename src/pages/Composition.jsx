import CodeBlock from '../components/CodeBlock'

const pipeCode = `// pipe – left-to-right function composition
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)

const trim = (s) => s.trim()
const upper = (s) => s.toUpperCase()
const exclaim = (s) => s + '!'

const shout = pipe(trim, upper, exclaim)

shout('  hello  ') // 'HELLO!'
shout('  functional  ') // 'FUNCTIONAL!'`

const composeCode = `// compose – right-to-left (also easy to build from pipe)
const compose = (...fns) => pipe(...fns.reverse())

const addPrefix = (p) => (s) => p + s
const sanitize = (s) => s.replace(/[^a-zA-Z0-9]/g, '')

const makeUsername = compose(
  addPrefix('user_'),
  sanitize,
  (s) => s.toLowerCase()
)

makeUsername('  Alice! ') // 'user_alice'`

export default function Composition() {
  return (
    <article className="prose prose-gray mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-black">
        Function Composition
      </h1>
      <p className="mt-4 leading-relaxed text-gray-500">
        Function composition is the act of combining two or more functions to
        produce a new function. Instead of nesting calls, you build a pipeline
        where the output of one function feeds into the next — making data flow
        explicit and code easier to reason about.
      </p>

      <h2 className="mt-10 text-xl font-medium text-black">
        When to use it
      </h2>
      <ul className="mt-3 space-y-2 text-gray-500">
        <li>You have a chain of transformations on the same piece of data.</li>
        <li>You want to avoid deeply nested function calls.</li>
        <li>Each step is a small, pure function — easy to test in isolation.</li>
        <li>The data flows in one direction and no side-effects are involved.</li>
      </ul>

      <h2 className="mt-10 text-xl font-medium text-black">
        <code className="text-base font-mono bg-gray-100 px-1 rounded">pipe</code> — left-to-right
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        A simple <code>pipe</code> is implemented with{' '}
        <code className="text-sm font-mono bg-gray-100 px-1 rounded">reduce</code>.
        Functions are applied in the order you list them.
      </p>
      <div className="mt-4">
        <CodeBlock code={pipeCode} />
      </div>

      <h2 className="mt-10 text-xl font-medium text-black">
        <code className="text-base font-mono bg-gray-100 px-1 rounded">compose</code> — right-to-left
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        Compose is the mathematical convention: the last function in the list
        runs first. It&rsquo;s easily built from <code>pipe</code> by reversing
        the argument order.
      </p>
      <div className="mt-4">
        <CodeBlock code={composeCode} />
      </div>
    </article>
  )
}
