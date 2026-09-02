-- Schéma CV Studio — à exécuter dans l'éditeur SQL du projet Supabase.

create extension if not exists pgcrypto;

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'Mon CV',
  data jsonb not null,
  -- Droit de téléchargement. Jamais écrit par le client : seul le webhook
  -- Stripe, qui utilise la clé de service, peut le passer à true.
  paid boolean not null default false,
  paid_at timestamptz,
  stripe_session_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resumes_user_id_idx on public.resumes (user_id);

alter table public.resumes enable row level security;

-- Un utilisateur ne voit et ne touche que ses propres CV.
drop policy if exists "lecture proprietaire" on public.resumes;
create policy "lecture proprietaire" on public.resumes
  for select using (auth.uid() = user_id);

-- Un CV ne peut pas naître déjà payé.
drop policy if exists "creation proprietaire" on public.resumes;
create policy "creation proprietaire" on public.resumes
  for insert with check (auth.uid() = user_id and paid = false);

drop policy if exists "modification proprietaire" on public.resumes;
create policy "modification proprietaire" on public.resumes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "suppression proprietaire" on public.resumes;
create policy "suppression proprietaire" on public.resumes
  for delete using (auth.uid() = user_id);

-- Deuxième verrou, au niveau des colonnes : même en forgeant une requête, un
-- client authentifié ne peut pas s'accorder le droit de télécharger. Les
-- politiques RLS ci-dessus ne savent pas restreindre colonne par colonne.
revoke update on public.resumes from authenticated;
grant update (title, data) on public.resumes to authenticated;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists resumes_touch on public.resumes;
create trigger resumes_touch before update on public.resumes
  for each row execute function public.touch_updated_at();
