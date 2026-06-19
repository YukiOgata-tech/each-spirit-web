import { permanentRedirect } from "next/navigation";
import { routes } from "@/lib/routes";

type PageProps = { params: Promise<{ category: string }> };

export default async function LegacyArticlesCategoryPage({ params }: PageProps) {
  const { category } = await params;
  permanentRedirect(routes.genericCategory(category));
}
