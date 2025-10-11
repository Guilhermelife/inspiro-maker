-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create quotes table for daily quotes
CREATE TABLE IF NOT EXISTS public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read quotes
CREATE POLICY "Anyone can view quotes"
  ON public.quotes
  FOR SELECT
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_quotes_created_at ON public.quotes(created_at DESC);
CREATE INDEX idx_quotes_category ON public.quotes(category);

-- Insert initial quotes from the app
INSERT INTO public.quotes (text, author, category) VALUES
  ('A persistência é o caminho do êxito.', 'Charles Chaplin', 'motivacao'),
  ('Acredite em si próprio e chegará um dia em que os outros não terão outra escolha senão acreditar com você.', 'Cynthia Kersey', 'motivacao'),
  ('O sucesso é a soma de pequenos esforços repetidos dia após dia.', 'Robert Collier', 'motivacao'),
  ('A única forma de fazer um excelente trabalho é amar o que você faz.', 'Steve Jobs', 'motivacao'),
  ('O fracasso é a oportunidade de começar de novo de forma mais inteligente.', 'Henry Ford', 'motivacao'),
  ('Seja a mudança que você quer ver no mundo.', 'Mahatma Gandhi', 'inspiracao'),
  ('A vida é 10% o que acontece a você e 90% como você reage a isso.', 'Charles R. Swindoll', 'inspiracao'),
  ('O único limite para a nossa realização de amanhã são as nossas dúvidas de hoje.', 'Franklin D. Roosevelt', 'inspiracao'),
  ('Não conte os dias, faça os dias contarem.', 'Muhammad Ali', 'inspiracao'),
  ('A felicidade não é algo pronto. Ela vem das suas próprias ações.', 'Dalai Lama', 'inspiracao'),
  ('A sabedoria é a filha da experiência.', 'Leonardo da Vinci', 'sabedoria'),
  ('A paciência é amarga, mas seus frutos são doces.', 'Jean-Jacques Rousseau', 'sabedoria'),
  ('O conhecimento fala, mas a sabedoria escuta.', 'Jimi Hendrix', 'sabedoria'),
  ('A experiência é o nome que damos aos nossos erros.', 'Oscar Wilde', 'sabedoria'),
  ('A simplicidade é o último grau de sofisticação.', 'Leonardo da Vinci', 'sabedoria'),
  ('Ame como se nunca tivesse sido magoado.', 'Mark Twain', 'amor'),
  ('O amor é a asa veloz que Deus deu à alma para que ela voe até o céu.', 'Michelangelo', 'amor'),
  ('Onde há amor, há vida.', 'Mahatma Gandhi', 'amor');

-- Schedule daily quote generation (every day at 9 AM UTC)
SELECT cron.schedule(
  'daily-quote-generation',
  '0 9 * * *',
  $$
  SELECT
    net.http_post(
      url:='https://yezvkzscytyfazudfklf.supabase.co/functions/v1/daily-quote-update',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllenZrenNjeXR5ZmF6dWRma2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDcwOTIsImV4cCI6MjA3NTQ4MzA5Mn0.7G5faBunRUuXyR_hVddCp6i1xpAh0NRdH3SUZer-6LY"}'::jsonb,
      body:='{"trigger": "cron"}'::jsonb
    ) as request_id;
  $$
);