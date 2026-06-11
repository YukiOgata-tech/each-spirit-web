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
