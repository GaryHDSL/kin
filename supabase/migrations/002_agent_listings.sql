-- Agent applications and moderated property submissions for Core Webber.
-- Run after 001_core_webber.sql in Supabase SQL Editor.

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('client','agent','admin','staff'));

alter table public.properties add column if not exists agent_id uuid references public.profiles(id) on delete set null;
alter table public.properties drop constraint if exists properties_status_check;
alter table public.properties add constraint properties_status_check check (status in ('draft','pending_review','published','under_offer','rented','sold','archived'));
create index if not exists properties_agent_created_idx on public.properties(agent_id, created_at desc);

create table if not exists public.agent_applications (
 id uuid primary key references auth.users(id) on delete cascade,
 agency_name text not null default '',
 full_name text not null default '',
 phone text not null default '',
 status text not null default 'pending' check (status in ('pending','approved','rejected')),
 created_at timestamptz not null default now()
);
alter table public.agent_applications enable row level security;
drop policy if exists "Applicants can read own application" on public.agent_applications;
create policy "Applicants can read own application" on public.agent_applications for select to authenticated using (id = (select auth.uid()));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.profiles (id, full_name, phone)
 values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), coalesce(new.raw_user_meta_data ->> 'phone', ''))
 on conflict (id) do nothing;
 if new.raw_user_meta_data ->> 'user_type' = 'agent' then
  insert into public.agent_applications (id, agency_name, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'agency_name',''), coalesce(new.raw_user_meta_data ->> 'full_name',''), coalesce(new.raw_user_meta_data ->> 'phone',''))
  on conflict (id) do nothing;
 end if;
 return new;
end;
$$;

drop policy if exists "Public read published properties" on public.properties;
create policy "Public read published properties" on public.properties for select to anon, authenticated using (status = 'published');
drop policy if exists "Agents read own properties" on public.properties;
create policy "Agents read own properties" on public.properties for select to authenticated using (agent_id = (select auth.uid()));
drop policy if exists "Agents submit own properties for review" on public.properties;
create policy "Agents submit own properties for review" on public.properties for insert to authenticated
with check (agent_id = (select auth.uid()) and status = 'pending_review' and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'agent'));
drop policy if exists "Agents update own unapproved properties" on public.properties;
create policy "Agents update own unapproved properties" on public.properties for update to authenticated
using (agent_id = (select auth.uid()) and status in ('draft','pending_review') and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'agent'))
with check (agent_id = (select auth.uid()) and status in ('draft','pending_review') and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'agent'));

grant select, insert, update on public.properties to authenticated;
grant select on public.agent_applications to authenticated;

-- Agent approval is manual: verify identity and agency, then run these commands
-- in the trusted Supabase SQL Editor using the applicant's Auth user UUID:
-- update public.profiles set role = 'agent' where id = 'AUTH-USER-UUID';
-- update public.agent_applications set status = 'approved' where id = 'AUTH-USER-UUID';
-- Publish a verified listing only after moderation:
-- update public.properties set status = 'published' where id = 'PROPERTY-UUID';
