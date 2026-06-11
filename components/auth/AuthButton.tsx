import { createClient } from "@/lib/supabase/server";
import { AuthButtonClient } from "@/components/auth/AuthButtonClient";

export async function AuthButton() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <AuthButtonClient user={user} />;
}
