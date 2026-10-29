// client/src/components/Footer.jsx
import { Link } from 'react-router-dom'

const links = [
  { href: '#hero',     label: 'Home' },
  { href: '#about',    label: 'About' },
  { href: '#classes',  label: 'Classes' },
  { href: '#trainers', label: 'Trainers' },
  { href: '#pricing',  label: 'Pricing' },
  { href: '#contact',  label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <p className="text-lg font-bold text-white">
            Pulse<span className="text-emerald-400">Fitness</span>
          </p>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {links.map((l) => (
                <li key={l.href}>
                  {/* CHANGED FROM <a> TO <Link> */}
                  <Link
                    to={`/${l.href}`}
                    className="text-sm text-zinc-400 transition-colors hover:text-emerald-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-8 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-500">
          © 2026 Pulse Fitness — Built for Mayerfeld Practicum
        </p>
      </div>
    </footer>
  )
}