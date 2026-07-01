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
  'rakuten',
  '楽天市場',
  'shopping',
  '楽天市場の商品検索結果へ送客するアフィリエイト導線。サーバー側では楽天市場商品検索APIの affiliateUrl を優先して利用する。',
  'https://search.rakuten.co.jp/search/mall/{{query}}/',
  '楽天で探す',
  'sponsored nofollow noopener noreferrer',
  '{}'::jsonb,
  true,
  true,
  20,
  jsonb_build_object(
    'api_provider', 'rakuten_web_service',
    'uses_server_env', true,
    'env_keys', jsonb_build_array(
      'RAKUTEN_APPLICATION_ID',
      'RAKUTEN_ACCESS_KEY',
      'RAKUTEN_AFFILIATE_ID'
    )
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
