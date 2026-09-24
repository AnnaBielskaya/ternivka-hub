"use server";

import { createClient } from "@/lib/supabase/server";

import {
  EQUIPMENT_POWER_OPTIONS,
  EQUIPMENT_STATUS_OPTIONS,
} from "@/features/inventory/equipment/constants";

import type {
  EquipmentCreateState,
  EquipmentPowerSource,
  EquipmentStatus,
} from "../types";

export const createEquipment = async (
  _previousState: EquipmentCreateState,
  formData: FormData
): Promise<EquipmentCreateState> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Користувач не авторизований",
    };
  }

  const name = formData.get("name");
  const status = formData.get("status");
  const powerSource = formData.get("power_source");
  const quantityValue = formData.get("quantity");
  const comment = formData.get("comment");

  if (typeof name !== "string" || !name.trim()) {
    return {
      status: "error",
      message: "Вкажіть назву обладнання",
    };
  }

  if (
    typeof status !== "string" ||
    !EQUIPMENT_STATUS_OPTIONS.some((option) => option.value === status)
  ) {
    return {
      status: "error",
      message: "Оберіть коректний стан обладнання",
    };
  }

  if (
    typeof powerSource !== "string" ||
    !EQUIPMENT_POWER_OPTIONS.some((option) => option.value === powerSource)
  ) {
    return {
      status: "error",
      message: "Оберіть коректний тип живлення",
    };
  }

  const quantity = Number(quantityValue);

  if (!Number.isInteger(quantity) || quantity < 1) {
    return {
      status: "error",
      message: "Кількість повинна бути цілим числом не менше 1",
    };
  }

  const { error } = await supabase.from("items_equipment").insert({
    name: name.trim(),
    status: status as EquipmentStatus,
    power_source: powerSource as EquipmentPowerSource,
    quantity,
    comment:
      typeof comment === "string" && comment.trim() ? comment.trim() : null,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  return {
    status: "success",
    message: "Обладнання успішно додано",
  };
};
