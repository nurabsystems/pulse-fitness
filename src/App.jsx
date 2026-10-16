import { useState, useEffect } from 'react'
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
  const [ratings, setRatings] = useState({})
  const [matchedSpecialty, setMatchedSpecialty] = useState(null)

  // Read saved name once on mount
  const [userName, setUserName] = useState(
    () => localStorage.getItem(STORAGE_KEY) || ''
  )

  // Track if this is a returning visitor
  const [isReturning] = useState(
    () => !!localStorage.getItem(STORAGE_KEY)
  )

  // Persist name to localStorage whenever it changes
  useEffect(() => {
    if (userName) localStorage.setItem(STORAGE_KEY, userName)
  }, [userName])

  function handleRate(trainerId, value) {
    setRatings((prev) => ({ ...prev, [trainerId]: value }))
  }

  function handleMatch(specialty) {
    setMatchedSpecialty(specialty)
  }

  function handleNameCapture(name) {
    const trimmed = name?.trim()
    if (trimmed && trimmed.length >= 2) setUserName(trimmed)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header userName={userName} />
      <main>
        <Hero userName={userName} isReturning={isReturning} />
        <About />
        <Classes />
        <Trainers
          ratings={ratings}
          onRate={handleRate}
          matchedSpecialty={matchedSpecialty}
          onMatch={handleMatch}
          userName={userName}
        />
        <Pricing />
        <Contact userName={userName} onNameCapture={handleNameCapture} />
      </main>
      <Footer />
    </div>
  )
}

export default App