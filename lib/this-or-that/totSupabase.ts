import { supabase } from '../supabase';
import type { QuestionPair } from './gameData';

export interface TotSession {
  id: string;
  status: 'lobby' | 'playing' | 'finished';
  current_question_index: number;
  questions: QuestionPair[];
  created_at: string;
}

export interface TotPlayer {
  id: string;
  session_id: string;
  name: string;
  current_vote: 'A' | 'B' | null;
  score: number;
  created_at: string;
}

// ─── Session Management ─────────────────────────────────────────────────

export async function createTotSession(questions: QuestionPair[]): Promise<string | null> {
  const { data, error } = await supabase
    .from('tot_sessions')
    .insert([
      {
        status: 'lobby',
        current_question_index: 0,
        questions,
      }
    ])
    .select('id')
    .single();

  if (error) {
    console.error('Error creating tot session:', error.message, error.details, error.hint, error.code);
    return null;
  }
  return data.id;
}

export async function updateTotSessionStatus(
  sessionId: string, 
  status: 'lobby' | 'playing' | 'finished', 
  questionIndex: number = 0
) {
  const { error } = await supabase
    .from('tot_sessions')
    .update({ status, current_question_index: questionIndex })
    .eq('id', sessionId);

  if (error) {
    console.error('Error updating session status:', error);
  }
}

// ─── Player Management ──────────────────────────────────────────────────

export async function joinTotSession(sessionId: string, name: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('tot_players')
    .insert([
      {
        session_id: sessionId,
        name,
        current_vote: null,
        score: 0,
      }
    ])
    .select('id')
    .single();

  if (error) {
    console.error('Error joining session:', error);
    return null;
  }
  return data.id;
}

export async function submitTotVote(playerId: string, vote: 'A' | 'B') {
  const { error } = await supabase
    .from('tot_players')
    .update({ current_vote: vote })
    .eq('id', playerId);

  if (error) {
    console.error('Error submitting vote:', error);
  }
}

export async function resetAllVotes(sessionId: string) {
  const { error } = await supabase
    .from('tot_players')
    .update({ current_vote: null })
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error resetting votes:', error);
  }
}
