-- Drop and recreate extensions in the correct schema
DROP EXTENSION IF EXISTS pg_cron CASCADE;
DROP EXTENSION IF EXISTS pg_net CASCADE;

-- Create extensions in extensions schema
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Reschedule daily quote generation (every day at 9 AM UTC)
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