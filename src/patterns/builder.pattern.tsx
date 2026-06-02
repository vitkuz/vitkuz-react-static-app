import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta: PatternMeta = {
  slug: 'builder',
  title: 'Builder',
  navLabel: 'Builder',
  category: 'Creational',
  order: 3,
}

const builderCode = `// --- Immutable builder via function composition ---

// Each "step" is a small function that returns a new config object
const withName   = (name)   => (c) => ({ ...c, name })
const withWhere  = (clause) => (c) => ({ ...c, where: clause })
const withLimit  = (n)      => (c) => ({ ...c, limit: n })
const withOrder  = (field)  => (c) => ({ ...c, orderBy: field })

// Compose left-to-right with a pipe helper
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x)

// The starting point — an empty query spec
const emptyQuery = { name: null, where: null, limit: null, orderBy: null }

// --- Build a query immutably ---
const query = pipe(
  withName('users'),
  withWhere('age > 21'),
  withLimit(10),
  withOrder('name'),
)(emptyQuery)

// query: { name: 'users', where: 'age > 21', limit: 10, orderBy: 'name' }

// --- A final "read" step that produces the result ---
const toSQL = ({ name, where, limit, orderBy }) => {
  let sql = \`SELECT * FROM \${name}\`
  if (where)   sql += \` WHERE \${where}\`
  if (orderBy) sql += \` ORDER BY \${orderBy}\`
  if (limit)   sql += \` LIMIT \${limit}\`
  return sql
}

toSQL(query) // "SELECT * FROM users WHERE age > 21 ORDER BY name LIMIT 10"`

export default function BuilderPattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={3}
        title="Builder"
        intro="Separate the construction of a complex object from its representation so the same construction process can create different representations."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Builder pattern solves the problem of constructing complex
          objects step by step without coupling the client to a specific
          final form. It isolates the construction logic so you can produce
          different representations from the same building process.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic OO, you create a mutable <code>Builder</code> object,
          call methods like <code>.withName()</code> or <code>.withWhere()</code>
          that return <code>this</code>, and finally call <code>.build()</code>.
          In functional programming, you <strong>build immutably by piping small
          transformer functions</strong> over a plain config object. Each step
          returns a new value — no mutable state, no builder object. A final
          function reads the accumulated config and produces the result.
        </p>

        <h2>Functional example</h2>
        <p>
          Below, each "with" helper is a curried function that takes a value
          and returns a <em>transformer</em>. The <code>pipe</code> utility
          threads an empty spec through each transformer in turn, producing a
          fully configured query object. Finally, <code>toSQL</code> reads the
          spec and emits the SQL string.
        </p>
        <CodeBlock code={builderCode} />

        <Callout tone="tip">
          In FP, the Builder pattern reduces to <strong>immutable function
          composition</strong>: chain small, pure transformers over a config
          object via <code>pipe</code> or <code>compose</code>, then run a
          single "read" function at the end. No mutable state, no fluent
          interfaces — just functions returning new values.
        </Callout>
      </div>
    </>
  )
}
