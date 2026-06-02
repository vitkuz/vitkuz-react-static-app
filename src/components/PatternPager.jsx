import { Link } from 'react-router-dom'

export default function PatternPager({ prev, next }) {
  return (
    <nav className="not-prose mt-12 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6">
      <div>
        {prev ? (
          <Link
            to={`/patterns/${prev.slug}`}
            className="group flex flex-col rounded-lg border border-slate-200 bg-white px-4 py-3 transition hover:border-blue-300 hover:bg-blue-50"
          >
            <span className="text-xs text-slate-400">Previous</span>
            <span className="font-medium text-slate-800 group-hover:text-blue-700">
              ← {prev.navLabel}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </div>
      <div>
        {next ? (
          <Link
            to={`/patterns/${next.slug}`}
            className="group flex flex-col rounded-lg border border-slate-200 bg-white px-4 py-3 text-right transition hover:border-blue-300 hover:bg-blue-50"
          >
            <span className="text-xs text-slate-400">Next</span>
            <span className="font-medium text-slate-800 group-hover:text-blue-700">
              {next.navLabel} →
            </span>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </nav>
  )
}
