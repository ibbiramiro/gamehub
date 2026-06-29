'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RouletteScreenProps {
  players: string[];
  winner: string;
  onContinue: (winner: string) => void;
}

/* Roulette spin timing: fast → slow → stop */
const SPIN_DELAYS = [
  ...Array(12).fill(55),    // hyper fast
  ...Array(6).fill(90),     // fast
  ...Array(5).fill(140),    // medium
  ...Array(4).fill(220),    // slowing
  ...Array(3).fill(340),    // slow
  ...Array(2).fill(480),    // very slow
  600,                       // final step before winner
];

export default function RouletteScreen({ players, winner, onContinue }: RouletteScreenProps) {
  const [displayName, setDisplayName] = useState(players[0] ?? '?');
  const [spinning, setSpinning]       = useState(true);
  const [done, setDone]               = useState(false);
  const [flash, setFlash]             = useState(false);
  const [nameKey, setNameKey]         = useState(0);

  const spin = useCallback(() => {
    let step = 0;
    let nameIdx = 0;

    function next() {
      // Cycle player names
      nameIdx = (nameIdx + 1) % players.length;
      setDisplayName(players[nameIdx]);
      setNameKey(k => k + 1);
      step++;

      if (step < SPIN_DELAYS.length) {
        setTimeout(next, SPIN_DELAYS[step]);
      } else {
        // Force winner, trigger done state
        setDisplayName(winner);
        setNameKey(k => k + 1);
        setSpinning(false);
        setTimeout(() => {
          setFlash(true);
          setTimeout(() => setFlash(false), 700);
          setTimeout(() => setDone(true), 300);
        }, 200);
      }
    }

    setTimeout(next, SPIN_DELAYS[0]);
  }, [players, winner]);

  useEffect(() => { spin(); }, [spin]);

  return (
    <motion.div
      className="relative flex flex-col min-h-screen items-center justify-center
                 bg-[#0B1120] text-white overflow-hidden"
      animate={{ backgroundColor: flash ? '#161f00' : '#0B1120' }}
      transition={{ duration: 0.15 }}
    >
      {/* Flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 pointer-events-none z-20"
            style={{ backgroundColor: 'rgba(192,243,0,0.35)' }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-12 z-10">
        Menentukan Giliran...
      </p>

      {/* Roulette Circle */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full border-4
                   overflow-hidden mb-12"
        style={{
          width: 280, height: 280,
          borderColor: done ? '#C0F300' : spinning ? '#00FFFF' : '#C0F300',
          boxShadow: done
            ? '0 0 50px rgba(192,243,0,0.8), 0 0 100px rgba(192,243,0,0.4)'
            : '0 0 30px rgba(0,255,255,0.5)',
          transition: 'border-color 0.3s, box-shadow 0.4s',
          backgroundColor: '#141929',
        }}
      >
        {/* Spinning tick marks (decorative) */}
        {!done && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-dashed border-white/5"
          />
        )}

        {/* Name display */}
        <AnimatePresence mode="wait">
          <motion.span
            key={nameKey}
            initial={{ scale: 0.5, opacity: 0, y: spinning ? 20 : 0 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: spinning ? -20 : 0 }}
            transition={{
              duration: spinning ? 0.08 : 0.35,
              type: done ? 'spring' : 'tween',
              stiffness: 300,
              damping: 18,
            }}
            className="font-black text-center uppercase leading-tight px-4"
            style={{
              fontSize: displayName.length > 8 ? '1.8rem' : '2.4rem',
              color: done ? '#C0F300' : spinning ? '#ffffff' : '#C0F300',
              textShadow: done
                ? '0 0 30px rgba(192,243,0,1), 0 0 60px rgba(192,243,0,0.6)'
                : spinning ? 'none' : '0 0 20px rgba(192,243,0,0.8)',
              filter: spinning ? 'blur(0.5px)' : 'none',
              transition: 'color 0.3s, text-shadow 0.3s',
            }}
          >
            {displayName}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Winner label */}
      <AnimatePresence>
        {done && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-8 z-10"
          >
            🎯 Giliran kamu bermain!
          </motion.p>
        )}
      </AnimatePresence>

      {/* LANJUTKAN button */}
      <AnimatePresence>
        {done && (
          <motion.button
            id="btn-roulette-continue"
            key="btn-continue"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.3 }}
            onClick={() => onContinue(winner)}
            className="z-10 px-12 py-4 rounded-2xl font-black text-xl text-black uppercase
                       tracking-widest transition-all duration-150 active:scale-95"
            style={{
              backgroundColor: '#C0F300',
              boxShadow: '0 0 30px rgba(192,243,0,0.7)',
            }}
          >
            LANJUTKAN ▶
          </motion.button>
        )}
      </AnimatePresence>

      {/* Decorative particle rings */}
      {done && (
        <>
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-[#C0F300]/20 pointer-events-none"
              initial={{ width: 280, height: 280, opacity: 0.8 }}
              animate={{ width: 280 + i * 80, height: 280 + i * 80, opacity: 0 }}
              transition={{ duration: 1, delay: i * 0.15, ease: 'easeOut' }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
}
