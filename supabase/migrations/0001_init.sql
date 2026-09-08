-- ============ PROFILES (contas do palestrante) ============
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  email text,
  criado_em timestamptz not null default now()
);
alter table public.profiles enable row level security;

create policy "profiles_self_select" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "profiles_self_insert" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "profiles_self_update" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============ EVENTS ============
create table public.events (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  titulo text not null,
  igreja text,
  cidade text,
  data_evento date,
  versao_default int not null default 60 check (versao_default in (60,100,200)),
  aberto boolean not null default true,
  criado_em timestamptz not null default now()
);
alter table public.events enable row level security;

create policy "events_read" on public.events
  for select to anon, authenticated
  using (aberto = true or owner = auth.uid());
create policy "events_owner_insert" on public.events
  for insert to authenticated with check (owner = auth.uid());
create policy "events_owner_update" on public.events
  for update to authenticated using (owner = auth.uid()) with check (owner = auth.uid());
create policy "events_owner_delete" on public.events
  for delete to authenticated using (owner = auth.uid());

create index events_owner_idx on public.events(owner);

-- ============ RESPONSES ============
create table public.responses (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  nome text,
  ministerio text,
  versao int not null check (versao in (60,100,200)),
  h numeric(4,2) not null,
  e numeric(4,2) not null,
  x numeric(4,2) not null,
  a numeric(4,2) not null,
  c numeric(4,2) not null,
  o numeric(4,2) not null,
  altruismo numeric(4,2),
  itens jsonb,
  criado_em timestamptz not null default now()
);
alter table public.responses enable row level security;

create function public.can_respond(p_event uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce((select aberto from public.events where id = p_event), false);
$$;

create policy "responses_insert_when_open" on public.responses
  for insert to anon, authenticated
  with check (public.can_respond(event_id));
create policy "responses_owner_read" on public.responses
  for select to authenticated
  using (exists (select 1 from public.events e where e.id = event_id and e.owner = auth.uid()));
create policy "responses_owner_delete" on public.responses
  for delete to authenticated
  using (exists (select 1 from public.events e where e.id = event_id and e.owner = auth.uid()));

create index responses_event_idx on public.responses(event_id);

grant select on public.events to anon, authenticated;
grant insert, update, delete on public.events to authenticated;
grant insert on public.responses to anon, authenticated;
grant select, delete on public.responses to authenticated;
grant select, insert, update on public.profiles to authenticated;
