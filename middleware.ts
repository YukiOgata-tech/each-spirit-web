import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const articleTagPrefix = "/articles/tags/";

function decodeRepeatedly(value: string) {
  let current = value;
  for (let i = 0; i < 5; i += 1) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) break;
      current = decoded;
    } catch {
      return null;
    }
  }
  return current;
}

function normalizeArticleTagPath(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith(articleTagPrefix)) return null;

  const rawTag = pathname.slice(articleTagPrefix.length);
  const decodedTag = decodeRepeatedly(rawTag);
  if (!decodedTag || decodedTag.includes("/") || decodedTag.length > 80) {
    return new NextResponse(null, { status: 404 });
  }

  const canonicalPath = articleTagPrefix + encodeURIComponent(decodedTag);
  if (canonicalPath === pathname) return null;

  const url = request.nextUrl.clone();
  url.pathname = canonicalPath;
  return NextResponse.redirect(url, 308);
}

export async function middleware(request: NextRequest) {
  const articleTagResponse = normalizeArticleTagPath(request);
  if (articleTagResponse) return articleTagResponse;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session so it doesn't expire mid-visit
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/account/:path*",
    "/auth/:path*",
    "/articles/tags/:path*",
  ],
};
