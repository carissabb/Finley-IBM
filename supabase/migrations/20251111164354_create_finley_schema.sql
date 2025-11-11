/*
  # Finley Financial App Schema

  ## Overview
  Creates the database schema for Finley - Your Financial Friend app, including tables for user budgets, savings goals, and gamified achievements.

  ## New Tables
  
  ### `user_profiles`
  - `id` (uuid, primary key) - References auth.users
  - `display_name` (text) - User's display name
  - `level` (integer) - User's gamification level
  - `total_points` (integer) - Cumulative achievement points
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `budgets`
  - `id` (uuid, primary key) - Unique budget identifier
  - `user_id` (uuid) - References user_profiles
  - `monthly_income` (decimal) - User's monthly income
  - `needs_percentage` (decimal) - Percentage for needs (default 50)
  - `wants_percentage` (decimal) - Percentage for wants (default 30)
  - `savings_percentage` (decimal) - Percentage for savings (default 20)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `savings_goals`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References user_profiles
  - `goal_name` (text) - Name of the savings goal
  - `target_amount` (decimal) - Target amount to save
  - `current_amount` (decimal) - Current saved amount
  - `deadline` (date) - Target completion date
  - `weekly_target` (decimal) - Calculated weekly savings needed
  - `completed` (boolean) - Goal completion status
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `achievements`
  - `id` (uuid, primary key)
  - `user_id` (uuid) - References user_profiles
  - `achievement_type` (text) - Type of achievement (e.g., 'first_budget', 'savings_milestone')
  - `title` (text) - Achievement display title
  - `description` (text) - Achievement description
  - `points` (integer) - Points awarded
  - `icon` (text) - Icon identifier for badge
  - `unlocked_at` (timestamptz) - When achievement was unlocked
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Authenticated users required for all operations
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text DEFAULT '',
  level integer DEFAULT 1,
  total_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  monthly_income decimal(12,2) NOT NULL DEFAULT 0,
  needs_percentage decimal(5,2) DEFAULT 50,
  wants_percentage decimal(5,2) DEFAULT 30,
  savings_percentage decimal(5,2) DEFAULT 20,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own budgets"
  ON budgets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets"
  ON budgets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
  ON budgets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
  ON budgets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS savings_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  goal_name text NOT NULL,
  target_amount decimal(12,2) NOT NULL,
  current_amount decimal(12,2) DEFAULT 0,
  deadline date,
  weekly_target decimal(12,2) DEFAULT 0,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own savings goals"
  ON savings_goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own savings goals"
  ON savings_goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own savings goals"
  ON savings_goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own savings goals"
  ON savings_goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  points integer DEFAULT 0,
  icon text DEFAULT 'star',
  unlocked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON savings_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);