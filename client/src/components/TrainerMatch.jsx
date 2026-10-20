// TrainerMatch — three views: entrance, quiz, result.
// Mode is controlled by the parent (Trainers) for cross-component coordination.

import { useState } from "react";
import {
  quizQuestions,
  getMatchedSpecialty,
  matchReasons,
} from "../data/matchQuiz";

export function TrainerMatch({ onMatch, mode, setMode, userName }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  // -------------------- Handlers --------------------

  function startQuiz() {
    setMode("quiz");
    setStep(0);
    setAnswers({});
    onMatch(null); // clear any active match
  }

  function handleAnswer(questionId, value) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    if (step < quizQuestions.length - 1) {
      setStep((s) => s + 1);
    } else {
      setMode("result");
    }
  }

  function goBack() {
    if (step === 0) {
      setMode("entrance");
    } else {
      setStep((s) => s - 1);
    }
  }

  function handleSeeMatch() {
    onMatch(getMatchedSpecialty(answers));
  }

  function retake() {
    setStep(0);
    setAnswers({});
    setMode("quiz");
  }

  // -------------------- Render: ENTRANCE --------------------

  if (mode === "entrance") {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
          Trainer Match
        </p>
        <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          Find your perfect coach
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
          Answer three quick questions and we'll recommend the right training
          style for your goals.
        </p>
        <button
          type="button"
          onClick={startQuiz}
          className="mt-6 rounded-full bg-emerald-400 px-6 py-3 font-semibold text-black transition hover:bg-emerald-500"
        >
          Start the match quiz
        </button>
      </div>
    );
  }

  // -------------------- Render: QUIZ --------------------

  if (mode === "quiz") {
    const current = quizQuestions[step];

    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <header className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Trainer Match
          </p>
          <h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">
            Find your perfect coach
          </h3>

          {/* Progress dots */}
          <div className="mt-4 flex justify-center gap-2">
            {quizQuestions.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-8 rounded-full transition ${
                  i <= step ? "bg-emerald-400" : "bg-zinc-700"
                }`}
              />
            ))}
          </div>
        </header>

        <p className="mt-6 text-center text-base text-zinc-300 sm:text-lg">
          {current.question}
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleAnswer(current.id, opt.value)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-left text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-emerald-400"
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={goBack}
          className="mt-6 text-xs text-zinc-500 transition hover:text-zinc-300"
        >
          ← Back
        </button>
      </div>
    );
  }

  // -------------------- Render: RESULT --------------------

  const matched = getMatchedSpecialty(answers);

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
      <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
        Trainer Match
      </p>
      <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
        {userName ? `Your match is ready, ${userName}.` : "Your match is ready"}
      </h3>

      <p className="mt-4 text-sm text-zinc-400">We recommend training with</p>
      <p className="mt-1 text-4xl font-extrabold text-emerald-400 sm:text-5xl">
        {matched}
      </p>

      <p className="mx-auto mt-4 max-w-md text-sm text-zinc-400">
        {matchReasons[matched]}
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={handleSeeMatch}
          className="rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-500"
        >
          See {matched} trainers
        </button>
        <button
          type="button"
          onClick={retake}
          className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:border-emerald-400 hover:text-emerald-400"
        >
          Retake quiz
        </button>
      </div>
    </div>
  );
}
