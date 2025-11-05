import { createClient } from '@supabase/supabase-js';

// Clés publiques (safe pour le frontend)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client public (pour le frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin (pour le backend - API routes seulement)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);