import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_CRM_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_CRM_ANON_KEY;

if (!url || !key) {
  throw new Error(
    "⚠️ Variáveis VITE_SUPABASE_CRM_URL e VITE_SUPABASE_CRM_ANON_KEY não encontradas no .env"
  );
}

export const supabaseCRM = createClient(url, key);
