// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Classes } from "./components/Classes";
import { Trainers } from "./components/Trainers";
import { Pricing } from "./components/Pricing";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Success } from "./pages/Success";
function ScrollToHash() {
  const location = useLocation()
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    if (location.hash) {
      // Fix ESLint warning: defer state update slightly so it's not synchronous
      const loadingTimer = setTimeout(() => setIsScrolling(true), 0)

      const id = location.hash.replace('#', '')
      
      const observer = new MutationObserver((mutations, obs) => {
        const el = document.getElementById(id)
        
        if (el && el.children.length > 0) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' })
          obs.disconnect()
          setIsScrolling(false) // Hide the overlay immediately
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      const fallbackTimer = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' })
        observer.disconnect()
        setIsScrolling(false) // Hide the overlay
      }, 2000)

      return () => {
        observer.disconnect()
        clearTimeout(loadingTimer)
        clearTimeout(fallbackTimer)
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [location])

  return (
    <>
      {isScrolling && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 text-emerald-400">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-emerald-400"></div>
            <p className="text-sm font-semibold tracking-widest uppercase">Loading...</p>
          </div>
        </div>
      )}
    </>
  )
}
function HomePage() {
  const [ratings, setRatings] = useState({});
  const [matchedSpecialty, setMatchedSpecialty] = useState(null);
  const [userName, setUserName] = useState("");

  function handleRate(trainerId, value) {
    setRatings((prev) => ({ ...prev, [trainerId]: value }));
  }

  function handleMatch(specialty) {
    setMatchedSpecialty(specialty);
  }

  function handleNameCapture(name) {
    const trimmed = name?.trim();
    if (trimmed && trimmed.length >= 2) setUserName(trimmed);
  }

  return (
    <main>
      <Hero userName={userName} />
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
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <div className="min-h-screen bg-zinc-950 text-white">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/success" element={<Success />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
