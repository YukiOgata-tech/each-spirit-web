import { SignupForm } from "@/components/auth/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "アカウント登録 | Each Spirit",
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 sm:py-14">
      <SignupForm />
    </main>
  );
}
