alter table public.club_events
add column if not exists location_url text;

create table if not exists public.club_match_details (
  event_id uuid primary key references public.club_events(id) on delete cascade,

  club_side text not null default 'home',
  opponent_name text not null,

  competition_name text,
  category text,

  club_score integer,
  opponent_score integer,

  club_kit_color text,
  opponent_kit_color text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint club_match_details_club_side_check check (
    club_side in ('home', 'away', 'neutral')
  ),

  constraint club_match_details_scores_check check (
    (
      club_score is null
      and opponent_score is null
    )
    or (
      club_score is not null
      and opponent_score is not null
      and club_score >= 0
      and opponent_score >= 0
    )
  ),

  constraint club_match_details_club_kit_color_check check (
    club_kit_color is null
    or club_kit_color ~ '^#[0-9A-Fa-f]{6}$'
  ),

  constraint club_match_details_opponent_kit_color_check check (
    opponent_kit_color is null
    or opponent_kit_color ~ '^#[0-9A-Fa-f]{6}$'
  )
);

create index if not exists club_match_details_club_side_idx
on public.club_match_details(club_side);

create index if not exists club_match_details_competition_name_idx
on public.club_match_details(competition_name);

create index if not exists club_match_details_category_idx
on public.club_match_details(category);

drop trigger if exists set_club_match_details_updated_at
on public.club_match_details;

create trigger set_club_match_details_updated_at
before update on public.club_match_details
for each row
execute function public.set_updated_at();

alter table public.club_match_details enable row level security;

drop policy if exists "Public can read public match details"
on public.club_match_details;

create policy "Public can read public match details"
on public.club_match_details
for select
using (
  exists (
    select 1
    from public.club_events e
    join public.clubs c on c.id = e.club_id
    where e.id = club_match_details.event_id
      and e.event_type = 'match'
      and e.is_public = true
      and c.status = 'active'
  )
);

drop policy if exists "Club admins can read match details"
on public.club_match_details;

create policy "Club admins can read match details"
on public.club_match_details
for select
using (
  exists (
    select 1
    from public.club_events e
    where e.id = club_match_details.event_id
      and e.event_type = 'match'
      and public.can_admin_club(e.club_id)
  )
);

drop policy if exists "Club admins can insert match details"
on public.club_match_details;

create policy "Club admins can insert match details"
on public.club_match_details
for insert
with check (
  exists (
    select 1
    from public.club_events e
    where e.id = club_match_details.event_id
      and e.event_type = 'match'
      and public.can_admin_club(e.club_id)
  )
);

drop policy if exists "Club admins can update match details"
on public.club_match_details;

create policy "Club admins can update match details"
on public.club_match_details
for update
using (
  exists (
    select 1
    from public.club_events e
    where e.id = club_match_details.event_id
      and e.event_type = 'match'
      and public.can_admin_club(e.club_id)
  )
)
with check (
  exists (
    select 1
    from public.club_events e
    where e.id = club_match_details.event_id
      and e.event_type = 'match'
      and public.can_admin_club(e.club_id)
  )
);

drop policy if exists "Club admins can delete match details"
on public.club_match_details;

create policy "Club admins can delete match details"
on public.club_match_details
for delete
using (
  exists (
    select 1
    from public.club_events e
    where e.id = club_match_details.event_id
      and e.event_type = 'match'
      and public.can_admin_club(e.club_id)
  )
);

drop policy if exists "Superadmins can manage match details"
on public.club_match_details;

create policy "Superadmins can manage match details"
on public.club_match_details
for all
using (
  public.is_superadmin()
)
with check (
  public.is_superadmin()
);

insert into public.club_match_details (
  event_id,
  club_side,
  opponent_name,
  club_score,
  opponent_score
)
select
  e.id,
  'home',
  coalesce(nullif(trim(e.opponent), ''), 'Rival por definir'),
  e.home_score,
  e.away_score
from public.club_events e
where e.event_type = 'match'
on conflict (event_id) do nothing;