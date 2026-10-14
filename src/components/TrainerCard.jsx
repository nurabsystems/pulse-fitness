// TrainerCard — displays ONE trainer
//
// Receives a trainer object as a prop. Renders the card.
// Also passes rating + onRate to RatingStars.
//
// Same pattern as BrewHaus's ProductCard.

import { RatingStars } from './RatingStars'

export function TrainerCard({ trainer, rating, onRate }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:border-emerald-400">
      <img
        src={trainer.image}
        alt={trainer.name}
        className="aspect-square w-full object-cover"
        loading="lazy"
      />

      <div className="p-4">
        <h3 className="text-lg font-bold text-white">{trainer.name}</h3>

        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
          {trainer.specialty}
        </p>

        <p className="mt-2 text-sm text-zinc-400">{trainer.bio}</p>

        <div className="mt-3 flex items-center gap-2">
          <RatingStars value={rating} onChange={(v) => onRate(trainer.id, v)} />
          <span className="text-sm text-zinc-500">{rating.toFixed(1)}</span>
        </div>
      </div>
    </article>
  )
}