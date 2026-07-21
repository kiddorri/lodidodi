-- WasteFlow database schema
-- Run against a fresh Supabase Postgres project (SQL editor or `psql`).

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  role text check (role in ('operator', 'viewer')),
  created_at timestamptz default now()
);

create table if not exists trucks (
  id uuid primary key default gen_random_uuid(),
  plate_number text not null,
  driver_name text not null,
  created_at timestamptz default now()
);

create table if not exists routes (
  id uuid primary key default gen_random_uuid(),
  truck_id uuid references trucks(id),
  status text check (status in ('in_progress', 'at_sorting', 'recycled')) default 'in_progress',
  origin_point_id uuid references collection_points(id),
  destination_point_id uuid references collection_points(id),
  cargo_type text default 'Смешанные ТБО',
  -- Recycling confirmation: an explicit "proof" step for the recycled status,
  -- not just an enum flip. confirmed_at is the timestamp the operator signed
  -- off; confirmation_note carries the proof detail (accepted weight, scale
  -- ticket number, etc.).
  confirmed_at timestamptz,
  confirmation_note text,
  started_at timestamptz default now(),
  ended_at timestamptz
);

-- Migration for projects created before these columns were added:
-- `create table if not exists` above is a no-op once the table exists, so the
-- new columns have to be added explicitly.
alter table routes add column if not exists origin_point_id uuid references collection_points(id);
alter table routes add column if not exists destination_point_id uuid references collection_points(id);
alter table routes add column if not exists cargo_type text default 'Смешанные ТБО';
alter table routes add column if not exists confirmed_at timestamptz;
alter table routes add column if not exists confirmation_note text;

create table if not exists route_points (
  id uuid primary key default gen_random_uuid(),
  route_id uuid references routes(id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  ts timestamptz default now()
);

create table if not exists collection_points (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  lat double precision not null,
  lng double precision not null,
  type text check (type in ('sorting', 'recycling', 'collection', 'landfill'))
);

-- Migration for projects created before 'landfill' was added: `create table
-- if not exists` above is a no-op once the table already exists, so the
-- check constraint has to be swapped explicitly.
alter table collection_points drop constraint if exists collection_points_type_check;
alter table collection_points add constraint collection_points_type_check
  check (type in ('sorting', 'recycling', 'collection', 'landfill'));

create table if not exists waste_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  image_url text,
  category text,
  material text,
  recyclable boolean,
  confidence numeric,
  disposal_instructions text,
  nearest_point_id uuid references collection_points(id),
  created_at timestamptz default now()
);

create index if not exists route_points_route_id_idx on route_points(route_id);
create index if not exists routes_truck_id_idx on routes(truck_id);

-- Row Level Security
-- TODO(pre-pilot): these policies allow the anon key to read and write every
-- table with no ownership or auth checks. That's fine for a hackathon demo
-- but must be tightened before a real pilot: scope waste_items to the
-- authenticated user, restrict route/route_points writes to operators
-- (via Supabase Auth + the `users.role` column), and drop anon insert on
-- collection_points entirely.

alter table users enable row level security;
alter table trucks enable row level security;
alter table routes enable row level security;
alter table route_points enable row level security;
alter table collection_points enable row level security;
alter table waste_items enable row level security;

create policy "anon select users" on users for select using (true);
create policy "anon insert users" on users for insert with check (true);

create policy "anon select trucks" on trucks for select using (true);
create policy "anon insert trucks" on trucks for insert with check (true);

create policy "anon select routes" on routes for select using (true);
create policy "anon insert routes" on routes for insert with check (true);

create policy "anon select route_points" on route_points for select using (true);
create policy "anon insert route_points" on route_points for insert with check (true);

create policy "anon select collection_points" on collection_points for select using (true);
create policy "anon insert collection_points" on collection_points for insert with check (true);

create policy "anon select waste_items" on waste_items for select using (true);
create policy "anon insert waste_items" on waste_items for insert with check (true);
