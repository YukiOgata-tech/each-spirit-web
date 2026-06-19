import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { requireAdminUser } from "@/lib/admin";

const bucket = "article-assets";
const maxBytes = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extensionFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/gif") return "gif";
  if (type === "image/webp") return "webp";
  return "jpg";
}

function cleanSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(request: NextRequest) {
  try {
    await requireAdminUser();

    const formData = await request.formData();
    const file = formData.get("file");
    const articleSlug = cleanSlug(String(formData.get("slug") ?? "draft")) || "draft";

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, message: "file is required" }, { status: 400 });
    }
    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ ok: false, message: "unsupported image type" }, { status: 400 });
    }
    if (file.size > maxBytes) {
      return NextResponse.json({ ok: false, message: "file is too large" }, { status: 400 });
    }

    const service = createServerClient();
    const ext = extensionFor(file.type);
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const path = `${yyyy}/${mm}/${articleSlug}/${crypto.randomUUID()}.${ext}`;
    const bytes = await file.arrayBuffer();

    const { error } = await service.storage.from(bucket).upload(path, bytes, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) {
      return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
    }

    const { data } = service.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({ ok: true, path, publicUrl: data.publicUrl });
  } catch {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
}
