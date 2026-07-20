-- ==========================================
-- 1. ENABLE ROW LEVEL SECURITY
-- ==========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. PROFILES POLICIES
-- ==========================================
-- Users can read and update their own profile data.
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- ==========================================
-- 3. SUBSCRIPTIONS POLICIES
-- ==========================================
-- Users can view their own subscription status.
-- (Writes are blocked for users; only the Service Role can insert/update via Stripe Webhook).
CREATE POLICY "Users can view own subscription" 
  ON subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

-- ==========================================
-- 4. RESUME REVIEWS POLICIES
-- ==========================================
-- Users have full CRUD over their own resume reviews.
CREATE POLICY "Users can view own reviews" 
  ON resume_reviews FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews" 
  ON resume_reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" 
  ON resume_reviews FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" 
  ON resume_reviews FOR DELETE 
  USING (auth.uid() = user_id);

-- ==========================================
-- 5. USAGE LOGS POLICIES
-- ==========================================
-- Users can view their own usage to see if they hit the limit.
CREATE POLICY "Users can view own usage" 
  ON usage_logs FOR SELECT 
  USING (auth.uid() = user_id);

-- System needs to insert/upsert usage on behalf of the user.
CREATE POLICY "Users can insert own usage" 
  ON usage_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" 
  ON usage_logs FOR UPDATE 
  USING (auth.uid() = user_id);