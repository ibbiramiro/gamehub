'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import SetupScreen    from '@/components/this-or-that/SetupScreen';
import LobbyScreen    from '@/components/this-or-that/LobbyScreen';
import GameplayScreen, { VoteResult } from '@/components/this-or-that/GameplayScreen';
import FinishScreen   from '@/components/this-or-that/FinishScreen';

import type { HostScreen, QuestionPair, Player } from '@/lib/this-or-that/gameData';
import { DEFAULT_PAIRS } from '@/lib/this-or-that/gameData';
import { createTotSession, updateTotSessionStatus } from '@/lib/this-or-that/totSupabase';

/* ── Page transition variants ─────────────────────────────────── */
const variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y:  0 },
  exit:    { opacity: 0, y: -24 },
};

export default function ThisOrThatPage() {
  const [screen, setScreen]   = useState<HostScreen>('setup');
  const [pairs, setPairs]     = useState<QuestionPair[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [results, setResults] = useState<VoteResult[]>([]);

  async function handleSetupStart(selectedPairs: QuestionPair[], count: number) {
    const ordered = [...selectedPairs]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    setPairs(ordered);
    setResults([]);
    
    // Create session in Supabase
    const id = await createTotSession(ordered);
    if (id) {
      setSessionId(id);
      setScreen('lobby');
    } else {
      alert('Failed to create session');
    }
  }

  async function handleStartVoting(connectedPlayers: Player[]) {
    if (!sessionId) return;
    setPlayers(connectedPlayers);
    await updateTotSessionStatus(sessionId, 'playing', 0);
    setScreen('gameplay');
  }

  async function handleFinish(finalResults: VoteResult[]) {
    if (sessionId) {
      await updateTotSessionStatus(sessionId, 'finished');
    }
    setResults(finalResults);
    setScreen('finish');
  }

  function handlePlayAgain() {
    setScreen('setup');
    setSessionId(null);
    setResults([]);
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#121212] overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'setup' && (
          <motion.div key="setup" variants={variants} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.22 }}>
            <SetupScreen onStart={handleSetupStart} />
          </motion.div>
        )}

        {screen === 'lobby' && sessionId && (
          <motion.div key="lobby" variants={variants} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.22 }}>
            <LobbyScreen onStartVoting={handleStartVoting} sessionId={sessionId} />
          </motion.div>
        )}

        {screen === 'gameplay' && sessionId && (
          <motion.div key="gameplay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}>
            <GameplayScreen
              sessionId={sessionId}
              pairs={pairs.length > 0 ? pairs : DEFAULT_PAIRS}
              players={players}
              onFinish={handleFinish}
            />
          </motion.div>
        )}

        {screen === 'finish' && (
          <motion.div key="finish" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}>
            <FinishScreen results={results} onPlayAgain={handlePlayAgain} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
