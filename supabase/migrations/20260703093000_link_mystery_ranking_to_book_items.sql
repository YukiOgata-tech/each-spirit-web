-- 推理小説ランキング（mystery-novels-ranking-2026-07）のうち、作品ページ(es.items)を
-- 追加した5冊のエントリを manual → item 参照に切り替え、ランキングから作品詳細へリンクさせる。
-- item ページ未作成の残りエントリは manual のまま（displayName＋理由のみ表示）。

update es.ranking_items ri
set entry_kind = 'item'
from es.rankings r
where ri.ranking_id = r.id
  and r.slug = 'mystery-novels-ranking-2026-07'
  and ri.item_slug in ('jirai-glico', 'kanenbutsu', 'hakobune', 'jukkai', 'bakudan');
