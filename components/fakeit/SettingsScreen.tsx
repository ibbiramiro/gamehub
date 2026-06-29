'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Minus, Plus } from 'lucide-react';
import type { Player } from '@/lib/fakeit/gameData';

interface SettingsScreenProps {
  players: Player[];
  imposterCount: number;
  timeLimitMinutes: number;
  onSettingsChange: (imposterCount: number, timeLimitMinutes: number) => void;
  onBack: () => void;
}

export default function SettingsScreen({ 
  players, 
  imposterCount, 
  timeLimitMinutes, 
  onSettingsChange, 
  onBack 
}: SettingsScreenProps) {
  
  const maxImposters = Math.max(1, Math.floor(players.length / 2));

  function updateImposters(delta: number) {
    const next = Math.max(1, Math.min(maxImposters, imposterCount + delta));
    onSettingsChange(next, timeLimitMinutes);
  }

  function updateTime(delta: number) {
    const next = Math.max(1, Math.min(10, timeLimitMinutes + delta));
    onSettingsChange(imposterCount, next);
  }

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

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-10 pb-6">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition">
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        <h1 className="text-2xl font-black tracking-wide">Settings</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* ── Settings Content ────────────────────────────────────── */}
      <main className="relative z-10 flex-1 px-5 pt-4 space-y-8">
        
        {/* Imposters Setting */}
        <div className="bg-[#1C1C24] rounded-3xl p-6 shadow-xl border border-white/5">
          <h2 className="text-xl font-black text-white text-center mb-6">How many Imposters?</h2>
          
          <div className="flex items-center justify-between">
            <button 
              onClick={() => updateImposters(-1)}
              disabled={imposterCount <= 1}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                imposterCount > 1 ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/5 text-white/20'
              }`}
            >
              <Minus className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col items-center justify-center">
              <span className="text-6xl font-black text-[#FFD500] drop-shadow-lg">
                {imposterCount}
              </span>
              <span className="text-sm text-gray-400 font-bold mt-1 uppercase tracking-widest">
                {imposterCount === 1 ? 'Imposter' : 'Imposters'}
              </span>
            </div>
            
            <button 
              onClick={() => updateImposters(1)}
              disabled={imposterCount >= maxImposters}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                imposterCount < maxImposters ? 'bg-[#FFD500] text-black hover:brightness-110 shadow-[0_0_15px_rgba(255,213,0,0.5)]' : 'bg-white/5 text-white/20'
              }`}
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
          <p className="text-center text-gray-500 text-xs mt-6 font-medium">
            Recommended: 1 imposter for every 3-4 normal players.
          </p>
        </div>

        {/* Time Limit Setting */}
        <div className="bg-[#1C1C24] rounded-3xl p-6 shadow-xl border border-white/5">
          <h2 className="text-xl font-black text-white text-center mb-6">Discussion Time</h2>
          
          <div className="flex items-center justify-between">
            <button 
              onClick={() => updateTime(-1)}
              disabled={timeLimitMinutes <= 1}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                timeLimitMinutes > 1 ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white/5 text-white/20'
              }`}
            >
              <Minus className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-black text-white drop-shadow-lg">
                  {timeLimitMinutes}
                </span>
                <span className="text-2xl font-black text-gray-400">m</span>
              </div>
            </div>
            
            <button 
              onClick={() => updateTime(1)}
              disabled={timeLimitMinutes >= 10}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                timeLimitMinutes < 10 ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'bg-white/5 text-white/20'
              }`}
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

      </main>

      {/* ── Sticky Footer ──────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 bg-gradient-to-t from-[#FF4D4D] via-[#FF4D4D]/90 to-transparent pt-10">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-full bg-white text-black shadow-lg shadow-black/20 flex items-center justify-center transition-all duration-200"
        >
          <span className="text-xl font-black tracking-wide">Save & Close</span>
        </motion.button>
      </div>
    </div>
  );
}
