"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_ROLES = ["admin", "super_admin"] as const;

export type DeleteMedicineResult = {
  status: "success" | "error";
  message: string;
};

export async function deleteMedicine(
  medicineId: string
): Promise<DeleteMedicineResult> {
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
      message: "У вас немає прав для видалення препаратів.",
    };
  }

  const { data: medicine, error: medicineError } = await supabaseAdmin
    .from("items_medicine")
    .select("id, name")
    .eq("id", medicineId)
    .single();

  if (medicineError || !medicine) {
    return {
      status: "error",
      message: "Препарат не знайдено.",
    };
  }

  const { error: stockError } = await supabaseAdmin
    .from("stock")
    .delete()
    .eq("item_id", medicineId);

  if (stockError) {
    console.error("Failed to delete medicine stock:", stockError);

    return {
      status: "error",
      message: "Не вдалося видалити партії препарату.",
    };
  }

  const { error: deleteError } = await supabaseAdmin
    .from("items_medicine")
    .delete()
    .eq("id", medicineId);

  if (deleteError) {
    console.error("Failed to delete medicine:", deleteError);

    return {
      status: "error",
      message: "Не вдалося видалити препарат.",
    };
  }

  revalidatePath("/");

  return {
    status: "success",
    message: "Препарат успішно видалено.",
  };
}
