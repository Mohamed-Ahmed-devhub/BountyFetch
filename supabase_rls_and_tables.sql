-- ═══════════════════════════════════════════════════════
-- BountyFetch — Full Supabase SQL Setup
-- Run this in: Supabase → SQL Editor → New query
-- ═══════════════════════════════════════════════════════

-- ── 1. PROFILES TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT,
  email       TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  role        TEXT DEFAULT 'freelancer',  -- 'freelancer' | 'client'
  specialty   TEXT,                       -- 'frontend' | 'backend' | 'mobile' etc
  skills      TEXT[] DEFAULT '{}',
  onboarded   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. DIRECT MESSAGES ─────────────────────────────────
CREATE TABLE IF NOT EXISTS direct_messages (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content        TEXT,
  attachment_url TEXT,
  read           BOOLEAN DEFAULT FALSE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. CHANNEL MESSAGES ────────────────────────────────
CREATE TABLE IF NOT EXISTS channel_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel    TEXT NOT NULL,  -- 'web' | 'mobile' | 'ai' | 'security' | 'games' | 'general'
  sender_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content    TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. NOTIFICATIONS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL,   -- 'dm' | 'support_reply' | 'task' | 'system'
  title      TEXT,
  body       TEXT,
  link       TEXT,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. SUPPORT TICKETS ─────────────────────────────────
CREATE TABLE IF NOT EXISTS support_tickets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type         TEXT,    -- 'bug' | 'suggestion' | 'report' | 'other'
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  screenshot_url TEXT,
  status       TEXT DEFAULT 'open',  -- 'open' | 'in_progress' | 'closed'
  admin_reply  TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. SAVED TASKS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_tasks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id    TEXT NOT NULL,
  task_title TEXT,
  source     TEXT,
  budget     TEXT,
  status     TEXT DEFAULT 'active',  -- 'active' | 'in_progress' | 'completed'
  saved_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ═══════════════════════════════════════════════════════

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_read_all"   ON profiles;
DROP POLICY IF EXISTS "profiles_own_update" ON profiles;
CREATE POLICY "profiles_read_all"   ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_own_update" ON profiles FOR ALL    USING (auth.uid() = id);

-- DIRECT MESSAGES
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "dm_own_access" ON direct_messages;
CREATE POLICY "dm_own_access" ON direct_messages FOR ALL
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- CHANNEL MESSAGES
ALTER TABLE channel_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "channel_read_all"  ON channel_messages;
DROP POLICY IF EXISTS "channel_own_write" ON channel_messages;
CREATE POLICY "channel_read_all"  ON channel_messages FOR SELECT USING (true);
CREATE POLICY "channel_own_write" ON channel_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- NOTIFICATIONS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "notifications_own" ON notifications;
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (auth.uid() = user_id);

-- SUPPORT TICKETS
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tickets_own" ON support_tickets;
CREATE POLICY "tickets_own" ON support_tickets FOR ALL USING (auth.uid() = user_id);

-- SAVED TASKS
ALTER TABLE saved_tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "saved_tasks_own" ON saved_tasks;
CREATE POLICY "saved_tasks_own" ON saved_tasks FOR ALL USING (auth.uid() = user_id);

-- ── Enable Realtime ─────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE channel_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE direct_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ── Auto-create profile on signup ──────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

