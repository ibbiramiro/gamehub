import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- EXAMPLE USAGE FOR TRUTH OR DARE SESSIONS ---

export async function createTodSession(players: string[], truths: string[], dares: string[], punishments: string[]) {
  const { data, error } = await supabase
    .from('tod_sessions')
    .insert([
      {
        player_count: players.length,
        players: players,
        truth_list: truths,
        dare_list: dares,
        punishment_list: punishments,
        status: 'active'
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    return null;
  }
  return data; // Returns the newly created session including its UUID
}

export async function getTodSession(sessionId: string) {
  const { data, error } = await supabase
    .from('tod_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (error) {
    console.error('Error fetching session:', error);
    return null;
  }
  return data;
}

export async function updateTodSessionStatus(sessionId: string, status: string) {
  const { error } = await supabase
    .from('tod_sessions')
    .update({ status: status })
    .eq('id', sessionId);

  if (error) {
    console.error('Error updating session:', error);
  }
}
