import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
  slug: 'visitor',
  title: 'Visitor',
  navLabel: 'Visitor',
  category: 'Behavioral',
  order: 22,
}

const visitorCode = `// --- A visitor dispatches on a tagged union ---

// Data: each shape carries a "type" tag
const circle = { type: 'circle', r: 3 }
const square = { type: 'square', s: 4 }

// visit receives a map of visitors keyed by type
const visit = (visitors) => (node) =>
  visitors[node.type](node)

// --- Concrete visitors are plain functions ---

const areaVisitors = {
  circle: ({ r }) => Math.PI * r * r,
  square: ({ s }) => s * s,
}

const describeVisitors = {
  circle: ({ r }) => \`Circle (radius \${r})\`,
  square: ({ s }) => \`Square (side \${s})\`,
}

// --- Put them to work ---
const area     = visit(areaVisitors)
const describe = visit(describeVisitors)

area(circle)       // ~28.27
area(square)       // 16
describe(circle)   // "Circle (radius 3)"
describe(square)   // "Square (side 4)"

// Adding a new operation (e.g. perimeter) requires
// zero changes to the existing visitors or shapes.
`

export default function VisitorPattern() {
  return (
    <>
      <StepHeader
        order={22}
        title="Visitor"
        intro="Represent an operation to be performed on elements of an object structure. The Visitor lets you define a new operation without changing the classes of the elements on which it operates."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Visitor pattern decouples algorithms from the objects they operate
          on. In classic OO, you add a new operation by creating a visitor that
          knows how to handle each concrete element type, without touching the
          element classes themselves.
        </p>

        <h2>OO → functional</h2>
        <p>
          Visiting is dispatch on a <strong>tagged union</strong>: a map of
          functions keyed by the node's <code>type</code>, separating
          operations from the data they run over. Instead of a{' '}
          <code>Visitor</code> interface with <code>visitCircle</code>/{' '}
          <code>visitSquare</code> methods and an <code>accept</code> method on
          each element class, you simply pass a plain object whose keys match
          the tags. The "accept" step reduces to a single higher-order
          function that looks up the handler and calls it.
        </p>

        <h2>Functional example</h2>
        <p>
          Below, <code>visit</code> is a curried function that takes a{' '}
          <code>visitors</code> map and returns a function ready to accept any
          tagged node. Two concrete visitors — <code>areaVisitors</code> and{' '}
          <code>describeVisitors</code> — are plain objects from tag to
          handler, with destructuring on each node's fields. Adding a third
          operation means adding another visitors map; the shapes and existing
          visitors never change.
        </p>
        <CodeBlock code={visitorCode} />

        <Callout tone="tip">
          In FP, the Visitor pattern boils down to <strong>dispatching on a
          tagged union</strong>. Keep your data as plain objects with a{' '}
          <code>type</code> tag, and operations become maps of handlers{' '}
          keyed by that tag. New operations? Add another map. New variants?
          Add another handler to each map — the compiler (or your tests) will
          tell you where you missed one.
        </Callout>
      </div>
    </>
  )
}
