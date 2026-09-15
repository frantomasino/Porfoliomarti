-- Estudio ARQ.MR — solo estructura. Sin obras ni textos de ejemplo.
-- Pegá esto en: Supabase → SQL Editor → Run
-- Lo que cargues después en /admin queda guardado acá.

create extension if not exists "pgcrypto";

create table if not exists public.site_profile (
  id uuid primary key default gen_random_uuid(),
  singleton int not null default 1 unique check (singleton = 1),
  full_name text not null default '',
  studio_name text not null default '',
  profession text not null default '',
  tagline text not null default '',
  bio text not null default '',
  philosophy text not null default '',
  location text not null default '',
  email text not null default '',
  phone text not null default '',
  instagram text not null default '',
  linkedin text not null default '',
  hero_image_url text not null default '',
  portrait_url text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  founded_year int not null default 2020,
  updated_at timestamptz not null default now()
);

alter table public.site_profile
  add column if not exists studio_name text not null default '';

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'Residencial',
  year int not null default extract(year from now()),
  location text not null default '',
  client text not null default '',
  area text not null default '',
  status text not null default 'Proyecto',
  excerpt text not null default '',
  description text not null default '',
  cover_url text not null default '',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  url text not null,
  caption text not null default '',
  sort_order int not null default 0,
  kind text not null default 'image'
);

alter table public.project_images
  add column if not exists kind text not null default 'image';

create table if not exists public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('education', 'experience', 'award')),
  title text not null,
  subtitle text not null default '',
  period text not null default '',
  description text not null default '',
  sort_order int not null default 0
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  sort_order int not null default 0
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_published_idx on public.projects (published, sort_order);
create index if not exists project_images_project_idx on public.project_images (project_id, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_profile_updated_at on public.site_profile;
create trigger site_profile_updated_at
before update on public.site_profile
for each row execute procedure public.set_updated_at();

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
before update on public.projects
for each row execute procedure public.set_updated_at();

alter table public.site_profile enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.timeline_items enable row level security;
alter table public.services enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "Public read site" on public.site_profile;
create policy "Public read site" on public.site_profile
  for select using (true);

drop policy if exists "Auth write site" on public.site_profile;
create policy "Auth write site" on public.site_profile
  for all to authenticated using (true) with check (true);

drop policy if exists "Public read published projects" on public.projects;
create policy "Public read published projects" on public.projects
  for select using (published = true);

drop policy if exists "Auth all projects" on public.projects;
create policy "Auth all projects" on public.projects
  for all to authenticated using (true) with check (true);

drop policy if exists "Public read published project images" on public.project_images;
create policy "Public read published project images" on public.project_images
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_id and p.published = true
    )
  );

drop policy if exists "Auth all project images" on public.project_images;
create policy "Auth all project images" on public.project_images
  for all to authenticated using (true) with check (true);

drop policy if exists "Public read timeline" on public.timeline_items;
create policy "Public read timeline" on public.timeline_items
  for select using (true);

drop policy if exists "Auth all timeline" on public.timeline_items;
create policy "Auth all timeline" on public.timeline_items
  for all to authenticated using (true) with check (true);

drop policy if exists "Public read services" on public.services;
create policy "Public read services" on public.services
  for select using (true);

drop policy if exists "Auth all services" on public.services;
create policy "Auth all services" on public.services
  for all to authenticated using (true) with check (true);

drop policy if exists "Anyone can send messages" on public.contact_messages;
create policy "Anyone can send messages" on public.contact_messages
  for insert with check (true);

drop policy if exists "Auth read messages" on public.contact_messages;
create policy "Auth read messages" on public.contact_messages
  for select to authenticated using (true);

drop policy if exists "Auth update messages" on public.contact_messages;
create policy "Auth update messages" on public.contact_messages
  for update to authenticated using (true) with check (true);

drop policy if exists "Auth delete messages" on public.contact_messages;
create policy "Auth delete messages" on public.contact_messages
  for delete to authenticated using (true);

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read portfolio" on storage.objects;
create policy "Public read portfolio"
on storage.objects for select
using (bucket_id = 'portfolio');

drop policy if exists "Auth upload portfolio" on storage.objects;
create policy "Auth upload portfolio"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio');

drop policy if exists "Auth update portfolio" on storage.objects;
create policy "Auth update portfolio"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio');

drop policy if exists "Auth delete portfolio" on storage.objects;
create policy "Auth delete portfolio"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio');

-- Si corriste el SQL anterior, esto borra las obras inventadas.
truncate table
  public.project_images,
  public.projects,
  public.timeline_items,
  public.services,
  public.contact_messages,
  public.site_profile
restart identity cascade;

-- Una fila vacía para que /admin tenga dónde guardar el perfil.
insert into public.site_profile (id, full_name, studio_name, profession, instagram)
values (
  '11111111-1111-4111-8111-111111111111',
  'Martina',
  'Estudio ARQ.MR',
  'Arquitecta e interiorista',
  'https://www.instagram.com/estudioarq.mr/'
);

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
