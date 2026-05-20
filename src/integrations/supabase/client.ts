/**
 * Client Supabase para o módulo Financeiro (Lovable).
 * Caminho de import: "@/integrations/supabase/client"
 *
 * Credenciais no .env:
 *   VITE_SUPABASE_FIN_URL
 *   VITE_SUPABASE_FIN_ANON_KEY
 */
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_CRM_URL as string;
const key = import.meta.env.VITE_SUPABASE_CRM_ANON_KEY as string;

if (!url || !key) {
  throw new Error("VITE_SUPABASE_CRM_URL ou VITE_SUPABASE_CRM_ANON_KEY não definidos.");
}

export const supabase = createClient(url, key);



