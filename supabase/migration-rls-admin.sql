-- El admin no usa login de Supabase: escribe con la secret key (service_role).
-- Pegá esto en SQL Editor → Run si al guardar o subir fotos dice RLS.

drop policy if exists "Service role site" on public.site_profile;
create policy "Service role site" on public.site_profile
  for all to service_role using (true) with check (true);

drop policy if exists "Service role projects" on public.projects;
create policy "Service role projects" on public.projects
  for all to service_role using (true) with check (true);

drop policy if exists "Service role project images" on public.project_images;
create policy "Service role project images" on public.project_images
  for all to service_role using (true) with check (true);

drop policy if exists "Service role timeline" on public.timeline_items;
create policy "Service role timeline" on public.timeline_items
  for all to service_role using (true) with check (true);

drop policy if exists "Service role services" on public.services;
create policy "Service role services" on public.services
  for all to service_role using (true) with check (true);

drop policy if exists "Service role messages" on public.contact_messages;
create policy "Service role messages" on public.contact_messages
  for all to service_role using (true) with check (true);

drop policy if exists "Service role sections" on public.page_sections;
create policy "Service role sections" on public.page_sections
  for all to service_role using (true) with check (true);

drop policy if exists "Service role portfolio" on storage.objects;
create policy "Service role portfolio" on storage.objects
  for all to service_role
  using (bucket_id = 'portfolio')
  with check (bucket_id = 'portfolio');
