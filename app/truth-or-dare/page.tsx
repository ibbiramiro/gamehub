'use client';

import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import SetupScreen    from '@/components/truth-or-dare/SetupScreen';
import RouletteScreen from '@/components/truth-or-dare/RouletteScreen';
import ChoiceScreen   from '@/components/truth-or-dare/ChoiceScreen';
import GameplayScreen from '@/components/truth-or-dare/GameplayScreen';

import type { GameConfig, CardChoice, TruthDareScreen } from '@/lib/truth-or-dare/gameData';
import { DEFAULT_TRUTHS, DEFAULT_DARES, DEFAULT_PUNISHMENTS, pickRandom, pickRandomExcluding } from '@/lib/truth-or-dare/gameData';

/* ── Page transition ──────────────────────────────────────────── */
const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

export default function TruthOrDarePage() {
  const router = useRouter();

  /* ── State ────────────────────────────────────────────────── */
  const [screen, setScreen]             = useState<TruthDareScreen>('setup');
  const [config, setConfig]             = useState<GameConfig | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [rouletteWinner, setRouletteWinner] = useState('');
  const [prevPlayer, setPrevPlayer]     = useState('');
  const [choice, setChoice]             = useState<CardChoice>('truth');
  const [currentText, setCurrentText]   = useState('');
  const [currentPunishment, setCurrentPunishment] = useState('');

  /* ── Pick the next player (avoid repeating same player) ──── */
  const pickNextPlayer = useCallback((cfg: GameConfig, lastPlayer: string) => {
    if (cfg.playerNames.length === 1) return cfg.playerNames[0];
    return pickRandomExcluding(cfg.playerNames, lastPlayer);
  }, []);

  /* ── Start game from setup ────────────────────────────────── */
  function handleSetupStart(cfg: GameConfig) {
    setConfig(cfg);
    const winner = pickRandom(cfg.playerNames);
    setRouletteWinner(winner);
    setPrevPlayer('');
    setScreen('roulette');
  }

  /* ── Roulette done → choice screen ───────────────────────── */
  function handleRouletteComplete(winner: string) {
    setCurrentPlayer(winner);
    setScreen('choice');
  }

  /* ── Player picks TRUTH or DARE ──────────────────────────── */
  function handleChoice(picked: CardChoice) {
    if (!config) return;
    setChoice(picked);
    const pool = picked === 'truth'
      ? (config.truths.length > 0 ? config.truths : DEFAULT_TRUTHS)
      : (config.dares.length > 0  ? config.dares  : DEFAULT_DARES);
    setCurrentText(pickRandom(pool));
    const punishPool = config.punishments.length > 0
      ? config.punishments
      : DEFAULT_PUNISHMENTS;
    setCurrentPunishment(pickRandom(punishPool));
    setScreen('gameplay');
  }

  /* ── Skip a player's turn ────────────────────────────────── */
  function handleSkip() {
    if (!config) return;
    setPrevPlayer(currentPlayer);
    const next = pickNextPlayer(config, currentPlayer);
    setRouletteWinner(next);
    setScreen('roulette');
  }

  /* ── End game → back to Game Hub home ────────────────────── */
  function handleEndGame() {
    router.push('/');
  }

  /* ── SELESAI or punishment accepted → next roulette ─────── */
  function handleNextRound() {
    if (!config) return;
    setPrevPlayer(currentPlayer);
    const next = pickNextPlayer(config, currentPlayer);
    setRouletteWinner(next);
    setScreen('roulette');
  }

  /* ── Back from setup ─────────────────────────────────────── */
  function handleBack() {
    router.push('/');
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#0B1120] overflow-hidden">
      <AnimatePresence mode="wait">
        {screen === 'setup' && (
          <motion.div key="setup" {...fade} transition={{ duration: 0.2 }}>
            <SetupScreen onStart={handleSetupStart} onBack={handleBack} />
          </motion.div>
        )}

        {screen === 'roulette' && config && (
          <motion.div key={`roulette-${rouletteWinner}`} {...fade} transition={{ duration: 0.2 }}>
            <RouletteScreen
              players={config.playerNames}
              winner={rouletteWinner}
              onContinue={handleRouletteComplete}
            />
          </motion.div>
        )}

        {screen === 'choice' && (
          <motion.div key={`choice-${currentPlayer}`} {...fade} transition={{ duration: 0.2 }}>
            <ChoiceScreen
              playerName={currentPlayer}
              onChoice={handleChoice}
              onSkip={handleSkip}
              onEnd={handleEndGame}
            />
          </motion.div>
        )}

        {screen === 'gameplay' && (
          <motion.div key={`gameplay-${currentPlayer}-${choice}`} {...fade} transition={{ duration: 0.2 }}>
            <GameplayScreen
              playerName={currentPlayer}
              choice={choice}
              text={currentText}
              punishment={currentPunishment}
              onComplete={handleNextRound}
              onPunishmentAccepted={handleNextRound}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
