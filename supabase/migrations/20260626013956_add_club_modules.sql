create table if not exists public.club_modules (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  module text not null,
  label text not null,
  is_enabled boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint club_modules_module_check check (
    module in (
      'transparencia',
      'plantel',
      'socios',
      'tienda',
      'actividades',
      'campeonatos',
      'calendario'
    )
  ),

  constraint club_modules_unique_module unique (club_id, module)
);

create index if not exists idx_club_modules_club_id
on public.club_modules (club_id);

create index if not exists idx_club_modules_enabled
on public.club_modules (club_id, is_enabled, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_club_modules_updated_at on public.club_modules;

create trigger set_club_modules_updated_at
before update on public.club_modules
for each row
execute function public.set_updated_at();

alter table public.club_modules enable row level security;

drop policy if exists "Public can read active club modules"
on public.club_modules;

create policy "Public can read active club modules"
on public.club_modules
for select
using (
  exists (
    select 1
    from public.clubs c
    where c.id = club_modules.club_id
      and c.status = 'active'
  )
);

drop policy if exists "Club admins can manage club modules"
on public.club_modules;

create policy "Club admins can manage club modules"
on public.club_modules
for all
using (public.can_admin_club(club_id))
with check (public.can_admin_club(club_id));

insert into public.club_modules (
  club_id,
  module,
  label,
  is_enabled,
  sort_order
)
select
  c.id,
  m.module,
  m.label,
  m.is_enabled,
  m.sort_order
from public.clubs c
cross join (
  values
    ('transparencia', 'Transparencia', true, 10),
    ('plantel', 'Plantel', true, 20),
    ('socios', 'Socios', true, 30),
    ('calendario', 'Calendario', true, 40),
    ('tienda', 'Tienda', true, 50),
    ('actividades', 'Actividades', true, 60),
    ('campeonatos', 'Campeonatos', true, 70)
) as m(module, label, is_enabled, sort_order)
on conflict (club_id, module) do nothing;