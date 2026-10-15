// App.jsx — root component
// Holds top-level state (userName, ratings) and composes all sections.

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

  

  // Ratings stored by trainer id: { 'alex-rivera': 5, ... }
  const [ratings, setRatings] = useState({})

  // -------------------------
  // HANDLERS
  // -------------------------


  function handleRate(trainerId, value) {
    setRatings((prev) => ({
      ...prev,
      [trainerId]: value,
    }))
  }

  

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