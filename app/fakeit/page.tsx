'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import HomeScreen from '@/components/fakeit/HomeScreen';
import AddPlayersScreen from '@/components/fakeit/AddPlayersScreen';
import SettingsScreen from '@/components/fakeit/SettingsScreen';
import RoleRevealScreen from '@/components/fakeit/RoleRevealScreen';
import TimerScreen from '@/components/fakeit/TimerScreen';
import VotingScreen from '@/components/fakeit/VotingScreen';
import ResultScreen from '@/components/fakeit/ResultScreen';

import type { Category, Player, FakeitScreen, GameConfig, GameResult } from '@/lib/fakeit/gameData';
import { generateRoles, pickRandom } from '@/lib/fakeit/gameData';

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

export default function FakeitPage() {
  const router = useRouter();

  // Screen state
  const [screen, setScreen] = useState<FakeitScreen>('home');
  const [prevScreen, setPrevScreen] = useState<FakeitScreen>('home'); // for back navigation from settings

  // Game configuration state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [imposterCount, setImposterCount] = useState(1);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(3);
  
  // Active game state
  // Active game state
  const [secretItem, setSecretItem] = useState<{word: string, hint: string}>({ word: '', hint: '' });
  const [revealIndex, setRevealIndex] = useState(0);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  // ─── Event Handlers ───────────────────────────────────────────

  const handleHomePlay = () => {
    setScreen('addPlayers');
  };

  const handleAddPlayersContinue = () => {
    // Before starting the reveal phase, assign roles and pick a word
    const assignedPlayers = generateRoles(players, imposterCount);
    setPlayers(assignedPlayers);
    
    if (selectedCategory) {
      setSecretItem(pickRandom(selectedCategory.items));
    }
    
    setRevealIndex(0);
    setScreen('reveal');
  };

  const handleSettingsClick = () => {
    setPrevScreen(screen);
    setScreen('settings');
  };

  const handleSettingsChange = (newImposters: number, newTime: number) => {
    setImposterCount(newImposters);
    setTimeLimitMinutes(newTime);
  };

  const handleRevealNext = () => {
    if (revealIndex < players.length - 1) {
      setRevealIndex(prev => prev + 1);
    } else {
      setScreen('timer');
    }
  };

  const handleTimerComplete = () => {
    setScreen('voting');
  };

  const handleVotingComplete = (accusedPlayerIds: string[]) => {
    // Check if the accused players are the imposters
    const imposterIds = players.filter(p => p.role === 'imposter').map(p => p.id);
    
    // Sort to easily compare arrays
    const sortedAccused = [...accusedPlayerIds].sort();
    const sortedImposters = [...imposterIds].sort();
    
    const imposterCaught = 
      sortedAccused.length === sortedImposters.length && 
      sortedAccused.every((val, index) => val === sortedImposters[index]);

    const imposterNames = players
      .filter(p => p.role === 'imposter')
      .map(p => p.name);

    setGameResult({
      imposterCaught,
      imposterNames
    });
    
    setScreen('result');
  };

  const handlePlayAgain = () => {
    // Reset game state but keep players and config
    const assignedPlayers = generateRoles(players, imposterCount);
    setPlayers(assignedPlayers);
    
    if (selectedCategory) {
      setSecretItem(pickRandom(selectedCategory.items));
    }
    
    setRevealIndex(0);
    setGameResult(null);
    setScreen('reveal');
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        
        {screen === 'home' && (
          <motion.div key="home" {...fade} transition={{ duration: 0.3 }}>
            <HomeScreen 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onPlay={handleHomePlay}
              onBack={handleBackToHome}
            />
          </motion.div>
        )}

        {screen === 'addPlayers' && (
          <motion.div key="addPlayers" {...fade} transition={{ duration: 0.3 }}>
            <AddPlayersScreen 
              players={players}
              onPlayersChange={setPlayers}
              onContinue={handleAddPlayersContinue}
              onSettingsClick={handleSettingsClick}
              onBack={() => setScreen('home')}
            />
          </motion.div>
        )}

        {screen === 'settings' && (
          <motion.div key="settings" {...fade} transition={{ duration: 0.2 }}>
            <SettingsScreen 
              players={players}
              imposterCount={imposterCount}
              timeLimitMinutes={timeLimitMinutes}
              onSettingsChange={handleSettingsChange}
              onBack={() => setScreen(prevScreen)}
            />
          </motion.div>
        )}

        {screen === 'reveal' && players.length > 0 && (
          <motion.div key={`reveal-${revealIndex}`} {...fade} transition={{ duration: 0.3 }}>
            <RoleRevealScreen 
              player={players[revealIndex]}
              nextPlayerName={revealIndex < players.length - 1 ? players[revealIndex + 1].name : null}
              secretWord={secretItem.word}
              secretHint={secretItem.hint}
              onNext={handleRevealNext}
              onBackToSetup={() => setScreen('addPlayers')}
            />
          </motion.div>
        )}

        {screen === 'timer' && (
          <motion.div key="timer" {...fade} transition={{ duration: 0.3 }}>
            <TimerScreen 
              timeLimitMinutes={timeLimitMinutes}
              onTimeUp={handleTimerComplete}
              onSkipTimer={handleTimerComplete}
            />
          </motion.div>
        )}

        {screen === 'voting' && (
          <motion.div key="voting" {...fade} transition={{ duration: 0.3 }}>
            <VotingScreen 
              players={players}
              imposterCount={imposterCount}
              onVoteComplete={handleVotingComplete}
            />
          </motion.div>
        )}

        {screen === 'result' && gameResult && (
          <motion.div key="result" {...fade} transition={{ duration: 0.3 }}>
            <ResultScreen 
              result={gameResult}
              players={players}
              secretWord={secretItem.word}
              onPlayAgain={handlePlayAgain}
              onGoHome={() => setScreen('home')}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
