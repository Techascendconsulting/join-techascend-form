/*
  Reliable application submit: SECURITY DEFINER upsert bypasses RLS quirks on
  INSERT ... ON CONFLICT DO UPDATE from PostgREST.

  After this migration:
  - Clients should call supabase.rpc('upsert_application', { ... }) (see App.jsx).
  - Anon no longer has direct INSERT/UPDATE/SELECT on public.applications.

  Safe to run once; re-running CREATE OR REPLACE FUNCTION is idempotent.
*/

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

grant execute on function public.upsert_application(
  text, text, text, text, boolean, text, boolean, text, text, text
) to anon, authenticated;

revoke select, insert, update, delete on table public.applications from anon, authenticated;
