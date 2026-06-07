import Link from "next/link";
import { CalendarDays } from "lucide-react";
import type { Article } from "@/lib/types";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          {article.tags.slice(0, 3).map((tag) => <Badge key={tag}>{tag}</Badge>)}
        </div>
        <CardTitle>
          <Link href={routes.ramenArticle(article.slug)} className="hover:text-[var(--primary)]">{article.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-7 text-slate-600">{article.description}</p>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <CalendarDays className="h-4 w-4" />
          更新日 {article.updatedAt}
        </div>
      </CardContent>
    </Card>
  );
}
