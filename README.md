# Pulse Fitness

 A modern, single-page fitness studio website built with plain HTML5 and CSS3 — no frameworks, no libraries.



## Overview

**Pulse Fitness** is a fictional fitness studio website built as part of the **Mayerfeld Consulting Frontend Practicum** (Group A, Team 7) Week 1 Assignment, under tutor Mr. Farshid Cheraghchian).

The project demonstrates a complete single-page website with:
- Semantic HTML5 structure and accessibility
- Modern responsive CSS using **Flexbox** and **CSS Grid**
- Dark theme with a neon accent palette
- Sticky navigation, smooth scrolling, and hover/focus states
- A clean, professional Git history of small, meaningful commits

The site presents the studio's class schedule, trainers, membership plans, and a contact form — all on one page.

---

## What It Is

A single-page, dark-themed website with the following sections:

| Section | Purpose |
|---------|---------|
| **Hero** | Headline, tagline, call-to-action button, background image |
| **About** | Studio introduction with key highlights |
| **Class Schedule** | Weekly timetable in a semantic `<table>` |
| **Trainers** | Three trainer bio cards in a responsive grid |
| **Membership Plans** | Three pricing cards (Basic, Standard, Premium) |
| **Contact** | Working form with name, email, plan, and message |
| **Footer** | Brand, navigation links, copyright |

Navigation uses smooth-scrolling anchor links, and the header is sticky with a translucent background blur. The layout is tested at phone (≤480px), tablet (≤768px), and desktop (1200px+).

---

## Tech Stack

- **HTML5** — semantic landmarks, accessible forms, one `<h1>`, structured content
- **CSS3** — Flexbox, Grid, CSS variables, `clamp()` for fluid typography and spacing
- **Vanilla JavaScript** — none; this is a pure HTML/CSS project
- **No frameworks** — no Bootstrap, Tailwind, React, or jQuery

**Fonts:** Google Fonts (Inter)
**Icons:** Inline SVG
**Images:** Unsplash + Pexels

---

## How I Built It

### 1. Structure first
I started with an empty `index.html` and built the full semantic skeleton first: `<header>`, `<nav>`, `<main>` with five `<section>`s, `<article>` cards for trainers and pricing, and a `<footer>`. No styling, just clean markup — then verified with the [W3C validator](https://validator.w3.org/).

### 2. Layered CSS in logical chunks
I added CSS in this order, committing after each step:

1. Global reset with `box-sizing: border-box`
2. CSS variables in `:root` for colors, spacing, typography
3. Flexbox for header, navigation, and hero
4. Grid for trainer cards
5. Flexbox for pricing cards
6. Contact form and footer styling
7. Responsive media queries (tablet, phone)
8. Overflow safety and final polish

Each step was a **separate commit** — producing a clean, reviewable history.

### 3. Deliberate layout choices
- **Flexbox** — where content flows in one direction: nav, hero, pricing cards, footer
- **CSS Grid** — where a two-dimensional layout is needed: trainer cards
- **`clamp()`** — for font sizes and spacing, so the design scales smoothly without dozens of media queries

### 4. Tested responsiveness at three widths
- **320px** — small phone (tested via Chrome DevTools device toolbar)
- **768px** — tablet
- **1200px+** — desktop

Confirmed: no horizontal scroll at any width, trainer cards center properly, nav wraps cleanly, and the schedule table stays readable.

### 5. Refined the visual system
- Dark background (`#0D1117`) with a neon accent (`#00E676`)
- Consistent `--radius: 12px` for rounded corners
- Subtle border color (`#30363D`) for card separation
- Hover and focus states on every interactive element
- `:focus-visible` outlines for keyboard navigation
- `prefers-reduced-motion` media query for accessibility

---

## Challenges & Takeaways

### Challenge 1 — Genuine Flexbox and Grid usage
It's easy to *technically* use Flexbox or Grid without benefiting from it. I made sure each tool was used where it truly fit:
- **Grid for trainers** — because the number of columns should adapt automatically. Solved with `grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr))`.
- **Flexbox for pricing** — because each card needs to stretch to equal height while wrapping to new rows. Solved with `flex: 1 1 280px` and `align-items: stretch`.

### Challenge 2 — Preventing horizontal scroll
Long words, wide tables, and full-bleed elements can silently cause horizontal overflow. I traced this by opening DevTools and identifying the exact element causing overflow, then:
- Applied `overflow-x: hidden` on `html, body`
- Added `min-width: 0` on all elements (fixes flex-item overflow)
- Added `overflow-wrap: break-word` on text elements

### Challenge 3 — Section spacing across breakpoints
Fixed `padding` values looked wrong at different screen sizes. Replaced them with `clamp(4rem, 8vw, 6rem)` — sections breathe on desktop and tighten on mobile automatically.

### Challenge 4 — Keeping the Git history clean
Committing everything at the end produces a terrible history. I planned the commit sequence **before** writing code, then followed it strictly. This meant 15+ small, verifiable commits — exactly what a real developer produces.

### Key Takeaways

1. **Structure before style.** Building the full semantic HTML first made CSS almost trivial.
2. **CSS variables are superpowers.** Changing the accent color from blue to green took 2 seconds — one variable.
3. **`clamp()` reduces media queries.** One `clamp()` handles the entire font-size range instead of 5 breakpoints.
4. **Flexbox and Grid are not competitors.** Flexbox = 1D layouts. Grid = 2D layouts. Knowing *when* to use each matters more than knowing *how*.
5. **Small commits tell the story of your thinking.** A reviewer can read my commit history and understand exactly how I built the site.
6. **Accessibility is not optional.** Every image has descriptive `alt` text. Every form input has a linked `<label>`. Every interactive element has a visible focus state.

---
