import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import Header from "@/components/layout/Header";
import CategoryTabs from "@/components/layout/CategoryTabs";

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
    <div className="flex h-svh flex-col overflow-hidden">
      <Header userId={userId} name={profile.name} role={profile.role} />

      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden px-4 py-4 sm:px-6 sm:py-3">
        {children}
      </main>

      <footer className="shrink-0 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="w-full p-2">
          <CategoryTabs variant="bottom" />
        </div>
      </footer>
    </div>
  );
}
