import { useState } from 'react'
import type { ReactNode } from 'react'
import type { PatternMeta } from '../shared/pattern.types'
import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'
import Widget from '../components/Widget'
import { CompareDiagram, FlowDiagram } from '../components/Diagram'

export const meta: PatternMeta = {
  slug: 'flyweight',
  title: 'Flyweight',
  navLabel: 'Flyweight',
  category: 'Structural',
  order: 11,
}

/* ------------------------------------------------------------------ */
/*  Shared logic — same pure functions shown in the code example      */
/* ------------------------------------------------------------------ */

interface Glyph {
  readonly char: string
  readonly width: number
  readonly height: number
  readonly bitmap: string
}

const glyphCache = new Map<string, Glyph>()

const getGlyph = (char: string): Glyph => {
  if (glyphCache.has(char)) return glyphCache.get(char)!

  const glyph: Glyph = Object.freeze({
    char,
    width: char === ' ' ? 6 : 12,
    height: 18,
    bitmap: `bitmap-of-${char}`,
  }) as Glyph
  glyphCache.set(char, glyph)
  return glyph
}

const renderGlyph =
  (glyph: Glyph) =>
  (x: number, y: number, color: string): string =>
    `glyph "${glyph.char}" at (${x}, ${y}) in ${color}`

type GlyphStats = { total: number; unique: number; hits: number }

function computeStats(chars: string[]): GlyphStats {
  const total = chars.length
  const before = glyphCache.size
  chars.forEach((c) => getGlyph(c))
  const after = glyphCache.size
  const unique = after
  const hits = total - (after - before)
  return { total, unique, hits }
}

const flyweightCode = `// --- Intrinsic state: shared, immutable, cached ---

// Memoized factory — each character literal gets ONE frozen object
const glyphCache = new Map()

const getGlyph = (char) => {
  if (glyphCache.has(char)) return glyphCache.get(char)

  const glyph = Object.freeze({
    char,
    width: char === ' ' ? 6 : 12,     // intrinsic: shared shape data
    height: 18,
    bitmap: \`bitmap-of-\${char}\`,       // imagine a real raster here
  })
  glyphCache.set(char, glyph)
  return glyph
}

// --- Extrinsic state: passed as arguments at render time ---

const renderGlyph =
  (glyph) =>
  (x, y, color) => \`glyph "\${glyph.char}" at (\${x}, \${y}) in \${color}\`

// --- Usage: a million render calls share a handful of glyph objects ---

const text = 'hello flyweight'
const chars = [...text].map(getGlyph)  // only 12 unique objects cached

const positions = chars.map((_, i) => [i * 14, 0]) // extrinsic

chars.forEach((glyph, i) => {
  const render = renderGlyph(glyph)
  const [x, y] = positions[i]
  render(x, y, 'slate')   // extrinsic state stays outside the shared object
})`

function FlyweightWidget(): ReactNode {
  const [input, setInput] = useState('hello flyweight')
  const chars = [...input]
  const stats = computeStats(chars)
  const glyphs = chars.map((c) => getGlyph(c))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label
          htmlFor="flyweight-input"
          className="text-sm font-medium text-slate-700"
        >
          Text:
        </label>
        <input
          id="flyweight-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm font-mono"
          placeholder="Type some text..."
        />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="text-xs text-slate-500">Total Requests</div>
          <div className="text-lg font-semibold text-slate-900 font-mono">
            {stats.total}
          </div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="text-xs text-slate-500">Unique Instances</div>
          <div className="text-lg font-semibold text-slate-900 font-mono">
            {stats.unique}
          </div>
        </div>
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
          <div className="text-xs text-emerald-600">Cache Hits</div>
          <div className="text-lg font-semibold text-emerald-700 font-mono">
            {stats.hits}
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {glyphs.slice(0, 20).map((glyph, i) => (
          <div
            key={`${glyph.char}-${i}`}
            className="flex justify-between text-sm text-slate-600"
          >
            <span className="font-mono">
              {renderGlyph(glyph)(i * 14, 0, 'slate')}
            </span>
          </div>
        ))}
        {glyphs.length > 20 && (
          <p className="text-xs text-slate-400 italic">
            …and {glyphs.length - 20} more
          </p>
        )}
      </div>
    </div>
  )
}

export default function FlyweightPattern(): ReactNode {
  return (
    <>
      <StepHeader
        order={11}
        title="Flyweight"
        intro="Share objects to support large numbers of fine-grained objects efficiently. The Flyweight pattern separates intrinsic state (shared) from extrinsic state (context-dependent) to minimize memory use."
      />

      <div className="prose prose-slate max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-700 prose-code:text-slate-800 prose-pre:bg-transparent prose-pre:p-0">
        <h2>Intent</h2>
        <p>
          The Flyweight pattern solves the problem of having too many objects
          in memory when a program needs to represent a large number of
          similar entities. Instead of creating a separate object for every
          instance, you factor out the common, unchanging data (intrinsic
          state) into a small set of shared objects, and keep the
          context-dependent data (extrinsic state) outside.
        </p>

        <h2>OO vs functional</h2>
        <p>
          In classic object-oriented design, you create a{' '}
          <code>FlyweightFactory</code> class that maintains a pool of shared
          flyweight objects, and clients request them by key. Extrinsic state
          is passed as method arguments. In functional programming,{' '}
          <strong>a flyweight is just a frozen object from a memoized
          factory</strong>. Intrinsic state is cached in a closure-backed map
          and sealed with <code>Object.freeze</code>, while extrinsic state is
          passed as plain function arguments — no classes, no constructors.
        </p>

        <CompareDiagram
          oo={[
            'FlyweightFactory',
            'Flyweight «interface»',
            'ConcreteFlyweight',
            'Client',
          ]}
          fp={[
            'getGlyph(char)',
            'Glyph (frozen)',
            'glyphCache (Map)',
            'renderGlyph(glyph)(x,y,color)',
          ]}
        />

        <h2>Functional example</h2>
        <p>
          Below, <code>getGlyph</code> is a memoized factory that returns one
          frozen glyph object per character from an internal cache. The{' '}
          <code>renderGlyph</code> function takes the shared glyph and accepts
          extrinsic state (<code>x</code>, <code>y</code>, <code>color</code>)
          as arguments via currying. No matter how many times a character
          appears in the text, only one glyph object ever exists for it.
        </p>
        <CodeBlock code={flyweightCode} />

        <Callout tone="tip">
          In FP, the Flyweight pattern reduces to <strong>memoized factories
          with frozen return values</strong>: cache immutable objects by key
          inside a closure, and keep all varying data in function parameters.
          No factory classes, no mutation — just a function, a{' '}
          <code>Map</code>, and <code>Object.freeze</code>.
        </Callout>

        <Widget title="Try the flyweight cache">
          <FlyweightWidget />
        </Widget>

        <FlowDiagram steps={['text', 'getGlyph(char)', 'cached Glyph', 'renderGlyph(x,y,color)']} />
      </div>
    </>
  )
}
