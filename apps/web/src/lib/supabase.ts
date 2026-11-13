import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured,publicEnv } from "./env";
export const supabase=isSupabaseConfigured?createClient(publicEnv.VITE_SUPABASE_URL!,publicEnv.VITE_SUPABASE_ANON_KEY!,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}}):null;