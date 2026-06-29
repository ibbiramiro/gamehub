import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface TebakKataDeck {
  id: string;
  name: string;
  icon_name: string;
  border_color: string;
  words: string[];
  created_at: string;
}

/**
 * Example function to fetch all Tebak Kata categories (decks) from Supabase.
 * Call this in a Server Component (app/page.tsx) or a useEffect in a Client Component.
 */
export async function fetchTebakKataDecks(): Promise<TebakKataDeck[]> {
  const { data, error } = await supabase
    .from('tebak_kata_decks')
    .select('*')
    .order('created_at', { ascending: true }); // Order however you like

  if (error) {
    console.error('Error fetching tebak_kata_decks:', error);
    return [];
  }

  return data as TebakKataDeck[];
}
