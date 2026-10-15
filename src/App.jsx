// App.jsx — root component
// Holds top-level state (userName, ratings) and composes all sections.

import { useState } from 'react'
import { Onboarding } from './components/Onboarding'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Classes } from './components/Classes'
import { Trainers } from './components/Trainers'
import { Pricing } from './components/Pricing'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

const STORAGE_KEY = 'pulse-fitness-userName'

function App() {
  // -------------------------
  // STATE
  // -------------------------

  // Lazy initializer — reads localStorage ONCE on first render.
  // If a saved name exists, we skip onboarding entirely.
  const [userName, setUserName] = useState(
    () => localStorage.getItem(STORAGE_KEY) || ''
  )

  // Ratings stored by trainer id: { 'alex-rivera': 5, ... }
  const [ratings, setRatings] = useState({})

  // -------------------------
  // HANDLERS
  // -------------------------

  function handleOnboardingComplete(name) {
    setUserName(name)
    localStorage.setItem(STORAGE_KEY, name)
  }

  function handleRate(trainerId, value) {
    setRatings((prev) => ({
      ...prev,
      [trainerId]: value,
    }))
  }

  function handleReset() {
    // Optional: a way to clear the name (for demo/assessment)
    localStorage.removeItem(STORAGE_KEY)
    setUserName('')
    setRatings({})
  }

  // -------------------------
  // CONDITIONAL RENDER
  // -------------------------

  // If no name yet → show onboarding only
  if (!userName) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  // Otherwise → render the full app
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header userName={userName} onReset={handleReset} />

      <main>
        <Hero userName={userName} />
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