-- ==========================================================
-- each-spirit: es スキーマ 初期マイグレーション
-- 作成: 2026-06-11
-- 対象 Supabase プロジェクト: drink-management (ctwpnaizwsrffrkkbuig)
--
-- 【重要】このマイグレーションは public.* の既存テーブルを一切変更しません。
-- 飲酒管理アプリの動作に影響はありません。
-- 新規 `es` スキーマに each-spirit 専用テーブルを追加します。
-- ==========================================================

-- ----------------------------------------------------------
-- 0. スキーマ作成
-- ----------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS es;

-- ----------------------------------------------------------
-- 1. ユーザー設定 (each-spirit 専用プリファレンス)
--    公開プロフィールは既存の public.profiles を共有する
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.user_prefs (
  user_id             uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  favorite_categories text[]      NOT NULL DEFAULT '{}',  -- ['cafe', 'ramen', ...]
  favorite_regions    text[]      NOT NULL DEFAULT '{}',  -- ['niigata', 'toyama', ...]
  notify_email        boolean     NOT NULL DEFAULT true,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE es.user_prefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_prefs: own read"
  ON es.user_prefs FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "user_prefs: own upsert"
  ON es.user_prefs FOR ALL
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ----------------------------------------------------------
-- 2. コンテンツいいね（全コンテンツ統一テーブル）
--
--    content_type の値:
--      'cafe'         カフェ店舗
--      'ramen_item'   ラーメン店舗
--      'article'      記事
--      'ranking'      ランキング
--      'leisure_spot' レジャースポット
--      'hotel'        ホテル
--      'beauty_salon' 美容サロン
--
--    content_id: slug 文字列（グローバルにユニーク前提）
--      cafe      → cafe_slug         例: 'amber-coffee-toyama'
--      article   → article_slug      例: 'niigata-ramen-guide'
--      ranking   → ranking_slug      例: 'niigata-cafe-best'
--      その他    → 同様の slug
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.content_likes (
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type text        NOT NULL,
  content_id   text        NOT NULL,
  region_slug  text,                   -- NULL = 地域に紐付かないコンテンツ（全国記事など）
  created_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, content_type, content_id),
  CONSTRAINT content_type_valid CHECK (
    content_type IN (
      'cafe', 'ramen_item', 'article', 'ranking',
      'leisure_spot', 'hotel', 'beauty_salon'
    )
  )
);

ALTER TABLE es.content_likes ENABLE ROW LEVEL SECURITY;

-- いいねした事実は誰でも見られる（カウント表示のため）
CREATE POLICY "content_likes: public read"
  ON es.content_likes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "content_likes: own insert"
  ON es.content_likes FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "content_likes: own delete"
  ON es.content_likes FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- ----------------------------------------------------------
-- 3. いいねカウントキャッシュ
--    COUNT(*) を毎回叩かず、trigger で自動集計する
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.content_like_counts (
  content_type text    NOT NULL,
  content_id   text    NOT NULL,
  region_slug  text,
  count        integer NOT NULL DEFAULT 0 CHECK (count >= 0),
  PRIMARY KEY (content_type, content_id)
);

ALTER TABLE es.content_like_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_like_counts: public read"
  ON es.content_like_counts FOR SELECT
  TO anon, authenticated
  USING (true);

-- INSERT 時にカウントを +1
CREATE OR REPLACE FUNCTION es.handle_like_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = es, public
AS $$
BEGIN
  INSERT INTO es.content_like_counts (content_type, content_id, region_slug, count)
  VALUES (NEW.content_type, NEW.content_id, NEW.region_slug, 1)
  ON CONFLICT (content_type, content_id)
  DO UPDATE SET count = es.content_like_counts.count + 1;
  RETURN NEW;
END;
$$;

-- DELETE 時にカウントを -1（0 未満にはしない）
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
    AND content_id   = OLD.content_id;
  RETURN OLD;
END;
$$;

CREATE TRIGGER on_content_like_insert
  AFTER INSERT ON es.content_likes
  FOR EACH ROW EXECUTE FUNCTION es.handle_like_insert();

CREATE TRIGGER on_content_like_delete
  AFTER DELETE ON es.content_likes
  FOR EACH ROW EXECUTE FUNCTION es.handle_like_delete();

-- ----------------------------------------------------------
-- 4. 記事テーブル
--    既存の TypeScript 記事を段階的に移行する対象
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.articles (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text        NOT NULL UNIQUE,
  category        text        NOT NULL,  -- 'ramen' | 'cafe' | 'leisure' | 'beauty' | 'hotel'
  region          text,                  -- NULL = 全国コンテンツ
  title           text        NOT NULL,
  description     text        NOT NULL,
  body_md         text        NOT NULL DEFAULT '',
  cover_image_url text,
  author_name     text,                  -- 表示用著者名（編集部 など）
  author_id       uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  tags            text[]      NOT NULL DEFAULT '{}',
  status          text        NOT NULL DEFAULT 'draft'
                              CHECK (status IN ('draft', 'published', 'archived')),
  published_at    timestamptz,
  -- SEO
  seo_title       text,                  -- NULL の場合 title を使用
  seo_description text,                  -- NULL の場合 description を使用
  seo_keywords    text[]      NOT NULL DEFAULT '{}',
  -- 非正規化カウンタ（クエリコスト削減）
  like_count      integer     NOT NULL DEFAULT 0 CHECK (like_count >= 0),
  view_count      integer     NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE es.articles ENABLE ROW LEVEL SECURITY;

-- 公開済み記事は誰でも読める
CREATE POLICY "articles: public read published"
  ON es.articles FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- 記事いいね時に like_count を同期するトリガー
CREATE OR REPLACE FUNCTION es.sync_article_like_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = es, public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE es.articles
    SET like_count = like_count + 1
    WHERE slug = NEW.content_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE es.articles
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE slug = OLD.content_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_article_like_change
  AFTER INSERT OR DELETE ON es.content_likes
  FOR EACH ROW
  EXECUTE FUNCTION es.sync_article_like_count();

-- updated_at 自動更新ヘルパー
CREATE OR REPLACE FUNCTION es.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_articles_updated_at
  BEFORE UPDATE ON es.articles
  FOR EACH ROW EXECUTE FUNCTION es.set_updated_at();

CREATE TRIGGER set_user_prefs_updated_at
  BEFORE UPDATE ON es.user_prefs
  FOR EACH ROW EXECUTE FUNCTION es.set_updated_at();

-- ----------------------------------------------------------
-- 5. デイリー占い
--    同日・同 fortune_type は UNIQUE → 同じ日に何度アクセスしても同じ結果
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.daily_fortunes (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fortune_date date        NOT NULL,
  fortune_type text        NOT NULL DEFAULT 'zodiac',  -- 'zodiac' | 'tarot' | 'cafe'
  result       jsonb       NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, fortune_date, fortune_type)
);

ALTER TABLE es.daily_fortunes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_fortunes: own read"
  ON es.daily_fortunes FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "daily_fortunes: own insert"
  ON es.daily_fortunes FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ----------------------------------------------------------
-- 6. 診断結果
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.quiz_results (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_type  text        NOT NULL,  -- 'cafe_style' | 'coffee_preference' | ...
  answers    jsonb       NOT NULL,
  result     jsonb       NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE es.quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_results: own read"
  ON es.quiz_results FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "quiz_results: own insert"
  ON es.quiz_results FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- ----------------------------------------------------------
-- 7. インデックス
-- ----------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_content_likes_content
  ON es.content_likes (content_type, content_id);

CREATE INDEX IF NOT EXISTS idx_content_likes_user
  ON es.content_likes (user_id);

CREATE INDEX IF NOT EXISTS idx_articles_status_published
  ON es.articles (published_at DESC)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_articles_category_region
  ON es.articles (category, region);

CREATE INDEX IF NOT EXISTS idx_daily_fortunes_user_date
  ON es.daily_fortunes (user_id, fortune_date);

-- ----------------------------------------------------------
-- 8. スキーマ権限付与（Data API に公開）
--    anon: 公開情報の読み取りのみ
--    authenticated: 自分のデータの読み書き
-- ----------------------------------------------------------
GRANT USAGE ON SCHEMA es TO anon, authenticated;

GRANT SELECT                ON es.content_like_counts TO anon, authenticated;
GRANT SELECT                ON es.articles            TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON es.content_likes      TO authenticated;
GRANT SELECT, INSERT, UPDATE ON es.user_prefs         TO authenticated;
GRANT SELECT, INSERT         ON es.daily_fortunes     TO authenticated;
GRANT SELECT, INSERT         ON es.quiz_results       TO authenticated;
