import { createClient } from "@supabase/supabase-js";

// La clé "publishable" est faite pour être visible dans le navigateur:
// ce sont les règles RLS (supabase/schema.sql) qui protègent les données.
const SUPABASE_URL = "https://rewsjymmjujoeotzdusy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_DKWo4v0MyCfIEINEW3SAvA_LiVbE4sy";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
