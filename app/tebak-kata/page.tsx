'use client';

import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import HomeScreen        from '@/components/tebak-kata/HomeScreen';
import CustomCategoryScreen from '@/components/tebak-kata/CustomCategoryScreen';
import RotateScreen      from '@/components/tebak-kata/RotateScreen';
import GameplayScreen    from '@/components/tebak-kata/GameplayScreen';
import ResultsScreen     from '@/components/tebak-kata/ResultsScreen';

import type {
  GameScreen, Category, WordResult, LeaderboardEntry, CustomDeck,
} from '@/lib/gameTypes';
import { CATEGORIES, shuffle } from '@/lib/gameData';

/* ── Page transition variants ─────────────────────────────────── */
const variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y:  0 },
  exit:    { opacity: 0, y: -20 },
};

const LS_KEY = 'tebak-kata-leaderboard';

function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveLeaderboard(lb: LeaderboardEntry[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_KEY, JSON.stringify(lb));
}

export default function TebakKataPage() {
  /* ── Navigation state ─────────────────────────────────────── */
  const [screen, setScreen]               = useState<GameScreen>('home');
  const [homeTab, setHomeTab]             = useState<'home' | 'ranks' | 'settings'>('home');

  /* ── Player state ─────────────────────────────────────────── */
  const [players, setPlayers]             = useState<string[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);

  /* ── Game settings ────────────────────────────────────────── */
  const [duration, setDuration]           = useState<30 | 60>(60);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  /* ── Gameplay state ───────────────────────────────────────── */
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [wordResults, setWordResults]     = useState<WordResult[]>([]);

  /* ── Leaderboard ──────────────────────────────────────────── */
  const [leaderboard, setLeaderboard]     = useState<LeaderboardEntry[]>([]);

  // Hydrate leaderboard from localStorage
  useEffect(() => { setLeaderboard(loadLeaderboard()); }, []);

  /* ── Player helpers ───────────────────────────────────────── */
  function addPlayer(name: string) {
    if (players.includes(name)) return;
    setPlayers(p => [...p, name]);
  }
  function removePlayer(index: number) {
    setPlayers(p => p.filter((_, i) => i !== index));
    setCurrentPlayerIdx(idx => (index <= idx && idx > 0 ? idx - 1 : idx));
  }

  /* ── Start game with a category ──────────────────────────── */
  function startWithCategory(cat: Category) {
    setSelectedCategory(cat);
    setShuffledWords(shuffle(cat.words).slice(0, 10));
    setWordResults([]);
    setScreen('rotate');
  }

  /* ── Custom deck play ─────────────────────────────────────── */
  function startCustomDeck(deck: CustomDeck) {
    const customCat: Category = {
      id:        'custom',
      name:      deck.name.toUpperCase(),
      iconName:  'Zap',
      color:     '#C0F300',
      glowColor: 'rgba(192,243,0,0.4)',
      words:     deck.words,
    };
    setSelectedCategory(customCat);
    setShuffledWords(shuffle(deck.words).slice(0, Math.min(deck.words.length, 15)));
    setWordResults([]);
    setScreen('rotate');
  }

  /* ── Landscape detected → start gameplay ─────────────────── */
  const onLandscapeDetected = useCallback(() => {
    setScreen('gameplay');
  }, []);

  /* ── Game ends ────────────────────────────────────────────── */
  function handleGameEnd(results: WordResult[]) {
    setWordResults(results);

    // Update leaderboard
    const playerName = players[currentPlayerIdx] ?? 'Pemain';
    const score      = results.filter(r => r.status === 'correct').length;

    setLeaderboard(prev => {
      const next  = [...prev];
      const entry = next.find(e => e.name === playerName);
      if (entry) { entry.totalScore += score; }
      else        { next.push({ name: playerName, totalScore: score }); }
      saveLeaderboard(next);
      return next;
    });

    setScreen('results');
  }

  /* ── Play again (same category, next player) ─────────────── */
  function handlePlayAgain() {
    if (!selectedCategory) { setScreen('home'); return; }
    // Advance to next player
    const nextIdx = (currentPlayerIdx + 1) % Math.max(players.length, 1);
    setCurrentPlayerIdx(nextIdx);
    setShuffledWords(shuffle(selectedCategory.words).slice(0, 10));
    setWordResults([]);
    setScreen('rotate');
  }

  /* ── Go back to category selection ───────────────────────── */
  function handleOtherCategory() {
    setScreen('home');
  }

  /* ── Reset leaderboard ───────────────────────────────────── */
  function handleResetLeaderboard() {
    setLeaderboard([]);
    saveLeaderboard([]);
  }

  /* ── Current player name ──────────────────────────────────── */
  const currentPlayer = players[currentPlayerIdx] ?? 'Pemain';

  /* ── Render ───────────────────────────────────────────────── */
  const isFullscreen = screen === 'gameplay' || screen === 'rotate';

  return (
    <div className={`${isFullscreen ? 'w-full' : 'max-w-md mx-auto'} min-h-screen bg-[#121212] overflow-hidden`}>
      <AnimatePresence mode="wait">
        {screen === 'home' && (
          <motion.div key="home" variants={variants} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.2 }}>
            <HomeScreen
              players={players}
              currentPlayerIndex={currentPlayerIdx}
              duration={duration}
              leaderboard={leaderboard}
              onAddPlayer={addPlayer}
              onRemovePlayer={removePlayer}
              onSetDuration={setDuration}
              onSelectCategory={startWithCategory}
              onCreateCustom={() => setScreen('custom')}
              activeTab={homeTab}
              onTabChange={setHomeTab}
            />
          </motion.div>
        )}

        {screen === 'custom' && (
          <motion.div key="custom" variants={variants} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.2 }}>
            <CustomCategoryScreen
              onBack={() => setScreen('home')}
              onPlay={startCustomDeck}
            />
          </motion.div>
        )}

        {screen === 'rotate' && (
          <motion.div key="rotate" variants={variants} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.2 }}>
            <RotateScreen onLandscapeDetected={onLandscapeDetected} />
          </motion.div>
        )}

        {screen === 'gameplay' && (
          <motion.div key="gameplay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <GameplayScreen
              words={shuffledWords}
              duration={duration}
              currentPlayer={currentPlayer}
              onGameEnd={handleGameEnd}
            />
          </motion.div>
        )}

        {screen === 'results' && (
          <motion.div key="results" variants={variants} initial="initial" animate="animate" exit="exit"
            transition={{ duration: 0.2 }}>
            <ResultsScreen
              playerName={currentPlayer}
              wordResults={wordResults}
              leaderboard={leaderboard}
              onPlayAgain={handlePlayAgain}
              onOtherCategory={handleOtherCategory}
              onResetLeaderboard={handleResetLeaderboard}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
