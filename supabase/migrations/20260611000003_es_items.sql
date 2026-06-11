-- ==========================================================
-- each-spirit: es.items 汎用アイテムテーブル
-- 作成: 2026-06-11
--
-- カフェ・ラーメン店・ホテル・家電・アプリなど
-- ジャンルを問わず1テーブルで管理する。
-- カテゴリ固有フィールドは metadata jsonb に格納。
--
-- あわせて content_likes / reviews の content_type CHECK を
-- 固定値リストから「空文字禁止」に緩和し、無限ジャンル対応にする。
-- ==========================================================

-- ----------------------------------------------------------
-- 1. content_type CHECK 制約を緩和（無限ジャンル対応）
--    固定値リスト → 空文字禁止のみ
-- ----------------------------------------------------------
ALTER TABLE es.content_likes DROP CONSTRAINT IF EXISTS content_type_valid;
ALTER TABLE es.content_likes
  ADD CONSTRAINT content_type_nonempty CHECK (content_type <> '');

ALTER TABLE es.reviews DROP CONSTRAINT IF EXISTS reviews_content_type_valid;
ALTER TABLE es.reviews
  ADD CONSTRAINT content_type_nonempty CHECK (content_type <> '');

-- ----------------------------------------------------------
-- 2. sync_article_like_count を content_type 条件付きに修正
--    cafe などのいいねで articles が無駄に UPDATE されるのを防ぐ
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION es.sync_article_like_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = es, public
AS $$
BEGIN
  IF NEW.content_type <> 'article' AND TG_OP = 'INSERT' THEN RETURN NEW; END IF;
  IF OLD.content_type <> 'article' AND TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  IF TG_OP = 'INSERT' AND NEW.like_type <> 'like'  THEN RETURN NEW; END IF;
  IF TG_OP = 'DELETE' AND OLD.like_type <> 'like'  THEN RETURN OLD; END IF;
  IF TG_OP = 'INSERT' THEN
    UPDATE es.articles SET like_count = like_count + 1
    WHERE slug = NEW.content_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE es.articles SET like_count = GREATEST(like_count - 1, 0)
    WHERE slug = OLD.content_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- ----------------------------------------------------------
-- 3. es.items テーブル
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.items (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text        NOT NULL,
  content_type     text        NOT NULL CHECK (content_type <> ''),
  -- 'cafe' | 'ramen_item' | 'hotel' | 'leisure_spot' | 'beauty_salon'
  -- | 'electronics' | 'app' | ... ジャンルを自由に追加可能
  region           text,                    -- NULL = 地域に紐付かない
  name             text        NOT NULL,
  description      text        NOT NULL DEFAULT '',
  image_url        text,                    -- 外部URL そのまま格納
  address          text,
  area             text,
  phone            text,
  price_range      text,
  official_url     text,
  map_url          text,
  tags             text[]      NOT NULL DEFAULT '{}',
  status           text        NOT NULL DEFAULT 'published'
                               CHECK (status IN ('draft', 'published', 'archived')),
  last_verified_at date,
  editor_comment   text        NOT NULL DEFAULT '',
  like_count       integer     NOT NULL DEFAULT 0 CHECK (like_count >= 0),
  view_count       integer     NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  metadata         jsonb       NOT NULL DEFAULT '{}',
  -- カテゴリ固有フィールドの格納例:
  --   cafe:        {style, wifi, power, parking, reservation, signature_menu, ...}
  --   ramen_item:  {genre, recommended_menu, parking, ...}
  --   hotel:       {style, meals, onsen, check_in, check_out, ...}
  --   electronics: {brand, model, specs, warranty, ...}
  --   app:         {platform, price_model, version, ...}
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (content_type, slug)
  -- content_likes / reviews の (content_type, content_id) と対応
);

ALTER TABLE es.items ENABLE ROW LEVEL SECURITY;

-- 公開アイテムは誰でも読める
CREATE POLICY "items: public read published"
  ON es.items FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- 管理操作は authenticated（将来 admin ロール実装後に絞る）
CREATE POLICY "items: authenticated write"
  ON es.items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ----------------------------------------------------------
-- 4. like_count 自動同期トリガー（アイテム用）
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION es.sync_item_like_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = es, public
AS $$
BEGIN
  -- article は es.articles 側のトリガーが担当
  IF TG_OP = 'INSERT' AND NEW.content_type = 'article'  THEN RETURN NEW; END IF;
  IF TG_OP = 'DELETE' AND OLD.content_type = 'article'  THEN RETURN OLD; END IF;
  IF TG_OP = 'INSERT' AND NEW.like_type    <> 'like'    THEN RETURN NEW; END IF;
  IF TG_OP = 'DELETE' AND OLD.like_type    <> 'like'    THEN RETURN OLD; END IF;

  IF TG_OP = 'INSERT' THEN
    UPDATE es.items
    SET like_count = like_count + 1
    WHERE content_type = NEW.content_type AND slug = NEW.content_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE es.items
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE content_type = OLD.content_type AND slug = OLD.content_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_item_like_change
  AFTER INSERT OR DELETE ON es.content_likes
  FOR EACH ROW EXECUTE FUNCTION es.sync_item_like_count();

-- updated_at 自動更新
CREATE TRIGGER set_items_updated_at
  BEFORE UPDATE ON es.items
  FOR EACH ROW EXECUTE FUNCTION es.set_updated_at();

-- ----------------------------------------------------------
-- 5. インデックス
-- ----------------------------------------------------------
-- カテゴリ×地域での絞り込み（最頻出クエリ）
CREATE INDEX IF NOT EXISTS idx_items_type_region
  ON es.items (content_type, region)
  WHERE status = 'published';

-- タグ検索（GIN）
CREATE INDEX IF NOT EXISTS idx_items_tags
  ON es.items USING GIN (tags);

-- metadata 内フィールド検索（GIN）
CREATE INDEX IF NOT EXISTS idx_items_metadata
  ON es.items USING GIN (metadata);

-- like_count 降順（人気順ソート）
CREATE INDEX IF NOT EXISTS idx_items_like_count
  ON es.items (content_type, like_count DESC)
  WHERE status = 'published';

-- ----------------------------------------------------------
-- 6. 権限付与
-- ----------------------------------------------------------
GRANT SELECT ON es.items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON es.items TO authenticated;
