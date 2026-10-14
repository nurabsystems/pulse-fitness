// RatingStars — a reusable controlled component
//
// This component DOES NOT hold its own state. It receives:
//   - value: the current rating (number)
//   - onChange: a callback function that runs when a star is clicked
//   - max: total number of stars (defaults to 5)
//
// It's called "controlled" because the PARENT owns the value.
// This is the same pattern as BrewHaus's QuantityStepper.

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
            className={`text-lg transition-colors ${
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