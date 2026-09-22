"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_ROLES = ["editor", "admin", "super_admin"] as const;

export type CreateStockBatchResult = {
  status: "success" | "error";
  message: string;
  stock?: {
    id: string;
    expiry_month: number;
    expiry_year: number;
    quantity: number;
  };
};

export async function createStockBatch(
  itemId: string,
  expiryMonth: number,
  expiryYear: number,
  quantity: number
): Promise<CreateStockBatchResult> {
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

  if (!itemId) {
    return {
      status: "error",
      message: "Не вдалося визначити препарат.",
    };
  }

  if (!Number.isInteger(expiryMonth) || expiryMonth < 1 || expiryMonth > 12) {
    return {
      status: "error",
      message: "Оберіть коректний місяць.",
    };
  }

  if (!Number.isInteger(expiryYear) || expiryYear < 2020) {
    return {
      status: "error",
      message: "Вкажіть коректний рік.",
    };
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return {
      status: "error",
      message: "Кількість має бути більшою за 0.",
    };
  }

  const { data: existingStock, error: existingStockError } = await supabaseAdmin
    .from("stock")
    .select("id, expiry_month, expiry_year, quantity")
    .eq("item_id", itemId)
    .eq("expiry_month", expiryMonth)
    .eq("expiry_year", expiryYear)
    .maybeSingle();

  if (existingStockError) {
    return {
      status: "error",
      message: "Не вдалося перевірити існуючі партії.",
    };
  }

  if (existingStock) {
    const nextQuantity = Number(existingStock.quantity) + quantity;

    const { data: stock, error } = await supabaseAdmin
      .from("stock")
      .update({
        quantity: nextQuantity,
      })
      .eq("id", existingStock.id)
      .select("id, expiry_month, expiry_year, quantity")
      .single();

    if (error || !stock) {
      return {
        status: "error",
        message: "Не вдалося збільшити кількість партії.",
      };
    }

    revalidatePath("/");

    return {
      status: "success",
      message: "Партію оновлено.",
      stock,
    };
  }

  const { data: stock, error } = await supabaseAdmin
    .from("stock")
    .insert({
      item_id: itemId,
      expiry_month: expiryMonth,
      expiry_year: expiryYear,
      quantity,
    })
    .select("id, expiry_month, expiry_year, quantity")
    .single();

  if (error || !stock) {
    return {
      status: "error",
      message: "Не вдалося додати партію.",
    };
  }

  revalidatePath("/");

  return {
    status: "success",
    message: "Партію додано.",
    stock,
  };
}
