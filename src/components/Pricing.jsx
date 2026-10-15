// Pricing — membership plans from data.
// Uses Flexbox so cards respond cleanly across all screen sizes
// and stay equal height regardless of content length.

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

      {/* Flex container — centers any number of cards, wraps responsively */}
      <div className="mt-10 flex flex-wrap justify-center gap-8">
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className="flex w-full max-w-sm md:w-[calc(33.333%-1.5rem)]"
          >
            <article
              className={`relative flex w-full flex-col rounded-2xl border bg-zinc-900 p-8 transition hover:-translate-y-1 ${
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
                <span className="text-5xl font-extrabold text-emerald-400">
                  €{plan.price}
                </span>
                <span className="text-sm text-zinc-500">/ month</span>
              </p>

              {/* flex-grow pushes the CTA button to the bottom of every card */}
              <ul className="mt-6 flex-grow space-y-2 text-sm">
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
          </div>
        ))}
      </div>
    </section>
  )
}