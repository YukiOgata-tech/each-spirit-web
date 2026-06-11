-- ==========================================================
-- each-spirit: es.rankings / es.ranking_items
-- 作成: 2026-06-11
--
-- ランキングも articles / items と同じ思想で設計。
-- カテゴリごとにテーブルを分けず、content_type で区別。
-- ランク順位は ranking_items に正規化して格納し、
-- 「このアイテムが含まれるランキング」を逆引きできる。
-- ==========================================================

-- ----------------------------------------------------------
-- 1. es.rankings
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.rankings (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              text        NOT NULL,
  content_type      text        NOT NULL CHECK (content_type <> ''),
  -- 'cafe' | 'ramen' | 'hotel' | 'leisure' | 'beauty' | 'protein' | ...
  region            text,                    -- NULL = 全国ランキング
  title             text        NOT NULL,
  description       text        NOT NULL DEFAULT '',
  conclusion        text        NOT NULL DEFAULT '',
  quick_table_label text        NOT NULL DEFAULT '',
  criteria          text[]      NOT NULL DEFAULT '{}',
  tags              text[]      NOT NULL DEFAULT '{}',
  status            text        NOT NULL DEFAULT 'published'
                                CHECK (status IN ('draft','published','archived')),
  last_updated_at   date,
  like_count        integer     NOT NULL DEFAULT 0 CHECK (like_count >= 0),
  view_count        integer     NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  metadata          jsonb       NOT NULL DEFAULT '{}',
  -- sources, faqs などカテゴリ固有フィールドを格納
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (content_type, slug)
);

ALTER TABLE es.rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "rankings: public read published"
  ON es.rankings FOR SELECT TO anon, authenticated
  USING (status = 'published');

-- ----------------------------------------------------------
-- 2. es.ranking_items（ランク順位リスト）
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS es.ranking_items (
  id                uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
  ranking_id        uuid      NOT NULL REFERENCES es.rankings(id) ON DELETE CASCADE,
  rank              smallint  NOT NULL CHECK (rank >= 1),
  item_content_type text      NOT NULL CHECK (item_content_type <> ''),
  item_slug         text      NOT NULL,
  -- es.items の (content_type, slug) に対応（論理参照。FK は張らず柔軟に）
  score             numeric(5,2),
  reason            text      NOT NULL DEFAULT '',
  is_pr             boolean   NOT NULL DEFAULT false,
  metadata          jsonb     NOT NULL DEFAULT '{}',
  UNIQUE (ranking_id, rank)
);

ALTER TABLE es.ranking_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ranking_items: public read"
  ON es.ranking_items FOR SELECT TO anon, authenticated
  USING (true);

-- ----------------------------------------------------------
-- 3. like_count 自動同期（ランキング用）
-- ----------------------------------------------------------
CREATE OR REPLACE FUNCTION es.sync_ranking_like_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = es, public AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.content_type <> 'ranking' THEN RETURN NEW; END IF;
  IF TG_OP = 'DELETE' AND OLD.content_type <> 'ranking' THEN RETURN OLD; END IF;
  IF TG_OP = 'INSERT' AND NEW.like_type <> 'like' THEN RETURN NEW; END IF;
  IF TG_OP = 'DELETE' AND OLD.like_type <> 'like' THEN RETURN OLD; END IF;
  IF TG_OP = 'INSERT' THEN
    UPDATE es.rankings SET like_count = like_count + 1 WHERE slug = NEW.content_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE es.rankings SET like_count = GREATEST(like_count - 1, 0) WHERE slug = OLD.content_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_ranking_like_change
  AFTER INSERT OR DELETE ON es.content_likes
  FOR EACH ROW EXECUTE FUNCTION es.sync_ranking_like_count();

CREATE TRIGGER set_rankings_updated_at
  BEFORE UPDATE ON es.rankings
  FOR EACH ROW EXECUTE FUNCTION es.set_updated_at();

-- ----------------------------------------------------------
-- 4. インデックス
-- ----------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_rankings_type_region
  ON es.rankings (content_type, region) WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_rankings_like_count
  ON es.rankings (content_type, like_count DESC) WHERE status = 'published';

-- 逆引き: このアイテムが含まれるランキング一覧
CREATE INDEX IF NOT EXISTS idx_ranking_items_item
  ON es.ranking_items (item_content_type, item_slug);

CREATE INDEX IF NOT EXISTS idx_ranking_items_ranking
  ON es.ranking_items (ranking_id, rank);

-- ----------------------------------------------------------
-- 5. 権限付与
-- ----------------------------------------------------------
GRANT SELECT ON es.rankings      TO anon, authenticated;
GRANT SELECT ON es.ranking_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON es.rankings      TO authenticated;
GRANT INSERT, UPDATE, DELETE ON es.ranking_items TO authenticated;
