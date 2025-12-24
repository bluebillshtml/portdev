-- ============================================
-- LINK-IN-BIO SAAS DATABASE SCHEMA
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create immutable function for case-insensitive comparison
CREATE OR REPLACE FUNCTION immutable_lower(text) 
RETURNS text AS $$
  SELECT lower($1);
$$ LANGUAGE sql IMMUTABLE STRICT;

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'vision-os',
  is_verified BOOLEAN DEFAULT false,
  is_pro BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username::text ~* '^[A-Za-z0-9_-]+$')
);

-- Indexes
-- Using text_pattern_ops for better performance with LIKE queries
CREATE UNIQUE INDEX idx_profiles_username_lower ON profiles (immutable_lower(username) text_pattern_ops);
CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);

-- ============================================
-- 2. LINKS TABLE
-- ============================================
CREATE TABLE links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- iconify icon name (e.g., "lucide:link")
  position INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT title_length CHECK (char_length(title) >= 1 AND char_length(title) <= 100),
  CONSTRAINT url_format CHECK (url ~ '^https?://')
);

-- Indexes
CREATE INDEX idx_links_profile_id ON links(profile_id);
CREATE INDEX idx_links_position ON links(profile_id, position);
CREATE INDEX idx_links_visible ON links(profile_id, is_visible, position);

-- ============================================
-- 3. PAGE VIEWS TABLE
-- ============================================
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  country TEXT,
  city TEXT,

  -- Indexes for analytics
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_page_views_profile_id ON page_views(profile_id, viewed_at DESC);
CREATE INDEX idx_page_views_date ON page_views(DATE(viewed_at), profile_id);

-- ============================================
-- 4. LINK CLICKS TABLE
-- ============================================
CREATE TABLE link_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  link_id UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  country TEXT,
  city TEXT
);

-- Indexes
CREATE INDEX idx_link_clicks_link_id ON link_clicks(link_id, clicked_at DESC);
CREATE INDEX idx_link_clicks_profile_id ON link_clicks(profile_id, clicked_at DESC);
CREATE INDEX idx_link_clicks_date ON link_clicks(DATE(clicked_at), link_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;

-- PROFILES: Public read, owner write
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- LINKS: Public read visible links, owner full access
CREATE POLICY "Visible links are viewable by everyone"
  ON links FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Users can view all their own links"
  ON links FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own links"
  ON links FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own links"
  ON links FOR UPDATE
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete their own links"
  ON links FOR DELETE
  USING (auth.uid() = profile_id);

-- PAGE VIEWS: Insert only (no auth required), owner read
CREATE POLICY "Anyone can log page views"
  ON page_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own page views"
  ON page_views FOR SELECT
  USING (auth.uid() = profile_id);

-- LINK CLICKS: Insert only (no auth required), owner read
CREATE POLICY "Anyone can log link clicks"
  ON link_clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own link clicks"
  ON link_clicks FOR SELECT
  USING (auth.uid() = profile_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (for testing)
-- ============================================

-- Sample profile (requires auth user to exist)
-- Run this AFTER creating a user via Supabase Auth
/*
INSERT INTO profiles (id, username, display_name, bio, avatar_url, is_verified)
VALUES (
  'YOUR_AUTH_USER_UUID_HERE',
  'zoeyai',
  'Zoey AI',
  'Your downline needs a system, not just motivation. Zoey automates recruitment, production, and retention for your entire hierarchy.',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoey',
  true
);

-- Sample links
INSERT INTO links (profile_id, title, url, icon, position, is_visible)
VALUES
  ('YOUR_AUTH_USER_UUID_HERE', 'Access System', 'https://stancexsystems.com/signup', 'lucide:zap', 1, true),
  ('YOUR_AUTH_USER_UUID_HERE', 'Book a Demo', 'https://calendly.com/stancex', 'lucide:calendar-check-2', 2, true),
  ('YOUR_AUTH_USER_UUID_HERE', 'Documentation', 'https://docs.stancexsystems.com', 'lucide:book-open', 3, true),
  ('YOUR_AUTH_USER_UUID_HERE', 'Twitter', 'https://twitter.com/stancexsystems', 'lucide:twitter', 4, true);
*/

-- ============================================
-- MATERIALIZED VIEW: Analytics Summary
-- ============================================
CREATE MATERIALIZED VIEW profile_analytics AS
SELECT
  p.id AS profile_id,
  p.username,
  COUNT(DISTINCT pv.id) AS total_views,
  COUNT(DISTINCT lc.id) AS total_clicks,
  COUNT(DISTINCT l.id) FILTER (WHERE l.is_visible = true) AS active_links,
  MAX(pv.viewed_at) AS last_viewed_at
FROM profiles p
LEFT JOIN page_views pv ON p.id = pv.profile_id
LEFT JOIN links l ON p.id = l.profile_id
LEFT JOIN link_clicks lc ON p.id = lc.profile_id
GROUP BY p.id, p.username;

-- Refresh function (call daily via cron)
CREATE UNIQUE INDEX idx_profile_analytics_profile_id ON profile_analytics(profile_id);
