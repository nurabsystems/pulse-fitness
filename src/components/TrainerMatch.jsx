// TrainerMatch — a multi-step quiz that recommends a specialty.
// Demonstrates: multi-step state, controlled inputs, derived results.

import { useState } from "react";
import {
  quizQuestions,
  getMatchedSpecialty,
  matchReasons,
} from "../data/matchQuiz";

export function TrainerMatch({ onMatch }) {
  // Current step index (0, 1, 2, 3) — step 3 is the result
  const [step, setStep] = useState(0);

  // Answers object: { goal: 'lose-weight', experience: 'beginner', style: 'intense' }
  const [answers, setAnswers] = useState({});

  // User can reset and start over
  function handleReset() {
    setStep(0);
    setAnswers({});
  }

  // User clicks an option
  function handleAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    // Auto-advance to next step after a short delay (nice UX)
    if (step < quizQuestions.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Last question — jump to result step
      setStep(quizQuestions.length);
    }
  }

  // Compute match only when all questions answered
  const isComplete = step === quizQuestions.length;
  const matchedSpecialty = isComplete ? getMatchedSpecialty(answers) : null;

  // When the match is computed, bubble it up to the parent
  if (isComplete && matchedSpecialty && onMatch) {
    onMatch(matchedSpecialty);
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
      {/* Header */}
      <header className="mb-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
          Trainer Match
        </p>
        <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
          {isComplete ? "Your match is ready" : "Find your perfect coach"}
        </h3>
      </header>

      {/* Progress indicator (hidden on result screen) */}
      {!isComplete && (
        <div className="mb-6 flex justify-center gap-2">
          {quizQuestions.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-8 rounded-full transition ${
                i <= step ? "bg-emerald-400" : "bg-zinc-700"
              }`}
            />
          ))}
        </div>
      )}

      {/* Question / Result body */}
      {!isComplete ? (
        <div>
          <p className="mb-4 text-center text-base text-zinc-300 sm:text-lg">
            {quizQuestions[step].question}
          </p>

          <div className="flex flex-col gap-2">
            {quizQuestions[step].options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleAnswer(quizQuestions[step].id, opt.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-left text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-emerald-400"
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Back button (skip step 1) */}
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="mt-4 text-xs text-zinc-500 transition hover:text-zinc-300"
            >
              ← Back
            </button>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-zinc-400">We recommend training with</p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-400 sm:text-4xl">
            {matchedSpecialty}
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400">
            {matchReasons[matchedSpecialty]}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="#trainers"
              onClick={() => onMatch?.(matchedSpecialty)}
              className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-500"
            >
              See {matchedSpecialty} trainers
            </a>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:border-emerald-400 hover:text-emerald-400"
            >
              Retake quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
