insert into es.affiliate_platforms (
  provider,
  label,
  platform_type,
  description,
  search_url_template,
  default_cta_label,
  default_rel,
  tracking_config,
  disclosure_required,
  enabled,
  sort_order,
  metadata
)
values (
  'amazon',
  'Amazon',
  'shopping',
  'Amazon.co.jp の商品検索結果へ送客するアフィリエイト導線。associate tag はサーバー環境変数 AMAZON_ASSOCIATE_TAG で管理する。',
  'https://www.amazon.co.jp/s?k={{query}}&tag={{associate_tag}}',
  'Amazonで探す',
  'sponsored nofollow noopener noreferrer',
  jsonb_build_object('associate_tag', 'eachspirit202-22'),
  true,
  true,
  30,
  jsonb_build_object(
    'uses_server_env', true,
    'env_keys', jsonb_build_array('AMAZON_ASSOCIATE_TAG'),
    'note', 'tracking_config.associate_tag は初期値。実行時は AMAZON_ASSOCIATE_TAG 環境変数を優先する。'
  )
)
on conflict (provider) do update
set
  label = excluded.label,
  platform_type = excluded.platform_type,
  description = excluded.description,
  search_url_template = excluded.search_url_template,
  default_cta_label = excluded.default_cta_label,
  default_rel = excluded.default_rel,
  tracking_config = excluded.tracking_config,
  disclosure_required = excluded.disclosure_required,
  enabled = excluded.enabled,
  sort_order = excluded.sort_order,
  metadata = excluded.metadata,
  updated_at = now();
