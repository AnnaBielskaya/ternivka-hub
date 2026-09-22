"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { UserRole } from "../types";

export async function inviteUser(email: string, role: UserRole) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error" as const,
      message: "Необхідно авторизуватися",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    (profile.role !== "admin" && profile.role !== "super_admin")
  ) {
    return {
      status: "error" as const,
      message: "Недостатньо прав для запрошення користувачів",
    };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const { data: existingInvitation } = await supabase
    .from("invitations")
    .select("id")
    .eq("email", normalizedEmail)
    .is("accepted_at", null)
    .is("revoked_at", null)
    .maybeSingle();

  if (existingInvitation) {
    return {
      status: "error" as const,
      message: "Для цього email вже є активне запрошення",
    };
  }

  const admin = createAdminClient();

  const { data, error } = await admin.auth.admin.inviteUserByEmail(
    normalizedEmail,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    }
  );

  if (error) {
    return {
      status: "error" as const,
      message: error.message,
    };
  }

  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  const { error: invitationError } = await supabase.from("invitations").insert({
    email: normalizedEmail,
    role,
    invited_by: user.id,
    expires_at: expiresAt,
  });

  if (invitationError) {
    return {
      status: "error" as const,
      message: "Запрошення було створено, але не вдалося зберегти його в базі",
    };
  }

  return {
    status: "success" as const,
    userId: data.user?.id ?? null,
  };
}
