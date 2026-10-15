// Onboarding — collects the user's name before entering the studio.
// Demonstrates: controlled input, local state, and calling a parent callback.

import { useState } from 'react'

export function Onboarding({ onComplete }) {
  // Local state — one for the input value, one for validation errors
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError('Please enter a name with at least 2 characters.')
      return
    }

    // Bubble the name up to App via the prop callback
    onComplete(trimmed)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl sm:p-10"
      >
        {/* Brand mark */}
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0D1117"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 12 L10 12 L12 6 L15 18 L17 12 L20 12" />
            </svg>
          </div>
        </div>

        <h1 className="mt-6 text-center text-2xl font-bold text-white sm:text-3xl">
          Welcome to <span className="text-emerald-400">Pulse Fitness</span>
        </h1>

        <p className="mt-3 text-center text-sm text-zinc-400">
          Let's personalize your studio experience. What should we call you?
        </p>

        {/* Controlled input */}
        <div className="mt-8">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-zinc-300"
          >
            Your name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError('')
            }}
            placeholder="e.g. Nurudeen"
            autoFocus
            autoComplete="given-name"
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
          />
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-emerald-400 px-6 py-3 font-semibold text-black transition hover:bg-emerald-500"
        >
          Enter the studio
        </button>

        <p className="mt-4 text-center text-xs text-zinc-500">
          We'll remember you next time.
        </p>
      </form>
    </div>
  )
}