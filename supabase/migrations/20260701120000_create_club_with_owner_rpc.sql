create or replace function public.create_club_with_owner(
  p_name text,
  p_slug text,
  p_owner_email text
)
returns table (
  id uuid,
  name text,
  slug text
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_club_id uuid;
  v_constraint text;
begin
  if not public.is_superadmin() then
    raise exception 'PERMISSION_DENIED: Solo superadmin puede crear clubes.'
      using errcode = 'P0001';
  end if;

  select p.id
  into v_owner_id
  from public.profiles p
  where lower(p.email) = lower(trim(p_owner_email))
  limit 1;

  if v_owner_id is null then
    raise exception 'OWNER_PROFILE_NOT_FOUND: No existe un profile para el email indicado.'
      using errcode = 'P0001';
  end if;

  insert into public.clubs (
    name,
    slug,
    status
  )
  values (
    trim(p_name),
    trim(p_slug),
    'active'
  )
  returning clubs.id into v_club_id;

  insert into public.club_settings (
    club_id,
    public_name,
    logo_url,
    cover_image_url,
    primary_color,
    secondary_color,
    accent_color
  )
  values (
    v_club_id,
    trim(p_name),
    null,
    null,
    '#111827',
    '#F9FAFB',
    '#22C55E'
  )
  on conflict (club_id) do update
    set public_name = excluded.public_name,
        logo_url = excluded.logo_url,
        cover_image_url = excluded.cover_image_url,
        primary_color = excluded.primary_color,
        secondary_color = excluded.secondary_color,
        accent_color = excluded.accent_color,
        updated_at = now();

  insert into public.club_modules (
    club_id,
    module,
    label,
    is_enabled,
    is_allowed,
    sort_order
  )
  values
    (v_club_id, 'transparencia', 'Transparencia', true, true, 10),
    (v_club_id, 'directiva', 'Directiva', true, true, 15),
    (v_club_id, 'plantel', 'Plantel', true, true, 20),
    (v_club_id, 'socios', 'Socios', true, true, 30),
    (v_club_id, 'calendario', 'Calendario', true, true, 40),
    (v_club_id, 'partidos', 'Partidos', true, true, 45),
    (v_club_id, 'tienda', 'Tienda', true, true, 50),
    (v_club_id, 'actividades', 'Actividades', true, true, 60),
    (v_club_id, 'campeonatos', 'Campeonatos', true, true, 70)
  on conflict (club_id, module) do update
    set label = excluded.label,
        is_enabled = excluded.is_enabled,
        is_allowed = excluded.is_allowed,
        sort_order = excluded.sort_order;

  insert into public.user_roles (
    user_id,
    club_id,
    role
  )
  values (
    v_owner_id,
    v_club_id,
    'tenant_owner'
  )
  on conflict (user_id, club_id, role) do nothing;

  return query
  select c.id, c.name, c.slug
  from public.clubs c
  where c.id = v_club_id;
exception
  when unique_violation then
    get stacked diagnostics v_constraint = constraint_name;

    if v_constraint = 'clubs_slug_key' then
      raise exception 'CLUB_SLUG_ALREADY_EXISTS: Ya existe un club con ese slug.'
        using errcode = '23505';
    end if;

    raise;
end;
$$;
