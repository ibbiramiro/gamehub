'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerScreenProps {
  timeLimitMinutes: number;
  onTimeUp: () => void;
  onSkipTimer: () => void; // Used for "Vote" button
  firstPlayerName?: string; // Optional, to show who starts asking
}

export default function TimerScreen({ timeLimitMinutes, onTimeUp, onSkipTimer, firstPlayerName = "Everyone" }: TimerScreenProps) {
  const [showPreState, setShowPreState] = useState(true);
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const [isPaused, setIsPaused] = useState(false);

  // Pre-state timer (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreState(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Main countdown timer
  useEffect(() => {
    if (showPreState || isPaused) return;
    
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [showPreState, isPaused, timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-[#121212] text-white">
      {/* ── Background with Grid Overlay ───────────────────────── */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <AnimatePresence mode="wait">
        {showPreState ? (
          /* ── Pre-Timer State ───────────────────────────────────── */
          <motion.div
            key="pre-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            className="absolute inset-0 flex items-center justify-start p-10 z-10"
          >
            <h1 className="text-6xl font-black tracking-tighter uppercase leading-[1.1] drop-shadow-2xl text-left">
              THE<br/>MOMENT<br/>OF TRUTH<br/>..
            </h1>
          </motion.div>
        ) : (
          /* ── Active Timer State ────────────────────────────────── */
          <motion.div
            key="active-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex flex-col h-screen"
          >
            {/* Header */}
            <header className="pt-20 text-center">
              <h2 className="text-3xl font-black">{firstPlayerName}</h2>
              <p className="text-gray-400 font-bold mt-1">Starts Asking!</p>
            </header>

            {/* Timer Display */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-20">
              <h1 className="text-5xl font-black tracking-tight mb-2" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
                Fake<span className="text-[#FFD500]">i</span>t
              </h1>
              <div className="text-[100px] font-black tabular-nums tracking-tighter leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </div>
            </div>

            {/* Footer Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#121212] via-[#121212]/90 to-transparent pt-10">
              {isPaused ? (
                <div className="flex gap-4">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsPaused(false)}
                    className="flex-1 py-5 rounded-full bg-white text-black text-xl font-black shadow-lg"
                  >
                    Resume
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSkipTimer}
                    className="flex-1 py-5 rounded-full bg-white text-black text-xl font-black shadow-lg"
                  >
                    Vote
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsPaused(true)}
                  className="w-full py-5 rounded-full bg-white text-black text-xl font-black shadow-lg"
                >
                  Pause
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
