alter table public.club_modules
add column if not exists is_allowed boolean not null default true;

create index if not exists idx_club_modules_public_visible
on public.club_modules (club_id, is_allowed, is_enabled, sort_order);