import { randomUUID } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  ES_MYSTERY_SOLVES_CACHE_TAG,
  type MysteryAnswerConfig,
  type MysteryAnswerMethod,
  type MysteryAnswerPolicy,
  type MysteryContentModel,
} from "@/lib/mystery";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_ATTEMPTS_PER_HOUR = 20;
const FILE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
  "text/plain": "txt",
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
};

type PuzzleSubmissionTarget = {
  id: string;
  content_model: MysteryContentModel;
  answer_method: MysteryAnswerMethod;
  answer_policy: MysteryAnswerPolicy;
  answer_config: MysteryAnswerConfig | null;
  status: "published" | "closed";
  closes_at: string | null;
};

function field(formData: FormData, key: string, maxLength: number) {
  return String(formData.get(key) ?? "").trim().slice(0, maxLength);
}

function isOpen(puzzle: PuzzleSubmissionTarget) {
  return puzzle.status === "published" && (!puzzle.closes_at || new Date(puzzle.closes_at).getTime() > Date.now());
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, code: "AUTH_REQUIRED", message: "回答の送信にはログインが必要です。" }, { status: 401 });
  }

  const formData = await request.formData();
  const slug = field(formData, "slug", 120);
  const displayName = field(formData, "displayName", 24);
  const answer = field(formData, "answer", 500);
  const file = formData.get("file");
  const hintCount = Math.max(0, Math.min(20, Number.parseInt(field(formData, "hintCount", 2) || "0", 10) || 0));

  if (displayName.length < 2) {
    return NextResponse.json({ ok: false, message: "表示名は2〜24文字で入力してください。" }, { status: 400 });
  }

  const db = supabase.schema("es");
  const { data: puzzleData, error: puzzleError } = await db
    .from("mystery_puzzles")
    .select("id,content_model,answer_method,answer_policy,answer_config,status,closes_at")
    .eq("slug", slug)
    .maybeSingle();

  const puzzle = puzzleData as PuzzleSubmissionTarget | null;
  if (puzzleError || !puzzle || !isOpen(puzzle)) {
    return NextResponse.json({ ok: false, message: "この問題は現在回答を受け付けていません。" }, { status: 404 });
  }
  if (puzzle.answer_policy !== "official" || puzzle.content_model === "staged") {
    return NextResponse.json({ ok: false, message: "この問題は記録付き回答を受け付けていません。" }, { status: 400 });
  }

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await db
    .from("mystery_submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", oneHourAgo);

  if ((count ?? 0) >= MAX_ATTEMPTS_PER_HOUR) {
    return NextResponse.json({ ok: false, message: "短時間の送信回数が上限に達しました。時間をおいて再度お試しください。" }, { status: 429 });
  }

  if (puzzle.answer_method === "form" && !answer) {
    return NextResponse.json({ ok: false, message: "回答を入力してください。" }, { status: 400 });
  }
  if (puzzle.answer_method === "file" && !(file instanceof File && file.size > 0)) {
    return NextResponse.json({ ok: false, message: "提出ファイルを選択してください。" }, { status: 400 });
  }
  if (puzzle.answer_method === "flexible") {
    return NextResponse.json({ ok: false, message: "この問題は問題文で指定された方法から回答してください。" }, { status: 400 });
  }

  if (puzzle.answer_method === "form") {
    const { data, error } = await db.rpc("submit_mystery_text_answer", {
      p_puzzle_slug: slug,
      p_answer: answer.slice(0, 200),
      p_display_name: displayName,
      p_hint_count: hintCount,
    });

    if (error) {
      return NextResponse.json({ ok: false, message: "回答を判定できませんでした。時間をおいて再度お試しください。" }, { status: 400 });
    }
    if (data && typeof data === "object" && "status" in data && data.status === "correct") {
      revalidateTag(ES_MYSTERY_SOLVES_CACHE_TAG);
    }
    return NextResponse.json({ ok: true, ...data });
  }

  let filePath: string | null = null;
  if (file instanceof File && file.size > 0) {
    const extension = FILE_EXTENSIONS[file.type];
    const configuredTypes = puzzle.answer_config?.allowedTypes;
    if (!extension || (configuredTypes?.length && !configuredTypes.includes(file.type))) {
      return NextResponse.json({ ok: false, message: "対応形式は画像、PDF、テキスト、ZIPです。" }, { status: 400 });
    }
    const configuredMax = Math.min(Math.max(puzzle.answer_config?.maxSizeMb ?? 10, 1), 10) * 1024 * 1024;
    if (file.size > Math.min(configuredMax, MAX_FILE_BYTES)) {
      return NextResponse.json({ ok: false, message: `ファイルサイズは${Math.min(puzzle.answer_config?.maxSizeMb ?? 10, 10)}MB以下にしてください。` }, { status: 400 });
    }

    filePath = `${user.id}/${puzzle.id}/${randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("mystery-submissions")
      .upload(filePath, await file.arrayBuffer(), { contentType: file.type, upsert: false });

    if (uploadError) {
      return NextResponse.json({ ok: false, message: "ファイルをアップロードできませんでした。" }, { status: 400 });
    }
  }

  const { error: insertError } = await db.from("mystery_submissions").insert({
    puzzle_id: puzzle.id,
    user_id: user.id,
    display_name: displayName,
    answer_text: answer || null,
    file_path: filePath,
  });

  if (insertError) {
    if (filePath) await supabase.storage.from("mystery-submissions").remove([filePath]);
    return NextResponse.json({ ok: false, message: "回答を保存できませんでした。" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    status: "pending",
    message: "提出を受け付けました。判定後、記録に反映します。",
  }, { status: 202 });
}
