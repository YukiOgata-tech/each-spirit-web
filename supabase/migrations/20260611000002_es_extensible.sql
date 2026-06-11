-- ==========================================================
-- each-spirit: es スキーマ 拡張マイグレーション
-- 作成: 2026-06-11
-- 対象 Supabase プロジェクト: drink-management (ctwpnaizwsrffrkkbuig)
--
-- 【重要】public.* の既存テーブルは一切変更しません。
--
-- 変更内容:
--   1. content_likes / content_like_counts に like_type カラム追加 (PK 再構築)
--   2. es.reviews          汎用レビュー
--   3. es.review_votes     レビュー有用投票
--   4. es.notifications    通知
--   5. es.business_accounts 事業者アカウント
--   6. es.user_points      ユーザーポイント残高
--   7. es.point_ledger     ポイント履歴台帳
--   8. es.user_follows     フォロー関係
--   9. es.content_reports  通報
--  10. metadata jsonb を articles / user_prefs に追加
-- ==========================================================

-- ----------------------------------------------------------
-- 1. content_likes に like_type を追加し PK を再構築
--    like_type: 'like' | 'bookmark' | 'want_to_visit'
--    既存行はすべて 'like' として扱う
-- ----------------------------------------------------------

-- 既存トリガーを先に DROP（カラム追加後に再作成）
DROP TRIGGER IF EXISTS on_content_like_insert ON es.content_likes;
DROP TRIGGER IF EXISTS on_content_like_delete  ON es.content_likes;
DROP TRIGGER IF EXISTS on_article_like_change  ON es.content_likes;

-- 旧 PK を削除してカラム追加 → 新 PK を設定
ALTER TABLE es.content_likes DROP CONSTRAINT content_likes_pkey;

ALTER TABLE es.content_likes
  ADD COLUMN like_type text NOT NULL DEFAULT 'like'
  CONSTRAINT like_type_valid CHECK (like_type IN ('like', 'bookmark', 'want_to_visit'));

ALTER TABLE es.content_likes
  ADD PRIMARY KEY (user_id, content_type, content_id, like_type);

-- ----------------------------------------------------------
-- 1b. content_like_counts に like_type を追加し PK を再構築
-- ----------------------------------------------------------
ALTER TABLE es.content_like_counts DROP CONSTRAINT content_like_counts_pkey;

ALTER TABLE es.content_like_counts
  ADD COLUMN like_type text NOT NULL DEFAULT 'like';

ALTER TABLE es.content_like_counts
  ADD PRIMARY KEY (content_type, content_id, like_type);

-- 既存カウントキャッシュ行に like_type = 'like' を設定済み（DEFAULT で自動補完）

-- ----------------------------------------------------------
-- 1c. トリガー関数を like_type 対応に差し替え
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION es.handle_like_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = es, public
AS $$
BEGIN
  INSERT INTO es.content_like_counts (content_type, content_id, region_slug, like_type, count)
  VALUES (NEW.content_type, NEW.content_id, NEW.region_slug, NEW.like_type, 1)
  ON CONFLICT (content_type, content_id, like_type)
  DO UPDATE SET count = es.content_like_counts.count + 1;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION es.handle_like_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = es, public
AS $$
BEGIN
  UPDATE es.content_like_counts
  SET count = GREATEST(count - 1, 0)
  WHERE content_type = OLD.content_type
    AND content_id   = OLD.content_id
    AND like_type    = OLD.like_type;
  RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION es.sync_article_like_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = es, public
AS $$
BEGIN
  IF NEW.like_type <> 'like' AND TG_OP = 'INSERT' THEN
    RETURN NEW;
  END IF;
  IF OLD.like_type <> 'like' AND TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  IF TG_OP = 'INSERT' THEN
    UPDATE es.articles SET like_count = like_count + 1 WHERE slug = NEW.content_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE es.articles SET like_count = GREATEST(like_count - 1, 0) WHERE slug = OLD.content_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- トリガーを再作成
CREATE TRIGGER on_content_like_insert
  AFTER INSERT ON es.content_likes
  FOR EACH ROW EXECUTE FUNCTION es.handle_like_insert();

CREATE TRIGGER on_content_like_delete
  AFTER DELETE ON es.content_likes
  FOR EACH ROW EXECUTE FUNCTION es.handle_like_delete();

CREATE TRIGGER on_article_like_change
  AFTER INSERT OR DELETE ON es.content_likes
  FOR EACH ROW EXECUTE FUNCTION es.sync_article_like_count();

-- ----------------------------------------------------------
-- 1d. like_type ごとの RLS ポリシー更新
--    'like' のカウントは公開。'bookmark'/'want_to_visit' は自分のみ閲覧
-- ----------------------------------------------------------

-- 既存ポリシーを置き換え
DROP POLICY IF EXISTS "content_likes: public read" ON es.content_likes;

CREATE POLICY "content_likes: public read likes"
  ON es.content_likes FOR SELECT
  TO anon, authenticated
  USING (like_type = 'like');

CREATE POLICY "content_likes: own read private"
  ON es.content_likes FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id AND like_type IN ('bookmark', 'want_to_visit'));

-- ----------------------------------------------------------
-- 2. metadata jsonb カラムを既存テーブルに追加
-- ----------------------------------------------------------
ALTER TABLE es.articles    ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}';
ALTER TABLE es.user_prefs  ADD COLUMN IF NOT EXISTS metadata jsonb NOT NULL DEFAULT '{}';

-- ----------------------------------------------------------
-- 3. レビューテーブル
--    全コンテンツ共通レビュー（カフェ・ラーメン店・ホテル等）
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.reviews (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text        NOT NULL,
  content_id   text        NOT NULL,
  region_slug  text,
  rating       smallint    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title        text,
  body         text        NOT NULL DEFAULT '',
  visit_date   date,
  status       text        NOT NULL DEFAULT 'published'
                           CHECK (status IN ('draft', 'published', 'hidden', 'deleted')),
  helpful_count integer    NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
  metadata     jsonb       NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, content_type, content_id),
  CONSTRAINT content_type_valid CHECK (
    content_type IN (
      'cafe', 'ramen_item', 'article', 'ranking',
      'leisure_spot', 'hotel', 'beauty_salon'
    )
  )
);

ALTER TABLE es.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews: public read published"
  ON es.reviews FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "reviews: own read all"
  ON es.reviews FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "reviews: own insert"
  ON es.reviews FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "reviews: own update"
  ON es.reviews FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "reviews: own delete"
  ON es.reviews FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE TRIGGER set_reviews_updated_at
  BEFORE UPDATE ON es.reviews
  FOR EACH ROW EXECUTE FUNCTION es.set_updated_at();

-- ----------------------------------------------------------
-- 4. レビュー有用投票
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.review_votes (
  review_id  uuid        NOT NULL REFERENCES es.reviews(id) ON DELETE CASCADE,
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote       text        NOT NULL DEFAULT 'helpful' CHECK (vote IN ('helpful', 'unhelpful')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (review_id, user_id)
);

ALTER TABLE es.review_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "review_votes: public read"
  ON es.review_votes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "review_votes: own insert"
  ON es.review_votes FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "review_votes: own delete"
  ON es.review_votes FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- レビュー helpful_count を自動更新
CREATE OR REPLACE FUNCTION es.handle_review_vote()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = es, public
AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.vote = 'helpful' THEN
    UPDATE es.reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' AND OLD.vote = 'helpful' THEN
    UPDATE es.reviews SET helpful_count = GREATEST(helpful_count - 1, 0) WHERE id = OLD.review_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_review_vote_change
  AFTER INSERT OR DELETE ON es.review_votes
  FOR EACH ROW EXECUTE FUNCTION es.handle_review_vote();

-- ----------------------------------------------------------
-- 5. 通知
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.notifications (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       text        NOT NULL,  -- 'like', 'review', 'fortune', 'system', 'campaign' ...
  title      text        NOT NULL,
  body       text        NOT NULL DEFAULT '',
  action_url text,
  data       jsonb       NOT NULL DEFAULT '{}',
  read_at    timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE es.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications: own read"
  ON es.notifications FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "notifications: own update"
  ON es.notifications FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ----------------------------------------------------------
-- 6. 事業者アカウント（店舗オーナー・掲載企業）
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.business_accounts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text        NOT NULL,
  content_id   text        NOT NULL,
  plan         text        NOT NULL DEFAULT 'free'
                           CHECK (plan IN ('free', 'basic', 'premium', 'enterprise')),
  status       text        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'active', 'suspended', 'cancelled')),
  verified_at  timestamptz,
  expires_at   timestamptz,
  metadata     jsonb       NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (content_type, content_id)
);

ALTER TABLE es.business_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "business_accounts: own read"
  ON es.business_accounts FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "business_accounts: own insert"
  ON es.business_accounts FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "business_accounts: own update"
  ON es.business_accounts FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE TRIGGER set_business_accounts_updated_at
  BEFORE UPDATE ON es.business_accounts
  FOR EACH ROW EXECUTE FUNCTION es.set_updated_at();

-- ----------------------------------------------------------
-- 7. ユーザーポイント残高
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.user_points (
  user_id    uuid    PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  balance    integer NOT NULL DEFAULT 0 CHECK (balance >= 0),
  lifetime   integer NOT NULL DEFAULT 0 CHECK (lifetime >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE es.user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_points: own read"
  ON es.user_points FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- ----------------------------------------------------------
-- 8. ポイント履歴台帳
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.point_ledger (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  delta       integer     NOT NULL,  -- 正: 付与, 負: 消費
  reason      text        NOT NULL,  -- 'daily_login', 'review', 'like', 'redeem', ...
  reference   text,                  -- 関連コンテンツ ID など
  balance_after integer   NOT NULL,
  metadata    jsonb       NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE es.point_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "point_ledger: own read"
  ON es.point_ledger FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "point_ledger: own insert"
  ON es.point_ledger FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ----------------------------------------------------------
-- 9. フォロー関係（ユーザー同士）
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.user_follows (
  follower_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  followee_id uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, followee_id),
  CONSTRAINT no_self_follow CHECK (follower_id <> followee_id)
);

ALTER TABLE es.user_follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_follows: public read"
  ON es.user_follows FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "user_follows: own insert"
  ON es.user_follows FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = follower_id);

CREATE POLICY "user_follows: own delete"
  ON es.user_follows FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = follower_id);

-- ----------------------------------------------------------
-- 10. コンテンツ通報（モデレーション）
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.content_reports (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id  uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text        NOT NULL,
  content_id   text        NOT NULL,
  reason       text        NOT NULL CHECK (reason IN (
                             'spam', 'inappropriate', 'misinformation',
                             'copyright', 'duplicate', 'other'
                           )),
  detail       text        NOT NULL DEFAULT '',
  status       text        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  metadata     jsonb       NOT NULL DEFAULT '{}',
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE es.content_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_reports: own read"
  ON es.content_reports FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = reporter_id);

CREATE POLICY "content_reports: own insert"
  ON es.content_reports FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = reporter_id);

-- ----------------------------------------------------------
-- 11. 追加インデックス
-- ----------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_reviews_content
  ON es.reviews (content_type, content_id)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_reviews_user
  ON es.reviews (user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON es.notifications (user_id, created_at DESC)
  WHERE read_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_point_ledger_user
  ON es.point_ledger (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_follows_follower
  ON es.user_follows (follower_id);

CREATE INDEX IF NOT EXISTS idx_user_follows_followee
  ON es.user_follows (followee_id);

CREATE INDEX IF NOT EXISTS idx_content_likes_type_id_liketype
  ON es.content_likes (content_type, content_id, like_type);

-- ----------------------------------------------------------
-- 12. 新テーブルへの権限付与
-- ----------------------------------------------------------
GRANT SELECT                      ON es.reviews           TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON es.reviews        TO authenticated;
GRANT SELECT                      ON es.review_votes      TO anon, authenticated;
GRANT SELECT, INSERT, DELETE      ON es.review_votes      TO authenticated;
GRANT SELECT, UPDATE              ON es.notifications     TO authenticated;
GRANT SELECT, INSERT, UPDATE      ON es.business_accounts TO authenticated;
GRANT SELECT                      ON es.user_points       TO authenticated;
GRANT SELECT, INSERT              ON es.point_ledger      TO authenticated;
GRANT SELECT                      ON es.user_follows      TO anon, authenticated;
GRANT SELECT, INSERT, DELETE      ON es.user_follows      TO authenticated;
GRANT SELECT, INSERT              ON es.content_reports   TO authenticated;
