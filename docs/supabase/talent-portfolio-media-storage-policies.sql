-- Run this in the Supabase SQL editor before using the talent portfolio uploader.
-- The app expects a public bucket named "talent-portfolio-media" by default.
-- If you want a different bucket name, set NEXT_PUBLIC_SUPABASE_TALENT_PORTFOLIO_BUCKET
-- to that exact value in .env.

insert into storage.buckets (id, name, public)
values ('talent-portfolio-media', 'talent-portfolio-media', true)
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
      and policyname = 'Authenticated users can upload talent portfolio media'
  ) then
    create policy "Authenticated users can upload talent portfolio media"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'talent-portfolio-media'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can read talent portfolio media'
  ) then
    create policy "Authenticated users can read talent portfolio media"
    on storage.objects
    for select
    to authenticated
    using (
      bucket_id = 'talent-portfolio-media'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
  end if;
end $$;
