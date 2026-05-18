-- Run this in the Supabase SQL editor before using talent verification.
-- The app expects a private bucket named "BU ID Image" by default.
-- If you want a different bucket name, set NEXT_PUBLIC_SUPABASE_BU_ID_BUCKET
-- to that exact value in .env.

insert into storage.buckets (id, name, public)
values ('BU ID Image', 'BU ID Image', false)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can upload their BU ID images'
  ) then
    create policy "Authenticated users can upload their BU ID images"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'BU ID Image'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can read their own BU ID images'
  ) then
    create policy "Authenticated users can read their own BU ID images"
    on storage.objects
    for select
    to authenticated
    using (
      bucket_id = 'BU ID Image'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;
end $$;
