"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import { UserRole } from "../types";

const ALLOWED_ROLES = ["admin", "super_admin"] as const;
const CREATED_ROLES = ["editor", "admin"] as const;

export type CreateUserResult = {
  status: "success" | "error";
  message: string;
};

export async function createUser(
  phone: string,
  name: string,
  role: UserRole
): Promise<CreateUserResult> {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (!currentUser) {
    return {
      status: "error",
      message: "Необхідно авторизуватися.",
    };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", currentUser.id)
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

  if (!phone.trim()) {
    return {
      status: "error",
      message: "Вкажіть номер телефону.",
    };
  }

  if (!name.trim()) {
    return {
      status: "error",
      message: "Вкажіть ім'я.",
    };
  }

  if (!CREATED_ROLES.includes(role as (typeof CREATED_ROLES)[number])) {
    return {
      status: "error",
      message: "Некоректна роль.",
    };
  }

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      phone: phone.trim(),
      phone_confirm: true,
    });

  if (authError || !authData.user) {
    console.error("Failed to create auth user:", authError);

    return {
      status: "error",
      message:
        authError?.message ===
        "A user with this phone number has already been registered"
          ? "Користувач з таким номером телефону вже існує."
          : "Не вдалося створити користувача.",
    };
  }

  const { error: profileCreateError } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: authData.user.id,
      name: name.trim(),
      role,
    });

  if (profileCreateError) {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);

    console.error("Failed to create user profile:", profileCreateError);

    return {
      status: "error",
      message: "Не вдалося створити профіль користувача.",
    };
  }

  return {
    status: "success",
    message: "Користувача успішно створено.",
  };
}
