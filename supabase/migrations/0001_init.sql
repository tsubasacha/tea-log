-- Tea Log MVP schema
-- Tables: tea_leaves, brews
-- Auth: uses Supabase Auth (auth.users). Every row is scoped to auth.uid() via RLS.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- tea_leaves
-- ---------------------------------------------------------------------------
create table if not exists public.tea_leaves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  tea_type text not null check (
    tea_type in (
      'sencha',        -- 煎茶
      'fukamushi',      -- 深蒸し煎茶
      'gyokuro',        -- 玉露
      'kabusecha',      -- かぶせ茶
      'bancha',         -- 番茶
      'hojicha',        -- ほうじ茶
      'genmaicha',      -- 玄米茶
      'wakoucha',       -- 和紅茶
      'other'           -- その他
    )
  ),
  producer text,
  origin text,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tea_leaves_user_id_idx on public.tea_leaves (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- brews
-- ---------------------------------------------------------------------------
create table if not exists public.brews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tea_leaf_id uuid not null references public.tea_leaves (id) on delete cascade,
  brewed_at date not null default current_date,
  tea_amount numeric(5, 1) not null check (tea_amount > 0),
  water_amount numeric(6, 1) not null check (water_amount > 0),
  water_temperature numeric(4, 1) not null check (
    water_temperature > 0
    and water_temperature <= 100
  ),
  steeping_time integer not null check (steeping_time > 0),
  infusion_number text not null default '1' check (
    infusion_number in ('1', '2', '3', 'other')
  ),
  aroma smallint not null check (aroma between 1 and 5),
  sweetness smallint not null check (sweetness between 1 and 5),
  umami smallint not null check (umami between 1 and 5),
  astringency smallint not null check (astringency between 1 and 5),
  bitterness smallint not null check (bitterness between 1 and 5),
  memo text,
  is_best boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists brews_user_id_idx on public.brews (user_id, brewed_at desc);
create index if not exists brews_tea_leaf_id_idx on public.brews (tea_leaf_id, brewed_at desc);

-- Only one MY BEST brew per tea leaf.
create unique index if not exists brews_one_best_per_tea_leaf
  on public.brews (tea_leaf_id)
  where is_best;

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.tea_leaves;
create trigger set_updated_at
  before update on public.tea_leaves
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.brews;
create trigger set_updated_at
  before update on public.brews
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RPC: atomically set a brew as MY BEST, unsetting any previous best
-- for the same tea leaf. Runs with invoker's privileges so RLS still
-- restricts it to rows the caller owns.
-- ---------------------------------------------------------------------------
create or replace function public.set_best_brew(brew_id uuid)
returns void
language plpgsql
security invoker
as $$
declare
  target_tea_leaf_id uuid;
begin
  select tea_leaf_id into target_tea_leaf_id
  from public.brews
  where id = brew_id and user_id = auth.uid();

  if target_tea_leaf_id is null then
    raise exception 'brew not found';
  end if;

  update public.brews
  set is_best = false
  where tea_leaf_id = target_tea_leaf_id
    and user_id = auth.uid()
    and is_best = true
    and id <> brew_id;

  update public.brews
  set is_best = true
  where id = brew_id
    and user_id = auth.uid();
end;
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.tea_leaves enable row level security;
alter table public.brews enable row level security;

create policy "tea_leaves are viewable by owner"
  on public.tea_leaves for select
  using (auth.uid() = user_id);

create policy "tea_leaves are insertable by owner"
  on public.tea_leaves for insert
  with check (auth.uid() = user_id);

create policy "tea_leaves are updatable by owner"
  on public.tea_leaves for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "tea_leaves are deletable by owner"
  on public.tea_leaves for delete
  using (auth.uid() = user_id);

create policy "brews are viewable by owner"
  on public.brews for select
  using (auth.uid() = user_id);

create policy "brews are insertable by owner"
  on public.brews for insert
  with check (auth.uid() = user_id);

create policy "brews are updatable by owner"
  on public.brews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "brews are deletable by owner"
  on public.brews for delete
  using (auth.uid() = user_id);
