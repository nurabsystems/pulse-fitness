// Hero — the top section with headline, greeting, and CTA.
// Shows a personalized greeting if a name is saved.

export function Hero({ userName }) {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
      aria-labelledby="hero-heading"
    >
      {/* Background image with dark overlay */}
      <figure className="absolute inset-0" aria-hidden="true">
        <img
          src="images/hero.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/50 to-zinc-950/80" />
      </figure>

      {/* Foreground content */}
      <header className="relative z-10 mx-auto max-w-3xl text-center">
        {/* Single greeting — one line only */}
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-emerald-400">
          {userName
            ? `Welcome back, ${userName}. Still moving forward?`
            : 'Welcome to Pulse Fitness'}
        </p>

        <h1
          id="hero-heading"
          className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          Train Smart. Live Strong.
        </h1>

        <p className="mt-4 text-base text-zinc-200 sm:text-lg md:text-xl">
          Group classes, expert trainers, and flexible plans —
          everything you need to keep fit and feel stronger.
        </p>

        <a
          href="#pricing"
          className="mt-8 inline-block rounded-full bg-emerald-400 px-7 py-3 font-semibold text-black transition hover:bg-emerald-500"
        >
          View Membership Plans
        </a>
      </header>
    </section>
  )
}