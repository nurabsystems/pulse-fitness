// Trainers — grid of trainer cards with specialty filter.
// The filter uses useState — this is Farshid's required feature.

import { useState } from "react";
import { trainers } from "../data/trainers";
import { TrainerCard } from "./TrainerCard";

const specialties = ["All", "HIIT", "Strength", "Yoga"];

export function Trainers({ ratings, onRate }) {
  // useState holds the currently active filter
  const [filter, setFilter] = useState("All");

  // Derive the filtered list on every render
  const filtered =
    filter === "All"
      ? trainers
      : trainers.filter((t) => t.specialty === filter);

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

      {/* Filter buttons */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
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

      {/* Result count — small UX touch */}
      <p className="mt-4 text-center text-sm text-zinc-500">
        Showing {filtered.length}{" "}
        {filtered.length === 1 ? "trainer" : "trainers"}
      </p>

      {/* Previously Trainers grid now implemented as flex container ; to  allow for perfect Trainers cards rendering when filter is applied*/}
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {filtered.map((trainer) => (
          <div
            key={trainer.id}
            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
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
