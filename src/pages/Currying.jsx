import CodeBlock from '../components/CodeBlock'

const curryingExample = `// curry – transforms a multi-arg function into nested unary functions
const curry = (fn) =>
  function curried(...args) {
    return args.length >= fn.length
      ? fn(...args)
      : (...more) => curried(...args, ...more)
  }

const add = curry((a, b, c) => a + b + c)

add(1)(2)(3)   // 6
add(1, 2)(3)   // 6
add(1)(2, 3)   // 6`

const partialExample = `// partial application – fix some arguments now, supply the rest later
const partial = (fn, ...fixed) => (...args) => fn(...fixed, ...args)

const greet = (greeting, name) => \`\${greeting}, \${name}!\`

const sayHello = partial(greet, 'Hello')
const sayGoodbye = partial(greet, 'Goodbye')

sayHello('Alice')   // 'Hello, Alice!'
sayGoodbye('Bob')   // 'Goodbye, Bob!'`

const filterMapExample = `// Currying enables point-free data pipelines
const filter = curry((pred, xs) => xs.filter(pred))
const map = curry((fn, xs) => xs.map(fn))

const isEven = (n) => n % 2 === 0
const double = (n) => n * 2

const doubleEvens = pipe(filter(isEven), map(double))

// (pipe defined in the Composition page)
doubleEvens([1, 2, 3, 4, 5, 6]) // [4, 8, 12]`

export default function Currying() {
  return (
    <article className="prose prose-gray mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-black">
        Currying &amp; Partial Application
      </h1>
      <p className="mt-4 leading-relaxed text-gray-500">
        Currying turns a function that takes multiple arguments into a sequence
        of functions, each taking a single argument. Partial application lets
        you fix some arguments upfront and defer the rest. Both techniques make
        functions more reusable and compose better.
      </p>

      <h2 className="mt-10 text-xl font-medium text-black">
        When to use it
      </h2>
      <ul className="mt-3 space-y-2 text-gray-500">
        <li>You want to create specialised functions from more general ones.</li>
        <li>You&rsquo;re building data pipelines where each step expects a single argument.</li>
        <li>You need to defer execution until all data is available.</li>
        <li>You want better separation of configuration from execution.</li>
      </ul>

      <h2 className="mt-10 text-xl font-medium text-black">Currying</h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        A generic <code>curry</code> implementation keeps collecting arguments
        until it has enough to call the original function.
      </p>
      <div className="mt-4">
        <CodeBlock code={curryingExample} />
      </div>

      <h2 className="mt-10 text-xl font-medium text-black">
        Partial application
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        Simpler than full currying — just pre-fill some arguments.
      </p>
      <div className="mt-4">
        <CodeBlock code={partialExample} />
      </div>

      <h2 className="mt-10 text-xl font-medium text-black">
        Currying in pipelines
      </h2>
      <p className="mt-3 leading-relaxed text-gray-500">
        Currying pairs well with <code>pipe</code> and{' '}
        <code>compose</code> because each step naturally receives one argument.
      </p>
      <div className="mt-4">
        <CodeBlock code={filterMapExample} />
      </div>
    </article>
  )
}
