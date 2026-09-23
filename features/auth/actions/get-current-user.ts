import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims) {
    redirect("/login");
  }

  const userId = claimsData.claims.sub;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    redirect("/login");
  }

  return {
    id: userId,
    name: profile.name,
    role: profile.role,
  };
}
