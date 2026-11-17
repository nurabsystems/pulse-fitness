// client/src/components/IntroAnimation.jsx
// Cinematic splash screen using Framer Motion.
// Plays once per session, then dissolves into the homepage.

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export function IntroAnimation({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 3.2 seconds (long enough for the animation sequence)
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 800); // Wait for exit animation before unmounting
    }, 3200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  function handleSkip() {
    setIsVisible(false);
    setTimeout(onFinish, 400); // Shorter exit for skip
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
        >
          {/* Background image with slow pan */}
          <motion.div
            initial={{ scale: 1.2, x: 0 }}
            animate={{ scale: 1.4, x: -60 }}
            transition={{ duration: 5, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: 'url(/images/hero.jpg)' }}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

          {/* Logo + tagline */}
          <div className="relative z-10 text-center px-4">
            <motion.h1
              initial={{ scale: 0.3, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="text-6xl md:text-8xl font-black text-white tracking-tight"
            >
              Pulse<span className="text-emerald-400">Fitness</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 1.5 }}
              className="mt-6 text-lg md:text-xl text-zinc-300 tracking-widest uppercase"
            >
              Train Smart. Live Strong.
            </motion.p>
          </div>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            onClick={handleSkip}
            className="absolute bottom-8 right-8 z-20 text-sm font-semibold text-zinc-400 hover:text-white transition"
          >
            Skip Intro →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}