'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/* ─── Mock question for standalone demo ─────────────────────────── */
const DEMO_QUESTION = {
  option1: 'PANTAI CHILL',
  option2: 'CLUBBING SERU',
};

interface PlayerVoteScreenProps {
  option1?: string;
  option2?: string;
}

type VoteState = 'voting' | 'waiting';

export default function PlayerVoteScreen({
  option1 = DEMO_QUESTION.option1,
  option2 = DEMO_QUESTION.option2,
}: PlayerVoteScreenProps) {
  const [state, setState]   = useState<VoteState>('voting');
  const [chosen, setChosen] = useState<1 | 2 | null>(null);

  function handleVote(choice: 1 | 2) {
    if (state !== 'voting') return;
    setChosen(choice);
    setState('waiting');
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#121212] relative">
      <AnimatePresence mode="wait">
        {state === 'voting' ? (
          /* ── Split voting interface ──────────────────────────── */
          <motion.div
            key="voting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full flex flex-col"
          >
            {/* THIS – top half */}
            <motion.button
              id="btn-vote-1"
              onClick={() => handleVote(1)}
              className="flex-1 w-full flex flex-col items-center justify-center
                         cursor-pointer select-none bg-[#121212] active:bg-[#001f2a]
                         transition-colors duration-100"
              style={{
                outline: '3px solid #00E5FF',
                outlineOffset: '-3px',
                boxShadow: 'inset 0 0 40px rgba(0,229,255,0.08)',
              }}
              whileTap={{ scale: 0.97 }}
              aria-label={`Pilih ${option1}`}
            >
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-4">
                THIS
              </span>
              <h2
                className="font-black text-4xl uppercase text-center px-6 leading-tight"
                style={{
                  color: '#00E5FF',
                  textShadow: '0 0 30px rgba(0,229,255,0.6), 0 0 8px rgba(0,229,255,0.4)',
                }}
              >
                {option1}
              </h2>
              <p className="text-gray-600 text-sm mt-4">TAP UNTUK PILIH</p>
            </motion.button>

            {/* VS divider */}
            <div className="h-0 relative z-10 flex items-center justify-center">
              <div
                className="absolute bg-[#121212] px-4 py-1.5 rounded-full border border-gray-700
                           font-black text-sm text-gray-400 tracking-widest"
              >
                VS
              </div>
            </div>

            {/* THAT – bottom half */}
            <motion.button
              id="btn-vote-2"
              onClick={() => handleVote(2)}
              className="flex-1 w-full flex flex-col items-center justify-center
                         cursor-pointer select-none bg-[#121212] active:bg-[#1f0a00]
                         transition-colors duration-100"
              style={{
                outline: '3px solid #FF6D00',
                outlineOffset: '-3px',
                boxShadow: 'inset 0 0 40px rgba(255,109,0,0.08)',
              }}
              whileTap={{ scale: 0.97 }}
              aria-label={`Pilih ${option2}`}
            >
              <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-4">
                THAT
              </span>
              <h2
                className="font-black text-4xl uppercase text-center px-6 leading-tight"
                style={{
                  color: '#FF6D00',
                  textShadow: '0 0 30px rgba(255,109,0,0.6), 0 0 8px rgba(255,109,0,0.4)',
                }}
              >
                {option2}
              </h2>
              <p className="text-gray-600 text-sm mt-4">TAP UNTUK PILIH</p>
            </motion.button>
          </motion.div>
        ) : (
          /* ── Waiting state ───────────────────────────────────── */
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col items-center justify-center px-8 text-center
                       bg-[#1A1A1A]"
          >
            {/* Chosen badge */}
            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
              className="mb-8 px-6 py-3 rounded-2xl font-black text-2xl uppercase"
              style={{
                backgroundColor: chosen === 1 ? 'rgba(0,229,255,0.15)' : 'rgba(255,109,0,0.15)',
                border: `2px solid ${chosen === 1 ? '#00E5FF' : '#FF6D00'}`,
                color: chosen === 1 ? '#00E5FF' : '#FF6D00',
                boxShadow: `0 0 20px ${chosen === 1 ? 'rgba(0,229,255,0.3)' : 'rgba(255,109,0,0.3)'}`,
              }}
            >
              ✓ {chosen === 1 ? option1 : option2}
            </motion.div>

            {/* Spinner */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="mb-6"
            >
              <Loader2 className="w-12 h-12 text-gray-600" />
            </motion.div>

            {/* Lock message */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white font-black text-xl mb-3"
            >
              Pilihanmu Terkunci! 🔒
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-gray-500 text-sm leading-relaxed max-w-[80%]"
            >
              Menunggu host dan pemain lain untuk menyelesaikan pilihan mereka...
            </motion.p>

            {/* Dots animation */}
            <div className="flex gap-2 mt-8">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-gray-700"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
