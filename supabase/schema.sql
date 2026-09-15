-- Estudio ARQ.MR — esquema completo
-- Pegá este archivo en: Supabase → SQL Editor → Run

-- Extensión
create extension if not exists "pgcrypto";

-- Perfil del sitio (una sola fila)
create table if not exists public.site_profile (
  id uuid primary key default gen_random_uuid(),
  singleton int not null default 1 unique check (singleton = 1),
  full_name text not null default 'Martina',
  studio_name text not null default 'Estudio ARQ.MR',
  profession text not null default 'Arquitecta e interiorista',
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
  add column if not exists studio_name text not null default 'Estudio ARQ.MR';

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

-- Row Level Security
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

-- Storage
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

-- Contenido inicial
insert into public.site_profile (
  id, full_name, studio_name, profession, tagline, bio, philosophy, location, email, phone,
  instagram, linkedin, hero_image_url, portrait_url, seo_title, seo_description, founded_year
) values (
  '11111111-1111-4111-8111-111111111111',
  'Martina',
  'Estudio ARQ.MR',
  'Arquitecta e interiorista',
  'Proyectos integrales, interiorismo y reformas.',
  'Martina es arquitecta e interiorista. Desde Estudio ARQ.MR, en Buenos Aires, desarrolla proyectos integrales, interiorismo y reformas: espacios para habitar, trabajar y encontrarse, pensados a medida de cada encargo.',
  'El trabajo parte de escuchar el lugar y a quien lo va a vivir. Cada obra se resuelve con una mirada atenta a la materialidad, la luz y el detalle, desde el anteproyecto hasta la obra.',
  'Buenos Aires, Argentina',
  '',
  '',
  'https://www.instagram.com/estudioarq.mr/',
  '',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=2400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1600&q=80',
  'Estudio ARQ.MR — Martina, arquitecta e interiorista',
  'Estudio de arquitectura e interiorismo en Buenos Aires. Proyectos integrales, reformas y diseño de interiores.',
  2020
) on conflict (id) do nothing;

insert into public.projects (
  id, title, slug, category, year, location, client, area, status, excerpt, description, cover_url, featured, published, sort_order
) values
(
  'c1a1e001-0000-4000-8000-000000000001',
  'Casa Atelier',
  'casa-atelier',
  'Residencial',
  2024,
  'Palermo, Buenos Aires',
  'Privado',
  '420 m²',
  'Construido',
  'Una casa-estudio que organiza la vida doméstica alrededor de un patio de luz y un taller de trabajo en planta baja.',
  'Casa Atelier nace de un encargo doble: habitar y producir. El proyecto coloca el taller hacia la calle, con una fachada de hormigón y madera que filtra la vida interior, y reserva la casa hacia un jardín posterior.

La secuencia espacial recorre un umbral sombreado, el patio central y las estancias elevadas. La luz se trabaja de manera lateral y cenital, de modo que cada recinto tenga su propia hora del día.

Los materiales se reducen a hormigón visto, roble y piedra de laja. La estructura queda a la vista, y el detalle se concentra en los encuentros: umbrales, barandas, carpinterías de piso a techo.',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
  true, true, 1
),
(
  'c1a1e001-0000-4000-8000-000000000002',
  'Pabellón del Delta',
  'pabellon-del-delta',
  'Cultural',
  2023,
  'Tigre, Buenos Aires',
  'Fundación del Delta',
  '280 m²',
  'Construido',
  'Un pabellón ligero sobre pilotes para exposiciones temporales, pensado para convivir con la crecida del río.',
  'El pabellón se posa sobre el paisaje del Delta sin pretender domesticarlo. Una plataforma de madera elevada libera el suelo para el agua y la vegetación, y un techo continuo de chapa y madera define un recinto de sombra.

El programa es deliberadamente simple: una sala, un foyer abierto y un depósito. La flexibilidad permite transformar el espacio de exposición en auditorio o taller.

La estructura de madera laminada se expresa con honestidad. Las carpinterías corredizas desaparecen en los muros, y el pabellón se abre por completo al río en los meses cálidos.',
  'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=2000&q=80',
  true, true, 2
),
(
  'c1a1e001-0000-4000-8000-000000000003',
  'Loft San Telmo',
  'loft-san-telmo',
  'Interiorismo',
  2023,
  'San Telmo, Buenos Aires',
  'Privado',
  '165 m²',
  'Construido',
  'Rehabilitación de un depósito de principios de siglo: se conservan los muros y se introduce una nueva geometría interior.',
  'El proyecto trabaja sobre un depósito de ladrillo visto. En lugar de borrar las marcas del tiempo, se las deja convivir con una carpintería nueva de roble y un núcleo de servicios en acero negro.

La vivienda se organiza en una sola nave. Un altillo liviano despega del muro original y contiene el dormitorio, de modo que el espacio principal conserve su altura original.

La paleta se reduce a ladrillo, madera, yeso y metal. La iluminación es indirecta, rasante sobre los muros, para subrayar la textura existente.',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80',
  true, true, 3
),
(
  'c1a1e001-0000-4000-8000-000000000004',
  'Casa Patagonia',
  'casa-patagonia',
  'Residencial',
  2022,
  'Bariloche, Río Negro',
  'Privado',
  '310 m²',
  'Construido',
  'Una casa de montaña que se recuesta sobre la pendiente y abre sus estancias principales al lago y al bosque.',
  'Casa Patagonia se implanta en una ladera orientada al norte. El volumen se quiebra en tres crujías para adaptarse a la topografía y protegerse del viento.

El estar, la cocina y la galería forman un único recinto hacia el paisaje. Los dormitorios se retiran hacia el bosque, con una paleta más íntima y ventanas bajas.

La estructura mixta de hormigón y madera de ciprés se deja a la vista. La cubierta de chapa se prolonga en aleros profundos que resuelven la nieve y la sombra de verano.',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80',
  true, true, 4
),
(
  'c1a1e001-0000-4000-8000-000000000005',
  'Galería Norte',
  'galeria-norte',
  'Comercial',
  2021,
  'Recoleta, Buenos Aires',
  'Galería Norte',
  '190 m²',
  'Construido',
  'Reconversión de un local en una galería de arte contemporáneo, con una sala neutra y un patio de esculturas.',
  'La galería se articula en dos recintos: una sala blanca de proporción precisa y un patio posterior donde las obras se encuentran con la vegetación.

Se eliminaron tabiques sucesivos para recuperar la profundidad original del lote. Un lucernario corrido baña el muro de exposición con luz norte, estable y sin deslumbramiento.

El piso de microcemento y los muros de yeso extrafino construyen un fondo silencioso. La recepción se resuelve con un único mostrador de travertino.',
  'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=2000&q=80',
  false, true, 5
),
(
  'c1a1e001-0000-4000-8000-000000000006',
  'Escuela de Oficios',
  'escuela-de-oficios',
  'Institucional',
  2020,
  'Rosario, Santa Fe',
  'Gobierno de Santa Fe',
  '1.240 m²',
  'Construido',
  'Un edificio para la enseñanza de oficios tradicionales, organizado alrededor de patios de trabajo a cielo abierto.',
  'La escuela reúne talleres de carpintería, metal, cerámica y tejido. El edificio se dispone como una secuencia de naves y patios, de manera que el aprendizaje ocurra tanto en el interior como al aire libre.

Los talleres miran a los patios de trabajo. Las aulas teóricas se agrupan en un volumen más cerrado, con luz cenital. Un porche continuo recorre todo el conjunto y funciona como espacio de encuentro.

Se empleó ladrillo de producción local, hormigón y carpintería de quebracho. La materialidad busca ser pedagógica: cada encuentro constructivo queda a la vista para los estudiantes.',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80',
  false, true, 6
)
on conflict (id) do nothing;

insert into public.project_images (id, project_id, url, caption, sort_order) values
('d1a1e001-0000-4000-8000-000000000011', 'c1a1e001-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=80', 'Fachada hacia el jardín', 1),
('d1a1e001-0000-4000-8000-000000000012', 'c1a1e001-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80', 'Patio de luz', 2),
('d1a1e001-0000-4000-8000-000000000013', 'c1a1e001-0000-4000-8000-000000000001', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=80', 'Estar principal', 3),
('d1a1e001-0000-4000-8000-000000000021', 'c1a1e001-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1600047509358-9dc75590d62e?auto=format&fit=crop&w=1800&q=80', 'Volumen sobre el paisaje', 1),
('d1a1e001-0000-4000-8000-000000000022', 'c1a1e001-0000-4000-8000-000000000002', 'https://images.unsplash.com/photo-1600573472591-ee6981cf35b6?auto=format&fit=crop&w=1800&q=80', 'Sala de exposiciones', 2),
('d1a1e001-0000-4000-8000-000000000031', 'c1a1e001-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=80', 'Nave principal', 1),
('d1a1e001-0000-4000-8000-000000000032', 'c1a1e001-0000-4000-8000-000000000003', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=80', 'Cocina y estar', 2),
('d1a1e001-0000-4000-8000-000000000041', 'c1a1e001-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1800&q=80', 'Implantación en la ladera', 1),
('d1a1e001-0000-4000-8000-000000000042', 'c1a1e001-0000-4000-8000-000000000004', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1800&q=80', 'Estar hacia el lago', 2),
('d1a1e001-0000-4000-8000-000000000051', 'c1a1e001-0000-4000-8000-000000000005', 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1800&q=80', 'Sala principal', 1),
('d1a1e001-0000-4000-8000-000000000061', 'c1a1e001-0000-4000-8000-000000000006', 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1800&q=80', 'Nave de talleres', 1),
('d1a1e001-0000-4000-8000-000000000062', 'c1a1e001-0000-4000-8000-000000000006', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80', 'Patio de trabajo', 2)
on conflict (id) do nothing;

insert into public.timeline_items (id, kind, title, subtitle, period, description, sort_order) values
('e1a1e001-0000-4000-8000-000000000001', 'experience', 'Estudio ARQ.MR', 'Fundadora — arquitectura e interiorismo', 'Hoy', 'Proyectos integrales, interiorismo y reformas en Buenos Aires. Acompañamiento cercano desde la idea hasta la obra.', 1),
('e1a1e001-0000-4000-8000-000000000003', 'education', 'Arquitectura e interiorismo', 'Formación profesional', '', 'Práctica enfocada en vivienda, locales y reformas.', 1)
on conflict (id) do nothing;

insert into public.services (id, title, description, sort_order) values
('f1a1e001-0000-4000-8000-000000000001', 'Proyectos integrales', 'Arquitectura e interiorismo en un mismo proceso: vivienda, locales y espacios de trabajo, del croquis a la obra.', 1),
('f1a1e001-0000-4000-8000-000000000002', 'Interiorismo', 'Diseño de interiores, materialidad, mobiliario y luz, pensados para cómo se vive cada espacio.', 2),
('f1a1e001-0000-4000-8000-000000000003', 'Reformas', 'Intervenciones sobre lo existente: baños, cocinas, locales y viviendas, con una lectura atenta del lugar.', 3),
('f1a1e001-0000-4000-8000-000000000004', 'Dirección de obra', 'Seguimiento cercano en obra, coordinación de gremios y control de los detalles que definen el resultado.', 4)
on conflict (id) do nothing;
