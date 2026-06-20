"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Bookmark } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type LikeType = "like" | "bookmark";

/**
 * コンテンツ詳細ページ用のいいね / 保存ボタン。
 *
 * - 未ログイン: クリックでログインページへ（戻り先付き）。いいね数は閲覧可能。
 * - ログイン済み: es.content_likes に insert/delete（楽観更新・失敗時ロールバック）。
 *
 * 識別キーは content_kind('item'|'article'|'ranking') + targetId(es の行 uuid)。
 */
export function LikeButton({
  contentKind,
  targetId,
  regionSlug = null,
  className,
}: {
  contentKind: "item" | "article" | "ranking";
  targetId: string | undefined;
  regionSlug?: string | null;
  className?: string;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [pending, setPending] = useState<LikeType | null>(null);

  useEffect(() => {
    if (!targetId) {
      setReady(true);
      return;
    }
    const supabase = createClient();
    let active = true;

    (async () => {
      const [{ data: auth }, { data: countRow }] = await Promise.all([
        supabase.auth.getUser(),
        supabase
          .schema("es")
          .from("content_like_counts")
          .select("count")
          .eq("content_kind", contentKind)
          .eq("target_id", targetId)
          .eq("like_type", "like")
          .maybeSingle(),
      ]);
      if (!active) return;

      setLikeCount(countRow?.count ?? 0);

      const user = auth.user;
      if (user) {
        setUserId(user.id);
        const { data: mine } = await supabase
          .schema("es")
          .from("content_likes")
          .select("like_type")
          .eq("user_id", user.id)
          .eq("content_kind", contentKind)
          .eq("target_id", targetId);
        if (!active) return;
        const types = new Set((mine ?? []).map((r) => r.like_type));
        setLiked(types.has("like"));
        setBookmarked(types.has("bookmark"));
      }
      setReady(true);
    })();

    return () => {
      active = false;
    };
  }, [contentKind, targetId]);

  async function toggle(type: LikeType) {
    if (!userId) {
      const next = encodeURIComponent(window.location.pathname);
      router.push(`${routes.authLogin}?next=${next}`);
      return;
    }
    if (pending || !targetId) return;

    const isOn = type === "like" ? liked : bookmarked;
    setPending(type);

    // 楽観更新
    if (type === "like") {
      setLiked(!isOn);
      setLikeCount((c) => Math.max(0, c + (isOn ? -1 : 1)));
    } else {
      setBookmarked(!isOn);
    }

    const supabase = createClient();
    const { error } = isOn
      ? await supabase
          .schema("es")
          .from("content_likes")
          .delete()
          .eq("user_id", userId)
          .eq("content_kind", contentKind)
          .eq("target_id", targetId)
          .eq("like_type", type)
      : await supabase
          .schema("es")
          .from("content_likes")
          .insert({
            user_id: userId,
            content_kind: contentKind,
            target_id: targetId,
            region_slug: regionSlug,
            like_type: type,
          });

    // 重複 insert(23505) は「既にオン」とみなして成功扱い
    if (error && error.code !== "23505") {
      // ロールバック
      if (type === "like") {
        setLiked(isOn);
        setLikeCount((c) => Math.max(0, c + (isOn ? 1 : -1)));
      } else {
        setBookmarked(isOn);
      }
    }
    setPending(null);
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => toggle("like")}
        disabled={!ready || pending === "like"}
        aria-pressed={liked}
        aria-label={liked ? "いいねを取り消す" : "いいね"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition disabled:opacity-60",
          liked
            ? "border-rose-200 bg-rose-50 text-rose-600"
            : "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:text-rose-500",
        )}
      >
        <Heart className={cn("h-4 w-4", liked && "fill-current")} />
        <span className="tabular-nums">{likeCount}</span>
      </button>

      <button
        type="button"
        onClick={() => toggle("bookmark")}
        disabled={!ready || pending === "bookmark"}
        aria-pressed={bookmarked}
        aria-label={bookmarked ? "保存を取り消す" : "保存"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition disabled:opacity-60",
          bookmarked
            ? "border-blue-200 bg-blue-50 text-blue-600"
            : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-500",
        )}
      >
        <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
        <span>保存</span>
      </button>
    </div>
  );
}
