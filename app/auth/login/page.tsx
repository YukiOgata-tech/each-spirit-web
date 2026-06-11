import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ログイン | Each Spirit",
  robots: { index: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 sm:py-14">
      <LoginForm searchParams={searchParams} />
    </main>
  );
}
