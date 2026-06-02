import { useState, type ChangeEvent } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
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

/* ------------------------------------------------------------------ */
/*  Shared logic — same pure functions shown in the code examples      */
/* ------------------------------------------------------------------ */

interface LegacyUser {
  firstName: string
  lastName: string
  mail: string
}

interface ModernUser {
  name: string
  email: string
}

const adaptUser = (legacy: LegacyUser): ModernUser => ({
  name: `${legacy.firstName} ${legacy.lastName}`,
  email: legacy.mail,
})

const initialLegacyUser: LegacyUser = {
  firstName: 'Jane',
  lastName: 'Doe',
  mail: 'jane@example.com',
}

/* ------------------------------------------------------------------ */
/*  Interactive widget                                                 */
/* ------------------------------------------------------------------ */

function AdapterWidget(): ReactNode {
  const [legacy, setLegacy] = useState<LegacyUser>(initialLegacyUser)
  const modern = adaptUser(legacy)

  const updateField = (field: keyof LegacyUser) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setLegacy((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Legacy shape (editable)
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {(['firstName', 'lastName', 'mail'] as const).map((field) => (
            <label key={field} className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">{field}</span>
              <input
                type="text"
                value={legacy[field]}
                onChange={updateField(field)}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center text-slate-400">
        <span className="text-lg">{'\u2193'} adaptUser {'\u2193'}</span>
      </div>

      <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          Adapted shape (live)
        </p>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">name</span>
            <span className="font-mono text-slate-900">{modern.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">email</span>
            <span className="font-mono text-slate-900">{modern.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdapterPattern(): ReactNode {
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

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={['Adaptee', 'Adapter', 'Target «interface»', 'Client']}
            fp={['legacyUser', 'adaptUser(fn)', '{ name, email }', 'modern UI']}
          />
        </Diagram>

        <Diagram caption="Data flow through the adapter function">
          <FlowDiagram steps={['legacyUser', 'adaptUser', '{ name, email }']} />
        </Diagram>

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

        <Widget title="Try the data adapter">
          <AdapterWidget />
        </Widget>
      </div>
    </>
  )
}
