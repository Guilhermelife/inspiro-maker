-- Create table for favorite quotes
CREATE TABLE public.favorite_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  quote_text TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.favorite_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own favorites" 
ON public.favorite_quotes 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own favorites" 
ON public.favorite_quotes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own favorites" 
ON public.favorite_quotes 
FOR DELETE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create table for user-created quotes
CREATE TABLE public.user_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  quote_text TEXT NOT NULL,
  author TEXT NOT NULL,
  profile_photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_quotes ENABLE ROW LEVEL SECURITY;

-- Create policies for user quotes
CREATE POLICY "Users can view their own quotes" 
ON public.user_quotes 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own quotes" 
ON public.user_quotes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own quotes" 
ON public.user_quotes 
FOR DELETE 
USING (auth.uid() = user_id OR user_id IS NULL);