import { z } from "zod";
const schema=z.object({VITE_SUPABASE_URL:z.string().url().optional().or(z.literal("")),VITE_SUPABASE_ANON_KEY:z.string().min(1).optional()});
const parsed=schema.safeParse(import.meta.env);
export const publicEnv=parsed.success?parsed.data:{VITE_SUPABASE_URL:undefined,VITE_SUPABASE_ANON_KEY:undefined};
export const isSupabaseConfigured=Boolean(publicEnv.VITE_SUPABASE_URL&&publicEnv.VITE_SUPABASE_ANON_KEY);
export const envIssues=parsed.success?[]:parsed.error.issues.map(issue=>issue.path.join("."));