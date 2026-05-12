# Client Portfolio Media Storage Setup

Use this setup for the client portfolio post uploader in `app/dashboard/client/profile`.

## Bucket

- Bucket name: `client-portfolio-media`
- Default env fallback: `lib/supabase/storage.ts`

## Steps

1. Open the Supabase SQL editor.
2. Run `docs/supabase/client-portfolio-media-storage-policies.sql`.
3. Make sure the bucket is public so `getPublicUrl()` returns a usable image URL.
4. If you want a custom bucket name, set `NEXT_PUBLIC_SUPABASE_CLIENT_PORTFOLIO_BUCKET` in `.env` to match the bucket id exactly.
5. Retry the create-post flow.

## Notes

- The uploader currently stores media under `client-portfolio/<user-id>/...`.
- The server action uploads with the service role, so bucket creation is the missing prerequisite when the post save fails immediately during upload.
