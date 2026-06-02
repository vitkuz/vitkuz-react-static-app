import { useState, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
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

/* ------------------------------------------------------------------ */
/*  Shared logic — same pure functions shown in the code example      */
/* ------------------------------------------------------------------ */

interface EditorConfig {
  theme: string
  fontSize: number
  lineNumbers: boolean
  minimap: boolean
}

const baseConfig: Readonly<EditorConfig> = Object.freeze({
  theme: 'light',
  fontSize: 14,
  lineNumbers: true,
  minimap: false,
})

function clone(base: Readonly<EditorConfig>, overrides: Partial<EditorConfig>): EditorConfig {
  return { ...base, ...overrides }
}

/* ------------------------------------------------------------------ */
/*  Interactive widget                                                 */
/* ------------------------------------------------------------------ */

function PrototypeWidget(): ReactNode {
  const [theme, setTheme] = useState<string>(baseConfig.theme)
  const [fontSize, setFontSize] = useState<number>(baseConfig.fontSize)
  const [lineNumbers, setLineNumbers] = useState<boolean>(baseConfig.lineNumbers)
  const [minimap, setMinimap] = useState<boolean>(baseConfig.minimap)

  const overrides: Partial<EditorConfig> = useMemo(
    () => ({
      ...(theme !== baseConfig.theme ? { theme } : {}),
      ...(fontSize !== baseConfig.fontSize ? { fontSize } : {}),
      ...(lineNumbers !== baseConfig.lineNumbers ? { lineNumbers } : {}),
      ...(minimap !== baseConfig.minimap ? { minimap } : {}),
    }),
    [theme, fontSize, lineNumbers, minimap],
  )

  const result: EditorConfig = useMemo(
    () => clone(baseConfig, overrides),
    [overrides],
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Base (immutable) */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Base (frozen)
          </p>
          <pre className="text-sm font-mono bg-slate-50 rounded-md border border-slate-200 p-3 text-slate-600 overflow-auto">
            {JSON.stringify(baseConfig, null, 2)}
          </pre>
        </div>

        {/* Cloned result */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
            Cloned result
          </p>
          <pre className="text-sm font-mono bg-blue-50 rounded-md border border-blue-200 p-3 text-blue-800 overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>

      {/* Override controls */}
      <div className="border-t border-slate-200 pt-3 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Overrides
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="proto-theme" className="text-sm font-medium text-slate-700">
              Theme:
            </label>
            <select
              id="proto-theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm"
            >
              <option value="light">light</option>
              <option value="dark">dark</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="proto-fontSize" className="text-sm font-medium text-slate-700">
              Font size:
            </label>
            <input
              id="proto-fontSize"
              type="number"
              min={8}
              max={32}
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="rounded-md border border-slate-300 px-2 py-1 text-sm font-mono w-20"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="proto-lineNumbers"
              type="checkbox"
              checked={lineNumbers}
              onChange={(e) => setLineNumbers(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="proto-lineNumbers" className="text-sm font-medium text-slate-700">
              Line numbers
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="proto-minimap"
              type="checkbox"
              checked={minimap}
              onChange={(e) => setMinimap(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="proto-minimap" className="text-sm font-medium text-slate-700">
              Minimap
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PrototypePattern(): ReactNode {
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

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={['Prototype', 'clone() / copy()', 'ConcretePrototype', 'Client']}
            fp={['baseConfig (frozen)', 'clone(base, overrides)', 'spread {…base, …overrides}', 'structuredClone (deep)']}
          />
        </Diagram>

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

        <Widget title="Try cloning with overrides">
          <PrototypeWidget />
        </Widget>

        <Diagram caption="Clone flow: frozen template → overrides → independent variant">
          <FlowDiagram steps={['baseConfig', 'clone(base, overrides)', 'newConfig']} />
        </Diagram>
      </div>
    </>
  )
}
