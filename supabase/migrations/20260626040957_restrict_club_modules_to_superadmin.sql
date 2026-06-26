drop policy if exists "Club admins can manage club modules"
on public.club_modules;

drop policy if exists "Club admins can read club modules"
on public.club_modules;

drop policy if exists "Superadmins can manage club modules"
on public.club_modules;

create policy "Club admins can read club modules"
on public.club_modules
for select
using (public.can_admin_club(club_id));

create policy "Superadmins can manage club modules"
on public.club_modules
for all
using (public.is_superadmin())
with check (public.is_superadmin());