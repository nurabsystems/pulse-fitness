// Header — sticky nav with mobile hamburger menu
//
// Contains its own useState for the mobile menu toggle.
// Gets userName and theme props from App.

import { useState } from "react";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#classes", label: "Classes" },
  { href: "#trainers", label: "Trainers" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export function Header({ userName, onReset }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a href="#hero" className="text-lg font-bold text-white">
          Pulse<span className="text-emerald-400">Fitness</span>
        </a>

        {/* Desktop nav — hidden on mobile */}
        <ul className="hidden items-center gap-6 sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-semibold text-zinc-300 transition-colors hover:text-emerald-400"
              >
                {l.label}
              </a>
            </li>
          ))}

          {/* User chip with reset */}
          {userName && (
            <li>
              <button
                type="button"
                onClick={onReset}
                title="Reset and start over"
                className="flex items-center gap-2 rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-emerald-400 hover:text-emerald-400"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-black">
                  {userName.charAt(0).toUpperCase()}
                </span>
                {userName}
              </button>
            </li>
          )}
        </ul>

        {/* Hamburger — hidden on desktop, shown on mobile */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="rounded-lg p-2 text-emerald-400 sm:hidden"
        >
          {isMenuOpen ? (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu — only shown when isMenuOpen is true */}
      {isMenuOpen && (
        <ul className="border-t border-zinc-800 bg-zinc-950 px-4 pb-4 sm:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-zinc-300"
              >
                {l.label}
              </a>
            </li>
          ))}

          {userName && (
            <li className="mt-2 border-t border-zinc-800 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  onReset();
                }}
                className="flex w-full items-center gap-2 text-sm font-semibold text-zinc-300"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-[11px] font-bold text-black">
                  {userName.charAt(0).toUpperCase()}
                </span>
                {userName}
                <span className="ml-auto text-xs text-zinc-500">Reset</span>
              </button>
            </li>
          )}
        </ul>
      )}
    </header>
  );
}
