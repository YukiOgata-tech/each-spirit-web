-- ============================================================================
-- articles / items / rankings の updated_at を「手動制御」列にする
--
-- これらの updated_at は表示日付（記事の更新日・item の最終確認日など）として
-- 使うため、編集のたびに自動で now() へ上書きされてほしくない。自動更新トリガを
-- 外し、「明示的に updated_at を書いた UPDATE のときだけ」値が変わるようにする。
--
-- - 変更検知は changed_at（別列・無条件 now()）が担うので revalidate には影響なし。
-- - 共通関数 es.set_updated_at() は他テーブル（reviews / user_prefs / affiliate_* 等）
--   が引き続き使うため DROP しない。ここでは対象3テーブルのトリガのみ外す。
-- - INSERT 時の updated_at は列 default（now()）のまま＝新規行は作成時刻が入る。
--   以降は手で設定しない限り動かない。
-- ============================================================================

drop trigger if exists set_articles_updated_at on es.articles;
drop trigger if exists set_items_updated_at on es.items;
drop trigger if exists set_rankings_updated_at on es.rankings;
