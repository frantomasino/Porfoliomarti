-- Si ya corriste schema.sql antes, ejecutá esto para habilitar videos en la galería.
alter table public.project_images
  add column if not exists kind text not null default 'image';
