import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface FakeitItem {
  word: string;
  hint: string;
}

export interface FakeitCategory {
  id: string;
  name: string;
  icon_name: string;
  color_theme: string;
  items: FakeitItem[];
  created_at: string;
}

/**
 * Fetch all Fakeit categories from Supabase.
 * Call this in a Server Component or Client Component useEffect.
 */
export async function fetchFakeitCategories(): Promise<FakeitCategory[]> {
  const { data, error } = await supabase
    .from('fakeit_categories')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching fakeit_categories:', error);
    return [];
  }

  return data as FakeitCategory[];
}

/**
 * Helper to pick a random item from a category for gameplay.
 */
export function pickRandomFakeitItem(category: FakeitCategory): FakeitItem {
  if (!category.items || category.items.length === 0) {
    return { word: 'Error', hint: 'No items in category' };
  }
  const randomIndex = Math.floor(Math.random() * category.items.length);
  return category.items[randomIndex];
}
