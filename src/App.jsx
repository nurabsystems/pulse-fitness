// App.jsx — root component
// Holds top-level state (ratings, matched specialty) and composes all sections.

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
  // Trainer ratings keyed by trainer id: { 'alex-rivera': 5, ... }
  const [ratings, setRatings] = useState({})

  // Matched specialty from the quiz — used to highlight trainers
  const [matchedSpecialty, setMatchedSpecialty] = useState(null)

  function handleRate(trainerId, value) {
    setRatings((prev) => ({ ...prev, [trainerId]: value }))
  }

  function handleMatch(specialty) {
    setMatchedSpecialty(specialty)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <main>
        <Hero />
        <About />
        <Classes />
        <Trainers
          ratings={ratings}
          onRate={handleRate}
          matchedSpecialty={matchedSpecialty}
          onMatch={handleMatch}
        />
        <Pricing />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default App