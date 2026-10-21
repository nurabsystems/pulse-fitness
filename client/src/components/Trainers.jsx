// client/src/components/Trainers.jsx
// Fetches trainers from the Express API.
// Handles loading, error, filtering, quiz integration, and rating state.

import { useState, useEffect } from 'react'
import { api } from '../lib/api'
import { TrainerCard } from './TrainerCard'
import { TrainerMatch } from './TrainerMatch'

const specialties = ['All', 'HIIT', 'Strength', 'Yoga']

export function Trainers({ ratings, onRate, matchedSpecialty, onMatch, userName }) {
  // ---------- Data state ----------
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ---------- UI state ----------
  const [filter, setFilter] = useState('All')
  const [resetKey, setResetKey] = useState(0)
  const [quizMode, setQuizMode] = useState('entrance')

  // ---------- Fetch trainers from API on mount ----------
  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getTrainers()
        if (!cancelled) setTrainers(data.trainers)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  // ---------- Derived filtered list ----------
  const activeFilter = matchedSpecialty || filter
  const filtered = activeFilter === 'All'
    ? trainers
    : trainers.filter((t) => t.specialty === activeFilter)

  // ---------- Handlers ----------
  function handleClearMatch() {
    onMatch(null)
    setFilter('All')
    setQuizMode('entrance')
    setResetKey((k) => k + 1)
  }

  const showFilters = !matchedSpecialty && quizMode === 'entrance'

  // ---------- Render ----------
  return (
    <section id="trainers" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Meet Our Trainers
        </h2>
        <p className="mt-2 text-zinc-400">
          Certified coaches who train with you, not just at you.
        </p>
      </header>

      {/* Quiz OR matched banner */}
      <div className="mx-auto mt-10 max-w-2xl">
        {matchedSpecialty ? (
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Your Match
            </p>
            <h3 className="mt-2 text-2xl font-bold text-white">
              {matchedSpecialty} trainers
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              These coaches specialize in what you're looking for.
            </p>
            <button
              type="button"
              onClick={handleClearMatch}
              className="mt-4 rounded-full border border-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-400 hover:text-black"
            >
              ✕ Clear match — show all trainers
            </button>
          </div>
        ) : (
          <TrainerMatch
            key={resetKey}
            onMatch={onMatch}
            mode={quizMode}
            setMode={setQuizMode}
            userName={userName}
          />
        )}
      </div>

      {/* ---------- Loading state ---------- */}
      {loading && (
        <div className="mt-12 text-center">
          <p className="text-zinc-500">Loading trainers from the database...</p>
        </div>
      )}

      {/* ---------- Error state ---------- */}
      {error && (
        <div className="mt-12 text-center">
          <p className="text-red-400">Failed to load trainers: {error}</p>
          <p className="mt-2 text-sm text-zinc-500">
            Is the backend running on http://localhost:4000?
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-black transition hover:bg-emerald-500"
          >
            Retry
          </button>
        </div>
      )}

      {/* ---------- Data-loaded state ---------- */}
      {!loading && !error && (
        <>
          {/* Filter buttons — hidden during quiz/match */}
          {showFilters && (
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {specialties.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilter(s)}
                  aria-pressed={filter === s}
                  className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                    filter === s
                      ? 'bg-emerald-400 text-black'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Result count */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            Showing {filtered.length} {filtered.length === 1 ? 'trainer' : 'trainers'}
          </p>

          {/* Trainer grid */}
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {filtered.map((trainer) => (
              <div
                key={trainer.id}
                className="flex w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
              >
                <TrainerCard
                  trainer={trainer}
                  rating={ratings[trainer.id] ?? trainer.rating}
                  onRate={onRate}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}