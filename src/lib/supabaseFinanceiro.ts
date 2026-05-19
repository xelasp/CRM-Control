import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_FIN_URL as string;
const key = import.meta.env.VITE_SUPABASE_FIN_ANON_KEY as string;

// O módulo financeiro será integrado em etapa futura.
// Enquanto as variáveis não estiverem no .env, o client não é criado.
export const supabaseFinanceiro =
  url && key ? createClient(url, key) : null;
