'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronUp, Users, UserX } from 'lucide-react';
import type { Player } from '@/lib/fakeit/gameData';

interface RoleRevealScreenProps {
  player: Player;
  nextPlayerName: string | null; // null if last player
  secretWord: string;
  secretHint: string;
  onNext: () => void;
  onBackToSetup: () => void;
}

export default function RoleRevealScreen({
  player,
  nextPlayerName,
  secretWord,
  secretHint,
  onNext,
  onBackToSetup
}: RoleRevealScreenProps) {
  const [hasRevealed, setHasRevealed] = useState(false);
  const controls = useAnimation();
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // The drawer needs to be dragged UP. So y will be negative.
  // We'll reveal when they drag up significantly (e.g. -200px)
  const revealThreshold = -150;

  useEffect(() => {
    // Reset state when player changes
    setHasRevealed(false);
    controls.set({ y: 0 });
  }, [player, controls]);

  const handleDragEnd = () => {
    if (y.get() < revealThreshold) {
      // Snap to revealed position
      controls.start({ y: -350, transition: { type: 'spring', stiffness: 300, damping: 25 } });
      setHasRevealed(true);
    } else {
      // Snap back down
      controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } });
    }
  };

  const handleCloseDrawer = () => {
    controls.start({ y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } });
  };

  // Interpolate opacity/scale based on drag for smooth transitions
  const drawerOpacity = useTransform(y, [0, -350], [1, 1]); // keep solid
  const mainContentScale = useTransform(y, [0, -350], [1, 0.9]);
  const mainContentOpacity = useTransform(y, [0, -350], [1, 0.3]);

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden" style={{ backgroundColor: player.avatarColor }}>
      
      {/* ── Subtle blob background ─────────────────────────────── */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-[120%] h-[120%] fill-black/20">
          <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,41.9C64.8,54.7,53.8,65.8,40.6,73.1C27.4,80.4,12,83.9,-2.8,81.4C-17.6,78.9,-35.2,70.4,-48.5,59.3C-61.8,48.2,-70.8,34.5,-76.9,19.3C-83,4.1,-86.2,-12.6,-81.8,-27.2C-77.4,-41.8,-65.4,-54.3,-51.7,-61.8C-38,-69.3,-22.6,-71.8,-6.9,-71.1C8.8,-70.4,27.5,-66.5,44.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>

      {/* ── Main Content (Scales down when drawer opens) ──────── */}
      <motion.div 
        style={{ scale: mainContentScale, opacity: mainContentOpacity }}
        className="relative z-10 flex flex-col h-screen"
      >
        <header className="flex items-center px-5 pt-10 pb-4">
          <button onClick={onBackToSetup} className="p-2 -ml-2 rounded-full hover:bg-black/10 transition">
            <ChevronLeft className="w-8 h-8 text-black" />
          </button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-5 -mt-10">
          <h2 className="text-5xl font-black text-black mb-8">{player.name}</h2>
          
          {/* 3D Avatar Placeholder (using emoji for now) */}
          <div className="text-[140px] drop-shadow-2xl mb-8 leading-none">
            😎
          </div>
        </div>

        {/* Swipe Instruction (default state) */}
        {!hasRevealed && (
          <div className="absolute bottom-32 left-0 right-0 flex flex-col items-center">
            <p className="text-xl font-black text-black mb-1">Swipe up to reveal</p>
            <p className="text-xl font-black text-black">the secret word</p>
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="mt-4"
            >
              <ChevronUp className="w-12 h-12 text-black" />
            </motion.div>
          </div>
        )}

        {/* Pass the phone Instruction (after revealed) */}
        {hasRevealed && (
          <div className="absolute bottom-24 left-0 right-0 flex flex-col items-center px-5">
            <p className="text-2xl font-black text-black mb-6 text-center">
              {nextPlayerName ? `Pass the phone to ${nextPlayerName}` : "Everyone's ready!"}
            </p>
            <button
              onClick={onNext}
              className="w-full max-w-sm py-4 rounded-full bg-black text-white text-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              Continue
            </button>
          </div>
        )}
      </motion.div>

      {/* ── Interactive Drawer ─────────────────────────────────── */}
      {!hasRevealed && (
        <motion.div
          ref={containerRef}
          drag="y"
          dragConstraints={{ top: -400, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          animate={controls}
          style={{ y, opacity: drawerOpacity }}
          className="absolute left-0 right-0 h-[600px] bg-black rounded-t-[40px] z-50 flex flex-col items-center pt-8 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          initial={{ top: '100%' }}
        >
          {/* Drag Handle */}
          <div className="w-16 h-2 bg-white/30 rounded-full mb-12" />

          {player.role === 'normal' ? (
            <div className="flex flex-col items-center w-full">
              <Users className="w-16 h-16 text-[#00D084] mb-6" />
              <h3 className="text-5xl font-black text-white text-center break-words w-full px-2" style={{ lineHeight: 1.1 }}>
                {secretWord}
              </h3>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <UserX className="w-20 h-20 text-[#FF1A5A] mb-4" />
              <h3 className="text-5xl font-black text-[#FF1A5A] tracking-widest mb-4">
                IMPOSTER
              </h3>
              <p className="text-2xl text-white font-bold text-center px-4">
                Hint: {secretHint}
              </p>
            </div>
          )}

          {/* Close button for drawer (optional, usually they just drag down, but good for accessibility) */}
          <button 
            onClick={handleCloseDrawer}
            className="mt-16 text-white/50 font-bold uppercase tracking-widest text-sm hover:text-white transition"
          >
            Swipe down to hide
          </button>
        </motion.div>
      )}
    </div>
  );
}
