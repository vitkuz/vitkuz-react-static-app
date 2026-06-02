import { NavLink } from 'react-router-dom'

const links = [
  { to: '/docs', label: 'Introduction', end: true },
  { to: '/docs/getting-started', label: 'Getting Started' },
]

const patternLinks = [
  { to: '/docs/patterns/composition', label: 'Composition' },
  { to: '/docs/patterns/currying', label: 'Currying' },
  { to: '/docs/patterns/higher-order-functions', label: 'Higher-Order Functions' },
  { to: '/docs/patterns/immutability', label: 'Immutability' },
  { to: '/docs/patterns/memoization', label: 'Memoization' },
  { to: '/docs/patterns/maybe', label: 'Either / Maybe' },
]

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-gray-200 px-4 py-8 lg:block hidden">
      <nav className="flex flex-col gap-0.5">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `rounded-md px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? 'bg-gray-100 font-medium text-black'
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
        <div className="mt-6 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Patterns
        </div>
        {patternLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `rounded-md px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? 'bg-gray-100 font-medium text-black'
                  : 'text-gray-500 hover:text-black hover:bg-gray-50'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
