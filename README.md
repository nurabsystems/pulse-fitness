


# Pulse Fitness — React + Tailwind + Backend Edition 

> An evolved, single-page fitness studio website rebuilt with **React + Vite + Tailwind CSS + Backend **.

**Repo:** github.com/nurabsystems/pulse-fitness
**Live:** nurabsystems.github.io/pulse-fitness

---

## Overview

Pulse Fitness is a modern fitness studio website — now a React application. This project evolved from the Week 1 static HTML/CSS version (preserved in `legacy/`) and continues to grow toward a full-stack app in Week 3.

**Same business. Same content. Same look. New architecture.**

---

## Tech Stack

- **React 19** — component-based UI
- **Vite** — fast build tool
- **Tailwind CSS v4** — utility-first styling
- **No TypeScript** — plain JS by design
- **No extra libraries** — data is hardcoded, ready for a Week 3 backend

## Data Architecture (Week 3)

- **Images:** `client/public/images/` — served by Vite (dev) or Vercel (prod)
- **Data:** PostgreSQL (Neon cloud) — served via Express API
- **Seed sources:** `server/src/db/*.data.js` — insert initial data
- **Logic:** `client/src/data/matchQuiz.js` — quiz rules, not resources

### Migration Status
- ✅ Trainers → API (Week 3 Day 1)
- ⏳ Classes → API (next)
- ⏳ Pricing → API (next)




---

## Features

- Component-based architecture (Header, Hero, About, Classes, Trainers, Pricing, Contact, Footer)
- **Real filter** on trainers by specialty (HIIT / Strength / Yoga) — uses `useState`
- **Trainer-match quiz** — multi-step state machine (entrance → quiz → result → matched)
- **Rating stars** — reusable controlled component on every trainer card
- **Name capture** — captured in the contact form, remembered via `localStorage`, greeting on return
- Fully responsive — mobile-first Tailwind classes (`sm:` `md:` `lg:`)
- No horizontal scroll at any breakpoint

---

## Key React Patterns Demonstrated

- `useState` for filter, quiz step, quiz answers, ratings, and user name
- **Controlled inputs** (Contact form, RatingStars) — value + onChange, no internal state
- **Conditional rendering** (thank-you screen, quiz modes, greeting)
- **State lifting** — App owns shared state, passes down via props, listens via callbacks
- **`key` prop for component reset** — TrainerMatch resets on key change (no `useEffect` hacks)
- **Data-driven rendering** — every list maps over an array of objects from `src/data/`

---

## Project Structure
