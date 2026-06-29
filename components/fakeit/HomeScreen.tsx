'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Info, Lock } from 'lucide-react';
import { CATEGORIES } from '@/lib/fakeit/gameData';
import type { Category } from '@/lib/fakeit/gameData';

interface HomeScreenProps {
  selectedCategory: Category | null;
  onSelectCategory: (cat: Category) => void;
  onPlay: () => void;
  onBack: () => void; // Added onBack so user can go back to Game Hub
}

export default function HomeScreen({ selectedCategory, onSelectCategory, onPlay, onBack }: HomeScreenProps) {
  
  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden text-white">
      {/* ── Background with Grid Overlay ───────────────────────── */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#FF1A5A] to-[#FF4D4D]">
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-10 pb-4">
        <button onClick={onBack} aria-label="Back" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        
        <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
          Fake<span className="text-yellow-400">i</span>t
        </h1>
        
        <button aria-label="Info" className="p-1 rounded-full border-2 border-white hover:bg-white/10 transition">
          <Info className="w-4 h-4 text-white" />
        </button>
      </header>

      {/* ── Category List ──────────────────────────────────────── */}
      <main className="relative z-10 flex-1 overflow-y-auto px-5 pb-32 space-y-4 pt-2">
        {CATEGORIES.map((cat, idx) => {
          const isActive = selectedCategory?.id === cat.id;
          
          return (
            <motion.button
              key={cat.id}
              onClick={() => {
                if (!cat.isLocked) onSelectCategory(cat);
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
              whileHover={!cat.isLocked ? { scale: 1.02 } : {}}
              whileTap={!cat.isLocked ? { scale: 0.98 } : {}}
              className={`w-full text-left relative flex items-center justify-between p-5 rounded-3xl bg-[#1C1C24] transition-all duration-200 overflow-hidden ${
                isActive ? 'border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-2 border-transparent'
              } ${cat.isLocked ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
              <div className="w-2/3 pr-2 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-black text-white">{cat.title}</h2>
                  {cat.isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                </div>
                <p className="text-sm text-gray-400 leading-snug font-medium">
                  {cat.description}
                </p>
              </div>
              
              <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-90 z-0">
                <span className="text-7xl drop-shadow-2xl filter" style={{ filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }}>
                  {cat.iconUrl}
                </span>
              </div>
            </motion.button>
          );
        })}
      </main>

      {/* ── Sticky Footer ──────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 bg-gradient-to-t from-[#FF4D4D] via-[#FF4D4D]/90 to-transparent pt-10">
        <motion.button
          onClick={onPlay}
          disabled={!selectedCategory}
          whileHover={selectedCategory ? { scale: 1.02 } : {}}
          whileTap={selectedCategory ? { scale: 0.97 } : {}}
          className={`w-full py-5 rounded-full flex items-center justify-center transition-all duration-200 ${
            selectedCategory 
              ? 'bg-white text-black shadow-lg shadow-black/20' 
              : 'bg-white/50 text-black/50 cursor-not-allowed'
          }`}
        >
          <span className="text-xl font-black tracking-wide">PLAY</span>
          <span className="mx-3 text-xl opacity-30">|</span>
          <span className="text-lg font-bold">1 Category</span>
        </motion.button>
      </div>
    </div>
  );
}
