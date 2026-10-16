// TrainerCard — displays one trainer. Passes rating + onRate to RatingStars.

import { RatingStars } from './RatingStars'

export function TrainerCard({ trainer, rating, onRate }) {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:border-emerald-400">
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

        <p className="mt-2 flex-grow text-sm text-zinc-400">{trainer.bio}</p>

        <div className="mt-3 flex items-center gap-2">
          <RatingStars
            value={rating}
            onChange={(v) => onRate(trainer.id, v)}
          />
          <span className="text-sm text-zinc-500">{rating.toFixed(1)}</span>
        </div>
      </div>
    </article>
  )
}