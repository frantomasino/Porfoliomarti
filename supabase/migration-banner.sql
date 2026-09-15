-- Banner opcional de obras.
-- Pegá esto en: Supabase → SQL Editor → Run
-- No borra obras ni textos. Si no lo corrés, el banner no se puede guardar.

alter table public.site_profile
  add column if not exists banner_url text not null default '';
