-- COMPLETE FIX: Use Database Trigger to Auto-Create Profile
-- This bypasses RLS issues by creating profile automatically when user signs up

-- First, drop the existing INSERT policy (we don't need it anymore)
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;

-- Create a function that automatically creates a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that runs the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Now we need an UPDATE policy instead for users to update their profile
CREATE POLICY "profiles_update_own" 
ON profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
