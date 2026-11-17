// client/src/components/IntroAnimation.jsx
// Cinematic splash screen using your custom gym video.
// Plays a 15-second intro, then dissolves into the homepage.

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export function IntroAnimation({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // Auto-dismiss after 15 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 1000); // 1s exit fade
    }, 28100);

    return () => clearTimeout(timer);
  }, [onFinish]);

  function handleSkip() {
    setIsVisible(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setTimeout(onFinish, 500);
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden"
        >
          {/* Your custom gym video — muted required for autoplay */}
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            loop={false}
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            src="/videos/pulse-fitness-compressed.mp4"
          />

          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />

          {/* Logo + tagline */}
          <div className="relative z-10 text-center px-4">
            <motion.h1
              initial={{ scale: 0.3, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="text-6xl md:text-8xl font-black text-white tracking-tight"
            >
              Pulse<span className="text-emerald-400">Fitness</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 2 }}
              className="mt-6 text-lg md:text-xl text-zinc-300 tracking-widest uppercase"
            >
              Train Smart. Live Strong.
            </motion.p>
          </div>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
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