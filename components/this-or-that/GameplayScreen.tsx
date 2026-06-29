'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BarChart2, User, ArrowRight } from 'lucide-react';
import { ElectricHeader } from './SetupScreen';
import type { QuestionPair, Player } from '@/lib/this-or-that/gameData';
import { supabase } from '@/lib/supabase';
import { updateTotSessionStatus, resetAllVotes } from '@/lib/this-or-that/totSupabase';

export interface VoteResult {
  question: QuestionPair;
  tally: VoteTally;
}

interface GameplayScreenProps {
  sessionId: string;
  pairs: QuestionPair[];
  players: Player[];
  onFinish: (results: VoteResult[]) => void;
}

interface VoteTally {
  votes1: number;
  votes2: number;
  total: number;
}

/* ─── Component ─────────────────────────────────────────────────── */
export default function GameplayScreen({ sessionId, pairs, players, onFinish }: GameplayScreenProps) {
  const [qIndex, setQIndex] = useState(0);
  const [tally, setTally]   = useState<VoteTally>({ votes1: 0, votes2: 0, total: 0 });
  const [allVoted, setAllVoted] = useState(false);
  const [results, setResults] = useState<VoteResult[]>([]);

  const pair        = pairs[qIndex];
  const totalPairs  = pairs.length;
  const progress    = ((qIndex) / totalPairs) * 100;
  
  const connectedCount = players.length > 0 ? players.length : 1; // Fallback to 1 if no players (testing mode)

  /* ── Subscribe to votes ───────────────── */
  useEffect(() => {
    // Reset local tally
    setTally({ votes1: 0, votes2: 0, total: 0 });
    setAllVoted(false);
    
    // Fetch initial votes for this question
    const fetchVotes = async () => {
      const { data } = await supabase
        .from('tot_players')
        .select('current_vote')
        .eq('session_id', sessionId);
        
      if (data) {
        let v1 = 0; let v2 = 0;
        data.forEach(p => {
          if (p.current_vote === 'A') v1++;
          if (p.current_vote === 'B') v2++;
        });
        const total = v1 + v2;
        setTally({ votes1: v1, votes2: v2, total });
        if (total >= connectedCount) setAllVoted(true);
      }
    };
    fetchVotes();

    const channel = supabase.channel(`tot_votes_${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tot_players', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          // Re-calculate all votes on update to avoid complex state tracking
          fetchVotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [qIndex, sessionId, connectedCount]);

  /* ── Next question ───────────────────────────────────────────── */
  async function handleNext() {
    const newResults = [...results, { question: pair, tally }];
    setResults(newResults);

    if (qIndex + 1 >= totalPairs) { 
      onFinish(newResults); 
      return; 
    }
    const nextIndex = qIndex + 1;
    await resetAllVotes(sessionId);
    await updateTotSessionStatus(sessionId, 'playing', nextIndex);
    setQIndex(nextIndex);
  }

  // Auto-next after 3 seconds when all players have voted
  useEffect(() => {
    if (allVoted) {
      const timer = setTimeout(() => {
        handleNext();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [allVoted, handleNext]);

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

      {/* ── Auto-next countdown indicator (optional, minimal UI) ───────────────────────────────────────────── */}
      <AnimatePresence>
        {allVoted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#C0F300] text-black px-6 py-2 rounded-full font-bold shadow-[0_0_15px_rgba(192,243,0,0.5)] z-40"
          >
            {qIndex + 1 >= totalPairs ? 'Selesai! Beralih...' : 'Melanjutkan otomatis...'}
          </motion.div>
        )}
      </AnimatePresence>
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
