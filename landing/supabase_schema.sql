-- Migration : Création des tables pour le Gamified Destiny Engine

-- 1. Table des Quêtes Interactives Personnalisées
CREATE TABLE IF NOT EXISTS public.quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT NOT NULL REFERENCES public.waitlist(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'epic')),
  category TEXT NOT NULL CHECK (category IN ('stability', 'saving', 'investing')),
  target_merchant TEXT NOT NULL,
  target_amount NUMERIC DEFAULT 0,
  duration_days INTEGER NOT NULL DEFAULT 1,
  start_date TIMESTAMPTZ NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'failed')),
  xp_reward INTEGER NOT NULL DEFAULT 50,
  coin_reward INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS quests_user_status_idx ON public.quests(user_id, status);

-- 2. Table des Bosses Financiers
CREATE TABLE IF NOT EXISTS public.bosses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT NOT NULL REFERENCES public.waitlist(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  max_hp NUMERIC NOT NULL,
  current_hp NUMERIC NOT NULL,
  target_subscriptions JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'defeated')),
  gold_reward INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bosses_user_status_idx ON public.bosses(user_id, status);

-- 3. Table des Séries de Victoires (Streaks)
CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id BIGINT NOT NULL REFERENCES public.waitlist(id) ON DELETE CASCADE,
  merchant_or_category TEXT NOT NULL,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE NOT NULL DEFAULT current_date,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT streaks_unique_user_merchant UNIQUE (user_id, merchant_or_category)
);

CREATE INDEX IF NOT EXISTS streaks_user_idx ON public.streaks(user_id);

-- 4. Ajout des colonnes Plaid persistantes sur la table waitlist
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS plaid_access_token TEXT;
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS plaid_bank_name TEXT;
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS analysis_summary TEXT;
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS last_analysis_at TIMESTAMPTZ;

-- 5. Mise à jour de la contrainte quests_status_check
ALTER TABLE public.quests DROP CONSTRAINT IF EXISTS quests_status_check;
ALTER TABLE public.quests ADD CONSTRAINT quests_status_check CHECK (status IN ('pending', 'active', 'completed', 'failed'));

-- 6. Table des Abonnements de Notifications Push
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ajout de la colonne user_id si la table existe déjà sans elle
ALTER TABLE public.push_subscriptions ADD COLUMN IF NOT EXISTS user_id BIGINT REFERENCES public.waitlist(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS push_subscriptions_user_idx ON public.push_subscriptions(user_id);

-- 7. Fix start_date on quests: make nullable so pending quests don't get a timer immediately
--    The activation route will set start_date = now() when status changes to 'active'.
ALTER TABLE public.quests ALTER COLUMN start_date DROP NOT NULL;
ALTER TABLE public.quests ALTER COLUMN start_date DROP DEFAULT;

-- 8. Add total_xp and total_coins tracking columns to waitlist
--    These accumulate player rewards from quest completions.
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS total_xp INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.waitlist ADD COLUMN IF NOT EXISTS total_coins INTEGER NOT NULL DEFAULT 0;

