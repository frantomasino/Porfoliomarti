# Portafolio de arquitectura

Sitio público + panel en `/admin`. El contenido (textos, obras, fotos y mensajes) se guarda en Supabase.

## Arrancar

```bash
npm install
npm run dev
```

- Sitio: http://localhost:3000
- Admin: http://localhost:3000/admin
- Clave inicial: `atelier` (cambiala en `.env.local` → `ADMIN_PASSWORD`)

## Guardar todo en Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com).
2. En SQL Editor ejecutá `supabase/schema.sql`.
3. En Project Settings → API copiá URL, `anon` key y `service_role` key.
4. Completá `.env.local`:

```env
ADMIN_PASSWORD=atelier
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

5. Reiniciá `npm run dev`.

No hace falta crear usuarios en Authentication. En `/admin` ponés la clave, y lo que subas (obras, **varias fotos y videos**, textos, mensajes) queda en Supabase.

Si el proyecto de Supabase ya existía, ejecutá también `supabase/migration-media.sql` para el campo de tipo foto/video.
