//import { createClient } from "@supabase/supabase-js";

//const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
//const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

//export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ilxducwopqcjkgghggux.supabase.co";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlseGR1Y3dvcHFjamtnZ2hnZ3V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODM2NTYsImV4cCI6MjA5MTI1OTY1Nn0.lfrh6005T7XwQyNjNjGnHDKBLv5o0yYrrd4x7XgHp_Y";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);