# Week 2 Assessment — Speaker Notes

## 30-Second Elevator Pitch

"I evolved my Week 1 Pulse Fitness static site into a React + Tailwind application. Same content, same look, new architecture. It demonstrates component composition, controlled components, multi-step state, and clean state lifting — with a trainer-match quiz as a signature feature."

## Presentation Flow

### 1. Intro (30s)
- Show the site live — Home tab open
- Mention: React + Vite + Tailwind, no extra libraries
- Mention: evolved from Week 1 (link to legacy/ folder)

### 2. Scaffolding Demo (30s)
- Open terminal
- Show: `npm run dev` starts Vite in milliseconds
- Mention: `vite.config.js` wires React + Tailwind plugins
- Mention: no `tailwind.config.js` needed for v4

### 3. Component Architecture (45s)
- Open `src/components/` in VS Code
- Show 11 component files
- Say: "Every section of the page is its own component. Header, Hero, About, Classes, Trainers, Pricing, Contact, Footer. Plus reusable RatingStars and TrainerCard."

### 4. Data-Driven Rendering (30s)
- Open `src/data/trainers.js`
- Say: "Every trainer is an object in this array. No copy-pasted JSX. To add a trainer, I add an object. The grid renders automatically."
- Show same for `classes.js`, `pricing.js`

### 5. Filter Demo (45s)
- Scroll to Trainers
- Click "HIIT" → grid filters to 2 trainers
- Say: "This uses useState. When you click HIIT, setFilter fires, React re-renders, and the filtered array computes in render — no useEffect needed because it's derived state."

### 6. Controlled Component Demo (45s)
- Click stars on a trainer card
- Say: "RatingStars is a controlled component. It receives value and onChange as props. It has no internal state. When you click a star, it calls the parent's onChange — the parent owns the state."

### 7. Trainer-Match Quiz (60s)
- Click "Start the match quiz"
- Answer Q1, Q2, Q3
- Say: "This is a three-mode state machine — entrance, quiz, result. useState holds the mode, the step, and the answers object. On completion, a helper function scores the answers and returns the winning specialty."
- Click "See Strength trainers"
- Say: "The result bubbles up to App via onMatch, which passes matchedSpecialty back down to filter the grid."

### 8. Name Capture + Personalization (45s)
- Fill contact form with your name
- Submit → thank-you shows the name
- Say: "The name is captured in the contact form, passed up to App via onNameCapture, saved to localStorage, and reused on the next visit."
- Reload page
- Say: "Now the Hero greets by name. Same pattern — App owns the state, every consumer reads via props."

### 9. Responsive Demo (30s)
- Resize browser to mobile
- Show hamburger menu
- Show grid becomes 1 column
- Say: "Tailwind classes are mobile-first. Unprefixed for mobile, sm:, md:, lg: for larger screens."

### 10. Deploy (15s)
- Say: "Deployed to GitHub Pages via gh-pages. `npm run deploy` builds and pushes to the gh-pages branch."

### 11. Q&A
- Predict: "Where's your useEffect?" → "I don't need one for filtering — filter is derived. I use one only to persist the name to localStorage."
- Predict: "Why Flexbox here and Grid there?" → "Grid for rigid 2D layouts (About section). Flexbox for variable-count layouts (trainers, pricing) where justify-center is needed."
- Predict: "What's next?" → "Week 3 adds a backend. Data shape is already API-ready — the transition is a swap, not a rewrite."

## Key Vocabulary
- Controlled component
- State lifting
- Derived state
- Conditional rendering
- Multi-step state machine
- Data-driven rendering
- Mobile-first