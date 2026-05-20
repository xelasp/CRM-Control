/**
 * Client Supabase para o módulo Financeiro (Lovable).
 * Caminho de import: "@/integrations/supabase/client"
 *
 * Credenciais no .env:
 *   VITE_SUPABASE_FIN_URL
 *   VITE_SUPABASE_FIN_ANON_KEY
 */
SUPABASE_URL="https://ilxducwopqcjkgghggux.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlseGR1Y3dvcHFjamtnZ2hnZ3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODM2NTYsImV4cCI6MjA5MTI1OTY1Nn0.lfrh6005T7XwQyNjNjGnHDKBLv5o0yYrrd4x7XgHp_Y"

import { createClient } from "@supabase/supabase-js";

// Supabase anon key é pública por design — seguro fixar no código.
// Para trocar de projeto, altere os valores abaixo.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_CRM_URL || "${SUPABASE_URL}";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_CRM_ANON_KEY || "${SUPABASE_KEY}";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


