import { useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

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

/* ------------------------------------------------------------------ */
/*  Shared types & pure functions — the same logic as the example      */
/* ------------------------------------------------------------------ */

interface QuerySpec {
  name: string | null
  where: string | null
  limit: number | null
  orderBy: string | null
}

type Transformer = (c: QuerySpec) => QuerySpec

const withName = (name: string): Transformer => (c) => ({ ...c, name })
const withWhere = (clause: string): Transformer => (c) => ({ ...c, where: clause })
const withLimit = (n: number): Transformer => (c) => ({ ...c, limit: n })
const withOrder = (field: string): Transformer => (c) => ({ ...c, orderBy: field })

const pipe = (...fns: Transformer[]) =>
  (x: QuerySpec): QuerySpec =>
    fns.reduce((v, f) => f(v), x)

const emptyQuery: QuerySpec = {
  name: null,
  where: null,
  limit: null,
  orderBy: null,
}

const toSQL = ({ name, where, limit, orderBy }: QuerySpec): string => {
  let sql = `SELECT * FROM ${name}`
  if (where) sql += ` WHERE ${where}`
  if (orderBy) sql += ` ORDER BY ${orderBy}`
  if (limit) sql += ` LIMIT ${limit}`
  return sql
}

function BuilderWidget(): ReactNode {
  const [name, setName] = useState<string>('users')
  const [where, setWhere] = useState<string>('age > 21')
  const [limit, setLimit] = useState<string>('10')
  const [orderBy, setOrderBy] = useState<string>('name')

  const sql = useMemo<string>(() => {
    const fns: Transformer[] = []
    if (name) fns.push(withName(name))
    if (where) fns.push(withWhere(where))
    if (limit) {
      const n = Number(limit)
      if (!Number.isNaN(n)) fns.push(withLimit(n))
    }
    if (orderBy) fns.push(withOrder(orderBy))
    if (fns.length === 0) return '(no table selected)'
    const query = pipe(...fns)(emptyQuery)
    return toSQL(query)
  }, [name, where, limit, orderBy])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="bld-name"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Table name
          </label>
          <input
            id="bld-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="bld-where"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            WHERE clause
          </label>
          <input
            id="bld-where"
            type="text"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="bld-limit"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            LIMIT
          </label>
          <input
            id="bld-limit"
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="bld-order"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            ORDER BY
          </label>
          <input
            id="bld-order"
            type="text"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          />
        </div>
      </div>
      <div className="border-t border-slate-200 pt-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Generated SQL
        </p>
        <pre className="overflow-x-auto rounded-md bg-slate-900 px-4 py-3 font-mono text-sm text-emerald-400">
          {sql}
        </pre>
      </div>
    </div>
  )
}

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

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={['Builder', 'ConcreteBuilder', 'Director', 'Product']}
            fp={['withName / withWhere / …', 'pipe()', 'emptyQuery', 'toSQL()']}
          />
        </Diagram>

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

        <Widget title="Build a query step by step">
          <BuilderWidget />
        </Widget>

        <Diagram caption="Data flow through the immutable builder pipeline">
          <FlowDiagram
            steps={[
              'emptyQuery',
              'pipe(withName, withWhere, …)',
              'query spec',
              'toSQL()',
            ]}
          />
        </Diagram>
      </div>
    </>
  )
}
