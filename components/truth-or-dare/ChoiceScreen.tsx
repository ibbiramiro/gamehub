'use client';

import { motion } from 'framer-motion';
import type { CardChoice } from '@/lib/truth-or-dare/gameData';

interface ChoiceScreenProps {
  playerName: string;
  onChoice: (choice: CardChoice) => void;
  onSkip: () => void;
  onEnd: () => void;
}

export default function ChoiceScreen({ playerName, onChoice, onSkip, onEnd }: ChoiceScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120] text-white">
      {/* ── Header – Player name ─────────────────────────────── */}
      <div className="flex flex-col items-center pt-12 pb-6 px-4">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.25em] mb-2">
          Giliran:
        </p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="font-black uppercase leading-none text-center"
          style={{
            fontSize: playerName.length > 8 ? '3.5rem' : '4.5rem',
            color: '#C0F300',
            textShadow:
              '0 0 30px rgba(192,243,0,0.9), 0 0 60px rgba(192,243,0,0.5)',
          }}
        >
          {playerName}!
        </motion.h1>
      </div>

      {/* ── Choice Cards ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col gap-5 px-5 pb-4 justify-center">

        {/* TRUTH card */}
        <motion.button
          id="btn-choose-truth"
          onClick={() => onChoice('truth')}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 22 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="flex-1 min-h-[170px] rounded-2xl bg-[#0D1A2A] border-2 border-[#00FFFF]
                     flex flex-col items-center justify-center gap-3 relative overflow-hidden
                     active:brightness-125 transition-all"
          style={{
            boxShadow:
              '0 0 30px rgba(0,255,255,0.45), inset 0 0 60px rgba(0,255,255,0.06)',
          }}
        >
          {/* Glow pulse */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ backgroundColor: 'rgba(0,255,255,0.08)' }}
          />
          <span className="text-5xl">🤔</span>
          <span
            className="font-black text-5xl uppercase tracking-wider"
            style={{
              color: '#00FFFF',
              textShadow: '0 0 25px rgba(0,255,255,0.9), 0 0 8px rgba(0,255,255,1)',
            }}
          >
            TRUTH
          </span>
          <p className="text-gray-400 text-sm text-center px-6">
            Jawab sejujurnya atau kena hukuman.
          </p>
        </motion.button>

        {/* DARE card */}
        <motion.button
          id="btn-choose-dare"
          onClick={() => onChoice('dare')}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 220, damping: 22 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="flex-1 min-h-[170px] rounded-2xl bg-[#1A0D1A] border-2 border-[#FF00FF]
                     flex flex-col items-center justify-center gap-3 relative overflow-hidden
                     active:brightness-125 transition-all"
          style={{
            boxShadow:
              '0 0 30px rgba(255,0,255,0.45), inset 0 0 60px rgba(255,0,255,0.06)',
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            style={{ backgroundColor: 'rgba(255,0,255,0.08)' }}
          />
          <span className="text-5xl">😈</span>
          <span
            className="font-black text-5xl uppercase tracking-wider"
            style={{
              color: '#FF00FF',
              textShadow: '0 0 25px rgba(255,0,255,0.9), 0 0 8px rgba(255,0,255,1)',
            }}
          >
            DARE
          </span>
          <p className="text-gray-400 text-sm text-center px-6">
            Lakukan tantangan gila ini.
          </p>
        </motion.button>
      </div>

      {/* ── Ghost footer buttons ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex items-center justify-around px-6 pb-10 pt-2"
      >
        <button
          id="btn-skip-turn"
          onClick={onSkip}
          className="font-bold text-sm text-gray-500 uppercase tracking-widest
                     hover:text-[#C0F300] transition-colors duration-200 px-4 py-2"
        >
          Lewati Giliran
        </button>
        <button
          id="btn-end-game"
          onClick={onEnd}
          className="font-bold text-sm text-red-500 uppercase tracking-widest
                     hover:text-red-400 transition-colors duration-200 px-4 py-2"
        >
          Akhiri Game
        </button>
      </motion.div>
    </div>
  );
}
