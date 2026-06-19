-- Article authoring admin and asset storage.
-- Admin write access is enforced by server-side checks in the Next.js app.

CREATE TABLE IF NOT EXISTS es.admin_users (
  email       text PRIMARY KEY,
  label       text,
  enabled     boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_admin_users_updated_at'
      AND tgrelid = 'es.admin_users'::regclass
  ) THEN
    CREATE TRIGGER set_admin_users_updated_at
      BEFORE UPDATE ON es.admin_users
      FOR EACH ROW
      EXECUTE FUNCTION es.set_updated_at();
  END IF;
END $$;

ALTER TABLE es.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_users: own enabled read" ON es.admin_users;
CREATE POLICY "admin_users: own enabled read"
  ON es.admin_users FOR SELECT
  TO authenticated
  USING (
    enabled IS TRUE
    AND lower(email) = lower((auth.jwt() ->> 'email'))
  );

INSERT INTO es.admin_users (email, label, enabled)
VALUES ('ogaogayu01@gmail.com', 'Site admin', true)
ON CONFLICT (email) DO UPDATE
SET label = EXCLUDED.label,
    enabled = EXCLUDED.enabled;

GRANT SELECT ON es.admin_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON es.admin_users TO service_role;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-assets',
  'article-assets',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "article-assets: public read" ON storage.objects;
CREATE POLICY "article-assets: public read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'article-assets');
