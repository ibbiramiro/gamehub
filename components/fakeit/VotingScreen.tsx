'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Player } from '@/lib/fakeit/gameData';

interface VotingScreenProps {
  players: Player[];
  onVoteComplete: (accusedPlayerIds: string[]) => void;
  imposterCount: number; // For the case where imposterCount > 1, though standard is 1. If 1, auto-submit on confirm.
}

export default function VotingScreen({ players, onVoteComplete, imposterCount }: VotingScreenProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  // For multiple imposters, we'd need a more complex state, but the prompt implies a single selection modal.
  // I'll build it for 1 imposter (the most common Fakeit/Spyfall flow) based on the image reference.
  // If they need to vote for multiple, we'd handle that, but let's stick to the single tap -> modal -> confirm flow.

  const handleCardTap = (player: Player) => {
    setSelectedPlayer(player);
  };

  const handleConfirmVote = () => {
    if (selectedPlayer) {
      // In a real multiplayer game, this would submit one vote.
      // Here, since it's pass & play, this essentially acts as the group's final decision.
      onVoteComplete([selectedPlayer.id]);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-[#121212] text-white">
      {/* ── Background with Grid Overlay ───────────────────────── */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <header className="relative z-10 pt-16 pb-6 px-5 text-center">
        <h1 className="text-3xl font-black tracking-wide text-white drop-shadow-lg mb-2">
          Who's the Imposter?
        </h1>
        <p className="text-gray-400 font-medium">
          Vote for who you think is faking it
        </p>
      </header>

      {/* ── Player Grid ────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 overflow-y-auto px-5 pb-10">
        <div className="grid grid-cols-2 gap-4">
          {players.map((player) => (
            <motion.button
              key={player.id}
              onClick={() => handleCardTap(player)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col items-center p-4 rounded-3xl aspect-[3/4] relative overflow-hidden transition-all shadow-lg"
              style={{ backgroundColor: player.avatarColor }}
            >
              {/* Subtle blob inside card */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-[150%] h-[150%] fill-black">
                  <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,41.9C64.8,54.7,53.8,65.8,40.6,73.1C27.4,80.4,12,83.9,-2.8,81.4C-17.6,78.9,-35.2,70.4,-48.5,59.3C-61.8,48.2,-70.8,34.5,-76.9,19.3C-83,4.1,-86.2,-12.6,-81.8,-27.2C-77.4,-41.8,-65.4,-54.3,-51.7,-61.8C-38,-69.3,-22.6,-71.8,-6.9,-71.1C8.8,-70.4,27.5,-66.5,44.7,-76.4Z" transform="translate(100 100)" />
                </svg>
              </div>

              {/* Avatar Emoji */}
              <div className="flex-1 flex items-center justify-center text-[80px] drop-shadow-2xl z-10">
                 😎
              </div>

              <div className="w-full text-center pb-2 z-10 mt-auto">
                <span className="font-black text-xl text-black">
                  {player.name}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </main>

      {/* ── Confirmation Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-5 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#1C1C24] w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white text-center mb-6">
                Vote for {selectedPlayer.name}?
              </h2>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="flex-1 py-4 rounded-full bg-white/10 text-white font-bold hover:bg-white/20 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmVote}
                  className="flex-1 py-4 rounded-full bg-[#FF1A5A] text-white font-black shadow-lg shadow-[#FF1A5A]/30 hover:brightness-110 transition"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
