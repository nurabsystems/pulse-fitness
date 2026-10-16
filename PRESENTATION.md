# Week 2 — Assessment Presentation Notes

## The One-Liner
"I evolved my Week 1 Pulse Fitness static site into a React + Tailwind application, keeping the same content and look while demonstrating component architecture, state management, and controlled inputs."

## Demo Flow (5 minutes)

1. **Hero** — personalized greeting + CTA
2. **About** — Grid-based two-column layout
3. **Classes** — responsive table (cards on mobile)
4. **Trainers section:**
   - Show the filter (All / HIIT / Strength / Yoga)
   - Run the Trainer Match quiz → land on result → click "See Strength trainers"
   - Point out the matched banner + filtered grid
   - Click ✕ to reset
5. **Pricing** — Flexbox cards, equal height, centered orphans
6. **Contact** — fill form with your name → submit → personalized thank-you → show Hero greeting on return
7. **Resize to mobile** — show hamburger menu, responsive grid

## Key Talking Points

**Q: Where's your useState?**
"Three places: filter (string), quiz step + answers (multi-step state), and user name (persisted to localStorage). Each drives a distinct UI."

**Q: Show me a controlled component.**
"RatingStars receives `value` and `onChange` — it has no state. The Contact form is the same pattern — one object holds all fields, one handler updates them."

**Q: How does state lift up?**
"App owns shared state. It passes `userName` down to Hero, Trainers, and Contact via props. When Contact captures a name, it calls `onNameCapture` — bubbling up. No props drilling beyond 2 levels."

**Q: Why Flexbox for some grids and Grid for others?**
"Grid for rigid 2D layouts (About section). Flexbox for variable-count layouts (trainers and pricing) — `justify-center` centers orphan cards, which Grid can't do."

**Q: What's next?**
"Week 3 adds a backend. All data currently lives in `src/data/` — the shape is already API-ready. Week 3 becomes a swap, not a rewrite."

## Challenges Faced

1. **Removing the Onboarding screen** — decided it wasn't a marketing-site pattern. Built a trainer-match quiz instead.
2. **ESLint `setState-in-effect` warning** — solved by using the `key` prop to reset child components instead of effects.
3. **Orphan cards on tablet** — solved by switching trainers/pricing grids from Grid to Flexbox.