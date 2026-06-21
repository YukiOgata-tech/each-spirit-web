// クライアント専用の画像最適化ヘルパー（canvas を使うため、必ず "use client" の中から呼ぶこと）。
// 指定した拡張子(=MIME)に合わせて再エンコードし、最大幅でリサイズしてストレージ容量を抑える。
// MD に先に書かれたパスと食い違わないよう、出力の拡張子は呼び出し側が決めた MIME に従う。

const MAX_WIDTH = 1600;

/** path/ファイル名の拡張子から配信時の MIME を判定 */
export function mimeForPath(path: string): string {
  const ext = path.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1];
  if (ext === "png") return "image/png";
  if (ext === "gif") return "image/gif";
  if (ext === "webp") return "image/webp";
  return "image/jpeg"; // jpg / jpeg / 不明
}

/**
 * targetMime に合わせて画像を再エンコード＆リサイズ。
 * - gif（アニメーション保持のため）や、元/先が gif の場合は変換せずそのまま返す。
 * - png は可逆なので品質指定なし、それ以外は品質0.82。
 */
export async function optimizeImage(file: File, targetMime: string): Promise<File> {
  if (file.type === "image/gif" || targetMime === "image/gif") return file;
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, width, height);

  const quality = targetMime === "image/png" ? undefined : 0.82;
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, targetMime, quality));
  if (!blob) return file;

  const ext = targetMime === "image/webp" ? "webp" : targetMime === "image/png" ? "png" : "jpg";
  return new File([blob], file.name.replace(/\.[^.]+$/, "." + ext), { type: targetMime });
}
