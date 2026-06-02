import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
  slug: 'prototype',
  title: 'Prototype',
  navLabel: 'Prototype',
  category: 'Creational',
  order: 4,
}

const cloneCode = `// --- A prototype is just an immutable template ---
const baseConfig = Object.freeze({
  theme: 'light',
  fontSize: 14,
  lineNumbers: true,
  minimap: false,
})

// Derive variants by spreading the template with overrides
const clone = (base, overrides) => ({ ...base, ...overrides })

const editorConfig = clone(baseConfig, {
  theme: 'dark',
  fontSize: 16,
})

const viewerConfig = clone(baseConfig, {
  minimap: true,
  lineNumbers: false,
})`

const nestedCode = `// --- Deep cloning with structuredClone ---
import structuredClone from 'structuredClone' // or global in Node 17+

const dashboardTemplate = Object.freeze({
  layout: { rows: 2, cols: 3 },
  widgets: ['chart', 'table', 'summary'],
  refreshInterval: 30,
})

// A factory that clones a deep template, then applies overrides
const buildDashboard = (overrides) => {
  const copy = structuredClone(dashboardTemplate)
  return Object.assign(copy, overrides)
}

const analyticsDashboard = buildDashboard({
  layout: { rows: 3, cols: 4 },
  widgets: ['chart', 'table', 'summary', 'funnel'],
})

const opsDashboard = buildDashboard({
  refreshInterval: 10,
})`

export default function PrototypePattern() {
  return (
    <>
      <StepHeader
        order={4}
        title="Prototype"
        intro="Create new objects by copying an existing prototype, then customise the copy. The Prototype pattern avoids the cost of repeated initialisation and lets you spawn pre-configured variants."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Prototype pattern creates new objects by cloning an existing
          instance — the prototype — rather than constructing from scratch.
          It shines when object creation is expensive, when you need many
          slight variations of a base object, or when you want to avoid
          coupling clients to concrete classes.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic object-oriented design, you define a{' '}
          <code>clone()</code> or <code>copy()</code> method on every class
          that participates in the prototype hierarchy — often requiring deep
          vs. shallow copy logic and careful constructor wiring. In functional
          programming,{' '}
          <strong>cloning is just copying an immutable template with
          overrides</strong>. Use the spread operator for shallow merges and{' '}
          <code>structuredClone</code> for deep copies. No classes, no{' '}
          <code>clone()</code> methods — just plain functions and immutable
          data.
        </p>

        <h2>Functional example</h2>
        <p>
          Freeze a base configuration object to make it immutable. Then pipe
          it through a <code>clone</code> helper that spreads the template
          and layers overrides on top. Every variant stays independent —
          no mutation, no shared references.
        </p>
        <CodeBlock code={cloneCode} />

        <h2>Deep cloning with structuredClone</h2>
        <p>
          When the prototype contains nested objects or arrays, spread alone
          will share nested references. Use <code>structuredClone</code> for a
          full deep copy, then apply overrides with{' '}
          <code>Object.assign</code> — still entirely class-free.
        </p>
        <CodeBlock code={nestedCode} />

        <Callout tone="tip">
          In FP, the Prototype pattern reduces to{' '}
          <strong>deriving variants from immutable templates</strong>. Spread,
          structuredClone, and <code>Object.assign</code> replace the entire
          <code>clone()</code> / prototype-registry machinery — no interfaces,
          no class hierarchies, just copying and composing plain objects.
        </Callout>
      </div>
    </>
  )
}
