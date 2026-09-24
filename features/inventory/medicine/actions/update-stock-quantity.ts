"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_ROLES = ["editor", "admin", "super_admin"] as const;

export type UpdateStockQuantityResult = {
  status: "success" | "error";
  message: string;
  stock?: {
    id: string;
    expiry_month: number;
    expiry_year: number;
    quantity: number;
  } | null;
};

export async function updateStockQuantity(
  stockId: string,
  quantity: number
): Promise<UpdateStockQuantityResult> {
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
      message: "У вас немає прав для зміни залишку.",
    };
  }

  if (!stockId) {
    return {
      status: "error",
      message: "Не вдалося визначити партію.",
    };
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    return {
      status: "error",
      message: "Кількість має бути цілим числом не меншим за 0.",
    };
  }

  if (quantity === 0) {
    const { error } = await supabase.from("stock").delete().eq("id", stockId);

    if (error) {
      return {
        status: "error",
        message: "Не вдалося видалити партію.",
      };
    }

    revalidatePath("/");

    return {
      status: "success",
      message: "Партію видалено.",
      stock: null,
    };
  }

  const { data: stock, error } = await supabase
    .from("stock")
    .update({
      quantity,
    })
    .eq("id", stockId)
    .select("id, expiry_month, expiry_year, quantity")
    .single();

  if (error || !stock) {
    return {
      status: "error",
      message: "Не вдалося змінити кількість партії.",
    };
  }

  revalidatePath("/");

  return {
    status: "success",
    message: "Кількість оновлено.",
    stock,
  };
}
