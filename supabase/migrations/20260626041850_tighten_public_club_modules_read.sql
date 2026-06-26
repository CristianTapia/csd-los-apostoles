drop policy if exists "Public can read active club modules"
on public.club_modules;

create policy "Public can read active club modules"
on public.club_modules
for select
using (
  is_allowed = true
  and exists (
    select 1
    from public.clubs c
    where c.id = club_modules.club_id
      and c.status = 'active'
  )
);