import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
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

export default function AbstractFactoryPattern() {
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
      </div>
    </>
  )
}
