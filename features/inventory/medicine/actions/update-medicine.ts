"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_ROLES = ["editor", "admin", "super_admin"] as const;

const normalizeText = (value: FormDataEntryValue | null) => {
  const text = String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");

  return text || null;
};

const normalizeComparable = (value: string | null) => {
  return value?.trim().replace(/\s+/g, " ").toLocaleLowerCase("uk-UA") ?? "";
};

export type UpdateMedicineResult = {
  status: "success" | "error";
  message: string;
};

export async function updateMedicine(
  medicineId: string,
  formData: FormData
): Promise<UpdateMedicineResult> {
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
      message: "У вас немає прав для редагування препаратів.",
    };
  }

  if (!medicineId) {
    return {
      status: "error",
      message: "Не вдалося визначити препарат.",
    };
  }

  const name = normalizeText(formData.get("name"));
  const formId = String(formData.get("form_id") ?? "").trim();
  const purposeIdValue = String(formData.get("purpose_id") ?? "").trim();
  const purposeId = purposeIdValue || null;
  const activeIngredient = normalizeText(formData.get("active_ingredient"));
  const dosage = normalizeText(formData.get("dosage"));
  const volume = normalizeText(formData.get("volume"));
  const description = normalizeText(formData.get("description"));
  const unit = String(formData.get("unit") ?? "").trim();
  const minimumQuantity = Number(formData.get("minimum_quantity") ?? 0);

  if (!name) {
    return {
      status: "error",
      message: "Вкажіть назву препарату.",
    };
  }

  if (!formId) {
    return {
      status: "error",
      message: "Оберіть форму випуску.",
    };
  }

  if (!unit) {
    return {
      status: "error",
      message: "Оберіть одиницю обліку.",
    };
  }

  if (!Number.isFinite(minimumQuantity) || minimumQuantity < 0) {
    return {
      status: "error",
      message: "Мінімальна кількість має бути не меншою за 0.",
    };
  }

  const { data: currentMedicine, error: currentMedicineError } =
    await supabaseAdmin
      .from("items_medicine")
      .select(
        `
        id,
        name,
        form_id,
        purpose_id,
        dosage,
        active_ingredient,
        volume,
        unit,
        description,
        minimum_quantity
      `
      )
      .eq("id", medicineId)
      .single();

  if (currentMedicineError || !currentMedicine) {
    return {
      status: "error",
      message: "Препарат не знайдено.",
    };
  }

  const { data: existingItems, error: existingItemsError } = await supabaseAdmin
    .from("items_medicine")
    .select(
      `
        id,
        name,
        form_id,
        purpose_id,
        dosage,
        active_ingredient,
        volume,
        unit,
        description,
        minimum_quantity
      `
    )
    .eq("form_id", formId)
    .neq("id", medicineId)
    .limit(1000);

  if (existingItemsError) {
    return {
      status: "error",
      message: "Не вдалося перевірити існуючі препарати.",
    };
  }

  const duplicate = existingItems?.some((medicine) => {
    return (
      normalizeComparable(medicine.name) === normalizeComparable(name) &&
      medicine.form_id === formId &&
      medicine.purpose_id === purposeId &&
      normalizeComparable(medicine.dosage) === normalizeComparable(dosage) &&
      normalizeComparable(medicine.active_ingredient) ===
        normalizeComparable(activeIngredient) &&
      normalizeComparable(medicine.volume) === normalizeComparable(volume) &&
      medicine.unit === unit &&
      normalizeComparable(medicine.description) ===
        normalizeComparable(description) &&
      Number(medicine.minimum_quantity) === minimumQuantity
    );
  });

  if (duplicate) {
    return {
      status: "error",
      message: "Препарат з такими характеристиками вже існує.",
    };
  }

  const { error } = await supabase
    .from("items_medicine")
    .update({
      name,
      form_id: formId,
      purpose_id: purposeId,
      dosage,
      active_ingredient: activeIngredient,
      volume,
      unit,
      description,
      minimum_quantity: minimumQuantity,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", medicineId);

  if (error) {
    console.error("Failed to update medicine:", error);

    return {
      status: "error",
      message: "Не вдалося оновити препарат.",
    };
  }

  revalidatePath("/");

  return {
    status: "success",
    message: "Препарат успішно оновлено.",
  };
}
