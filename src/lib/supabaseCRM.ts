import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_CRM_URL as string;
const key = import.meta.env.VITE_SUPABASE_CRM_ANON_KEY as string;

if (!url || !key) {
  throw new Error(
    "⚠️ Variáveis VITE_SUPABASE_CRM_URL e VITE_SUPABASE_CRM_ANON_KEY não encontradas no .env"
  );
}

export const supabaseCRM = createClient(url, key);
