-- Run this in the Supabase SQL editor before using the service media uploader.
-- The app expects a public bucket named "service-media" by default.
-- If you want a different bucket name, set NEXT_PUBLIC_SUPABASE_SERVICE_MEDIA_BUCKET
-- to that exact value in .env.

insert into storage.buckets (id, name, public)
values ('service-media', 'service-media', true)
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
      and policyname = 'Authenticated users can upload service media'
  ) then
    create policy "Authenticated users can upload service media"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'service-media'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can read service media'
  ) then
    create policy "Authenticated users can read service media"
    on storage.objects
    for select
    to authenticated
    using (
      bucket_id = 'service-media'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;
end $$;
