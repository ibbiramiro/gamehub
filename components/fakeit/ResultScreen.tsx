'use client';

import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import type { GameResult, Player } from '@/lib/fakeit/gameData';

interface ResultScreenProps {
  result: GameResult;
  players: Player[];
  secretWord: string;
  onPlayAgain: () => void;
  onGoHome: () => void; // Unused in this specific prompt layout, but kept for logic
}

export default function ResultScreen({ result, players, secretWord, onPlayAgain }: ResultScreenProps) {
  const isVictory = result.imposterCaught;
  const imposterPlayers = players.filter(p => p.role === 'imposter');
  const mainImposter = imposterPlayers[0]; // Assuming 1 imposter for the card display

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden text-white">
      {/* ── Background with Grid Overlay ───────────────────────── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#FF1A5A] to-[#FF4D4D]">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-screen px-5 pt-16 pb-8">
        
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-wide text-white drop-shadow-lg">
            Results
          </h1>
        </header>

        {/* ── Content ────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col space-y-4">
          
          {/* Winner Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1C1C24] rounded-3xl p-6 w-full flex flex-col items-center border border-white/5 shadow-xl"
          >
            <h2 className="text-3xl font-black text-white mb-2 text-center">
              {isVictory ? 'Town Wins!' : 'Imposter Wins!'}
            </h2>
            <p className="text-gray-400 font-medium text-center mb-6 px-4 leading-tight">
              {isVictory 
                ? 'The Imposter was caught red-handed' 
                : 'The Imposter got away undetected'}
            </p>

            {/* Imposter Mini Card */}
            {mainImposter && (
              <div 
                className="w-32 h-40 rounded-2xl flex flex-col items-center justify-center p-2 shadow-lg relative overflow-hidden"
                style={{ backgroundColor: mainImposter.avatarColor }}
              >
                {/* Subtle blob inside card */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-[150%] h-[150%] fill-black">
                    <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,41.9C64.8,54.7,53.8,65.8,40.6,73.1C27.4,80.4,12,83.9,-2.8,81.4C-17.6,78.9,-35.2,70.4,-48.5,59.3C-61.8,48.2,-70.8,34.5,-76.9,19.3C-83,4.1,-86.2,-12.6,-81.8,-27.2C-77.4,-41.8,-65.4,-54.3,-51.7,-61.8C-38,-69.3,-22.6,-71.8,-6.9,-71.1C8.8,-70.4,27.5,-66.5,44.7,-76.4Z" transform="translate(100 100)" />
                  </svg>
                </div>
                
                <div className="text-[60px] drop-shadow-xl z-10">
                  😈
                </div>
                <div className="mt-auto z-10 w-full text-center pb-1">
                  <span className="font-black text-black text-sm">{mainImposter.name}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Reveal Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1C1C24] rounded-3xl p-6 w-full text-center border border-white/5 shadow-xl"
          >
            <p className="text-gray-400 font-medium mb-1">
              Secret Word
            </p>
            <h3 className="text-3xl font-black text-white">
              {secretWord}
            </h3>
          </motion.div>

        </main>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div className="pt-6">
          <motion.button
            onClick={onPlayAgain}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-5 rounded-full bg-white text-black shadow-xl flex items-center justify-center gap-3 transition-all"
          >
            <span className="text-xl font-black tracking-wide uppercase">Play Again</span>
            <RotateCcw className="w-5 h-5 stroke-[3]" />
          </motion.button>
        </div>

      </div>
    </div>
  );
}
