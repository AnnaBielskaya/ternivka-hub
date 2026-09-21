import type { EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const redirectTo = request.nextUrl.clone();

  redirectTo.pathname = "/invite";
  redirectTo.search = "";

  if (!tokenHash || !type) {
    redirectTo.pathname = "/login";
    return NextResponse.redirect(redirectTo);
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    redirectTo.pathname = "/login";
    redirectTo.searchParams.set(
      "error",
      "Запрошення недійсне або вже прострочене"
    );

    return NextResponse.redirect(redirectTo);
  }

  return NextResponse.redirect(redirectTo);
}
