-- Migration: Fix Admin System Foreign Keys
-- Purpose: Correct references to match existing schema (profiles instead of users)
-- Created: 2025-12-27

-- Drop existing foreign key constraints that reference non-existent users table
ALTER TABLE IF EXISTS public.revenue_transactions 
  DROP CONSTRAINT IF EXISTS revenue_transactions_user_id_fkey;

ALTER TABLE IF EXISTS public.cost_tracking 
  DROP CONSTRAINT IF EXISTS cost_tracking_user_id_fkey;

ALTER TABLE IF EXISTS public.complaints 
  DROP CONSTRAINT IF EXISTS complaints_user_id_fkey;

-- Add correct foreign keys referencing auth.users (which profiles also references)
ALTER TABLE public.revenue_transactions
  ADD CONSTRAINT revenue_transactions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.cost_tracking
  ADD CONSTRAINT cost_tracking_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.complaints
  ADD CONSTRAINT complaints_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Ensure profiles table exists and has proper trigger for new users
-- This creates a profile automatically when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.admin_users TO authenticated;
GRANT ALL ON public.analytics_metrics TO authenticated;
GRANT ALL ON public.complaints TO authenticated;
GRANT ALL ON public.revenue_transactions TO authenticated;
GRANT ALL ON public.cost_tracking TO authenticated;

-- Add RLS policy for profiles if not exists
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically create profile when user signs up';
