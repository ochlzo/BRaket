-- Run this in the Supabase SQL editor before wiring the user profile image uploader.
-- Bucket purpose:
-- - store user-uploaded avatar images for User.avatar_url
-- - store user-uploaded background images for User.backgroundimg_img_url
--
-- Suggested object paths:
-- - avatars/<auth.uid()>/<filename>
-- - backgrounds/<auth.uid()>/<filename>
--
-- The bucket is public so image URLs can be rendered directly in the app.

insert into storage.buckets (id, name, public)
values ('user-profile-images', 'user-profile-images', true)
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
      and policyname = 'Authenticated users can upload user profile images'
  ) then
    create policy "Authenticated users can upload user profile images"
    on storage.objects
    for insert
    to authenticated
    with check (
      bucket_id = 'user-profile-images'
      and (storage.foldername(name))[1] in ('avatars', 'backgrounds')
      and (storage.foldername(name))[2] = auth.uid()::text
    );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can read their own profile images'
  ) then
    create policy "Authenticated users can read their own profile images"
    on storage.objects
    for select
    to authenticated
    using (
      bucket_id = 'user-profile-images'
      and (storage.foldername(name))[1] in ('avatars', 'backgrounds')
      and (storage.foldername(name))[2] = auth.uid()::text
    );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can update their own profile images'
  ) then
    create policy "Authenticated users can update their own profile images"
    on storage.objects
    for update
    to authenticated
    using (
      bucket_id = 'user-profile-images'
      and (storage.foldername(name))[1] in ('avatars', 'backgrounds')
      and (storage.foldername(name))[2] = auth.uid()::text
    )
    with check (
      bucket_id = 'user-profile-images'
      and (storage.foldername(name))[1] in ('avatars', 'backgrounds')
      and (storage.foldername(name))[2] = auth.uid()::text
    );
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Authenticated users can delete their own profile images'
  ) then
    create policy "Authenticated users can delete their own profile images"
    on storage.objects
    for delete
    to authenticated
    using (
      bucket_id = 'user-profile-images'
      and (storage.foldername(name))[1] in ('avatars', 'backgrounds')
      and (storage.foldername(name))[2] = auth.uid()::text
    );
  end if;
end $$;
