// App.jsx — root component
// Holds top-level state (ratings) and composes all sections.

import { useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Classes } from './components/Classes'
import { Trainers } from './components/Trainers'
import { Pricing } from './components/Pricing'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

function App() {
  // -------------------------
  // STATE
  // -------------------------

  // ratings is an object: { 'alex-rivera': 5, 'maya-chen': 4 }
  // Empty object = no user ratings yet — components fall back to default
  const [ratings, setRatings] = useState({})

  // -------------------------
  // HANDLERS
  // -------------------------

  // Called when a user clicks a star on any trainer card.
  // Uses functional update pattern to avoid stale state issues.
  function handleRate(trainerId, value) {
    setRatings((prev) => ({
      ...prev,
      [trainerId]: value,
    }))
  }

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <main>
        <Hero />
        <About />
        <Classes />
        <Trainers ratings={ratings} onRate={handleRate} />
        <Pricing />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default App