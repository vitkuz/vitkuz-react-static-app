import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { Diagram, CompareDiagram, FlowDiagram } from '../components/Diagram'

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

/* ------------------------------------------------------------------ */
/*  Shared logic — same pure functions shown in the code example       */
/* ------------------------------------------------------------------ */

interface Device {
  isOn(): boolean
  setPower(val: boolean): void
  getVolume(): number
  setVolume(val: number): void
}

interface Remote {
  togglePower(): void
  volumeUp(): void
  volumeDown(): void
}

interface AdvancedRemote extends Remote {
  mute(): void
}

const makeRemote = (device: Device): Remote => ({
  togglePower: () => device.setPower(!device.isOn()),
  volumeUp: () => device.setVolume(device.getVolume() + 1),
  volumeDown: () => device.setVolume(device.getVolume() - 1),
})

const makeAdvancedRemote = (device: Device): AdvancedRemote => ({
  ...makeRemote(device),
  mute: () => device.setVolume(0),
})

/* ------------------------------------------------------------------ */
/*  Bridge Widget                                                      */
/* ------------------------------------------------------------------ */

function BridgeWidget(): ReactNode {
  const [deviceType, setDeviceType] = useState<'tv' | 'radio'>('tv')
  const [remoteType, setRemoteType] = useState<'basic' | 'advanced'>('basic')
  const [log, setLog] = useState<string[]>([])

  // Mutable device state so the Device contract works synchronously
  const deviceRef = useRef<{ on: boolean; volume: number }>({
    on: false,
    volume: 10,
  })
  const [, setTick] = useState(0)
  const rerender = () => setTick((t) => t + 1)

  // Reset device state when implementation type changes
  useEffect(() => {
    deviceRef.current = {
      on: false,
      volume: deviceType === 'tv' ? 10 : 5,
    }
    setLog([])
    rerender()
  }, [deviceType])

  const maxVolume = deviceType === 'radio' ? 20 : 100

  const device: Device = {
    isOn: () => deviceRef.current.on,
    setPower: (val) => {
      deviceRef.current.on = val
    },
    getVolume: () => deviceRef.current.volume,
    setVolume: (val) => {
      deviceRef.current.volume = Math.max(0, Math.min(val, maxVolume))
    },
  }

  const remote: Remote =
    remoteType === 'advanced' ? makeAdvancedRemote(device) : makeRemote(device)
  const isAdvanced = remoteType === 'advanced'

  function act(fn: () => void, label: string) {
    fn()
    setLog((prev) => [...prev, label])
    rerender()
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="bridge-device-select"
            className="text-sm font-medium text-slate-700"
          >
            Device:
          </label>
          <select
            id="bridge-device-select"
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value as 'tv' | 'radio')}
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            <option value="tv">TV</option>
            <option value="radio">Radio</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="bridge-remote-select"
            className="text-sm font-medium text-slate-700"
          >
            Remote:
          </label>
          <select
            id="bridge-remote-select"
            value={remoteType}
            onChange={(e) =>
              setRemoteType(e.target.value as 'basic' | 'advanced')
            }
            className="rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            <option value="basic">Basic</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Device state indicator */}
      <div className="flex items-center gap-4 text-sm text-slate-600">
        <span>
          Power:{' '}
          <span className="font-mono font-semibold text-slate-900">
            {deviceRef.current.on ? 'ON' : 'OFF'}
          </span>
        </span>
        <span>
          Volume:{' '}
          <span className="font-mono font-semibold text-slate-900">
            {deviceRef.current.volume}
          </span>
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() =>
            act(
              () => remote.togglePower(),
              deviceRef.current.on ? 'Power OFF' : 'Power ON',
            )
          }
          className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
        >
          Toggle Power
        </button>
        <button
          onClick={() =>
            act(
              () => remote.volumeUp(),
              `Volume Up → ${Math.min(deviceRef.current.volume + 1, maxVolume)}`,
            )
          }
          className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
        >
          Volume Up
        </button>
        <button
          onClick={() =>
            act(
              () => remote.volumeDown(),
              `Volume Down → ${Math.max(deviceRef.current.volume - 1, 0)}`,
            )
          }
          className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
        >
          Volume Down
        </button>
        {isAdvanced && (
          <button
            onClick={() => act(() => (remote as AdvancedRemote).mute(), 'Muted')}
            className="rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100"
          >
            Mute
          </button>
        )}
      </div>

      {/* Action log */}
      {log.length > 0 && (
        <div className="space-y-1 border-t border-slate-200 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Action log
          </p>
          <div className="max-h-40 space-y-0.5 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            {log.map((entry, i) => (
              <div key={i} className="font-mono text-sm text-slate-700">
                {entry}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Pattern page                                                       */
/* ------------------------------------------------------------------ */

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

        <Diagram title="Architecture Comparison">
          <CompareDiagram
            oo={[
              'Abstraction',
              'RefinedAbstraction',
              'Implementor «interface»',
              'ConcreteImplementorA',
              'ConcreteImplementorB',
            ]}
            fp={[
              'makeRemote(device)',
              'makeAdvancedRemote(device)',
              'Device contract',
              'tv device',
              'radio device',
            ]}
          />
        </Diagram>

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
          Both axes can vary independently by swapping what you pass in — no
          parallel class hierarchies required.
        </Callout>

        <Widget title="Bridge a remote to any device">
          <BridgeWidget />
        </Widget>

        <Diagram caption="Data flow: device injected into abstraction, producing a composed remote API">
          <FlowDiagram
            steps={[
              'device (tv | radio)',
              'makeRemote',
              'togglePower() / volumeUp()',
            ]}
          />
        </Diagram>
      </div>
    </>
  )
}
