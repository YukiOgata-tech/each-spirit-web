"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { LogIn, LogOut, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export function AuthButtonClient({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link href={routes.authLogin}>
          <LogIn className="h-4 w-4" />
          <span className="hidden sm:inline">ログイン</span>
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
        <Link href={routes.account}>
          <UserCircle className="h-4 w-4" />
          マイページ
        </Link>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">ログアウト</span>
      </Button>
    </div>
  );
}
