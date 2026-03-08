create table if not exists profiles (
  id bigint generated always as identity primary key,
  input_url text not null,
  steamid text not null unique,
  profile_url text not null,
  persona_name text,
  avatar_url text,
  community_banned boolean not null default false,
  vac_banned boolean not null default false,
  number_of_vac_bans integer not null default 0,
  days_since_last_ban integer not null default 0,
  game_ban_count integer not null default 0,
  monitored_since timestamptz not null default now(),
  first_seen_vac_banned_at timestamptz,
  last_checked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

DROP TRIGGER IF EXISTS profiles_set_updated_at ON profiles;
create trigger profiles_set_updated_at
before update on profiles
for each row execute function set_updated_at();
