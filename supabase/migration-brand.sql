-- Logo y favicon del estudio.
-- Pegá esto en: Supabase → SQL Editor → Run
-- No borra obras ni textos.

alter table public.site_profile
  add column if not exists logo_url text not null default '';

alter table public.site_profile
  add column if not exists favicon_url text not null default '';
