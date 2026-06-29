'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BarChart2, User, ArrowRight } from 'lucide-react';
import { ElectricHeader } from './SetupScreen';
import type { QuestionPair, Player } from '@/lib/this-or-that/gameData';

interface GameplayScreenProps {
  pairs: QuestionPair[];
  players: Player[];
  onFinish: () => void;
}

interface VoteTally {
  votes1: number;
  votes2: number;
  total: number;
}

/* ─── Component ─────────────────────────────────────────────────── */
export default function GameplayScreen({ pairs, players, onFinish }: GameplayScreenProps) {
  const [qIndex, setQIndex] = useState(0);
  const [tally, setTally]   = useState<VoteTally>({ votes1: 0, votes2: 0, total: 0 });
  const [allVoted, setAllVoted] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'ranks' | 'profile'>('home');
  const simulateRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const pair        = pairs[qIndex];
  const totalPairs  = pairs.length;
  const progress    = ((qIndex) / totalPairs) * 100;

  /* ── Simulate votes coming in over ~3 seconds ───────────────── */
  const simulateVotes = useCallback(() => {
    setTally({ votes1: 0, votes2: 0, total: 0 });
    setAllVoted(false);

    // Clear previous timers
    simulateRef.current.forEach(clearTimeout);
    simulateRef.current = [];

    const n = players.length || 5;
    const delays = Array.from({ length: n }, (_, i) =>
      500 + Math.floor(Math.random() * 3000 * (i + 1) / n),
    ).sort((a, b) => a - b);

    delays.forEach((delay, i) => {
      const t = setTimeout(() => {
        const vote = Math.random() > 0.4 ? 1 : 2; // bias toward option 1
        setTally(prev => {
          const v1 = prev.votes1 + (vote === 1 ? 1 : 0);
          const v2 = prev.votes2 + (vote === 2 ? 1 : 0);
          const total = v1 + v2;
          if (total >= n) setAllVoted(true);
          return { votes1: v1, votes2: v2, total };
        });
      }, delay);
      simulateRef.current.push(t);
    });
  }, [players.length]);

  useEffect(() => {
    simulateVotes();
    return () => simulateRef.current.forEach(clearTimeout);
  }, [qIndex, simulateVotes]);

  /* ── Next question ───────────────────────────────────────────── */
  function handleNext() {
    if (qIndex + 1 >= totalPairs) { onFinish(); return; }
    setQIndex(i => i + 1);
  }

  /* ── Percentage maths ───────────────────────────────────────── */
  const total = tally.total || 1;
  const pct1  = Math.round((tally.votes1 / total) * 100);
  const pct2  = Math.round((tally.votes2 / total) * 100);

  if (!pair) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <ElectricHeader />

      {/* ── Sub-header ───────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-1 border-b border-gray-800">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
          Mending Yang Mana? (Choose Your Vibe)
        </p>
      </div>

      {/* ── Progress bar ─────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-1 space-y-1">
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: '#C0F300', boxShadow: '0 0 8px rgba(192,243,0,0.6)' }}
          />
        </div>
        <div className="flex justify-end">
          <span className="text-xs font-black" style={{ color: '#C0F300' }}>
            QUESTION {qIndex + 1}/{totalPairs}
          </span>
        </div>
      </div>

      {/* ── Cards ────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col px-4 pb-4 pt-2 gap-4 overflow-y-auto pb-36"
        >
          {/* THIS Card (Cyan) */}
          <VoteCard
            label="THIS"
            text={pair.option1}
            desc={pair.desc1}
            color="#00E5FF"
            glowColor="rgba(0,229,255,0.35)"
            votes={tally.votes1}
            pct={pct1}
            total={tally.total}
          />

          {/* THAT Card (Orange) */}
          <VoteCard
            label="THAT"
            text={pair.option2}
            desc={pair.desc2}
            color="#FF6D00"
            glowColor="rgba(255,109,0,0.35)"
            votes={tally.votes2}
            pct={pct2}
            total={tally.total}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Footer ───────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-30">
        {/* Bottom nav */}
        <nav className="bg-[#1A1A1A] border-t border-gray-800">
          <div className="flex items-center justify-around px-2 py-2">
            {(
              [
                { id: 'home' as const,    Icon: Home,       label: 'Home'    },
                { id: 'ranks' as const,   Icon: BarChart2,  label: 'Ranks'   },
                { id: 'profile' as const, Icon: User,       label: 'Profile' },
              ] as const
            ).map(({ id, Icon, label }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  id={`nav-gp-${id}`}
                  onClick={() => setActiveTab(id)}
                  className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all
                    ${isActive
                      ? 'bg-[#C0F300] shadow-[0_0_12px_rgba(192,243,0,0.5)]'
                      : 'text-gray-400 hover:text-gray-200'}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-black' : ''}`} strokeWidth={isActive ? 2.4 : 1.8} />
                  <span className={`text-xs font-bold ${isActive ? 'text-black' : ''}`}>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* "Next" button — appears only when all voted */}
        <AnimatePresence>
          {allVoted && (
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="absolute bottom-full left-0 right-0 px-4 pb-2"
            >
              <button
                id="btn-next-question"
                onClick={handleNext}
                className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest
                           text-black flex items-center justify-center gap-2
                           transition-all duration-150 active:scale-95"
                style={{
                  backgroundColor: '#C0F300',
                  boxShadow: '0 0 20px rgba(192,243,0,0.6)',
                }}
              >
                {qIndex + 1 >= totalPairs
                  ? '🏆 Lihat Hasil Akhir'
                  : `Lanjut ke Pertanyaan Berikutnya`}
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── VoteCard ───────────────────────────────────────────────────── */
interface VoteCardProps {
  label: string;
  text: string;
  desc: string;
  color: string;
  glowColor: string;
  votes: number;
  pct: number;
  total: number;
}

function VoteCard({ label, text, desc, color, glowColor, votes, pct, total }: VoteCardProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden flex-1 min-h-[200px] flex flex-col
                 justify-center items-center text-center px-5 py-6 border-2 bg-[#1A1A1A]"
      style={{
        borderColor: color,
        boxShadow: `0 0 18px 2px ${glowColor}`,
      }}
    >
      {/* Vote fill overlay */}
      <motion.div
        className="absolute inset-0 origin-bottom pointer-events-none"
        animate={{ scaleY: total > 0 ? pct / 100 : 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{ backgroundColor: `${color}22` }}
      />

      {/* Label badge */}
      <span
        className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest
                   px-2 py-0.5 rounded-full"
        style={{ backgroundColor: `${color}30`, color, border: `1px solid ${color}60` }}
      >
        {label}
      </span>

      {/* Vote percentage (shown when votes > 0) */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 right-3 text-right"
        >
          <p className="font-black text-2xl" style={{ color }}>
            {pct}%
          </p>
          <p className="text-xs text-gray-400 font-medium leading-tight">
            {votes} suara
          </p>
        </motion.div>
      )}

      {/* Main text */}
      <h2
        className="relative font-black text-4xl uppercase leading-tight tracking-tight"
        style={{
          color,
          textShadow: `0 0 20px ${glowColor}, 0 0 4px ${color}`,
        }}
      >
        {text}
      </h2>

      {/* Description */}
      {desc && (
        <p className="relative text-gray-400 text-sm mt-3 leading-relaxed max-w-[90%]">
          {desc}
        </p>
      )}
    </div>
  );
}
