'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Skull } from 'lucide-react';
import type { CardChoice } from '@/lib/truth-or-dare/gameData';

interface GameplayScreenProps {
  playerName: string;
  choice: CardChoice;
  text: string;            // The question or dare text
  punishment: string;      // The punishment text
  onComplete: () => void;  // SELESAI → next roulette
  onPunishmentAccepted: () => void; // TERIMA HUKUMAN → next roulette
}

/* ─── Theme config ────────────────────────────────────────────── */
const THEMES = {
  truth: {
    color:       '#00FFFF',
    glowColor:   'rgba(0,255,255,0.5)',
    bgColor:     'rgba(0,255,255,0.06)',
    darkBg:      '#0D1A2A',
    label:       'TRUTH',
    headerText:  (name: string) => `${name}, JUJURLAH!`,
    btnText:     '✓ SELESAI',
  },
  dare: {
    color:       '#FF00FF',
    glowColor:   'rgba(255,0,255,0.5)',
    bgColor:     'rgba(255,0,255,0.06)',
    darkBg:      '#1A0D1A',
    label:       'DARE',
    headerText:  (name: string) => `${name}, LAKUKAN!`,
    btnText:     '✓ SELESAI',
  },
};

const PUNISHMENT_THEME = {
  color:     '#FF3333',
  glowColor: 'rgba(255,51,51,0.5)',
  bgColor:   'rgba(255,51,51,0.06)',
  darkBg:    '#1A0808',
};

/* ─── Component ─────────────────────────────────────────────────── */
export default function GameplayScreen({
  playerName,
  choice,
  text,
  punishment,
  onComplete,
  onPunishmentAccepted,
}: GameplayScreenProps) {
  const [showPunishment, setShowPunishment] = useState(false);
  const [isFlipping, setIsFlipping]         = useState(false);

  const theme = THEMES[choice];

  function handleMenyerah() {
    setIsFlipping(true);
    setTimeout(() => {
      setShowPunishment(true);
      setIsFlipping(false);
    }, 400);
  }

  const activeColor   = showPunishment ? PUNISHMENT_THEME.color     : theme.color;
  const activeGlow    = showPunishment ? PUNISHMENT_THEME.glowColor  : theme.glowColor;
  const activeBg      = showPunishment ? PUNISHMENT_THEME.bgColor    : theme.bgColor;
  const activeDarkBg  = showPunishment ? PUNISHMENT_THEME.darkBg     : theme.darkBg;

  return (
    <motion.div
      className="flex flex-col min-h-screen text-white transition-colors duration-500"
      animate={{ backgroundColor: showPunishment ? '#120808' : '#0B1120' }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="pt-10 pb-4 px-5 text-center">
        <AnimatePresence mode="wait">
          <motion.h1
            key={showPunishment ? 'punishment-header' : 'game-header'}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            className="font-black text-2xl uppercase tracking-wider"
            style={{
              color: activeColor,
              textShadow: `0 0 20px ${activeColor}cc`,
            }}
          >
            {showPunishment
              ? `🔥 HUKUMAN UNTUK ${playerName}!`
              : theme.headerText(playerName)}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* ── Card (flip animation) ─────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        {/* 3D flip perspective container */}
        <div style={{ perspective: 1000, width: '100%' }}>
          <motion.div
            animate={{ rotateY: showPunishment ? 180 : 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformStyle: 'preserve-3d', position: 'relative', minHeight: 280 }}
          >
            {/* ─ Front face (gameplay) ─── */}
            <div
              className="absolute inset-0 rounded-2xl border-2 px-6 py-8 flex flex-col
                         items-center justify-center"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderColor: theme.color,
                boxShadow: `0 0 25px ${theme.glowColor}`,
                backgroundColor: theme.darkBg,
              }}
            >
              {/* Tab badge */}
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full
                           font-black text-xs uppercase tracking-widest"
                style={{
                  backgroundColor: theme.color,
                  color: '#000',
                  boxShadow: `0 0 12px ${theme.glowColor}`,
                }}
              >
                {theme.label}
              </div>

              {/* Card text */}
              <motion.p
                key={text}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-white font-bold text-xl text-center leading-snug"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
              >
                "{text}"
              </motion.p>
            </div>

            {/* ─ Back face (punishment) ─── */}
            <div
              className="absolute inset-0 rounded-2xl border-2 px-6 py-8 flex flex-col
                         items-center justify-center gap-4"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                borderColor: PUNISHMENT_THEME.color,
                boxShadow: `0 0 25px ${PUNISHMENT_THEME.glowColor}`,
                backgroundColor: PUNISHMENT_THEME.darkBg,
              }}
            >
              {/* Punishment badge */}
              <div
                className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full
                           font-black text-xs uppercase tracking-widest"
                style={{
                  backgroundColor: PUNISHMENT_THEME.color,
                  color: '#fff',
                  boxShadow: `0 0 12px ${PUNISHMENT_THEME.glowColor}`,
                }}
              >
                ☠️ HUKUMAN
              </div>

              <span className="text-4xl">😱</span>
              <p className="text-white font-bold text-xl text-center leading-snug">
                "{punishment}"
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Action buttons ───────────────────────────────────── */}
      <div className="px-5 pb-10 pt-4 space-y-3">
        <AnimatePresence mode="wait">
          {!showPunishment ? (
            <motion.div
              key="gameplay-btns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-3"
            >
              {/* SELESAI */}
              <motion.button
                id="btn-selesai"
                onClick={onComplete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="w-full py-4 rounded-2xl font-black text-lg uppercase tracking-wider
                           text-black flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: theme.color,
                  boxShadow: `0 0 24px ${theme.glowColor}`,
                }}
              >
                <CheckCircle2 className="w-5 h-5" />
                Selesai
              </motion.button>

              {/* MENYERAH */}
              <motion.button
                id="btn-menyerah"
                onClick={handleMenyerah}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="w-full py-3.5 rounded-2xl font-black text-base uppercase tracking-wider
                           flex items-center justify-center gap-2 border-2 bg-transparent
                           transition-all duration-200"
                style={{
                  borderColor: theme.color,
                  color: theme.color,
                  boxShadow: `0 0 12px ${theme.glowColor}40`,
                }}
              >
                <Skull className="w-5 h-5" />
                Menyerah / Hukuman
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="punishment-btn"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                id="btn-terima-hukuman"
                onClick={onPunishmentAccepted}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                className="w-full py-4 rounded-2xl font-black text-xl uppercase tracking-widest
                           text-white flex items-center justify-center gap-2 transition-all"
                style={{
                  backgroundColor: PUNISHMENT_THEME.color,
                  boxShadow: `0 0 28px ${PUNISHMENT_THEME.glowColor}`,
                }}
              >
                💀 Terima Hukuman
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
