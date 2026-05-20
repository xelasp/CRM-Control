import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_CRM_URL || "${SUPABASE_URL}";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_CRM_ANON_KEY || "${SUPABASE_KEY}";

export const supabaseCRM = createClient(SUPABASE_URL, SUPABASE_KEY);