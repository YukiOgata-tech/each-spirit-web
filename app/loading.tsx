// ルート Suspense フォールバック。ブランド Lottie は GlobalRouteLoader（常時ウォームの単一オーバーレイ）が担当するため、
// ここでは二重表示を避けて軽量な CSS スピナーのみ。each-spirit-loader クラスは GlobalRouteLoader の検出マーカー。
export default function Loading() {
  return (
    <div
      className="each-spirit-loader flex min-h-[52vh] items-center justify-center px-4 py-16"
      role="status"
      aria-label="読み込み中"
    >
      <span
        className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800"
        aria-hidden="true"
      />
    </div>
  );
}
