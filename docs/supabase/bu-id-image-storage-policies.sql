-- Run this in the Supabase SQL editor after creating the "BU ID Image" bucket.
-- Users upload to a folder named after their Supabase auth user id.
-- If the bucket stays public, anyone with an uploaded file URL can view that file.

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
