// Pricing — membership plans from data.
// Uses a nested map for the feature list.

import { pricingPlans } from '../data/pricing'

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Membership Plans
        </h2>
        <p className="mt-2 text-zinc-400">
          Simple pricing. Cancel anytime.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <article
            key={plan.id}
            className={`relative rounded-2xl border bg-zinc-900 p-6 transition hover:-translate-y-1 ${
              plan.featured
                ? 'border-emerald-400 shadow-[0_20px_50px_-15px_rgba(0,230,118,0.3)]'
                : 'border-zinc-800'
            }`}
          >
            {/* "Most Popular" badge for the featured plan */}
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-black">
                Most Popular
              </span>
            )}

            <h3 className="text-xl font-bold text-white">{plan.name}</h3>

            <p className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-emerald-400">
                €{plan.price}
              </span>
              <span className="text-sm text-zinc-500">/ month</span>
            </p>

            <ul className="mt-6 space-y-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-zinc-300">
                  <span className="text-emerald-400">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className={`mt-6 block rounded-full px-5 py-2.5 text-center text-sm font-semibold transition ${
                plan.featured
                  ? 'bg-emerald-400 text-black hover:bg-emerald-500'
                  : 'border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black'
              }`}
            >
              Choose {plan.name}
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}