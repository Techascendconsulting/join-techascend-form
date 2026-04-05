/*
  Fix: "new row violates row-level security policy" on upsert.

  PostgreSQL RLS: UPDATE (including the UPDATE branch of INSERT ... ON CONFLICT)
  requires the row to be visible under SELECT policies. Without a SELECT policy,
  no rows are visible and upsert fails.

  Run once in Supabase SQL Editor (safe to re-run: idempotent policies/grants).
*/

grant select on table public.applications to anon, authenticated;

drop policy if exists "Allow anonymous select applications" on public.applications;
create policy "Allow anonymous select applications"
  on public.applications
  for select
  to anon, authenticated
  using (true);
