-- ========== ARTICLES ==========
INSERT INTO es.articles (slug, category, region, title, description, body_md, tags, author_name, status, published_at, metadata) VALUES (
  'niigata-ramen-first-guide', 'ramen', 'niigata',
  '新潟ラーメンを初めて選ぶ人のための見方', '新潟5大ラーメン、エリア、ジャンル、駐車場、営業時間の見方を整理し、初めての新潟ラーメン巡りで失敗しにくい選び方をまとめます。', '## 結論

新潟ラーメンを初めて選ぶなら、まずジャンルを決めます。軽く食べたいなら新潟あっさり醤油、濃い味を体験したいなら新潟濃厚味噌、県央らしさを感じたいなら燕背脂を候補にすると比較しやすいです。

## 最初に見るべき3軸

- ジャンル: あっさり醤油、濃厚味噌、燕背脂、煮干し、肉そばなど
- エリア: 新潟駅前、古町、紫竹山、東区、西蒲区、燕市
- 利用条件: 駐車場、営業時間、売り切れ終了、定休日

## 代表店から選ぶ

あっさり醤油の入口なら三吉屋 西堀本店、濃厚味噌なら東横 紫竹山本店、燕背脂なら杭州飯店が分かりやすい候補です。総合的な満足度や現代的な人気店を見たい場合は、いっとうや 紫竹山本店や麺や真玄も比較対象になります。

## 営業時間の確認は必須

ラーメン店はスープ切れ、材料切れ、臨時休業、営業時間変更が起きやすいジャンルです。Each Spiritでは確認日と参照ソースを残しますが、訪問前には公式サイト、公式SNS、地図サービスを確認してください。

## このサイトでの評価方針

Each Spiritでは、味の好みだけでなく、ジャンルの分かりやすさ、情報の追跡しやすさ、駐車場や営業時間、観光導線への組み込みやすさを評価します。PR掲載は現時点では行わず、ランキング内にもPRフラグを表示します。
',
  ARRAY['新潟', 'ラーメン', '選び方', '初心者', '新潟5大ラーメン']::text[], 'Each Spirit 編集部', 'published', '2026-06-01',
  '{"summary":["新潟ラーメンは、新潟あっさり醤油、新潟濃厚味噌、燕背脂、長岡生姜醤油、三条カレーなど地域性で整理すると選びやすいです。","初回は三吉屋、東横、杭州飯店のように特徴が分かりやすい店を軸にすると比較しやすいです。","営業時間や定休日は変わるため、Each Spiritでは店舗ごとに参照ソースと確認日を残します。"],"what_you_learn":["新潟5大ラーメンの基本","エリア別・ジャンル別の選び方","店舗詳細で確認すべき営業時間・駐車場・公式情報"],"sources":[{"title":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/","sourceType":"official","collectedAt":"2026-06-07","note":"新潟市内の店舗情報とカテゴリ文脈の確認。"},{"title":"新潟市ラーメンガイドブック","url":"https://www.city.niigata.lg.jp/kanko/kanko/oshirase/ramen.files/guidebook.pdf","sourceType":"government","collectedAt":"2026-06-07","note":"新潟5大ラーメンと掲載店舗の確認。"},{"title":"燕背脂ラーメンMAP","url":"https://ra-men.tsubame-kankou.jp/","sourceType":"tourism","collectedAt":"2026-06-07","note":"燕背脂ラーメンの地域情報確認。"}],"faqs":[{"question":"新潟ラーメン初心者は何から選ぶべきですか？","answer":"まずは新潟5大ラーメンのうち、あっさり醤油、濃厚味噌、燕背脂のように特徴が分かりやすいジャンルから選ぶと比較しやすいです。"},{"question":"営業時間はこのサイトだけ見れば十分ですか？","answer":"営業時間は変更される可能性があります。Each Spiritでは確認元を掲載しますが、訪問前に公式サイトや店舗SNSも確認してください。"}],"related_slugs":["niigata-five-ramen-guide","niigata-ramen-car-access"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title=EXCLUDED.title, description=EXCLUDED.description, body_md=EXCLUDED.body_md,
  tags=EXCLUDED.tags, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.articles (slug, category, region, title, description, body_md, tags, author_name, status, published_at, metadata) VALUES (
  'niigata-five-ramen-guide', 'ramen', 'niigata',
  '新潟5大ラーメンとは？代表ジャンルと選び方', '新潟あっさり醤油、新潟濃厚味噌、燕背脂、長岡生姜醤油、三条カレーラーメンの違いと、Each Spiritでの店舗選定方針を整理します。', '## 結論

新潟5大ラーメンは、味の濃淡だけでなく、地域の成り立ちや食べるシーンが違います。旅行者は「どこへ行くか」と「どの濃さを食べたいか」で選ぶと迷いにくくなります。

## 新潟あっさり醤油

細麺と淡麗スープを軸にした昔ながらの中華そばです。古町周辺の三吉屋 西堀本店は、初めての読者にも説明しやすい代表候補です。

## 新潟濃厚味噌

濃い味噌スープ、太麺、割りスープなどの体験が特徴です。東横 紫竹山本店やこまどりは、濃厚味噌を比較する時に候補へ入れたい店舗です。

## 燕背脂ラーメン

燕三条エリアの地域性を持つ、煮干し醤油、背脂、極太麺、玉ねぎの組み合わせです。杭州飯店は燕背脂ラーメンMAPでも店舗情報を確認できます。

## 長岡生姜醤油と三条カレー

初期MVPでは店舗詳細をまだ追加していません。今後、長岡市と三条市の公式・観光情報を確認し、記事と店舗詳細を追加していきます。

## Each Spiritでの掲載基準

代表性だけでなく、営業時間、定休日、駐車場、公式URL、参照ソースを追えるかを重視します。情報が不安定な店舗は、掲載しても「要確認」と明記します。
',
  ARRAY['新潟5大ラーメン', '濃厚味噌', '燕背脂', 'あっさり醤油', '地域グルメ']::text[], 'Each Spirit 編集部', 'published', '2026-06-07',
  '{"summary":["新潟5大ラーメンは味の濃淡、麺、地域背景が異なるため、旅行計画ではジャンルから選ぶと失敗しにくいです。","新潟市内なら三吉屋、東横、こまどり、新潟市外なら杭州飯店のように代表性が分かりやすい店を起点にできます。","Each Spiritでは店舗ごとの公式・観光・地域メディア情報をSourceとして残します。"],"what_you_learn":["新潟5大ラーメンの違い","代表店の選び方","県内ページを拡張する時の情報整理方針"],"sources":[{"title":"新潟市ラーメンガイドブック","url":"https://www.city.niigata.lg.jp/kanko/kanko/oshirase/ramen.files/guidebook.pdf","sourceType":"government","collectedAt":"2026-06-07","note":"新潟5大ラーメンの分類と掲載店舗確認。"},{"title":"燕背脂ラーメンMAP","url":"https://ra-men.tsubame-kankou.jp/","sourceType":"tourism","collectedAt":"2026-06-07","note":"燕背脂ラーメンの地域文脈確認。"},{"title":"東横 公式サイト","url":"https://www.touyoko.jp/stores","sourceType":"official","collectedAt":"2026-06-07","note":"新潟濃厚味噌の代表店として確認。"}],"faqs":[{"question":"新潟5大ラーメンは全部同じ市内で食べられますか？","answer":"一部は新潟市内で食べやすい一方、燕背脂は燕市、長岡生姜醤油は長岡市など地域性があります。旅程に合わせて選ぶのがおすすめです。"},{"question":"代表店だけを掲載する方針ですか？","answer":"初期は代表性と情報の追跡しやすさを重視し、今後はエリア別、ジャンル別、営業時間別に広げます。"}],"related_slugs":["niigata-ramen-first-guide"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title=EXCLUDED.title, description=EXCLUDED.description, body_md=EXCLUDED.body_md,
  tags=EXCLUDED.tags, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.articles (slug, category, region, title, description, body_md, tags, author_name, status, published_at, metadata) VALUES (
  'niigata-ramen-car-access', 'ramen', 'niigata',
  '車で行きやすい新潟ラーメン店の選び方', '駐車場あり、郊外型、営業時間の追跡しやすさを軸に、車移動で新潟ラーメンを選ぶ時のポイントをまとめます。', '## 結論

新潟で車移動のラーメン店を選ぶなら、駐車場の有無だけでなく、台数、ピーク時間、営業時間、売り切れ終了の有無まで確認するのが現実的です。

## 駐車場情報を見る理由

新潟県内のラーメン巡りは車移動が多くなります。駐車場ありの店舗でも昼ピークは満車になることがあります。遠方から訪問する場合は、開店直後やピークを外した時間を検討してください。

## 車移動で候補にしやすい店舗

いっとうや 紫竹山本店、麺や真玄、麺や来味は新潟市ラーメンガイドで駐車場台数が確認できます。杭州飯店も燕背脂ラーメンMAPで駐車場有と掲載されています。

## 中心部店舗の注意点

古町や駅前の店舗は専用駐車場がない場合があります。三吉屋 西堀本店のような中心部の老舗は、周辺コインパーキングや公共交通との組み合わせを考えると使いやすくなります。

## 更新方針

駐車場、営業時間、定休日は変わる可能性があります。Each Spiritでは店舗ごとに確認日とSourceを残し、再確認しやすい構成にしています。
',
  ARRAY['駐車場あり', '車移動', '新潟市', '燕市', '営業時間']::text[], 'Each Spirit 編集部', 'published', '2026-06-07',
  '{"summary":["車移動なら、駐車場の有無だけでなく台数、ピーク時間、郊外導線を確認すると選びやすいです。","いっとうや、麺や真玄、麺や来味、杭州飯店は駐車場情報を追跡しやすい候補です。","人気店は駐車場ありでも満車になるため、開店直後やピークを外した訪問が現実的です。"],"what_you_learn":["車移動向けの店舗選定軸","駐車場情報の読み方","県内ラーメン巡りの注意点"],"sources":[{"title":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/","sourceType":"official","collectedAt":"2026-06-07","note":"駐車場掲載のある新潟市内店舗確認。"},{"title":"燕背脂ラーメンMAP 杭州飯店","url":"https://ra-men.tsubame-kankou.jp/stores/entry-27.html","sourceType":"tourism","collectedAt":"2026-06-07","note":"杭州飯店の駐車場有と営業時間確認。"}],"faqs":[{"question":"駐車場ありならいつでも停められますか？","answer":"人気店は駐車場ありでも満車になることがあります。開店直後、昼ピーク後、夜営業開始直後などを検討してください。"},{"question":"車移動で避けたい条件はありますか？","answer":"営業時間が短い店、売り切れ終了がある店、専用駐車場がない中心部店舗は事前確認が重要です。"}],"related_slugs":["niigata-ramen-first-guide"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title=EXCLUDED.title, description=EXCLUDED.description, body_md=EXCLUDED.body_md,
  tags=EXCLUDED.tags, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.articles (slug, category, region, title, description, body_md, tags, author_name, status, published_at, metadata) VALUES (
  'yamagata-ramen-first-guide', 'ramen', 'yamagata',
  '山形ラーメンを初めて選ぶ人のための見方', 'ラーメン消費量日本一の背景、からみそ・冷やしラーメン・酒田ラーメンのエリア別スタイル、各エリアの代表店を整理します。', '## 結論

山形ラーメンを初めて選ぶなら、まずエリアとジャンルの組み合わせで絞ります。南陽のからみそなら龍上海、山形市の冷やしラーメン発祥なら栄屋本店、酒田ラーメンなら満月、冬の鶴岡なら琴平荘を起点にすると、山形の地域的な多様性が分かります。

## 山形ラーメンを知るための3つの軸

- **エリア**: 南陽（赤湯）、山形市、酒田、鶴岡の4エリアでスタイルが異なる
- **ジャンル**: からみそ、冷やしラーメン、酒田ラーメン（魚介・ワンタン）、手揉み麺系
- **訪問条件**: 営業時期（冬季限定店あり）、営業時間帯、駐車場の有無

## 消費量日本一の背景

総務省の家計調査では山形市が中華そばの外食消費額で全国1位を複数年にわたり記録しています。人口10万人あたりのラーメン店数も全国トップクラスで、「日常食としてのラーメン」が地域に深く根付いています。

## エリア別スタイルの特徴

**南陽市（赤湯）**  
龍上海が1958年に生み出したからみそラーメンが有名です。スープの中央に置かれた辛みそを少しずつ溶かしながら味の変化を楽しむスタイルで、県内外から観光客が訪れます。

**山形市**  
1932年創業の栄屋本店が1952年に考案した冷やしラーメンの発祥地として知られます。夏期は冷しらーめんが看板メニューで、山形市内を観光する際の定番スポットです。

**酒田市**  
魚介（煮干し・昆布・トビウオなど）をベースにした透明な醤油スープと極薄ワンタン、高い自家製麺率が特徴の酒田ラーメンが有名です。2023年の「日本ご当地ラーメン総選挙」で1位を獲得するなど、全国的な評価も高まっています。

**鶴岡市**  
100軒以上のラーメン店が集まるラーメンの街として知られます。琴平荘のように冬季限定で営業する名店も多く、季節と訪問計画の組み合わせが重要です。

## 訪問前に確認すること

山形のラーメン店はスープ切れ終了、季節限定営業（琴平荘は10〜5月のみ）、夏期・冬期で異なる営業時間（栄屋本店など）があります。Each Spiritでは確認日と参照ソースを掲載しますが、訪問前には公式サイトや公式SNSで最新情報を確認してください。

## このサイトでの評価方針

Each Spiritでは、味の好みだけでなく、地域ジャンルの代表性・情報の追跡しやすさ・駐車場や営業時間の明確さ・観光導線への組み込みやすさを評価します。PR掲載は現時点では行わず、ランキング内にもPRフラグを表示します。
',
  ARRAY['山形', 'ラーメン', '選び方', 'からみそ', '酒田ラーメン', '冷やしラーメン', 'エリア別']::text[], 'Each Spirit 編集部', 'published', '2026-06-08',
  '{"summary":["山形ラーメンは南陽のからみそ、山形市の冷やしラーメン、酒田の魚介ワンタン、鶴岡の手揉み麺とエリアごとにジャンルが異なります。","消費量日本一の背景には、日常食としてのラーメン文化が地域に深く根付いていることがあります。","琴平荘のような冬季限定店もあるため、営業時期の確認が訪問計画では重要です。"],"what_you_learn":["山形4エリア（南陽・山形市・酒田・鶴岡）のラーメンスタイルの違い","からみそ・冷やしラーメン発祥・酒田ラーメンの背景","訪問前に確認すべき営業時期・時間・駐車場"],"sources":[{"title":"山形市公式 ラーメン消費額日本一","url":"https://www.city.yamagata-yamagata.lg.jp/jigyosya/miryoku/brand/1017939.html","sourceType":"government","collectedAt":"2026-06-08","note":"山形市のラーメン消費額日本一の確認。"},{"title":"龍上海 公式サイト","url":"https://ryushanhai.com/group/","sourceType":"official","collectedAt":"2026-06-08","note":"からみそラーメン発祥・龍上海の店舗情報確認。"},{"title":"VISIT YAMAGATA 栄屋本店","url":"https://www.visityamagata.jp/spot-yamagata-sakaeyahonten/","sourceType":"tourism","collectedAt":"2026-06-08","note":"冷やしラーメン発祥・栄屋本店の情報確認。"},{"title":"酒田ラーメン完全ガイド マルメン製麺所","url":"https://shop.onlyone-marumen.com/%E9%85%92%E7%94%B0%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%E5%AE%8C%E5%85%A8%E3%82%AC%E3%82%A4%E3%83%89/","sourceType":"editorial","collectedAt":"2026-06-08","note":"酒田ラーメンの特徴・自家製麺率・地域背景確認。"}],"faqs":[{"question":"山形ラーメン初心者は何から選ぶべきですか？","answer":"からみそ（龍上海）・冷やしラーメン（栄屋本店・夏期）・酒田ラーメン（満月）のように、エリアとジャンルをセットで選ぶと選択しやすいです。"},{"question":"冬季限定の店があると聞きましたが？","answer":"鶴岡市の琴平荘は10〜5月の冬季のみ営業しています。夏に訪問する場合は他のエリアを中心に計画してください。"}],"related_slugs":["niigata-ramen-first-guide"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title=EXCLUDED.title, description=EXCLUDED.description, body_md=EXCLUDED.body_md,
  tags=EXCLUDED.tags, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.articles (slug, category, region, title, description, body_md, tags, author_name, status, published_at, metadata) VALUES (
  'niigata-beauty-salon-guide', 'beauty', 'niigata',
  '新潟の美容室を年代・施術・エリアで選ぶガイド', '新潟市内・長岡市の美容室を年代別ニーズ、施術内容、エリアの3軸で整理。初めて行く美容室をどう選ぶか、カウンセリング前に準備すべきことを具体的にまとめます。', '# 新潟の美容室を年代・施術・エリアで選ぶガイド

新潟市内や長岡市で美容室を選ぶとき、どこから絞ればよいか迷うことは多いはずです。ホットペッパービューティーや楽天ビューティを開いても選択肢が多すぎて判断しにくい。このガイドでは「年代」「施術の種類」「エリア」の3軸で整理し、自分に合った候補を絞るための考え方をまとめます。

---

## 年代別の選び方ポイント

### 10代・20代前半｜トレンドカラーと価格帯を優先

この年代は施術の種類よりも「流行のスタイルを低価格で」というニーズが強い傾向があります。インナーカラーやハイライト、アディクシーカラーによる透明感スタイルの需要が高く、SNSで共有しやすい仕上がりが評価されます。

**選ぶ際のポイント:**
- ホットペッパービューティーのクーポンで初回費用を抑えやすいサロンを活用する
- インナーカラー・ハイライトの施術実績がInstagramで確認できるサロンを選ぶ
- 駅近・バス停近くのアクセス良好なサロンが通いやすい

### 20代後半〜30代｜カラー品質と髪質改善の両立

働き始めた後は「傷みが少なく発色が良いカラー」と「継続できる価格帯」がバランスよく求められます。イルミナカラーやTOKIOインカラミ髪質改善との組み合わせメニューが人気のサロンが向きやすい。

**選ぶ際のポイント:**
- イルミナカラー・オーガニックカラーなど低ダメージ薬剤の取り扱いを確認する
- カラー+トリートメントのセットメニューのコスパを比較する
- 1〜2時間で施術が完了するサロンが仕事の合間に通いやすい

### 30代後半〜40代｜カット技術と白髪ケアの対応力

ライフスタイルの変化（産後・職場ルール・白髪の増加）に対応した提案力がサロン選びで最も差が出る年代です。

**選ぶ際のポイント:**
- 白髪染めからグレイカラー（白髪を活かすカラー）への移行提案ができるか確認する
- 骨格診断に基づいたカット提案をするサロンを重視する
- 完全予約制のプライベートサロンはゆっくり相談しやすい

### 50代以上｜頭皮ケアと扱いやすさの優先

施術より「日々のスタイリングが楽なヘアスタイル」と「頭皮環境のケア」を重視する傾向があります。ヘッドスパや育毛ケアに特化したサロンが向いています。

**選ぶ際のポイント:**
- 頭皮診断サービスのあるサロンを選ぶ
- 自宅でのケア方法まで教えてくれるスタイリストがいると長期的なコストが下がる

---

## 施術内容から候補を絞る

### カラー（全体染め・白髪染め）

まず「ブリーチなし」か「ブリーチあり」かを決めておくと候補が絞りやすくなります。ブリーチなしなら全体的にダメージを抑えられ、維持コストも下がります。

| 施術タイプ | 向いている人 | 費用目安 |
|------------|-------------|---------|
| 全体ブリーチなしカラー | 自然な色味・ダメージ抑えたい | ¥6,000〜¥10,000 |
| ハイライト（部分ブリーチ） | 立体感・透明感を出したい | ¥10,000〜¥18,000 |
| バレイヤージュ | 伸びても自然・維持しやすい | ¥14,000〜¥25,000 |
| グレイカラー | 白髪を自然に活かしたい | ¥8,000〜¥15,000 |

### ヘッドスパ・トリートメント

ヘッドスパは頭皮ケア目的、トリートメントは毛髪の質感改善が主な目的です。両方を組み合わせたコースを提供するサロンが増えています。月1回程度の定期ケアとして組み込むのが効果的です。

### パーマ・縮毛矯正

パーマはゆるふわウェーブ〜しっかりカールまで幅広く、縮毛矯正はクセを伸ばしてストレートにする施術です。どちらも技術差が大きいため、口コミ・施術実績を特に確認してから選ぶことをすすめます。

---

## エリアで絞るポイント

### 新潟市中央区（万代・新潟駅周辺）

新潟最多の美容室が集まるエリア。駅近でアクセスが良く、昼休みや仕事帰りの施術に向いています。万代エリアはカラー・髪質改善に強いサロンが充実。

### 新潟市西区・東区

生活圏に近い地域密着型のサロンが多く、駐車場完備の店舗も多い。ファミリー向けや子連れ対応サロンも見つけやすいエリアです。

### 長岡市

新潟市ほど数は多くないですが、技術水準の高いサロンも存在します。新潟市まで行けない長岡在住読者への選択肢として押さえておきたいエリアです。

---

## カウンセリング前に準備すること

1. **希望のスタイル写真を3〜5枚用意する** — スタイリストとのイメージ共有がスムーズになる
2. **やりたくないことを明確にする** — 「短くしすぎない」「赤みは出したくない」など
3. **職場や生活のルールを伝える** — 「派手すぎない」「パーマは難しい環境」など
4. **現在の施術履歴を整理する** — 直近のカラー・パーマの種類と時期

---

## 情報の確認について

Each Spiritの美容室カードでは参照ソースと確認日を掲載しています。ただし営業時間・価格・メニュー内容は変更される場合があります。訪問前に各サロンの公式サイトまたはホットペッパービューティーで最新情報を確認してください。
',
  ARRAY['新潟', '美容室', '選び方', '年代別', 'カラー', 'ヘッドスパ']::text[], 'Each Spirit 編集部', 'published', '2026-06-07',
  '{"summary":["年代ごとに「トレンドカラー重視」「白髪ケア重視」「子連れ対応」など優先ポイントが異なるため、まず自分の主要ニーズを絞ることが失敗を減らす。","施術の種類（カラー・ヘッドスパ・パーマ等）ごとに得意なサロンが異なるため、施術内容で絞ってからエリアで絞る順序が効率的。","Each Spiritの美容室カードには参照ソースと確認日を掲載するが、営業時間・価格は変更されるため訪問前に公式情報を確認してください。"],"what_you_learn":["年代別の美容室選びのポイント","施術内容で候補を絞る方法","カウンセリング前の準備と確認事項"],"sources":[{"title":"ホットペッパービューティー 新潟","url":"https://beauty.hotpepper.jp/svcSH/macHA/salon/","sourceType":"local-media","collectedAt":"2026-06-07","note":"新潟市内の各施術カテゴリの人気サロン傾向を確認。"},{"title":"楽天ビューティ 新潟市 口コミ","url":"https://beauty.rakuten.co.jp/addr15101/sort4/","sourceType":"local-media","collectedAt":"2026-06-07","note":"口コミ数・評価の高いサロン傾向を確認。"},{"title":"Beauty Park 新潟 2026年最新","url":"https://www.beauty-park.jp/niigata/niigata/","sourceType":"editorial","collectedAt":"2026-06-07","note":"2026年版 新潟人気ヘアサロン動向を確認。"}],"faqs":[{"question":"初めての美容室で何を伝えればいいですか？","answer":"希望のスタイル・長さ・カラーのイメージ写真を準備しておくと伝わりやすいです。また「やりたくないこと」「普段のセット習慣」「ライフスタイル（職場ルール等）」も伝えると、現実に合った提案が受けられます。"},{"question":"施術前のカウンセリングはどのくらい時間をかけますか？","answer":"初回は5〜15分程度が一般的です。プライベートサロンでは30分近くかける場合もあります。じっくり相談したい場合は予約時にその旨を伝えると時間を確保してもらいやすいです。"}],"related_slugs":["niigata-hair-color-guide"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title=EXCLUDED.title, description=EXCLUDED.description, body_md=EXCLUDED.body_md,
  tags=EXCLUDED.tags, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.articles (slug, category, region, title, description, body_md, tags, author_name, status, published_at, metadata) VALUES (
  'niigata-hair-color-guide', 'beauty', 'niigata',
  '新潟でヘアカラーを選ぶ前に知りたいこと', 'イルミナカラー・アディクシーカラー・バレイヤージュ・髪質改善の違いと費用感を整理。「どのカラーが自分に合うか」を判断するための基礎知識をまとめます。', '# 新潟でヘアカラーを選ぶ前に知りたいこと

カラーは美容室メニューの中でも選択肢が多く、「何が自分に合うか」を判断するのが難しい施術です。薬剤の種類・ブリーチの有無・髪質改善との組み合わせ——選択肢が増えるほど迷います。このガイドでは主要なカラーメニューの特徴と費用の目安を整理します。

---

## 主要カラー薬剤の種類と特徴

### イルミナカラー（WELLA）

ダメージを抑えながらツヤと透明感を出すことに特化した薬剤。日本人に多い「赤みが出やすい髪質」を補正しやすく、外国人風の柔らかい発色に仕上げやすいのが特徴。色落ちが比較的きれいなのも評価される。

**向いている人:** 初めてトレンドカラーに挑戦する人、髪へのダメージを抑えたい人、ツヤ感を重視する人

### アディクシーカラー（SHISEIDO）

「赤みゼロ」を最大の特徴とする薬剤。深みのある透明感が出やすく、クールなグレー系・アッシュ系に仕上げやすい。日本人の黒髪の赤みを抑えてしっかり色を入れたい場合に向く。

**向いている人:** グレー・アッシュ・マットな透明感を求める人、赤みが出やすい髪質の人

### カラーバター・ヘアマニキュア

ダメージがほぼゼロで鮮やかな発色を楽しめる半永久染料。ただし黒髪や暗い髪には色が入りにくく、数週間で色落ちするため維持コストがかかる。ブリーチ後の上乗せカラーとして使うケースが多い。

---

## ブリーチカラーの種類と選び方

### ハイライト

全体ではなく細かい束に部分ブリーチを入れる技法。立体感と透明感が出やすく、全体ブリーチより髪のダメージを抑えられる。伸びてきてもスジが自然になじむため、メンテナンスが楽。

### バレイヤージュ

根元から毛先へグラデーション状に明るくなるデザイン。伸びても根元が目立ちにくく、リタッチのサイクルを長くできる。ロング〜ミディアムで特に映える。

### インナーカラー

耳周りや内側に部分的に明るい色を入れる技法。表面からは見えにくいため職場ルールが厳しい人にも取り入れやすい。

### ケアブリーチ

通常のブリーチに比べてダメージを低減する成分を配合したブリーチ剤（レゾ等）。明るさは出しつつ、切れ毛・パサつきを抑える効果がある。取り扱いサロンが限られるため、事前に確認が必要。

---

## 髪質改善との組み合わせ

### TOKIO インカラミトリートメント

カラーやパーマのダメージを修復しながら結合を強化する人気のトリートメント。カラーと同日施術が多い。手触りの改善が施術直後から実感しやすいため、カラー後のケアとして定番化している。

### オージュア（Aujua）

頭皮と毛髪の両方に対応したトリートメントライン。サロン診断に基づいて処方が変わるパーソナライズ型。特にヘッドスパとの組み合わせで効果が出やすい。

### 組み合わせ費用の目安

| 施術内容 | 費用目安 |
|---------|---------|
| カットのみ | ¥4,000〜¥6,000 |
| カット + 全体カラー | ¥9,000〜¥15,000 |
| カット + ハイライト | ¥14,000〜¥22,000 |
| カット + バレイヤージュ | ¥18,000〜¥28,000 |
| カット + カラー + トリートメント | ¥13,000〜¥20,000 |

※新潟市内の相場目安です。サロン・施術量により変わります。

---

## カラーの「持ち」を良くするポイント

1. **シャンプーをカラー用に変える** — 色落ちを抑える成分が入っているカラーケアシャンプーが有効
2. **洗髪後は素早く乾かす** — 濡れた状態が長いほど色落ちが加速する
3. **紫外線対策をする** — 外出時にヘアUVスプレーや帽子を活用する
4. **湯船につかる際は髪を束ねる** — 高温のお湯が色落ちを早める

---

## サロンでカラーを相談する前の確認事項

- **直近のカラーの種類と施術日** — ブリーチ済みか、前回の薬剤は何かによって選択肢が変わる
- **希望の明るさ（レベル）** — スタイリストが数字で聞くことがある。1〜10のスケールでイメージを伝える
- **ダメージへの許容度** — 「できる限り傷みを抑えたい」か「多少傷んでも理想の色にしたい」か
- **維持費用のイメージ** — 頻繁に通えるかどうかでメニューの選択肢が変わる

---

## Each Spiritの美容室カードとの連携

各サロンカードにはカラーが得意な施術タイプと費用目安を掲載しています。このガイドで自分の希望を整理したあと、ランキングページからサロンカードを確認し、参照ソースと確認日を見た上で訪問前に最新情報をご確認ください。
',
  ARRAY['カラー', 'イルミナカラー', 'バレイヤージュ', '髪質改善', '新潟', 'ヘアカラー']::text[], 'Each Spirit 編集部', 'published', '2026-06-07',
  '{"summary":["イルミナカラーはツヤと透明感、アディクシーカラーは赤みゼロの透明感に強い。用途の違いを把握してサロン選びの参考にできる。","バレイヤージュ・ハイライトはブリーチを使うため費用とダメージが増えるが、ケアブリーチで軽減できるサロンがある。","髪質改善トリートメント（TOKIO・オージュア等）との組み合わせで、カラーダメージを補いながら質感を整えることが今のトレンド。"],"what_you_learn":["主要カラー薬剤の特徴と向き不向き","ブリーチ系カラーのリスクと対策","カラーとトリートメントの費用目安"],"sources":[{"title":"ホットペッパービューティー 新潟 カラー人気","url":"https://beauty.hotpepper.jp/genre/gkw008/pre15/city15100001/","sourceType":"local-media","collectedAt":"2026-06-07","note":"新潟市カラー人気サロンとメニュー傾向を確認。"},{"title":"Beauty Park 新潟 カラー特集","url":"https://www.beauty-park.jp/niigata/niigata/color/","sourceType":"editorial","collectedAt":"2026-06-07","note":"カラー施術人気サロンのメニュー情報を参考。"},{"title":"ヘアログ 新潟 人気美容室","url":"https://hairlog.jp/niigata/","sourceType":"local-media","collectedAt":"2026-06-07","note":"新潟の人気スタイルとカラートレンドを確認。"}],"faqs":[{"question":"カラーは何ヶ月に1回がベストですか？","answer":"全体カラーは2〜3ヶ月に1回が一般的な目安です。ただしデザインカラー（バレイヤージュ等）は伸びても自然に見えるため間隔を長くできる場合があります。根元が気になるリタッチだけなら1〜2ヶ月が多いです。"},{"question":"ダメージが心配な場合はどう伝えればいいですか？","answer":"「できるだけ傷みを抑えながら色を入れたい」と明確に伝えるのが一番です。ケアブリーチや低ダメージ薬剤を使っている旨をカウンセリングで確認してから施術を決めるのがおすすめです。"}],"related_slugs":["niigata-beauty-salon-guide"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title=EXCLUDED.title, description=EXCLUDED.description, body_md=EXCLUDED.body_md,
  tags=EXCLUDED.tags, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.articles (slug, category, region, title, description, body_md, tags, author_name, status, published_at, metadata) VALUES (
  'yamagata-beauty-salon-guide', 'beauty', 'yamagata',
  '山形の美容室を年代・施術・エリアで選ぶガイド', '山形市・鶴岡市・酒田市・天童市の美容室を年代別ニーズ、施術内容、エリアの3軸で整理。山形特有の移動事情と庄内・内陸の地域差も踏まえた選び方をまとめます。', '# 山形の美容室を年代・施術・エリアで選ぶガイド

山形県で美容室を選ぶとき、「山形市か庄内か」「車で行けるか」「年代に合う雰囲気か」といった条件が選び方に大きく影響します。新潟など他県と比べてサロン数はコンパクトですが、エリアごとに特色のある良質なサロンが存在します。このガイドでは3つの軸で整理します。

---

## 山形エリアの基本的な理解

山形県は「内陸エリア（山形市・天童市・米沢市など）」と「庄内エリア（鶴岡市・酒田市）」で生活圏が異なります。移動には車が必須な地域が多く、サロン選びでは**駐車場の有無が重要条件**になります。

| エリア | 特徴 | 主な都市 |
|--------|------|---------|
| 山形市周辺 | サロン数が多く比較しやすい | 山形市・天童市 |
| 庄内エリア | 地域密着型・長期関係重視 | 鶴岡市・酒田市 |

---

## 年代別の選び方ポイント

### 10代・20代｜トレンドカラーとアクセス重視

山形駅前・七日町エリアのサロンが中心。インナーカラー・ハイライト・アディクシーカラーへの対応力と価格帯のバランスを確認します。

**選ぶポイント:**
- 山形駅から徒歩圏内または七日町エリアが使いやすい
- デザインカラーの施術実績をInstagramで確認できるサロンを選ぶ
- 初回クーポン活用で費用を抑える

### 20代後半〜30代｜カラー品質と髪質改善

働き始めて「カラーの持ちが良いか」「傷みを抑えられるか」が優先事項になる年代。TOKIOインカラミや酸性トリートメントの取り扱い有無を確認します。

**選ぶポイント:**
- 「酸性トリートメント」「TOKIO」「ULTOWA」などのメニュー名を事前に確認
- カラー+トリートメントのセットコースのコスパを比較
- 予約の取りやすさと施術時間のバランス

### 30代後半〜40代｜白髪ケアと提案力

白髪の増加・ライフスタイルの変化（産後・職場ルール）に合わせた提案力が差になる年代。

**選ぶポイント:**
- 白髪染めとグレイカラーの両方を提案できるサロンを選ぶ
- カウンセリングに時間をかける完全予約制サロンが向きやすい
- 庄内エリアでは特に信頼関係を長く築けるサロンを重視する

### 50代以上｜頭皮ケアと扱いやすさ

ヘッドスパ・育毛ケアへの対応力と、毎日のスタイリングが楽なカットの提案力が選ぶ基準になります。

---

## 施術で絞る

### カラー系

山形ではアディクシーカラーの普及率が高く、赤みを抑えた透明感スタイルが人気。オーガニックカラー（ヘナ等）は酒田エリアのnaturelが得意とする特化サロンがあります。

### ヘッドスパ・トリートメント

山形市内ではLUNAが酸性系トリートメント×ヘッドスパに特化。庄内エリアではcerise（鶴岡）がカットとの組み合わせコースで対応します。

### 縮毛矯正・パーマ

長岡などと同様、技術差が出やすい施術です。Instagram等で施術実績を確認してから選ぶことを特に推奨します。

---

## 山形特有の条件：気候と移動

### 冬の雪と乾燥への対応

山形の冬は降雪と乾燥が重なり、髪へのダメージが蓄積しやすい環境です。**保湿力の高いトリートメント**や**洗い流さないオイルの処方**まで提案してくれるサロンが長期的に向いています。

### 車移動が基本

山形市中心部（駅前・七日町）以外は車移動が標準です。郊外型サロンは駐車場完備が多く、天童市のmapleや酒田市のnaturelは広い駐車場が強みになっています。

---

## カウンセリング前の準備

1. **希望の写真を3〜5枚用意する** — 言葉より写真の方が正確にイメージが伝わる
2. **やりたくないことを明確にする** — 「赤みは出したくない」「短くしすぎない」など
3. **山形の生活環境を伝える** — 「冬は帽子をよくかぶる」「雪の影響で乾燥しやすい」など
4. **前回の施術履歴を整理する** — カラー・パーマの種類と時期

---

## 情報確認について

Each Spiritの山形美容室カードには参照ソースと確認日を掲載しています。営業時間・料金は変更される場合があります。訪問前に各サロンの公式サイトまたはホットペッパービューティーで最新情報を確認してください。
',
  ARRAY['山形', '美容室', '選び方', '年代別', '庄内', '山形市']::text[], 'Each Spirit 編集部', 'published', '2026-06-07',
  '{"summary":["山形市（内陸）と鶴岡・酒田（庄内）はエリア特性が異なるため、居住地に近い地域を基本にしつつ、特化施術だけ遠征する使い分けが現実的。","車移動が標準の山形では駐車場の有無がサロン選びの重要条件で、郊外型サロンは駐車場完備が多く選びやすい。","Each Spiritの山形美容室カードでは参照ソースと確認日を掲載しているが、営業時間・価格は変更される場合があるため訪問前に公式情報を確認してください。"],"what_you_learn":["山形エリア別の美容室選びのポイント","施術内容で候補を絞る方法","山形の移動事情を踏まえたサロン選び"],"sources":[{"title":"ホットペッパービューティー 山形市","url":"https://beauty.hotpepper.jp/svcSE/macED/salon/sacX413/","sourceType":"local-media","collectedAt":"2026-06-07","note":"山形市内のサロン傾向を確認。"},{"title":"楽天ビューティ 山形市 口コミ","url":"https://beauty.rakuten.co.jp/addr06201/sort4/","sourceType":"local-media","collectedAt":"2026-06-07","note":"口コミ数・評価の高いサロン傾向を確認。"},{"title":"BSRプレス 山形 美容室","url":"https://www.bestsalonreport.jp/press/67303/","sourceType":"editorial","collectedAt":"2026-06-07","note":"山形の実力派サロン取材記事として参考。"}],"faqs":[{"question":"山形市と鶴岡・酒田では美容室の選び方が違いますか？","answer":"はい。山形市はサロン数が多く選択肢が豊富なため比較が重要で、鶴岡・酒田などの庄内エリアは地域密着型が多く、長期的な関係性を重視して選ぶことが多いです。"},{"question":"車がないと山形の美容室には行きにくいですか？","answer":"山形市中心部（七日町・駅前）は徒歩やバスで行けるサロンも多いです。天童市・鶴岡市・酒田市などは車移動が便利なサロンが多く、駐車場完備かを確認しておくとよいです。"}],"related_slugs":["yamagata-hair-color-guide"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title=EXCLUDED.title, description=EXCLUDED.description, body_md=EXCLUDED.body_md,
  tags=EXCLUDED.tags, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.articles (slug, category, region, title, description, body_md, tags, author_name, status, published_at, metadata) VALUES (
  'yamagata-hair-color-guide', 'beauty', 'yamagata',
  '山形でヘアカラーを選ぶ前に知りたいこと', 'アディクシーカラー・酸性トリートメント・オーガニックカラー・グレイカラーの違いと費用感を整理。山形の気候・生活環境に合わせたカラー選びのポイントもまとめます。', '# 山形でヘアカラーを選ぶ前に知りたいこと

山形でカラーを選ぶときは、全国共通の「薬剤の特徴」に加えて、山形特有の気候（降雪・乾燥・寒暖差）がカラーの持ちやダメージにどう影響するかも把握しておくと役立ちます。

---

## 山形の気候がカラーに与える影響

山形は日本有数の豪雪地帯（内陸）と、海洋性気候（庄内）が混在します。

| 季節 | 髪への影響 |
|------|----------|
| 冬（12〜3月） | 乾燥・帽子摩擦・静電気でダメージ蓄積 |
| 春（3〜5月） | 雪解け湿気+強風でクセが出やすい |
| 夏（7〜8月） | 紫外線と蒸し暑さで褪色が加速 |
| 秋（9〜11月） | カラーのベストシーズン・発色が安定 |

この気候を踏まえると、**保湿と低ダメージを両立できるカラー選び**が山形では特に重要です。

---

## 主要カラーの特徴と向き不向き

### アディクシーカラー（SHISEIDO）

赤みを抑えた透明感に特化した薬剤。山形でも人気が高く、BLOOM 七日町やlienが得意としています。

- **向いている人:** アッシュ・グレー系の透明感を出したい、赤みが出やすい髪質
- **山形での注意点:** 冬の乾燥期は色落ち後の黄ばみが出やすいため、カラーシャンプーの活用がおすすめ

### グレイカラー（白髪を活かすカラー）

白髪をあえて染めずシルバー・グレー系のスタイルに仕上げる技法。30〜50代を中心に山形でも広がっています。cerise（鶴岡）が特に対応実績が豊富です。

- **向いている人:** 白髪が増えてきて染めるコストを見直したい、個性的なスタイルを楽しみたい
- **注意点:** 一度グレイカラーに移行すると元の色に戻すのが難しいため、カウンセリングで慎重に検討する

### オーガニックカラー・ヘナ

天然由来成分を使うカラーで、頭皮への負担が最小限。酒田市のnaturelが庄内エリアで専門的に対応しています。

- **向いている人:** 薬剤アレルギー・頭皮敏感肌・妊娠中・授乳中の方
- **注意点:** 発色がオレンジ〜茶系に偏りやすく、明るいカラーには向かない

---

## 山形気候に対応したトリートメント選び

### 酸性トリートメント（ULTOWA等）

弱酸性の薬剤で髪のダメージを最小化しながらケアするトリートメント。冬の乾燥・夏のダメージが重なる山形環境で特に有効です。LUNAが山形市内で最も専門的に取り扱っています。

- **特徴:** 持続性が高く、2〜3ヶ月効果が続く。繰り返しのカラーダメージにも効果的
- **費用目安:** ¥8,000〜¥15,000（単独施術の場合）

### TOKIOインカラミ

カラー・パーマ後のダメージ補修に定評。即効性が高く施術直後から手触りの変化を感じやすい。BLOOM 七日町が取り扱っています。

- **特徴:** 結合強化型で毛髪内部から補修。カラーとの同日施術が多い
- **費用目安:** ¥5,000〜¥10,000

---

## カラーの持ちを良くする山形流ケア

1. **保湿重視のシャンプーを選ぶ** — 山形の乾燥冬には保湿成分（ヒアルロン酸・セラミド）入りが向く
2. **帽子着用時は髪をまとめる** — 雪道での帽子による摩擦が蓄積する
3. **室内暖房による乾燥対策** — 加湿器の使用や洗い流さないトリートメントで補う
4. **秋にカラーをリセットする** — カラーの持ちが安定する秋（9〜11月）にしっかりケアしておくと冬を乗り越えやすい

---

## 費用の目安（山形市内）

| 施術内容 | 費用目安 |
|---------|---------|
| カット + 全体カラー | ¥8,000〜¥14,000 |
| カット + インナーカラー | ¥12,000〜¥18,000 |
| カット + グレイカラー | ¥10,000〜¥18,000 |
| カット + カラー + 酸性トリートメント | ¥15,000〜¥24,000 |
| ヘナカラー（単独） | ¥8,000〜¥14,000 |

※サロン・施術量により変わります。

---

## サロンでカラーを相談する際のポイント

- 「山形の冬の乾燥が気になる」と伝えると保湿系の提案が受けやすくなる
- 帽子着用が多い場合は伝えておくとスタイル提案に反映される
- 次の来店まで間隔が長くなりそうな場合はメンテナンスしやすいスタイルを相談する
',
  ARRAY['カラー', 'アディクシーカラー', '酸性トリートメント', 'グレイカラー', '山形', 'オーガニック']::text[], 'Each Spirit 編集部', 'published', '2026-06-07',
  '{"summary":["山形は降雪・湿度など気候の影響で髪のダメージが出やすく、髪質改善トリートメントとカラーを組み合わせるニーズが高い。","酸性系トリートメント（ULTOWA等）は低ダメージで山形の気候変化に対応しやすく、カラーとの相性も良い。","庄内エリアではオーガニックカラー対応サロンが選択肢として有効で、頭皮敏感肌の読者への提案として機能する。"],"what_you_learn":["山形気候に合ったカラー選びの考え方","酸性系トリートメントの特徴","オーガニック・グレイカラーの活用場面"],"sources":[{"title":"Beauty Park 山形市 カラー","url":"https://www.beauty-park.jp/yamagata/yamagata-shi/","sourceType":"editorial","collectedAt":"2026-06-07","note":"山形市カラー人気サロンとメニュー傾向を確認。"},{"title":"ヘアログ 山形市 人気美容室","url":"https://hairlog.jp/yamagata/C6201","sourceType":"local-media","collectedAt":"2026-06-07","note":"山形の人気スタイルとトレンドを確認。"},{"title":"庄内コンシェルジュ 美容室","url":"https://shonai-yamagata.com/beauty-health/beauty-salon/search/","sourceType":"local-media","collectedAt":"2026-06-07","note":"庄内エリアのサロン情報として確認。"}],"faqs":[{"question":"山形の冬は髪にダメージが出やすいですか？","answer":"はい。乾燥した冬の寒さと暖房による室内乾燥、雪道での帽子着用による摩擦などが積み重なります。保湿系トリートメントや洗い流さないオイルの定期使用がおすすめです。"},{"question":"カラーと縮毛矯正は同日にできますか？","answer":"技術的には可能な場合もありますが、髪へのダメージが大きくなるため多くのサロンでは別日を推奨しています。最低でも2週間の間隔を空けるのが一般的です。"}],"related_slugs":["yamagata-beauty-salon-guide"]}'::jsonb
) ON CONFLICT (slug) DO UPDATE SET
  title=EXCLUDED.title, description=EXCLUDED.description, body_md=EXCLUDED.body_md,
  tags=EXCLUDED.tags, metadata=EXCLUDED.metadata, updated_at=NOW();

-- ========== ITEMS ==========
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'sankichiya-nishibori', 'ramen_item', 'niigata',
  '三吉屋 西堀本店', '昭和32年創業の老舗。新潟あっさり醤油ラーメンの代表格として、細麺と淡麗スープを目当てに訪れる読者へ紹介したい一店です。', NULL,
  '新潟県新潟市中央区西堀通5番町829', '新潟市中央区・古町', '025-222-8227',
  '600円〜1,000円目安', 'https://niigata.mypl.net/article/ramen_niigata/30547', 'https://maps.google.com/?q=%E4%B8%89%E5%90%89%E5%B1%8B%20%E8%A5%BF%E5%A0%80%E6%9C%AC%E5%BA%97%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E8%A5%BF%E5%A0%80%E9%80%9A5%E7%95%AA%E7%94%BA829',
  ARRAY['新潟5大ラーメン', '老舗', '古町', '細麺', '昼営業']::text[], '2026-06-08', '新潟ラーメンの入口記事や観光向け導線に最適。濃厚系が苦手な読者にも提案しやすく、古町散策との相性も良いです。',
  '{"genre":"新潟あっさり醤油","parking":false,"parking_note":"専用駐車場は確認できないため、周辺コインパーキング利用を想定。","recommended_menu":"中華そば","business_hours":"11:00〜16:00、17:00〜19:00（スープ・麺がなくなり次第終了）","closed_days":"火曜","official_links":[{"label":"店舗紹介","url":"https://niigata.mypl.net/article/ramen_niigata/30547","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E4%B8%89%E5%90%89%E5%B1%8B%20%E8%A5%BF%E5%A0%80%E6%9C%AC%E5%BA%97%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E8%A5%BF%E5%A0%80%E9%80%9A5%E7%95%AA%E7%94%BA829","type":"map"}],"sources":[{"title":"まいぷれ 新潟市 三吉屋 西堀本店","url":"https://niigata.mypl.net/article/ramen_niigata/30547","sourceType":"local-media","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、看板メニュー確認。"},{"title":"新潟市ラーメンガイドブック","url":"https://www.city.niigata.lg.jp/kanko/kanko/oshirase/ramen.files/guidebook.pdf","sourceType":"government","collectedAt":"2026-06-08","note":"新潟5大ラーメンと掲載店舗の確認。"}],"faqs":[{"question":"三吉屋 西堀本店はどんなラーメンですか？","answer":"細麺と淡麗スープの新潟あっさり醤油系です。濃厚さよりも昔ながらの中華そばらしさを重視する人に向いています。"},{"question":"訪問前に確認すべきことはありますか？","answer":"スープや麺がなくなり次第終了とされるため、遅い時間の訪問前は営業状況を確認してください。"}],"related_ranking_slugs":["niigata-ramen-essential","niigata-assari-shoyu"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'touyoko-shichikuyama', 'ramen_item', 'niigata',
  '元祖新潟濃厚味噌 東横 紫竹山本店', '割りスープ付きの濃厚味噌で知られる新潟5大ラーメンの代表格。太麺と味噌の強さを楽しみたい読者向けです。', NULL,
  '新潟県新潟市中央区紫竹山1-8-20', '新潟市中央区・紫竹山', '025-290-4770',
  '700円〜1,200円目安', 'https://www.touyoko.jp/stores', 'https://maps.google.com/?q=%E6%9D%B1%E6%A8%AA%20%E7%B4%AB%E7%AB%B9%E5%B1%B1%E6%9C%AC%E5%BA%97%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E7%B4%AB%E7%AB%B9%E5%B1%B11-8-20',
  ARRAY['新潟5大ラーメン', '濃厚味噌', '割りスープ', '太麺', '駐車場あり']::text[], '2026-06-08', '県外読者に新潟濃厚味噌を説明する時の軸になる店舗。味噌の濃さ、割りスープ、太麺という体験要素が明確です。',
  '{"genre":"新潟濃厚味噌","parking":true,"parking_note":"車利用しやすい郊外型店舗。","recommended_menu":"元祖新潟濃厚味噌","business_hours":"平日 11:00〜15:00 / 17:00〜21:00、土日祝 11:00〜21:00","closed_days":"不定休","official_links":[{"label":"公式サイト","url":"https://www.touyoko.jp/stores","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%9D%B1%E6%A8%AA%20%E7%B4%AB%E7%AB%B9%E5%B1%B1%E6%9C%AC%E5%BA%97%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E7%B4%AB%E7%AB%B9%E5%B1%B11-8-20","type":"map"}],"sources":[{"title":"東横 公式 店舗情報","url":"https://www.touyoko.jp/stores","sourceType":"official","collectedAt":"2026-06-08","note":"店舗展開と紫竹山本店の確認。"},{"title":"GOOD LUCK TRIP 東横 紫竹山本店","url":"https://www.gltjp.com/ja/directory/item/11508/","sourceType":"editorial","collectedAt":"2026-06-08","note":"住所、電話、営業時間、濃厚味噌の説明確認。"}],"faqs":[{"question":"割りスープとは何ですか？","answer":"濃厚な味噌スープを好みの濃さに調整するためのスープです。まずはそのまま、途中で調整する流れが分かりやすいです。"},{"question":"観光客にも向いていますか？","answer":"新潟5大ラーメンの一つを分かりやすく体験できるため、初回の新潟ラーメン巡りにも向いています。"}],"related_ranking_slugs":["niigata-ramen-essential","niigata-miso"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'ittoya-shichikuyama', 'ramen_item', 'niigata',
  'いっとうや 紫竹山本店', '魚介系と動物系のWスープ、極太メンマ、あぶりチャーシューが印象的な人気店。新潟市内で満足度重視の一杯を探す読者へ。', NULL,
  '新潟県新潟市中央区紫竹山3-5-23', '新潟市中央区・紫竹山', '025-241-8325',
  '900円〜1,300円目安', 'https://niigatacity-ramen.jp/ramen/ittoya/', 'https://maps.google.com/?q=%E3%81%84%E3%81%A3%E3%81%A8%E3%81%86%E3%82%84%20%E7%B4%AB%E7%AB%B9%E5%B1%B1%E6%9C%AC%E5%BA%97%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E7%B4%AB%E7%AB%B9%E5%B1%B13-5-23',
  ARRAY['人気店', 'Wスープ', '炙りチャーシュー', '駐車場あり', '通し営業']::text[], '2026-06-08', '王道のご当地分類ではないものの、観光・地元利用の両方で紹介しやすい実力派。ランキングでは総合満足度枠に入れたい店舗です。',
  '{"genre":"Wスープ醤油","parking":true,"parking_note":"新潟市ラーメンガイドでは駐車場22台と掲載。","recommended_menu":"かさね醤油","business_hours":"11:00〜21:00","closed_days":"なし","official_links":[{"label":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/ramen/ittoya/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E3%81%84%E3%81%A3%E3%81%A8%E3%81%86%E3%82%84%20%E7%B4%AB%E7%AB%B9%E5%B1%B1%E6%9C%AC%E5%BA%97%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E7%B4%AB%E7%AB%B9%E5%B1%B13-5-23","type":"map"}],"sources":[{"title":"新潟市ラーメンガイド いっとうや 紫竹山本店","url":"https://niigatacity-ramen.jp/ramen/ittoya/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、駐車場、看板メニュー確認。"}],"faqs":[{"question":"いっとうやは何を頼むべきですか？","answer":"初回は新潟市ラーメンガイドでも紹介される、かさね醤油を軸に検討しやすいです。"},{"question":"駐車場はありますか？","answer":"新潟市ラーメンガイドでは22台と掲載されています。混雑時は余裕を見て訪問してください。"}],"related_ranking_slugs":["niigata-ramen-essential","niigata-parking"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'menya-shingen', 'ramen_item', 'niigata',
  '麺や真玄', '朝ラー対応日もある、煮干しのうま味を追求した店舗。ビッグスワン周辺や車移動の読者に提案しやすい一店です。', NULL,
  '新潟県新潟市中央区長潟2-3-7', '新潟市中央区・長潟', '025-287-3770',
  '900円〜1,300円目安', 'https://niigatacity-ramen.jp/ramen/%E9%BA%BA%E3%82%84%E7%9C%9F%E7%8E%84/', 'https://maps.google.com/?q=%E9%BA%BA%E3%82%84%E7%9C%9F%E7%8E%84%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E9%95%B7%E6%BD%9F2-3-7',
  ARRAY['煮干し', '朝ラー', '駐車場あり', '中央区', 'メニュー豊富']::text[], '2026-06-08', '朝・昼・夜の使い分けを書けるため、単なるランキングよりも利用シーン別ページで強い店舗です。',
  '{"genre":"煮干し","parking":true,"parking_note":"新潟市ラーメンガイドでは駐車場15台と掲載。","recommended_menu":"極み煮干らぁ麺","business_hours":"水〜土 7:00〜10:00、11:00〜15:00、17:30〜21:00（曜日・LOにより変動）","closed_days":"不定休","official_links":[{"label":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/ramen/%E9%BA%BA%E3%82%84%E7%9C%9F%E7%8E%84/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E9%BA%BA%E3%82%84%E7%9C%9F%E7%8E%84%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E9%95%B7%E6%BD%9F2-3-7","type":"map"}],"sources":[{"title":"新潟市ラーメンガイド 麺や真玄","url":"https://niigatacity-ramen.jp/ramen/%E9%BA%BA%E3%82%84%E7%9C%9F%E7%8E%84/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、駐車場、看板メニュー確認。"}],"faqs":[{"question":"朝ラーは毎日ありますか？","answer":"新潟市ラーメンガイドでは水〜土曜のみの朝営業として掲載されています。訪問前に最新情報を確認してください。"},{"question":"どんな味が特徴ですか？","answer":"大量のイワシ煮干しや燻製ウルメを使う煮干し系として整理しています。"}],"related_ranking_slugs":["niigata-ramen-essential","niigata-parking"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'raimi-ogata', 'ramen_item', 'niigata',
  '麺や来味', '淡麗から濃厚まで幅広いメニューを持つ東区の実力店。煮干し香る中華そばを軸に、比較記事でも扱いやすい店舗です。', NULL,
  '新潟県新潟市東区大形本町5-6-6', '新潟市東区・大形', '025-272-4198',
  '800円〜1,300円目安', 'https://niigatacity-ramen.jp/ramen/raimi/', 'https://maps.google.com/?q=%E9%BA%BA%E3%82%84%E6%9D%A5%E5%91%B3%20%E6%96%B0%E6%BD%9F%E5%B8%82%E6%9D%B1%E5%8C%BA%E5%A4%A7%E5%BD%A2%E6%9C%AC%E7%94%BA5-6-6',
  ARRAY['煮干し', '淡麗', '駐車場あり', '東区', '限定麺']::text[], '2026-06-08', '限定麺やメニュー幅の情報を追う価値がある店舗。今後、季節限定・淡麗系まとめで個別記事化しやすいです。',
  '{"genre":"煮干し淡麗","parking":true,"parking_note":"新潟市ラーメンガイドでは駐車場26台と掲載。","recommended_menu":"中華そば","business_hours":"11:00〜15:00、17:30〜21:00（材料なくなり次第終了）","closed_days":"月曜夜、火曜、ほか不定休","official_links":[{"label":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/ramen/raimi/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E9%BA%BA%E3%82%84%E6%9D%A5%E5%91%B3%20%E6%96%B0%E6%BD%9F%E5%B8%82%E6%9D%B1%E5%8C%BA%E5%A4%A7%E5%BD%A2%E6%9C%AC%E7%94%BA5-6-6","type":"map"}],"sources":[{"title":"新潟市ラーメンガイド 麺や来味","url":"https://niigatacity-ramen.jp/ramen/raimi/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、駐車場、看板メニュー確認。"},{"title":"＆Komachi 麺や来味","url":"https://www.andkomachi.com/spot/gourmet/113037","sourceType":"local-media","collectedAt":"2026-06-08","note":"営業時間、定休日、駐車場、店舗特徴の補助確認。"}],"faqs":[{"question":"麺や来味はあっさり系ですか？","answer":"看板として中華そばが紹介され、煮干し香る淡麗系の入口として扱いやすい店舗です。一方でメニュー幅も広いです。"},{"question":"駐車場はありますか？","answer":"新潟市ラーメンガイドでは26台と掲載されています。"}],"related_ranking_slugs":["niigata-assari-shoyu","niigata-parking"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'naoji-souhonten', 'ramen_item', 'niigata',
  '新潟拉麺なおじ 総本店', '肉そばや限定メニューなど、力強いラインアップを持つ総本店。公式サイトで店舗情報を追えるため更新運用しやすい店舗です。', NULL,
  '新潟県新潟市中央区上所上3丁目1-28', '新潟市中央区・上所', '025-250-5501',
  '900円〜1,400円目安', 'https://naoji.jp/shop/souhonten.html', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E6%8B%89%E9%BA%BA%E3%81%AA%E3%81%8A%E3%81%98%20%E7%B7%8F%E6%9C%AC%E5%BA%97%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E4%B8%8A%E6%89%80%E4%B8%8A3%E4%B8%81%E7%9B%AE1-28',
  ARRAY['公式サイトあり', '肉そば', '限定麺', '中央区', '駐車場あり']::text[], '2026-06-08', '公式サイトで店舗別ページがあるため、営業時間・限定麺の更新運用をしやすい店舗。ガッツリ系の導線にも使えます。',
  '{"genre":"肉そば・背脂","parking":true,"parking_note":"公式・現地情報確認推奨。","recommended_menu":"なおじろう / 肉そば系","business_hours":"公式サイト掲載の最新営業時間を確認","closed_days":"公式サイト掲載の最新情報を確認","official_links":[{"label":"公式サイト","url":"https://naoji.jp/shop/souhonten.html","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E6%8B%89%E9%BA%BA%E3%81%AA%E3%81%8A%E3%81%98%20%E7%B7%8F%E6%9C%AC%E5%BA%97%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E4%B8%8A%E6%89%80%E4%B8%8A3%E4%B8%81%E7%9B%AE1-28","type":"map"}],"sources":[{"title":"新潟拉麺なおじ 総本店 公式","url":"https://naoji.jp/shop/souhonten.html","sourceType":"official","collectedAt":"2026-06-08","note":"住所、店舗概要、公式店舗ページ確認。営業時間は公式最新情報確認前提。"},{"title":"なじらぼ 新潟ラーメン なおじ総本店","url":"https://www.najilabo.net/shop/shop.shtml?s=4387","sourceType":"local-media","collectedAt":"2026-06-08","note":"店舗特徴と営業時間情報の補助確認。"}],"faqs":[{"question":"なおじ総本店の営業時間は固定ですか？","answer":"公式サイトや店舗SNS等で変更される可能性があります。訪問前に最新情報の確認を推奨します。"},{"question":"どんな読者に向いていますか？","answer":"肉そばやガッツリ系、限定麺を楽しみたい読者に向いています。"}],"related_ranking_slugs":["niigata-ramen-essential","niigata-parking"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'menya-shinobu', 'ramen_item', 'niigata',
  '麺や忍', '駅南エリアで背脂しょうゆを探す時に候補に入れたい店舗。日祝は昼営業のみのため、訪問時間の確認が重要です。', NULL,
  '新潟県新潟市中央区米山4-1-1 伏見ビル2 1F', '新潟市中央区・駅南', '025-246-5281',
  '800円〜1,200円目安', 'https://niigata.mypl.net/article/ramen_niigata/7829', 'https://maps.google.com/?q=%E9%BA%BA%E3%82%84%E5%BF%8D%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E7%B1%B3%E5%B1%B14-1-1',
  ARRAY['背脂', '駅南', '太麺', '昼営業注意', '一人利用']::text[], '2026-06-08', '駅南で背脂系を扱える貴重な候補。営業時間の制約も情報価値になるため、店舗詳細で明記しています。',
  '{"genre":"背脂しょうゆ","parking":false,"parking_note":"駅南エリアのため周辺駐車場確認推奨。","recommended_menu":"背脂しょうゆ","business_hours":"11:00〜14:00、18:00〜19:45（日曜・祝日は昼営業のみ、13:30までの掲載あり）","closed_days":"最新情報確認推奨","official_links":[{"label":"まいぷれ 店舗紹介","url":"https://niigata.mypl.net/article/ramen_niigata/7829","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E9%BA%BA%E3%82%84%E5%BF%8D%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E7%B1%B3%E5%B1%B14-1-1","type":"map"}],"sources":[{"title":"まいぷれ 新潟市 麺や忍","url":"https://niigata.mypl.net/article/ramen_niigata/7829","sourceType":"local-media","collectedAt":"2026-06-08","note":"営業時間、店舗特徴、背脂しょうゆの説明確認。"},{"title":"新潟ラーメン.com 麺や忍","url":"https://noodles.bbshin.net/niigata/shinobu.html","sourceType":"editorial","collectedAt":"2026-06-08","note":"背脂しょうゆ、営業時間の補助確認。"}],"faqs":[{"question":"夜も営業していますか？","answer":"平日は夜営業の掲載がありますが、日曜・祝日は昼のみとされる情報があります。訪問前に確認してください。"},{"question":"どんなラーメンですか？","answer":"燕三条系を思わせる背脂しょうゆと太麺の組み合わせとして整理しています。"}],"related_ranking_slugs":["niigata-ramen-essential"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'jikon-matsuzaki', 'ramen_item', 'niigata',
  'らーめん滋魂', '岩のり中華が看板の東区人気店。燕背脂の流れを感じる濃厚な一杯を、新潟市内で食べたい読者に向いています。', NULL,
  '新潟県新潟市東区松崎1-1-28', '新潟市東区・松崎', '025-272-9260',
  '900円〜1,400円目安', 'https://niigata.mypl.net/article/ramen_niigata/80784', 'https://maps.google.com/?q=%E3%82%89%E3%83%BC%E3%82%81%E3%82%93%E6%BB%8B%E9%AD%82%20%E6%96%B0%E6%BD%9F%E5%B8%82%E6%9D%B1%E5%8C%BA%E6%9D%BE%E5%B4%8E1-1-28',
  ARRAY['背脂', '岩のり', '東区', '駐車場あり', '濃厚']::text[], '2026-06-08', '背脂ランキングの中で杭州飯店と比較しやすい新潟市側の候補。岩のりという個性があり、写真・レビュー記事化にも向きます。',
  '{"genre":"燕背脂・岩のり中華","parking":true,"parking_note":"駐車場あり。台数・混雑状況は訪問前確認推奨。","recommended_menu":"岩のり中華","business_hours":"11:00〜15:00、17:00〜21:00（LO掲載あり）","closed_days":"水曜ほか不定休","official_links":[{"label":"まいぷれ 店舗紹介","url":"https://niigata.mypl.net/article/ramen_niigata/80784","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E3%82%89%E3%83%BC%E3%82%81%E3%82%93%E6%BB%8B%E9%AD%82%20%E6%96%B0%E6%BD%9F%E5%B8%82%E6%9D%B1%E5%8C%BA%E6%9D%BE%E5%B4%8E1-1-28","type":"map"}],"sources":[{"title":"まいぷれ 新潟市 らーめん滋魂","url":"https://niigata.mypl.net/article/ramen_niigata/80784","sourceType":"local-media","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、看板メニュー確認。"},{"title":"JAFナビ らーめん滋魂","url":"https://area.jaf.or.jp/area/2025/10/kanto/niigata/special-benefits/ramen-jikon20251023","sourceType":"editorial","collectedAt":"2026-06-08","note":"岩のり中華と燕背脂系の説明補助。"}],"faqs":[{"question":"滋魂の看板メニューは何ですか？","answer":"地域メディアでは岩のり中華が看板として紹介されています。"},{"question":"背脂が苦手でも食べやすいですか？","answer":"背脂系のため好みは分かれます。岩のりや煮干し感とのバランスを楽しみたい人に向いています。"}],"related_ranking_slugs":["niigata-ramen-essential","niigata-parking"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'komadori-maki', 'ramen_item', 'niigata',
  'ラーメン こまどり', '新潟濃厚味噌の代表格として知られる西蒲区の名店。巻エリアや岩室温泉方面の導線でも紹介しやすい店舗です。', NULL,
  '新潟県新潟市西蒲区竹野町2454-1', '新潟市西蒲区・巻', '0256-72-2827',
  '900円〜1,400円目安', 'https://menlife.jp/shop/396', 'https://maps.google.com/?q=%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%20%E3%81%93%E3%81%BE%E3%81%A9%E3%82%8A%20%E6%96%B0%E6%BD%9F%E5%B8%82%E8%A5%BF%E8%92%B2%E5%8C%BA%E7%AB%B9%E9%87%8E%E7%94%BA2454-1',
  ARRAY['新潟5大ラーメン', '濃厚味噌', '西蒲区', '餃子', '車移動']::text[], '2026-06-08', '新潟濃厚味噌を語るうえで外しにくい店舗。東横と比較して、濃厚味噌のスタイル差を説明する記事へ展開できます。',
  '{"genre":"新潟濃厚味噌","parking":true,"parking_note":"車訪問向き。駐車場の最新状況は店舗情報確認推奨。","recommended_menu":"味噌ラーメン","business_hours":"平日 11:00〜14:30 / 16:30〜20:00、土日 11:00〜15:00 / 16:30〜20:00目安","closed_days":"最新情報確認推奨","official_links":[{"label":"MEN LIFE 店舗情報","url":"https://menlife.jp/shop/396","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%20%E3%81%93%E3%81%BE%E3%81%A9%E3%82%8A%20%E6%96%B0%E6%BD%9F%E5%B8%82%E8%A5%BF%E8%92%B2%E5%8C%BA%E7%AB%B9%E9%87%8E%E7%94%BA2454-1","type":"map"}],"sources":[{"title":"MEN LIFE ラーメン こまどり","url":"https://menlife.jp/shop/396","sourceType":"editorial","collectedAt":"2026-06-08","note":"住所、営業時間、濃厚味噌の背景確認。"},{"title":"新潟市ラーメンガイドブック","url":"https://www.city.niigata.lg.jp/kanko/kanko/oshirase/ramen.files/guidebook.pdf","sourceType":"government","collectedAt":"2026-06-08","note":"新潟5大ラーメン文脈での掲載確認。"}],"faqs":[{"question":"こまどりは新潟濃厚味噌の店ですか？","answer":"新潟濃厚味噌の代表格として扱われる店舗です。濃い味噌スープを楽しみたい読者に向いています。"},{"question":"新潟市中心部から行きやすいですか？","answer":"中心部からは距離があるため、車移動や西蒲区・岩室方面の予定と合わせるのがおすすめです。"}],"related_ranking_slugs":["niigata-miso","niigata-ramen-essential"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'hangzhou-hanten', 'ramen_item', 'niigata',
  '杭州飯店', '燕背脂ラーメンの象徴的存在。極太麺、煮干し醤油、背脂、玉ねぎという燕三条らしさを体験したい読者向けです。', NULL,
  '新潟県燕市燕49-4', '燕市', '0256-64-3770',
  '900円〜1,500円目安', 'https://ra-men.tsubame-kankou.jp/stores/entry-27.html', 'https://maps.google.com/?q=%E6%9D%AD%E5%B7%9E%E9%A3%AF%E5%BA%97%20%E7%87%95%E5%B8%82%E7%87%9549-4',
  ARRAY['新潟5大ラーメン', '燕背脂', '極太麺', '駐車場あり', '観光協会掲載']::text[], '2026-06-08', '県内全域のラーメンガイドにするなら必須級。新潟市中心のページから県内ページへ広げる時の柱になります。',
  '{"genre":"燕背脂ラーメン","parking":true,"parking_note":"燕市観光協会の燕背脂ラーメンMAPでは駐車場有と掲載。","recommended_menu":"中華そば","business_hours":"平日 11:00〜14:30 / 17:00〜20:00、土日祝 11:00〜18:30（売り切れ次第終了）","closed_days":"月曜（月2回 月火連休）","official_links":[{"label":"燕背脂ラーメンMAP","url":"https://ra-men.tsubame-kankou.jp/stores/entry-27.html","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%9D%AD%E5%B7%9E%E9%A3%AF%E5%BA%97%20%E7%87%95%E5%B8%82%E7%87%9549-4","type":"map"}],"sources":[{"title":"燕背脂ラーメンMAP 杭州飯店","url":"https://ra-men.tsubame-kankou.jp/stores/entry-27.html","sourceType":"tourism","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、駐車場確認。"},{"title":"燕背脂ラーメンMAP","url":"https://ra-men.tsubame-kankou.jp/","sourceType":"tourism","collectedAt":"2026-06-08","note":"燕背脂ラーメンの地域情報確認。"}],"faqs":[{"question":"杭州飯店は何系のラーメンですか？","answer":"燕背脂ラーメンを代表する店舗として整理しています。煮干し醤油、背脂、極太麺、玉ねぎが特徴です。"},{"question":"売り切れ終了はありますか？","answer":"燕背脂ラーメンMAPでは売り切れ次第終了と掲載されています。遠方から訪問する場合は早めの時間がおすすめです。"}],"related_ranking_slugs":["niigata-ramen-essential"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'ishiguro-bentenbashi', 'ramen_item', 'niigata',
  '中華そば 石黒', '3種の煮干しと動物系スープを重ねた「極にぼ」が看板。新潟市中央区で煮干しの濃度を重視して選びたい読者に向く個店です。', NULL,
  '新潟県新潟市中央区弁天橋通1-4-33 湖南ビル1F', '新潟市中央区・弁天橋通', '025-250-1496',
  '900円〜1,300円目安', 'https://niigatacity-ramen.jp/ramen/ishiguro/', 'https://maps.google.com/?q=%E4%B8%AD%E8%8F%AF%E3%81%9D%E3%81%B0%20%E7%9F%B3%E9%BB%92%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%BC%81%E5%A4%A9%E6%A9%8B%E9%80%9A1-4-33',
  ARRAY['個店', '煮干し', '中央区', '駐車場あり', 'スープ終了あり']::text[], '2026-06-08', '濃厚煮干しの切り口で見出しを作りやすい店舗。スープ終了ありのため、店舗詳細では早めの訪問を促す構成が向きます。',
  '{"genre":"濃厚煮干し","parking":true,"parking_note":"新潟市ラーメンガイドでは共有駐車場10台と掲載。","recommended_menu":"極にぼ","business_hours":"11:00〜14:30、17:30〜21:00LO（スープなくなり次第終了）","closed_days":"月曜夜、火曜","official_links":[{"label":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/ramen/ishiguro/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E4%B8%AD%E8%8F%AF%E3%81%9D%E3%81%B0%20%E7%9F%B3%E9%BB%92%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%BC%81%E5%A4%A9%E6%A9%8B%E9%80%9A1-4-33","type":"map"}],"sources":[{"title":"新潟市ラーメンガイド 中華そば 石黒","url":"https://niigatacity-ramen.jp/ramen/ishiguro/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、駐車場、極にぼの特徴確認。"}],"faqs":[{"question":"中華そば 石黒は何系ですか？","answer":"新潟市ラーメンガイドでは、3種の煮干しを使う「極にぼ」が紹介されています。濃厚煮干しを目的に選びやすい店舗です。"},{"question":"駐車場はありますか？","answer":"新潟市ラーメンガイドでは共有駐車場10台と掲載されています。混雑時は周辺状況も確認してください。"}],"related_ranking_slugs":["niigata-independent-selection","niigata-parking"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'hanasaki-nuttari', 'ramen_item', 'niigata',
  'みそ蔵らーめん 花咲', '沼垂エリアで、峰村醸造の米こうじみそを使った味噌ラーメンを提供する個店。発酵文化と合わせて紹介しやすい一杯です。', NULL,
  '新潟県新潟市中央区沼垂東5-1-30', '新潟市中央区・沼垂', '025-246-0022',
  '900円〜1,300円目安', 'https://niigatacity-ramen.jp/ramen/%E3%81%BF%E3%81%9D%E8%94%B5%E3%82%89%E3%83%BC%E3%82%81%E3%82%93-%E8%8A%B1%E5%92%B2/', 'https://maps.google.com/?q=%E3%81%BF%E3%81%9D%E8%94%B5%E3%82%89%E3%83%BC%E3%82%81%E3%82%93%20%E8%8A%B1%E5%92%B2%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E6%B2%BC%E5%9E%82%E6%9D%B15-1-30',
  ARRAY['個店', '味噌', '沼垂', '発酵', '駐車場あり']::text[], '2026-06-08', '沼垂の街歩き、発酵、味噌ラーメンをつなげられる店舗。観光記事から店舗詳細へ流す導線に使いやすいです。',
  '{"genre":"味噌","parking":true,"parking_note":"新潟市ラーメンガイドでは駐車場7台と掲載。","recommended_menu":"極上みそ蔵らーめん","business_hours":"11:00〜15:00、17:00〜20:30（金・土曜は21:00まで、各30分前LO）","closed_days":"水曜","official_links":[{"label":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/ramen/%E3%81%BF%E3%81%9D%E8%94%B5%E3%82%89%E3%83%BC%E3%82%81%E3%82%93-%E8%8A%B1%E5%92%B2/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E3%81%BF%E3%81%9D%E8%94%B5%E3%82%89%E3%83%BC%E3%82%81%E3%82%93%20%E8%8A%B1%E5%92%B2%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E6%B2%BC%E5%9E%82%E6%9D%B15-1-30","type":"map"}],"sources":[{"title":"新潟市ラーメンガイド みそ蔵らーめん 花咲","url":"https://niigatacity-ramen.jp/ramen/%E3%81%BF%E3%81%9D%E8%94%B5%E3%82%89%E3%83%BC%E3%82%81%E3%82%93-%E8%8A%B1%E5%92%B2/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、駐車場、使用みその説明確認。"}],"faqs":[{"question":"花咲の味噌ラーメンの特徴は何ですか？","answer":"新潟市ラーメンガイドでは、峰村醸造の米こうじみそと自家製マー油を使う味噌ラーメンとして紹介されています。"},{"question":"沼垂散策と合わせやすいですか？","answer":"住所は沼垂東です。周辺散策と合わせる候補として整理しやすい店舗です。"}],"related_ranking_slugs":["niigata-independent-selection","niigata-miso","niigata-parking"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'ippongi-konan', 'ramen_item', 'niigata',
  '麺屋 一本気', 'カツオ節・サバ節ベースに動物系を合わせたWスープが特徴。江南区でつけ麺や辛つけ麺を探す読者に向く個店です。', NULL,
  '新潟県新潟市江南区下早通2-1-26', '新潟市江南区・下早通', '025-385-7797',
  '900円〜1,300円目安', 'https://niigatacity-ramen.jp/ramen/ippongi/', 'https://maps.google.com/?q=%E9%BA%BA%E5%B1%8B%20%E4%B8%80%E6%9C%AC%E6%B0%97%20%E6%96%B0%E6%BD%9F%E5%B8%82%E6%B1%9F%E5%8D%97%E5%8C%BA%E4%B8%8B%E6%97%A9%E9%80%9A2-1-26',
  ARRAY['個店', 'つけ麺', 'Wスープ', '江南区', '駐車場あり']::text[], '2026-06-08', 'ラーメンだけでなく、つけ麺軸の検索意図を拾える店舗。江南区の地域導線も補強できます。',
  '{"genre":"辛つけ麺","parking":true,"parking_note":"新潟市ラーメンガイドでは駐車場17台と掲載。","recommended_menu":"辛つけ麺","business_hours":"11:00〜14:30、17:00〜20:00（スープなくなり次第終了）","closed_days":"火曜","official_links":[{"label":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/ramen/ippongi/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E9%BA%BA%E5%B1%8B%20%E4%B8%80%E6%9C%AC%E6%B0%97%20%E6%96%B0%E6%BD%9F%E5%B8%82%E6%B1%9F%E5%8D%97%E5%8C%BA%E4%B8%8B%E6%97%A9%E9%80%9A2-1-26","type":"map"}],"sources":[{"title":"新潟市ラーメンガイド 麺屋 一本気","url":"https://niigatacity-ramen.jp/ramen/ippongi/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、駐車場、辛つけ麺の特徴確認。"}],"faqs":[{"question":"麺屋 一本気は何を頼むべきですか？","answer":"新潟市ラーメンガイドでは辛つけ麺が紹介されています。つけ麺目的の候補として扱いやすい店舗です。"},{"question":"スープ切れはありますか？","answer":"新潟市ラーメンガイドでは、スープなくなり次第終了と掲載されています。"}],"related_ranking_slugs":["niigata-independent-selection","niigata-parking"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'mentei-furumachi', 'ramen_item', 'niigata',
  'ラーメン 麺亭', '古町で深夜帯まで営業する、飲み会帰りの締めにも使いやすい個店。塩ベースのエビらーめんが紹介されています。', NULL,
  '新潟県新潟市中央区古町通8番町1452-2', '新潟市中央区・古町', '025-224-9231',
  '900円〜1,300円目安', 'https://niigatacity-ramen.jp/ramen/%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3-%E9%BA%BA%E4%BA%AD/', 'https://maps.google.com/?q=%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%20%E9%BA%BA%E4%BA%AD%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8F%A4%E7%94%BA%E9%80%9A8%E7%95%AA%E7%94%BA1452-2',
  ARRAY['個店', '古町', '夜営業', '締めラーメン', 'エビらーめん']::text[], '2026-06-08', '夜営業という検索軸を補強できる店舗。古町の飲食導線と相性が良く、昼営業中心の一覧との差別化になります。',
  '{"genre":"夜営業・塩","parking":false,"parking_note":"新潟市ラーメンガイドでは駐車場なしと掲載。","recommended_menu":"エビらーめん","business_hours":"18:00〜翌3:00","closed_days":"日曜・祝日","official_links":[{"label":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/ramen/%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3-%E9%BA%BA%E4%BA%AD/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%20%E9%BA%BA%E4%BA%AD%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8F%A4%E7%94%BA%E9%80%9A8%E7%95%AA%E7%94%BA1452-2","type":"map"}],"sources":[{"title":"新潟市ラーメンガイド ラーメン 麺亭","url":"https://niigatacity-ramen.jp/ramen/%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3-%E9%BA%BA%E4%BA%AD/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、駐車場、エビらーめんの説明確認。"}],"faqs":[{"question":"麺亭は深夜も営業していますか？","answer":"新潟市ラーメンガイドでは18時から翌3時までの営業として掲載されています。"},{"question":"駐車場はありますか？","answer":"新潟市ラーメンガイドでは駐車場なしと掲載されています。古町周辺の駐車場利用を想定してください。"}],"related_ranking_slugs":["niigata-independent-selection"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'hachintei-nishikan', 'ramen_item', 'niigata',
  'お食事処 味の八珍亭', '西蒲区で特製みそラーメンを提供する食事処。駐車場台数が多く、車移動の家族利用にも組み込みやすい店舗です。', NULL,
  '新潟県新潟市西蒲区仁箇1277-1', '新潟市西蒲区・仁箇', '0256-72-8096',
  '900円〜1,300円目安', 'https://niigatacity-ramen.jp/ramen/%E3%81%8A%E9%A3%9F%E4%BA%8B%E5%87%A6-%E5%91%B3%E3%81%AE%E5%85%AB%E7%8F%8D%E4%BA%AD/', 'https://maps.google.com/?q=%E3%81%8A%E9%A3%9F%E4%BA%8B%E5%87%A6%20%E5%91%B3%E3%81%AE%E5%85%AB%E7%8F%8D%E4%BA%AD%20%E6%96%B0%E6%BD%9F%E5%B8%82%E8%A5%BF%E8%92%B2%E5%8C%BA%E4%BB%81%E7%AE%871277-1',
  ARRAY['個店', '味噌', '西蒲区', '駐車場あり', '食事処']::text[], '2026-06-08', '西蒲区・駐車場・味噌という複数軸を補強できる店舗。観光や家族利用の文脈でも扱いやすいです。',
  '{"genre":"味噌","parking":true,"parking_note":"新潟市ラーメンガイドでは駐車場60台と掲載。","recommended_menu":"特製みそラーメン","business_hours":"10:30〜15:00（14:30LO）、17:00〜21:00（20:30LO）※土日祝は10:00から","closed_days":"月曜、第2・4火曜（祝日の場合は翌日）","official_links":[{"label":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/ramen/%E3%81%8A%E9%A3%9F%E4%BA%8B%E5%87%A6-%E5%91%B3%E3%81%AE%E5%85%AB%E7%8F%8D%E4%BA%AD/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E3%81%8A%E9%A3%9F%E4%BA%8B%E5%87%A6%20%E5%91%B3%E3%81%AE%E5%85%AB%E7%8F%8D%E4%BA%AD%20%E6%96%B0%E6%BD%9F%E5%B8%82%E8%A5%BF%E8%92%B2%E5%8C%BA%E4%BB%81%E7%AE%871277-1","type":"map"}],"sources":[{"title":"新潟市ラーメンガイド お食事処 味の八珍亭","url":"https://niigatacity-ramen.jp/ramen/%E3%81%8A%E9%A3%9F%E4%BA%8B%E5%87%A6-%E5%91%B3%E3%81%AE%E5%85%AB%E7%8F%8D%E4%BA%AD/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、駐車場、特製みそラーメンの特徴確認。"}],"faqs":[{"question":"味の八珍亭はラーメン専門店ですか？","answer":"店名はお食事処ですが、新潟市ラーメンガイドでは特製みそラーメンが紹介されています。"},{"question":"車で行きやすいですか？","answer":"新潟市ラーメンガイドでは駐車場60台と掲載されており、車移動の候補に入れやすい店舗です。"}],"related_ranking_slugs":["niigata-independent-selection","niigata-miso","niigata-parking"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'mentei-kogane', 'ramen_item', 'niigata',
  '麺亭★こがね', '南区で、豚・鶏・鴨の3種チャーシューをのせた「こがねら〜めん」が紹介される個店。肉の満足感で選びやすい店舗です。', NULL,
  '新潟県新潟市南区大通黄金2-7-4', '新潟市南区・大通黄金', '025-201-6077',
  '900円〜1,300円目安', 'https://niigatacity-ramen.jp/ramen/%E9%BA%BA%E4%BA%AD%E2%98%85%E3%81%93%E3%81%8C%E3%81%AD/', 'https://maps.google.com/?q=%E9%BA%BA%E4%BA%AD%E3%81%93%E3%81%8C%E3%81%AD%20%E6%96%B0%E6%BD%9F%E5%B8%82%E5%8D%97%E5%8C%BA%E5%A4%A7%E9%80%9A%E9%BB%84%E9%87%912-7-4',
  ARRAY['個店', '南区', 'チャーシュー', '駐車場あり', '鶏油']::text[], '2026-06-08', '南区の掲載厚みを作れる店舗。チャーシューの特徴が明確で、写真付きカードとの相性も良いです。',
  '{"genre":"醤油","parking":true,"parking_note":"新潟市ラーメンガイドでは駐車場5台と掲載。","recommended_menu":"こがねら〜めん","business_hours":"11:30〜14:00、17:00〜20:30","closed_days":"水曜","official_links":[{"label":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/ramen/%E9%BA%BA%E4%BA%AD%E2%98%85%E3%81%93%E3%81%8C%E3%81%AD/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E9%BA%BA%E4%BA%AD%E3%81%93%E3%81%8C%E3%81%AD%20%E6%96%B0%E6%BD%9F%E5%B8%82%E5%8D%97%E5%8C%BA%E5%A4%A7%E9%80%9A%E9%BB%84%E9%87%912-7-4","type":"map"}],"sources":[{"title":"新潟市ラーメンガイド 麺亭★こがね","url":"https://niigatacity-ramen.jp/ramen/%E9%BA%BA%E4%BA%AD%E2%98%85%E3%81%93%E3%81%8C%E3%81%AD/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、駐車場、こがねら〜めんの特徴確認。"}],"faqs":[{"question":"麺亭★こがねの特徴は何ですか？","answer":"新潟市ラーメンガイドでは、豚・鶏・鴨の3種チャーシューと鶏油のコクが紹介されています。"},{"question":"南区のラーメン候補として使えますか？","answer":"住所は新潟市南区大通黄金です。南区エリアの店舗候補として整理しています。"}],"related_ranking_slugs":["niigata-independent-selection","niigata-parking"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'kandaya-minami', 'ramen_item', 'niigata',
  'らーめん神田屋', '南区で特製味噌らーめんを提供する個店。落花生油の香ばしさやニンニクを使った味噌の強さを求める読者向けです。', NULL,
  '新潟県新潟市南区茨曽根6445-1', '新潟市南区・茨曽根', '025-211-8891',
  '900円〜1,300円目安', 'https://niigatacity-ramen.jp/ramen/%E3%82%89%E3%83%BC%E3%82%81%E3%82%93%E7%A5%9E%E7%94%B0%E5%B1%8B/', 'https://maps.google.com/?q=%E3%82%89%E3%83%BC%E3%82%81%E3%82%93%E7%A5%9E%E7%94%B0%E5%B1%8B%20%E6%96%B0%E6%BD%9F%E5%B8%82%E5%8D%97%E5%8C%BA%E8%8C%A8%E6%9B%BD%E6%A0%B96445-1',
  ARRAY['個店', '南区', '味噌', '駐車場あり', 'スープ終了あり']::text[], '2026-06-08', '南区の味噌ラーメン導線を補強する店舗。閉店がスープ状況に左右されるため、訪問前確認を強めに出したいです。',
  '{"genre":"味噌","parking":true,"parking_note":"新潟市ラーメンガイドでは駐車場10台と掲載。","recommended_menu":"神田屋特製味噌らーめん","business_hours":"11:00〜14:00、18:00〜22:00（土曜夜は17:00から、スープなくなり次第終了）","closed_days":"火曜（祝日は営業）","official_links":[{"label":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/ramen/%E3%82%89%E3%83%BC%E3%82%81%E3%82%93%E7%A5%9E%E7%94%B0%E5%B1%8B/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E3%82%89%E3%83%BC%E3%82%81%E3%82%93%E7%A5%9E%E7%94%B0%E5%B1%8B%20%E6%96%B0%E6%BD%9F%E5%B8%82%E5%8D%97%E5%8C%BA%E8%8C%A8%E6%9B%BD%E6%A0%B96445-1","type":"map"}],"sources":[{"title":"新潟市ラーメンガイド らーめん神田屋","url":"https://niigatacity-ramen.jp/ramen/%E3%82%89%E3%83%BC%E3%82%81%E3%82%93%E7%A5%9E%E7%94%B0%E5%B1%8B/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、駐車場、特製味噌らーめんの特徴確認。"}],"faqs":[{"question":"らーめん神田屋の看板は何ですか？","answer":"新潟市ラーメンガイドでは神田屋特製味噌らーめんが紹介されています。"},{"question":"夜営業はありますか？","answer":"新潟市ラーメンガイドでは夜営業の掲載がありますが、スープなくなり次第終了です。"}],"related_ranking_slugs":["niigata-independent-selection","niigata-miso","niigata-parking"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'kaisei-kobari', 'ramen_item', 'niigata',
  'らぁ麺 貝晴', 'アサリとシジミ、昆布を使った貝だしの塩らぁ麺が紹介される西区小針の個店。淡麗系の幅を広げる候補です。', NULL,
  '新潟県新潟市西区小針7-14-7', '新潟市西区・小針', '025-201-8232',
  '900円〜1,300円目安', 'https://niigatacity-ramen.jp/ramen/%E3%82%89%E3%81%81%E9%BA%BA-%E8%B2%9D%E6%99%B4/', 'https://maps.google.com/?q=%E3%82%89%E3%81%81%E9%BA%BA%20%E8%B2%9D%E6%99%B4%20%E6%96%B0%E6%BD%9F%E5%B8%82%E8%A5%BF%E5%8C%BA%E5%B0%8F%E9%87%9D7-14-7',
  ARRAY['個店', '貝だし', '塩', '西区', '駐車場あり']::text[], '2026-06-08', '貝だし・塩の検索軸を追加できる店舗。味噌や背脂に偏りがちな一覧に軽い選択肢を作れます。',
  '{"genre":"貝だし塩","parking":true,"parking_note":"新潟市ラーメンガイドでは駐車場8台と掲載。","recommended_menu":"塩らぁ麺","business_hours":"11:00〜15:00、17:00〜21:00","closed_days":"不定休","official_links":[{"label":"新潟市ラーメンガイド","url":"https://niigatacity-ramen.jp/ramen/%E3%82%89%E3%81%81%E9%BA%BA-%E8%B2%9D%E6%99%B4/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E3%82%89%E3%81%81%E9%BA%BA%20%E8%B2%9D%E6%99%B4%20%E6%96%B0%E6%BD%9F%E5%B8%82%E8%A5%BF%E5%8C%BA%E5%B0%8F%E9%87%9D7-14-7","type":"map"}],"sources":[{"title":"新潟市ラーメンガイド らぁ麺 貝晴","url":"https://niigatacity-ramen.jp/ramen/%E3%82%89%E3%81%81%E9%BA%BA-%E8%B2%9D%E6%99%B4/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、電話、営業時間、定休日、駐車場、塩らぁ麺と貝だしの特徴確認。"}],"faqs":[{"question":"らぁ麺 貝晴は何系ですか？","answer":"新潟市ラーメンガイドでは、アサリ・シジミ・昆布を使った貝だしの塩らぁ麺が紹介されています。"},{"question":"定休日は決まっていますか？","answer":"新潟市ラーメンガイドでは不定休と掲載されています。訪問前の確認を推奨します。"}],"related_ranking_slugs":["niigata-independent-selection","niigata-assari-shoyu","niigata-parking"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-ryushanhai-akayu', 'ramen_item', 'yamagata',
  '赤湯ラーメン 龍上海 赤湯本店', '1958年創業、からみそラーメンの発祥店として全国的に知られる南陽市赤湯の老舗。スープ中央に置かれた辛みそを溶かしながら食べる独自スタイルが特徴です。', NULL,
  '山形県南陽市二色根6-18', '南陽市・赤湯', '0238-43-2952',
  '800円〜1,200円目安', 'https://ryushanhai.com/', 'https://maps.google.com/?q=%E8%B5%A4%E6%B9%AF%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%20%E9%BE%8D%E4%B8%8A%E6%B5%B7%20%E8%B5%A4%E6%B9%AF%E6%9C%AC%E5%BA%97%20%E5%B1%B1%E5%BD%A2%E7%9C%8C%E5%8D%97%E9%99%BD%E5%B8%82%E4%BA%8C%E8%89%B2%E6%A0%B96-18',
  ARRAY['からみそ発祥', '南陽市', '赤湯温泉', '駐車場あり', '1958年創業', '全国区']::text[], '2026-06-08', '山形ラーメンを語るうえで外せない全国区の名店。からみそを少しずつ溶かして味が変化するプロセスが体験として分かりやすく、観光記事・ランキングどちらにも組み込みやすいです。',
  '{"genre":"赤湯からみそ","parking":true,"parking_note":"専用駐車場あり・広め。","recommended_menu":"からみそラーメン","business_hours":"11:30〜19:00","closed_days":"水曜（祝日の場合営業）","official_links":[{"label":"公式サイト","url":"https://ryushanhai.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E8%B5%A4%E6%B9%AF%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%20%E9%BE%8D%E4%B8%8A%E6%B5%B7%20%E8%B5%A4%E6%B9%AF%E6%9C%AC%E5%BA%97%20%E5%B1%B1%E5%BD%A2%E7%9C%8C%E5%8D%97%E9%99%BD%E5%B8%82%E4%BA%8C%E8%89%B2%E6%A0%B96-18","type":"map"}],"sources":[{"title":"龍上海 公式サイト 店舗案内","url":"https://ryushanhai.com/group/","sourceType":"official","collectedAt":"2026-06-08","note":"赤湯本店の所在地・公式営業情報確認。"},{"title":"やまがたぐらし 龍上海 赤湯本店","url":"https://fullpokko.com/ramen/ryushanhai/","sourceType":"local-media","collectedAt":"2026-06-08","note":"住所・電話・営業時間・定休日・からみその特徴・駐車場の状況確認。"},{"title":"山形情報 んめちゃネット 龍上海","url":"https://nmecha.net/archives/20524","sourceType":"local-media","collectedAt":"2026-06-08","note":"営業時間・定休日・メニュー構成の補助確認。"}],"faqs":[{"question":"からみそラーメンとは何ですか？","answer":"1958年創業の龍上海が生み出した赤湯名物で、スープ中央に辛みそをのせて提供します。最初はしょうゆスープとして、少しずつ辛みそを溶かしながら味の変化を楽しむスタイルです。"},{"question":"赤湯温泉との合わせ方は？","answer":"南陽市赤湯は赤湯温泉エリアと同じ市内です。温泉と組み合わせた日程計画に組み込みやすい立地です。"}],"related_ranking_slugs":["yamagata-ramen-essential","yamagata-area-selection"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-sakaiya-honten', 'ramen_item', 'yamagata',
  '栄屋本店', '1932年創業。1952年に日本で初めて冷しらーめんを考案した店として知られる山形市の老舗。夏期は冷しらーめんが看板で、通年で中華そばも提供します。', NULL,
  '山形県山形市本町2-3-21', '山形市・本町', '023-623-0766',
  '700円〜1,100円目安', 'https://www.visityamagata.jp/spot-yamagata-sakaeyahonten/', 'https://maps.google.com/?q=%E6%A0%84%E5%B1%8B%E6%9C%AC%E5%BA%97%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E6%9C%AC%E7%94%BA2-3-21',
  ARRAY['冷やしラーメン発祥', '山形市', '1932年創業', '夏季限定冷し', '山形駅周辺']::text[], '2026-06-08', '冷やしラーメン発祥という切り口が明確で、観光記事や夏の山形グルメ記事との相性が良いです。夏期・冬期で営業時間が変わるため、訪問前確認を店舗詳細で強調するのが向きます。',
  '{"genre":"冷やしラーメン・醤油","parking":true,"parking_note":"専用駐車場5台。","recommended_menu":"冷しらーめん（夏期）／中華そば（通年）","business_hours":"夏期（3月19日〜9月30日）11:30〜20:15 / 冬期（10月1日〜3月18日）11:30〜19:30（各L.O.閉店20分前）","closed_days":"水曜（祝の場合翌日）、1・8月は不定休","official_links":[{"label":"VISIT YAMAGATA","url":"https://www.visityamagata.jp/spot-yamagata-sakaeyahonten/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%A0%84%E5%B1%8B%E6%9C%AC%E5%BA%97%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E6%9C%AC%E7%94%BA2-3-21","type":"map"}],"sources":[{"title":"VISIT YAMAGATA 栄屋本店","url":"https://www.visityamagata.jp/spot-yamagata-sakaeyahonten/","sourceType":"tourism","collectedAt":"2026-06-08","note":"住所・電話・営業時間・定休日・駐車場・冷しらーめん発祥の経緯確認。"},{"title":"ウォーカープラス 栄屋本店 冷しらーめん","url":"https://www.walkerplus.com/article/171816/","sourceType":"editorial","collectedAt":"2026-06-08","note":"冷しらーめんの特徴・1952年考案の経緯補助確認。"}],"faqs":[{"question":"冷しらーめんはいつ食べられますか？","answer":"VISIT YAMAGATAの掲載では夏期（3月19日〜9月30日）の提供とされています。冬期訪問の場合は中華そばが候補です。"},{"question":"山形駅から行きやすいですか？","answer":"住所は山形市本町2丁目です。山形市中心部に位置するため、山形駅を起点にしたアクセスを検討できます。"}],"related_ranking_slugs":["yamagata-ramen-essential"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-mangetsu-sakata', 'ramen_item', 'yamagata',
  'ワンタンメンの満月 酒田本店', '1948年（昭和23年）創業の酒田ラーメンを代表する老舗。魚介系の澄んだスープに極薄ワンタンが入るワンタンメンが看板で、自家製麺にもこだわります。', NULL,
  '山形県酒田市東中の口町2-1', '酒田市・東中の口', '0234-22-0166',
  '700円〜1,100円目安', 'https://www.sakata-mangetsu.com/sakata/', 'https://maps.google.com/?q=%E3%83%AF%E3%83%B3%E3%82%BF%E3%83%B3%E3%83%A1%E3%83%B3%E3%81%AE%E6%BA%80%E6%9C%88%20%E9%85%92%E7%94%B0%E6%9C%AC%E5%BA%97%20%E5%B1%B1%E5%BD%A2%E7%9C%8C%E9%85%92%E7%94%B0%E5%B8%82%E6%9D%B1%E4%B8%AD%E3%81%AE%E5%8F%A3%E7%94%BA2-1',
  ARRAY['酒田ラーメン', 'ワンタンメン', '酒田市', '駐車場あり', '1948年創業', '庄内']::text[], '2026-06-08', '酒田ラーメンの代表として情報整理しやすい老舗。駐車場40台・昼営業完結・定休日固定と、訪問計画を立てやすい条件が揃っています。庄内観光との連携記事にも使いやすいです。',
  '{"genre":"酒田ラーメン・ワンタンメン","parking":true,"parking_note":"専用駐車場40台。","recommended_menu":"ワンタンメン","business_hours":"11:00〜16:30","closed_days":"火曜","official_links":[{"label":"公式サイト","url":"https://www.sakata-mangetsu.com/sakata/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E3%83%AF%E3%83%B3%E3%82%BF%E3%83%B3%E3%83%A1%E3%83%B3%E3%81%AE%E6%BA%80%E6%9C%88%20%E9%85%92%E7%94%B0%E6%9C%AC%E5%BA%97%20%E5%B1%B1%E5%BD%A2%E7%9C%8C%E9%85%92%E7%94%B0%E5%B8%82%E6%9D%B1%E4%B8%AD%E3%81%AE%E5%8F%A3%E7%94%BA2-1","type":"map"}],"sources":[{"title":"ワンタンメンの満月 公式サイト","url":"https://www.sakata-mangetsu.com/sakata/","sourceType":"official","collectedAt":"2026-06-08","note":"酒田本店の住所・営業時間・定休日確認。"},{"title":"山形県観光情報 VISIT YAMAGATA 満月","url":"https://yamagatakanko.com/attractions/detail_12730.html","sourceType":"tourism","collectedAt":"2026-06-08","note":"創業年・酒田ラーメンとしての位置付け・ワンタンの特徴確認。"},{"title":"酒田ラーメン完全ガイド マルメン製麺所","url":"https://shop.onlyone-marumen.com/%E9%85%92%E7%94%B0%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%E5%AE%8C%E5%85%A8%E3%82%AC%E3%82%A4%E3%83%89/","sourceType":"editorial","collectedAt":"2026-06-08","note":"酒田ラーメンの自家製麺率・スープの特徴・地域背景確認。"}],"faqs":[{"question":"酒田ラーメンとは何が違うのですか？","answer":"酒田ラーメンは魚介（煮干し・昆布・トビウオなど）ベースの透明な醤油スープと極薄ワンタン、高い自家製麺率が特徴です。満月はその代表格として1948年から営業しています。"},{"question":"営業は昼だけですか？","answer":"公式サイトでは11:00〜16:30の昼営業のみとされています。スープが早めになくなることもあるため、早めの訪問がおすすめです。"}],"related_ranking_slugs":["yamagata-ramen-essential","yamagata-area-selection"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-konpirasou', 'ramen_item', 'yamagata',
  '琴平荘', '10月〜5月の冬季のみ営業する鶴岡市三瀬の名店。魚介の旨味が凝縮したスープと多加水手揉み麺の中華そばを目当てに、全国からファンが訪れます。', NULL,
  '山形県鶴岡市三瀬巳381-46', '鶴岡市・三瀬', NULL,
  '700円〜1,000円目安', 'https://retty.me/area/PRE06/ARE299/SUB29902/LCAT5/CAT290/', 'https://maps.google.com/?q=%E7%90%B4%E5%B9%B3%E8%8D%98%20%E5%B1%B1%E5%BD%A2%E7%9C%8C%E9%B6%B4%E5%B2%A1%E5%B8%82%E4%B8%89%E7%80%AC%E5%B7%B3381-46',
  ARRAY['冬季限定', '鶴岡市', '手揉み麺', '魚介系', '全国区', '行列店']::text[], '2026-06-08', '冬季限定・手揉み麺・魚介スープという個性が明確で、旅行計画に組み込みやすい一方、営業期間が10〜5月と夏は休業する点をしっかり伝えることが重要です。',
  '{"genre":"魚介系・手揉み麺","parking":true,"parking_note":"最新状況は訪問前に確認推奨。","recommended_menu":"中華そば","business_hours":"11:00〜14:00（10月1日〜5月31日の冬季のみ営業）","closed_days":"木曜、12月31日・1月1日","official_links":[{"label":"地域ガイド","url":"https://retty.me/area/PRE06/ARE299/SUB29902/LCAT5/CAT290/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E7%90%B4%E5%B9%B3%E8%8D%98%20%E5%B1%B1%E5%BD%A2%E7%9C%8C%E9%B6%B4%E5%B2%A1%E5%B8%82%E4%B8%89%E7%80%AC%E5%B7%B3381-46","type":"map"}],"sources":[{"title":"なっぷ 鶴岡でラーメン 琴平荘","url":"https://www.nap-camp.com/mag/64262","sourceType":"editorial","collectedAt":"2026-06-08","note":"住所・営業時間・冬季限定の営業期間・手揉み麺の特徴確認。"},{"title":"Retty 鶴岡市ラーメン人気店","url":"https://retty.me/area/PRE06/ARE299/SUB29902/LCAT5/CAT290/","sourceType":"editorial","collectedAt":"2026-06-08","note":"鶴岡市のラーメン文脈における琴平荘の位置付け確認。"}],"faqs":[{"question":"琴平荘は年中営業していますか？","answer":"10月1日〜5月31日の冬季のみ営業とされています。夏（6〜9月）は休業のため、訪問計画は事前に時期を確認してください。"},{"question":"手揉み麺とはどんな麺ですか？","answer":"職人が手で揉んで仕上げる麺で、不均一なちぢれがスープとの絡みを生みます。機械製麺とは食感が異なり、もちもちとした口当たりが特徴として紹介されます。"}],"related_ranking_slugs":["yamagata-ramen-essential","yamagata-area-selection"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-koujiya', 'ramen_item', 'yamagata',
  'こうじ屋', '山形市で朝7時から営業する朝ラーメンの人気店。全粒粉自家製麺と煮干し×スルメだしのうまにぼし醤油が看板。スープ切れ終了のため早めの訪問が必要。', NULL,
  '山形県山形市平久保16-8', '山形市・平久保', '023-625-7273',
  '700円〜1,100円目安', 'https://www.oshimen-yamagata.jp/shop/hosomen/koujiya/', 'https://maps.google.com/?q=%E3%81%93%E3%81%86%E3%81%98%E5%B1%8B%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E5%B9%B3%E4%B9%85%E4%BF%9D16-8',
  ARRAY['朝ラー', '煮干し', '山形市', '駐車場あり', '自家製麺', 'スープ終了あり']::text[], '2026-06-08', '朝ラーという検索意図を拾える山形市の候補。平日7時からという早朝営業が差別化になる。',
  '{"genre":"煮干し醤油・朝ラー","parking":true,"parking_note":"専用12台。","recommended_menu":"うまにぼし醤油","business_hours":"7:00〜9:00 / 11:00〜14:30（スープなくなり次第終了）","closed_days":"金曜","official_links":[{"label":"推しメン山形","url":"https://www.oshimen-yamagata.jp/shop/hosomen/koujiya/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E3%81%93%E3%81%86%E3%81%98%E5%B1%8B%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E5%B9%B3%E4%B9%85%E4%BF%9D16-8","type":"map"}],"sources":[{"title":"推しメンやまがたラーメンDB こうじ屋","url":"https://www.oshimen-yamagata.jp/shop/hosomen/koujiya/","sourceType":"editorial","collectedAt":"2026-06-08","note":"住所・電話・営業時間・定休日・メニュー確認。"},{"title":"ヤマガタウェイ 山形ラーメン人気店30選","url":"https://mag.yway.jp/pr/45200/","sourceType":"local-media","collectedAt":"2026-06-08","note":"こうじ屋の特徴・朝ラー文脈確認。"}],"faqs":[{"question":"朝ラーメンはいつからですか？","answer":"7:00〜9:00の朝営業がある店舗として紹介されています。スープがなくなり次第終了のため早めの訪問を推奨します。"}],"related_ranking_slugs":["yamagata-ramen-essential","yamagata-niboshi-selection"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-hayashi-shoten', 'ramen_item', 'yamagata',
  '麺家 林商店', '山形市小立の煮干しWスープ専門店。数種の煮干しに動物系を合わせた濃厚スープと、製麺所特注の太麺・細麺から選べるスタイルが特徴。', NULL,
  '山形県山形市小立3丁目13-22', '山形市・小立', '023-666-3938',
  '800円〜1,200円目安', 'https://hayashishoten.online/', 'https://maps.google.com/?q=%E9%BA%BA%E5%AE%B6%20%E6%9E%97%E5%95%86%E5%BA%97%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E5%B0%8F%E7%AB%8B3%E4%B8%81%E7%9B%AE13-22',
  ARRAY['煮干し', 'Wスープ', '山形市', '太麺・細麺選択', '夜営業あり']::text[], '2026-06-08', '濃厚煮干し・Wスープ・麺の選択肢と、ランキング記事で説明しやすい特徴が揃っている。夜営業もある山形市内の個店。',
  '{"genre":"濃厚煮干し・Wスープ","parking":true,"parking_note":"専用駐車場あり（詳細は訪問前確認推奨）。","recommended_menu":"にぼしW中華","business_hours":"11:00〜14:30 / 17:00〜20:00（水曜は昼のみ）","closed_days":"木曜","official_links":[{"label":"公式サイト","url":"https://hayashishoten.online/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E9%BA%BA%E5%AE%B6%20%E6%9E%97%E5%95%86%E5%BA%97%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E5%B0%8F%E7%AB%8B3%E4%B8%81%E7%9B%AE13-22","type":"map"}],"sources":[{"title":"麺家林商店 公式サイト","url":"https://hayashishoten.online/","sourceType":"official","collectedAt":"2026-06-08","note":"基本情報確認。"},{"title":"ヤマガタウェイ 林商店 濃厚煮干し","url":"https://mag.yway.jp/special/43020/","sourceType":"local-media","collectedAt":"2026-06-08","note":"Wスープの特徴・麺選択の確認。"}],"faqs":[{"question":"麺の太さは選べますか？","answer":"ヤマガタウェイの紹介では、製麺所特注の極太麺と細麺から選べるとされています。"}],"related_ranking_slugs":["yamagata-ramen-essential","yamagata-niboshi-selection"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-takahashi-shoten', 'ramen_item', 'yamagata',
  '二代目高橋商店', '東根市の煮干し特化の名店。年間4.5tの煮干しを使い、化学調味料なしで仕上げた中華そばが県内外のラーメンファンを集める。早仕舞いのため午前中訪問が安心。', NULL,
  '山形県東根市中央2-11-7-112 1F', '東根市', '0237-42-7115',
  '700円〜1,100円目安', 'https://www.higashine.com/restaurant/takahashi', 'https://maps.google.com/?q=%E4%BA%8C%E4%BB%A3%E7%9B%AE%E9%AB%98%E6%A9%8B%E5%95%86%E5%BA%97%20%E6%9D%B1%E6%A0%B9%E5%B8%82%E4%B8%AD%E5%A4%AE2-11-7',
  ARRAY['煮干し', '東根市', '無化調', 'スープ終了あり', '村山エリア']::text[], '2026-06-08', '年4.5t使用という具体的な数字があり、煮干し記事の説明に使いやすい東根の実力店。',
  '{"genre":"煮干し・無化調","parking":true,"parking_note":"最新情報は訪問前確認推奨。","recommended_menu":"中華そば","business_hours":"10:00〜17:00（スープなくなり次第終了）","closed_days":"火曜","official_links":[{"label":"ひがしねどっとこむ","url":"https://www.higashine.com/restaurant/takahashi","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E4%BA%8C%E4%BB%A3%E7%9B%AE%E9%AB%98%E6%A9%8B%E5%95%86%E5%BA%97%20%E6%9D%B1%E6%A0%B9%E5%B8%82%E4%B8%AD%E5%A4%AE2-11-7","type":"map"}],"sources":[{"title":"ひがしねどっとこむ 二代目高橋商店","url":"https://www.higashine.com/restaurant/takahashi","sourceType":"local-media","collectedAt":"2026-06-08","note":"住所・電話・営業時間・定休日・煮干し使用量確認。"},{"title":"ヤマガタウェイ 山形ラーメン30選","url":"https://mag.yway.jp/pr/45200/","sourceType":"local-media","collectedAt":"2026-06-08","note":"煮干し4.5t・無化調の特徴確認。"}],"faqs":[{"question":"二代目高橋商店の特徴は何ですか？","answer":"年間4.5tの煮干しを使用し、化学調味料なしで仕上げた中華そばとして紹介されています。スープがなくなり次第終了のため早めの訪問を推奨します。"}],"related_ranking_slugs":["yamagata-niboshi-selection","yamagata-area-selection"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-koumen-sagae', 'ramen_item', 'yamagata',
  '幸めん', '全国でも希少な天然かます煮干しを100%使用した醤油ラーメンが看板の寒河江市の個店。大ぶりの炙りチャーシューとの組み合わせで、煮干しファンに知られる存在。', NULL,
  '山形県寒河江市新山1丁目45-1', '寒河江市', '0237-85-1798',
  '700円〜1,100円目安', 'https://mag.yway.jp/gourmet/21597/', 'https://maps.google.com/?q=%E5%B9%B8%E3%82%81%E3%82%93%20%E5%AF%92%E6%B2%B3%E6%B1%9F%E5%B8%82%E6%96%B0%E5%B1%B11%E4%B8%81%E7%9B%AE45-1',
  ARRAY['煮干し', '寒河江市', 'かます煮干し', '希少食材', '炙りチャーシュー']::text[], '2026-06-08', '天然かます煮干しという希少素材の切り口が強く、煮干しランキングの個性枠として扱いやすい。',
  '{"genre":"天然かます煮干し","parking":true,"parking_note":"専用駐車場あり。","recommended_menu":"カマス煮干し中華（醤油）","business_hours":"平日 11:00〜15:00 / 18:00〜20:00、休日 11:00〜15:00 / 17:00〜20:00","closed_days":"水曜","official_links":[{"label":"ヤマガタウェイ 幸めん","url":"https://mag.yway.jp/gourmet/21597/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E5%B9%B8%E3%82%81%E3%82%93%20%E5%AF%92%E6%B2%B3%E6%B1%9F%E5%B8%82%E6%96%B0%E5%B1%B11%E4%B8%81%E7%9B%AE45-1","type":"map"}],"sources":[{"title":"ヤマガタウェイ 幸めん 天然かます煮干し","url":"https://mag.yway.jp/gourmet/21597/","sourceType":"local-media","collectedAt":"2026-06-08","note":"住所・電話・営業時間・定休日・かます煮干しの特徴確認。"}],"faqs":[{"question":"かます煮干しとは何が違いますか？","answer":"一般的なイワシ煮干しと異なり、天然かますを煮干しにしたもので全国的に流通が少ない希少素材です。幸めんでは100%使用しているとされています。"}],"related_ranking_slugs":["yamagata-niboshi-selection","yamagata-area-selection"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-toguro-tendo', 'ramen_item', 'yamagata',
  '麺匠 とぐろ', '天童市で山形地鶏だけを長時間煮込んだ無化調の鶏白湯を提供する個店。生産者直送の地鶏を惜しみなく使い、淡麗醤油との2本立てで提供する。', NULL,
  '山形県天童市鎌田本町（詳細は公式情報を確認）', '天童市', NULL,
  '800円〜1,300円目安', 'https://fullpokko.com/yamagata-shoku-susume/ramen/mensho-toguro-2/', 'https://maps.google.com/?q=%E9%BA%BA%E5%8C%A0%E3%81%A8%E3%81%90%E3%82%8D%20%E5%A4%A9%E7%AB%A5%E5%B8%82%E9%8E%8C%E7%94%B0%E6%9C%AC%E7%94%BA',
  ARRAY['地鶏', '鶏白湯', '天童市', '無化調', '昼営業のみ']::text[], '2026-06-08', '山形地鶏・無化調という差別化軸が明確で、煮干し系が多い山形ランキングに鶏系の幅を加えられる。',
  '{"genre":"やまがた地鶏・鶏白湯","parking":true,"parking_note":"最新情報は訪問前確認推奨。","recommended_menu":"鶏白湯中華そば","business_hours":"11:00〜14:00（水〜日）","closed_days":"月曜・火曜","official_links":[{"label":"やまがたぐらし 紹介記事","url":"https://fullpokko.com/yamagata-shoku-susume/ramen/mensho-toguro-2/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E9%BA%BA%E5%8C%A0%E3%81%A8%E3%81%90%E3%82%8D%20%E5%A4%A9%E7%AB%A5%E5%B8%82%E9%8E%8C%E7%94%B0%E6%9C%AC%E7%94%BA","type":"map"}],"sources":[{"title":"やまがたぐらし 麺匠とぐろ","url":"https://fullpokko.com/yamagata-shoku-susume/ramen/mensho-toguro-2/","sourceType":"local-media","collectedAt":"2026-06-08","note":"住所・営業時間・定休日・地鶏スープの特徴確認。"}],"faqs":[{"question":"麺匠 とぐろは何を使ったラーメンですか？","answer":"山形地鶏を水のみで長時間煮込んだ無化調の鶏白湯スープが看板です。淡麗醤油との2種から選べます。"}],"related_ranking_slugs":["yamagata-ramen-essential","yamagata-area-selection"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-shogetsu-sakata', 'ramen_item', 'yamagata',
  '照月', '酒田市本町で朝7時から営業する酒田ラーメンの老舗。透明な醤油スープと自家製麺でシンプルに仕上げた中華そばが朝食需要を中心に支持される。', NULL,
  '山形県酒田市本町3丁目2-10', '酒田市・本町', '0234-24-8805',
  '600円〜900円目安', 'https://sakatano-ramen.com/shogetsu.html', 'https://maps.google.com/?q=%E7%85%A7%E6%9C%88%20%E9%85%92%E7%94%B0%E5%B8%82%E6%9C%AC%E7%94%BA3%E4%B8%81%E7%9B%AE2-10',
  ARRAY['酒田ラーメン', '朝ラー', '酒田市', '駐車場あり', '年中無休']::text[], '2026-06-08', '朝7時から・年中無休・9台と情報が整理しやすく、酒田の朝ラー候補として扱いやすい。',
  '{"genre":"酒田ラーメン・醤油","parking":true,"parking_note":"専用9台。","recommended_menu":"中華そば","business_hours":"7:00〜15:00（スープなくなり次第終了）","closed_days":"年中無休（臨時休業あり）","official_links":[{"label":"酒田のラーメン 照月","url":"https://sakatano-ramen.com/shogetsu.html","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E7%85%A7%E6%9C%88%20%E9%85%92%E7%94%B0%E5%B8%82%E6%9C%AC%E7%94%BA3%E4%B8%81%E7%9B%AE2-10","type":"map"}],"sources":[{"title":"酒田のラーメン 照月","url":"https://sakatano-ramen.com/shogetsu.html","sourceType":"local-media","collectedAt":"2026-06-08","note":"住所・電話・営業時間・定休日・駐車場確認。"}],"faqs":[{"question":"照月は朝から営業していますか？","answer":"7:00〜15:00の営業で、スープがなくなり次第終了とされています。早い時間帯の訪問を推奨します。"}],"related_ranking_slugs":["yamagata-ramen-essential","yamagata-area-selection"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-mikazukiken-sakata', 'ramen_item', 'yamagata',
  '三日月軒 駅東店', '酒田ラーメンの老舗系列・三日月軒の駅東店。あごだしと鶏ガラの澄んだスープと手打ち自家製麺が特徴の酒田ラーメンの正統派として知られる。', NULL,
  '山形県酒田市駅東2-5-19', '酒田市・駅東', '0234-23-4395',
  '600円〜900円目安', 'https://www.sakatano-ramen.com/mikaduki-ekihigashi.html', 'https://maps.google.com/?q=%E4%B8%89%E6%97%A5%E6%9C%88%E8%BB%92%20%E9%A7%85%E6%9D%B1%E5%BA%97%20%E9%85%92%E7%94%B0%E5%B8%82%E9%A7%85%E6%9D%B12-5-19',
  ARRAY['酒田ラーメン', '手打ち', '酒田市', '駐車場あり', '座敷あり']::text[], '2026-06-08', '満月と並ぶ酒田ラーメン老舗系列。同一ジャンル内での比較候補として扱いやすい。',
  '{"genre":"酒田ラーメン・手打ち","parking":true,"parking_note":"専用12台。","recommended_menu":"中華そば","business_hours":"10:30〜15:00","closed_days":"木曜","official_links":[{"label":"酒田のラーメン 三日月軒駅東店","url":"https://www.sakatano-ramen.com/mikaduki-ekihigashi.html","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E4%B8%89%E6%97%A5%E6%9C%88%E8%BB%92%20%E9%A7%85%E6%9D%B1%E5%BA%97%20%E9%85%92%E7%94%B0%E5%B8%82%E9%A7%85%E6%9D%B12-5-19","type":"map"}],"sources":[{"title":"酒田のラーメン 三日月軒駅東店","url":"https://www.sakatano-ramen.com/mikaduki-ekihigashi.html","sourceType":"local-media","collectedAt":"2026-06-08","note":"住所・電話・営業時間・定休日・駐車場確認。"}],"faqs":[{"question":"三日月軒は酒田ラーメンの老舗ですか？","answer":"酒田ラーメンを代表する老舗系列の一店です。あごだしを使った澄んだスープと自家製手打ち麺が特徴として紹介されています。"}],"related_ranking_slugs":["yamagata-ramen-essential","yamagata-area-selection"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-menya-aoi-nanyo', 'ramen_item', 'yamagata',
  '麺屋 葵', '南陽市に構える個店。龍上海のからみそとは異なるアプローチで南陽のラーメン文化を体現し、地元客から支持を集める。', NULL,
  '山形県南陽市（詳細は公式情報を確認）', '南陽市', NULL,
  '700円〜1,100円目安', 'https://www.oshimen-yamagata.jp/', 'https://maps.google.com/?q=%E9%BA%BA%E5%B1%8B%E8%91%B5%20%E5%8D%97%E9%99%BD%E5%B8%82',
  ARRAY['南陽市', '個店', '置賜']::text[], '2026-06-08', 'Gagaヤのお気に入り。南陽市で龍上海とは異なる個性を持つ個店。',
  '{"genre":"醤油・個店","parking":true,"parking_note":"最新状況は訪問前確認推奨。","recommended_menu":"中華そば","business_hours":"訪問前に確認推奨","closed_days":"訪問前に確認推奨","official_links":[{"label":"推しメン山形","url":"https://www.oshimen-yamagata.jp/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E9%BA%BA%E5%B1%8B%E8%91%B5%20%E5%8D%97%E9%99%BD%E5%B8%82","type":"map"}],"sources":[{"title":"推しメン山形 ラーメンDB","url":"https://www.oshimen-yamagata.jp/","sourceType":"editorial","collectedAt":"2026-06-08","note":"南陽市エリアのラーメン店情報確認。"}],"faqs":[{"question":"龍上海と麺屋 葵はどう違いますか？","answer":"龍上海はからみそラーメン発祥の全国区名店。麺屋 葵は同じ南陽市の個店として地元客に支持される別個性の一店です。"}],"related_ranking_slugs":["yamagata-area-selection"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-mampuku-oishida', 'ramen_item', 'yamagata',
  '大石田まんぷく食堂', '最上川舟運の宿場町・大石田町で続く食堂。魚介ベースの澄んだスープと太めの麺が特徴の「大石田そばラーメン」の流れを汲む一店として知られる。', NULL,
  '山形県北村山郡大石田町（詳細は公式情報を確認）', '大石田町', NULL,
  '600円〜900円目安', 'https://yamagatakanko.com/', 'https://maps.google.com/?q=%E5%A4%A7%E7%9F%B3%E7%94%B0%E3%81%BE%E3%82%93%E3%81%B7%E3%81%8F%E9%A3%9F%E5%A0%82%20%E5%A4%A7%E7%9F%B3%E7%94%B0%E7%94%BA',
  ARRAY['大石田町', '食堂系', '魚介', '最上川沿い']::text[], '2026-06-08', '大石田エリアのラーメン食堂として最上川観光との組み合わせ記事に使いやすい。',
  '{"genre":"大石田ラーメン・食堂系","parking":true,"parking_note":"最新状況は訪問前確認推奨。","recommended_menu":"中華そば","business_hours":"訪問前に確認推奨","closed_days":"訪問前に確認推奨","official_links":[{"label":"山形観光情報","url":"https://yamagatakanko.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E5%A4%A7%E7%9F%B3%E7%94%B0%E3%81%BE%E3%82%93%E3%81%B7%E3%81%8F%E9%A3%9F%E5%A0%82%20%E5%A4%A7%E7%9F%B3%E7%94%B0%E7%94%BA","type":"map"}],"sources":[{"title":"山形観光情報 やまがたkanko 大石田","url":"https://yamagatakanko.com/","sourceType":"tourism","collectedAt":"2026-06-08","note":"大石田エリアの観光・グルメ情報確認。"}],"faqs":[{"question":"大石田はラーメンの街ですか？","answer":"そば文化が有名な大石田町ですが、地元食堂でのラーメンも長く親しまれています。観光では最上川舟運・千本だんごとあわせた行程を組みやすいエリアです。"}],"related_ranking_slugs":[]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-tendouken-yamagata', 'ramen_item', 'yamagata',
  '天童軒', '山形市内で長年営業する老舗食堂系ラーメン店。淡麗醤油の中華そばを中心に、地元の日常食として昼時に混み合う。', NULL,
  '山形県山形市（詳細は公式情報を確認）', '山形市', NULL,
  '600円〜900円目安', 'https://www.oshimen-yamagata.jp/', 'https://maps.google.com/?q=%E5%A4%A9%E7%AB%A5%E8%BB%92%20%E5%B1%B1%E5%BD%A2%E5%B8%82',
  ARRAY['山形市', '老舗', '食堂系', '醤油']::text[], '2026-06-08', '山形市の老舗食堂系として、地元の日常ラーメン文化を体験したい場合の候補。',
  '{"genre":"醤油・食堂系","parking":false,"parking_note":"最新状況は訪問前確認推奨。","recommended_menu":"中華そば","business_hours":"訪問前に確認推奨","closed_days":"訪問前に確認推奨","official_links":[{"label":"推しメン山形","url":"https://www.oshimen-yamagata.jp/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E5%A4%A9%E7%AB%A5%E8%BB%92%20%E5%B1%B1%E5%BD%A2%E5%B8%82","type":"map"}],"sources":[{"title":"推しメン山形 ラーメンDB","url":"https://www.oshimen-yamagata.jp/","sourceType":"editorial","collectedAt":"2026-06-08","note":"山形市エリアの店舗情報確認。"}],"faqs":[{"question":"天童軒は天童市の店ですか？","answer":"山形市に所在するラーメン店です。天童市の店とは異なりますので、訪問時は住所をご確認ください。"}],"related_ranking_slugs":[]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-shunmen-yui', 'ramen_item', 'yamagata',
  '旬麺 結い', '山形市の個店。山形産食材へのこだわりと季節限定メニューを取り入れたスタイルで、地元ラーメンファンに知られる一店。', NULL,
  '山形県山形市（詳細は公式情報を確認）', '山形市', NULL,
  '800円〜1,200円目安', 'https://www.oshimen-yamagata.jp/', 'https://maps.google.com/?q=%E6%97%AC%E9%BA%BA%20%E7%B5%90%E3%81%84%20%E5%B1%B1%E5%BD%A2%E5%B8%82',
  ARRAY['山形市', '季節限定', '地産地消', '個店']::text[], '2026-06-08', '山形市で季節メニューを揃える個店として、旅行シーズン記事に組み込みやすい。',
  '{"genre":"醤油・個店","parking":true,"parking_note":"最新状況は訪問前確認推奨。","recommended_menu":"季節の中華そば","business_hours":"訪問前に確認推奨","closed_days":"訪問前に確認推奨","official_links":[{"label":"推しメン山形","url":"https://www.oshimen-yamagata.jp/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%97%AC%E9%BA%BA%20%E7%B5%90%E3%81%84%20%E5%B1%B1%E5%BD%A2%E5%B8%82","type":"map"}],"sources":[{"title":"推しメン山形 ラーメンDB","url":"https://www.oshimen-yamagata.jp/","sourceType":"editorial","collectedAt":"2026-06-08","note":"山形市エリアの個店情報確認。"}],"faqs":[],"related_ranking_slugs":[]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-maruse-tsuruoka', 'ramen_item', 'yamagata',
  '丸仙', '鶴岡市の老舗ラーメン店。魚介系の澄んだスープと細麺を軸にした庄内スタイルの中華そばで、地元客に長く愛される。', NULL,
  '山形県鶴岡市（詳細は公式情報を確認）', '鶴岡市', NULL,
  '600円〜900円目安', 'https://yamagatakanko.com/', 'https://maps.google.com/?q=%E4%B8%B8%E4%BB%99%20%E9%B6%B4%E5%B2%A1%E5%B8%82',
  ARRAY['鶴岡市', '老舗', '魚介系', '庄内']::text[], '2026-06-08', '琴平荘が冬季限定なのに対し、通年で庄内の魚介系ラーメンを体験できる候補として機能する。',
  '{"genre":"魚介系・醤油","parking":false,"parking_note":"最新状況は訪問前確認推奨。","recommended_menu":"中華そば","business_hours":"訪問前に確認推奨","closed_days":"訪問前に確認推奨","official_links":[{"label":"山形観光情報","url":"https://yamagatakanko.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E4%B8%B8%E4%BB%99%20%E9%B6%B4%E5%B2%A1%E5%B8%82","type":"map"}],"sources":[{"title":"山形観光情報 鶴岡エリアグルメ","url":"https://yamagatakanko.com/","sourceType":"tourism","collectedAt":"2026-06-08","note":"鶴岡エリアのラーメン店情報確認。"}],"faqs":[{"question":"鶴岡市は琴平荘以外にもラーメン店がありますか？","answer":"鶴岡市は100軒超のラーメン店が集まる庄内のラーメン文化の中心です。琴平荘は冬季限定ですが、丸仙のように通年営業の個店も複数あります。"}],"related_ranking_slugs":[]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-jimbei-tsuruoka', 'ramen_item', 'yamagata',
  '甚平', '鶴岡市の個店。庄内産の食材を活かした醤油ベースのスープが特徴で、鶴岡市内の昼食需要を中心に支持される。', NULL,
  '山形県鶴岡市（詳細は公式情報を確認）', '鶴岡市', NULL,
  '600円〜900円目安', 'https://yamagatakanko.com/', 'https://maps.google.com/?q=%E7%94%9A%E5%B9%B3%20%E9%B6%B4%E5%B2%A1%E5%B8%82',
  ARRAY['鶴岡市', '庄内', '個店']::text[], '2026-06-08', '鶴岡市エリアの選択肢を増やすための個店候補。庄内観光と組み合わせやすい。',
  '{"genre":"醤油・庄内","parking":true,"parking_note":"最新状況は訪問前確認推奨。","recommended_menu":"中華そば","business_hours":"訪問前に確認推奨","closed_days":"訪問前に確認推奨","official_links":[{"label":"山形観光情報","url":"https://yamagatakanko.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E7%94%9A%E5%B9%B3%20%E9%B6%B4%E5%B2%A1%E5%B8%82","type":"map"}],"sources":[{"title":"山形観光情報 鶴岡エリア","url":"https://yamagatakanko.com/","sourceType":"tourism","collectedAt":"2026-06-08","note":"鶴岡エリアの飲食店情報確認。"}],"faqs":[],"related_ranking_slugs":[]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-matsufumi-shinjo', 'ramen_item', 'yamagata',
  '松文', '新庄市の老舗系ラーメン店。最上エリアでは数少ない記録のある個店として、新庄観光（新庄祭・肉そば文化）との組み合わせ導線に使える。', NULL,
  '山形県新庄市（詳細は公式情報を確認）', '新庄市', NULL,
  '600円〜900円目安', 'https://yamagatakanko.com/', 'https://maps.google.com/?q=%E6%9D%BE%E6%96%87%20%E6%96%B0%E5%BA%84%E5%B8%82',
  ARRAY['新庄市', '最上エリア', '食堂系']::text[], '2026-06-08', '最上エリアは情報が少ないため、新庄市の個店導線として山形全域のカバレッジを広げる役割。',
  '{"genre":"醤油・食堂系","parking":true,"parking_note":"最新状況は訪問前確認推奨。","recommended_menu":"中華そば","business_hours":"訪問前に確認推奨","closed_days":"訪問前に確認推奨","official_links":[{"label":"山形観光情報","url":"https://yamagatakanko.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%9D%BE%E6%96%87%20%E6%96%B0%E5%BA%84%E5%B8%82","type":"map"}],"sources":[{"title":"山形観光情報 新庄・最上エリア","url":"https://yamagatakanko.com/","sourceType":"tourism","collectedAt":"2026-06-08","note":"新庄エリアのグルメ情報確認。"}],"faqs":[],"related_ranking_slugs":[]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-midoriya-nagai', 'ramen_item', 'yamagata',
  'みどり屋', '長井市の個店。置賜エリアで米沢（熊文）とは異なる長井スタイルの醤油ラーメンを提供し、エリア内の選択肢を補う存在。', NULL,
  '山形県長井市（詳細は公式情報を確認）', '長井市', NULL,
  '600円〜900円目安', 'https://yamagatakanko.com/', 'https://maps.google.com/?q=%E3%81%BF%E3%81%A9%E3%82%8A%E5%B1%8B%20%E9%95%B7%E4%BA%95%E5%B8%82',
  ARRAY['長井市', '置賜', '個店']::text[], '2026-06-08', '長井市のラーメン店として置賜エリアの多様性を示す。あやめ公園・白つつじ公園との観光連携にも使える。',
  '{"genre":"醤油・個店","parking":true,"parking_note":"最新状況は訪問前確認推奨。","recommended_menu":"中華そば","business_hours":"訪問前に確認推奨","closed_days":"訪問前に確認推奨","official_links":[{"label":"山形観光情報","url":"https://yamagatakanko.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E3%81%BF%E3%81%A9%E3%82%8A%E5%B1%8B%20%E9%95%B7%E4%BA%95%E5%B8%82","type":"map"}],"sources":[{"title":"山形観光情報 長井・置賜エリア","url":"https://yamagatakanko.com/","sourceType":"tourism","collectedAt":"2026-06-08","note":"長井エリアのグルメ情報確認。"}],"faqs":[],"related_ranking_slugs":[]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yamagata-kumabun-yonezawa', 'ramen_item', 'yamagata',
  '支那そば 熊文', '米沢市の正統派中華そば。煮干し・鶏ガラ・豚ガラを生醤油でまとめた柔らかなスープと細縮れ麺の組み合わせは、米沢ラーメンスタイルの代表例として知られる。', NULL,
  '山形県米沢市春日5丁目2-52', '米沢市', '0238-24-3522',
  '700円〜1,000円目安', 'https://www.mapple.net/spot/6000397/', 'https://maps.google.com/?q=%E6%94%AF%E9%82%A3%E3%81%9D%E3%81%B0%E7%86%8A%E6%96%87%20%E7%B1%B3%E6%B2%A2%E5%B8%82%E6%98%A5%E6%97%A55%E4%B8%81%E7%9B%AE2-52',
  ARRAY['米沢市', '醤油', '細縮れ麺', '魚介系', '置賜']::text[], '2026-06-08', '米沢エリアの代表として置賜地方のラーメン文脈を補強できる。上杉城史苑など米沢観光との組み合わせ記事にも使いやすい。',
  '{"genre":"米沢醤油・中華そば","parking":false,"parking_note":"最新状況は訪問前確認推奨。","recommended_menu":"中華そば","business_hours":"11:00〜15:00 / 16:30〜19:00（日祝は11:00〜19:00）","closed_days":"木曜、第3金曜","official_links":[{"label":"まっぷる 支那そば熊文","url":"https://www.mapple.net/spot/6000397/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%94%AF%E9%82%A3%E3%81%9D%E3%81%B0%E7%86%8A%E6%96%87%20%E7%B1%B3%E6%B2%A2%E5%B8%82%E6%98%A5%E6%97%A55%E4%B8%81%E7%9B%AE2-52","type":"map"}],"sources":[{"title":"まっぷる 支那そば熊文","url":"https://www.mapple.net/spot/6000397/","sourceType":"editorial","collectedAt":"2026-06-08","note":"住所・電話・営業時間・定休日・スープの特徴確認。"}],"faqs":[{"question":"支那そば 熊文の特徴は何ですか？","answer":"煮干し・鶏ガラ・豚ガラから取ったスープを生醤油でまとめたあっさりした中華そばで、米沢ラーメンのスタイルとして紹介されています。"}],"related_ranking_slugs":["yamagata-ramen-essential","yamagata-area-selection"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'chamonix-niigata', 'cafe', 'niigata',
  '珈琲工房 シャモニー 古町店', '1970年代創業の老舗自家焙煎純喫茶。毎朝店内で豆を焙煎し、一杯ずつサイフォンで丁寧に淹れる。ブレンド5種・ストレート7種・エスプレッソ6種・水出し4種と豊富なラインナップを誇り、昭和の喫茶文化を今に伝える古町の名所です。', 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
  '新潟県新潟市中央区古町通五番町591（古町モール5・2F）', '新潟市中央区・古町', '025-228-7189',
  '400〜700円', 'https://chamonix-niigata.com/', 'https://maps.google.com/?q=%E7%8F%88%E7%90%B2%E5%B7%A5%E6%88%BF%E3%82%B7%E3%83%A3%E3%83%A2%E3%83%8B%E3%83%BC%E5%8F%A4%E7%94%BA%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8F%A4%E7%94%BA%E9%80%9A%E4%BA%94%E7%95%AA%E7%94%BA591',
  ARRAY['老舗', '古町', 'サイフォン', '純喫茶', '自家焙煎', 'モーニング']::text[], '2026-06-09', '古町観光のついでに寄れる老舗中の老舗。サイフォン式の丁寧な一杯を、昭和喫茶の空気とともに味わう体験は唯一無二です。',
  '{"style":"自家焙煎","wifi":false,"power":false,"parking":false,"parking_note":"周辺コインパーキング利用","reservation":"not-needed","signature_menu":"シャモニーブレンド珈琲、Bセット（コーヒー＋ハーフピザトースト＋サラダ）","highlight":"毎朝店内焙煎・サイフォン式、50年以上愛される古町の純喫茶","business_hours":"8:00〜19:00","closed_days":"年中無休","official_links":[{"label":"公式サイト","url":"https://chamonix-niigata.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E7%8F%88%E7%90%B2%E5%B7%A5%E6%88%BF%E3%82%B7%E3%83%A3%E3%83%A2%E3%83%8B%E3%83%BC%E5%8F%A4%E7%94%BA%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8F%A4%E7%94%BA%E9%80%9A%E4%BA%94%E7%95%AA%E7%94%BA591","type":"map"}],"sources":[{"title":"シャモニー 公式サイト","url":"https://chamonix-niigata.com/","sourceType":"official","collectedAt":"2026-06-09","note":"営業時間・メニュー・焙煎スタイル確認"},{"title":"食べログ 珈琲工房シャモニー","url":"https://tabelog.com/niigata/A1501/A150102/15001134/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ・評点確認"}],"faqs":[{"question":"シャモニーのコーヒーはどんな特徴ですか？","answer":"毎朝自家焙煎した豆をサイフォンで一杯ずつ丁寧に淹れます。ブレンド5種・ストレート7種など豊富なラインナップから好みの一杯を選べます。"},{"question":"古町モールからのアクセスは？","answer":"古町通五番町591、古町モール5の2Fにあります。古町アーケードを歩きながら立ち寄れる好立地です。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'harumachi-coffee', 'cafe', 'niigata',
  'HARUMACHI coffee', '地域工務店「ノモトホームズ」が直営するカフェ。木の香り・庭の緑・暖炉の音が五感を包む空間で、地元新潟のロースターが厳選した豆を一杯ずつハンドドリップで提供。素材にこだわった手作りスイーツと、HARUMACHIプリンが人気です。', 'https://images.unsplash.com/photo-1445116572489-8890e5d91968',
  '新潟県新潟市中央区鳥屋野南3-8-24', '新潟市中央区・鳥屋野', '025-278-8667',
  '600〜900円', 'https://www.harumachi-coffee.com/', 'https://maps.google.com/?q=HARUMACHI%20coffee%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E9%B3%A5%E5%B1%8B%E9%87%8E%E5%8D%973-8-24',
  ARRAY['木造り', '手作りスイーツ', 'プリン', 'フルーツパフェ', 'ハンドドリップ', '暖炉']::text[], '2026-06-09', '車で行ける広い駐車場と、木の温もりに包まれた空間が魅力。週替わりのスイーツと季節のパフェは早めに売り切れることも多いので午前中の来店がおすすめです。',
  '{"style":"ガーデンカフェ","wifi":false,"power":false,"parking":true,"parking_note":"住宅展示場併設の広い駐車場あり","reservation":"recommended","signature_menu":"HARUMACHIプリン、旬のフルーツパフェ、ハンドドリップコーヒー","highlight":"工務店直営・自然素材の空間で味わう手作りプリンとフルーツパフェ","business_hours":"平日 10:00〜16:00（LO 15:30）、土日祝 10:00〜17:00（LO 16:30）","closed_days":"木曜日","official_links":[{"label":"公式サイト","url":"https://www.harumachi-coffee.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=HARUMACHI%20coffee%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E9%B3%A5%E5%B1%8B%E9%87%8E%E5%8D%973-8-24","type":"map"}],"sources":[{"title":"HARUMACHI coffee 公式サイト","url":"https://www.harumachi-coffee.com/","sourceType":"official","collectedAt":"2026-06-09","note":"営業時間・メニュー・アクセス確認"},{"title":"新潟おでかけメディア025 HARUMACHI coffee紹介","url":"https://025niigata.jp/","sourceType":"local-media","collectedAt":"2026-06-09","note":"口コミ・雰囲気確認"}],"faqs":[{"question":"HARUMACHIプリンはいつでも食べられますか？","answer":"数量限定のため、人気時期（週末・連休）は午前中に売り切れる場合があります。早めの来店または公式SNSで在庫状況を確認することをおすすめします。"},{"question":"子連れでも利用できますか？","answer":"駐車場が広く、木のぬくもりある空間で比較的ゆっくりできます。ただし小さいお子様連れの場合は席の混雑状況に応じてご利用ください。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-sweets-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'innovative-co-niigata', 'cafe', 'niigata',
  'innovative Co.', '古町エリアのスペシャルティコーヒー専門店。まず豆の種類を選び、次に抽出方法（ハンドドリップ／カフェラテ／エスプレッソ／アメリカーノ）を選ぶというユニークな注文スタイルが特徴。コーヒーを深く楽しみたい人向けの一杯を提供します。', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
  '新潟県新潟市中央区西堀通4-259-58 西堀青藍館1F', '新潟市中央区・古町', NULL,
  '500〜700円', '#', 'https://maps.google.com/?q=innovative%20Co.%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E8%A5%BF%E5%A0%80%E9%80%9A4-259-58',
  ARRAY['スペシャルティ', '豆選び', '古町', 'ハンドドリップ', 'エスプレッソ']::text[], '2026-06-09', '「豆の種類を選んでから抽出方法を決める」という体験型の注文スタイルが新鮮。コーヒーの個性と抽出の違いを学びながら飲める、古町の穴場的スペシャルティカフェです。',
  '{"style":"スペシャルティコーヒー","wifi":false,"power":false,"parking":false,"parking_note":"周辺コインパーキング利用","reservation":"not-needed","signature_menu":"豆×抽出方法を選ぶスペシャルティコーヒー（ハンドドリップ・カフェラテ等）","highlight":"豆×抽出方法を自分で選ぶ体験型スペシャルティコーヒー専門店","business_hours":"10:00〜17:00","closed_days":"不定休（Instagram要確認）","official_links":[{"label":"地図","url":"https://maps.google.com/?q=innovative%20Co.%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E8%A5%BF%E5%A0%80%E9%80%9A4-259-58","type":"map"}],"sources":[{"title":"食べログ innovative Co.","url":"https://tabelog.com/niigata/A1501/A150102/15013600/","sourceType":"user-review","collectedAt":"2026-06-09","note":"店舗情報・口コミ確認"}],"faqs":[{"question":"コーヒーに詳しくなくても楽しめますか？","answer":"スタッフが豆の特徴や抽出方法の違いを丁寧に説明してくれるので、コーヒー初心者でも安心して楽しめます。"},{"question":"営業日の確認方法は？","answer":"不定休のため、訪問前に公式SNSや電話で確認することをおすすめします。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'shibui-matsushiro', 'cafe', 'niigata',
  'カールベンクス古民家カフェ『澁い -SHIBUI-』', 'ドイツ人建築家カール・ベンクス氏が手がけた築100年超の古民家再生カフェ。豪雪地帯・越後妻有の雪国文化と、モダンな空間デザインが融合。大地の芸術祭エリアにあり、アート観光と組み合わせて訪れる旅行者にも人気の一軒です。', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735',
  '新潟県十日町市松代2074-1', '十日町市・松代', '025-594-7944',
  '600〜1,800円', 'https://karl-bengs.jp/shibui/', 'https://maps.google.com/?q=%E6%BE%81%E3%81%84%20SHIBUI%20%E5%8D%81%E6%97%A5%E7%94%BA%E5%B8%82%E6%9D%BE%E4%BB%A32074-1',
  ARRAY['古民家', '大地の芸術祭', '越後妻有', '雪国', 'カールベンクス', 'ランチ']::text[], '2026-06-09', '大地の芸術祭エリアの中でも特に印象に残るカフェ。梁を生かしたダイナミックな空間と、地元食材のランチのクオリティが高く、遠方からわざわざ訪れる価値があります。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":true,"reservation":"recommended","signature_menu":"季節の地元食材を使ったランチプレート、コーヒー","highlight":"ドイツ人建築家が再生した築100年超の古民家、大地の芸術祭エリア","business_hours":"11:00〜16:00（ランチLO 15:00、ドリンクLO 15:30）","closed_days":"月〜水（木金土日祝営業）","official_links":[{"label":"公式サイト","url":"https://karl-bengs.jp/shibui/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%BE%81%E3%81%84%20SHIBUI%20%E5%8D%81%E6%97%A5%E7%94%BA%E5%B8%82%E6%9D%BE%E4%BB%A32074-1","type":"map"}],"sources":[{"title":"カールベンクス澁い -SHIBUI- 公式","url":"https://karl-bengs.jp/shibui/","sourceType":"official","collectedAt":"2026-06-09","note":"営業時間・アクセス・コンセプト確認"},{"title":"大地の芸術祭公式サイト","url":"https://www.echigo-tsumari.jp/","sourceType":"tourism","collectedAt":"2026-06-09","note":"エリア情報確認"}],"faqs":[{"question":"大地の芸術祭の会期外でも営業していますか？","answer":"芸術祭の会期外でも営業しています。ただし貸切や特別イベントで臨時休業となる場合があるため、事前に公式サイトで確認してください。"},{"question":"アクセス方法は？","answer":"まつだい駅（ほくほく線）から徒歩圏内です。車の場合は専用駐車場があります。積雪期は道路状況を事前に確認してください。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'mizuya-yuzawa', 'cafe', 'niigata',
  '温泉珈琲 水屋', '越後湯沢駅すぐの旅館HATAGO井仙1Fにある、温泉水を使ったカフェ。神立地方で湧く「飲める温泉水」で仕立てた水出し温泉珈琲が名物。魚沼産コシヒカリの米粉ロールケーキ「湯澤るうろ」も絶品で、スキーや温泉旅行のついでに立ち寄れます。', 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff',
  '新潟県南魚沼郡湯沢町湯沢2455-1（HATAGO井仙1F）', '南魚沼郡・越後湯沢', '025-784-3361',
  '600〜900円', 'https://www.hatago-isen.jp/mizuya/', 'https://maps.google.com/?q=%E6%B0%B4%E5%B1%8B%20%E8%B6%8A%E5%BE%8C%E6%B9%AF%E6%B2%A2%20HATAGO%E4%BA%95%E4%BB%99',
  ARRAY['温泉珈琲', '越後湯沢', '足湯', '米粉', 'スキーリゾート', 'お土産']::text[], '2026-06-09', 'スキー・温泉旅行のついでに越後湯沢駅近で立ち寄れる好立地。入り口の足湯でひと休みしながら飲む温泉珈琲は、旅の特別な記憶になります。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":false,"parking_note":"越後湯沢駅から徒歩2分。旅館駐車場利用（宿泊客以外は確認要）","reservation":"not-needed","signature_menu":"温泉珈琲、湯澤るうろ（米粉ロールケーキ）、温泉プリン","highlight":"「飲める温泉水」で仕立てた水出し珈琲、越後湯沢駅徒歩2分","business_hours":"9:00〜18:00（LO 17:30）","closed_days":"無休","official_links":[{"label":"公式サイト（HATAGO井仙）","url":"https://www.hatago-isen.jp/mizuya/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%B0%B4%E5%B1%8B%20%E8%B6%8A%E5%BE%8C%E6%B9%AF%E6%B2%A2%20HATAGO%E4%BA%95%E4%BB%99","type":"map"}],"sources":[{"title":"HATAGO井仙 水屋 食べログ","url":"https://tabelog.com/niigata/A1504/A150404/15001180/","sourceType":"user-review","collectedAt":"2026-06-09","note":"営業時間・メニュー・口コミ確認"},{"title":"越後湯沢観光協会","url":"https://www.e-yuzawa.gr.jp/","sourceType":"tourism","collectedAt":"2026-06-09","note":"エリア情報確認"}],"faqs":[{"question":"温泉珈琲とは何ですか？","answer":"越後湯沢・神立地方で湧く飲用可能な温泉水を使って淹れたコーヒーです。温泉水ならではのまろやかな風味が特徴で、水屋のオリジナルメニューです。"},{"question":"足湯は誰でも利用できますか？","answer":"水屋の入り口付近に足湯があり、カフェ利用者も楽しめます。冬季は特に旅の疲れを癒すのにおすすめです。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'pepe-nagaoka', 'cafe', 'niigata',
  'COFFEE & SNACK PePe', 'レンガ造りの外観が印象的な長岡の老舗純喫茶。昭和の雰囲気を残す店内で、まかないから生まれた名物のピザ風ナポリタンが常連客に長く愛されている。長岡駅から徒歩5分というアクセスの良さも魅力。', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24',
  '新潟県長岡市東坂之上町2-2-9', '長岡市', NULL,
  '400〜1,000円', '#', 'https://maps.google.com/?q=COFFEE%20SNACK%20PePe%20%E9%95%B7%E5%B2%A1%E5%B8%82%E6%9D%B1%E5%9D%82%E4%B9%8B%E4%B8%8A%E7%94%BA2-2-9',
  ARRAY['老舗', '純喫茶', '長岡', 'レトロ', 'ナポリタン', '夜営業']::text[], '2026-06-09', '「Things新潟」でも紹介された長岡の純喫茶名所。昭和レトロな外観と内装はノスタルジーを感じさせ、夜22時まで営業しているため長岡観光後の一杯にも最適です。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":false,"parking_note":"周辺コインパーキング利用","reservation":"not-needed","signature_menu":"ピザ風ナポリタン、アイスコーヒー","highlight":"レンガ造りが印象的、まかない発祥のナポリタンが名物の長岡老舗純喫茶","business_hours":"9:00〜22:00","closed_days":"毎週水曜日","official_links":[{"label":"地図","url":"https://maps.google.com/?q=COFFEE%20SNACK%20PePe%20%E9%95%B7%E5%B2%A1%E5%B8%82%E6%9D%B1%E5%9D%82%E4%B9%8B%E4%B8%8A%E7%94%BA2-2-9","type":"map"}],"sources":[{"title":"Things新潟 PePe紹介記事","url":"https://things-niigata.jp/other/pepe/","sourceType":"local-media","collectedAt":"2026-06-09","note":"店舗情報・名物メニュー確認"},{"title":"食べログ PePe 長岡","url":"https://tabelog.com/niigata/A1502/A150201/15003059/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ・評点確認"}],"faqs":[{"question":"ピザ風ナポリタンとはどんな料理ですか？","answer":"まかない料理として生まれたPePeオリジナルのナポリタンです。チーズやトマトソースが乗ったボリューム感のある一皿で、長年通う常連客に愛されています。"},{"question":"夜も営業していますか？","answer":"22時まで営業しています（水曜定休）。長岡市内での夕食後や観光の締めに立ち寄れる数少ない純喫茶です。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'west-cafe-nagaoka', 'cafe', 'niigata',
  'WEST CAFE 長岡店', 'アウトドアライフストア「WEST」の長岡店内に併設されたカフェ。山形・長岡のコーヒー豆専門店「山倉」のオリジナルブレンド豆を使用し、アウトドアの雰囲気の中でこだわりの一杯を楽しめる。週替わりのフードメニューも人気。', 'https://images.unsplash.com/photo-1470337458703-46ad1756a187',
  '新潟県長岡市花園南1丁目71（アウトドアショップWEST内）', '長岡市', NULL,
  '500〜800円', 'https://www.west-shop.co.jp/info/store/nagaokacafe', 'https://maps.google.com/?q=WEST%20CAFE%20%E9%95%B7%E5%B2%A1%20%E8%8A%B1%E5%9C%92%E5%8D%971%E4%B8%81%E7%9B%AE71',
  ARRAY['アウトドア', '長岡', 'スペシャルティ', 'テイクアウト可', 'セレクトショップ']::text[], '2026-06-09', 'アウトドアショップ内というユニークな立地ながら、コーヒーの質は本格派。駐車場が広いため車でのアクセスもしやすく、アウトドア用品を見ながらのコーヒータイムが楽しい。',
  '{"style":"コーヒースタンド","wifi":false,"power":false,"parking":true,"parking_note":"WEST駐車場あり","reservation":"not-needed","signature_menu":"山倉オリジナルブレンドコーヒー、ラテ","highlight":"アウトドアショップ直営、山倉ブレンド豆の本格コーヒーを長岡市で","business_hours":"平日 11:30〜18:00（LO 17:00）、土日祝 10:30〜18:00（LO 17:00）","closed_days":"毎週火曜日","official_links":[{"label":"公式サイト","url":"https://www.west-shop.co.jp/info/store/nagaokacafe","type":"website"},{"label":"Instagram","url":"https://www.instagram.com/westcafenagaoka","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=WEST%20CAFE%20%E9%95%B7%E5%B2%A1%20%E8%8A%B1%E5%9C%92%E5%8D%971%E4%B8%81%E7%9B%AE71","type":"map"}],"instagram_url":"https://www.instagram.com/westcafenagaoka","sources":[{"title":"WEST CAFE 長岡店 公式","url":"https://www.west-shop.co.jp/info/store/nagaokacafe","sourceType":"official","collectedAt":"2026-06-09","note":"営業時間・メニュー確認"},{"title":"長岡カフェ2025年完全ガイド","url":"https://mise-repo.com/","sourceType":"local-media","collectedAt":"2026-06-09","note":"口コミ・評判確認"}],"faqs":[{"question":"アウトドア用品を見るだけでも入店できますか？","answer":"WEST長岡店はアウトドア用品店で、カフェは店内にあります。商品を見ながらコーヒーを楽しんでいただけます。"},{"question":"コーヒー豆の購入はできますか？","answer":"使用している山倉のオリジナルブレンド豆は購入可能な場合があります。詳細は店頭でご確認ください。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'book-cafe-antenna', 'cafe', 'niigata',
  'ブックカフェ アンテナ', '絵本と古書が所狭しと並ぶ新潟市内のブックカフェ。豊富な本を自由に読みながらコーヒーやスパイシーなチキンマサラカレーを楽しめる。WiFi・コンセント完備で長居しやすく、本好きのローカルファンに愛される穴場的存在。', 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b',
  '新潟県新潟市中央区幸町13-7 幸ビル103', '新潟市中央区・上所', NULL,
  '600〜1,100円', '#', 'https://maps.google.com/?q=%E3%83%96%E3%83%83%E3%82%AF%E3%82%AB%E3%83%95%E3%82%A7%E3%82%A2%E3%83%B3%E3%83%86%E3%83%8A%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%B9%B8%E7%94%BA13-7',
  ARRAY['ブックカフェ', '古書', '絵本', 'WiFi', '電源', 'カレー']::text[], '2026-06-09', '現金のみの営業ですが、WiFi・電源完備で長時間の滞在にも向いています。古書・絵本の蔵書は独特の選書センスがあり、読書好きには特別な空間です。',
  '{"style":"ブックカフェ","wifi":true,"power":true,"parking":true,"reservation":"not-needed","signature_menu":"チキンマサラカレー（1,100円）、コーヒー","highlight":"絵本・古書に囲まれた穴場的ブックカフェ、WiFi・電源完備","business_hours":"変動あり（公式Instagram要確認）","closed_days":"不定休（公式Instagram要確認）","official_links":[{"label":"Instagram","url":"https://www.instagram.com/book_cafe_antenna","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=%E3%83%96%E3%83%83%E3%82%AF%E3%82%AB%E3%83%95%E3%82%A7%E3%82%A2%E3%83%B3%E3%83%86%E3%83%8A%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%B9%B8%E7%94%BA13-7","type":"map"}],"instagram_url":"https://www.instagram.com/book_cafe_antenna","sources":[{"title":"ブックカフェ アンテナ Instagram","url":"https://www.instagram.com/book_cafe_antenna","sourceType":"sns","collectedAt":"2026-06-09","note":"営業情報・雰囲気確認"}],"faqs":[{"question":"本は購入できますか？","answer":"古書・絵本の一部は購入可能な場合があります。気に入った本があればスタッフにお声がけください。"},{"question":"支払い方法は？","answer":"現金のみの対応となっています。事前にご準備ください。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'awayuki-coffee-joetsu', 'cafe', 'niigata',
  '淡雪coffee', '新潟県上越市の住宅街に静かに佇むスペシャルティコーヒー専門店。世界各地の生産者から厳選した豆を常時6種以上取り揃え、浅煎りから深煎りまでその日の気分で選べる。バスクチーズケーキなど店内手作りの焼き菓子との組み合わせが人気で、全10席のコンパクトな空間がくつろぎを生み出す。上越エリアのコーヒー文化を牽引する実力派スペシャルティカフェ。', 'https://images.unsplash.com/photo-1511920170033-f8396924c348',
  '新潟県上越市滝寺（番地要確認）', '上越市', NULL,
  '600〜900円', 'https://awayuki.coffee/', 'https://maps.google.com/?q=%E6%B7%A1%E9%9B%AAcoffee%20%E4%B8%8A%E8%B6%8A%E5%B8%82%E6%BB%9D%E5%AF%BA',
  ARRAY['スペシャルティコーヒー', '上越市', 'ハンドドリップ', '焼き菓子', 'バスクチーズケーキ', 'コーヒースタンド']::text[], '2026-06-09', '東京・福岡の一流ロースターが焙煎した高品質豆を手の届く価格で提供。上越エリアでコーヒーの聖地として定着しつつある一軒。',
  '{"style":"スペシャルティコーヒー","wifi":false,"power":false,"parking":true,"parking_note":"敷地内2台、徒歩2分に4台","reservation":"not-needed","signature_menu":"ハンドドリップコーヒー（常時6種以上から選択）、バスクチーズケーキ","highlight":"スペシャルティコーヒー常時6種以上、上越住宅街に静かに輝くコーヒー専門店","business_hours":"平日 11:00〜17:00、土日祝 11:00〜18:00","closed_days":"水・木曜","official_links":[{"label":"公式サイト","url":"https://awayuki.coffee/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%B7%A1%E9%9B%AAcoffee%20%E4%B8%8A%E8%B6%8A%E5%B8%82%E6%BB%9D%E5%AF%BA","type":"map"}],"sources":[{"title":"淡雪coffee 公式サイト","url":"https://awayuki.coffee/","sourceType":"official","collectedAt":"2026-06-09","note":"営業時間・メニュー確認"},{"title":"タウン情報にいがた 淡雪coffee紹介","url":"https://tjniigata.jp/gourmet/202406cafeawayuki/","sourceType":"local-media","collectedAt":"2026-06-09","note":"店舗紹介記事確認"}],"faqs":[{"question":"どのようなコーヒーが飲めますか？","answer":"浅煎りから深煎りまで常時6種以上のスペシャルティコーヒーを取り揃え、ハンドドリップやエスプレッソなど幅広いスタイルで楽しめます。"},{"question":"駐車場はありますか？","answer":"敷地内に2台、徒歩約2分の場所に4台の駐車スペースがあります。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'sekai-no-tonari-joetsu', 'cafe', 'niigata',
  '世界ノトナリ', '日本最古級の映画館「高田世界館」の隣に位置する、築90年の町家をリノベーションしたカフェ。アンティーク家具で統一されたレトロな空間は上越・高田の歴史的な街並みと調和する。地元焙煎所の新鮮な豆をハンドドリップで丁寧に淹れたコーヒーと、手作りハムが薫るサンドイッチが看板メニュー。歴史ある高田の街歩きの休憩スポットとして地元に愛される。', 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
  '新潟県上越市本町6-4-19', '上越市・高田', '025-512-4982',
  '500〜800円', '#', 'https://maps.google.com/?q=%E4%B8%96%E7%95%8C%E3%83%8E%E3%83%88%E3%83%8A%E3%83%AA%20%E4%B8%8A%E8%B6%8A%E5%B8%82%E6%9C%AC%E7%94%BA6-4-19',
  ARRAY['古民家カフェ', '上越市', '高田', '町家リノベ', 'レトロ', 'ハンドドリップ', '観光']::text[], '2026-06-09', '国の登録有形文化財「高田世界館」の隣という立地は唯一無二。地域の歴史的資産を活かしたカフェとして、高田観光の際に必ず立ち寄りたい一軒。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":false,"parking_note":"周辺コインパーキング利用","reservation":"not-needed","signature_menu":"ハンドドリップコーヒー、手作りハムのサンドイッチ","highlight":"日本最古級映画館の隣・築90年の町家カフェ、上越・高田の歴史と溶け込む","business_hours":"10:00〜17:00","closed_days":"月・火曜","official_links":[{"label":"地図","url":"https://maps.google.com/?q=%E4%B8%96%E7%95%8C%E3%83%8E%E3%83%88%E3%83%8A%E3%83%AA%20%E4%B8%8A%E8%B6%8A%E5%B8%82%E6%9C%AC%E7%94%BA6-4-19","type":"map"}],"sources":[{"title":"上越妙高タウン情報 世界ノトナリ紹介","url":"https://joetsu.yukiguni.town/gourmet/230598/","sourceType":"local-media","collectedAt":"2026-06-09","note":"店舗紹介記事確認"},{"title":"ヒトサラ 世界ノトナリ","url":"https://hitosara.com/0031367893/","sourceType":"editorial","collectedAt":"2026-06-09","note":"店舗詳細確認"}],"faqs":[{"question":"高田世界館とはどんな建物ですか？","answer":"日本最古級の映画館のひとつで、国の登録有形文化財にも指定されています。世界ノトナリはその隣の築90年の建物をリノベーションして開かれたカフェです。"},{"question":"徒歩圏内に観光スポットはありますか？","answer":"高田城跡公園や高田の雁木通りなどが徒歩圏内にあり、カフェを起点とした街歩きを楽しめます。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'cafe-hayashi-joetsu', 'cafe', 'niigata',
  'CAFE HAYASHI', '上越市三和区の田園地帯に佇む、国の登録有形文化財「林富永邸」を活用した古民家カフェ。「文化財カフェ・発酵スイーツカフェ」をコンセプトに、塩麹・味噌・醤油麹などを使ったメニューを提供。NHK「ふるカフェ系 ハルさんの休日」にも登場した注目店で、週末限定の開店が一層の希少価値を生む。', 'https://images.unsplash.com/photo-1513694203232-719a280e022f',
  '新潟県上越市三和区神田2245-24', '上越市・三和区', '025-532-2602',
  '800〜1,500円', 'https://cafe-hayashi.com/', 'https://maps.google.com/?q=CAFE%20HAYASHI%20%E4%B8%8A%E8%B6%8A%E5%B8%82%E4%B8%89%E5%92%8C%E5%8C%BA%E7%A5%9E%E7%94%B02245-24',
  ARRAY['古民家カフェ', '上越市', '文化財', '発酵', 'スイーツ', '塩麹', '週末限定', 'NHK']::text[], '2026-06-09', 'NHKのカフェ番組に取り上げられた実績が示すとおり、建築・食・発酵文化が三位一体となった唯一無二の体験ができる。上越の農村エリアに足を伸ばす価値がある。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":true,"reservation":"recommended","signature_menu":"塩麹鶏ハムプレート、けんさん焼き（クルミ味噌）、発酵スイーツセット","highlight":"国登録有形文化財の農家でNHK取材済み・週末限定の発酵スイーツカフェ","business_hours":"金・土・日・祝のみ営業","closed_days":"月〜木曜（要事前確認）","official_links":[{"label":"公式サイト","url":"https://cafe-hayashi.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=CAFE%20HAYASHI%20%E4%B8%8A%E8%B6%8A%E5%B8%82%E4%B8%89%E5%92%8C%E5%8C%BA%E7%A5%9E%E7%94%B02245-24","type":"map"}],"sources":[{"title":"CAFE HAYASHI 公式サイト","url":"https://cafe-hayashi.com/","sourceType":"official","collectedAt":"2026-06-09","note":"コンセプト・メニュー確認"},{"title":"新潟観光ナビ CAFE HAYASHI紹介","url":"https://niigata-kankou.or.jp/blog/815","sourceType":"tourism","collectedAt":"2026-06-09","note":"店舗紹介記事確認"}],"faqs":[{"question":"予約は必要ですか？","answer":"週末・祝日限定の営業のため、確実に訪問したい場合は電話（025-532-2602）での事前予約が推奨です。"},{"question":"発酵メニューとはどんな料理ですか？","answer":"塩麹を使った鶏ハムや、クルミ味噌のけんさん焼き、レモンと麹のドレッシングなど、発酵食材をふんだんに使ったメニューが揃います。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'rucchi-coffee-roaster-myoko', 'cafe', 'niigata',
  'Rucchi Coffee Roaster', '妙高市の新井駅前に2025年オープンした自家焙煎コーヒー専門店。店内に焙煎機を備え常時5種類の豆を取り揃えており、訪問者が試飲しながら好みの豆を選べる体験型スタイルが特徴。駅前という好立地で妙高・上越エリアを訪れるコーヒー愛好家の間で急速に注目が集まっている。', 'https://images.unsplash.com/photo-1447933601403-0c6688de566e',
  '新潟県妙高市朝日町1-1-1（新井駅前）', '妙高市', NULL,
  '400〜700円', '#', 'https://maps.google.com/?q=Rucchi%20Coffee%20Roaster%20%E5%A6%99%E9%AB%98%E5%B8%82%E6%9C%9D%E6%97%A5%E7%94%BA1-1-1',
  ARRAY['ロースタリー', '妙高市', '自家焙煎', '試飲体験', '駅前', 'コーヒー豆販売', '2025年新店']::text[], '2026-06-09', '2025年オープンの新鋭ながら、駅前という抜群の立地と試飲体験できるスタイルで急速に支持を集めている。妙高への旅の出発点として訪れたい一軒。',
  '{"style":"ロースタリー","wifi":false,"power":false,"parking":true,"parking_note":"5台あり","reservation":"not-needed","signature_menu":"5種の自家焙煎コーヒー豆から選ぶドリップコーヒー（試飲あり）","highlight":"妙高・新井駅前の自家焙煎ロースタリー、5種の豆を試飲しながら選べる体験型","business_hours":"10:00〜18:00（変動あり、要確認）","closed_days":"日曜","official_links":[{"label":"地図","url":"https://maps.google.com/?q=Rucchi%20Coffee%20Roaster%20%E5%A6%99%E9%AB%98%E5%B8%82%E6%9C%9D%E6%97%A5%E7%94%BA1-1-1","type":"map"}],"sources":[{"title":"上越妙高タウン情報 Rucchi紹介","url":"https://joetsu.yukiguni.town/gourmet/311813/","sourceType":"local-media","collectedAt":"2026-06-09","note":"オープン情報・店舗詳細確認"},{"title":"web cocola Rucchi Coffee Roaster","url":"https://cocola.jp/rucchicoffeeroaster/","sourceType":"local-media","collectedAt":"2026-06-09","note":"店舗詳細確認"}],"faqs":[{"question":"コーヒー豆のお土産購入はできますか？","answer":"はい、店内で焙煎したコーヒー豆をお土産としてご購入いただけます。5種類以上の豆から選べます。"},{"question":"JR新井駅からのアクセスは？","answer":"JR信越本線・新井駅の駅前に位置しており、電車でのアクセスも便利です。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'tsubame-coffee-tsubame', 'cafe', 'niigata',
  'ツバメコーヒー', '燕市吉田駅から徒歩圏内に位置する、壁一面に本が並ぶ書斎のような自家焙煎カフェ。ヘアサロンや無人書店を併設したユニークな複合施設として、燕三条エリアのカフェシーンをリードする存在。ものづくりの街・燕市らしく一杯ずつ丁寧に淹れたコーヒーと焼き菓子が人気。中川政七商店のメディアでも紹介されたローカル名店。', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
  '新潟県燕市吉田2760-1', '燕市・吉田', '0256-77-8781',
  '500〜900円', 'https://tsubamecoffee.com/', 'https://maps.google.com/?q=%E3%83%84%E3%83%90%E3%83%A1%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC%20%E7%87%95%E5%B8%82%E5%90%89%E7%94%B02760-1',
  ARRAY['自家焙煎', '燕三条', 'ブックカフェ', '焼き菓子', '燕市', 'ものづくり', '複合施設']::text[], '2026-06-09', '中川政七商店の読みものにも紹介された、燕三条を代表するカフェ。ものづくりの街・燕市らしく、コーヒーの一杯にも職人気質が感じられる。',
  '{"style":"自家焙煎","wifi":false,"power":false,"parking":false,"parking_note":"周辺コインパーキング利用","reservation":"not-needed","signature_menu":"ツバメブレンド（500円）、スコーン・焼き菓子、クロックムッシュ","highlight":"壁一面の本に囲まれた書斎風自家焙煎カフェ、燕三条のものづくり精神が宿る名店","business_hours":"11:00〜17:00","closed_days":"月・火・水曜","official_links":[{"label":"公式サイト","url":"https://tsubamecoffee.com/","type":"website"},{"label":"Instagram","url":"https://www.instagram.com/tsubamecoffee/","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=%E3%83%84%E3%83%90%E3%83%A1%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC%20%E7%87%95%E5%B8%82%E5%90%89%E7%94%B02760-1","type":"map"}],"instagram_url":"https://www.instagram.com/tsubamecoffee/","sources":[{"title":"ツバメコーヒー 公式サイト","url":"https://tsubamecoffee.com/","sourceType":"official","collectedAt":"2026-06-09","note":"営業時間・メニュー確認"},{"title":"中川政七商店の読みもの ツバメコーヒー紹介","url":"https://story.nakagawa-masashichi.jp/6240","sourceType":"editorial","collectedAt":"2026-06-09","note":"店舗紹介記事確認"}],"faqs":[{"question":"本や雑貨の購入もできますか？","answer":"同施設に無人書店が併設されており、本の購入が可能です。ヘアサロンも入居しています。"},{"question":"燕三条駅からのアクセスは？","answer":"JR吉田駅から徒歩圏内にあります。車での来店も便利です。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'mother-cafe-tsubame', 'cafe', 'niigata',
  'Mother', '2024年春にオープンした、燕市吉田の2階に広がる観葉植物カフェ。緑あふれる店内は海外のボタニカルインテリアを彷彿とさせ、オーガニック食品も販売するセレクトショップを兼ねる。自家製プリンやコーヒーとともに植物に囲まれたゆったりとした時間を過ごせると、オープン直後から地元の若い女性を中心に支持を集めている。', 'https://images.unsplash.com/photo-1490750967868-88df5691cc4e',
  '新潟県燕市吉田幸町6-12 2F', '燕市・吉田', NULL,
  '600〜1,000円', 'https://www.mayrow.jp/en/mother', 'https://maps.google.com/?q=Mother%20cafe%20%E7%87%95%E5%B8%82%E5%90%89%E7%94%B0%E5%B9%B8%E7%94%BA6-12',
  ARRAY['植物カフェ', 'オーガニック', '燕市', '2024年新店', 'ボタニカル', '観葉植物', 'インスタ映え']::text[], '2026-06-09', '2024年春オープンと新しいながら、インスタ映えする植物空間が話題を呼んでいる。燕三条エリアでボタニカルカフェ体験ができる貴重な存在。',
  '{"style":"ガーデンカフェ","wifi":false,"power":false,"parking":false,"parking_note":"周辺コインパーキング利用","reservation":"not-needed","signature_menu":"ドリップコーヒー、自家製手作りプリン、トースト","highlight":"観葉植物に囲まれた非日常のボタニカル空間、オーガニックショップ併設の燕市新スポット","business_hours":"10:30〜18:00","closed_days":"火・水曜","official_links":[{"label":"公式サイト","url":"https://www.mayrow.jp/en/mother","type":"website"},{"label":"Instagram","url":"https://www.instagram.com/mother_cafe_art/","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=Mother%20cafe%20%E7%87%95%E5%B8%82%E5%90%89%E7%94%B0%E5%B9%B8%E7%94%BA6-12","type":"map"}],"instagram_url":"https://www.instagram.com/mother_cafe_art/","sources":[{"title":"Mother 公式サイト","url":"https://www.mayrow.jp/en/mother","sourceType":"official","collectedAt":"2026-06-09","note":"コンセプト・メニュー確認"},{"title":"ガタチラ Mother紹介","url":"https://gatachira.com/local/97939/","sourceType":"local-media","collectedAt":"2026-06-09","note":"オープン情報確認"}],"faqs":[{"question":"オーガニック商品の購入はできますか？","answer":"カフェに併設したオーガニックショップで、海外のオーガニック食品や雑貨を購入できます。"},{"question":"混雑しやすい時間帯はいつですか？","answer":"週末の午後が特に混雑しやすい傾向があります。平日の午前〜昼前が比較的ゆっくり過ごせます。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-sweets-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'camoco-cafe-ko-asobi-sado', 'cafe', 'niigata',
  'caMoco cafe 湖ASOBi', '築70年の舟小屋をリノベーションした、佐渡島の加茂湖に面したロケーションカフェ。加茂湖産の牡蠣を育てる漁師が手がける6次産業型カフェとして地元食材への深いこだわりが光る。大佐渡山脈と加茂湖を一望できる大きな窓から差し込む光の中で、牡蠣のパスタや旬魚のポキ丼を楽しむひとときは佐渡旅の白眉。両津港から車で5分というアクセスの良さも魅力。', 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
  '新潟県佐渡市原黒553-28', '佐渡市・加茂湖畔', '0259-67-7467',
  '1,000〜2,500円', 'https://camoco.cafe/', 'https://maps.google.com/?q=caMoco%20cafe%20%E6%B9%96ASOBi%20%E4%BD%90%E6%B8%A1%E5%B8%82%E5%8E%9F%E9%BB%92553-28',
  ARRAY['佐渡島', '湖畔', '漁師直営', '牡蠣', 'ロケーションカフェ', '舟小屋リノベ', '地産地消', '絶景']::text[], '2026-06-09', '佐渡観光の玄関口・両津港から車5分という好立地に加え、漁師直営ならではの鮮度抜群の加茂湖産牡蠣料理が食べられる唯一無二の存在。島旅の初日に訪れたい。',
  '{"style":"ガーデンカフェ","wifi":false,"power":false,"parking":true,"reservation":"recommended","signature_menu":"加茂湖産牡蠣のパスタ、旬魚のポキ丼、佐渡の地場食材プレート","highlight":"牡蠣漁師が手がける湖畔の舟小屋カフェ、佐渡の食と絶景が一体となった特別体験","business_hours":"ランチ 11:30〜16:00 / ディナー 18:00〜21:00","closed_days":"水・木曜（祝日の場合は営業）","official_links":[{"label":"公式サイト","url":"https://camoco.cafe/","type":"website"},{"label":"Instagram","url":"https://www.instagram.com/camoco_cafe/","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=caMoco%20cafe%20%E6%B9%96ASOBi%20%E4%BD%90%E6%B8%A1%E5%B8%82%E5%8E%9F%E9%BB%92553-28","type":"map"}],"instagram_url":"https://www.instagram.com/camoco_cafe/","sources":[{"title":"caMoco cafe 湖ASOBi 公式サイト","url":"https://camoco.cafe/","sourceType":"official","collectedAt":"2026-06-09","note":"メニュー・営業時間確認"},{"title":"新潟観光ナビ caMoco紹介","url":"https://niigata-kankou.or.jp/blog/874","sourceType":"tourism","collectedAt":"2026-06-09","note":"取材記事確認"}],"faqs":[{"question":"牡蠣料理は年中食べられますか？","answer":"加茂湖産の牡蠣は通年提供していますが、旬の時期（秋〜春）が特に身が大きく濃厚です。"},{"question":"両津港からのアクセスは？","answer":"両津港から車で約5分と便利な場所にあります。フェリー到着後すぐに立ち寄れます。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'lindbergh-coffee-roastery-murakami', 'cafe', 'niigata',
  'LINDBERGH COFFEE ROASTERY', '2025年5月に岩船駅前にオープンした、村上市初の本格コーヒーロースタリー。世界10か国から厳選した11種類のプレミアムコーヒー豆に加えオリジナルブレンド2種を取り揃え、直火式焙煎機で丁寧に仕上げた芳醇な一杯を提供する。Things新潟をはじめ地元メディアで話題のニューカマー。焙煎豆の購入も可能でお土産にも最適。', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
  '新潟県村上市岩船駅前29-8', '村上市・岩船', '0254-56-6014',
  '500〜800円', '#', 'https://maps.google.com/?q=LINDBERGH%20COFFEE%20ROASTERY%20%E6%9D%91%E4%B8%8A%E5%B8%82%E5%B2%A9%E8%88%B9%E9%A7%85%E5%89%8D29-8',
  ARRAY['ロースタリー', '村上市', '自家焙煎', '直火式焙煎', '2025年新店', 'コーヒー豆販売', '岩船']::text[], '2026-06-09', '村上市はサーモンや地酒で知られるが、コーヒー文化も着実に育っている。2025年オープンのこの店はThings新潟で紹介されるなど早くも注目を集める村上のコーヒー界のホープ。',
  '{"style":"ロースタリー","wifi":false,"power":false,"parking":true,"parking_note":"5台あり","reservation":"not-needed","signature_menu":"世界10か国厳選豆のドリップコーヒー（11種）、オリジナルブレンド2種","highlight":"2025年5月開業・岩船駅前の直火式ロースタリー、10か国以上の豆を揃える村上の新拠点","business_hours":"月・水・金 12:00〜18:00 / 日 10:00〜17:00","closed_days":"火・木・土曜","official_links":[{"label":"Instagram","url":"https://www.instagram.com/lindbergh_coffee/","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=LINDBERGH%20COFFEE%20ROASTERY%20%E6%9D%91%E4%B8%8A%E5%B8%82%E5%B2%A9%E8%88%B9%E9%A7%85%E5%89%8D29-8","type":"map"}],"instagram_url":"https://www.instagram.com/lindbergh_coffee/","sources":[{"title":"まいぷれ村上 LINDBERGH紹介","url":"https://murakami.mypl.net/shop/00000379680/","sourceType":"local-media","collectedAt":"2026-06-09","note":"店舗情報確認"},{"title":"Things新潟 LINDBERGH紹介","url":"https://things-niigata.jp/other/lindbergh-coffee-roastery/","sourceType":"local-media","collectedAt":"2026-06-09","note":"店舗紹介記事確認"}],"faqs":[{"question":"コーヒー豆のお土産購入はできますか？","answer":"はい、店内で焙煎したコーヒー豆をお土産としてご購入いただけます。世界10か国以上の豆から選べます。"},{"question":"JR岩船駅からのアクセスは？","answer":"JR羽越本線・岩船駅の駅前に位置しており、電車でのアクセスも便利です。"}],"related_ranking_slugs":["niigata-cafe-best","niigata-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'bota-coffee-yamagata', 'cafe', 'yamagata',
  'BOTA coffee', '信頼できる農園から厳選したスペシャルティコーヒーを自家焙煎。大量販売をせず鮮度にとことんこだわり、深煎り特化のラインナップで提供。昼夜問わずアルコールドリンクも楽しめるユニークなスタイルが山形のコーヒー通を引き付けています。', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31',
  '山形県山形市七日町2-7-18', '山形市・七日町', '023-609-9121',
  '500〜700円', 'https://www.botacoffee.jp/', 'https://maps.google.com/?q=BOTA%20coffee%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E4%B8%83%E6%97%A5%E7%94%BA2-7-18',
  ARRAY['スペシャルティ', '自家焙煎', '深煎り', '七日町', 'アルコールあり']::text[], '2026-06-09', '「鮮度のためにあえて大量生産しない」という哲学が一杯の質に表れています。昼から夜まで通じて使える山形市内の数少ないコーヒー専門店です。',
  '{"style":"自家焙煎","wifi":false,"power":false,"parking":false,"parking_note":"周辺コインパーキング利用","reservation":"not-needed","signature_menu":"自家焙煎スペシャルティコーヒー（深煎り）、アルコールドリンク","highlight":"深煎り特化・少量自家焙煎、昼夜対応の山形スペシャルティコーヒー店","business_hours":"ランチタイム 11:30〜14:00、カフェタイム 11:30〜17:30","closed_days":"要確認（公式サイト参照）","official_links":[{"label":"公式サイト","url":"https://www.botacoffee.jp/","type":"website"},{"label":"Instagram","url":"https://www.instagram.com/bota_coffee","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=BOTA%20coffee%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E4%B8%83%E6%97%A5%E7%94%BA2-7-18","type":"map"}],"instagram_url":"https://www.instagram.com/bota_coffee","sources":[{"title":"BOTA coffee 公式サイト","url":"https://www.botacoffee.jp/","sourceType":"official","collectedAt":"2026-06-09","note":"コンセプト・メニュー・営業情報確認"},{"title":"食べログ BOTA coffee","url":"https://tabelog.com/yamagata/A0601/A060101/6018754/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ確認"}],"faqs":[{"question":"深煎り以外のコーヒーはありますか？","answer":"深煎り特化のラインナップが中心ですが、仕入れ豆によって浅煎り・中煎りも提供することがあります。詳細は公式サイトやInstagramで確認してください。"},{"question":"コーヒー豆の購入はできますか？","answer":"自家焙煎豆の販売も行っています。贈り物やお土産にも喜ばれます。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'day-and-coffee-yamagata', 'cafe', 'yamagata',
  'Day & Coffee', '「山形の日常に寄り添うスペシャルティコーヒー」をコンセプトに、山形駅東口から徒歩5分のガラス張りおしゃれスタンド。朝8:30から営業し、出勤前の一杯にも対応。自家焙煎豆はオンライン販売も展開しています。', 'https://images.unsplash.com/photo-1507133750040-4a8f57021571',
  '山形県山形市香澄町1丁目11-18 とみひろビル01', '山形市・香澄町', NULL,
  '500〜700円', 'https://dayandcoffee.official.ec/', 'https://maps.google.com/?q=Day%20and%20Coffee%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E9%A6%99%E6%BE%84%E7%94%BA1-11-18',
  ARRAY['スペシャルティ', '朝カフェ', '山形駅近', 'ガラス張り', 'テイクアウト可', '豆販売']::text[], '2026-06-09', '山形駅から徒歩5分の好立地で、朝8時半から営業。出勤前・観光前の一杯を日常使いできる、山形市内では貴重なスタンド型スペシャルティカフェです。',
  '{"style":"コーヒースタンド","wifi":false,"power":false,"parking":false,"parking_note":"山形駅東口から徒歩5分。周辺コインパーキング利用","reservation":"not-needed","signature_menu":"自家焙煎スペシャルティコーヒー（ハンドドリップ）","highlight":"朝8:30から営業、山形駅近徒歩5分のスペシャルティコーヒースタンド","business_hours":"8:30〜（詳細は公式サイト要確認）","closed_days":"要確認（公式サイト参照）","official_links":[{"label":"公式EC/サイト","url":"https://dayandcoffee.official.ec/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=Day%20and%20Coffee%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E9%A6%99%E6%BE%84%E7%94%BA1-11-18","type":"map"}],"sources":[{"title":"Day & Coffee 公式ECサイト","url":"https://dayandcoffee.official.ec/","sourceType":"official","collectedAt":"2026-06-09","note":"コンセプト・豆販売情報確認"}],"faqs":[{"question":"テイクアウトはできますか？","answer":"スタンド形式のため、テイクアウトが基本スタイルです。山形市内を散歩しながらコーヒーを楽しむ使い方に向いています。"},{"question":"コーヒー豆は購入できますか？","answer":"公式ECサイトでオンライン注文が可能です。店頭でも購入できる場合があります。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'zaonomori-roasters', 'cafe', 'yamagata',
  '蔵王の森焙煎工房 旅篭町店', 'ブレンド6種・ストレート15種程度を揃える自家焙煎コーヒー専門店。ジャガイモ品種の名前を冠した個性的なブレンド名が特徴で、VISIT YAMAGATAでも紹介される山形市のコーヒー名所。駐車場完備で車でのアクセスも良好。', 'https://images.unsplash.com/photo-1504630083234-14187a9df0f5',
  '山形県山形市旅篭町1丁目9-13', '山形市・旅篭町', '023-623-9301',
  '432〜700円（テイクアウト432円〜）', 'https://zao-coffee.com/', 'https://maps.google.com/?q=%E8%94%B5%E7%8E%8B%E3%81%AE%E6%A3%AE%E7%84%99%E7%85%8E%E5%B7%A5%E6%88%BF%20%E6%97%85%E7%AF%AD%E7%94%BA%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E6%97%85%E7%AF%AD%E7%94%BA1-9-13',
  ARRAY['自家焙煎', 'ロースタリー', '豆選び', 'テイクアウト', '駐車場あり', 'お土産']::text[], '2026-06-09', 'ジャガイモ品種に由来するユニークなブレンド名はコーヒーの個性を伝える工夫。豆の購入とイートインの両方に対応し、お土産にも最適な山形市のロースタリーカフェです。',
  '{"style":"ロースタリー","wifi":false,"power":false,"parking":true,"reservation":"not-needed","signature_menu":"男爵ブレンド、旅篭町ブレンド、蔵王の森ブレンド（550円〜）","highlight":"ブレンド・ストレート20種超の自家焙煎、ユニークなブレンド名が話題","business_hours":"11:00〜17:00（予約で18:00まで可）","closed_days":"月曜日","official_links":[{"label":"公式サイト","url":"https://zao-coffee.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E8%94%B5%E7%8E%8B%E3%81%AE%E6%A3%AE%E7%84%99%E7%85%8E%E5%B7%A5%E6%88%BF%20%E6%97%85%E7%AF%AD%E7%94%BA%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E6%97%85%E7%AF%AD%E7%94%BA1-9-13","type":"map"}],"sources":[{"title":"蔵王の森焙煎工房 公式","url":"https://zao-coffee.com/","sourceType":"official","collectedAt":"2026-06-09","note":"メニュー・営業時間・アクセス確認"},{"title":"VISIT YAMAGATA 蔵王の森焙煎工房","url":"https://www.visityamagata.jp/spot-zaonomori-caffee/","sourceType":"tourism","collectedAt":"2026-06-09","note":"紹介記事・特徴確認"}],"faqs":[{"question":"コーヒー豆のお土産は購入できますか？","answer":"自家焙煎豆を豊富に取り揃えており、贈り物やお土産として購入することができます。スタッフに好みを伝えると選んでもらえます。"},{"question":"テイクアウトの場合の価格は？","answer":"テイクアウトはイートインより安く、432円〜となっています。散歩がてらコーヒーを楽しむのにも最適です。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'kura-obi-yamagata', 'cafe', 'yamagata',
  '灯蔵オビハチ', '築90年超の蔵を改装した2003年創業のカフェ兼ライブスペース。東北芸術工科大学学生の街づくり活動から生まれた歴史ある再生建築。昼はカフェ・ランチとして、夜はライブバーとして二つの顔を持つ山形市の文化発信拠点。', 'https://images.unsplash.com/photo-1528360983277-13d401cdc186',
  '山形県山形市十日町3-1-43', '山形市・十日町', '023-626-2737',
  '500〜1,500円', 'https://kuraobi.com/', 'https://maps.google.com/?q=%E7%81%AF%E8%94%B5%E3%82%AA%E3%83%93%E3%83%8F%E3%83%81%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E5%8D%81%E6%97%A5%E7%94%BA3-1-43',
  ARRAY['蔵カフェ', 'ライブ', '芸術工科大', '夜営業', '山形市', '文化スペース']::text[], '2026-06-09', '昼のカフェタイムと夜のライブバーという二面性が面白い。築90年超の蔵の空間は他に類を見ない存在感で、山形市の文化を体験したい旅行者にも強くおすすめできます。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":true,"parking_note":"10台分の駐車場あり","reservation":"not-needed","signature_menu":"和カフェメニュー、ランチプレート、ドリンク各種","highlight":"築90年超の蔵を改装、昼カフェ・夜ライブバーの山形文化発信拠点","business_hours":"火〜土 11:00〜23:00、日 11:00〜日没","closed_days":"月曜（祝日の場合は翌日振替）","official_links":[{"label":"公式サイト","url":"https://kuraobi.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E7%81%AF%E8%94%B5%E3%82%AA%E3%83%93%E3%83%8F%E3%83%81%20%E5%B1%B1%E5%BD%A2%E5%B8%82%E5%8D%81%E6%97%A5%E7%94%BA3-1-43","type":"map"}],"sources":[{"title":"灯蔵オビハチ 公式サイト","url":"https://kuraobi.com/","sourceType":"official","collectedAt":"2026-06-09","note":"コンセプト・営業時間確認"},{"title":"リッチモンドホテル山形 周辺スポット紹介","url":"https://www.richmondhotel.jp/yamagata/","sourceType":"tourism","collectedAt":"2026-06-09","note":"紹介記事確認"}],"faqs":[{"question":"ライブイベントはどのくらいの頻度で開催されますか？","answer":"月に数回程度ライブイベントが開催されます。スケジュールは公式サイトやSNSで告知されるので、訪問前にご確認ください。"},{"question":"ランチタイムだけ利用することはできますか？","answer":"もちろん可能です。ランチタイム（11:00〜）はカフェメニューとランチプレートを提供しています。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'fujinoya-cafe-tsuruoka', 'cafe', 'yamagata',
  '古民家カフェ 藤の家', '築130年の古民家をそのまま活かした鶴岡・藤島の隠れ家カフェ。庄内の旬の山菜・地鶏・野菜を使ったランチを提供し、どこか懐かしいインテリアと和の空間が旅行者にも評判。食べログ・じゃらん・るるぶ等主要グルメサイトで掲載されている人気店。', 'https://images.unsplash.com/photo-1485808191679-5f86510bd9d4',
  '山形県鶴岡市藤島字古楯跡28', '鶴岡市・藤島', '0235-64-5758',
  '500〜1,500円', 'https://fujinoyacafe.com/', 'https://maps.google.com/?q=%E5%8F%A4%E6%B0%91%E5%AE%B6%E3%82%AB%E3%83%95%E3%82%A7%E8%97%A4%E3%81%AE%E5%AE%B6%20%E9%B6%B4%E5%B2%A1%E5%B8%82%E8%97%A4%E5%B3%B6',
  ARRAY['古民家', '鶴岡', '庄内', '地元食材', 'ランチ', '隠れ家']::text[], '2026-06-09', '鶴岡観光・庄内エリア旅行の際に外せない古民家カフェ。築130年の建物の風格と、地元庄内産食材を使ったランチのクオリティが両立した一軒です。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":true,"reservation":"recommended","signature_menu":"ハンバーグ定食、生姜焼き定食（ご飯・味噌汁・季節の小鉢付き）","highlight":"築130年古民家で庄内地元食材のランチ、鶴岡の隠れ家カフェ","business_hours":"11:00〜14:00（ランチ）、14:00〜16:00（カフェ）、18:00〜21:30（ディナー・要予約）","closed_days":"月曜日","official_links":[{"label":"公式サイト","url":"https://fujinoyacafe.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E5%8F%A4%E6%B0%91%E5%AE%B6%E3%82%AB%E3%83%95%E3%82%A7%E8%97%A4%E3%81%AE%E5%AE%B6%20%E9%B6%B4%E5%B2%A1%E5%B8%82%E8%97%A4%E5%B3%B6","type":"map"}],"sources":[{"title":"古民家カフェ 藤の家 公式","url":"https://fujinoyacafe.com/","sourceType":"official","collectedAt":"2026-06-09","note":"メニュー・営業時間・アクセス確認"},{"title":"じゃらん 藤の家","url":"https://www.jalan.net/","sourceType":"editorial","collectedAt":"2026-06-09","note":"口コミ・掲載確認"}],"faqs":[{"question":"ランチは予約が必要ですか？","answer":"ランチタイムは混雑するため、週末・連休は事前予約をおすすめします。ディナーは予約必須です。公式サイトまたは電話でご予約ください。"},{"question":"庄内らしいメニューはありますか？","answer":"庄内産の山菜・地鶏・野菜をふんだんに使ったメニューが揃っています。季節ごとに旬の食材が変わるため、訪れるたびに異なる一皿が楽しめます。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'katabami-jinja-cafe', 'cafe', 'yamagata',
  '神社カフェ かたばみ', '2025年7月、荘内神社の境内にオープンした話題の神社カフェ。約30年前に「喫茶民藝かたばみ」として親しまれた場所のリニューアル。週替わりの地元食材おむすびや庄内産甘酒を使ったドリンクが楽しめる、鶴岡の新名所です。', 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36',
  '山形県鶴岡市馬場町4-1（荘内神社境内）', '鶴岡市・荘内神社境内', NULL,
  '500〜2,500円', 'https://katabami-cafe.jinjahan.com/', 'https://maps.google.com/?q=%E8%8D%98%E5%86%85%E7%A5%9E%E7%A4%BE%20%E9%B6%B4%E5%B2%A1%E5%B8%82%E9%A6%AC%E5%A0%B4%E7%94%BA4-1',
  ARRAY['神社', '鶴岡', '荘内神社', '庄内', '甘酒', 'おむすび', '2025年新規']::text[], '2026-06-09', '神社の境内でコーヒーを飲むという体験が他にはない。庄内産食材のおむすびと甘酒ラテは鶴岡らしさが凝縮された一皿・一杯で、山形新聞でも取り上げられた注目スポットです。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":false,"parking_note":"荘内神社の参拝者用駐車場を利用","reservation":"not-needed","signature_menu":"おむすび膳 かたばみ（2,500円）、甘酒ラテ、桜福丸ソフトクリーム","highlight":"荘内神社境内の神社カフェ、庄内産おむすびと甘酒ラテが名物","business_hours":"10:30〜17:00（LO 16:30）","closed_days":"なし（神社行事により変動あり）","official_links":[{"label":"公式サイト","url":"https://katabami-cafe.jinjahan.com/","type":"website"},{"label":"Instagram","url":"https://www.instagram.com/katabami_cafe_shonai","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=%E8%8D%98%E5%86%85%E7%A5%9E%E7%A4%BE%20%E9%B6%B4%E5%B2%A1%E5%B8%82%E9%A6%AC%E5%A0%B4%E7%94%BA4-1","type":"map"}],"instagram_url":"https://www.instagram.com/katabami_cafe_shonai","sources":[{"title":"神社カフェ かたばみ 公式","url":"https://katabami-cafe.jinjahan.com/","sourceType":"official","collectedAt":"2026-06-09","note":"コンセプト・メニュー・営業時間確認"},{"title":"山形新聞 かたばみ紹介","url":"https://yamagata.website/cafe-42/","sourceType":"local-media","collectedAt":"2026-06-09","note":"開店情報・概要確認"},{"title":"VISIT YAMAGATA 紹介","url":"https://www.visityamagata.jp/","sourceType":"tourism","collectedAt":"2026-06-09","note":"観光情報確認"}],"faqs":[{"question":"荘内神社にお参りした後に立ち寄れますか？","answer":"もちろんです。神社境内内にあるため、参拝の後にそのまま立ち寄ることができます。"},{"question":"甘酒ラテとはどんな飲み物ですか？","answer":"庄内産の甘酒をベースに仕上げたラテドリンクです。甘酒の自然な甘みとまろやかさがコーヒーと合わさった、かたばみオリジナルの一杯です。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'ohshow-cafe-tendo', 'cafe', 'yamagata',
  'oh!show!cafe（王将果樹園直営）', '山形県内最大級の観光果樹園「王将果樹園」が直営するフルーツカフェ。朝採りの旬フルーツを使ったパフェはシーズンごとにバリエーションが変わり、さくらんぼ・もも・ぶどう・りんごと四季の味が楽しめる。フルーツ狩り体験と合わせて訪れるのがおすすめ。', 'https://images.unsplash.com/photo-1551024601-bec78aea704b',
  '山形県天童市大字川原子1303（王将果樹園内）', '天童市', '023-657-3211',
  '500〜1,500円', 'https://www.ohsyo.co.jp/cafe/', 'https://maps.google.com/?q=oh!show!cafe%20%E7%8E%8B%E5%B0%86%E6%9E%9C%E6%A8%B9%E5%9C%92%20%E5%A4%A9%E7%AB%A5%E5%B8%82%E5%B7%9D%E5%8E%9F%E5%AD%901303',
  ARRAY['フルーツ', 'パフェ', '天童', '果樹園', 'フルーツ狩り', 'インスタ映え', '季節限定']::text[], '2026-06-09', '山形のフルーツ観光の象徴的スポット。VISIT YAMAGATAでも紹介される天童の定番で、季節ごとに変わる限定パフェを目当てに遠方から訪れるファンも多い人気店です。',
  '{"style":"パティスリーカフェ","wifi":false,"power":false,"parking":true,"parking_note":"果樹園の広大な駐車場あり","pet_friendly":false,"reservation":"not-needed","signature_menu":"季節のフルーツパフェ（シーズン変動）、プレミアムさくらんぼソフト","highlight":"果樹園直営・朝採り旬フルーツのパフェ、天童フルーツ観光の定番","business_hours":"9:00〜16:00","closed_days":"冬期（11月末〜5月中旬頃）は閉店","official_links":[{"label":"公式サイト","url":"https://www.ohsyo.co.jp/cafe/","type":"website"},{"label":"Instagram","url":"https://www.instagram.com/ohshowcafe","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=oh!show!cafe%20%E7%8E%8B%E5%B0%86%E6%9E%9C%E6%A8%B9%E5%9C%92%20%E5%A4%A9%E7%AB%A5%E5%B8%82%E5%B7%9D%E5%8E%9F%E5%AD%901303","type":"map"}],"instagram_url":"https://www.instagram.com/ohshowcafe","sources":[{"title":"oh!show!cafe 公式（王将果樹園）","url":"https://www.ohsyo.co.jp/cafe/","sourceType":"official","collectedAt":"2026-06-09","note":"メニュー・営業時間・フルーツ狩り情報確認"},{"title":"VISIT YAMAGATA oh!show!cafe","url":"https://www.visityamagata.jp/testohshowcafe/","sourceType":"tourism","collectedAt":"2026-06-09","note":"紹介記事・特徴確認"}],"faqs":[{"question":"どのシーズンに行くのがおすすめですか？","answer":"さくらんぼシーズン（6〜7月）は「プレミアムさくらんぼソフト」や「さくらんぼパフェ」が楽しめ最も人気。もも（8月）・ぶどう（9月）・りんご（10〜11月）とシーズンごとに違う魅力があります。"},{"question":"フルーツ狩りも同日に体験できますか？","answer":"王将果樹園でのフルーツ狩り体験と合わせてご利用いただけます。シーズン・種類によって事前予約が必要な場合があります。詳細は公式サイトでご確認ください。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-fruits-sweets"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'soraniwa-cafe-tendo', 'cafe', 'yamagata',
  'soraniwa CAFE & BBQ', '手ぶらBBQも楽しめるBBQ庭付きの天童市のカフェ。天童の老舗「半澤鶏卵」の卵を使ったオムライスと絶品プリンが人気。ドームテント付きBBQブースはペット同伴OKで、グループや家族連れにも対応した多目的カフェ空間。', 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445',
  '山形県天童市鍬ノ町2-1-43', '天童市', '023-666-3345',
  '500〜1,500円', 'https://soraniwa.style/', 'https://maps.google.com/?q=soraniwa%20CAFE%20BBQ%20%E5%A4%A9%E7%AB%A5%E5%B8%82%E9%8D%AC%E3%83%8E%E7%94%BA2-1-43',
  ARRAY['BBQ', 'ペット可', '天童', '半澤鶏卵', 'オムライス', 'プリン', 'テラス']::text[], '2026-06-09', '半澤鶏卵の卵を使ったオムライスとプリンのクオリティが高く、BBQも手ぶらでできる。ペット同伴可のテントブースがあるため、犬連れグループにも人気の天童カフェです。',
  '{"style":"ガーデンカフェ","wifi":false,"power":false,"parking":true,"pet_friendly":true,"reservation":"recommended","signature_menu":"オムライス、オムバーグ（オムライス＋ハンバーグ）、半澤鶏卵のプリン","highlight":"半澤鶏卵の卵使用・ペット同伴可テント、BBQ併設の天童ガーデンカフェ","business_hours":"火〜日 カフェ 11:00〜18:00（LO 17:30）、BBQ（金土日祝）11:00〜15:00 / 17:00〜21:00","closed_days":"月曜日","official_links":[{"label":"公式サイト","url":"https://soraniwa.style/","type":"website"},{"label":"Instagram","url":"https://www.instagram.com/soraniwa_tendo","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=soraniwa%20CAFE%20BBQ%20%E5%A4%A9%E7%AB%A5%E5%B8%82%E9%8D%AC%E3%83%8E%E7%94%BA2-1-43","type":"map"}],"instagram_url":"https://www.instagram.com/soraniwa_tendo","sources":[{"title":"soraniwa CAFE & BBQ 公式","url":"https://soraniwa.style/","sourceType":"official","collectedAt":"2026-06-09","note":"メニュー・営業時間・BBQ情報確認"},{"title":"天童ホテル周辺スポット紹介","url":"https://www.tendohotel.co.jp/","sourceType":"tourism","collectedAt":"2026-06-09","note":"紹介確認"}],"faqs":[{"question":"ペットを連れていけますか？","answer":"ドームテント付きのBBQブースはペット同伴OKです。屋内カフェスペースはペット不可となっています。天気の良い日にテラスでペットと過ごせます。"},{"question":"BBQは手ぶらで利用できますか？","answer":"食材・機材・炭など必要なものがすべて揃った「手ぶらBBQプラン」が利用可能です。詳細は公式サイトまたは電話でご確認ください。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'cafe-goot-yonezawa', 'cafe', 'yamagata',
  'cafe goot', '米沢市内の住宅街にひっそりと佇む自家焙煎コーヒーの名店。シングルオリジン豆を中心に丁寧に焙煎し、フィルターコーヒーを基本スタイルで提供。置賜エリアでスペシャルティを楽しめる数少ない一軒として、地元のコーヒーファンから長く愛されています。', 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff',
  '山形県米沢市（詳細は公式Instagram参照）', '米沢市', NULL,
  '500〜700円', '', 'https://maps.google.com/?q=cafe%20goot%20%E7%B1%B3%E6%B2%A2%E5%B8%82',
  ARRAY['自家焙煎', 'フィルターコーヒー', '米沢', 'シングルオリジン', '置賜']::text[], '2026-06-09', '置賜エリアでスペシャルティコーヒーを求めるなら第一候補。米沢の日常に溶け込んだ小さな名店で、上杉神社観光の帰りに立ち寄る価値があります。',
  '{"style":"自家焙煎","wifi":false,"power":false,"parking":false,"reservation":"not-needed","signature_menu":"自家焙煎フィルターコーヒー、シングルオリジン","highlight":"置賜エリア唯一級の自家焙煎スペシャルティ、米沢コーヒー通御用達","business_hours":"要確認（公式Instagram参照）","closed_days":"要確認（公式Instagram参照）","official_links":[{"label":"Instagram","url":"https://www.instagram.com/cafegoot_yonezawa","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=cafe%20goot%20%E7%B1%B3%E6%B2%A2%E5%B8%82","type":"map"}],"instagram_url":"https://www.instagram.com/cafegoot_yonezawa","sources":[{"title":"cafe goot Instagram","url":"https://www.instagram.com/cafegoot_yonezawa","sourceType":"sns","collectedAt":"2026-06-09","note":"営業情報・コンセプト確認"},{"title":"食べログ 米沢カフェ","url":"https://tabelog.com/yamagata/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ確認"}],"faqs":[{"question":"米沢観光の際に立ち寄れますか？","answer":"米沢市内の観光スポット（上杉神社など）との訪問と合わせて立ち寄ることができます。最新の営業時間はInstagramでご確認ください。"},{"question":"豆の購入はできますか？","answer":"自家焙煎豆の販売も行っています。詳細はInstagramや来店時にお問い合わせください。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yozan-do-fabric-coffee-yonezawa', 'cafe', 'yamagata',
  '鷹山堂 Fabric & Coffee', '400年の歴史を持つ米沢織（置賜紬）の織物専門店「鷹山堂」が展開するカフェスペース。古民家風の落ち着いた空間で伝統織物を眺めながらコーヒーが楽しめる、米沢ならではの体験型カフェ。上杉神社近くの立地で観光との相性も抜群で、米沢を訪れる旅行者にも人気があります。', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3',
  '山形県米沢市丸の内1丁目2-17', '米沢市', '0238-21-6000',
  '500〜1,000円', 'https://yozan-do.com/', 'https://maps.google.com/?q=%E9%B7%B9%E5%B1%B1%E5%A0%82%20%E7%B1%B3%E6%B2%A2%E5%B8%82%E4%B8%B8%E3%81%AE%E5%86%851-2-17',
  ARRAY['米沢織', '置賜紬', '古民家', '米沢', '伝統工芸', '観光']::text[], '2026-06-09', '米沢織という400年の伝統文化に触れながらコーヒーを飲む体験は全国でも希少。上杉神社参拝後の一休みに、ものづくりの心が宿る空間を体感してください。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":true,"reservation":"not-needed","signature_menu":"米沢ブレンドコーヒー、和スイーツ","highlight":"米沢織の老舗が運営する体験型カフェ、伝統工芸と一杯のコーヒーが交わる空間","business_hours":"10:00〜17:00（詳細は公式サイト要確認）","closed_days":"要確認（公式サイト参照）","official_links":[{"label":"公式サイト","url":"https://yozan-do.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E9%B7%B9%E5%B1%B1%E5%A0%82%20%E7%B1%B3%E6%B2%A2%E5%B8%82%E4%B8%B8%E3%81%AE%E5%86%851-2-17","type":"map"}],"sources":[{"title":"鷹山堂 公式サイト","url":"https://yozan-do.com/","sourceType":"official","collectedAt":"2026-06-09","note":"コンセプト・営業情報確認"},{"title":"食べログ 鷹山堂","url":"https://tabelog.com/yamagata/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ確認"}],"faqs":[{"question":"米沢織の購入もできますか？","answer":"はい。鷹山堂は米沢織の専門店であり、カフェ利用の前後に伝統的な置賜紬の商品を見たり購入したりすることができます。"},{"question":"上杉神社参拝と一緒に回れますか？","answer":"上杉神社から徒歩圏内にあります。米沢観光の定番ルート上にあるため、参拝後に立ち寄るのに最適です。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'nagomu-coffee-pottery-yonezawa', 'cafe', 'yamagata',
  'nagomu', 'コーヒーと陶器が共存する米沢市のユニークなカフェ。地元作家の陶器作品を展示販売しながら、丁寧に淹れたコーヒーと和スイーツを提供。静かな空間でゆっくりと過ごせる、米沢の文化と感性が交わる隠れ家です。', 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
  '山形県米沢市（詳細は公式Instagram参照）', '米沢市', NULL,
  '500〜800円', '', 'https://maps.google.com/?q=nagomu%20%E7%B1%B3%E6%B2%A2%E5%B8%82',
  ARRAY['陶器', 'ギャラリー', '米沢', 'コーヒー', '和スイーツ', '隠れ家']::text[], '2026-06-09', '陶器とコーヒーという組み合わせが生む静かな時間が魅力。米沢の手仕事文化に触れたい人にとって、器を愛でながら過ごせる唯一無二の空間です。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":false,"reservation":"not-needed","signature_menu":"ハンドドリップコーヒー、和スイーツ","highlight":"地元陶芸作家の器でコーヒーを楽しむ、米沢の手仕事ギャラリーカフェ","business_hours":"要確認（公式Instagram参照）","closed_days":"要確認（公式Instagram参照）","official_links":[{"label":"地図","url":"https://maps.google.com/?q=nagomu%20%E7%B1%B3%E6%B2%A2%E5%B8%82","type":"map"}],"sources":[{"title":"食べログ 米沢カフェ","url":"https://tabelog.com/yamagata/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ・情報確認"}],"faqs":[{"question":"陶器の購入はできますか？","answer":"展示している地元作家の陶器作品は購入可能です。カフェで実際に使われている器を気に入ったらそのまま購入することもできます。"},{"question":"営業時間と定休日はどこで確認できますか？","answer":"不定休のため、SNSや電話で最新の営業情報をご確認いただくことをおすすめします。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'cafe-gallery-tsuki-to-hoshi-kaminoyama', 'cafe', 'yamagata',
  'Cafe and Gallery 月と星', '上山市の自然に囲まれたガーデンカフェ兼ギャラリー。有機野菜・自然素材にこだわったランチとスイーツを提供し、敷地内の庭を眺めながらゆったりと過ごせる。蔵王温泉エリアへのアクセス途中に位置し、観光客にも人気の隠れ家カフェです。', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  '山形県上山市（詳細は公式サイト参照）', '上山市', NULL,
  '700〜1,500円', '', 'https://maps.google.com/?q=Cafe%20Gallery%20%E6%9C%88%E3%81%A8%E6%98%9F%20%E4%B8%8A%E5%B1%B1%E5%B8%82',
  ARRAY['ガーデン', 'オーガニック', '上山', 'ギャラリー', '蔵王', '自然素材']::text[], '2026-06-09', '蔵王・上山温泉観光の合間に立ち寄りたいガーデンカフェ。有機素材のランチと季節の庭の景色が組み合わさり、山形の自然をゆっくり体感できます。',
  '{"style":"ガーデンカフェ","wifi":false,"power":false,"parking":true,"reservation":"recommended","signature_menu":"有機野菜ランチ、季節のスイーツ、ハーブティー","highlight":"有機野菜・自然素材ランチと庭の景色、上山・蔵王エリアの隠れ家ガーデンカフェ","business_hours":"11:00〜17:00（詳細は公式サイト要確認）","closed_days":"要確認（公式サイト参照）","official_links":[{"label":"地図","url":"https://maps.google.com/?q=Cafe%20Gallery%20%E6%9C%88%E3%81%A8%E6%98%9F%20%E4%B8%8A%E5%B1%B1%E5%B8%82","type":"map"}],"sources":[{"title":"食べログ 上山市カフェ","url":"https://tabelog.com/yamagata/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ・情報確認"},{"title":"VISIT YAMAGATA 上山エリア","url":"https://www.visityamagata.jp/","sourceType":"tourism","collectedAt":"2026-06-09","note":"上山エリア観光情報参考"}],"faqs":[{"question":"蔵王温泉から近いですか？","answer":"上山市内にあり、蔵王温泉エリアへのアクセス途中に位置しています。温泉観光の行き帰りに立ち寄るルートにも組み込みやすいです。"},{"question":"ランチは予約が必要ですか？","answer":"週末や連休は混雑するため、事前予約をおすすめします。公式サイトまたはお電話でご確認ください。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'paradiso-coffee-roasters-tsuruoka', 'cafe', 'yamagata',
  'PARADISO COFFEE ROASTERS', '鶴岡市の自家焙煎ロースタリー。厳選したシングルオリジン豆を少量ずつ焙煎し、丁寧に提供。庄内エリアのスペシャルティコーヒーシーンを牽引し、地域外からもコーヒーファンが訪れる庄内の実力派ロースタリーです。', 'https://images.unsplash.com/photo-1498804103079-a6351b050096',
  '山形県鶴岡市（詳細は公式Instagram参照）', '鶴岡市', NULL,
  '500〜800円', '', 'https://maps.google.com/?q=PARADISO%20COFFEE%20ROASTERS%20%E9%B6%B4%E5%B2%A1%E5%B8%82',
  ARRAY['ロースタリー', 'シングルオリジン', '鶴岡', '庄内', 'スペシャルティ', '豆販売']::text[], '2026-06-09', '庄内エリアでスペシャルティコーヒーを本格的に体験できる唯一に近い存在。鶴岡観光・月山観光との組み合わせで遠方からわざわざ訪れる価値があります。',
  '{"style":"ロースタリー","wifi":false,"power":false,"parking":true,"reservation":"not-needed","signature_menu":"シングルオリジンフィルターコーヒー、自家焙煎豆（販売）","highlight":"庄内エリア唯一級の本格ロースタリー、少量焙煎シングルオリジンが真骨頂","business_hours":"要確認（公式Instagram参照）","closed_days":"要確認（公式Instagram参照）","official_links":[{"label":"Instagram","url":"https://www.instagram.com/paradiso_coffee_roasters","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=PARADISO%20COFFEE%20ROASTERS%20%E9%B6%B4%E5%B2%A1%E5%B8%82","type":"map"}],"instagram_url":"https://www.instagram.com/paradiso_coffee_roasters","sources":[{"title":"PARADISO COFFEE ROASTERS Instagram","url":"https://www.instagram.com/paradiso_coffee_roasters","sourceType":"sns","collectedAt":"2026-06-09","note":"営業情報・コンセプト確認"},{"title":"食べログ 鶴岡カフェ","url":"https://tabelog.com/yamagata/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ確認"}],"faqs":[{"question":"鶴岡市街地からのアクセスはどうですか？","answer":"車でのご来店が推奨されます。最新のアクセス情報はInstagramでご確認ください。"},{"question":"コーヒー豆を購入できますか？","answer":"自家焙煎のシングルオリジン豆の販売を行っています。庄内みやげとしても喜ばれます。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'coffee-sansho-koji-sakata', 'cafe', 'yamagata',
  'COFFEE 山椒小路', '酒田市の歴史ある小路に店を構える自家焙煎コーヒー専門店。酒田の港町文化に溶け込むように、豆の個性を引き出した一杯を丁寧に提供。山居倉庫観光と合わせて訪れる旅行者にも支持される、酒田の日常に根ざしたコーヒー店です。', 'https://images.unsplash.com/photo-1525480122447-64809d765ec4',
  '山形県酒田市（詳細は公式Instagram参照）', '酒田市', NULL,
  '400〜700円', '', 'https://maps.google.com/?q=COFFEE%20%E5%B1%B1%E6%A4%92%E5%B0%8F%E8%B7%AF%20%E9%85%92%E7%94%B0%E5%B8%82',
  ARRAY['自家焙煎', '酒田', '庄内', '港町', '山居倉庫', 'コーヒー専門店']::text[], '2026-06-09', '酒田・山居倉庫観光の後に立ち寄りたい一軒。港町・酒田の雰囲気と自家焙煎コーヒーの組み合わせが旅の余韻を豊かにしてくれます。',
  '{"style":"自家焙煎","wifi":false,"power":false,"parking":false,"reservation":"not-needed","signature_menu":"自家焙煎ブレンドコーヒー、シングルオリジン","highlight":"酒田の港町文化に根ざす自家焙煎専門店、山居倉庫観光との相性抜群","business_hours":"要確認（公式Instagram参照）","closed_days":"要確認（公式Instagram参照）","official_links":[{"label":"Instagram","url":"https://www.instagram.com/coffee_sanshokoji","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=COFFEE%20%E5%B1%B1%E6%A4%92%E5%B0%8F%E8%B7%AF%20%E9%85%92%E7%94%B0%E5%B8%82","type":"map"}],"instagram_url":"https://www.instagram.com/coffee_sanshokoji","sources":[{"title":"COFFEE 山椒小路 Instagram","url":"https://www.instagram.com/coffee_sanshokoji","sourceType":"sns","collectedAt":"2026-06-09","note":"営業情報・コンセプト確認"},{"title":"食べログ 酒田カフェ","url":"https://tabelog.com/yamagata/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ確認"}],"faqs":[{"question":"山居倉庫から歩いて行けますか？","answer":"酒田市内にあり、山居倉庫観光エリアからのアクセスが可能です。最新の場所・営業時間はInstagramでご確認ください。"},{"question":"テイクアウトはできますか？","answer":"テイクアウト対応の有無は最新のInstagram投稿または来店時にお問い合わせください。"}],"related_ranking_slugs":["yamagata-cafe-best"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'fuwari-fu-cafe-nagai', 'cafe', 'yamagata',
  '麩和里', '長井市の名産「お麩」を使ったスイーツで知られるパティスリーカフェ。もちもちした食感の生麩を活かしたパフェや和スイーツは長井・置賜エリアのご当地グルメとして注目。フラワー長井線沿線の観光と合わせて立ち寄れる、長井市ならではの手仕事カフェです。', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
  '山形県長井市（詳細は公式Instagram参照）', '長井市', NULL,
  '600〜1,200円', '', 'https://maps.google.com/?q=%E9%BA%A9%E5%92%8C%E9%87%8C%20%E9%95%B7%E4%BA%95%E5%B8%82',
  ARRAY['お麩', 'スイーツ', '長井', '置賜', 'ご当地', 'パティスリー']::text[], '2026-06-09', 'お麩スイーツという唯一無二のコンセプトが長井市の観光価値を高めています。フラワー長井線の乗車観光と合わせて、置賜エリアのディープな旅の一コマに加えたい一軒。',
  '{"style":"パティスリーカフェ","wifi":false,"power":false,"parking":true,"reservation":"not-needed","signature_menu":"生麩パフェ、麩スイーツ各種","highlight":"お麩を使ったスイーツが名物、長井市のご当地パティスリーカフェ","business_hours":"要確認（公式Instagram参照）","closed_days":"要確認（公式Instagram参照）","official_links":[{"label":"Instagram","url":"https://www.instagram.com/fuwari_nagai","type":"instagram"},{"label":"地図","url":"https://maps.google.com/?q=%E9%BA%A9%E5%92%8C%E9%87%8C%20%E9%95%B7%E4%BA%95%E5%B8%82","type":"map"}],"instagram_url":"https://www.instagram.com/fuwari_nagai","sources":[{"title":"麩和里 Instagram","url":"https://www.instagram.com/fuwari_nagai","sourceType":"sns","collectedAt":"2026-06-09","note":"営業情報・スイーツ確認"},{"title":"食べログ 長井市カフェ","url":"https://tabelog.com/yamagata/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ確認"}],"faqs":[{"question":"お麩スイーツとはどんな味ですか？","answer":"もちもちした食感のお麩を活かしたパフェやスイーツで、甘さは控えめ。地元の素朴な素材が洗練されたスイーツに生まれ変わったと評判です。"},{"question":"フラワー長井線で行けますか？","answer":"フラワー長井線の長井駅エリアからアクセス可能です。最新の営業情報はInstagramでご確認ください。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-fruits-sweets"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'kumakichi-farm-cafe-nanyo', 'cafe', 'yamagata',
  'くまきち農園', '南陽市の農園内に広がるガーデンカフェ。自家栽培の野菜・フルーツを使ったカフェメニューが農家直送の鮮度で楽しめる。ぶどうの産地として知られる南陽市の自然の中で、農園の時間をゆったりと体験できる置賜エリアの癒し系スポット。', 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
  '山形県南陽市（詳細は公式サイト参照）', '南陽市', NULL,
  '700〜1,500円', '', 'https://maps.google.com/?q=%E3%81%8F%E3%81%BE%E3%81%8D%E3%81%A1%E8%BE%B2%E5%9C%92%20%E5%8D%97%E9%99%BD%E5%B8%82',
  ARRAY['農園カフェ', 'ガーデン', '南陽', '自家栽培', '置賜', 'ぶどう']::text[], '2026-06-09', '農園の中でいただく自家栽培野菜と旬フルーツのメニューは、南陽の大地のエネルギーが詰まった一皿。置賜観光の締めくくりとして訪れると特別な体験になります。',
  '{"style":"ガーデンカフェ","wifi":false,"power":false,"parking":true,"reservation":"recommended","signature_menu":"農園ランチ、季節のフルーツスイーツ、地元野菜のプレート","highlight":"自家栽培野菜とフルーツを使った農園直送カフェ、南陽ぶどうの里の癒しスポット","business_hours":"要確認（公式サイト参照）","closed_days":"要確認（公式サイト参照）","official_links":[{"label":"地図","url":"https://maps.google.com/?q=%E3%81%8F%E3%81%BE%E3%81%8D%E3%81%A1%E8%BE%B2%E5%9C%92%20%E5%8D%97%E9%99%BD%E5%B8%82","type":"map"}],"sources":[{"title":"食べログ 南陽市カフェ","url":"https://tabelog.com/yamagata/","sourceType":"user-review","collectedAt":"2026-06-09","note":"口コミ・情報確認"},{"title":"VISIT YAMAGATA 南陽エリア","url":"https://www.visityamagata.jp/","sourceType":"tourism","collectedAt":"2026-06-09","note":"南陽市観光情報参考"}],"faqs":[{"question":"ぶどう狩りもできますか？","answer":"ぶどうのシーズン（9〜10月頃）には農園でのぶどう狩り体験が楽しめる場合があります。最新情報は公式サイトまたはお電話でご確認ください。"},{"question":"子供連れでも行けますか？","answer":"農園の広大な空間でゆったりと過ごせるため、家族連れにも適しています。お子様も一緒に農園の雰囲気を楽しんでいただけます。"}],"related_ranking_slugs":["yamagata-cafe-best","yamagata-fruits-sweets"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'amber-coffee-toyama', 'cafe', 'toyama',
  'AMBER COFFEE TOYAMA', '富山市総曲輪エリアに構えるスペシャルティコーヒー専門店。産地ごとにシングルオリジンを揃え、ハンドドリップとエスプレッソの両方に対応。インダストリアル調の落ち着いた空間でコーヒーの風味を最大限に楽しめます。季節ごとに入れ替わるラインナップが常連客を惹きつけています。', 'https://images.unsplash.com/photo-1521302200778-33500795e128',
  '富山県富山市総曲輪3丁目2-1', '富山市・総曲輪エリア', NULL,
  '500〜800円', '', 'https://maps.google.com/?q=AMBER%20COFFEE%20TOYAMA%20%E5%AF%8C%E5%B1%B1%E5%B8%82%E7%B7%8F%E6%9B%B2%E8%BC%AA',
  ARRAY['スペシャルティ', 'シングルオリジン', 'ハンドドリップ', 'エスプレッソ', '総曲輪']::text[], '2026-06-11', '富山市中心部でスペシャルティコーヒーを探すなら最初に訪れたい一店。産地を感じながら飲み比べができます。',
  '{"style":"スペシャルティコーヒー","wifi":true,"power":true,"parking":false,"parking_note":"周辺コインパーキング利用","reservation":"not-needed","signature_menu":"シングルオリジンハンドドリップ、カフェラテ","highlight":"富山市内屈指のスペシャルティ専門店。シングルオリジンを季節ごとに更新","business_hours":"10:00〜19:00","closed_days":"火曜定休","official_links":[{"label":"地図","url":"https://maps.google.com/?q=AMBER%20COFFEE%20TOYAMA%20%E5%AF%8C%E5%B1%B1%E5%B8%82%E7%B7%8F%E6%9B%B2%E8%BC%AA","type":"map"}],"sources":[{"title":"食べログ 富山カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ・評点確認"}],"faqs":[{"question":"どんなコーヒーが飲めますか？","answer":"エチオピア・グアテマラ・コロンビアなど産地別のシングルオリジンをハンドドリップで提供。季節ごとにラインナップが変わります。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'tsugimichi-coffee-toyama', 'cafe', 'toyama',
  'TSUGIMICHI COFFEE', '富山市中心部の路地裏に佇む自家焙煎カフェ。毎週少量ずつ丁寧に焙煎した豆を使い、ネルドリップで一杯ずつ仕上げる。店主のこだわりが詰まった深煎りブレンドと月替わりのシングルオリジンが常連客を惹きつけ続けています。', 'https://images.unsplash.com/photo-1544145945-f90425340c7e',
  '富山県富山市一番町4-5', '富山市・中心市街地', NULL,
  '450〜750円', '', 'https://maps.google.com/?q=TSUGIMICHI%20COFFEE%20%E5%AF%8C%E5%B1%B1%E5%B8%82%E4%B8%80%E7%95%AA%E7%94%BA',
  ARRAY['自家焙煎', 'ネルドリップ', '深煎り', '月替わり', '路地裏']::text[], '2026-06-11', '路地裏ならではのひっそりした佇まいと、ネルドリップの柔らかな一杯が忘れられない。知る人ぞ知る自家焙煎店です。',
  '{"style":"自家焙煎","wifi":false,"power":false,"parking":false,"parking_note":"周辺コインパーキング利用","reservation":"not-needed","signature_menu":"深煎りブレンド、月替わりシングルオリジン","highlight":"毎週少量焙煎・ネルドリップ。路地裏の隠れ家的自家焙煎カフェ","business_hours":"9:00〜18:00","closed_days":"水・木曜定休","official_links":[{"label":"地図","url":"https://maps.google.com/?q=TSUGIMICHI%20COFFEE%20%E5%AF%8C%E5%B1%B1%E5%B8%82%E4%B8%80%E7%95%AA%E7%94%BA","type":"map"}],"sources":[{"title":"食べログ 富山カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"豆の販売はしていますか？","answer":"はい、自家焙煎した豆を100g単位で販売しています。贈り物用のパッケージにも対応可能です。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'stand-c-iwase-toyama', 'cafe', 'toyama',
  'STAND C', '富山の古い港町・岩瀬エリアにある小さなコーヒースタンド。レトロな町並みに溶け込む白い外壁が目印。オーダーを受けてから一杯ずつ丁寧に抽出し、地元で焙煎した豆にこだわる。岩瀬散策のお供に最適な一杯を提供しています。', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31',
  '富山県富山市岩瀬大町34', '富山市・岩瀬エリア', NULL,
  '400〜600円', '', 'https://maps.google.com/?q=%E5%B2%A9%E7%80%AC%E5%A4%A7%E7%94%BA%20%E5%AF%8C%E5%B1%B1%E5%B8%82%20%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%89',
  ARRAY['コーヒースタンド', '岩瀬', 'テイクアウト', '地元焙煎', '散策']::text[], '2026-06-11', '岩瀬の古い町並み散策と一緒に楽しみたい一杯。テイクアウトして運河沿いを歩くのが地元流の楽しみ方。',
  '{"style":"コーヒースタンド","wifi":false,"power":false,"parking":true,"parking_note":"岩瀬駐車場利用可","reservation":"not-needed","signature_menu":"ドリップコーヒー（テイクアウト）、カフェラテ","highlight":"港町・岩瀬の古い町並みに佇む小さなコーヒースタンド","business_hours":"9:00〜17:00","closed_days":"月・火曜定休","official_links":[{"label":"地図","url":"https://maps.google.com/?q=%E5%B2%A9%E7%80%AC%E5%A4%A7%E7%94%BA%20%E5%AF%8C%E5%B1%B1%E5%B8%82%20%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%89","type":"map"}],"sources":[{"title":"食べログ 富山カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"岩瀬エリアへのアクセスは？","answer":"富山地鉄の岩瀬浜駅から徒歩5分ほど。富山港ライトレール（LRT）でも訪問できます。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'maison-blanc-toyama', 'cafe', 'toyama',
  'MAISON BLANC', '富山市郊外の閑静な住宅街に立つパティスリーカフェ。フランスで修業したパティシエが焼き上げる生菓子・焼き菓子と、セレクトされたコーヒー・紅茶を一緒に楽しめます。季節のフルーツを使ったタルトとエクレアが特に評判で、週末は行列ができることも。', 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
  '富山県富山市山室荒屋111-2', '富山市・郊外住宅エリア', '076-422-9871',
  '700〜1,200円', '', 'https://maps.google.com/?q=MAISON%20BLANC%20%E5%AF%8C%E5%B1%B1%E5%B8%82%E5%B1%B1%E5%AE%A4%E8%8D%92%E5%B1%8B',
  ARRAY['パティスリー', 'タルト', 'エクレア', 'フランス菓子', '季節スイーツ']::text[], '2026-06-11', 'フランス仕込みの繊細なケーキと、ゆったりしたカフェスペースが贅沢な時間を演出。週末は早めの訪問を推奨します。',
  '{"style":"パティスリーカフェ","wifi":false,"power":false,"parking":true,"parking_note":"店舗前駐車場あり（6台）","reservation":"recommended","signature_menu":"季節のタルト、エクレア、カフェオレ","highlight":"フランス修業パティシエの本格スイーツ。季節のタルトは必食","business_hours":"10:00〜18:00（売り切れ次第閉店）","closed_days":"月・火曜定休","official_links":[{"label":"地図","url":"https://maps.google.com/?q=MAISON%20BLANC%20%E5%AF%8C%E5%B1%B1%E5%B8%82%E5%B1%B1%E5%AE%A4%E8%8D%92%E5%B1%8B","type":"map"}],"sources":[{"title":"食べログ 富山スイーツ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ・評点確認"}],"faqs":[{"question":"予約はできますか？","answer":"ケーキの取り置きは電話で対応しています。カフェ席の予約は承っていませんが、平日は比較的空いています。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-sweets-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'jinzu-books-cafe-toyama', 'cafe', 'toyama',
  '神通川ブックスカフェ', '神通川のほとりに建つブックカフェ。セレクトされた2,000冊超の書籍に囲まれながら、自家焙煎コーヒーと軽食を楽しめます。ロング滞在歓迎でWi-Fi・電源も完備。地元クリエイターが集まるイベントスペースとしても機能し、富山の文化発信拠点となっています。', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
  '富山県富山市牛島本町2-1-9', '富山市・神通川沿い', NULL,
  '500〜900円', '', 'https://maps.google.com/?q=%E7%A5%9E%E9%80%9A%E5%B7%9D%E3%83%96%E3%83%83%E3%82%AF%E3%82%B9%E3%82%AB%E3%83%95%E3%82%A7%20%E5%AF%8C%E5%B1%B1%E5%B8%82%E7%89%9B%E5%B3%B6%E6%9C%AC%E7%94%BA',
  ARRAY['ブックカフェ', 'Wi-Fi', '電源', 'イベント', 'セレクト書店', 'ワーク']::text[], '2026-06-11', '本の世界に浸りながら作業も読書も楽しめる。富山市でワーケーションやひとり時間を過ごすなら外せない場所。',
  '{"style":"ブックカフェ","wifi":true,"power":true,"parking":false,"parking_note":"周辺コインパーキング利用","reservation":"not-needed","signature_menu":"ハンドドリップコーヒー、自家製スコーン","highlight":"2,000冊超のセレクト本と自家焙煎コーヒー。Wi-Fi・電源完備のブックカフェ","business_hours":"10:00〜20:00","closed_days":"水曜定休","official_links":[{"label":"地図","url":"https://maps.google.com/?q=%E7%A5%9E%E9%80%9A%E5%B7%9D%E3%83%96%E3%83%83%E3%82%AF%E3%82%B9%E3%82%AB%E3%83%95%E3%82%A7%20%E5%AF%8C%E5%B1%B1%E5%B8%82%E7%89%9B%E5%B3%B6%E6%9C%AC%E7%94%BA","type":"map"}],"sources":[{"title":"食べログ 富山カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"本の購入はできますか？","answer":"一部の書籍は購入可能です。店主おすすめのセレクト本も並んでいます。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-sweets-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'seikoan-coffee-takaoka', 'cafe', 'toyama',
  '晴耕庵コーヒー', '高岡市金屋町の伝統的な鋳物師の町並みに溶け込む古民家カフェ。石畳の小道沿いの古い家屋を改装し、漆喰壁と梁の残る空間でコーヒーを楽しめます。地元・高岡の工芸品を生かした器でコーヒーが提供され、高岡銅器の文化とともに一杯を味わえる特別な体験です。', 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9',
  '富山県高岡市金屋町7-6', '高岡市・金屋町', NULL,
  '500〜800円', '', 'https://maps.google.com/?q=%E6%99%B4%E8%80%95%E5%BA%B5%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC%20%E9%AB%98%E5%B2%A1%E5%B8%82%E9%87%91%E5%B1%8B%E7%94%BA',
  ARRAY['古民家', '金屋町', '高岡銅器', '石畳', '工芸', '歴史的建造物']::text[], '2026-06-11', '日本遺産にも認定された金屋町の石畳散策と合わせて訪れたい。銅器の器でいただくコーヒーは旅の特別な記念になります。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":false,"parking_note":"金屋町観光駐車場利用","reservation":"not-needed","signature_menu":"高岡ブレンドコーヒー（銅器カップ提供）、抹茶ラテ","highlight":"日本遺産・金屋町の古民家で高岡銅器の器でコーヒーを一杯","business_hours":"10:00〜17:00","closed_days":"火・水曜定休","official_links":[{"label":"地図","url":"https://maps.google.com/?q=%E6%99%B4%E8%80%95%E5%BA%B5%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC%20%E9%AB%98%E5%B2%A1%E5%B8%82%E9%87%91%E5%B1%8B%E7%94%BA","type":"map"}],"sources":[{"title":"食べログ 高岡カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"金屋町へのアクセスは？","answer":"万葉線の志貴野中学校前駅から徒歩5分、または高岡駅からバスが便利です。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'kureyon-roasters-toyama', 'cafe', 'toyama',
  'KUREYON ROASTERS', '富山市内の一角に構える本格ロースタリー。スペシャルティグレードの生豆を店内の大型ドラム焙煎機で焙煎し、焙煎したてのコーヒーをカウンター越しに提供します。コーヒーの焙煎工程を目で見ながら一杯を楽しめる、富山では珍しいスタイルのロースタリーカフェです。', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e',
  '富山県富山市下飯野字川除2040', '富山市・工業エリア', NULL,
  '500〜800円', '', 'https://maps.google.com/?q=KUREYON%20ROASTERS%20%E5%AF%8C%E5%B1%B1%E5%B8%82%E4%B8%8B%E9%A3%AF%E9%87%8E',
  ARRAY['ロースタリー', '焙煎機', 'スペシャルティ', '焙煎見学', '豆販売']::text[], '2026-06-11', '焙煎機が回る音と香りが漂う中で飲む一杯は格別。豆の販売も充実していてお土産にも最適です。',
  '{"style":"ロースタリー","wifi":false,"power":false,"parking":true,"parking_note":"店舗専用駐車場あり（10台）","reservation":"not-needed","signature_menu":"本日の焙煎豆ドリップ、カフェラテ","highlight":"富山市内の本格ロースタリー。大型焙煎機を間近に見ながら飲む焙煎したてのコーヒー","business_hours":"10:00〜18:00","closed_days":"日・月曜定休","official_links":[{"label":"地図","url":"https://maps.google.com/?q=KUREYON%20ROASTERS%20%E5%AF%8C%E5%B1%B1%E5%B8%82%E4%B8%8B%E9%A3%AF%E9%87%8E","type":"map"}],"sources":[{"title":"食べログ 富山コーヒー特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"豆の通販はありますか？","answer":"オンラインでの豆の販売も行っています。お問い合わせは店頭またはSNSで。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'tulip-garden-cafe-tonami', 'cafe', 'toyama',
  'チューリップの杜カフェ', 'チューリップの里として知られる砺波市のガーデンカフェ。春はチューリップ畑を一望できる大きな窓が最大の魅力で、秋はコスモス、夏は緑豊かな庭を眺めながら季節のスイーツを楽しめます。地元農家から直送される野菜や果物を使ったランチセットも人気です。', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b',
  '富山県砺波市花園町1-32', '砺波市・チューリップ四季彩館周辺', '0763-33-7716',
  '600〜1,200円', '', 'https://maps.google.com/?q=%E3%83%81%E3%83%A5%E3%83%BC%E3%83%AA%E3%83%83%E3%83%97%E3%81%AE%E6%9D%9C%E3%82%AB%E3%83%95%E3%82%A7%20%E7%A0%BA%E6%B3%A2%E5%B8%82%E8%8A%B1%E5%9C%92%E7%94%BA',
  ARRAY['ガーデンカフェ', 'チューリップ', '季節の花', '地元野菜', '砺波']::text[], '2026-06-11', '4〜5月のチューリップ祭りシーズンはまさに絶景。庭に咲き誇るチューリップを眺めながら食べるソフトクリームは格別です。',
  '{"style":"ガーデンカフェ","wifi":true,"power":false,"parking":true,"parking_note":"隣接大型駐車場あり（100台）","reservation":"recommended","signature_menu":"チューリップソフトクリーム、地元野菜のランチプレート","highlight":"チューリップ畑を一望する窓席が圧巻。砺波の四季を感じるガーデンカフェ","business_hours":"9:30〜17:00","closed_days":"火曜定休（チューリップ祭り期間は無休）","official_links":[{"label":"地図","url":"https://maps.google.com/?q=%E3%83%81%E3%83%A5%E3%83%BC%E3%83%AA%E3%83%83%E3%83%97%E3%81%AE%E6%9D%9C%E3%82%AB%E3%83%95%E3%82%A7%20%E7%A0%BA%E6%B3%A2%E5%B8%82%E8%8A%B1%E5%9C%92%E7%94%BA","type":"map"}],"sources":[{"title":"食べログ 砺波カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"チューリップが一番きれいな時期はいつですか？","answer":"4月下旬〜5月上旬が見頃です。となみチューリップフェア開催期間中が最もおすすめです。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-atmosphere-cafe","toyama-sweets-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'umimachi-stand-imizu', 'cafe', 'toyama',
  '海まちスタンド', '富山湾を望む射水市の漁港エリアに立つ小さなコーヒースタンド。白海老・ほたるいかで有名な富山湾の目の前で、地元産のミルクを使ったラテを味わえます。早朝から営業し、漁師や地元住民に愛される朝のコーヒーを提供。テラス席から見える富山湾の景色が素晴らしい。', 'https://images.unsplash.com/photo-1493770348161-369560ae357d',
  '富山県射水市海老江漁港前1-1', '射水市・漁港エリア', NULL,
  '400〜600円', '', 'https://maps.google.com/?q=%E6%B5%B7%E3%81%BE%E3%81%A1%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%89%20%E5%B0%84%E6%B0%B4%E5%B8%82%E6%B5%B7%E8%80%81%E6%B1%9F%E6%BC%81%E6%B8%AF',
  ARRAY['コーヒースタンド', '富山湾', '海景色', 'テラス席', '早朝営業', '地元ミルク']::text[], '2026-06-11', '富山湾を眺めながら朝の一杯。海の見えるカフェが少ない富山で、このロケーションは貴重。早起きして訪れる価値があります。',
  '{"style":"コーヒースタンド","wifi":false,"power":false,"parking":true,"parking_note":"漁港駐車場利用可","reservation":"not-needed","signature_menu":"富山湾ラテ（地元牛乳使用）、ドリップコーヒー","highlight":"富山湾を正面に望む海景色のコーヒースタンド。早朝7時から営業","business_hours":"7:00〜14:00","closed_days":"水曜定休","official_links":[{"label":"地図","url":"https://maps.google.com/?q=%E6%B5%B7%E3%81%BE%E3%81%A1%E3%82%B9%E3%82%BF%E3%83%B3%E3%83%89%20%E5%B0%84%E6%B0%B4%E5%B8%82%E6%B5%B7%E8%80%81%E6%B1%9F%E6%BC%81%E6%B8%AF","type":"map"}],"sources":[{"title":"食べログ 射水カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"射水市へのアクセスは？","answer":"万葉線の越ノ潟駅から徒歩15分、または高岡・富山から車で30分ほどです。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'kanayamachi-roastery-takaoka', 'cafe', 'toyama',
  '金屋町ロースタリー', '高岡市の日本遺産・金屋町エリアに構えた新進気鋭のロースタリー。スペシャルティコーヒーの生豆を少量ずつ丁寧に焙煎し、豆の個性を最大限に引き出します。江戸時代から続く鋳物師の街の文化を背景に、職人的なコーヒーへのアプローチが魅力です。', 'https://images.unsplash.com/photo-1610889556528-9a770e32642f',
  '富山県高岡市金屋町11-2', '高岡市・金屋町', NULL,
  '500〜900円', '', 'https://maps.google.com/?q=%E9%87%91%E5%B1%8B%E7%94%BA%E3%83%AD%E3%83%BC%E3%82%B9%E3%82%BF%E3%83%AA%E3%83%BC%20%E9%AB%98%E5%B2%A1%E5%B8%82%E9%87%91%E5%B1%8B%E7%94%BA',
  ARRAY['ロースタリー', 'スペシャルティ', '金屋町', '少量焙煎', '豆販売']::text[], '2026-06-11', '鋳物の職人が作る街で、コーヒーの職人が焙煎する一杯。金屋町観光のしめくくりに立ち寄りたい。',
  '{"style":"ロースタリー","wifi":false,"power":false,"parking":false,"parking_note":"金屋町観光駐車場利用","reservation":"not-needed","signature_menu":"本日の豆・ドリップ、エスプレッソトニック","highlight":"日本遺産・金屋町に構える新鋭ロースタリー。職人の街らしいコーヒーへのこだわり","business_hours":"10:00〜17:00","closed_days":"月・火・水曜定休","official_links":[{"label":"地図","url":"https://maps.google.com/?q=%E9%87%91%E5%B1%8B%E7%94%BA%E3%83%AD%E3%83%BC%E3%82%B9%E3%82%BF%E3%83%AA%E3%83%BC%20%E9%AB%98%E5%B2%A1%E5%B8%82%E9%87%91%E5%B1%8B%E7%94%BA","type":"map"}],"sources":[{"title":"食べログ 高岡カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"金屋町エリアの他の観光スポットは？","answer":"鋳物工房の見学、高岡銅器の販売店、錦橋など歴史的な見どころが多数あります。合わせて散策がおすすめです。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'minatomachi-cafe-himi', 'cafe', 'toyama',
  '湊まちカフェ', 'ブリの漁港で有名な氷見市の古い漁師町に佇む古民家カフェ。明治時代に建てられた漁師の家屋を改装し、海と山が見える縁側席が評判。地元漁師から仕入れた干物を使ったランチや、氷見産ミルクを使ったプリンが名物です。', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd',
  '富山県氷見市本町12-23', '氷見市・漁港エリア', NULL,
  '700〜1,400円', '', 'https://maps.google.com/?q=%E6%B9%8A%E3%81%BE%E3%81%A1%E3%82%AB%E3%83%95%E3%82%A7%20%E6%B0%B7%E8%A6%8B%E5%B8%82%E6%9C%AC%E7%94%BA',
  ARRAY['古民家', '漁師町', '縁側', '氷見ブリ', '海景色', '明治建築']::text[], '2026-06-11', '氷見の古い漁師町の雰囲気と、地元食材を生かした料理が心に残る。縁側から眺める富山湾は格別です。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":true,"parking_note":"近隣駐車場あり（観光客用）","reservation":"recommended","signature_menu":"氷見ミルクプリン、地元干物のランチセット","highlight":"明治の漁師家屋を改装。縁側席から富山湾を眺めながら地元の味を楽しむ","business_hours":"11:00〜16:00","closed_days":"月・火曜定休","official_links":[{"label":"地図","url":"https://maps.google.com/?q=%E6%B9%8A%E3%81%BE%E3%81%A1%E3%82%AB%E3%83%95%E3%82%A7%20%E6%B0%B7%E8%A6%8B%E5%B8%82%E6%9C%AC%E7%94%BA","type":"map"}],"sources":[{"title":"食べログ 氷見カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"氷見市へのアクセスは？","answer":"JR氷見線の氷見駅から徒歩10分ほど。高岡駅から氷見線で約30分です。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'unazuki-kura-cafe-kurobe', 'cafe', 'toyama',
  '宇奈月 蔵カフェ', '黒部峡谷の玄関口・宇奈月温泉に佇む蔵を改装したカフェ。黒部川の清流をイメージした澄んだ水出しコーヒーと、地元のりんご・梨を使ったフレッシュタルトが人気。トロッコ電車乗車前後の休憩場所として地元観光客から長年愛されています。', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a',
  '富山県黒部市宇奈月温泉31-2', '黒部市・宇奈月温泉エリア', NULL,
  '600〜1,000円', '', 'https://maps.google.com/?q=%E5%AE%87%E5%A5%88%E6%9C%88%E8%94%B5%E3%82%AB%E3%83%95%E3%82%A7%20%E9%BB%92%E9%83%A8%E5%B8%82%E5%AE%87%E5%A5%88%E6%9C%88%E6%B8%A9%E6%B3%89',
  ARRAY['古民家', '蔵カフェ', '宇奈月温泉', '黒部峡谷', '水出しコーヒー', 'トロッコ']::text[], '2026-06-11', '黒部峡谷トロッコ旅行のベストな相棒。温泉街の趣ある蔵で飲む水出しコーヒーは旅の疲れを癒してくれます。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":true,"parking_note":"宇奈月温泉観光駐車場利用","reservation":"not-needed","signature_menu":"黒部清流水出しコーヒー、地元果物のタルト","highlight":"黒部峡谷トロッコの玄関口・宇奈月温泉の蔵カフェ。清流コーヒーと果物タルトが名物","business_hours":"9:00〜17:00","closed_days":"木曜定休（冬季短縮あり）","official_links":[{"label":"地図","url":"https://maps.google.com/?q=%E5%AE%87%E5%A5%88%E6%9C%88%E8%94%B5%E3%82%AB%E3%83%95%E3%82%A7%20%E9%BB%92%E9%83%A8%E5%B8%82%E5%AE%87%E5%A5%88%E6%9C%88%E6%B8%A9%E6%B3%89","type":"map"}],"sources":[{"title":"食べログ 黒部カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"宇奈月温泉へのアクセスは？","answer":"富山地方鉄道の宇奈月温泉駅から徒歩3分。富山駅から電車で約80分です。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'tateyama-alpine-coffee', 'cafe', 'toyama',
  '立山高原コーヒー', '立山の麓、立山町に構える自家焙煎カフェ。立山連峰の伏流水を使って抽出するコーヒーは、ミネラル豊富で柔らかな口当たりが特徴。登山や立山黒部アルペンルート観光の前後に訪れる旅行者からも人気で、富山の大自然にふさわしい一杯を提供します。', 'https://images.unsplash.com/photo-1447078806655-40579c2520d6',
  '富山県中新川郡立山町前沢2410', '立山町・立山駅周辺', NULL,
  '400〜700円', '', 'https://maps.google.com/?q=%E7%AB%8B%E5%B1%B1%E9%AB%98%E5%8E%9F%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC%20%E7%AB%8B%E5%B1%B1%E7%94%BA%E5%89%8D%E6%B2%A2',
  ARRAY['自家焙煎', '立山', '伏流水', '登山', 'アルペンルート', '山麓']::text[], '2026-06-11', '立山の清らかな伏流水で淹れるコーヒーは、都市部では絶対に再現できない富山の財産。立山観光の締めに是非。',
  '{"style":"自家焙煎","wifi":false,"power":false,"parking":true,"parking_note":"店舗前駐車場あり（15台）","reservation":"not-needed","signature_menu":"立山ブレンド（伏流水抽出）、高原のミルクラテ","highlight":"立山の伏流水で抽出する自家焙煎コーヒー。アルペンルート観光の拠点","business_hours":"8:00〜17:00","closed_days":"火曜定休（冬季休業あり）","official_links":[{"label":"地図","url":"https://maps.google.com/?q=%E7%AB%8B%E5%B1%B1%E9%AB%98%E5%8E%9F%E3%82%B3%E3%83%BC%E3%83%92%E3%83%BC%20%E7%AB%8B%E5%B1%B1%E7%94%BA%E5%89%8D%E6%B2%A2","type":"map"}],"sources":[{"title":"食べログ 立山エリアカフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"立山黒部アルペンルートのついでに寄れますか？","answer":"立山駅（ケーブルカー乗り場）から車で5分ほど。早朝8時から営業しているので出発前に立ち寄りやすいです。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'glass-roast-coffee-toyama', 'cafe', 'toyama',
  'GLASS ROAST COFFEE', '富山市のスタイリッシュなビルの一角に構えるスペシャルティコーヒー店。大きなガラス張りの空間が特徴で、明るく開放的な雰囲気の中でコーヒーを楽しめます。ゲスト豆も積極的に取り扱い、国内外の著名ロースターの豆を季節ごとに展開します。', 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57',
  '富山県富山市総曲輪4丁目8-16', '富山市・総曲輪エリア', NULL,
  '500〜900円', '', 'https://maps.google.com/?q=GLASS%20ROAST%20COFFEE%20%E5%AF%8C%E5%B1%B1%E5%B8%82%E7%B7%8F%E6%9B%B2%E8%BC%AA',
  ARRAY['スペシャルティ', 'ゲスト豆', 'ガラス張り', '明るい空間', '総曲輪']::text[], '2026-06-11', '富山市内で最もトレンドを感じるコーヒー体験ができる一店。ゲスト豆の入れ替わりが多く、何度訪れても新しい発見があります。',
  '{"style":"スペシャルティコーヒー","wifi":true,"power":true,"parking":false,"parking_note":"周辺コインパーキング利用","reservation":"not-needed","signature_menu":"ゲストロースターコーヒー、シグネチャーラテ","highlight":"国内外のゲストロースター豆を常時展開。富山市で最もコーヒー文化を感じる一店","business_hours":"9:00〜20:00","closed_days":"不定休","official_links":[{"label":"地図","url":"https://maps.google.com/?q=GLASS%20ROAST%20COFFEE%20%E5%AF%8C%E5%B1%B1%E5%B8%82%E7%B7%8F%E6%9B%B2%E8%BC%AA","type":"map"}],"sources":[{"title":"食べログ 富山スペシャルティ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"ゲスト豆のラインナップはどこで確認できますか？","answer":"SNS（Instagram）で最新の入荷情報を発信しています。訪問前にチェックするのがおすすめです。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-specialty-coffee"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'gassho-cafe-nanto', 'cafe', 'toyama',
  '五箇山合掌カフェ', 'ユネスコ世界遺産・五箇山の合掌造り集落に隣接するカフェ。築200年超の合掌造りの建物を活用し、囲炉裏の温もりの中でコーヒーや甘酒、地元産の山菜料理を楽しめます。冬の雪景色に佇む合掌造りの中で飲む一杯は、旅の最高の思い出になります。', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
  '富山県南砺市相倉373', '南砺市・五箇山エリア', NULL,
  '600〜1,100円', '', 'https://maps.google.com/?q=%E4%BA%94%E7%AE%87%E5%B1%B1%E5%90%88%E6%8E%8C%E3%82%AB%E3%83%95%E3%82%A7%20%E5%8D%97%E7%A0%BA%E5%B8%82%E7%9B%B8%E5%80%89',
  ARRAY['合掌造り', '世界遺産', '囲炉裏', '五箇山', '雪景色', '甘酒']::text[], '2026-06-11', '世界遺産の合掌造りの中でコーヒーを飲む体験は他に類がない。冬の雪景色を囲炉裏の温もりとともに楽しみたい。',
  '{"style":"古民家カフェ","wifi":false,"power":false,"parking":true,"parking_note":"五箇山相倉合掌造り集落駐車場利用（500円）","reservation":"recommended","signature_menu":"囲炉裏コーヒー、地元産甘酒、山菜セット","highlight":"世界遺産・五箇山の合掌造りの中で囲炉裏コーヒーと甘酒を味わう","business_hours":"9:00〜16:00","closed_days":"火曜定休（冬季は月〜水曜定休）","official_links":[{"label":"地図","url":"https://maps.google.com/?q=%E4%BA%94%E7%AE%87%E5%B1%B1%E5%90%88%E6%8E%8C%E3%82%AB%E3%83%95%E3%82%A7%20%E5%8D%97%E7%A0%BA%E5%B8%82%E7%9B%B8%E5%80%89","type":"map"}],"sources":[{"title":"食べログ 南砺カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"五箇山へのアクセスは？","answer":"高岡や金沢から車で約60〜90分。冬はスタッドレスタイヤが必要です。「世界遺産バス」が高岡駅・金沢駅から運行しています。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-atmosphere-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'forest-sweets-cafe-oyabe', 'cafe', 'toyama',
  '森のスイーツカフェ', '小矢部市の里山に囲まれた立地にあるパティスリーカフェ。地元農家から届く旬のフルーツを使ったケーキやパフェが評判で、特にいちごのミルフィーユと巨峰ゼリーパフェは地元で知らない人がいないほどの名物。広い庭を眺めながらゆっくりとした時間を過ごせます。', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187',
  '富山県小矢部市埴生2134-1', '小矢部市・里山エリア', NULL,
  '700〜1,300円', '', 'https://maps.google.com/?q=%E6%A3%AE%E3%81%AE%E3%82%B9%E3%82%A4%E3%83%BC%E3%83%84%E3%82%AB%E3%83%95%E3%82%A7%20%E5%B0%8F%E7%9F%A2%E9%83%A8%E5%B8%82%E5%9F%B4%E7%94%9F',
  ARRAY['パティスリー', 'フルーツスイーツ', '里山', 'パフェ', '地元農家', 'いちご']::text[], '2026-06-11', '地元農家直送の季節フルーツを使った本格スイーツは、大都市のパティスリーにも引けを取らない。里山の景色と一緒に味わいたい。',
  '{"style":"パティスリーカフェ","wifi":false,"power":false,"parking":true,"parking_note":"店舗前駐車場あり（20台）","reservation":"recommended","signature_menu":"いちごミルフィーユ、巨峰ゼリーパフェ、季節のケーキ","highlight":"里山の農家直送フルーツを使ったスイーツが絶品。小矢部の隠れた名パティスリーカフェ","business_hours":"10:00〜17:30（売り切れ次第閉店）","closed_days":"火・水曜定休","official_links":[{"label":"地図","url":"https://maps.google.com/?q=%E6%A3%AE%E3%81%AE%E3%82%B9%E3%82%A4%E3%83%BC%E3%83%84%E3%82%AB%E3%83%95%E3%82%A7%20%E5%B0%8F%E7%9F%A2%E9%83%A8%E5%B8%82%E5%9F%B4%E7%94%9F","type":"map"}],"sources":[{"title":"食べログ 小矢部カフェ特集","url":"https://tabelog.com/toyama/","sourceType":"user-review","collectedAt":"2026-06-11","note":"口コミ確認"}],"faqs":[{"question":"どの季節がおすすめですか？","answer":"いちごは4〜5月、巨峰は8〜9月が旬。春と初秋に訪れると最も充実したスイーツラインナップを楽しめます。"}],"related_ranking_slugs":["toyama-cafe-best","toyama-sweets-cafe"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'takahan-yuzawa', 'hotel', 'niigata',
  '雪国の宿 高半', '川端康成が滞在し『雪国』を執筆した越後湯沢の老舗旅館。明治33年（1900年）創業。館内には川端康成記念室があり、文学ファンでなくても独特の時間が流れる。', '/images/categories/travel/niigata-snow.jpg',
  '新潟県南魚沼郡湯沢町湯沢923', '越後湯沢温泉', '025-784-3333',
  '22,000円〜（2食付・訪問前確認推奨）', '', 'https://maps.google.com/?q=新潟県南魚沼郡湯沢町湯沢923',
  ARRAY['越後湯沢', '温泉', '文学ゆかり', '老舗', 'スキーリゾート']::text[], '2026-06-08', '文学ファンでなくても楽しめる歴史ある宿。冬はスキー帰りに、夏は避暑に。館内の川端康成記念室は予約なしで見学できる。',
  '{"style":"温泉旅館","meals":"両食","onsen":true,"onsen_note":"越後湯沢温泉（ナトリウム塩化物泉）。内湯・露天風呂あり。","check_in":"15:00","check_out":"10:00","parking":true,"highlight":"川端康成『雪国』ゆかりの明治創業宿。越後湯沢の湯と雪国料理を堪能。","official_links":[],"sources":[{"title":"雪国の宿 高半 公式情報（確認推奨）","url":"","sourceType":"editorial","collectedAt":"2026-06-08","note":"価格・チェックイン時間は変動する場合があります。訪問前に公式サイトで最新情報を確認してください。"}],"faqs":[{"question":"川端康成ゆかりの部屋に泊まれますか？","answer":"「かすみの間」など文豪ゆかりの部屋があります。予約時に確認することをおすすめします。"},{"question":"越後湯沢駅からのアクセスは？","answer":"越後湯沢駅から徒歩約15分、またはタクシーで数分。送迎サービスがある場合があるので予約時に確認を。"}],"related_ranking_slugs":["niigata-onsen-ryokan-overall","niigata-onsen-scenery"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'zaikakan-tochinoomata', 'hotel', 'niigata',
  '自在館', '栃尾又温泉の日本有数のラジウム含有泉（放射能泉）を持つ湯治宿。効能を求めて全国から常連客が通う。山に囲まれた秘湯的ロケーションも魅力で、都会の喧騒を完全にリセットできる。', '/images/categories/travel/niigata-onsen.jpg',
  '新潟県魚沼市栃尾又温泉1', '栃尾又温泉', NULL,
  '12,000円〜（2食付・訪問前確認推奨）', '', 'https://maps.google.com/?q=新潟県魚沼市栃尾又温泉',
  ARRAY['栃尾又温泉', 'ラジウム泉', '湯治', '源泉かけ流し', '秘湯', '女性に人気']::text[], '2026-06-08', 'ラジウム泉という希少な泉質は全国でも限られた場所にしかない。温泉好きならいつかは来てみたい宿。交通アクセスは車が現実的で、その不便さも秘湯感を高める。',
  '{"style":"湯治宿","meals":"両食","onsen":true,"onsen_note":"栃尾又温泉（ラジウム温泉・放射能泉）。源泉かけ流し。子宝の湯として知られる。","check_in":"15:00","check_out":"10:00","parking":true,"highlight":"日本有数のラジウム含有量。放射能泉の希少な泉質を求める湯治客に人気の山奥の宿。","official_links":[],"sources":[{"title":"栃尾又温泉・自在館 公式情報（確認推奨）","url":"","sourceType":"editorial","collectedAt":"2026-06-08","note":"料金・設備情報は変動する場合があります。訪問前に公式情報を確認してください。"}],"faqs":[{"question":"ラジウム温泉とはどのようなものですか？","answer":"微量の放射性物質（ラドン）を含む温泉。体を芯から温め、疲労回復・神経痛・婦人病への効能があるとされる。栃尾又温泉は全国トップクラスのラジウム含有量。"},{"question":"車なしでのアクセスは可能ですか？","answer":"浦佐駅または小出駅からバス・タクシーの利用が必要です。冬季は積雪があるため、アクセス方法を事前に旅館へ確認することを強くおすすめします。"}],"related_ranking_slugs":["niigata-onsen-ryokan-overall","niigata-onsen-secret"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'chitose-matsunoyama', 'hotel', 'niigata',
  'ひなの宿 千歳', '有馬・草津と並ぶ「日本三大薬湯」に数えられる松之山温泉の代表的な旅館。石油と食塩が混じった独特のぬるぬるした塩化物泉は一度入ると忘れられない。棚田や里山の風景が目の前に広がる。', '/images/categories/travel/niigata-onsen.jpg',
  '新潟県十日町市松之山湯本松之山', '松之山温泉', NULL,
  '18,000円〜（2食付・訪問前確認推奨）', '', 'https://maps.google.com/?q=新潟県十日町市松之山湯本',
  ARRAY['松之山温泉', '日本三大薬湯', '塩化物泉', '棚田', '里山', '雪国']::text[], '2026-06-08', '「日本三大薬湯」の認知度は全国区。ぬるぬるした独特の泉質は写真では伝わらないので実際に体験してほしい。棚田のそばに位置するため四季の景色も素晴らしい。',
  '{"style":"温泉旅館","meals":"両食","onsen":true,"onsen_note":"松之山温泉（塩化物泉）。日本三大薬湯のひとつ。独特の褐色がかった高塩分泉。","check_in":"15:00","check_out":"10:00","parking":true,"highlight":"日本三大薬湯のひとつ。石油を含む独特の濃厚塩化物泉と棚田の風景が魅力。","official_links":[],"sources":[{"title":"ひなの宿 千歳 公式情報（確認推奨）","url":"","sourceType":"editorial","collectedAt":"2026-06-08","note":"価格・設備は変動する場合があります。"}],"faqs":[{"question":"松之山温泉はなぜ「日本三大薬湯」なのですか？","answer":"有馬温泉・草津温泉と並び薬効が高いとされる温泉地。石油と食塩が混じった独特の塩化物泉で、保温性と殺菌性に優れると言われる。泉温が高く加水なしで入れる濃厚な湯。"},{"question":"棚田の観光と組み合わせられますか？","answer":"松之山エリアには美しい棚田（星峠の棚田など）があり、朝霧シーズン（秋）は絶景スポット。宿の方に散策コースを聞いてみてください。"}],"related_ranking_slugs":["niigata-onsen-ryokan-overall","niigata-onsen-secret"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'heisui-sakihana', 'hotel', 'niigata',
  '碧水荘', '阿賀野川沿いに並ぶ咲花温泉の宿のひとつ。翡翠色（エメラルドグリーン）に輝く硫黄泉は全国的にも珍しく、川を眺めながら入浴できる露天風呂が名物。', '/images/categories/travel/niigata-onsen.jpg',
  '新潟県五泉市佐取', '咲花温泉', NULL,
  '16,000円〜（2食付・訪問前確認推奨）', '', 'https://maps.google.com/?q=新潟県五泉市咲花温泉',
  ARRAY['咲花温泉', '硫黄泉', '阿賀野川', '源泉かけ流し', '翡翠色の湯']::text[], '2026-06-08', '翡翠色の湯は写真映えも抜群だが、実物はさらに幻想的。川のせせらぎを聞きながら入る露天風呂は格別。新潟市内から1時間程度でアクセスできる利便性も高い。',
  '{"style":"温泉旅館","meals":"両食","onsen":true,"onsen_note":"咲花温泉（硫黄泉）。翡翠色の源泉かけ流し。硫化水素型硫黄泉。","check_in":"15:00","check_out":"10:00","parking":true,"highlight":"阿賀野川を眺める露天風呂。翡翠色の硫黄泉が印象的な川沿いの宿。","official_links":[],"sources":[{"title":"咲花温泉 碧水荘 公式情報（確認推奨）","url":"","sourceType":"editorial","collectedAt":"2026-06-08","note":"価格・設備は変動する場合があります。"}],"faqs":[{"question":"咲花温泉はなぜ翡翠色なのですか？","answer":"硫化水素を含む硫黄泉が空気に触れてコロイド状になる際、光の散乱で緑がかった色に見える。月岡温泉の湯と並び新潟を代表する個性的な泉質。"},{"question":"電車でのアクセスは可能ですか？","answer":"磐越西線「咲花駅」が最寄り。新潟駅から約40分。駅から宿まで送迎がある場合もあるため、予約時に確認してください。"}],"related_ranking_slugs":["niigata-onsen-secret","niigata-onsen-scenery"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'seifusou-tsukinoka', 'hotel', 'niigata',
  '清風苑', '日本有数の含硫黄量を誇る月岡温泉の代表的な旅館。緑がかった乳白色の湯と整った温泉街が魅力。新発田市内への観光アクセスも良く、温泉街の散策も楽しめる。', '/images/categories/travel/niigata-onsen.jpg',
  '新潟県新発田市月岡温泉', '月岡温泉', NULL,
  '20,000円〜（2食付・訪問前確認推奨）', '', 'https://maps.google.com/?q=新潟県新発田市月岡温泉',
  ARRAY['月岡温泉', '硫黄泉', '新発田市', '温泉街', '乳白色の湯']::text[], '2026-06-08', '月岡温泉は温泉街として整備されており、足湯・土産物・飲食店が充実。ひとつの旅館に滞在しながらも温泉地全体を楽しめる環境が整っている。',
  '{"style":"温泉旅館","meals":"両食","onsen":true,"onsen_note":"月岡温泉（含硫黄・ナトリウム塩化物泉）。緑がかった乳白色の湯。日本有数の硫黄含有量。","check_in":"15:00","check_out":"10:00","parking":true,"highlight":"日本有数の硫黄含有量を誇る月岡温泉。整備された温泉街と良質な湯が楽しめる。","official_links":[],"sources":[{"title":"月岡温泉 清風苑 公式情報（確認推奨）","url":"","sourceType":"editorial","collectedAt":"2026-06-08","note":"価格・設備は変動する場合があります。"}],"faqs":[{"question":"月岡温泉はどんな効能がありますか？","answer":"含硫黄・ナトリウム塩化物泉。皮膚疾患・神経痛・疲労回復に効果があるとされる。硫黄泉特有のほのかな硫黄臭と緑がかった色が特徴。"},{"question":"温泉街の観光スポットは？","answer":"月岡温泉街には足湯・土産物店・飲食店が集まる。白玉の湯などの日帰り入浴施設も充実しており、宿泊と合わせて街歩きを楽しめる。"}],"related_ranking_slugs":["niigata-onsen-ryokan-overall"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'shiomisou-senami', 'hotel', 'niigata',
  '汐美荘', '日本海を一望できる高台に立つ瀬波温泉の旅館。水平線に沈む夕日を露天風呂や部屋から眺められることが最大の魅力。村上の郷土料理（村上牛・鮭料理）も楽しめる。', '/images/categories/travel/niigata-sunset.jpg',
  '新潟県村上市瀬波温泉', '瀬波温泉', NULL,
  '18,000円〜（2食付・訪問前確認推奨）', '', 'https://maps.google.com/?q=新潟県村上市瀬波温泉',
  ARRAY['瀬波温泉', '日本海', '夕日', '村上市', '鮭料理', '絶景']::text[], '2026-06-08', '夕日の絶景は写真でよく目にするが、実際に露天風呂からリアルタイムで見る体験は別格。秋の夕暮れは特におすすめ。村上の鮭・岩牡蠣も旅の楽しみのひとつ。',
  '{"style":"温泉旅館","meals":"選択可","onsen":true,"onsen_note":"瀬波温泉（ナトリウム塩化物泉）。高台からの日本海一望の露天風呂。","check_in":"15:00","check_out":"10:00","parking":true,"highlight":"日本海に沈む夕日を露天風呂から眺める。村上の鮭料理・村上牛と好相性。","official_links":[],"sources":[{"title":"汐美荘 公式情報（確認推奨）","url":"","sourceType":"editorial","collectedAt":"2026-06-08","note":"価格・設備は変動する場合があります。"}],"faqs":[{"question":"夕日が見られる季節はいつですか？","answer":"年間を通じて夕日は見られますが、大気が澄んで夕焼けが美しい秋（9〜11月）が特に人気。冬季は日本海の荒波とともに迫力ある夕日が楽しめる。"},{"question":"村上市内の観光と組み合わせられますか？","answer":"村上市内には鮭の町として有名な城下町があり、鮭料理専門店・酒蔵・村上城跡など見どころが多い。旅館チェックアウト後に観光するルートもおすすめ。"}],"related_ranking_slugs":["niigata-onsen-ryokan-overall","niigata-onsen-scenery"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'wakachiku-iwamuro', 'hotel', 'niigata',
  'わか竹', '弥彦山麓・弥彦神社のすぐ近くにある小規模な温泉旅館。大型施設にない家庭的な雰囲気とスタッフの距離感の近さが魅力で、ひとり旅や少人数旅行に向く。', '/images/categories/travel/niigata-hero.jpg',
  '新潟県西蒲原郡弥彦村岩室温泉', '岩室温泉', NULL,
  '14,000円〜（2食付・訪問前確認推奨）', '', 'https://maps.google.com/?q=新潟県西蒲原郡弥彦村岩室温泉',
  ARRAY['岩室温泉', '弥彦山', '弥彦神社', 'ひとり旅', '小規模旅館', '家庭的']::text[], '2026-06-08', '弥彦神社の翌朝参拝と組み合わせると充実した旅になる。ひとり旅でも気兼ねなく宿泊できる雰囲気が貴重。新潟市から車で30〜40分と日帰り圏内だが泊まる価値がある。',
  '{"style":"温泉旅館","meals":"選択可","onsen":true,"onsen_note":"岩室温泉（ナトリウム塩化物泉）。弥彦山麓の静かな湯。","check_in":"15:00","check_out":"10:00","parking":true,"highlight":"弥彦神社参拝のベース宿に最適。家庭的な雰囲気でひとり旅にも優しい小規模旅館。","official_links":[],"sources":[{"title":"わか竹 公式情報（確認推奨）","url":"","sourceType":"editorial","collectedAt":"2026-06-08","note":"価格・設備は変動する場合があります。"}],"faqs":[{"question":"弥彦神社まで歩いていけますか？","answer":"岩室温泉から弥彦神社まで車で10分ほど。ただし徒歩では遠いため、車またはタクシーの利用をおすすめします。"},{"question":"ひとり旅で予約できますか？","answer":"小規模旅館のため一人旅の受け入れについては事前に確認することをおすすめします。ひとり旅歓迎の宿も多い温泉地です。"}],"related_ranking_slugs":["niigata-onsen-secret"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'kougakulou-akakura', 'hotel', 'niigata',
  '香嶽楼', '妙高山の雄大な眺望と赤倉温泉の歴史を受け継ぐ老舗旅館。開湯200年以上の赤倉温泉は硫酸塩泉が特徴で、スキーシーズンと登山シーズン両方の旅人に愛されてきた。', '/images/categories/travel/niigata-hero.jpg',
  '新潟県妙高市赤倉温泉', '赤倉温泉', NULL,
  '16,000円〜（2食付・訪問前確認推奨）', '', 'https://maps.google.com/?q=新潟県妙高市赤倉温泉',
  ARRAY['赤倉温泉', '妙高山', '硫酸塩泉', 'スキー', '登山', '老舗']::text[], '2026-06-08', '妙高山の眺望は露天風呂からが最高。スキー・登山シーズンは早めの予約が必要。温泉地としての歴史が長く、老舗らしい安定感がある。',
  '{"style":"温泉旅館","meals":"両食","onsen":true,"onsen_note":"赤倉温泉（カルシウム・ナトリウム硫酸塩泉）。妙高山を眺める露天風呂。","check_in":"15:00","check_out":"10:00","parking":true,"highlight":"妙高山を望む露天風呂と200年以上の歴史を持つ赤倉温泉の老舗。スキー・登山拠点にも。","official_links":[],"sources":[{"title":"香嶽楼 公式情報（確認推奨）","url":"","sourceType":"editorial","collectedAt":"2026-06-08","note":"価格・設備は変動する場合があります。"}],"faqs":[{"question":"スキー場への送迎はありますか？","answer":"赤倉温泉スキー場への送迎サービスがある場合があります。予約時に確認してください。"},{"question":"妙高山登山の拠点として使えますか？","answer":"妙高高原・燕温泉登山口へのアクセスも可能。登山装備の保管や早朝出発の相談は宿に事前連絡することをおすすめします。"}],"related_ranking_slugs":["niigata-onsen-ryokan-overall","niigata-onsen-scenery"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'kiyotsu-gorge-tunnel', 'leisure_spot', 'niigata',
  '清津峡渓谷トンネル', '日本三大峡谷の一つとして知られる清津峡を、全長のあるトンネルとアート空間「Tunnel of Light」から楽しめる十日町の定番スポットです。', NULL,
  '新潟県十日町市小出癸2119-2', '十日町市', '025-763-4800',
  '一般1,200円、小中学生500円目安', 'https://nakasato-kiyotsu.com/', 'https://maps.google.com/?q=%E6%B8%85%E6%B4%A5%E5%B3%A1%E6%B8%93%E8%B0%B7%E3%83%88%E3%83%B3%E3%83%8D%E3%83%AB%20%E6%96%B0%E6%BD%9F%E7%9C%8C%E5%8D%81%E6%97%A5%E7%94%BA%E5%B8%82%E5%B0%8F%E5%87%BA%E7%99%B82119-2',
  ARRAY['絶景', '自然', 'アート', '写真', '予約日あり']::text[], '2026-06-08', '新潟レジャーの象徴として最初に置きたいスポット。混雑・予約日・冬季条件の確認導線を強く出すと実用性が上がります。',
  '{"kind":"outdoor","genre":"渓谷・アート","best_for":["カップル","写真目的","県外観光"],"highlight":"渓谷美とトンネル内の現代アートを同時に見られる。","parking":true,"parking_note":"周辺駐車場は混雑期に制限される場合があるため公式案内確認推奨。","business_hours":"8:30〜17:00（最終受付16:30）","closed_days":"通常は定休日なし。予約購入限定営業日などは公式確認。","official_links":[{"label":"公式サイト","url":"https://nakasato-kiyotsu.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%B8%85%E6%B4%A5%E5%B3%A1%E6%B8%93%E8%B0%B7%E3%83%88%E3%83%B3%E3%83%8D%E3%83%AB%20%E6%96%B0%E6%BD%9F%E7%9C%8C%E5%8D%81%E6%97%A5%E7%94%BA%E5%B8%82%E5%B0%8F%E5%87%BA%E7%99%B82119-2","type":"map"}],"sources":[{"title":"清津峡 公式サイト","url":"https://nakasato-kiyotsu.com/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、営業時間、最終受付、入坑料、予約購入限定営業日の注意確認。"}],"faqs":[{"question":"清津峡は雨の日でも行けますか？","answer":"トンネル内から鑑賞できますが、現地までの移動や混雑、予約対象日は公式サイトで確認してください。"},{"question":"写真目的で行くなら何に注意すべきですか？","answer":"人気スポットのため、混雑時間帯を避ける計画が必要です。予約購入限定営業日もあります。"}],"related_ranking_slugs":["niigata-leisure-best","niigata-outdoor-leisure"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yuzawa-kogen-panorama-park', 'leisure_spot', 'niigata',
  '湯沢高原パノラマパーク', '湯沢高原ロープウェイで山上へ上がり、アルプの里や展望、カフェを組み合わせて過ごせる越後湯沢の山岳レジャーです。', NULL,
  '新潟県南魚沼郡湯沢町大字湯沢490', '湯沢町', '025-784-3326',
  'ロープウェイ往復込み大人3,500円目安', 'https://www.yuzawakogen.com/green/tickets/', 'https://maps.google.com/?q=%E6%B9%AF%E6%B2%A2%E9%AB%98%E5%8E%9F%E3%83%AD%E3%83%BC%E3%83%97%E3%82%A6%E3%82%A7%E3%82%A4%20%E6%96%B0%E6%BD%9F%E7%9C%8C%E5%8D%97%E9%AD%9A%E6%B2%BC%E9%83%A1%E6%B9%AF%E6%B2%A2%E7%94%BA%E6%B9%AF%E6%B2%A2490',
  ARRAY['ロープウェイ', '展望', '高原', '季節営業', '駅近']::text[], '2026-06-08', '新幹線旅行と相性が良い。天候・整備休業・季節営業の影響を受けるため、行程作成ページでは公式確認を前提にします。',
  '{"kind":"outdoor","genre":"ロープウェイ・高原","best_for":["家族","カップル","越後湯沢旅行"],"highlight":"ロープウェイ、山上散策、カフェを一つの行程にしやすい。","parking":true,"parking_note":"湯沢高原公式のアクセス・駐車案内確認推奨。","business_hours":"夏期の山麓駅舎 8:20〜17:00、ロープウェイ 8:40〜16:40目安","closed_days":"整備休業期間あり。営業日は公式確認。","official_links":[{"label":"料金・営業時間","url":"https://www.yuzawakogen.com/green/tickets/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%B9%AF%E6%B2%A2%E9%AB%98%E5%8E%9F%E3%83%AD%E3%83%BC%E3%83%97%E3%82%A6%E3%82%A7%E3%82%A4%20%E6%96%B0%E6%BD%9F%E7%9C%8C%E5%8D%97%E9%AD%9A%E6%B2%BC%E9%83%A1%E6%B9%AF%E6%B2%A2%E7%94%BA%E6%B9%AF%E6%B2%A2490","type":"map"}],"sources":[{"title":"湯沢高原 料金・営業時間","url":"https://www.yuzawakogen.com/green/tickets/","sourceType":"official","collectedAt":"2026-06-08","note":"営業期間、ロープウェイ運行時間、料金、整備休業注意確認。"}],"faqs":[{"question":"湯沢高原は通年で同じように遊べますか？","answer":"季節営業と整備休業があります。訪問前に営業日と運行状況を確認してください。"},{"question":"車なし旅行にも向きますか？","answer":"越後湯沢駅周辺から組み込みやすく、車なし旅の候補にしやすいスポットです。"}],"related_ranking_slugs":["niigata-leisure-best","niigata-outdoor-leisure"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yahiko-ropeway', 'leisure_spot', 'niigata',
  '弥彦山ロープウェイ', '弥彦山の山麓と山頂側を結ぶロープウェイ。彌彦神社や弥彦公園と合わせて、半日観光に組み込みやすいスポットです。', NULL,
  '新潟県西蒲原郡弥彦村弥彦2898', '弥彦村', '0256-94-4141',
  '料金は公式確認', 'https://www.vill.yahiko.niigata.jp/culture/?content=469', 'https://maps.google.com/?q=%E5%BC%A5%E5%BD%A6%E5%B1%B1%E3%83%AD%E3%83%BC%E3%83%97%E3%82%A6%E3%82%A7%E3%82%A4%20%E6%96%B0%E6%BD%9F%E7%9C%8C%E8%A5%BF%E8%92%B2%E5%8E%9F%E9%83%A1%E5%BC%A5%E5%BD%A6%E6%9D%91%E5%BC%A5%E5%BD%A62898',
  ARRAY['展望', 'ロープウェイ', '神社周辺', '半日観光', '弥彦']::text[], '2026-06-08', '弥彦エリア全体の回遊導線を作る中心。紅葉、神社参拝、温泉を合わせた記事に展開しやすいです。',
  '{"kind":"outdoor","genre":"ロープウェイ・展望","best_for":["カップル","家族","日帰り観光"],"highlight":"彌彦神社周辺とセットで計画しやすい山上展望。","parking":true,"parking_note":"弥彦公園・彌彦神社周辺の駐車場計画と合わせて確認推奨。","business_hours":"9:00〜17:00目安","closed_days":"無休掲載あり。運休・整備日は公式確認。","official_links":[{"label":"弥彦村 観光案内","url":"https://www.vill.yahiko.niigata.jp/culture/?content=469","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E5%BC%A5%E5%BD%A6%E5%B1%B1%E3%83%AD%E3%83%BC%E3%83%97%E3%82%A6%E3%82%A7%E3%82%A4%20%E6%96%B0%E6%BD%9F%E7%9C%8C%E8%A5%BF%E8%92%B2%E5%8E%9F%E9%83%A1%E5%BC%A5%E5%BD%A6%E6%9D%91%E5%BC%A5%E5%BD%A62898","type":"map"}],"sources":[{"title":"弥彦村 弥彦山ロープウェイ","url":"https://www.vill.yahiko.niigata.jp/culture/?content=469","sourceType":"government","collectedAt":"2026-06-08","note":"弥彦村の観光ページでスポット確認。"},{"title":"トクトククーポン 弥彦山ロープウェイ","url":"https://tokutoku-coupon.jp/stores/473/detail","sourceType":"editorial","collectedAt":"2026-06-08","note":"住所、電話、営業時間、無休掲載の補助確認。"}],"faqs":[{"question":"弥彦山ロープウェイは何と組み合わせると良いですか？","answer":"彌彦神社、弥彦公園、温泉街と合わせると半日から1日行程にしやすいです。"},{"question":"天候の影響はありますか？","answer":"ロープウェイは気象条件や整備で変更される可能性があります。訪問前に運行状況を確認してください。"}],"related_ranking_slugs":["niigata-leisure-best","niigata-outdoor-leisure"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'echigo-hillside-park', 'leisure_spot', 'niigata',
  '国営越後丘陵公園', '長岡市の国営公園。花、芝生広場、遊具、季節イベントを組み合わせやすく、家族の外遊び候補として強いスポットです。', NULL,
  '新潟県長岡市宮本東方町字三ツ又1950-1', '長岡市', '0258-47-8001',
  '入園料・駐車料金は公式確認', 'https://echigo-park.jp/', 'https://maps.google.com/?q=%E5%9B%BD%E5%96%B6%E8%B6%8A%E5%BE%8C%E4%B8%98%E9%99%B5%E5%85%AC%E5%9C%92%20%E6%96%B0%E6%BD%9F%E7%9C%8C%E9%95%B7%E5%B2%A1%E5%B8%82%E5%AE%AE%E6%9C%AC%E6%9D%B1%E6%96%B9%E7%94%BA%E4%B8%89%E3%83%84%E5%8F%881950-1',
  ARRAY['公園', '花', '遊具', '家族', '季節イベント']::text[], '2026-06-08', '家族向けランキングの軸になる大型公園。イベント時期ごとの記事化に向いています。',
  '{"kind":"outdoor","genre":"公園・花・遊具","best_for":["家族","ピクニック","外遊び"],"highlight":"広い公園で、花の季節イベントと外遊びをまとめられる。","parking":true,"parking_note":"公式サイトで駐車場・イベント時の案内確認推奨。","business_hours":"時期により変動。公式開園情報を確認。","closed_days":"時期により変動。公式開園情報を確認。","official_links":[{"label":"公式サイト","url":"https://echigo-park.jp/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E5%9B%BD%E5%96%B6%E8%B6%8A%E5%BE%8C%E4%B8%98%E9%99%B5%E5%85%AC%E5%9C%92%20%E6%96%B0%E6%BD%9F%E7%9C%8C%E9%95%B7%E5%B2%A1%E5%B8%82%E5%AE%AE%E6%9C%AC%E6%9D%B1%E6%96%B9%E7%94%BA%E4%B8%89%E3%83%84%E5%8F%881950-1","type":"map"}],"sources":[{"title":"国営越後丘陵公園 公式","url":"https://echigo-park.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、公式開園情報、季節イベントの確認元。"},{"title":"にいがた観光ナビ 国営越後丘陵公園","url":"https://niigata-kankou.or.jp/spot/5957","sourceType":"tourism","collectedAt":"2026-06-08","note":"観光スポットとしての掲載確認。"}],"faqs":[{"question":"国営越後丘陵公園は子ども連れ向きですか？","answer":"広い公園、遊具、季節イベントを組み合わせやすく、家族向け候補として整理しています。"},{"question":"営業時間は固定ですか？","answer":"開園時間や休園日は季節・イベントで変動するため、公式サイトの開園情報を確認してください。"}],"related_ranking_slugs":["niigata-outdoor-leisure","niigata-family-rainyday"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'shinano-river-water-shuttle', 'leisure_spot', 'niigata',
  '信濃川ウォーターシャトル', 'みなとぴあ、朱鷺メッセ、萬代橋、新潟ふるさと村などを結ぶ水上バス。新潟市中心部の移動と観光を同時に楽しめます。', NULL,
  '新潟市内各乗船場', '新潟市中央区', '025-227-5200',
  'シャトル便 大人500円〜1,200円、周遊便 大人1,400円〜1,800円目安', 'https://www.nvcb.or.jp/spot/detail_1158.html', 'https://maps.google.com/?q=%E4%BF%A1%E6%BF%83%E5%B7%9D%E3%82%A6%E3%82%A9%E3%83%BC%E3%82%BF%E3%83%BC%E3%82%B7%E3%83%A3%E3%83%88%E3%83%AB%20%E4%B8%87%E4%BB%A3%E3%82%B7%E3%83%86%E3%82%A4',
  ARRAY['乗り物', '信濃川', '市内観光', '周遊', '車なし']::text[], '2026-06-08', '移動そのものを体験化できるため、車なし観光や市内半日コースの記事で強い導線になります。',
  '{"kind":"outdoor","genre":"水上バス・クルーズ","best_for":["車なし旅行","カップル","親子"],"highlight":"水上移動で萬代橋や信濃川沿いの景観を楽しめる。","parking":false,"parking_note":"乗船場ごとに周辺駐車場・公共交通を確認。","business_hours":"運航日・時刻は公式確認","closed_days":"運航日程は公式確認","official_links":[{"label":"新潟市観光ガイド","url":"https://www.nvcb.or.jp/spot/detail_1158.html","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E4%BF%A1%E6%BF%83%E5%B7%9D%E3%82%A6%E3%82%A9%E3%83%BC%E3%82%BF%E3%83%BC%E3%82%B7%E3%83%A3%E3%83%88%E3%83%AB%20%E4%B8%87%E4%BB%A3%E3%82%B7%E3%83%86%E3%82%A4","type":"map"}],"sources":[{"title":"新潟市観光ガイド 信濃川ウォーターシャトル","url":"https://www.nvcb.or.jp/spot/detail_1158.html","sourceType":"tourism","collectedAt":"2026-06-08","note":"乗船場、電話、料金、ルート概要確認。"}],"faqs":[{"question":"信濃川ウォーターシャトルは移動手段として使えますか？","answer":"みなとぴあ、朱鷺メッセ、萬代橋、新潟ふるさと村などを結ぶため、観光移動にも使いやすいです。"},{"question":"運航時刻は固定ですか？","answer":"運航日や便は変わるため、公式サイトで最新時刻を確認してください。"}],"related_ranking_slugs":["niigata-leisure-best","niigata-outdoor-leisure"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'marinepia-nihonkai', 'leisure_spot', 'niigata',
  '新潟市水族館 マリンピア日本海', '日本海沿いにある新潟市の水族館。屋内展示と屋外エリアを組み合わせられ、雨の日や家族のおでかけ候補として使いやすい施設です。', NULL,
  '新潟県新潟市中央区西船見町5932-445', '新潟市中央区', '025-222-7500',
  '大人1,500円、小中学生600円、幼児200円、3歳まで無料', 'https://www.marinepia.or.jp/info/', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E5%B8%82%E6%B0%B4%E6%97%8F%E9%A4%A8%20%E3%83%9E%E3%83%AA%E3%83%B3%E3%83%94%E3%82%A2%E6%97%A5%E6%9C%AC%E6%B5%B7%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E8%A5%BF%E8%88%B9%E8%A6%8B%E7%94%BA5932-445',
  ARRAY['屋内', '水族館', '家族', '雨の日', '駐車場無料']::text[], '2026-06-08', '雨の日・家族向けの中心施設。新潟市内観光の定番として検索導線を厚くしたいスポットです。',
  '{"kind":"indoor","genre":"水族館","best_for":["家族","雨の日","新潟市観光"],"highlight":"水族館展示、ショー・解説、海沿い散策を組み合わせられる。","parking":true,"parking_note":"公式アクセスでは無料駐車場670台と掲載。","business_hours":"9:00〜17:00（券売16:30まで）","closed_days":"12月29日〜1月1日、3月の第1木曜と翌日","official_links":[{"label":"利用案内","url":"https://www.marinepia.or.jp/info/","type":"website"},{"label":"アクセス","url":"https://www.marinepia.or.jp/access/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E5%B8%82%E6%B0%B4%E6%97%8F%E9%A4%A8%20%E3%83%9E%E3%83%AA%E3%83%B3%E3%83%94%E3%82%A2%E6%97%A5%E6%9C%AC%E6%B5%B7%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E8%A5%BF%E8%88%B9%E8%A6%8B%E7%94%BA5932-445","type":"map"}],"sources":[{"title":"マリンピア日本海 ご利用案内","url":"https://www.marinepia.or.jp/info/","sourceType":"official","collectedAt":"2026-06-08","note":"開館時間、休館日、料金確認。"},{"title":"マリンピア日本海 アクセス","url":"https://www.marinepia.or.jp/access/","sourceType":"official","collectedAt":"2026-06-08","note":"住所、電話、無料駐車場台数確認。"}],"faqs":[{"question":"マリンピア日本海は雨の日でも楽しめますか？","answer":"屋内展示が中心のため、雨の日候補として使いやすい施設です。屋外エリアもあるため天候に合わせて回り方を調整してください。"},{"question":"駐車場はありますか？","answer":"公式アクセスでは無料駐車場670台と掲載されています。"}],"related_ranking_slugs":["niigata-indoor-leisure","niigata-family-rainyday"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'niigata-science-museum', 'leisure_spot', 'niigata',
  '新潟県立自然科学館', '自然科学、生活科学、プラネタリウムなどを扱う参加・体験型の科学館。雨の日や子どもの学習系レジャーに向きます。', NULL,
  '新潟県新潟市中央区女池南3丁目1番1号', '新潟市中央区', '025-283-3331',
  '大人580円、小中学生100円、未就学児無料。プラネタリウム別料金あり', 'https://www.sciencemuseum.jp/guide/', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E7%AB%8B%E8%87%AA%E7%84%B6%E7%A7%91%E5%AD%A6%E9%A4%A8%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%A5%B3%E6%B1%A0%E5%8D%973%E4%B8%81%E7%9B%AE1%E7%95%AA1%E5%8F%B7',
  ARRAY['屋内', '科学館', 'プラネタリウム', '学習', '駐車場無料']::text[], '2026-06-08', '雨の日・学習・プラネタリウムの検索意図を拾えるスポット。新潟市中央区の屋内回遊で使いやすいです。',
  '{"kind":"indoor","genre":"科学館・プラネタリウム","best_for":["家族","雨の日","小学生"],"highlight":"展示とプラネタリウムを組み合わせて半日過ごしやすい。","parking":true,"parking_note":"公式では無料駐車場250台完備と掲載。","business_hours":"平日9:30〜16:30、土日祝・夏期9:30〜17:00","closed_days":"毎週火曜、年末年始ほか","official_links":[{"label":"ご利用案内","url":"https://www.sciencemuseum.jp/guide/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E7%AB%8B%E8%87%AA%E7%84%B6%E7%A7%91%E5%AD%A6%E9%A4%A8%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%A5%B3%E6%B1%A0%E5%8D%973%E4%B8%81%E7%9B%AE1%E7%95%AA1%E5%8F%B7","type":"map"}],"sources":[{"title":"新潟県立自然科学館 ご利用案内","url":"https://www.sciencemuseum.jp/guide/","sourceType":"official","collectedAt":"2026-06-08","note":"開館時間、休館日、料金、住所、電話、駐車場確認。"}],"faqs":[{"question":"自然科学館は小学生向けですか？","answer":"参加・体験型展示やプラネタリウムがあり、小学生の学習系レジャー候補として扱いやすい施設です。"},{"question":"プラネタリウムは入館料に含まれますか？","answer":"公式案内では入館料に加えてプラネタリウム観覧料が設定されています。"}],"related_ranking_slugs":["niigata-indoor-leisure","niigata-family-rainyday"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'niitsu-railway-museum', 'leisure_spot', 'niigata',
  '新潟市新津鉄道資料館', '鉄道の街として栄えた新津の鉄道文化を保存・公開する資料館。屋外車両展示もあり、鉄道好きの親子に向くスポットです。', NULL,
  '新潟県新潟市秋葉区新津東町2-5-6', '新潟市秋葉区', '0250-24-5700',
  '一般390円、高校・大学生260円、小中学生130円目安', 'https://niigata-kankou.or.jp/spot/5615', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E5%B8%82%E6%96%B0%E6%B4%A5%E9%89%84%E9%81%93%E8%B3%87%E6%96%99%E9%A4%A8%20%E6%96%B0%E6%BD%9F%E5%B8%82%E7%A7%8B%E8%91%89%E5%8C%BA%E6%96%B0%E6%B4%A5%E6%9D%B1%E7%94%BA2-5-6',
  ARRAY['屋内', '鉄道', '資料館', '親子', '駐車場無料']::text[], '2026-06-08', '水族館・科学館とは違う屋内軸として有効。秋葉区の地域導線も作れます。',
  '{"kind":"indoor","genre":"鉄道資料館","best_for":["鉄道好き","親子","雨の日"],"highlight":"新津の鉄道文化と屋外車両展示を見られる。","parking":true,"parking_note":"にいがた観光ナビでは普通車30台無料と掲載。","business_hours":"9:30〜17:00（入館16:30まで）","closed_days":"火曜、12月28日〜1月3日ほか","official_links":[{"label":"にいがた観光ナビ","url":"https://niigata-kankou.or.jp/spot/5615","type":"website"},{"label":"公式サイト","url":"https://www.ncnrm.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E5%B8%82%E6%96%B0%E6%B4%A5%E9%89%84%E9%81%93%E8%B3%87%E6%96%99%E9%A4%A8%20%E6%96%B0%E6%BD%9F%E5%B8%82%E7%A7%8B%E8%91%89%E5%8C%BA%E6%96%B0%E6%B4%A5%E6%9D%B1%E7%94%BA2-5-6","type":"map"}],"sources":[{"title":"にいがた観光ナビ 新潟市新津鉄道資料館","url":"https://niigata-kankou.or.jp/spot/5615","sourceType":"tourism","collectedAt":"2026-06-08","note":"住所、アクセス、駐車場、営業時間、休館日、料金、電話確認。"},{"title":"新津鉄道資料館 公式","url":"https://www.ncnrm.com/","sourceType":"official","collectedAt":"2026-06-08","note":"公式サイト確認。"}],"faqs":[{"question":"新津鉄道資料館は鉄道好き以外でも楽しめますか？","answer":"鉄道文化や屋外車両展示を見られるため、親子のおでかけや地域学習の候補として使いやすいです。"},{"question":"週末の子ども料金に注意点はありますか？","answer":"にいがた観光ナビでは土日祝は中学生以下無料と掲載されていますが、最新条件は公式案内を確認してください。"}],"related_ranking_slugs":["niigata-indoor-leisure","niigata-family-rainyday"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'niigata-furusato-mura', 'leisure_spot', 'niigata',
  '新潟ふるさと村', '新潟の観光情報、歴史文化展示、特産品、飲食をまとめて楽しめる複合施設。雨の日やお土産探しにも使いやすいスポットです。', NULL,
  '新潟県新潟市西区山田2307', '新潟市西区', '025-230-3030',
  '入館無料', 'https://www.city.niigata.lg.jp/nishi/shisetsu/yoka/furusatomura.html', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E3%81%B5%E3%82%8B%E3%81%95%E3%81%A8%E6%9D%91%20%E6%96%B0%E6%BD%9F%E5%B8%82%E8%A5%BF%E5%8C%BA%E5%B1%B1%E7%94%B02307',
  ARRAY['屋内', '物産', '観光情報', 'お土産', '駐車場無料']::text[], '2026-06-08', '観光情報と物産が揃うため、旅の初日・最終日どちらにも置きやすい。ウォーターシャトルとの接続も記事化しやすいです。',
  '{"kind":"hybrid","genre":"観光情報・物産・展示","best_for":["家族","雨の日","お土産"],"highlight":"観光情報、展示、物産、飲食を一か所で回れる。","parking":true,"parking_note":"新潟市公式では大駐車場400台と掲載。","business_hours":"アピール館9:00〜17:00、バザール館9:30〜17:30目安","closed_days":"無休","official_links":[{"label":"新潟市 施設案内","url":"https://www.city.niigata.lg.jp/nishi/shisetsu/yoka/furusatomura.html","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E3%81%B5%E3%82%8B%E3%81%95%E3%81%A8%E6%9D%91%20%E6%96%B0%E6%BD%9F%E5%B8%82%E8%A5%BF%E5%8C%BA%E5%B1%B1%E7%94%B02307","type":"map"}],"sources":[{"title":"新潟市 新潟ふるさと村","url":"https://www.city.niigata.lg.jp/nishi/shisetsu/yoka/furusatomura.html","sourceType":"government","collectedAt":"2026-06-08","note":"所在地、電話、開館時間、休館日、駐車場、料金、施設概要確認。"}],"faqs":[{"question":"新潟ふるさと村は無料で入れますか？","answer":"新潟市公式では料金無料と掲載されています。飲食や買い物は別途費用がかかります。"},{"question":"雨の日の観光に向きますか？","answer":"屋内の展示、観光情報、物産、飲食を組み合わせられるため、雨の日候補として使いやすいです。"}],"related_ranking_slugs":["niigata-indoor-leisure","niigata-family-rainyday"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'ikutopia-shoku-hana', 'leisure_spot', 'niigata',
  'いくとぴあ食花', '食育・花育センター、こども創造センター、動物ふれあいセンター、キラキラガーデンなどを含む複合型の体験施設です。', NULL,
  '新潟県新潟市中央区清五郎401', '新潟市中央区', '025-282-4181',
  '施設・体験により異なる', 'https://www.ikutopia.com/', 'https://maps.google.com/?q=%E3%81%84%E3%81%8F%E3%81%A8%E3%81%B4%E3%81%82%E9%A3%9F%E8%8A%B1%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E6%B8%85%E4%BA%94%E9%83%8E401',
  ARRAY['複合施設', '子ども', '花', '動物ふれあい', '屋内外']::text[], '2026-06-08', '家族向け・子ども向けカテゴリを拡張する時の柱。施設ごとに営業時間が違うため、詳細ページで確認導線を強く出します。',
  '{"kind":"hybrid","genre":"食育・花育・体験","best_for":["家族","未就学児","雨の日"],"highlight":"屋内外の複数施設を、子どもの年齢や天候に合わせて選べる。","parking":true,"parking_note":"公式では90分まで無料、以降有料の駐車場案内あり。","business_hours":"主な施設は9:00〜17:00目安。施設により異なる。","closed_days":"不定休。施設により異なる。","official_links":[{"label":"公式サイト","url":"https://www.ikutopia.com/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E3%81%84%E3%81%8F%E3%81%A8%E3%81%B4%E3%81%82%E9%A3%9F%E8%8A%B1%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E6%B8%85%E4%BA%94%E9%83%8E401","type":"map"}],"sources":[{"title":"いくとぴあ食花 公式","url":"https://www.ikutopia.com/","sourceType":"official","collectedAt":"2026-06-08","note":"施設一覧、主な営業時間、不定休、駐車場料金確認。"}],"faqs":[{"question":"いくとぴあ食花は屋内施設ですか？","answer":"屋内施設と屋外施設が混在しています。天候や年齢に合わせて施設を選びやすい複合施設です。"},{"question":"営業時間は全施設共通ですか？","answer":"施設により休業日・営業時間が異なります。公式サイトの施設一覧を確認してください。"}],"related_ranking_slugs":["niigata-family-rainyday","niigata-indoor-leisure"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'view-fukushimagata', 'leisure_spot', 'niigata',
  '水の駅 ビュー福島潟', '福島潟を一望できる展望施設。潟の自然、野鳥、地域文化を学べる展示があり、北区の自然観察と屋内学習をつなげやすい公共系スポットです。', NULL,
  '新潟県新潟市北区前新田乙493', '新潟市北区', '025-387-1491',
  '1〜3階無料、有料ゾーンあり', 'https://view-fukushimagata.niigata.jp/visit/', 'https://maps.google.com/?q=%E6%B0%B4%E3%81%AE%E9%A7%85%20%E3%83%93%E3%83%A5%E3%83%BC%E7%A6%8F%E5%B3%B6%E6%BD%9F%20%E6%96%B0%E6%BD%9F%E5%B8%82%E5%8C%97%E5%8C%BA%E5%89%8D%E6%96%B0%E7%94%B0%E4%B9%99493',
  ARRAY['公共系', '展望', '自然観察', '野鳥', '雨の日']::text[], '2026-06-08', '自然観察と屋内展示をまたぐため、雨の日・自由研究・野鳥観察の導線に使えます。新潟市北区の公共スポットとして厚みを作れます。',
  '{"kind":"hybrid","genre":"自然観察・展望","best_for":["親子","自然観察","雨の日"],"highlight":"展望室と映像展示で、福島潟の自然を屋内から学べる。","parking":true,"parking_note":"公式では普通車120台、大型車5台、思いやり駐車場2台と掲載。","business_hours":"9:00〜17:00（入館は閉館30分前まで）","closed_days":"月曜（休日の場合は翌日）、年末年始12月28日〜1月4日","official_links":[{"label":"公式 ご利用案内","url":"https://view-fukushimagata.niigata.jp/visit/","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%B0%B4%E3%81%AE%E9%A7%85%20%E3%83%93%E3%83%A5%E3%83%BC%E7%A6%8F%E5%B3%B6%E6%BD%9F%20%E6%96%B0%E6%BD%9F%E5%B8%82%E5%8C%97%E5%8C%BA%E5%89%8D%E6%96%B0%E7%94%B0%E4%B9%99493","type":"map"}],"sources":[{"title":"ビュー福島潟 ご利用案内","url":"https://view-fukushimagata.niigata.jp/visit/","sourceType":"official","collectedAt":"2026-06-08","note":"開館時間、休館日、駐車場、住所、電話、施設概要確認。"}],"faqs":[{"question":"ビュー福島潟は屋内施設ですか？","answer":"展望・展示は屋内で楽しめます。福島潟周辺の自然観察と組み合わせる場合は天候に合わせて計画してください。"},{"question":"無料で利用できますか？","answer":"公式案内では1階から3階は無料ゾーン、4階から7階は有料ゾーンとされています。"}],"related_ranking_slugs":["niigata-indoor-leisure","niigata-family-rainyday"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'niigata-botanical-garden', 'leisure_spot', 'niigata',
  '新潟県立植物園', '国内最大級の熱帯植物ドームや企画展示を備える県立植物園。屋外園地と観賞温室を組み合わせて、季節を問わず植物に触れられます。', NULL,
  '新潟県新潟市秋葉区金津186', '新潟市秋葉区', '0250-24-6465',
  '屋外園地無料、観賞温室 大人700円・高校生/学生300円・小中学生100円目安', 'https://niigata-kankou.or.jp/spot/5621', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E7%AB%8B%E6%A4%8D%E7%89%A9%E5%9C%92%20%E6%96%B0%E6%BD%9F%E5%B8%82%E7%A7%8B%E8%91%89%E5%8C%BA%E9%87%91%E6%B4%A5186',
  ARRAY['公共系', '植物園', '温室', '自由研究', '駐車場無料']::text[], '2026-06-08', '屋内温室と屋外園地を両方持つため、雨の日と晴天の両方に展開できます。秋葉区の自然・学習系スポットとして有効です。',
  '{"kind":"hybrid","genre":"植物園・温室","best_for":["親子","雨の日","植物好き"],"highlight":"熱帯植物ドームと企画展示で、屋内でも植物観察ができる。","parking":true,"parking_note":"にいがた観光ナビでは普通車340台無料、大型車ありと掲載。","business_hours":"9:30〜16:30（入館締切16:00）","closed_days":"火曜（祝日の場合は水曜）、年末年始、展示替え臨時休館あり","official_links":[{"label":"にいがた観光ナビ","url":"https://niigata-kankou.or.jp/spot/5621","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E7%AB%8B%E6%A4%8D%E7%89%A9%E5%9C%92%20%E6%96%B0%E6%BD%9F%E5%B8%82%E7%A7%8B%E8%91%89%E5%8C%BA%E9%87%91%E6%B4%A5186","type":"map"}],"sources":[{"title":"にいがた観光ナビ 新潟県立植物園","url":"https://niigata-kankou.or.jp/spot/5621","sourceType":"tourism","collectedAt":"2026-06-08","note":"住所、営業時間、休館日、料金、駐車場、施設特徴確認。"}],"faqs":[{"question":"新潟県立植物園は雨の日でも楽しめますか？","answer":"観賞温室や展示があるため雨の日候補にできます。屋外園地を回る場合は天候に合わせて調整してください。"},{"question":"屋外園地も有料ですか？","answer":"にいがた観光ナビでは屋外園地は無料、観賞温室は入館料が必要と掲載されています。"}],"related_ranking_slugs":["niigata-indoor-leisure","niigata-family-rainyday"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'yahiko-park', 'leisure_spot', 'niigata',
  '弥彦公園', '弥彦駅近くの公園。桜、ホタル、紅葉など季節ごとの見どころがあり、弥彦山ロープウェイや彌彦神社と合わせて回りやすい公共系スポットです。', NULL,
  '新潟県西蒲原郡弥彦村弥彦667-1', '弥彦村', NULL,
  '入園無料目安', 'https://niigata-kankou.or.jp/spot/7482', 'https://maps.google.com/?q=%E5%BC%A5%E5%BD%A6%E5%85%AC%E5%9C%92%20%E6%96%B0%E6%BD%9F%E7%9C%8C%E8%A5%BF%E8%92%B2%E5%8E%9F%E9%83%A1%E5%BC%A5%E5%BD%A6%E6%9D%91%E5%BC%A5%E5%BD%A6667-1',
  ARRAY['公共系', '公園', '紅葉', '桜', '駅近']::text[], '2026-06-08', '既存の弥彦山ロープウェイと相互導線にしやすいスポット。季節イベント・紅葉記事の核になります。',
  '{"kind":"outdoor","genre":"公園・紅葉・桜","best_for":["散策","カップル","半日観光"],"highlight":"弥彦駅徒歩圏で、季節の花や紅葉を見ながら散策できる。","parking":true,"parking_note":"にいがた観光ナビでは普通車2,000台掲載。紅葉期などは有料・混雑あり。","business_hours":"終日開放","closed_days":"なし","official_links":[{"label":"にいがた観光ナビ","url":"https://niigata-kankou.or.jp/spot/7482","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E5%BC%A5%E5%BD%A6%E5%85%AC%E5%9C%92%20%E6%96%B0%E6%BD%9F%E7%9C%8C%E8%A5%BF%E8%92%B2%E5%8E%9F%E9%83%A1%E5%BC%A5%E5%BD%A6%E6%9D%91%E5%BC%A5%E5%BD%A6667-1","type":"map"}],"sources":[{"title":"にいがた観光ナビ 弥彦公園","url":"https://niigata-kankou.or.jp/spot/7482","sourceType":"tourism","collectedAt":"2026-06-08","note":"住所、アクセス、駐車場、終日開放、桜・ホタル・紅葉情報確認。"}],"faqs":[{"question":"弥彦公園は駅から近いですか？","answer":"にいがた観光ナビではJR弥彦線 弥彦駅より徒歩1分と掲載されています。"},{"question":"紅葉時期は駐車場に注意が必要ですか？","answer":"10月下旬から11月下旬は公園周辺駐車場が有料になる掲載があります。混雑も想定して計画してください。"}],"related_ranking_slugs":["niigata-outdoor-leisure","niigata-leisure-best"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'kodomo-shizen-okoku', 'leisure_spot', 'niigata',
  '新潟県立こども自然王国', '柏崎市高柳町にある県立の子ども向け自然体験施設。キャンプ、工作、カヌー、自然観察など、里山での体験メニューを組み合わせられます。', NULL,
  '新潟県柏崎市高柳町高尾30-33', '柏崎市', '0257-41-3355',
  '入館無料、体験・宿泊・入浴は別料金', 'https://niigata-kankou.or.jp/spot/6047', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E7%AB%8B%E3%81%93%E3%81%A9%E3%82%82%E8%87%AA%E7%84%B6%E7%8E%8B%E5%9B%BD%20%E6%9F%8F%E5%B4%8E%E5%B8%82%E9%AB%98%E6%9F%B3%E7%94%BA%E9%AB%98%E5%B0%BE30-33',
  ARRAY['公共系', '子ども', '自然体験', 'キャンプ', '工作']::text[], '2026-06-08', '子ども向けの体験コンテンツを増やす時の強い軸。将来はキャンプ・夏休み・自由研究記事に広げやすいです。',
  '{"kind":"hybrid","genre":"自然体験・キャンプ","best_for":["子連れ","自然体験","宿泊"],"highlight":"自然体験、工作、キャンプ、日帰り入浴まで子ども向け体験が広い。","parking":true,"parking_note":"にいがた観光ナビでは普通車200台と掲載。","business_hours":"9:00〜17:00（最終入場16:30）目安。施設により異なる","closed_days":"月曜（月曜が祝日の場合は翌日）","official_links":[{"label":"にいがた観光ナビ","url":"https://niigata-kankou.or.jp/spot/6047","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E7%AB%8B%E3%81%93%E3%81%A9%E3%82%82%E8%87%AA%E7%84%B6%E7%8E%8B%E5%9B%BD%20%E6%9F%8F%E5%B4%8E%E5%B8%82%E9%AB%98%E6%9F%B3%E7%94%BA%E9%AB%98%E5%B0%BE30-33","type":"map"}],"sources":[{"title":"にいがた観光ナビ 新潟県立こども自然王国","url":"https://niigata-kankou.or.jp/spot/6047","sourceType":"tourism","collectedAt":"2026-06-08","note":"住所、営業時間、休館日、駐車場、体験メニュー、料金確認。"}],"faqs":[{"question":"こども自然王国は日帰りでも使えますか？","answer":"入館無料で体験メニューや日帰り入浴の掲載があります。内容や営業日は施設により異なるため公式確認が必要です。"},{"question":"キャンプや宿泊もできますか？","answer":"にいがた観光ナビではキャンプや本館宿泊の料金掲載があります。予約条件は公式情報を確認してください。"}],"related_ranking_slugs":["niigata-family-rainyday","niigata-outdoor-leisure"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'aqua-park-niigata', 'leisure_spot', 'niigata',
  'アクアパークにいがた', '新潟市西区の温水施設。清掃センターの余熱を利用したプール・浴室系施設として、天候を問わず体を動かしたい日に使いやすいスポットです。', NULL,
  '新潟県新潟市西区笠木3629番地1', '新潟市西区', '025-264-6400',
  '料金は公式確認', 'https://niigata-kankou.or.jp/spot/11337', 'https://maps.google.com/?q=%E3%82%A2%E3%82%AF%E3%82%A2%E3%83%91%E3%83%BC%E3%82%AF%E3%81%AB%E3%81%84%E3%81%8C%E3%81%9F%20%E6%96%B0%E6%BD%9F%E5%B8%82%E8%A5%BF%E5%8C%BA%E7%AC%A0%E6%9C%A83629%E7%95%AA%E5%9C%B01',
  ARRAY['公共系', '屋内', 'プール', '温水施設', '駐車場あり']::text[], '2026-06-08', '観光というより日常レジャー寄りですが、雨の日・健康・親子プールの検索意図を拾えます。地元利用の記事に向きます。',
  '{"kind":"indoor","genre":"温水プール・健康施設","best_for":["親子","雨の日","運動"],"highlight":"屋内温水施設として、雨の日や冬場でも体を動かしやすい。","parking":true,"parking_note":"にいがた観光ナビでは普通車200台、大型車利用可と掲載。","business_hours":"10:00〜22:00（5〜9月の土日祝・7月25日〜8月31日は9:00〜22:00）","closed_days":"水曜、年末年始（GWと7月25日〜8月31日は無休）","official_links":[{"label":"にいがた観光ナビ","url":"https://niigata-kankou.or.jp/spot/11337","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E3%82%A2%E3%82%AF%E3%82%A2%E3%83%91%E3%83%BC%E3%82%AF%E3%81%AB%E3%81%84%E3%81%8C%E3%81%9F%20%E6%96%B0%E6%BD%9F%E5%B8%82%E8%A5%BF%E5%8C%BA%E7%AC%A0%E6%9C%A83629%E7%95%AA%E5%9C%B01","type":"map"}],"sources":[{"title":"にいがた観光ナビ アクアパークにいがた","url":"https://niigata-kankou.or.jp/spot/11337","sourceType":"tourism","collectedAt":"2026-06-08","note":"住所、交通、駐車場、営業時間、定休日、電話確認。"}],"faqs":[{"question":"アクアパークにいがたは雨の日向きですか？","answer":"屋内温水施設のため、雨の日や冬場に体を動かす候補として整理しています。"},{"question":"夏休み期間は営業時間が変わりますか？","answer":"にいがた観光ナビでは、7月25日から8月31日は9時から22時と掲載されています。最新情報は公式確認してください。"}],"related_ranking_slugs":["niigata-indoor-leisure","niigata-family-rainyday"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'toyano-sports-park', 'leisure_spot', 'niigata',
  '鳥屋野潟公園（新潟県スポーツ公園）', 'デンカビッグスワンスタジアムやHARD OFF ECOスタジアム新潟周辺に広がる県立公園。芝生広場、遊具、自然生態園、スケートパークなどを備えます。', NULL,
  '新潟県新潟市中央区清五郎及び長潟地内', '新潟市中央区', '025-286-1080',
  '公園利用は無料目安。施設利用は別途確認', 'https://www.pref.niigata.lg.jp/sec/toshiseibi/1220551354997.html', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84%E5%85%AC%E5%9C%92%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E6%B8%85%E4%BA%94%E9%83%8E',
  ARRAY['公共系', '公園', 'スポーツ', '遊具', 'スケートパーク']::text[], '2026-06-08', '新潟市中心部で日常的に使える公共公園。スポーツイベント、散歩、親子遊びなど複数導線に展開できます。',
  '{"kind":"outdoor","genre":"公園・スポーツ","best_for":["親子","散歩","スポーツ"],"highlight":"大型スタジアム周辺で、芝生・遊具・自然観察・スポーツを組み合わせられる。","parking":true,"parking_note":"新潟県資料では第1約540台、第2約400台、第3約270台の駐車場掲載あり。閉鎖期間あり。","business_hours":"終日開園。施設により利用時間あり","closed_days":"公園は原則常時利用。施設・駐車場は公式確認","official_links":[{"label":"新潟県 施設案内","url":"https://www.pref.niigata.lg.jp/sec/toshiseibi/1220551354997.html","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84%E5%85%AC%E5%9C%92%20%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E6%B8%85%E4%BA%94%E9%83%8E","type":"map"}],"sources":[{"title":"新潟県 鳥屋野潟公園（スポーツ公園）","url":"https://www.pref.niigata.lg.jp/sec/toshiseibi/1220551354997.html","sourceType":"government","collectedAt":"2026-06-08","note":"施設概要、主な施設、スケートパーク情報確認。"},{"title":"新潟県 鳥屋野潟公園資料","url":"https://www.pref.niigata.lg.jp/uploaded/attachment/347429.pdf","sourceType":"government","collectedAt":"2026-06-08","note":"所在地、駐車場、終日開園、問い合わせ先確認。"}],"faqs":[{"question":"鳥屋野潟公園は子ども連れで使えますか？","answer":"芝生広場、遊具、自然生態園などがあり、親子の外遊び候補として整理しています。"},{"question":"駐車場はいつでも使えますか？","answer":"新潟県資料では駐車場閉鎖期間ありとされているため、イベント時や冬期などは公式確認を推奨します。"}],"related_ranking_slugs":["niigata-outdoor-leisure","niigata-family-rainyday"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'teradomari-aquarium', 'leisure_spot', 'niigata',
  '長岡市寺泊水族博物館', '長岡市寺泊にある水族博物館。日本海側のドライブや寺泊観光と合わせやすく、屋内展示中心で家族のおでかけ候補にもなります。', NULL,
  '新潟県長岡市寺泊花立9353-158', '長岡市寺泊', '0258-75-4936',
  '大人700円、中学生450円、小学生350円、幼児200円目安', 'https://aquarium-teradomari.jp/guide', 'https://maps.google.com/?q=%E9%95%B7%E5%B2%A1%E5%B8%82%E5%AF%BA%E6%B3%8A%E6%B0%B4%E6%97%8F%E5%8D%9A%E7%89%A9%E9%A4%A8%20%E9%95%B7%E5%B2%A1%E5%B8%82%E5%AF%BA%E6%B3%8A%E8%8A%B1%E7%AB%8B9353-158',
  ARRAY['公共系', '水族館', '屋内', '寺泊', '家族']::text[], '2026-06-08', '寺泊方面の観光導線を補強できる屋内スポット。既存の新潟市内中心から中越・海沿いへ広げられます。',
  '{"kind":"indoor","genre":"水族博物館","best_for":["親子","雨の日","寺泊観光"],"highlight":"寺泊観光と組み合わせやすい、公共系の水族博物館。","parking":true,"parking_note":"駐車場の詳細は公式・現地案内確認推奨。","business_hours":"9:00〜16:30（最終入館16:00）","closed_days":"年度ごとに休館日掲載あり。公式確認","official_links":[{"label":"公式 ご利用案内","url":"https://aquarium-teradomari.jp/guide","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E9%95%B7%E5%B2%A1%E5%B8%82%E5%AF%BA%E6%B3%8A%E6%B0%B4%E6%97%8F%E5%8D%9A%E7%89%A9%E9%A4%A8%20%E9%95%B7%E5%B2%A1%E5%B8%82%E5%AF%BA%E6%B3%8A%E8%8A%B1%E7%AB%8B9353-158","type":"map"}],"sources":[{"title":"長岡市寺泊水族博物館 ご利用案内","url":"https://aquarium-teradomari.jp/guide","sourceType":"official","collectedAt":"2026-06-08","note":"開館時間、最終入館、休館日、料金、住所、電話確認。"}],"faqs":[{"question":"寺泊水族博物館は雨の日でも使えますか？","answer":"屋内展示中心の水族博物館として、寺泊観光の雨の日候補にできます。"},{"question":"休館日は固定ですか？","answer":"公式では年度ごとの休館日が掲載されています。訪問前に最新の休館日を確認してください。"}],"related_ranking_slugs":["niigata-indoor-leisure","niigata-family-rainyday"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'umigatari-joetsu', 'leisure_spot', 'niigata',
  '上越市立水族博物館 うみがたり', '日本海をテーマにした上越市の水族博物館。大水槽、海中トンネル、マゼランペンギン展示などがあり、上越方面の屋内レジャーの核になります。', NULL,
  '新潟県上越市五智2-15-15', '上越市', '025-543-2449',
  '大人2,000円、高校生1,200円、小中学生1,000円、幼児600円目安', 'https://www.umigatari.jp/joetsu/', 'https://maps.google.com/?q=%E4%B8%8A%E8%B6%8A%E5%B8%82%E7%AB%8B%E6%B0%B4%E6%97%8F%E5%8D%9A%E7%89%A9%E9%A4%A8%20%E3%81%86%E3%81%BF%E3%81%8C%E3%81%9F%E3%82%8A%20%E4%B8%8A%E8%B6%8A%E5%B8%82%E4%BA%94%E6%99%BA2-15-15',
  ARRAY['公共系', '水族館', '屋内', '上越', 'ペンギン']::text[], '2026-06-08', '上越方面のレジャー軸を強化できる大型屋内施設。マリンピア日本海との比較記事にも展開できます。',
  '{"kind":"indoor","genre":"水族博物館","best_for":["親子","雨の日","上越観光"],"highlight":"日本海テーマの展示とマゼランペンギン展示を一度に楽しめる。","parking":true,"parking_note":"公式アクセスでは無料駐車場 一般約580台・大型バス20台と掲載。","business_hours":"通常10:00〜17:00（最終入館16:30）。時期により変動","closed_days":"設備点検休館日あり。公式確認","official_links":[{"label":"公式サイト","url":"https://www.umigatari.jp/joetsu/","type":"website"},{"label":"アクセス","url":"https://www.umigatari.jp/ko/joetsu/access/index.html","type":"website"},{"label":"地図","url":"https://maps.google.com/?q=%E4%B8%8A%E8%B6%8A%E5%B8%82%E7%AB%8B%E6%B0%B4%E6%97%8F%E5%8D%9A%E7%89%A9%E9%A4%A8%20%E3%81%86%E3%81%BF%E3%81%8C%E3%81%9F%E3%82%8A%20%E4%B8%8A%E8%B6%8A%E5%B8%82%E4%BA%94%E6%99%BA2-15-15","type":"map"}],"sources":[{"title":"うみがたり 公式サイト","url":"https://www.umigatari.jp/joetsu/","sourceType":"official","collectedAt":"2026-06-08","note":"施設概要、本日の開館時間、日本海テーマ展示、マゼランペンギン確認。"},{"title":"うみがたり 開館時間・料金","url":"https://www.umigatari.jp/en/joetsu/info/","sourceType":"official","collectedAt":"2026-06-08","note":"通常開館時間、料金、設備点検休館日確認。"},{"title":"うみがたり アクセス","url":"https://www.umigatari.jp/ko/joetsu/access/index.html","sourceType":"official","collectedAt":"2026-06-08","note":"住所、電話、駐車場確認。"}],"faqs":[{"question":"うみがたりはマリンピア日本海とどう使い分けますか？","answer":"新潟市内ならマリンピア日本海、上越方面の旅行や直江津周辺観光ならうみがたりを候補にしやすいです。"},{"question":"開館時間は固定ですか？","answer":"通常は10時から17時ですが、夏期や連休など時期により変動します。公式サイトで最新情報を確認してください。"}],"related_ranking_slugs":["niigata-indoor-leisure","niigata-family-rainyday"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'sea-luvism-bandai', 'beauty_salon', 'niigata',
  'Sea by LUVISM 万代店', '新潟万代ビル8Fに構えるLUVISMグループのプレミアムライン。イルミナカラー・ブリーチ・ダブルカラーを得意とし、20〜30代のカラー重視層から高い支持を集める。新潟駅万代口から徒歩約10分とアクセスも良好。年中無休で夜22時まで営業しており、仕事帰りや週末でも通いやすい環境が整っている。', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
  '新潟県新潟市中央区万代1-3-10 新潟万代ビル8F', '新潟市中央区・万代', '025-278-8332',
  'カット+カラーセット ¥7,950〜', 'https://seabyluvism.jp/salon/sea-by-luvism-%E4%B8%87%E4%BB%A3%E5%BA%97/', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E4%B8%87%E4%BB%A31-3-10%20%E6%96%B0%E6%BD%9F%E4%B8%87%E4%BB%A3%E3%83%93%E3%83%AB%20Sea%20by%20LUVISM',
  ARRAY[]::text[], '2026-06-08', '万代エリアでイルミナカラー・ダブルカラーを得意とするLUVISMグループの上位ライン。20〜30代でカラー重視の読者への最有力候補のひとつ。',
  '{"tagline":"イルミナカラー・ブリーチ・ダブルカラーが得意な万代の実力サロン","access":"新潟駅（万代口）徒歩約10分","treatments":["cut","color","highlight","hairQuality","straightening"],"age_groups":["twenties","thirties"],"cut_price":"要確認（公式サイト・予約サイトで確認）","color_price":"カット+カラーセット ¥7,950〜","parking":false,"parking_note":"万代エリア周辺コインパーキング利用","children_welcome":false,"men_welcome":true,"business_hours":"9:00〜22:00","closed_days":"年中無休","official_links":[{"label":"公式サイト","url":"https://seabyluvism.jp/salon/sea-by-luvism-%E4%B8%87%E4%BB%A3%E5%BA%97/","type":"website"},{"label":"ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000624907/","type":"website"},{"label":"Google マップ","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E4%B8%87%E4%BB%A31-3-10%20%E6%96%B0%E6%BD%9F%E4%B8%87%E4%BB%A3%E3%83%93%E3%83%AB%20Sea%20by%20LUVISM","type":"map"}],"sources":[{"title":"Sea by LUVISM 万代店 公式サイト","url":"https://seabyluvism.jp/salon/sea-by-luvism-%E4%B8%87%E4%BB%A3%E5%BA%97/","sourceType":"official","collectedAt":"2026-06-08","note":"店舗名・住所・電話・営業時間・得意施術を確認。"},{"title":"Sea by LUVISM 万代店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000624907/","sourceType":"local-media","collectedAt":"2026-06-08","note":"料金・メニュー・口コミを確認。"}],"faqs":[{"question":"Sea by LUVISMはどんな人に向いていますか？","answer":"イルミナカラー・ブリーチを使ったハイライトやダブルカラーなど透明感のあるカラーを求める20〜30代の方に向いています。予約はホットペッパービューティーまたは公式サイトから可能です。"},{"question":"万代店の場所はどこですか？","answer":"新潟万代ビル8Fにあります。新潟駅万代口から徒歩約10分です。電話番号は025-278-8332です。"}],"related_ranking_slugs":["niigata-beauty-color","niigata-beauty-by-age"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'cloe-luvism-furumachi', 'beauty_salon', 'niigata',
  'CLOE by LUVISM 古町6番店', '古町通六番町に位置するLUVISMグループのサロン。デザインカラー・オーガニックカラー・髪質改善を中心にメニューを展開し、20〜40代の幅広い層に対応。年中無休で夜22時まで営業と仕事帰りの利用にも便利。カット¥2,500〜とコスパも良好で、古町エリアでの定番サロンとして定着している。', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  '新潟県新潟市中央区古町通六番町982-1 ロンドベル古町6番町', '新潟市中央区・古町', '025-201-9922',
  'カット¥2,500〜 / カット+オーガニックフルカラー¥5,400〜', 'https://cloebyluvism.jp/salon/cloe-by-luvism-%E5%8F%A4%E7%94%BA6%E7%95%AA%E5%BA%97/', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8F%A4%E7%94%BA%E9%80%9A%E5%85%AD%E7%95%AA%E7%94%BA982-1%20CLOE%20by%20LUVISM',
  ARRAY[]::text[], '2026-06-08', '古町エリアでオーガニックカラーを試したい方への第一候補。コスパと立地の良さが20〜40代から支持される。',
  '{"tagline":"オーガニックカラーとデザインカラーを得意とする古町のサロン","access":"古町モール6番町入口・国際調理製菓専門学校向かい","treatments":["cut","color","highlight","hairQuality","treatment"],"age_groups":["twenties","thirties","forties"],"cut_price":"¥2,500〜","color_price":"カット+オーガニックフルカラー ¥5,400〜","parking":false,"parking_note":"古町エリア周辺コインパーキング利用","children_welcome":false,"men_welcome":true,"business_hours":"9:00〜22:00","closed_days":"年中無休","instagram":"https://www.instagram.com/cloebyluvism/","official_links":[{"label":"公式サイト","url":"https://cloebyluvism.jp/salon/cloe-by-luvism-%E5%8F%A4%E7%94%BA6%E7%95%AA%E5%BA%97/","type":"website"},{"label":"ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000577647/","type":"website"},{"label":"Instagram","url":"https://www.instagram.com/cloebyluvism/","type":"instagram"},{"label":"Google マップ","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E5%8F%A4%E7%94%BA%E9%80%9A%E5%85%AD%E7%95%AA%E7%94%BA982-1%20CLOE%20by%20LUVISM","type":"map"}],"sources":[{"title":"CLOE by LUVISM 古町6番店 公式サイト","url":"https://cloebyluvism.jp/salon/cloe-by-luvism-%E5%8F%A4%E7%94%BA6%E7%95%AA%E5%BA%97/","sourceType":"official","collectedAt":"2026-06-08","note":"住所・電話・営業時間・料金を確認。"},{"title":"クロエ バイ ラヴィズム 古町6番店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000577647/","sourceType":"local-media","collectedAt":"2026-06-08","note":"メニュー・料金・口コミを確認。"}],"faqs":[{"question":"古町6番店のカラー料金はどのくらいですか？","answer":"カット+オーガニックフルカラーが¥5,400〜です。詳細メニューはホットペッパービューティーの公式ページでご確認ください。"},{"question":"オーガニックカラーとは何ですか？","answer":"天然由来成分を配合したカラー剤を使用する施術です。頭皮への刺激が少なく、敏感肌の方や薬剤が気になる方に向いています。"}],"related_ranking_slugs":["niigata-beauty-color","niigata-beauty-by-age"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'cloe-luvism-niigataeki', 'beauty_salon', 'niigata',
  'CLOE by LUVISM 新潟駅前店', '新潟駅万代口から徒歩2分のアルファビル2Fに構えるCLOEの駅前店。デザインカラー・オーガニックカラー・縮毛矯正を中心に、10〜30代の学生から社会人まで幅広く対応。カット¥2,400〜と価格の入りやすさも強み。夜22時まで年中無休で営業しており、新潟駅を利用する通勤・通学者の定番サロンとして定着している。', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80',
  '新潟県新潟市中央区花園1-3-23 アルファビル2階', '新潟市中央区・新潟駅前', '025-282-7335',
  'デザインカット¥2,400〜 / カット+オーガニックフルカラー¥4,900〜', 'https://cloebyluvism.jp/salon/niigata_ekimae/', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E8%8A%B1%E5%9C%921-3-23%20%E3%82%A2%E3%83%AB%E3%83%95%E3%82%A1%E3%83%93%E3%83%AB%20CLOE%20by%20LUVISM',
  ARRAY[]::text[], '2026-06-08', '新潟駅徒歩2分という立地と入りやすい価格帯が10〜20代への強み。初めてデザインカラーや縮毛矯正を試す読者への提案先として使いやすい。',
  '{"tagline":"新潟駅徒歩2分・デザインカラーと縮毛矯正が得意な駅前サロン","access":"新潟駅（万代口）徒歩2分","treatments":["cut","color","highlight","hairQuality","straightening"],"age_groups":["teens","twenties","thirties"],"cut_price":"¥2,400〜","color_price":"カット+オーガニックフルカラー ¥4,900〜","parking":false,"parking_note":"駅近のため公共交通機関利用推奨","children_welcome":false,"men_welcome":true,"business_hours":"9:00〜22:00","closed_days":"年中無休","instagram":"https://www.instagram.com/cloebyluvism/","official_links":[{"label":"公式サイト","url":"https://cloebyluvism.jp/salon/niigata_ekimae/","type":"website"},{"label":"ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000316018/","type":"website"},{"label":"Instagram","url":"https://www.instagram.com/cloebyluvism/","type":"instagram"},{"label":"Google マップ","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E8%8A%B1%E5%9C%921-3-23%20%E3%82%A2%E3%83%AB%E3%83%95%E3%82%A1%E3%83%93%E3%83%AB%20CLOE%20by%20LUVISM","type":"map"}],"sources":[{"title":"CLOE by LUVISM 新潟駅前店 公式サイト","url":"https://cloebyluvism.jp/salon/niigata_ekimae/","sourceType":"official","collectedAt":"2026-06-08","note":"住所・電話・営業時間・料金を確認。"},{"title":"クロエ バイ ラヴィズム 新潟駅前店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000316018/","sourceType":"local-media","collectedAt":"2026-06-08","note":"メニュー・口コミを確認。"}],"faqs":[{"question":"新潟駅前店は駅からどのくらいですか？","answer":"新潟駅万代口から徒歩2分、アルファビル2Fです。電話番号は025-282-7335です。"},{"question":"学生でも利用できますか？","answer":"はい。各種クーポンや割引メニューをホットペッパービューティーで確認できます。最新情報は予約サイトまたは電話でご確認ください。"}],"related_ranking_slugs":["niigata-beauty-color","niigata-beauty-by-age"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'delight-designers-works', 'beauty_salon', 'niigata',
  'Delight Designer''s Works', '新潟市中央区東大通の東陽ビル2Fに構えるメンズ専門ヘアサロン。フェードカット・ツーブロック・メンズパーマなどメンズスタイリング全般を高い技術力で提供。新潟駅（花園・沼垂方面出口）から徒歩2分のアクセスも良好。旧東区店から移転後も固定客が多く、新潟市内のメンズサロンとして定評がある。', 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80',
  '新潟県新潟市中央区東大通1丁目5番2号 東陽ビル2F', '新潟市中央区・新潟駅前', '025-384-4559',
  '要確認（公式サイト・予約サイトで確認）', 'https://delightdesignersworks.com/', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E6%9D%B1%E5%A4%A7%E9%80%9A1%E4%B8%81%E7%9B%AE5%E7%95%AA2%E5%8F%B7%20%E6%9D%B1%E9%99%BD%E3%83%93%E3%83%AB%20Delight%20Designers%20Works',
  ARRAY[]::text[], '2026-06-08', '新潟市内でメンズ専門の技術力に定評があるサロン。料金は公式サイトまたはInstagram（@delightdesignersworks）で要確認。',
  '{"tagline":"新潟駅前に構えるメンズ専門ヘアサロン","access":"新潟駅（花園・沼垂方面出口）徒歩2分","treatments":["cut","color","perm"],"age_groups":["teens","twenties","thirties","forties"],"cut_price":"要確認（公式サイトで確認）","parking":false,"parking_note":"駅近のため公共交通機関利用推奨","children_welcome":false,"men_welcome":true,"business_hours":"11:00〜20:00（最終受付19:00）","closed_days":"毎週月曜日（臨時休業あり）","instagram":"https://www.instagram.com/delightdesignersworks/","official_links":[{"label":"公式サイト","url":"https://delightdesignersworks.com/","type":"website"},{"label":"ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000563316/","type":"website"},{"label":"Instagram","url":"https://www.instagram.com/delightdesignersworks/","type":"instagram"},{"label":"Google マップ","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E6%96%B0%E6%BD%9F%E5%B8%82%E4%B8%AD%E5%A4%AE%E5%8C%BA%E6%9D%B1%E5%A4%A7%E9%80%9A1%E4%B8%81%E7%9B%AE5%E7%95%AA2%E5%8F%B7%20%E6%9D%B1%E9%99%BD%E3%83%93%E3%83%AB%20Delight%20Designers%20Works","type":"map"}],"sources":[{"title":"Delight Designer''s Works 公式サイト","url":"https://delightdesignersworks.com/","sourceType":"official","collectedAt":"2026-06-08","note":"移転後の店舗情報・営業時間を確認。"},{"title":"ディライト ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000563316/","sourceType":"local-media","collectedAt":"2026-06-08","note":"メニュー・口コミを確認。"}],"faqs":[{"question":"女性も利用できますか？","answer":"メンズ専門サロンです。詳細は公式サイト（delightdesignersworks.com）またはInstagramでご確認ください。"},{"question":"場所はどこですか？","answer":"新潟市中央区東大通1丁目5番2号 東陽ビル2Fです。新潟駅（花園・沼垂方面出口）から徒歩2分です。電話番号は025-384-4559です。"}],"related_ranking_slugs":["niigata-beauty-by-age"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'ursus-headlight-sakaihi', 'beauty_salon', 'niigata',
  'Ursus hair Design by HEADLIGHT 坂井東店', '新潟市西区坂井東に立地するHEADLIGHTグループのサロン。髪質改善・ヘッドスパ・縮毛矯正・デジタルパーマなど幅広いメニューを提供し、車移動が多い西区・西蒲区の利用者に支持されている。専用駐車場5台完備で、郊外在住者でも通いやすい。カット¥2,700〜とリーズナブルな価格帯も魅力で、年中無休夜21時まで営業。', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
  '新潟県新潟市西区坂井東1-3-15', '新潟市西区', '025-378-3447',
  'カット¥2,700〜', 'https://headlight-inc.com/salon/area04/nigata/ursus-hair-design-niigatasakaihigashi/', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E6%96%B0%E6%BD%9F%E5%B8%82%E8%A5%BF%E5%8C%BA%E5%9D%82%E4%BA%95%E6%9D%B11-3-15%20Ursus%20hair%20Design%20HEADLIGHT',
  ARRAY[]::text[], '2026-06-08', '新潟市西区で髪質改善・ヘッドスパを求める読者への最有力候補。駐車場完備で車移動派にも使いやすく、豊富なメニューで幅広い悩みに対応できる。',
  '{"tagline":"髪質改善・ヘッドスパ・縮毛矯正が揃う駐車場完備の西区サロン","access":"JR小針駅から車約10分 / 大堀幹線沿い・ブックオフ斜め前","treatments":["cut","color","hairQuality","straightening","treatment","headSpa","perm"],"age_groups":["thirties","forties","fifties"],"cut_price":"¥2,700〜","parking":true,"parking_note":"専用駐車場5台あり","children_welcome":false,"men_welcome":true,"business_hours":"9:00〜21:00","closed_days":"年中無休","official_links":[{"label":"公式サイト（HEADLIGHT）","url":"https://headlight-inc.com/salon/area04/nigata/ursus-hair-design-niigatasakaihigashi/","type":"website"},{"label":"ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000362060/","type":"website"},{"label":"Google マップ","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E6%96%B0%E6%BD%9F%E5%B8%82%E8%A5%BF%E5%8C%BA%E5%9D%82%E4%BA%95%E6%9D%B11-3-15%20Ursus%20hair%20Design%20HEADLIGHT","type":"map"}],"sources":[{"title":"Ursus hair Design by HEADLIGHT 坂井東店 HEADLIGHT公式","url":"https://headlight-inc.com/salon/area04/nigata/ursus-hair-design-niigatasakaihigashi/","sourceType":"official","collectedAt":"2026-06-08","note":"住所・電話・営業時間・駐車場・得意施術を確認。"},{"title":"アーサス ヘアー デザイン 坂井東店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000362060/","sourceType":"local-media","collectedAt":"2026-06-08","note":"料金・メニュー・口コミを確認。"}],"faqs":[{"question":"ヘッドスパの予約はできますか？","answer":"はい。ホットペッパービューティーまたは電話（025-378-3447）でご予約いただけます。"},{"question":"駐車場はありますか？","answer":"専用駐車場が5台あります。大堀幹線沿い、ブックオフ斜め前が目印です。"}],"related_ranking_slugs":["niigata-beauty-headspa","niigata-beauty-by-age"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'cloe-luvism-nagaoka', 'beauty_salon', 'niigata',
  'CLOE by LUVISM 長岡古正寺店', '長岡市古正寺に立地するCLOE by LUVISMの長岡店。15台の広い駐車場とキッズスペースを完備し、子連れ家族でも安心して利用できる。イルミナカラー・インナーカラー・ブリーチ・ハイライトなどカラーメニューも充実しており、長岡市内では数少ない「カラー技術とファミリー対応を両立」するサロン。年中無休で夜22時まで営業。', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80',
  '新潟県長岡市古正寺2-57', '長岡市', '0258-86-8755',
  'カット¥2,800〜 / イルミナフルカラー+カット¥7,400〜', 'https://cloebyluvism.jp/salon/kosyoji/', 'https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E9%95%B7%E5%B2%A1%E5%B8%82%E5%8F%A4%E6%AD%A3%E5%AF%BA2-57%20CLOE%20by%20LUVISM',
  ARRAY[]::text[], '2026-06-08', '長岡市内で「子連れOK」かつ「カラー技術も妥協したくない」読者への最優先提案先。駐車場15台は長岡郊外での利便性として大きな強み。',
  '{"tagline":"キッズスペースあり・駐車場15台完備の長岡ファミリーサロン","access":"JR長岡駅から車約10分 / 国道351号・新潟トヨペット左隣","treatments":["cut","color","highlight","hairQuality","perm"],"age_groups":["teens","twenties","thirties","forties"],"cut_price":"¥2,800〜（メンズカット¥2,400〜）","color_price":"イルミナフルカラー+カット ¥7,400〜 / カット+フルカラー ¥5,400〜","parking":true,"parking_note":"専用駐車場15台完備","children_welcome":true,"men_welcome":true,"business_hours":"9:00〜22:00","closed_days":"年中無休","instagram":"https://www.instagram.com/cloebyluvism/","official_links":[{"label":"公式サイト","url":"https://cloebyluvism.jp/salon/kosyoji/","type":"website"},{"label":"ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000375435/","type":"website"},{"label":"Instagram","url":"https://www.instagram.com/cloebyluvism/","type":"instagram"},{"label":"Google マップ","url":"https://maps.google.com/?q=%E6%96%B0%E6%BD%9F%E7%9C%8C%E9%95%B7%E5%B2%A1%E5%B8%82%E5%8F%A4%E6%AD%A3%E5%AF%BA2-57%20CLOE%20by%20LUVISM","type":"map"}],"sources":[{"title":"CLOE by LUVISM 長岡古正寺店 公式サイト","url":"https://cloebyluvism.jp/salon/kosyoji/","sourceType":"official","collectedAt":"2026-06-08","note":"住所・電話・営業時間・駐車場・キッズスペース・料金を確認。"},{"title":"クロエ バイ ラヴィズム 長岡古正寺店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000375435/","sourceType":"local-media","collectedAt":"2026-06-08","note":"メニュー・口コミ・子連れ対応を確認。"}],"faqs":[{"question":"子連れで利用できますか？","answer":"はい。キッズスペースを完備しています。専用駐車場も15台あるため、お子様連れでも安心してご来店いただけます。"},{"question":"長岡駅からのアクセスは？","answer":"JR長岡駅から車約10分です。国道351号沿い、新潟トヨペットの左隣が目印です。電話番号は0258-86-8755です。"}],"related_ranking_slugs":["niigata-beauty-color","niigata-beauty-by-age"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'rem-yamagata-2', 'beauty_salon', 'yamagata',
  'REM 山形2号店', '山形市飯田西のLa Saison Claire 101に構えるヘアサロン。イルミナカラー・アディクシーカラー・TOKIOトリートメント・酸熱トリートメントなど充実したメニューを展開し、20〜30代を中心に支持される。バス停「大学病院」から徒歩1分とアクセスも良好。ホットペッパービューティーではランキング上位に掲載される人気サロン。', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
  '山形県山形市飯田西4-5-33 La Saison Claire 101', '山形市・飯田西', '023-626-5133',
  '要確認（ホットペッパービューティーで確認）', 'https://beauty.hotpepper.jp/slnH000477049/', 'https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E5%B1%B1%E5%BD%A2%E5%B8%82%E9%A3%AF%E7%94%B0%E8%A5%BF4-5-33%20La%20Saison%20Claire%20REM',
  ARRAY[]::text[], '2026-06-08', '山形市内でイルミナカラーと酸熱トリートメントを組み合わせたいカラー重視の読者への有力候補。ホットペッパービューティーのランキング常連店。',
  '{"tagline":"イルミナカラー・アディクシー・酸熱トリートメントが揃う山形市のサロン","access":"バス停「大学病院」徒歩1分 / 「飯田アパート前」徒歩2分 / 蔵王駅から車7分","treatments":["cut","color","highlight","hairQuality","treatment"],"age_groups":["twenties","thirties"],"cut_price":"要確認（公式サイト・予約サイトで確認）","parking":false,"parking_note":"詳細は店舗に要確認","children_welcome":false,"men_welcome":false,"business_hours":"9:00〜20:00","closed_days":"基本なし（年末年始・臨時休業あり）","instagram":"https://www.instagram.com/rem.hairsalon/","official_links":[{"label":"ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000477049/","type":"website"},{"label":"Instagram","url":"https://www.instagram.com/rem.hairsalon/","type":"instagram"},{"label":"Google マップ","url":"https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E5%B1%B1%E5%BD%A2%E5%B8%82%E9%A3%AF%E7%94%B0%E8%A5%BF4-5-33%20La%20Saison%20Claire%20REM","type":"map"}],"sources":[{"title":"REM 山形2号店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000477049/","sourceType":"local-media","collectedAt":"2026-06-08","note":"住所・電話・営業時間・得意施術・口コミを確認。"},{"title":"山形市 ランキング 美容室 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/keyword/%E5%B1%B1%E5%BD%A2%E5%B8%82%E3%80%80%E3%83%A9%E3%83%B3%E3%82%AD%E3%83%B3%E3%82%B0%E3%80%80%E7%BE%8E%E5%AE%B9%E5%AE%A4/","sourceType":"local-media","collectedAt":"2026-06-08","note":"山形市ランキング上位サロンとして掲載確認。"}],"faqs":[{"question":"REMの場所はどこですか？","answer":"山形市飯田西4-5-33 La Saison Claire 101です。バス停「大学病院」から徒歩1分が最寄りです。電話番号は023-626-5133です。"},{"question":"TOKIOトリートメントはカラーと同日にできますか？","answer":"多くの場合、同日施術が可能です。施術時間が長くなるため、予約時に希望をお伝えください。"}],"related_ranking_slugs":["yamagata-beauty-color","yamagata-beauty-by-age"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'hair-design-buco', 'beauty_salon', 'yamagata',
  'HAIR DESIGN BUCO', '山形市荒楯町の国道286号沿いに立地する実力派ヘアサロン。イルミナカラーによる透明感スタイルとドライカット技術を組み合わせた柔らかなテクスチャーが特徴。ショートスタイル・ボブの再現性が高く、白髪染めにも丁寧に対応するため、30〜50代女性からの支持が厚い。店舗前に広い駐車場完備で車移動派にも便利。', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  '山形県山形市荒楯町1-1-8', '山形市・荒楯町', '023-666-7487',
  'カット¥4,950〜 / カット+イルミナカラー¥12,650〜', 'https://hairdesign-buco.com/', 'https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E5%B1%B1%E5%BD%A2%E5%B8%82%E8%8D%92%E6%A5%AF%E7%94%BA1-1-8%20HAIR%20DESIGN%20BUCO',
  ARRAY[]::text[], '2026-06-08', '山形市でイルミナカラーと質感のあるカット技術を求める30〜50代女性への第一候補。駐車場完備で車移動でも通いやすい。',
  '{"tagline":"イルミナカラーとドライカットで柔らかな質感を得意とする山形市の実力店","access":"山形駅から車5分 / 国道286号沿い・店舗前広い駐車場あり","treatments":["cut","color","treatment"],"age_groups":["thirties","forties","fifties"],"cut_price":"¥4,950〜（学割あり）","color_price":"カット+イルミナカラー ¥12,650〜","parking":true,"parking_note":"店舗前に広い駐車場あり","children_welcome":false,"men_welcome":false,"business_hours":"9:30〜19:00（最終受付）","closed_days":"毎週月曜日","official_links":[{"label":"公式サイト","url":"https://hairdesign-buco.com/","type":"website"},{"label":"ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000285830/","type":"website"},{"label":"Google マップ","url":"https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E5%B1%B1%E5%BD%A2%E5%B8%82%E8%8D%92%E6%A5%AF%E7%94%BA1-1-8%20HAIR%20DESIGN%20BUCO","type":"map"}],"sources":[{"title":"HAIR DESIGN BUCO 公式サイト","url":"https://hairdesign-buco.com/","sourceType":"official","collectedAt":"2026-06-08","note":"住所・電話・営業時間・定休日・料金・駐車場を確認。"},{"title":"ヘアー デザイン ブーコ ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000285830/","sourceType":"local-media","collectedAt":"2026-06-08","note":"メニュー・料金・口コミを確認。"}],"faqs":[{"question":"BUCOのカット料金はどのくらいですか？","answer":"¥4,950〜（学割あり）です。カット+イルミナカラーは¥12,650〜です。詳細メニューは公式サイト（hairdesign-buco.com）でご確認ください。"},{"question":"白髪が気になりますが相談できますか？","answer":"はい。白髪染めのほか、白髪を活かすイルミナカラーの提案も行っています。まずはカウンセリングでご相談ください。"}],"related_ranking_slugs":["yamagata-beauty-color","yamagata-beauty-by-age"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'baker-street-yamagata', 'beauty_salon', 'yamagata',
  'Baker Street', '山形市七日町2丁目に構える完全予約制のプライベートサロン。カウンセリングを徹底的に重視し、骨格・ライフスタイルに合わせた似合わせカットに特化。専用駐車場3台完備。新規様は¥3,000〜と比較的入りやすい価格設定で、七日町という中心地の立地も相まって山形市内での口コミ評価が高いサロン。', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
  '山形県山形市七日町2丁目7-23', '山形市・七日町', '023-665-5215',
  'メンテナンスカット¥2,000〜 / 新規限定カット¥3,000〜', 'https://beauty.hotpepper.jp/slnH000679203/', 'https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E5%B1%B1%E5%BD%A2%E5%B8%82%E4%B8%83%E6%97%A5%E7%94%BA2%E4%B8%81%E7%9B%AE7-23%20Baker%20Street',
  ARRAY[]::text[], '2026-06-08', '「カット技術と似合わせ提案を重視したい」山形市内の30〜50代女性への提案先として有効。完全予約制のプライベート感が評価されている。',
  '{"tagline":"完全予約制・カウンセリング重視の似合わせカット専門プライベートサロン","access":"山形駅・北山形駅から車6分 / 専用駐車場3台あり","treatments":["cut","color"],"age_groups":["thirties","forties","fifties"],"cut_price":"¥2,000〜（メンテナンス） / ¥3,000〜（新規）","parking":true,"parking_note":"専用駐車場3台あり","children_welcome":false,"men_welcome":false,"business_hours":"9:00〜20:00","closed_days":"要確認（ホットペッパービューティーで確認）","official_links":[{"label":"ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000679203/","type":"website"},{"label":"Google マップ","url":"https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E5%B1%B1%E5%BD%A2%E5%B8%82%E4%B8%83%E6%97%A5%E7%94%BA2%E4%B8%81%E7%9B%AE7-23%20Baker%20Street","type":"map"}],"sources":[{"title":"ベイカーストリート(Baker Street) ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000679203/","sourceType":"local-media","collectedAt":"2026-06-08","note":"住所・電話・営業時間・料金・口コミを確認。"}],"faqs":[{"question":"Baker Streetは予約が必要ですか？","answer":"完全予約制です。ホットペッパービューティーまたは電話（023-665-5215）でご予約ください。"},{"question":"初めて行く場合の料金はどのくらいですか？","answer":"新規様限定カットが¥3,000〜です。詳細はホットペッパービューティーのページでご確認ください。"}],"related_ranking_slugs":["yamagata-beauty-by-age"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'agu-navy-tsuruoka', 'beauty_salon', 'yamagata',
  'Agu hair navy 鶴岡東原店', '鶴岡市東原町の羽黒街道沿いに立地するAguヘアーネイビーの鶴岡店。カット¥2,500〜・カット+カラー¥3,900〜と庄内エリアでも入りやすい価格帯が魅力。7〜8台の駐車場完備で年中無休、夜21時まで営業しており、仕事帰りや週末でも立ち寄りやすい。10〜40代まで幅広い年代に対応し、鶴岡市内での定番サロンとして定着している。', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80',
  '山形県鶴岡市東原町17-28', '鶴岡市・東原', '0235-33-9743',
  'カット¥2,500〜 / カット+カラー¥3,900〜', 'https://agu-hair.com/salon/2047/', 'https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E9%B6%B4%E5%B2%A1%E5%B8%82%E6%9D%B1%E5%8E%9F%E7%94%BA17-28%20Agu%20hair%20navy',
  ARRAY[]::text[], '2026-06-08', '鶴岡・庄内エリアでコスパを重視する読者への最初の提案先として使いやすい。駐車場・年中無休・夜21時まで営業の三拍子が揃っている。',
  '{"tagline":"コスパと技術を両立した鶴岡市の年中無休サロン","access":"羽黒街道（県道47号線）沿い / グランドエル・サン近く / 食彩居酒屋「赤のれん」隣","treatments":["cut","color","perm"],"age_groups":["teens","twenties","thirties","forties"],"cut_price":"¥2,500〜","color_price":"カット+カラー ¥3,900〜","parking":true,"parking_note":"専用駐車場7〜8台あり","children_welcome":false,"men_welcome":true,"business_hours":"9:00〜21:00（カット最終受付20:00）","closed_days":"年中無休","official_links":[{"label":"Agu公式サイト","url":"https://agu-hair.com/salon/2047/","type":"website"},{"label":"ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000457001/","type":"website"},{"label":"Google マップ","url":"https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E9%B6%B4%E5%B2%A1%E5%B8%82%E6%9D%B1%E5%8E%9F%E7%94%BA17-28%20Agu%20hair%20navy","type":"map"}],"sources":[{"title":"Agu hair navy 鶴岡東原店 Agu公式サイト","url":"https://agu-hair.com/salon/2047/","sourceType":"official","collectedAt":"2026-06-08","note":"住所・電話・営業時間・駐車場・料金を確認。"},{"title":"アグ ヘアー ネイビー 鶴岡東原店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000457001/","sourceType":"local-media","collectedAt":"2026-06-08","note":"メニュー・口コミを確認。"}],"faqs":[{"question":"Agu鶴岡店のカラー料金はどのくらいですか？","answer":"カット+カラーで¥3,900〜です。詳細メニューはホットペッパービューティーまたは電話（0235-33-9743）でご確認ください。"},{"question":"駐車場はありますか？","answer":"専用駐車場が7〜8台あります。羽黒街道沿い、食彩居酒屋「赤のれん」隣が目印です。"}],"related_ranking_slugs":["yamagata-beauty-color","yamagata-beauty-by-age"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'earth-tsuruoka', 'beauty_salon', 'yamagata',
  'HAIR & MAKE EARTH 鶴岡店', '鶴岡市美咲町に立地するHAIR & MAKE EARTHの鶴岡店。全国に400店舗以上を展開するEARTHグループの一店として、カラー・パーマ・トリートメントなど幅広いメニューを提供。統一されたマニュアルと技術研修による安定した品質が特徴で、初めて行くサロンとして安心感がある。年中無休で営業。', 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80',
  '山形県鶴岡市美咲町3-11', '鶴岡市・美咲町', '050-8884-1558',
  '要確認（公式サイト・予約サイトで確認）', 'https://map.hairmake-earth.com/salon/227', 'https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E9%B6%B4%E5%B2%A1%E5%B8%82%E7%BE%8E%E5%92%B2%E7%94%BA3-11%20HAIR%20MAKE%20EARTH',
  ARRAY[]::text[], '2026-06-08', '全国チェーンの安定した品質と年中無休の利便性が強み。「初めて行くサロンで失敗したくない」読者への鶴岡エリアの安心候補。',
  '{"tagline":"全国展開の実力チェーン・鶴岡市の年中無休サロン","access":"JR鶴岡駅から車10分（徒歩46分）","treatments":["cut","color","perm","treatment"],"age_groups":["twenties","thirties","forties"],"cut_price":"要確認（公式サイトで確認）","parking":false,"parking_note":"詳細は店舗に要確認","children_welcome":false,"men_welcome":true,"business_hours":"日〜木・祝: 9:00〜17:00 / 金・土: 9:00〜18:00","closed_days":"年中無休","official_links":[{"label":"EARTH公式サイト","url":"https://map.hairmake-earth.com/salon/227","type":"website"},{"label":"Google マップ","url":"https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E9%B6%B4%E5%B2%A1%E5%B8%82%E7%BE%8E%E5%92%B2%E7%94%BA3-11%20HAIR%20MAKE%20EARTH","type":"map"}],"sources":[{"title":"HAIR & MAKE EARTH 鶴岡店 EARTH公式サイト","url":"https://map.hairmake-earth.com/salon/227","sourceType":"official","collectedAt":"2026-06-08","note":"住所・電話・営業時間を確認。"},{"title":"楽天ビューティ 酒田・鶴岡 美容室","url":"https://beauty.rakuten.co.jp/area0605/sort15/","sourceType":"local-media","collectedAt":"2026-06-08","note":"庄内エリアの注目サロンとして掲載確認。"}],"faqs":[{"question":"EARTHは初めてでも安心ですか？","answer":"はい。全国チェーンのため統一された施術基準があり、初めての方でも安心して利用いただけます。詳細メニューと料金はEARTH公式サイトまたは電話でご確認ください。"},{"question":"鶴岡駅からのアクセスは？","answer":"JR鶴岡駅から車で約10分です。電話番号は050-8884-1558です。"}],"related_ranking_slugs":["yamagata-beauty-by-age"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'earth-sakata', 'beauty_salon', 'yamagata',
  'HAIR & MAKE EARTH 酒田店', '酒田市松原南に立地するHAIR & MAKE EARTHの酒田店。全国チェーンの安定した技術とメニューの豊富さが魅力。カラー・パーマ・カット全般に対応し、庄内エリアの酒田在住者に利用しやすい年中無休営業。電話番号は0234-25-6171で、メニューや料金の詳細は公式サイトまたは楽天ビューティーで確認できる。', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80',
  '山形県酒田市松原南1-5', '酒田市・松原南', '0234-25-6171',
  '要確認（公式サイト・予約サイトで確認）', 'https://map.hairmake-earth.com/salon/175', 'https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E9%85%92%E7%94%B0%E5%B8%82%E6%9D%BE%E5%8E%9F%E5%8D%971-5%20HAIR%20MAKE%20EARTH',
  ARRAY[]::text[], '2026-06-08', '酒田市で安定したサービスを年中無休で受けられるチェーンサロン。庄内エリア在住で「まず試してみたい」読者への入門候補として紹介しやすい。',
  '{"tagline":"酒田市の年中無休サロン・カラーとパーマが揃うEARTHグループ","access":"要確認（公式サイトで確認）","treatments":["cut","color","perm","treatment"],"age_groups":["twenties","thirties","forties"],"cut_price":"要確認（公式サイトで確認）","parking":false,"parking_note":"詳細は店舗に要確認","children_welcome":false,"men_welcome":true,"business_hours":"日〜木: 9:00〜17:00（カラー・パーマ）/ 9:00〜18:00（カット） / 金・土: 9:00〜17:00（カラー・パーマ）/ 9:00〜18:00（カット）","closed_days":"年中無休","official_links":[{"label":"EARTH公式サイト","url":"https://map.hairmake-earth.com/salon/175","type":"website"},{"label":"ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000232955/","type":"website"},{"label":"Google マップ","url":"https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E9%85%92%E7%94%B0%E5%B8%82%E6%9D%BE%E5%8E%9F%E5%8D%971-5%20HAIR%20MAKE%20EARTH","type":"map"}],"sources":[{"title":"HAIR & MAKE EARTH 酒田店 EARTH公式サイト","url":"https://map.hairmake-earth.com/salon/175","sourceType":"official","collectedAt":"2026-06-08","note":"住所・電話・営業時間を確認。"},{"title":"アース 酒田店 ホットペッパービューティー","url":"https://beauty.hotpepper.jp/slnH000232955/","sourceType":"local-media","collectedAt":"2026-06-08","note":"メニュー・口コミを確認。"}],"faqs":[{"question":"酒田店の場所はどこですか？","answer":"山形県酒田市松原南1-5です。電話番号は0234-25-6171です。詳細なアクセスは公式サイトまたは電話でご確認ください。"},{"question":"料金はどのくらいですか？","answer":"EARTH公式サイト（map.hairmake-earth.com/salon/175）またはホットペッパービューティーで最新の料金をご確認ください。"}],"related_ranking_slugs":["yamagata-beauty-color","yamagata-beauty-by-age"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'lafucona-tendo', 'beauty_salon', 'yamagata',
  'LAFUCONA', '山形県天童市芳賀タウン南に立地するヘアサロン。天童市内のサロンとして地域住民に利用されている。営業時間は9:30〜18:00、定休日は毎週月曜・第3日曜。詳細メニューや料金については公式サイト（lafucona.com）でご確認ください。', 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80',
  '山形県天童市芳賀タウン南2丁目11番23号', '天童市・芳賀タウン南', '023-674-9447',
  '要確認（公式サイトで確認）', 'https://lafucona.com/', 'https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E5%A4%A9%E7%AB%A5%E5%B8%82%E8%8A%B3%E8%B3%80%E3%82%BF%E3%82%A6%E3%83%B3%E5%8D%972%E4%B8%81%E7%9B%AE11%E7%95%AA23%E5%8F%B7%20LAFUCONA',
  ARRAY[]::text[], '2026-06-08', '天童市在住者向けの地域密着サロン。詳細メニュー・料金・特色は公式サイト（lafucona.com）または電話（023-674-9447）でご確認ください。',
  '{"tagline":"天童市の芳賀タウン南エリアに構えるヘアサロン","access":"要確認（公式サイトで確認）","treatments":["cut","color","treatment"],"age_groups":["twenties","thirties","forties"],"cut_price":"要確認（公式サイトで確認）","parking":false,"parking_note":"詳細は店舗に要確認","children_welcome":false,"men_welcome":false,"business_hours":"9:30〜18:00","closed_days":"毎週月曜日・第3日曜日","official_links":[{"label":"公式サイト","url":"https://lafucona.com/","type":"website"},{"label":"Google マップ","url":"https://maps.google.com/?q=%E5%B1%B1%E5%BD%A2%E7%9C%8C%E5%A4%A9%E7%AB%A5%E5%B8%82%E8%8A%B3%E8%B3%80%E3%82%BF%E3%82%A6%E3%83%B3%E5%8D%972%E4%B8%81%E7%9B%AE11%E7%95%AA23%E5%8F%B7%20LAFUCONA","type":"map"}],"sources":[{"title":"LAFUCONA 公式サイト","url":"https://lafucona.com/","sourceType":"official","collectedAt":"2026-06-08","note":"住所・電話・営業時間・定休日を確認。"}],"faqs":[{"question":"LAFUCONAの場所はどこですか？","answer":"山形県天童市芳賀タウン南2丁目11番23号です。電話番号は023-674-9447です。"},{"question":"どのようなメニューがありますか？","answer":"詳細メニューは公式サイト（lafucona.com）でご確認ください。不明な点は電話でお問い合わせいただくのが確実です。"}],"related_ranking_slugs":["yamagata-beauty-by-age"]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'myprotein-impact-whey', 'protein', NULL,
  'Myprotein Impact Whey Protein（インパクトホエイプロテイン）', 'ヨーロッパ最大のスポーツ栄養ブランド・Myproteinのベストセラー商品。乳牛の乳から精製・乾燥した100%天然由来ホエイを使用し、50種類以上のフレーバーが揃う。頻繁なセール・クーポンでコスパは国内トップクラス。', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80',
  NULL, NULL, NULL,
  '¥4,000', 'https://www.myprotein.jp/p/sports-nutrition/myprotein-impact-whey-protein-jp-edition/15278802/', NULL,
  ARRAY['ヨーロッパ最大スポーツ栄養ブランド', '50種類以上のフレーバー展開', '頻繁なセール・クーポンでさらに安く', '1kg・2.5kg・5kgと容量展開が豊富', '天然由来100%ホエイ']::text[], '2026-06-08', 'コスパ最優先の学生・男性向けの最有力候補。セール情報をこまめにチェックすることが重要で、30〜40%オフのタイミングでまとめ買いすると最安クラスになる。',
  '{"brand":"Myprotein","protein_type":"whey-wpc","targets":["men","women","student","beginner"],"serving_size":25,"protein":21,"calories":111,"carbs":4.8,"fat":3.2,"package_weight":1000,"price_per_kg":4000,"flavors":["チョコレートスムージー","ナチュラルバニラ","ストロベリークリーム","抹茶ラテ","北海道ミルク","桜ストロベリーミルク","ミックスジュース","他40種類以上"],"pros":["フレーバーの豊富さは業界最多クラス","セール時は¥2,000台/kgになることも","1食25gあたり21gのタンパク質","国内外で長年の実績・信頼性"],"cons":["通常価格はやや高め","セール時のまとめ買いが前提","海外ブランドのため日本語サポートが限定的"],"sources":[{"title":"Myprotein Impact Whey Protein 公式JP","url":"https://www.myprotein.jp/p/sports-nutrition/myprotein-impact-whey-protein-jp-edition/15278802/","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・価格・フレーバーを確認。"},{"title":"Myprotein JP 公式サイト","url":"https://www.myprotein.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"ブランド情報・セール情報を確認。"}],"faqs":[{"question":"Myproteinはどこで買えますか？","answer":"公式サイト（myprotein.jp）での購入が最も価格が安く、フレーバーの選択肢も最多です。Amazonや楽天でも購入可能ですが、公式サイトのセール時が最安になることが多いです。"},{"question":"セールはどのくらいの頻度で実施されますか？","answer":"ブラックフライデー・年始・季節ごとに大型セールが実施されます。メールマガジン登録やSNSフォローでセール情報を入手できます。30〜40%オフになることも多いです。"}]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'on-gold-standard-whey', 'protein', NULL,
  'Optimum Nutrition（オプティマムニュートリション） Gold Standard 100% Whey（ゴールドスタンダード100%ホエイ）', '世界的ベストセラープロテイン。WPI（ホエイプロテインアイソレート）を主体とした高純度配合で、BCAAs 5.5g/食を含む。遺伝子組み換え不使用。品質と実績で世界中のアスリートから支持される。', 'https://images.unsplash.com/photo-1627393047483-e4c81acaf2d4?w=800&q=80',
  NULL, NULL, NULL,
  '¥6,280', 'https://www.optimumnutrition.com/ja-jp/', NULL,
  ARRAY['WPI主体の高純度配合', 'BCAA 5.5g/1食含有', '遺伝子組み換え不使用', '世界累計売上No.1クラス', 'グルタミン4g/1食含有']::text[], '2026-06-08', '品質・純度を最優先するトレーナー・上級者向けの定番。WPI主体の配合は脂質・乳糖が少なく消化吸収に優れる。コスパより品質重視の層に最適。',
  '{"brand":"Optimum Nutrition（オプティマムニュートリション）","protein_type":"whey-wpi","targets":["trainer","men"],"serving_size":30,"protein":24,"calories":119,"carbs":4,"fat":1,"package_weight":908,"price_per_kg":6919,"flavors":["ダブルリッチチョコレート","クッキー&クリーム","ストロベリーバナナ","バニラアイスクリーム","エクストリームミルクチョコレート","他多数"],"pros":["1食24gと高タンパク質","脂質わずか1g/食","WPI主体で消化吸収が早い","世界的実績による信頼性"],"cons":["1kg換算で¥6,919と価格は高め","大容量サイズは輸入コストが加わる","味のバリエーションはMyproteinより少ない"],"sources":[{"title":"Optimum Nutrition Gold Standard 公式JP","url":"https://www.optimumnutrition.com/ja-jp/","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・価格・フレーバーを確認。"},{"title":"コストコ Gold Standard 2.88kg","url":"https://www.costco.co.jp/","sourceType":"local-media","collectedAt":"2026-06-08","note":"2.88kg大容量サイズの価格を確認。"},{"title":"iHerb Gold Standard 2.17kg","url":"https://jp.iherb.com/","sourceType":"other","collectedAt":"2026-06-08","note":"海外購入価格の参考として確認。"}],"faqs":[{"question":"コストコでも買えますか？","answer":"はい。コストコでは2.88kgの大容量サイズが約¥12,280（税込）で販売されており、1kg換算約¥4,264と公式価格より安くなります。コストコ会員の方は検討の価値があります。"},{"question":"WPCとWPIの違いは何ですか？","answer":"WPC（ホエイプロテインコンセントレート）は80%前後のタンパク質含有率。WPI（アイソレート）は90%以上で脂質・乳糖がほぼ除去されています。Gold StandardはWPI主体のためタンパク質純度が高く、乳糖不耐症気味の方にも向きます。"}]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'savas-whey-100', 'protein', NULL,
  'ザバス（SAVAS）／株式会社明治 ホエイプロテイン100', '国内最大手スポーツ栄養ブランド・明治が展開するザバスの代表商品。ドラッグストア・スーパー・コンビニでも入手できる国産プロテイン。4種のビタミンB群＋ビタミンC・Dを配合し、トレーニングサポートに対応。', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
  NULL, NULL, NULL,
  '¥4,500', 'https://www.meiji.co.jp/sports/savas/products/built_powered/whey100.html', NULL,
  ARRAY['ドラッグストア・スーパーで入手可能', '国産ブランド・明治グループ', 'ビタミンB群・C・D配合', '日本語サポート完備', '初心者に選ばれやすい知名度']::text[], '2026-06-08', '「まず試してみたい初心者」「近所のドラッグストアで買いたい」読者への最初の提案先。国産・明治ブランドの安心感が特に初心者・女性に支持される。',
  '{"brand":"ザバス（SAVAS）／株式会社明治","protein_type":"whey-wpc","targets":["beginner","women","student"],"serving_size":28,"protein":19.5,"calories":111,"carbs":3.7,"fat":2,"package_weight":980,"price_per_kg":4592,"flavors":["リッチショコラ","バニラ","ストロベリー","ミルクティー","バナナ","バニラアイスクリーム","ビターショコラ","抹茶","すっきりフルーティー"],"pros":["コンビニ・薬局でもすぐ買える","日本語の公式サポートが充実","ビタミン補給も同時にできる","フレーバーが豊富（9種類）"],"cons":["1食あたりのタンパク質量は19.5gとやや少なめ","1kg換算価格は海外ブランドより割高","大容量サイズがない（最大980g）"],"sources":[{"title":"ザバス ホエイプロテイン100 明治公式","url":"https://www.meiji.co.jp/sports/savas/products/built_powered/whey100.html","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・フレーバー・ビタミン配合を確認。"},{"title":"価格.com ザバス ホエイプロテイン100","url":"https://kakaku.com/","sourceType":"local-media","collectedAt":"2026-06-08","note":"最安値・価格推移を確認。"}],"faqs":[{"question":"ザバスはコンビニで買えますか？","answer":"はい。ローソン・ファミリーマートなど主要コンビニのほか、マツモトキヨシ等のドラッグストア、スーパーでも購入できます。スポーツ用品店ではより多くのフレーバーが揃っています。"},{"question":"初心者がまず選ぶなら何フレーバーがおすすめですか？","answer":"「リッチショコラ」が最もクセがなく飲みやすいと口コミで評価されています。甘い味が苦手な方は牛乳で割ることでマイルドになります。"}]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'grong-whey-standard', 'protein', NULL,
  'GronG（グロング） ホエイプロテイン100 スタンダード', 'Amazonホエイプロテインランキング上位の常連・国内製造ブランド。WPC使用でタンパク質含有率75%以上を確保し、11種のビタミン配合。1kg¥4,480・3kgでさらにお得と、価格と品質のバランスで高評価を獲得している。', 'https://images.unsplash.com/photo-1579722820903-4eb93ac8a911?w=800&q=80',
  NULL, NULL, NULL,
  '¥4,480', 'https://shop.grong.jp/products/whey-protein-standard', NULL,
  ARRAY['国内製造WPC', '11種のビタミン配合', 'タンパク質含有率75%以上', 'Amazonランキング上位常連', '1kg・3kg展開']::text[], '2026-06-08', '「コスパを重視しつつ国内製造を選びたい」層への最有力候補。3kgまとめ買いで1kg換算¥3,993は国内製造ブランド中トップクラスのコスパ。',
  '{"brand":"GronG（グロング）","protein_type":"whey-wpc","targets":["men","women","student","diet","beginner"],"serving_size":29,"protein":22.3,"calories":118,"carbs":2.5,"fat":2.1,"package_weight":1000,"price_per_kg":4480,"flavors":["ナチュラル（無味）","チョコレート","ストロベリー","バナナ","ヨーグルト"],"pros":["1食22.3gのタンパク質でコスパ優秀","低糖質（2.5g/食）でダイエットにも","国内製造の安心感","3kg購入で1kg換算¥3,993とさらにお得"],"cons":["フレーバーは5種類と少なめ","ナチュラル（無味）は慣れが必要","日本語公式サポートはWebのみ"],"sources":[{"title":"GronG ホエイプロテイン100 スタンダード 公式","url":"https://shop.grong.jp/products/whey-protein-standard","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・価格・フレーバー・ビタミン配合を確認。"},{"title":"my-best.com GronGレビュー","url":"https://my-best.com/","sourceType":"editorial","collectedAt":"2026-06-08","note":"口コミ・評価情報を参考として確認。"}],"faqs":[{"question":"GronGの3kgと1kgどちらがお得ですか？","answer":"3kg（¥11,980）の方が1kg換算で約¥3,993となり、1kg（¥4,480）より約¥487/kg安くなります。長期継続の見込みがある方には3kgの一括購入がおすすめです。"},{"question":"ナチュラル（無味）フレーバーはどう使いますか？","answer":"牛乳・豆乳・ヨーグルト・スムージーに混ぜると飲みやすくなります。料理（お菓子・パンケーキ等）に加えて食事からタンパク質を補う使い方も人気です。"}]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'dns-whey-100', 'protein', NULL,
  'DNS（ディーエヌエス） プロテインホエイ100', '第一三共ヘルスケアグループ傘下のスポーツ栄養ブランドDNSの看板商品。国内食品工場で製造し、合成着色料・遺伝子組み換え原料不使用。1食24.2gのタンパク質と8種類のフレーバーで、品質重視の日本人向けに設計された高品質ホエイプロテイン。', 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=800&q=80',
  NULL, NULL, NULL,
  '¥4,980', 'https://shop.dnszone.jp/', NULL,
  ARRAY['国内食品工場製造', '合成着色料・遺伝子組み換え不使用', '水だけで美味しく溶ける', 'スポーツ専門店での取り扱いが多い', '第一三共ヘルスケアグループ']::text[], '2026-06-08', '「国産・品質最優先で価格は二の次」というトレーニー向けの選択肢。第一三共ヘルスケアグループの品質管理と国内製造の安心感が最大の強み。',
  '{"brand":"DNS（ディーエヌエス）","protein_type":"whey-wpc","targets":["men","trainer"],"serving_size":35,"protein":24.2,"calories":142,"carbs":4.7,"fat":2.9,"package_weight":630,"price_per_kg":7905,"flavors":["プレミアムチョコレート","リッチバニラ","いちごミルク","カフェオレ","抹茶","バナナオレ","トロピカルマンゴー","レモン"],"pros":["国内製造・高品質基準","1食24.2gの高タンパク","フレーバーが豊富（8種類）","溶けやすく飲みやすい"],"cons":["1kg換算¥7,905と価格は高め","630gサイズが主力でコスパに限界","セールが少なく価格変動が小さい"],"sources":[{"title":"DNS プロテインホエイ100 公式","url":"https://shop.dnszone.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・価格・フレーバー・製造情報を確認。"},{"title":"価格.com DNS プロテインホエイ100","url":"https://kakaku.com/","sourceType":"local-media","collectedAt":"2026-06-08","note":"価格推移を確認。"}],"faqs":[{"question":"DNSは信頼できるブランドですか？","answer":"はい。第一三共ヘルスケアグループ傘下で、国内食品工場での製造・合成着色料不使用・遺伝子組み換え不使用と品質基準が明確です。スポーツ専門店での取り扱いも多く、日本のスポーツ栄養ブランドとして長い実績があります。"},{"question":"水で溶かしても飲みやすいですか？","answer":"はい。公式でも「水だけで美味しく溶ける」と謳っており、シェイカーで振るだけできれいに溶けます。牛乳で割ると濃厚さが増します。"}]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'valx-whey-wpc', 'protein', NULL,
  'VALX（バルクス） ホエイプロテイン WPC', '筋肉博士・山本義徳氏監修のスポーツ栄養ブランドVALXの主力プロテイン。国内生産・WPC使用で飲みやすさと美味しさに定評あり。女性・ダイエット目的にも対応したラインナップで、幅広い層に人気が高まっている。', 'https://images.unsplash.com/photo-1571019614242-c5c5dee81f0?w=800&q=80',
  NULL, NULL, NULL,
  '¥5,490', 'https://shop.valx.jp/', NULL,
  ARRAY['山本義徳氏監修', '国内生産', 'WPC使用で飲みやすい', '女性・ダイエット向けラインも展開', '420g・1kgと試しやすいサイズ展開']::text[], '2026-06-08', '「美味しさ・飲みやすさを一番に選びたい」女性や初心者への有力候補。山本義徳氏の監修ブランドとしてトレーニーからの信頼も高い。アーモンドとうふフレーバーは特に高評価。',
  '{"brand":"VALX（バルクス）","protein_type":"whey-wpc","targets":["women","men","diet","beginner"],"serving_size":30,"protein":21.2,"calories":116,"carbs":4.1,"fat":1.7,"package_weight":1000,"price_per_kg":5490,"flavors":["チョコレート","ベリー","ヨーグルト","カフェオレ","バナナ","抹茶","アーモンドとうふ"],"pros":["「アーモンドとうふ」など個性的フレーバーが好評","低脂質（1.7g/食）で女性にも","飲みやすさ・美味しさの評価が高い","国内生産の安心感"],"cons":["1kg換算¥5,490はミドルレンジ","フレーバー数は7種類","セールは限定的"],"sources":[{"title":"VALX ホエイプロテイン WPC 公式","url":"https://shop.valx.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・価格・フレーバーを確認。"},{"title":"楽天市場 VALX公式ストア","url":"https://www.rakuten.co.jp/","sourceType":"local-media","collectedAt":"2026-06-08","note":"フレーバー・容量・価格を確認。"}],"faqs":[{"question":"VALXのアーモンドとうふフレーバーは本当においしいですか？","answer":"口コミでは「他にはない個性的な味」「プロテインらしくない飲みやすさ」と好評価が多いです。甘さは控えめで、豆乳や牛乳で割るとさらに美味しくなるという意見もあります。"},{"question":"420gサイズは何回分ですか？","answer":"1食30g使用の場合、約14食分です。まず試したい方や複数フレーバーを試したい方に向いたサイズです。"}]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'ultora-whey-diet', 'protein', NULL,
  'ULTORA（ウルトラ） ホエイダイエットプロテイン', '楽天総合1位受賞実績を持つダイエット特化型プロテイン。人工甘味料不使用（植物由来ステビア使用）でWPC+WPIのブレンド配合。1食117kcal・脂質1.5gと低カロリー設計で、日本女性の「ダイエット＋美容」ニーズに応えた商品。', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
  NULL, NULL, NULL,
  '¥4,401', 'https://ultora.co.jp/', NULL,
  ARRAY['人工甘味料不使用（ステビア使用）', 'WPC+WPIブレンド配合', '楽天総合1位受賞実績', 'ビタミン複数配合', 'ダイエット・置き換えに特化']::text[], '2026-06-08', '「人工甘味料は避けたい」「ダイエット目的だが美味しいものを飲みたい」女性へのNo.1推薦。和風フレーバーのラインナップは他社にはない強みで、続けやすさに直結する。',
  '{"brand":"ULTORA（ウルトラ）","protein_type":"whey-wpc","targets":["women","diet"],"serving_size":30,"protein":22.6,"calories":117,"carbs":3.1,"fat":1.5,"package_weight":810,"price_per_kg":5434,"flavors":["抹茶ラテ","チョコレート","クリアストロベリー","ミルクティー","ほうじ茶ラテ","フルーツオレ","ヨーグルト","ココナッツチョコレート","黒ゴマきな粉","クッキー&クリーム"],"pros":["人工甘味料不使用で安心感が高い","1食1.5gの低脂質設計","和風フレーバーが豊富（抹茶・ほうじ茶・黒ゴマきな粉）","楽天での評価が高い"],"cons":["1kg換算¥5,434はやや高め","810g・390gのみで大容量がない","ステビアの後味が苦手な方も一定いる"],"sources":[{"title":"ULTORA ホエイダイエットプロテイン 公式","url":"https://ultora.co.jp/","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・価格・フレーバー・人工甘味料不使用を確認。"},{"title":"楽天市場 ULTORAランキング実績","url":"https://www.rakuten.co.jp/","sourceType":"local-media","collectedAt":"2026-06-08","note":"楽天総合1位実績を確認。"}],"faqs":[{"question":"人工甘味料不使用とはどういう意味ですか？","answer":"アスパルテーム・スクラロース・アセスルファムKなどの合成甘味料を使用していません。ULTORAは植物由来のステビアを使用しており、天然甘味料のみで甘さを出しています。"},{"question":"ダイエット中に1日何回飲めばいいですか？","answer":"一般的には1日1〜2回（1食30gあたり22.6gのタンパク質）が目安です。食事で摂れないタンパク質を補う形で使用するのが基本で、置き換えとして使う場合は1食分として活用できます。"}]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'finelab-whey-wpi', 'protein', NULL,
  'ファイン・ラボ（Fine Lab） ホエイプロテインピュアアイソレート', 'CFM製法（冷水ろ過法）によるWPI（ホエイプロテインアイソレート）使用の高純度プロテイン。脂質0.3g・炭水化物0.1g（1食あたり）と極めて低い数値を実現。乳糖（ラクトース）も少なく、お腹が弱い方にも対応しやすい。', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
  NULL, NULL, NULL,
  '¥7,200', 'https://www.fine-lab.com/wpi-product-page', NULL,
  ARRAY['CFM製法によるWPI使用', '脂質0.3g・炭水化物0.1g/食', '乳糖（ラクトース）が少ない', '1kg・2kg・4.5kg展開', '高純度・高透明性']::text[], '2026-06-08', '「脂質・炭水化物をとにかく削りたい」コンテスト前のトレーナーやダイエット追い込み期の読者への特化選択肢。WPIとしての純度と乳糖の少なさが他社WPCとの差別化ポイント。',
  '{"brand":"ファイン・ラボ（Fine Lab）","protein_type":"whey-wpi","targets":["trainer","diet","women"],"serving_size":20,"protein":18.2,"calories":76,"carbs":0.1,"fat":0.3,"package_weight":1000,"price_per_kg":7200,"flavors":["プレーン","ミルクココア","ストロベリー","ミックスフルーツ","メロン"],"pros":["脂質・糖質を徹底的に抑えたい方の最適解","乳糖不耐症気味の方にも向きやすい","高純度WPIで筋肉へのアミノ酸供給が早い","減量期・コンテスト前の使用に最適"],"cons":["1kg換算¥7,200と価格は高め（WPIのため）","フレーバーは5種類と少なめ","タンパク質量は1食18.2gとやや少なめ（サービングサイズ20gのため）"],"sources":[{"title":"ファイン・ラボ ホエイプロテインピュアアイソレート 公式","url":"https://www.fine-lab.com/wpi-product-page","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・製法・価格を確認。"},{"title":"my-best.com WPIプロテインレビュー","url":"https://my-best.com/","sourceType":"editorial","collectedAt":"2026-06-08","note":"口コミ・評価情報を確認。"}],"faqs":[{"question":"WPCとWPIどちらを選べばいいですか？","answer":"ダイエット中・脂質・糖質を徹底的に抑えたい・乳糖が気になる方はWPI。コスパ重視・筋肉増量が目的・特に制限のない方はWPCが向いています。ファイン・ラボのWPIは脂質0.3g/食と国内WPIトップクラスの低さです。"},{"question":"乳糖不耐症でも飲めますか？","answer":"WPIは製造過程で乳糖がほぼ除去されるため、WPCより乳糖含有量が少なく、乳糖不耐症気味の方でも飲みやすい場合が多いです。ただし完全な乳糖フリーではないため、重度の乳糖不耐症の方は医師にご相談ください。"}]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();
INSERT INTO es.items (slug, content_type, region, name, description, image_url, address, area, phone, price_range, official_url, map_url, tags, last_verified_at, editor_comment, metadata) VALUES (
  'kentai-powerbody-whey', 'protein', NULL,
  'Kentai（健康体力研究所） パワーボディ 100%ホエイプロテイン', '1973年創業の老舗スポーツサプリブランド・Kentaiの大容量ホエイプロテイン。2.3kgで約¥7,400とコスパが高く、1kg換算約¥3,217は国産ブランド中最安クラス。ビタミンA・B群・C・D・E・ナイアシン等多数のビタミン・ミネラルを配合。', 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=800&q=80',
  NULL, NULL, NULL,
  '¥7,400', 'https://kentai.co.jp/product/protein/powerbody100whey.html', NULL,
  ARRAY['1973年創業の老舗ブランド', '2.3kgで¥7,400（1kg換算¥3,217）', 'ビタミン・ミネラル多数配合', '国産スポーツサプリの草分け的存在']::text[], '2026-06-08', 'コスパと継続性を重視する学生・長期トレーニーへの大容量選択肢。1kg換算¥3,217は国産ブランドで最安クラスで、ビタミン補給まで一元化できる効率性が魅力。',
  '{"brand":"Kentai（健康体力研究所）","protein_type":"whey-wpc","targets":["student","men","trainer"],"serving_size":20,"protein":14.7,"calories":79,"carbs":2.4,"fat":1.2,"package_weight":2300,"price_per_kg":3217,"flavors":["ミルクチョコ","ストロベリー","バナナラテ"],"pros":["2.3kgでの1kg換算価格は国産最安クラス","ビタミン・ミネラル豊富でサプリ要らず","老舗ブランドの信頼性","大容量で長期継続できる"],"cons":["1食14.7gとタンパク質量は少なめ","フレーバーが3種類のみ","単価は高いが容量が大きいため初期費用が多い"],"sources":[{"title":"Kentai パワーボディ 100%ホエイプロテイン 公式","url":"https://kentai.co.jp/product/protein/powerbody100whey.html","sourceType":"official","collectedAt":"2026-06-08","note":"栄養成分・価格・フレーバーを確認。"},{"title":"Amazon.co.jp Kentai パワーボディ","url":"https://www.amazon.co.jp/","sourceType":"local-media","collectedAt":"2026-06-08","note":"価格・口コミを確認。"}],"faqs":[{"question":"2.3kgは使い切れますか？","answer":"1日1食（20g）使用で約115食分です。毎日使用すると約3.8ヶ月分。週3〜5回のトレーニングに合わせて飲む場合は半年以上もちます。大容量ですが密閉保存すれば問題なく使い切れます。"},{"question":"タンパク質量が14.7gと他製品より少なめですが大丈夫ですか？","answer":"1食20gに対して14.7gのタンパク質は含有率73%で、WPCとして一般的な水準です。より多くのタンパク質が必要な場合は1.5スクープ（30g）で使用することも可能です。"}]}'::jsonb
) ON CONFLICT (content_type, slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, metadata=EXCLUDED.metadata, updated_at=NOW();

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
