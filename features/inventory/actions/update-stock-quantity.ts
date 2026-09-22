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
  };
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

  if (!Number.isFinite(quantity) || quantity < 0) {
    return {
      status: "error",
      message: "Кількість не може бути від'ємною.",
    };
  }

  const { data: stock, error: stockError } = await supabaseAdmin
    .from("stock")
    .update({ quantity })
    .eq("id", stockId)
    .select("id, expiry_month, expiry_year, quantity")
    .single();

  if (stockError || !stock) {
    return {
      status: "error",
      message: "Не вдалося змінити кількість.",
    };
  }

  revalidatePath("/");

  return {
    status: "success",
    message: "Кількість успішно змінено.",
    stock,
  };
}
