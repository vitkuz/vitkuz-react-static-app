import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeBlock({ code, language = 'javascript', caption }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trimEnd())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard write failed — silently ignore
    }
  }

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 text-slate-100">
      <div className="flex items-center justify-between border-b border-slate-700 px-4 py-2">
        <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="rounded px-2 py-1 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        PreTag="div"
        customStyle={{
          background: 'transparent',
          margin: 0,
          padding: '0.75rem 1rem',
          fontSize: '0.875rem',
        }}
      >
        {code.trimEnd()}
      </SyntaxHighlighter>
      {caption && (
        <figcaption className="border-t border-slate-700 px-4 py-2 text-xs text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
