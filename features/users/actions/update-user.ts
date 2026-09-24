"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import type { UserRole } from "../types";

const ALLOWED_ROLES = ["admin", "super_admin"] as const;

const EDITABLE_ROLES = ["editor", "admin"] as const;

export type UpdateUserResult = {
  status: "success" | "error";
  message: string;
};

export async function updateUser(
  userId: string,
  name: string,
  phone: string,
  role: UserRole,
  currentPassword = "",
  newPassword = ""
): Promise<UpdateUserResult> {
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

  const normalizedName = name.trim();

  if (!normalizedName) {
    return {
      status: "error",
      message: "Вкажіть позивний.",
    };
  }

  if (userId === user.id) {
    const hasPasswordChange =
      currentPassword.length > 0 || newPassword.length > 0;

    if (hasPasswordChange && (!currentPassword || !newPassword)) {
      return {
        status: "error",
        message: "Для зміни пароля заповніть поточний і новий пароль.",
      };
    }

    if (hasPasswordChange && newPassword.length < 6) {
      return {
        status: "error",
        message: "Новий пароль має містити щонайменше 6 символів.",
      };
    }

    if (hasPasswordChange) {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
        current_password: currentPassword,
      });

      if (error) {
        return {
          status: "error",
          message: "Не вдалося змінити пароль. Перевірте поточний пароль.",
        };
      }
    }

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        name: normalizedName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      return {
        status: "error",
        message: "Не вдалося оновити профіль.",
      };
    }

    const { error: metadataError } =
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          name: normalizedName,
        },
      });

    if (metadataError) {
      console.error("Failed to update user metadata:", metadataError);
    }

    revalidatePath("/", "layout");
    revalidatePath("/profile");

    return {
      status: "success",
      message: "Профіль оновлено.",
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
      message: "У вас немає прав для редагування користувачів.",
    };
  }

  if (!EDITABLE_ROLES.includes(role as (typeof EDITABLE_ROLES)[number])) {
    return {
      status: "error",
      message: "Недоступна роль.",
    };
  }

  const normalizedPhone = phone.trim();

  if (!normalizedPhone) {
    return {
      status: "error",
      message: "Вкажіть номер телефону.",
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
      message: "Не можна редагувати супер-адміністратора.",
    };
  }

  const { data: existingPhone } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("phone", normalizedPhone)
    .neq("id", userId)
    .maybeSingle();

  if (existingPhone) {
    return {
      status: "error",
      message: "Цей номер телефону вже використовується.",
    };
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({
      name: normalizedName,
      phone: normalizedPhone,
      role,
    })
    .eq("id", userId);

  if (error) {
    return {
      status: "error",
      message: "Не вдалося оновити користувача.",
    };
  }

  const { error: metadataError } =
    await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        name: normalizedName,
      },
    });

  if (metadataError) {
    console.error("Failed to update user metadata:", metadataError);
  }

  revalidatePath("/admin/users");

  return {
    status: "success",
    message: "Користувача оновлено.",
  };
}
