-- ============================================================
-- Compassionate Action – Hosted Supabase Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ------------------------------------------------------------
-- 0. Clean up any conflicting views / tables from previous runs
--    (CASCADE also drops dependent views on these tables)
-- ------------------------------------------------------------
DROP VIEW  IF EXISTS referrals CASCADE;
DROP VIEW  IF EXISTS donations CASCADE;
DROP VIEW  IF EXISTS likes     CASCADE;
DROP VIEW  IF EXISTS comments  CASCADE;
DROP VIEW  IF EXISTS posts     CASCADE;
DROP VIEW  IF EXISTS profiles  CASCADE;

DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS likes     CASCADE;
DROP TABLE IF EXISTS comments  CASCADE;
DROP TABLE IF EXISTS posts     CASCADE;
DROP TABLE IF EXISTS profiles  CASCADE;

-- Drop functions CASCADE (also removes any triggers that reference them)
DROP FUNCTION IF EXISTS handle_new_user()        CASCADE;
DROP FUNCTION IF EXISTS generate_referral_code() CASCADE;

-- ------------------------------------------------------------
-- 1. Profiles (linked to auth.users)
-- ------------------------------------------------------------
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  avatar text,
  bio text,
  country text,
  state text,
  referral_code text UNIQUE,
  referred_by uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT now()
);

-- ------------------------------------------------------------
-- 2. Posts
-- ------------------------------------------------------------
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- ------------------------------------------------------------
-- 3. Comments
-- ------------------------------------------------------------
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- ------------------------------------------------------------
-- 4. Likes
-- ------------------------------------------------------------
CREATE TABLE likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(post_id, user_id),
  created_at timestamp with time zone DEFAULT now()
);

-- ------------------------------------------------------------
-- 5. Donations
-- ------------------------------------------------------------
CREATE TABLE donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name text NOT NULL,
  donor_email text NOT NULL,
  donor_phone text,
  amount_ngn numeric NOT NULL,
  amount_usd numeric,
  method text NOT NULL,
  tx_ref text NOT NULL UNIQUE,
  referrer_id uuid REFERENCES profiles(id),
  status text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- ------------------------------------------------------------
-- 6. Referrals
-- ------------------------------------------------------------
CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  referred_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(referrer_id, referred_id),
  created_at timestamp with time zone DEFAULT now()
);

-- ------------------------------------------------------------
-- 7. Referral code generator function
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS trigger AS $$
DECLARE
  code text;
BEGIN
  LOOP
    code := upper(substr(md5(random()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM profiles WHERE referral_code = code);
  END LOOP;
  NEW.referral_code := code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER set_referral_code
  BEFORE INSERT ON profiles
  FOR EACH ROW
  WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION generate_referral_code();

-- ------------------------------------------------------------
-- 8. Auto-create profile on auth.users sign-up
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, country, state)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'country', ''),
    COALESCE(NEW.raw_user_meta_data->>'state', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ------------------------------------------------------------
-- 9. Row-Level Security
-- ------------------------------------------------------------
ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own; public can read all (for referral lookups)
CREATE POLICY "profiles_select_all"   ON profiles FOR SELECT USING (true);
-- Allow INSERT from the trigger (auth.uid() is null) OR from the user themselves
CREATE POLICY "profiles_insert_own"   ON profiles FOR INSERT WITH CHECK (
  auth.uid() = id OR auth.uid() IS NULL
);
CREATE POLICY "profiles_update_own"   ON profiles FOR UPDATE USING (auth.uid() = id);

-- Posts
CREATE POLICY "posts_select_all"      ON posts FOR SELECT USING (true);
CREATE POLICY "posts_insert_own"      ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_update_own"      ON posts FOR UPDATE USING (auth.uid() = author_id);

-- Comments
CREATE POLICY "comments_select_all"   ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_own"   ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "comments_update_own"   ON comments FOR UPDATE USING (auth.uid() = author_id);

-- Likes
CREATE POLICY "likes_select_all"      ON likes FOR SELECT USING (true);
CREATE POLICY "likes_insert_own"      ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own"      ON likes FOR DELETE USING (auth.uid() = user_id);

-- Donations (public insert for webhook, owner can read their referrals)
CREATE POLICY "donations_insert_any"  ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "donations_select_own"  ON donations FOR SELECT USING (auth.uid() = referrer_id);

-- Referrals
CREATE POLICY "referrals_select_all"  ON referrals FOR SELECT USING (true);
CREATE POLICY "referrals_insert_own"  ON referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);
