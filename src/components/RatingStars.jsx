// RatingStars — a reusable controlled component.
// Receives `value` and `onChange`. Holds NO internal state.

export function RatingStars({ value, onChange, max = 5 }) {
  return (
    <div className="inline-flex items-center gap-0.5" role="group" aria-label="Rating">
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1
        const isActive = star <= Math.round(value)

        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            aria-label={`Rate ${star} out of ${max}`}
            className={`text-lg leading-none transition-colors ${
              isActive
                ? 'text-emerald-400'
                : 'text-zinc-600 hover:text-emerald-300'
            }`}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}