import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
  slug: 'adapter',
  title: 'Adapter',
  navLabel: 'Adapter',
  category: 'Structural',
  order: 6,
}

const dataAdapterCode = `// --- Adapt a legacy data shape to a new one ---

const adaptUser = (legacy) => ({
  name: \`\${legacy.firstName} \${legacy.lastName}\`,
  email: legacy.mail,
})

// Old API returns this shape
const legacyUser = {
  firstName: 'Jane',
  lastName: 'Doe',
  mail: 'jane@example.com',
}

const modernUser = adaptUser(legacyUser)
// { name: 'Jane Doe', email: 'jane@example.com' }`

const callbackAdapterCode = `// --- Wrap a callback-based API into a promise ---

const promisify =
  (fn) =>
  (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

// Hypothetical legacy API that expects a callback
const readConfigLegacy = (path, callback) => {
  // ... reads file and calls callback(err, data)
}

const readConfig = promisify(readConfigLegacy)

// Now use it with async/await instead of callbacks
const config = await readConfig('/etc/app.conf')`

export default function AdapterPattern() {
  return (
    <>
      <StepHeader
        order={6}
        title="Adapter"
        intro="Convert the interface of something into another interface the client expects. The Adapter pattern lets incompatible interfaces work together."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Adapter pattern wraps an existing interface (a legacy API, a
          third-party library, an old data shape) and presents it in the form
          the rest of your application expects — without changing the original.
        </p>

        <h2>OO → functional</h2>
        <p>
          In object-oriented design, an adapter is a class that implements a
          target interface by delegating to an adaptee object. In functional
          programming, <strong>an adapter is a wrapper function</strong> that
          takes one shape or calling convention as input and returns another
          — closures and higher-order functions replace the ceremony of
          interface and adapter class entirely.
        </p>

        <h2>Functional examples</h2>
        <p>
          The first example adapts a legacy data record into the shape the
          modern UI expects. It's a pure mapping function — no class, no
          instantiation.
        </p>
        <CodeBlock code={dataAdapterCode} />

        <p>
          The second example wraps an old callback-style function into a
          promise-returning one (<code>promisify</code>). The adapter is a
          higher-order function that takes the legacy function as input and
          returns the adapted version, ready for <code>async/await</code>.
        </p>
        <CodeBlock code={callbackAdapterCode} />

        <Callout tone="tip">
          In FP, the Adapter pattern reduces to <strong>wrapper functions</strong>{' '}
          and <strong>higher-order functions</strong>: map one shape to another,
          or bridge calling conventions. No interfaces, no adapter classes
          — just functions that transform.
        </Callout>
      </div>
    </>
  )
}
