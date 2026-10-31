-- À exécuter une seule fois dans Supabase : SQL Editor > New query > Run.

create table public.notes (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id bigint not null,
  text text not null,
  date date,
  category text not null default 'fast' check (category in ('fast', 'long')),
  completed boolean not null default false,
  primary key (user_id, id)
);

-- RLS : chaque utilisateur connecté n'accède qu'à ses propres tâches.
alter table public.notes enable row level security;

create policy "Chacun gère ses propres tâches"
  on public.notes
  for all
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

revoke all on public.notes from anon;
grant select, insert, update, delete on public.notes to authenticated;

-- Active la synchro en direct entre les appareils.
alter publication supabase_realtime add table public.notes;
