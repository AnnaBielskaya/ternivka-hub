"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

import type { EquipmentPowerSource, EquipmentStatus } from "../types";

type UpdateEquipmentResult =
  | {
      status: "success";
    }
  | {
      status: "error";
      message: string;
    };

export const updateEquipment = async (
  id: string,
  formData: FormData
): Promise<UpdateEquipmentResult> => {
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  const status = String(formData.get("status") ?? "") as EquipmentStatus;
  const powerSource = String(
    formData.get("power_source") ?? ""
  ) as EquipmentPowerSource;
  const quantity = Number(formData.get("quantity") ?? 0);
  const commentValue = String(formData.get("comment") ?? "").trim();

  if (!name) {
    return {
      status: "error",
      message: "Вкажіть назву обладнання.",
    };
  }

  if (!["working", "not_working", "incomplete"].includes(status)) {
    return {
      status: "error",
      message: "Некоректний статус обладнання.",
    };
  }

  if (!["mains", "autonomous", "both"].includes(powerSource)) {
    return {
      status: "error",
      message: "Некоректне джерело живлення.",
    };
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return {
      status: "error",
      message: "Кількість має бути цілим числом більше 0.",
    };
  }

  const { error } = await supabase
    .from("items_equipment")
    .update({
      name,
      status,
      power_source: powerSource,
      quantity,
      comment: commentValue || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Failed to update equipment:", error);

    return {
      status: "error",
      message: "Не вдалося оновити обладнання.",
    };
  }

  revalidatePath("/category/equipment");

  return {
    status: "success",
  };
};
