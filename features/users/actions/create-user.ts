"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import { UserRole } from "../types";

const ALLOWED_ROLES = ["admin", "super_admin"] as const;
const CREATED_ROLES = ["editor", "admin"] as const;

export type CreateUserResult = {
  status: "success" | "error";
  message: string;
  invitationId?: string;
};

export async function createUser(
  phone: string,
  name: string,
  role: UserRole
): Promise<CreateUserResult> {
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

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (
    profileError ||
    !profile ||
    !ALLOWED_ROLES.includes(profile.role as (typeof ALLOWED_ROLES)[number])
  ) {
    return {
      status: "error",
      message: "У вас немає прав для створення користувачів.",
    };
  }

  if (!CREATED_ROLES.includes(role as (typeof CREATED_ROLES)[number])) {
    return {
      status: "error",
      message: "Недоступна роль.",
    };
  }

  const normalizedPhone = phone.trim();
  const normalizedName = name.trim();

  if (!normalizedPhone) {
    return {
      status: "error",
      message: "Вкажіть номер телефону.",
    };
  }

  if (!normalizedName) {
    return {
      status: "error",
      message: "Вкажіть ім'я.",
    };
  }

  const { data: invitation, error: invitationError } = await supabaseAdmin
    .from("invitations")
    .insert({
      phone: normalizedPhone,
      name: normalizedName,
      role,
      invited_by: user.id,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
    .select("id")
    .single();

  if (invitationError || !invitation) {
    if (invitationError?.code === "23505") {
      return {
        status: "error",
        message: "Для цього номера вже існує активне запрошення.",
      };
    }

    console.error("Failed to create invitation:", invitationError);

    return {
      status: "error",
      message: "Не вдалося створити запрошення.",
    };
  }

  revalidatePath("/admin/users");

  return {
    status: "success",
    message: "Запрошення успішно створено.",
    invitationId: invitation.id,
  };
}
