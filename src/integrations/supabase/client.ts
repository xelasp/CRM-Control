/**
 * Client Supabase para o módulo Financeiro (Lovable).
 * Caminho de import: "@/integrations/supabase/client"
 *
 * Credenciais no .env:
 *   VITE_SUPABASE_FIN_URL
 *   VITE_SUPABASE_FIN_ANON_KEY
 */
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_FIN_URL as string;
const key = import.meta.env.VITE_SUPABASE_FIN_ANON_KEY as string;

if (!url || !key) {
  throw new Error(
    "\n\n❌ CREDENCIAIS DO SUPABASE FINANCEIRO NÃO ENCONTRADAS\n" +
    "   Abra o arquivo .env na raiz do projeto e preencha:\n\n" +
    "   VITE_SUPABASE_FIN_URL=https://SEU_PROJETO.supabase.co\n" +
    "   VITE_SUPABASE_FIN_ANON_KEY=sua_chave_anon_aqui\n\n" +
    "   Depois reinicie: npm run dev\n"
  );
}

export const supabase = createClient(url, key);
