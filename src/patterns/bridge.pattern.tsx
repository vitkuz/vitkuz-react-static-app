import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta: PatternMeta = {
  slug: 'bridge',
  title: 'Bridge',
  navLabel: 'Bridge',
  category: 'Structural',
  order: 7,
}

const bridgeCode = `// --- The implementation is an object of functions ---
// Any device that provides these functions works with the remote

const makeRemote = (device) => ({
  togglePower: () => device.setPower(!device.isOn()),
  volumeUp:   () => device.setVolume(device.getVolume() + 1),
  volumeDown: () => device.setVolume(device.getVolume() - 1),
})

// --- Concrete implementations are plain objects of functions ---

const tv = (() => {
  let on = false
  let volume = 10
  return {
    isOn:      () => on,
    setPower:  (val) => { on = val },
    getVolume: () => volume,
    setVolume: (val) => { volume = Math.max(0, val) },
  }
})()

const radio = (() => {
  let on = false
  let volume = 5
  return {
    isOn:      () => on,
    setPower:  (val) => { on = val },
    getVolume: () => volume,
    setVolume: (val) => { volume = Math.max(0, Math.min(20, val)) },
  }
})()

// --- The same abstraction works with any implementation ---

const tvRemote = makeRemote(tv)
const radioRemote = makeRemote(radio)

tvRemote.togglePower()     // TV turns on
radioRemote.togglePower()  // Radio turns on
tvRemote.volumeUp()        // TV volume → 11
radioRemote.volumeUp()     // Radio volume → 6`

export default function BridgePattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={7}
        title="Bridge"
        intro="Decouple an abstraction from its implementation so that both can evolve independently — without the combinatorial explosion of parallel class hierarchies."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Bridge pattern prevents a permanent binding between an abstraction
          and its implementation. Instead of creating a Cartesian product of
          subclasses (e.g. <code>TVBasicRemote</code>,{' '}
          <code>TVAdvancedRemote</code>, <code>RadioBasicRemote</code>, …), you
          split the two dimensions into separate, loosely coupled pieces that
          can vary independently.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic object-oriented design, you define an{' '}
          <code>Abstraction</code> class that holds a reference to an{' '}
          <code>Implementation</code> interface, then subclass both sides
          separately. In functional programming, you replace the{' '}
          <strong>Implementation interface with a contract of functions</strong>{' '}
          and inject it directly into the abstraction factory. The abstraction
          becomes a higher-order function that receives an implementation object
          of functions and returns a composed API — no classes, no inheritance,
          just closures.
        </p>

        <h2>Functional example</h2>
        <p>
          Below, <code>makeRemote</code> is the abstraction layer. It accepts
          any device that exposes <code>isOn</code>, <code>setPower</code>,{' '}
          <code>getVolume</code>, and <code>setVolume</code> as functions. You
          get new device support by supplying a different object of functions —
          no subclass needed on either side.
        </p>
        <CodeBlock code={bridgeCode} />

        <Callout tone="tip">
          In FP, the Bridge pattern collapses to{' '}
          <strong>dependency injection via closures</strong>: the abstraction
          factory receives its implementation as an argument and closes over it.
          Both axis can vary independently by swapping what you pass in — no
          parallel class hierarchies required.
        </Callout>
      </div>
    </>
  )
}
