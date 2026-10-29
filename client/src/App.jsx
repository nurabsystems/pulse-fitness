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
  const location = useLocation();

  useEffect(() => {
    // If there's a hash in the URL (e.g., #pricing)
    if (location.hash) {
      const id = location.hash.replace("#", "");

      // We use a small delay AND requestAnimationFrame to ensure
      // all images and components have finished rendering
      const timeoutId = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300); // 300ms is usually enough for the images to load

      return () => clearTimeout(timeoutId);
    } else {
      // If there's no hash, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]); // This runs every time the URL changes

  return null;
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
