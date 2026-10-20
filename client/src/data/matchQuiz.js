// src/data/matchQuiz.js
// Defines the quiz questions and the scoring logic that
// maps user answers to a recommended specialty.

// Each question has:
// - id: used as the key in the answers object
// - question: the prompt shown to the user
// - options: array of { value, label, score }
//   where `score` contributes to a specialty's total

export const quizQuestions = [
  {
    id: "goal",
    question: "What's your main fitness goal?",
    options: [
      {
        value: "lose-weight",
        label: "Lose weight",
        score: { HIIT: 3, Strength: 1, Yoga: 0 },
      },
      {
        value: "get-stronger",
        label: "Get stronger",
        score: { HIIT: 1, Strength: 3, Yoga: 0 },
      },
      {
        value: "flexibility",
        label: "Improve flexibility",
        score: { HIIT: 0, Strength: 1, Yoga: 3 },
      },
      {
        value: "endurance",
        label: "Build endurance",
        score: { HIIT: 3, Strength: 1, Yoga: 1 },
      },
    ],
  },
  {
    id: "experience",
    question: "How experienced are you?",
    options: [
      {
        value: "beginner",
        label: "Beginner — new to fitness",
        score: { HIIT: 1, Strength: 1, Yoga: 3 },
      },
      {
        value: "intermediate",
        label: "Intermediate — 1-3 years",
        score: { HIIT: 2, Strength: 2, Yoga: 2 },
      },
      {
        value: "advanced",
        label: "Advanced — 3+ years",
        score: { HIIT: 3, Strength: 3, Yoga: 1 },
      },
    ],
  },
  {
    id: "style",
    question: "What training style appeals to you most?",
    options: [
      {
        value: "intense",
        label: "High intensity, fast-paced",
        score: { HIIT: 3, Strength: 1, Yoga: 0 },
      },
      {
        value: "structured",
        label: "Structured, progressive strength",
        score: { HIIT: 1, Strength: 3, Yoga: 0 },
      },
      {
        value: "mindful",
        label: "Mindful, breath-focused",
        score: { HIIT: 0, Strength: 1, Yoga: 3 },
      },
    ],
  },
];

// Given an answers object like { goal: 'lose-weight', experience: 'beginner', style: 'intense' },
// compute a total score for each specialty and return the winning specialty.
export function getMatchedSpecialty(answers) {
  const totals = { HIIT: 0, Strength: 0, Yoga: 0 };

  quizQuestions.forEach((q) => {
    const selected = answers[q.id];
    if (!selected) return;

    const option = q.options.find((o) => o.value === selected);
    if (!option) return;

    // Add this option's score to each specialty
    Object.entries(option.score).forEach(([specialty, points]) => {
      totals[specialty] += points;
    });
  });

  // Find the specialty with the highest score
  let winner = "HIIT";
  let highest = -1;
  Object.entries(totals).forEach(([specialty, points]) => {
    if (points > highest) {
      highest = points;
      winner = specialty;
    }
  });

  return winner;
}

// Human-readable reason per specialty
export const matchReasons = {
  HIIT: "You want intensity and results. High-intensity interval training will push your limits and torch calories efficiently.",
  Strength:
    "You value progressive, lasting change. Structured strength training builds functional power and protects your joints.",
  Yoga: "You prefer mindful movement. Yoga improves flexibility, breath control, and long-term joint health.",
};
