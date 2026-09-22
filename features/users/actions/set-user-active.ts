"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_ROLES = ["admin", "super_admin"] as const;

export type SetUserActiveResult = {
  status: "success" | "error";
  message: string;
};

export async function setUserActive(
  userId: string,
  isActive: boolean
): Promise<SetUserActiveResult> {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Необхідно авторизуватися.",
    };
  }

  if (userId === user.id) {
    return {
      status: "error",
      message: "Не можна деактивувати власний акаунт.",
    };
  }

  const { data: currentProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    !currentProfile ||
    !ALLOWED_ROLES.includes(
      currentProfile.role as (typeof ALLOWED_ROLES)[number]
    )
  ) {
    return {
      status: "error",
      message: "У вас немає прав для керування користувачами.",
    };
  }

  const { data: targetProfile } = await supabaseAdmin
    .from("profiles")
    .select("id, role")
    .eq("id", userId)
    .maybeSingle();

  if (!targetProfile) {
    return {
      status: "error",
      message: "Користувача не знайдено.",
    };
  }

  if (targetProfile.role === "super_admin") {
    return {
      status: "error",
      message: "Не можна змінювати статус супер-адміністратора.",
    };
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    ban_duration: isActive ? "none" : "876000h",
  });

  if (error) {
    console.error("Failed to change user status:", error);

    return {
      status: "error",
      message: "Не вдалося змінити статус користувача.",
    };
  }

  revalidatePath("/admin/users");

  return {
    status: "success",
    message: isActive ? "Користувача активовано." : "Користувача деактивовано.",
  };
}
