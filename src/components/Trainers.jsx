// Trainers — combines the match quiz with a filterable grid.
// When a match is active, the quiz is replaced by a match banner.
// Filter buttons are hidden during the quiz flow to avoid confusion.

import { useState } from "react";
import { trainers } from "../data/trainers";
import { TrainerCard } from "./TrainerCard";
import { TrainerMatch } from "./TrainerMatch";

const specialties = ["All", "HIIT", "Strength", "Yoga"];

export function Trainers({
  ratings,
  onRate,
  matchedSpecialty,
  onMatch,
  userName,
}) {
  const [filter, setFilter] = useState("All");
  const [resetKey, setResetKey] = useState(0);

  // Quiz mode is lifted here so we can hide filters during quiz/result
  const [quizMode, setQuizMode] = useState("entrance");

  // If a match is active, use that specialty. Otherwise use the filter.
  const activeFilter = matchedSpecialty || filter;

  const filtered =
    activeFilter === "All"
      ? trainers
      : trainers.filter((t) => t.specialty === activeFilter);

  // Clear the match — reset parent state, filter, and quiz
  function handleClearMatch() {
    onMatch(null);
    setFilter("All");
    setQuizMode("entrance");
    setResetKey((k) => k + 1);
  }

  // Show filters only in the entrance view, and only when no match is active
  const showFilters = !matchedSpecialty && quizMode === "entrance";

  return (
    <section id="trainers" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Meet Our Trainers
        </h2>
        <p className="mt-2 text-zinc-400">
          Certified coaches who train with you, not just at you.
        </p>
      </header>

      {/* Quiz OR matched banner */}
      <div className="mx-auto mt-10 max-w-2xl">
        {matchedSpecialty ? (
          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Your Match
            </p>
            <h3 className="mt-2 text-2xl font-bold text-white">
              {matchedSpecialty} trainers
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              These coaches specialize in what you're looking for.
            </p>
            <button
              type="button"
              onClick={handleClearMatch}
              className="mt-4 rounded-full border border-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-400 hover:text-black"
            >
              ✕ Clear match — show all trainers
            </button>
          </div>
        ) : (
          <TrainerMatch
            key={resetKey}
            onMatch={onMatch}
            mode={quizMode}
            setMode={setQuizMode}
            userName={userName}
          />
        )}
      </div>

      {/* Filter buttons — hidden during quiz/result or match */}
      {showFilters && (
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {specialties.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              aria-pressed={filter === s}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                filter === s
                  ? "bg-emerald-400 text-black"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Result count */}
      <p className="mt-6 text-center text-sm text-zinc-500">
        Showing {filtered.length}{" "}
        {filtered.length === 1 ? "trainer" : "trainers"}
      </p>

      {/* Trainer grid */}
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {filtered.map((trainer) => (
          <div
            key={trainer.id}
            className="flex w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <TrainerCard
              trainer={trainer}
              rating={ratings[trainer.id] ?? trainer.rating}
              onRate={onRate}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
