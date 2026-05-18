-- Run this in the Supabase SQL editor before using admin talent verification
-- if you are not applying the Prisma schema through a migration.

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'talent_verification_status'
  ) then
    create type talent_verification_status as enum (
      'PENDING',
      'APPROVED',
      'REJECTED'
    );
  end if;
end $$;

create table if not exists talent_verification_requests (
  request_id text primary key default gen_random_uuid()::text,
  user_id text not null references "User"(user_id) on delete cascade,
  bu_email text not null,
  bu_id_image_bucket text not null,
  bu_id_image_path text not null,
  status talent_verification_status not null default 'PENDING',
  rejection_reason text,
  reviewed_by_email text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists talent_verification_requests_status_created_at_idx
on talent_verification_requests (status, created_at);

create index if not exists talent_verification_requests_user_id_status_idx
on talent_verification_requests (user_id, status);
