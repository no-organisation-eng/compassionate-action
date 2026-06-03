-- Supabase migration for Compassionate Action
-- ------------------------------------------------------------
-- Profiles (users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  avatar text,
  bio text,
  country text,
  state text,
  referral_code text UNIQUE,
  referred_by uuid REFERENCES profiles(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Posts
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(id) NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) NOT NULL,
  author_id uuid REFERENCES profiles(id) NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Likes
CREATE TABLE IF NOT EXISTS likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) NOT NULL,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Donations
CREATE TABLE IF NOT EXISTS donations (
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

-- Referral relationships
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id) NOT NULL,
  referred_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- ------------------------------------------------------------
-- Referral code generator trigger
CREATE OR REPLACE FUNCTION generate_referral_code() RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referral_code BEFORE INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION generate_referral_code();

-- ------------------------------------------------------------
-- Row‑Level Security (RLS) – optional but recommended for production
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Example policies (allow authenticated users to read/write their own data)
-- Profiles
CREATE POLICY "select_own_profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Posts
CREATE POLICY "select_posts" ON posts FOR SELECT USING (true);
CREATE POLICY "insert_posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "update_own_posts" ON posts FOR UPDATE USING (auth.uid() = author_id);

-- Comments
CREATE POLICY "select_comments" ON comments FOR SELECT USING (true);
CREATE POLICY "insert_comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "update_own_comments" ON comments FOR UPDATE USING (auth.uid() = author_id);

-- Likes
CREATE POLICY "select_likes" ON likes FOR SELECT USING (true);
CREATE POLICY "insert_likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_likes" ON likes FOR DELETE USING (auth.uid() = user_id);

-- Donations (public insert via webhook, read by owner)
CREATE POLICY "insert_donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "select_own_donations" ON donations FOR SELECT USING (auth.uid() = referrer_id);

-- Referrals
CREATE POLICY "select_referrals" ON referrals FOR SELECT USING (true);
CREATE POLICY "insert_referrals" ON referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);
