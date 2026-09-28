"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type SupplyCreateState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const createSupply = async (
  _previousState: SupplyCreateState,
  formData: FormData
): Promise<SupplyCreateState> => {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 0);
  const unit = String(formData.get("unit") ?? "").trim();
  const minimumQuantity = Number(formData.get("minimum_quantity") ?? 0);
  const comment = String(formData.get("comment") ?? "").trim();

  if (!name) {
    return {
      status: "error",
      message: "Вкажіть назву.",
    };
  }

  if (!categoryId) {
    return {
      status: "error",
      message: "Оберіть категорію.",
    };
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return {
      status: "error",
      message: "Кількість має бути цілим числом більше 0.",
    };
  }

  if (!["piece", "package"].includes(unit)) {
    return {
      status: "error",
      message: "Оберіть одиницю обліку.",
    };
  }

  if (!Number.isInteger(minimumQuantity) || minimumQuantity < 0) {
    return {
      status: "error",
      message: "Мінімальний залишок має бути цілим числом не менше 0.",
    };
  }

  const { error } = await supabase.from("items_supplies").insert({
    name,
    category_id: categoryId,
    quantity,
    unit,
    minimum_quantity: minimumQuantity,
    comment: comment || null,
  });

  if (error) {
    console.error("Failed to create supply:", error);

    return {
      status: "error",
      message: `Помилка Supabase: ${error.message}`,
    };
  }

  revalidatePath("/category/supplies");

  return {
    status: "success",
    message: "Витратний матеріал успішно додано.",
  };
};
