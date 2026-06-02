import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

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
      </div>
    </>
  )
}
