/**
 * Client Supabase para o módulo Financeiro (Lovable).
 * Caminho de import: "@/integrations/supabase/client"
 *
 * Credenciais no .env:
 *   VITE_SUPABASE_FIN_URL
 *   VITE_SUPABASE_FIN_ANON_KEY
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

