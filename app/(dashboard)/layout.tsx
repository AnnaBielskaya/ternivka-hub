import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
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

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Header name={profile.name} role={profile.role} />

      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-6 py-3">
        {children}
      </main>
    </div>
  );
}
