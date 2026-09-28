"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export const createEquipment = async (
  previousState: {
    status: "idle" | "success" | "error";
    message: string;
  },
  formData: FormData
) => {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const powerSource = String(formData.get("power_source") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 0);
  const comment = String(formData.get("comment") ?? "").trim();

  if (!name) {
    return {
      status: "error" as const,
      message: "Вкажіть назву.",
    };
  }

  if (!["working", "not_working", "incomplete"].includes(status)) {
    return {
      status: "error" as const,
      message: "Оберіть стан обладнання.",
    };
  }

  if (!["mains", "autonomous", "both"].includes(powerSource)) {
    return {
      status: "error" as const,
      message: "Оберіть джерело живлення.",
    };
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return {
      status: "error" as const,
      message: "Кількість має бути цілим числом більше 0.",
    };
  }

  const { error } = await supabase.from("items_equipment").insert({
    name,
    status,
    power_source: powerSource,
    quantity,
    comment: comment || null,
  });

  if (error) {
    console.error("Failed to create equipment:", error);

    return {
      status: "error" as const,
      message: `Помилка Supabase: ${error.message}`,
    };
  }

  revalidatePath("/category/equipment");

  return {
    status: "success" as const,
    message: "Обладнання успішно додано.",
  };
};
