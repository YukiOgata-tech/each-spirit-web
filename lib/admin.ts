import "server-only";

import { createClient as createAuthClient } from "@/lib/supabase/server";
import { createServerClient as createServiceClient } from "@/lib/supabase-server";

export type AdminUser = {
  id: string;
  email: string;
};

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email?.toLowerCase();
  if (!user || !email) return null;

  const service = createServiceClient();
  const { data, error } = await service
    .from("admin_users")
    .select("email")
    .eq("email", email)
    .eq("enabled", true)
    .maybeSingle();

  if (error || !data) return null;
  return { id: user.id, email };
}

export async function requireAdminUser(): Promise<AdminUser> {
  const admin = await getCurrentAdminUser();
  if (!admin) {
    throw new Error("Unauthorized");
  }
  return admin;
}
