import { useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
  slug: 'composite',
  title: 'Composite',
  navLabel: 'Composite',
  category: 'Structural',
  order: 8,
}

const totalSizeCode = `// --- A composite is just recursive data ---

// Every node is either a leaf (file) or a composite (directory)
const fs = {
  type: 'dir',
  name: 'project',
  children: [
    { type: 'file', name: 'index.html', size: 1200 },
    { type: 'file', name: 'README.md', size: 3400 },
    {
      type: 'dir',
      name: 'src',
      children: [
        { type: 'file', name: 'main.js', size: 5600 },
        { type: 'file', name: 'utils.js', size: 2100 },
        {
          type: 'dir',
          name: 'lib',
          children: [
            { type: 'file', name: 'fp.js', size: 4800 },
          ],
        },
      ],
    },
  ],
}

// --- One recursive function treats leaves and branches uniformly ---

const totalSize = (node) => {
  if (node.type === 'file') return node.size    // leaf — base case
  return node.children.reduce((sum, child) => sum + totalSize(child), 0) // composite — recurse
}

totalSize(fs) // 17100`

const findCode = `// A higher-order composite: find a node by name
const findByName = (node, name) => {
  if (node.name === name) return node
  if (node.children) {
    for (const child of node.children) {
      const found = findByName(child, name)
      if (found) return found
    }
  }
  return null
}

findByName(fs, 'fp.js')
// => { type: 'file', name: 'fp.js', size: 4800 }

// A general-purpose generic tree walker
const walk = (node, visit) => {
  visit(node)
  if (node.children) node.children.forEach((child) => walk(child, visit))
}

walk(fs, (n) => console.log(n.name))
// project, index.html, README.md, src, main.js, utils.js, lib, fp.js`

/* ------------------------------------------------------------------ */
/*  Shared logic — lifted from the examples above                     */
/* ------------------------------------------------------------------ */

type FSNodeType = 'file' | 'dir'

interface FSNode {
  type: FSNodeType
  name: string
  size?: number
  children?: FSNode[]
}

const totalSize = (node: FSNode): number => {
  if (node.type === 'file') return node.size ?? 0
  return (node.children ?? []).reduce((sum, child) => sum + totalSize(child), 0)
}

const fs: FSNode = {
  type: 'dir',
  name: 'project',
  children: [
    { type: 'file', name: 'index.html', size: 1200 },
    { type: 'file', name: 'README.md', size: 3400 },
    {
      type: 'dir',
      name: 'src',
      children: [
        { type: 'file', name: 'main.js', size: 5600 },
        { type: 'file', name: 'utils.js', size: 2100 },
        {
          type: 'dir',
          name: 'lib',
          children: [
            { type: 'file', name: 'fp.js', size: 4800 },
          ],
        },
      ],
    },
  ],
}

/* ------------------------------------------------------------------ */
/*  CompositeWidget — interactive file-tree demo                       */
/* ------------------------------------------------------------------ */

function CompositeWidget(): ReactNode {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['project', 'src']))

  const toggle = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const overallTotal = useMemo(() => totalSize(fs), [])

  const renderNode = (node: FSNode, depth: number): ReactNode => {
    const isDir = node.type === 'dir'
    const isOpen = expanded.has(node.name)
    const indent = depth * 16

    return (
      <div key={node.name}>
        <button
          onClick={() => isDir && toggle(node.name)}
          className="flex items-center gap-1.5 py-0.5 text-sm w-full text-left hover:bg-slate-50 rounded"
          style={{ paddingLeft: indent + 4 }}
        >
          <span className="w-4 text-center text-slate-400 text-xs">
            {isDir ? (isOpen ? '\u25BC' : '\u25B6') : '\u2022'}
          </span>
          <span className={isDir ? 'font-medium text-slate-800' : 'text-slate-600'}>
            {node.name}
            {isDir && '/'}
          </span>
          {!isDir && node.size != null && (
            <span className="ml-auto font-mono text-xs text-slate-400 tabular-nums">
              {node.size.toLocaleString()} b
            </span>
          )}
          {isDir && (
            <span className="ml-auto font-mono text-xs text-slate-400 tabular-nums">
              {totalSize(node).toLocaleString()} b
            </span>
          )}
        </button>
        {isDir && isOpen && node.children && (
          <div>{node.children.map((child) => renderNode(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
        {fs.children?.map((child) => renderNode(child, 0))}
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-sm">
        <span className="font-medium text-slate-700">Total size</span>
        <span className="font-mono text-slate-900 tabular-nums">
          {overallTotal.toLocaleString()} b
        </span>
      </div>
    </div>
  )
}

export default function CompositePattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={8}
        title="Composite"
        intro="Compose objects into tree structures to represent part-whole hierarchies. The Composite pattern lets clients treat individual objects and compositions uniformly."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Composite pattern lets you build tree-like object structures and
          work with them as if every element were the same kind of thing. A
          single operation — like "calculate total size" — is dispatched to
          each node, and composite nodes delegate to their children
          recursively.
        </p>

        <h2>OO → functional</h2>
        <p>
          In classic OO, you define a <code>Component</code> interface with
          methods like <code>size()</code>, then implement <code>Leaf</code>{' '}
          and <code>Composite</code> subclasses that each satisfy the
          interface in their own way. In functional programming,{' '}
          <strong>a composite is just recursive data</strong> — a plain object
          (or array) that may contain more objects of the same shape. Instead of
          polymorphic methods on classes, you write a single recursive function
          that destructures the node and dispatches on a discriminator field
          (like <code>type</code>).
        </p>

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={['Component «interface»', 'Leaf', 'Composite', 'Leaf.size()', 'Composite.size()']}
            fp={['FSNode (discriminated union)', 'file leaf', 'dir composite', 'totalSize(node)', 'reduce + recurse']}
          />
        </Diagram>

        <h2>Functional example</h2>
        <p>
          The structure below models a file system where every node is either a{' '}
          <code>file</code> (leaf, carrying a <code>size</code>) or a{' '}
          <code>dir</code> (composite, carrying <code>children</code>). A single{' '}
          <code>totalSize</code> function handles both cases uniformly by
          checking <code>node.type</code>.
        </p>
        <CodeBlock code={totalSizeCode} />

        <p>
          Because the entire tree uses the same plain-object shape, you can
          layer higher-order operations on top — like a generic walker or a
          search function — without ever introducing a class or an interface.
        </p>
        <CodeBlock code={findCode} />

        <Callout tone="tip">
          In FP, the Composite pattern is <strong>recursive data + recursive
          functions</strong>. A single function handles leaves and composites
          by pattern-matching on a discriminator field. No polymorphism,
          no visitor double-dispatch — just destructuring and recursion.
        </Callout>

        <Widget title="Explore the file tree">
          <CompositeWidget />
        </Widget>

        <Diagram caption="Data flows from tree root through recursive descent to a single total">
          <FlowDiagram steps={['fs (tree)', 'totalSize(node)', 'totalSize(children)', 'sum']} />
        </Diagram>
      </div>
    </>
  )
}
