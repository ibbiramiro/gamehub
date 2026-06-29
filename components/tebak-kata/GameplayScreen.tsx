'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WordResult } from '@/lib/gameTypes';

interface GameplayScreenProps {
  words: string[];
  duration: number;       // seconds
  currentPlayer: string;
  onGameEnd: (results: WordResult[]) => void;
}

type FlashState = 'none' | 'correct' | 'pass';

const TILT_THRESHOLD = 35;      // degrees
const COOLDOWN_MS    = 1200;    // ms between tilt triggers

export default function GameplayScreen({
  words,
  duration,
  currentPlayer,
  onGameEnd,
}: GameplayScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft]         = useState(duration);
  const [results, setResults]           = useState<WordResult[]>([]);
  const [flash, setFlash]               = useState<FlashState>('none');
  const [showWord, setShowWord]         = useState(true);
  const [activeWords, setActiveWords]   = useState<string[]>(words);

  const cooldownRef = useRef(false);
  const endCalledRef = useRef(false);

  /* ── End game ────────────────────────────────────────────────── */
  const endGame = useCallback(
    (finalResults: WordResult[]) => {
      if (endCalledRef.current) return;
      endCalledRef.current = true;
      onGameEnd(finalResults);
    },
    [onGameEnd],
  );

  /* ── Advance word ─────────────────────────────────────────────── */
  const advance = useCallback(
    (status: 'correct' | 'pass') => {
      if (cooldownRef.current) return;
      cooldownRef.current = true;

      const word = activeWords[currentIndex];
      const newResults = [...results, { word, status }];
      setResults(newResults);

      let nextWords = activeWords;
      if (status === 'pass') {
        nextWords = [...activeWords, word];
        setActiveWords(nextWords);
      }

      // Flash
      setFlash(status);
      setTimeout(() => setFlash('none'), 500);

      // Word transition
      setShowWord(false);
      setTimeout(() => {
        const nextIndex = currentIndex + 1;
        if (nextIndex >= nextWords.length) {
          endGame(newResults);
        } else {
          setCurrentIndex(nextIndex);
          setShowWord(true);
        }
        cooldownRef.current = false;
      }, 300);
    },
    [currentIndex, results, activeWords, endGame],
  );

  /* ── Timer countdown ────────────────────────────────────────── */
  useEffect(() => {
    if (timeLeft <= 0) {
      endGame(results);
      return;
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, results, endGame]);

  /* ── DeviceMotion (accelerometer for tilt) ───────────────────────────────── */
  useEffect(() => {
    async function requestAndListen() {
      // iOS 13+ requires permission
      if (
        typeof DeviceMotionEvent !== 'undefined' &&
        // @ts-expect-error
        typeof DeviceMotionEvent.requestPermission === 'function'
      ) {
        try {
          // @ts-expect-error
          const perm = await DeviceMotionEvent.requestPermission();
          if (perm !== 'granted') {
            // Coba juga DeviceOrientation jika DeviceMotion gagal
            if (typeof DeviceOrientationEvent !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
              const perm2 = await (DeviceOrientationEvent as any).requestPermission();
              if (perm2 !== 'granted') return;
            } else {
              return;
            }
          }
        } catch {
          return;
        }
      }

      function handler(e: DeviceMotionEvent) {
        const x = e.accelerationIncludingGravity?.x ?? 0;
        const y = e.accelerationIncludingGravity?.y ?? 0;
        const z = e.accelerationIncludingGravity?.z ?? 0;

        const absY = Math.abs(y);

        // Benar: Flip ke bawah (layar hadap lantai/hidung)
        // Layar menghadap lantai berarti sumbu Z mengarah ke atas (melawan gravitasi).
        // z akan mendekati -9.8. Kita gunakan z < -8.0 agar benar-benar harus menghadap bawah.
        if (z < -8.0) {
          advance('correct');
        } 
        // Pass: Geser/Tilt Kiri Kanan (seperti setir mobil)
        // Saat dimiringkan ke kiri/kanan, gravitasi berpindah ke sumbu Y.
        else if (absY > 6.0) {
          advance('pass');
        }
      }

      window.addEventListener('devicemotion', handler);
      return () => window.removeEventListener('devicemotion', handler);
    }

    const cleanup = requestAndListen();
    return () => { cleanup.then(fn => fn && fn()); };
  }, [advance]);

  /* ── Keyboard fallback (desktop testing) ────────────────────── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowUp')   advance('correct');
      if (e.key === 'ArrowDown') advance('pass');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance]);

  /* ── Derived ─────────────────────────────────────────────────── */
  const progress    = timeLeft / duration;
  const wordCount   = `${results.length + 1}/${activeWords.length}`;
  const minutes     = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds     = (timeLeft % 60).toString().padStart(2, '0');
  const timerStr    = `${minutes}:${seconds}`;
  const isUrgent    = timeLeft <= 10;

  /* ── Flash background ───────────────────────────────────────── */
  const flashColors: Record<FlashState, string> = {
    none:    '#121212',
    correct: '#1a3300',
    pass:    '#330011',
  };

  return (
    <motion.div
      animate={{ backgroundColor: flashColors[flash] }}
      transition={{ duration: 0.15 }}
      className="relative flex flex-col min-h-screen overflow-hidden"
      style={{ backgroundColor: '#121212' }}
    >
      {/* ── Progress bar ─────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-800 z-10">
        <motion.div
          className="h-full"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: 'linear' }}
          style={{
            background: isUrgent ? '#FF3366' : '#C0F300',
            boxShadow: isUrgent
              ? '0 0 10px rgba(255,51,102,0.8)'
              : '0 0 10px rgba(192,243,0,0.8)',
          }}
        />
      </div>

      {/* ── Top bar ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-2 z-10">
        {/* Word counter */}
        <span className="text-white font-bold text-xl">{wordCount}</span>

        {/* Player name */}
        <span className="text-gray-500 text-sm font-medium">{currentPlayer}</span>

        {/* Timer */}
        <motion.span
          animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
          className="font-black text-2xl tabular-nums"
          style={{
            color: isUrgent ? '#FF3366' : '#C0F300',
            textShadow: isUrgent
              ? '0 0 16px rgba(255,51,102,0.8)'
              : '0 0 16px rgba(192,243,0,0.8)',
          }}
        >
          {timerStr}
        </motion.span>
      </div>

      {/* ── Main word display ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {showWord && (
            <motion.h2
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.7, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="text-center font-black uppercase leading-none text-[#C0F300]"
              style={{
                fontSize: 'clamp(3rem, 12vw, 7rem)',
                textShadow:
                  '0 0 30px rgba(192,243,0,0.9), 0 0 60px rgba(192,243,0,0.5), 0 0 4px rgba(192,243,0,1)',
                wordBreak: 'break-word',
              }}
            >
              {words[currentIndex]}
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      {/* ── Flash overlay ─────────────────────────────────────── */}
      <AnimatePresence>
        {flash !== 'none' && (
          <motion.div
            key={flash}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              backgroundColor: flash === 'correct' ? 'rgba(192,243,0,0.25)' : 'rgba(255,51,102,0.25)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Bottom tap buttons (landscape UX) ─────────────────── */}
      <div className="flex gap-3 px-6 pb-6 z-10">
        <button
          id="btn-pass"
          onClick={() => advance('pass')}
          className="flex-1 py-4 rounded-2xl font-black text-base uppercase tracking-wider
                     border-2 border-red-500/60 text-red-400 hover:bg-red-500/10
                     active:scale-95 transition-all duration-150"
          style={{ boxShadow: '0 0 10px rgba(255,51,102,0.3)' }}
        >
          ✗ Lewat
        </button>
        <button
          id="btn-correct"
          onClick={() => advance('correct')}
          className="flex-1 py-4 rounded-2xl font-black text-base uppercase tracking-wider
                     border-2 text-black active:scale-95 transition-all duration-150"
          style={{
            backgroundColor: '#C0F300',
            borderColor: '#C0F300',
            boxShadow: '0 0 16px rgba(192,243,0,0.6)',
          }}
        >
          ✓ Benar
        </button>
      </div>

      {/* ── Instructions ──────────────────────────────────────── */}
      <div className="pb-4 z-10 text-center space-y-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Miringkan Atas/Bawah ={' '}
          <span className="font-bold" style={{ color: '#C0F300' }}>Benar</span>
        </p>
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          Miringkan Kiri/Kanan ={' '}
          <span className="font-bold text-red-400">Lewat</span>
        </p>
      </div>
    </motion.div>
  );
}
