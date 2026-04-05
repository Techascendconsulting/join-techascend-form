/*
  Dedupe applications by email, then enforce UNIQUE (email) for upsert onConflict.

  Safe to run more than once: duplicate removal is idempotent; the constraint is
  only added when missing.

  Run in Supabase SQL Editor if schema.sql was applied before this migration existed.
*/

-- Keep one row per email: latest created_at, then greatest id (UUID tie-break).
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

-- Add applications_email_unique only if absent; replace legacy unique index if needed.
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
