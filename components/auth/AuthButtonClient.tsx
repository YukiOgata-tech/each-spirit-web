"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { LogIn, LogOut, UserCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { routes } from "@/lib/routes";

/**
 * ヘッダーの認証ボタン。
 *
 * ユーザー判定はクライアント側で行う（`cookies()` を使うサーバーコンポーネントを
 * root layout に置くと全ページが動的レンダリングになり ISR が効かなくなるため）。
 * 初期表示は未ログイン状態 → マウント後に getUser で更新、onAuthStateChange で追従。
 */
export function AuthButtonClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

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
