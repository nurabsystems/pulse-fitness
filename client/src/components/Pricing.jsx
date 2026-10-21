// client/src/components/Pricing.jsx
// Fetches pricing plans from the API.

import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export function Pricing() {
  const [pricingPlans, setPricingPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getPricing()
        if (!cancelled) setPricingPlans(data.pricing)
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
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Membership Plans
        </h2>
        <p className="mt-2 text-zinc-400">
          Simple pricing. Cancel anytime.
        </p>
      </header>

      {loading && (
        <div className="mt-12 text-center">
          <p className="text-zinc-500">Loading pricing from the database...</p>
        </div>
      )}

      {error && (
        <div className="mt-12 text-center">
          <p className="text-red-400">Failed to load pricing: {error}</p>
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
        <div className="mt-14 flex flex-wrap justify-center gap-6 lg:gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className="flex w-full max-w-md sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.334rem)]"
            >
              <article
                className={`relative flex w-full flex-col rounded-2xl border bg-zinc-900 p-8 transition hover:-translate-y-1 sm:p-10 ${
                  plan.featured
                    ? 'border-emerald-400 shadow-[0_20px_50px_-15px_rgba(0,230,118,0.3)]'
                    : 'border-zinc-800'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-400 px-4 py-1 text-xs font-bold uppercase tracking-wide text-black">
                    Most Popular
                  </span>
                )}

                <h3 className="text-xl font-bold text-white sm:text-2xl">
                  {plan.name}
                </h3>

                <p className="mt-4 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-emerald-400 sm:text-6xl">
                    €{plan.price}
                  </span>
                  <span className="text-sm text-zinc-500">/ month</span>
                </p>

                <ul className="mt-8 flex-grow space-y-3 text-sm sm:text-base">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-zinc-300">
                      <span className="text-emerald-400">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-10 block rounded-full px-6 py-3 text-center text-sm font-semibold transition ${
                    plan.featured
                      ? 'bg-emerald-400 text-black hover:bg-emerald-500'
                      : 'border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black'
                  }`}
                >
                  Choose {plan.name}
                </a>
              </article>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}