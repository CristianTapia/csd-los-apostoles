alter table public.club_modules
drop constraint if exists club_modules_module_check;

alter table public.club_modules
add constraint club_modules_module_check check (
  module in (
    'transparencia',
    'directiva',
    'plantel',
    'socios',
    'calendario',
    'partidos',
    'tienda',
    'actividades',
    'campeonatos'
  )
);

insert into public.club_modules (
  club_id,
  module,
  label,
  is_enabled,
  is_allowed,
  sort_order
)
select
  c.id,
  'partidos',
  'Partidos',
  true,
  true,
  45
from public.clubs c
on conflict (club_id, module)
do update set
  label = excluded.label,
  is_enabled = excluded.is_enabled,
  is_allowed = excluded.is_allowed,
  sort_order = excluded.sort_order;
