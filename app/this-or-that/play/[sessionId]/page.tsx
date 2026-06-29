'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { joinTotSession, submitTotVote } from '@/lib/this-or-that/totSupabase';
import type { TotSession, TotPlayer } from '@/lib/this-or-that/totSupabase';

export default function PlayerPlayPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);
  const [session, setSession] = useState<TotSession | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [currentVote, setCurrentVote] = useState<'A' | 'B' | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch initial session and subscribe to session changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase
        .from('tot_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (data) setSession(data as TotSession);
      setLoading(false);
    };
    fetchSession();

    const channel = supabase.channel(`tot_session_${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tot_sessions', filter: `id=eq.${sessionId}` },
        (payload) => {
          setSession(payload.new as TotSession);
          // If moving to next question, clear the current vote
          setCurrentVote(null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const handleJoin = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const pId = await joinTotSession(sessionId, name.trim());
    if (pId) {
      setPlayerId(pId);
    }
    setLoading(false);
  };

  const handleVote = async (vote: 'A' | 'B') => {
    if (!playerId) return;
    setCurrentVote(vote);
    await submitTotVote(playerId, vote);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">Memuat...</div>;
  }

  if (!session) {
    return <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">Sesi tidak ditemukan</div>;
  }

  // --- JOIN SCREEN ---
  if (!playerId) {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-6 flex flex-col items-center justify-center space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-black text-[#C0F300] uppercase tracking-tighter" style={{ textShadow: '0 0 20px rgba(192,243,0,0.5)' }}>THIS OR THAT</h1>
          <p className="text-gray-400 mt-2">Masukkan namamu untuk bergabung!</p>
        </div>
        
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama Panggilan"
          className="w-full max-w-sm px-6 py-4 bg-[#1E1E1E] text-white rounded-xl border border-gray-700 focus:outline-none focus:border-[#C0F300] text-center font-bold text-xl"
        />
        
        <button
          onClick={handleJoin}
          disabled={!name.trim()}
          className="w-full max-w-sm py-4 rounded-xl font-black text-black bg-[#C0F300] uppercase tracking-widest disabled:opacity-50"
        >
          BERGABUNG
        </button>
      </div>
    );
  }

  // --- LOBBY WAITING SCREEN ---
  if (session.status === 'lobby') {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-6 flex flex-col items-center justify-center text-center space-y-4">
        <h2 className="text-2xl font-bold">Halo, {name}!</h2>
        <p className="text-gray-400">Menunggu host memulai permainan...</p>
        <div className="animate-pulse w-12 h-12 rounded-full bg-[#C0F300]/20 mx-auto mt-4"></div>
      </div>
    );
  }

  // --- FINISHED SCREEN ---
  if (session.status === 'finished') {
    return (
      <div className="min-h-screen bg-[#121212] text-white p-6 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-black text-[#C0F300]">PERMAINAN SELESAI!</h2>
        <p className="text-gray-400 mt-4">Lihat layar utama untuk hasil akhirnya.</p>
      </div>
    );
  }

  // --- PLAYING SCREEN ---
  const currentPair = session.questions[session.current_question_index];
  
  if (!currentPair) {
    return <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">Error memuat pertanyaan</div>;
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* Header Info */}
      <div className="py-4 text-center border-b border-gray-800">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Pertanyaan {session.current_question_index + 1} / {session.questions.length}
        </p>
      </div>

      {currentVote ? (
        // Waiting for others
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-[#C0F300]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-black uppercase">Pilihanmu Disimpan!</h2>
          </motion.div>
          <p className="text-gray-400">Menunggu pemain lain dan host...</p>
        </div>
      ) : (
        // Voting Buttons
        <div className="flex-1 flex flex-col p-4 gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVote('A')}
            className="flex-1 rounded-2xl bg-[#1A1A1A] border-2 border-[#00E5FF] flex items-center justify-center p-6"
            style={{ boxShadow: '0 0 15px rgba(0,229,255,0.2)' }}
          >
            <span className="font-black text-3xl text-center uppercase tracking-tight text-[#00E5FF]">
              {currentPair.option1}
            </span>
          </motion.button>
          
          <div className="text-center py-2 relative">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
             <span className="relative bg-[#121212] px-4 text-sm font-bold text-gray-500">ATAU</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVote('B')}
            className="flex-1 rounded-2xl bg-[#1A1A1A] border-2 border-[#FF6D00] flex items-center justify-center p-6"
            style={{ boxShadow: '0 0 15px rgba(255,109,0,0.2)' }}
          >
            <span className="font-black text-3xl text-center uppercase tracking-tight text-[#FF6D00]">
              {currentPair.option2}
            </span>
          </motion.button>
        </div>
      )}
    </div>
  );
}
