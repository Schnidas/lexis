-- LEXIS: server-side state sync.
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- One row per user holding the whole state blob.

create table if not exists public.user_state (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Without RLS the table is readable by anyone holding the public anon key.
alter table public.user_state enable row level security;

create policy "select own state" on public.user_state
  for select using (auth.uid() = user_id);

create policy "insert own state" on public.user_state
  for insert with check (auth.uid() = user_id);

create policy "update own state" on public.user_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Explicit PostgREST grants. Supabase projects created after 2026-05-30 no
-- longer grant these automatically; without them the REST API reports that
-- the relation does not exist.
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.user_state to authenticated;

-- Lets the unauthenticated keep-alive ping query the table. RLS still
-- returns zero rows to anon, so nothing is exposed.
grant select on public.user_state to anon;
