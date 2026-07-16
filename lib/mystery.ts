import "server-only";

import { createClient } from "@supabase/supabase-js";

export const ES_MYSTERY_CACHE_TAG = "es-mystery";
export const ES_MYSTERY_SOLVES_CACHE_TAG = "es-mystery-solves";
export const MYSTERY_OG_IMAGE = {
  path: "/mystery/mystery-og.webp",
  width: 1200,
  height: 630,
} as const;

export type MysteryContentModel = "custom" | "markdown" | "staged";
export type MysteryAnswerMethod = "form" | "file" | "flexible";
export type MysteryAnswerPolicy = "official" | "check_only";

export type MysteryAnswerConfig = {
  placeholder?: string;
  maxLength?: number;
  allowedTypes?: string[];
  maxFiles?: number;
  maxSizeMb?: number;
  commentEnabled?: boolean;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionUrl?: string;
};

export type MysteryPuzzleSummary = {
  id: string;
  slug: string;
  caseNumber: number;
  title: string;
  excerpt: string;
  heroImageUrl: string | null;
  difficulty: number;
  estimatedMinutes: number | null;
  contentModel: MysteryContentModel;
  customRendererKey: string | null;
  answerMethod: MysteryAnswerMethod;
  answerPolicy: MysteryAnswerPolicy;
  answerConfig: MysteryAnswerConfig;
  status: "published" | "closed";
  publishedAt: string | null;
  closesAt: string | null;
  solveCount: number;
};

export type MysteryAttachment = {
  id: string;
  label: string;
  description: string | null;
  fileUrl: string;
  fileType: "image" | "pdf" | "audio" | "archive" | "text" | "other";
};

export type MysteryHint = {
  id: string;
  level: number;
  title: string;
  bodyMd: string;
  penaltyLabel: string | null;
};

export type MysterySolve = {
  id: string;
  displayName: string;
  hintCountUsed: number;
  solvedAt: string;
};

export type MysteryPuzzle = MysteryPuzzleSummary & {
  bodyMd: string;
  attachments: MysteryAttachment[];
  hints: MysteryHint[];
  recentSolves: MysterySolve[];
};

type PuzzleRow = {
  id: string;
  slug: string;
  case_number: number;
  title: string;
  excerpt: string;
  body_md?: string;
  hero_image_url: string | null;
  difficulty: number;
  estimated_minutes: number | null;
  content_model: MysteryContentModel;
  custom_renderer_key: string | null;
  answer_method: MysteryAnswerMethod;
  answer_policy: MysteryAnswerPolicy;
  answer_config: MysteryAnswerConfig | null;
  status: "published" | "closed";
  published_at: string | null;
  closes_at: string | null;
};

const mysteryFetch: typeof fetch = (input, init) => fetch(input, {
  ...init,
  next: {
    ...(init as (RequestInit & { next?: { revalidate?: number; tags?: string[] } }) | undefined)?.next,
    revalidate: 2592000,
    tags: [ES_MYSTERY_CACHE_TAG],
  },
} as RequestInit & { next: { revalidate: number; tags: string[] } });

const mysterySolvesFetch: typeof fetch = (input, init) => fetch(input, {
  ...init,
  next: {
    ...(init as (RequestInit & { next?: { revalidate?: number; tags?: string[] } }) | undefined)?.next,
    revalidate: 300,
    tags: [ES_MYSTERY_SOLVES_CACHE_TAG],
  },
} as RequestInit & { next: { revalidate: number; tags: string[] } });

function getPublicMysteryClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "es" },
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: mysteryFetch },
    },
  );
}

function getMysterySolvesClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      db: { schema: "es" },
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: mysterySolvesFetch },
    },
  );
}

function mapSummary(row: PuzzleRow, solveCount = 0): MysteryPuzzleSummary {
  return {
    id: row.id,
    slug: row.slug,
    caseNumber: row.case_number,
    title: row.title,
    excerpt: row.excerpt,
    heroImageUrl: row.hero_image_url,
    difficulty: row.difficulty,
    estimatedMinutes: row.estimated_minutes,
    contentModel: row.content_model,
    customRendererKey: row.custom_renderer_key,
    answerMethod: row.answer_method,
    answerPolicy: row.answer_policy,
    answerConfig: row.answer_config ?? {},
    status: row.status,
    publishedAt: row.published_at,
    closesAt: row.closes_at,
    solveCount,
  };
}

export async function getMysteryPuzzles(): Promise<MysteryPuzzleSummary[]> {
  const supabase = getPublicMysteryClient();
  const solvesClient = getMysterySolvesClient();
  const [{ data: rows, error }, { data: solves }] = await Promise.all([
    supabase
      .from("mystery_puzzles")
      .select("id,slug,case_number,title,excerpt,hero_image_url,difficulty,estimated_minutes,content_model,custom_renderer_key,answer_method,answer_policy,answer_config,status,published_at,closes_at")
      .in("status", ["published", "closed"])
      .order("case_number", { ascending: false }),
    solvesClient.from("mystery_solves").select("puzzle_id"),
  ]);

  if (error || !rows) return [];

  const counts = new Map<string, number>();
  for (const solve of solves ?? []) {
    counts.set(solve.puzzle_id, (counts.get(solve.puzzle_id) ?? 0) + 1);
  }

  return (rows as PuzzleRow[]).map((row) => mapSummary(row, counts.get(row.id) ?? 0));
}

export async function getMysteryPuzzle(slug: string): Promise<MysteryPuzzle | null> {
  const supabase = getPublicMysteryClient();
  const solvesClient = getMysterySolvesClient();
  const { data: row, error } = await supabase
    .from("mystery_puzzles")
    .select("id,slug,case_number,title,excerpt,body_md,hero_image_url,difficulty,estimated_minutes,content_model,custom_renderer_key,answer_method,answer_policy,answer_config,status,published_at,closes_at")
    .eq("slug", slug)
    .in("status", ["published", "closed"])
    .maybeSingle();

  if (error || !row) return null;

  const [attachmentsResult, hintsResult, solvesResult] = await Promise.all([
    solvesClient
      .from("mystery_attachments")
      .select("id,label,description,file_url,file_type")
      .eq("puzzle_id", row.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("mystery_hints")
      .select("id,level,title,body_md,penalty_label")
      .eq("puzzle_id", row.id)
      .order("level", { ascending: true }),
    supabase
      .from("mystery_solves")
      .select("id,display_name,hint_count_used,solved_at")
      .eq("puzzle_id", row.id)
      .order("solved_at", { ascending: false })
      .limit(12),
  ]);

  const solveCountResult = await solvesClient
    .from("mystery_solves")
    .select("id", { count: "exact", head: true })
    .eq("puzzle_id", row.id);

  return {
    ...mapSummary(row as PuzzleRow, solveCountResult.count ?? 0),
    bodyMd: row.body_md,
    attachments: (attachmentsResult.data ?? []).map((item) => ({
      id: item.id,
      label: item.label,
      description: item.description,
      fileUrl: item.file_url,
      fileType: item.file_type as MysteryAttachment["fileType"],
    })),
    hints: (hintsResult.data ?? []).map((hint) => ({
      id: hint.id,
      level: hint.level,
      title: hint.title,
      bodyMd: hint.body_md,
      penaltyLabel: hint.penalty_label,
    })),
    recentSolves: (solvesResult.data ?? []).map((solve) => ({
      id: solve.id,
      displayName: solve.display_name,
      hintCountUsed: solve.hint_count_used,
      solvedAt: solve.solved_at,
    })),
  };
}

export const mysteryAnswerMethodLabel: Record<MysteryAnswerMethod, string> = {
  form: "フォーム回答",
  file: "ファイル提出",
  flexible: "指定方式",
};
