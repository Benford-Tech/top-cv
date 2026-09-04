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

-- ---------------------------------------------------------------------------
-- Quota de l'aide à la rédaction
-- ---------------------------------------------------------------------------
-- Un point d'entrée vers un modèle facturé au jeton doit être compté. Le
-- compteur suit la règle déjà appliquée à `paid` : le client peut le lire,
-- jamais l'écrire. Seule la fonction serveur, qui utilise la clé de service,
-- l'incrémente — sinon il suffirait de forger une requête pour se réoffrir
-- des crédits.

create table if not exists public.ai_usage (
  user_id uuid primary key references auth.users (id) on delete cascade,
  day date not null default current_date,
  count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.ai_usage enable row level security;

-- Lecture de son propre compteur, pour afficher ce qu'il reste.
drop policy if exists "lecture proprietaire" on public.ai_usage;
create policy "lecture proprietaire" on public.ai_usage
  for select using (auth.uid() = user_id);

-- Aucune écriture depuis le client, quelle qu'elle soit.
revoke insert, update, delete on public.ai_usage from authenticated;

drop trigger if exists ai_usage_touch on public.ai_usage;
create trigger ai_usage_touch before update on public.ai_usage
  for each row execute function public.touch_updated_at();

-- Consomme une unité et rend le total du jour, ou NULL si le quota est atteint.
--
-- Le décompte se fait en une seule instruction, et non en lisant puis écrivant
-- depuis la fonction serveur : deux demandes simultanées liraient la même
-- valeur et écriraient le même incrément, ce qui laisse passer un appel de
-- trop à chaque fois. La condition posée sur le UPDATE du ON CONFLICT rend
-- l'opération atomique — au-delà de la limite, aucune ligne n'est touchée et
-- RETURNING ne rend rien.
create or replace function public.consume_ai_quota(p_user uuid, p_limit integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if p_limit <= 0 then
    return null;
  end if;

  insert into public.ai_usage as u (user_id, day, count)
    values (p_user, current_date, 1)
  on conflict (user_id) do update
    set day = current_date,
        count = case when u.day = current_date then u.count + 1 else 1 end
    where case when u.day = current_date then u.count else 0 end < p_limit
  returning u.count into v_count;

  return v_count;
end $$;

-- Seule la clé de service appelle cette fonction : `security definer` lui fait
-- traverser RLS, il faut donc que personne d'autre ne puisse la déclencher.
revoke execute on function public.consume_ai_quota(uuid, integer) from public;
revoke execute on function public.consume_ai_quota(uuid, integer) from anon, authenticated;
