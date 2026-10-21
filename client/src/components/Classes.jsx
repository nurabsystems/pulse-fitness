// client/src/components/Classes.jsx
// Fetches classes from the API.

import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export function Classes() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getClasses()
        if (!cancelled) setClasses(data.classes)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return (
    <section id="classes" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Class Schedule
        </h2>
        <p className="mt-2 text-zinc-400">
          Weekly sessions led by certified instructors.
        </p>
      </header>

      {loading && (
        <div className="mt-12 text-center">
          <p className="text-zinc-500">Loading classes from the database...</p>
        </div>
      )}

      {error && (
        <div className="mt-12 text-center">
          <p className="text-red-400">Failed to load classes: {error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-black transition hover:bg-emerald-500"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Mobile view — stacked cards */}
          <ul className="mt-10 space-y-3 sm:hidden">
            {classes.map((c) => (
              <li
                key={c.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold uppercase tracking-wide text-emerald-400">
                    {c.day}
                  </span>
                  <span className="text-sm text-zinc-500">{c.time}</span>
                </div>
                <p className="mt-2 text-lg font-semibold text-white">{c.name}</p>
                <p className="mt-1 text-sm text-zinc-400">{c.trainer}</p>
              </li>
            ))}
          </ul>

          {/* Desktop view — table */}
          <div className="mt-10 hidden overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 sm:block">
            <table className="w-full">
              <thead className="bg-emerald-400 text-left text-black">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Day</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Class</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Trainer</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-zinc-800 last:border-b-0 hover:bg-zinc-800/50"
                  >
                    <td className="px-4 py-3 text-sm text-zinc-300">{c.day}</td>
                    <td className="px-4 py-3 text-sm text-zinc-300">{c.time}</td>
                    <td className="px-4 py-3 text-sm font-medium text-white">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-zinc-300">{c.trainer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}