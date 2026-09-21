import { NextRequest, NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const password = formData.get("password");

  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.redirect(
      new URL("/invite?error=invalid_password", request.url)
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const normalizedEmail = user.email?.trim().toLowerCase();

  if (!normalizedEmail) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: invitation, error: invitationLookupError } = await supabase
    .from("invitations")
    .select("id, role, expires_at")
    .eq("email", normalizedEmail)
    .is("accepted_at", null)
    .is("revoked_at", null)
    .maybeSingle();

  if (invitationLookupError || !invitation) {
    return NextResponse.redirect(
      new URL("/login?error=invitation_not_found", request.url)
    );
  }

  if (new Date(invitation.expires_at) <= new Date()) {
    return NextResponse.redirect(
      new URL("/login?error=invitation_expired", request.url)
    );
  }

  const { error: passwordError } = await supabase.auth.updateUser({
    password,
  });

  if (passwordError) {
    return NextResponse.redirect(
      new URL("/invite?error=password_update_failed", request.url)
    );
  }

  const admin = createAdminClient();

  const { error: profileError } = await admin
    .from("profiles")
    .update({
      role: invitation.role,
    })
    .eq("id", user.id);

  if (profileError) {
    return NextResponse.redirect(
      new URL("/invite?error=profile_update_failed", request.url)
    );
  }

  const { error: invitationError } = await admin
    .from("invitations")
    .update({
      accepted_at: new Date().toISOString(),
    })
    .eq("id", invitation.id);

  if (invitationError) {
    return NextResponse.redirect(
      new URL("/invite?error=invitation_update_failed", request.url)
    );
  }

  return NextResponse.redirect(new URL("/", request.url));
}
