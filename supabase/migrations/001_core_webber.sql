-- Core Webber client portal database
-- Run this migration in Supabase SQL Editor for the Core Webber project.
-- Supabase Auth stores passwords securely; this schema never stores raw passwords.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  role text not null default 'client' check (role in ('client','admin','staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  property_type text not null default 'residential',
  listing_type text not null check (listing_type in ('sale','rent')),
  price numeric(14,2),
  currency text not null default 'ZAR',
  address text,
  suburb text,
  city text,
  bedrooms integer,
  bathrooms numeric(3,1),
  status text not null default 'draft' check (status in ('draft','published','under_offer','rented','sold','archived')),
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  service_type text not null,
  property_location text,
  description text not null,
  status text not null default 'new' check (status in ('new','reviewing','quoted','approved','in_progress','completed','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  enquiry_id uuid references public.enquiries(id) on delete set null,
  reference text unique,
  status text not null default 'draft' check (status in ('draft','sent','accepted','declined','expired')),
  total_amount numeric(14,2),
  currency text not null default 'ZAR',
  valid_until date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  enquiry_id uuid references public.enquiries(id) on delete set null,
  quotation_id uuid references public.quotations(id) on delete set null,
  title text not null,
  description text not null default '',
  status text not null default 'planned' check (status in ('planned','scheduled','in_progress','on_hold','completed','cancelled')),
  start_date date,
  target_end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  quotation_id uuid references public.quotations(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  document_type text not null default 'other',
  created_at timestamptz not null default now()
);

create index if not exists enquiries_client_created_idx on public.enquiries(client_id, created_at desc);
create index if not exists quotations_client_created_idx on public.quotations(client_id, created_at desc);
create index if not exists projects_client_created_idx on public.projects(client_id, created_at desc);
create index if not exists properties_status_listing_idx on public.properties(status, listing_type);

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.enquiries enable row level security;
alter table public.quotations enable row level security;
alter table public.projects enable row level security;
alter table public.documents enable row level security;

-- Profiles: clients can see and edit their own contact profile, never their role.
drop policy if exists "Clients read own profile" on public.profiles;
create policy "Clients read own profile" on public.profiles for select to authenticated using (id = (select auth.uid()));
drop policy if exists "Clients update own profile" on public.profiles;
create policy "Clients update own profile" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
revoke update on public.profiles from authenticated;
grant update (full_name, phone) on public.profiles to authenticated;

-- Published listings are public; unpublished records are not exposed to visitors.
drop policy if exists "Public read published properties" on public.properties;
create policy "Public read published properties" on public.properties for select to anon, authenticated using (status = 'published');

-- Clients may create and read only their own enquiries.
drop policy if exists "Clients read own enquiries" on public.enquiries;
create policy "Clients read own enquiries" on public.enquiries for select to authenticated using (client_id = (select auth.uid()));
drop policy if exists "Clients create own enquiries" on public.enquiries;
create policy "Clients create own enquiries" on public.enquiries for insert to authenticated with check (client_id = (select auth.uid()));

-- Clients can read their own quotations, projects and document metadata.
drop policy if exists "Clients read own quotations" on public.quotations;
create policy "Clients read own quotations" on public.quotations for select to authenticated using (client_id = (select auth.uid()));
drop policy if exists "Clients read own projects" on public.projects;
create policy "Clients read own projects" on public.projects for select to authenticated using (client_id = (select auth.uid()));
drop policy if exists "Clients read own document metadata" on public.documents;
create policy "Clients read own document metadata" on public.documents for select to authenticated using (client_id = (select auth.uid()));

-- No client-facing insert/update/delete policies for staff-managed records.
-- Assign admin/staff roles only through the trusted Supabase SQL editor or a protected server process.
-- Do not expose the service_role key in browser code.

grant select on public.profiles, public.properties, public.enquiries, public.quotations, public.projects, public.documents to authenticated;
grant select on public.properties to anon;
grant insert on public.enquiries to authenticated;
