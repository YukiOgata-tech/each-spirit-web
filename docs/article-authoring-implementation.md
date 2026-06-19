# Article Authoring Implementation Plan

## Goal

Add a site-side article authoring UI for the admin account `ogaogayu01@gmail.com`.

The editor should support:

- Article metadata: category, region, slug, title, description, tags, SEO fields, publish status.
- Markdown body editing with toolbar support for headings, underline/strong, lists, quotes, links, tables, notes, official image blocks, and related link cards.
- Desktop preview using the same `MarkdownRenderer` as public pages.
- Image handling:
  - Upload local images through a server route to Supabase Storage.
  - Resize/compress images in the browser before upload when possible.
  - Insert uploaded images as `:::official-image` blocks with a Supabase public URL.
  - Support external image URLs with `sourceUrl` displayed under the image.
- Publish flow that writes to `es.articles` and triggers ISR `revalidatePath`.

## Access Model

- `es.admin_users` stores admin users by email.
- The seeded admin is `ogaogayu01@gmail.com`.
- The dashboard shows an authoring link only when the logged-in user's email matches an enabled admin row.
- All write/upload routes verify the Supabase session and admin row server-side.
- Service-role access is only used in server code.

## DB / Storage

- New table: `es.admin_users`.
- New public Storage bucket: `article-assets`.
- Public read policy for bucket objects under `article-assets`.
- Upload write is not exposed to client RLS; the app route uploads with service-role after admin verification.

## Routes

- `/account/articles/new`: admin-only article creation page.
- `/api/admin/article-assets`: admin-only image upload route.

## Revalidation

On publish, revalidate:

- The article path.
- `/sitemap.xml`.
- Category/region listing pages where applicable.

## Resume Points

1. Apply migration and verify `es.admin_users` and `article-assets`. Done via Supabase Management API on 2026-06-19.
2. Implement admin helper. Done in `lib/admin.ts`.
3. Implement upload route. Done in `/api/admin/article-assets`.
4. Implement editor UI and server action. Done in `/account/articles/new`.
5. Add dashboard link. Done in `/account` for enabled admins only.
6. Run lint, typecheck, build. Done.

## Verification

- `es.admin_users` contains enabled `ogaogayu01@gmail.com`.
- Storage bucket `article-assets` exists, is public, and limits images to 5 MB.
- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm run build` passed after adding the new dynamic authoring route.
