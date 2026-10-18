---
marp: true
theme: default
paginate: true
backgroundColor: '#0D1117'
color: '#F5F7FA'
style: |
  section {
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 40px 60px;
    font-size: 22px;
    line-height: 1.5;
  }
  h1 { color: #00E676; font-weight: 800; font-size: 2.2em; }
  h2 { color: #00E676; font-weight: 700; font-size: 1.6em; margin-bottom: 20px; }
  h3 { color: #F5F7FA; font-size: 1.2em; }
  code { background: #161B22; color: #00E676; padding: 2px 8px; border-radius: 4px; font-size: 0.85em; }
  pre { background: #161B22; border-left: 3px solid #00E676; padding: 16px; border-radius: 8px; }
  pre code { background: transparent; padding: 0; }
  a { color: #00E676; }
  strong { color: #00E676; }
  table { border-collapse: collapse; width: 100%; margin-top: 10px; }
  th { background: #00E676; color: #0D1117; padding: 8px 12px; text-align: left; }
  td { padding: 8px 12px; border-bottom: 1px solid #30363D; }
  section::after { color: #8B949E; font-size: 0.7em; }
  blockquote { border-left: 3px solid #00E676; padding-left: 16px; color: #F5F7FA; font-style: italic; }
---

# Pulse Fitness
## React + Tailwind Edition

**Team 7, Group A — Week 2 Assignment**

Nurudeen Abdulsalam · Mayerfeld Consulting Practicum

Live: **nurabsystems.github.io/pulse-fitness**

---

## The One-Liner

> "I evolved my **Week 1 static site** into a **React + Tailwind application** — same content, same look, new architecture."

**Not a new project. An evolution.**

---

## What Changed from Week 1

| Week 1 | Week 2 |
|--------|--------|
| Plain HTML + CSS | React + Vite + Tailwind |
| Static markup | Component-based |
| Hardcoded trainers | Data-driven rendering |
| No interactivity | Filter · Quiz · Ratings · Name capture |

**Preserved in `legacy/` folder — Git history keeps the evolution.**

---

## Tech Stack

- **React 19** — component UI
- **Vite** — build tool
- **Tailwind CSS v4** — utility styling
- **No TypeScript**
- **No extra libraries**

`npm run dev` starts in ~600ms.

---

## Project Structure
