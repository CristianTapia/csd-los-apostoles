create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.club_settings (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  public_name text not null,
  logo_url text,
  cover_image_url text,
  primary_color text not null default '#111111',
  secondary_color text not null default '#6b7280',
  accent_color text not null default '#13ec5b',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id)
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  club_id uuid references public.clubs(id) on delete cascade,
  role text not null check (role in ('superadmin', 'tenant_owner', 'tenant_admin', 'member')),
  created_at timestamptz not null default now(),
  unique nulls not distinct (user_id, club_id, role),
  check (
    (role = 'superadmin' and club_id is null)
    or (role <> 'superadmin' and club_id is not null)
  )
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  name text not null,
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.players (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  first_name text not null,
  last_name text not null,
  position text,
  status text not null default 'active' check (status in ('active', 'inactive', 'injured', 'suspended')),
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  team_id uuid references public.teams(id) on delete set null,
  opponent_name text not null,
  home_away text not null check (home_away in ('home', 'away', 'neutral')),
  match_date timestamptz not null,
  venue text,
  status text not null default 'scheduled' check (status in ('scheduled', 'played', 'postponed', 'cancelled')),
  goals_for integer check (goals_for is null or goals_for >= 0),
  goals_against integer check (goals_against is null or goals_against >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.members (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  full_name text not null,
  email text,
  phone text,
  status text not null default 'active' check (status in ('active', 'inactive', 'past_due')),
  joined_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.member_dues (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,
  period_month int not null check (period_month between 1 and 12),
  period_year int not null check (period_year between 2000 and 2100),
  amount integer not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'overdue', 'cancelled')),
  due_date date,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (member_id, period_month, period_year)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  member_id uuid references public.members(id) on delete set null,
  member_due_id uuid references public.member_dues(id) on delete set null,
  provider text not null,
  provider_payment_id text,
  amount integer not null check (amount >= 0),
  currency text not null default 'CLP',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  paid_at timestamptz,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clubs_slug_idx on public.clubs(slug);
create index user_roles_user_id_idx on public.user_roles(user_id);
create index user_roles_club_id_idx on public.user_roles(club_id);
create index teams_club_id_idx on public.teams(club_id);
create index players_club_id_idx on public.players(club_id);
create index players_team_id_idx on public.players(team_id);
create index matches_club_id_match_date_idx on public.matches(club_id, match_date desc);
create index members_club_id_idx on public.members(club_id);
create index member_dues_club_id_status_idx on public.member_dues(club_id, status);
create index payments_club_id_status_idx on public.payments(club_id, status);
create unique index payments_provider_payment_id_idx
  on public.payments(provider, provider_payment_id)
  where provider_payment_id is not null;

create trigger set_clubs_updated_at before update on public.clubs
  for each row execute function public.set_updated_at();
create trigger set_club_settings_updated_at before update on public.club_settings
  for each row execute function public.set_updated_at();
create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_teams_updated_at before update on public.teams
  for each row execute function public.set_updated_at();
create trigger set_players_updated_at before update on public.players
  for each row execute function public.set_updated_at();
create trigger set_matches_updated_at before update on public.matches
  for each row execute function public.set_updated_at();
create trigger set_members_updated_at before update on public.members
  for each row execute function public.set_updated_at();
create trigger set_member_dues_updated_at before update on public.member_dues
  for each row execute function public.set_updated_at();
create trigger set_payments_updated_at before update on public.payments
  for each row execute function public.set_updated_at();

create or replace function public.has_role(required_role text, target_club_id uuid default null)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = required_role
      and (
        (target_club_id is null and club_id is null)
        or club_id = target_club_id
      )
  );
$$;

create or replace function public.is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role('superadmin', null);
$$;

create or replace function public.can_admin_club(target_club_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_superadmin()
    or public.has_role('tenant_owner', target_club_id)
    or public.has_role('tenant_admin', target_club_id);
$$;

create or replace function public.has_club_membership(target_club_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.can_admin_club(target_club_id)
    or public.has_role('member', target_club_id);
$$;

create or replace function public.club_is_active(target_club_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.clubs
    where id = target_club_id
      and status = 'active'
  );
$$;

alter table public.clubs enable row level security;
alter table public.club_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.members enable row level security;
alter table public.member_dues enable row level security;
alter table public.payments enable row level security;

create policy "Public can read active clubs"
on public.clubs for select
using (status = 'active');

create policy "Superadmin can insert clubs"
on public.clubs for insert to authenticated
with check (public.is_superadmin());

create policy "Club admins can update their club"
on public.clubs for update to authenticated
using (public.can_admin_club(id))
with check (public.can_admin_club(id));

create policy "Superadmin can delete clubs"
on public.clubs for delete to authenticated
using (public.is_superadmin());

create policy "Public can read active club settings"
on public.club_settings for select
using (public.club_is_active(club_id));

create policy "Club admins can manage club settings"
on public.club_settings for all to authenticated
using (public.can_admin_club(club_id))
with check (public.can_admin_club(club_id));

create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (id = auth.uid() or public.is_superadmin());

create policy "Users can update their own profile"
on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Superadmin can read all profiles"
on public.profiles for select to authenticated
using (public.is_superadmin());

create policy "Superadmin can manage roles"
on public.user_roles for all to authenticated
using (public.is_superadmin())
with check (public.is_superadmin());

create policy "Club admins can read roles in their club"
on public.user_roles for select to authenticated
using (club_id is not null and public.can_admin_club(club_id));

create policy "Users can read their own roles"
on public.user_roles for select to authenticated
using (user_id = auth.uid());

create policy "Public can read active club teams"
on public.teams for select
using (public.club_is_active(club_id));

create policy "Club admins can manage teams"
on public.teams for all to authenticated
using (public.can_admin_club(club_id))
with check (public.can_admin_club(club_id));

create policy "Public can read active club players"
on public.players for select
using (public.club_is_active(club_id));

create policy "Club admins can manage players"
on public.players for all to authenticated
using (public.can_admin_club(club_id))
with check (public.can_admin_club(club_id));

create policy "Public can read active club matches"
on public.matches for select
using (public.club_is_active(club_id));

create policy "Club admins can manage matches"
on public.matches for all to authenticated
using (public.can_admin_club(club_id))
with check (public.can_admin_club(club_id));

create policy "Club admins can manage members"
on public.members for all to authenticated
using (public.can_admin_club(club_id))
with check (public.can_admin_club(club_id));

create policy "Club admins can manage member dues"
on public.member_dues for all to authenticated
using (public.can_admin_club(club_id))
with check (public.can_admin_club(club_id));

create policy "Club admins can manage payments"
on public.payments for all to authenticated
using (public.can_admin_club(club_id))
with check (public.can_admin_club(club_id));

comment on table public.members is
  'Member self-service policies are intentionally pending until members are linked to auth users or profiles.';

comment on table public.member_dues is
  'Members cannot safely read their own dues yet because this schema does not include a member-to-auth-user relationship.';

comment on table public.payments is
  'Payment provider integration is intentionally not implemented yet. raw_payload is reserved for future webhook audit data.';
