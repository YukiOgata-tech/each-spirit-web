"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, House } from "lucide-react";

/**
 * サイト全体で共通のパンくず。ヘッダー直下に常時表示し、URL（pathname）から自動生成する。
 * ラベルは既知セグメントをマップで、未知（作品/店舗の slug 等）は humanize して表示。
 * 個別ページごとに <Breadcrumbs> を置く方式は廃止し、これに一本化。
 */
const LABEL_MAP: Record<string, string> = {
  // 大カテゴリ
  food: "グルメ", health: "健康", beauty: "美容", travel: "旅行", entertainment: "エンターテインメント", leisure: "レジャー",
  // セクション
  ramen: "ラーメン", cafe: "カフェ", teishoku: "定食", protein: "プロテイン", "hair-salon": "美容室",
  stays: "宿・温泉", services: "旅行サービス", spots: "スポット", anime: "アニメ", drama: "ドラマ",
  apps: "アプリ", "game-apps": "ゲームアプリ", events: "イベント",
  // 構造セグメント
  rankings: "ランキング", articles: "記事", shops: "店舗", products: "商品", salons: "サロン",
  hotels: "宿", agencies: "旅行会社", items: "店舗・商品",
  // ユーティリティ / アカウント
  account: "マイページ", search: "検索", about: "運営情報", contact: "お問い合わせ",
  privacy: "プライバシーポリシー", disclaimer: "免責事項", fortune: "占い",
  login: "ログイン", signup: "新規登録", storage: "画像アップロード", manage: "コンテンツ管理",
  likes: "保存した項目", new: "新規作成", edit: "編集",
};

// パンくずを出さないパス（認証フローなど）
const HIDDEN_PREFIXES = ["/auth"];

function humanize(seg: string) {
  let s = seg;
  try { s = decodeURIComponent(seg); } catch { /* keep raw */ }
  return s.replace(/[-_]/g, " ");
}

export function SiteBreadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;
  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return null;

  const crumbs = segments.map((seg, i) => ({
    label: LABEL_MAP[seg] ?? humanize(seg),
    href: "/" + segments.slice(0, i + 1).join("/"),
    last: i === segments.length - 1,
  }));

  return (
    <nav aria-label="パンくずリスト" className="border-t border-slate-200/70 bg-slate-50/72">
      <div className="mx-auto flex h-9 w-[min(1360px,calc(100%-40px))] items-center gap-1 overflow-x-auto text-[11px] text-slate-500 max-sm:w-[min(1360px,calc(100%-24px))] sm:h-10 sm:text-xs [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Link href="/" className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-semibold transition-colors hover:text-slate-950">
          <House className="h-3.5 w-3.5" />
          <span>ホーム</span>
        </Link>
        {crumbs.map((c) => (
          <span key={c.href} className="flex shrink-0 items-center gap-1 whitespace-nowrap">
            <ChevronRight className="h-3 w-3 shrink-0 text-slate-300" />
            {c.last
              ? <span className="max-w-64 truncate font-bold text-slate-800 max-sm:max-w-48">{c.label}</span>
              : <Link href={c.href} className="transition-colors hover:text-slate-950">{c.label}</Link>}
          </span>
        ))}
      </div>
    </nav>
  );
}
