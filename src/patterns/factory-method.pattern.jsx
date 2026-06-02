import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
  slug: 'factory-method',
  title: 'Factory Method',
  navLabel: 'Factory Method',
  category: 'Creational',
  order: 1,
}

const factoryMethodCode = `// --- A factory is just a function ---

// Each "product" is a plain closure that returns an object
const makeMacButton = (label) => {
  let clicks = 0
  return {
    render: () => \`🍎 [macOS] \${label} (clicks: \${clicks})\`,
    click: () => { clicks++ },
    os: 'mac',
  }
}

const makeWinButton = (label) => {
  let clicks = 0
  return {
    render: () => \`⊞ [Windows] \${label} (clicks: \${clicks})\`,
    click: () => { clicks++ },
    os: 'win',
  }
}

const makeLinuxButton = (label) => {
  let clicks = 0
  return {
    render: () => \`🐧 [Linux] \${label} (clicks: \${clicks})\`,
    click: () => { clicks++ },
    os: 'linux',
  }
}

// --- The factory method selects the right creator ---

const buttonFactories = {
  mac: makeMacButton,
  win: makeWinButton,
  linux: makeLinuxButton,
}

const createButton = (os, label) => {
  const factory = buttonFactories[os]
  if (!factory) throw new Error(\`Unknown OS: \${os}\`)
  return factory(label)
}

// --- Usage ---

const btn = createButton('mac', 'Submit')
btn.render() // "🍎 [macOS] Submit (clicks: 0)"
btn.click()
btn.render() // "🍎 [macOS] Submit (clicks: 1)"

// Adding a new platform requires zero changes to the factory:
buttonFactories.chrome = (label) => ({
  render: () => \`🌐 [ChromeOS] \${label}\`,
  click: () => {},
  os: 'chrome',
})`

const curryFactoryCode = `// --- Curried factory: parameterise the variant upfront ---

const makeService =
  (env) =>
  (name) => {
    const baseUrls = {
      prod: 'https://api.example.com',
      staging: 'https://staging-api.example.com',
      dev: 'http://localhost:4000',
    }
    return {
      name,
      endpoint: (path) => \`\${baseUrls[env]}\${path}\`,
      log: (msg) => console.log(\`[\${name}] \${msg}\`),
    }
  }

// Configure once, create many
const fromProd = makeService('prod')
const fromDev = makeService('dev')

const userService = fromProd('users')
userService.endpoint('/login') // "https://api.example.com/login"

const searchService = fromDev('search')
searchService.endpoint('/query') // "http://localhost:4000/query"`

export default function FactoryMethodPattern() {
  return (
    <>
      <StepHeader
        order={1}
        title="Factory Method"
        intro="Define an interface for creating an object, but let the implementation decide which concrete object to instantiate. The Factory Method pattern defers instantiation logic away from the caller."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Factory Method pattern decouples object creation from the code
          that uses the object. Instead of hard-coding a{' '}
          <code>new ConcreteProduct()</code> call, the client asks a factory
          method (or function) to produce the right variant — allowing the
          system to swap implementations without touching client code.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic object-oriented design, you define an abstract{' '}
          <code>Creator</code> class whose subclasses override a{' '}
          <code>factoryMethod()</code> to return different concrete products.
          In functional programming,{' '}
          <strong>a factory is just a function that returns an object or
          closure</strong>. Replace subclassing with a lookup map of small
          factory functions, and replace the abstract creator with a
          higher-order function that picks the right one based on its
          arguments — no classes, no inheritance, no ceremony.
        </p>

        <h2>Functional example</h2>
        <p>
          Below, each UI-button variant is built by a small factory function.
          The <code>createButton</code> factory method selects the right
          creator from a <code>buttonFactories</code> map. Adding a new
          platform is a one-line map insertion — no subclassing required.
        </p>
        <CodeBlock code={factoryMethodCode} />

        <h2>Curried factory</h2>
        <p>
          When a factory needs upfront configuration (e.g. an environment
          name), currying lets you pre-bind that parameter and treat the
          partially-applied function as a specialised creator. The example
          below produces API services with the correct base URL baked in.
        </p>
        <CodeBlock code={curryFactoryCode} />

        <Callout tone="tip">
          In FP, the Factory Method pattern reduces to a{' '}
          <strong>function that returns an object or closure</strong>. Use a
          lookup map of small factory functions to replace subclassing, and
          lean on currying when the factory needs pre-configuration. The
          calling code never knows (or cares) which variant it received.
        </Callout>
      </div>
    </>
  )
}
