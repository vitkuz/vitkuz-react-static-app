import StepHeader from '../components/StepHeader'
import CodeBlock from '../components/CodeBlock'
import Callout from '../components/Callout'

export const meta = {
  slug: 'flyweight',
  title: 'Flyweight',
  navLabel: 'Flyweight',
  category: 'Structural',
  order: 11,
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

export default function FlyweightPattern() {
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
      </div>
    </>
  )
}
