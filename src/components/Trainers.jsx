// Trainers — grid with specialty filter AND trainer-match quiz.
// The quiz uses multi-step state; the filter uses single state.

import { useState } from "react";
import { trainers } from "../data/trainers";
import { TrainerCard } from "./TrainerCard";
import { TrainerMatch } from "./TrainerMatch";

const specialties = ["All", "HIIT", "Strength", "Yoga"];

export function Trainers({ ratings, onRate, matchedSpecialty, onMatch }) {
  const [filter, setFilter] = useState("All");

  // If the user completed the quiz, the matched specialty can
  // auto-filter the grid so they immediately see their match.
  const activeFilter = matchedSpecialty || filter;

  const filtered =
    activeFilter === "All"
      ? trainers
      : trainers.filter((t) => t.specialty === activeFilter);

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

      {/* Trainer-match quiz */}
      <div className="mx-auto mt-10 max-w-2xl">
        <TrainerMatch onMatch={onMatch} />
      </div>

      {/* Filter buttons (shown after quiz or by default) */}
      {!matchedSpecialty && (
        <div className="mt-12 flex flex-wrap justify-center gap-2">
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

      {/* When a match is active, show a "showing match" chip */}
      {matchedSpecialty && (
        <div className="mt-12 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/10 px-4 py-1.5 text-sm font-semibold text-emerald-400">
            Showing your match: {matchedSpecialty}
            <button
              type="button"
              onClick={() => onMatch(null)}
              className="text-emerald-400 hover:text-white"
              aria-label="Clear match"
            >
              ✕
            </button>
          </span>
        </div>
      )}

      <p className="mt-4 text-center text-sm text-zinc-500">
        Showing {filtered.length}{" "}
        {filtered.length === 1 ? "trainer" : "trainers"}
      </p>

      {/* Grid */}
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
