-- ========== RANKINGS + RANKING_ITEMS ==========
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-ramen-essential', 'ramen', 'niigata',
    '新潟県内でまず候補に入れたいラーメン10店', '新潟5大ラーメンの代表性、アクセス、公式情報の追跡しやすさ、旅行者への説明しやすさを軸に、県内でまず比較したい店舗を整理しました。', '初回の新潟ラーメン巡りなら、あっさり醤油は三吉屋、濃厚味噌は東横かこまどり、燕背脂は杭州飯店、総合満足度ならいっとうやを優先候補にすると選びやすいです。',
    '新潟ラーメン主要店早見表', ARRAY['新潟5大ラーメンや地域性を説明しやすいこと', '営業時間・住所・駐車場などの基本情報を追跡できること', '初訪問者にとって味の特徴が分かりやすいこと', '観光・地元利用のどちらにも導線を作りやすいこと', 'PR掲載ではなく編集部評価として紹介できること']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"新潟市内の店舗基本情報と看板メニュー確認。"},{"title":"新潟市ラーメンガイドブック","url":"https://www.city.niigata.lg.jp/kanko/kanko/oshirase/ramen.files/guidebook.pdf","sourceType":"government","collectedAt":"2026-06-08","note":"新潟5大ラーメンと掲載店舗の文脈確認。"},{"title":"燕背脂ラーメンMAP","url":"https://ra-men.tsubame-kankou.jp/","sourceType":"tourism","collectedAt":"2026-06-08","note":"燕背脂ラーメンと杭州飯店の店舗情報確認。"}],"faqs":[{"question":"このランキングは広告ですか？","answer":"現時点では全件PR掲載なしです。各ランキング項目にPRフラグを表示しています。"},{"question":"営業時間は保証されていますか？","answer":"営業時間や定休日は変更される可能性があります。Each Spiritでは確認日と参照ソースを明示し、訪問前の公式確認を推奨します。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='ramen' AND slug='niigata-ramen-essential';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'ramen_item', 'sankichiya-nishibori', 94, '新潟あっさり醤油を説明する入口として強く、古町観光とも組み合わせやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'ramen_item', 'hangzhou-hanten', 93, '燕背脂ラーメンを語る上で外しにくく、県内全域ページの核になる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'ramen_item', 'touyoko-shichikuyama', 91, '新潟濃厚味噌と割りスープ体験を分かりやすく紹介できる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'ramen_item', 'ittoya-shichikuyama', 89, 'ご当地分類を超えて総合満足度で紹介しやすく、駐車場情報も明確。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'ramen_item', 'komadori-maki', 88, '濃厚味噌の代表格として東横と比較しやすく、巻方面の導線を作れる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'ramen_item', 'jikon-matsuzaki', 86, '新潟市内で背脂・岩のり中華を扱う候補として個性が強い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'ramen_item', 'menya-shingen', 85, '朝営業や煮干し系の切り口があり、利用シーン別に強い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 8, 'ramen_item', 'raimi-ogata', 84, '淡麗から限定麺まで幅があり、東区の実力店として記事展開しやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 9, 'ramen_item', 'naoji-souhonten', 82, '公式サイトで追跡しやすく、ガッツリ系・限定麺の導線を作りやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 10, 'ramen_item', 'menya-shinobu', 80, '駅南で背脂系を探す読者に提案しやすいが、営業時間確認が重要。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-miso', 'ramen', 'niigata',
    '新潟濃厚味噌ラーメンで比較したい店', '割りスープ付きの濃厚味噌、巻エリアの濃厚味噌など、味噌ラーメンを目的に新潟を巡る時の候補を整理します。', '市内アクセスと分かりやすさなら東横、巻方面まで足を伸ばすならこまどりを候補にすると比較しやすいです。',
    '濃厚味噌ラーメン早見表', ARRAY['濃厚味噌としての代表性', '初訪問者への説明しやすさ', 'アクセスと営業時間', '観光ルートへの組み込みやすさ']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"東横 公式 店舗情報","url":"https://www.touyoko.jp/stores","sourceType":"official","collectedAt":"2026-06-08","note":"東横店舗情報確認。"},{"title":"MEN LIFE ラーメン こまどり","url":"https://menlife.jp/shop/396","sourceType":"editorial","collectedAt":"2026-06-08","note":"こまどりの営業時間・濃厚味噌文脈確認。"}],"faqs":[{"question":"新潟濃厚味噌は普通の味噌ラーメンと何が違いますか？","answer":"濃い味噌スープと太麺、場合によっては割りスープで調整する体験が特徴として紹介されます。"},{"question":"車なしでも行けますか？","answer":"東横紫竹山本店は新潟駅からタクシー利用も検討できます。こまどりは車移動の方が計画しやすいです。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='ramen' AND slug='niigata-miso';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'ramen_item', 'touyoko-shichikuyama', 92, '割りスープ付き濃厚味噌の体験が明確で、中心部からも比較的アクセスしやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'ramen_item', 'komadori-maki', 89, '濃厚味噌の代表格として、巻・岩室方面の旅行導線に組み込みやすい。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-assari-shoyu', 'ramen', 'niigata',
    '新潟あっさり醤油・淡麗系で選びたい店', '細麺と淡麗スープの老舗から煮干し香る中華そばまで、軽やかに食べたい人向けに整理します。', '歴史と王道感なら三吉屋、煮干しの現代的な淡麗感まで見るなら麺や来味も候補です。',
    'あっさり・淡麗系早見表', ARRAY['スープの軽さ', '初訪問者への食べやすさ', '地域性', '情報の追跡しやすさ']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"まいぷれ 三吉屋 西堀本店","url":"https://niigata.mypl.net/article/ramen_niigata/30547","sourceType":"local-media","collectedAt":"2026-06-08","note":"三吉屋基本情報確認。"},{"title":"新潟市ラーメンガイド 麺や来味","url":"https://niigatacity-ramen.jp/ramen/raimi/","sourceType":"official","collectedAt":"2026-06-08","note":"麺や来味基本情報確認。"}],"faqs":[{"question":"あっさり系は観光客にも向いていますか？","answer":"重すぎない味を探す人や、連食の1軒目として向いています。"},{"question":"淡麗系でも煮干し感はありますか？","answer":"麺や来味のように、あっさりしながら煮干しのだしを感じる店舗もあります。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='ramen' AND slug='niigata-assari-shoyu';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'ramen_item', 'sankichiya-nishibori', 94, '新潟あっさり醤油の入口として説明しやすく、古町での導線も強い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'ramen_item', 'raimi-ogata', 85, '煮干し香る中華そばを軸に、淡麗系の比較対象として扱いやすい。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-parking', 'ramen', 'niigata',
    '駐車場ありで選びやすい新潟ラーメン店', '車移動が多い新潟県内で、駐車場情報を確認しやすい店舗を中心に比較します。', '新潟市内ならいっとうや、真玄、来味、滋魂、県央まで含めるなら杭州飯店が車移動の候補です。',
    '車移動向け早見表', ARRAY['駐車場情報の明確さ', 'エリアの使いやすさ', '営業時間の追跡しやすさ', '目的別の選びやすさ']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"新潟市内店舗の駐車場情報確認。"},{"title":"燕背脂ラーメンMAP 杭州飯店","url":"https://ra-men.tsubame-kankou.jp/stores/entry-27.html","sourceType":"tourism","collectedAt":"2026-06-08","note":"杭州飯店の駐車場有を確認。"}],"faqs":[{"question":"駐車場ありでも満車になりますか？","answer":"人気店は満車になる可能性があります。ピーク時間を避ける、周辺駐車場を確認するなどの準備がおすすめです。"},{"question":"このランキングは駐車台数だけで決めていますか？","answer":"駐車場情報の明確さに加え、エリア、営業時間、味の特徴も含めて整理しています。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='ramen' AND slug='niigata-parking';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'ramen_item', 'ittoya-shichikuyama', 90, '駐車場22台の掲載があり、市内中心部からも使いやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'ramen_item', 'menya-shingen', 88, '駐車場15台掲載、朝営業日もあり利用シーンが広い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'ramen_item', 'hangzhou-hanten', 87, '燕市観光協会の店舗情報で駐車場有と掲載され、県央観光と組み合わせやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'ramen_item', 'raimi-ogata', 85, '駐車場26台掲載で、東区方面の車移動に向く。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'ramen_item', 'jikon-matsuzaki', 83, '東区で背脂系を探す車移動の候補として扱いやすい。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-independent-selection', 'ramen', 'niigata',
    'チェーン店以外で選ぶ新潟市周辺の個性派ラーメン', '複数店舗展開のチェーン店を外し、新潟市ラーメンガイドで基本情報を確認できる個店を中心に、味の個性とエリアの広がりで整理しました。', '濃厚煮干しなら石黒、味噌なら花咲・神田屋・八珍亭、夜の古町なら麺亭、貝だし塩なら貝晴を候補にすると目的別に選びやすいです。',
    '非チェーン個店早見表', ARRAY['チェーン店・大規模多店舗展開店を今回の追加対象から外すこと', '住所、営業時間、定休日、駐車場などの基本情報を参照元で確認できること', '煮干し、味噌、つけ麺、夜営業、貝だしなど味や利用シーンの違いが明確なこと', '中央区だけに偏らず、江南区、西蒲区、南区、西区まで広げられること', 'PR掲載ではなく、参照情報に基づく編集整理であること']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"新潟市ラーメンガイド 中華そば 石黒","url":"https://niigatacity-ramen.jp/ramen/ishiguro/","sourceType":"official","collectedAt":"2026-06-08","note":"中華そば石黒の基本情報と極にぼの特徴確認。"},{"title":"新潟市ラーメンガイド みそ蔵らーめん 花咲","url":"https://niigatacity-ramen.jp/ramen/%E3%81%BF%E3%81%9D%E8%94%B5%E3%82%89%E3%83%BC%E3%82%81%E3%82%93-%E8%8A%B1%E5%92%B2/","sourceType":"official","collectedAt":"2026-06-08","note":"花咲の基本情報と味噌の特徴確認。"},{"title":"新潟市ラーメンガイド 麺屋 一本気","url":"https://niigatacity-ramen.jp/ramen/ippongi/","sourceType":"official","collectedAt":"2026-06-08","note":"一本気の基本情報と辛つけ麺の特徴確認。"},{"title":"新潟市ラーメンガイド ラーメン 麺亭","url":"https://niigatacity-ramen.jp/ramen/%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3-%E9%BA%BA%E4%BA%AD/","sourceType":"official","collectedAt":"2026-06-08","note":"麺亭の基本情報と夜営業、エビらーめん確認。"},{"title":"新潟市ラーメンガイド らぁ麺 貝晴","url":"https://niigatacity-ramen.jp/ramen/%E3%82%89%E3%81%81%E9%BA%BA-%E8%B2%9D%E6%99%B4/","sourceType":"official","collectedAt":"2026-06-08","note":"貝晴の基本情報と貝だし塩の特徴確認。"}],"faqs":[{"question":"このランキングはチェーン店を含みますか？","answer":"今回の追加対象では、複数店舗展開のチェーン店を外し、個店として紹介しやすい店舗を中心に整理しています。"},{"question":"掲載情報は実食レビューですか？","answer":"現時点では公式・地域ガイド等の公開情報に基づく編集整理です。営業時間や定休日は変更される可能性があるため、訪問前確認を推奨します。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='ramen' AND slug='niigata-independent-selection';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'ramen_item', 'ishiguro-bentenbashi', 90, '3種の煮干しと動物系を重ねる極にぼが明確で、濃厚煮干し目的の入口にしやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'ramen_item', 'hanasaki-nuttari', 88, '沼垂と発酵文化、峰村醸造の米こうじみそという文脈を作りやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'ramen_item', 'kaisei-kobari', 87, '貝だし塩という軽い選択肢を追加でき、味噌・背脂中心の一覧に幅が出る。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'ramen_item', 'ippongi-konan', 86, '辛つけ麺とWスープの特徴があり、江南区の検索導線も補強できる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'ramen_item', 'mentei-furumachi', 85, '古町で夜営業という利用シーンが明確で、締めラーメン需要を拾いやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'ramen_item', 'hachintei-nishikan', 84, '西蒲区、特製みそ、駐車場60台掲載という車移動向けの情報価値がある。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'ramen_item', 'kandaya-minami', 83, '南区の味噌ラーメン候補として特徴があり、夜営業の情報も整理しやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 8, 'ramen_item', 'mentei-kogane', 82, '3種チャーシューのこがねら〜めんが分かりやすく、南区の掲載厚みを作れる。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'yamagata-ramen-essential', 'ramen', 'yamagata',
    '山形ラーメン 初回に選びたい8店', '消費量日本一・山形の多様なラーメン文化を代表する店を、地域代表性・スタイルの個性・情報の追跡しやすさで選出。からみそ・冷やし・酒田ラーメン・煮干し・地鶏と幅広く体験できる8店です。', 'からみそなら龍上海、冷やしラーメン発祥なら栄屋本店、酒田ラーメンなら満月、煮干し特化なら二代目高橋商店か幸めん、地鶏鶏白湯なら麺匠とぐろが優先候補です。',
    '山形ラーメン必食8店早見表', ARRAY['山形の地域ラーメン文化（からみそ・酒田・冷やし・煮干し・地鶏）を網羅できること', '創業年・住所・営業時間などの基本情報を公式・観光情報から追跡できること', '初訪問者にとってジャンルと特徴が分かりやすいこと', '複数エリアをカバーして旅行計画に組み込みやすいこと', 'PR掲載ではなく編集部評価として紹介できること']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"龍上海 公式サイト","url":"https://ryushanhai.com/group/","sourceType":"official","collectedAt":"2026-06-08","note":"龍上海基本情報・からみそ発祥確認。"},{"title":"ワンタンメンの満月 公式サイト","url":"https://www.sakata-mangetsu.com/sakata/","sourceType":"official","collectedAt":"2026-06-08","note":"満月基本情報確認。"},{"title":"VISIT YAMAGATA 栄屋本店","url":"https://www.visityamagata.jp/spot-yamagata-sakaeyahonten/","sourceType":"tourism","collectedAt":"2026-06-08","note":"栄屋本店・冷やしラーメン発祥確認。"},{"title":"ヤマガタウェイ 山形ラーメン人気30選","url":"https://mag.yway.jp/pr/45200/","sourceType":"local-media","collectedAt":"2026-06-08","note":"山形市・村山エリア各店の特徴確認。"},{"title":"山形市公式 ラーメン消費額日本一","url":"https://www.city.yamagata-yamagata.lg.jp/jigyosya/miryoku/brand/1017939.html","sourceType":"government","collectedAt":"2026-06-08","note":"山形ラーメンの背景確認。"}],"faqs":[{"question":"このランキングは広告ですか？","answer":"全件PR掲載なしです。各ランキング項目にPRフラグを表示しています。"},{"question":"営業時間は保証されていますか？","answer":"営業時間や定休日・季節限定情報は変更される可能性があります。各店舗ページの参照ソースを確認のうえ、訪問前に公式情報を確認してください。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='ramen' AND slug='yamagata-ramen-essential';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'ramen_item', 'yamagata-ryushanhai-akayu', 96, 'からみそラーメン発祥の全国区名店。辛みそを溶かしながら食べるスタイルで山形ラーメンの個性が最も伝わりやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'ramen_item', 'yamagata-mangetsu-sakata', 93, '1948年創業・駐車場40台・定休日固定と訪問計画が立てやすく、酒田ラーメンの入口として最適。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'ramen_item', 'yamagata-sakaiya-honten', 90, '冷やしラーメン発祥の切り口が明確。夏期訪問なら外せない山形市の代表店。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'ramen_item', 'yamagata-takahashi-shoten', 88, '年4.5t煮干し・無化調という具体的な特徴があり、煮干し目的のファンに刺さる東根の名店。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'ramen_item', 'yamagata-koumen-sagae', 86, '天然かます煮干し100%という全国的に希少な食材を使う寒河江の個店。煮干し好きに強く刺さる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'ramen_item', 'yamagata-toguro-tendo', 84, '山形地鶏だけを使った無化調鶏白湯で、煮干しが多い山形ランキングに幅を加えられる天童の一店。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'ramen_item', 'yamagata-shogetsu-sakata', 82, '朝7時から・年中無休・駐車場9台と訪問計画しやすい酒田の朝ラー代表。満月との比較候補にも。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 8, 'ramen_item', 'yamagata-kumabun-yonezawa', 80, '米沢エリアの醤油中華そばとして置賜地方の導線を作れる。上杉文化観光との組み合わせに向く。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'yamagata-niboshi-selection', 'ramen', 'yamagata',
    '煮干しで選ぶ山形ラーメン', 'ラーメン消費量日本一の山形は煮干し文化も豊か。天然かます煮干し・年4.5t使用の無化調・うまにぼし醤油・濃厚Wスープと個性の異なる4店で山形の煮干し層を整理します。', '希少素材なら幸めんのかます煮干し、量と無化調なら二代目高橋商店、朝から食べるならこうじ屋、Wスープの濃厚感なら麺家林商店が候補です。',
    '山形煮干しラーメン早見表', ARRAY['煮干しを主体としたスープを提供していること', '使用素材・製法に明確な個性があること', '基本情報を参照元から確認できること', '山形内の複数エリアをカバーすること']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"ヤマガタウェイ 山形ラーメン人気30選","url":"https://mag.yway.jp/pr/45200/","sourceType":"local-media","collectedAt":"2026-06-08","note":"高橋商店・こうじ屋・林商店の特徴確認。"},{"title":"ヤマガタウェイ 幸めん かます煮干し","url":"https://mag.yway.jp/gourmet/21597/","sourceType":"local-media","collectedAt":"2026-06-08","note":"幸めんのかます煮干し100%確認。"}],"faqs":[{"question":"山形は煮干しラーメンが多いのですか？","answer":"ラーメン消費量日本一の山形では多様なスタイルが発展しており、煮干し系も個性豊かな店が集まっています。使用素材・製法・濃度がそれぞれ異なる点が特徴です。"},{"question":"煮干しが苦手でも食べられますか？","answer":"二代目高橋商店や麺家林商店のWスープ系は動物系も合わさるため、煮干しの独特な苦みが和らぐ場合があります。幸めんのかます煮干しは一般的なイワシ煮干しとは風味が異なります。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='ramen' AND slug='yamagata-niboshi-selection';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'ramen_item', 'yamagata-takahashi-shoten', 92, '年4.5tの煮干し使用・無化調という数値で説明できる東根の煮干し特化店。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'ramen_item', 'yamagata-koumen-sagae', 90, '天然かます煮干し100%という全国希少の素材が強い個性。炙りチャーシューとの組み合わせも分かりやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'ramen_item', 'yamagata-koujiya', 87, '朝7時からのうまにぼし醤油。朝ラー×煮干しという利用シーンも明確で山形市でユニークな存在。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'ramen_item', 'yamagata-hayashi-shoten', 85, '数種の煮干しと動物系のWスープ・太麺細麺選択と特徴整理しやすい山形市の夜営業ある個店。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'yamagata-area-selection', 'ramen', 'yamagata',
    'エリアで選ぶ山形ラーメン 8エリア代表選', '南陽・山形市・寒河江・東根・天童・酒田・鶴岡・米沢の8エリアから各1店を選び、山形ラーメンの地域的な多様性を整理します。旅行計画に合わせてエリアから選ぶ際に活用してください。', '南陽は龍上海のからみそ、山形市は栄屋本店の冷やしラーメン（夏）、村山は幸めん・高橋商店の煮干し、天童は地鶏の麺匠とぐろ、酒田は満月・照月、鶴岡は琴平荘、米沢は熊文が各エリアの起点候補です。',
    '山形エリア別ラーメン早見表', ARRAY['南陽・山形市・寒河江または東根・天童・酒田・鶴岡・米沢の各エリアを代表すること', 'ジャンル・味スタイルが各エリアの地域性を示すこと', '基本情報（住所・営業時間）を参照元から確認できること']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"龍上海 公式サイト","url":"https://ryushanhai.com/group/","sourceType":"official","collectedAt":"2026-06-08","note":"南陽エリア確認。"},{"title":"酒田ラーメン Wikipedia","url":"https://ja.wikipedia.org/wiki/%E9%85%92%E7%94%B0%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3","sourceType":"editorial","collectedAt":"2026-06-08","note":"酒田ラーメンの地域特性確認。"},{"title":"ヤマガタウェイ 山形ラーメン人気30選","url":"https://mag.yway.jp/pr/45200/","sourceType":"local-media","collectedAt":"2026-06-08","note":"村山・天童エリア各店の確認。"},{"title":"まっぷる 支那そば熊文","url":"https://www.mapple.net/spot/6000397/","sourceType":"editorial","collectedAt":"2026-06-08","note":"米沢エリア熊文の確認。"}],"faqs":[{"question":"山形の各エリアへのアクセスはどうですか？","answer":"南陽・山形市・天童・東根・寒河江はJR奥羽本線・仙山線でアクセス可能。酒田・鶴岡は庄内エリアで山形新幹線の停車駅がなく車か高速バスが便利です。米沢は山形新幹線停車駅があります。"},{"question":"琴平荘は夏も営業していますか？","answer":"10月〜5月の冬季のみ営業です。6〜9月の訪問計画には向きません。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='ramen' AND slug='yamagata-area-selection';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'ramen_item', 'yamagata-ryushanhai-akayu', 95, '南陽市赤湯エリア代表。からみそという独自ジャンルで全国的知名度があり、エリア説明の起点になる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'ramen_item', 'yamagata-mangetsu-sakata', 93, '酒田エリアの酒田ラーメン代表。1948年創業・駐車場40台と訪問計画しやすい老舗。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'ramen_item', 'yamagata-sakaiya-honten', 90, '山形市エリアで冷やしラーメン発祥を体験できる。夏期の観光定番として代表性が高い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'ramen_item', 'yamagata-konpirasou', 88, '鶴岡エリアから全国区の知名度を持つ冬季限定店。営業時期に注意が必要だが個性が際立つ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'ramen_item', 'yamagata-takahashi-shoten', 86, '東根エリアの煮干し無化調名店。年4.5t使用という特徴で村山エリアの導線を補強できる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'ramen_item', 'yamagata-toguro-tendo', 84, '天童エリアの地鶏鶏白湯。さくらんぼ東根・天童温泉の観光と組み合わせやすい立地。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'ramen_item', 'yamagata-kumabun-yonezawa', 82, '米沢エリアの正統派醤油中華そば。置賜・上杉観光との組み合わせ記事に使いやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 8, 'ramen_item', 'yamagata-koumen-sagae', 80, '寒河江エリアの希少かます煮干し店。村山エリアの多様性を示す個性的な一店として機能する。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-cafe-best', 'cafe', 'niigata',
    '新潟県のカフェ おすすめランキング', 'スペシャルティコーヒー・古民家カフェ・ブックカフェなど、新潟県内の個性的なカフェを雰囲気・こだわり・アクセスで総合評価。上越・妙高・燕三条・佐渡・村上まで県内各エリアを網羅し、編集部が整理しました。', '古町で老舗の一杯を楽しむなら珈琲工房シャモニー、スペシャルティを体験したいならinnovative Co.、雰囲気重視なら澁いと水屋が最有力候補。村上・妙高・佐渡と遠出するならLINDBERGH・Rucchi・caMocoも外せません。',
    '新潟カフェ総合評価早見表', ARRAY['コーヒー・ドリンクのクオリティと個性', '空間・雰囲気の魅力度', 'アクセスと駐車場の利便性', '価格とコストパフォーマンス', '公式情報の追跡しやすさ']::text[],
    '2026-06-09', 'published',
    '{"sources":[{"title":"食べログ 新潟カフェ特集","url":"https://tabelog.com/niigata/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ・評点参考"},{"title":"新潟おでかけメディア025","url":"https://025niigata.jp/","sourceType":"local-media","collectedAt":"2026-06-09","note":"地元カフェ情報参考"},{"title":"Things新潟","url":"https://things-niigata.jp/","sourceType":"local-media","collectedAt":"2026-06-09","note":"長岡・上越エリアカフェ情報参考"}],"faqs":[{"question":"新潟県内で特に空間にこだわりたい場合はどこがいいですか？","answer":"大地の芸術祭エリアの古民家「澁い -SHIBUI-」と越後湯沢の温泉旅館内カフェ「水屋」が空間の個性では群を抜きます。佐渡の加茂湖を望む「caMoco cafe 湖ASOBi」も旅先ならではの絶景カフェとしておすすめです。"},{"question":"このランキングはPR広告ですか？","answer":"現時点ではすべてPR掲載なしです。各ランキング項目にPRフラグを表示しています。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='cafe' AND slug='niigata-cafe-best';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'cafe', 'chamonix-niigata', 93, '50年超の老舗純喫茶で自家焙煎・サイフォン式の一杯。古町観光との組み合わせが最強。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'cafe', 'harumachi-coffee', 91, '木造り空間・プリン・フルーツパフェが人気。駐車場完備で車でも行きやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'cafe', 'mizuya-yuzawa', 90, '温泉珈琲という唯一無二の体験。越後湯沢駅徒歩2分で旅行者にも強くおすすめ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'cafe', 'shibui-matsushiro', 89, '大地の芸術祭エリアの築100年超古民家。アート観光との相性が抜群。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'cafe', 'innovative-co-niigata', 87, '豆×抽出方法を選ぶ体験型スペシャルティ。コーヒー好きには特別な店。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'cafe', 'lindbergh-coffee-roastery-murakami', 86, '村上・北限のロースタリー。希少な立地と本格焙煎が組み合わさる一軒。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'cafe', 'tsubame-coffee-tsubame', 85, '燕市内の自家焙煎。ものづくりの街の職人気質なコーヒーが光る。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 8, 'cafe', 'book-cafe-antenna', 84, 'WiFi・電源完備のブックカフェ。本好き・ワーク利用に最適。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 9, 'cafe', 'awayuki-coffee-joetsu', 83, '上越エリアで常時6種以上のスペシャルティ。バスクチーズケーキとのペアが最高。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 10, 'cafe', 'rucchi-coffee-roaster-myoko', 82, '妙高市の山麓ロースタリー。観光と一緒に立ち寄れる希少なコーヒー拠点。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 11, 'cafe', 'pepe-nagaoka', 81, '長岡の昭和レトロ純喫茶。名物ナポリタンと夜22時まで営業が魅力。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 12, 'cafe', 'camoco-cafe-ko-asobi-sado', 80, '佐渡島の加茂湖を眺めるガーデンカフェ。島旅のハイライトになる絶景スポット。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 13, 'cafe', 'west-cafe-nagaoka', 79, 'アウトドアショップ直営のユニークな立地。山倉ブレンドの本格コーヒー。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 14, 'cafe', 'sekai-no-tonari-joetsu', 78, '築90年の町家とアンティーク家具が醸す高田レトロの雰囲気。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 15, 'cafe', 'cafe-hayashi-joetsu', 77, '古民家と発酵食の組み合わせが唯一無二。上越三和区の農村カフェ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 16, 'cafe', 'mother-cafe-tsubame', 76, '燕市の緑に囲まれたガーデンカフェ。季節の野菜スイーツが癒しを与える。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-specialty-coffee', 'cafe', 'niigata',
    '新潟県 スペシャルティ・自家焙煎コーヒーのカフェ', 'コーヒーの産地・焙煎・抽出にこだわる新潟県内の店舗を比較。上越・村上・妙高・燕など県内各エリアの自家焙煎カフェを一挙紹介します。', '老舗自家焙煎の深みなら珈琲工房シャモニー、体験型スペシャルティはinnovative Co.、村上ならLINDBERGH、上越ならawayuki、妙高ならRucchiと、エリアで選ぶのも楽しい。',
    'スペシャルティ・自家焙煎カフェ早見表', ARRAY['豆の産地・焙煎のこだわり', '抽出技術と提供スタイル', 'バリエーションの豊富さ', '価格帯と通いやすさ']::text[],
    '2026-06-09', 'published',
    '{"sources":[{"title":"シャモニー公式","url":"https://chamonix-niigata.com/","sourceType":"official","collectedAt":"2026-06-09","note":"焙煎スタイル・メニュー確認"},{"title":"食べログ 新潟 コーヒー専門店","url":"https://tabelog.com/niigata/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ参考"}],"faqs":[{"question":"新潟でスペシャルティコーヒーを初めて飲むならどこがいいですか？","answer":"古町のinnovative Co.は豆と抽出方法を選ぶスタイルなので、スタッフが丁寧に説明してくれます。スペシャルティ初心者の入門に最適です。"},{"question":"コーヒー豆を購入できる店はありますか？","answer":"珈琲工房シャモニーでは自家焙煎豆の購入が可能です。LINDBERGHやRucchi Coffee Roasterでも豆販売を行っています。お土産にも喜ばれます。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='cafe' AND slug='niigata-specialty-coffee';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'cafe', 'chamonix-niigata', 95, 'ブレンド5種・ストレート7種を自家焙煎・サイフォン式で。コーヒーの種類と淹れ方の多様さが突出。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'cafe', 'innovative-co-niigata', 91, '豆→抽出方法の選択体験が他にない。スペシャルティの個性を最も教えてくれる一店。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'cafe', 'lindbergh-coffee-roastery-murakami', 88, '村上市の本格ロースタリー。新潟県の北端で出会う高品質コーヒーは旅の特別な一杯。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'cafe', 'tsubame-coffee-tsubame', 86, '燕市のものづくり文化と共鳴する職人的自家焙煎。三条燕エリアで唯一に近い存在。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'cafe', 'awayuki-coffee-joetsu', 84, '上越で常時6種以上のスペシャルティ。バスクチーズケーキとの組み合わせが人気。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'cafe', 'rucchi-coffee-roaster-myoko', 82, '妙高エリア唯一のロースタリー。スキーリゾート帰りに立ち寄れるコーヒー拠点。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'cafe', 'west-cafe-nagaoka', 79, '山倉オリジナルブレンド使用。長岡市内でスペシャルティを探している人の有力候補。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-atmosphere-cafe', 'cafe', 'niigata',
    '新潟県 雰囲気がおすすめのカフェ', '特別な空間体験ができる新潟県のカフェを厳選。古民家・温泉地・佐渡島のガーデンカフェなど、その場所にしかない雰囲気を楽しみたい人向けのランキングです。', '旅行との組み合わせなら越後湯沢の水屋・十日町の澁い・佐渡のcaMoco、上越の古民家なら世界ノトナリ・cafe HAYASHI、市内で落ち着いた空間ならブックカフェアンテナが最有力です。',
    '雰囲気・空間カフェ早見表', ARRAY['空間の個性と唯一無二感', 'インテリア・建築の魅力', 'ゆっくり過ごせる居心地', '旅行・観光との相性']::text[],
    '2026-06-09', 'published',
    '{"sources":[{"title":"食べログ 新潟 雰囲気重視カフェ","url":"https://tabelog.com/niigata/","sourceType":"user-review","collectedAt":"2026-06-09","note":"雰囲気評価参考"},{"title":"新潟おでかけメディア025","url":"https://025niigata.jp/","sourceType":"local-media","collectedAt":"2026-06-09","note":"空間・雰囲気情報参考"}],"faqs":[{"question":"佐渡でカフェに行くなら？","answer":"caMoco cafe 湖ASOBiが加茂湖の絶景を望むガーデンカフェとして圧倒的な体験価値を持ちます。佐渡観光のハイライトの一つとして訪れることをおすすめします。"},{"question":"子供と一緒に雰囲気のいいカフェに行けますか？","answer":"HARUMACHI coffeeは木の温もりある空間で比較的ファミリー向けです。caMoco cafe 湖ASOBiの広いガーデンスペースも子連れに向いています。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='cafe' AND slug='niigata-atmosphere-cafe';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'cafe', 'mizuya-yuzawa', 94, '温泉水で淹れるコーヒー＋足湯という体験は全国でも希少。旅情感が最高。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'cafe', 'shibui-matsushiro', 93, '築100年超の古民家とカール・ベンクスのデザインが圧倒的存在感。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'cafe', 'camoco-cafe-ko-asobi-sado', 88, '佐渡・加茂湖を望む絶景ガーデンカフェ。島旅にしか体験できない非日常感。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'cafe', 'cafe-hayashi-joetsu', 86, '古民家で発酵食文化を体験できる上越三和区の隠れ家。農村の空気感が格別。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'cafe', 'sekai-no-tonari-joetsu', 84, '映画館隣の築90年町家。アンティーク家具と高田レトロの雰囲気が唯一無二。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'cafe', 'book-cafe-antenna', 82, '絵本・古書に囲まれた独特の空気感。本好きには別格の居心地。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'cafe', 'pepe-nagaoka', 80, 'レンガ造り外観の昭和純喫茶は長岡市内で類のない存在。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-sweets-cafe', 'cafe', 'niigata',
    '新潟県 スイーツが人気のカフェ', 'フルーツパフェ・手作りプリン・季節の焼き菓子など、スイーツを目当てに訪れたい新潟県内のカフェランキング。地元素材を使った手作りスイーツが楽しめる店を厳選しました。', '週替わりフルーツパフェとHARUMACHIプリンなら断然HARUMACHI coffee、旅のお土産スイーツは水屋の湯澤るうろ、燕市の季節の野菜スイーツはMotherが狙い目です。',
    'スイーツカフェ早見表', ARRAY['スイーツのオリジナリティと完成度', '地元素材の使用', 'コストパフォーマンス', '季節限定・数量限定の魅力']::text[],
    '2026-06-09', 'published',
    '{"sources":[{"title":"HARUMACHI coffee 公式","url":"https://www.harumachi-coffee.com/","sourceType":"official","collectedAt":"2026-06-09","note":"スイーツメニュー確認"},{"title":"水屋 食べログ","url":"https://tabelog.com/niigata/A1504/A150404/15001180/","sourceType":"user-review","collectedAt":"2026-06-09","note":"スイーツ情報確認"}],"faqs":[{"question":"HARUMACHIのプリンはいつでも食べられますか？","answer":"週末・連休は午前中に売り切れることがあります。数量限定のため、早めの時間帯の来店をおすすめします。"},{"question":"燕市でスイーツを楽しめるカフェはありますか？","answer":"Mother（ガーデンカフェ）が自家農園の野菜・フルーツを使ったスイーツを提供しています。燕三条エリア観光と合わせて立ち寄ることができます。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='cafe' AND slug='niigata-sweets-cafe';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'cafe', 'harumachi-coffee', 92, 'HARUMACHIプリンと旬のフルーツパフェが週替わり。食材のこだわりが高い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'cafe', 'mizuya-yuzawa', 88, '魚沼産コシヒカリ米粉ロールケーキ「湯澤るうろ」はお土産にも最適な逸品。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'cafe', 'mother-cafe-tsubame', 82, '燕市の自家農園野菜・フルーツを使った季節スイーツ。地産地消の美味しさが際立つ。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'yamagata-cafe-best', 'cafe', 'yamagata',
    '山形県のカフェ おすすめランキング', 'スペシャルティコーヒー・蔵カフェ・フルーツスイーツカフェなど、山形県内の個性的なカフェを雰囲気・こだわり・アクセスで総合評価。米沢・上山・鶴岡・酒田・長井・南陽まで県内各エリアを網羅しました。', 'コーヒーのこだわりならBOTA coffeeまたは蔵王の森焙煎工房、空間の個性なら神社カフェかたばみか灯蔵オビハチ、フルーツスイーツなら天童のoh!show!cafe。米沢エリアなら鷹山堂・cafe gootが新たな選択肢です。',
    '山形カフェ総合評価早見表', ARRAY['コーヒー・ドリンクのクオリティと個性', '空間・雰囲気の魅力度', 'アクセスと駐車場の利便性', '価格とコストパフォーマンス', '公式情報の追跡しやすさ']::text[],
    '2026-06-09', 'published',
    '{"sources":[{"title":"食べログ 山形カフェ特集","url":"https://tabelog.com/yamagata/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ・評点参考"},{"title":"VISIT YAMAGATA","url":"https://www.visityamagata.jp/","sourceType":"tourism","collectedAt":"2026-06-09","note":"地元観光情報参考"},{"title":"山形新聞","url":"https://yamagata.website/","sourceType":"local-media","collectedAt":"2026-06-09","note":"地元カフェ情報参考"}],"faqs":[{"question":"山形でフルーツを使ったカフェはどこがいいですか？","answer":"天童市の「oh!show!cafe（王将果樹園直営）」が最もおすすめです。朝採りさくらんぼ・もも・ぶどう・りんごを使ったシーズン限定のパフェが楽しめます。長井市の「麩和里」もご当地スイーツとして注目です。"},{"question":"このランキングはPR広告ですか？","answer":"現時点ではすべてPR掲載なしです。各ランキング項目にPRフラグを表示しています。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='cafe' AND slug='yamagata-cafe-best';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'cafe', 'bota-coffee-yamagata', 94, '深煎り特化・少量自家焙煎で鮮度にこだわる山形のコーヒー名店。山形市のコーヒー通が通う実力店。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'cafe', 'katabami-jinja-cafe', 92, '荘内神社境内という唯一無二のロケーション。庄内産おむすびと甘酒ラテが体験価値大。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'cafe', 'ohshow-cafe-tendo', 91, '果樹園直営の朝採りフルーツパフェは山形らしさ全開。季節ごとに変わる限定メニューが人気。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'cafe', 'zaonomori-roasters', 90, '20種超の自家焙煎豆を揃えるロースタリー。駐車場完備でアクセスも良好。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'cafe', 'kura-obi-yamagata', 88, '築90年超の蔵改装で昼カフェ・夜ライブバーの二面性。山形市の文化体験として別格。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'cafe', 'paradiso-coffee-roasters-tsuruoka', 87, '庄内エリア唯一級の本格ロースタリー。鶴岡観光と合わせて訪れる価値がある実力店。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'cafe', 'fujinoya-cafe-tsuruoka', 86, '築130年の古民家で庄内食材ランチ。鶴岡観光とセットで訪れる価値大。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 8, 'cafe', 'yozan-do-fabric-coffee-yonezawa', 85, '400年の米沢織文化と一杯のコーヒーが交わる体験型カフェ。上杉神社観光との相性が抜群。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 9, 'cafe', 'cafe-gallery-tsuki-to-hoshi-kaminoyama', 84, '有機野菜ランチと庭の景色が融合する上山のガーデンカフェ。蔵王観光との組み合わせに最適。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 10, 'cafe', 'day-and-coffee-yamagata', 83, '山形駅徒歩5分・朝8:30営業のスペシャルティスタンド。日常使いに最適。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 11, 'cafe', 'cafe-goot-yonezawa', 82, '置賜エリアで唯一級のスペシャルティ自家焙煎。米沢コーヒーファンの聖地。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 12, 'cafe', 'fuwari-fu-cafe-nagai', 81, 'お麩スイーツというご当地の唯一無二コンセプトが長井市の観光価値を高める。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 13, 'cafe', 'nagomu-coffee-pottery-yonezawa', 80, '地元陶芸作家の器でコーヒーを楽しむ米沢のギャラリー。静かな滞在時間が魅力。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 14, 'cafe', 'soraniwa-cafe-tendo', 79, 'BBQ・ペット同伴可・半澤鶏卵プリンとファミリー・グループに対応する懐の広さ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 15, 'cafe', 'kumakichi-farm-cafe-nanyo', 78, '南陽ぶどうの里の農園ガーデンカフェ。自家栽培野菜と旬フルーツで大地のエネルギーを感じる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 16, 'cafe', 'coffee-sansho-koji-sakata', 77, '酒田の港町文化に根ざす自家焙煎店。山居倉庫観光の後に訪れたい一軒。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'yamagata-specialty-coffee', 'cafe', 'yamagata',
    '山形県 スペシャルティ・自家焙煎コーヒーのカフェ', 'コーヒーの産地・焙煎・鮮度にこだわる山形県内の店舗を比較。山形市・米沢・鶴岡・天童と各エリアの自家焙煎カフェを整理しました。', '深煎り特化のBOTA coffee、20種超の豆から選べる蔵王の森焙煎工房、庄内ロースタリーのPARADISO、米沢の隠れ家cafe gootと、エリアごとの個性ある一択が揃っています。',
    'スペシャルティ・自家焙煎カフェ早見表', ARRAY['豆の産地・焙煎のこだわりと鮮度', 'バリエーションの豊富さ', 'アクセスと通いやすさ', 'テイクアウト・豆購入の対応']::text[],
    '2026-06-09', 'published',
    '{"sources":[{"title":"BOTA coffee 公式","url":"https://www.botacoffee.jp/","sourceType":"official","collectedAt":"2026-06-09","note":"コンセプト・メニュー確認"},{"title":"蔵王の森焙煎工房 公式","url":"https://zao-coffee.com/","sourceType":"official","collectedAt":"2026-06-09","note":"メニュー・豆種類確認"},{"title":"VISIT YAMAGATA 蔵王の森紹介","url":"https://www.visityamagata.jp/spot-zaonomori-caffee/","sourceType":"tourism","collectedAt":"2026-06-09","note":"特徴確認"}],"faqs":[{"question":"山形でコーヒー豆をお土産に買えますか？","answer":"蔵王の森焙煎工房では豊富な自家焙煎豆を購入できます。ジャガイモ品種にちなんだユニークなブレンド名は話題作りにも最適です。BOTA coffeeでも豆販売を行っています。"},{"question":"朝早くから営業しているカフェはありますか？","answer":"Day & Coffeeは朝8:30から営業しています。山形駅から徒歩5分のため、観光・出張前の朝の一杯に最適です。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='cafe' AND slug='yamagata-specialty-coffee';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'cafe', 'bota-coffee-yamagata', 95, '「鮮度のために大量販売しない」哲学が徹底。深煎り特化の一杯は山形トップクラス。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'cafe', 'zaonomori-roasters', 92, 'ストレート15種・ブレンド6種の豊富さ。豆購入・テイクアウト対応で通いやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'cafe', 'paradiso-coffee-roasters-tsuruoka', 88, '庄内エリア唯一級のロースタリー。少量焙煎シングルオリジンが鶴岡観光に彩りを添える。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'cafe', 'cafe-goot-yonezawa', 86, '置賜エリアでスペシャルティを楽しめる数少ない一軒。米沢観光と組み合わせたい隠れ家。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'cafe', 'day-and-coffee-yamagata', 84, '朝8:30から営業するスタンドで日常使いしやすい。山形駅近のアクセスも大きな強み。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'yamagata-atmosphere-cafe', 'cafe', 'yamagata',
    '山形県 雰囲気がおすすめのカフェ', '神社境内・蔵改装・米沢織の老舗など、山形ならではの特別な空間でコーヒーを楽しめるカフェを厳選。伝統・文化・自然が交わる山形固有の体験を求める人向けのランキングです。', '山形らしい非日常体験なら荘内神社境内のかたばみ、蔵と文化の融合なら灯蔵オビハチ、米沢の伝統文化なら鷹山堂、上山の自然体験なら月と星、陶器×コーヒーはnagomuと目的別に選べます。',
    '雰囲気・空間カフェ早見表', ARRAY['空間の個性と山形らしさ', '建築・インテリアの魅力', '居心地と滞在しやすさ', '観光・旅行との相性']::text[],
    '2026-06-09', 'published',
    '{"sources":[{"title":"神社カフェかたばみ 公式","url":"https://katabami-cafe.jinjahan.com/","sourceType":"official","collectedAt":"2026-06-09","note":"コンセプト確認"},{"title":"灯蔵オビハチ 公式","url":"https://kuraobi.com/","sourceType":"official","collectedAt":"2026-06-09","note":"施設情報確認"},{"title":"VISIT YAMAGATA","url":"https://www.visityamagata.jp/","sourceType":"tourism","collectedAt":"2026-06-09","note":"観光地情報参考"}],"faqs":[{"question":"神社カフェかたばみに行くなら荘内神社参拝とセットがいいですか？","answer":"はい。神社の境内にあるため、参拝後に立ち寄るルートが自然です。荘内神社は庄内地方の総鎮守で歴史的な見どころも多く、合わせて楽しむことをおすすめします。"},{"question":"米沢観光でカフェに立ち寄るなら？","answer":"鷹山堂 Fabric & Coffeeが上杉神社近くにあり、米沢織の文化体験と一杯のコーヒーを組み合わせられます。nagomuは陶器作家の器でコーヒーを楽しめるユニークな空間です。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='cafe' AND slug='yamagata-atmosphere-cafe';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'cafe', 'katabami-jinja-cafe', 95, '神社境内でコーヒーという体験は全国的にも希少。荘内神社の格式ある空間が最高の舞台。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'cafe', 'kura-obi-yamagata', 91, '築90年の蔵の圧倒的な空気感。昼は文化カフェ・夜はライブバーという二面性も面白い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'cafe', 'yozan-do-fabric-coffee-yonezawa', 88, '400年の米沢織文化と共存する体験型空間。上杉神社参拝後の訪問が自然なルート。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'cafe', 'cafe-gallery-tsuki-to-hoshi-kaminoyama', 86, '有機野菜と庭の景色が山形の自然を体感させる。蔵王・上山温泉観光との相性が良好。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'cafe', 'nagomu-coffee-pottery-yonezawa', 83, '地元陶芸作家の器でコーヒーを楽しむ、米沢の手仕事文化に触れるギャラリーカフェ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'cafe', 'fujinoya-cafe-tsuruoka', 81, '築130年古民家の庄内ランチ。鶴岡観光と合わせると満足度が倍増。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'yamagata-fruits-sweets', 'cafe', 'yamagata',
    '山形県 フルーツスイーツが楽しめるカフェ', 'フルーツ王国・山形の旬果実とご当地素材を使ったスイーツカフェを厳選。さくらんぼ・もも・ぶどう・りんご・お麩など、山形ならではの食材が輝くカフェを整理しました。', '朝採りフルーツ直営のoh!show!cafe、ご当地お麩スイーツの麩和里、農園直送くまきち農園と、それぞれに山形らしさが詰まっています。シーズンごとに違う顔を見せる天童のsoraniwaも外せません。',
    'フルーツスイーツカフェ早見表', ARRAY['フルーツ・食材の産地・鮮度と使い方', 'シーズン限定メニューの魅力', '空間と居心地', 'アクセスと家族・グループ対応']::text[],
    '2026-06-09', 'published',
    '{"sources":[{"title":"oh!show!cafe 公式（王将果樹園）","url":"https://www.ohsyo.co.jp/cafe/","sourceType":"official","collectedAt":"2026-06-09","note":"メニュー・シーズン情報確認"},{"title":"VISIT YAMAGATA フルーツ特集","url":"https://www.visityamagata.jp/","sourceType":"tourism","collectedAt":"2026-06-09","note":"フルーツ観光情報確認"}],"faqs":[{"question":"フルーツパフェはいつのシーズンが一番充実していますか？","answer":"さくらんぼシーズン（6〜7月）が最も人気で、種類も多く限定感があります。ただし混雑も最大のため、早めの来店がおすすめです。もも（8月）もリッチな甘さで評判です。"},{"question":"お麩スイーツが食べられるカフェはありますか？","answer":"長井市の「麩和里」が長井・置賜のお麩を使ったパフェやスイーツで知られています。フラワー長井線の観光と合わせて訪れることができます。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='cafe' AND slug='yamagata-fruits-sweets';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'cafe', 'ohshow-cafe-tendo', 95, '県内最大級観光果樹園の直営カフェ。朝採りフルーツの鮮度と種類の豊富さが圧倒的。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'cafe', 'fuwari-fu-cafe-nagai', 88, 'お麩スイーツという全国でも希少なコンセプト。長井市の手仕事文化が生んだご当地の逸品。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'cafe', 'kumakichi-farm-cafe-nanyo', 85, '南陽の農園で自家栽培フルーツのスイーツを体験。大地と繋がる特別な一皿。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'cafe', 'soraniwa-cafe-tendo', 82, '半澤鶏卵の卵を使ったプリンと旬スイーツ。BBQ・ペット同伴可でグループにも最適。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'toyama-cafe-best', 'cafe', 'toyama',
    '富山県のカフェ おすすめランキング', '世界遺産・五箇山の合掌造りカフェ、高岡金屋町の古民家ロースタリー、立山の伏流水コーヒーなど、富山県内の個性的なカフェを雰囲気・こだわり・アクセスで総合評価。富山市・高岡・黒部・砺波・射水・氷見・南砺まで県内各エリアを網羅し、編集部が整理しました。', '体験の唯一性では五箇山合掌カフェが別格。スペシャルティならAMBER COFFEE、雰囲気重視なら晴耕庵コーヒーか宇奈月蔵カフェ、本格焙煎ならKUREYON ROASTERSが最有力候補。立山・砺波など遠出する価値のある一軒も揃っています。',
    '富山カフェ総合評価早見表', ARRAY['コーヒー・ドリンクのクオリティと個性', '空間・雰囲気の魅力度', 'アクセスと駐車場の利便性', '価格とコストパフォーマンス', '公式情報の追跡しやすさ']::text[],
    '2026-06-11', 'published',
    '{"sources":[{"title":"食べログ 富山カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ・評点参考"},{"title":"富山観光ナビ","url":"https://www.toyama-kanko.jp/","sourceType":"local-media","collectedAt":"2026-06-11","note":"地元観光情報参考"},{"title":"てくてくとやま","url":"https://tekutekutoyama.jp/","sourceType":"local-media","collectedAt":"2026-06-11","note":"富山市周辺カフェ情報参考"}],"faqs":[{"question":"富山県内で最も特別な体験ができるカフェはどこですか？","answer":"ユネスコ世界遺産・五箇山の合掌造りの中で囲炉裏コーヒーを飲める「五箇山合掌カフェ」は他では絶対に味わえない体験です。次点で、日本遺産の金屋町古民家で高岡銅器の器のコーヒーが飲める「晴耕庵コーヒー」もおすすめです。"},{"question":"このランキングはPR広告ですか？","answer":"現時点ではすべてPR掲載なしです。各ランキング項目にPRフラグを表示しています。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='cafe' AND slug='toyama-cafe-best';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'cafe', 'gassho-cafe-nanto', 94, '世界遺産の合掌造りの中で囲炉裏コーヒーを飲む唯一無二の体験。旅の目的地になる一軒。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'cafe', 'amber-coffee-toyama', 92, '富山市内屈指のスペシャルティ専門店。シングルオリジンの豊富なラインナップと洗練された空間。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'cafe', 'kureyon-roasters-toyama', 91, '大型焙煎機を間近に見ながら飲む焙煎したて。富山では珍しい本格ロースタリー体験。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'cafe', 'seikoan-coffee-takaoka', 90, '日本遺産・金屋町の古民家で高岡銅器の器で飲む一杯。観光との組み合わせが完璧。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'cafe', 'unazuki-kura-cafe-kurobe', 89, '黒部峡谷トロッコ旅の拠点。宇奈月温泉の蔵カフェで飲む水出しコーヒーが旅の締め。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'cafe', 'glass-roast-coffee-toyama', 88, 'ゲストロースター豆を常時展開。富山市でコーヒー文化の最先端を体験できる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'cafe', 'maison-blanc-toyama', 87, 'フランス修業パティシエの本格スイーツ。週末に行列ができる富山市の実力派パティスリーカフェ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 8, 'cafe', 'tsugimichi-coffee-toyama', 86, '路地裏のネルドリップ自家焙煎。知る人ぞ知る隠れ家感と、柔らかな一杯が忘れられない。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 9, 'cafe', 'kanayamachi-roastery-takaoka', 85, '金屋町の職人文化と重なる少量焙煎のアプローチ。高岡観光のしめくくりに最適。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 10, 'cafe', 'tulip-garden-cafe-tonami', 84, 'チューリップ畑を一望する窓席が絶景。砺波の四季を感じる唯一のガーデンカフェ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 11, 'cafe', 'tateyama-alpine-coffee', 83, '立山の伏流水で淹れる自家焙煎。アルペンルート観光と組み合わせる富山らしいコーヒー体験。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 12, 'cafe', 'minatomachi-cafe-himi', 82, '氷見の漁師町古民家で縁側から富山湾を眺める。地元食材を生かした料理も魅力。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 13, 'cafe', 'forest-sweets-cafe-oyabe', 81, '里山の農家直送フルーツスイーツが絶品。小矢部の隠れた名パティスリーカフェ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 14, 'cafe', 'jinzu-books-cafe-toyama', 80, 'Wi-Fi・電源完備のブックカフェ。富山市でワーケーション・読書に最適な滞在型カフェ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 15, 'cafe', 'stand-c-iwase-toyama', 79, '岩瀬の古い港町散策に合う一杯。テイクアウトして運河沿いを歩くのが地元スタイル。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 16, 'cafe', 'umimachi-stand-imizu', 77, '富山湾を正面に望む早朝スタンド。海景色のカフェが少ない富山で貴重なロケーション。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'toyama-specialty-coffee', 'cafe', 'toyama',
    '富山県 スペシャルティ・自家焙煎コーヒーのカフェ', 'コーヒーの産地・焙煎・抽出にこだわる富山県内の店舗を比較。富山市のスペシャルティ専門店から、高岡の職人ロースタリー、立山の伏流水自家焙煎まで、富山各地のこだわりカフェを一挙紹介します。', 'シングルオリジン体験ならAMBER COFFEE、本格ロースタリーはKUREYON ROASTERS、ゲスト豆の多様性はGLASS ROAST COFFEEが最有力。山麓の伏流水コーヒーという唯一の体験を求めるなら立山高原コーヒーへ。',
    'スペシャルティ・自家焙煎カフェ早見表', ARRAY['豆の産地・焙煎のこだわり', '抽出技術と提供スタイル', 'バリエーションの豊富さ', '価格帯と通いやすさ']::text[],
    '2026-06-11', 'published',
    '{"sources":[{"title":"食べログ 富山コーヒー特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ・評点参考"},{"title":"富山コーヒー同好会ブログ","url":"https://toyama-coffee.jp/","sourceType":"local-media","collectedAt":"2026-06-11","note":"自家焙煎情報参考"}],"faqs":[{"question":"富山市内でスペシャルティコーヒーが飲めるカフェはどこがいいですか？","answer":"AMBER COFFEE TOYAMAとGLASS ROAST COFFEEがともに総曲輪エリアにあり、どちらも高品質なスペシャルティを提供しています。自家焙煎体験を重視するならKUREYON ROASTERSがおすすめです。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='cafe' AND slug='toyama-specialty-coffee';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'cafe', 'amber-coffee-toyama', 95, 'シングルオリジン専門で産地・季節ごとのラインナップが豊富。富山市内でスペシャルティを語るならここ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'cafe', 'kureyon-roasters-toyama', 92, '大型焙煎機での自家焙煎を目の前で見ながら飲める。焙煎の香りと臨場感が他にない。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'cafe', 'glass-roast-coffee-toyama', 89, '国内外のゲストロースター豆を季節ごとに展開。コーヒー文化の最新トレンドを富山で体験。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'cafe', 'kanayamachi-roastery-takaoka', 87, '少量焙煎の職人スタイルが金屋町の文化と共鳴。高岡観光のついでに必ず立ち寄りたい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'cafe', 'tsugimichi-coffee-toyama', 84, 'ネルドリップの柔らかな口当たりが魅力。路地裏の隠れ家感とともに深煎りブレンドを楽しむ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'cafe', 'tateyama-alpine-coffee', 81, '立山の伏流水で淹れる自家焙煎は都市部では絶対再現不可能。立山観光と組み合わせたい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'cafe', 'stand-c-iwase-toyama', 78, '岩瀬の地元焙煎豆を使ったスタンドコーヒー。テイクアウトで港町散策のお供に。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'toyama-atmosphere-cafe', 'cafe', 'toyama',
    '富山県 雰囲気・空間が素晴らしいカフェ', '世界遺産の合掌造り、金屋町の石畳の古民家、宇奈月温泉の蔵、富山湾を眺めるスタンドまで。「場所そのもの」が体験になる富山県内の個性的なカフェをセレクトしました。', '旅の目的地になるレベルは五箇山合掌カフェが断トツ。高岡エリアなら晴耕庵コーヒー、黒部・宇奈月なら宇奈月蔵カフェ、沿岸エリアなら湊まちカフェと、エリアごとに個性的な空間があります。',
    '雰囲気・空間カフェ早見表', ARRAY['建物・空間の歴史的・文化的価値', '景色・ロケーションの魅力', '雰囲気の唯一性', 'アクセスのしやすさ']::text[],
    '2026-06-11', 'published',
    '{"sources":[{"title":"食べログ 富山雰囲気カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ・評点参考"},{"title":"富山観光ナビ","url":"https://www.toyama-kanko.jp/","sourceType":"local-media","collectedAt":"2026-06-11","note":"観光スポット情報参考"}],"faqs":[{"question":"子ども連れでも入りやすい雰囲気カフェはどこですか？","answer":"チューリップの杜カフェ（砺波）は大型駐車場完備でファミリー向け。海まちスタンド（射水）はテイクアウト形式なので小さなお子さんとも気軽に利用できます。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='cafe' AND slug='toyama-atmosphere-cafe';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'cafe', 'gassho-cafe-nanto', 96, 'ユネスコ世界遺産・合掌造りの中で囲炉裏コーヒー。雰囲気の唯一性では国内トップクラス。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'cafe', 'seikoan-coffee-takaoka', 92, '日本遺産・金屋町の石畳古民家。高岡銅器の器でコーヒーを飲む文化体験が深い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'cafe', 'unazuki-kura-cafe-kurobe', 89, '黒部峡谷の玄関口・宇奈月温泉の蔵カフェ。温泉街の情緒と清流コーヒーの組み合わせが最高。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'cafe', 'minatomachi-cafe-himi', 86, '氷見の漁師町の明治建築。縁側から富山湾を眺める縁側席は旅の思い出になる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'cafe', 'tulip-garden-cafe-tonami', 83, '春はチューリップ畑が窓一面に広がる。砺波らしい圧巻のガーデン景色が魅力。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'cafe', 'umimachi-stand-imizu', 79, '富山湾を正面に見るコーヒースタンド。早朝の海景色と一杯の組み合わせが唯一無二。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'toyama-sweets-cafe', 'cafe', 'toyama',
    '富山県 スイーツ・パティスリーカフェ', '富山の地元食材を使った季節のスイーツ、フランス菓子の本格パティスリーから、里山フルーツのパフェまで。富山県内でスイーツを楽しむならこの一覧をチェックしてください。', 'フランス菓子の本格度ならMAISON BLANC、里山フルーツスイーツなら森のスイーツカフェ、季節の花と一緒に楽しむならチューリップの杜カフェがそれぞれ最有力。',
    'スイーツ・パティスリーカフェ早見表', ARRAY['スイーツのクオリティと独自性', '地元食材の活用度', '季節感と変化の豊富さ', 'カフェとしての居心地']::text[],
    '2026-06-11', 'published',
    '{"sources":[{"title":"食べログ 富山スイーツ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ・評点参考"},{"title":"てくてくとやま","url":"https://tekutekutoyama.jp/","sourceType":"local-media","collectedAt":"2026-06-11","note":"富山スイーツ情報参考"}],"faqs":[{"question":"富山でフルーツスイーツが楽しめるカフェはどこですか？","answer":"小矢部市の「森のスイーツカフェ」が農家直送フルーツのスイーツで最もおすすめです。春のいちご、秋の巨峰の時期が特に充実しています。砺波の「チューリップの杜カフェ」も地元野菜・果物を使ったメニューが揃っています。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='cafe' AND slug='toyama-sweets-cafe';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'cafe', 'maison-blanc-toyama', 94, 'フランス修業パティシエの本格生菓子・焼き菓子。富山市内で最高水準のスイーツクオリティ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'cafe', 'forest-sweets-cafe-oyabe', 89, '農家直送の季節フルーツを使ったパフェとケーキが絶品。里山の立地込みで体験価値が高い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'cafe', 'tulip-garden-cafe-tonami', 82, 'チューリップソフトクリームと地元野菜ランチ。砺波の四季を楽しみながら食べる価値あり。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'cafe', 'jinzu-books-cafe-toyama', 78, '自家製スコーンとコーヒーのペアが丁寧。ブックカフェとしての居心地の良さも加点。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-onsen-ryokan-overall', 'hotel', 'niigata',
    '新潟温泉旅館 総合ランキング 2026', '泉質・料理・ロケーション・サービス・価格バランスを総合評価。越後湯沢・松之山・栃尾又など新潟を代表する個性的な旅館を比較します。', '希少なラジウム泉の自在館、日本三大薬湯の千歳が上位。文学ゆかりの高半も独自の滞在体験として外せない1軒。',
    '新潟温泉旅館 総合ランキング TOP5', ARRAY['泉質の希少性・効能', '料理のクオリティと地域性', 'ロケーションと景観', 'スタッフのホスピタリティ', '価格対満足度バランス']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"各旅館公式情報・現地調査","url":"","sourceType":"editorial","collectedAt":"2026-06-08","note":"価格・サービス内容は変動します。訪問前に各旅館へ確認してください。"}],"faqs":[{"question":"このランキングはどのような基準で作成していますか？","answer":"泉質の希少性・料理の地域性・ロケーション・ホスピタリティ・価格バランスの5軸で総合評価しています。編集部独自の基準によるもので、PR掲載はありません。"},{"question":"温泉初心者におすすめの宿は？","answer":"月岡温泉の清風苑は温泉街としての環境が整っており、温泉初心者でも楽しみやすいです。街歩き・足湯・土産物も充実しています。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='hotel' AND slug='niigata-onsen-ryokan-overall';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'hotel', 'zaikakan-tochinoomata', 92, '日本有数のラジウム含有量という泉質の希少性が際立つ。湯治文化が根付いた宿で、他では体験できない療養温泉を求めるなら最右翼。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'hotel', 'chitose-matsunoyama', 90, '日本三大薬湯という知名度と、実際に入ると納得できる独特の濃厚塩化物泉。棚田の里山という非日常ロケーションも加点要因。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'hotel', 'takahan-yuzawa', 88, '『雪国』ゆかりという文化資本と越後湯沢温泉の安定した泉質。老舗ならではの館内の重みが滞在に深みを加える。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'hotel', 'seifusou-tsukinoka', 85, '月岡温泉の中でも安定した評価を誇る宿。温泉街としての利便性が高く、初めての新潟温泉旅行にも入りやすい選択肢。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'hotel', 'shiomisou-senami', 83, '日本海の夕日という絶景体験は他の宿では代替できない唯一無二の価値。夕日を軸に旅程を組むなら一択。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-onsen-secret', 'hotel', 'niigata',
    '秘湯・湯治宿ランキング', '希少な泉質、山間の秘湯ロケーション、湯治文化を重視した宿のランキング。「温泉に入りに行く」ことが旅の目的になる宿を選びました。', '日本有数のラジウム泉を持つ自在館が圧倒的。松之山・咲花・岩室と、新潟は秘湯系の宿の宝庫。',
    '秘湯・湯治宿 ランキング TOP4', ARRAY['泉質の希少性・個性', '秘湯感・非日常性', '源泉かけ流しの有無', '湯治文化・リピーター率', 'アクセスの不便さも加味した秘湯度']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"各旅館公式情報・現地調査","url":"","sourceType":"editorial","collectedAt":"2026-06-08","note":"訪問前に各旅館へ確認してください。"}],"faqs":[{"question":"湯治宿はどのくらい滞在するものですか？","answer":"湯治は本来1週間〜数週間の長期滞在が基本ですが、現代では2〜3泊でも湯治体験ができる宿が多い。まず1泊してみて気に入ったらリピートする旅行者も多い。"},{"question":"秘湯系の宿に行くなら事前に何を準備すればいいですか？","answer":"山間部の宿は交通手段の確認が最優先。冬季は積雪で通行止めになる道もあります。携帯電話の電波が繋がりにくい場所もあるため、宿の電話番号をメモしておくと安心。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='hotel' AND slug='niigata-onsen-secret';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'hotel', 'zaikakan-tochinoomata', 96, 'ラジウム温泉（放射能泉）という泉質の希少性は全国でもトップクラス。山奥のロケーションも含め、本物の秘湯体験ができる数少ない宿。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'hotel', 'chitose-matsunoyama', 92, '日本三大薬湯の認知度と実際の泉質が伴っている。棚田の里山に囲まれた立地は秘湯感あり。温泉目的の旅行者が多い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'hotel', 'heisui-sakihana', 88, '翡翠色の硫黄泉という視覚的インパクトも大きい個性的な泉質。川沿いの露天風呂で入浴体験としての完成度が高い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'hotel', 'wakachiku-iwamuro', 82, '弥彦山麓の静かなロケーションと小規模旅館ならではの湯治的雰囲気。観光地でありながら秘湯感を保っている希少な環境。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-onsen-scenery', 'hotel', 'niigata',
    '絶景・ロケーション重視ランキング', '景色・立地・季節の自然美を最重視した宿選び。日本海の夕日・妙高山の雄姿・雪国の冬景色・阿賀野川の流れなど、景観が旅の主役になる宿を厳選。', '日本海の夕日を独占できる汐美荘が首位。妙高山の眺望は香嶽楼が強い。雪国の景色を求めるなら高半が唯一無二。',
    '絶景・ロケーション重視ランキング TOP4', ARRAY['景観・ロケーションのインパクト', '客室や露天風呂からの眺め', '季節ごとの変化', '非日常体験としての完成度']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"各旅館公式情報・現地調査","url":"","sourceType":"editorial","collectedAt":"2026-06-08","note":"訪問前に各旅館へ確認してください。"}],"faqs":[{"question":"瀬波温泉の夕日はいつが一番きれいですか？","answer":"大気が澄む秋（9〜11月）が特に美しい。夏は水平線付近に雲がかかりやすいが、晴れた日の夕日はどの季節も圧巻。日の入り時刻を事前に調べて夕食前に露天風呂に入るのがおすすめ。"},{"question":"妙高山の眺めが楽しめる時期はいつですか？","answer":"雪がない夏〜秋は緑豊かな妙高山の全景が見られる。11月〜4月は白銀の山容で全く異なる迫力がある。スキーシーズン（12〜3月）は特に山が美しい。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='hotel' AND slug='niigata-onsen-scenery';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'hotel', 'shiomisou-senami', 94, '日本海に沈む夕日を露天風呂から眺めるという体験の唯一性が圧倒的。夕日目的の旅行者が繰り返し訪れる宿。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'hotel', 'kougakulou-akakura', 90, '妙高山を正面に望む開放感ある露天風呂は季節を問わず素晴らしい。雪化粧した妙高山の眺望は特別な体験。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'hotel', 'takahan-yuzawa', 86, '雪深い越後湯沢の白銀の景色は冬季に圧倒的な存在感を放つ。川端康成が見た風景と同じものを体験できる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'hotel', 'heisui-sakihana', 82, '阿賀野川を望む露天風呂は川面を渡る風と水音が心地よい。紅葉シーズンは特に美しいロケーション。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-leisure-best', 'leisure', 'niigata',
    '新潟でまず候補に入れたいおすすめレジャースポット', '県外観光、日帰り、家族利用のどれにも転用しやすい代表スポットを、公式情報の確認しやすさと体験の分かりやすさで整理しました。', '初回の新潟レジャーなら、絶景は清津峡、市内の雨の日はマリンピア日本海、上越方面はうみがたり、公共系の自然学習ならビュー福島潟や県立植物園が選びやすいです。',
    '新潟レジャー主要スポット早見表', ARRAY['公式・自治体・観光協会ページで基本情報を確認できること', '屋外・屋内・複合型のバランスが取れること', '県外観光客にも体験内容を説明しやすいこと', '家族、カップル、雨の日、車なしなど複数の検索軸に展開できること', '営業時間や予約条件の注意点を明記できること']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"清津峡 公式サイト","url":"https://nakasato-kiyotsu.com/","sourceType":"official","collectedAt":"2026-06-08","note":"清津峡の基本情報確認。"},{"title":"マリンピア日本海 ご利用案内","url":"https://www.marinepia.or.jp/info/","sourceType":"official","collectedAt":"2026-06-08","note":"水族館の基本情報確認。"},{"title":"湯沢高原 料金・営業時間","url":"https://www.yuzawakogen.com/green/tickets/","sourceType":"official","collectedAt":"2026-06-08","note":"湯沢高原の営業期間・料金確認。"},{"title":"新潟市観光ガイド 信濃川ウォーターシャトル","url":"https://www.nvcb.or.jp/spot/detail_1158.html","sourceType":"tourism","collectedAt":"2026-06-08","note":"水上バスの料金・乗船場確認。"},{"title":"うみがたり 公式サイト","url":"https://www.umigatari.jp/joetsu/","sourceType":"official","collectedAt":"2026-06-08","note":"上越市立水族博物館の基本情報確認。"}],"faqs":[{"question":"このランキングは広告ですか？","answer":"現時点ではPR掲載なしです。公式・自治体・観光協会等の公開情報を元に編集部が整理しています。"},{"question":"営業時間は保証されていますか？","answer":"営業時間、運行、休館日、予約条件は変更される可能性があります。各スポット詳細の参照元から最新情報を確認してください。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='leisure' AND slug='niigata-leisure-best';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'leisure_spot', 'kiyotsu-gorge-tunnel', 94, '新潟の絶景・アート体験として訴求力が強く、県外観光の目的地になりやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'leisure_spot', 'marinepia-nihonkai', 91, '新潟市内で屋内・家族・雨の日の検索意図を広く拾える定番施設。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'leisure_spot', 'yuzawa-kogen-panorama-park', 89, '越後湯沢駅周辺の旅行導線に組み込みやすく、高原とロープウェイの体験が明確。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'leisure_spot', 'shinano-river-water-shuttle', 87, '新潟市中心部の移動と体験を兼ねられ、車なし観光にも使いやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'leisure_spot', 'yahiko-ropeway', 86, '彌彦神社や温泉とセットにしやすく、半日から1日の回遊導線を作れる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'leisure_spot', 'umigatari-joetsu', 85, '上越方面の屋内レジャーとして強く、日本海テーマの大型水族博物館を紹介できる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'leisure_spot', 'niigata-furusato-mura', 84, '観光情報、展示、物産、飲食を一か所で回れ、旅程の前後に置きやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 8, 'leisure_spot', 'view-fukushimagata', 83, '公共系の自然学習スポットとして、屋内展示と福島潟の展望を組み合わせられる。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-outdoor-leisure', 'leisure', 'niigata',
    '新潟のアウトドアレジャーで選びたいスポット', '渓谷、高原、ロープウェイ、水上バス、公園など、外で過ごす体験を中心に、季節と天候の影響も踏まえて整理します。', '写真映えと絶景なら清津峡、駅近の高原体験なら湯沢高原、弥彦周辺の半日観光なら弥彦山ロープウェイと弥彦公園、日常的な外遊びなら鳥屋野潟公園が候補です。',
    'アウトドアレジャー早見表', ARRAY['自然・展望・乗り物など屋外体験が明確', '季節性を説明できる', '移動手段と組み合わせやすい', '家族・カップルどちらにも展開できる']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"清津峡 公式サイト","url":"https://nakasato-kiyotsu.com/","sourceType":"official","collectedAt":"2026-06-08","note":"屋外・渓谷スポット確認。"},{"title":"湯沢高原 料金・営業時間","url":"https://www.yuzawakogen.com/green/tickets/","sourceType":"official","collectedAt":"2026-06-08","note":"高原・ロープウェイ営業情報確認。"},{"title":"国営越後丘陵公園 公式","url":"https://echigo-park.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"公園公式情報確認。"},{"title":"にいがた観光ナビ 弥彦公園","url":"https://niigata-kankou.or.jp/spot/7482","sourceType":"tourism","collectedAt":"2026-06-08","note":"弥彦公園の基本情報確認。"},{"title":"新潟県 鳥屋野潟公園","url":"https://www.pref.niigata.lg.jp/sec/toshiseibi/1220551354997.html","sourceType":"government","collectedAt":"2026-06-08","note":"鳥屋野潟公園の施設概要確認。"}],"faqs":[{"question":"アウトドアスポットは冬でも同じように楽しめますか？","answer":"施設により季節営業、整備休業、積雪・天候の影響があります。公式情報の確認が必要です。"},{"question":"車なしでも行きやすいスポットはありますか？","answer":"湯沢高原や信濃川ウォーターシャトルは、公共交通と組み合わせた導線を作りやすい候補です。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='leisure' AND slug='niigata-outdoor-leisure';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'leisure_spot', 'kiyotsu-gorge-tunnel', 94, '自然景観とアートの組み合わせが強く、目的地としての魅力が明確。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'leisure_spot', 'yuzawa-kogen-panorama-park', 90, 'ロープウェイと高原散策で、越後湯沢旅行に組み込みやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'leisure_spot', 'yahiko-ropeway', 88, '弥彦エリアの回遊拠点として使いやすく、展望体験が分かりやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'leisure_spot', 'yahiko-park', 87, '駅近で桜・ホタル・紅葉の季節導線を作りやすく、弥彦観光に組み込みやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'leisure_spot', 'echigo-hillside-park', 86, '花、遊具、芝生広場、季節イベントがあり、家族の外遊びに向く。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'leisure_spot', 'toyano-sports-park', 85, '新潟市中心部で芝生・遊具・自然生態園・スポーツ施設を使い分けられる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'leisure_spot', 'kodomo-shizen-okoku', 84, '子ども向け自然体験、工作、キャンプまで広く、公共系の体験施設として強い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 8, 'leisure_spot', 'shinano-river-water-shuttle', 83, '新潟市中心部で水上移動そのものをレジャー化できる。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-indoor-leisure', 'leisure', 'niigata',
    '新潟のインドア・雨の日レジャースポット', '水族館、科学館、鉄道資料館、物産・展示施設など、天候に左右されにくい屋内中心のスポットを整理します。', '家族の定番ならマリンピア日本海、上越方面ならうみがたり、学習要素なら自然科学館や県立植物園、日常の雨の日運動ならアクアパークにいがたが選びやすいです。',
    'インドアレジャー早見表', ARRAY['屋内展示や屋内滞在が中心', '雨の日でも計画しやすい', '料金・休館日を確認しやすい', '子ども連れや短時間利用にも向く']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"マリンピア日本海 ご利用案内","url":"https://www.marinepia.or.jp/info/","sourceType":"official","collectedAt":"2026-06-08","note":"水族館の屋内施設・料金・休館日確認。"},{"title":"新潟県立自然科学館 ご利用案内","url":"https://www.sciencemuseum.jp/guide/","sourceType":"official","collectedAt":"2026-06-08","note":"科学館の開館時間・料金確認。"},{"title":"にいがた観光ナビ 新津鉄道資料館","url":"https://niigata-kankou.or.jp/spot/5615","sourceType":"tourism","collectedAt":"2026-06-08","note":"鉄道資料館の基本情報確認。"},{"title":"うみがたり 開館時間・料金","url":"https://www.umigatari.jp/en/joetsu/info/","sourceType":"official","collectedAt":"2026-06-08","note":"上越市立水族博物館の開館時間・料金確認。"},{"title":"にいがた観光ナビ 新潟県立植物園","url":"https://niigata-kankou.or.jp/spot/5621","sourceType":"tourism","collectedAt":"2026-06-08","note":"県立植物園の基本情報確認。"}],"faqs":[{"question":"雨の日でも完全に濡れずに回れますか？","answer":"屋内中心の施設でも、駐車場から入口、屋外展示、移動時に雨の影響を受ける場合があります。"},{"question":"小さい子ども連れでも使いやすいですか？","answer":"マリンピア日本海、自然科学館、いくとぴあ食花は子ども連れの候補として整理しやすい施設です。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='leisure' AND slug='niigata-indoor-leisure';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'leisure_spot', 'marinepia-nihonkai', 92, '屋内展示が中心で、家族・雨の日・新潟市観光の検索意図を広く拾える。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'leisure_spot', 'umigatari-joetsu', 90, '上越方面の大型水族博物館で、雨の日や家族旅行の目的地にしやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'leisure_spot', 'niigata-science-museum', 89, '体験型展示とプラネタリウムがあり、学習系レジャーとして強い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'leisure_spot', 'niigata-botanical-garden', 87, '観賞温室と企画展示があり、雨の日でも植物観察をしやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'leisure_spot', 'niitsu-railway-museum', 86, '鉄道文化と車両展示で、親子や鉄道好きに刺さるテーマ性がある。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'leisure_spot', 'teradomari-aquarium', 85, '寺泊観光と組み合わせやすい公共系の水族博物館として補完性が高い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'leisure_spot', 'niigata-furusato-mura', 84, '展示、物産、飲食がまとまり、旅行前後の立ち寄りにも使いやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 8, 'leisure_spot', 'aqua-park-niigata', 83, '屋内温水施設として、日常的な雨の日レジャーや運動目的に向く。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-family-rainyday', 'leisure', 'niigata',
    '子連れ・雨の日で選ぶ新潟レジャースポット', '天候が読みにくい日や、未就学児から小学生までを連れて行きやすいスポットを、屋内比率と滞在しやすさで整理します。', '雨の日の安定感ならマリンピア日本海・うみがたり・自然科学館、無料入館や短時間利用なら新潟ふるさと村、体を動かすならアクアパークにいがたが候補です。',
    '子連れ・雨の日早見表', ARRAY['屋内滞在しやすい', '子どもの年齢に合わせて選びやすい', '駐車場情報を確認しやすい', '半日程度の予定に組み込みやすい']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"マリンピア日本海 ご利用案内","url":"https://www.marinepia.or.jp/info/","sourceType":"official","collectedAt":"2026-06-08","note":"家族向け料金・開館情報確認。"},{"title":"新潟県立自然科学館 ご利用案内","url":"https://www.sciencemuseum.jp/guide/","sourceType":"official","collectedAt":"2026-06-08","note":"料金、駐車場、開館情報確認。"},{"title":"いくとぴあ食花 公式","url":"https://www.ikutopia.com/","sourceType":"official","collectedAt":"2026-06-08","note":"複合施設の営業時間・駐車場確認。"},{"title":"うみがたり 開館時間・料金","url":"https://www.umigatari.jp/en/joetsu/info/","sourceType":"official","collectedAt":"2026-06-08","note":"上越市立水族博物館の開館時間・料金確認。"},{"title":"アクアパークにいがた","url":"https://niigata-kankou.or.jp/spot/11337","sourceType":"tourism","collectedAt":"2026-06-08","note":"屋内温水施設の基本情報確認。"}],"faqs":[{"question":"未就学児でも楽しめる候補はありますか？","answer":"マリンピア日本海、いくとぴあ食花、新潟ふるさと村は未就学児連れでも検討しやすい候補です。"},{"question":"雨の日だけでなく晴れの日も使えますか？","answer":"屋内中心の施設に加え、いくとぴあ食花や越後丘陵公園のように屋外要素を持つ施設もあります。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='leisure' AND slug='niigata-family-rainyday';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'leisure_spot', 'marinepia-nihonkai', 92, '水族館は年齢を問わず使いやすく、雨の日でも計画しやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'leisure_spot', 'umigatari-joetsu', 91, '上越方面の水族博物館として、親子旅行と雨の日の両方に対応しやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'leisure_spot', 'niigata-science-museum', 90, '体験展示とプラネタリウムで、小学生の学習系おでかけに向く。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'leisure_spot', 'ikutopia-shoku-hana', 87, '複数施設を年齢や天候に合わせて選べるため、子連れの調整余地が大きい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'leisure_spot', 'niigata-botanical-garden', 86, '観賞温室があり、植物観察や自由研究の目的を作りやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 6, 'leisure_spot', 'niigata-furusato-mura', 85, '入館無料で、展示・物産・飲食をまとめられるため短時間でも使いやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 7, 'leisure_spot', 'aqua-park-niigata', 84, '屋内温水施設として、雨の日に体を動かす候補になる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 8, 'leisure_spot', 'niitsu-railway-museum', 83, '鉄道好きの子どもには目的性が高く、屋内外展示の組み合わせもある。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 9, 'leisure_spot', 'view-fukushimagata', 82, '展望・映像展示で自然学習ができ、福島潟の屋外観察にもつなげやすい。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-beauty-by-age', 'beauty', 'niigata',
    '【年代別】新潟おすすめ美容室ランキング', '10代〜50代の年代ごとに、ニーズ・施術内容・価格帯・利便性を軸に評価した新潟県美容室ランキング。実在するサロンの公開情報をもとに編集部が整理しています。', '10〜20代の駅前アクセス重視ならCLOE新潟駅前店、カラー品質重視の20〜30代にはSea by LUVISM万代店、髪質改善・ヘッドスパを重視する30〜50代にはUrsus HEADLIGHT坂井東店、長岡市のファミリー層にはCLOE長岡古正寺店が最有力。',
    '年代別おすすめ美容室 早見表（新潟）', ARRAY['年代別ニーズへの対応力（白髪ケア・トレンド・子連れ対応など）', 'スタイリストのカウンセリング体制', '価格帯と年代のマッチング', 'アクセス・駐車場などの利便性', '公開されている口コミ・予約サイト掲載情報']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"Sea by LUVISM 万代店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000624907/","sourceType":"local-media","collectedAt":"2026-06-08","note":"料金・口コミ確認。"},{"title":"Ursus hair Design by HEADLIGHT 坂井東店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000362060/","sourceType":"local-media","collectedAt":"2026-06-08","note":"メニュー・口コミ確認。"},{"title":"CLOE by LUVISM 長岡古正寺店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000375435/","sourceType":"local-media","collectedAt":"2026-06-08","note":"メニュー・子連れ対応・口コミ確認。"}],"faqs":[{"question":"このランキングはどのような基準で選んでいますか？","answer":"ホットペッパービューティー・各公式サイト・楽天ビューティーなどに公開されている情報（メニュー・料金・口コミ・設備）をもとに編集部が整理しています。実際の施術品質は訪問前に口コミや予約サイトで最新情報をご確認ください。"},{"question":"子連れで行けるサロンはどこですか？","answer":"CLOE by LUVISM 長岡古正寺店がキッズスペースあり・駐車場15台完備で子連れ対応が確認されています。電話0258-86-8755です。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='beauty' AND slug='niigata-beauty-by-age';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'beauty_salon', 'ursus-headlight-sakaihi', 91, '髪質改善・ヘッドスパ・縮毛矯正・デジタルパーマと幅広いメニューで30〜50代のケア重視層のニーズを最も総合的に満たす。専用駐車場5台で車移動派にも対応、年中無休で夜21時まで営業と利便性も高い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'beauty_salon', 'sea-luvism-bandai', 86, 'イルミナカラー・ダブルカラーのクオリティで20〜30代カラー層のニーズに的確に応える。LUVISMグループのプレミアムラインとして万代エリアで高い評価を得ており、年中無休夜22時まで営業と使いやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'beauty_salon', 'cloe-luvism-nagaoka', 83, 'キッズスペースあり・駐車場15台完備で、長岡市内で子連れファミリーとカラー品質を両立できる。10〜40代の幅広い年代に対応しており、長岡エリアでの年代別総合評価は最高水準。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'beauty_salon', 'cloe-luvism-niigataeki', 80, '新潟駅徒歩2分という立地と¥2,400〜の入りやすい価格帯が10〜20代に最適。年中無休夜22時まで営業で通勤・通学のついでに利用しやすく、初めてのデザインカラーや縮毛矯正の入門として最適。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'beauty_salon', 'cloe-luvism-furumachi', 75, '古町エリアでオーガニックカラーを得意とし、20〜40代の幅広い層に対応。¥2,500〜のカット料金と年中無休夜22時まで営業が評価ポイント。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-beauty-color', 'beauty', 'niigata',
    '【カラー・髪質改善】新潟おすすめ美容室ランキング', 'イルミナカラー・オーガニックカラー・ダブルカラー・ハイライト・髪質改善トリートメントを得意とするサロンを、公開情報をもとに評価した新潟版ランキング。', 'イルミナカラー・ダブルカラーはSea by LUVISM万代店、オーガニックカラーはCLOE古町・CLOE駅前、髪質改善も含めた総合力はUrsus HEADLIGHT坂井東店が充実。',
    'カラー・髪質改善 早見表（新潟）', ARRAY['カラー薬剤の種類と対応メニューの幅', '髪質改善メニューの有無', 'カラー+トリートメントのセットコスト', '口コミ・予約サイトでの評価', 'アクセス・利便性']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"Sea by LUVISM 万代店 公式サイト","url":"https://seabyluvism.jp/salon/sea-by-luvism-%E4%B8%87%E4%BB%A3%E5%BA%97/","sourceType":"official","collectedAt":"2026-06-08","note":"得意施術確認。"},{"title":"CLOE by LUVISM 長岡古正寺店 公式サイト","url":"https://cloebyluvism.jp/salon/kosyoji/","sourceType":"official","collectedAt":"2026-06-08","note":"料金・メニュー確認。"},{"title":"CLOE by LUVISM 古町6番店 公式サイト","url":"https://cloebyluvism.jp/salon/cloe-by-luvism-%E5%8F%A4%E7%94%BA6%E7%95%AA%E5%BA%97/","sourceType":"official","collectedAt":"2026-06-08","note":"オーガニックカラー料金確認。"}],"faqs":[{"question":"イルミナカラーとオーガニックカラーはどう違いますか？","answer":"イルミナカラーはWELLA製でツヤと透明感に強く、オーガニックカラーは天然由来成分配合で頭皮への刺激が少ない薬剤です。髪質と目的に合わせてサロンでご相談ください。"},{"question":"カラーと髪質改善を同日にできるサロンはどこですか？","answer":"Ursus hair Design by HEADLIGHT 坂井東店はカラー・髪質改善・ヘッドスパを組み合わせたメニューに対応しています。予約時に確認してください。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='beauty' AND slug='niigata-beauty-color';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'beauty_salon', 'sea-luvism-bandai', 94, 'LUVISMグループのプレミアムラインとしてイルミナカラー・ブリーチ・ダブルカラーへの対応が充実。万代エリアでカラーを重視する20〜30代への最有力候補。年中無休で夜22時まで営業。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'beauty_salon', 'cloe-luvism-nagaoka', 87, 'イルミナフルカラー+カット¥7,400〜・インナーカラー・ハイライトと充実したカラーメニューに加え、15台の駐車場と子連れ対応も備える長岡エリアの総合力トップ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'beauty_salon', 'cloe-luvism-furumachi', 82, 'カット+オーガニックフルカラー¥5,400〜と古町エリアでのコスパが評価される。オーガニックカラー対応が特徴で、頭皮が気になる層への提案として有効。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'beauty_salon', 'cloe-luvism-niigataeki', 79, 'カット+オーガニックフルカラー¥4,900〜と新潟駅前エリアで最も入りやすい価格帯のカラーメニュー。縮毛矯正も得意で10〜30代からの支持が厚い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'beauty_salon', 'ursus-headlight-sakaihi', 74, 'カラーに加えてTOKIO系の髪質改善・ヘッドスパも組み合わせられる点で他店と差別化。「カラーとケアを同時にしたい」30〜50代の読者向けの総合力評価で上位。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'niigata-beauty-headspa', 'beauty', 'niigata',
    '【ヘッドスパ・トリートメント】新潟おすすめ美容室ランキング', 'ヘッドスパ・髪質改善トリートメント・縮毛矯正などケア系施術を得意とするサロンを、公開情報をもとに評価した新潟版ランキング。', 'ヘッドスパ・髪質改善・縮毛矯正が一店で揃うUrsus HEADLIGHT坂井東店が最有力。オーガニック系ケアはCLOE古町6番店が対応。',
    'ヘッドスパ・トリートメント 早見表（新潟）', ARRAY['ヘッドスパ・トリートメントメニューの充実度', '髪質改善の対応施術の幅', '口コミ・予約サイトでの評価', '駐車場・アクセスなどの利便性', '価格帯の適正感']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"Ursus hair Design by HEADLIGHT 坂井東店 HEADLIGHT公式","url":"https://headlight-inc.com/salon/area04/nigata/ursus-hair-design-niigatasakaihigashi/","sourceType":"official","collectedAt":"2026-06-08","note":"メニュー・施術内容確認。"},{"title":"CLOE by LUVISM 古町6番店 公式サイト","url":"https://cloebyluvism.jp/salon/cloe-by-luvism-%E5%8F%A4%E7%94%BA6%E7%95%AA%E5%BA%97/","sourceType":"official","collectedAt":"2026-06-08","note":"オーガニックカラー確認。"}],"faqs":[{"question":"新潟でヘッドスパを体験できるサロンはどこですか？","answer":"Ursus hair Design by HEADLIGHT 坂井東店がヘッドスパを含むケア系メニューが最も充実しています。新潟市西区坂井東1-3-15、電話025-378-3447です。"},{"question":"ヘッドスパとカラーは同日にできますか？","answer":"多くのサロンで対応していますが施術時間が長くなります。予約時に希望メニューをお伝えください。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='beauty' AND slug='niigata-beauty-headspa';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'beauty_salon', 'ursus-headlight-sakaihi', 96, '髪質改善・ヘッドスパ・縮毛矯正・デジタルパーマ・トリートメントとケア系メニューが最も充実。専用駐車場5台完備で車移動派も通いやすく、年中無休夜21時まで営業。西区在住の30〜50代のケア重視層への最有力候補。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'beauty_salon', 'cloe-luvism-furumachi', 78, 'オーガニックカラーを得意とし、頭皮に優しい施術へのこだわりがトリートメント系ニーズとも親和性が高い。古町エリアで化学薬剤を避けたいケア重視の読者への提案として有効。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'beauty_salon', 'sea-luvism-bandai', 72, 'カラー施術後の髪質改善ケアのセットメニューが充実。カラーダメージを補いながらケアを継続したい20〜30代の読者への提案として活用できる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'beauty_salon', 'cloe-luvism-nagaoka', 68, '長岡エリアでカラーとトリートメントをセットで利用できる環境が整っている。子連れでも通えるため、産後の髪ケアを始めたい読者への提案としても機能する。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'beauty_salon', 'delight-designers-works', 60, 'メンズ専門サロンとしてメンズ向けのヘアケアメニューに対応。男性でトリートメントや頭皮ケアを始めたい読者への新潟駅前エリアの提案先として機能する。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'yamagata-beauty-by-age', 'beauty', 'yamagata',
    '【年代別】山形おすすめ美容室ランキング', '10代〜50代の年代ごとに、ニーズ・施術内容・価格帯・利便性を軸に評価した山形県美容室ランキング。実在するサロンの公開情報をもとに編集部が整理しています。', '30〜50代の白髪・カット重視にはHAIR DESIGN BUCOまたはBaker Street、20〜30代のカラー重視にはREM山形2号店、コスパ重視の鶴岡エリアならAgu鶴岡東原店、天童市在住ならLAFUCONA。',
    '年代別おすすめ美容室 早見表（山形）', ARRAY['年代別ニーズへの対応力', '価格帯と年代のマッチング', 'アクセス・駐車場などの利便性', '公開されている口コミ・予約サイト掲載情報', '営業時間・定休日の利用しやすさ']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"HAIR DESIGN BUCO 公式サイト","url":"https://hairdesign-buco.com/","sourceType":"official","collectedAt":"2026-06-08","note":"住所・電話・営業時間・料金確認。"},{"title":"REM 山形2号店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000477049/","sourceType":"local-media","collectedAt":"2026-06-08","note":"得意施術・口コミ確認。"},{"title":"Beauty Park 山形市 2026年最新","url":"https://www.beauty-park.jp/yamagata/yamagata-shi/","sourceType":"editorial","collectedAt":"2026-06-08","note":"山形市内人気サロン掲載確認。"}],"faqs":[{"question":"このランキングはどのような基準で選んでいますか？","answer":"ホットペッパービューティー・各公式サイト・楽天ビューティーなどに公開されている情報をもとに編集部が整理しています。実際の施術品質は訪問前に口コミや予約サイトで最新情報をご確認ください。"},{"question":"山形市内と庄内（鶴岡・酒田）どちらのサロンを選ぶべきですか？","answer":"お住まいのエリアに近い方が通いやすいです。特定の施術（カラー品質重視など）が目的であれば、山形市内のサロンまで遠征する価値もあります。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='beauty' AND slug='yamagata-beauty-by-age';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'beauty_salon', 'hair-design-buco', 88, 'イルミナカラーとドライカット技術の組み合わせで30〜50代女性のカット・カラーニーズを高水準で満たす。カット¥4,950〜・カット+イルミナ¥12,650〜と価格は高めだが品質評価が高く、駐車場完備で車移動も問題ない。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'beauty_salon', 'rem-yamagata-2', 84, 'イルミナカラー・アディクシーカラー・TOKIOトリートメント・酸熱トリートメントと20〜30代のカラー＋ケアニーズを総合的にカバー。バス停「大学病院」から徒歩1分のアクセスの良さも評価ポイント。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'beauty_salon', 'baker-street-yamagata', 80, '完全予約制でカウンセリングを重視した似合わせカット専門サロン。七日町という中心地に専用駐車場3台完備。新規¥3,000〜と比較的入りやすく、30〜50代の「ゆっくり相談したい」ニーズに応える。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'beauty_salon', 'agu-navy-tsuruoka', 75, 'カット¥2,500〜・カット+カラー¥3,900〜と庄内エリアで最も入りやすい価格帯。年中無休夜21時まで営業・駐車場7〜8台で10〜40代まで幅広く対応。鶴岡在住者の定番サロンとして定着している。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'beauty_salon', 'earth-sakata', 68, '全国チェーンの安定した品質で、酒田市内で年中無休の選択肢として機能する。料金・詳細メニューは公式サイトまたはホットペッパービューティーで確認が必要だが、チェーンとしての信頼感が強み。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'yamagata-beauty-color', 'beauty', 'yamagata',
    '【カラー・髪質改善】山形おすすめ美容室ランキング', 'イルミナカラー・アディクシーカラー・酸熱トリートメント・TOKIOトリートメントを得意とするサロンを、公開情報をもとに評価した山形版ランキング。', 'イルミナ+TOKIOトリートメントの組み合わせが充実したREM山形2号店、イルミナカラーの品質で定評のあるHAIR DESIGN BUCOが山形市内のカラー重視層への最有力候補。',
    'カラー・髪質改善 早見表（山形）', ARRAY['カラー薬剤の種類と対応メニューの幅', '髪質改善メニューの有無（TOKIO・酸熱等）', '口コミ・予約サイトでの評価', 'アクセス・利便性', '価格帯の適正感']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"REM 山形2号店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000477049/","sourceType":"local-media","collectedAt":"2026-06-08","note":"得意施術・口コミ確認。"},{"title":"HAIR DESIGN BUCO 公式サイト","url":"https://hairdesign-buco.com/","sourceType":"official","collectedAt":"2026-06-08","note":"料金・施術内容確認。"},{"title":"Agu hair navy 鶴岡東原店 Agu公式サイト","url":"https://agu-hair.com/salon/2047/","sourceType":"official","collectedAt":"2026-06-08","note":"料金・メニュー確認。"}],"faqs":[{"question":"山形でTOKIOトリートメントを受けられるサロンはどこですか？","answer":"REM 山形2号店がTOKIOトリートメント・酸熱トリートメントに対応していることが確認されています。電話023-626-5133または予約サイトでご確認ください。"},{"question":"イルミナカラーと酸熱トリートメントは同日にできますか？","answer":"多くの場合で対応可能ですが施術時間が長くなります。予約時に希望メニューをお伝えください。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='beauty' AND slug='yamagata-beauty-color';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'beauty_salon', 'rem-yamagata-2', 93, 'イルミナカラー・アディクシーカラー・TOKIOトリートメント・酸熱トリートメントが揃い、カラーとケアの組み合わせメニューが最も充実している山形市内のサロン。ホットペッパービューティーでのランキング上位掲載が信頼感を裏付けている。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'beauty_salon', 'hair-design-buco', 86, 'イルミナカラーのドライカットとの組み合わせが特徴で、カット+イルミナカラー¥12,650〜と明確な料金設定がある。30〜50代の白髪も含めたカラー相談ができる点が評価される。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'beauty_salon', 'agu-navy-tsuruoka', 76, 'カット+カラー¥3,900〜と庄内エリアで最もコスパが高いカラーサロン。年中無休で夜21時まで営業と継続利用しやすい環境が整っている。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'beauty_salon', 'earth-tsuruoka', 70, '全国チェーンの安定したカラーメニューが強み。鶴岡市内で初めてカラーを試したい読者への安心候補として機能する。詳細料金は公式サイトで要確認。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'beauty_salon', 'earth-sakata', 65, '酒田市内でカラーとパーマを年中無休で対応するチェーンサロン。庄内エリアの酒田在住読者向けのカラー選択肢として紹介できる。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'yamagata-beauty-headspa', 'beauty', 'yamagata',
    '【ヘッドスパ・トリートメント】山形おすすめ美容室ランキング', 'ヘッドスパ・トリートメント・ケア系施術を得意とするサロンを公開情報をもとに評価した山形版ランキング。詳細は各サロンの最新情報をご確認ください。', '酸熱トリートメントとTOKIOが揃うREM山形2号店がトリートメント重視の山形市内最有力候補。ヘッドスパ専門性はBSRプレスで山形市内のサロンを調査してから選ぶことをすすめます。',
    'ヘッドスパ・トリートメント 早見表（山形）', ARRAY['トリートメント・ケアメニューの充実度', '口コミ・予約サイトでの評価', '駐車場・アクセスなどの利便性', '価格帯の適正感', '営業時間・定休日の利用しやすさ']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"REM 山形2号店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000477049/","sourceType":"local-media","collectedAt":"2026-06-08","note":"トリートメントメニュー確認。"},{"title":"BSRプレス 山形でヘッドスパするならここ","url":"https://www.bestsalonreport.jp/press/67294/","sourceType":"editorial","collectedAt":"2026-06-08","note":"山形ヘッドスパおすすめサロン取材記事として参考。"},{"title":"楽天ビューティ 山形市 口コミ","url":"https://beauty.rakuten.co.jp/addr06201/sort4/","sourceType":"local-media","collectedAt":"2026-06-08","note":"山形市口コミ高評価サロン確認。"}],"faqs":[{"question":"山形でヘッドスパを専門に扱うサロンはどこですか？","answer":"ヘッドスパ専門性についてはBSRプレスの取材記事（bestsalonreport.jp/press/67294/）が参考になります。また各サロンへの電話確認が最も確実です。"},{"question":"トリートメントはどのくらいの頻度で通うのが良いですか？","answer":"月1〜2回が一般的な目安です。髪の状態や施術の種類によって変わるため、サロンのスタイリストにご相談ください。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='beauty' AND slug='yamagata-beauty-headspa';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'beauty_salon', 'rem-yamagata-2', 88, 'TOKIOトリートメント・酸熱トリートメントが揃い、カラー後のケアとして活用できる。ホットペッパービューティーで山形市ランキング上位に掲載されており、トリートメント系の信頼性が高い。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'beauty_salon', 'hair-design-buco', 78, 'トリートメントメニューへの対応とイルミナカラーの組み合わせが30〜50代のケア重視層に向く。駐車場完備で通いやすい環境も評価ポイント。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'beauty_salon', 'baker-street-yamagata', 70, '完全予約制でカウンセリングを重視するため、頭皮や髪の状態に合わせた提案を受けやすい。七日町の駐車場完備サロンとして30〜50代のゆっくり相談したい層に向く。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'beauty_salon', 'agu-navy-tsuruoka', 62, '鶴岡エリアでトリートメントを含む基本ケアメニューに対応。コスパが良く年中無休で、庄内エリアでのトリートメント利用の入門として使いやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'beauty_salon', 'lafucona-tendo', 55, '天童市在住で近くのサロンを探している読者向け。詳細メニューは公式サイト（lafucona.com）または電話（023-674-9447）で要確認。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'protein-ranking-women', 'protein', NULL,
    '女性向けおすすめプロテイン ランキング', 'ダイエット・美容・健康維持を目的とする女性向けに、低カロリー・飲みやすさ・人工甘味料の有無・味のラインナップを軸に評価した実データランキング。', 'ダイエット重視・人工甘味料が気になる女性にはULTORA、飲みやすさ重視にはVALX、コスパ重視ならGronGが最有力候補。',
    '女性向けプロテイン 早見表', ARRAY['1食あたりのカロリー（低いほど高評価）', '脂質の少なさ', '人工甘味料不使用かどうか', 'フレーバーの豊富さと飲みやすさ', 'コスパ（1kg換算価格）']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"ULTORA ホエイダイエットプロテイン 公式","url":"https://ultora.co.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・人工甘味料不使用・フレーバーを確認。"},{"title":"VALX ホエイプロテイン 公式","url":"https://shop.valx.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・フレーバーを確認。"},{"title":"楽天総合ランキング プロテイン","url":"https://www.rakuten.co.jp/","sourceType":"local-media","collectedAt":"2026-06-08","note":"楽天での口コミ・ランキング実績を確認。"}],"faqs":[{"question":"女性はプロテインを飲みすぎると太りますか？","answer":"プロテイン自体は高タンパク・低脂質の食品ですが、摂りすぎると総カロリーオーバーになります。1日の食事でのタンパク質量に合わせて補う形で使えば太ることはありません。目安は1日1〜2食分（20〜40g程度）のプロテイン補給です。"},{"question":"生理中でもプロテインを飲んでいいですか？","answer":"はい。プロテインは食事の一部として問題ありません。ただし人によっては胃腸の調子が変わる時期なので、体調に合わせて量を調整してください。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='protein' AND slug='protein-ranking-women';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'protein', 'ultora-whey-diet', 95, '人工甘味料不使用・低脂質（1.5g/食）・10種類のフレーバー（抹茶ラテ・ほうじ茶ラテ・黒ゴマきな粉など和風フレーバー含む）と女性向けの条件を最もバランスよく満たす。楽天総合1位実績が口コミの信頼性を裏付けている。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'protein', 'valx-whey-wpc', 88, '1食116kcal・脂質1.7gと低カロリー設計で「アーモンドとうふ」など個性的フレーバーが女性に好評。山本義徳氏監修の信頼感と飲みやすさへのこだわりが他社との差別化ポイント。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'protein', 'grong-whey-standard', 82, '低糖質（2.5g/食）・国内製造・11種ビタミン配合と機能面が充実。1kg¥4,480と女性でも継続しやすい価格帯。ナチュラル（無味）でスムージーに混ぜる用途にも対応。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'protein', 'savas-whey-100', 76, 'ドラッグストアで買えるアクセスの良さと明治グループの安心感が女性初心者に支持される。ビタミンB群・C・D配合で美容サポートも期待できる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'protein', 'finelab-whey-wpi', 71, '脂質0.3g・炭水化物0.1gという極限の低脂質・低糖質はダイエット追い込み期に最適。乳糖が少ないためお腹が弱い女性にも向きやすい。ただし価格は高め。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'protein-ranking-men', 'protein', NULL,
    '男性向けおすすめプロテイン ランキング', '筋肥大・体力向上を目的とする男性向けに、1食あたりのタンパク質量・コスパ・品質・継続しやすさを軸に評価した実データランキング。', '品質最優先ならON Gold Standard、コスパ重視ならMyprotein（セール時）またはGronG、バランス重視ならVALXが最有力候補。',
    '男性向けプロテイン 早見表', ARRAY['1食あたりのタンパク質量（多いほど高評価）', 'コスパ（1kg換算価格）', '溶けやすさ・飲みやすさ', '大容量サイズの有無', '信頼性・実績']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"Optimum Nutrition Gold Standard 公式JP","url":"https://www.optimumnutrition.com/ja-jp/","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・価格を確認。"},{"title":"Myprotein JP 公式","url":"https://www.myprotein.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"セール価格・栄養成分を確認。"},{"title":"GronG 公式","url":"https://shop.grong.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・価格を確認。"}],"faqs":[{"question":"筋肉をつけるには1日何gのプロテインが必要ですか？","answer":"筋肥大を目的とする場合、体重1kgあたり1.6〜2.2gのタンパク質摂取が推奨されています（例: 体重70kgで112〜154g/日）。食事からのタンパク質に加えてプロテインで不足分を補う形が効率的です。"},{"question":"トレーニング後すぐに飲まないといけませんか？","answer":"「ゴールデンタイム（30分以内）」は以前ほど重視されなくなっています。1日を通じた総タンパク質量の方が重要です。ただしトレーニング後1〜2時間以内に摂取することが一般的な目安として推奨されています。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='protein' AND slug='protein-ranking-men';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'protein', 'on-gold-standard-whey', 93, '1食24g・脂質わずか1gとタンパク質効率が最高水準。WPI主体でBCAA 5.5g含有、世界的実績で信頼性も抜群。筋肥大を本気で取り組む男性への最有力推薦。コストコで2.88kgを¥12,280で入手すると1kg換算¥4,264になる。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'protein', 'myprotein-impact-whey', 89, 'セール時の1kg換算¥2,000台は業界最安クラス。1食21gのタンパク質とフレーバー50種以上で毎日継続できる。大量摂取が必要なバルクアップ期のコスト管理に最適。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'protein', 'grong-whey-standard', 83, '国内製造・1食22.3gのタンパク質・3kg購入で1kg換算¥3,993と国産ブランド中最高のコスパ。低糖質設計でバルクアップ・減量どちらの目的にも使いやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'protein', 'dns-whey-100', 78, '国内食品工場製造・合成着色料不使用・1食24.2gの高タンパクで品質重視の男性向け。「水だけで美味しく溶ける」設計がトレーニング後の利便性を高める。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'protein', 'kentai-powerbody-whey', 73, '2.3kgで¥7,400（1kg換算¥3,217）は国産ブランド最安クラス。ビタミン・ミネラル豊富でサプリを別途購入する必要がなく、長期コスト管理に優れる。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'protein-ranking-trainer', 'protein', NULL,
    'トレーナー・上級者向けおすすめプロテイン ランキング', '競技パフォーマンスと体組成管理を追求するトレーナー・アスリート向けに、WPI純度・BCAA含有量・脂質の少なさ・信頼性を軸に評価した実データランキング。', '純度・品質最優先ならON Gold StandardまたはファインラボWPI、大量消費のコスト管理ならMyprotein（大容量セール時）、国産重視ならDNSが最有力。',
    'トレーナー・上級者向けプロテイン 早見表', ARRAY['WPI純度・タンパク質含有率', '脂質・炭水化物の少なさ', 'BCAA含有量', '成分の透明性・信頼性', '大量摂取時のコスト管理']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"Optimum Nutrition Gold Standard 公式","url":"https://www.optimumnutrition.com/ja-jp/","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・BCAA含有量を確認。"},{"title":"ファイン・ラボ WPI 公式","url":"https://www.fine-lab.com/wpi-product-page","sourceType":"official","collectedAt":"2026-06-08","note":"CFM製法・栄養成分を確認。"}],"faqs":[{"question":"WPIとWPCはどちらが筋肉増量に効果的ですか？","answer":"筋肉増量効果においては吸収されるアミノ酸量が重要で、WPI・WPCとも必須アミノ酸を十分含んでいます。WPIは脂質・乳糖が少なく消化吸収が早いため、カロリー管理が厳しい減量期・コンテスト前に優位性があります。"},{"question":"コンテスト前の水分調整中でもプロテインは飲めますか？","answer":"水分調整については個人の方針・コーチの指示に従ってください。プロテインパウダー自体は水分含有量が少ないですが、溶かす水の量が増えるためその点を考慮する必要があります。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='protein' AND slug='protein-ranking-trainer';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'protein', 'on-gold-standard-whey', 96, 'WPI主体の高純度配合・BCAA 5.5g・グルタミン4g含有と競技・ボディメイクに必要な成分が揃う。世界累計売上No.1クラスの信頼性と豊富なエビデンスが上級者に選ばれ続ける理由。コストコ購入で1kg換算¥4,264と比較的入手しやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'protein', 'finelab-whey-wpi', 90, 'CFM製法WPIの脂質0.3g・炭水化物0.1g/食という数値はコンテスト前の体組成管理に最適。乳糖少なく消化吸収効率が高い。減量期の厳格な食事管理中にも使いやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'protein', 'myprotein-impact-whey', 84, '5kgサイズが選べるため大量消費する上級者のコスト管理に対応。セール時の1kg¥2,000台は毎日大量摂取しても費用を抑えられる。WPCのため純度よりボリューム重視のバルクアップ期に特に有効。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'protein', 'dns-whey-100', 78, '国内食品工場製造・合成着色料不使用の品質基準が競技者の信頼を得ている。1食24.2gの高タンパクと8種フレーバーで長期使用中も継続しやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'protein', 'kentai-powerbody-whey', 70, '2.3kgの大容量・1kg換算¥3,217でビタミン・ミネラルも豊富。体重管理よりも筋力増強を重視する競技者で、コスト効率を優先したい場合の選択肢。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'protein-ranking-student', 'protein', NULL,
    '大学生・コスパ重視のおすすめプロテイン ランキング', '毎月の費用を抑えながら毎日続けたい大学生向けに、1kg換算価格・購入しやすさ・継続しやすい味を軸に評価した実データランキング。', '最安値はKentai（2.3kgで¥3,217/kg）、セール活用ならMyprotein、手軽に買えるならGronGまたはSAVAS。',
    '大学生・コスパ重視 早見表', ARRAY['1kg換算価格（安いほど高評価）', '大容量サイズの有無', '購入しやすさ（ネット・コンビニ等）', '飲みやすさ・続けやすい味', 'タンパク質量のコスパ（1g単価）']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"Kentai パワーボディ 100%ホエイプロテイン 公式","url":"https://kentai.co.jp/product/protein/powerbody100whey.html","sourceType":"official","collectedAt":"2026-06-08","note":"2.3kg価格・栄養成分確認。"},{"title":"GronG 公式","url":"https://shop.grong.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"3kg価格確認。"},{"title":"Myprotein JP 公式","url":"https://www.myprotein.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"セール価格情報確認。"}],"faqs":[{"question":"月にどのくらいの費用がかかりますか？","answer":"1日1食（20〜30g）使用の場合、Kentai 2.3kgで約¥3,217/kgなら月約¥2,000〜¥3,000程度が目安です。週3〜5回のトレーニングに合わせて飲む場合はさらに費用を抑えられます。"},{"question":"Amazonと公式サイトどちらで買うのがお得ですか？","answer":"商品によって異なります。MyproteinはMyprotein公式サイトのセール時が最安になることが多く、GronGはAmazonが安定して購入できます。価格比較サイトで定期的に確認することをおすすめします。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='protein' AND slug='protein-ranking-student';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'protein', 'kentai-powerbody-whey', 91, '2.3kgで約¥7,400（1kg換算¥3,217）は国産ブランド中の最安クラス。ビタミン・ミネラル豊富でサプリを別途買う必要がなく、総合的な出費が抑えられる。毎日使うなら大容量一択。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'protein', 'grong-whey-standard', 87, '3kgで¥11,980（1kg換算¥3,993）と大容量コスパ優秀。国内製造でAmazon常連上位の信頼性。フレーバーは少ないがナチュラル（無味）をスムージーに混ぜる使い方も人気。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'protein', 'myprotein-impact-whey', 84, 'セール時の1kg換算¥2,000台は全ブランド中最安クラス。フレーバー50種類以上で飽きにくく、5kgまとめ買いで長期コストを最小化できる。セール情報を把握していることが前提。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'protein', 'savas-whey-100', 75, 'コンビニ・ドラッグストアで急に必要になったときでも入手できるアクセス性が最強。価格は割高だが「まず試す1kg目」として初心者・学生が手に取りやすい国産ブランド。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'protein', 'valx-whey-wpc', 69, '420gの小さいサイズが約¥2,500前後で「まず試してみたい」ニーズに応える。価格は高めだが飲みやすさ・美味しさで継続率が高く、最初の1本として失敗しにくい。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'protein-ranking-diet', 'protein', NULL,
    'ダイエット向けおすすめプロテイン ランキング', '脂質・糖質を抑えながら筋肉を維持・増加させたい方向けに、1食あたりのカロリー・脂質量・糖質量・満腹感を軸に評価した実データランキング。', '人工甘味料不使用で低脂質ならULTORA、極限の低脂質・低糖質ならファインラボWPI、バランス型コスパはGronGが最有力候補。',
    'ダイエット向けプロテイン 早見表', ARRAY['1食あたりのカロリー（低いほど高評価）', '脂質の少なさ（低いほど高評価）', '炭水化物・糖質の少なさ', '1食あたりのタンパク質量（多いほど高評価）', '飲みやすさ・置き換えとしての使いやすさ']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"ULTORA 公式","url":"https://ultora.co.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・人工甘味料不使用を確認。"},{"title":"ファイン・ラボ WPI 公式","url":"https://www.fine-lab.com/wpi-product-page","sourceType":"official","collectedAt":"2026-06-08","note":"脂質・炭水化物の極小値を確認。"}],"faqs":[{"question":"ダイエット中にプロテインを飲むと筋肉は落ちにくくなりますか？","answer":"はい。ダイエット中はカロリー不足になりがちで、筋肉がエネルギーとして分解されやすくなります。十分なタンパク質（体重×1.2〜1.6g/日）を摂ることで筋肉量を維持しながら脂肪を落としやすくなります。"},{"question":"置き換えダイエットとしてプロテインを使えますか？","answer":"食事の1食をプロテインに置き換えてカロリーを抑える方法は可能ですが、栄養バランスが偏るリスクがあります。完全置き換えより、食事の量を抑えながら食後や間食にプロテインでタンパク質を補う方が継続しやすく健康的です。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='protein' AND slug='protein-ranking-diet';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'protein', 'ultora-whey-diet', 94, '1食117kcal・脂質1.5g・タンパク質22.6gとダイエットの三条件を最高バランスで満たす。人工甘味料不使用・和風フレーバー豊富で継続しやすく、楽天1位実績も信頼感を裏付ける。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'protein', 'finelab-whey-wpi', 90, '1食76kcal・脂質0.3g・炭水化物0.1gという数値はダイエット用途で国内最高水準。カロリー収支の厳格な管理期・停滞突破期に特に有効。乳糖が少なくお腹が弱い方にも向きやすい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'protein', 'grong-whey-standard', 82, '1食118kcal・糖質2.5g・タンパク質22.3gと低糖質かつタンパク質量が多い。1kg¥4,480のコスパで継続しやすく、ダイエットの長期戦に向く。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'protein', 'valx-whey-wpc', 78, '1食116kcal・脂質1.7gとダイエット向けの低カロリー設計。美味しさ・飲みやすさが高くストレスなく続けられ、ダイエット中のモチベーション維持に貢献する。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'protein', 'on-gold-standard-whey', 73, '脂質わずか1g/食はダイエット中の脂質管理に優れる。1食119kcal・タンパク質24gと効率も高い。減量と筋肉維持を同時に追う身体づくり中間期に適した選択。', false);
END $$;
DO $$
DECLARE _rid bigint;
BEGIN
  INSERT INTO es.rankings (slug, content_type, region, title, description, conclusion, quick_table_label, criteria, last_updated_at, status, metadata)
  VALUES (
    'protein-ranking-beginner', 'protein', NULL,
    'プロテイン初心者向けおすすめランキング', 'プロテインを初めて飲む方向けに、入手しやすさ・飲みやすさ・わかりやすさ・サポートの充実度を軸に評価した実データランキング。', '「今すぐ試せる」ならSAVAS（ドラッグストア）、「ネット購入で安く始めたい」ならGronGまたはVALX、「飲みやすさ最優先」ならVALXが最有力候補。',
    '初心者向けプロテイン 早見表', ARRAY['購入のしやすさ（コンビニ・ドラッグストア・ネット）', '飲みやすさ・溶けやすさ', '日本語サポートの充実度', '失敗しにくい価格帯（まず試せる）', '添加物の少なさ・安心感']::text[],
    '2026-06-08', 'published',
    '{"sources":[{"title":"ザバス ホエイプロテイン100 明治公式","url":"https://www.meiji.co.jp/sports/savas/products/built_powered/whey100.html","sourceType":"official","collectedAt":"2026-06-08","note":"入手経路・栄養成分を確認。"},{"title":"VALX 公式","url":"https://shop.valx.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"420gサイズ・フレーバーを確認。"},{"title":"GronG 公式","url":"https://shop.grong.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"価格・入手方法を確認。"}],"faqs":[{"question":"プロテインはいつ飲めばいいですか？","answer":"最も一般的なのは「トレーニング後30分〜1時間以内」です。ただし1日の総タンパク質量の方が重要なので、トレーニングがない日でも起床後や間食のタイミングで飲む方法もあります。まずは1日1回、続けやすいタイミングから始めましょう。"},{"question":"水と牛乳どちらで溶かすのがいいですか？","answer":"水で溶かすと低カロリー・素早く飲める。牛乳で溶かすとタンパク質量・カルシウムが増えて風味がマイルドになります。ダイエット目的なら水、筋肉増量目的なら牛乳がおすすめです。まずは水で飲んで味を確認するのが一般的です。"}]}'::jsonb
  ) ON CONFLICT (content_type, slug) DO UPDATE SET
    title=EXCLUDED.title, description=EXCLUDED.description,
    conclusion=EXCLUDED.conclusion, criteria=EXCLUDED.criteria,
    metadata=EXCLUDED.metadata, updated_at=NOW()
  RETURNING id INTO _rid;

  IF _rid IS NULL THEN
    SELECT id INTO _rid FROM es.rankings WHERE content_type='protein' AND slug='protein-ranking-beginner';
  END IF;

  DELETE FROM es.ranking_items WHERE ranking_id=_rid;

  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 1, 'protein', 'savas-whey-100', 92, 'ドラッグストア・コンビニ・Amazonで即日入手可能な圧倒的アクセス性。明治グループの日本語サポートと国産の安心感が初心者の不安を払拭する。ビタミン配合で「プロテイン+サプリ」の一石二鳥も魅力。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 2, 'protein', 'valx-whey-wpc', 87, '飲みやすさ・美味しさへの高評価が初回の「プロテインは飲みにくい」先入観を覆す。420gの小さいサイズで¥2,500前後から試せ、失敗時のダメージが小さい。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 3, 'protein', 'grong-whey-standard', 83, 'Amazon常連上位のGronGは1kg¥4,480と手を出しやすい価格帯。レビュー数が多く「他の人がどう使っているか」を参照しながら選べる安心感がある。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 4, 'protein', 'myprotein-impact-whey', 77, '50種類以上のフレーバーが「自分の好きな味を見つけられる」メリットに。初めてでも好みのフレーバーで続けられる可能性が高い。セール時の価格は初心者でも始めやすいコスパ。', false);
  INSERT INTO es.ranking_items (ranking_id, rank, item_content_type, item_slug, score, reason, is_pr)
  VALUES (_rid, 5, 'protein', 'dns-whey-100', 70, 'スポーツ専門店での取り扱いが多く、店員に相談しながら選べる環境が整っている。「水だけで美味しく溶ける」設計が初心者の「上手く溶かせない」悩みを解消する。', false);
END $$;

-- Done
