// client/src/components/IntroAnimation.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

export function IntroAnimation({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(true); // Start muted to allow autoplay
  const videoRef = useRef(null);

  useEffect(() => {
    // Auto-dismiss timer (matches your duration)
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 1000);
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

  function toggleAudio() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
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
          {/* Video element (muted initially for autoplay compliance) */}
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
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

          {/* Audio Toggle Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={toggleAudio}
            className="absolute bottom-8 left-8 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-md transition"
          >
            {isMuted ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                Unmute Sound
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                Mute Sound
              </>
            )}
          </motion.button>

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