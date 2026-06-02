import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
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

/* ------------------------------------------------------------------ */
/*  Shared logic — same pure functions shown in the code example      */
/* ------------------------------------------------------------------ */

type Shape = Circle | Square
interface Circle { type: 'circle'; r: number }
interface Square { type: 'square'; s: number }

interface ShapeVisitors<R> {
  circle: (c: Circle) => R
  square: (s: Square) => R
}

const visit = <R,>(visitors: ShapeVisitors<R>) =>
  (node: Shape): R => {
    switch (node.type) {
      case 'circle': return visitors.circle(node)
      case 'square': return visitors.square(node)
    }
  }

const circle: Circle = { type: 'circle', r: 3 }
const square: Square = { type: 'square', s: 4 }
const shapes: Shape[] = [circle, square]

const areaVisitors: ShapeVisitors<number> = {
  circle: ({ r }: Circle) => Math.PI * r * r,
  square: ({ s }: Square) => s * s,
}

const perimeterVisitors: ShapeVisitors<number> = {
  circle: ({ r }: Circle) => 2 * Math.PI * r,
  square: ({ s }: Square) => 4 * s,
}

const describeVisitors: ShapeVisitors<string> = {
  circle: ({ r }: Circle) => `Circle (radius ${r})`,
  square: ({ s }: Square) => `Square (side ${s})`,
}

const area = visit(areaVisitors)
const perimeter = visit(perimeterVisitors)
const describe = visit(describeVisitors)

function VisitorWidget(): ReactNode {
  const [visitorKey, setVisitorKey] = useState<string>('area')

  const resultFn = (shape: Shape): string => {
    switch (visitorKey) {
      case 'area': return area(shape).toFixed(2)
      case 'perimeter': return perimeter(shape).toFixed(2)
      case 'describe': return describe(shape)
      default: return ''
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label htmlFor="visitor-select" className="text-sm font-medium text-slate-700">
          Visitor:
        </label>
        <select
          id="visitor-select"
          value={visitorKey}
          onChange={(e) => setVisitorKey(e.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
        >
          <option value="area">Area</option>
          <option value="perimeter">Perimeter</option>
          <option value="describe">Describe</option>
        </select>
      </div>

      <div className="space-y-1">
        {shapes.map((shape) => (
          <div key={shape.type} className="flex justify-between text-sm text-slate-600">
            <span>{describe(shape)}</span>
            <span className="font-mono">{resultFn(shape)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function VisitorPattern(): ReactNode {
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

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={['Element «interface»', 'Visitor «interface»', 'ConcreteElement (Circle)', 'ConcreteElement (Square)', 'ConcreteVisitor (Area)']}
            fp={['tagged union Shape', 'visit(visitors)', 'areaVisitors', 'describeVisitors', 'perimeterVisitors']}
          />
        </Diagram>

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

        <Widget title="Try the visitors">
          <VisitorWidget />
        </Widget>

        <Diagram caption="Data flow through a visitor dispatch">
          <FlowDiagram steps={['shapes', 'visit(visitors)', 'result']} />
        </Diagram>
      </div>
    </>
  )
}
