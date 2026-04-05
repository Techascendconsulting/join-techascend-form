/*
  SETUP (run once per Supabase project)
  -------------------------------------
  1. Open https://supabase.com/dashboard → your project
  2. SQL Editor → New query
  3. Paste this entire file → Run (or Cmd/Ctrl + Enter)

  After success, the 404 on POST /rest/v1/applications should stop.
  Replace the WhatsApp placeholder URL below with your real group invite link.

  UPSERT: applications are deduplicated by email. The script below removes
  duplicate emails (keeping the latest created_at) before adding the unique
  constraint — safe on empty tables and idempotent for the constraint.
*/

-- Extensions (usually already on in Supabase)
create extension if not exists "pgcrypto";

create table if not exists public.settings (
  key text primary key,
  value text not null
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  current_job text not null,
  has_trained_before boolean not null,
  struggles text,
  is_uk boolean not null,
  referral_code text,
  instagram_following text not null
    check (instagram_following in ('yes', 'no')),
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Idempotent migrations for existing databases
alter table public.applications add column if not exists updated_at timestamptz not null default now();

-- Dedupe by email (keep latest created_at, then id), then UNIQUE(email) for upsert onConflict: 'email'
-- See supabase/migrations/20260405120000_dedupe_applications_email_unique.sql (same logic).
DELETE FROM public.applications
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (
             PARTITION BY email
             ORDER BY created_at DESC NULLS LAST, id DESC
           ) AS rn
    FROM public.applications
  ) AS ranked
  WHERE rn > 1
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.applications'::regclass
      AND conname = 'applications_email_unique'
  ) THEN
    DROP INDEX IF EXISTS public.applications_email_unique;

    ALTER TABLE public.applications
      ADD CONSTRAINT applications_email_unique UNIQUE (email);
  END IF;
END $$;

-- Preserve original submission time on update; bump updated_at on every change
create or replace function public.applications_before_update()
returns trigger
language plpgsql
as $$
begin
  new.created_at := old.created_at;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists applications_before_update on public.applications;
create trigger applications_before_update
  before update on public.applications
  for each row
  execute function public.applications_before_update();

-- Submissions use SECURITY DEFINER RPC (bypasses RLS); anon has no direct table access.
create or replace function public.upsert_application(
  p_name text,
  p_email text,
  p_phone text,
  p_current_job text,
  p_has_trained_before boolean,
  p_struggles text,
  p_is_uk boolean,
  p_referral_code text,
  p_instagram_following text,
  p_status text default 'pending'
)
returns void
language plpgsql
security definer
set search_path = public
set row_security = off
as $$
begin
  insert into public.applications (
    name,
    email,
    phone,
    current_job,
    has_trained_before,
    struggles,
    is_uk,
    referral_code,
    instagram_following,
    status
  )
  values (
    p_name,
    lower(trim(p_email)),
    p_phone,
    p_current_job,
    p_has_trained_before,
    p_struggles,
    p_is_uk,
    p_referral_code,
    p_instagram_following,
    coalesce(nullif(trim(p_status), ''), 'pending')
  )
  on conflict (email) do update set
    name = excluded.name,
    phone = excluded.phone,
    current_job = excluded.current_job,
    has_trained_before = excluded.has_trained_before,
    struggles = excluded.struggles,
    is_uk = excluded.is_uk,
    referral_code = excluded.referral_code,
    instagram_following = excluded.instagram_following,
    status = excluded.status;
end;
$$;

grant usage on schema public to anon, authenticated;
grant select on table public.settings to anon, authenticated;
grant execute on function public.upsert_application(
  text, text, text, text, boolean, text, boolean, text, text, text
) to anon, authenticated;

revoke select, insert, update, delete on table public.applications from anon, authenticated;

alter table public.applications enable row level security;
alter table public.settings enable row level security;

-- RLS stays on; writes go through upsert_application() only (anon has no table grants).
drop policy if exists "Allow anonymous insert applications" on public.applications;
drop policy if exists "Allow anonymous update applications" on public.applications;
drop policy if exists "Allow anonymous select applications" on public.applications;

drop policy if exists "Allow read whatsapp_group_link" on public.settings;
create policy "Allow read whatsapp_group_link"
  on public.settings
  for select
  to anon, authenticated
  using (key = 'whatsapp_group_link');

-- WhatsApp invite URL (required for email + success screen)
insert into public.settings (key, value)
values ('whatsapp_group_link', 'https://chat.whatsapp.com/REPLACE_WITH_YOUR_LINK')
on conflict (key) do update set value = excluded.value;
