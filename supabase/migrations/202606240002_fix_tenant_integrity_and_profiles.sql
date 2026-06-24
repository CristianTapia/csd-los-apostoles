alter table public.members
  add column profile_id uuid references public.profiles(id) on delete set null;

alter table public.payments
  add constraint payments_provider_check
  check (provider in ('manual', 'mercado_pago'));

alter table public.teams
  add constraint teams_id_club_id_key unique (id, club_id);

alter table public.members
  add constraint members_id_club_id_key unique (id, club_id);

alter table public.member_dues
  add constraint member_dues_id_club_id_key unique (id, club_id);

alter table public.players
  add constraint players_team_same_club_fk
  foreign key (team_id, club_id)
  references public.teams(id, club_id);

alter table public.matches
  add constraint matches_team_same_club_fk
  foreign key (team_id, club_id)
  references public.teams(id, club_id);

alter table public.member_dues
  add constraint member_dues_member_same_club_fk
  foreign key (member_id, club_id)
  references public.members(id, club_id);

alter table public.payments
  add constraint payments_member_same_club_fk
  foreign key (member_id, club_id)
  references public.members(id, club_id);

alter table public.payments
  add constraint payments_member_due_same_club_fk
  foreign key (member_due_id, club_id)
  references public.member_dues(id, club_id);

create index if not exists idx_members_profile_id
  on public.members(profile_id);

create index if not exists idx_payments_member_id
  on public.payments(member_id);

create index if not exists idx_payments_member_due_id
  on public.payments(member_due_id);

create index if not exists idx_matches_team_id
  on public.matches(team_id);

create index if not exists idx_member_dues_member_id
  on public.member_dues(member_id);

create or replace function public.has_club_role(target_club_id uuid, allowed_roles text[])
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
      and club_id = target_club_id
      and role = any(allowed_roles)
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    )
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(public.profiles.full_name, excluded.full_name),
        updated_at = now();

  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();
  end if;
end;
$$;

comment on column public.members.profile_id is
  'Nullable link to profiles for future member self-service. A member can exist without login.';

comment on function public.has_club_role(uuid, text[]) is
  'Checks whether auth.uid() has any allowed role for a club. Security definer helper for future RLS policies.';

comment on function public.handle_new_user() is
  'Creates a profile for new auth.users rows without assigning roles, clubs, or elevated permissions.';
