'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import SetupScreen    from '@/components/this-or-that/SetupScreen';
import LobbyScreen    from '@/components/this-or-that/LobbyScreen';
import GameplayScreen from '@/components/this-or-that/GameplayScreen';

import type { HostScreen, QuestionPair, Player } from '@/lib/this-or-that/gameData';
import { DEFAULT_PAIRS } from '@/lib/this-or-that/gameData';

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

  function handleSetupStart(selectedPairs: QuestionPair[], count: number) {
    // Shuffle and cap at count
    const ordered = [...selectedPairs]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);
    setPairs(ordered);
    setScreen('lobby');
  }

  function handleStartVoting(connectedPlayers: Player[]) {
    setPlayers(connectedPlayers);
    setScreen('gameplay');
  }

  function handleFinish() {
    // Reset back to setup for now (could navigate to a results screen)
    setScreen('setup');
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

        {screen === 'lobby' && (
          <motion.div key="lobby" variants={variants} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.22 }}>
            <LobbyScreen onStartVoting={handleStartVoting} />
          </motion.div>
        )}

        {screen === 'gameplay' && (
          <motion.div key="gameplay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}>
            <GameplayScreen
              pairs={pairs.length > 0 ? pairs : DEFAULT_PAIRS}
              players={players}
              onFinish={handleFinish}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
