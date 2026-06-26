create table if not exists public.club_events (
  id uuid primary key default gen_random_uuid(),

  club_id uuid not null references public.clubs(id) on delete cascade,

  title text not null,
  description text,

  event_type text not null default 'match',
  status text not null default 'scheduled',

  starts_at timestamptz not null,
  ends_at timestamptz,

  location text,

  opponent text,
  home_score integer,
  away_score integer,

  is_public boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint club_events_event_type_check check (
    event_type in (
      'match',
      'training',
      'meeting',
      'fundraiser',
      'community',
      'tournament',
      'other'
    )
  ),

  constraint club_events_status_check check (
    status in (
      'scheduled',
      'completed',
      'cancelled',
      'postponed'
    )
  ),

  constraint club_events_scores_check check (
    (
      home_score is null
      and away_score is null
    )
    or (
      home_score is not null
      and away_score is not null
      and home_score >= 0
      and away_score >= 0
    )
  ),

  constraint club_events_ends_after_starts_check check (
    ends_at is null
    or ends_at >= starts_at
  )
);

create index if not exists club_events_club_id_idx
on public.club_events(club_id);

create index if not exists club_events_public_starts_at_idx
on public.club_events(club_id, is_public, starts_at);

create index if not exists club_events_status_idx
on public.club_events(status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_club_events_updated_at
on public.club_events;

create trigger set_club_events_updated_at
before update on public.club_events
for each row
execute function public.set_updated_at();

alter table public.club_events enable row level security;

drop policy if exists "Public can read public club events"
on public.club_events;

create policy "Public can read public club events"
on public.club_events
for select
using (
  is_public = true
  and exists (
    select 1
    from public.clubs c
    where c.id = club_events.club_id
      and c.status = 'active'
  )
);

drop policy if exists "Club admins can read club events"
on public.club_events;

create policy "Club admins can read club events"
on public.club_events
for select
using (
  public.can_admin_club(club_id)
);

drop policy if exists "Club admins can insert club events"
on public.club_events;

create policy "Club admins can insert club events"
on public.club_events
for insert
with check (
  public.can_admin_club(club_id)
);

drop policy if exists "Club admins can update club events"
on public.club_events;

create policy "Club admins can update club events"
on public.club_events
for update
using (
  public.can_admin_club(club_id)
)
with check (
  public.can_admin_club(club_id)
);

drop policy if exists "Club admins can delete club events"
on public.club_events;

create policy "Club admins can delete club events"
on public.club_events
for delete
using (
  public.can_admin_club(club_id)
);

drop policy if exists "Superadmins can manage club events"
on public.club_events;

create policy "Superadmins can manage club events"
on public.club_events
for all
using (
  public.is_superadmin()
)
with check (
  public.is_superadmin()
);