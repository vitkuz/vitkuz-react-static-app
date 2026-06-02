import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
  slug: 'template-method',
  title: 'Template Method',
  navLabel: 'Template Method',
  category: 'Behavioral',
  order: 21,
}

const templateMethodCode = `// --- The skeleton is a higher-order function ---

const makeReport = ({ fetch, transform, render }) =>
  async (query) => {
    const raw = await fetch(query)     // Step 1 — fixed
    const data = transform(raw)        // Step 2 — fixed
    return render(data)                // Step 3 — fixed
  }

// --- Step functions are plain functions ---

const fetchFromAPI = async (q) =>
  fetch(\`https://api.example.com/v1/\${q}\`).then(r => r.json())

const capFirst = (items) =>
  items.map(s => s.charAt(0).toUpperCase() + s.slice(1))

const toCSV = (rows) =>
  rows.map(r => r.join(',')).join('\\n')

const toJSON = (data) =>
  JSON.stringify(data, null, 2)

// --- Compose the template with concrete steps ---

const csvReport = makeReport({
  fetch: fetchFromAPI,
  transform: capFirst,
  render: toCSV,
})

const jsonReport = makeReport({
  fetch: fetchFromAPI,
  transform: capFirst,
  render: toJSON,
})

// Same algorithm shape — only the rendering step differs
csvReport('users')
jsonReport('users')`

const curryExampleCode = `// --- Using currying for a fixed skeleton ---

const bakeRecipe = (prepare, cook, serve) => (ingredients) => {
  const prepped = prepare(ingredients)
  const cooked = cook(prepped)
  return serve(cooked)
}

// --- Partially apply to create specialized variants ---

const stirFry = (items) =>
  items.map(i => i + ' (chopped)').join(', ')

const wokCook = (prepped) => \`[\${prepped}] wok-fried 3 min\`

const plate = (cooked) => \`🍽️  \${cooked}\`

const veggieStirFry = bakeRecipe(stirFry, wokCook, plate)

veggieStirFry(['bell pepper', 'broccoli', 'carrot'])
// 🍽️  [bell pepper (chopped), broccoli (chopped), carrot (chopped)] wok-fried 3 min`

/* ------------------------------------------------------------------ */
/*  Lifted functions — the same pure logic shown in the code example  */
/* ------------------------------------------------------------------ */

type FetchFn = (query: string) => Promise<string[]>
type TransformFn = (items: string[]) => string[]
type RenderFn = (data: string[]) => string

interface ReportSteps {
  fetch: FetchFn
  transform: TransformFn
  render: RenderFn
}

const makeReport =
  ({ fetch, transform, render }: ReportSteps) =>
  async (query: string): Promise<string> => {
    const raw = await fetch(query)
    const data = transform(raw)
    return render(data)
  }

// --- Step implementations (mock data sources for the widget) ---

const fetchMockUsers: FetchFn = async (_query) => ['alice', 'bob', 'charlie']

const fetchMockProducts: FetchFn = async (_query) => ['widget', 'gadget', 'doohickey']

const capFirst: TransformFn = (items) =>
  items.map((s) => s.charAt(0).toUpperCase() + s.slice(1))

const lowerCase: TransformFn = (items) =>
  items.map((s) => s.toLowerCase())

const upperCase: TransformFn = (items) =>
  items.map((s) => s.toUpperCase())

const toCSV: RenderFn = (rows) => rows.join(',')

const toJSON: RenderFn = (data) => JSON.stringify(data, null, 2)

const toLines: RenderFn = (data) =>
  data.map((r, i) => `${i + 1}. ${r}`).join('\n')

/* ------------------------------------------------------------------ */
/*  Interactive widget                                                  */
/* ------------------------------------------------------------------ */

const sources: Record<string, FetchFn> = {
  users: fetchMockUsers,
  products: fetchMockProducts,
}

const transforms: Record<string, TransformFn> = {
  capitalize: capFirst,
  lowercase: lowerCase,
  uppercase: upperCase,
}

const renders: Record<string, RenderFn> = {
  json: toJSON,
  csv: toCSV,
  lines: toLines,
}

function TemplateMethodWidget(): ReactNode {
  const [source, setSource] = useState<string>('users')
  const [transform, setTransform] = useState<string>('capitalize')
  const [render, setRender] = useState<string>('json')
  const [output, setOutput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleRun = async () => {
    setLoading(true)
    const report = makeReport({
      fetch: sources[source]!,
      transform: transforms[transform]!,
      render: renders[render]!,
    })
    const result = await report(source)
    setOutput(result)
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="tm-source"
          className="text-sm font-medium text-slate-700"
        >
          Source:
        </label>
        <select
          id="tm-source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
        >
          <option value="users">Users</option>
          <option value="products">Products</option>
        </select>

        <label
          htmlFor="tm-transform"
          className="text-sm font-medium text-slate-700"
        >
          Transform:
        </label>
        <select
          id="tm-transform"
          value={transform}
          onChange={(e) => setTransform(e.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
        >
          <option value="capitalize">Capitalize</option>
          <option value="lowercase">Lowercase</option>
          <option value="uppercase">Uppercase</option>
        </select>

        <label
          htmlFor="tm-render"
          className="text-sm font-medium text-slate-700"
        >
          Render:
        </label>
        <select
          id="tm-render"
          value={render}
          onChange={(e) => setRender(e.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
        >
          <option value="json">JSON</option>
          <option value="csv">CSV</option>
          <option value="lines">Numbered lines</option>
        </select>

        <button
          onClick={handleRun}
          disabled={loading}
          className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100 disabled:opacity-50"
        >
          {loading ? 'Running…' : 'Run'}
        </button>
      </div>

      {output && (
        <pre className="overflow-x-auto rounded-md bg-slate-50 p-3 font-mono text-sm text-slate-800">
          {output}
        </pre>
      )}
    </div>
  )
}

export default function TemplateMethodPattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={21}
        title="Template Method"
        intro="Define the skeleton of an algorithm in a function, deferring some steps to callers. The Template Method pattern lets sub-operations vary without changing the algorithm's structure."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Template Method pattern defines the invariant parts of an
          algorithm once and lets callers supply the variable pieces. In
          classic OO, an abstract base class holds the skeleton and delegates
          to overridable subclass methods.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In object-oriented design, you create an abstract base class with a
          template method that calls abstract "hook" methods, then subclass to
          fill in the hooks. In functional programming,{' '}
          <strong>the skeleton becomes a higher-order function</strong> that
          fixes the algorithm's sequence and takes the varying steps as
          injected functions — no abstract base class, no inheritance, no{' '}
          <code>class</code> keyword.
        </p>

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={['AbstractReport', 'fetch() «hook»', 'transform() «hook»', 'render() «hook»', 'CSVReport', 'JSONReport']}
            fp={['makeReport({...})', 'fetchFromAPI', 'capFirst', 'toCSV', 'toJSON', 'csvReport / jsonReport']}
          />
        </Diagram>

        <h2>Functional example</h2>
        <p>
          Below, <code>makeReport</code> encodes the invariant three-step
          algorithm (<em>fetch → transform → render</em>) and accepts the step
          implementations as a plain object of functions. You compose a
          concrete variant by plugging in different functions for each step.
        </p>
        <CodeBlock code={templateMethodCode} />

        <Widget title="Try the template method">
          <TemplateMethodWidget />
        </Widget>

        <h2>Curried skeleton</h2>
        <p>
          For simpler cases where all steps are mandatory, you can pass them
          as positional arguments and curry the skeleton so each specialization
          is a partially-applied call.
        </p>
        <CodeBlock code={curryExampleCode} />

        <Callout tone="tip">
          In FP, the Template Method pattern is a{' '}
          <strong>higher-order function that captures the algorithm's
          structure</strong>. Inject the variable steps as function
          arguments, use partial application to fix recurring choices, and
          you get the same power as inheritance — without a single class.
        </Callout>

        <Diagram caption="Three-step pipeline: fetch → transform → render">
          <FlowDiagram
            steps={['query', 'fetch', 'transform', 'render', 'result']}
          />
        </Diagram>
      </div>
    </>
  )
}
