import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
  slug: 'abstract-factory',
  title: 'Abstract Factory',
  navLabel: 'Abstract Factory',
  category: 'Creational',
  order: 2,
}

const abstractFactoryCode = `// --- An abstract factory is a function returning a kit of factory functions ---

const themeKit = (theme) => ({
  // Each factory captures \`theme\` via closure so every product is consistent
  makeButton: (label) => ({
    type: 'button',
    label,
    theme,
    render: () => \`<button class="btn-\${theme}">\${label}</button>\`,
  }),
  makeCheckbox: (label) => ({
    type: 'checkbox',
    label,
    theme,
    render: () =>
      \`<label class="chk-\${theme}"><input type="checkbox"/> \${label}</label>\`,
  }),
})

// --- Select a concrete factory (kit) at runtime ---
const darkKit  = themeKit('dark')
const lightKit = themeKit('light')

const btn = darkKit.makeButton('Submit')
const chk = darkKit.makeCheckbox('I agree')

// btn.theme === 'dark'   // true
// chk.theme === 'dark'   // true

// --- The family is interchangeable ---
const lightBtn = lightKit.makeButton('Save')
// lightBtn.theme === 'light'   // true`

/* ------------------------------------------------------------------ */
/*  Shared logic — same pure functions shown in the code example      */
/* ------------------------------------------------------------------ */

type Theme = 'dark' | 'light'

interface Product {
  type: 'button' | 'checkbox'
  label: string
  theme: Theme
  render: () => string
}

interface Kit {
  makeButton: (label: string) => Product
  makeCheckbox: (label: string) => Product
}

const themeKit = (theme: Theme): Kit => ({
  makeButton: (label: string): Product => ({
    type: 'button',
    label,
    theme,
    render: () => `<button class="btn-${theme}">${label}</button>`,
  }),
  makeCheckbox: (label: string): Product => ({
    type: 'checkbox',
    label,
    theme,
    render: () =>
      `<label class="chk-${theme}"><input type="checkbox"/> ${label}</label>`,
  }),
})

const darkKit: Kit = themeKit('dark')
const lightKit: Kit = themeKit('light')
const kits: Record<Theme, Kit> = { dark: darkKit, light: lightKit }

function AbstractFactoryWidget(): ReactNode {
  const [theme, setTheme] = useState<Theme>('dark')
  const kit: Kit = kits[theme]!
  const btn = kit.makeButton('Submit')
  const chk = kit.makeCheckbox('I agree')

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label
          htmlFor="theme-select"
          className="text-sm font-medium text-slate-700"
        >
          Theme:
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <p className="mb-1 text-xs font-medium text-slate-400">
            Produced family
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono text-slate-500">makeButton:</span>
              <span className="font-mono text-slate-700">
                {btn.render()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono text-slate-500">makeCheckbox:</span>
              <span className="font-mono text-slate-700">
                {chk.render()}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Theme: <span className="font-mono text-slate-600">{btn.theme}</span>
          {' — '}both products are{' '}
          <span className="font-mono text-slate-600">{btn.theme}</span>
          -themed, guaranteed by the kit.
        </p>
      </div>
    </div>
  )
}

export default function AbstractFactoryPattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={2}
        title="Abstract Factory"
        intro="Provide an interface for creating families of related objects without specifying their concrete classes. The Abstract Factory pattern lets you swap entire product families at once."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Abstract Factory pattern solves the problem of ensuring that a set
          of related objects are created consistently. In a UI toolkit, for
          example, you want every button, checkbox, and input in a "dark" theme
          to be dark, and every one in a "light" theme to be light — never a mix.
          The factory guarantees that consistency.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic object-oriented design, you define an{' '}
          <code>AbstractFactory</code> interface with factory methods for each
          product type, then subclass it for each concrete variant (e.g.{' '}
          <code>DarkThemeFactory</code>, <code>LightThemeFactory</code>). In
          functional programming, an abstract factory is simply{' '}
          <strong>a function that returns a kit of factory functions</strong>.
          The variant is captured via closure instead of a class hierarchy —
          no interfaces, no subclasses.
        </p>

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={[
              'AbstractFactory «interface»',
              'DarkThemeFactory',
              'LightThemeFactory',
              'ButtonProduct',
              'CheckboxProduct',
            ]}
            fp={[
              'themeKit(theme)',
              'makeButton(label)',
              'makeCheckbox(label)',
              'button{ type, label, theme }',
              'checkbox{ type, label, theme }',
            ]}
          />
        </Diagram>

        <h2>Functional example</h2>
        <p>
          Below, <code>themeKit</code> is a higher-order function that accepts a{' '}
          <code>theme</code> string and returns an object with{' '}
          <code>makeButton</code> and <code>makeCheckbox</code> factory
          functions. Every factory in the kit shares the same theme via closure,
          so calling <code>themeKit('dark')</code> guarantees all products are
          dark-themed. Swapping families is as simple as calling{' '}
          <code>themeKit('light')</code>.
        </p>
        <CodeBlock code={abstractFactoryCode} />

        <Callout tone="tip">
          In FP, the Abstract Factory pattern reduces to a{' '}
          <strong>higher-order function that returns a kit of factory
          functions</strong>, all parameterized via closure. Pick the variant at
          the call site and let the closure handle the rest — no class
          hierarchy required.
        </Callout>

        <Widget title="Try the theme kits">
          <AbstractFactoryWidget />
        </Widget>

        <Diagram caption="Data flow through the Abstract Factory pattern">
          <FlowDiagram steps={['theme', 'themeKit', '{ makeButton, makeCheckbox }', 'products']} />
        </Diagram>
      </div>
    </>
  )
}
