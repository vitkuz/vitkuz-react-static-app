import { NavLink } from 'react-router-dom'
import { getSections } from '../routes.config'
import { groupPatternsByCategory } from '../patterns/registry'

export default function Sidebar({ open, onClose }) {
  const sections = getSections()
  const patternCategories = groupPatternsByCategory()

  return (
    <>
      {/* Mobile scrim */}
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Sidebar drawer/aside */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform overflow-y-auto border-r border-slate-200 bg-white transition-transform md:sticky md:top-0 md:h-screen md:w-[var(--sidebar-width)] md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand block */}
        <div className="border-b border-slate-200 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            Functional JS
          </p>
          <p className="mt-1 text-lg font-bold leading-tight text-slate-900">
            Programming Patterns
          </p>
          <p className="mt-1 text-xs text-slate-500">
            A step-by-step guide
          </p>
        </div>

        {/* Nav groups */}
        <nav className="px-3 py-4">
          {sections.map(([section, links]) => (
            <div key={section} className="mb-6">
              <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {section}
              </p>
              <ul className="space-y-0.5">
                {links.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      end={link.path === '/'}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-start gap-2 rounded-md px-2 py-1.5 text-sm transition ${
                          isActive
                            ? 'bg-blue-50 font-semibold text-blue-700'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`
                      }
                    >
                      <span className="mt-0.5 w-5 shrink-0 text-right font-mono text-xs text-slate-400">
                        {link.step}
                      </span>
                      <span className="flex-1">{link.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Design Patterns — auto-discovered */}
          {patternCategories.map(([category, patterns]) =>
            patterns.length > 0 ? (
              <div key={category} className="mb-6">
                <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {category}
                </p>
                <ul className="space-y-0.5">
                  {patterns.map((p) => (
                    <li key={p.slug}>
                      <NavLink
                        to={`/patterns/${p.slug}`}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `flex items-start gap-2 rounded-md px-2 py-1.5 text-sm transition ${
                            isActive
                              ? 'bg-blue-50 font-semibold text-blue-700'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`
                        }
                      >
                        <span className="mt-0.5 w-5 shrink-0 text-right font-mono text-xs text-slate-400">
                          {p.order}
                        </span>
                        <span className="flex-1">{p.navLabel}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null
          )}
        </nav>
      </aside>
    </>
  )
}
