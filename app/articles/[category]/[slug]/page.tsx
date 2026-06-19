import { permanentRedirect } from "next/navigation";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ category: string; slug: string }> };

export default async function LegacyArticlesGenericArticlePage({ params }: PageProps) {
  const { category, slug } = await params;
  permanentRedirect(routes.genericArticle(category, slug));
}
