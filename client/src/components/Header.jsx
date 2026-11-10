// client/src/components/Header.jsx
// Sticky nav with mobile hamburger menu and auth state (including Admin link for both views).

import { useState } from "react";
import { useSession, signOut } from "../lib/auth-client";
import { Link } from "react-router-dom";

const links = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#classes", label: "Classes" },
  { href: "#trainers", label: "Trainers" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  // Check if the current user is an admin
  const isAdmin = session?.user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-white"
          aria-label="Pulse Fitness — Home"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#00E676" />
            <path
              d="M8 16 L12 16 L14 10 L18 22 L20 16 L24 16"
              stroke="#0D1117"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>
            Pulse<span className="text-emerald-400">Fitness</span>
          </span>
        </Link>

        {/* --- Desktop Navigation --- */}
        <ul className="hidden items-center gap-6 sm:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                to={`/${l.href}`}
                className="text-sm font-semibold text-zinc-300 transition-colors hover:text-emerald-400"
              >
                {l.label}
              </Link>
            </li>
          ))}

          {session?.user ? (
            <li className="flex items-center gap-4">
              {/* User Badge */}
              <span className="flex items-center gap-2 rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-black">
                  {session.user.name?.charAt(0).toUpperCase() || "?"}
                </span>
                {session.user.name}
              </span>

              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                Dashboard
              </Link>

              {/* Admin Link (only for admins) */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-semibold text-amber-400 transition hover:text-amber-300"
                >
                  Admin
                </Link>
              )}

              {/* Sign Out */}
              <button
                onClick={() => signOut()}
                className="text-sm font-semibold text-red-400 transition hover:text-red-300"
              >
                Sign Out
              </button>
            </li>
          ) : (
            <li>
              <Link
                to="/login"
                className="rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-emerald-500"
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>

        {/* --- Hamburger (mobile only) --- */}
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

      {/* --- Mobile Menu --- */}
      {isMenuOpen && (
        <ul className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 sm:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                to={`/${l.href}`}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-zinc-300"
              >
                {l.label}
              </Link>
            </li>
          ))}

          {session?.user ? (
            <li className="mt-3 border-t border-zinc-800 pt-4">
              <div className="flex flex-col gap-3">
                {/* User Row */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-semibold text-zinc-300">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-[11px] font-bold text-black">
                      {session.user.name?.charAt(0).toUpperCase() || "?"}
                    </span>
                    {session.user.name}
                  </span>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="text-xs font-semibold text-red-400 transition hover:text-red-300"
                  >
                    Sign Out
                  </button>
                </div>

                {/* Dashboard Button */}
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg bg-zinc-900 py-2.5 text-center text-sm font-semibold text-emerald-400 border border-zinc-800 transition hover:bg-zinc-800"
                >
                  Dashboard
                </Link>

                {/* Admin Button (only for admins) */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block rounded-lg bg-amber-500/10 py-2.5 text-center text-sm font-semibold text-amber-400 border border-amber-500/30 transition hover:bg-amber-500/20"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </li>
          ) : (
            <li className="mt-3 border-t border-zinc-800 pt-4">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-full bg-emerald-400 px-4 py-2 text-center text-sm font-semibold text-black transition hover:bg-emerald-500"
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>
      )}
    </header>
  );
}