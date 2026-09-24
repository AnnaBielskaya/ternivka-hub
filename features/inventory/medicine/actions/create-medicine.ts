"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import type { MedicineCreateState } from "@/features/inventory/types";

import { createStockBatch } from "./create-stock-batch";

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

export async function createMedicine(
  _previousState: MedicineCreateState,
  formData: FormData
): Promise<MedicineCreateState> {
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
      message: "У вас немає прав для додавання препаратів.",
    };
  }

  const name = normalizeText(formData.get("name"));

  const formId = String(formData.get("form_id") ?? "").trim();

  const purposeId = normalizeText(formData.get("purpose_id"));

  const activeIngredient = normalizeText(formData.get("active_ingredient"));

  const dosage = normalizeText(formData.get("dosage"));

  const volume = normalizeText(formData.get("volume"));

  const description = normalizeText(formData.get("description"));

  const unit = String(formData.get("unit") ?? "").trim();

  const quantity = Number(formData.get("quantity") ?? 0);

  const minimumQuantity = Number(formData.get("minimum_quantity") ?? 0);

  const expiryMonthValue = String(formData.get("expiry_month") ?? "").trim();

  const expiryYearValue = String(formData.get("expiry_year") ?? "").trim();

  const expiryMonth = expiryMonthValue ? Number(expiryMonthValue) : null;

  const expiryYear = expiryYearValue ? Number(expiryYearValue) : null;

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

  if (!Number.isInteger(quantity) || quantity < 0) {
    return {
      status: "error",
      message: "Кількість має бути цілим числом не меншим за 0.",
    };
  }

  if (!Number.isFinite(minimumQuantity) || minimumQuantity < 0) {
    return {
      status: "error",
      message: "Мінімальна кількість має бути не меншою за 0.",
    };
  }

  const hasExpiryMonth = expiryMonth !== null;

  const hasExpiryYear = expiryYear !== null;

  if (hasExpiryMonth !== hasExpiryYear) {
    return {
      status: "error",
      message: "Вкажіть і місяць, і рік терміну придатності.",
    };
  }

  if (expiryMonth !== null && (expiryMonth < 1 || expiryMonth > 12)) {
    return {
      status: "error",
      message: "Некоректний місяць терміну придатності.",
    };
  }

  if (expiryYear !== null && expiryYear < 2020) {
    return {
      status: "error",
      message: "Некоректний рік терміну придатності.",
    };
  }

  if (quantity > 0 && (expiryMonth === null || expiryYear === null)) {
    return {
      status: "error",
      message: "Для кількості більше 0 потрібно вказати термін придатності.",
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
    .limit(1000);

  if (existingItemsError) {
    console.error("Failed to check existing medicines:", existingItemsError);

    return {
      status: "error",
      message: "Не вдалося перевірити існуючі препарати.",
    };
  }

  const normalizedName = normalizeComparable(name);
  const normalizedDosage = normalizeComparable(dosage);
  const normalizedActiveIngredient = normalizeComparable(activeIngredient);
  const normalizedVolume = normalizeComparable(volume);
  const normalizedDescription = normalizeComparable(description);

  const existingMedicine = existingItems?.find((medicine) => {
    return (
      normalizeComparable(medicine.name) === normalizedName &&
      medicine.form_id === formId &&
      medicine.purpose_id === purposeId &&
      normalizeComparable(medicine.dosage) === normalizedDosage &&
      normalizeComparable(medicine.active_ingredient) ===
        normalizedActiveIngredient &&
      normalizeComparable(medicine.volume) === normalizedVolume &&
      medicine.unit === unit &&
      normalizeComparable(medicine.description) === normalizedDescription &&
      Number(medicine.minimum_quantity) === minimumQuantity
    );
  });

  if (existingMedicine) {
    if (quantity > 0 && expiryMonth !== null && expiryYear !== null) {
      const stockResult = await createStockBatch(
        existingMedicine.id,
        expiryMonth,
        expiryYear,
        quantity
      );

      if (stockResult.status === "error") {
        return {
          status: "error",
          message: stockResult.message,
        };
      }
    }

    revalidatePath("/");

    return {
      status: "success",
      message: "Препарат уже існує. Партію додано до нього.",
    };
  }

  const now = new Date().toISOString();

  const { data: medicine, error: medicineError } = await supabase
    .from("items_medicine")
    .insert({
      name,
      form_id: formId,
      purpose_id: purposeId,
      dosage,
      active_ingredient: activeIngredient,
      volume,
      unit,
      description,
      minimum_quantity: minimumQuantity,
      created_by: user.id,
      updated_by: user.id,
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (medicineError || !medicine) {
    console.error("Failed to create medicine:", medicineError);

    return {
      status: "error",
      message: "Не вдалося додати препарат.",
    };
  }

  if (expiryMonth !== null && expiryYear !== null) {
    const { error: stockError } = await supabase.from("stock").insert({
      item_id: medicine.id,
      expiry_month: expiryMonth,
      expiry_year: expiryYear,
      quantity,
    });

    if (stockError) {
      console.error("Failed to create stock:", stockError);

      await supabase.from("items_medicine").delete().eq("id", medicine.id);

      return {
        status: "error",
        message: "Не вдалося додати залишок препарату.",
      };
    }
  }

  revalidatePath("/");

  return {
    status: "success",
    message: "Препарат успішно додано.",
  };
}
