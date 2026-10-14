// About — two-column layout with image + content

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
        {/* Image */}
        <figure className="overflow-hidden rounded-2xl border border-zinc-800">
          <img
            src="/images/about-studio.jpg"
            alt="Bright modern fitness studio with training equipment"
            className="aspect-[4/5] w-full object-cover"
            loading="lazy"
          />
        </figure>

        {/* Content */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            About the Studio
          </p>

          <h2 className="mt-2 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Built for people who want to{' '}
            <span className="text-emerald-400">train smarter.</span>
          </h2>

          <p className="mt-4 text-zinc-400">
            Pulse Fitness opened with a simple idea: fitness should feel
            welcoming, not intimidating. Whether you're training for your
            first 5K or chasing a new personal best, our studio gives you
            the space, coaching, and community to get there.
          </p>

          <p className="mt-4 text-zinc-400">
            We offer small-group classes, certified trainers, and flexible
            membership plans — so you can train on your terms. No lock-ins.
            No pressure. Just consistent progress.
          </p>

          <ul className="mt-6 space-y-2 rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-sm">
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span>
              <span className="text-zinc-300">
                <strong className="text-emerald-400">Expert coaches</strong> — certified in HIIT, strength, yoga, and mobility
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span>
              <span className="text-zinc-300">
                <strong className="text-emerald-400">Small classes</strong> — personalized attention, every session
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-400">✓</span>
              <span className="text-zinc-300">
                <strong className="text-emerald-400">Flexible plans</strong> — start, pause, or cancel anytime
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}