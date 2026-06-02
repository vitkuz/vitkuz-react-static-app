import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
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

export default function TemplateMethodPattern() {
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

        <h2>Functional example</h2>
        <p>
          Below, <code>makeReport</code> encodes the invariant three-step
          algorithm (<em>fetch → transform → render</em>) and accepts the step
          implementations as a plain object of functions. You compose a
          concrete variant by plugging in different functions for each step.
        </p>
        <CodeBlock code={templateMethodCode} />

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
      </div>
    </>
  )
}
