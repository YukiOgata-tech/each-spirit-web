import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import type { Article } from "@/lib/types";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ArticleCard({ article, href }: { article: Article; href?: string }) {
  return (
    <Link
      href={href ?? routes.articleByCategory(article.category || "general", article.slug)}
      className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 rounded-[var(--radius)]"
    >
      <Card className="h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 3).map((tag) => <Badge key={tag}>{tag}</Badge>)}
          </div>
          <CardTitle className="transition-colors duration-200 group-hover:text-[var(--primary)]">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-4">
          <p className="text-sm leading-5 sm:leading-7 text-slate-600">{article.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <CalendarDays className="h-4 w-4" />
              更新日 {article.updatedAt}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--primary)]">
              読む
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
