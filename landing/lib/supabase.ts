import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-supabase-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-supabase-anon-key";

// Pendant le build statique de Next.js, les variables d'environnement peuvent être manquantes.
// On initialise le client avec des placeholders pour éviter de faire échouer le prerendering.
if (typeof window !== "undefined" && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
  console.warn("Supabase credentials are placeholders. Ensure environment variables are loaded.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
