'use client';

import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Dices, Pencil, Plus, Minus, Trash2, UserPlus,
} from 'lucide-react';
import type { GameConfig } from '@/lib/truth-or-dare/gameData';
import {
  DEFAULT_TRUTHS, DEFAULT_DARES, DEFAULT_PUNISHMENTS, pickRandom,
} from '@/lib/truth-or-dare/gameData';

interface SetupScreenProps {
  onStart: (config: GameConfig) => void;
  onBack: () => void;
}

/* ─── Editable item row ───────────────────────────────────────────── */
function EditableItem({
  value,
  onChange,
  onShuffle,
  onDelete,
  color,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  onShuffle: () => void;
  onDelete: () => void;
  color: string;
  id: string;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
      className="flex items-center gap-2 rounded-xl border-2 px-3 py-2 bg-[#141929]"
      style={{ borderColor: color, boxShadow: `0 0 10px ${color}40` }}
    >
      <input
        id={id}
        type="text"
        value={value}
        readOnly={!editing}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        className="flex-1 bg-transparent text-white text-sm font-medium outline-none
                   placeholder-gray-600 truncate"
        style={{ caretColor: color }}
        placeholder="Ketik pertanyaan..."
      />
      <button
        onClick={onShuffle}
        aria-label="Acak"
        className="shrink-0 p-1.5 rounded-lg hover:opacity-80 transition-opacity active:scale-90"
        style={{ color }}
      >
        <Dices className="w-4 h-4" />
      </button>
      <button
        onClick={() => { setEditing(true); setTimeout(() => document.getElementById(id)?.focus(), 50); }}
        aria-label="Edit"
        className="shrink-0 p-1.5 rounded-lg hover:opacity-80 transition-opacity active:scale-90"
        style={{ color }}
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        aria-label="Hapus"
        className="shrink-0 p-1.5 rounded-lg hover:opacity-80 transition-opacity active:scale-90
                   text-red-500"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}

/* ─── Section list ───────────────────────────────────────────────── */
function EditableSection({
  title, color, items, onUpdate, onShuffle, onAdd, onDelete,
}: {
  title: string; color: string; items: string[];
  onUpdate: (i: number, v: string) => void;
  onShuffle: (i: number) => void;
  onAdd: () => void;
  onDelete: (i: number) => void;
}) {
  const uid = useId();
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest" style={{ color }}>
          {title}
        </h3>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg
                     hover:opacity-80 transition-opacity"
          style={{ color, border: `1px solid ${color}60` }}
        >
          <Plus className="w-3 h-3" /> Tambah
        </button>
      </div>
      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <EditableItem
            key={`${title}-${i}`}
            id={`${uid}-${title}-${i}`}
            value={item}
            onChange={v => onUpdate(i, v)}
            onShuffle={() => onShuffle(i)}
            onDelete={() => onDelete(i)}
            color={color}
          />
        ))}
      </AnimatePresence>
    </section>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export default function SetupScreen({ onStart, onBack }: SetupScreenProps) {
  const [playerCount, setPlayerCount] = useState(5);
  const [playerNames, setPlayerNames] = useState<string[]>([
    'Andi', 'Budi', 'Citra', 'Dino', 'Eva',
  ]);
  const [truths, setTruths]           = useState<string[]>(DEFAULT_TRUTHS.slice(0, 5));
  const [dares, setDares]             = useState<string[]>(DEFAULT_DARES.slice(0, 5));
  const [punishments, setPunishments] = useState<string[]>(DEFAULT_PUNISHMENTS.slice(0, 5));

  /* Player count sync */
  function adjustCount(delta: number) {
    const next = Math.max(2, Math.min(12, playerCount + delta));
    setPlayerCount(next);
    setPlayerNames(prev => {
      if (next > prev.length) return [...prev, ...Array(next - prev.length).fill('')];
      return prev.slice(0, next);
    });
  }

  /* List mutation helpers */
  function listUpdater(setter: React.Dispatch<React.SetStateAction<string[]>>) {
    return {
      update: (i: number, v: string) => setter(p => p.map((x, j) => j === i ? v : x)),
      shuffle: (i: number, bank: string[]) =>
        setter(p => p.map((x, j) => j === i ? pickRandom(bank) : x)),
      add:    (defaultVal: string) => setter(p => [...p, defaultVal]),
      delete: (i: number) => setter(p => p.filter((_, j) => j !== i)),
    };
  }

  const truthFns      = listUpdater(setTruths);
  const dareFns       = listUpdater(setDares);
  const punishFns     = listUpdater(setPunishments);

  function handleStart() {
    const names = playerNames.map((n, i) => n.trim() || `Pemain ${i + 1}`);
    onStart({
      playerCount,
      playerNames: names,
      truths:       truths.filter(Boolean),
      dares:        dares.filter(Boolean),
      punishments:  punishments.filter(Boolean),
    });
  }

  const canStart = playerCount >= 2 && truths.length > 0 && dares.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1120] text-white">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#0B1120]/95 backdrop-blur-sm
                          border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <button id="btn-back-tod" onClick={onBack} aria-label="Kembali"
          className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-lg font-black text-white uppercase tracking-widest">
          Persiapan Game
        </h1>
      </header>

      {/* ── Scrollable content ─────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-28 px-4 pt-5 space-y-6">

        {/* Player Count Stepper */}
        <div className="rounded-2xl border border-white/10 bg-[#141929] p-5 space-y-4">
          <h2 className="text-base font-bold text-white text-center">Jumlah Pemain?</h2>

          {/* Stepper row */}
          <div className="flex items-center justify-center gap-6">
            <button id="btn-dec-players" onClick={() => adjustCount(-1)}
              className="w-12 h-12 rounded-full bg-[#2A2A3A] flex items-center justify-center
                         text-white hover:bg-[#3A3A4A] active:scale-90 transition-all">
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-5xl font-black text-white w-16 text-center">
              {playerCount}
            </span>
            <button id="btn-inc-players" onClick={() => adjustCount(1)}
              className="w-12 h-12 rounded-full flex items-center justify-center
                         text-black font-black hover:brightness-110 active:scale-90 transition-all"
              style={{ backgroundColor: '#00FFFF', boxShadow: '0 0 16px rgba(0,255,255,0.6)' }}>
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-xs text-gray-500">
            Menghasilkan {playerCount} Truth & {playerCount} Dare otomatis...
          </p>

          {/* Player name inputs */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Nama Pemain
            </p>
            <div className="grid grid-cols-2 gap-2">
              {playerNames.map((name, i) => (
                <input
                  key={i}
                  id={`player-name-${i}`}
                  type="text"
                  value={name}
                  onChange={e => setPlayerNames(p => p.map((x, j) => j === i ? e.target.value : x))}
                  placeholder={`Pemain ${i + 1}`}
                  className="bg-[#1E2840] border border-white/20 rounded-xl px-3 py-2
                             text-white text-sm placeholder-gray-600 outline-none
                             focus:border-[#C0F300] focus:shadow-[0_0_8px_rgba(192,243,0,0.3)]
                             transition-all duration-150"
                />
              ))}
            </div>
          </div>
        </div>

        {/* DAFTAR TRUTH */}
        <EditableSection
          title="Daftar Truth"
          color="#00FFFF"
          items={truths}
          onUpdate={(i, v) => truthFns.update(i, v)}
          onShuffle={i => truthFns.shuffle(i, DEFAULT_TRUTHS)}
          onAdd={() => truthFns.add(pickRandom(DEFAULT_TRUTHS))}
          onDelete={i => truthFns.delete(i)}
        />

        {/* DAFTAR DARE */}
        <EditableSection
          title="Daftar Dare"
          color="#FF00FF"
          items={dares}
          onUpdate={(i, v) => dareFns.update(i, v)}
          onShuffle={i => dareFns.shuffle(i, DEFAULT_DARES)}
          onAdd={() => dareFns.add(pickRandom(DEFAULT_DARES))}
          onDelete={i => dareFns.delete(i)}
        />

        {/* DAFTAR HUKUMAN */}
        <EditableSection
          title="Daftar Hukuman"
          color="#FF3333"
          items={punishments}
          onUpdate={(i, v) => punishFns.update(i, v)}
          onShuffle={i => punishFns.shuffle(i, DEFAULT_PUNISHMENTS)}
          onAdd={() => punishFns.add(pickRandom(DEFAULT_PUNISHMENTS))}
          onDelete={i => punishFns.delete(i)}
        />
      </main>

      {/* ── Fixed Footer ─────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md
                      px-4 pb-5 pt-2 bg-gradient-to-t from-[#0B1120] via-[#0B1120]/95 to-transparent">
        <motion.button
          id="btn-start-tod"
          onClick={handleStart}
          disabled={!canStart}
          whileHover={canStart ? { scale: 1.02 } : {}}
          whileTap={canStart ? { scale: 0.97 } : {}}
          className={`w-full py-4 rounded-2xl font-black text-xl tracking-wider
                      flex items-center justify-center gap-2 transition-all duration-200
                      ${canStart ? 'text-black' : 'bg-[#2A2A3A] text-gray-600 cursor-not-allowed'}`}
          style={canStart ? {
            backgroundColor: '#C0F300',
            boxShadow: '0 0 28px rgba(192,243,0,0.65)',
          } : {}}
        >
          MULAI SEKARANG! 🚀
        </motion.button>
      </div>
    </div>
  );
}
