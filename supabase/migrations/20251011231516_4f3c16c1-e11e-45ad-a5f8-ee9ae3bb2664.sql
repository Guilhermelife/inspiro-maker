-- Fix RLS policies to remove NULL bypass vulnerability
-- This addresses the critical security issue where unauthenticated users
-- could access data when user_id is NULL

-- Drop existing policies on favorite_quotes
DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorite_quotes;
DROP POLICY IF EXISTS "Users can create their own favorites" ON public.favorite_quotes;
DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorite_quotes;

-- Drop existing policies on user_quotes
DROP POLICY IF EXISTS "Users can view their own quotes" ON public.user_quotes;
DROP POLICY IF EXISTS "Users can create their own quotes" ON public.user_quotes;
DROP POLICY IF EXISTS "Users can delete their own quotes" ON public.user_quotes;

-- Clean up existing NULL records (assign to a system user or delete)
-- We'll delete them as they shouldn't exist in a user-authenticated system
DELETE FROM public.favorite_quotes WHERE user_id IS NULL;
DELETE FROM public.user_quotes WHERE user_id IS NULL;

-- Make user_id NOT NULL to prevent future NULL entries
ALTER TABLE public.favorite_quotes ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.user_quotes ALTER COLUMN user_id SET NOT NULL;

-- Create secure RLS policies without NULL bypass
-- favorite_quotes policies
CREATE POLICY "Users can view their own favorites" 
ON public.favorite_quotes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
ON public.favorite_quotes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.favorite_quotes 
FOR DELETE 
USING (auth.uid() = user_id);

-- user_quotes policies
CREATE POLICY "Users can view their own quotes" 
ON public.user_quotes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quotes" 
ON public.user_quotes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quotes" 
ON public.user_quotes 
FOR DELETE 
USING (auth.uid() = user_id);