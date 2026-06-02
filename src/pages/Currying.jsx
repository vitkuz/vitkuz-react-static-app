import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

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
    <>
      <StepHeader
        order={5}
        title="Currying &amp; Partial Application"
        intro="Currying turns a function that takes multiple arguments into a sequence of functions, each taking a single argument. Partial application lets you fix some arguments upfront and defer the rest. Both techniques make functions more reusable and compose better."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>When to use it</h2>
        <ul>
          <li>You want to create specialised functions from more general ones.</li>
          <li>You&rsquo;re building data pipelines where each step expects a single argument.</li>
          <li>You need to defer execution until all data is available.</li>
          <li>You want better separation of configuration from execution.</li>
        </ul>

        <h2>Currying</h2>
        <p>
          A generic <code>curry</code> implementation keeps collecting arguments
          until it has enough to call the original function.
        </p>
        <CodeBlock code={curryingExample} />

        <h2>Partial application</h2>
        <p>
          Simpler than full currying — just pre-fill some arguments.
        </p>
        <CodeBlock code={partialExample} />

        <h2>Currying in pipelines</h2>
        <p>
          Currying pairs well with <code>pipe</code> and <code>compose</code>{' '}
          because each step naturally receives one argument.
        </p>
        <CodeBlock code={filterMapExample} />

        <Callout tone="tip" title="Currying vs partial application">
          Currying always produces unary functions; partial application
          returns a function that may still accept multiple arguments.
          Use currying when you need maximum composability; use partial
          when you just want to lock in a few arguments.
        </Callout>
      </div>
    </>
  )
}
