do $$
declare
  admin_email text := 'REPLACE_WITH_ADMIN_EMAIL';
  target_club_id uuid;
  target_user_id uuid;
begin
  if admin_email = 'REPLACE_WITH_ADMIN_EMAIL' then
    raise exception 'Replace admin_email before running this seed.';
  end if;

  insert into public.clubs (name, slug, status)
  values ('CSD Los Apóstoles', 'csd-los-apostoles', 'active')
  on conflict (slug) do update
    set name = excluded.name,
        status = excluded.status,
        updated_at = now()
  returning id into target_club_id;

  insert into public.club_settings (
    club_id,
    public_name,
    primary_color,
    secondary_color,
    accent_color
  )
  values (
    target_club_id,
    'CSD Los Apóstoles',
    '#111111',
    '#6b7280',
    '#13ec5b'
  )
  on conflict (club_id) do update
    set public_name = excluded.public_name,
        primary_color = excluded.primary_color,
        secondary_color = excluded.secondary_color,
        accent_color = excluded.accent_color,
        updated_at = now();

  select id
  into target_user_id
  from public.profiles
  where lower(email) = lower(admin_email)
  limit 1;

  if target_user_id is null then
    raise exception 'No profile found for %. Create the user in Supabase Auth first and confirm handle_new_user created the profile.', admin_email;
  end if;

  insert into public.user_roles (user_id, club_id, role)
  values (target_user_id, null, 'superadmin')
  on conflict (user_id, club_id, role) do nothing;

  insert into public.user_roles (user_id, club_id, role)
  values (target_user_id, target_club_id, 'tenant_owner')
  on conflict (user_id, club_id, role) do nothing;
end;
$$;
