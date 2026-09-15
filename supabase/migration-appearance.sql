-- Colores, textos del menu y secciones extra.
-- Pega esto en Supabase → SQL Editor → Run
-- No borra obras ni perfil.

alter table public.site_profile
  add column if not exists theme jsonb not null default '{}'::jsonb;

alter table public.site_profile
  add column if not exists labels jsonb not null default '{}'::jsonb;

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  body text not null default '',
  image_url text not null default '',
  placement text not null default 'home',
  published boolean not null default true,
  sort_order int not null default 0
);

alter table public.page_sections drop constraint if exists page_sections_placement_check;
alter table public.page_sections add constraint page_sections_placement_check
  check (placement in ('home', 'estudio', 'contacto', 'proyectos', 'both', 'all'));

alter table public.page_sections enable row level security;

drop policy if exists "Public read page sections" on public.page_sections;
create policy "Public read page sections" on public.page_sections
  for select using (published = true);

drop policy if exists "Auth all page sections" on public.page_sections;
create policy "Auth all page sections" on public.page_sections
  for all to authenticated using (true) with check (true);
